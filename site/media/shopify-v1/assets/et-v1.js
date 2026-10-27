
(function(){
  // Services from Melissa's quote mockup, same order and wording
  var SERVICES=[
    ["brake","Brake Repair"],["wheel","Custom Wheels Service"],["lift","Lift Kits"],["oil","Oil Changes"],
    ["susp","Suspension Repair"],["align","Wheel Alignments"],["balance","Tire Balancing"],["install","Tire Installation"],
    ["repair","Tire Repair"],["rotate","Tire Rotation"],["tpms","TPMS Service"],["pay","Shop Now, Pay Later"]
  ];
  var icon=function(id){return '<svg aria-hidden="true"><use href="#i-'+id+'"/></svg>'};

  var grid=document.getElementById('svc-grid');
  grid.innerHTML=SERVICES.map(function(s){
    var pay=s[0]==='pay';
    var SL={brake:'brake-repair',wheel:'custom-wheels',lift:'lift-kits',oil:'oil-changes',susp:'suspension-repair',align:'wheel-alignment',balance:'tire-balancing',install:'tire-installation',repair:'tire-repair',rotate:'tire-rotation',tpms:'tpms-service'};
    return pay?'<a class="svc pay" href="#financing" data-view-link="financing">'+icon(s[0])+s[1]+'</a>'
      :'<a class="svc" href="#service/'+SL[s[0]]+'" data-view-link="service" data-param="'+SL[s[0]]+'">'+icon(s[0])+s[1]+'</a>';
  }).join('');

  var pick=document.getElementById('pick');
  pick.innerHTML=SERVICES.map(function(s,i){
    return '<label for="pk'+i+'"><input type="checkbox" id="pk'+i+'" name="svc" value="'+s[1]+'">'+icon(s[0])+s[1]+'</label>';
  }).join('');

  var burger=document.getElementById('burger'), mnav=document.getElementById('mnav');
  // Router: #view or #view/param (e.g. #service/brake-repair). Pages register hooks on window.ET.
  var views=document.querySelectorAll('[data-view]');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ET=window.ET={onShow:{},pages:[],cur:{view:'home',param:''}};
  function hasView(v){return [].some.call(views,function(el){return el.dataset.view===v})}
  function show(v, anchor, param){
    param=param||'';
    var swap=function(){ apply(v, anchor, param) };
    var cur=[].filter.call(views,function(el){return !el.hidden})[0];
    var changed=!cur||cur.dataset.view!==v||ET.cur.param!==param;
    if(cur && changed && document.startViewTransition && !reduce){document.startViewTransition(swap)} else swap();
  }
  function apply(v, anchor, param){
    if(!hasView(v)){ // a section id on the home page, or an unknown page
      if(document.getElementById(v)&&hasView('home')){anchor=v;v='home'}
      else v=hasView('notfound')?'notfound':'home';
    }
    ET.cur={view:v,param:param};
    views.forEach(function(el){el.hidden=el.dataset.view!==v});
    var fn=ET.onShow[v]; if(fn){try{fn(param)}catch(err){console.error('page hook failed:',v,err)}}
    var jump=document.getElementById('jump'); if(jump){var jv=ET.cur.view+(param?'/'+param:'');jump.value=[].some.call(jump.options,function(o){return o.value===jv})?jv:''}
    document.querySelectorAll('.proto a').forEach(function(a){
      if(a.dataset.viewLink===v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    closeMenu();
    if(anchor){var t=document.getElementById(anchor); if(t){t.scrollIntoView(); return;}}
    window.scrollTo(0,0);
  }
  function setHash(v,param){try{history.replaceState(null,'','#'+v+(param?'/'+param:''))}catch(_){}}
  document.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a)return;
    if(a.dataset.viewLink){
      e.preventDefault();
      if(a.dataset.svc){ // preselect the clicked service on the quote form
        pick.querySelectorAll('input').forEach(function(i){i.checked=(i.value===a.dataset.svc)});
      }
      show(a.dataset.viewLink, a.dataset.anchor, a.dataset.param);
      setHash(a.dataset.viewLink, a.dataset.param);
    } else if(a.dataset.go){
      e.preventDefault();
      show(a.dataset.go, a.getAttribute('href').slice(1));
    }
  });
  window.addEventListener('hashchange',function(){var h=(location.hash||'').slice(1).split('/');if(h[0]!==ET.cur.view||(h[1]||'')!==ET.cur.param)show(h[0]||'home',null,h[1]||'')});
  // Helpers shared with the page modules (loaded after this script)
  ET.show=show; ET.setHash=setHash; ET.hasView=hasView; ET.esc=esc; ET.money=money; ET.county=county; ET.icon=icon; ET.SERVICES=SERVICES; ET.reduce=reduce;
  Object.defineProperty(ET,'STORE',{get:function(){return document.querySelector('.hero-media img').src}});
  ET.start=function(){var h=(location.hash||'').slice(1).split('/');show(h[0]||'home',null,h[1]||'')};

  // Mobile menu
  function closeMenu(){mnav.dataset.open='false';burger.setAttribute('aria-expanded','false')}
  burger.addEventListener('click',function(){
    var open=mnav.dataset.open!=='true';
    mnav.dataset.open=String(open);burger.setAttribute('aria-expanded',String(open));
  });

  // Tire finder tabs + demo results
  var tabs=[['t-veh','p-veh'],['t-size','p-size']];
  tabs.forEach(function(t){
    document.getElementById(t[0]).addEventListener('click',function(){
      tabs.forEach(function(o){
        var on=o[0]===t[0];
        document.getElementById(o[0]).setAttribute('aria-selected',String(on));
        document.getElementById(o[1]).hidden=!on;
      });
    });
  });
  function size(){return document.getElementById('s-w').value+'/'+document.getElementById('s-a').value+'R'+document.getElementById('s-r').value}
  ['s-w','s-a','s-r'].forEach(function(id){document.getElementById(id).addEventListener('change',function(){document.getElementById('sz').textContent=size()})});
  document.getElementById('p-veh').addEventListener('submit',function(e){
    e.preventDefault();
    var v=['v-year','v-make','v-model','v-trim'].map(function(id){return document.getElementById(id).value}).join(' ');
    show('tires'); try{history.replaceState(null,'','#tires')}catch(_){}
  });
  document.getElementById('p-size').addEventListener('submit',function(e){
    e.preventDefault();
    show('tires'); try{history.replaceState(null,'','#tires')}catch(_){}
  });

  // ===== Tire shop (sample catalog; prices are placeholders until the Tire Guru feed is wired) =====
  var TIRES=[
    {b:"BFGoodrich",m:"All-Terrain T/A KO2",t:"All-terrain",p:289},
    {b:"Nitto",m:"Ridge Grappler",t:"Hybrid terrain",p:315},
    {b:"Toyo",m:"Open Country A/T III",t:"All-terrain",p:262},
    {b:"Falken",m:"Wildpeak A/T4W",t:"All-terrain",p:239},
    {b:"Michelin",m:"Defender LTX M/S2",t:"Highway",p:298},
    {b:"Nitto",m:"Trail Grappler M/T",t:"Mud-terrain",p:339},
    {b:"Cooper",m:"Discoverer AT3 4S",t:"All-terrain",p:219},
    {b:"Continental",m:"TerrainContact A/T",t:"All-terrain",p:231}
  ];
  var INSTALL=25, TIRE_FEE=1, TAX=0.07, installType='mobile';
  function otd(p){return Math.round(((p+INSTALL+TIRE_FEE)*4)*(1+TAX))}
  function money(n){return '$'+n.toLocaleString('en-US')}
  function uniq(k){return TIRES.map(function(x){return x[k]}).filter(function(v,i,a){return a.indexOf(v)===i}).sort()}
  function boxes(id,vals,key){
    document.getElementById(id).insertAdjacentHTML('beforeend',vals.map(function(v,i){
      return '<label for="'+key+i+'"><input type="checkbox" id="'+key+i+'" value="'+v+'" data-k="'+key+'">'+v+'</label>'}).join(''));
  }
  boxes('f-type',uniq('t'),'t'); boxes('f-brand',uniq('b'),'b');
  var list=document.getElementById('tire-list');
  function checked(k){return [].slice.call(document.querySelectorAll('input[data-k="'+k+'"]:checked')).map(function(i){return i.value})}
  function renderTires(){
    var ts=checked('t'), bs=checked('b'), max=+document.getElementById('f-max').value, s=document.getElementById('sort').value;
    var rows=TIRES.filter(function(x){return (!ts.length||ts.indexOf(x.t)>-1)&&(!bs.length||bs.indexOf(x.b)>-1)&&x.p<=max});
    rows.sort(function(a,b){return s==='low'?a.p-b.p:s==='high'?b.p-a.p:a.b.localeCompare(b.b)});
    document.getElementById('count').textContent=rows.length+(rows.length===1?' tire fits':' tires fit');
    list.innerHTML=rows.length?rows.map(function(x){
      var i=TIRES.indexOf(x);
      return '<article class="tire"><div class="tread" aria-hidden="true"></div><div style="min-width:0"><div class="brand">'+x.b+'</div><h3>'+x.m+'</h3>'+
        '<div class="tags"><span>'+x.t+'</span><span>285/70R17</span><span class="go">'+(installType==='mobile'?'Mobile install eligible':'Install at Sunrise shop')+'</span></div></div>'+
        '<div class="price"><div class="each">'+money(x.p)+' <small>/ tire</small></div><div class="otd">Set of 4 out the door <b>'+money(otd(x.p))+'</b></div>'+
        '<button class="btn btn-red" type="button" data-add="'+i+'">Add set of 4</button></div></article>'}).join('')
      :'<div class="empty">No tires match those filters. Clear a filter, or <a href="#quote" data-view-link="quote">ask us to source one</a>.</div>';
  }
  document.querySelector('.filters').addEventListener('change',renderTires);
  document.getElementById('f-max').addEventListener('input',function(){document.getElementById('f-max-out').textContent='Up to $'+this.value;renderTires()});
  document.getElementById('sort').addEventListener('change',renderTires);
  document.querySelectorAll('[data-install]').forEach(function(b){
    b.addEventListener('click',function(){
      installType=b.dataset.install;
      document.querySelectorAll('[data-install]').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});
      renderTires();
    });
  });
  renderTires();

  var drawer=document.getElementById('drawer'), scrim=document.getElementById('scrim'), chosen=null;
  function openDrawer(x){
    chosen=x;
    var sub=(x.p+INSTALL+TIRE_FEE)*4, tax=Math.round(sub*TAX);
    document.getElementById('drawer-body').innerHTML='<div><div class="brand" style="font:700 12px var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--red)">'+x.b+'</div>'+
      '<h3 style="font-size:30px;font-weight:800">'+x.m+'</h3><p style="margin:4px 0 0;color:var(--steel)">285/70R17 · '+(installType==='mobile'?'Mobile install at your location':'Install at the Sunrise shop')+'</p></div>'+
      '<div class="lines"><div><span>4 × tire</span><b>'+money(x.p*4)+'</b></div><div><span>Mount, balance, stem, TPMS reset, disposal</span><b>'+money(INSTALL*4)+'</b></div>'+
      '<div><span>Florida new tire fee</span><b>'+money(TIRE_FEE*4)+'</b></div><div><span>Sales tax (7%)</span><b>'+money(tax)+'</b></div>'+
      '<div class="tot"><span>Out the door</span><span>'+money(sub+tax)+'</span></div></div>'+
      '<p style="margin:0;color:var(--steel);font-size:14px">Lease-to-own financing is available through Kafene. Ask us for a monthly estimate when you book.</p>';
    drawer.classList.add('open');scrim.classList.add('open');drawer.setAttribute('aria-hidden','false');
    document.getElementById('drawer-close').focus();
  }
  function closeDrawer(){drawer.classList.remove('open');scrim.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
  list.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b)openDrawer(TIRES[+b.dataset.add])});
  document.getElementById('drawer-close').addEventListener('click',closeDrawer);
  scrim.addEventListener('click',closeDrawer);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer()});
  document.getElementById('drawer-book').addEventListener('click',function(){
    closeDrawer();
    if(chosen){
      document.getElementById('q-details').value='2024 Jeep Gladiator Rubicon · 285/70R17 · '+chosen.b+' '+chosen.m+' (set of 4)';
      document.getElementById('q-mobile').checked=(installType==='mobile');
      pick.querySelectorAll('input').forEach(function(i){i.checked=(i.value==='Tire Installation')});
    }
  });

  // ===== Mobile service: ZIP check, slots, cities =====
  function county(z){
    var n=+z; if(!/^\d{5}$/.test(z))return null;
    if((n>=33004&&n<=33009)||(n>=33019&&n<=33029)||(n>=33060&&n<=33099)||(n>=33301&&n<=33394)||n===33441||n===33442)return 'Broward';
    if(n>=33010&&n<=33199)return 'Miami-Dade';
    if(n>=33401&&n<=33499)return 'Palm Beach';
    return '';
  }
  document.getElementById('zip-form').addEventListener('submit',function(e){
    e.preventDefault();
    var z=document.getElementById('zip').value.trim(), c=county(z), out=document.getElementById('zipres');
    out.className='zipres';
    if(c===null){out.textContent='Enter a 5-digit ZIP code.';out.classList.add('no');return}
    if(c){out.textContent='Yes, we cover '+z+' in '+c+' County. Pick a time below.';out.classList.add('ok');document.getElementById('slots-anchor');document.querySelector('.slots').scrollIntoView({behavior:reduce?'auto':'smooth'})}
    else{out.textContent='That ZIP is outside our regular route. Call (954) 773-1896 and we will see what we can do.';out.classList.add('no')}
  });
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var daysEl=document.getElementById('days'), timesEl=document.getElementById('times'), pickDay=null, pickTime=null;
  var d=new Date(), made=0, html='';
  while(made<6){d.setDate(d.getDate()+1); if(d.getDay()===0)continue;
    html+='<button type="button" aria-pressed="'+(made===0)+'" data-day="'+DAYS[d.getDay()]+' '+MON[d.getMonth()]+' '+d.getDate()+'" data-sat="'+(d.getDay()===6)+'">'+DAYS[d.getDay()]+'<small>'+MON[d.getMonth()]+' '+d.getDate()+'</small></button>';made++}
  daysEl.innerHTML=html;
  function renderTimes(sat){
    var t=sat?['8:00 AM','10:00 AM','12:00 PM','2:00 PM']:['8:00 AM','10:00 AM','12:00 PM','2:00 PM','4:00 PM'];
    timesEl.innerHTML=t.map(function(x,i){return '<button type="button" aria-pressed="'+(i===1)+'" data-time="'+x+'">'+x+'</button>'}).join('');
    pickTime=t[1];
  }
  pickDay=daysEl.querySelector('button').dataset.day; renderTimes(daysEl.querySelector('button').dataset.sat==='true');
  daysEl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    daysEl.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});pickDay=b.dataset.day;renderTimes(b.dataset.sat==='true')});
  timesEl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    timesEl.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});pickTime=b.dataset.time});
  document.getElementById('book-slot').addEventListener('click',function(){
    document.getElementById('q-mobile').checked=true;
    var w=document.getElementById('q-when'); w.value='This week';
    var z=document.getElementById('zip').value.trim(); if(z)document.getElementById('q-loc').value=z;
    var det=document.getElementById('q-details'); det.value=('Requested mobile slot: '+pickDay+' at '+pickTime+'. '+det.value).trim();
    show('quote'); try{history.replaceState(null,'','#quote')}catch(_){}
  });
  document.getElementById('cities').innerHTML=['Sunrise','Plantation','Tamarac','Lauderhill','Weston','Davie','Coral Springs','Pembroke Pines','Fort Lauderdale','Hollywood','Miramar','Boca Raton','Miami Gardens','Hialeah']
    .map(function(c){var sl=c.toLowerCase().replace(/ /g,'-');return '<a href="#city/'+sl+'" data-view-link="city" data-param="'+sl+'">'+c+'</a>'}).join('');

  // ===== v4: 60-second guided flow =====
  var W={need:null,veh:'2024 Jeep Gladiator Rubicon',size:'',byo:false,where:null,zip:'',day:null,win:null,name:'',phone:'',texts:true,step:0,dir:1};
  var NEEDS=[
    ['tires','install','New tires','Shop, price and install'],
    ['service','brake','Repair or service','Brakes, alignment, oil and more'],
    ['wheels','lift','Wheels or lift','Packages, lifts, leveling'],
    ['flat','repair','Flat right now','We come to you today']
  ];
  var STEPNAMES=['What you need','Your vehicle','Where','When','Your details'];
  var wbody=document.getElementById('wiz-body'), wnext=document.getElementById('wiz-next'), wback=document.getElementById('wiz-back');
  function dayList(){var out=[],d=new Date();while(out.length<6){d.setDate(d.getDate()+1);if(d.getDay()===0)continue;out.push({k:DAYS[d.getDay()]+' '+MON[d.getMonth()]+' '+d.getDate(),d:DAYS[d.getDay()],m:MON[d.getMonth()]+' '+d.getDate(),sat:d.getDay()===6})}return out}
  var WDAYS=dayList();
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function renderWiz(){
    var s=W.step, h='';
    document.querySelectorAll('#wiz .prog i').forEach(function(i,n){i.classList.toggle('on',n<=s)});
    document.getElementById('wiz-count').textContent=s<5?'Step '+(s+1)+' of 5':'Booked';
    document.getElementById('wiz-name').textContent=s<5?STEPNAMES[s]:'Request received';
    wback.disabled=(s===0||s===5);
    wnext.hidden=(s===5);
    wnext.textContent=s===4?'Book it':'Next';
    if(s===0){
      h='<h3>What do you need today?</h3><div class="opts">'+NEEDS.map(function(n){
        return '<button type="button" class="opt'+(n[0]==='flat'?' urgent':'')+'" data-need="'+n[0]+'" aria-pressed="'+(W.need===n[0])+'"><svg aria-hidden="true"><use href="#i-'+n[1]+'"/></svg><span>'+n[2]+'<small>'+n[3]+'</small></span></button>'}).join('')+'</div>';
      if(W.need==='flat')h+='<div class="alert">Stuck right now? Call or text <b>(954) 773-1896</b> for the fastest dispatch, or keep going to book.</div>';
    } else if(s===1){
      h='<h3>Tell us about the vehicle</h3>'+
        '<label class="f" for="w-veh">Year, make and model<input id="w-veh" value="'+esc(W.veh)+'" placeholder="e.g. 2021 Toyota Tacoma TRD"></label>'+
        '<label class="f" for="w-size">Tire size (optional)<input id="w-size" value="'+esc(W.size)+'" placeholder="e.g. 265/70R17, printed on the sidewall"></label>'+
        (W.need==='tires'?'<label class="toggle" for="w-byo"><input type="checkbox" id="w-byo"'+(W.byo?' checked':'')+'> I already have my tires, I just need them installed</label>':'');
    } else if(s===2){
      h='<h3>Where should we do it?</h3><div class="opts">'+
        '<button type="button" class="opt" data-where="mobile" aria-pressed="'+(W.where==='mobile')+'"><svg aria-hidden="true"><use href="#i-van"/></svg><span>At my location<small>Home, work or roadside</small></span></button>'+
        '<button type="button" class="opt" data-where="shop" aria-pressed="'+(W.where==='shop')+'"><svg aria-hidden="true"><use href="#i-align"/></svg><span>At the Sunrise shop<small>7712 W Oakland Park Blvd</small></span></button></div>';
      if(W.where==='mobile'){
        var c=W.zip?county(W.zip):null;
        h+='<label class="f" for="w-zip">ZIP code<input id="w-zip" inputmode="numeric" maxlength="5" value="'+esc(W.zip)+'" placeholder="33351"></label>'+
          '<div class="zipres '+(c?'ok':(W.zip.length===5?'no':''))+'" id="w-zipres">'+(c?'We cover '+W.zip+' in '+c+' County.':(W.zip.length===5?'Outside our regular route. Call and we will try.':''))+'</div>'+
          '<div class="checklist"><b>What your spot needs</b><ul><li>About 5 ft clear around the vehicle</li><li>Flat, firm ground (driveway, lot or garage)</li><li>Keys available and wheel locks in the car</li></ul></div>';
      }
    } else if(s===3){
      var day=WDAYS.filter(function(x){return x.k===W.day})[0]||WDAYS[0]; if(!W.day)W.day=day.k;
      var wins=day.sat?['8–10 AM','10–12 PM','12–2 PM','2–4 PM']:['8–10 AM','10–12 PM','12–2 PM','2–4 PM','4–6 PM'];
      if(wins.indexOf(W.win)<0)W.win=null;
      h='<h3>Pick a 2-hour window</h3><div class="flow-days" role="group" aria-label="Day">'+WDAYS.map(function(x){
        return '<button type="button" data-day="'+x.k+'" aria-pressed="'+(x.k===W.day)+'">'+x.d+'<small>'+x.m+'</small></button>'}).join('')+'</div>'+
        '<div class="windows" role="group" aria-label="Arrival window">'+wins.map(function(w){return '<button type="button" data-win="'+w+'" aria-pressed="'+(w===W.win)+'">'+w+'</button>'}).join('')+'</div>'+
        '<p style="margin:0;color:var(--steel);font-size:13px">Sample availability. The live site reads the shop calendar.</p>';
    } else if(s===4){
      h='<h3>Where do we send updates?</h3>'+
        '<label class="f" for="w-name">Name<input id="w-name" autocomplete="name" value="'+esc(W.name)+'" placeholder="First and last name"></label>'+
        '<label class="f" for="w-phone">Mobile number<input id="w-phone" type="tel" autocomplete="tel" value="'+esc(W.phone)+'" placeholder="(954) 555-0123"></label>'+
        '<label class="toggle" for="w-texts"><input type="checkbox" id="w-texts"'+(W.texts?' checked':'')+'> Text me the confirmation and "tech on the way" updates</label>'+
        '<p style="margin:0;color:var(--steel);font-size:12px">Msg &amp; data rates may apply. Reply STOP to opt out.</p>';
    } else {
      var need=NEEDS.filter(function(n){return n[0]===W.need})[0];
      h='<div class="done-step step"><h3>You\'re booked, '+esc(W.name.split(' ')[0]||'friend')+'.</h3>'+
        '<p style="margin:0;color:var(--steel)">'+esc(need?need[2]:'Service')+(W.byo?' (your tires)':'')+' · '+esc(W.veh)+' · '+(W.where==='mobile'?'Mobile at '+esc(W.zip):'Sunrise shop')+' · '+esc(W.day)+', '+esc(W.win)+'</p>'+
        '<ol class="timeline"><li class="now"><b>Request received</b><small>Prototype only, nothing was sent</small></li>'+
        '<li><b>Confirmation text</b><small>With your out-the-door price</small></li><li><b>Reminder the evening before</b><small>Plus the parking checklist</small></li>'+
        '<li><b>"Tech on the way"</b><small>Your tech\'s name and arrival time</small></li><li><b>Job done</b><small>Receipt by text · Kafene financing available</small></li></ol>'+
        '<button type="button" class="linkbtn" id="wiz-restart" style="justify-self:start">Start another booking</button></div>';
      wbody.innerHTML=h; return;
    }
    wbody.innerHTML='<div class="step'+(W.dir<0?' back':'')+'">'+h+'<div class="err" id="wiz-err"></div></div>';
  }
  function wizErr(m){var e=document.getElementById('wiz-err');if(e)e.textContent=m;return false}
  function saveStep(){
    var s=W.step, g=function(id){var el=document.getElementById(id);return el?el.value.trim():''};
    if(s===0&&!W.need)return wizErr('Pick what you need to keep going.');
    if(s===1){W.veh=g('w-veh');W.size=g('w-size');var b=document.getElementById('w-byo');W.byo=!!(b&&b.checked);if(!W.veh)return wizErr('Add your vehicle so we bring the right tools.')}
    if(s===2){if(!W.where)return wizErr('Choose mobile or the shop.');if(W.where==='mobile'){W.zip=g('w-zip');if(!county(W.zip))return wizErr('Enter a ZIP we cover, or pick the shop.')}}
    if(s===3&&!W.win)return wizErr('Pick an arrival window.');
    if(s===4){W.name=g('w-name');W.phone=g('w-phone');W.texts=document.getElementById('w-texts').checked;
      if(!W.name)return wizErr('Add your name.'); if(W.phone.replace(/\D/g,'').length<10)return wizErr('Add a 10-digit mobile number.')}
    return true;
  }
  wbody.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b)return;
    if(b.dataset.need){W.need=b.dataset.need;renderWiz();return}
    if(b.dataset.where){W.where=b.dataset.where;W.dir=1;renderWiz();var z=document.getElementById('w-zip');if(z)z.focus();return}
    if(b.dataset.day){W.day=b.dataset.day;renderWiz();return}
    if(b.dataset.win){W.win=b.dataset.win;renderWiz();return}
    if(b.id==='wiz-restart'){W.step=0;W.need=null;W.where=null;W.win=null;W.dir=-1;renderWiz()}
  });
  wbody.addEventListener('input',function(e){
    if(e.target.id==='w-zip'){W.zip=e.target.value.trim();var c=county(W.zip),r=document.getElementById('w-zipres');
      r.className='zipres '+(c?'ok':(W.zip.length===5?'no':''));r.textContent=c?'We cover '+W.zip+' in '+c+' County.':(W.zip.length===5?'Outside our regular route. Call and we will try.':'')}
  });
  wnext.addEventListener('click',function(){if(!saveStep())return;W.step++;W.dir=1;renderWiz();
    var f=wbody.querySelector('input,button.opt');if(f&&W.step<5)f.focus({preventScroll:true})});
  wback.addEventListener('click',function(){if(W.step>0){W.step--;W.dir=-1;renderWiz()}});
  renderWiz();

  // ===== v5: Instagram gallery =====
  // Live site: fetch('/gallery/gallery.json') written by sync-instagram.mjs every 6 hours.
  // Prototype: same shape, sample items using the storefront photo until the feed is connected.
  var STORE=document.querySelector('.hero-media img').src;
  var GALLERY={updated:null,items:[
    {id:'s1',file:STORE,category:'jeep',tags:['jeep','lift'],isVideo:false,caption:'Sample: lifted Gladiator on new all-terrains',pos:'78% 70%'},
    {id:'s2',file:STORE,category:'jeep',tags:['jeep','wheels'],isVideo:false,caption:'Sample: Gladiator Rubicon, custom wheels',pos:'15% 75%'},
    {id:'s3',file:STORE,category:'shop',tags:[],isVideo:false,caption:'Sample: the Sunrise shop',pos:'50% 40%'},
    {id:'s4',file:STORE,category:'mobile',tags:['mobile'],isVideo:true,caption:'Sample: mobile install video',pos:'90% 60%'},
    {id:'s5',file:STORE,category:'truck',tags:['truck','lift'],isVideo:false,caption:'Sample: leveled pickup',pos:'30% 55%'},
    {id:'s6',file:STORE,category:'wheels',tags:['wheels'],isVideo:false,caption:'Sample: wheel package mounted and balanced',pos:'65% 80%'},
    {id:'s7',file:STORE,category:'shop',tags:[],isVideo:false,caption:'Sample: bay doors open, 8 AM',pos:'5% 50%'},
    {id:'s8',file:STORE,category:'truck',tags:['truck'],isVideo:false,caption:'Sample: fleet truck on site',pos:'45% 85%'}
  ]};
  var IGCATS=[['all','All'],['jeep','Jeep'],['truck','Trucks'],['lift','Lifts'],['wheels','Wheels'],['mobile','Mobile']];
  ET.GALLERY=GALLERY; ET.IGCATS=IGCATS;
  var igFilter='all', igGrid=document.getElementById('ig-grid');
  function igRender(){
    var rows=GALLERY.items.filter(function(i){return igFilter==='all'||i.category===igFilter||i.tags.indexOf(igFilter)>-1});
    igGrid.innerHTML=rows.map(function(i){
      return '<button type="button" class="ig-tile" data-ig="'+i.id+'" aria-label="'+esc(i.caption)+'"><img src="'+i.file+'" alt="" loading="lazy" style="object-position:'+(i.pos||'50% 50%')+'">'+
        (i.id.charAt(0)==='s'?'<span class="badge">Sample</span>':'')+
        (i.isVideo?'<span class="vid"><svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="#fff"/></svg></span>':'')+
        '<span class="cap">'+esc(i.caption)+'</span></button>'}).join('')||'<p style="color:#999">No posts in this category yet.</p>';
  }
  document.getElementById('ig-chips').innerHTML=IGCATS.map(function(c){return '<button type="button" data-igf="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+c[1]+'</button>'}).join('');
  document.getElementById('ig-chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;igFilter=b.dataset.igf;
    this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});igRender()});
  document.getElementById('ig-updated').textContent='Auto-syncs from Instagram every 6 hours · sample tiles shown in this prototype';
  var lb=document.getElementById('lb');
  igGrid.addEventListener('click',function(e){var t=e.target.closest('[data-ig]');if(!t)return;
    var it=GALLERY.items.filter(function(i){return i.id===t.dataset.ig})[0];
    var im=document.getElementById('lb-img');im.src=it.file;im.alt=it.caption;
    document.getElementById('lb-cap').textContent=it.caption;
    document.getElementById('lb-link').href=it.permalink||'https://www.instagram.com/extremetires';
    lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.getElementById('lb-x').focus()});
  function lbClose(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true')}
  document.getElementById('lb-x').addEventListener('click',lbClose);
  lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lbClose()});
  igRender();

  // ===== v9: hero background video (YouTube, muted, looping). Poster photo stays until playback really starts =====
  (function(){
    var ID='iV1QXEGjeLg', media=document.querySelector('.hero-media'), frame=document.getElementById('hv-frame'), home=document.getElementById('view-home');
    if(!media||!frame||!home)return;
    var autoOK=true;                              // always try muted autoplay; the pause button below is the accessibility control
    var started=false, origin=/^https?:$/.test(location.protocol)?'&origin='+encodeURIComponent(location.origin):'';
    function post(o){try{frame.contentWindow.postMessage(JSON.stringify(o),'*')}catch(_){}}
    var vid=document.getElementById('hv-video'), localOK=true;
    function yt(){ if(!started||frame.getAttribute('src'))return;
      frame.src='https://www.youtube-nocookie.com/embed/'+ID+'?autoplay=1&mute=1&controls=0&loop=1&playlist='+ID+'&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1'+origin; }
    // Our own file first (media/hero.mp4: reliable muted autoplay on iPhone); YouTube is the fallback if it is missing or blocked
    function localFail(){ localOK=false; sndMode(false); vid.removeAttribute('src'); vid.load(); yt(); }
    // Phone blocked autoplay (Low Power Mode, Reduce Motion, Data Saver): keep the photo and show a Play button. A tap always counts as permission.
    function tapMode(){ if(!btn||!vid)return; btn.classList.add('snd','tap'); btn.classList.remove('on'); btn.removeAttribute('href'); btn.removeAttribute('target'); btn.setAttribute('role','button'); btn.setAttribute('tabindex','0'); btn.setAttribute('aria-label','Play the shop video'); bt.textContent='Tap to play video'; bs.textContent='Autoplay is off on this phone'; }
    function start(){ if(started||home.hidden)return; started=true;
      if(!autoOK&&vid&&localOK){ tapMode(); return }
      if(vid&&localOK){ vid.muted=true; vid.src=(window.ET_HERO_MP4||'media/hero.mp4');
        var pr=vid.play(); if(pr&&pr.catch)pr.catch(function(err){ if(!(vid.paused&&localOK))return; if(err&&err.name==='NotAllowedError')tapMode(); else localFail() });
      } else yt(); }
    // Sound button: starts muted (browsers require it); one tap turns the music on/off. Falls back to a YouTube link when our file isn't playing.
    var btn=document.getElementById('hv-play'), bt=btn&&btn.querySelector('.pl-t'), bs=btn&&btn.querySelector('.pl-s'), ytHref=btn&&btn.getAttribute('href');
    function sndUI(){ if(!btn)return; var on=!vid.muted;
      btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on?'true':'false');
      btn.setAttribute('aria-label',on?'Turn video sound off':'Turn video sound on');
      bt.textContent=on?'Sound on':'Tap for sound'; bs.textContent=on?'Tap to mute':'Hear the music · tap to unmute'; }
    function sndMode(on){ if(!btn)return;
      if(on){ btn.classList.add('snd'); btn.removeAttribute('href'); btn.removeAttribute('target'); btn.setAttribute('role','button'); btn.setAttribute('tabindex','0'); sndUI(); }
      else { btn.classList.remove('snd','on','tap'); btn.setAttribute('href',ytHref); btn.setAttribute('target','_blank'); btn.removeAttribute('role'); btn.removeAttribute('aria-pressed'); btn.removeAttribute('aria-label'); btn.removeAttribute('tabindex'); bt.textContent='Watch with sound'; bs.textContent='Opens the full video on YouTube'; } }
    function tapPlay(e){ e.preventDefault(); if(!vid.getAttribute('src'))vid.src=(window.ET_HERO_MP4||'media/hero.mp4'); vid.muted=false;
      var pr=vid.play(); if(pr&&pr.catch)pr.catch(function(){ vid.muted=true; var p2=vid.play(); if(p2&&p2.catch)p2.catch(function(){ if(localOK)localFail() }) }) }
    function toggleSnd(e){ if(!btn.classList.contains('snd'))return; if(btn.classList.contains('tap')){ tapPlay(e); return } e.preventDefault(); vid.muted=!vid.muted; if(!vid.muted&&vid.paused)vid.play().catch(function(){}); sndUI(); }
    if(btn){ btn.addEventListener('click',toggleSnd); btn.addEventListener('keydown',function(e){ if(e.key===' '||e.key==='Enter')toggleSnd(e) }); }
    if(vid){ vid.addEventListener('playing',function(){ if(started){media.classList.add('live');btn&&btn.classList.remove('tap');sndMode(true)} });
             vid.addEventListener('error',function(){ if(started&&localOK)localFail() }); }
    // Pause / play control (WCAG: moving content that runs >5s must be pausable)
    var pz=document.getElementById('hv-pause'), userPaused=false;
    function pzUI(){ if(!pz)return; pz.hidden=!(vid&&vid.getAttribute('src')&&!tapOnly()); pz.classList.toggle('paused',userPaused); pz.setAttribute('aria-label',userPaused?'Play background video':'Pause background video'); }
    function tapOnly(){ return btn&&btn.classList.contains('tap') }
    if(pz)pz.addEventListener('click',function(){ userPaused=!userPaused; if(userPaused)vid.pause(); else vid.play().catch(function(){}); pzUI(); });
    if(vid){ vid.addEventListener('playing',pzUI); }
    // iOS Low Power Mode / strict autoplay: the first touch, click or scroll anywhere counts as permission, so start the muted video then
    function unlock(){ if(started&&!userPaused&&vid&&vid.getAttribute('src')&&vid.paused)vid.play().catch(function(){}); }
    ['touchstart','pointerdown','click','keydown','scroll'].forEach(function(ev){ window.addEventListener(ev,unlock,{passive:true,capture:true}) });
    function stop(){ if(!started)return; started=false; media.classList.remove('live'); frame.removeAttribute('src'); if(vid){vid.pause();vid.muted=true;vid.removeAttribute('src');vid.load();sndMode(false)} }
    frame.addEventListener('load',function(){ if(started)post({event:'listening',id:1,channel:'widget'}) });
    window.addEventListener('message',function(e){
      if(e.source!==frame.contentWindow)return;   // only messages from our own player
      var d=e.data; if(typeof d==='string'){try{d=JSON.parse(d)}catch(_){return}}
      if(!d)return;
      var st; if(d.event==='onStateChange')st=d.info; else if(d.event==='infoDelivery'&&d.info&&typeof d.info.playerState==='number')st=d.info.playerState;
      if(st===1)media.classList.add('live');      // 1 = playing: fade the video in over the photo
      else if(st===2)media.classList.remove('live'); // paused (e.g. iPhone Low Power Mode): fall back to the photo
    });
    new MutationObserver(function(){ home.hidden?stop():start() }).observe(home,{attributes:true,attributeFilter:['hidden']});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){ if(!started)return; if(vid&&vid.getAttribute('src')){ es[0].isIntersecting?(userPaused||vid.play().catch(function(){})):vid.pause(); return } post({event:'command',func:es[0].isIntersecting?'playVideo':'pauseVideo',args:''}) },{threshold:.05}).observe(media);
    var go=function(){setTimeout(start,50)}; document.readyState!=='loading'?go():document.addEventListener('DOMContentLoaded',go);
  })();

  // Nav shrink + mobile action bar after the hero
  var navEl=document.querySelector('header.nav'), bar=document.getElementById('actionbar');
  function onScroll(){
    var y=window.scrollY||0;
    navEl.classList.toggle('scrolled', y>60);
    bar.classList.toggle('show', y>380);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Scroll reveal: content is visible at rest; only blocks below the fold get a short slide-up
  if(!reduce && 'IntersectionObserver' in window){
    var targets=document.querySelectorAll('.sec-head,.svc,.offer,.slot,.mobile-copy,.finder-grid,.faq details,.finance,.how-grid > div,.lift,.rev-slots > div');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    targets.forEach(function(t,i){
      if(t.getBoundingClientRect().top>window.innerHeight){t.classList.add('reveal');t.style.transitionDelay=(i%6)*60+'ms';io.observe(t)}
    });
  }

  // Deals sign-up (prototype)
  document.getElementById('club-form').addEventListener('submit',function(e){
    e.preventDefault();
    var p=document.getElementById('c-phone').value.trim(), m=document.getElementById('c-email').value.trim();
    var msg=document.getElementById('club-msg');
    msg.textContent=(p||m)?'Prototype only, nothing was sent. On the live site this subscribes you in Omnisend.':'Enter a mobile number or an email to join.';
  });

  // Quote form validation (messages match the mockup)
  var form=document.getElementById('quote-form');
  var MSG={'q-first':'Please enter your name.','q-last':'Please enter your name.','q-phone':'This field is required','q-email':'This field is required','q-when':'Please select when you need service.'};
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=null;
    Object.keys(MSG).forEach(function(id){
      var el=document.getElementById(id), err=form.querySelector('.err[data-for="'+id+'"]');
      var ok=el.value.trim()!=='' && (id!=='q-email' || /.+@.+\..+/.test(el.value));
      if(id==='q-email' && el.value.trim()!=='' && !ok) err.textContent='Enter an email like name@example.com';
      else err.textContent=ok?'':MSG[id];
      if(!ok && !bad) bad=el;
    });
    var done=document.getElementById('done');
    if(bad){done.hidden=true;bad.focus();return;}
    var picked=[].slice.call(pick.querySelectorAll('input:checked')).map(function(i){return i.value});
    done.textContent='Prototype only, nothing was sent. On the live site this goes to the Omnisend form and the shop gets a lead'+(picked.length?' for: '+picked.join(', '):'')+'.';
    done.hidden=false;
  });
})();

