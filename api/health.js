'use strict';
/** GET /api/health - which integrations are configured. Booleans only, never values. */
const { reply } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  const e = process.env;
  const twilioBase = !!(e.TWILIO_ACCOUNT_SID && e.TWILIO_AUTH_TOKEN);
  return reply(res, 200, {
    ok: true,
    omnisend: !!e.OMNISEND_API_KEY,
    twilioSend: twilioBase && !!(e.TWILIO_MESSAGING_SERVICE_SID || e.TWILIO_FROM),
    twilioScheduling: twilioBase && !!e.TWILIO_MESSAGING_SERVICE_SID,
  });
};
