const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file=process.argv[2];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const out={};
for(const [w,name] of [[1440,'desk'],[400,'phone']]){
  const ctx=await b.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
  await p.goto('file://'+file);await p.waitForTimeout(900);
  const seen=new Set(),problems=[],texts={};
  const seed=await p.evaluate(()=>{const a=[...document.querySelectorAll('[data-view-link]')].filter(x=>!x.closest('[data-view]')).map(x=>[x.dataset.viewLink,x.dataset.param||'']);const j=[...document.querySelectorAll('#jump option')].map(o=>o.value).filter(Boolean).map(v=>{const s=v.split('/');return [s[0],s[1]||'']});return a.concat(j)});
  const queue=[['home','']].concat(seed);
  const key=(v,q)=>v+'/'+q;
  while(queue.length&&seen.size<400){
    const [v,q]=queue.shift(); if(seen.has(key(v,q)))continue; seen.add(key(v,q));
    await p.evaluate(([v,q])=>{window.ET.show(v,null,q)},[v,q]);await p.waitForTimeout(160);
    const r=await p.evaluate(()=>{
      const el=document.querySelector('[data-view]:not([hidden])');
      const h1=[...el.querySelectorAll('h1')];
      const links=[...el.querySelectorAll('[data-view-link]')].map(a=>[a.dataset.viewLink,a.dataset.param||'']);
      const dead=[...el.querySelectorAll('a[href]')].filter(a=>{const h=a.getAttribute('href');return h==='#'||h===''||h.startsWith('javascript:')}).length;
      const imgs=[...el.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length;
      return {cur:window.ET.cur,sw:document.documentElement.scrollWidth,iw:innerWidth,h1:h1.length,h1t:(h1[0]||{}).textContent||'',links,dead,imgs,len:el.innerText.length}});
    const exp=v;
    if(r.cur.view!==exp)problems.push(`${v}/${q}: routed to ${r.cur.view}`);
    if(r.sw>r.iw)problems.push(`${v}/${q}: overflow ${r.sw}>${r.iw}`);
    if(r.h1!==1)problems.push(`${v}/${q}: ${r.h1} h1`);
    if(/not found|couldn.t find|doesn.t exist/i.test(r.h1t)&&v!=='notfound')problems.push(`${v}/${q}: not-found state ("${r.h1t.trim().slice(0,40)}")`);
    if(r.dead)problems.push(`${v}/${q}: ${r.dead} dead hrefs`);
    if(r.imgs)problems.push(`${v}/${q}: ${r.imgs} imgs without alt`);
    r.links.forEach(l=>{if(!seen.has(key(l[0],l[1])))queue.push(l)});
  }
  const byView={};[...seen].forEach(k=>{const v=k.split('/')[0];byView[v]=(byView[v]||0)+1});out[name]={visited:seen.size,byView,problems,errors:errs.slice(0,8)};
}
console.log(JSON.stringify(out,null,1));await b.close();})();
