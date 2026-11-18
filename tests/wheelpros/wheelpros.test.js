// Run: node --test tests/wheelpros/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const C = require('../../lib/wheelpros/core');
const H = require('../../lib/wheelpros/handlers');

const NIP = 123.45; // distinctive cost value that must never appear in any response
function fakeRes() {
  return { statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { this.body = b || ''; this.done = true; },
    json() { return JSON.parse(this.body); } };
}
async function call(handler, url, { origin, method = 'GET', ip = '1.1.1.1' } = {}) {
  const req = { method, url, headers: { 'x-forwarded-for': ip, ...(origin ? { origin } : {}) } };
  const res = fakeRes(); await handler(req, res); return res;
}
function withEnv(env, fn) {
  return async () => {
    const keys = ['WHEELPROS_USERNAME', 'WHEELPROS_PASSWORD', 'WHEELPROS_COMPANY', 'WHEELPROS_CUSTOMER', 'WHEELPROS_MARKUP_PCT', 'WHEELPROS_ALLOWED_ORIGINS', 'WHEELPROS_MOCK'];
    const old = Object.fromEntries(keys.map(k => [k, process.env[k]]));
    keys.forEach(k => delete process.env[k]); Object.assign(process.env, env);
    C._resetToken(); C._resetRateLimit();
    try { await fn(); } finally { keys.forEach(k => { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; }); C._setFetch((...a) => fetch(...a)); C._resetToken(); }
  };
}
const jsonResp = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) });
const rawWheel = (sku, prices) => ({ sku, skuType: 'WHEEL', title: 'T', brand: { code: 'AB', description: 'Asanti Black', parent: 'Asanti' },
  inventory: { type: 'ST', localStock: 0, globalStock: 38 }, properties: { model: 'ABL-12', offset: '35.0', boltPattern: '5X112', finish: 'GLOSS BLACK', width: '10.50', diameter: '22.00', dealerCost: String(NIP), nipPrice: NIP },
  prices, images: [{ imageUrlMedium: 'https://media.wheelpros.com/m.png', imageUrlLarge: 'https://media.wheelpros.com/l.png' }] });
const P = (msrp, nip, map) => ({ msrp: [{ currencyAmount: msrp, currencyCode: 'USD' }], nip: [{ currencyAmount: nip, currencyCode: 'USD' }], map: [{ currencyAmount: map, currencyCode: 'USD' }] });
const assertNoCost = s => { assert.ok(!/nip/i.test(s), 'nip key leaked: ' + s.slice(0, 200)); assert.ok(!s.includes(String(NIP)), 'cost value leaked'); assert.ok(!/cost/i.test(s), 'cost key leaked'); };

// ---------- price rules ----------
test('price: markup set -> max(MAP, cost*(1+m))', () => {
  assert.deepStrictEqual(C.computePrice(P('398', '100', '270'), 20), { display: 270, label: 'Our price', map: 270, msrp: 398 });
  assert.strictEqual(C.computePrice(P('398', '300', '270'), 20).display, 360);
  assert.strictEqual(C.computePrice(P('398', '100', null), 25).display, 125);
  assert.strictEqual(C.computePrice(P('398', '100', '270'), 0).display, 270);
});
test('price: no markup -> MAP, then MSRP, then Call for price', () => {
  assert.strictEqual(C.computePrice(P('398', '100', '270'), null).display, 270);
  assert.strictEqual(C.computePrice(P('398', '100', null), null).display, 398);
  assert.deepStrictEqual(C.computePrice(P(null, '100', null), null), { display: null, label: 'Call for price', map: null, msrp: null });
  assert.deepStrictEqual(C.computePrice(undefined, null), { display: null, label: 'Call for price', map: null, msrp: null });
});
test('price: markup set but no cost falls back to MAP/MSRP', () => {
  assert.strictEqual(C.computePrice(P('398', null, '270'), 30).display, 270);
});
test('price object never contains cost', () => {
  const r = C.computePrice(P('398', String(NIP), '270'), 10);
  assert.deepStrictEqual(Object.keys(r).sort(), ['display', 'label', 'map', 'msrp']);
});
test('stripCost removes cost-like keys deeply', () => {
  const o = C.stripCost({ a: 1, nip: 2, dealerCost: 3, prices: { nip: 4 }, nested: [{ netPrice: 5, ok: 6, cost: 7 }] });
  assert.deepStrictEqual(o, { a: 1, nested: [{ ok: 6 }] });
});

