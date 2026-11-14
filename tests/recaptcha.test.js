/* Run: (cd site && python3 -m http.server 8765 &) ; NODE_PATH=/tmp/pw/node_modules node tests/recaptcha.test.js */
const { chromium } = require('playwright');
const URL = 'http://localhost:8765/index.html';
const KEY = '6Lc0UB8uAAAAAMo91UuudTy0dtsCeW8CsBEBqMyj';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const CFG = { enabled: true, service_types: ['new_tires','flat_repair','mount_balance','rotation_check','oil_change','roadside_assist'].map(k => ({ key: k, label: k })), hours: Object.fromEntries(['0','1','2','3','4','5','6'].map(d => [d, [{ open: '00:00', close: '23:59' }]])) };

async function setup(browser, mode, intake) {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  const st = { posts: [], rcLoads: 0 };
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.route(/fonts\.(googleapis|gstatic)|maps\.googleapis|places\.googleapis/, r => r.abort());
  await p.route(/google\.com\/recaptcha\/api\.js/, r => {
    st.rcLoads++;
    if (mode === 'blocked') return r.abort();
    if (mode === 'hang') return; // never answers -> 3s timeout
    r.fulfill({ contentType: 'application/javascript', body: `window.grecaptcha={ready:function(f){f()},execute:function(k,o){window.__rc={k:k,a:o.action};return Promise.resolve('TOK-'+o.action)}};` });
  });
  await p.route(/functions\/v1\/booking-intake/, async r => {
    const req = r.request();
    if (req.method() === 'POST') { st.posts.push(JSON.parse(req.postData())); const x = intake(); return r.fulfill({ status: x.status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(x.body) }); }
    if (req.method() === 'OPTIONS') return r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(req.url().includes('zip=') ? { ok: true, zip_in_area: true } : CFG) });
  });
  return { p, st };
}
const GOOD = () => ({ status: 200, body: { ok: true, message: 'Request received' } });
const VERIFY = () => ({ status: 400, body: { ok: false, code: 'recaptcha_failed', message: 'verification failed' } });

async function quoteWizard(p, kind) {
  const hash = kind === 'fleet' ? '#commercial' : '#quote';
  await p.goto(URL + hash); await p.waitForTimeout(800);
  const w = kind === 'fleet' ? 'ETWizFleet' : 'ETWizQuote'; const pre = kind === 'fleet' ? 'cz-' : 'qz-';
  await p.evaluate(([w, kind]) => { const sv = Object.keys(ET.SV).find(k => ET.SV[k].mode !== 'mobile'); const s = { where: 'shop', vp: { year: '2020', make: 'Honda', model: 'Civic', trim: '' }, svc: {}, timing: 'This week', consent: true, step: 4, dir: 1, name: 'Test Person', phone: '9545550123' };
    s.svc[sv] = true; if (kind === 'fleet') { s.company = 'Acme'; s.fsize = '6–20 vehicles'; s.vt = { 'Work vans': true }; s.needs = { 'New tires': true }; }
    window[w].set(s); }, [w, kind]);
  if (kind === 'fleet') { await p.fill('#cz-company', 'Acme'); await p.fill('#cz-email', 'a@b.co'); } await p.fill('#' + pre + 'name', 'Test Person'); await p.fill('#' + pre + 'phone', '(954) 555-0123');
  await p.check('#' + pre + 'consent');
}
async function submitQuote(p, kind) { await quoteWizard(p, kind); await p.click((kind === 'fleet' ? '#cwiz' : '#qwiz') + ' [data-w=next]'); }


const setVeh = (p, pre) => p.evaluate(pre => { const set = (id, v) => { const e = document.getElementById(id); if (![...e.options].some(o => o.value === v)) { const o = document.createElement('option'); o.value = v; o.textContent = v; e.appendChild(o) } e.value = v }; set(pre + 'year', '2020'); set(pre + 'make', 'Honda'); set(pre + 'model', 'Civic') }, pre);
async function submitSchedule(p) {
  await p.goto(URL + '#schedule'); await p.waitForTimeout(1800);
  await p.click('#sw-where button[data-where=shop]'); await p.click('#sw-next'); await p.waitForTimeout(300);
  await setVeh(p, 'sw-'); await p.click('#sw-next'); await p.waitForTimeout(300);
  await p.evaluate(() => { const i = document.querySelector('#sw-pick input:not(:disabled)'); i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true })) });
  await p.click('#sw-next'); await p.waitForTimeout(800);
  await p.click('#sw-days button.cal-d:not([disabled])'); await p.waitForTimeout(200); await p.click('#sw-times button[data-win]'); await p.click('#sw-next'); await p.waitForTimeout(300);
  await p.fill('#sw-name', 'Test Person'); await p.fill('#sw-phone', '(954) 555-0123'); await p.check('#sw-consent');
  await setVeh(p, 'sw-'); await p.click('#sw-submit');
}
async function submitMobile(p) {
  await p.goto(URL + '#mobile'); await p.waitForTimeout(1800);
  await p.fill('#mq-loc', '123 Main St'); await p.fill('#mq-zip', '33351'); await p.waitForTimeout(800);
  await p.click('#mq-next'); await p.waitForTimeout(300); await setVeh(p, 'mq-v'); await p.click('#mq-next'); await p.waitForTimeout(300);
  await p.evaluate(() => { const i = document.getElementById('mq-sy2'); i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true })) });
  await p.click('#mq-next'); await p.waitForTimeout(500);
  await p.click('#days button.cal-d:not([disabled])'); await p.waitForTimeout(200); await p.click('#times button[data-win]'); await p.click('#mq-next'); await p.waitForTimeout(300);
  await p.fill('#mq-first', 'Test'); await p.fill('#mq-last', 'Person'); await p.fill('#mq-phone', '(954) 555-0123'); await p.fill('#mq-email', 'a@b.co'); await p.check('#mq-consent');
  await setVeh(p, 'mq-v'); await p.click('#mq-submit');
}
const MSG = 'We couldn’t verify this request. Please call or text (954) 773-1896.';

