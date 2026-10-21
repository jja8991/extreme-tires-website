'use strict';
// Run with: node --test tests/     (Node 22, no dependencies; fetch is mocked)
const test = require('node:test');
const assert = require('node:assert');
const lib = require('../api/_lib');
const subscribe = require('../api/subscribe');
const booking = require('../api/booking');
const health = require('../api/health');

const SECRETS = {
  OMNISEND_API_KEY: 'omni_SECRET_key_12345',
  TWILIO_ACCOUNT_SID: 'ACsecretsid0000000000000000000000',
  TWILIO_AUTH_TOKEN: 'twilio_SECRET_token_999',
  TWILIO_MESSAGING_SERVICE_SID: 'MGsecretsvc00000000000000000000',
};
const ENV_KEYS = [...Object.keys(SECRETS), 'TWILIO_FROM', 'ALLOWED_ORIGIN'];
const realFetch = global.fetch;
let calls;

function setEnv(env) {
  for (const k of ENV_KEYS) delete process.env[k];
  Object.assign(process.env, env || {});
}
/** Mock fetch. handlers: {omnisend: status|fn, twilio: status|fn}. Records every call. */
function mockFetch(handlers) {
  calls = [];
  global.fetch = async (url, opts) => {
    calls.push({ url: String(url), opts });
    const h = String(url).includes('omnisend') ? handlers.omnisend : handlers.twilio;
    const status = typeof h === 'function' ? await h(url, opts) : h || 200;
    return new Response(JSON.stringify(status >= 400 ? { code: 21211, message: 'bad' } : { ok: 1, sid: 'SM1' }), { status });
  };
}
function mkReq(body, extra) {
  return Object.assign({ method: 'POST', headers: { 'x-forwarded-for': '1.1.1.' + Math.floor(Math.random() * 250) }, body, socket: {} }, extra);
}
function mkRes() {
  const r = { statusCode: 0, headers: {}, body: undefined, ended: false };
  r.setHeader = (k, v) => { r.headers[k.toLowerCase()] = v; };
  r.end = (s) => { r.ended = true; r.body = s ? JSON.parse(s) : undefined; };
  return r;
}
async function run(handler, body, extra) {
  const res = mkRes();
  await handler(mkReq(body, extra), res);
  return res;
}
const tw = () => calls.filter((c) => c.url.includes('twilio'));
const om = () => calls.filter((c) => c.url.includes('omnisend'));
const form = (c) => Object.fromEntries(new URLSearchParams(c.opts.body));

test.beforeEach(() => { setEnv({}); lib.resetRateLimit(); mockFetch({}); });
test.after(() => { global.fetch = realFetch; setEnv({}); });

const goodSub = (o) => Object.assign({ email: 'a@b.com', phone: '', consentEmail: true, consentSms: false, consentText: 'I agree to receive marketing emails from Extreme Tires. Unsubscribe anytime.', source: 'footer', website: '' }, o);
const goodBook = (o) => Object.assign({
  source: 'wizard', name: 'Maria Lopez', phone: '(954) 555-0142', email: 'maria@example.com', smsConsent: true,
  consentText: 'By checking this box you agree to receive texts from Extreme Tires about your appointment request and offers.',
  service: 'Tire install', where: 'shop', vehicle: '2019 Honda Civic', zip: '33323', day: 'Fri Jun 12', startISO: '2026-06-12T10:00:00-04:00',
  windowLabel: '10 AM to 12 PM', summary: 'x', website: '',
}, o);