test('search: cost never leaks (upstream returns nip + cost-ish spec fields)', withEnv({ WHEELPROS_USERNAME: 'u', WHEELPROS_PASSWORD: 'p', WHEELPROS_MARKUP_PCT: '15' }, async () => {
  const calls = [];
  C._setFetch(async (url, opt) => {
    calls.push(url);
    if (url.endsWith('/auth/v1/authorize')) { const b = JSON.parse(opt.body); assert.deepStrictEqual(Object.keys(b), ['userName', 'password']); return jsonResp(200, { accessToken: 'TKN', expiresIn: 3600 }); }
    assert.strictEqual(opt.headers.Authorization, 'Bearer TKN');
    return jsonResp(200, { results: [rawWheel('S1', P('398.0', String(NIP), '270.0')), rawWheel('S2', P('398.0', '900', '270.0'))], totalCount: 2, page: 1, pageSize: 12 });
  });
  const res = await call(H.search, '/api/wheelpros/search/?type=wheel&diameter=22&boltPattern=5X112');
  assert.strictEqual(res.statusCode, 200, res.body);
  assertNoCost(res.body);
  const j = res.json();
  assert.strictEqual(j.items[0].price.display, 270); // 123.45*1.15 < MAP
  assert.strictEqual(j.items[1].price.display, 1035); // 900*1.15 > MAP
  assert.strictEqual(j.items[0].stock.status, 'in_stock');
  assert.ok(j.facets.brand.length && j.facets.diameter.length);
  assert.match(res.headers['cache-control'], /s-maxage=300, stale-while-revalidate=3600/);
  const up = calls.find(u => u.includes('/products/v1/search/wheel'));
  assert.match(up, /company=1000/); assert.match(up, /diameter=22/); assert.match(up, /boltPattern=5X112/);
}));

test('product: cost never leaks from details + pricing', withEnv({ WHEELPROS_USERNAME: 'u', WHEELPROS_PASSWORD: 'p' }, async () => {
  C._setFetch(async (url) => {
    if (url.endsWith('/auth/v1/authorize')) return jsonResp(200, { token: 'T2' });
    if (url.includes('/pricings/v1/search')) return jsonResp(200, [{ sku: 'S1', prices: P('254.00', String(NIP), null) }]);
    return jsonResp(200, rawWheel('S1', undefined));
  });
  const res = await call(H.product, '/api/wheelpros/product/?sku=S1');
  assert.strictEqual(res.statusCode, 200, res.body); assertNoCost(res.body);
  assert.strictEqual(res.json().item.price.display, 254);
  assert.ok(res.json().item.specs.model);
}));

test('mock mode: search returns sample wheels/tires without cost and without credentials', withEnv({}, async () => {
  C._setFetch(async () => { throw new Error('no network in mock'); });
  for (const t of ['wheel', 'tire']) {
    const res = await call(H.search, '/api/wheelpros/search/?type=' + t + '&mock=1');
    assert.strictEqual(res.statusCode, 200, res.body); assertNoCost(res.body);
    const j = res.json(); assert.ok(j.items.length >= 6 && j.items.length <= 12, t + ' count'); assert.strictEqual(j.items[0].image, null);
    for (const i of j.items) { assert.ok(['in_stock', 'low', 'call'].includes(i.stock.status)); assert.ok(['Our price', 'Call for price'].includes(i.price.label)); }
  }
  const prod = await call(H.product, '/api/wheelpros/product/?sku=MOCK-W-FU1&mock=1'); assert.strictEqual(prod.statusCode, 200); assertNoCost(prod.body);
}));
test('mock mode via env WHEELPROS_MOCK=1 with markup still hides cost', withEnv({ WHEELPROS_MOCK: '1', WHEELPROS_MARKUP_PCT: '40' }, async () => {
  const res = await call(H.search, '/api/wheelpros/search/?type=wheel&pageSize=24');
  assert.strictEqual(res.statusCode, 200); assert.ok(!/nip|cost/i.test(res.body));
  const kmc = res.json().items.find(i => i.sku === 'MOCK-W-KM1'); assert.strictEqual(kmc.price.display, 224); // 160*1.4, no MAP
}));

