var esc=ET.esc;
var TRUST='<p class="cm-trust"><span class="cm-star" aria-hidden="true">★</span><b>4.7 from 1,319 reviews on Birdeye</b><span>Mobile + shop</span><span>Hunter alignment</span></p>';
function $(id){return document.getElementById(id)}
function ic(id){return ET.icon(id)}

/* ===================== COMMERCIAL ===================== */
var VEH=[
  ['Work vans','van','Tires, repairs and oil changes where the van is parked.'],
  ['Box trucks','install','Delivery and moving trucks that cannot sit in a waiting room.'],
  ['Trailers','wheel','Utility, cargo and equipment trailers.'],
  ['RVs','susp','Motorhomes and travel trailers.'],
  ['Semis','wheel','Tractors and heavy commercial units.'],
  ['Boat trailers','repair','Flat repair and tire replacement for trailer tires.'],
  ['Golf carts','wheel','Cart tires and wheels.'],
  ['Buses','van','Shuttle and passenger buses.']
];
$('cm-tiles').innerHTML=VEH.map(function(v){
  return '<li>'+ic(v[1])+'<b>'+esc(v[0])+'</b><p>'+esc(v[2])+'</p></li>';
}).join('');

var CATS=[
  ['Light truck','install','Pickups, vans and SUVs with LT-rated tires for load and towing.'],
  ['Commercial truck','van','Medium and heavy truck tires for steer, drive and trailer positions.'],
  ['Trailer','wheel','Trailer-specific tires for utility, cargo, boat and RV trailers.'],
  ['Agricultural','lift','Farm and ranch equipment tires. Availability to confirm.']
];
$('cm-cats').innerHTML=CATS.map(function(c){
  return '<article class="cm-cat">'+ic(c[1])+'<h3>'+esc(c[0])+'</h3><p>'+esc(c[2])+'</p><span class="sample note-int">Brands: list to confirm</span></article>';
}).join('');

$('cm-veh').innerHTML=VEH.concat([['Other','','']]).map(function(v,i){
  return '<label for="cm-v'+i+'"><input type="checkbox" id="cm-v'+i+'" name="veh" value="'+esc(v[0])+'">'+esc(v[0])+'</label>';
}).join('');
var NEEDS=['New tires','Tire repair / roadside','On-site installation','Oil changes','Alignment','Brakes','Suspension','Scheduled rotation / inspection'];
$('cm-needs').innerHTML=NEEDS.map(function(n,i){
  return '<label for="cm-n'+i+'"><input type="checkbox" id="cm-n'+i+'" name="need" value="'+esc(n)+'">'+esc(n)+'</label>';
}).join('');
$('cm-pref').innerHTML=['Phone call','Text message','Email'].map(function(n,i){
  return '<label for="cm-p'+i+'"><input type="radio" id="cm-p'+i+'" name="pref" value="'+esc(n)+'"'+(i===0?' checked':'')+'>'+esc(n)+'</label>';
}).join('');

var FAQ=[
  ['Do you come to our lot or yard?','Our mobile van handles tire installation, balancing, flat repair and oil changes on site within Broward, Miami-Dade and Palm Beach counties. Larger jobs may be better at the shop. Our team will say which when they quote.'],
  ['Do you offer fleet invoicing or net terms?','Simon to confirm: invoicing terms and account setup are not decided in this prototype.'],
  ['Is there volume pricing?','Simon to confirm: volume pricing and any fleet discounts. Pricing is always confirmed by our team.'],
  ['Which vehicles can you service?','Work vans, box trucks, trailers, RVs, semis, boat trailers, golf carts and buses all appear in our work gallery. Tell us your vehicle and tire size and we will confirm what we can do.'],
  ['Can you handle emergency flats?','Call (954) 773-1896 for flat repair and roadside help. Response times depend on location and schedule, so ask when you call.'],
  ['Can we set up recurring service?','Simon to confirm: recurring schedules, reminders and service records for fleet accounts.']
];
$('cm-faq').innerHTML=FAQ.map(function(q){
  return '<details><summary>'+esc(q[0])+'</summary><p>'+esc(q[1]).replace(/^Simon to confirm:/,'<span class="note-int">Simon to confirm:</span>')+'</p></details>';
}).join('');