// ---------- helpers ----------
test('phone normalization', () => {
  assert.strictEqual(lib.normalizePhone('954-773-1896'), '+19547731896');
  assert.strictEqual(lib.normalizePhone('(954) 773 1896'), '+19547731896');
  assert.strictEqual(lib.normalizePhone('1 954 773 1896'), '+19547731896');
  assert.strictEqual(lib.normalizePhone('+1 (954) 773-1896'), '+19547731896');
  for (const bad of ['', null, undefined, '12345', '954773189', '+44 20 7946 0958', '0547731896', '1547731896', '9540731896', '29547731896', 'abc']) {
    assert.strictEqual(lib.normalizePhone(bad), null, String(bad));
  }
});
test('email validation', () => {
  assert.strictEqual(lib.normalizeEmail(' A@B.com '), 'a@b.com');
  for (const bad of ['', 'a@b', 'a b@c.com', '@c.com', 'a@@c.com', 'a@c..com', null]) assert.strictEqual(lib.normalizeEmail(bad), null, String(bad));
});
test('redact strips secrets, emails and phones', () => {
  setEnv(SECRETS);
  const s = lib.redact('key ' + SECRETS.OMNISEND_API_KEY + ' to a@b.com +19547731896 tok ' + SECRETS.TWILIO_AUTH_TOKEN);
  assert.ok(!s.includes('SECRET') && !s.includes('a@b.com') && !s.includes('9547731896'), s);
});
test('fetchJson times out via AbortController', async () => {
  global.fetch = (url, opts) => new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(Object.assign(new Error('x'), { name: 'AbortError' }))));
  const r = await lib.fetchJson('https://x.test', {}, 20);
  assert.deepStrictEqual([r.ok, r.status, r.error], [false, 0, 'timeout']);
});

// ---------- guards ----------
test('method guard, OPTIONS, origin, string body, rate limit', async () => {
  setEnv({ OMNISEND_API_KEY: 'k' });
  let r = await run(subscribe, goodSub(), { method: 'GET' });
  assert.strictEqual(r.statusCode, 405);
  r = await run(subscribe, undefined, { method: 'OPTIONS' });
  assert.strictEqual(r.statusCode, 204);
  r = await run(subscribe, JSON.stringify(goodSub()));
  assert.strictEqual(r.statusCode, 200, 'string body parsed');
  r = await run(subscribe, '{nope');
  assert.strictEqual(r.statusCode, 400);
  r = await run(subscribe, goodSub({ consentText: 'x'.repeat(20000) }));
  assert.strictEqual(r.statusCode, 413);

  setEnv({ OMNISEND_API_KEY: 'k', ALLOWED_ORIGIN: 'https://shop.test, https://www.shop.test/' });
  r = await run(subscribe, goodSub(), { headers: { origin: 'https://evil.test', 'x-forwarded-for': '9.9.9.9' } });
  assert.strictEqual(r.statusCode, 403);
  r = await run(subscribe, goodSub(), { headers: { origin: 'https://www.shop.test', 'x-forwarded-for': '9.9.9.9' } });
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(r.headers['access-control-allow-origin'], 'https://www.shop.test');
  r = await run(subscribe, goodSub(), { headers: { 'x-forwarded-for': '9.9.9.9' } }); // no Origin allowed
  assert.strictEqual(r.statusCode, 200);

  lib.resetRateLimit();
  for (let i = 0; i < lib.RATE_LIMIT_MAX; i++) await run(subscribe, goodSub(), { headers: { 'x-forwarded-for': '7.7.7.7' } });
  r = await run(subscribe, goodSub(), { headers: { 'x-forwarded-for': '7.7.7.7' } });
  assert.strictEqual(r.statusCode, 429);
});
test('honeypot returns silent 200 and calls nothing', async () => {
  setEnv(SECRETS);
  for (const h of [subscribe, booking]) {
    const r = await run(h, h === subscribe ? goodSub({ website: 'http://spam' }) : goodBook({ website: 'x' }));
    assert.strictEqual(r.statusCode, 200);
    assert.deepStrictEqual(r.body, { ok: true });
  }
  assert.strictEqual(calls.length, 0);
});

