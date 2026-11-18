// Endpoint handlers for /api/wheelpros/*. Each api/wheelpros/<name>.js file just exports one of these.
'use strict';
const C = require('./core');
const M = require('./mock');
const { RX } = C;

// Shared request pipeline: CORS -> method -> rate limit -> param whitelist -> mock / configured check -> run.
function endpoint(schema, run, { cache = true } = {}) {
  return async (req, res) => {
    const cfg = C.config();
    C.applyCors(req, res, cfg);
    if (req.method === 'OPTIONS') { res.statusCode = 204; res.setHeader('Cache-Control', 'no-store'); return res.end(); }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, OPTIONS'); return C.send(res, 405, { error: 'method_not_allowed' }); }
    const wait = C.rateLimited(req);
    if (wait) { res.setHeader('Retry-After', String(wait)); return C.send(res, 429, { error: 'rate_limited' }); }
    const v = C.validate(req.url, { ...schema, mock: RX.flag });
    if (v.error) return C.send(res, 400, v.error);
    const mock = cfg.mock || C.truthy(v.params.mock);
    if (!mock && !C.isConfigured(cfg) && run.needsConfig !== false) return C.send(res, 503, { error: 'not_configured' });
    try {
      const body = await run(v.params, cfg, mock, Date.now() + C.TIMEOUT_MS);
      if (body && body.__status) { const { __status, ...rest } = body; return C.send(res, __status, rest); }
      if (mock) res.setHeader('X-WheelPros-Mock', '1');
      return C.send(res, 200, body, cache);
    } catch (e) { return C.sendError(res, e); }
  };
}
const bad = (param, error = 'invalid_param') => ({ __status: 400, error, param });

// ---------- /api/wheelpros/vehicle ----------
const vehicle = endpoint({ year: RX.year, make: RX.text, model: RX.text, type: RX.type }, async (p, cfg, mock, deadline) => {
  if (p.model && !p.make) return bad('make', 'missing_param');
  if ((p.make || p.model) && !p.year) return bad('year', 'missing_param');
  const type = p.type || 'wheel';
  if (mock) {
    if (!p.year) return { years: M.years() };
    if (!p.make) return { makes: M.VEHICLES.makes };
    if (!p.model) return { models: M.VEHICLES.models[p.make] || [] };
    return { submodels: M.VEHICLES.submodels };
  }
  const e = encodeURIComponent, base = '/vehicles/v1/years';
  const list = j => (Array.isArray(j) ? j : (j && (j.results || j.data || j.items)) || []).map(x => typeof x === 'object' && x ? (x.name || x.value || x.year) : x).filter(x => x != null && x !== '');
  if (!p.year) {
    try { return { years: list(await C.upstream(cfg, base, { query: { type } }, deadline)).map(Number).filter(Boolean).sort((a, b) => b - a) }; }
    catch (err) { if (err.code === 'upstream' && (err.status === 403 || err.status === 404)) return { years: M.years() }; throw err; } // years list is "internal use only" upstream
  }
  if (!p.make) return { makes: list(await C.upstream(cfg, base + '/' + e(p.year) + '/makes', { query: { type } }, deadline)) };
  if (!p.model) return { models: list(await C.upstream(cfg, base + '/' + e(p.year) + '/makes/' + e(p.make) + '/models', { query: { type } }, deadline)) };
  return { submodels: list(await C.upstream(cfg, base + '/' + e(p.year) + '/makes/' + e(p.make) + '/models/' + e(p.model) + '/submodels', { query: { type } }, deadline)) };
});