function cmZip(){
  var z=$('cm-zip').value.trim(), out=$('cm-zipres'), c=ET.county(z);
  out.className='zipres';
  if(z.length<5){out.textContent='';return c}
  if(c){out.textContent='We cover '+z+' in '+c+' County.';out.classList.add('ok')}
  else if(c===''){out.textContent='Outside our regular route. Call (954) 773-1896 and we will see what we can do.';out.classList.add('no')}
  else {out.textContent=''}
  return c;
}
$('cm-zip').addEventListener('input',cmZip);
$('cm-form').addEventListener('submit',function(e){
  e.preventDefault();
  var f=$('cm-form'), bad=null;
  function setErr(id,msg,el){var s=f.querySelector('.err[data-for="'+id+'"]');if(s)s.textContent=msg||'';if(msg&&!bad)bad=el||$(id)}
  var v=function(id){return $(id).value.trim()};
  setErr('cm-company',v('cm-company')?'':'Please enter your company name.');
  setErr('cm-contact',v('cm-contact')?'':'Please enter a contact name.');
  setErr('cm-phone',v('cm-phone').replace(/\D/g,'').length>=10?'':'Enter a 10-digit phone number.');
  setErr('cm-email',!v('cm-email')?'This field is required':(/.+@.+\..+/.test(v('cm-email'))?'':'Enter an email like name@example.com'));
  setErr('cm-size',v('cm-size')?'':'Please choose a fleet size.');
  var z=v('cm-zip'), c=ET.county(z);
  setErr('cm-zip',c===null?'Enter a 5-digit ZIP code.':'');
  var vehs=[].slice.call(f.querySelectorAll('input[name="veh"]:checked')).map(function(i){return i.value});
  $('cm-veh-err').textContent=vehs.length?'':'Pick at least one vehicle type.';
  if(!vehs.length&&!bad)bad=$('cm-v0');
  var done=$('cm-done');
  if(bad){done.hidden=true;bad.focus();return}
  var needs=[].slice.call(f.querySelectorAll('input[name="need"]:checked')).map(function(i){return i.value});
  var pref=f.querySelector('input[name="pref"]:checked');
  done.innerHTML='<b>Prototype only, nothing was sent.</b> On the live site this would go to the shop as a fleet lead for '+esc(v('cm-company'))+' ('+esc(v('cm-size'))+'; '+esc(vehs.join(', '))+'; based near '+esc(z)+(c?', '+esc(c)+' County':'')+(needs.length?'; needs: '+esc(needs.join(', ')):'')+'). Preferred contact: '+esc(pref?pref.value:'phone call')+'.';
  done.hidden=false;
  done.scrollIntoView({block:'nearest'});
});
ET.pages.push({id:'commercial',label:'Commercial & Fleet'});

/* ===================== BRANDS ===================== */
var BRANDS=[
  ['michelin','Michelin',['p']],['bfgoodrich','BFGoodrich',['t']],['uniroyal','Uniroyal',['v']],['cooper','Cooper',['t']],
  ['firestone','Firestone',['v']],['bridgestone','Bridgestone',['p']],['hankook','Hankook',['p']],['hercules','Hercules',['v','t']],
  ['kumho','Kumho',['v']],['general','General',['t']],['continental','Continental',['p']],['pirelli','Pirelli',['p']],
  ['nexen','Nexen',['v']],['nitto','Nitto',['t']],['toyo','Toyo',['t']],['falken','Falken',['t']],
  ['yokohama','Yokohama',['p']],['ironman','Ironman',['v']],['ohtsu','OHTSU',['v']]
];
var BCATS=[['all','All'],['p','Premium'],['v','Value'],['t','Truck & Off-road']];
var bsCat='all';
$('bs-chips').innerHTML=BCATS.map(function(c){return '<button type="button" data-cat="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+esc(c[1])+'</button>'}).join('');
function bsRender(){
  var q=$('bs-q').value.trim().toLowerCase();
  var rows=BRANDS.filter(function(b){return (bsCat==='all'||b[2].indexOf(bsCat)>-1)&&(!q||b[1].toLowerCase().indexOf(q)>-1)});
  $('bs-grid').innerHTML=rows.map(function(b){
    return '<li><a class="bs-tile" data-letter="'+esc(b[1].charAt(0))+'" href="#brand/'+b[0]+'" data-view-link="brand" data-param="'+b[0]+'" aria-label="'+esc(b[1])+' tires"><span class="bs-name">'+esc(b[1])+'</span><span class="bs-go">View brand</span></a></li>';
  }).join('');
  $('bs-empty').hidden=rows.length>0;
  $('bs-count').textContent='Showing '+rows.length+' of '+BRANDS.length+' brands'+(bsCat==='all'?'':' · sample grouping, confirm');
}
$('bs-chips').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  bsCat=b.dataset.cat;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});
  bsRender();
});
$('bs-q').addEventListener('input',bsRender);
bsRender();
ET.pages.push({id:'brands',label:'Tire Brands'});