// ---------- subscribe ----------
test('subscribe: consent gating and validation errors', async () => {
  setEnv(SECRETS);
  const cases = [
    [goodSub({ email: '', phone: '' }), 'contact_required'],
    [goodSub({ consentEmail: false }), 'consent_required'],
    [goodSub({ email: '', phone: '9547731896', consentEmail: true, consentSms: false }), 'consent_required'],
    [goodSub({ email: 'bad', consentEmail: true }), 'invalid_email'],
    [goodSub({ email: '', phone: '123', consentSms: true }), 'invalid_phone'],
    [goodSub({ consentText: '' }), 'consent_required'],
  ];
  for (const [b, err] of cases) {
    const r = await run(subscribe, b);
    assert.strictEqual(r.statusCode, 400, err);
    assert.strictEqual(r.body.error, err);
  }
  assert.strictEqual(calls.length, 0, 'nothing sent to any provider');
});
test('subscribe: 503 when Omnisend not configured', async () => {
  const r = await run(subscribe, goodSub());
  assert.strictEqual(r.statusCode, 503);
  assert.strictEqual(r.body.error, 'not_configured');
});
test('subscribe: Omnisend request shape, only consented channels, no Twilio', async () => {
  setEnv(SECRETS);
  const r = await run(subscribe, goodSub({ phone: '954-773-1896', consentSms: false, source: 'Footer Form!' }));
  assert.deepStrictEqual(r.body, { ok: true, email: true, sms: false });
  assert.strictEqual(om().length, 1);
  assert.strictEqual(tw().length, 0);
  const c = om()[0];
  assert.strictEqual(c.url, 'https://api.omnisend.com/v3/contacts');
  assert.strictEqual(c.opts.method, 'POST');
  assert.strictEqual(c.opts.headers['X-API-KEY'], SECRETS.OMNISEND_API_KEY);
  const b = JSON.parse(c.opts.body);
  assert.strictEqual(b.identifiers.length, 1, 'phone without SMS consent is not sent');
  assert.strictEqual(b.identifiers[0].type, 'email');
  assert.strictEqual(b.identifiers[0].channels.email.status, 'subscribed');
  assert.ok(!Number.isNaN(Date.parse(b.identifiers[0].channels.email.statusDate)));
  assert.deepStrictEqual(b.tags, ['website-signup', 'source:footerform']);
  assert.ok(b.customProperties.consentText.includes('marketing emails'));
  assert.ok(b.customProperties.consentTimestamp);
  assert.strictEqual(b.customProperties.signupSource, 'footerform');
});
test('subscribe: both channels', async () => {
  setEnv(SECRETS);
  const r = await run(subscribe, goodSub({ phone: '(954) 773-1896', consentSms: true }));
  assert.deepStrictEqual(r.body, { ok: true, email: true, sms: true });
  const b = JSON.parse(om()[0].opts.body);
  const p = b.identifiers.find((i) => i.type === 'phone');
  assert.strictEqual(p.id, '+19547731896');
  assert.strictEqual(p.channels.sms.status, 'subscribed');
});
test('subscribe: provider failure -> 502, no secrets in response', async () => {
  setEnv(SECRETS);
  mockFetch({ omnisend: 500 });
  const r = await run(subscribe, goodSub());
  assert.strictEqual(r.statusCode, 502);
  assert.ok(!JSON.stringify(r.body).includes('SECRET'));
});

// ---------- booking ----------
test('booking: validation', async () => {
  setEnv(SECRETS);
  const cases = [
    [goodBook({ name: '' }), 'name_required'],
    [goodBook({ name: 'x'.repeat(81) }), 'name_too_long'],
    [goodBook({ phone: '' }), 'phone_required'],
    [goodBook({ phone: '555' }), 'invalid_phone'],
    [goodBook({ email: 'nope' }), 'invalid_email'],
    [goodBook({ source: 'zzz' }), 'invalid_source'],
    [goodBook({ consentText: '' }), 'consent_required'],
  ];
  for (const [b, err] of cases) {
    const r = await run(booking, b);
    assert.strictEqual(r.statusCode, 400, err);
    assert.strictEqual(r.body.error, err);
  }
  assert.strictEqual(calls.length, 0);
});
test('booking: 503 when nothing configured; Twilio sender missing counts as unconfigured', async () => {
  let r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 503);
  setEnv({ TWILIO_ACCOUNT_SID: 'AC1', TWILIO_AUTH_TOKEN: 't' }); // no sender
  r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 503);
});

