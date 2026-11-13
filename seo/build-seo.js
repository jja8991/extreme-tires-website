#!/usr/bin/env node
/* Builds crawlable static SEO pages for every service-area city.
   Usage: node seo/build-seo.js <outDir>
   Reads CITIES from site/index.html so the app and the SEO pages never drift apart. */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'), out=path.resolve(process.argv[2]||path.join(root,'out'));
const cfg=JSON.parse(fs.readFileSync(path.join(__dirname,'seo.config.json'),'utf8'));
const details=JSON.parse(fs.readFileSync(path.join(__dirname,'city-details.json'),'utf8'));
const DOMAIN=cfg.domain.replace(/\/$/,''), INDEX=!!cfg.indexable;
const ROBOTS=INDEX?'index,follow,max-image-preview:large':'noindex,nofollow';
const html=fs.readFileSync(path.join(root,'site','index.html'),'utf8');

/* ---- pull CITIES out of the app so there is one source of truth ---- */
const m=html.match(/var CITIES=\[([\s\S]*?)\n\];/); if(!m) throw new Error('CITIES not found');
const CITIES=eval('['+m[1]+']').map((c,i)=>({slug:c[0],name:c[1],county:c[2],near:c[3],i}));
const BY=Object.fromEntries(CITIES.map(c=>[c.slug,c]));
const COUNTIES=['Broward','Miami-Dade','Palm Beach'];
const cslug=co=>co.toLowerCase().replace(/ /g,'-')+'-county';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SHOP=[26.1675,-80.259]; // 7712 W Oakland Park Blvd, Sunrise (approx.; verify)
const PHONE='(954) 773-1896', TEL='+19547731896';
const url=p=>DOMAIN+p;
const w=(p,body)=>{const f=path.join(out,p,'index.html');fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,body)};

/* ---- shared page shell ---- */
const CSS=`*{box-sizing:border-box}body{margin:0;background:#0d0d0e;color:#fff;font:400 16px/1.6 Inter,"Helvetica Neue",Arial,sans-serif}
a{color:#fff}h1,h2,h3{font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;text-transform:uppercase;line-height:1.08;margin:0;letter-spacing:-.01em}
.top{background:#0d0d0e;border-bottom:3px solid #e3161b}.top .w{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 20px}
.top img{height:44px;width:auto;display:block}.top a.ph{font-weight:700;text-decoration:none}
.w{max-width:1100px;margin:0 auto;padding:0 20px}.hero{padding:44px 0 30px}.crumbs{font-size:14px;color:#a9adb4;margin-bottom:14px}.crumbs a{color:#a9adb4}
h1{font-size:clamp(28px,4.4vw,50px);font-weight:900;max-width:18em}h2{font-size:clamp(21px,2.6vw,30px);font-weight:900;margin:0 0 14px}
.lead{color:#cfd2d8;max-width:46em;margin:16px 0 0;font-size:18px}.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.b{display:inline-block;padding:14px 22px;font:800 15px Montserrat,Arial,sans-serif;text-transform:uppercase;letter-spacing:.04em;text-decoration:none;border:2px solid #fff}.b.r{background:#e3161b;border-color:#e3161b}
section.s{padding:34px 0;border-top:1px solid #26262a}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.card{background:#151517;border:1px solid #26262a;padding:18px}.card b{display:block;font:800 16px Montserrat,Arial,sans-serif;text-transform:uppercase;margin-bottom:6px}.card span,.card p{color:#b4b8bf;margin:0;font-size:15px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{background:#151517;border:1px solid #26262a;padding:9px 14px;text-decoration:none;font-size:15px}.chips a:hover{border-color:#e3161b}
details{background:#151517;border:1px solid #26262a;padding:14px 18px;margin-bottom:8px}summary{font-weight:700;cursor:pointer}details p{color:#b4b8bf;margin:10px 0 0}
.nap{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.nap div{background:#151517;padding:16px;border-left:4px solid #e3161b}.nap small{display:block;color:#8a8f98;text-transform:uppercase;letter-spacing:.1em;font-size:12px;margin-bottom:4px}
footer{padding:28px 0 90px;border-top:3px solid #e3161b;color:#a9adb4;font-size:14px}ol{padding-left:20px;color:#cfd2d8}ol li{margin-bottom:8px}`;
const shell=({title,desc,path:p,h,schema,body})=>`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta name="robots" content="${ROBOTS}"><link rel="canonical" href="${url(p)}">
<meta name="theme-color" content="#0d0d0e"><meta property="og:type" content="website"><meta property="og:site_name" content="Extreme Tires">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url(p)}">
<meta property="og:image" content="${DOMAIN}/media/mobile-experience.webp"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/media/logo-extreme-tires.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Montserrat:wght@700;800;900&display=swap">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>
<header class="top"><div class="w"><a href="/"><img src="/media/logo-extreme-tires.png" width="154" height="44" alt="Extreme Tires"></a><a class="ph" href="tel:${TEL}">Call ${PHONE}</a></div></header>
<main>${body}</main>
<footer><div class="w"><b>Extreme Tires</b> &middot; 7712 West Oakland Park Blvd, Sunrise, FL 33351 &middot; <a href="tel:${TEL}">${PHONE}</a><br>Mon&ndash;Fri 8:00 AM&ndash;6:30 PM &middot; Sat 8:00 AM&ndash;4:00 PM &middot; Sun closed<br><a href="/">Home</a> &middot; <a href="/mobile-tire-service/">All service areas</a> &middot; <a href="/#quote">Request a quote</a> &middot; <a href="/#privacy">Privacy</a></div></footer></body></html>`;

