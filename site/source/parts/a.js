var h=ET.esc, $=function(id){return document.getElementById(id)};
var SLUGS=['brake-repair','wheel-alignment','tire-installation','tire-repair','tire-balancing','tire-rotation','suspension-repair','oil-changes','tpms-service','custom-wheels','lift-kits'];

/* ======================= SERVICE DATA ======================= */
var SV={
 'brake-repair':{label:'Brake Repair',name:'Brake Repair',ico:'brake',mode:'shop',
  blurb:'Pads, rotors, calipers and fluid, inspected and explained.',
  intro:'Stopping power is not something to guess about. We inspect your brakes and tell you what needs attention.',
  inc:['Visual inspection of pads, rotors, calipers and brake lines','Measurement of pad thickness and rotor condition','Pad or rotor replacement when they are worn','Brake fluid level and condition check','A check that the vehicle stops straight and feels right after the work'],
  signs:['Squealing, scraping or grinding when you brake','A soft, spongy or low brake pedal','The vehicle pulls to one side when braking','Vibration or pulsing in the pedal or steering wheel','A brake warning light on the dash','It takes longer to stop than it used to'],
  faq:[['How do I know if my brakes are worn?','Noise, vibration, a change in pedal feel and warning lights are common clues. The only way to know for sure is to have the pads and rotors measured.'],
       ['Are pads and rotors always replaced together?','Not always. It depends on how worn the pads are and what condition the rotors are in. A technician measures both before recommending anything.'],
       ['Is it safe to keep driving with grinding brakes?','Grinding often means the pad material is gone and metal is rubbing on metal. That can damage the rotors and reduce stopping ability, so have it inspected as soon as you can.']],
  rel:['wheel-alignment','suspension-repair','tire-rotation']},
 'wheel-alignment':{label:'Wheel Alignments',name:'Wheel Alignment',ico:'align',mode:'shop',
  blurb:'Hunter Engineering alignment to protect your tires and steering.',
  intro:'Our shop aligns on Hunter Engineering equipment so your vehicle tracks straight and your tires wear evenly.',
  inc:['Measurement of camber, caster and toe angles','Alignment on Hunter Engineering equipment','Adjustment toward the vehicle\'s specifications where the vehicle allows it','Look at tire wear patterns that point to alignment trouble','Check of suspension and steering parts that can throw an alignment off'],
  signs:['The vehicle drifts or pulls to one side','The steering wheel is off-center when driving straight','Tires wear unevenly or wear out quickly','You hit a curb or a big pothole','You have just had new tires, suspension work or a lift installed'],
  faq:[['What does an alignment actually do?','It sets the angles of the wheels relative to the vehicle and the road, so the tires meet the pavement the way the manufacturer intended.'],
       ['Do I need an alignment with new tires?','It is often recommended. If the alignment is off, new tires can wear unevenly. A check at installation helps protect the tires.'],
       ['How often should I check alignment?','Many shops suggest a check about once a year, or any time you notice symptoms or have suspension work done. Your owner\'s manual and driving conditions matter too.']],
  rel:['tire-rotation','tire-installation','suspension-repair','lift-kits']},
 'tire-installation':{label:'Tire Installation',name:'Tire Installation',ico:'install',mode:'both',
  blurb:'New tires mounted and balanced at the shop or your driveway.',
  intro:'New tires installed on your schedule, either in our Sunrise shop or by our mobile team where you are.',
  inc:['Removing the old tires and mounting the new ones','Balancing each wheel and tire assembly','New valve stems or caps as needed','Lug nuts tightened to the vehicle\'s torque spec','TPMS check and reset where the vehicle has it','Old tire disposal'],
  signs:['Tread worn down to the wear bars, or about 2/32 inch','Cracks, bulges or bubbles in the sidewall','A tire that keeps losing air or has been repaired more than once','Tires six or more years old with visible aging (check the DOT date code)','Vibration that balancing does not fix'],
  faq:[['How do I read my tire size?','A size like 265/70R17 means 265 millimeters wide, a sidewall height that is 70 percent of the width, radial construction and a 17 inch wheel. The size is printed on the tire sidewall and on a placard in the door jamb.'],
       ['Do I need to replace all four tires?','Not always, but tires on the same axle should match. Some all-wheel-drive vehicles need all four to be close in tread depth, so check your owner\'s manual.'],
       ['How can I tell how old my tires are?','Look for the DOT code on the sidewall. The last four digits are the week and year it was made, for example 2423 means the 24th week of 2023.']],
  rel:['tire-balancing','wheel-alignment','tpms-service','tire-rotation']},
 'tire-repair':{label:'Tire Repair',name:'Tire Repair',ico:'repair',mode:'both',
  blurb:'Flats and slow leaks patched, including roadside flat repair.',
  intro:'A nail or a slow leak does not always mean a new tire. We check the damage and tell you if it can be repaired.',
  inc:['Finding the leak','Inspecting the tire inside and out to see if it can be repaired','Repair from the inside of the tire when the damage qualifies','Re-inflating to the right pressure and checking the valve stem','Balancing again if needed','Roadside flat repair by our mobile team where we can reach you'],
  signs:['A tire that loses pressure day after day','A nail or screw stuck in the tread','A hissing sound or a tire that is flat in the morning','The TPMS light came on','You drove on a flat and are not sure of the damage'],
  faq:[['Can every puncture be repaired?','No. Generally only small punctures in the tread area can be repaired. Damage to the sidewall or shoulder, or a tire driven while flat, usually means replacement. The technician makes that call.'],
       ['Is a plug enough?','Many tire makers recommend a repair from the inside of the tire, done with the tire off the wheel, rather than a plug from the outside alone.'],
       ['Can I drive on a flat to get to you?','Try not to. Even a short drive on a flat can destroy the tire and make a repair impossible. Put on the spare or call for help.']],
  rel:['tire-installation','tpms-service','tire-balancing']},
 'tire-balancing':{label:'Tire Balancing',name:'Tire Balancing',ico:'balance',mode:'both',
  blurb:'High-speed balancing to smooth out vibration.',
  intro:'Balancing evens out the weight around a wheel and tire so the ride stays smooth. Our van carries a high-speed balancer, and the shop has one too.',
  inc:['Mounting the wheel and tire assembly on the balancer','Measuring where the assembly is out of balance','Adding small weights to even it out','A check of the tire and wheel for damage or runout we can see','Mobile or shop, the same process'],
  signs:['Vibration in the steering wheel at highway speeds','A shake felt in the seat or floor','Uneven or cupped tire wear','You have new tires, a repair or a wheel that lost a weight','A noticeable shake after hitting a pothole'],
  faq:[['What is the difference between balancing and alignment?','Balancing evens out weight around each wheel and tire. Alignment sets the angles of the wheels. They fix different problems, though both can show up as vibration or uneven wear.'],
       ['How often should tires be balanced?','At installation, after a tire repair, and any time you feel vibration. Some owners also have it checked at each rotation.'],
       ['Why do wheel weights fall off?','They can be knocked loose by curbs, potholes or rough roads. If you feel a new vibration, a lost weight is one of the things to check.']],
  rel:['tire-installation','tire-rotation','wheel-alignment']},
 'tire-rotation':{label:'Tire Rotation',name:'Tire Rotation',ico:'rotate',mode:'shop',
  blurb:'Even wear and longer life from regular rotation.',
  intro:'Tires wear differently depending on where they sit on the vehicle. Rotating them keeps the wear more even.',
  inc:['Moving the tires to new positions in a pattern that suits your vehicle','Checking tread depth and tire pressure','Looking over each tire for damage or uneven wear','Lug nuts tightened to the vehicle\'s torque spec','Balance check if you feel vibration'],
  signs:['You are near the interval in your owner\'s manual (often every 5,000 to 7,500 miles)','The front tires look more worn than the rear, or the reverse','You notice a new hum or vibration','Your tire maker requires regular rotation for coverage'],
  faq:[['Why rotate tires?','Front and rear tires carry different loads and do different work, so they wear at different rates. Rotation spreads that wear around.'],
       ['Which rotation pattern is right?','It depends on the drivetrain and the tires. Directional tires and different front and rear sizes limit what can be moved where. We use the pattern that suits your setup.'],
       ['Does skipping rotation matter?','It can lead to uneven wear and shorten tire life. Some tire warranties also ask for regular rotation, so check the paperwork for yours.']],
  rel:['tire-balancing','wheel-alignment','tire-installation']},
 'suspension-repair':{label:'Suspension Repair',name:'Suspension Repair',ico:'susp',mode:'shop',
  blurb:'Shocks, struts and steering parts checked and replaced.',
  intro:'Your suspension keeps the tires on the road and the ride under control. We find worn parts before they cause bigger problems.',
  inc:['Inspection of shocks, struts, control arms, bushings and ball joints','Checking tie rods, sway bar links and steering parts for play','Looking for leaks, damage and uneven tire wear','Replacing worn parts','Alignment after parts that affect it are replaced'],
  signs:['A bouncy or floaty ride','Clunks or knocks over bumps','The vehicle nose-dives when braking or leans in turns','Cupped or uneven tire wear','Steering that wanders or feels loose','One corner sits lower than the others'],
  faq:[['How long do shocks and struts last?','It varies a lot with the vehicle and the roads. Many technicians start evaluating them around 50,000 miles. Towing, off-road use and rough roads wear them faster.'],
       ['Why is an alignment needed after suspension work?','Replacing many suspension parts changes the wheel angles. An alignment brings them back to spec so the tires wear evenly.'],
       ['Is a clunking noise serious?','It can be. A clunk may come from a worn link or joint, and some worn steering and suspension parts affect control. Have it inspected soon.']],
  rel:['wheel-alignment','lift-kits','brake-repair','tire-rotation']},
 'oil-changes':{label:'Oil Changes',name:'Oil Changes',ico:'oil',mode:'both',
  blurb:'Oil and filter changes at your location or at the shop.',
  intro:'Fresh oil and a new filter are the simplest way to look after an engine. Our mobile team can do it while you work.',
  inc:['Draining the old oil and replacing the filter','New oil of the type your manufacturer specifies','A check of fluid levels and tire pressure','Resetting the oil reminder where the vehicle has one','Mobile service needs a flat, firm spot to work'],
  signs:['The oil change light or reminder is on','You are near the mileage or time interval in your manual','The oil on the dipstick looks dark and gritty or is low','The engine sounds louder than usual','It has been a long time, even if you have not driven much'],
  faq:[['How often should I change my oil?','Follow your owner\'s manual. Intervals vary widely with the engine and the oil. Short trips, stop-and-go traffic and towing are usually treated as severe service with shorter intervals.'],
       ['Synthetic or conventional?','Use the oil type and viscosity your manual specifies. Synthetic oils generally hold up longer under heat and stress, but the manual is the rule.'],
       ['Can you really do it at my location?','Yes, our mobile team does oil changes in our service area. You will need a level, firm place for the van to work, such as a driveway or lot.']],
  rel:['tire-rotation','brake-repair','tpms-service']},
 'tpms-service':{label:'TPMS Service',name:'TPMS Service',ico:'tpms',mode:'shop',
  blurb:'Tire pressure sensors scanned, reset or replaced.',
  intro:'When the tire pressure light stays on, the cause is either low air or a sensor problem. We check both.',
  inc:['Scanning each sensor with a TPMS tool','Checking pressure and sensor signal','Resetting or relearning the system after tire work','Replacing or programming sensors when needed','Checking valve stems at the same time'],
  signs:['The tire pressure light is on or blinks and stays on','The light came on after a tire change or rotation','One tire shows no reading','A tire keeps losing air','Cold mornings bring the light on'],
  faq:[['Why is my tire pressure light on?','Most often a tire is low on air. Check all four with a gauge when the tires are cold and compare to the pressure on the door jamb placard. If the light stays on, a sensor may need attention.'],
       ['Do TPMS sensors wear out?','Yes. The sensors have sealed batteries that do not last forever, and they can also be damaged during tire service. Ask for a sensor check at tire service.'],
       ['Can I keep driving with the light on?','If a tire is just a little low, drive carefully to add air. If a tire looks flat or very low, do not keep driving on it.']],
  rel:['tire-installation','tire-repair','tire-rotation']},
 'custom-wheels':{label:'Custom Wheels Service',name:'Custom Wheels',ico:'wheel',mode:'shop',
  blurb:'Wheel sourcing, fitment checks and tire + wheel packages.',
  intro:'Choose a wheel, and we match the tires and check the fit so it looks right and works right on your vehicle.',
  inc:['Help choosing a wheel in the finish, size and style you want','Fitment check of bolt pattern, offset and clearance','Matching tire sizes to keep the overall diameter close to stock','Mounting and balancing the tire and wheel assembly','TPMS sensor handling','Installing the wheels on the vehicle'],
  signs:['Your wheels are bent, cracked, curbed or corroded','You want a different look or larger wheels','You are adding a lift or leveling kit and want new wheels and tires','You want wheels sized for a specific tire'],
  faq:[['Will bigger wheels change the ride?','They often do. A larger wheel usually takes a tire with a shorter sidewall, which can feel firmer and look sportier.'],
       ['Do I need new tires with new wheels?','Often yes, especially if the wheel diameter changes. The tire size has to match the wheel.'],
       ['Can I keep my TPMS sensors?','Often the sensors can be moved to new wheels or replaced. Our team will go over what your vehicle needs.']],
  rel:['lift-kits','tire-installation','tpms-service']},
 'lift-kits':{label:'Lift Kits',name:'Lift Kits & Leveling',ico:'lift',mode:'shop',
  blurb:'Leveling and lift kits installed at the Sunrise shop.',
  intro:'From a leveling kit to a full lift, we help you plan the build and install it at the Sunrise shop.',
  inc:['A conversation about how you use the vehicle and how much height you want','Kit installation','Checks of steering, driveline angles and brake lines that a lift can affect','Tire and wheel fitment planning','Alignment on Hunter Engineering equipment after the install'],
  signs:['You want to fit larger tires','You want more off-road clearance','The front of your truck sits lower than the rear and you want a level stance','You are building a Jeep, truck or SUV and want to plan the full package'],
  faq:[['What is the difference between leveling and lifting?','A leveling kit usually raises the front of a truck or SUV to match the rear. A lift kit raises the whole vehicle by more and uses different parts.'],
       ['Do I need an alignment after a lift?','Yes. Changing the ride height changes the wheel angles, so an alignment is part of doing it right.'],
       ['Does a lift change how the vehicle drives?','It can affect handling, braking, headlight aim and speedometer accuracy if the tires get larger. That is why we plan the build as a whole.']],
  rel:['custom-wheels','wheel-alignment','suspension-repair']}
};
var MOBILE_SLUGS=['tire-installation','tire-balancing','tire-repair','oil-changes'];
var SHOP_SLUGS=['wheel-alignment','brake-repair','suspension-repair','tire-rotation','tpms-service','custom-wheels','lift-kits'];
function modeBadge(m){return m==='both'?'<span class="sp-badge"><svg width="14" height="14" aria-hidden="true"><use href="#i-van"/></svg>Mobile or shop</span>':'<span class="sp-badge sp-bs">Shop only</span>'}
function link(slug){return 'href="#service/'+slug+'" data-view-link="service" data-param="'+slug+'"'}