test('booking: full flow shapes (Omnisend + confirmation + scheduled reminder)', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-06-10T12:00:00Z') });
  setEnv(SECRETS);
  const r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 200);
  assert.deepStrictEqual([r.body.ok, r.body.omnisend, r.body.confirmationSms, r.body.reminderScheduled], [true, true, true, true]);

  // Omnisend
  const ob = JSON.parse(om()[0].opts.body);
  assert.strictEqual(om()[0].opts.headers['X-API-KEY'], SECRETS.OMNISEND_API_KEY);
  assert.deepStrictEqual(ob.tags, ['booking-request']);
  assert.strictEqual(ob.firstName, 'Maria');
  assert.strictEqual(ob.lastName, 'Lopez');
  const em = ob.identifiers.find((i) => i.type === 'email');
  assert.strictEqual(em.channels.email.status, 'nonSubscribed', 'booking never subscribes email');
  const ph = ob.identifiers.find((i) => i.type === 'phone');
  assert.strictEqual(ph.id, '+19545550142');
  assert.strictEqual(ph.channels.sms.status, 'subscribed');
  assert.strictEqual(ob.customProperties.bookingService, 'Tire install');
  assert.strictEqual(ob.customProperties.bookingWhere, 'shop');
  assert.strictEqual(ob.customProperties.bookingZip, '33323');
  assert.strictEqual(ob.customProperties.bookingDay, 'Fri Jun 12');
  assert.ok(ob.customProperties.smsConsentText && ob.customProperties.smsConsentTimestamp);

  // Twilio
  assert.strictEqual(tw().length, 2);
  const auth = 'Basic ' + Buffer.from(SECRETS.TWILIO_ACCOUNT_SID + ':' + SECRETS.TWILIO_AUTH_TOKEN).toString('base64');
  for (const c of tw()) {
    assert.strictEqual(c.url, 'https://api.twilio.com/2010-04-01/Accounts/' + SECRETS.TWILIO_ACCOUNT_SID + '/Messages.json');
    assert.strictEqual(c.opts.headers.Authorization, auth);
    assert.strictEqual(c.opts.headers['Content-Type'], 'application/x-www-form-urlencoded');
    assert.strictEqual(form(c).To, '+19545550142');
    assert.strictEqual(form(c).MessagingServiceSid, SECRETS.TWILIO_MESSAGING_SERVICE_SID);
    assert.strictEqual(form(c).From, undefined);
  }
  const conf = tw().find((c) => !form(c).ScheduleType);
  const rem = tw().find((c) => form(c).ScheduleType);
  assert.ok(form(conf).Body.startsWith('Extreme Tires: Hi Maria, we got your request for Fri Jun 12 10 AM to 12 PM. '));
  assert.ok(form(conf).Body.includes("We'll text to confirm") && form(conf).Body.includes('Reply STOP'));
  assert.ok(!/confirmed|\$/.test(form(conf).Body));
  assert.ok(/^[\x20-\x7e]+$/.test(form(conf).Body), 'GSM-safe');
  assert.strictEqual(form(rem).ScheduleType, 'fixed');
  assert.strictEqual(form(rem).SendAt, '2026-06-12T12:00:00Z'); // 8:00 AM EDT
  assert.ok(form(rem).Body.includes('appointment is coming up') && !/confirmed/.test(form(rem).Body));
  assert.strictEqual(r.body.reasons.reminder, 'ok');
});