// ---------- /api/wheelpros/search ----------
const SEARCH_SCHEMA = {
  type: RX.type, vehicleYear: RX.year, vehicleMake: RX.text, vehicleModel: RX.text, vehicleSubModel: RX.text,
  year: RX.year, make: RX.text, model: RX.text, submodel: RX.text, // short aliases
  brand: RX.text, boltPattern: RX.bolt, finish: RX.text, diameter: RX.num, width: RX.num, minOffset: RX.num, maxOffset: RX.num,
  includeStaggered: RX.bool, includeLifted: RX.bool, aspectRatio: RX.num, wheelDiameter: RX.num, q: RX.text,
  page: RX.int, pageSize: RX.int, sortField: RX.sortField, sortOrder: RX.sortOrder, availabilityType: RX.avail, realTimeInventory: RX.bool,
};
const WHEEL_ONLY = ['boltPattern', 'finish', 'minOffset', 'maxOffset', 'includeStaggered', 'includeLifted'];
const TIRE_ONLY = ['aspectRatio', 'wheelDiameter'];

// Batch-fetch prices when the search response came back without them (cost stays server-side).
async function fillPrices(cfg, raws, deadline) {
  const need = raws.filter(r => !r.prices || !Object.keys(r.prices).length);
  if (!need.length) return;
  try {
    const j = await C.upstream(cfg, '/pricings/v1/search', { method: 'POST', body: {
      filters: { sku: need.map(r => r.sku), company: cfg.company, ...(cfg.customer ? { customer: cfg.customer } : {}), currency: 'USD' },
      limit: need.length, priceType: ['msrp'] } }, deadline);
    const by = new Map((Array.isArray(j) ? j : (j && j.results) || []).map(x => [x.sku, x.prices]));
    for (const r of need) if (by.has(r.sku)) r.prices = by.get(r.sku);
  } catch (e) { if (e.code === 'timeout') throw e; /* prices fall back to "Call for price" */ }
}

function mockSearch(type, f, page, pageSize, cfg) {
  let rows = (type === 'tire' ? M.TIRES : M.WHEELS).map(r => C.normalizeItem(JSON.parse(JSON.stringify(r)), cfg, false));
  const eq = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();
  if (f.brand) rows = rows.filter(i => eq(i.brand, f.brand) || (type === 'tire' ? M.TIRES : M.WHEELS).some(r => r.sku === i.sku && eq(r.brand.code, f.brand)));
  if (f.diameter) rows = rows.filter(i => Number(i.size.diameter) === Number(f.diameter));
  if (f.wheelDiameter) rows = rows.filter(i => Number(i.size.diameter) === Number(f.wheelDiameter));
  if (f.width) rows = rows.filter(i => Number(i.size.width) === Number(f.width));
  if (f.boltPattern) rows = rows.filter(i => eq(i.size.boltPattern, f.boltPattern));
  if (f.finish) rows = rows.filter(i => eq(i.finish, f.finish));
  if (f.aspectRatio) rows = rows.filter(i => Number(i.size.aspectRatio) === Number(f.aspectRatio));
  if (f.minOffset) rows = rows.filter(i => i.size.offset != null && i.size.offset >= Number(f.minOffset));
  if (f.maxOffset) rows = rows.filter(i => i.size.offset != null && i.size.offset <= Number(f.maxOffset));
  const facets = C.normalizeFacets(null, rows);
  return { items: rows.slice((page - 1) * pageSize, page * pageSize), facets, total: rows.length, page, pageSize, mock: true };
}