;
try{(function(){
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
       '<section aria-labelledby="sp-inc-h"><h2 id="sp-inc-h">What&rsquo;s included</h2>'+listHtml(s.inc,'sp-inc')+
         '<p style="margin:14px 0 0"><span class="sample-note">Exact scope for your vehicle: shop to confirm</span></p></section>'+
       '<section aria-labelledby="sp-sig-h"><h2 id="sp-sig-h">'+(isGear?'Reasons to consider it':'Signs you may need it')+'</h2>'+listHtml(s.signs,'sp-signs')+
         '<p style="margin:14px 0 0;color:var(--steel);font-size:14px">These are general signs, not a diagnosis. Have a technician inspect the vehicle to know for sure.</p></section>'+
     '</div>'+
     '<aside class="sp-aside" aria-label="Service details"><div class="sp-card">'+
       '<div class="sp-fact"><small>Where</small><b>'+(s.mode==='both'?'Mobile or at the shop':'At the Sunrise shop')+'</b></div>'+
       '<div class="sp-fact"><small>Typical time</small><b>X min</b><span class="sample-note">Shop to confirm</span></div>'+
       '<div class="sp-fact"><small>Starting at</small><b>$XX</b><span class="sample-note">Sample · pricing set by the shop</span></div>'+
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

})();}catch(e){console.error('part a failed',e)}
;
try{(function(){
var esc=ET.esc;
var TRUST='<p class="cm-trust"><span aria-hidden="true">★</span> 4.7 from 1,319 reviews on Birdeye · Mobile + shop · Hunter alignment</p>';
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
  return '<article class="cm-cat">'+ic(c[1])+'<h3>'+esc(c[0])+'</h3><p>'+esc(c[2])+'</p><span class="sample">Brands: list to confirm</span></article>';
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
  return '<details><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>';
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
    :'<div class="br-tbc"><b>Popular lines: to confirm.</b> Tell us your tire size and we will check '+n+' options for your vehicle.</div>';
  root.innerHTML=
  '<div class="phead"><div class="wrap">'+
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="#home" data-view-link="home">Home</a><span>/</span><a href="#brands" data-view-link="brands">Tire Brands</a><span>/</span><span>'+n+'</span></nav>'+
    '<h1>'+n+' tires</h1><p>Shop '+n+' at Extreme Tires, installed at the shop or by our mobile van.</p>'+TRUST+
    '<div class="btns"><a class="btn btn-red" href="#quote" data-view-link="quote" data-svc="Tire Installation">Request a quote</a><a class="btn btn-ghost" href="#tires" data-view-link="tires">Shop tires</a></div>'+
  '</div></div>'+
  '<section class="br-lines" aria-labelledby="br-l"><div class="wrap br-grid"><div><div class="eyebrow">Popular lines</div><h2 id="br-l" style="font-size:clamp(26px,3.2vw,40px);font-weight:900">Popular '+n+' lines</h2>'+linesHtml+'</div>'+
    '<div class="br-rebate"><span class="sample">Sample</span><div class="eyebrow">Current rebate</div><div class="amt">$XX</div>'+
    '<p>Confirm with the manufacturer\'s promotion before publishing. Terms and dates come from the manufacturer.</p>'+
    '<a class="btn btn-dark" href="#coupons" data-view-link="coupons">See coupons and offers</a></div></div></section>'+
  '<section class="br-install" aria-labelledby="br-i"><div class="wrap"><div class="eyebrow">Install it where you are</div><h2 id="br-i">Mobile or at the shop</h2>'+
    '<div class="br-strip"><div>'+ic('van')+'<b>Mobile install</b><p>Our van brings the tires and balancer to your home, office or job site in Broward, Miami-Dade and Palm Beach counties.</p><a href="#mobile" data-view-link="mobile">Check your ZIP</a></div>'+
    '<div>'+ic('install')+'<b>At the Sunrise shop</b><p>7712 West Oakland Park Blvd. Mon–Fri 8:00 AM–6:30 PM, Sat 8:00 AM–4:00 PM.</p><a href="#locations" data-view-link="locations">Hours and directions</a></div></div>'+
  '</div></section>'+
  '<section class="br-story-sec" aria-labelledby="br-h"><div class="wrap"><div class="eyebrow">About the brand</div><h2 id="br-h" style="font-size:clamp(22px,2.6vw,30px);font-weight:900">Shop '+n+' at Extreme Tires</h2>'+
    '<div class="br-story"><span class="sample-note">Placeholder</span><p style="margin-top:8px">Brand story to be written or approved by Extreme.</p></div></div></section>'+
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
    '<div class="ta-meta"><span>'+hub+'</span><span>'+mins(t)+' min read</span><span>Draft · technician review pending</span></div>'+
  '</div></div>'+
  '<div class="ta-body"><div class="wrap ta-grid"><article class="ta-main">'+
    '<aside class="ta-take" aria-labelledby="ta-tk"><h2 id="ta-tk">Key takeaways</h2><ul>'+t.take.map(function(k){return '<li>'+esc(k)+'</li>'}).join('')+'</ul></aside>'+
    (t.w==='size'?sizeWidget():t.w==='dot'?dotWidget():'')+secs+
    '<p class="ta-draft">General information, not a substitute for your owner\'s manual or a technician\'s inspection. Draft copy for Extreme to review before publishing.</p>'+
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

})();}catch(e){console.error('part b failed',e)}
;
try{(function(){
var $=function(id){return document.getElementById(id)};
var esc=ET.esc;
[['coupons','Coupons & Offers'],['financing','Financing'],['reviews','Reviews'],['about','About Us'],['locations','Locations'],['contact','Contact Us']].forEach(function(p){ET.pages.push({id:p[0],label:p[1]})});

/* ---------- COUPONS ---------- */
var OFFERS=[
  {id:'align',kind:'tire',label:'House offer',title:'Alignment with tire purchase',amt:'$XX off',svc:'Wheel Alignments',how:'house'},
  {id:'oil',kind:'service',label:'House offer',title:'Oil change special',amt:'$XX',svc:'Oil Changes',how:'house'},
  {id:'mich',kind:'rebate',label:'Manufacturer rebate',title:'Michelin rebate',amt:'$XX',svc:'Tire Installation',how:'rebate'},
  {id:'bfg',kind:'rebate',label:'Manufacturer rebate',title:'BFGoodrich rebate',amt:'$XX',svc:'Tire Installation',how:'rebate'},
  {id:'coop',kind:'rebate',label:'Manufacturer rebate',title:'Cooper rebate',amt:'$XX',svc:'Tire Installation',how:'rebate'},
  {id:'good',kind:'rebate',label:'Manufacturer rebate',title:'Goodyear rebate',amt:'$XX',svc:'Tire Installation',how:'rebate'},
  {id:'gen',kind:'rebate',label:'Manufacturer rebate',title:'Brand rebate',amt:'Rebate',svc:'Tire Installation',how:'rebate'}
];
var CP_TABS=[['all','All offers'],['tire','Tire specials'],['service','Service specials'],['rebate','Manufacturer rebates']];
var cpFilter='all';
function cpRender(){
  var rows=OFFERS.filter(function(o){return cpFilter==='all'||o.kind===cpFilter});
  $('cp-grid').innerHTML=rows.map(function(o){
    var redeem=o.how==='house'
      ?'Mention this offer when you book, or show it on your phone at the counter.'
      :'Rebate rules come from the manufacturer. Tell us when you book and we will point you to the current form.';
    return '<article class="cp-card" data-id="'+o.id+'"><span class="sample">Sample</span>'+
      '<div class="cp-kind">'+esc(o.label)+'</div><h3>'+esc(o.title)+'</h3><div class="cp-amt">'+esc(o.amt)+'</div>'+
      '<div class="cp-exp">Expires MM/DD</div>'+
      '<p class="cp-fine">Fine print placeholder: eligible vehicles, sizes and exclusions. Simon to confirm.</p>'+
      '<p class="cp-redeem"><b>How to redeem</b>'+esc(redeem)+'</p>'+
      '<button type="button" class="btn btn-red cp-claim" aria-expanded="false" aria-controls="cp-code-'+o.id+'">Claim</button>'+
      '<div class="cp-code" id="cp-code-'+o.id+'" hidden><small>Sample code, not valid</small><code>SAMPLE-0000</code>'+
      '<a href="#quote" data-view-link="quote" data-svc="'+esc(o.svc)+'">Use at booking</a></div></article>';
  }).join('');
  $('cp-count').textContent='Showing '+rows.length+' of '+OFFERS.length+' sample offers.';
}
$('cp-tabs').innerHTML=CP_TABS.map(function(t){return '<button type="button" data-f="'+t[0]+'" aria-pressed="'+(t[0]==='all')+'">'+t[1]+'</button>'}).join('');
$('cp-tabs').addEventListener('click',function(e){
  var b=e.target.closest('button'); if(!b)return;
  cpFilter=b.dataset.f;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});
  cpRender();
});
$('cp-grid').addEventListener('click',function(e){
  var b=e.target.closest('.cp-claim'); if(!b)return;
  var code=$(b.getAttribute('aria-controls')), open=code.hidden;
  code.hidden=!open; b.setAttribute('aria-expanded',String(open)); b.textContent=open?'Hide code':'Claim';
});
cpRender();
$('cp-club').addEventListener('submit',function(e){
  e.preventDefault();
  var p=$('cp-club-phone').value.trim(), m=$('cp-club-email').value.trim(), msg=$('cp-club-msg');
  var pd=p.replace(/\D/g,''), pOk=pd.length===10||(pd.length===11&&pd.charAt(0)==='1'), mOk=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m);
  if(!p&&!m){msg.textContent='Enter a mobile number or an email to join.';return}
  if(p&&!pOk){msg.textContent='Enter a 10-digit mobile number, like (954) 555-0123.';$('cp-club-phone').focus();return}
  if(m&&!mOk){msg.textContent='Enter an email like name@example.com';$('cp-club-email').focus();return}
  msg.textContent='Prototype only, nothing was sent. On the live site this subscribes you in Omnisend. Msg & data rates may apply. Reply STOP to opt out.';
});