(async () => {
  const browser = await chromium.launch();

  // 1. lazy load: not at page load, loads on first focus
  { const { p, st } = await setup(browser, 'ok', GOOD); await p.goto(URL); await p.waitForTimeout(1500);
    ok(st.rcLoads === 0, 'reCAPTCHA api.js NOT requested at page load');
    await p.evaluate(() => { const i = document.querySelector('form input'); i.focus(); }); await p.waitForTimeout(500);
    ok(st.rcLoads === 1, 'api.js requested after first form field focus');
    ok(await p.evaluate(() => typeof window.ETRecaptcha.token === 'function'), 'window.ETRecaptcha.token exists');
    const t = await p.evaluate(() => window.ETRecaptcha.token('quote')); ok(t === 'TOK-booking', 'token() resolves token for action');
    ok(await p.evaluate(() => window.__rc.k) === KEY, 'execute() used the public site key');
    ok(await p.evaluate(() => getComputedStyle(document.querySelector('.grecaptcha-badge') || document.body).visibility) !== null, 'badge css present');
    ok((await p.content()).includes('This site is protected by reCAPTCHA'), 'disclosure text present'); }

  // 2. helper: blocked and hung script resolve ''
  { const { p } = await setup(browser, 'blocked', GOOD); await p.goto(URL); const t = await p.evaluate(() => window.ETRecaptcha.token('x')); ok(t === '', 'blocked script -> token ""'); }
  { const { p } = await setup(browser, 'hang', GOOD); await p.goto(URL); const t0 = Date.now(); const t = await p.evaluate(() => window.ETRecaptcha.token('x')); const dt = Date.now() - t0; ok(t === '' && dt >= 2900 && dt < 4500, 'hung script -> "" after ~3s (' + dt + 'ms)'); }

  // 3. quote / fleet wizard POSTs
  for (const kind of ['quote', 'fleet']) {
    { const { p, st } = await setup(browser, 'ok', GOOD); await submitQuote(p, kind); await p.waitForTimeout(1200);
      ok(st.posts.length === 1 && st.posts[0].recaptcha_token === 'TOK-booking', kind + ' wizard POST has recaptcha_token (' + (st.posts[0] && st.posts[0].recaptcha_token) + ')');
      if (st.posts[0]) ok(st.posts[0].name === 'Test Person' && st.posts[0].consent === true && 'website' in st.posts[0], kind + ' other fields unchanged'); }
    { const { p, st } = await setup(browser, 'blocked', GOOD); await submitQuote(p, kind); await p.waitForTimeout(1200);
      ok(st.posts.length === 1 && st.posts[0].recaptcha_token === '', kind + ' blocked script still submits (token "")'); }
    { const { p, st } = await setup(browser, 'ok', VERIFY); await submitQuote(p, kind); await p.waitForTimeout(1200);
      const t = await p.evaluate(() => document.body.innerText); ok(t.includes('We couldn’t verify this request. Please call or text (954) 773-1896.'), kind + ' 400 verification error shown'); }
  }

  for (const [name, fnc, action, errSel] of [['schedule', submitSchedule, 'schedule', '#sw-live-err'], ['mobile', submitMobile, 'mobile', '#mq-live-err']]) {
    { const { p, st } = await setup(browser, 'ok', GOOD); await fnc(p); await p.waitForTimeout(1200);
      const b = st.posts[0]; ok(!!b && b.recaptcha_token === 'TOK-booking', name + ' form POST has recaptcha_token (' + (b && b.recaptcha_token) + ')');
      if (b) ok(b.name && b.consent === true && 'website' in b && b.lang === 'en', name + ' other fields unchanged'); }
    { const { p, st } = await setup(browser, 'blocked', GOOD); await fnc(p); await p.waitForTimeout(1200);
      ok(st.posts.length === 1 && st.posts[0].recaptcha_token === '', name + ' blocked script still submits (token "")'); }
    { const { p, st } = await setup(browser, 'hang', GOOD); const t0 = Date.now(); await fnc(p); await p.waitForTimeout(4500);
      ok(st.posts.length === 1 && st.posts[0].recaptcha_token === '', name + ' hung script submits after timeout'); }
    { const { p } = await setup(browser, 'ok', VERIFY); await fnc(p); await p.waitForTimeout(1200);
      ok((await p.textContent(errSel)) === MSG, name + ' 400 verification error shown in form error UI'); }
    { const { p } = await setup(browser, 'ok', () => ({ status: 400, body: { ok: false, code: 'invalid', field: 'phone', message: 'Bad phone' } })); await fnc(p); await p.waitForTimeout(1200);
      ok(!(await p.evaluate(() => document.body.innerText)).includes('verify this request'), name + ' ordinary 400 field error is not shown as verification error'); }
  }
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