const search = endpoint(SEARCH_SCHEMA, async (p, cfg, mock, deadline) => {
  if (!p.type) return bad('type', 'missing_param');
  const page = Math.max(1, parseInt(p.page || '1', 10)), pageSize = parseInt(p.pageSize || '12', 10);
  if (!(pageSize >= 1 && pageSize <= 24)) return bad('pageSize');
  if (page > 500) return bad('page');
  const other = p.type === 'wheel' ? TIRE_ONLY : WHEEL_ONLY;
  const wrong = other.find(k => p[k] !== undefined); if (wrong) return bad(wrong, 'param_not_for_type');
  const f = { ...p };
  for (const [s, l] of [['year', 'vehicleYear'], ['make', 'vehicleMake'], ['model', 'vehicleModel'], ['submodel', 'vehicleSubModel']])
    if (f[s] !== undefined) { if (f[l] === undefined) f[l] = f[s]; delete f[s]; }
  if (mock) return mockSearch(p.type, f, page, pageSize, cfg);
  const query = {
    vehicleYear: f.vehicleYear, vehicleMake: f.vehicleMake, vehicleModel: f.vehicleModel, vehicleSubModel: f.vehicleSubModel,
    brand: f.brand, diameter: f.diameter, width: f.width, filter: f.q,
    ...(p.type === 'wheel' ? { boltPattern: f.boltPattern, finish: f.finish, minOffset: f.minOffset, maxOffset: f.maxOffset,
      includeStaggered: f.includeStaggered, includeLifted: f.includeLifted } : { aspectRatio: f.aspectRatio, wheelDiameter: f.wheelDiameter }),
    page, pageSize, sortField: f.sortField, sortOrder: f.sortOrder, availabilityType: f.availabilityType || 'ALL',
    realTimeInventory: f.realTimeInventory, facetCount: 10, priceType: 'msrp', company: cfg.company, customer: cfg.customer || undefined, currencyCode: 'USD',
  };
  const j = await C.upstream(cfg, '/products/v1/search/' + p.type, { query }, deadline);
  const raws = (j && (j.results || j.searchResults || j.items)) || [];
  await fillPrices(cfg, raws, deadline);
  const items = raws.map(r => C.normalizeItem(r, cfg, false));
  return { items, facets: C.normalizeFacets(j && (j.facets || j.aggregations), items), total: Number(j && (j.totalCount ?? j.total)) || items.length, page, pageSize };
});

// ---------- /api/wheelpros/product ----------
const product = endpoint({ sku: RX.sku }, async (p, cfg, mock, deadline) => {
  if (!p.sku) return bad('sku', 'missing_param');
  if (mock) {
    const r = M.WHEELS.concat(M.TIRES).find(x => x.sku === p.sku);
    if (!r) return { __status: 404, error: 'not_found' };
    return { item: C.normalizeItem(JSON.parse(JSON.stringify(r)), cfg, true), mock: true };
  }
  const raw = await C.upstream(cfg, '/products/v1/details/' + encodeURIComponent(p.sku), {}, deadline);
  await fillPrices(cfg, [raw], deadline);
  return { item: C.normalizeItem(raw, cfg, true) };
});

// ---------- /api/wheelpros/brands ----------
const brands = endpoint({ type: RX.type }, async (p, cfg, mock, deadline) => {
  if (!p.type) return bad('type', 'missing_param');
  if (mock) return { type: p.type, brands: M.BRANDS[p.type].map(([code, name]) => ({ code, name, parent: name, logo: null })), mock: true };
  const out = [];
  for (let page = 1; page <= 5; page++) {
    const j = await C.upstream(cfg, '/products/v1/brands', { query: { type: p.type, page, pageSize: 100 } }, deadline);
    const rows = (j && j.results) || [];
    for (const b of rows) {
      if (p.type === 'wheel' && b.isWheel === false) continue;
      if (p.type === 'tire' && b.isTire === false) continue;
      const logo = (b.images || []).map(i => i && i.original).find(Boolean) || null;
      out.push({ code: b.brandCode || null, name: b.brand || null, parent: b.parentBrand || null, logo });
    }
    if (!rows.length || out.length >= Number(j.totalCount || 0) || rows.length < 100) break;
  }
  out.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return { type: p.type, brands: out };
});

// ---------- /api/wheelpros/health ----------
async function healthRun(p, cfg, mock, deadline) {
  const configured = C.isConfigured(cfg);
  let tokenOk = false;
  if (configured) { try { await C.getToken(cfg, deadline, false); tokenOk = true; } catch { tokenOk = false; } }
  return { configured, tokenOk, mock: cfg.mock, markup: cfg.markupPct != null };
}
healthRun.needsConfig = false;
const health = endpoint({}, healthRun, { cache: false });

module.exports = { vehicle, search, product, brands, health, endpoint };