/* ======================= SERVICES HUB ======================= */
function card(slug,mob){
  var s=SV[slug];
  return '<a class="sv-card" '+link(slug)+'><span class="sv-badge '+(mob?'mob':'shp')+'">'+(mob?'Mobile + shop':'Shop')+'</span>'+ET.icon(s.ico)+'<b>'+h(s.name)+'</b><p>'+h(s.blurb)+'</p><span class="sv-more">Details &rarr;</span></a>';
}
$('sv-grid-mobile').innerHTML=MOBILE_SLUGS.map(function(s){return card(s,true)}).join('');
$('sv-grid-shop').innerHTML=SHOP_SLUGS.map(function(s){return card(s,false)}).join('');

/* ======================= SERVICE PAGE ======================= */
function renderService(param){
  var root=$('sp-root'), s=SV[param];
  if(!s){
    root.innerHTML='<div class="phead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#services" data-view-link="services">Auto Service</a></nav></div></div>'+
      '<div class="wrap sp-nf"><h1>We could not find that service</h1><p>The page you wanted is not here, but every service we offer is on our Auto Service page.</p><a class="btn btn-red" href="#services" data-view-link="services">See all services</a></div>';
    return;
  }
  var i=SLUGS.indexOf(param), prev=SV[SLUGS[(i+SLUGS.length-1)%SLUGS.length]], next=SV[SLUGS[(i+1)%SLUGS.length]];
  var ps=SLUGS[(i+SLUGS.length-1)%SLUGS.length], ns=SLUGS[(i+1)%SLUGS.length];
  var listHtml=function(a,cls){return '<ul class="sp-list '+cls+'">'+a.map(function(x){return '<li><span>'+h(x)+'</span></li>'}).join('')+'</ul>'};
  var isGear=(param==='custom-wheels'||param==='lift-kits');
  root.innerHTML=
   '<div class="phead sp-phead"><div class="wrap">'+
     '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#services" data-view-link="services">Auto Service</a><span>/</span><span>'+h(s.name)+'</span></nav>'+
     '<div class="sp-title"><div class="sp-ico">'+ET.icon(s.ico)+'</div><div style="display:grid;gap:12px"><h1>'+h(s.name)+'</h1><div class="sp-tags">'+modeBadge(s.mode)+'</div></div></div>'+
     '<p>'+h(s.intro)+'</p>'+
   '</div></div>'+
   '<div class="wrap sp-body">'+
     '<div class="sp-main">'+
       '<div class="sp-photo" role="img" aria-label="Photo placeholder for '+h(s.name)+'">'+ET.icon(s.ico)+'<span class="sample-note note-int">Photo to add: '+h(s.name)+' at the shop</span></div>'+
       '<section aria-labelledby="sp-inc-h"><h2 id="sp-inc-h">What&rsquo;s included</h2>'+listHtml(s.inc,'sp-inc')+
         '<p style="margin:14px 0 0"><span class="sample-note note-int">Exact scope for your vehicle: shop to confirm</span></p></section>'+
       '<section aria-labelledby="sp-sig-h"><h2 id="sp-sig-h">'+(isGear?'Reasons to consider it':'Signs you may need it')+'</h2>'+listHtml(s.signs,'sp-signs')+
         '<p style="margin:14px 0 0;color:var(--steel);font-size:14px">These are general signs, not a diagnosis. Have a technician inspect the vehicle to know for sure.</p></section>'+
     '</div>'+
     '<aside class="sp-aside" aria-label="Service details"><div class="sp-card">'+
       '<div class="sp-fact"><small>Where</small><b>'+(s.mode==='both'?'Mobile or at the shop':'At the Sunrise shop')+'</b></div>'+
       '<div class="sp-fact sp-ph"><small>Typical time</small><b>X min <em style="font-size:14px">sample</em></b><span class="sample-note">Sample placeholder</span><span class="sample-note note-int">Shop to confirm</span></div>'+
       '<div class="sp-fact sp-ph"><small>Starting at</small><b>$XX <em style="font-size:14px">sample</em></b><span class="sample-note">Sample placeholder price</span><span class="sample-note note-int">Pricing set by the shop</span></div>'+
       '<a class="btn btn-red" href="#quote" data-view-link="quote" data-svc="'+h(s.label)+'">Request a quote</a>'+
       '<a class="btn btn-ghost" href="#schedule" data-view-link="schedule" data-sched="'+param+'">Schedule a repair</a>'+
       '<p class="sp-trust"><b>4.7★ from 1,319 Birdeye reviews</b><br>Hunter alignment · Mobile + shop</p>'+
       '<p class="sp-call">Questions? Call <a href="tel:+19547731896">(954) 773-1896</a></p>'+
     '</div></aside>'+
   '</div>'+
   '<div class="wrap"><nav class="sp-pn" aria-label="More services"><a '+link(ps)+'><small>&larr; Previous</small><b>'+h(prev.name)+'</b></a><a class="nx" '+link(ns)+'><small>Next &rarr;</small><b>'+h(next.name)+'</b></a></nav></div>'+
   '<section class="sp-related" aria-labelledby="sp-rel-h"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Related</div><h2 id="sp-rel-h" style="font-size:clamp(24px,2.8vw,34px);font-weight:800">Often done together</h2></div><a class="btn btn-dark" href="#services" data-view-link="services">All services</a></div>'+
     '<div class="sp-rel-grid">'+s.rel.slice(0,3).map(function(r){return card(r,SV[r].mode==='both')}).join('')+'</div></div></section>'+
   '<section class="sp-faqsec" aria-labelledby="sp-faq-h"><div class="wrap sp-faq" style="max-width:900px"><h2 id="sp-faq-h" style="font-size:clamp(24px,2.8vw,34px);font-weight:800;margin-bottom:14px">Common questions</h2>'+
         s.faq.map(function(q,n){return '<details'+(n===0?' open':'')+'><summary>'+h(q[0])+'</summary><p>'+h(q[1])+'</p></details>'}).join('')+'</div></section>';
}
ET.onShow.service=function(param){renderService(param)};