/* ---------- FINANCING ---------- */
function fnUpdate(){
  var v=+$('fn-range').value;
  $('fn-out').textContent='$'+v.toLocaleString('en-US')+(v>=4000?'+':'');
  $('fn-ans').textContent='For about $'+v.toLocaleString('en-US')+', ask us for a monthly estimate. Kafene sets the terms, so we will walk you through them before you apply.';
}
$('fn-range').addEventListener('input',fnUpdate); fnUpdate();

/* ---------- REVIEWS ---------- */
$('rv-slots').innerHTML=[1,2,3,4,5,6].map(function(n){
  return '<article class="rv-slot" aria-label="Review slot '+n+'"><div class="rv-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><b>Live Google review feed goes here</b><i></i><i style="width:80%"></i><i style="width:50%"></i><span>Reviewer name and date appear here. Slot '+n+' of 6.</span></article>';
}).join('');

/* ---------- ABOUT ---------- */
var TEAM=[['Simon','Owner'],['Jason','Counter'],['Adam'],['Alvaro'],['Pete'],['Carlos'],['Jeremy'],['Kenneth'],['Shawn'],['Ryan']];
$('ab-people').innerHTML=TEAM.map(function(t){
  return '<li class="ab-person"><div class="ab-av" role="img" aria-label="Photo placeholder for '+t[0]+'">'+t[0].charAt(0)+'</div><b>'+t[0]+'</b>'+
    (t[1]?'<span class="ab-role-set">'+t[1]+'</span>':'<span>Role to confirm</span>')+'<small>Photo to add</small></li>';
}).join('');

