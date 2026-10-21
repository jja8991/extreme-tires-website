// ===== Agent D: gallery, cities, city, legal, sitemap, notfound =====
var esc=ET.esc;
var $=function(id){return document.getElementById(id)};
var PHONE='(954) 773-1896';

/* ---------- shared data ---------- */
var CITIES=[
 ['sunrise','Sunrise','Broward',['plantation','tamarac','lauderhill','weston','davie']],
 ['plantation','Plantation','Broward',['sunrise','davie','lauderhill','fort-lauderdale']],
 ['tamarac','Tamarac','Broward',['sunrise','lauderhill','coral-springs','plantation']],
 ['lauderhill','Lauderhill','Broward',['sunrise','tamarac','plantation','fort-lauderdale']],
 ['weston','Weston','Broward',['davie','sunrise','pembroke-pines','miramar']],
 ['davie','Davie','Broward',['plantation','weston','pembroke-pines','sunrise']],
 ['coral-springs','Coral Springs','Broward',['tamarac','sunrise','plantation','boca-raton']],
 ['pembroke-pines','Pembroke Pines','Broward',['miramar','davie','hollywood','weston']],
 ['fort-lauderdale','Fort Lauderdale','Broward',['plantation','lauderhill','hollywood','davie']],
 ['hollywood','Hollywood','Broward',['pembroke-pines','fort-lauderdale','miramar','miami-gardens']],
 ['miramar','Miramar','Broward',['pembroke-pines','hollywood','weston','miami-gardens']],
 ['boca-raton','Boca Raton','Palm Beach',['coral-springs','tamarac','sunrise']],
 ['miami-gardens','Miami Gardens','Miami-Dade',['miramar','hollywood','hialeah','pembroke-pines']],
 ['hialeah','Hialeah','Miami-Dade',['miami-gardens','hollywood','miramar']]
];
var CBY={}; CITIES.forEach(function(c,i){CBY[c[0]]={slug:c[0],name:c[1],county:c[2],near:c[3],i:i}});
var COUNTIES=['Broward','Palm Beach','Miami-Dade'];
var SVC_LINKS=[['brake-repair','Brake Repair'],['wheel-alignment','Wheel Alignment'],['tire-installation','Tire Installation'],['tire-repair','Tire Repair'],['tire-balancing','Tire Balancing'],['tire-rotation','Tire Rotation'],['suspension-repair','Suspension Repair'],['oil-changes','Oil Changes'],['tpms-service','TPMS Service'],['custom-wheels','Custom Wheels'],['lift-kits','Lift Kits']];
var BRANDS=[['michelin','Michelin'],['bfgoodrich','BFGoodrich'],['uniroyal','Uniroyal'],['cooper','Cooper'],['firestone','Firestone'],['bridgestone','Bridgestone'],['hankook','Hankook'],['hercules','Hercules'],['kumho','Kumho'],['general','General'],['continental','Continental'],['pirelli','Pirelli'],['nexen','Nexen'],['nitto','Nitto'],['toyo','Toyo'],['falken','Falken'],['yokohama','Yokohama'],['ironman','Ironman'],['ohtsu','OHTSU']];
function vl(view,label,param,cls){return '<a href="#'+view+(param?'/'+param:'')+'" data-view-link="'+view+'"'+(param?' data-param="'+param+'"':'')+(cls?' class="'+cls+'"':'')+'>'+label+'</a>'}

/* register jump-menu entries */
[['gallery','News & Gallery'],['cities','Service Area'],['terms','Terms of Use'],['privacy','Privacy Policy'],['accessibility','Accessibility'],['sitemap','Sitemap'],['notfound','404 Page']].forEach(function(p){ET.pages.push({id:p[0],label:p[1]})});
ET.pages.push({id:'city',param:'sunrise',label:'City: Sunrise'});
ET.pages.push({id:'city',param:'davie',label:'City: Davie'});

