'use strict';
/**
 * POST /api/subscribe  - newsletter / offers signup.
 * Upserts the contact in Omnisend with the channels the visitor consented to.
 * NEVER sends a Twilio text: Omnisend owns marketing SMS.
 */
const { reply, guardPost, clean, normalizeEmail, normalizePhone } = require('./_lib');
const { upsertContact } = require('./_omnisend');

module.exports = async (req, res) => {
  const body = guardPost(req, res);
  if (!body) return; // response already sent

  const rawEmail = clean(body.email, 254);
  const rawPhone = clean(body.phone, 40);
  const consentEmail = body.consentEmail === true;
  const consentSms = body.consentSms === true;
  const consentText = clean(body.consentText, 800);
  const source = clean(body.source, 40).toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'website';

  if (!rawEmail && !rawPhone) return reply(res, 400, { ok: false, error: 'contact_required' });

  // A channel is only used when a value is present AND its own consent is true.
  const wantEmail = !!rawEmail && consentEmail;
  const wantSms = !!rawPhone && consentSms;

  const email = wantEmail ? normalizeEmail(rawEmail) : null;
  const phone = wantSms ? normalizePhone(rawPhone) : null;
  if (wantEmail && !email) return reply(res, 400, { ok: false, error: 'invalid_email' });
  if (wantSms && !phone) return reply(res, 400, { ok: false, error: 'invalid_phone' });
  if (!wantEmail && !wantSms) return reply(res, 400, { ok: false, error: 'consent_required' });
  if (!consentText) return reply(res, 400, { ok: false, error: 'consent_required' });

  if (!process.env.OMNISEND_API_KEY) return reply(res, 503, { ok: false, error: 'not_configured' });

  const nowIso = new Date().toISOString();
  const identifiers = [];
  if (email) {
    identifiers.push({ type: 'email', id: email, channels: { email: { status: 'subscribed', statusDate: nowIso } } });
  }
  if (phone) {
    identifiers.push({ type: 'phone', id: phone, channels: { sms: { status: 'subscribed', statusDate: nowIso } } });
  }

  const result = await upsertContact({
    identifiers,
    tags: ['website-signup', 'source:' + source],
    customProperties: {
      signupSource: source,
      consentText,
      consentTimestamp: nowIso,
      consentChannels: [email ? 'email' : null, phone ? 'sms' : null].filter(Boolean).join(','),
    },
  });

  if (!result.ok) return reply(res, 502, { ok: false, error: 'provider_error' });
  return reply(res, 200, { ok: true, email: !!email, sms: !!phone });
};