/* ======================= WHEELS VISUALIZER ======================= */
var FIN=[
 {k:'gloss',n:'Gloss black',st:['#4a4c52','#17181a','#34363a'],lip:['#2c2d30','#08080a','#1d1e20'],hi:.3},
 {k:'machined',n:'Machined',st:['#f3f4f6','#a4a8b0','#e6e8eb'],lip:['#ffffff','#9ea3ab','#e9ebee'],hi:.35},
 {k:'bronze',n:'Bronze',st:['#dca466','#7b4c24','#bd8148'],lip:['#e6b27a','#6d421f','#c28650'],hi:.25},
 {k:'chrome',n:'Chrome look',st:['#ffffff','#8c95a1','#f7f9fb','#76808c'],lip:['#ffffff','#7f8995','#f2f4f7'],hi:.5},
 {k:'matte',n:'Matte grey',st:['#8c9097','#5a5e65','#7b8087'],lip:['#7a7e85','#4d5157','#6e7279'],hi:0}
];
var STY=[
 {k:'five',n:'5-spoke'},{k:'split',n:'Split-spoke'},{k:'mesh',n:'Mesh'},{k:'classic',n:'Classic'}
];
var DIAS=[17,18,19,20,21,22];
var VEH={
 jeep:{d:17,note:'Stock or lifted, offset and backspacing decide how much clearance the tires get.'},
 truck:{d:20,note:'Bigger wheels and tires on a truck often go with a leveling kit or lift. Load rating matters.'},
 suv:{d:20,note:'Larger wheels can change ride feel. We keep the overall tire diameter close to stock.'},
 car:{d:18,note:'Lower-profile tires on larger wheels look sportier and usually ride firmer.'}
};
var wst={veh:'truck',fin:'gloss',dia:20,sty:'split'};
function pt(r,a){var t=a*Math.PI/180;return [r*Math.cos(t),r*Math.sin(t)]}
function f1(n){return Math.round(n*10)/10}
function spokes(sty,rr,hr,fr){
  var o='',i,a;
  if(sty==='five'){
    var hw1=hr*.62, hw2=rr*.2;
    for(i=0;i<5;i++)o+='<path stroke="none" transform="rotate('+(i*72-90)+')" d="M'+f1(hr*.7)+' '+f1(-hw1)+' L'+f1(fr)+' '+f1(-hw2)+' Q'+f1(fr+3)+' 0 '+f1(fr)+' '+f1(hw2)+' L'+f1(hr*.7)+' '+f1(hw1)+'Z"/>';
  } else if(sty==='split'){
    var w1=hr*.3, w2=rr*.07;
    for(i=0;i<10;i++){a=Math.floor(i/2)*72-90+(i%2?10:-10);
      o+='<path stroke="none" transform="rotate('+a+')" d="M'+f1(hr*.7)+' '+f1(-w1)+' L'+f1(fr)+' '+f1(-w2)+' L'+f1(fr)+' '+f1(w2)+' L'+f1(hr*.7)+' '+f1(w1)+'Z"/>'}
  } else if(sty==='mesh'){
    var sw=Math.max(3,rr*.032), n=16, d=36;
    for(i=0;i<n;i++){a=i*(360/n);
      var p0=pt(hr*1.15,a), p1=pt(fr,a+d), p2=pt(fr,a-d);
      o+='<path fill="none" stroke-width="'+f1(sw)+'" d="M'+f1(p0[0])+' '+f1(p0[1])+' L'+f1(p1[0])+' '+f1(p1[1])+'"/>'+
         '<path fill="none" stroke-width="'+f1(sw)+'" d="M'+f1(p0[0])+' '+f1(p0[1])+' L'+f1(p2[0])+' '+f1(p2[1])+'"/>';
    }
    o+='<circle fill="none" stroke-width="'+f1(sw*1.5)+'" r="'+f1(fr*.62)+'"/><circle fill="none" stroke-width="'+f1(sw*1.8)+'" r="'+f1(hr*1.25)+'"/>';
  } else {
    var c1=hr*.26, c2=rr*.055;
    for(i=0;i<8;i++)o+='<path stroke="none" transform="rotate('+(i*45)+')" d="M'+f1(hr*.7)+' '+f1(-c1)+' L'+f1(fr)+' '+f1(-c2)+' L'+f1(fr)+' '+f1(c2)+' L'+f1(hr*.7)+' '+f1(c1)+'Z"/>';
    o+='<circle fill="none" stroke-width="'+f1(rr*.05)+'" r="'+f1(fr*.55)+'"/><circle fill="none" stroke-width="'+f1(rr*.075)+'" r="'+f1(hr*1.5)+'"/>';
  }
  return o;
}
function grads(){
  return FIN.map(function(f){
    var stops=function(a){return a.map(function(c,i){return '<stop offset="'+Math.round(i/(a.length-1)*100)+'%" stop-color="'+c+'"/>'}).join('')};
    return '<linearGradient id="wh-g-'+f.k+'" gradientUnits="userSpaceOnUse" x1="70" y1="60" x2="330" y2="340">'+stops(f.st)+'</linearGradient>'+
           '<linearGradient id="wh-l-'+f.k+'" gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="340" y2="340">'+stops(f.lip)+'</linearGradient>';
  }).join('');
}
function wheelSVG(st){
  var R=190, rr=R*st.dia/33, hr=rr*.2, fr=rr-8, f=FIN.filter(function(x){return x.k===st.fin})[0];
  var mid=(R+rr)/2, rot=rr*.62;
  var cap=pt(rr*.66,-35), capEnd=pt(rr*.66,35);
  var lugs='';for(var i=0;i<5;i++){var p=pt(hr*.64,i*72-90);lugs+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(hr*.2)+'" fill="#17181a" stroke="rgba(255,255,255,.55)" stroke-width="1"/>'}
  return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><defs>'+grads()+'<radialGradient id="wh-tire" cx="50%" cy="50%" r="50%"><stop offset="'+Math.round(rr/R*100)+'%" stop-color="#232326"/><stop offset="'+Math.round((rr/R+(1-rr/R)*.5)*100)+'%" stop-color="#151517"/><stop offset="100%" stop-color="#0a0a0b"/></radialGradient></defs>'+
   '<g transform="translate(200 200)">'+
   '<circle r="'+R+'" fill="url(#wh-tire)"/>'+
   '<circle r="'+(R-4)+'" fill="none" stroke="#2c2c30" stroke-width="7" stroke-dasharray="9 6"/>'+
   '<circle r="'+f1(mid)+'" fill="none" stroke="#2a2a2d" stroke-width="1.5"/>'+
   '<circle r="'+f1(rr+3)+'" fill="none" stroke="#303034" stroke-width="3"/>'+
   '<circle r="'+f1(rr)+'" fill="#050506"/>'+
   '<circle r="'+f1(rot)+'" fill="#6c7078" stroke="#3b3e44" stroke-width="3"/>'+
   '<circle r="'+f1(rot*.62)+'" fill="none" stroke="#4e5157" stroke-width="2"/>'+
   '<path d="M'+f1(cap[0])+' '+f1(cap[1])+' A'+f1(rr*.66)+' '+f1(rr*.66)+' 0 0 1 '+f1(capEnd[0])+' '+f1(capEnd[1])+'" fill="none" stroke="#c4161a" stroke-width="'+f1(rr*.16)+'"/>'+
   '</g>'+
   '<g class="wh-spin"><g transform="translate(200 200)" fill="url(#wh-g-'+st.fin+')" stroke="url(#wh-g-'+st.fin+')" stroke-linecap="round">'+
   spokes(st.sty,rr,hr,fr)+
   '<circle r="'+f1(hr)+'" stroke="none"/><circle r="'+f1(hr*.86)+'" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>'+lugs+
   '<circle r="'+f1(hr*.34)+'" fill="#17181a" stroke="none"/><circle r="'+f1(hr*.12)+'" fill="#e3161b" stroke="none"/>'+
   '</g></g>'+
   '<g transform="translate(200 200)" fill="none">'+
   '<circle r="'+f1(rr-4)+'" stroke="url(#wh-l-'+st.fin+')" stroke-width="8"/>'+
   '<circle r="'+f1(rr-10)+'" stroke="rgba(0,0,0,.55)" stroke-width="1.5"/>'+
   (f.hi?'<path d="M'+f1(pt(rr-4,200)[0])+' '+f1(pt(rr-4,200)[1])+' A'+f1(rr-4)+' '+f1(rr-4)+' 0 0 1 '+f1(pt(rr-4,262)[0])+' '+f1(pt(rr-4,262)[1])+'" stroke="#fff" stroke-opacity="'+f.hi+'" stroke-width="3" stroke-linecap="round"/>':'')+
   '</g></svg>';
}
function miniSVG(sty){
  var rr=176, hr=34, fr=166;
  return '<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false"><g transform="translate(200 200)" fill="currentColor" stroke="currentColor"><circle r="190" fill="none" stroke-width="16"/>'+spokes(sty,rr,hr,fr)+'<circle r="'+hr+'" stroke="none"/></g></svg>';
}
function finName(){return FIN.filter(function(x){return x.k===wst.fin})[0].n}
function styName(){return STY.filter(function(x){return x.k===wst.sty})[0].n}
function swatchBg(f){return 'linear-gradient(135deg,'+f.st.join(',')+')'}
function renderWheel(spin){
  var cv=$('wh-canvas'); cv.innerHTML=wheelSVG(wst);
  cv.setAttribute('aria-label','Illustration of a '+finName().toLowerCase()+', '+wst.dia+' inch, '+styName().toLowerCase()+' wheel');
  if(spin&&!ET.reduce){var g=cv.querySelector('.wh-spin');if(g){g.style.transition='none';g.style.transform='rotate(-18deg)';void g.getBoundingClientRect();g.style.transition='';g.style.transform=''}}
  $('wh-title').textContent=finName()+' · '+wst.dia+'" · '+styName();
  $('wh-sub').textContent='Mock-up keeps the overall tire diameter fixed, so a larger wheel means a shorter sidewall. Real wheels vary by brand and model.';
  $('wh-fin-name').textContent=finName(); $('wh-dia-name').textContent=wst.dia+' inch'; $('wh-sty-name').textContent=styName();
  $('wh-vnote').textContent=VEH[wst.veh].note;
  [].forEach.call($('wh-veh').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.veh===wst.veh))});
  [].forEach.call($('wh-fin').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.fin===wst.fin))});
  [].forEach.call($('wh-dia').children,function(b){b.setAttribute('aria-pressed',String(+b.dataset.dia===wst.dia))});
  [].forEach.call($('wh-sty').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.sty===wst.sty))});
}
$('wh-fin').innerHTML=FIN.map(function(f){return '<button type="button" class="wh-sw" data-fin="'+f.k+'" aria-label="'+h(f.n)+'" title="'+h(f.n)+'" style="background:'+swatchBg(f)+'"></button>'}).join('');
$('wh-dia').innerHTML=DIAS.map(function(d){return '<button type="button" data-dia="'+d+'" aria-label="'+d+' inch">'+d+'"</button>'}).join('');
$('wh-sty').innerHTML=STY.map(function(s){return '<button type="button" data-sty="'+s.k+'">'+miniSVG(s.k)+s.n+'</button>'}).join('');
$('wh-veh').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;wst.veh=b.dataset.veh;wst.dia=VEH[wst.veh].d;renderWheel(true)});
$('wh-fin').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;wst.fin=b.dataset.fin;renderWheel(true)});
$('wh-dia').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;wst.dia=+b.dataset.dia;renderWheel(true)});
$('wh-sty').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;wst.sty=b.dataset.sty;renderWheel(true)});
$('wh-quote').addEventListener('click',function(){
  var d=$('q-details'); if(d&&!d.value.trim())d.value='Wheel look from the visualizer mock-up: '+finName()+', '+wst.dia+' inch, '+styName()+' ('+wst.veh+').';
});
renderWheel(false);
var whStore=document.querySelector('[data-wh-store]');
if(whStore){try{whStore.style.backgroundImage='url("'+ET.STORE+'")';whStore.style.backgroundPosition='78% 70%'}catch(_){}}