/* ---------- LOCATIONS / CONTACT: hours in Eastern Time ---------- */
var HOURS={0:null,1:[480,1110],2:[480,1110],3:[480,1110],4:[480,1110],5:[480,1110],6:[480,960]};
var DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function fmt(m){var h=Math.floor(m/60),mm=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+(mm<10?'0':'')+mm+' '+ap}
function etNow(){
  var d=0,h=0,m=0;
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date());
    parts.forEach(function(p){if(p.type==='weekday')d=DN.indexOf(p.value);if(p.type==='hour')h=(+p.value)%24;if(p.type==='minute')m=+p.value});
  }catch(_){var n=new Date();d=n.getDay();h=n.getHours();m=n.getMinutes()}
  return {d:d,min:h*60+m};
}
function openState(){
  var n=etNow(), t=HOURS[n.d];
  if(t&&n.min>=t[0]&&n.min<t[1])return {open:true,text:'Open now. Closes '+fmt(t[1])+' (ET)'};
  if(t&&n.min<t[0])return {open:false,text:'Closed now. Opens today at '+fmt(t[0])+' (ET)'};
  for(var i=1;i<=7;i++){var dd=(n.d+i)%7;if(HOURS[dd])return {open:false,text:'Closed now. Opens '+(i===1?'tomorrow':DN[dd])+' at '+fmt(HOURS[dd][0])+' (ET)'}}
  return {open:false,text:'Closed now'};
}
function paintHours(){
  var s=openState(), today=etNow().d;
  [['lc-open','lc-open-t','lc-hours'],['ct-open','ct-open-t','ct-hours']].forEach(function(ids){
    var box=$(ids[0]); if(!box)return;
    box.classList.toggle('is-open',s.open); box.classList.toggle('is-closed',!s.open);
    $(ids[1]).textContent=s.text;
    $(ids[2]).querySelectorAll('tr').forEach(function(tr){
      var is=(+tr.dataset.d===today); tr.classList.toggle('is-today',is);
      if(is)tr.setAttribute('aria-current','date');else tr.removeAttribute('aria-current');
    });
  });
}
ET.onShow.locations=ET.onShow.contact=paintHours;