/* ---------- Gallery ---------- */
var glFilter='all', glShown=8, glFocus=null, glList=[], glIdx=0;
var glExtra=[['50% 20%','x'],['10% 30%','x'],['95% 40%','x'],['60% 10%','x'],['25% 90%','x'],['85% 90%','x'],['40% 30%','x'],['70% 50%','x']];
function glItems(){
  var base=ET.GALLERY.items.slice(), out=base.slice();
  for(var r=0;r<2;r++){base.forEach(function(it,k){
    var pp=glExtra[(k+r*3)%glExtra.length][0];
    out.push({id:it.id+'-'+(r+2),file:it.file,category:it.category,tags:it.tags,isVideo:r?false:it.isVideo,caption:it.caption,pos:pp,sample:true});
  })}
  return out;
}
var GL=glItems();
var SHAPES=[''];
function glVisible(){return GL.filter(function(i){return glFilter==='all'||i.category===glFilter||(i.tags||[]).indexOf(glFilter)>-1})}
function glRender(){
  var rows=glVisible(), part=rows.slice(0,glShown);
  $('gl-grid').innerHTML=part.map(function(i,k){
    var sh=SHAPES[k%SHAPES.length];
    return '<button type="button" class="gl-tile '+sh+'" data-i="'+k+'" aria-label="'+esc(i.caption)+'"><img src="'+i.file+'" alt="" loading="lazy" style="object-position:'+esc(i.pos||'50% 50%')+'">'+
      '<span class="badge">Sample</span>'+
      (i.isVideo?'<span class="vid"><svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="#fff"/></svg></span>':'')+
      '<span class="cap">'+esc(i.caption)+'</span></button>';
  }).join('')||'<p class="gl-empty">No posts in this category yet.</p>';
  $('gl-more').parentNode.hidden=glShown>=rows.length;
}
$('gl-chips').innerHTML=ET.IGCATS.map(function(c){return '<button type="button" data-f="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+esc(c[1])+'</button>'}).join('');
$('gl-chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;glFilter=b.dataset.f;glShown=8;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});glRender()});
$('gl-more').addEventListener('click',function(){var before=glShown;glShown+=8;glRender();
  var t=$('gl-grid').querySelectorAll('.gl-tile')[before];if(t)t.focus({preventScroll:false})});
var lb=$('gl-lb');
function lbShow(){var it=glList[glIdx];if(!it)return;var im=$('gl-lb-img');im.src=it.file;im.alt=it.caption;im.style.objectPosition='50% 50%';
  $('gl-lb-cap').textContent=it.caption;$('gl-lb-cnt').textContent=(glIdx+1)+' / '+glList.length+' · sample';
  $('gl-lb-link').href=it.permalink||'https://www.instagram.com/extremetires'}
function lbOpen(k,trigger){glList=glVisible().slice(0,glShown);glIdx=k;glFocus=trigger;lbShow();lb.classList.add('open');lb.setAttribute('aria-hidden','false');$('gl-lb-x').focus()}
function lbClose(){if(!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');if(glFocus&&document.body.contains(glFocus))glFocus.focus()}
function lbStep(d){glIdx=(glIdx+d+glList.length)%glList.length;lbShow()}
$('gl-grid').addEventListener('click',function(e){var t=e.target.closest('.gl-tile');if(t)lbOpen(+t.dataset.i,t)});
$('gl-lb-x').addEventListener('click',lbClose);
$('gl-lb-prev').addEventListener('click',function(){lbStep(-1)});
$('gl-lb-next').addEventListener('click',function(){lbStep(1)});
lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
document.addEventListener('keydown',function(e){
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape'){e.preventDefault();lbClose()}
  else if(e.key==='ArrowLeft'){e.preventDefault();lbStep(-1)}
  else if(e.key==='ArrowRight'){e.preventDefault();lbStep(1)}
  else if(e.key==='Tab'){
    var f=[].slice.call(lb.querySelectorAll('button,a[href]')),a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
    else if(f.indexOf(document.activeElement)<0){e.preventDefault();a.focus()}
  }
});
/* tabs */
function glTab(name,focus){
  ['gallery','news'].forEach(function(n){
    var t=$('gl-tab-'+n),on=n===name;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;$('gl-panel-'+n).hidden=!on;
    if(on&&focus)t.focus();
  });
}
document.querySelector('.gl-tabs').addEventListener('click',function(e){var b=e.target.closest('[data-tab]');if(b)glTab(b.dataset.tab)});
document.querySelector('.gl-tabs').addEventListener('keydown',function(e){
  var k=e.key;if(k!=='ArrowLeft'&&k!=='ArrowRight'&&k!=='Home'&&k!=='End')return;e.preventDefault();
  glTab(k==='ArrowLeft'||k==='Home'?'gallery':'news',true);
});
ET.onShow.gallery=function(p){lbClose();glTab(p==='news'?'news':'gallery');glRender()};
glRender();

/* ---------- Cities index ---------- */
$('ci-groups').innerHTML=COUNTIES.map(function(co){
  var rows=CITIES.filter(function(c){return c[2]===co});
  return '<section class="ci-county" id="ci-'+co.toLowerCase().replace(/[^a-z]/g,'')+'" data-county="'+co+'" aria-labelledby="ci-h-'+co.charAt(0)+'"><h2 id="ci-h-'+co.charAt(0)+'">'+esc(co)+' County <small>'+rows.length+' '+(rows.length>1?'cities':'city')+'</small></h2><div class="ci-grid">'+
    rows.map(function(c){return '<a class="ci-card" href="#city/'+c[0]+'" data-view-link="city" data-param="'+c[0]+'"><b>'+esc(c[1])+'</b><span>Mobile tire service in '+esc(c[1])+'</span></a>'}).join('')+'</div></section>';
}).join('');
$('ci-form').addEventListener('submit',function(e){
  e.preventDefault();
  var z=$('ci-zip').value.trim(),c=ET.county(z),r=$('ci-res');r.className='zipres';
  document.querySelectorAll('.ci-county').forEach(function(s){s.classList.remove('hit')});
  if(c===null){r.textContent='Enter a 5-digit ZIP code.';r.classList.add('no');return}
  if(c){r.textContent='Yes, we cover '+z+' in '+c+' County. Pick your city below, or request a quote.';r.classList.add('ok');
    var g=document.querySelector('.ci-county[data-county="'+c+'"]');if(g)g.classList.add('hit')}
  else{r.textContent='That ZIP is outside our regular route. Call '+PHONE+' and we will see what we can do.';r.classList.add('no')}
});

/* ---------- City pages ---------- */
var INTROS=[
 'Flat tire, worn-out set, or just no time to sit in a waiting room? Our mobile van can meet you in {C}: at home, at the office or wherever you are parked.',
 'If you are in {C}, Extreme Tires can bring tire installation, balancing and flat repair to your driveway, workplace or job site.',
 'Extreme Tires serves {C} from our Sunrise shop with a mobile tire van, so a tire appointment can happen where your vehicle already is.',
 'Living or working in {C}? Book a mobile tire visit and let an Extreme tech come to you, or stop by the Sunrise shop for work that needs a lift or alignment rack.'
];
var FAQQ1=['Do you come to {C}?','Is mobile tire service available in {C}?','Can a tech come to me in {C}?'];
var FAQA1=[
 'Yes. {C} is part of our mobile service area in {K} County. Enter your ZIP on the mobile service page to confirm your address, or call '+PHONE+'.',
 'Yes, {C} is within the {K} County area we serve. Check your ZIP on the mobile service page to confirm, or call us at '+PHONE+'.',
 'That is what the van is for. We serve {C} and the rest of {K} County; confirm your ZIP on the mobile page or call '+PHONE+'.'
];
var FAQQ2=['What can the mobile van do?','Which services can you do at my location?','What can you handle on site?'];
var FAQA2='The van handles tire installation, high-speed balancing, flat and roadside repairs, and oil changes. Work that needs a lift or alignment equipment, such as alignments, brakes and suspension, is done at our Sunrise shop.';
var FAQQ3=['How do I book?','How do I set up a visit?','What is the easiest way to book?'];
var FAQA3=[
 'Request a quote online or call '+PHONE+'. Tell us your vehicle, your tire size if you know it, and your ZIP, and we will go over the details and pick a time with you.',
 'Start with a quote request or give us a call at '+PHONE+'. We will confirm your vehicle, location and an arrival window with you.',
 'Use the quote form or call '+PHONE+' (Mon&ndash;Fri 8:00 AM&ndash;6:30 PM, Sat 8:00 AM&ndash;4:00 PM). We will confirm the details and a time that works.'
];
function sub(s,c){return s.replace(/\{C\}/g,esc(c.name)).replace(/\{K\}/g,esc(c.county))}
function cityCrumbs(label){return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#cities" data-view-link="cities">Service Area</a><span>/</span><span>'+esc(label)+'</span></nav>'}
function cityPage(c){
  var intro=c.slug==='sunrise'?'Sunrise is home base: our shop is at 7712 West Oakland Park Blvd, and our mobile tire service covers Sunrise too. Come to us, or have the van come to you.':sub(INTROS[c.i%4],c);
  var mob=[['install','Tire installation','New tires mounted at your location.','tire-installation'],['balance','High-speed balancing','Balanced on site with the van&rsquo;s equipment.','tire-balancing'],['repair','Flat &amp; roadside repair','Flat repairs without a trip to the shop.','tire-repair'],['oil','Oil changes','A routine oil change while you stay put.','oil-changes']];
  var q=c.i;
  var steps=[['Tell us what you need','Request a quote or call '+PHONE+' with your vehicle, tire size if you know it, and your ZIP.'],['Pick a time','We confirm the details and an arrival window that works for you.'],['We come to you','Our tech brings the tires and equipment to your location in '+esc(c.name)+' and does the work there.']];
  return '<div class="phead"><div class="wrap">'+cityCrumbs(c.name)+'<h1>Mobile tire service in '+esc(c.name)+', FL</h1><p>'+intro+'</p>'+
    '<span class="sample-note" style="justify-self:start">Local details to add per city: neighborhoods, landmarks, ZIPs served</span>'+
    '<div class="btns" style="margin-top:6px"><a class="btn btn-red" href="#quote" data-view-link="quote">Get a quote</a><a class="btn btn-ghost" href="#mobile" data-view-link="mobile">Mobile service details</a></div></div></div>'+
  '<section class="d-sec alt" aria-labelledby="cy-h-svc"><div class="wrap"><div class="eyebrow">At your location</div><h2 class="d-h2" id="cy-h-svc">What we do at your location</h2><p class="d-lead">The van brings the tools to you in '+esc(c.name)+'.</p><div class="cy-svcs">'+
    mob.map(function(m){return '<a class="cy-svc" href="#service/'+m[3]+'" data-view-link="service" data-param="'+m[3]+'">'+ET.icon(m[0])+'<b>'+m[1]+'</b><span>'+m[2]+'</span></a>'}).join('')+'</div></div></section>'+
  '<section class="d-sec" aria-labelledby="cy-h-how"><div class="wrap"><div class="eyebrow">Simple</div><h2 class="d-h2" id="cy-h-how">How it works</h2><ol class="cy-steps">'+
    steps.map(function(s){return '<li><b>'+s[0]+'</b><p>'+s[1]+'</p></li>'}).join('')+'</ol></div></section>'+
  '<section class="d-sec" style="padding-top:0"><div class="wrap"><div class="cy-shop"><div><div class="eyebrow">Shop services</div><h2 style="margin-top:8px">Bigger jobs at our Sunrise shop</h2>'+
    '<p>Some work needs a lift or an alignment rack. For '+esc(c.name)+' customers that is a visit to our shop.</p><div class="tags"><span>Hunter alignment</span><span>Brakes</span><span>Suspension</span><span>TPMS</span><span>Lift &amp; leveling kits</span><span>Custom wheel sourcing</span></div>'+
    '<div class="btns" style="margin-top:20px"><a class="btn btn-ghost" href="#services" data-view-link="services">See all services</a></div></div>'+
    '<div class="vis"><div><small>Address</small><b>7712 West Oakland Park Blvd<br>Sunrise, FL 33351</b></div><div><small>Hours</small><b>Mon&ndash;Fri 8:00 AM&ndash;6:30 PM<br>Sat 8:00 AM&ndash;4:00 PM<br>Sun closed</b></div><div><small>Phone</small><b>'+PHONE+'</b></div></div></div></div></section>'+
  '<section class="d-sec faq alt" aria-labelledby="cy-h-faq" style="padding-block:56px"><div class="wrap"><div class="eyebrow">Questions</div><h2 class="d-h2" id="cy-h-faq" style="margin-bottom:20px">'+esc(c.name)+' FAQ</h2>'+
    '<details><summary>'+sub(FAQQ1[q%3],c)+'</summary><p>'+sub(FAQA1[(q+1)%3],c)+'</p></details>'+
    '<details><summary>'+FAQQ2[(q+1)%3]+'</summary><p>'+FAQA2+'</p></details>'+
    '<details><summary>'+FAQQ3[(q+2)%3]+'</summary><p>'+FAQA3[q%3]+'</p></details></div></section>'+
  '<section class="d-sec" aria-labelledby="cy-h-near"><div class="wrap"><div class="eyebrow">Nearby</div><h2 class="d-h2" id="cy-h-near">Nearby areas</h2><p class="d-lead">We also serve these cities.</p><div class="cy-near">'+
    c.near.map(function(s){var n=CBY[s];return '<a href="#city/'+s+'" data-view-link="city" data-param="'+s+'">'+esc(n.name)+'</a>'}).join('')+'<a href="#cities" data-view-link="cities">All service areas</a></div></div></section>'+
  '<section class="cy-final" aria-label="Book"><div class="wrap"><div><h2>Ready when you are in '+esc(c.name)+'</h2><p>Get a quote online or look at mobile service details first. Prefer to talk? Call '+PHONE+'.</p></div><div class="btns"><a class="btn btn-dark" href="#quote" data-view-link="quote">Request a quote</a><a class="btn btn-ghost" href="#mobile" data-view-link="mobile">Book mobile service</a></div></div></section>';
}
ET.onShow.city=function(p){
  var c=CBY[p],root=$('cy-root');
  if(!c){root.innerHTML='<div class="phead"><div class="wrap">'+cityCrumbs('Not found')+'<h1>City not found</h1></div></div><div class="wrap cy-nf"><p class="d-lead">We could not find that city page.</p><a class="btn btn-red" href="#cities" data-view-link="cities">See all service areas</a></div>';return}
  root.innerHTML=cityPage(c);
};

/* ---------- Legal: scrollspy + privacy choice ---------- */
function spy(view){
  var sec=document.querySelectorAll('#view-'+view+' .lg-doc section'),links=document.querySelectorAll('#view-'+view+' .lg-toc a');
  function on(){var y=window.scrollY+140,cur=null;sec.forEach(function(s){if(s.getBoundingClientRect().top+window.scrollY<=y)cur=s.id});
    links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)})}
  window.addEventListener('scroll',function(){if(!document.getElementById('view-'+view).hidden)on()},{passive:true});
}
['terms','privacy','accessibility'].forEach(spy);
$('pv-sw').addEventListener('click',function(){
  var on=this.getAttribute('aria-checked')!=='true';this.setAttribute('aria-checked',String(on));
  $('pv-status').textContent=on?'Opt-out set (sample). Prototype only, nothing was saved.':'Opt-out cleared (sample). Prototype only, nothing was saved.';
});
ET.onShow.privacy=function(p){if(p==='choices'||p==='privacy-choices'){setTimeout(function(){var t=$('privacy-choices');if(t)t.scrollIntoView()},30)}};

/* ---------- Sitemap ---------- */
function li(h,sub){return '<li'+(sub?' class="sub"':'')+'>'+h+'</li>'}
var groups=[
 ['Main',[li(vl('home','Home')),li(vl('quote','Request a Quote'))]],
 ['Tires &amp; Wheels',[li(vl('tires','Tires')),li(vl('wheels','Wheels')),li(vl('commercial','Commercial Tires')),li(vl('brands','Tire Brands'))].concat(BRANDS.map(function(b){return li(vl('brand',b[1],b[0]),1)}))],
 ['Services',[li(vl('services','Auto Services'))].concat(SVC_LINKS.map(function(s){return li(vl('service',s[1],s[0]),1)}),[li(vl('schedule','Schedule a Repair')),li(vl('advisor','Tire Advisor'))])],
 ['Mobile &amp; Areas',[li(vl('mobile','Mobile Tire Service')),li(vl('cities','Service Area'))].concat(CITIES.map(function(c){return li(vl('city',esc(c[1]),c[0]),1)}))],
 ['Resources',[li(vl('tips','Tips &amp; Guides'))]],
 ['About &amp; Support',[li(vl('about','About Us')),li(vl('locations','Locations')),li(vl('reviews','Reviews')),li(vl('coupons','Coupons')),li(vl('financing','Financing')),li(vl('gallery','News &amp; Gallery')),li(vl('contact','Contact Us'))]],
 ['Legal',[li(vl('terms','Terms of Use')),li(vl('privacy','Privacy Policy')),li(vl('accessibility','Accessibility')),li(vl('sitemap','Sitemap'))]]
];
$('sm-grid').innerHTML=groups.map(function(g,i){return '<section class="sm-grp" aria-labelledby="sm-h'+i+'"><h2 id="sm-h'+i+'">'+g[0]+'</h2><ul>'+g[1].join('')+'</ul></section>'}).join('');
$('sm-count').textContent=document.querySelectorAll('#sm-grid a').length+' links';

/* ---------- 404 ---------- */
$('nf-form').addEventListener('submit',function(e){
  e.preventDefault();var u=$('nf-url').value.trim(),er=$('nf-err'),ok=$('nf-ok');ok.textContent='';
  if(!u){er.textContent='Tell us which page or link did not work.';$('nf-url').focus();return}
  er.textContent='';ok.textContent='Thanks. Prototype only, nothing was sent. The live site will pass this to the team.';
  this.reset();
});