/* ======================= SCHEDULE ======================= */
var DAYN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MONN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var sc={where:'shop',day:null,wins:[]}, pendingSvc=null, pendingTab=null;
var SDAYS=(function(){var out=[],d=new Date();while(out.length<6){d.setDate(d.getDate()+1);if(d.getDay()===0)continue;out.push({k:DAYN[d.getDay()]+' '+MONN[d.getMonth()]+' '+d.getDate(),d:DAYN[d.getDay()],m:MONN[d.getMonth()]+' '+d.getDate(),sat:d.getDay()===6})}return out})();
sc.day=SDAYS[0].k;
$('sc-pick').innerHTML=SLUGS.map(function(s){var v=SV[s];return '<label for="sc-s-'+s+'"><input type="checkbox" id="sc-s-'+s+'" name="sc-svc" value="'+s+'" data-mode="'+v.mode+'">'+ET.icon(v.ico)+'<span>'+h(v.label)+'</span></label>'}).join('');
function chosenSvcs(){return [].slice.call($('sc-pick').querySelectorAll('input:checked')).map(function(i){return i.value})}
function windowsFor(day){return day.sat?['8–10 AM','10–12 PM','12–2 PM','2–4 PM']:['8–10 AM','10–12 PM','12–2 PM','2–4 PM','4–6 PM']}
function curDay(){return SDAYS.filter(function(x){return x.k===sc.day})[0]||SDAYS[0]}
function renderDays(){
  $('sc-days').innerHTML=SDAYS.map(function(x){return '<button type="button" data-day="'+x.k+'" aria-pressed="'+(x.k===sc.day)+'">'+x.d+'<small>'+x.m+'</small></button>'}).join('');
  var w=windowsFor(curDay());
  sc.wins=sc.wins.filter(function(x){return w.indexOf(x)>-1});
  $('sc-wins').innerHTML=w.map(function(x){return '<button type="button" data-win="'+x+'" aria-pressed="'+(sc.wins.indexOf(x)>-1)+'">'+x+'</button>'}).join('');
  $('sc-wincount').textContent=sc.wins.length?'('+sc.wins.length+' of 2 chosen)':'';
}
function shopOnlyPicked(){return chosenSvcs().filter(function(s){return SV[s].mode!=='both'})}
function updateSummary(){
  var s=chosenSvcs();
  $('sc-s-svc').textContent=s.length?s.map(function(x){return SV[x].label}).join(', '):'None yet';
  $('sc-s-where').textContent=sc.where==='mobile'?'At my location (mobile)':'Sunrise shop';
  $('sc-s-when').textContent=sc.wins.length?curDay().k+', '+sc.wins.join(' or '):'Pick a day and window';
  [].forEach.call($('sc-pick').children,function(l){var i=l.querySelector('input');l.classList.toggle('sc-dim',sc.where==='mobile'&&i.dataset.mode!=='both')});
}
function updateWhere(){
  [].forEach.call($('sc-where').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.where===sc.where))});
  $('sc-mobile').hidden=sc.where!=='mobile'; $('sc-mobnote').hidden=sc.where!=='mobile'; $('sc-drop').hidden=sc.where!=='shop';
  updateSummary();
}
renderDays(); updateWhere();
$('sc-where').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;sc.where=b.dataset.where;updateWhere();if(sc.where==='mobile')$('sc-zip').focus()});
$('sc-pick').addEventListener('change',function(){$('sc-err-svc').textContent='';updateSummary()});
$('sc-days').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;sc.day=b.dataset.day;renderDays();updateSummary();$('sc-err-when').textContent=''});
$('sc-wins').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var w=b.dataset.win,i=sc.wins.indexOf(w);
  if(i>-1)sc.wins.splice(i,1);else{sc.wins.push(w);if(sc.wins.length>2)sc.wins.shift()}
  renderDays();updateSummary();$('sc-err-when').textContent=''});
