// Wheel Pros API proxy core: config, CORS, param validation, rate limit, token cache, upstream fetch, normalizers.
// SECURITY: dealer cost (NIP) is used ONLY to compute a display price server-side and is never returned.
// Credentials come from env vars only (never logged, never echoed).
'use strict';

const BASE = 'https://api.wheelpros.com';
const TIMEOUT_MS = 9000;
const CACHE_OK = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';

// ---------- config ----------
function config(env = process.env) {
  const markupRaw = env.WHEELPROS_MARKUP_PCT;
  const markup = markupRaw != null && markupRaw !== '' && isFinite(Number(markupRaw)) && Number(markupRaw) >= 0 ? Number(markupRaw) : null;
  return {
    username: env.WHEELPROS_USERNAME || '',
    password: env.WHEELPROS_PASSWORD || '',
    company: env.WHEELPROS_COMPANY || '1000',
    customer: env.WHEELPROS_CUSTOMER || '',
    markupPct: markup,
    extraOrigins: (env.WHEELPROS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean),
    mock: env.WHEELPROS_MOCK === '1',
  };
}
const isConfigured = cfg => !!(cfg.username && cfg.password);

// ---------- CORS ----------
const FIXED_ORIGINS = ['https://extrememobiletires.com', 'https://www.extrememobiletires.com', 'https://yte3rp-um.myshopify.com'];
const SHOPIFY_PREVIEW = /^https:\/\/([a-z0-9-]+\.)+shopifypreview\.com$/i;
function originAllowed(origin, cfg) {
  if (!origin || typeof origin !== 'string') return false;
  const o = origin.replace(/\/+$/, '');
  return FIXED_ORIGINS.includes(o) || cfg.extraOrigins.includes(o) || SHOPIFY_PREVIEW.test(o);
}
function applyCors(req, res, cfg) {
  const origin = req.headers && req.headers.origin;
  res.setHeader('Vary', 'Origin');
  if (originAllowed(origin, cfg)) {
    res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/+$/, ''));
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
}

// ---------- responses ----------
function send(res, status, body, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', cache && status === 200 ? CACHE_OK : 'no-store');
  res.end(JSON.stringify(body));
}

// ---------- rate limit (best effort, per warm instance) ----------
const RL_WINDOW = 60000, RL_MAX = 90;
const hits = new Map();
function clientIp(req) {
  const h = req.headers || {};
  const xf = (h['x-forwarded-for'] || '').split(',')[0].trim();
  return xf || h['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}
function rateLimited(req, now = Date.now()) {
  const ip = clientIp(req);
  let e = hits.get(ip);
  if (!e || now - e.start > RL_WINDOW) { e = { start: now, n: 0 }; hits.set(ip, e); }
  e.n++;
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start > RL_WINDOW) hits.delete(k);
  return e.n > RL_MAX ? Math.ceil((e.start + RL_WINDOW - now) / 1000) : 0;
}
const _resetRateLimit = () => hits.clear();

// ---------- param validation ----------
const RX = {
  type: /^(wheel|tire)$/,
  year: /^(19[0-9]{2}|20[0-9]{2}|2100)$/,
  text: /^[A-Za-z0-9 .,&()'\/+\-]{1,60}$/,
  sku: /^[A-Za-z0-9._\-]{1,40}$/,
  bolt: /^[0-9]{1,2}[xX][0-9]{2,3}(\.[0-9]{1,2})?$/,
  num: /^-?[0-9]{1,3}(\.[0-9]{1,2})?$/,
  int: /^[0-9]{1,4}$/,
  bool: /^(true|false|1|0)$/,
  sortField: /^(brand|popularity|price|status|style|styleNumber)$/,
  sortOrder: /^(asc|desc)$/i,
  avail: /^[A-Za-z_]{1,20}$/,
  flag: /^(1|0|true|false)$/,
};
// Returns {params} or {error:{error,param}}. Rejects unknown, duplicate and malformed params.
function validate(rawUrl, schema) {
  const u = new URL(rawUrl || '/', 'http://local');
  const params = {}, seen = new Set();
  for (const [k, v] of u.searchParams) {
    if (!Object.prototype.hasOwnProperty.call(schema, k)) return { error: { error: 'unknown_param', param: k } };
    if (seen.has(k)) return { error: { error: 'duplicate_param', param: k } };
    seen.add(k);
    if (v === '') continue;
    if (!schema[k].test(v)) return { error: { error: 'invalid_param', param: k } };
    params[k] = v;
  }
  return { params };
}
const truthy = v => v === '1' || v === 'true';

// ---------- token cache ----------
let tok = null; // {value, exp}
let fetchImpl = (...a) => fetch(...a);
const _setFetch = f => { fetchImpl = f; };
const _resetToken = () => { tok = null; };

function jwtExp(t) {
  try { const p = JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString('utf8')); return p.exp ? p.exp * 1000 : null; } catch { return null; }
}
async function timedFetch(url, opt, deadline) {
  const left = Math.max(1, deadline - Date.now());
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), left);
  try { return await fetchImpl(url, { ...opt, signal: ac.signal }); }
  catch (e) { if (ac.signal.aborted) { const err = new Error('timeout'); err.code = 'timeout'; throw err; } throw e; }
  finally { clearTimeout(t); }
}
async function getToken(cfg, deadline, force) {
  const now = Date.now();
  if (!force && tok && now < tok.exp - 5 * 60000) return tok.value;
  const r = await timedFetch(BASE + '/auth/v1/authorize', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ userName: cfg.username, password: cfg.password }),
  }, deadline);
  if (!r.ok) { const e = new Error('auth_failed'); e.code = 'auth_failed'; e.status = r.status; throw e; }
  const j = await r.json().catch(() => ({}));
  const value = j.accessToken || j.token || j.access_token || j.idToken || (j.data && (j.data.accessToken || j.data.token));
  if (!value || typeof value !== 'string') { const e = new Error('auth_failed'); e.code = 'auth_failed'; throw e; }
  const expIn = Number(j.expiresIn || j.expires_in || j.expiresInSeconds || 0);
  const exp = (expIn > 0 ? now + expIn * 1000 : null) || jwtExp(value) || now + 60 * 60000;
  tok = { value, exp };
  return value;
}

