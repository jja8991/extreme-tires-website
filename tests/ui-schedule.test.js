// Schedule form test (Playwright). Needs the site served at http://localhost:8765 (cd site && python3 -m http.server 8765). Run: node tests/ui-schedule.test.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await (await b.newContext({viewport:{width:1200,height:900},reducedMotion:'reduce'})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const calls=[];await p.route('**/api/**',r=>{calls.push(JSON.parse(r.request().postData()||'{}'));r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"confirmationSms":false}'})});
await p.goto('http://localhost:8765/index.html#schedule');await p.waitForTimeout(900);await p.evaluate(()=>{ET.CONFIG.live=true});
await p.evaluate(()=>document.querySelector('#sc-pick input').click());await p.fill('#sc-year','2021');await p.fill('#sc-make','Jeep');await p.fill('#sc-model','Gladiator');
await p.click('#sc-where button[data-where="shop"]');await p.click('#sc-wins button >> nth=0');await p.fill('#sc-name','Test Person');await p.fill('#sc-phone','9545550123');
await p.click('#sc-form button[type=submit]');await p.waitForTimeout(500);
console.log('calls',calls.length,calls[0]&&{src:calls[0].source,sms:calls[0].smsConsent,iso:calls[0].startISO,svc:calls[0].service});
console.log('status',await p.$eval('#sc-status',e=>e.textContent),'errs',errs);await b.close()})()