test('booking: no SMS and no SMS subscribe without consent', async () => {
  setEnv(SECRETS);
  const r = await run(booking, goodBook({ smsConsent: false, consentText: '' }));
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(tw().length, 0);
  assert.strictEqual(r.body.confirmationSms, false);
  assert.strictEqual(r.body.reasons.confirmationSms, 'no_consent');
  assert.strictEqual(r.body.reasons.reminder, 'no_consent');
  const ob = JSON.parse(om()[0].opts.body);
  assert.strictEqual(ob.identifiers.find((i) => i.type === 'phone').channels.sms.status, 'nonSubscribed');
  assert.ok(!ob.customProperties.smsConsentText);
});
test('booking: Twilio-only config with consent', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-06-10T12:00:00Z') });
  setEnv({ TWILIO_ACCOUNT_SID: SECRETS.TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN: SECRETS.TWILIO_AUTH_TOKEN, TWILIO_FROM: '+19545550123' });
  const r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(om().length, 0);
  assert.strictEqual(tw().length, 1, 'FROM fallback: immediate only');
  assert.strictEqual(form(tw()[0]).From, '+19545550123');
  assert.strictEqual(form(tw()[0]).MessagingServiceSid, undefined);
  assert.strictEqual(r.body.reasons.reminder, 'no_messaging_service');
  assert.strictEqual(r.body.reasons.omnisend, 'not_configured');
});
test('booking: Omnisend-only config is fine', async () => {
  setEnv({ OMNISEND_API_KEY: 'k' });
  const r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 200);
  assert.deepStrictEqual([r.body.omnisend, r.body.confirmationSms], [true, false]);
  assert.strictEqual(r.body.reasons.confirmationSms, 'not_configured');
});

test('booking: failure isolation', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-06-10T12:00:00Z') });
  setEnv(SECRETS);
  mockFetch({ omnisend: 500 });
  let r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 200);
  assert.deepStrictEqual([r.body.omnisend, r.body.confirmationSms, r.body.reminderScheduled], [false, true, true]);
  assert.strictEqual(r.body.reasons.omnisend, 'provider_error');

  mockFetch({ twilio: 500 });
  r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 200);
  assert.deepStrictEqual([r.body.omnisend, r.body.confirmationSms, r.body.reminderScheduled], [true, false, false]);

  // only the scheduled reminder fails; confirmation still reported
  mockFetch({ twilio: (u, o) => (new URLSearchParams(o.body).get('ScheduleType') ? 400 : 201) });
  r = await run(booking, goodBook());
  assert.deepStrictEqual([r.body.omnisend, r.body.confirmationSms, r.body.reminderScheduled], [true, true, false]);

  mockFetch({ omnisend: 500, twilio: 500 });
  r = await run(booking, goodBook());
  assert.strictEqual(r.statusCode, 502);
  assert.strictEqual(r.body.ok, false);
});
test('booking: network error / thrown fetch is isolated', async () => {
  setEnv(SECRETS);
  global.fetch = async (url) => { if (String(url).includes('omnisend')) throw new Error('boom ' + SECRETS.OMNISEND_API_KEY); return new Response('{}', { status: 201 }); };
  const r = await run(booking, goodBook({ startISO: '' }));
  assert.strictEqual(r.statusCode, 200);
  assert.deepStrictEqual([r.body.omnisend, r.body.confirmationSms], [false, true]);
});

test('booking: reminder skipped when too close or too far or invalid', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-06-10T12:00:00Z') });
  setEnv(SECRETS);
  const cases = [
    ['2026-06-10T10:00:00-04:00', 'too_soon'], // 14:00Z = 2h away
    ['2026-06-10T10:29:00-04:00', 'too_soon'], // 2h29m
    ['2026-08-01T10:00:00-04:00', 'too_far'], // > 35 days
    ['tomorrow at 10', 'invalid_start'],
    ['2026-06-12T10:00:00', 'invalid_start'], // no offset
    ['', 'no_start_time'],
  ];
  for (const [s, reason] of cases) {
    mockFetch({});
    const r = await run(booking, goodBook({ startISO: s }));
    assert.strictEqual(r.body.reminderScheduled, false, s);
    assert.strictEqual(r.body.reasons.reminder, reason, s);
    assert.strictEqual(r.body.confirmationSms, true);
    assert.strictEqual(tw().length, 1, 'only the immediate text: ' + s);
  }
  // exactly 2h30m is allowed: 12:00Z now, start 14:30Z (10:30 EDT) -> target 8:30 EDT
  mockFetch({});
  const r = await run(booking, goodBook({ startISO: '2026-06-10T10:30:00-04:00' }));
  assert.strictEqual(r.body.reminderScheduled, true);
  assert.strictEqual(form(tw().find((c) => form(c).ScheduleType)).SendAt, '2026-06-10T12:30:00Z');
});

