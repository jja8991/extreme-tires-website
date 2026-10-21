'use strict';
/**
 * Shared helpers for the Extreme Tires serverless functions.
 * File name starts with "_" so Vercel does NOT expose it as a route.
 * Zero dependencies. Node 22 (global fetch / AbortController / Intl).
 *
 * Secrets are read only from process.env, never logged, never returned.
 */

const MAX_BODY_CHARS = 16 * 1024; // sanity cap for JSON bodies
const RATE_LIMIT_MAX = 8; // requests ...
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes per IP

// ---------------------------------------------------------------------------
// Replies
// ---------------------------------------------------------------------------

/** Send a JSON reply. Never cached. */
function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// ---------------------------------------------------------------------------
// Origin check
// ---------------------------------------------------------------------------

function normalizeOrigin(o) {
  return String(o || '').trim().replace(/\/+$/, '').toLowerCase();
}

/**
 * Requests with no Origin header (curl, server-to-server, some same-origin
 * navigations) are allowed. If ALLOWED_ORIGIN is set (comma-separated list)
 * a request that DOES carry an Origin must match one entry. If it is not set
 * everything is allowed. Origin is advisory, not real security: the honeypot,
 * rate limit and consent checks are the actual defenses.
 */
function originAllowed(req) {
  const origin = req.headers && req.headers.origin;
  if (!origin) return true;
  const configured = process.env.ALLOWED_ORIGIN;
  if (!configured) return true;
  const list = configured.split(',').map(normalizeOrigin).filter(Boolean);
  if (!list.length) return true;
  return list.includes(normalizeOrigin(origin));
}

// ---------------------------------------------------------------------------
// Rate limit (best effort: memory is per warm serverless instance)
// ---------------------------------------------------------------------------

const hits = new Map(); // ip -> number[] of timestamps

function clientIp(req) {
  const xff = req.headers && req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

/** Returns true if the request is allowed. */
function rateLimitOk(req) {
  const now = Date.now();
  const ip = clientIp(req);
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // keep memory bounded on long-lived instances
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] >= RATE_LIMIT_WINDOW_MS) hits.delete(k);
    }
  }
  return true;
}

function resetRateLimit() {
  hits.clear();
}

// ---------------------------------------------------------------------------
// Request guard
// ---------------------------------------------------------------------------

/** Parse req.body (object, string or Buffer). Returns {body} or {error,status}. */
function parseBody(req) {
  const len = Number(req.headers && req.headers['content-length']);
  if (len > MAX_BODY_CHARS) return { error: 'payload_too_large', status: 413 };
  let b = req.body;
  if (Buffer.isBuffer(b)) b = b.toString('utf8');
  if (typeof b === 'string') {
    if (b.length > MAX_BODY_CHARS) return { error: 'payload_too_large', status: 413 };
    try {
      b = JSON.parse(b);
    } catch (e) {
      return { error: 'invalid_json', status: 400 };
    }
  } else if (b && typeof b === 'object') {
    if (JSON.stringify(b).length > MAX_BODY_CHARS) return { error: 'payload_too_large', status: 413 };
  }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return { error: 'invalid_json', status: 400 };
  return { body: b };
}

/**
 * Common front door for POST endpoints.
 * Returns the parsed body object, or null when a response was already sent
 * (OPTIONS, wrong method, bad origin, rate limited, bad body, honeypot).
 */
