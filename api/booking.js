'use strict';
/**
 * POST /api/booking - appointment REQUEST (not a confirmed booking).
 * Three independent, failure-isolated actions:
 *   a) Omnisend contact upsert (tag booking-request)
 *   b) immediate Twilio "request received" SMS (only with SMS consent)
 *   c) Twilio scheduled reminder, quiet-hours clamped (only with SMS consent)
 * Omnisend = marketing, Twilio = transactional. No prices in any text.
 */
const { reply, guardPost, clean, normalizeEmail, normalizePhone, fetchJson, twilioAuthHeader, logFailure } = require('./_lib');
const { upsertContact } = require('./_omnisend');

const SHOP_PHONE = '(954) 773-1896';
const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;
const MIN_LEAD_MS = 2.5 * HOUR; // appointment must be at least 2h30m away
const REMINDER_BEFORE_MS = 2 * HOUR;
const TWILIO_MIN_SCHEDULE_MS = 15 * MIN + MIN; // Twilio minimum is 15 min; keep 1 min margin
const TWILIO_MAX_SCHEDULE_MS = 35 * 24 * HOUR - MIN; // Twilio maximum is 35 days
const QUIET_START_HOUR = 8; // no reminders before 8:00 AM Eastern
const QUIET_END_HOUR = 20; // none after 8:00 PM Eastern
const TZ = 'America/New_York';

// ---------------------------------------------------------------------------
// Time helpers (America/New_York via Intl, DST-correct, no libraries)
// ---------------------------------------------------------------------------

const nyFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Wall-clock parts in New York for a UTC millisecond instant. */
function nyParts(ms) {
  const o = {};
  for (const p of nyFmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, hour: +o.hour % 24, minute: +o.minute, second: +o.second };
}

/** UTC ms for a New York wall-clock time (hour:00:00). Iterates to absorb the DST offset. */
function nyLocalToUtc(y, m, d, hour) {
  const wanted = Date.UTC(y, m - 1, d, hour, 0, 0);
  let guess = wanted;
  for (let i = 0; i < 4; i++) {
    const p = nyParts(guess);
    const offset = Date.UTC(p.y, p.m - 1, p.d, p.hour, p.minute, p.second) - guess; // local minus UTC
    const next = wanted - offset;
    if (next === guess) break;
    guess = next;
  }
  return guess;
}

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

/** Parse an ISO-8601 string that MUST carry an offset or Z. Returns ms or NaN. */
function parseStartISO(s) {
  if (typeof s !== 'string' || !ISO_WITH_OFFSET.test(s)) return NaN;
  return Date.parse(s);
}

/**
 * Compute when to send the reminder.
 * Target = 2h before start, clamped into 8:00 AM - 8:00 PM New York time:
 *   - after 8 PM  -> 8:00 PM same day
 *   - before 8 AM -> 8:00 AM same day if that is still before start, else 8:00 PM the day before
 * Then Twilio limits apply (15 min .. 35 days ahead).
 * @returns {{ok:true,sendAt:Date,sendAtISO:string,clamped:boolean}|{ok:false,reason:string}}
 */
function computeReminderSendTime(startISO, nowMs) {
  const now = typeof nowMs === 'number' ? nowMs : Date.now();
  const start = parseStartISO(startISO);
  if (Number.isNaN(start)) return { ok: false, reason: 'invalid_start' };
  if (start - now < MIN_LEAD_MS) return { ok: false, reason: 'too_soon' };

  const target = start - REMINDER_BEFORE_MS;
  const p = nyParts(target);
  const minutes = p.hour * 60 + p.minute + p.second / 60;
  let sendMs = target;
  let clamped = false;

  if (minutes < QUIET_START_HOUR * 60) {
    clamped = true;
    sendMs = nyLocalToUtc(p.y, p.m, p.d, QUIET_START_HOUR);
    if (sendMs >= start) {
      const prev = new Date(Date.UTC(p.y, p.m - 1, p.d - 1));
      sendMs = nyLocalToUtc(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate(), QUIET_END_HOUR);
    }
  } else if (minutes > QUIET_END_HOUR * 60) {
    clamped = true;
    sendMs = nyLocalToUtc(p.y, p.m, p.d, QUIET_END_HOUR);
  }

  if (sendMs >= start) return { ok: false, reason: 'no_allowed_send_time' };
  if (sendMs - now < TWILIO_MIN_SCHEDULE_MS) return { ok: false, reason: 'no_allowed_send_time' };
  if (sendMs - now > TWILIO_MAX_SCHEDULE_MS) return { ok: false, reason: 'too_far' };

  const sendAt = new Date(sendMs);
  return { ok: true, sendAt, sendAtISO: sendAt.toISOString().replace(/\.\d{3}Z$/, 'Z'), clamped };
}