$('sc-zip').addEventListener('input',function(){var z=this.value.trim(),c=ET.county(z),r=$('sc-zipres');
  r.className='zipres '+(c?'ok':(z.length===5?'no':''));
  r.textContent=c?'Yes, we cover '+z+' in '+c+' County.':(z.length===5?'That ZIP is outside our regular route. Call (954) 773-1896 and we will see what we can do.':'')});
function radio(name){var r=document.querySelector('input[name="'+name+'"]:checked');return r?r.value:''}
document.querySelectorAll('input[name="sc-contact"]').forEach(function(r){r.addEventListener('change',function(){
  $('sc-email-opt').textContent=radio('sc-contact')==='email'?'(required)':'(optional)'})});
$('sc-form').addEventListener('submit',function(e){
  e.preventDefault();
  var bad=null, set=function(id,msg,el){$(id).textContent=msg||'';if(msg&&!bad)bad=el};
  var g=function(id){return $(id).value.trim()}, yr=new Date().getFullYear();
  var svcs=chosenSvcs(), so=shopOnlyPicked();
  if(!svcs.length)set('sc-err-svc','Pick at least one service.',$('sc-pick').querySelector('input'));
  else if(sc.where==='mobile'&&so.length)set('sc-err-svc','These are shop jobs: '+so.map(function(x){return SV[x].label}).join(', ')+'. Choose the Sunrise shop or remove them.',$('sc-where').children[0]);
  else set('sc-err-svc','');
  var y=g('sc-year');
  set('sc-err-year',/^(19|20)\d\d$/.test(y)&&+y<=yr+1?'':'Enter a 4-digit year.',$('sc-year'));
  set('sc-err-make',g('sc-make')?'':'Please enter the make.',$('sc-make'));
  set('sc-err-model',g('sc-model')?'':'Please enter the model.',$('sc-model'));
  if(sc.where==='mobile'){var c=ET.county(g('sc-zip'));if(!c){if(!bad)bad=$('sc-zip');var r=$('sc-zipres');r.className='zipres no';r.textContent=g('sc-zip').length===5?'That ZIP is outside our regular route. Call (954) 773-1896 or pick the shop.':'Enter a 5-digit ZIP code.'}}
  set('sc-err-when',sc.wins.length?'':'Pick at least one arrival window.',$('sc-wins').querySelector('button'));
  set('sc-err-name',g('sc-name')?'':'Please enter your name.',$('sc-name'));
  set('sc-err-phone',g('sc-phone').replace(/\D/g,'').length>=10?'':'Enter a 10-digit phone number.',$('sc-phone'));
  var em=g('sc-email'), cp=radio('sc-contact');
  set('sc-err-email',(em===''&&cp==='email')?'Add an email so we can reach you.':(em!==''&&!/.+@.+\..+/.test(em)?'Enter an email like name@example.com':''),$('sc-email'));
  var done=$('sc-done');
  if(bad){done.hidden=true;bad.focus();return}
  var how={text:'text',call:'phone call',email:'email'}[cp]||'text';
  var where=sc.where==='mobile'?'Mobile at '+g('sc-zip'):'Sunrise shop ('+(radio('sc-drop')==='leave'?'leaving the vehicle':'waiting')+')';
  done.innerHTML='<h3>Request ready, '+h(g('sc-name').split(' ')[0])+'.</h3>'+
   '<p style="margin:0 0 10px"><b>Prototype only, nothing was sent.</b> '+h(svcs.map(function(x){return SV[x].label}).join(', '))+' &middot; '+h(g('sc-year')+' '+g('sc-make')+' '+g('sc-model'))+' &middot; '+h(where)+' &middot; '+h(curDay().k+', '+sc.wins.join(' or '))+'</p>'+
   '<ol class="timeline"><li class="now"><b>Request received</b><small>On the live site this goes to the shop</small></li>'+
   '<li><b>We will confirm by '+how+'</b><small>With the day and arrival window that works</small></li>'+
   '<li><b>Reminder before your visit</b><small>'+(sc.where==='mobile'?'Plus the parking checklist':'Plus shop address and hours')+'</small></li>'+
   '<li><b>Service day</b><small>'+(sc.where==='mobile'?'Our tech arrives in your window':'7712 W Oakland Park Blvd, Sunrise')+'</small></li></ol>';
  done.hidden=false; done.focus();
});
ET.onShow.schedule=function(){
  if(pendingSvc){
    $('sc-pick').querySelectorAll('input').forEach(function(i){i.checked=pendingSvc.indexOf(i.value)>-1});
    pendingSvc=null; $('sc-err-svc').textContent=''; updateSummary();
  }
};

