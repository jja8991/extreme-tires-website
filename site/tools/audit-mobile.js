const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, file, label] = process.argv;
const pages=['home','tires','mobile','quote','wheels','services','service/brake-repair','schedule','advisor','commercial','brands','brand/nitto','tips','tip/how-to-read-a-tire-size','coupons','financing','reviews','about','locations','contact','gallery','cities','city/sunrise','terms','privacy','accessibility','sitemap','notfound'];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',reducedMotion:'reduce'});
const p=await ctx.newPage();await p.goto('file://'+file);await p.waitForTimeout(900);
await p.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
const lay=await p.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,dpr:devicePixelRatio,bodyFont:getComputedStyle(document.body).fontSize}));
console.log(`[${label}] layout viewport = ${lay.innerWidth}px (390 is correct; 980 means "desktop site")`);
if(lay.innerWidth>500){await p.screenshot({path:`shots/mob-${label}-home.png`});await b.close();return;}
const small={},taps={};let total=0,pTexts=[];
for(const pg of pages){const [v,q]=pg.split('/');
  await p.evaluate(([v,q])=>window.ET.show(v,null,q||''),[v,q]);await p.waitForTimeout(160);
  const r=await p.evaluate(()=>{
    const root=document.querySelector('[data-view]:not([hidden])');
    const scopes=[document.querySelector('header.nav'),root,document.querySelector('footer'),document.querySelector('.util')].filter(Boolean);
    const vis=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const small=[],taps=[],ps=[];
    const key=e=>e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/)[0]:'');
    scopes.forEach(sc=>{
      const w=document.createTreeWalker(sc,NodeFilter.SHOW_TEXT);let n;
      while(n=w.nextNode()){const t=n.textContent.trim();if(t.length<2)continue;const e=n.parentElement;if(!e||!vis(e)||e.closest('.proto,svg,script,style'))continue;
        const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<14)small.push([key(e),fs,t.slice(0,28)]);
        if(e.tagName==='P'&&t.length>40)ps.push(fs)}
      sc.querySelectorAll('a,button,select,summary,input:not([type=checkbox]):not([type=radio]):not([type=hidden]),textarea,label.chk,.opt,.pick label').forEach(e=>{
        if(!vis(e)||e.closest('.proto')||e.classList.contains('hp'))return;const r=e.getBoundingClientRect();
        const inline=e.tagName==='A'&&getComputedStyle(e).display==='inline'&&e.closest('p,li,.hf-note,.crumbs,.legal');
        if(!inline&&(r.height<44||r.width<44))taps.push([key(e),Math.round(r.width)+'x'+Math.round(r.height),(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,22)])})});
    return {small,taps,ps}});
  r.small.forEach(([k,fs,t])=>{const kk=k+' @'+fs+'px';(small[kk]=small[kk]||{n:0,ex:t,pages:new Set()});small[kk].n++;small[kk].pages.add(pg)});
  r.taps.forEach(([k,sz,t])=>{const kk=k+' '+sz;(taps[kk]=taps[kk]||{n:0,ex:t,pages:new Set()});taps[kk].n++;taps[kk].pages.add(pg)});
  r.ps.forEach(x=>pTexts.push(x));total++;
}
const top=(o,n)=>Object.entries(o).sort((a,b)=>b[1].pages.size-a[1].pages.size||b[1].n-a[1].n).slice(0,n).map(([k,v])=>`  ${k.padEnd(34)} ${String(v.pages.size).padStart(2)} pages  e.g. "${v.ex}"`).join('\n');
pTexts.sort((a,b)=>a-b);
console.log(`pages audited: ${total}   paragraph font median: ${pTexts[Math.floor(pTexts.length/2)]}px (min ${pTexts[0]}px)`);
console.log('\nTEXT SMALLER THAN 14px (class @size, pages affected):\n'+top(small,24));
console.log('\nTAP TARGETS UNDER 44px (class WxH):\n'+top(taps,18));
console.log('\ndistinct small-text rules:',Object.keys(small).length,'| distinct small tap targets:',Object.keys(taps).length);
await b.close();})();