// ---------------------------------------------------------------------------
// Message text (GSM-7 only, no prices, never says "confirmed")
// ---------------------------------------------------------------------------

/** Replace smart punctuation, then drop anything outside printable ASCII. */
function gsm(s) {
  return String(s || '')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/ /g, ' ')
    .replace(/[^\x20-\x7e]/g, '')
    .replace(/[\^{}\\[\]~|]/g, '') // extension-table chars cost 2 septets; drop them
    .replace(/\s+/g, ' ')
    .trim();
}

function whenPhrase(day, windowLabel) {
  return [gsm(day), gsm(windowLabel)].filter(Boolean).join(' ');
}

function buildConfirmationText(firstName, day, windowLabel) {
  const name = gsm(firstName).replace(/[^A-Za-z' -]/g, '').slice(0, 20).trim();
  const when = whenPhrase(day, windowLabel);
  return (
    'Extreme Tires: Hi' + (name ? ' ' + name : '') + ', we got your request' + (when ? ' for ' + when : '') +
    ". We'll text to confirm. Questions? Call " + SHOP_PHONE + '. Msg&data rates may apply. Reply STOP to opt out.'
  );
}

function buildReminderText(day, windowLabel) {
  const when = whenPhrase(day, windowLabel);
  return (
    'Extreme Tires reminder: your ' + (when ? when + ' ' : '') + 'appointment is coming up. Need to change it? Call ' +
    SHOP_PHONE + '. Reply STOP to opt out.'
  );
}

// ---------------------------------------------------------------------------
// Twilio
// ---------------------------------------------------------------------------

function twilioConfig() {
  const e = process.env;
  const ok = !!(e.TWILIO_ACCOUNT_SID && e.TWILIO_AUTH_TOKEN);
  return {
    canSend: ok && !!(e.TWILIO_MESSAGING_SERVICE_SID || e.TWILIO_FROM),
    canSchedule: ok && !!e.TWILIO_MESSAGING_SERVICE_SID,
  };
}

/** POST one message to Twilio's Messages API (form-encoded). `extra` adds schedule params. */
async function twilioSend(to, text, extra) {
  const e = process.env;
  const form = new URLSearchParams();
  form.set('To', to);
  form.set('Body', text);
  if (e.TWILIO_MESSAGING_SERVICE_SID) form.set('MessagingServiceSid', e.TWILIO_MESSAGING_SERVICE_SID);
  else form.set('From', e.TWILIO_FROM);
  for (const k of Object.keys(extra || {})) form.set(k, extra[k]);
  const url = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(e.TWILIO_ACCOUNT_SID) + '/Messages.json';
  const r = await fetchJson(url, {
    method: 'POST',
    headers: {
      Authorization: twilioAuthHeader(e.TWILIO_ACCOUNT_SID, e.TWILIO_AUTH_TOKEN),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: form.toString(),
  });
  if (!r.ok) {
    logFailure('twilio', 'send failed status=' + r.status + (r.data && r.data.code ? ' code=' + r.data.code : '') + (r.error ? ' ' + r.error : ''));
  }
  return r.ok;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

module.exports = async (req, res) => {
  const body = guardPost(req, res);
  if (!body) return;

  const source = clean(body.source, 20).toLowerCase();
  if (!['wizard', 'schedule', 'quote'].includes(source)) return reply(res, 400, { ok: false, error: 'invalid_source' });

  const name = clean(body.name, 200);
  if (!name) return reply(res, 400, { ok: false, error: 'name_required' });
  if (name.length > 80) return reply(res, 400, { ok: false, error: 'name_too_long' });

  if (!clean(body.phone, 40)) return reply(res, 400, { ok: false, error: 'phone_required' });
  const phone = normalizePhone(body.phone);
  if (!phone) return reply(res, 400, { ok: false, error: 'invalid_phone' });

  const rawEmail = clean(body.email, 254);
  const email = rawEmail ? normalizeEmail(rawEmail) : null;
  if (rawEmail && !email) return reply(res, 400, { ok: false, error: 'invalid_email' });

  const where = clean(body.where, 10).toLowerCase();
  if (where && !['mobile', 'shop'].includes(where)) return reply(res, 400, { ok: false, error: 'invalid_where' });

  const smsConsent = body.smsConsent === true;
  const consentText = clean(body.consentText, 800);
  if (smsConsent && !consentText) return reply(res, 400, { ok: false, error: 'consent_required' });

  const hasOmnisend = !!process.env.OMNISEND_API_KEY;
  const tw = twilioConfig();
  if (!hasOmnisend && !tw.canSend) return reply(res, 503, { ok: false, error: 'not_configured' });

  const service = clean(body.service, 120);
  const vehicle = clean(body.vehicle, 120);
  const zip = clean(body.zip, 10);
  const day = clean(body.day, 40);
  const windowLabel = clean(body.windowLabel, 40);
  const summary = clean(body.summary, 600);
  const startISO = clean(body.startISO, 40);
  const parts = name.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  const nowIso = new Date().toISOString();

  const reasons = {};
  const out = { omnisend: false, confirmationSms: false, reminderScheduled: false };
  let attempted = 0;
  let succeeded = 0;

  // a) Omnisend (isolated). Booking never subscribes email; phone subscribes to SMS only with consent.
  async function doOmnisend() {
    if (!hasOmnisend) { reasons.omnisend = 'not_configured'; return; }
    attempted++;
    const identifiers = [];
    if (email) identifiers.push({ type: 'email', id: email, channels: { email: { status: 'nonSubscribed', statusDate: nowIso } } });
    identifiers.push({
      type: 'phone',
      id: phone,
      channels: { sms: { status: smsConsent ? 'subscribed' : 'nonSubscribed', statusDate: nowIso } },
    });
    const customProperties = {
      bookingSource: source,
      bookingService: service,
      bookingVehicle: vehicle,
      bookingWhere: where,
      bookingZip: zip,
      bookingDay: day,
      bookingWindow: windowLabel,
      bookingSummary: summary,
      bookingRequestedAt: nowIso,
    };
    if (smsConsent) {
      customProperties.smsConsentText = consentText;
      customProperties.smsConsentTimestamp = nowIso;
    }
    for (const k of Object.keys(customProperties)) if (!customProperties[k]) delete customProperties[k];
    try {
      const r = await upsertContact({ firstName, lastName: lastName || undefined, identifiers, tags: ['booking-request'], customProperties });
      out.omnisend = r.ok;
      reasons.omnisend = r.ok ? 'ok' : 'provider_error';
    } catch (e) {
      reasons.omnisend = 'provider_error';
    }
    if (out.omnisend) succeeded++;
  }

  // b) Immediate Twilio confirmation (isolated)
  async function doConfirmation() {
    if (!smsConsent) { reasons.confirmationSms = 'no_consent'; return; }
    if (!tw.canSend) { reasons.confirmationSms = 'not_configured'; return; }
    attempted++;
    try {
      out.confirmationSms = await twilioSend(phone, buildConfirmationText(firstName, day, windowLabel));
      reasons.confirmationSms = out.confirmationSms ? 'ok' : 'provider_error';
    } catch (e) {
      reasons.confirmationSms = 'provider_error';
    }
    if (out.confirmationSms) succeeded++;
  }

  // c) Scheduled Twilio reminder (isolated)
  async function doReminder() {
    if (!smsConsent) { reasons.reminder = 'no_consent'; return; }
    if (!startISO) { reasons.reminder = 'no_start_time'; return; }
    if (!tw.canSchedule) { reasons.reminder = process.env.TWILIO_MESSAGING_SERVICE_SID ? 'not_configured' : 'no_messaging_service'; return; }
    const plan = computeReminderSendTime(startISO, Date.now());
    if (!plan.ok) { reasons.reminder = plan.reason; return; }
    attempted++;
    try {
      out.reminderScheduled = await twilioSend(phone, buildReminderText(day, windowLabel), { ScheduleType: 'fixed', SendAt: plan.sendAtISO });
      reasons.reminder = out.reminderScheduled ? (plan.clamped ? 'ok_quiet_hours_adjusted' : 'ok') : 'provider_error';
    } catch (e) {
      reasons.reminder = 'provider_error';
    }
    if (out.reminderScheduled) succeeded++;
  }

  await Promise.all([doOmnisend(), doConfirmation(), doReminder()]);

  // Everything we tried failed: tell the caller so it can fall back.
  if (attempted > 0 && succeeded === 0) {
    return reply(res, 502, Object.assign({ ok: false, error: 'provider_error' }, out, { reasons }));
  }
  return reply(res, 200, Object.assign({ ok: true }, out, { reasons }));
};

module.exports.computeReminderSendTime = computeReminderSendTime;
module.exports.buildConfirmationText = buildConfirmationText;
module.exports.buildReminderText = buildReminderText;
module.exports.nyLocalToUtc = nyLocalToUtc;