const business={"@type":["TireShop","AutoRepair"],"@id":DOMAIN+"/#business","name":"Extreme Tires","url":DOMAIN+"/","telephone":"+1-954-773-1896","priceRange":"$$",
 "image":DOMAIN+"/media/logo-extreme-tires.png",
 "address":{"@type":"PostalAddress","streetAddress":"7712 West Oakland Park Blvd","addressLocality":"Sunrise","addressRegion":"FL","postalCode":"33351","addressCountry":"US"},
 "geo":{"@type":"GeoCoordinates","latitude":SHOP[0],"longitude":SHOP[1]},
 "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"08:00","closes":"18:30"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"16:00"}]};
const crumbsLd=items=>({"@type":"BreadcrumbList","itemListElement":items.map((x,i)=>({"@type":"ListItem","position":i+1,"name":x[0],"item":url(x[1])}))});

/* ---- varied, honest copy (no invented local facts; real ones come from city-details.json) ---- */
const pick=(arr,i)=>arr[i%arr.length];
const INTRO=[
 n=>`Flat tire, worn tread or new tires on the way? Our mobile tire van comes to ${n}, so you do not lose half a day at a shop.`,
 n=>`Extreme Tires brings the tires, the balancer and a trained technician to your driveway, office or job site in ${n}.`,
 n=>`Skip the waiting room. We mount and balance tires where your vehicle is parked in ${n}, with pricing confirmed before we start.`,
 n=>`Need tires in ${n} without rearranging your day? Book the van and we do the work at your home, workplace or roadside.`];
const FAQ=[
 [n=>`Do you offer mobile tire service in ${n}, FL?`,n=>`Yes. Our van covers ${n} and the surrounding area. Request a quote or call ${PHONE} with your location and we will confirm an arrival window.`],
 [n=>`How fast can you get to ${n}?`,n=>`Timing depends on the schedule and your location in ${n}. Call or text ${PHONE} for same-day availability, or book a slot online.`],
 [n=>`What does a mobile tire visit in ${n} include?`,n=>`New tire mounting, high-speed balancing, valve stems, and hauling away your old tires, all at your location. We confirm pricing with you before any work starts.`],
 [n=>`Can I get a flat repaired at my location in ${n}?`,n=>`In most cases, yes. We patch repairable flats on site. If the damage is in the sidewall or beyond a safe repair, we will explain your options and quote a replacement.`],
 [n=>`Do you service my vehicle if I live in ${n} but need brakes or alignment?`,n=>`Alignments, brakes, suspension, TPMS and lift kits are done at our Sunrise shop at 7712 West Oakland Park Blvd. Mobile service covers tire installation, balancing, flat repair and oil changes.`]];

/* ---- geo helpers: honest straight-line distance/direction from the Sunrise shop ---- */
const rad=x=>x*Math.PI/180;
const miles=(a,b)=>{const R=3958.8,dl=rad(b[0]-a[0]),dn=rad(b[1]-a[1]);const h=Math.sin(dl/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const DIRS=['north','northeast','east','southeast','south','southwest','west','northwest'];
const bearing=(a,b)=>{const y=Math.sin(rad(b[1]-a[1]))*Math.cos(rad(b[0])),x=Math.cos(rad(a[0]))*Math.sin(rad(b[0]))-Math.sin(rad(a[0]))*Math.cos(rad(b[0]))*Math.cos(rad(b[1]-a[1]));return DIRS[Math.round(((Math.atan2(y,x)*180/Math.PI+360)%360)/45)%8]};
const list=a=>a.length<=1?a.join(''):a.length===2?a.join(' and '):a.slice(0,-1).join(', ')+', and '+a[a.length-1];
function distPhrase(c){const d=details[c.slug];if(!d||d.lat==null)return '';const mi=miles(SHOP,[d.lat,d.lon]);
  if(mi<4)return `${c.name} is just a few miles from our Sunrise shop.`;
  const r=mi<12?Math.round(mi):Math.round(mi/5)*5;return `${c.name} is roughly ${r} miles ${bearing(SHOP,[d.lat,d.lon])} of our Sunrise shop, measured in a straight line.`}
const nearest=c=>{const d=details[c.slug];return CITIES.filter(x=>x.slug!==c.slug&&details[x.slug]).map(x=>({x,m:miles([d.lat,d.lon],[details[x.slug].lat,details[x.slug].lon])})).sort((a,b)=>a.m-b.m).slice(0,5).map(o=>o.x)};
const TITLES=n=>[`Mobile Tire Service in ${n}, FL | Extreme Tires`,`Mobile Tires in ${n}, FL | Extreme Tires`,`${n} Mobile Tire Service | Extreme Tires`,`${n} Mobile Tires | Extreme Tires`];
const fit=(arr,max)=>arr.find(t=>t.length<=max)||arr[arr.length-1].slice(0,max);
function localParas(c){const d=details[c.slug],n=c.name,co=c.county+' County',i=c.i;const P=[];
  P.push(distPhrase(c)+' '+d.note);
  const A=d.areas||[],R=d.roads||[];
  if(A.length){const t=[`Around ${n} we work near ${list(A)}.`,`Typical stops in ${n} include ${list(A)}.`,`Customers in ${n} book us at homes, offices and parking lots near ${list(A)}.`];P.push(pick(t,i))}
  if(R.length){const t=[`Main routes through the area include ${list(R)}.`,`We plan routes around ${list(R)}.`,`Getting there usually means ${list(R)}.`];P.push(pick(t,i+1))}
  return P}
const CITY_FAQ=(c)=>{const d=details[c.slug],n=c.name,co=c.county+' County';const A=d.areas||[],R=d.roads||[];
  const out=[];
  out.push([`Which parts of ${n} do you cover?`,`We serve ${n} in ${co}${A.length?`, including the areas around ${list(A)}`:''}${R.length?`. We plan around ${list(R.slice(0,3))}`:''}. Call ${PHONE} with your address and we will confirm.`]);
  out.push([`How far is ${n} from your shop?`,`${distPhrase(c)} Alignments, brakes and other larger jobs are done at 7712 West Oakland Park Blvd in Sunrise.`]);
  return out};

function cityPage(c){
  const n=c.name, co=c.county+' County', d=details[c.slug];
  if(!d) throw new Error('missing city-details for '+c.slug);
  const near=nearest(c);
  const title=fit(TITLES(n),60);
  const a0=(d.areas&&d.areas[0])||(d.roads&&d.roads[0])||co;
  const dcands=[
    `Mobile tire service in ${n}, FL near ${a0}: tire installation, balancing, flat repair and oil changes at your location. Call ${PHONE}.`,
    `Mobile tire service in ${n}, FL near ${a0}: installation, balancing, flat repair and oil changes on site. Call ${PHONE}.`,
    `Mobile tire service in ${n}, FL: installation, balancing, flat repair and oil changes at your location. Call ${PHONE}.`,
    `Mobile tire service in ${n}, FL. We come to you for tires, balancing and flat repair. Call ${PHONE}.`];
  const desc=fit(dcands,155);
  const faq=[CITY_FAQ(c)[0],CITY_FAQ(c)[1],FAQ[c.i%4],FAQ[(c.i+1)%4],FAQ[4]].filter((x,i,a)=>a.indexOf(x)===i);
  const local=localParas(c).map(t=>`<p>${esc(t)}</p>`).join('');
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / <a href="/mobile-tire-service/">Service areas</a> / <a href="/mobile-tire-service/${cslug(c.county)}/">${esc(co)}</a> / ${esc(n)}</div>
<h1>Mobile tire service in ${esc(n)}, FL</h1>
<p class="lead">${esc(pick(INTRO,c.i)(n))} We serve ${esc(co)} from our Sunrise, FL shop.</p>
<div class="btns"><a class="b r" href="/#mobile">Book mobile service</a><a class="b" href="/#quote">Request a quote</a><a class="b" href="tel:${TEL}">Call ${PHONE}</a></div></div>
<section class="s"><div class="w"><h2>Serving ${esc(n)} from Sunrise</h2><div style="color:#cfd2d8;max-width:46em">${local}</div></div></section>
<section class="s"><div class="w"><h2>What we do at your location in ${esc(n)}</h2><div class="grid">
<a class="card" href="/#service/tire-installation" style="text-decoration:none"><b>Tire installation</b><span>New tires mounted on your vehicle, old ones hauled away. Typically 30&ndash;60 minutes.</span></a>
<a class="card" href="/#service/tire-balancing" style="text-decoration:none"><b>High-speed balancing</b><span>The same balancing equipment as the shop, built into the van. About 10&ndash;15 minutes.</span></a>
<a class="card" href="/#service/tire-repair" style="text-decoration:none"><b>Flat repair &amp; roadside</b><span>Repairable flats and leaks patched where you are. Typically 15&ndash;30 minutes.</span></a>
<a class="card" href="/#service/oil-changes" style="text-decoration:none"><b>Oil changes</b><span>A mobile oil change while you work. Fleets welcome. About 20&ndash;40 minutes.</span></a></div></div></section>
<section class="s"><div class="w"><h2>How mobile service works in ${esc(n)}</h2><ol>
<li><b>Tell us what you need.</b> Request a quote or call ${PHONE} with your vehicle, tire size if you know it, and your location.</li>
<li><b>Pick a time.</b> We confirm pricing and an arrival window that fits your day.</li>
<li><b>We come to you.</b> Our technician brings the tires and equipment to ${esc(n)} and finishes the job on site.</li></ol></div></section>
<section class="s"><div class="w"><h2>Bigger jobs at our Sunrise shop</h2><p class="lead" style="margin-top:0;font-size:16px">Alignments, brakes, suspension, TPMS, lift kits and custom wheels are done at our Sunrise shop. Browse <a href="/#services">all auto services</a> or <a href="/#financing">shop now, pay later</a>.</p>
<div class="nap" style="margin-top:18px"><div><small>Address</small>7712 West Oakland Park Blvd<br>Sunrise, FL 33351</div><div><small>Hours</small>Mon&ndash;Fri 8:00 AM&ndash;6:30 PM<br>Sat 8:00 AM&ndash;4:00 PM<br>Sun closed</div><div><small>Phone</small><a href="tel:${TEL}">${PHONE}</a></div></div></div></section>
<section class="s"><div class="w"><h2>${esc(n)} tire service FAQ</h2>${faq.map(f=>`<details><summary>${esc(typeof f[0]==='function'?f[0](n):f[0])}</summary><p>${esc(typeof f[1]==='function'?f[1](n):f[1])}</p></details>`).join('')}</div></section>
<section class="s"><div class="w"><h2>Nearby areas we serve</h2><div class="chips">${near.map(x=>`<a href="/mobile-tire-service/${x.slug}/">Mobile tires in ${esc(x.name)}</a>`).join('')}<a href="/mobile-tire-service/${cslug(c.county)}/">All of ${esc(co)}</a><a href="/mobile-tire-service/">All service areas</a></div></div></section>`;
  const fq=x=>[typeof x[0]==='function'?x[0](n):x[0],typeof x[1]==='function'?x[1](n):x[1]];
  const schema={"@context":"https://schema.org","@graph":[
    Object.assign({},business,{"areaServed":[{"@type":"City","name":n+", FL"},{"@type":"AdministrativeArea","name":co+", FL"}]}),
    {"@type":"Service","name":`Mobile tire service in ${n}, FL`,"serviceType":"Mobile tire installation, balancing, flat repair and oil change","provider":{"@id":DOMAIN+"/#business"},"areaServed":{"@type":"City","name":n+", FL"},"url":url(`/mobile-tire-service/${c.slug}/`)},
    {"@type":"FAQPage","mainEntity":faq.map(f=>{const q=fq(f);return {"@type":"Question","name":q[0],"acceptedAnswer":{"@type":"Answer","text":q[1]}}})},
    crumbsLd([["Home","/"],["Service areas","/mobile-tire-service/"],[co,`/mobile-tire-service/${cslug(c.county)}/`],[n,`/mobile-tire-service/${c.slug}/`]])]};
  w(`mobile-tire-service/${c.slug}`,shell({title,desc,path:`/mobile-tire-service/${c.slug}/`,schema,body}));
}
function countyPage(co){
  const list=CITIES.filter(c=>c.county===co), p=`/mobile-tire-service/${cslug(co)}/`, name=co+' County', cd=(details._counties||{})[co]||{};
  const title=fit([`Mobile Tire Service in ${name}, FL | Extreme Tires`,`Mobile Tires in ${name}, FL | Extreme Tires`],60);
  const desc=fit([`Mobile tire service across ${name}, FL: ${list.length} cities served from Sunrise. Tire installation, balancing, flat repair and oil changes on site.`,`Mobile tire service in ${name}, FL: ${list.length} cities served. Installation, balancing and flat repair at your location.`],155);
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / <a href="/mobile-tire-service/">Service areas</a> / ${esc(name)}</div><h1>Mobile tire service in ${esc(name)}, FL</h1>
<p class="lead">Our van serves ${list.length} cities across ${esc(name)}, bringing tires, balancing and a trained technician to your location. Pick your city below, or call ${PHONE}.</p>
<div class="btns"><a class="b r" href="/#mobile">Book mobile service</a><a class="b" href="/#quote">Request a quote</a><a class="b" href="tel:${TEL}">Call ${PHONE}</a></div></div>
${cd.note?`<section class="s"><div class="w"><h2>About service in ${esc(name)}</h2><p class="lead" style="margin-top:0;font-size:16px">${esc(cd.note)}</p></div></section>`:''}
<section class="s"><div class="w"><h2>Cities we serve in ${esc(name)}</h2><div class="grid">${list.map(c=>{const d=details[c.slug]||{};const a=(d.areas||[])[0];return `<a class="card" href="/mobile-tire-service/${c.slug}/" style="text-decoration:none"><b>${esc(c.name)}</b><span>${a?'Near '+esc(a)+'.':esc(name)+'.'}</span></a>`}).join('')}</div></div></section>
<section class="s"><div class="w"><h2>Other counties</h2><div class="chips">${COUNTIES.filter(x=>x!==co).map(x=>`<a href="/mobile-tire-service/${cslug(x)}/">${x} County</a>`).join('')}<a href="/mobile-tire-service/">All service areas</a></div></div></section>`;
  const schema={"@context":"https://schema.org","@graph":[Object.assign({},business,{"areaServed":{"@type":"AdministrativeArea","name":name+", FL"}}),crumbsLd([["Home","/"],["Service areas","/mobile-tire-service/"],[name,p]])]};
  w(p.slice(1),shell({title,desc,path:p,schema,body}));
}
function hub(){
  const title='Mobile Tire Service Areas, South Florida | Extreme Tires';
  const desc=`Extreme Tires mobile tire service covers ${CITIES.length} cities from Homestead to West Palm Beach. Find your city and book the van.`;
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / Service areas</div><h1>Mobile tire service areas</h1>
<p class="lead">From Homestead to West Palm Beach, our mobile tire van serves ${CITIES.length} cities across Miami-Dade, Broward and Palm Beach counties, working from our shop at 7712 West Oakland Park Blvd in Sunrise. Find your city below.</p>
<div class="btns"><a class="b r" href="/#mobile">Book mobile service</a><a class="b" href="tel:${TEL}">Call ${PHONE}</a></div></div>
${COUNTIES.map(co=>`<section class="s"><div class="w"><h2><a href="/mobile-tire-service/${cslug(co)}/" style="text-decoration:none">${co} County</a></h2><div class="chips">${CITIES.filter(c=>c.county===co).map(c=>`<a href="/mobile-tire-service/${c.slug}/">${esc(c.name)}</a>`).join('')}</div></div></section>`).join('')}`;
  const schema={"@context":"https://schema.org","@graph":[Object.assign({},business,{"areaServed":COUNTIES.map(c=>({"@type":"AdministrativeArea","name":c+" County, FL"}))}),crumbsLd([["Home","/"],["Service areas","/mobile-tire-service/"]])]};
  w('mobile-tire-service',shell({title,desc,path:'/mobile-tire-service/',schema,body}));
}

fs.mkdirSync(out,{recursive:true});
hub(); COUNTIES.forEach(countyPage); CITIES.forEach(cityPage);

/* ---- sitemap + robots ---- */
const today=new Date().toISOString().slice(0,10);
const urls=['/','/mobile-tire-service/',...COUNTIES.map(co=>`/mobile-tire-service/${cslug(co)}/`),...CITIES.map(c=>`/mobile-tire-service/${c.slug}/`)];
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+urls.map(u=>`<url><loc>${url(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')+`\n</urlset>\n`);
fs.writeFileSync(path.join(out,'robots.txt'),INDEX?`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`:`User-agent: *\nDisallow: /\n`);

/* ---- app shell: robots meta + canonical + crawlable link into the city pages ---- */
const ip=path.join(out,'index.html');
if(fs.existsSync(ip)){
  let s=fs.readFileSync(ip,'utf8');
  s=s.replace('<meta name="theme-color"',`<meta name="robots" content="${ROBOTS}">\n<link rel="canonical" href="${DOMAIN}/">\n<meta name="theme-color"`);
  s=s.replace('</body>',`<nav aria-label="Service areas" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden"><a href="/mobile-tire-service/">Mobile tire service areas</a>${COUNTIES.map(co=>`<a href="/mobile-tire-service/${cslug(co)}/">${co} County</a>`).join('')}</nav></body>`);
  fs.writeFileSync(ip,s);
}

/* ---- QA check: prints a table of problems; exits 1 if any ---- */
function check(){
  const probs=[], add=(pg,issue)=>probs.push([pg,issue]);
  const pages=['mobile-tire-service',...COUNTIES.map(co=>'mobile-tire-service/'+cslug(co)),...CITIES.map(c=>'mobile-tire-service/'+c.slug)];
  const exists=new Set(pages.map(p=>'/'+p+'/')); const titles={},descs={},locals={};
  const BAD=/\b(cure[sd]?|treat(s|ed|ment)?|heal(s|ing|th)?|medical|disease|cbd|thc|hemp|cannabis|doctor|diagnos\w*|therap\w*|pain relief|guarantee[sd]?|best in|#1|cheapest|lowest price)\b/i;
  for(const p of pages){
    const f=path.join(out,p,'index.html'); if(!fs.existsSync(f)){add(p,'missing file');continue}
    const h=fs.readFileSync(f,'utf8'), pg='/'+p+'/';
    const dec=x=>x.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
    const t=dec((h.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||''), d=dec((h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'');
    if(!t)add(p,'no title'); else if(t.length>60)add(p,`title ${t.length}>60`);
    if(!d)add(p,'no description'); else if(d.length>155)add(p,`description ${d.length}>155`);
    (titles[t]=titles[t]||[]).push(p); (descs[d]=descs[d]||[]).push(p);
    const h1=(h.match(/<h1[ >]/g)||[]).length; if(h1!==1)add(p,`${h1} H1 tags`);
    const can=(h.match(/<link rel="canonical" href="([^"]*)"/)||[])[1]; if(can!==url(pg))add(p,`canonical ${can}`);
    if(!/<meta name="robots" content="/.test(h))add(p,'no robots meta');
    const ld=(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)||[])[1]; let j;
    try{j=JSON.parse(ld)}catch(e){add(p,'JSON-LD invalid');j=null}
    if(j){const g=j['@graph']||[], ty=g.map(x=>[].concat(x['@type']).join('|')).join(',');
      if(!/TireShop/.test(ty))add(p,'no LocalBusiness/TireShop schema');
      if(!/BreadcrumbList/.test(ty))add(p,'no breadcrumb schema');
      const bc=g.find(x=>x['@type']==='BreadcrumbList'); if(bc&&bc.itemListElement.some(i=>!i.item.startsWith(DOMAIN)))add(p,'breadcrumb URL off-domain');
      if(p.split('/').length===2&&p!=='mobile-tire-service'&&CITIES.some(c=>'mobile-tire-service/'+c.slug===p)&&!/Service/.test(ty))add(p,'no Service schema');}
    const links=[...h.matchAll(/<a [^>]*href="(\/mobile-tire-service\/[^"]*)"/g)].map(x=>x[1]);
    for(const l of links) if(!exists.has(l))add(p,'broken internal link '+l);
    const isCity=CITIES.some(c=>'mobile-tire-service/'+c.slug===p);
    if(isCity){ const nb=new Set(links.filter(l=>l!==pg&&CITIES.some(c=>l==='/mobile-tire-service/'+c.slug+'/'))); if(nb.size<3)add(p,'<3 neighbor city links');
      const cs=CITIES.find(c=>'mobile-tire-service/'+c.slug===p); if(!links.includes('/mobile-tire-service/'+cslug(cs.county)+'/'))add(p,'no county link'); if(!links.includes('/mobile-tire-service/'))add(p,'no hub link');
      const lm=(h.match(/Serving [^<]*from Sunrise<\/h2>([\s\S]*?)<\/section>/)||[])[1]||''; (locals[lm]=locals[lm]||[]).push(p);
      const words=h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length; if(words<380)add(p,`thin: ${words} words`);}
    const txt=h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g,' '); const bm=txt.match(BAD); if(bm)add(p,'compliance term: '+bm[0]);
  }
  for(const [k,v] of Object.entries(titles)) if(v.length>1)add(v.join(', '),'duplicate title');
  for(const [k,v] of Object.entries(descs)) if(v.length>1)add(v.join(', '),'duplicate description');
  for(const [k,v] of Object.entries(locals)) if(v.length>1)add(v.join(', '),'identical local-detail section');
  for(const c of CITIES){const d=details[c.slug]; if(!d||!d.note||d.lat==null)add('mobile-tire-service/'+c.slug,'missing city-details'); else if(!(d.areas&&d.areas.length)&&!(d.roads&&d.roads.length))add('mobile-tire-service/'+c.slug,'details has no areas/roads (thin local content)')}
  const sm=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8'); for(const p of pages) if(!sm.includes(url('/'+p+'/')))add(p,'not in sitemap');
  console.log(`\nSEO CHECK: ${pages.length} pages checked, ${probs.length} problem(s)`);
  if(probs.length){const w1=Math.max(...probs.map(x=>x[0].length)); console.log('PAGE'.padEnd(w1)+'  PROBLEM'); probs.forEach(x=>console.log(x[0].padEnd(w1)+'  '+x[1]));}
  return probs.length;
}

console.log(`SEO build: ${CITIES.length} city pages, ${COUNTIES.length} county pages, hub, sitemap (${urls.length} URLs), indexable=${INDEX}`);
if(check()>0) process.exitCode=1;