/* ======================= ADVISOR: tabs ======================= */
var advTab='maintenance';
function setTab(t,focus){
  advTab=t;
  ['maintenance','diagnostic'].forEach(function(k){
    var on=k===t, b=$('ad-tab-'+k);
    b.setAttribute('aria-selected',String(on)); b.tabIndex=on?0:-1; $('ad-panel-'+k).hidden=!on;
    if(on&&focus)b.focus();
  });
}
document.querySelector('.ad-tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setTab(b.dataset.tab)});
document.querySelector('.ad-tabs').addEventListener('keydown',function(e){
  var k=e.key; if(k!=='ArrowLeft'&&k!=='ArrowRight'&&k!=='Home'&&k!=='End')return;
  e.preventDefault(); setTab(k==='ArrowLeft'||k==='Home'?'maintenance':'diagnostic',true);
});
ET.onShow.advisor=function(){setTab(pendingTab||advTab);pendingTab=null};

/* capture-phase: runs before the router so state is ready when the page shows */
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a'); if(!a)return;
  if(a.dataset.sched!==undefined){pendingSvc=a.dataset.sched?a.dataset.sched.split(','):[]}
  else if(a.dataset.viewLink==='schedule'&&!a.dataset.sched){pendingSvc=null}
  if(a.dataset.advTab)pendingTab=a.dataset.advTab;
},true);

