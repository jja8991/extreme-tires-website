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
 "geo":{"@type":"GeoCoordinates","latitude":26.0928,"longitude":-80.238},
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

function cityPage(c){
  const n=c.name, co=c.county+' County', d=details[c.slug]||{};
  const near=c.near.map(s=>BY[s]).filter(Boolean);
  const title=`Mobile Tire Service in ${n}, FL | Extreme Tires`;
  const desc=`Mobile tire service in ${n}, FL: tire installation, balancing, flat repair and oil changes at your location. Call ${PHONE} or request a quote.`.slice(0,158);
  const faq=[FAQ[c.i%5],FAQ[(c.i+1)%5],FAQ[(c.i+2)%5],FAQ[4]].filter((x,i,a)=>a.indexOf(x)===i);
  const local=[
    d.zips&&d.zips.length?`<p>ZIP codes we serve in ${esc(n)} include ${esc(d.zips.join(', '))}.</p>`:'',
    d.areas&&d.areas.length?`<p>Popular spots we service: ${esc(d.areas.join(', '))}.</p>`:'',
    d.note?`<p>${esc(d.note)}</p>`:''].join('');
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / <a href="/mobile-tire-service/">Service areas</a> / <a href="/mobile-tire-service/${cslug(c.county)}/">${esc(co)}</a> / ${esc(n)}</div>
<h1>Mobile tire service in ${esc(n)}, FL</h1>
<p class="lead">${esc(pick(INTRO,c.i)(n))} We serve ${esc(co)} from our Sunrise, FL shop.</p>
<div class="btns"><a class="b r" href="/#mobile">Book mobile service</a><a class="b" href="/#quote">Request a quote</a><a class="b" href="tel:${TEL}">Call ${PHONE}</a></div></div>
<section class="s"><div class="w"><h2>What we do at your location in ${esc(n)}</h2><div class="grid">
<a class="card" href="/#service/tire-installation" style="text-decoration:none"><b>Tire installation</b><span>New tires mounted on your vehicle, old ones hauled away. Typically 30&ndash;60 minutes.</span></a>
<a class="card" href="/#service/tire-balancing" style="text-decoration:none"><b>High-speed balancing</b><span>The same balancing equipment as the shop, built into the van. About 10&ndash;15 minutes.</span></a>
<a class="card" href="/#service/tire-repair" style="text-decoration:none"><b>Flat repair &amp; roadside</b><span>Repairable flats and leaks patched where you are. Typically 15&ndash;30 minutes.</span></a>
<a class="card" href="/#service/oil-changes" style="text-decoration:none"><b>Oil changes</b><span>A mobile oil change while you work. Fleets welcome. About 20&ndash;40 minutes.</span></a></div>${local?`<div style="margin-top:18px;color:#cfd2d8">${local}</div>`:''}</div></section>
<section class="s"><div class="w"><h2>How mobile service works in ${esc(n)}</h2><ol>
<li><b>Tell us what you need.</b> Request a quote or call ${PHONE} with your vehicle, tire size if you know it, and your location.</li>
<li><b>Pick a time.</b> We confirm pricing and an arrival window that fits your day.</li>
<li><b>We come to you.</b> Our technician brings the tires and equipment to ${esc(n)} and finishes the job on site.</li></ol></div></section>
<section class="s"><div class="w"><h2>Bigger jobs at our Sunrise shop</h2><p class="lead" style="margin-top:0;font-size:16px">Alignments, brakes, suspension, TPMS, lift kits and custom wheels are done at our Sunrise shop, a short trip from ${esc(n)} for many ${esc(co)} drivers. Browse <a href="/#services">all auto services</a> or <a href="/#financing">shop now, pay later</a>.</p>
<div class="nap" style="margin-top:18px"><div><small>Address</small>7712 West Oakland Park Blvd<br>Sunrise, FL 33351</div><div><small>Hours</small>Mon&ndash;Fri 8:00 AM&ndash;6:30 PM<br>Sat 8:00 AM&ndash;4:00 PM<br>Sun closed</div><div><small>Phone</small><a href="tel:${TEL}">${PHONE}</a></div></div></div></section>
<section class="s"><div class="w"><h2>${esc(n)} tire service FAQ</h2>${faq.map(f=>`<details><summary>${esc(f[0](n))}</summary><p>${esc(f[1](n))}</p></details>`).join('')}</div></section>
<section class="s"><div class="w"><h2>Nearby areas we serve</h2><div class="chips">${near.map(x=>`<a href="/mobile-tire-service/${x.slug}/">Mobile tires in ${esc(x.name)}</a>`).join('')}<a href="/mobile-tire-service/${cslug(c.county)}/">All of ${esc(co)}</a><a href="/mobile-tire-service/">All service areas</a></div></div></section>`;
  const schema={"@context":"https://schema.org","@graph":[
    Object.assign({},business,{"areaServed":[{"@type":"City","name":n+", FL"},{"@type":"AdministrativeArea","name":co+", FL"}]}),
    {"@type":"Service","name":`Mobile tire service in ${n}, FL`,"serviceType":"Mobile tire installation, balancing, flat repair and oil change","provider":{"@id":DOMAIN+"/#business"},"areaServed":{"@type":"City","name":n+", FL"},"url":url(`/mobile-tire-service/${c.slug}/`)},
    {"@type":"FAQPage","mainEntity":faq.map(f=>({"@type":"Question","name":f[0](n),"acceptedAnswer":{"@type":"Answer","text":f[1](n)}}))},
    crumbsLd([["Home","/"],["Service areas","/mobile-tire-service/"],[co,`/mobile-tire-service/${cslug(c.county)}/`],[n,`/mobile-tire-service/${c.slug}/`]])]};
  w(`mobile-tire-service/${c.slug}`,shell({title,desc,path:`/mobile-tire-service/${c.slug}/`,schema,body}));
}
function countyPage(co){
  const list=CITIES.filter(c=>c.county===co), p=`/mobile-tire-service/${cslug(co)}/`, name=co+' County';
  const title=`Mobile Tire Service in ${name}, FL | Extreme Tires`;
  const desc=`Mobile tire service across ${name}, FL: ${list.length} cities served. Tire installation, balancing, flat repair and oil changes at your location.`.slice(0,158);
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / <a href="/mobile-tire-service/">Service areas</a> / ${esc(name)}</div><h1>Mobile tire service in ${esc(name)}, FL</h1>
<p class="lead">Our van serves ${list.length} cities across ${esc(name)}, bringing tires, balancing and a trained technician to your location. Pick your city below, or call ${PHONE}.</p>
<div class="btns"><a class="b r" href="/#mobile">Book mobile service</a><a class="b" href="/#quote">Request a quote</a><a class="b" href="tel:${TEL}">Call ${PHONE}</a></div></div>
<section class="s"><div class="w"><h2>Cities we serve in ${esc(name)}</h2><div class="chips">${list.map(c=>`<a href="/mobile-tire-service/${c.slug}/">${esc(c.name)}</a>`).join('')}</div></div></section>`;
  const schema={"@context":"https://schema.org","@graph":[Object.assign({},business,{"areaServed":{"@type":"AdministrativeArea","name":name+", FL"}}),crumbsLd([["Home","/"],["Service areas","/mobile-tire-service/"],[name,p]])]};
  w(p.slice(1),shell({title,desc,path:p,schema,body}));
}
function hub(){
  const title='Mobile Tire Service Areas: Miami-Dade, Broward & Palm Beach | Extreme Tires';
  const desc=`Extreme Tires mobile tire service covers ${CITIES.length} cities from Homestead to West Palm Beach. Find your city and book the van.`;
  const body=`<div class="w hero"><div class="crumbs"><a href="/">Home</a> / Service areas</div><h1>Mobile tire service areas</h1>
<p class="lead">From Homestead to West Palm Beach, our mobile tire van serves ${CITIES.length} cities across Miami-Dade, Broward and Palm Beach counties. Find your city below.</p>
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
console.log(`SEO build: ${CITIES.length} city pages, ${COUNTIES.length} county pages, hub, sitemap (${urls.length} URLs), indexable=${INDEX}`);