var CITY_NAMES={sunrise:'Sunrise',plantation:'Plantation',tamarac:'Tamarac',lauderhill:'Lauderhill',weston:'Weston',davie:'Davie','coral-springs':'Coral Springs','pembroke-pines':'Pembroke Pines','fort-lauderdale':'Fort Lauderdale',hollywood:'Hollywood',miramar:'Miramar','boca-raton':'Boca Raton','miami-gardens':'Miami Gardens',hialeah:'Hialeah'};
function chips(slugs){return slugs.map(function(s){return '<a href="#city/'+s+'" data-view-link="city" data-param="'+s+'">'+CITY_NAMES[s]+'</a>'}).join('')}
var COUNTIES=[
  ['Broward',['sunrise','plantation','tamarac','lauderhill','weston','davie','coral-springs','pembroke-pines','fort-lauderdale','hollywood','miramar']],
  ['Miami-Dade',['miami-gardens','hialeah']],
  ['Palm Beach',['boca-raton']]
];
$('lc-counties').innerHTML=COUNTIES.map(function(c){return '<div class="lc-county"><h3>'+c[0]+' County</h3><div class="cities">'+chips(c[1])+'</div></div>'}).join('');
$('lc-near').innerHTML=chips(['plantation','tamarac','lauderhill','davie','fort-lauderdale']);