/* ======================= ADVISOR: Diagnostic Center ======================= */
var IC={
 engine:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="M9 22h4v-6h8v-4h8v4h4l3 4h4v14h-4l-3 4H17l-4-5v-3H9z"/><path d="M20 22h8M20 28h8"/></svg>',
 tpms:ET.icon('tpms'),
 brake:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="24" cy="24" r="10"/><path d="M24 19v7M24 29.5v.5"/><path d="M10 14a16 16 0 0 0 0 20M38 14a16 16 0 0 1 0 20"/></svg>',
 battery:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><rect x="6" y="17" width="36" height="22" rx="2"/><path d="M12 17v-4h6v4M30 17v-4h6v4M13 28h7M30 28h7M33.5 24.5v7"/></svg>',
 oil:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M6 20l4 2h6l4-5h10l4 4 8-5-1 12-7-1v8H14l-2-8z"/><path d="M40 33c-2 3-3 4-3 6a3 3 0 0 0 6 0c0-2-1-3-3-6z"/></svg>',
 abs:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="24" cy="24" r="13"/><path d="M9 14a18 18 0 0 0 0 20M39 14a18 18 0 0 1 0 20"/><text x="24" y="28" text-anchor="middle" font-family="Montserrat,Arial,sans-serif" font-weight="800" font-size="10" fill="currentColor" stroke="none">ABS</text></svg>'
};
var LIGHTS=[
 {k:'engine',n:'Check engine light',lvl:'amb',lt:'Amber · have it checked soon',
  mean:'The engine computer has stored a fault, usually related to emissions or engine performance. The light alone cannot say which part is the problem.',
  steady:'A steady light usually means get it checked soon. A loose or missing gas cap is a common, simple cause on some vehicles, so check that it is tight.',
  now:['If the light is steady and the vehicle drives normally, plan to have it inspected soon.','If the light is flashing, or the engine runs rough or loses power, reduce speed, pull over where it is safe and get help. A flashing light usually points to something more serious.','Do not ignore it for weeks. Small issues can grow into larger repairs.'],
  svc:'oil-changes',svcLabel:null},
 {k:'tpms',n:'Tire pressure (TPMS) light',lvl:'amb',lt:'Amber · check your tires',
  mean:'One or more tires are low on air, or the tire pressure monitoring system has a fault. If the light blinks for about a minute and then stays on, that usually points to the system itself.',
  now:['Check all four tires with a gauge when they are cold. Compare to the pressure on the door jamb placard, not the number on the tire.','Add air if needed. The light often goes out after driving a short distance.','If a tire is very low, looks flat or keeps losing air, do not keep driving on it. Have it inspected.','If the light stays on after the pressures are correct, a sensor may need attention.'],
  svc:'tpms-service',svcLabel:'TPMS Service'},
 {k:'brake',n:'Brake warning light',lvl:'red',lt:'Red · treat as urgent',
  mean:'This light can mean the parking brake is still on, the brake fluid is low, or there is a problem in the braking system.',
  now:['Make sure the parking brake is fully released.','If the light stays on, or the pedal feels soft, goes low or the vehicle takes longer to stop, do not keep driving. Pull over safely and get help.','Do not keep topping up fluid and driving. Low brake fluid can point to a leak or worn pads, and it needs to be inspected.'],
  svc:'brake-repair',svcLabel:'Brake Repair'},
 {k:'battery',n:'Battery / charging light',lvl:'red',lt:'Red · limited drive time',
  mean:'The charging system is not keeping the battery charged. The cause can be the alternator, a belt, a connection or the battery.',
  now:['The vehicle may only run for a short time on battery power. Turn off extras like the radio and A/C.','Head straight to a safe place or a shop. Avoid shutting the engine off, since it may not restart.','If you also see a squealing noise or the engine temperature rising, pull over and get help.'],
  svc:null,svcLabel:null},
 {k:'oil',n:'Oil pressure light',lvl:'red',lt:'Red · stop safely',
  mean:'The engine is not getting enough oil pressure. That can be low oil or a more serious problem, and running an engine without oil pressure can ruin it quickly.',
  now:['Pull over where it is safe and shut the engine off.','Wait a few minutes, then check the oil level with the dipstick.','If the oil is low, adding the correct oil may help, but the cause still needs to be found. If the light stays on, do not drive. Have the vehicle towed.'],
  svc:'oil-changes',svcLabel:'Oil Changes'},
 {k:'abs',n:'ABS light',lvl:'amb',lt:'Amber · braking still works',
  mean:'The anti-lock braking system has detected a problem. The regular brakes usually still work, but the anti-lock function may not.',
  now:['Drive carefully and leave extra stopping distance, especially on wet roads.','If the ABS light is on together with the red brake light, treat it as urgent and get help.','Have the system inspected soon. A bad wheel speed sensor is one of several possible causes.'],
  svc:'brake-repair',svcLabel:'Brake Repair'}
];
$('ad-lights').innerHTML=LIGHTS.map(function(l,n){
  return '<details class="ad-light"'+(n===0?' open':'')+'><summary><span class="ad-ic '+l.lvl+'">'+IC[l.k]+'</span><span><h3>'+h(l.n)+'</h3><span class="ad-lvl '+l.lvl+'">'+h(l.lt)+'</span></span></summary>'+
   '<div class="ad-det"><div><h4>What it usually means</h4><p>'+h(l.mean)+'</p></div>'+(l.steady?'<p>'+h(l.steady)+'</p>':'')+
   '<div><h4>What to do</h4><ul>'+l.now.map(function(x){return '<li>'+h(x)+'</li>'}).join('')+'</ul></div>'+
   '<p><b>Always have a technician inspect it.</b> A light shows that something needs a look, not what the repair is.</p>'+
   '<div class="btns"><a class="btn btn-dark" href="#schedule" data-view-link="schedule"'+(l.svc&&SV[l.svc]&&l.svcLabel?' data-sched="'+l.svc+'"':'')+'>Schedule an inspection</a>'+
   (l.svc&&l.svcLabel?'<a class="btn btn-ghost sp-ghostlt" '+link(l.svc)+'>'+h(l.svcLabel)+'</a>':'')+'</div></div></details>';
}).join('');