// ---------- validation ----------
test('validation: unknown, duplicate and malformed params are rejected', withEnv({ WHEELPROS_MOCK: '1' }, async () => {
  const cases = [
    ['/x?type=wheel&company=1500', 'unknown_param', 'company'],
    ['/x?type=wheel&customer=123', 'unknown_param', 'customer'],
    ['/x?type=wheel&priceType=nip', 'unknown_param', 'priceType'],
    ['/x?type=wheel&brand=a&brand=b', 'duplicate_param', 'brand'],
    ['/x?type=rim', 'invalid_param', 'type'],
    ['/x?type=wheel&pageSize=25', 'invalid_param', 'pageSize'],
    ['/x?type=wheel&boltPattern=5x112%3Cscript%3E', 'invalid_param', 'boltPattern'],
    ['/x?type=wheel&aspectRatio=55', 'param_not_for_type', 'aspectRatio'],
    ['/x?pageSize=12', 'missing_param', 'type'],
  ];
  for (const [u, err, param] of cases) {
    const res = await call(H.search, u);
    assert.strictEqual(res.statusCode, 400, u); assert.deepStrictEqual(res.json(), { error: err, param }, u);
    assert.strictEqual(res.headers['cache-control'], 'no-store');
  }
  assert.strictEqual((await call(H.product, '/x?sku=../../auth')).statusCode, 400);
  assert.strictEqual((await call(H.vehicle, '/x?year=99')).statusCode, 400);
  assert.strictEqual((await call(H.vehicle, '/x?make=Ford')).statusCode, 400);
  assert.strictEqual((await call(H.brands, '/x?type=wheel&page=2')).statusCode, 400);
  assert.strictEqual((await call(H.health, '/x?debug=1')).statusCode, 400);
}));
test('vehicle: returns the right list for the params given (mock)', withEnv({ WHEELPROS_MOCK: '1' }, async () => {
  assert.ok(Array.isArray((await call(H.vehicle, '/x')).json().years));
  assert.ok(Array.isArray((await call(H.vehicle, '/x?year=2020')).json().makes));
  assert.ok((await call(H.vehicle, '/x?year=2020&make=Ford')).json().models.includes('F-150'));
  assert.ok(Array.isArray((await call(H.vehicle, '/x?year=2020&make=Ford&model=F-150')).json().submodels));
}));

