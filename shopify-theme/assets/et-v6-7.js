try{(function(){
// ===== Agent D: gallery, cities, city, legal, sitemap, notfound =====
var esc=ET.esc;
var $=function(id){return document.getElementById(id)};
var PHONE='(954) 773-1896';

/* ---------- shared data ---------- */
var CITIES=[
 ['homestead','Homestead','Miami-Dade',['florida-city','cutler-bay']],
 ['florida-city','Florida City','Miami-Dade',['homestead','cutler-bay','palmetto-bay']],
 ['cutler-bay','Cutler Bay','Miami-Dade',['florida-city','palmetto-bay','homestead','pinecrest']],
 ['palmetto-bay','Palmetto Bay','Miami-Dade',['cutler-bay','pinecrest','florida-city','south-miami']],
 ['pinecrest','Pinecrest','Miami-Dade',['palmetto-bay','south-miami','cutler-bay','coral-gables']],
 ['south-miami','South Miami','Miami-Dade',['pinecrest','coral-gables','palmetto-bay','west-miami']],
 ['coral-gables','Coral Gables','Miami-Dade',['south-miami','west-miami','pinecrest','sweetwater']],
 ['west-miami','West Miami','Miami-Dade',['coral-gables','sweetwater','south-miami','doral']],
 ['sweetwater','Sweetwater','Miami-Dade',['west-miami','doral','coral-gables','kendall']],
 ['doral','Doral','Miami-Dade',['sweetwater','kendall','west-miami','westchester']],
 ['kendall','Kendall','Miami-Dade',['doral','westchester','sweetwater','miami']],
 ['westchester','Westchester','Miami-Dade',['kendall','miami','doral','key-biscayne']],
 ['miami','Miami','Miami-Dade',['westchester','key-biscayne','kendall','miami-beach']],
 ['key-biscayne','Key Biscayne','Miami-Dade',['miami','miami-beach','westchester','virginia-gardens']],
 ['miami-beach','Miami Beach','Miami-Dade',['key-biscayne','virginia-gardens','miami','medley']],
 ['virginia-gardens','Virginia Gardens','Miami-Dade',['miami-beach','medley','key-biscayne','hialeah-gardens']],
 ['medley','Medley','Miami-Dade',['virginia-gardens','hialeah-gardens','miami-beach','hialeah']],
 ['hialeah-gardens','Hialeah Gardens','Miami-Dade',['medley','hialeah','virginia-gardens','miami-springs']],
 ['hialeah','Hialeah','Miami-Dade',['miami-gardens','hollywood','miramar']],
 ['miami-springs','Miami Springs','Miami-Dade',['hialeah','opa-locka','hialeah-gardens','north-bay-village']],
 ['opa-locka','Opa-locka','Miami-Dade',['miami-springs','north-bay-village','hialeah','miami-shores']],
 ['north-bay-village','North Bay Village','Miami-Dade',['opa-locka','miami-shores','miami-springs','el-portal']],
 ['miami-shores','Miami Shores','Miami-Dade',['north-bay-village','el-portal','opa-locka','biscayne-park']],
 ['el-portal','El Portal','Miami-Dade',['miami-shores','biscayne-park','north-bay-village','bay-harbor-islands']],
 ['biscayne-park','Biscayne Park','Miami-Dade',['el-portal','bay-harbor-islands','miami-shores','surfside']],
 ['bay-harbor-islands','Bay Harbor Islands','Miami-Dade',['biscayne-park','surfside','el-portal','bal-harbour']],
 ['surfside','Surfside','Miami-Dade',['bay-harbor-islands','bal-harbour','biscayne-park','north-miami']],
 ['bal-harbour','Bal Harbour','Miami-Dade',['surfside','north-miami','bay-harbor-islands','miami-lakes']],
 ['north-miami','North Miami','Miami-Dade',['bal-harbour','miami-lakes','surfside','miami-gardens']],
 ['miami-lakes','Miami Lakes','Miami-Dade',['north-miami','miami-gardens','bal-harbour','north-miami-beach']],
 ['miami-gardens','Miami Gardens','Miami-Dade',['miramar','hollywood','hialeah','pembroke-pines']],
 ['north-miami-beach','North Miami Beach','Miami-Dade',['miami-gardens','indian-creek','miami-lakes','sunny-isles-beach']],
 ['indian-creek','Indian Creek','Miami-Dade',['north-miami-beach','sunny-isles-beach','miami-gardens','aventura']],
 ['sunny-isles-beach','Sunny Isles Beach','Miami-Dade',['indian-creek','aventura','north-miami-beach','golden-beach']],
 ['aventura','Aventura','Miami-Dade',['sunny-isles-beach','golden-beach','indian-creek']],
 ['golden-beach','Golden Beach','Miami-Dade',['aventura','sunny-isles-beach']],
 ['hallandale-beach','Hallandale Beach','Broward',['pembroke-park','west-park']],
 ['pembroke-park','Pembroke Park','Broward',['hallandale-beach','west-park','miramar']],
 ['west-park','West Park','Broward',['pembroke-park','miramar','hallandale-beach','pembroke-pines']],
 ['miramar','Miramar','Broward',['pembroke-pines','hollywood','weston','miami-gardens']],
 ['pembroke-pines','Pembroke Pines','Broward',['miramar','davie','hollywood','weston']],
 ['southwest-ranches','Southwest Ranches','Broward',['pembroke-pines','cooper-city','miramar','weston']],
 ['cooper-city','Cooper City','Broward',['southwest-ranches','weston','pembroke-pines','davie']],
 ['weston','Weston','Broward',['davie','sunrise','pembroke-pines','miramar']],
 ['davie','Davie','Broward',['plantation','weston','pembroke-pines','sunrise']],
 ['hollywood','Hollywood','Broward',['pembroke-pines','fort-lauderdale','miramar','miami-gardens']],
 ['dania-beach','Dania Beach','Broward',['hollywood','fort-lauderdale','davie','lauderhill']],
 ['fort-lauderdale','Fort Lauderdale','Broward',['plantation','lauderhill','hollywood','davie']],
 ['lauderhill','Lauderhill','Broward',['sunrise','tamarac','plantation','fort-lauderdale']],
 ['plantation','Plantation','Broward',['sunrise','davie','lauderhill','fort-lauderdale']],
 ['sunrise','Sunrise','Broward',['plantation','tamarac','lauderhill','weston','davie']],
 ['lauderdale-lakes','Lauderdale Lakes','Broward',['sunrise','tamarac','plantation','north-lauderdale']],
 ['tamarac','Tamarac','Broward',['sunrise','lauderhill','coral-springs','plantation']],
 ['north-lauderdale','North Lauderdale','Broward',['tamarac','oakland-park','lauderdale-lakes','wilton-manors']],
 ['oakland-park','Oakland Park','Broward',['north-lauderdale','wilton-manors','tamarac','lazy-lake']],
 ['wilton-manors','Wilton Manors','Broward',['oakland-park','lazy-lake','north-lauderdale','lauderdale-by-the-sea']],
 ['lazy-lake','Lazy Lake','Broward',['wilton-manors','lauderdale-by-the-sea','oakland-park','margate']],
 ['lauderdale-by-the-sea','Lauderdale-by-the-Sea','Broward',['lazy-lake','margate','wilton-manors','coconut-creek']],
 ['margate','Margate','Broward',['lauderdale-by-the-sea','coconut-creek','lazy-lake','pompano-beach']],
 ['coconut-creek','Coconut Creek','Broward',['margate','pompano-beach','lauderdale-by-the-sea','lighthouse-point']],
 ['pompano-beach','Pompano Beach','Broward',['coconut-creek','lighthouse-point','margate','sea-ranches']],
 ['lighthouse-point','Lighthouse Point','Broward',['pompano-beach','sea-ranches','coconut-creek','hillsboro-beach']],
 ['sea-ranches','Sea Ranches','Broward',['lighthouse-point','hillsboro-beach','pompano-beach','coral-springs']],
 ['hillsboro-beach','Hillsboro Beach','Broward',['sea-ranches','coral-springs','lighthouse-point','parkland']],
 ['coral-springs','Coral Springs','Broward',['tamarac','sunrise','plantation','boca-raton']],
 ['parkland','Parkland','Broward',['coral-springs','deerfield-beach','hillsboro-beach']],
 ['deerfield-beach','Deerfield Beach','Broward',['parkland','coral-springs']],
 ['boca-raton','Boca Raton','Palm Beach',['coral-springs','tamarac','sunrise']],
 ['highland-beach','Highland Beach','Palm Beach',['boca-raton','delray-beach','boynton-beach']],
 ['delray-beach','Delray Beach','Palm Beach',['highland-beach','boynton-beach','boca-raton','gulf-stream']],
 ['boynton-beach','Boynton Beach','Palm Beach',['delray-beach','gulf-stream','highland-beach','ocean-ridge']],
 ['gulf-stream','Gulf Stream','Palm Beach',['boynton-beach','ocean-ridge','delray-beach','briny-breezes']],
 ['ocean-ridge','Ocean Ridge','Palm Beach',['gulf-stream','briny-breezes','boynton-beach','hypoluxo']],
 ['briny-breezes','Briny Breezes','Palm Beach',['ocean-ridge','hypoluxo','gulf-stream','manalapan']],
 ['hypoluxo','Hypoluxo','Palm Beach',['briny-breezes','manalapan','ocean-ridge','lantana']],
 ['manalapan','Manalapan','Palm Beach',['hypoluxo','lantana','briny-breezes','greenacres']],
 ['lantana','Lantana','Palm Beach',['manalapan','greenacres','hypoluxo','atlantis']],
 ['greenacres','Greenacres','Palm Beach',['lantana','atlantis','manalapan','glen-ridge']],
 ['atlantis','Atlantis','Palm Beach',['greenacres','glen-ridge','lantana','lake-worth-beach']],
 ['glen-ridge','Glen Ridge','Palm Beach',['atlantis','lake-worth-beach','greenacres','palm-springs']],
 ['lake-worth-beach','Lake Worth Beach','Palm Beach',['glen-ridge','palm-springs','atlantis','haverhill']],
 ['palm-springs','Palm Springs','Palm Beach',['lake-worth-beach','haverhill','glen-ridge','cloud-lake']],
 ['haverhill','Haverhill','Palm Beach',['palm-springs','cloud-lake','lake-worth-beach','golf']],
 ['cloud-lake','Cloud Lake','Palm Beach',['haverhill','golf','palm-springs','lake-clarke-shores']],
 ['golf','Golf','Palm Beach',['cloud-lake','lake-clarke-shores','haverhill','wellington']],
 ['lake-clarke-shores','Lake Clarke Shores','Palm Beach',['golf','wellington','cloud-lake','royal-palm-beach']],
 ['wellington','Wellington','Palm Beach',['lake-clarke-shores','royal-palm-beach','golf','loxahatchee-groves']],
 ['royal-palm-beach','Royal Palm Beach','Palm Beach',['wellington','loxahatchee-groves','lake-clarke-shores','westlake']],
 ['loxahatchee-groves','Loxahatchee Groves','Palm Beach',['royal-palm-beach','westlake','wellington','south-palm-beach']],
 ['westlake','Westlake','Palm Beach',['loxahatchee-groves','south-palm-beach','royal-palm-beach','palm-beach']],
 ['south-palm-beach','South Palm Beach','Palm Beach',['westlake','palm-beach','loxahatchee-groves','palm-beach-shores']],
 ['palm-beach','Palm Beach','Palm Beach',['south-palm-beach','palm-beach-shores','westlake','west-palm-beach']],
 ['palm-beach-shores','Palm Beach Shores','Palm Beach',['palm-beach','west-palm-beach','south-palm-beach','mangonia-park']],
 ['west-palm-beach','West Palm Beach','Palm Beach',['palm-beach-shores','mangonia-park','palm-beach','riviera-beach']],
 ['mangonia-park','Mangonia Park','Palm Beach',['west-palm-beach','riviera-beach','palm-beach-shores','lake-park']],
 ['riviera-beach','Riviera Beach','Palm Beach',['mangonia-park','lake-park','west-palm-beach','north-palm-beach']],
 ['lake-park','Lake Park','Palm Beach',['riviera-beach','north-palm-beach','mangonia-park','palm-beach-gardens']],
 ['north-palm-beach','North Palm Beach','Palm Beach',['lake-park','palm-beach-gardens','riviera-beach','juno-beach']],
 ['palm-beach-gardens','Palm Beach Gardens','Palm Beach',['north-palm-beach','juno-beach','lake-park','tequesta']],
 ['juno-beach','Juno Beach','Palm Beach',['palm-beach-gardens','tequesta','north-palm-beach','jupiter-inlet-colony']],
 ['tequesta','Tequesta','Palm Beach',['juno-beach','jupiter-inlet-colony','palm-beach-gardens','jupiter']],
 ['jupiter-inlet-colony','Jupiter Inlet Colony','Palm Beach',['tequesta','jupiter','juno-beach','belle-glade']],
 ['jupiter','Jupiter','Palm Beach',['jupiter-inlet-colony','belle-glade','tequesta','south-bay']],
 ['belle-glade','Belle Glade','Palm Beach',['jupiter','south-bay','jupiter-inlet-colony','pahokee']],
 ['south-bay','South Bay','Palm Beach',['belle-glade','pahokee','jupiter']],
 ['pahokee','Pahokee','Palm Beach',['south-bay','belle-glade']]
];
var CBY={}; CITIES.forEach(function(c,i){CBY[c[0]]={slug:c[0],name:c[1],county:c[2],near:c[3],i:i}});
var COUNTIES=['Broward','Palm Beach','Miami-Dade'];
(function(){var el=document.getElementById('cities');if(!el)return;el.classList.add('cities-grouped');el.innerHTML=['Miami-Dade','Broward','Palm Beach'].map(function(co){return '<div class="cities-co"><h3>'+co+' County</h3><div class="cities-list">'+CITIES.filter(function(c){return c[2]===co}).map(function(c){return '<a href="#city/'+c[0]+'" data-view-link="city" data-param="'+c[0]+'">'+c[1]+'</a>'}).join('')+'</div></div>'}).join('')})();
var SVC_LINKS=[['brake-repair','Brake Repair'],['wheel-alignment','Wheel Alignment'],['tire-installation','Tire Installation'],['tire-repair','Tire Repair'],['tire-balancing','Tire Balancing'],['tire-rotation','Tire Rotation'],['suspension-repair','Suspension Repair'],['oil-changes','Oil Changes'],['tpms-service','TPMS Service'],['custom-wheels','Custom Wheels'],['lift-kits','Lift Kits']];
var BRANDS=[['michelin','Michelin'],['bfgoodrich','BFGoodrich'],['uniroyal','Uniroyal'],['cooper','Cooper'],['firestone','Firestone'],['bridgestone','Bridgestone'],['hankook','Hankook'],['hercules','Hercules'],['kumho','Kumho'],['general','General'],['continental','Continental'],['pirelli','Pirelli'],['nexen','Nexen'],['nitto','Nitto'],['toyo','Toyo'],['falken','Falken'],['yokohama','Yokohama'],['ironman','Ironman'],['ohtsu','OHTSU'],['goodyear','Goodyear'],['dunlop','Dunlop'],['maxxis','Maxxis'],['mickey-thompson','Mickey Thompson'],['mastercraft','Mastercraft'],['laufenn','Laufenn'],['vredestein','Vredestein'],['nokian','Nokian'],['fuzion','Fuzion'],['gt-radial','GT Radial'],['kenda','Kenda'],['starfire','Starfire'],['kelly','Kelly']];
function vl(view,label,param,cls){return '<a href="#'+view+(param?'/'+param:'')+'" data-view-link="'+view+'"'+(param?' data-param="'+param+'"':'')+(cls?' class="'+cls+'"':'')+'>'+label+'</a>'}

/* register jump-menu entries */
[['gallery','News & Gallery'],['cities','Service Area'],['terms','Terms of Use'],['privacy','Privacy Policy'],['accessibility','Accessibility'],['sitemap','Sitemap'],['notfound','404 Page']].forEach(function(p){ET.pages.push({id:p[0],label:p[1]})});
ET.pages.push({id:'city',param:'sunrise',label:'City: Sunrise'});
ET.pages.push({id:'city',param:'davie',label:'City: Davie'});

/* ---------- Gallery ---------- */
var glFilter='all', glShown=8, glFocus=null, glList=[], glIdx=0;
var glExtra=[['50% 20%','x'],['10% 30%','x'],['95% 40%','x'],['60% 10%','x'],['25% 90%','x'],['85% 90%','x'],['40% 30%','x'],['70% 50%','x']];
function glItems(){
  var base=ET.GALLERY.items.slice(), out=(ET.SHOP||[]).slice().concat(ET.REVIEWS||[]).concat(base);
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
      (i.isVideo?'<span class="vid"><svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="#fff"/></svg></span>':'')+
      '<span class="cap">'+esc(i.caption)+'</span></button>';
  }).join('')||'<p class="gl-empty">No posts in this category yet.</p>';
  $('gl-more').parentNode.hidden=glShown>=rows.length;
}
function glChips(){glFilter='all';$('gl-chips').hidden=ET.IGCATS.length<2;$('gl-chips').innerHTML=ET.IGCATS.map(function(c){return '<button type="button" data-f="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+esc(c[1])+'</button>'}).join('')}
window.addEventListener('et-feed',function(){GL=glItems();glShown=8;glChips();glRender()});glChips();
$('gl-chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;glFilter=b.dataset.f;glShown=8;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});glRender()});
$('gl-more').addEventListener('click',function(){var before=glShown;glShown+=8;glRender();
  var t=$('gl-grid').querySelectorAll('.gl-tile')[before];if(t)t.focus({preventScroll:false})});
var lb=$('gl-lb');
function lbShow(){var it=glList[glIdx];if(!it)return;var im=$('gl-lb-img');im.src=it.file;im.alt=it.caption;im.style.objectPosition='50% 50%';
  $('gl-lb-cap').textContent=it.caption;$('gl-lb-cnt').textContent=(glIdx+1)+' / '+glList.length;
  var ll=$('gl-lb-link');ll.href=it.lbLink||it.permalink||'https://www.instagram.com/extremetires';ll.textContent=it.lbLink?'See our Google reviews':'View on Instagram'}
function lbOpen(k,trigger){glList=glVisible().slice(0,glShown);glIdx=k;glFocus=trigger;lbShow();lb.classList.add('open');lb.setAttribute('aria-hidden','false');$('gl-lb-x').focus()}
function lbClose(){if(!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');if(glFocus&&document.body.contains(glFocus))glFocus.focus()}
function lbStep(d){glIdx=(glIdx+d+glList.length)%glList.length;lbShow()}
$('gl-grid').addEventListener('click',function(e){var t=e.target.closest('.gl-tile');if(!t)return;var it=glVisible().slice(0,glShown)[+t.dataset.i];if(it&&it.permalink){window.open(it.permalink,'_blank','noopener')}else lbOpen(+t.dataset.i,t)});
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
  else{ETZipOutside(r,'That ZIP is outside our regular route, but ask us, we may still be able to help.');r.classList.add('no')}
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
  var svcs='<section class="d-sec alt" aria-labelledby="cy-h-svc"><div class="wrap"><div class="eyebrow">At your location</div><h2 class="d-h2" id="cy-h-svc">What we do at your location</h2><p class="d-lead">The van brings the tools to you in '+esc(c.name)+'.</p><div class="cy-svcs">'+
    mob.map(function(m){return '<a class="cy-svc" href="#service/'+m[3]+'" data-view-link="service" data-param="'+m[3]+'">'+SI(m[0],0)+'<b>'+m[1]+'</b><span>'+m[2]+'</span></a>'}).join('')+'</div></div></section>';
  var how='<section class="d-sec" aria-labelledby="cy-h-how"><div class="wrap"><div class="eyebrow">Simple</div><h2 class="d-h2" id="cy-h-how">How it works</h2><ol class="cy-steps">'+
    steps.map(function(s){return '<li><b>'+s[0]+'</b><p>'+s[1]+'</p></li>'}).join('')+'</ol></div></section>';
  var shop='<section class="d-sec" style="padding-top:0"><div class="wrap"><div class="cy-shop"><div><div class="eyebrow">Shop services</div><h2 style="margin-top:8px">Bigger jobs at our Sunrise shop</h2>'+
    '<p>Some work needs a lift or an alignment rack. For '+esc(c.name)+' customers that is a visit to our shop.</p><div class="tags"><span>Hunter alignment</span><span>Brakes</span><span>Suspension</span><span>TPMS</span><span>Lift &amp; leveling kits</span><span>Custom wheel sourcing</span></div>'+
    '<div class="btns" style="margin-top:20px"><a class="btn btn-ghost" href="#services" data-view-link="services">See all services</a></div></div>'+
    '<div class="vis"><div><small>Address</small><b>7712 West Oakland Park Blvd<br>Sunrise, FL 33351</b></div><div><small>Hours</small><b>Mon&ndash;Fri 8:00 AM&ndash;6:30 PM<br>Sat 8:00 AM&ndash;4:00 PM<br>Sun closed</b></div><div><small>Phone</small><b>'+PHONE+'</b></div></div></div></div></section>';
  var faq='<section class="d-sec faq alt" aria-labelledby="cy-h-faq" style="padding-block:56px"><div class="wrap"><div class="eyebrow">Questions</div><h2 class="d-h2" id="cy-h-faq" style="margin-bottom:20px">'+esc(c.name)+' FAQ</h2>'+
    '<details><summary>'+sub(FAQQ1[q%3],c)+'</summary><p>'+sub(FAQA1[(q+1)%3],c)+'</p></details>'+
    '<details><summary>'+FAQQ2[(q+1)%3]+'</summary><p>'+FAQA2+'</p></details>'+
    '<details><summary>'+FAQQ3[(q+2)%3]+'</summary><p>'+FAQA3[q%3]+'</p></details></div></section>';
  var near='<section class="d-sec" aria-labelledby="cy-h-near"><div class="wrap"><div class="eyebrow">Nearby</div><h2 class="d-h2" id="cy-h-near">Nearby areas</h2><p class="d-lead">We also serve these cities.</p><div class="cy-near">'+
    c.near.map(function(s){var n=CBY[s];return '<a href="#city/'+s+'" data-view-link="city" data-param="'+s+'">'+esc(n.name)+'</a>'}).join('')+'<a href="#cities" data-view-link="cities">All service areas</a></div></div></section>';
  var hero='<div class="phead"><div class="wrap">'+cityCrumbs(c.name)+'<h1>Mobile tire service in '+esc(c.name)+', FL</h1><p>'+intro+'</p>'+
    '<div class="btns"><a class="btn btn-red" href="#mobile" data-view-link="mobile">Book mobile service</a><a class="btn btn-ghost" href="#quote" data-view-link="quote">Request a quote</a><a class="btn btn-ghost" href="tel:+19547731896">Call '+PHONE+'</a></div>'+
    '<form class="cy-zip" id="cy-zipf" novalidate><label class="f" for="cy-zipi">Confirm your ZIP<input id="cy-zipi" inputmode="numeric" maxlength="5" placeholder="33351" autocomplete="postal-code"></label><button class="btn btn-ghost" type="submit">Check</button></form><p class="cy-zipres" id="cy-zipres" aria-live="polite"></p>'+
    '<p class="cy-proof">4.7&#9733; from 1,319 reviews on Birdeye &middot; Mobile van + Sunrise shop</p>'+
    '<span class="sample-note" style="justify-self:start">Local details to add per city: neighborhoods, landmarks, ZIPs served</span></div></div>';
  return hero+svcs+how+shop+faq+near;
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

$('cy-root').addEventListener('submit',function(e){
  if(e.target.id!=='cy-zipf')return;e.preventDefault();
  var z=$('cy-zipi').value.trim(),c=ET.county(z),r=$('cy-zipres');r.className='cy-zipres';
  if(c===null){r.textContent='Enter a 5-digit ZIP code.';r.classList.add('no')}
  else if(c){r.textContent='Yes, we cover '+z+' in '+c+' County. Book mobile service above.';r.classList.add('ok')}
  else{ETZipOutside(r,'Outside our regular route, but ask us, we may still be able to help.');r.classList.add('no')}
});

})();}catch(e){console.error('part d failed',e)}