/* ===================== BRAND (param) ===================== */
var LINES={
  bfgoodrich:['All-Terrain T/A KO2'],
  nitto:['Ridge Grappler','Trail Grappler M/T'],
  toyo:['Open Country A/T III'],
  falken:['Wildpeak A/T4W'],
  michelin:['Defender LTX M/S2'],
  cooper:['Discoverer AT3 4S'],
  continental:['TerrainContact A/T']
};
function notFound(root,hub,hubLabel,what){
  root.innerHTML='<div class="phead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#'+hub+'" data-view-link="'+hub+'">'+hubLabel+'</a></nav><h1>Page not found</h1></div></div>'+
    '<div class="wrap nf-box"><h2>We could not find that '+what+'</h2><p>The link may be old or mistyped. Head back to the full list and pick from there.</p><a class="btn btn-red" href="#'+hub+'" data-view-link="'+hub+'">Back to '+hubLabel+'</a></div>';
}
ET.onShow.brand=function(param){
  var root=$('br-root'), i=-1;
  BRANDS.forEach(function(b,n){if(b[0]===param)i=n});
  if(i<0){notFound(root,'brands','Tire Brands','brand');return}
  var b=BRANDS[i], prev=BRANDS[(i+BRANDS.length-1)%BRANDS.length], next=BRANDS[(i+1)%BRANDS.length], n=esc(b[1]);
  var lines=LINES[b[0]];
  var linesHtml=lines?
    '<div class="br-line-grid">'+lines.map(function(l){return '<div class="br-line"><span class="k">'+n+'</span><b>'+esc(l)+'</b><span class="sample">Sample</span></div>'}).join('')+'</div>'+
    '<p class="br-tbc"><b>Sample list.</b> Availability, sizes and the full lineup are confirmed by our team. Ask for any '+n+' tire not shown here.</p>'
    :'<div class="br-tbc"><b class="note-int">Popular lines: to confirm.</b> Tell us your tire size and we will check '+n+' options for your vehicle.</div>';
  root.innerHTML=
  '<div class="phead"><div class="wrap">'+
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#brands" data-view-link="brands">Tire Brands</a><span>/</span><span>'+n+'</span></nav>'+
    '<h1>'+n+' tires</h1><p>Shop '+n+' at Extreme Tires, installed at the shop or by our mobile van.</p>'+TRUST+
    '<div class="btns"><a class="btn btn-red" href="#quote" data-view-link="quote" data-svc="Tire Installation">Request a quote</a><a class="btn btn-ghost" href="#tires" data-view-link="tires">Shop tires</a></div>'+
  '</div></div>'+
  '<section class="br-lines" aria-labelledby="br-l"><div class="wrap br-grid"><div><div class="eyebrow">Popular lines</div><h2 id="br-l">Popular '+n+' lines</h2>'+linesHtml+'</div>'+
    '<div class="br-rebate"><span class="sample">Sample</span><div class="eyebrow">Current rebate</div><div class="amt">$XX</div>'+
    '<p><span class="note-int">Confirm with the manufacturer\'s promotion before publishing.</span> Terms and dates come from the manufacturer.</p>'+
    '<a class="btn btn-dark" href="#coupons" data-view-link="coupons">See coupons and offers</a></div></div></section>'+
  '<section class="br-install" aria-labelledby="br-i"><div class="wrap"><div class="eyebrow">Install it where you are</div><h2 id="br-i">Mobile or at the shop</h2>'+
    '<div class="br-strip"><div>'+ic('van')+'<b>Mobile install</b><p>Our van brings the tires and balancer to your home, office or job site in Broward, Miami-Dade and Palm Beach counties.</p><a href="#mobile" data-view-link="mobile">Check your ZIP</a></div>'+
    '<div>'+ic('install')+'<b>At the Sunrise shop</b><p>7712 West Oakland Park Blvd. Mon–Fri 8:00 AM–6:30 PM, Sat 8:00 AM–4:00 PM.</p><a href="#locations" data-view-link="locations">Hours and directions</a></div></div>'+
  '</div></section>'+
  '<section class="br-story-sec note-int" aria-labelledby="br-h"><div class="wrap"><div class="eyebrow">About the brand</div><h2 id="br-h">Shop '+n+' at Extreme Tires</h2>'+
    '<div class="br-story"><span class="sample-note note-int">Placeholder</span><p style="margin-top:8px">Brand story to be written or approved by Extreme.</p></div></div></section>'+
  '<nav class="br-nav" aria-label="More brands"><div class="wrap">'+
    '<a class="prev" href="#brand/'+prev[0]+'" data-view-link="brand" data-param="'+prev[0]+'"><small>Previous brand</small><b>'+esc(prev[1])+'</b></a>'+
    '<a class="next" href="#brand/'+next[0]+'" data-view-link="brand" data-param="'+next[0]+'"><small>Next brand</small><b>'+esc(next[1])+'</b></a>'+
  '</div></nav>';
};
ET.pages.push({id:'brand',param:'michelin',label:'Brand: Michelin'});