/* ======================= ADVISOR: Maintenance ======================= */
var ITEMS=[
 {k:'rotate',ico:'rotate',n:'Tire rotation',slug:'tire-rotation',why:'Helps front and rear tires wear evenly.',
  iv:{highway:'Every 5,000 to 7,500 miles',city:'Every 5,000 to 6,000 miles',severe:'About every 5,000 miles'},
  extra:function(m){if(m<5000)return '';var lo=Math.floor(m/7500),hi=Math.floor(m/5000);return 'At this mileage that is roughly '+lo+' to '+hi+' rotation intervals. If you cannot remember your last one, ask for it.'}},
 {k:'balance',ico:'balance',n:'Balance check',slug:'tire-balancing',why:'Smooths out vibration and helps tires wear evenly.',
  iv:{highway:'With new tires, after a repair or when you feel vibration',city:'With new tires, after a repair or when you feel vibration',severe:'Also after rough off-road use or a lost wheel weight'}},
 {k:'align',ico:'align',n:'Alignment check',slug:'wheel-alignment',why:'Keeps the vehicle tracking straight and protects your tires.',
  iv:{highway:'About once a year or after a curb or pothole hit',city:'About once a year or after a curb or pothole hit',severe:'Every 6 to 12 months and after any suspension change'}},
 {k:'brakes',ico:'brake',n:'Brake inspection',slug:'brake-repair',why:'Pads and rotors wear gradually, and the pedal may not tell you until late.',
  iv:{highway:'About once a year',city:'Every 6 to 12 months, since stop-and-go wears pads faster',severe:'About every 6 months, since loads add braking demand'}},
 {k:'oil',ico:'oil',n:'Oil change',slug:'oil-changes',why:'Fresh oil protects the engine.',
  iv:{highway:'Per your owner\'s manual normal schedule',city:'Per the severe-service schedule in your manual',severe:'Per the severe-service schedule in your manual'}},
 {k:'tpms',ico:'tpms',n:'TPMS check',slug:'tpms-service',why:'Keeps pressure monitoring working so low tires are caught early.',
  iv:{highway:'Check pressure monthly, sensors at tire service',city:'Check pressure monthly, sensors at tire service',severe:'Check pressure monthly, sensors at tire service'},
  extra:function(m){return m>=60000?'Sensors have a limited battery life, so ask for a sensor check at your next tire service.':''}},
 {k:'tread',ico:'install',n:'Tread depth check',slug:null,why:'Worn tread hurts wet-weather grip.',
  iv:{highway:'Monthly, and replace before 2/32 inch',city:'Monthly, and replace before 2/32 inch',severe:'Monthly, and replace before 2/32 inch'},
  extra:function(){return 'Many technicians suggest replacing sooner than 2/32 inch for better wet traction.'}},
 {k:'susp',ico:'susp',n:'Suspension inspection',slug:'suspension-repair',why:'Worn shocks and joints affect control and tire wear.',
  iv:{highway:'Around 50,000 miles, then at least yearly',city:'Around 50,000 miles, then at least yearly',severe:'Yearly, and sooner if the ride changes'},
  only:function(m,c){return m>=50000||c==='severe'}}
];
var CONDN={highway:'mostly highway',city:'stop-and-go',severe:'towing or off-road'};
function band(m){
  if(m<10000)return 'Low-mileage range. Follow the first services in your manual, and keep up pressure and tread checks.';
  if(m<50000)return 'Routine range. Rotations, oil and a yearly look at the brakes and alignment keep small things small.';
  if(m<100000)return 'Mid-life range. Brakes, suspension and tires have seen real wear, so a full inspection is a good idea.';
  return 'High-mileage range. Brakes, suspension and tire age deserve extra attention. A full inspection is a good idea.';
}
function fmt(n){return n.toLocaleString('en-US')}
function renderAdvisor(m,c){
  var items=ITEMS.filter(function(i){return !i.only||i.only(m,c)});
  var out='<div class="ad-sumline"><b>'+h(fmt(m))+' miles · '+h(CONDN[c])+'</b><span>'+h(band(m))+'</span></div>'+
   '<div class="ad-items" id="ad-items">'+items.map(function(i,n){
     var ex=i.extra?i.extra(m,c):'';
     return '<label class="ad-item" for="ad-i-'+i.k+'"><input type="checkbox" id="ad-i-'+i.k+'" '+(i.slug?'data-slug="'+i.slug+'" checked':'disabled')+'>'+ET.icon(i.ico)+
       '<span><b>'+h(i.n)+'</b><span class="ad-int">Typical: '+h(i.iv[c])+'</span><p>'+h(i.why)+'</p>'+(ex?'<p class="ad-extra">'+h(ex)+'</p>':'')+'</span></label>'}).join('')+'</div>'+
   '<div class="ad-book"><div><b style="font:800 18px var(--display);text-transform:uppercase">Ask about these</b><p id="ad-book-n"></p></div><a class="btn btn-red" id="ad-book" href="#schedule" data-view-link="schedule" data-sched="">Book these</a></div>'+
   '<p class="ad-disc"><b>Follow your owner\'s manual.</b> These are general intervals and conversation starters, not a diagnosis or a service plan for your exact vehicle. Our team will confirm what your vehicle needs.</p>';
  $('ad-result').innerHTML=out;
  syncBook();
}
function syncBook(){
  var s=[].slice.call(document.querySelectorAll('#ad-items input[data-slug]:checked')).map(function(i){return i.dataset.slug});
  var b=$('ad-book'); if(!b)return;
  b.dataset.sched=s.join(',');
  $('ad-book-n').textContent=s.length?s.length+' service'+(s.length===1?'':'s')+' selected. They will be pre-picked on the schedule form.':'Check at least one item to pre-pick services on the schedule form.';
  b.textContent=s.length?'Book these ('+s.length+')':'Schedule a repair';
}
$('ad-result').addEventListener('change',function(e){if(e.target.closest('#ad-items'))syncBook()});
$('ad-form').addEventListener('submit',function(e){
  e.preventDefault();
  var raw=$('ad-miles').value.replace(/[,\s]/g,''), err=$('ad-miles-err'), m=+raw;
  if(!/^\d+$/.test(raw)){err.textContent='Enter your mileage as a number, like 47000.';$('ad-miles').focus();return}
  if(m>500000){err.textContent='That looks too high. Check the odometer and try again.';$('ad-miles').focus();return}
  err.textContent='';
  var c=radio('ad-cond')||'highway';
  renderAdvisor(m,c);
  var r=$('ad-result'); if(window.matchMedia&&matchMedia('(max-width:860px)').matches)r.scrollIntoView({behavior:ET.reduce?'auto':'smooth',block:'start'});
});

/* ======================= Jump menu entries ======================= */
ET.pages.push({id:'wheels',label:'Wheels',group:1});
ET.pages.push({id:'services',label:'Auto Service',group:1});
ET.pages.push({id:'service',param:'brake-repair',label:'Service: Brake Repair',group:1});
ET.pages.push({id:'schedule',label:'Schedule a Repair',group:1});
ET.pages.push({id:'advisor',label:'Diagnostic & Maintenance Advisor',group:1});
