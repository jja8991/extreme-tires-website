const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const pages=['home','tires','mobile','quote','wheels','services','service/brake-repair','service/lift-kits','schedule','advisor','commercial','brands','brand/nitto','tips','tip/how-to-read-a-tire-size','coupons','financing','reviews','about','locations','contact','gallery','cities','city/sunrise','city/davie','terms','privacy','accessibility','sitemap','notfound'];
const out=[];
for(const [w,tag] of [[1440,'desk'],[400,'phone']]){
 const ctx=await b.newContext({viewport:{width:w,height:w>800?900:844},reducedMotion:'reduce'});const p=await ctx.newPage();
 await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
 await p.addStyleTag({content:'.proto{display:none!important}'});
 const dups=await p.evaluate(()=>{const c={};document.querySelectorAll('[id]').forEach(e=>c[e.id]=(c[e.id]||0)+1);return Object.keys(c).filter(k=>c[k]>1)});
 if(dups.length)out.push(tag+' DUP IDS '+dups.join(','));
 for(const pg of pages){const [v,q]=pg.split('/');
  await p.evaluate(([v,q])=>window.ET.show(v,null,q||''),[v,q]);await p.waitForTimeout(220);
  const r=await p.evaluate(()=>{const el=document.querySelector('[data-view]:not([hidden])');const vh=innerHeight;
    const red=[...el.querySelectorAll('.btn-red')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.top<vh&&r.bottom>0}).length;
    const nav=document.querySelector('.nav-cta').getBoundingClientRect().width>0;
    const bands=el.querySelectorAll('.cta-band').length;
    const redTotal=[...el.querySelectorAll('.btn-red')].filter(x=>x.getBoundingClientRect().width>0).length;
    return {red,bands,redTotal,h1:(el.querySelector('h1')||{}).textContent||''}});
  const exp=!['home','quote','schedule','contact','notfound','terms','privacy','accessibility','sitemap'].includes(v);
  if(tag==='desk'&&r.red>1)out.push(`${tag} ${pg}: ${r.red} red buttons on first screen`);
  if(r.bands!==(exp?1:0))out.push(`${tag} ${pg}: ${r.bands} closing bands (expected ${exp?1:0})`);
 }
}
console.log(out.length?out.join('\n'):'ALL CLEAN: no duplicate ids, 1 closing band where expected, <=1 red button per first screen');
await b.close();})();