/* ===================== TIPS DATA ===================== */
var SVCS={
  'brake-repair':['brake','Brake Repair'],'wheel-alignment':['align','Wheel Alignment'],'tire-installation':['install','Tire Installation'],
  'tire-repair':['repair','Tire Repair'],'tire-balancing':['balance','Tire Balancing'],'tire-rotation':['rotate','Tire Rotation'],
  'suspension-repair':['susp','Suspension Repair'],'oil-changes':['oil','Oil Changes'],'tpms-service':['tpms','TPMS Service'],'custom-wheels':['wheel','Custom Wheels'],'lift-kits':['lift','Lift Kits']
};
var TIPS=[
 {s:'check-tire-pressure',cat:'tire',ic:'tpms',t:'How to check your tire pressure',
  lede:'Correct pressure is the cheapest tire maintenance there is. It takes five minutes and a gauge, and it affects wear, handling and fuel use.',
  take:['Check pressure when the tires are cold, before driving or after the car has sat for a few hours.','Use the PSI on the door-jamb placard or in the owner\'s manual, not the maximum number printed on the tire sidewall.','Heat raises pressure. Do not let air out of a hot tire to hit the placard number.'],
  secs:[
   {h:'Which number to use',p:['The sidewall shows the maximum pressure the tire can hold, not what your vehicle needs. The correct figure is on the tire and loading placard, usually on the driver\'s door jamb, and in the owner\'s manual. Front and rear are sometimes different.']},
   {h:'How to check',ul:['Check when the tires are cold: before driving, or after the vehicle has been parked for a few hours.','Remove the valve cap and press the gauge on straight and firmly until the hissing stops.','Compare the reading with the placard. Add air if it is low.','If you overfill, release a little at a time and recheck.','Replace the valve caps. They keep dirt and moisture out of the valve.']},
   {h:'Florida heat',p:['Air expands when it warms, so pressure climbs as the day heats up and as the tires heat from driving on hot pavement. A common rule of thumb is that pressure changes by about 1 PSI for every 10°F change in temperature. That is why early morning is a good time to check, and why a reading taken right after a highway drive will be higher than the true cold pressure.','Check monthly and before long trips, and do not forget the spare if your vehicle has one.']}
  ],rel:['tpms-service','tire-repair','tire-rotation']},
 {s:'when-to-rotate-tires',cat:'tire',ic:'rotate',t:'When to rotate your tires',
  lede:'Front and rear tires wear differently. Rotating them moves each tire to a new position so the set wears more evenly and lasts longer.',
  take:['Follow the interval in your owner\'s manual. It is commonly every 5,000 to 8,000 miles.','Rotating is often done together with an oil change so you only remember one schedule.','Rotation does not fix a vibration or a pull. Those usually point to balance or alignment.'],
  secs:[
   {h:'Why rotate at all',p:['Steering, braking and driving loads are not shared equally. On many front-wheel-drive cars the front tires wear faster, while on rear-drive trucks the pattern can be different. Moving tires around evens out the wear so you replace the set at about the same time instead of two at a time.']},
   {h:'How often',p:['Your owner\'s manual is the best source. A commonly used interval is every 5,000 to 8,000 miles, and many drivers tie it to oil changes. If you drive a lot of short trips in heat, towing or heavy loads, ask a technician whether a shorter interval makes sense.']},
   {h:'Patterns and limits',p:['The right pattern depends on whether the vehicle is front-, rear- or all-wheel drive, and on the tires themselves. Directional tires should stay on the same side. Vehicles with different front and rear tire sizes, sometimes called staggered fitments, cannot be rotated front to back.','A rotation is also a good moment to check tread depth, pressure and the condition of the sidewalls.']}
  ],rel:['tire-rotation','tire-balancing','wheel-alignment']},
 {s:'tread-depth-penny-test',cat:'tire',ic:'wheel',t:'Tread depth: the penny and quarter test',
  lede:'You do not need special tools to get a rough idea of how much tread you have left. A coin and a minute are enough.',
  take:['Penny test: if you can see all of Lincoln\'s head, tread is at or below roughly 2/32 inch.','2/32 inch is the commonly cited legal minimum. Replace sooner for better wet-road grip.','Uneven wear is a clue to pressure, alignment or suspension problems.'],
  secs:[
   {h:'The penny test',ul:['Place a penny with Lincoln\'s head pointing down into a tread groove.','If the top of his head is hidden by the tread, you have more than about 2/32 inch.','If you can see all of his head, the tire is at or near the minimum and should be replaced.']},
   {h:'The quarter test',p:['Do the same with a quarter and Washington\'s head. If the tread touches the top of his head, you have roughly 4/32 inch or more. If you can see the top of his head, you are below that, which is a good time to start planning replacement, especially in rainy season.']},
   {h:'Wear bars',p:['Most passenger tires have small raised bars molded across the bottom of the grooves. When the tread wears level with them, the tire has reached 2/32 inch. Check several spots across each tire, because wear is not always even.']},
   {h:'Replace sooner than the minimum',p:['2/32 inch is commonly cited as the legal minimum in most U.S. states, but a tire at that depth moves much less water than a new one. Many drivers and tire professionals consider replacement well before that point, particularly if you drive in heavy rain.','Wear on only the inner or outer edge, or a scalloped pattern, is worth having checked. It can come from pressure, alignment or worn suspension parts.']}
  ],rel:['tire-installation','wheel-alignment','tire-rotation']},
 {s:'signs-you-need-an-alignment',cat:'tire',ic:'align',t:'Signs you need a wheel alignment',
  lede:'An alignment adjusts the angles of the wheels so they meet the road the way the manufacturer intended. When those angles drift, the vehicle and the tires let you know.',
  take:['Pulling to one side or an off-center steering wheel are the classic signs.','Uneven tire wear, especially on the edges, often points to alignment.','Get it checked after a hard curb or pothole hit, suspension work, or new tires.'],
  secs:[
   {h:'What you might notice',ul:['The vehicle drifts left or right on a straight, flat road.','The steering wheel is crooked when you drive straight.','Tires wear faster on the inside or outside edge.','The steering feels loose or does not return to center well.']},
   {h:'What changes alignment',p:['Potholes, curbs, worn suspension parts and changes in ride height, such as a lift or leveling kit, can all move the angles. The three main angles are camber (the tilt of the wheel in or out), toe (whether the fronts of the tires point in or out) and caster (the angle of the steering axis).']},
   {h:'It might not be alignment',p:['A vibration at highway speed is more often a balance issue than an alignment issue. A pull can also come from uneven tire pressure or a tire problem. A technician can sort out which it is, and checking pressure first costs nothing.']},
   {h:'When to check',p:['Many shops suggest checking alignment when you install new tires, after suspension repairs, and any time you notice the signs above. Follow your manufacturer\'s guidance for your vehicle.']}
  ],rel:['wheel-alignment','suspension-repair','tire-installation']},
 {s:'why-tire-balance-matters',cat:'tire',ic:'balance',t:'Why tire balance matters',
  lede:'A tire and wheel are never perfectly even all the way around. Balancing adds small weights so the assembly spins smoothly instead of hopping.',
  take:['The classic symptom is a vibration that shows up at certain speeds, often highway speeds.','Steering wheel shake usually points to the front; a vibration through the seat or floor to the rear.','Balance is checked whenever tires are mounted, and again if vibration appears later.'],
  secs:[
   {h:'What balancing does',p:['Even a few ounces of imbalance on a spinning wheel creates a vibration. A balancer spins the wheel assembly, finds the heavy spot, and a technician adds small weights to the rim to offset it.']},
   {h:'Signs of an out-of-balance tire',ul:['A shake in the steering wheel at certain speeds.','A vibration felt in the seat or floor.','Uneven or cupped tire wear over time.']},
   {h:'Common causes',p:['New tires are balanced at installation. Later, a wheel weight can fall off, a tire can wear unevenly, or a wheel can be bent from a pothole. Any of these can bring the vibration back.']},
   {h:'Balance, rotation or alignment?',p:['They are different jobs. Balancing fixes vibration. Rotation evens out wear. Alignment fixes pulling and edge wear. If you are not sure which you need, describe the symptom and a technician can guide you.']}
  ],rel:['tire-balancing','tire-installation','wheel-alignment']},
 {s:'tpms-warning-light',cat:'tire',ic:'tpms',t:'What the tire pressure (TPMS) light means',
  lede:'The dashboard symbol that looks like a flat tire with an exclamation point is your tire pressure monitoring system asking you to check your tires.',
  take:['A steady light usually means one or more tires are low. Check pressure with a gauge.','A light that flashes for a minute and then stays on commonly points to a system fault.','Temperature drops can trigger the light. Add air to the placard PSI.'],
  secs:[
   {h:'If the light is on steadily',p:['Check all four tires with a gauge and compare them to the placard PSI on the driver\'s door jamb. Systems often warn when a tire is about a quarter below the recommended pressure, though this varies by vehicle. Add air, then drive for a few minutes. On many vehicles the light turns off by itself.']},
   {h:'If it blinks, then stays on',p:['On many vehicles, a light that flashes for about a minute at startup and then stays lit indicates a problem with the system itself, such as a sensor that is not communicating. Your owner\'s manual explains your vehicle\'s behavior.']},
   {h:'Cold mornings and tire work',p:['Pressure drops as the air cools, so the light can come on after a temperature change. After a rotation or new tires, some vehicles need a reset or sensor relearn so the system knows where each sensor is.']},
   {h:'Sensors do wear out',p:['The sensors in the wheels run on small batteries that cannot normally be replaced separately, and they eventually need replacing. If you have a persistent warning with good pressure, have the sensors tested.']}
  ],rel:['tpms-service','tire-rotation','tire-repair']},
 {s:'how-to-read-a-tire-size',cat:'tire',ic:'wheel',t:'How to read a tire size',
  lede:'The string of numbers on the sidewall, like 225/65R17, is a compact description of the tire. Once you know the pattern, it is easy to read.',
  take:['225 is the width in millimeters; 65 is the sidewall height as a percentage of width; 17 is the wheel diameter in inches.','R means radial construction. A leading P means passenger; LT means light truck.','Match the size on your door placard or in the owner\'s manual unless a technician advises otherwise.'],
  secs:[
   {h:'Breaking down 225/65R17',ul:['225: section width in millimeters, measured sidewall to sidewall.','65: aspect ratio, the sidewall height as a percentage of the width.','R: radial construction.','17: the diameter of the wheel in inches.']},
   {h:'Other markings',p:['You may see a letter before the numbers: P for passenger tires and LT for light truck tires. After the size, a load index and a speed rating letter, for example 98H, describe how much weight the tire can carry and its rated speed. Always use tires with load and speed ratings at least equal to what your vehicle manufacturer specifies.']},
   {h:'Where to find your size',p:['Check the door-jamb placard, the owner\'s manual, or the sidewall of the tire currently on the vehicle. If you have changed wheel size or lifted the vehicle, ask a technician to confirm what fits.']}
  ],rel:['tire-installation','custom-wheels','tire-balancing'],w:'size'},
 {s:'tire-age-and-dot-date-code',cat:'tire',ic:'tpms',t:'Tire age and the DOT date code',
  lede:'Tires age even when they are not driven. Rubber slowly hardens with time, heat and sunlight, so the date a tire was made matters as well as its tread.',
  take:['The last four digits of the DOT code are the week and year of manufacture. 2423 means week 24 of 2023.','Tire and vehicle manufacturers commonly advise having tires inspected as they age, and many suggest replacing them at about ten years regardless of tread. Follow your vehicle manual.','Check the spare and any tires on trailers or seasonal vehicles too.'],
  secs:[
   {h:'Finding the date code',p:['Look on the sidewall for letters DOT followed by a string of characters. The last four digits are the date: the first two are the week of the year and the last two are the year. On tires made before 2000, the code uses three digits. The date may be on only one side of the tire, so check the inside sidewall if you do not see it.']},
   {h:'Why age matters',p:['Heat, sunlight and ozone gradually dry out rubber. South Florida is hard on tires in this respect. Signs of an aging tire include fine cracks in the sidewall or between the tread blocks, and stiffness or dry-looking rubber.']},
   {h:'How old is too old?',p:['There is no single number for every tire. Many vehicle and tire manufacturers recommend yearly inspections once tires pass about five years, and many suggest replacement at around ten years from the date of manufacture, even if the tread looks fine. Your owner\'s manual and tire maker\'s guidance come first.']}
  ],rel:['tire-installation','tire-repair','tire-rotation'],w:'dot'},
 {s:'oil-change-basics',cat:'car',ic:'oil',t:'Oil change basics',
  lede:'Engine oil lubricates, cools and cleans the moving parts of your engine. Fresh oil and the right grade are one of the simplest ways to protect it.',
  take:['Use the oil grade and change interval in your owner\'s manual.','Stop-and-go traffic, heat, towing and short trips count as severe use and can call for shorter intervals.','Check the dipstick regularly. A red oil pressure light means stop driving and get help.'],
  secs:[
   {h:'What oil does',p:['Oil reduces friction between metal parts, carries away heat and holds contaminants until the filter catches them. Over time it breaks down and collects debris, which is why it needs replacing.']},
   {h:'How often',p:['The old rule of thumb of 3,000 miles no longer applies to many modern engines. Your owner\'s manual gives the interval for your engine and oil type, and many cars also have an oil-life monitor. Heavy use such as towing, frequent short trips and hot-weather stop-and-go driving may call for service sooner.']},
   {h:'Checking your oil',ul:['Park on level ground with the engine off for a few minutes.','Pull the dipstick, wipe it, reinsert it fully, and pull it again.','The level should sit between the marks. Add the correct oil if it is low.','If you often need to add oil between changes, have it looked at.']},
   {h:'The filter and grade',p:['A new filter goes in with fresh oil. Use the viscosity grade printed on the oil cap or in the manual; the wrong grade can affect protection and fuel economy.']}
  ],rel:['oil-changes','tire-rotation','brake-repair']},
 {s:'brake-warning-signs',cat:'car',ic:'brake',t:'Brake warning signs',
  lede:'Brakes usually give you warnings before they fail. Knowing what the sounds and feelings mean helps you act early.',
  take:['A squeal while braking often comes from a wear indicator on the pads.','Grinding, a soft pedal, or a longer stopping distance means get the brakes checked promptly.','A brake warning light should be taken seriously. Have the system inspected.'],
  secs:[
   {h:'What you might hear',ul:['Squealing or squeaking: many pads have a built-in metal wear indicator that makes noise when the pad is low.','Grinding: metal on metal can mean the pad material is gone, which can damage the rotors.','Clicking or clunking from a wheel: have it inspected.']},
   {h:'What you might feel',ul:['A soft, spongy or sinking pedal.','Vibration or pulsing in the pedal or steering wheel when braking, which can come from uneven rotors.','The vehicle pulling to one side when you brake.','Longer stopping distances than usual.']},
   {h:'What you might see',p:['A red brake warning light, or an ABS light, means the system needs attention. Low or dark brake fluid is another sign something needs checking. Brake fluid absorbs moisture over time, so manufacturers list a service interval in the owner\'s manual.']},
   {h:'Do not wait',p:['Brakes are a safety system. If something feels or sounds wrong, have them inspected rather than waiting to see if it goes away. Early service is often simpler than repairing the damage from running pads down.']}
  ],rel:['brake-repair','wheel-alignment','tire-rotation']},
 {s:'car-battery-in-florida-heat',cat:'car',ic:'repair',t:'Your car battery in Florida heat',
  lede:'People expect batteries to fail on cold mornings, but heat is harder on them. South Florida summers shorten battery life.',
  take:['Heat speeds up the chemical wear inside a battery, even though the failure often shows up later.','Slow cranking, dim lights, a warning light or corrosion on the terminals are signs to get it tested.','A test is quick. Do it before the battery leaves you stuck.'],
  secs:[
   {h:'Why heat hurts',p:['High under-hood temperatures speed up internal wear and water loss in a battery. Many batteries last roughly three to five years, and hot climates tend to be at the shorter end of that range. Age is only a guide; the condition of the battery matters more.']},
   {h:'Warning signs',ul:['The engine cranks slowly or hesitates before starting.','Headlights dim at idle or when starting.','A battery or charging warning light.','White or blue-green crust on the terminals.','A swollen or leaking battery case.']},
   {h:'What helps',ul:['Keep the terminals clean and the connections tight.','Make sure the battery is secured so it cannot vibrate.','Very short trips do not give the alternator time to recharge the battery.','Have the battery and charging system tested if the car is several years old.']}
  ],rel:[]},
 {s:'wipers-and-coolant-basics',cat:'car',ic:'oil',t:'Wiper and coolant basics',
  lede:'Two small items that matter a lot in Florida: being able to see in a downpour and keeping the engine from overheating.',
  take:['Replace wiper blades when they streak, skip or chatter. Heat and sun wear them quickly.','Check coolant only when the engine is cold. Never open a hot radiator cap.','Use the coolant type in the owner\'s manual, and do not mix types.'],
  secs:[
   {h:'Wipers',p:['Rubber blades harden in sun and heat. Streaks, squeaks, skipping or a blade that leaves a band of water behind are signs it is time. Many drivers replace them about once a year, which is a sensible habit before the rainy season. Keep the washer fluid reservoir filled.']},
   {h:'Coolant',ul:['With the engine cold, look at the coolant reservoir. The level should be between the MIN and MAX marks.','Never open the radiator or reservoir cap on a hot engine. The system is under pressure and can cause burns.','Use the coolant type the manufacturer specifies. Mixing types can cause problems.','Coolant is toxic to people and pets. Wipe up any spills and keep it out of reach.']},
   {h:'Watch the gauge',p:['If the temperature gauge climbs toward hot or a warning light comes on, pull over safely and shut the engine off. Driving an overheated engine can cause expensive damage. Puddles under the car, a sweet smell or repeated low coolant mean the system needs inspection.']}
  ],rel:[]},
 {s:'suspension-warning-signs',cat:'car',ic:'susp',t:'Suspension warning signs',
  lede:'Your suspension keeps the tires on the road, supports the vehicle and absorbs bumps. When parts wear, the ride and your tires tell you.',
  take:['Clunks over bumps, a bouncy ride and a vehicle that leans in turns are common signs.','Uneven or cupped tire wear can point to worn shocks, struts or other components.','Suspension wear affects alignment, so the two are often checked together.'],
  secs:[
   {h:'What you might notice',ul:['A bouncy or floaty ride, or repeated bouncing after a bump.','The nose dips hard when braking or the body leans in turns.','Clunks, knocks or rattles over bumps.','Steering that feels loose or wanders.','Oil or fluid on a shock or strut.']},
   {h:'What your tires show',p:['Worn suspension parts can leave scalloped or cupped patches around the tread, or wear on one edge. If you see that, it is worth an inspection even if the ride feels fine.']},
   {h:'Why it matters',p:['Shocks, struts, control arms and bushings all work together. Worn parts can reduce control and increase stopping distance, and they can throw off the wheel alignment. Add-ons such as lift or leveling kits change geometry and should be paired with an alignment check.']}
  ],rel:['suspension-repair','wheel-alignment','tire-balancing']},
 {s:'road-trip-checklist',cat:'car',ic:'lift',t:'Preparing your car for a road trip',
  lede:'A little preparation before a long drive prevents most roadside trouble. Work through this list a week before you leave, so there is time to fix anything you find.',
  take:['Start with the tires: pressure, tread, condition and the spare.','Check oil, coolant, wipers, lights and the battery.','Pack a basic emergency kit and tell someone your route.'],
  secs:[
   {h:'Tires',ul:['Set pressure to the door-jamb placard, cold. If you are carrying a heavy load, check the manual for guidance.','Check tread depth and look for cracks, bulges and nails.','Check the spare, jack and lug wrench.','Consider rotation or alignment if you have not had them done recently.']},
   {h:'Under the hood',ul:['Oil level and change interval.','Coolant level, when cold.','Washer fluid.','Battery condition and terminals.','Belts and hoses for cracks.']},
   {h:'Brakes, lights and wipers',ul:['Listen and feel for brake warning signs.','Test headlights, brake lights, turn signals and hazards.','Replace worn wiper blades.','Make sure the air conditioning works before you need it.']},
   {h:'In the car',ul:['Phone charger, water, flashlight and a first aid kit.','Jumper cables or a jump pack.','A paper map or offline directions if signal drops.','Roadside assistance number on hand.']}
  ],rel:['tire-rotation','oil-changes','brake-repair','wheel-alignment']}
];
var TIPIDX={};
TIPS.forEach(function(t,i){TIPIDX[t.s]=i});
function words(t){
  var s=t.lede+' '+t.take.join(' ');
  t.secs.forEach(function(x){s+=' '+x.h+' '+(x.p||[]).join(' ')+' '+(x.ul||[]).join(' ')});
  return s.split(/\s+/).length;
}
function mins(t){return Math.max(2,Math.round(words(t)/200))}

