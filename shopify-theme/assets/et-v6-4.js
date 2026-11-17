try{(function(){
var h=ET.esc, $=function(id){return document.getElementById(id)};
var SLUGS=['brake-repair','wheel-alignment','tire-installation','tire-repair','tire-balancing','tire-rotation','suspension-repair','oil-changes','tpms-service','custom-wheels','lift-kits'];

/* ======================= SERVICE DATA ======================= */
var SP_IMG={'brake-repair':'brake','wheel-alignment':'alignment','tire-installation':'installation','tire-repair':'repair','tire-balancing':'balancing','tire-rotation':'rotation','suspension-repair':'suspension','oil-changes':'oil','tpms-service':'tpms','custom-wheels':'wheels','lift-kits':'lift','ac-repair':'ac-repair','general-mechanical':'mechanical','caliper-painting':'caliper-paint','rim-repair':'rim-repair','custom-builds':'custom-builds','custom-lighting':'lighting','train-horns':'train-horns','golf-cart-upgrades':'golf-cart','fleet-maintenance':'fleet','semi-truck-service':'semi','mower-service':'mower','skid-steer-service':'skid-steer','lockout-assistance':'lockout','jump-starts':'jump-start'};
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
  blurb:'New or used tires mounted and balanced at the shop or your driveway.',
  intro:'New or used tires installed on your schedule, either in our Sunrise shop or by our mobile team where you are.',
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
 'tire-rotation':{label:'Tire Rotation',name:'Tire Rotation',ico:'rotate',mode:'both',
  blurb:'Even wear and longer life from regular rotation, at the shop or your location.',
  intro:'Tires wear differently depending on where they sit on the vehicle. Rotating them keeps the wear more even. We do it at our Sunrise shop or bring the van to you.',
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
 'tpms-service':{label:'TPMS Service',name:'TPMS Service',ico:'tpms',mode:'both',
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
  rel:['custom-wheels','wheel-alignment','suspension-repair']},
 'ac-repair':{label:'A/C Repair',name:'A/C Repair',ico:'repair',mode:'shop',
  blurb:'Diagnosis and repair for cars, trucks and more.',
  intro:'When the air stops blowing cold, we find out why and fix it, so the cabin is comfortable again.',
  inc:['Diagnosis of why the A/C is not cooling','Refrigerant level and leak checks','Compressor, condenser and related component repair','Check of blower and controls','A test that the system cools properly after the work'],
  signs:['Air from the vents is warm or only slightly cool','Cooling comes and goes','Strange noises when the A/C is on','Weak airflow from the vents','A musty smell when the system runs'],
  faq:[['What can cause an A/C to stop cooling?','Common causes include low refrigerant from a leak, a failing compressor, electrical faults and blocked or damaged components. A technician checks the system to find the actual cause.'],['Is a recharge enough?','Sometimes, but low refrigerant usually points to a leak. We look for the cause so the fix lasts.'],['Do you work on trucks and equipment too?','Ask the shop. Tell us the vehicle and what it is doing and we will confirm what we can take on.']],
  rel:['general-mechanical','custom-builds','fleet-maintenance']},
 'general-mechanical':{label:'General Mechanical Work',name:'General Mechanical Work',ico:'repair',mode:'shop',
  blurb:'Routine service, diagnostics and repairs.',
  intro:'From routine maintenance to a problem you cannot quite name, our technicians diagnose it and fix it.',
  inc:['Inspection and diagnosis of the problem','Routine maintenance and service','Repairs once you approve the scope','Fluid and filter service as needed','A check that the vehicle runs right after the work'],
  signs:['A warning light is on','New noises, vibration or leaks','The vehicle is running rough or hesitating','Maintenance is overdue','You want a second look before a long trip'],
  faq:[['Do I need to know what is wrong before I come in?','No. Describe what you notice and we will diagnose it and explain what we find before any work starts.'],['Can you do routine maintenance too?','Yes. Routine service is part of what we do, along with repairs.'],['How do I get a price?','Call the shop or request a quote. Pricing depends on the vehicle and the work.']],
  rel:['ac-repair','brake-repair','oil-changes']},
 'caliper-painting':{label:'Caliper Painting',name:'Caliper Painting',ico:'brake',mode:'shop',
  blurb:'Custom caliper paint in any color.',
  intro:'Painted calipers add a finished look behind your wheels. Pick the color and we handle the rest.',
  inc:['Brake caliper paint in the color you choose','Surface prep before painting','Careful masking of the parts that should not be painted','Reinstallation and a check of the brake system','Advice on how the finish will hold up'],
  signs:['You want your wheels to stand out','You are doing a custom build or wheel upgrade','Your calipers are rusty or faded','You want colors that match your vehicle'],
  faq:[['What colors can you do?','Any color. Tell us what you have in mind and we will confirm the options.'],['Does painting affect braking?','Paint is for looks. We check the brake system while the calipers are off so it works as it should.'],['Can this be done with new wheels or brakes?','Yes, it pairs well with a wheel or brake job. Ask the shop about timing.']],
  rel:['brake-repair','custom-wheels','rim-repair']},
 'rim-repair':{label:'Rim Repair',name:'Rim Repair',ico:'wheel',mode:'shop',
  blurb:'Curb rash, bends and surface damage fixed.',
  intro:'A scraped or bent rim does not always need replacing. We look at the damage and tell you what can be repaired.',
  inc:['Inspection of the rim damage','Curb rash and surface repair','Straightening of bent rims where it can be done','Refinishing to match','Check that the wheel and tire seal and balance properly'],
  signs:['Scrapes or gouges from hitting a curb','A bent rim or a vibration at speed','A tire that keeps losing air at the rim','Corrosion or peeling finish'],
  faq:[['Can every damaged rim be repaired?','Not always. Some damage is too deep or cracked. A technician inspects it and tells you honestly.'],['Will the repaired rim match the others?','We refinish to match as closely as possible. Ask the shop what to expect for your wheel.'],['Do you replace rims too?','Yes. See our Custom Wheels page or ask for a quote.']],
  rel:['custom-wheels','tire-balancing','caliper-painting']},
 'custom-builds':{label:'Custom Builds',name:'Custom Builds',ico:'lift',mode:'shop',
  blurb:'From off-road setups to show-ready builds.',
  intro:'Tell us the look and the use, from trail-ready to show-ready, and we plan the build with you.',
  inc:['A planning conversation about what you want','Lift or lowering, wheels and tires','Lighting and exterior upgrades','Suspension and mechanical work to support the build','A final check before you pick it up'],
  signs:['You want a vehicle that stands out','You are planning an off-road setup','You want upgrades done in one place','You are not sure where to start'],
  faq:[['What kinds of builds do you do?','Everything from off-road setups to show-ready builds. Bring your idea and we will talk it through.'],['Can you do the work in stages?','Often yes. Tell us your budget and timeline and we will suggest an order.'],['How do I get a price?','Call the shop or request a quote with the vehicle and what you want to do.']],
  rel:['lift-kits','custom-wheels','custom-lighting']},
 'custom-lighting':{label:'Custom Lighting',name:'Custom Lighting',ico:'lift',mode:'shop',
  blurb:'LED, underglow, rock lights and full setups.',
  intro:'Light up the road ahead and your build too, from a single light bar to a full custom lighting setup.',
  inc:['LED light bars and pods','Underglow and rock lights','Wiring and switches done cleanly','Full custom lighting setups','A check that everything works before you leave'],
  signs:['You want better visibility off-road or at night','You want your build to stand out','You are adding accessories to a truck, cart or other vehicle','Your current lights are dim or failing'],
  faq:[['What lighting do you install?','LED bars and pods, underglow, rock lights and complete custom setups. Tell us the vehicle and the look.'],['Is the wiring done properly?','Yes. We route and protect the wiring and add switches so it is clean and reliable.'],['Do you do lighting on carts and equipment?','Ask the shop with the vehicle and what you have in mind.']],
  rel:['custom-builds','golf-cart-upgrades','lift-kits']},
 'train-horns':{label:'Train Horns',name:'Train Horns',ico:'lift',mode:'shop',
  blurb:'Loud, durable horn systems with custom installs.',
  intro:'Be heard. We install train horn systems built to last, with a clean custom install.',
  inc:['Train horn system installation','Custom mounting for your vehicle','Wiring and controls','A function test before you leave','Advice on placement and setup'],
  signs:['You want a louder horn','You are finishing a custom truck build','You want a durable, long-lasting system'],
  faq:[['What vehicles can take a train horn?','Many trucks and other vehicles can. Tell us what you drive and we will confirm what fits.'],['Are there rules about using them?','Local rules on horn use and loudness can apply. Check your area, and ask us if you are unsure.'],['Is the install custom?','Yes. We mount and wire it for your vehicle.']],
  rel:['custom-builds','custom-lighting','golf-cart-upgrades']},
 'golf-cart-upgrades':{label:'Golf Cart Upgrades',name:'Golf Cart Upgrades',ico:'lift',mode:'shop',
  blurb:'Lifts, wheels, tires, lighting and performance upgrades.',
  intro:'Make your golf cart your own, with lifts, wheels and tires, lighting and performance upgrades.',
  inc:['Lift kits','Wheels and tires','Lighting','Performance upgrades','A check that everything works before you ride'],
  signs:['You want a lifted, custom look','You want better ride or traction','You want lights for night use','You want more performance'],
  faq:[['What upgrades do you offer?','Lifts, wheels, tires, lighting and performance upgrades. Tell us the cart and what you want.'],['Can you upgrade any cart?','Tell us the make and model and the shop will confirm.'],['Can I combine upgrades?','Yes. Many people do lift, wheels and tires, and lights together.']],
  rel:['custom-lighting','custom-wheels','lift-kits']},
 'fleet-maintenance':{label:'Fleet Maintenance',name:'Fleet Maintenance',ico:'van',mode:'both',
  blurb:'Scheduled service and repairs for cars and trucks to semis.',
  intro:'Keep every vehicle on the road. We handle scheduled service and repairs for fleets of cars, trucks and larger equipment.',
  inc:['Scheduled maintenance for your vehicles','Repairs when something goes wrong','Tire service','Service at your lot or at our shop where it fits','One shop for the whole fleet'],
  signs:['You have several vehicles that need regular service','Downtime is costing you','Maintenance is hard to keep up with','You want one place to handle it all'],
  faq:[['What counts as a fleet?','Any group of vehicles that run for your business, from a few vans to trucks, semis and equipment.'],['Do you come to us?','Often. Ask the shop what we can do at your location for your fleet.'],['How do we set it up?','Call the shop or use our Commercial page and tell us what you run.']],
  rel:['semi-truck-service','general-mechanical','tire-installation']},
 'semi-truck-service':{label:'Semi Truck Service',name:'Semi Truck Service',ico:'van',mode:'both',
  blurb:'Tires, maintenance and repairs for semis.',
  intro:'Semis earn when they roll. We keep them there with tires, maintenance and repairs.',
  inc:['Semi tire service','Routine maintenance','Repairs','Service at your lot or at our shop where it fits'],
  signs:['Tires are worn or damaged','Maintenance is due','Something does not sound or feel right','You need to avoid downtime'],
  faq:[['Can you come to my truck?','Often. Ask the shop what we can do where your truck is.'],['Do you do tires and repairs?','Yes, tires, maintenance and repairs.'],['Can you handle several trucks?','Yes. See Fleet Maintenance.']],
  rel:['fleet-maintenance','general-mechanical','tire-installation']},
 'mower-service':{label:'Mower Service',name:'Mower Service',ico:'repair',mode:'both',
  blurb:'Tire, maintenance and repair for commercial and residential mowers.',
  intro:'Keep the lawn crew moving. We service mowers, commercial or residential.',
  inc:['Mower tire service','Maintenance','Repairs','Service for commercial and residential mowers'],
  signs:['A flat or worn mower tire','The mower is due for service','The mower runs rough or will not start','You run several mowers and want one shop'],
  faq:[['Do you service commercial mowers?','Yes, commercial and residential.'],['Can you do mower tires?','Yes. Tell us the size or the mower and we will help.'],['Can you come to us?','Ask the shop what we can do where your equipment is.']],
  rel:['skid-steer-service','fleet-maintenance','tire-repair']},
 'skid-steer-service':{label:'Skid Steer Service',name:'Skid Steer Service',ico:'repair',mode:'both',
  blurb:'Tires, maintenance and repairs for compact equipment.',
  intro:'Skid steers and compact equipment take a beating. We handle tires, maintenance and repairs.',
  inc:['Tire service','Routine maintenance','Repairs','Service at your site or at our shop where it fits'],
  signs:['A flat or worn tire','Maintenance is due','Something feels off when operating','You need to keep a job on schedule'],
  faq:[['What equipment do you service?','Skid steers and other compact equipment. Tell us the machine and the problem.'],['Can you come to the job site?','Ask the shop what we can do at your location.'],['Can you handle tires?','Yes, tires, maintenance and repairs.']],
  rel:['mower-service','fleet-maintenance','semi-truck-service']},
 'lockout-assistance':{label:'Vehicle Lockout Assistance',name:'Vehicle Lockout Assistance',ico:'van',mode:'mobile',
  blurb:'Locked out? Our mobile team comes to you.',
  intro:'Keys locked in the car or can\'t get in? Our mobile team comes to your location to help you get back in.',
  inc:['Mobile response to your location','Help getting into your locked vehicle','Care taken to avoid damaging the door, lock or paint','Mobile only. We come to you'],
  signs:['Keys locked inside the vehicle','A lost or broken key','A key fob that will not unlock the doors','You are stuck at home, work or on the road'],
  faq:[['Do you do lockouts at the shop?','No. Lockout assistance is a mobile service, so we come to you.'],['How do I request it?','Call (954) 773-1896 for the fastest response, or send a request on the Schedule page.'],['Will it damage my car?','Our technicians work to get you in without damaging the door, lock or paint.']],
  rel:['jump-starts','tire-repair','tire-installation']},
 'jump-starts':{label:'Battery Jump Starts',name:'Battery Jump Starts',ico:'van',mode:'mobile',
  blurb:'Dead battery? We bring the jump to you.',
  intro:'A dead battery does not have to ruin your day. Our mobile team comes to your location and gets you started.',
  inc:['Mobile response to your location','Jump start for a dead or weak battery','Mobile only. We come to you'],
  signs:['The engine clicks but will not start','Dim lights or a dash that flickers','You left the lights on','The vehicle has sat unused for a while'],
  faq:[['Do you do jump starts at the shop?','No. Jump starts are a mobile service, so we come to you.'],['How do I request one?','Call (954) 773-1896 for the fastest response, or send a request on the Schedule page.'],['What if it will not stay started?','A battery that keeps dying may need to be replaced. Tell us when you call.']],
  rel:['lockout-assistance','tire-repair','tire-installation']}
};
var MOBILE_SLUGS=['tire-installation','tire-repair','tire-rotation','tpms-service','lockout-assistance','jump-starts','tire-balancing','oil-changes'];
var MORE_SLUGS=['ac-repair','general-mechanical','caliper-painting','rim-repair','custom-builds','custom-lighting','train-horns','golf-cart-upgrades','fleet-maintenance','semi-truck-service','mower-service','skid-steer-service'];var NAV_SLUGS=SLUGS.concat(MORE_SLUGS,['lockout-assistance','jump-starts']);
var SHOP_SLUGS=['wheel-alignment','brake-repair','suspension-repair','custom-wheels','lift-kits'];
ET.SV=SV;
/* Booking pickers (Quote page + Mobile page) built from the same service list as the Services pages */
(function(){
  var DARK={},LIGHT=true;
  function img(slug,light){var n=SP_IMG[slug];return n&&n!=='x'?'<img class="pk-img" src="'+ETM+'etm-services-'+(light?'':'dark-')+n+'.webp" alt="" width="72" height="72" loading="lazy" decoding="async">':'<svg class="pk-img" aria-hidden="true" width="72" height="72"><use href="#i-'+(SV[slug].ico||'van')+'"/></svg>'}
  function lab(id,i,slug,light,tag){var v=SV[slug];return '<label for="'+id+i+'"><input type="checkbox" id="'+id+i+'" name="svc" value="'+h(v.label)+'">'+img(slug,light)+'<span>'+h(v.label)+(tag?'<em class="pk-tag">'+tag+'</em>':'')+'</span></label>'}
  var qp=$('pick'),mp=$('mq-pick');
  if(qp){var order=['tire-installation','tire-repair','tire-balancing','tire-rotation','tpms-service','oil-changes','lockout-assistance','jump-starts','brake-repair','wheel-alignment','suspension-repair','custom-wheels','lift-kits','ac-repair','general-mechanical','rim-repair','caliper-painting','custom-builds','custom-lighting','train-horns','golf-cart-upgrades','fleet-maintenance','semi-truck-service','mower-service','skid-steer-service'];
    qp.innerHTML=order.map(function(s,i){var m=SV[s].mode;return lab('pk',i,s,false,m==='mobile'?'Mobile only':m==='shop'?'Shop only':'Mobile or shop')}).join('')+'<label for="pk99"><input type="checkbox" id="pk99" name="svc" value="Shop Now, Pay Later"><img class="pk-img" src="'+ETM+'etm-services-dark-paylater.webp" alt="" width="72" height="72" loading="lazy" decoding="async"><span>Shop Now, Pay Later</span></label>'}
  if(mp){mp.innerHTML=MOBILE_SLUGS.concat(['fleet-maintenance','semi-truck-service','mower-service','skid-steer-service']).map(function(s,i){return lab('mpk',i,s,true,'')}).join('')}
})();
function modeBadge(m){return m==='mobile'?'<span class="sp-badge"><svg width="14" height="14" aria-hidden="true"><use href="#i-van"/></svg>Mobile only</span>':m==='both'?'<span class="sp-badge"><svg width="14" height="14" aria-hidden="true"><use href="#i-van"/></svg>Mobile or shop</span>':'<span class="sp-badge sp-bs">Shop only</span>'}
function link(slug){return 'href="#service/'+slug+'" data-view-link="service" data-param="'+slug+'"'}

/* ======================= SERVICES HUB ======================= */
function card(slug,mob){
  var s=SV[slug];
  return '<a class="sv-card" '+link(slug)+'><span class="sv-badge '+(s.mode==='mobile'?'mob':(s.mode==='both'?'mob':'shp'))+'">'+(s.mode==='mobile'?'Mobile only':(s.mode==='both'?'Mobile + shop':'Shop only'))+'</span>'+(SP_IMG[slug]?'<img class="sv-img" src="'+ETM+'etm-services-'+SP_IMG[slug]+'.webp" alt="" loading="lazy">':ET.icon(s.ico))+'<b>'+h(s.name)+'</b><p>'+h(s.blurb)+'</p><span class="sv-more">Details &rarr;</span></a>';
}
$('sv-grid-mobile').innerHTML=MOBILE_SLUGS.map(function(s){return card(s,true)}).join('');
$('sv-grid-shop').innerHTML=SHOP_SLUGS.map(function(s){return card(s,false)}).join('');
$('sv-grid-more').innerHTML=MORE_SLUGS.map(function(s){return card(s,SV[s].mode==='both')}).join('');

/* ======================= SERVICE PAGE ======================= */
function renderService(param){
  var root=$('sp-root'), s=SV[param];
  if(!s){
    root.innerHTML='<div class="phead"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#services" data-view-link="services">Auto Service</a></nav></div></div>'+
      '<div class="wrap sp-nf"><h1>We could not find that service</h1><p>The page you wanted is not here, but every service we offer is on our Auto Service page.</p><a class="btn btn-red" href="#services" data-view-link="services">See all services</a></div>';
    return;
  }
  var i=NAV_SLUGS.indexOf(param), prev=SV[NAV_SLUGS[(i+NAV_SLUGS.length-1)%NAV_SLUGS.length]], next=SV[NAV_SLUGS[(i+1)%NAV_SLUGS.length]];
  var ps=NAV_SLUGS[(i+NAV_SLUGS.length-1)%NAV_SLUGS.length], ns=NAV_SLUGS[(i+1)%NAV_SLUGS.length];
  var listHtml=function(a,cls){return '<ul class="sp-list '+cls+'">'+a.map(function(x){return '<li><span>'+h(x)+'</span></li>'}).join('')+'</ul>'};
  var isGear=/^(custom-wheels|lift-kits|custom-builds|custom-lighting|train-horns|golf-cart-upgrades|caliper-painting)$/.test(param);
  root.innerHTML=
   '<div class="phead sp-phead"><div class="wrap">'+
     '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#services" data-view-link="services">Auto Service</a><span>/</span><span>'+h(s.name)+'</span></nav>'+
     '<div class="sp-title">'+(SP_IMG[param]?'<div class="sp-ico has-img"><img src="'+ETM+'etm-services-dark-'+SP_IMG[param]+'.webp" alt="'+h(s.name)+' icon"></div>':'<div class="sp-ico">'+ET.icon(s.ico)+'</div>')+'<div style="display:grid;gap:12px"><h1>'+h(s.name)+'</h1><div class="sp-tags">'+modeBadge(s.mode)+'</div></div></div>'+
     '<p>'+h(s.intro)+'</p>'+
   '</div></div>'+
   '<div class="wrap sp-body">'+
     '<div class="sp-main">'+
       '<section aria-labelledby="sp-inc-h"><h2 id="sp-inc-h">What&rsquo;s included</h2>'+listHtml(s.inc,'sp-inc')+
         '<p style="margin:14px 0 0"><span class="sample-note">Exact scope for your vehicle: shop to confirm</span></p></section>'+
       '<section aria-labelledby="sp-sig-h"><h2 id="sp-sig-h">'+(isGear?'Reasons to consider it':'Signs you may need it')+'</h2>'+listHtml(s.signs,'sp-signs')+
         '<p style="margin:14px 0 0;color:var(--steel);font-size:14px">These are general signs, not a diagnosis. Have a technician inspect the vehicle to know for sure.</p></section>'+
     '</div>'+
     '<aside class="sp-aside" aria-label="Service details"><div class="sp-card">'+
       '<div class="sp-fact"><small>Where</small><b>'+(s.mode==='both'?'Mobile or at the shop':(s.mode==='mobile'?'We come to you':'At the Sunrise shop'))+'</b></div>'+
       '<div class="sp-fact"><small>Typical time</small><b>Ask the shop</b></div>'+
       '<div class="sp-fact"><small>Starting at</small><b>Call for pricing</b></div>'+
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

/* ======================= SCHEDULE: wizard wired to the ops booking backend ======================= */
var pendingSvc=null, pendingTab=null;
function radio(name){var r=document.querySelector('input[name="'+name+'"]:checked');return r?r.value:''}
(function swInit(){
  var f=$('sw-form'); if(!f||!window.ETCal)return;
  var BOOK={endpoint:'https://qaxxwpojwpqkwqlpzrck.supabase.co/functions/v1/booking-intake'},PHONE='(954) 773-1896';
  var SHOP={addr:'7712 West Oakland Park Blvd',zip:'33351'};
  var cfg=null,live=false,booted=false,zipState=null,zipSeq=0,busy=false,done=false,step=1,where='',chosen={};
  var daysEl=$('sw-days'),timesEl=$('sw-times'),zip=$('sw-zip'),znote=$('sw-zipnote'),nextB=$('sw-next'),backB=$('sw-back'),subB=$('sw-submit');
  var WIN=[{k:'morning',l:'Morning (8 am to noon)',a:480,b:720},{k:'midday',l:'Midday (noon to 3 pm)',a:720,b:900},{k:'afternoon',l:'Afternoon (3 to 6 pm)',a:900,b:1080},{k:'evening',l:'Evening (6 to 9 pm)',a:1080,b:1260},{k:'any',l:'Any time that day',a:0,b:1440}];
  var NEXTL=['','Next: Vehicle','Next: What you need','Next: Pick a time','Next: Your details'];
  var TYPE={'tire-installation':'new_tires','tire-repair':'flat_repair','tire-balancing':'mount_balance','tire-rotation':'rotation_check','oil-changes':'oil_change','lockout-assistance':'roadside_assist','jump-starts':'roadside_assist','brake-repair':'brake_repair','wheel-alignment':'alignment_suspension','suspension-repair':'alignment_suspension','ac-repair':'mechanical_ac_tpms','tpms-service':'mechanical_ac_tpms','general-mechanical':'mechanical_ac_tpms','custom-wheels':'wheels_rims','rim-repair':'wheels_rims','caliper-painting':'wheels_rims','lift-kits':'lift_custom','custom-builds':'lift_custom','custom-lighting':'lift_custom','train-horns':'lift_custom','golf-cart-upgrades':'lift_custom','fleet-maintenance':'fleet_equipment','semi-truck-service':'fleet_equipment','mower-service':'fleet_equipment','skid-steer-service':'fleet_equipment'};ET.SVC_TYPE=TYPE;
  function tm(s){var m=/^(\d\d):(\d\d)/.exec(s||'');return m?(+m[1])*60+(+m[2]):0}
  function isoOf(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function setErr(id,msg){var e=$(id);if(e)e.textContent=msg||''}
  function shopNow(){
    var p={};
    try{new Intl.DateTimeFormat('en-US',{timeZone:(cfg&&cfg.timezone)||'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value})}
    catch(e){var d=new Date();return {ymd:isoOf(d),min:d.getHours()*60+d.getMinutes()}}
    return {ymd:p.year+'-'+p.month+'-'+p.day,min:(+p.hour)*60+(+p.minute)};
  }
  function dayN(ymd,now){return Math.round((Date.parse(ymd+'T12:00:00Z')-Date.parse(now.ymd+'T12:00:00Z'))/864e5)}
  function ivs(ymd){return (cfg.hours||{})[String(new Date(ymd+'T12:00:00Z').getUTCDay())]||[]}
  function windowsFor(ymd){
    if(!live)return WIN.slice(0,3);
    var now=shopNow(),n=dayN(ymd,now),notice=(cfg.min_notice_hours||0)*60,iv=ivs(ymd);
    return WIN.filter(function(w){var lo=1e9,hi=-1;iv.forEach(function(i){var l=Math.max(tm(i.open),w.a),h=Math.min(tm(i.close),w.b);if(l<h){lo=Math.min(lo,l);hi=Math.max(hi,h)}});return hi>lo&&n*1440+hi>now.min+notice});
  }
  function pressedDay(){var b=daysEl.querySelector('button.cal-d[aria-pressed="true"]'),i=b?ETCal.info(b.dataset.day):null;return i?{key:b.dataset.day,iso:isoOf(i.date),info:i}:null}
  function chosenWin(){return timesEl.querySelector('button[aria-pressed="true"][data-win]')}
  function renderWins(){
    var d=pressedDay(); if(!d){timesEl.innerHTML='';return}
    var list=windowsFor(d.iso);
    timesEl.innerHTML=list.length?list.map(function(w){return '<button type="button" aria-pressed="false" data-time="'+w.l+'" data-win="'+w.k+'">'+w.l+'</button>'}).join(''):'<p class="sw-hint">No times left that day. Please pick another day.</p>';
  }
  function fmt(h){var m=tm(h),hh=Math.floor(m/60),mm=m%60,ap=hh>=12?'pm':'am';hh=hh%12||12;return hh+(mm?':'+('0'+mm).slice(-2):'')+' '+ap}
  function hoursText(){
    var order=[1,2,3,4,5,6,0],N=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],g=[],last=null;
    order.forEach(function(d){var iv=(cfg.hours||{})[String(d)]||[],t=iv.length?iv.map(function(x){return fmt(x.open)+'–'+fmt(x.close)}).join(', '):'closed';
      if(last&&last.t===t){last.to=d}else{last={t:t,from:d,to:d};g.push(last)}});
    return g.map(function(x){return (x.from===x.to?N[x.from]:N[x.from]+'–'+N[x.to])+' '+x.t}).join(' · ')+'. Need today? Call '+PHONE+'.';
  }
  function fixKey(){if(!live)return;var t=hoursText();daysEl.querySelectorAll('.cal-key').forEach(function(k){if(k.textContent!==t)k.textContent=t})}
  new MutationObserver(fixKey).observe(daysEl,{childList:true,subtree:true});
  function drawDays(){
    var fk=ETCal.firstOpen(); if(!fk){daysEl.innerHTML='<p class="sw-hint">No open days right now. Please call '+PHONE+'.</p>';timesEl.innerHTML='';return}
    var cur=pressedDay(),k=cur&&ETCal.isOpen(cur.info.date)?cur.key:fk;
    daysEl.innerHTML=ETCal.html(k);
    var b=daysEl.querySelector('.cal-d[data-day="'+k+'"]');if(b)b.setAttribute('aria-pressed','true');
    renderWins();fixKey();
  }
  function applyCfg(){
    var now=shopNow(),blocked={},t=new Date(),i;t.setHours(0,0,0,0);
    for(i=0;i<=62;i++){
      var d=new Date(t);d.setDate(d.getDate()+i);var iso=isoOf(d),iv=ivs(iso),n=dayN(iso,now),last=iv.length?Math.max.apply(null,iv.map(function(x){return tm(x.close)})):0;
      if(!iv.length||n<0||n>(cfg.max_days_ahead||30)||n*1440+last<=now.min+(cfg.min_notice_hours||0)*60)blocked[iso]=true;
    }
    ETCal.setBlocked(blocked);
    if(!ETCal.firstOpen()){ETCal.setBlocked({});return false}
    return true;
  }
  daysEl.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button.cal-d');if(!b)return;
    daysEl.querySelectorAll('.cal-d').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});renderWins();setErr('sw-e4','')});
  timesEl.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-win]');if(!b)return;
    timesEl.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});setErr('sw-e4','')});

  /* ---- step 1: where ---- */
  function allowed(slug){var m=SV[slug].mode;return where==='mobile'?m!=='shop':where==='shop'?m!=='mobile':true}
  function updateWhere(){
    [].forEach.call($('sw-where').children,function(b){b.setAttribute('aria-pressed',String(b.dataset.where===where))});
    $('sw-shop').hidden=where!=='shop';$('sw-mobile').hidden=where!=='mobile';
    Object.keys(chosen).forEach(function(s){if(!allowed(s))delete chosen[s]});
    setErr('sw-e1','');
  }
  $('sw-where').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;where=b.dataset.where;updateWhere();if(where==='mobile'){try{$('sw-loc').focus({preventScroll:true})}catch(x){}}});
  function zipCheck(){
    var z=zip.value.replace(/\D/g,'').slice(0,5);if(z!==zip.value)zip.value=z;
    zipState=null;znote.textContent='';znote.className='sw-zipnote';setErr('sw-e-zip','');
    if(z.length!==5)return;
    if(!live){var c=ET.county(z);zipState=c?true:false;znote.textContent=c?'Good news, we cover '+z+'.':'That ZIP is outside our regular route. Call '+PHONE+'.';znote.className='sw-zipnote '+(c?'ok':'no');return}
    var my=++zipSeq;
    fetch(BOOK.endpoint+'?zip='+z,{cache:'no-store',credentials:'omit',mode:'cors'}).then(function(r){return r.json()}).then(function(c){
      if(my!==zipSeq||!c)return;
      if(c.zip_in_area===true){zipState=true;znote.textContent='Good news, we come to that ZIP.';znote.className='sw-zipnote ok'}
      else if(c.zip_in_area===false){zipState=false;znote.textContent='That ZIP is outside our service area. Call '+PHONE+' and we will see what we can do.';znote.className='sw-zipnote no'}
    }).catch(function(){});
  }
  zip.addEventListener('input',zipCheck);
  $('sw-loc').addEventListener('input',function(){setErr('sw-e-loc','')});

  /* ---- step 3: services (filtered by where) ---- */
  function renderPick(){
    var both=NAV_SLUGS.filter(function(s){return SV[s].mode==='both'}),monly=NAV_SLUGS.filter(function(s){return SV[s].mode==='mobile'}),shop=NAV_SLUGS.filter(function(s){return SV[s].mode==='shop'});
    var mob=where==='mobile';
    function lab(s){var v=SV[s],off=!allowed(s);return '<label for="sw-s-'+s+'"'+(off?' class="off" title="'+(mob?'Shop only. Tap to switch to the shop.':'Mobile only. Tap to switch to mobile.')+'"':'')+'><input type="checkbox" id="sw-s-'+s+'" value="'+s+'"'+(chosen[s]&&!off?' checked':'')+(off?' disabled':'')+'>'+(SP_IMG[s]?'<img src="'+ETM+'etm-services-'+SP_IMG[s]+'.webp" alt="" loading="lazy">':ET.icon(v.ico))+'<span>'+h(v.label)+(off?'<em>'+(mob?'Shop only':'Mobile only')+'</em>':'')+'</span></label>'}
    var out='<div class="sw-grp">Mobile or at the shop</div>'+both.map(lab).join('');
    out+='<div class="sw-grp">Mobile only (we come to you)'+(mob?'':' (not available at the shop)')+'</div>'+monly.map(lab).join('');
    out+='<div class="sw-grp">Shop only'+(mob?' (not available for mobile)':'')+'</div>'+shop.map(lab).join('');
    $('sw-pick').innerHTML=out;
    var n=$('sw-mobnote');n.hidden=false;
    n.innerHTML=mob?'You picked <b>at my location</b>, so the shop-only services are greyed out. <button type="button" class="sw-lnk" data-sw="toshop">Switch to the shop to unlock them</button>'
      :'You picked <b>the Sunrise shop</b>, so lockouts and jump starts are greyed out (we come to you for those). <button type="button" class="sw-lnk" data-sw="tomobile">Switch to mobile</button>';
  }
  function setWhere(w){where=w;updateWhere();if(step===3)renderPick()}
  $('sw-mobnote').addEventListener('click',function(e){var b=e.target.closest('[data-sw]');if(!b)return;if(b.dataset.sw==='toshop')setWhere('shop');else{where='mobile';updateWhere();show(1);try{$('sw-loc').focus({preventScroll:true})}catch(x){}}});
  $('sw-pick').addEventListener('click',function(e){var l=e.target.closest('label.off');if(!l)return;e.preventDefault();var sl=l.getAttribute('for').replace('sw-s-','');
    if(where==='mobile'){setWhere('shop');chosen[sl]=true;renderPick();setErr('sw-e3','')}
    else{where='mobile';updateWhere();chosen[sl]=true;show(1);try{$('sw-loc').focus({preventScroll:true})}catch(x){}}});
  $('sw-pick').addEventListener('change',function(e){var i=e.target;if(i&&i.type==='checkbox'){if(i.checked)chosen[i.value]=true;else delete chosen[i.value];setErr('sw-e3','')}});
  function slugs(){return NAV_SLUGS.filter(function(s){return chosen[s]&&allowed(s)})}
  function labelsOf(a){return a.map(function(s){return SV[s].label})}
  function serviceKey(a){
    var okKeys=(cfg&&cfg.service_types||[]).map(function(t){return t.key}),key='',i;
    for(i=0;i<a.length&&!key;i++)if(TYPE[a[i]])key=TYPE[a[i]];
    if(!key){var alt=['other','general_service','shop_service','auto_service','repair','general'];for(i=0;i<alt.length;i++)if(okKeys.indexOf(alt[i])>-1){key=alt[i];break}}
    if(!key)key='new_tires';
    if(okKeys.length&&okKeys.indexOf(key)<0)key=okKeys[0];
    return key;
  }

  /* ---- navigation + validation ---- */
  function houseNo(a){return /[0-9]/.test(String(a||'').replace(/\b[0-9]+(?:st|nd|rd|th)\b/gi,' '))}
  function check(n){
    if(n===1){
      if(!where)return {id:'sw-e1',msg:'Choose the shop or your location so we plan the visit.',focus:$('sw-where').children[0]};
      if(where==='mobile'){
        var a=($('sw-loc').value||'').trim();
        if(a.length<5||!houseNo(a))return {id:'sw-e-loc',msg:'Enter the street address with the house number.',focus:$('sw-loc')};
        if(!/^[0-9]{5}$/.test(zip.value))return {id:'sw-e-zip',msg:'Enter a 5-digit ZIP code.',focus:zip};
        if(zipState===false)return {id:'sw-e-zip',msg:'That ZIP is outside our service area. Call '+PHONE+' or pick the shop.',focus:zip};
        if(zipState===null)return {id:'sw-e-zip',msg:'One second, checking your ZIP. Tap Next again.',focus:zip};
      }
    }
    if(n===2){
      if(!vehOK())return {id:'sw-e2',msg:'Choose your vehicle year, make and model so we have the right parts.',focus:!$('sw-year').value?$('sw-year'):!$('sw-make').value?$('sw-make'):$('sw-model')};
    }
    if(n===3&&!slugs().length)return {id:'sw-e3',msg:'Pick at least one service.',focus:$('sw-pick').querySelector('input')};
    if(n===4){if(!pressedDay()||!chosenWin())return {id:'sw-e4',msg:'Please pick a day and a time window.',focus:null}}
    if(n===5){
      var ph=($('sw-phone').value||'').replace(/\D/g,'');if(ph.length===11&&ph[0]==='1')ph=ph.slice(1);
      var em=($('sw-email').value||'').trim(),cp=radio('sw-contact');
      if(($('sw-name').value||'').trim().length<2)return {id:'sw-e-name',msg:'Please enter your name.',focus:$('sw-name')};
      if(!/^[2-9][0-9]{9}$/.test(ph))return {id:'sw-e-phone',msg:'Enter a 10-digit US phone number.',focus:$('sw-phone')};
      if(em===''&&cp==='email')return {id:'sw-e-email',msg:'Add an email so we can reach you.',focus:$('sw-email')};
      if(em!==''&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return {id:'sw-e-email',msg:'Enter an email like name@example.com',focus:$('sw-email')};
      if(!$('sw-consent').checked)return {id:'sw-e-consent',msg:'Please tick the box so we may contact you about this request.',focus:$('sw-consent')};
      if($('sw-mkt').checked&&!$('sw-sms').checked)return {id:'sw-e-mkt',msg:'To get promotional texts, please also tick the service text message box above. Or untick this box to continue without texts.',focus:$('sw-mkt')};
    }
    return null;
  }
  function showProblem(p){setErr(p.id,p.msg);try{(p.focus||$(p.id)).scrollIntoView({block:'center',behavior:'smooth'});if(p.focus&&p.focus.focus)p.focus.focus({preventScroll:true})}catch(e){}}
  function renderSum(){
    var a=slugs(),d=pressedDay(),w=chosenWin(),rows=[['Where',where==='mobile'?'At my location, '+($('sw-loc').value||'').trim()+' '+zip.value:'Sunrise shop ('+(radio('sw-drop')==='leave'?'leaving the vehicle':'waiting')+')'],
      ['Vehicle',($('sw-year').value+' '+$('sw-make').value+' '+$('sw-model').value).trim()],['Service',labelsOf(a).join(', ')],['When',d&&w?d.info.d+' '+d.info.m+', '+w.dataset.time:'']];
    $('sw-sum').innerHTML=rows.map(function(r){return '<dt>'+h(r[0])+'</dt><dd>'+h(r[1])+'</dd>'}).join('');
  }
  function show(n,noScroll){
    step=n;
    [].forEach.call(f.querySelectorAll('.mq-step'),function(s){s.hidden=(+s.dataset.step!==n)});
    [].forEach.call($('sw-prog').children,function(li){var k=+li.dataset.s;li.classList.toggle('on',k===n);li.classList.toggle('ok',k<n)});
    $('sw-barfill').style.width=(n*20)+'%';
    backB.hidden=n===1;nextB.hidden=n===5;subB.hidden=n!==5;nextB.textContent=NEXTL[n]||'Next';
    if(n===3)renderPick();
    if(n===4&&!daysEl.querySelector('.cal'))drawDays();
    if(n===5)renderSum();
    $('sw-live-err').textContent='';
    if(!noScroll){try{$('sw-prog').scrollIntoView({block:'start',behavior:'smooth'})}catch(e){}}
  }
  nextB.addEventListener('click',function(){var p=check(step);if(p){showProblem(p);return}if(step<5)show(step+1)});
  backB.addEventListener('click',function(){if(step>1)show(step-1)});
  $('sw-prog').addEventListener('click',function(e){var li=e.target.closest('li');if(li&&+li.dataset.s<step)show(+li.dataset.s)});
  document.querySelectorAll('input[name="sw-contact"]').forEach(function(r){r.addEventListener('change',function(){$('sw-email-opt').textContent=radio('sw-contact')==='email'?'(required)':'(optional)'})});
  
  ['name','phone','email'].forEach(function(i){$('sw-'+i).addEventListener('input',function(){setErr('sw-e-'+i,'')})});
  $('sw-consent').addEventListener('change',function(){setErr('sw-e-consent','')});
  $('sw-mkt').addEventListener('change',function(){setErr('sw-e-mkt','')});
  $('sw-sms').addEventListener('change',function(){setErr('sw-e-mkt','')});
  f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='checkbox'&&e.target.type!=='radio'){e.preventDefault();if(step<5)nextB.click();else subB.click()}});

  /* ---- send ---- */
  function stepOfField(fld){return {address:1,zip:1,vehicle_year:2,vehicle_make:2,vehicle_model:2,tire_size:2,service_type:3,pref_date:4,pref_window:4}[fld]||5}
  function fail(msg,k){if(k<step)show(k,true);var id={1:'sw-e1',2:'sw-e2',3:'sw-e3',4:'sw-e4'}[k]||'sw-live-err';setErr(id,msg);try{$(id).scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
  f.addEventListener('submit',function(e){
    e.preventDefault();if(busy||done)return;
    $('sw-live-err').textContent='';
    for(var n=1;n<=5;n++){var p=check(n);if(p){if(n<step)show(n,true);showProblem(p);return}}
    if(!live){setErr('sw-live-err','Online booking is not open right now, so nothing was sent. Please call '+PHONE+' and we will book you in.');return}
    var a=slugs(),d=pressedDay(),w=chosenWin(),sz=($('sw-size').value||'').trim(),how={text:'text',call:'phone call',email:'email'}[radio('sw-contact')]||'text';
    var parts=[where==='mobile'?'MOBILE: service at customer location':'AT SHOP ('+(radio('sw-drop')==='leave'?'customer leaving vehicle':'customer waiting')+')','Services: '+labelsOf(a).join(', '),'Contact by: '+how];var tr=$('sw-trim').value;if(tr&&!/^Not sure/i.test(tr))parts.splice(2,0,'Trim: '+tr);
    var det=($('sw-details').value||'').trim();if(det)parts.push(det);
    var body={name:$('sw-name').value.trim(),phone:$('sw-phone').value.trim(),email:$('sw-email').value.trim(),
      address:where==='mobile'?$('sw-loc').value.trim():SHOP.addr,zip:where==='mobile'?zip.value:SHOP.zip,
      vehicle_year:$('sw-year').value.trim(),vehicle_make:$('sw-make').value.trim(),vehicle_model:$('sw-model').value.trim(),
      tire_size:/^[A-Za-z0-9\/ .\-]{1,20}$/.test(sz)?sz:'',service_type:serviceKey(a),pref_date:d.iso,pref_window:w.dataset.win,
      notes:parts.join(' | ').slice(0,500),consent:true,sms_consent:$('sw-sms').checked,sms_marketing_consent:$('sw-mkt').checked,lang:'en'};
    Object.keys(body).forEach(function(k){if(body[k]===''||body[k]==null)delete body[k]});
    body.website=$('sw-hp').value;
    busy=true;subB.disabled=true;var lbl=subB.textContent;subB.textContent='Sending...';
    function idle(){busy=false;subB.disabled=false;subB.textContent=lbl}
    window.ETRecaptcha.token('schedule').then(function(rt){body.recaptcha_token=rt;
    return fetch(BOOK.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'content-type':'application/json'},body:JSON.stringify(body)})})
      .then(function(r){return r.json().catch(function(){return null}).then(function(j){return {status:r.status,j:j||{}}})})
      .then(function(res){
        idle();var j=res.j;
        if(window.ETRecaptcha.isVerifyFail(res.status,j)){fail(window.ETRecaptcha.MSG,5);return}
        if(j.ok===true){
          done=true;var dn=$('sw-done'),first=body.name.split(' ')[0];
          dn.innerHTML='<h3>Request received, '+h(first)+'.</h3><p style="margin:0 0 10px"><b>'+h(typeof j.message==='string'&&j.message?j.message:'Request received — we will confirm by phone')+'.</b> This was a request, not a confirmed appointment. We will contact you by '+h(how)+' to confirm the day and time.</p>'+
            '<dl class="sw-sumdl" style="margin:0;display:grid;grid-template-columns:90px 1fr;gap:6px 14px">'+$('sw-sum').innerHTML+'</dl><p class="sw-hint">Need it sooner? Call <a href="tel:+19547731896"><strong>'+PHONE+'</strong></a>.</p>';
          dn.hidden=false;nextB.hidden=true;subB.hidden=true;backB.hidden=true;
          [].forEach.call(f.querySelectorAll('.mq-step'),function(s){s.hidden=true});$('sw-prog').parentNode.querySelector('.sw-hint').hidden=true;
          try{dn.scrollIntoView({block:'center',behavior:'smooth'});dn.focus({preventScroll:true})}catch(_){}
          return;
        }
        var c=j.code,k=stepOfField(j.field);
        if(c==='out_of_area'){zipState=false;znote.textContent='That ZIP is outside our service area. Call '+PHONE+' and we will see what we can do.';znote.className='sw-zipnote no';fail(where==='mobile'?'That ZIP is outside our service area.':'We could not book that online. Please call '+PHONE+'.',where==='mobile'?1:5)}
        else if(c==='closed'||c==='notice'||c==='date_range'){fail(typeof j.message==='string'&&j.message?j.message:'That day or time is not available. Please pick another.',4)}
        else if(c==='consent'){fail('Please tick the box so we may contact you about this request.',5)}
        else if(c==='rate_limited'){fail('We got a lot of requests just now. Please try again in a bit, or call '+PHONE+'.',5)}
        else if(c==='disabled'){live=false;fail('Online booking is paused right now. Please call '+PHONE+'.',5)}
        else if(c==='invalid'&&j.field){fail(typeof j.message==='string'&&j.message?j.message:'Please check that and try again.',k)}
        else{fail('We could not send that just now. Please try again, or call '+PHONE+'.',5)}
      })
      .catch(function(){idle();fail('We could not send that just now. Please check your connection and try again, or call '+PHONE+'.',5)});
  });

  /* ---- go live only when the shop has booking switched on ---- */
  function validCfg(c){return c&&c.enabled===true&&Array.isArray(c.service_types)&&c.service_types.length&&c.hours&&typeof c.hours==='object'}
  function boot(){
    if(booted)return;booted=true;
    fetch(BOOK.endpoint,{cache:'no-store',credentials:'omit',mode:'cors'}).then(function(r){return r.json()}).then(function(c){
      if(!validCfg(c))return;
      cfg=c;if(!applyCfg()){cfg=null;return}
      live=true;if(step>=4||daysEl.querySelector('.cal'))drawDays();
      if(zip.value.length===5)zipCheck();
    }).catch(function(){});
  }
  var idleCb=window.requestIdleCallback||function(fn){setTimeout(fn,600)};
  idleCb(boot);

  /* prefill vehicle from the homepage finder / Mobile page (shared et_vehicle) */
  var builtSig=null;
  function vehSig(v){return v&&v.make?[v.year,v.make,v.model,v.trim].join('|'):''}
  function vehOK(){var y=$('sw-year').value,m=$('sw-make').value,d=$('sw-model').value;return !!y&&!!m&&!!d&&!/^(Loading|Model$|Select)/.test(d)}
  function saveVeh(){
    if(!vehOK())return;
    var o=ETMem.get('et_vehicle')||{},v={year:$('sw-year').value,make:$('sw-make').value,model:$('sw-model').value,trim:$('sw-trim').value,size:$('sw-size').value||o.size||''};
    builtSig=vehSig(v);ETMem.set('et_vehicle',v);
  }
  /* same Year / Make / Model / Trim picker as the homepage finder, shared with the Mobile page through et_vehicle */
  function buildVeh(){
    var v=ETMem.get('et_vehicle')||{},sig=vehSig(v);
    if(builtSig!==null&&sig===builtSig)return;
    if(typeof window.initVehPicker!=='function'||!$('v-year')||!$('v-make'))return;
    ['sw-year','sw-make','sw-model','sw-trim'].forEach(function(id){var o=$(id),n=o.cloneNode(false);o.parentNode.replaceChild(n,o)});
    var Y=$('sw-year'),M=$('sw-make'),D=$('sw-model'),T=$('sw-trim');
    Y.innerHTML='<option value="">Year</option>'+$('v-year').innerHTML.replace(/ selected(="[^"]*")?/g,'');
    M.innerHTML='<option value="">Make</option>'+$('v-make').innerHTML.replace(/ selected(="[^"]*")?/g,'');
    T.innerHTML='<option>Not sure / any trim</option>';
    M.value=v.make||'';Y.value='';
    window.initVehPicker(Y,M,D,T,{year:v.make?(v.year||''):'',model:v.make?(v.model||''):'',trim:v.make?(v.trim||null):null,blank:true});
    [Y,M,D,T].forEach(function(el){el.addEventListener('change',function(){setErr('sw-e2','');saveVeh();setTimeout(saveVeh,1600)})});
    if(v.size&&!$('sw-size').value)$('sw-size').value=v.size;
    builtSig=sig;
  }
  function prefill(){try{buildVeh()}catch(e){}}
  buildVeh();

  /* ---- address suggestions (Photon / OpenStreetMap, South Florida only). Typing still works if the lookup is unavailable. ---- */
  (function(){
    var inp=$('sw-loc'),box=$('sw-ac'),timer=null,seq=0,items=[],cur=-1,cache={};
    var BBOX='-81.35,25.10,-79.90,27.25';
    /* Paste a Google Maps Platform key (Places API (New), restricted to this site's domains) to switch to Google address search. Empty = free OpenStreetMap fallback. */
    var GKEY='',GEOKEY='3570c909d86347369fb7bc9292cc96fb',gtok=null; /* GEOKEY = free Geoapify key (no card needed), used when GKEY is empty */
    function newTok(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)}
    function close(){box.hidden=true;box.innerHTML='';items=[];cur=-1;inp.setAttribute('aria-expanded','false')}
    function line1(p){var st=p.street||p.name||'';return ((p.housenumber?p.housenumber+' ':'')+st).trim()}
    function sub(p){return [p.city||p.town||p.village||p.locality||p.district,'FL',p.postcode].filter(Boolean).join(', ')}
    function paint(){
      box.innerHTML=items.map(function(it,i){return '<li role="option" id="sw-ac-'+i+'" data-i="'+i+'" aria-selected="'+(i===cur)+'">'+h(it.l1)+'<small>'+h(it.l2)+'</small></li>'}).join('');
      box.hidden=!items.length;inp.setAttribute('aria-expanded',String(!!items.length));
    }
    function finish(it){
      inp.value=it.l1;setErr('sw-e-loc','');
      if(it.zip&&/^[0-9]{5}$/.test(it.zip)){zip.value=it.zip;zipCheck();setErr('sw-e-zip','')}
      close();
      if(!/[0-9]/.test(it.l1)){inp.focus();setErr('sw-e-loc','Add your house number at the start, like 1234 '+it.l1+'.')}
    }
    function pick(i){
      var it=items[i];if(!it)return;
      if(window.ETGoogle)ETGoogle.endSession();
      if(it.pid){
        var tk=gtok;gtok=null;
        fetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(it.pid)+'?sessionToken='+encodeURIComponent(tk||''),{headers:{'X-Goog-Api-Key':GKEY,'X-Goog-FieldMask':'addressComponents'}})
          .then(function(r){return r.ok?r.json():null}).then(function(j){
            var c=(j&&j.addressComponents)||[],g=function(t){for(var k=0;k<c.length;k++)if((c[k].types||[]).indexOf(t)>-1)return c[k].longText||c[k].shortText||'';return ''};
            var l1=((g('street_number')+' '+g('route')).trim())||it.l1;
            finish({l1:l1,zip:g('postal_code')});
          }).catch(function(){finish({l1:it.l1,zip:''})});
        return;
      }
      inp.value=it.l1;setErr('sw-e-loc','');
      if(it.zip&&/^[0-9]{5}$/.test(it.zip)){zip.value=it.zip;zipCheck();setErr('sw-e-zip','')}
      close();
      if(!/[0-9]/.test(it.l1)){inp.focus();setErr('sw-e-loc','Add your house number at the start, like 1234 '+it.l1+'.')}
    }
    function glookup(q){
      var my=++seq;if(!gtok)gtok=newTok();
      fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':GKEY},
        body:JSON.stringify({input:q,sessionToken:gtok,includedRegionCodes:['us'],includedPrimaryTypes:['street_address','premise','subpremise'],languageCode:'en',
          locationRestriction:{rectangle:{low:{latitude:25.10,longitude:-81.35},high:{latitude:27.25,longitude:-79.90}}}})})
        .then(function(r){return r.ok?r.json():null}).then(function(j){
          if(my!==seq)return;
          if(!j){lookupOSM(q);return}
          items=(j.suggestions||[]).map(function(x){return x.placePrediction}).filter(Boolean).map(function(p){var sf=p.structuredFormat||{};return {l1:(sf.mainText&&sf.mainText.text)||(p.text&&p.text.text)||'',l2:(sf.secondaryText&&sf.secondaryText.text)||'',pid:p.placeId}}).filter(function(x){return x.l1&&x.pid}).slice(0,6);
          cur=-1;paint();
        }).catch(function(){lookupOSM(q)});
    }
    function geolookup(q){
      var my=++seq;
      fetch('https://api.geoapify.com/v1/geocode/autocomplete?format=json&limit=8&lang=en&filter=rect:-81.35,25.10,-79.90,27.25&text='+encodeURIComponent(q)+'&apiKey='+encodeURIComponent(GEOKEY),{credentials:'omit',referrerPolicy:'no-referrer'})
        .then(function(r){return r.ok?r.json():null}).then(function(j){
          if(my!==seq)return;if(!j){lookupOSM(q);return}
          var seen={};
          items=(j.results||[]).filter(function(p){return (p.country_code||'').toLowerCase()==='us'&&/florida/i.test(p.state||'')&&(p.street||p.address_line1)}).map(function(p){var l1=((p.housenumber?p.housenumber+' ':'')+(p.street||'')).trim()||p.address_line1;return {l1:l1,l2:[p.city||p.town||p.suburb,'FL',p.postcode].filter(Boolean).join(', '),zip:p.postcode||''}}).filter(function(x){if(!x.l1||seen[x.l1+x.l2])return false;seen[x.l1+x.l2]=1;return true}).slice(0,6);
          cur=-1;paint();
        }).catch(function(){lookupOSM(q)});
    }
    function legacyLookup(q){if(GKEY)glookup(q);else if(GEOKEY)geolookup(q);else lookupOSM(q)}
    /* Google Places (New) first when the browser key works; any failure or empty key falls back to the existing free search */
    function lookup(q){
      var G=window.ETGoogle;if(!G||!G.on()||q.length<4){legacyLookup(q);return}
      var my=++seq;
      G.suggest(q).then(function(g){if(my!==seq)return;if(g){items=g;cur=-1;paint()}else legacyLookup(q)}).catch(function(){if(my===seq)legacyLookup(q)});
    }
    function lookupOSM(q){
      var my=++seq;
      if(cache[q]){items=cache[q];cur=-1;paint();return}
      fetch('https://photon.komoot.io/api/?lang=en&limit=8&bbox='+BBOX+'&q='+encodeURIComponent(q),{credentials:'omit',referrerPolicy:'no-referrer'})
        .then(function(r){return r.ok?r.json():null}).then(function(j){
          if(my!==seq||!j)return;var seen={};
          var out=(j.features||[]).map(function(f){return f.properties||{}}).filter(function(p){return (p.countrycode||'').toUpperCase()==='US'&&/florida/i.test(p.state||'')&&(p.street||p.housenumber||p.type==='house'||p.type==='street')}).map(function(p){return {l1:line1(p),l2:sub(p),zip:p.postcode||''}}).filter(function(x){if(!x.l1||seen[x.l1+x.l2])return false;seen[x.l1+x.l2]=1;return true}).slice(0,6);
          cache[q]=out;items=out;cur=-1;paint();
        }).catch(function(){close()});
    }
    inp.addEventListener('input',function(){
      setErr('sw-e-loc','');clearTimeout(timer);var q=inp.value.trim();
      if(q.length<3){close();return}
      timer=setTimeout(function(){lookup(q)},(window.ETGoogle&&ETGoogle.on())?250:120);
    });
    inp.addEventListener('keydown',function(e){
      if(box.hidden||!items.length)return;
      if(e.key==='ArrowDown'){e.preventDefault();cur=(cur+1)%items.length;paint()}
      else if(e.key==='ArrowUp'){e.preventDefault();cur=(cur-1+items.length)%items.length;paint()}
      else if(e.key==='Enter'&&cur>-1){e.preventDefault();pick(cur)}
      else if(e.key==='Escape'){close()}
    });
    box.addEventListener('mousedown',function(e){var li=e.target.closest('li');if(li){e.preventDefault();pick(+li.dataset.i)}});
    inp.addEventListener('blur',function(){setTimeout(close,120)});
  })();

  ET.onShow.schedule=function(){
    boot();prefill();
    if(pendingSvc){
      chosen={};pendingSvc.forEach(function(s){if(SV[s])chosen[s]=true});
      if(Object.keys(chosen).some(function(s){return SV[s].mode==='shop'})){where='shop';updateWhere()}
      pendingSvc=null;if(step===3)renderPick();
    }
  };
  ET.bk={cfg:function(){return cfg},live:function(){return live},windowsFor:windowsFor,serviceKey:serviceKey,boot:function(){booted=false;boot()},SHOP:SHOP,endpoint:BOOK.endpoint,NAV:NAV_SLUGS};
  show(1,true);
})();