// ---------- config / upstream behaviour ----------
test('missing env vars -> 503 not_configured; health reports without secrets', withEnv({}, async () => {
  const r = await call(H.search, '/x?type=wheel'); assert.strictEqual(r.statusCode, 503); assert.deepStrictEqual(r.json(), { error: 'not_configured' });
  const h = await call(H.health, '/x'); assert.strictEqual(h.statusCode, 200);
  assert.deepStrictEqual(h.json(), { configured: false, tokenOk: false, mock: false, markup: false });
}));
test('health never echoes credentials', withEnv({ WHEELPROS_USERNAME: 'secret-user@x.com', WHEELPROS_PASSWORD: 'Sup3rS3cret!' }, async () => {
  C._setFetch(async () => jsonResp(200, { accessToken: 'TOKVALUE123' }));
  const h = await call(H.health, '/x'); const s = h.body;
  assert.deepStrictEqual(h.json(), { configured: true, tokenOk: true, mock: false, markup: false });
  assert.ok(!s.includes('secret-user') && !s.includes('Sup3rS3cret') && !s.includes('TOKVALUE123'));
}));
test('upstream 401 -> re-auth once and retry', withEnv({ WHEELPROS_USERNAME: 'u', WHEELPROS_PASSWORD: 'p' }, async () => {
  let auths = 0, searches = 0;
  C._setFetch(async (url) => {
    if (url.endsWith('/auth/v1/authorize')) { auths++; return jsonResp(200, { accessToken: 'T' + auths }); }
    searches++; return searches === 1 ? jsonResp(401, {}) : jsonResp(200, { searchResults: [], totalCount: 0 });
  });
  const r = await call(H.search, '/x?type=tire'); assert.strictEqual(r.statusCode, 200, r.body); assert.strictEqual(auths, 2); assert.strictEqual(searches, 2);
}));
test('token is cached between requests', withEnv({ WHEELPROS_USERNAME: 'u', WHEELPROS_PASSWORD: 'p' }, async () => {
  let auths = 0;
  C._setFetch(async (url) => { if (url.endsWith('/authorize')) { auths++; return jsonResp(200, { accessToken: 'T', expiresIn: 3600 }); } return jsonResp(200, { results: [] }); });
  await call(H.search, '/x?type=wheel'); await call(H.search, '/x?type=wheel&page=2'); assert.strictEqual(auths, 1);
}));
test('upstream errors are not passed through verbatim', withEnv({ WHEELPROS_USERNAME: 'u', WHEELPROS_PASSWORD: 'p' }, async () => {
  C._setFetch(async (url) => url.endsWith('/authorize') ? jsonResp(200, { accessToken: 'T' }) : jsonResp(500, { internal: 'stack trace nip=1' }));
  const r = await call(H.search, '/x?type=wheel'); assert.strictEqual(r.statusCode, 502); assert.deepStrictEqual(r.json(), { error: 'upstream_error', status: 500 });
}));

// ---------- CORS ----------
test('CORS: allowed origins get ACAO, others do not', withEnv({ WHEELPROS_MOCK: '1', WHEELPROS_ALLOWED_ORIGINS: 'https://staging.example.com, https://foo.test/' }, async () => {
  const ok = ['https://extrememobiletires.com', 'https://www.extrememobiletires.com', 'https://yte3rp-um.myshopify.com', 'https://abc123.shopifypreview.com', 'https://x.y.shopifypreview.com', 'https://staging.example.com', 'https://foo.test'];
  const no = ['https://evil.com', 'http://extrememobiletires.com', 'https://extrememobiletires.com.evil.com', 'https://evilshopifypreview.com', 'https://shopifypreview.com.evil.io', 'null'];
  for (const o of ok) { const r = await call(H.search, '/x?type=wheel', { origin: o }); assert.strictEqual(r.headers['access-control-allow-origin'], o, o); assert.strictEqual(r.headers.vary, 'Origin'); }
  for (const o of no) { const r = await call(H.search, '/x?type=wheel', { origin: o }); assert.strictEqual(r.headers['access-control-allow-origin'], undefined, o); }
  const pre = await call(H.search, '/x', { origin: ok[0], method: 'OPTIONS' });
  assert.strictEqual(pre.statusCode, 204); assert.strictEqual(pre.headers['access-control-allow-methods'], 'GET, OPTIONS');
  assert.strictEqual((await call(H.search, '/x?type=wheel', { method: 'POST' })).statusCode, 405);
}));

test('rate limit kicks in per IP', withEnv({ WHEELPROS_MOCK: '1' }, async () => {
  let last;
  for (let i = 0; i < 95; i++) last = await call(H.brands, '/x?type=wheel', { ip: '9.9.9.9' });
  assert.strictEqual(last.statusCode, 429); assert.ok(Number(last.headers['retry-after']) > 0);
  assert.strictEqual((await call(H.brands, '/x?type=wheel', { ip: '8.8.8.8' })).statusCode, 200);
}));
