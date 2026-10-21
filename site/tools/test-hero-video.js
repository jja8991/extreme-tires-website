const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const file='file://'+process.argv[2];
const errs=[];
// 1) normal visitor: iframe gets the right URL, photo stays until playback starts, then video fades in
let ctx=await b.newContext({viewport:{width:390,height:844}});let p=await ctx.newPage();
p.on('pageerror',e=>errs.push(e.message));
await p.goto(file);await p.waitForTimeout(1500);
const s1=await p.evaluate(()=>({src:document.getElementById('hv-frame').src,live:document.querySelector('.hero-media').classList.contains('live'),op:getComputedStyle(document.querySelector('.hv')).opacity}));
console.log('1 after load   :',JSON.stringify({live:s1.live,opacity:s1.op,src:s1.src.replace(/^https:\/\/www\.youtube-nocookie\.com\/embed\//,'…/')}));
const fire=(d)=>p.evaluate(d=>{const f=document.getElementById('hv-frame');window.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(d),source:f.contentWindow}))},d);
await fire({event:'infoDelivery',info:{playerState:1}});await p.waitForTimeout(1100);
console.log('2 state=playing:',await p.evaluate(()=>({live:document.querySelector('.hero-media').classList.contains('live'),op:getComputedStyle(document.querySelector('.hv')).opacity})));
await fire({event:'onStateChange',info:2});await p.waitForTimeout(300);
console.log('3 state=paused :',await p.evaluate(()=>document.querySelector('.hero-media').classList.contains('live')),'(false = photo fallback)');
// spoofed message from another window must be ignored
await p.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{data:JSON.stringify({event:'infoDelivery',info:{playerState:1}}),source:window})));
console.log('4 spoofed msg  :',await p.evaluate(()=>document.querySelector('.hero-media').classList.contains('live')),'(false = ignored)');
// leaving home stops the player; returning restarts it
await p.evaluate(()=>window.ET.show('tires',null,''));await p.waitForTimeout(300);
console.log('5 on Tires page: src =',JSON.stringify(await p.evaluate(()=>document.getElementById('hv-frame').getAttribute('src'))),'(null = stopped)');
await p.evaluate(()=>window.ET.show('home',null,''));await p.waitForTimeout(400);
console.log('6 back on Home : restarted =',await p.evaluate(()=>!!document.getElementById('hv-frame').getAttribute('src')));
// 2) reduced motion: no video at all
ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});p=await ctx.newPage();
await p.goto(file);await p.waitForTimeout(1500);
console.log('7 reduced-motion: src =',JSON.stringify(await p.evaluate(()=>document.getElementById('hv-frame').getAttribute('src'))),'(null = photo only)');
console.log('page errors:',errs);
await b.close();})();