$('lc-zip-form').addEventListener('submit',function(e){
  e.preventDefault();
  var z=$('lc-zip').value.trim(), c=ET.county(z), out=$('lc-zipres');
  out.className='zipres';
  if(c===null){out.textContent='Enter a 5-digit ZIP code.';out.classList.add('no');return}
  if(c){out.textContent='Yes, we cover '+z+' in '+c+' County. Request a quote to book the van.';out.classList.add('ok')}
  else{out.textContent='That ZIP is outside our regular route. Call (954) 773-1896 and we will see what we can do.';out.classList.add('no')}
});

/* ---------- CONTACT FORM ---------- */
$('ct-form').addEventListener('submit',function(e){
  e.preventDefault();
  var f=$('ct-form'), bad=null, done=$('ct-done');
  function set(id,msg,el){var s=f.querySelector('.err[data-for="'+id+'"]');if(s)s.textContent=msg;if(msg&&!bad)bad=el||$(id)}
  var name=$('ct-name').value.trim(), phone=$('ct-phone').value.trim(), email=$('ct-email').value.trim(), pd=phone.replace(/\D/g,'');
  var pref=f.querySelector('input[name="ct-pref"]:checked').value;
  set('ct-name',name?'':'Please enter your name.');
  var pOk=pd.length===10||(pd.length===11&&pd.charAt(0)==='1'), eOk=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  set('ct-phone',phone&&!pOk?'Enter a 10-digit phone number.':(!phone&&!email?'Enter a phone number or an email.':(!phone&&pref!=='Email'?'Add a phone number so we can reach you by '+pref.toLowerCase()+'.':'')));
  set('ct-email',email&&!eOk?'Enter an email like name@example.com':(!email&&pref==='Email'?'Add an email so we can reach you.':''));
  set('ct-topic',$('ct-topic').value?'':'Please choose a topic.');
  set('ct-msg',$('ct-msg').value.trim()?'':'Please tell us how we can help.');
  set('ct-consent',pref==='Text'&&!$('ct-consent').checked?'Check the box to allow texts, or choose another way to reach you.':'',$('ct-consent'));
  if(bad){done.hidden=true;bad.focus();return}
  done.textContent='Prototype only, nothing was sent. On the live site this message is forwarded to the shop\'s inbox, and we reply by '+pref.toLowerCase()+'.';
  done.hidden=false;
});

})();}catch(e){console.error('part c failed',e)}
;
try{(function(){
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
  var svcs='<section class="d-sec alt" aria-labelledby="cy-h-svc"><div class="wrap"><div class="eyebrow">At your location</div><h2 class="d-h2" id="cy-h-svc">What we do at your location</h2><p class="d-lead">The van brings the tools to you in '+esc(c.name)+'.</p><div class="cy-svcs">'+
    mob.map(function(m){return '<a class="cy-svc" href="#service/'+m[3]+'" data-view-link="service" data-param="'+m[3]+'">'+ET.icon(m[0])+'<b>'+m[1]+'</b><span>'+m[2]+'</span></a>'}).join('')+'</div></div></section>';
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
  else{r.textContent='Outside our regular route. Call '+PHONE+' and we will see what we can do.';r.classList.add('no')}
});

})();}catch(e){console.error('part d failed',e)}
;