// ---------- quiet hours / DST ----------
const NOW = Date.parse('2026-01-05T15:00:00Z');
const send = (iso, now) => booking.computeReminderSendTime(iso, now || NOW);
test('quiet hours: unchanged inside the window', () => {
  const r = send('2026-06-12T14:00:00-04:00', Date.parse('2026-06-10T12:00:00Z')); // target 12:00 EDT
  assert.strictEqual(r.sendAtISO, '2026-06-12T16:00:00Z');
  assert.strictEqual(r.clamped, false);
});
test('quiet hours: boundaries 8:00 and 20:00 are allowed', () => {
  const now = Date.parse('2026-06-10T12:00:00Z');
  assert.strictEqual(send('2026-06-12T10:00:00-04:00', now).sendAtISO, '2026-06-12T12:00:00Z'); // 8:00 exactly
  assert.strictEqual(send('2026-06-12T22:00:00-04:00', now).sendAtISO, '2026-06-13T00:00:00Z'); // 20:00 exactly
  assert.strictEqual(send('2026-06-12T22:00:00-04:00', now).clamped, false);
});
test('quiet hours: late target clamps to 8 PM same day', () => {
  const r = send('2026-06-12T23:30:00-04:00', Date.parse('2026-06-10T12:00:00Z')); // target 21:30
  assert.strictEqual(r.sendAtISO, '2026-06-13T00:00:00Z');
  assert.strictEqual(r.clamped, true);
});
test('quiet hours: early target clamps to 8 AM when still before start', () => {
  const r = send('2026-06-12T09:00:00-04:00', Date.parse('2026-06-10T12:00:00Z')); // target 7:00
  assert.strictEqual(r.sendAtISO, '2026-06-12T12:00:00Z');
});
test('quiet hours: very early start falls back to 8 PM the day before', () => {
  const r = send('2026-06-12T07:00:00-04:00', Date.parse('2026-06-10T12:00:00Z')); // target 5:00, 8:00 is after start
  assert.strictEqual(r.sendAtISO, '2026-06-12T00:00:00Z'); // Jun 11 8 PM EDT
});
test('DST fall-back (Nov 1 2026): 8 AM is EST (UTC-5)', () => {
  const now = Date.parse('2026-10-30T12:00:00Z');
  let r = send('2026-11-01T09:00:00-05:00', now); // target 7:00 EST -> 8:00 EST = 13:00Z (EDT math would give 12:00Z)
  assert.strictEqual(r.sendAtISO, '2026-11-01T13:00:00Z');
  r = send('2026-11-01T23:30:00-05:00', now); // target 21:30 EST -> 20:00 EST = 01:00Z Nov 2
  assert.strictEqual(r.sendAtISO, '2026-11-02T01:00:00Z');
  // previous-day 8 PM is still EDT (UTC-4): Oct 31 20:00 EDT = Nov 1 00:00Z
  r = send('2026-11-01T06:00:00-04:00', now); // 06:00 EDT == 05:00 EST; target ~4:00 -> 8 AM too late -> Oct 31 8 PM EDT
  assert.strictEqual(r.sendAtISO, '2026-11-01T00:00:00Z');
});
test('DST spring-forward (Mar 8 2026): 8 AM is EDT (UTC-4)', () => {
  const now = Date.parse('2026-03-06T12:00:00Z');
  let r = send('2026-03-08T09:30:00-04:00', now); // target 7:30 EDT -> 8:00 EDT = 12:00Z (EST math would give 13:00Z)
  assert.strictEqual(r.sendAtISO, '2026-03-08T12:00:00Z');
  r = send('2026-03-08T22:30:00-04:00', now); // target 20:30 -> 20:00 EDT = 00:00Z Mar 9
  assert.strictEqual(r.sendAtISO, '2026-03-09T00:00:00Z');
  // day before is EST: Mar 7 20:00 EST = Mar 8 01:00Z
  r = send('2026-03-08T07:00:00-04:00', now);
  assert.strictEqual(r.sendAtISO, '2026-03-08T01:00:00Z');
  // an unadjusted target straddling the transition (2 AM gap day) keeps true 2h offset
  r = send('2026-03-08T12:00:00-04:00', now); // target 10:00 EDT
  assert.strictEqual(r.sendAtISO, '2026-03-08T14:00:00Z');
});
test('send time never lands outside 8-20 NY or after start (sweep across both DST days)', () => {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hourCycle: 'h23', hour: '2-digit', minute: '2-digit' });
  for (const [base, now] of [['2026-03-08T00:00:00Z', '2026-03-01T00:00:00Z'], ['2026-11-01T00:00:00Z', '2026-10-25T00:00:00Z']]) {
    for (let m = 0; m < 72 * 60; m += 15) {
      const startMs = Date.parse(base) + m * 60000;
      const r = booking.computeReminderSendTime(new Date(startMs).toISOString(), Date.parse(now));
      assert.ok(r.ok, new Date(startMs).toISOString());
      assert.ok(r.sendAt.getTime() < startMs);
      const [h, mi] = fmt.format(r.sendAt).split(':').map(Number);
      assert.ok(h * 60 + mi >= 480 && h * 60 + mi <= 1200, 'quiet hours ' + r.sendAtISO);
    }
  }
});
test('no allowed time when 8 PM would be under 15 minutes away', () => {
  // now 19:50 EDT Jun 10; start 07:00 EDT Jun 11 -> only allowed slot is tonight 20:00 (10 min away)
  const r = send('2026-06-11T07:00:00-04:00', Date.parse('2026-06-10T23:50:00Z'));
  assert.deepStrictEqual(r, { ok: false, reason: 'no_allowed_send_time' });
});
test('message text helpers are GSM-safe and price-free', () => {
  const t = booking.buildConfirmationText('Zoë “Z”', 'Fri – Jun 12', '10 AM to 12 PM');
  assert.ok(/^[\x20-\x7e]+$/.test(t), t);
  assert.ok(t.length <= 200, 'length ' + t.length); // spec wording is ~2 SMS segments (GSM-7: 153 chars each when concatenated)
  assert.ok(!t.includes('$'));
  assert.ok(booking.buildReminderText('', '').includes('your appointment is coming up'));
});