/* ======================= ADDRESS SUGGESTIONS for Mobile + Quote pages (Geoapify, South Florida) ======================= */
(function(){
  var GEOKEY='3570c909d86347369fb7bc9292cc96fb';
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function wire(inp,box,zipEl,full){
    if(!inp||!box)return;
    var timer=null,seq=0,items=[],cur=-1;
    function close(){box.hidden=true;box.innerHTML='';items=[];cur=-1;inp.setAttribute('aria-expanded','false')}
    function paint(){box.innerHTML=items.map(function(it,i){return '<li role="option" data-i="'+i+'" aria-selected="'+(i===cur)+'">'+esc(it.l1)+'<small>'+esc(it.l2)+'</small></li>'}).join('');box.hidden=!items.length;inp.setAttribute('aria-expanded',String(!!items.length))}
    function pick(i){var it=items[i];if(!it)return;
      if(window.ETGoogle)ETGoogle.endSession();
      inp.value=full?(it.l1+', '+it.l2):it.l1;
      inp.dispatchEvent(new Event('input',{bubbles:true}));
      if(typeof it.lat==='number'&&typeof it.lon==='number'){inp.dataset.lat=String(it.lat);inp.dataset.lng=String(it.lon);inp.dataset.pin=inp.value}
      if(zipEl&&/^[0-9]{5}$/.test(it.zip)){zipEl.value=it.zip;zipEl.dispatchEvent(new Event('input',{bubbles:true}))}
      close();}
    function look(q){var my=++seq;
      var G=window.ETGoogle;
      if(G&&G.on()&&q.length>=4){G.suggest(q).then(function(g){if(my!==seq)return;if(g){items=g;cur=-1;paint()}else geo(q,my)}).catch(function(){if(my===seq)geo(q,my)});return}
      geo(q,my)}
    function geo(q,my){
      fetch('https://api.geoapify.com/v1/geocode/autocomplete?format=json&limit=8&lang=en&filter=rect:-81.35,25.10,-79.90,27.25&text='+encodeURIComponent(q)+'&apiKey='+encodeURIComponent(GEOKEY),{credentials:'omit',referrerPolicy:'no-referrer'})
        .then(function(r){return r.ok?r.json():null}).then(function(j){
          if(my!==seq||!j)return;var seen={};
          items=(j.results||[]).filter(function(p){return (p.country_code||'').toLowerCase()==='us'&&/florida/i.test(p.state||'')&&(p.street||p.address_line1)}).map(function(p){return {l1:((p.housenumber?p.housenumber+' ':'')+(p.street||'')).trim()||p.address_line1,l2:[p.city||p.town||p.suburb,'FL',p.postcode].filter(Boolean).join(', '),zip:p.postcode||'',lat:p.lat,lon:p.lon}}).filter(function(x){if(!x.l1||seen[x.l1+x.l2])return false;seen[x.l1+x.l2]=1;return true}).slice(0,6);
          cur=-1;paint();
        }).catch(function(){close()});}
    inp.addEventListener('input',function(){if(inp.dataset.pin&&inp.dataset.pin!==inp.value){delete inp.dataset.lat;delete inp.dataset.lng;delete inp.dataset.pin}clearTimeout(timer);var q=inp.value.trim();if(q.length<3||/^[0-9]{0,2}$/.test(q)){close();return}timer=setTimeout(function(){look(q)},(window.ETGoogle&&ETGoogle.on())?250:120)});
    inp.addEventListener('keydown',function(e){if(box.hidden||!items.length)return;
      if(e.key==='ArrowDown'){e.preventDefault();cur=(cur+1)%items.length;paint()}
      else if(e.key==='ArrowUp'){e.preventDefault();cur=(cur-1+items.length)%items.length;paint()}
      else if(e.key==='Enter'&&cur>-1){e.preventDefault();pick(cur)}
      else if(e.key==='Escape'){close()}});
    box.addEventListener('mousedown',function(e){var li=e.target.closest('li');if(li){e.preventDefault();pick(+li.dataset.i)}});
    inp.addEventListener('blur',function(){setTimeout(close,120)});
  }
  window.ETAddrWire=wire;
  wire(document.getElementById('mq-loc'),document.getElementById('mq-ac'),document.getElementById('mq-zip'),false);
})();

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
     return '<label class="ad-item" for="ad-i-'+i.k+'"><input type="checkbox" id="ad-i-'+i.k+'" '+(i.slug?'data-slug="'+i.slug+'" checked':'disabled')+'>'+SI(i.ico,0)+
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

})();}catch(e){console.error('part a failed',e)}