// GET/POST upstream JSON with bearer token; on 401 refresh the token once and retry.
async function upstream(cfg, path, { method = 'GET', query, body } = {}, deadline = Date.now() + TIMEOUT_MS) {
  const qs = query ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString() : '';
  const url = BASE + path + (qs === '?' ? '' : qs);
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getToken(cfg, deadline, attempt > 0);
    const r = await timedFetch(url, {
      method, headers: { Authorization: 'Bearer ' + token, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    }, deadline);
    if (r.status === 401 && attempt === 0) { tok = null; continue; }
    if (!r.ok) { const e = new Error('upstream'); e.code = 'upstream'; e.status = r.status; throw e; }
    return r.json();
  }
  const e = new Error('upstream'); e.code = 'upstream'; e.status = 401; throw e;
}
function sendError(res, e) {
  if (e.code === 'timeout') return send(res, 504, { error: 'upstream_timeout' });
  if (e.code === 'auth_failed') return send(res, 502, { error: 'upstream_auth_failed' });
  if (e.code === 'upstream' && e.status === 404) return send(res, 404, { error: 'not_found' });
  if (e.code === 'upstream') return send(res, 502, { error: 'upstream_error', status: e.status });
  console.error('wheelpros proxy error', e && e.message);
  return send(res, 500, { error: 'internal_error' });
}

// ---------- price rules ----------
const num = v => { if (v === null || v === undefined || v === '') return null; const n = Number(v); return isFinite(n) && n > 0 ? n : null; };
function priceOf(prices, kind, currency = 'USD') {
  const arr = prices && prices[kind];
  if (!Array.isArray(arr)) return num(arr && arr.currencyAmount !== undefined ? arr.currencyAmount : arr);
  const hit = arr.find(p => p && (p.currencyCode || 'USD') === currency) || arr[0];
  return hit ? num(hit.currencyAmount) : null;
}
const round2 = n => Math.round(n * 100) / 100;
// display = max(MAP, cost*(1+markup)) when markup set; else MAP; else MSRP; else null ("Call for price").
function computePrice(prices, markupPct) {
  const map = priceOf(prices, 'map'), msrp = priceOf(prices, 'msrp'), cost = priceOf(prices, 'nip');
  let display = null;
  if (markupPct != null && cost != null) display = round2(Math.max(map || 0, cost * (1 + markupPct / 100)));
  else if (map != null) display = map;
  else if (msrp != null) display = msrp;
  return { display, label: display != null ? 'Our price' : 'Call for price', map, msrp };
}

// ---------- sanitizing ----------
const COST_KEY = /(^|_)(nip|cost|dealer|net|invoice|wholesale|margin)/i;
const COST_KEY2 = /(nip|cost|dealerprice|netprice|invoice|wholesale|margin)/i;
function stripCost(v, depth = 0) {
  if (depth > 6) return undefined;
  if (Array.isArray(v)) return v.map(x => stripCost(x, depth + 1));
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      if (COST_KEY.test(k) || COST_KEY2.test(k) || k === 'prices' || k === 'price' || k === 'pricing') continue;
      o[k] = stripCost(x, depth + 1);
    }
    return o;
  }
  return v;
}

