// Front-end form tests (Playwright). Serves site/index.html over http, mocks /api/*. Run: node tests/ui-forms.test.js
const { chromium } = require(process.env.PW_PATH || '/opt/node22/lib/node_modules/playwright');
const URL_ = process.env.SITE_URL || 'http://localhost:8765/index.html';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const calls = []; let mode = 'ok';
  await p.route('**/api/**', async r => { const u = new URL(r.request().url()).pathname; calls.push({ u, body: JSON.parse(r.request().postData() || '{}') });
    if (mode === 'down') return r.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"error":"not_configured"}' });
    r.fulfill({ status: 200, contentType: 'application/json', body: u.endsWith('booking') ? '{"ok":true,"confirmationSms":true}' : '{"ok":true,"email":true,"sms":true}' }); });
  await p.goto(URL_); await p.waitForTimeout(800);
  const txt = id => p.$eval(id, e => e.textContent);

  // ---- home signup, prototype mode (live=false): never calls the API
  await p.fill('#c-phone', '(954) 555-0123');
  await p.click('#club-form button[type=submit]'); ok((await txt('#club-msg')).includes('Check the text box'), 'club: phone without SMS consent is blocked');
  await p.check('#c-sms'); await p.click('#club-form button[type=submit]');
  ok((await txt('#club-msg')).startsWith('Prototype only'), 'club: prototype message when live=false'); ok(calls.length === 0, 'club: no API call while live=false');

  // ---- live mode
  await p.evaluate(() => { ET.CONFIG.live = true; });
  await p.click('#club-form button[type=submit]'); await p.waitForTimeout(300);
  const c1 = calls.find(c => c.u.endsWith('subscribe')); ok(!!c1, 'club: calls /api/subscribe when live');
  ok(c1 && c1.body.consentSms === true && c1.body.consentEmail === false && /receive texts from Extreme Tires/.test(c1.body.consentText) && c1.body.source === 'home-club' && c1.body.website === '', 'club: payload has consent flags + exact consent text + source + empty honeypot');
  ok((await txt('#club-msg')).includes('on the list'), 'club: success message');
  mode = 'down'; await p.click('#club-form button[type=submit]'); await p.waitForTimeout(300);
  ok((await txt('#club-msg')).includes('(954) 773-1896'), 'club: 503 not_configured shows call-us fallback'); mode = 'ok';
  await p.fill('#c-email', 'bad'); await p.click('#club-form button[type=submit]'); ok((await txt('#club-msg')).includes('name@example.com'), 'club: invalid email rejected');
  await p.fill('#c-email', ''); 

  // ---- booking wizard
  calls.length = 0; await p.evaluate(() => document.getElementById('start').scrollIntoView());
  await p.click('#wiz-body button[data-need]'); await p.click('#wiz-next');
  await p.fill('#w-veh', '2021 Jeep Gladiator'); await p.click('#wiz-next');
  await p.click('#wiz-body button[data-where="shop"]'); await p.click('#wiz-next');
  await p.click('#wiz-body button[data-win]'); await p.click('#wiz-next');
  await p.fill('#w-name', 'Test Person'); await p.fill('#w-phone', '(954) 555-0123'); await p.check('#w-texts'); await p.click('#wiz-next'); await p.waitForTimeout(400);
  const bk = calls.find(c => c.u.endsWith('booking')); ok(!!bk, 'wizard: calls /api/booking on finish');
  ok(bk && bk.body.smsConsent === true && /appointment request/.test(bk.body.consentText) && /^\d{4}-\d\d-\d\dT\d\d:00:00-0[45]:00$/.test(bk.body.startISO) && bk.body.source === 'wizard', 'wizard: payload has consent, ET-offset startISO, source (startISO=' + (bk && bk.body.startISO) + ')');
  ok((await txt('#wiz-status')).includes('confirmation text'), 'wizard: status shows confirmation text sent');
  ok((await p.$eval('#wiz-body h3', e => e.textContent)).startsWith('Request received'), 'wizard: heading says request received (not "booked")');
  ok(!(await p.$eval('#wiz-body', e => e.textContent)).includes('out-the-door price'), 'wizard: no price promise in timeline');

  // wizard without text consent => smsConsent false
  calls.length = 0; await p.click('#wiz-restart');
  await p.click('#wiz-body button[data-need]'); await p.click('#wiz-next'); await p.fill('#w-veh', 'Civic'); await p.click('#wiz-next');
  await p.click('#wiz-body button[data-where="shop"]'); await p.click('#wiz-next'); await p.click('#wiz-body button[data-win]'); await p.click('#wiz-next');
  await p.fill('#w-name', 'No Text'); await p.fill('#w-phone', '9545550123'); await p.click('#wiz-next'); await p.waitForTimeout(300);
  const bk2 = calls.find(c => c.u.endsWith('booking')); ok(bk2 && bk2.body.smsConsent === false && bk2.body.consentText === '', 'wizard: unchecked box sends smsConsent=false and no consent text');

  // ---- prototype mode: wizard sends nothing
  await p.evaluate(() => { ET.CONFIG.live = false; }); calls.length = 0; await p.click('#wiz-restart');
  await p.click('#wiz-body button[data-need]'); await p.click('#wiz-next'); await p.fill('#w-veh', 'Civic'); await p.click('#wiz-next');
  await p.click('#wiz-body button[data-where="shop"]'); await p.click('#wiz-next'); await p.click('#wiz-body button[data-win]'); await p.click('#wiz-next');
  await p.fill('#w-name', 'Proto'); await p.fill('#w-phone', '9545550123'); await p.click('#wiz-next'); await p.waitForTimeout(300);
  ok(calls.length === 0 && (await txt('#wiz-status')).startsWith('Prototype only'), 'wizard: nothing sent when live=false');

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