/* ===================== TIPS HUB ===================== */
var tpCat='all';
var TPCH=[['all','All'],['tire','Tire care'],['car','Car care']];
$('tp-chips').innerHTML=TPCH.map(function(c){return '<button type="button" data-cat="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+esc(c[1])+'</button>'}).join('');
function tpCard(t){
  return '<a class="tp-card '+t.cat+'" href="#tip/'+t.s+'" data-view-link="tip" data-param="'+t.s+'"><div class="tp-top">'+ic(t.ic)+'<span>'+(t.cat==='tire'?'Tire care':'Car care')+'</span></div>'+
    '<div class="tp-txt"><h3>'+esc(t.t)+'</h3><p>'+esc(t.lede.length>120?t.lede.slice(0,t.lede.lastIndexOf(' ',117))+'…':t.lede)+'</p><small>'+mins(t)+' min read</small></div></a>';
}
function tpRender(){
  ['tire','car'].forEach(function(c){
    $('tp-grid-'+c).innerHTML=TIPS.filter(function(t){return t.cat===c}).map(tpCard).join('');
    $('tp-sec-'+c).hidden=!(tpCat==='all'||tpCat===c);
  });
  var n=TIPS.filter(function(t){return tpCat==='all'||t.cat===tpCat}).length;
  $('tp-count').textContent=n+' articles';
}
$('tp-chips').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  tpCat=b.dataset.cat;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});
  tpRender();
});
tpRender();
ET.pages.push({id:'tips',label:'Tire & Car Care Tips'});