// ---------- normalizers ----------
const fnum = v => { if (v === null || v === undefined || v === '') return null; const n = parseFloat(v); return isFinite(n) ? n : null; };
function stockOf(inv) {
  if (!inv) return { status: 'call', qty: null };
  const g = fnum(inv.globalStock), l = fnum(inv.localStock);
  const qty = g != null || l != null ? Math.max(g || 0, l || 0) : null;
  if (qty == null) return { status: 'call', qty: null };
  return { status: qty >= 4 ? 'in_stock' : qty > 0 ? 'low' : 'call', qty };
}
function tireFromTitle(title) {
  const m = /^(\d{3})(\d{2})[A-Z]*R(\d{2}(?:\.\d)?)/.exec(String(title || '').replace(/[\s\/-]/g, ''));
  return m ? { section: +m[1], aspectRatio: +m[2], rim: +m[3] } : null;
}
function normalizeItem(raw, cfg, full) {
  const p = raw.properties || {}, isTire = String(raw.skuType || '').toUpperCase() === 'TIRE';
  const type = isTire ? 'tire' : String(raw.skuType || '').toUpperCase() === 'WHEEL' ? 'wheel' : 'accessory';
  const brand = (raw.brand && (raw.brand.description || raw.brand.parent || raw.brand.code)) || null;
  const imgs = (raw.images || []).map(i => i && (i.imageUrlLarge || i.imageUrlOriginal || i.imageUrlMedium)).filter(Boolean);
  const first = raw.images && raw.images[0];
  const image = (first && (first.imageUrlMedium || first.imageUrlLarge || first.imageUrlOriginal)) || null;
  let size;
  if (isTire) {
    const t = tireFromTitle(raw.title) || {};
    const section = fnum(p.width) || t.section || null;
    size = { diameter: fnum(p.wheelDiameter) || t.rim || null, width: section, offset: null, boltPattern: null,
      aspectRatio: fnum(p.aspectRatio) || t.aspectRatio || null, section };
  } else {
    size = { diameter: fnum(p.diameter), width: fnum(p.width), offset: fnum(p.offset),
      boltPattern: p.boltPattern && p.boltPattern !== 'BLANK' ? String(p.boltPattern) : (p.boltPattern || null), aspectRatio: null, section: null };
  }
  const sku = String(raw.sku || '');
  const item = {
    sku, type, brand,
    name: [brand, p.model].filter(Boolean).join(' ') || raw.title || sku,
    image, images: imgs, size,
    finish: p.finish || null,
    price: computePrice(raw.prices, cfg.markupPct),
    stock: stockOf(raw.inventory),
    url: '/wheels-tires/?type=' + type + '&sku=' + encodeURIComponent(sku),
  };
  if (full) {
    item.title = raw.title || null;
    item.upc = raw.upc || null;
    item.model = p.model || null;
    item.brandInfo = raw.brand ? stripCost({ code: raw.brand.code, name: raw.brand.description, parent: raw.brand.parent }) : null;
    item.specs = stripCost(p);
  }
  return item;
}
const FACET_KEYS = { brand: ['brand', 'brands', 'brandDesc', 'brandDescription', 'brandName'], diameter: ['diameter', 'wheelDiameter', 'diameters'],
  width: ['width', 'widths'], finish: ['finish', 'finishes', 'finishCode'], boltPattern: ['boltPattern', 'boltPatterns', 'boltPatternMetric'] };
function bucketList(v) {
  const arr = Array.isArray(v) ? v : v && Array.isArray(v.buckets) ? v.buckets : v && Array.isArray(v.values) ? v.values
    : v && typeof v === 'object' ? Object.entries(v).map(([value, count]) => ({ value, count })) : [];
  return arr.map(b => typeof b === 'object' && b ? { value: String(b.value ?? b.key ?? b.name ?? b.label ?? ''), count: Number(b.count ?? b.doc_count ?? b.docCount ?? 0) || 0 }
    : { value: String(b), count: 0 }).filter(b => b.value);
}
function normalizeFacets(rawFacets, items) {
  const out = { brand: [], diameter: [], width: [], finish: [], boltPattern: [] };
  let src = rawFacets;
  if (Array.isArray(src)) src = Object.fromEntries(src.filter(f => f && (f.name || f.field || f.key)).map(f => [f.name || f.field || f.key, f.buckets || f.values || f.items || []]));
  if (src && typeof src === 'object') for (const [k, names] of Object.entries(FACET_KEYS)) {
    const hit = names.find(n => src[n] != null); if (hit) out[k] = bucketList(src[hit]);
  }
  // fall back to counting the current page when upstream sent no facets
  const derive = (k, get) => { if (out[k].length) return; const m = new Map(); for (const it of items) { const v = get(it); if (v != null && v !== '') m.set(String(v), (m.get(String(v)) || 0) + 1); } out[k] = [...m].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count); };
  derive('brand', i => i.brand); derive('diameter', i => i.size.diameter); derive('width', i => i.size.width); derive('finish', i => i.finish); derive('boltPattern', i => i.size.boltPattern);
  return out;
}

module.exports = {
  BASE, TIMEOUT_MS, config, isConfigured, originAllowed, applyCors, send, sendError, rateLimited, validate, RX, truthy,
  getToken, upstream, computePrice, priceOf, stripCost, normalizeItem, normalizeFacets, stockOf,
  _setFetch, _resetToken, _resetRateLimit,
};