function guardPost(req, res) {
  const origin = req.headers && req.headers.origin;
  const allowed = originAllowed(req);

  // CORS: only advertise when an explicit allow-list is configured.
  if (origin && allowed && process.env.ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '600');
    res.statusCode = allowed ? 204 : 403;
    res.end();
    return null;
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    reply(res, 405, { ok: false, error: 'method_not_allowed' });
    return null;
  }
  if (!allowed) {
    reply(res, 403, { ok: false, error: 'origin_not_allowed' });
    return null;
  }
  if (!rateLimitOk(req)) {
    res.setHeader('Retry-After', '600');
    reply(res, 429, { ok: false, error: 'rate_limited' });
    return null;
  }
  const parsed = parseBody(req);
  if (parsed.error) {
    reply(res, parsed.status, { ok: false, error: parsed.error });
    return null;
  }
  // Honeypot: real visitors never fill the hidden "website" field. Pretend success.
  const hp = parsed.body.website;
  if (hp !== undefined && hp !== null && String(hp).trim() !== '') {
    reply(res, 200, { ok: true });
    return null;
  }
  return parsed.body;
}

// ---------------------------------------------------------------------------
// Validation / sanitizing
// ---------------------------------------------------------------------------

/** Trim, drop control characters, collapse whitespace, cap length. */
function clean(value, max) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  // eslint-disable-next-line no-control-regex
  let s = String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (max && s.length > max) s = s.slice(0, max).trim();
  return s;
}

/** Returns lowercase email or null. */
function normalizeEmail(value) {
  const s = clean(value, 254).toLowerCase();
  if (!s || s.length > 254) return null;
  // Deliberately simple: one @, no spaces, dotted domain, 2+ letter TLD.
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/.test(s)) {
    return null;
  }
  if (s.split('@')[0].length > 64 || s.includes('..')) return null;
  return s;
}

/**
 * US phone to E.164. Accepts 10 digits, or 11 digits starting with 1
 * (punctuation / leading + ignored). NANP rule: area code and exchange must
 * start with 2-9. Anything else returns null.
 */
function normalizePhone(value) {
  if (value === undefined || value === null) return null;
  const digits = String(value).replace(/\D/g, '');
  let ten;
  if (digits.length === 10) ten = digits;
  else if (digits.length === 11 && digits[0] === '1') ten = digits.slice(1);
  else return null;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(ten)) return null;
  return '+1' + ten;
}

// ---------------------------------------------------------------------------
// Outbound HTTP
// ---------------------------------------------------------------------------

/**
 * fetch with an 8s timeout. Never throws: resolves {ok,status,data,error?}.
 * data is parsed JSON when possible, otherwise null.
 */
async function fetchJson(url, options, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || 8000);
  try {
    const r = await fetch(url, Object.assign({}, options, { signal: ctrl.signal }));
    const text = await r.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    return { ok: r.ok, status: r.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: null, error: e && e.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

/** Twilio uses HTTP Basic auth: AccountSid:AuthToken. */
function twilioAuthHeader(sid, token) {
  return 'Basic ' + Buffer.from(String(sid) + ':' + String(token)).toString('base64');
}

// ---------------------------------------------------------------------------
// Log redaction
// ---------------------------------------------------------------------------

const SECRET_ENV = ['OMNISEND_API_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_MESSAGING_SERVICE_SID', 'TWILIO_FROM'];

/** Strip secrets, emails and phone numbers from anything headed to a log. */
function redact(input) {
  let s = typeof input === 'string' ? input : (() => { try { return JSON.stringify(input); } catch (e) { return String(input); } })();
  if (s === undefined) return '';
  for (const k of SECRET_ENV) {
    const v = process.env[k];
    if (v && v.length >= 4) s = s.split(v).join('[secret]');
  }
  s = s.replace(/[^\s"'<>@]+@[^\s"'<>@]+\.[a-z]{2,}/gi, '[email]');
  s = s.replace(/\+?\d[\d\s().-]{8,}\d/g, '[phone]');
  return s;
}

/** Log a failure without PII or secrets. */
function logFailure(tag, detail) {
  console.error('[' + tag + '] ' + redact(detail));
}

module.exports = {
  MAX_BODY_CHARS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  reply,
  originAllowed,
  rateLimitOk,
  resetRateLimit,
  parseBody,
  guardPost,
  clean,
  normalizeEmail,
  normalizePhone,
  fetchJson,
  twilioAuthHeader,
  redact,
  logFailure,
};