// ---------- health ----------
test('health: booleans only, GET only', async () => {
  let r = await run(health, undefined, { method: 'GET' });
  assert.deepStrictEqual(r.body, { ok: true, omnisend: false, twilioSend: false, twilioScheduling: false });
  setEnv(SECRETS);
  r = await run(health, undefined, { method: 'GET' });
  assert.deepStrictEqual(r.body, { ok: true, omnisend: true, twilioSend: true, twilioScheduling: true });
  setEnv({ TWILIO_ACCOUNT_SID: 'AC1', TWILIO_AUTH_TOKEN: 't', TWILIO_FROM: '+19545550123' });
  r = await run(health, undefined, { method: 'GET' });
  assert.deepStrictEqual([r.body.twilioSend, r.body.twilioScheduling], [true, false]);
  r = await run(health, undefined, { method: 'POST' });
  assert.strictEqual(r.statusCode, 405);
});

// ---------- secrets ----------
test('secrets never appear in any response or log output', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-06-10T12:00:00Z') });
  setEnv(Object.assign({ TWILIO_FROM: '+19545550123' }, SECRETS));
  const logs = [];
  const orig = console.error;
  console.error = (...a) => logs.push(a.join(' '));
  try {
    const outs = [];
    outs.push(await run(booking, goodBook()));
    mockFetch({ omnisend: 500, twilio: 500 });
    outs.push(await run(booking, goodBook()));
    outs.push(await run(subscribe, goodSub()));
    outs.push(await run(health, undefined, { method: 'GET' }));
    const blob = JSON.stringify(outs.map((o) => [o.body, o.headers])) + logs.join('\n');
    for (const v of [...Object.values(SECRETS), '+19545550123']) assert.ok(!blob.includes(v), 'leaked ' + v);
    assert.ok(!blob.includes('9545550142') && !blob.includes('maria@example.com'), 'PII in logs');
    assert.ok(logs.length > 0, 'failures were logged (redacted)');
  } finally {
    console.error = orig;
  }
});