/* ===================== TIP ARTICLE ===================== */
function sizeWidget(){
  var W=[155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335];
  var A=[25,30,35,40,45,50,55,60,65,70,75,80,85];
  var R=[14,15,16,17,18,19,20,21,22,24];
  function opts(a,d){return a.map(function(v){return '<option'+(v===d?' selected':'')+'>'+v+'</option>'}).join('')}
  return '<div class="ta-widget" id="ta-w-size"><h2>Tire size decoder</h2>'+
    '<div class="ta-wf"><label class="f" for="tz-w">Width (mm)<select id="tz-w">'+opts(W,225)+'</select></label>'+
    '<label class="f" for="tz-a">Aspect ratio (%)<select id="tz-a">'+opts(A,65)+'</select></label>'+
    '<label class="f" for="tz-r">Wheel (in)<select id="tz-r">'+opts(R,17)+'</select></label></div>'+
    '<div class="ta-size" id="tz-str" aria-live="polite"></div><ul class="ta-dec" id="tz-dec"></ul><div class="ta-out" id="tz-out"></div>'+
    '<p class="ta-note">Calculated from the numbers you pick. Always confirm fitment for your vehicle with a technician.</p></div>';
}
function sizeBind(){
  function up(){
    var w=+$('tz-w').value, a=+$('tz-a').value, r=+$('tz-r').value;
    var sw=w*a/100, swIn=sw/25.4, dia=r+2*swIn;
    $('tz-str').innerHTML='<span class="w">'+w+'</span><span>/</span><span class="a">'+a+'</span><span class="r">R</span><span class="d">'+r+'</span>';
    $('tz-dec').innerHTML='<li class="w"><b>'+w+'</b><span>Section width: '+w+' mm ('+(w/25.4).toFixed(1)+' in)</span></li>'+
      '<li class="a"><b>'+a+'</b><span>Sidewall height is '+a+'% of the width</span></li>'+
      '<li><b>R</b><span>Radial construction</span></li>'+
      '<li class="d"><b>'+r+'</b><span>Fits a '+r+'-inch diameter wheel</span></li>';
    $('tz-out').innerHTML='Sidewall height: <b>'+Math.round(sw)+' mm ('+swIn.toFixed(1)+' in)</b>. Overall diameter: about <b>'+dia.toFixed(1)+' in</b>.';
  }
  ['tz-w','tz-a','tz-r'].forEach(function(id){$(id).addEventListener('change',up)});
  up();
}
function dotWidget(){
  return '<div class="ta-widget" id="ta-w-dot"><h2>Date code checker</h2>'+
    '<label class="f" for="dt-in">Last four digits of the DOT code<input id="dt-in" inputmode="numeric" maxlength="4" placeholder="2423" autocomplete="off"></label>'+
    '<div class="ta-out" id="dt-out" aria-live="polite">Enter four digits, for example 2423.</div>'+
    '<p class="ta-note">Assumes a tire made in 2000 or later. Age is a guide only. Follow your vehicle and tire manufacturer\'s guidance.</p></div>';
}
function dotBind(){
  $('dt-in').addEventListener('input',function(){
    var v=this.value.replace(/\D/g,'').slice(0,4); this.value=v;
    var out=$('dt-out');
    if(v.length<4){out.textContent='Enter four digits, for example 2423.';return}
    var wk=+v.slice(0,2), yr=2000+(+v.slice(2));
    if(wk<1||wk>53){out.textContent='The first two digits should be a week from 01 to 53. Check the code again.';return}
    var made=new Date(yr,0,1+(wk-1)*7), now=new Date();
    if(made>now){out.textContent='That date is in the future. Check the code again.';return}
    var age=(now-made)/(365.25*24*3600*1000);
    out.innerHTML='Made in <b>week '+wk+' of '+yr+'</b>. That is about <b>'+age.toFixed(1)+' years</b> old.'+(age>=5?' Worth an inspection if it has been on the vehicle this long.':'');
  });
}
ET.onShow.tip=function(param){
  var root=$('ta-root'), i=TIPIDX[param];
  if(i===undefined){notFound(root,'tips','Tips','article');return}
  var t=TIPS[i], prev=TIPS[(i+TIPS.length-1)%TIPS.length], next=TIPS[(i+1)%TIPS.length];
  var hub=t.cat==='tire'?'Tire care':'Car care';
  var secs=t.secs.map(function(x){
    return '<h2 class="ta-h">'+esc(x.h)+'</h2>'+(x.p||[]).map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+
      (x.ul?'<ul class="ta-ul">'+x.ul.map(function(u){return '<li>'+esc(u)+'</li>'}).join('')+'</ul>':'');
  }).join('');
  var rel=t.rel.length?'<div class="ta-box"><h2>Related services</h2><ul>'+t.rel.map(function(s){var d=SVCS[s];return '<li><a href="#service/'+s+'" data-view-link="service" data-param="'+s+'">'+ic(d[0])+esc(d[1])+'</a></li>'}).join('')+'</ul></div>'
    :'<div class="ta-box"><h2>Related services</h2><ul><li><a href="#services" data-view-link="services">'+ic('repair')+'See all services</a></li></ul><p style="margin:0;font-size:14px;color:var(--steel)">Ask the shop what we can do for this one.</p></div>';
  root.innerHTML=
  '<div class="phead"><div class="wrap">'+
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#tips" data-view-link="tips">Tips</a><span>/</span><span>'+esc(t.t)+'</span></nav>'+
    '<h1>'+esc(t.t)+'</h1><p>'+esc(t.lede)+'</p>'+
    '<div class="btns"><a class="btn btn-red" href="#schedule" data-view-link="schedule">Schedule service</a><a class="btn btn-ghost" href="#advisor" data-view-link="advisor">Ask a tech</a></div>'+TRUST+
    '<div class="ta-meta"><span>'+hub+'</span><span>'+mins(t)+' min read</span><span class="note-int">Draft · technician review pending</span></div>'+
  '</div></div>'+
  '<div class="ta-body"><div class="wrap ta-grid"><article class="ta-main">'+
    '<aside class="ta-take" aria-labelledby="ta-tk"><h2 id="ta-tk">Key takeaways</h2><ul>'+t.take.map(function(k){return '<li>'+esc(k)+'</li>'}).join('')+'</ul></aside>'+
    (t.w==='size'?sizeWidget():t.w==='dot'?dotWidget():'')+secs+
    '<p class="ta-draft note-int">General information, not a substitute for your owner\'s manual or a technician\'s inspection. Draft copy for Extreme to review before publishing.</p>'+
  '</article><aside class="ta-side" aria-label="Related">'+rel+
  '</aside></div></div>'+
  '<nav class="br-nav" aria-label="More articles"><div class="wrap">'+
    '<a class="prev" href="#tip/'+prev.s+'" data-view-link="tip" data-param="'+prev.s+'"><small>Previous article</small><b>'+esc(prev.t)+'</b></a>'+
    '<a class="next" href="#tip/'+next.s+'" data-view-link="tip" data-param="'+next.s+'"><small>Next article</small><b>'+esc(next.t)+'</b></a>'+
  '</div></nav>';
  if(t.w==='size')sizeBind();
  if(t.w==='dot')dotBind();
};
ET.pages.push({id:'tip',param:'check-tire-pressure',label:'Tip: Check Tire Pressure'});