(function(){
  var ET=window.ET; if(!ET)return;
  // Core pages + every page a module registered (ET.pages.push({id,label,group,param}))
  var core=[{id:'home',label:'Home',group:0},{id:'tires',label:'Tires',group:0},{id:'mobile',label:'Mobile Service',group:0},{id:'quote',label:'Request a Quote',group:0}];
  var all=core.concat(ET.pages).filter(function(p){return ET.hasView(p.id)});
  var sel=document.getElementById('jump'); if(sel){
    sel.innerHTML='<option value="">Jump to page…</option>'+all.map(function(p){var v=p.id+(p.param?'/'+p.param:'');return '<option value="'+v+'">'+p.label+'</option>'}).join('');
    sel.addEventListener('change',function(){if(!sel.value)return;var s=sel.value.split('/');ET.show(s[0],null,s[1]||'');ET.setHash(s[0],s[1]||'')});
  }
  // Closing call-to-action band on every informational page (forms and legal pages excluded)
  var skip={home:1,quote:1,schedule:1,contact:1,notfound:1,terms:1,privacy:1,accessibility:1,sitemap:1};
  document.querySelectorAll('[data-view]').forEach(function(el){
    if(skip[el.dataset.view]||el.querySelector(':scope > .cta-band'))return;
    var s=document.createElement('section');s.className='cta-band';s.setAttribute('aria-label','Book or contact us');
    s.innerHTML='<div class="wrap"><div><h2>Ready when you are</h2><p>Book in 60 seconds, or call and talk to a real person. Mon–Fri 8–6:30 · Sat 8–4.</p></div><div class="cta-actions"><a class="btn btn-red" href="#start" data-go="home">Book in 60 seconds</a><a class="btn btn-ghost" href="#quote" data-view-link="quote">Request a quote</a><a class="btn btn-ghost" href="tel:+19547731896">Call (954) 773-1896</a></div></div>';
    el.appendChild(s);
  });
  ET.start();
})();
