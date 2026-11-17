
(function(){
  // Services from Melissa's quote mockup, same order and wording
  var SERVICES=[
    ["brake","Brake Repair"],["wheel","Custom Wheels Service"],["lift","Lift Kits"],["oil","Oil Changes"],
    ["susp","Suspension Repair"],["align","Wheel Alignments"],["balance","Tire Balancing"],["install","Tire Installation"],
    ["repair","Tire Repair"],["rotate","Tire Rotation"],["tpms","TPMS Service"],["pay","Shop Now, Pay Later"]
  ];
  var icon=function(id){return '<svg aria-hidden="true"><use href="#i-'+id+'"/></svg>'};

  var grid=document.getElementById('svc-grid');
  // Branded app-style icons ('+ETM+'etm-services-*.webp), each a link. The artwork carries its own label, so alt = the label.
  var SVC_TILES=[
    ["brake","Brake Repair","service","brake-repair"],["wheels","Custom Wheels Service","service","custom-wheels"],["lift","Lift Kits","service","lift-kits"],["oil","Oil Changes","service","oil-changes"],
    ["suspension","Suspension Repair","service","suspension-repair"],["alignment","Wheel Alignments","service","wheel-alignment"],["eta","ETA, track your technician","ext","https://extreme-tires-eta.vercel.app/"],
    ["balancing","Tire Balancing","service","tire-balancing"],["installation","Tire Installation","service","tire-installation"],["repair","Tire Repair","service","tire-repair"],
    ["rotation","Tire Rotation","service","tire-rotation"],["tpms","TPMS Service","service","tpms-service"],["lockout","Vehicle Lockout Assistance","service","lockout-assistance"],["jump-start","Battery Jump Starts","service","jump-starts"],["paylater","Shop Now, Pay Later","financing",""],
    ["booking","Booking, book a visit","ext","https://extreme-tires-eta.vercel.app/book"]
  ];
  grid.innerHTML=SVC_TILES.map(function(s){
    var img='<img src="'+ETM+'etm-services-'+s[0]+'.webp" alt="'+s[1]+'" width="300" height="300" loading="lazy" decoding="async">';
    if(s[2]==='ext') return '<a class="svc ic" href="'+s[3]+'" target="_blank" rel="noopener">'+img+'</a>';
    if(s[2]==='financing') return '<a class="svc ic" href="#financing" data-view-link="financing">'+img+'</a>';
    return '<a class="svc ic" href="#service/'+s[3]+'" data-view-link="service" data-param="'+s[3]+'">'+img+'</a>';
  }).join('');

  var PK={brake:'brake',wheel:'wheels',lift:'lift',oil:'oil',susp:'suspension',align:'alignment',balance:'balancing',install:'installation',repair:'repair',rotate:'rotation',tpms:'tpms',pay:'paylater'};
  var pimg=function(id,light){return '<img class="pk-img" src="'+ETM+'etm-services-'+(light?'':'dark-')+PK[id]+'.webp" alt="" width="72" height="72" loading="lazy" decoding="async">'};
  var pick=document.getElementById('pick');
  pick.innerHTML=SERVICES.map(function(s,i){
    return '<label for="pk'+i+'"><input type="checkbox" id="pk'+i+'" name="svc" value="'+s[1]+'">'+pimg(s[0])+'<span>'+s[1]+'</span></label>';
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


  // Tiny remember-me store (vehicle, tire size, contact). Fails silently if storage is blocked.
  window.ETMem={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del:function(k){try{localStorage.removeItem(k)}catch(e){}}};

  // Vehicle finder: full year/make list, models loaded live from the NHTSA vPIC database (free public API)
  window.initVehPicker=function(Y,M,D,T,init){
    var cache={};
    Y.value=init.year;
    function setModels(list,keep){
      var o=(init.blank?'<option value="">Model</option>':'')+list.map(function(n){return '<option>'+n.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</option>'}).join('')+'<option>Other / not listed</option>';
      D.innerHTML=o; if(keep&&list.indexOf(keep)>-1) D.value=keep;
      loadTrims();
    }
    // Trims come from per-make data files (CarQuery data, model years up to 2022). Newer years use the latest year on file.
    var tc={},GEN='<option>Not sure / any trim</option>';
    var slug=function(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')},norm=function(s){return s.toLowerCase().replace(/[^a-z0-9]/g,'')};
    function esc(x){return x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
    function fillTrims(data){
      var m=data&&data[norm(D.value)];T.innerHTML=GEN;if(!m)return;
      var yrs=Object.keys(m).map(Number).sort(function(a,b){return a-b}),y=+Y.value,use=null;
      for(var i=0;i<yrs.length;i++){if(yrs[i]<=y)use=yrs[i]}
      if(use===null)use=yrs[0];
      var html=m[use].map(function(t){return '<option>'+esc(t)+'</option>'}).join('');
      T.innerHTML=GEN+(use===y?html:'<optgroup label="From the '+use+' model year">'+html+'</optgroup>');
      if(init.trim){T.value=init.trim;init.trim=null}
    }
    function loadTrims(){
      T.innerHTML=GEN; if(M.value==='Other / not listed'||D.value==='Other / not listed')return;
      var k=slug(M.value);
      if(tc[k]){fillTrims(tc[k]);return}
      fetch(ETM+'etm-vehicles-'+k+'.json').then(function(r){return r.ok?r.json():null}).then(function(j){tc[k]=j||{};fillTrims(tc[k])}).catch(function(){});
    }
    D.addEventListener('change',loadTrims);
    function titleCase(s){return s.toLowerCase().replace(/(^|[\s\-\/])([a-z])/g,function(m,a,b){return a+b.toUpperCase()})}
    function load(keep){
      if(!M.value||!Y.value){D.innerHTML='<option value="">'+(init.blank?'Model':'Select year and make')+'</option>';T.innerHTML=GEN;return}
      if(M.value==='Other / not listed'){setModels([]);return}
      var key=Y.value+'|'+M.value; D.innerHTML='<option>Loading models…</option>';
      if(cache[key]){setModels(cache[key],keep);return}
      fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/'+encodeURIComponent(M.value)+'/modelyear/'+Y.value+'?format=json')
        .then(function(r){return r.json()})
        .then(function(j){
          var seen={},list=[];(j.Results||[]).forEach(function(x){var n=(x.Model_Name||'').trim();if(n&&!seen[n.toUpperCase()]){seen[n.toUpperCase()]=1;list.push(n)}});
          list.sort(); cache[key]=list; setModels(list,keep);
        })
        .catch(function(){setModels([])});
    }
    Y.addEventListener('change',function(){load(D.value)}); M.addEventListener('change',function(){load()});
    load(init.model);
  };
  var SV=ETMem.get('et_vehicle')||{};
  if(SV.make){document.getElementById('v-make').value=SV.make}
  initVehPicker(document.getElementById('v-year'),document.getElementById('v-make'),document.getElementById('v-model'),document.getElementById('v-trim'),{year:SV.year||'2024',model:SV.make?(SV.model||''):'Gladiator',trim:SV.trim||null});
  // Remember the vehicle and tire size so the Mobile page quote form can pre-fill them
  function saveHomeVeh(){
    var g=function(id){return document.getElementById(id).value},mo=g('v-model');
    if(/Loading/.test(mo)||!g('v-make'))return;
    var o=ETMem.get('et_vehicle')||{};
    ETMem.set('et_vehicle',{year:g('v-year'),make:g('v-make'),model:mo,trim:g('v-trim'),size:o.size||''});
  }
  ['v-year','v-make','v-model','v-trim'].forEach(function(id){document.getElementById(id).addEventListener('change',function(){saveHomeVeh();setTimeout(saveHomeVeh,1600)})});
  document.getElementById('p-veh').addEventListener('submit',saveHomeVeh);
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
  function saveSize(){var o=ETMem.get('et_vehicle')||{};o.size=size();ETMem.set('et_vehicle',o)}
  ['s-w','s-a','s-r'].forEach(function(id){document.getElementById(id).addEventListener('change',function(){if(document.getElementById('p-size')){/*only after the person picks*/saveSize()}})});
  document.getElementById('p-size').addEventListener('submit',saveSize);
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
  /* Outside-area result: same message as before plus tap-to-call and tap-to-text links for the shop */
  window.ETZipOutside=function(el,msg){
    el.textContent=msg+' ';
    var a=document.createElement('a');a.href='tel:+19547731896';a.textContent='Call';
    var b=document.createElement('a');b.href='sms:+19547731896';b.textContent='Text';
    el.appendChild(a);el.appendChild(document.createTextNode(' or '));el.appendChild(b);el.appendChild(document.createTextNode(' (954) 773-1896.'));
    [a,b].forEach(function(x){x.style.cssText='color:inherit;font-weight:800;text-decoration:underline'});
  };
  document.getElementById('zip-form').addEventListener('submit',function(e){
    e.preventDefault();
    var z=document.getElementById('zip').value.trim(), c=county(z), out=document.getElementById('zipres');
    out.className='zipres';
    if(c===null){out.textContent='Enter a 5-digit ZIP code.';out.classList.add('no');return}
    if(c){out.textContent='Yes, we cover '+z+' in '+c+' County. Pick a day and time in the booking form above.';out.classList.add('ok');var mz=document.getElementById('mq-zip');if(mz&&!mz.value){mz.value=z;mz.dispatchEvent(new Event('input',{bubbles:true}))}var mqs=document.getElementById('mobile-quote');if(mqs)mqs.scrollIntoView({behavior:reduce?'auto':'smooth'})}
    else{ETZipOutside(out,'That ZIP is outside our regular route, but ask us, we may still be able to help.');out.classList.add('no')}
  });
  // ===== Real booking calendar (shared by Mobile page, Quote & Book, Schedule) =====
  // Edit CLOSED_DATES with 'YYYY-MM-DD' strings for holidays/shop closures. Sundays are always closed.
  // Real availability: call ETCal.setBlocked({'YYYY-MM-DD':true}) with full days from the shop calendar to grey them out.
  window.ETCal=(function(){
    var DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        MF=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var CLOSED_DATES=[], HORIZON=60, blocked={};
    function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
    function key(d){return DN[d.getDay()]+' '+MN[d.getMonth()]+' '+d.getDate()}
    function today0(){var t=new Date();t.setHours(0,0,0,0);return t}
    function open(d){var t=today0(),min=new Date(t);min.setDate(min.getDate()+1);var max=new Date(t);max.setDate(max.getDate()+HORIZON);
      return d>=min&&d<=max&&d.getDay()!==0&&CLOSED_DATES.indexOf(iso(d))<0&&blocked[iso(d)]!==true}
    function info(k){var t=today0();for(var i=0;i<=HORIZON+2;i++){var d=new Date(t);d.setDate(d.getDate()+i);if(key(d)===k)return {k:k,d:DN[d.getDay()],m:MN[d.getMonth()]+' '+d.getDate(),sat:d.getDay()===6,date:d}}return null}
    function firstOpen(){var t=today0();for(var i=1;i<=HORIZON;i++){var d=new Date(t);d.setDate(d.getDate()+i);if(open(d))return key(d)}return null}
    function html(sel,off){
      var t=today0(),inf=sel?info(sel):null;
      if(off==null)off=inf?((inf.date.getFullYear()-t.getFullYear())*12+inf.date.getMonth()-t.getMonth()):0;
      off=Math.max(0,Math.min(2,off));
      var base=new Date(t.getFullYear(),t.getMonth()+off,1),first=base.getDay(),dim=new Date(base.getFullYear(),base.getMonth()+1,0).getDate(),c='';
      for(var i=0;i<first;i++)c+='<span class="cal-x"></span>';
      for(var n=1;n<=dim;n++){var d=new Date(base.getFullYear(),base.getMonth(),n),k=key(d),ok=open(d);
        c+=ok?'<button type="button" class="cal-d'+(d.getTime()===t.getTime()?' cal-t':'')+'" data-day="'+k+'" data-sat="'+(d.getDay()===6)+'" aria-pressed="'+(k===sel)+'" aria-label="'+DN[d.getDay()]+', '+MF[d.getMonth()]+' '+n+'">'+n+'</button>'
          :'<span class="cal-d cal-off'+(d.getTime()===t.getTime()?' cal-t':'')+'" aria-hidden="true">'+n+'</span>'}
      return '<div class="cal" data-m="'+off+'"><div class="cal-h"><button type="button" class="cal-nav" data-cal-nav="-1" aria-label="Previous month"'+(off<=0?' disabled':'')+'>&lsaquo;</button><b aria-live="polite">'+MF[base.getMonth()]+' '+base.getFullYear()+'</b><button type="button" class="cal-nav" data-cal-nav="1" aria-label="Next month"'+(off>=2?' disabled':'')+'>&rsaquo;</button></div>'+
        '<div class="cal-w" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div><div class="cal-g">'+c+'</div>'+
        '<p class="cal-key">Mon&ndash;Fri 8&ndash;6:30 &middot; Sat 8&ndash;4 &middot; Closed Sundays. Need today? Call (954) 773-1896.</p></div>'}
    document.addEventListener('click',function(e){var n=e.target.closest&&e.target.closest('[data-cal-nav]');if(!n)return;
      e.preventDefault();e.stopPropagation();var cal=n.closest('.cal'),sel=cal.querySelector('.cal-d[aria-pressed="true"]');
      var tmp=document.createElement('div');tmp.innerHTML=html(sel?sel.dataset.day:null,(+cal.dataset.m)+(+n.dataset.calNav));cal.replaceWith(tmp.firstChild)},true);
    return {html:html,info:info,firstOpen:firstOpen,isOpen:open,setBlocked:function(o){blocked=o||{}}};
  })();
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var daysEl=document.getElementById('days'), timesEl=document.getElementById('times'), pickDay=null, pickTime=null;
  var firstKey=ETCal.firstOpen(); daysEl.innerHTML=ETCal.html(firstKey);
  daysEl.querySelector('.cal-d[data-day="'+firstKey+'"]').setAttribute('aria-pressed','true');
  function renderTimes(sat){
    var t=sat?['8:00 AM','10:00 AM','12:00 PM','2:00 PM']:['8:00 AM','10:00 AM','12:00 PM','2:00 PM','4:00 PM'];
    timesEl.innerHTML=t.map(function(x,i){return '<button type="button" aria-pressed="'+(i===1)+'" data-time="'+x+'">'+x+'</button>'}).join('');
    pickTime=t[1];
  }
  pickDay=firstKey; renderTimes(ETCal.info(firstKey).sat);
  daysEl.addEventListener('click',function(e){var b=e.target.closest('button.cal-d');if(!b)return;
    daysEl.querySelectorAll('.cal-d').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});pickDay=b.dataset.day;renderTimes(b.dataset.sat==='true')});
  timesEl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    timesEl.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});pickTime=b.dataset.time});
  var _bs=document.getElementById('book-slot');if(_bs)_bs.addEventListener('click',function(){
    document.getElementById('q-mobile').checked=true;
    var w=document.getElementById('q-when'); w.value='This week';
    var z=document.getElementById('zip').value.trim(); if(z)document.getElementById('q-loc').value=z;
    var det=document.getElementById('q-details'); det.value=('Requested mobile slot: '+pickDay+' at '+pickTime+'. '+det.value).trim();
    show('quote'); try{history.replaceState(null,'','#quote')}catch(_){}
  });
  document.getElementById('cities').innerHTML=['Sunrise','Plantation','Tamarac','Lauderhill','Weston','Davie','Coral Springs','Pembroke Pines','Fort Lauderdale','Hollywood','Miramar','Boca Raton','Miami Gardens','Hialeah']
    .map(function(c){var sl=c.toLowerCase().replace(/ /g,'-');return '<a href="#city/'+sl+'" data-view-link="city" data-param="'+sl+'">'+c+'</a>'}).join('');

  // ===== v4: 60-second guided flow =====
window.ICO_FILE={align:'alignment',balance:'balancing',brake:'brake',install:'installation',lift:'lift',oil:'oil',repair:'repair',rotate:'rotation',susp:'suspension',tpms:'tpms',wheel:'wheels'};window.SI=function(ico,dark,cls){return ICO_FILE[ico]?'<img class="'+(cls||'ico-img')+'" src="'+ETM+'etm-services-'+(dark?'dark-':'')+ICO_FILE[ico]+'.webp" alt="" loading="lazy">':ET.icon(ico)};
  // ===== v6: shared guided flow (home "Booked in 60 seconds" + Quote page): Where, Vehicle, Service, When, You =====
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function makeWiz(o){
    var root=document.getElementById(o.root); if(!root)return null;
    var P=o.p, F=o.mode==='fleet', Q=o.mode==='quote'||F;
    var body=root.querySelector('[data-w=body]'),nextB=root.querySelector('[data-w=next]'),backB=root.querySelector('[data-w=back]'),cnt=root.querySelector('[data-w=count]'),nm=root.querySelector('[data-w=name]');
    var STEPN=['Where',F?'Fleet':'Vehicle','Service',Q?'Timing':'When','You'];
    var FVEH=['Cars & pickups','Work vans','Box trucks','Trailers','RVs','Semis','Boat trailers','Golf carts','Mowers & lawn equipment','Skid steers & equipment','Buses','Other'];
    var FNEEDS=['Fleet maintenance','General mechanical','A/C repair','New tires','Tire repair / roadside','On-site installation','Oil changes','Alignment','Brakes','Suspension','Scheduled rotation / inspection'];
    var FSIZE=['1–5 vehicles','6–20 vehicles','21–50 vehicles','50+ vehicles'];
    var FPREF=['Phone call','Text message','Email'];
    var TIMING=['Today / ASAP','This week','Next week','Just pricing for now'];
    var W={where:'',loc:'',zip:'',zipOk:null,vp:null,size:'',svc:{},day:null,win:null,timing:'',notes:'',name:'',phone:'',email:'',consent:false,sms:false,step:0,dir:1,busy:false,done:false,fsize:'',vt:{},needs:{},company:'',pref:'Phone call'};
    var $w=function(id){return document.getElementById(P+id)};
    var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var BK=function(){return window.ET&&ET.bk||null};
    var PHONE='(954) 773-1896';
    function isoOf(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
    function houseNo(a){return /[0-9]/.test(String(a||'').replace(/\b[0-9]+(?:st|nd|rd|th)\b/gi,' '))}
    function SVm(){return (window.ET&&ET.SV)||{}}
    function allowed(s){if(F)return true;var v=SVm()[s];if(!v)return false;var m=v.mode;return W.where==='mobile'?m!=='shop':W.where==='shop'?m!=='mobile':true}
    function navSlugs(){return (BK()&&BK().NAV)||Object.keys(SVm())}
    function chosen(){if(F)return FNEEDS.filter(function(n){return W.needs[n]});return navSlugs().filter(function(s){return W.svc[s]&&allowed(s)})}
    function labels(a){if(F)return a;return a.map(function(s){return SVm()[s].label})}
    function smsText(){var e=document.getElementById('sw-sms'),sp=e&&e.parentNode&&e.parentNode.querySelector('span');return sp?sp.textContent:'By checking this box, I agree to receive service text messages from Extreme Tires-N-Accessories LLC about this request. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help. Consent is not a condition of purchase.'}
    function dayInfo(){return W.day?ETCal.info(W.day):null}
    function wins(){var i=dayInfo();if(!i)return [];var b=BK();return b?b.windowsFor(isoOf(i.date)):[]}

    function zipCheck(){
      var z=W.zip,r=$w('zipres');W.zipOk=null;
      function paint(ok,msg){if(!r)return;r.className='zipres '+(ok===true?'ok':ok===false?'no':'');r.textContent=msg||''}
      if(z.length!==5){paint(null,'');return}
      var b=BK();
      if(b&&b.live()){
        fetch(b.endpoint+'?zip='+z,{cache:'no-store',credentials:'omit',mode:'cors'}).then(function(x){return x.json()}).then(function(c){
          if(W.zip!==z||!c)return;
          if(c.zip_in_area===true){W.zipOk=true;paint(true,'Good news, we come to that ZIP.')}
          else if(c.zip_in_area===false){W.zipOk=false;paint(false,'That ZIP is outside our service area. Call '+PHONE+' or pick the shop.')}
        }).catch(function(){});
      }else{var c2=ET.county(z);W.zipOk=!!c2;paint(!!c2,c2?'We cover '+z+' in '+c2+' County.':'Outside our regular route. Call and we will try.')}
    }

    function render(){
      var s=W.step,h='';
      root.querySelectorAll('.prog i').forEach(function(i,n){i.classList.toggle('on',n<=Math.min(s,4))});
      var pgE=root.querySelector('.prog');if(pgE){var vn=pgE.querySelector('.van');if(!vn){vn=document.createElement('img');vn.className='van';vn.src=ETM+'etm-van-progress.webp';vn.alt='';vn.width=74;vn.height=36;pgE.appendChild(vn)}pgE.style.setProperty('--p',String(s>=5?1:(Math.min(s,4)+1)/5))}
      cnt.textContent=s<5?'Step '+(s+1)+' of 5':(Q?'Sent':'Booked');
      nm.textContent=s<5?STEPN[s]:'Request received';
      backB.disabled=(s===0||s===5);nextB.hidden=(s===5);
      nextB.textContent=s===4?(Q?'Request my quote':'Send my booking request'):'Next';
      if(s===0){
        h=(F?'<h3>Where is your <span class="red">fleet?</span></h3>':'<h3>Where should we do <span class="red">it?</span></h3>')+'<div class="opts">'+
          '<button type="button" class="opt" data-where="mobile" aria-pressed="'+(W.where==='mobile')+'"><img class="where-img" src="'+ETM+'etm-where-mobile.webp" alt="" loading="lazy"><span>'+(F?'At our lot or yard':'At my location')+'<small>'+(F?'We come to your fleet':'Home, work or roadside')+'</small></span></button>'+
          '<button type="button" class="opt" data-where="shop" aria-pressed="'+(W.where==='shop')+'"><img class="where-img" src="'+ETM+'etm-where-shop.webp" alt="" loading="lazy"><span>At the Sunrise shop<small>7712 W Oakland Park Blvd</small></span></button></div>';
        if(W.where==='mobile'){
          h+='<label class="f sw-acwrap" for="'+P+'loc">Street address<input id="'+P+'loc" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="'+P+'ac" value="'+esc(W.loc)+'" placeholder="Start typing your address"><ul class="sw-ac" id="'+P+'ac" role="listbox" hidden></ul></label>'+
            '<label class="f" for="'+P+'zip">ZIP code<input id="'+P+'zip" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="'+esc(W.zip)+'" placeholder="33351"></label><div class="zipres" id="'+P+'zipres"></div>'+
            '<div class="checklist"><b>What your spot needs</b><ul><li>About 5 ft clear around the vehicle</li><li>Flat, firm ground (driveway, lot or garage)</li><li>Keys available and wheel locks in the car</li></ul></div>';
        }
      }else if(s===1&&F){
        h='<h3>Tell us about your <span class="red">fleet</span></h3><label class="f" for="'+P+'fsize">Fleet size<select id="'+P+'fsize" style="width:100%"><option value="">Choose a range</option>'+FSIZE.map(function(x){return '<option'+(W.fsize===x?' selected':'')+'>'+esc(x)+'</option>'}).join('')+'</select></label>'+
          '<div class="chipgrp">Vehicle types (pick all that apply)</div><div class="chips">'+FVEH.map(function(x){return '<button type="button" class="chip" data-vt="'+esc(x)+'" aria-pressed="'+(!!W.vt[x])+'">'+esc(x)+'</button>'}).join('')+'</div>'+
          '<div class="chipgrp">Most common vehicle (optional)</div><div class="hf-form w-veh-grid">'+
          '<label class="hf-f" for="'+P+'year"><span>Year</span><select id="'+P+'year"></select></label>'+
          '<label class="hf-f" for="'+P+'make"><span>Make</span><select id="'+P+'make"></select></label>'+
          '<label class="hf-f" for="'+P+'model"><span>Model</span><select id="'+P+'model"></select></label>'+
          '<label class="hf-f" for="'+P+'trim"><span>Trim</span><select id="'+P+'trim"><option>Not sure / any trim</option></select></label></div>'+
          '<label class="f" for="'+P+'size">Tire size (optional)<input id="'+P+'size" value="'+esc(W.size)+'" placeholder="e.g. 265/70R17, printed on the sidewall"></label>';
      }else if(s===1){
        h='<h3>Tell us about the vehicle</h3><div class="hf-form w-veh-grid">'+
          '<label class="hf-f" for="'+P+'year"><span>Year</span><select id="'+P+'year"></select></label>'+
          '<label class="hf-f" for="'+P+'make"><span>Make</span><select id="'+P+'make"></select></label>'+
          '<label class="hf-f" for="'+P+'model"><span>Model</span><select id="'+P+'model"></select></label>'+
          '<label class="hf-f" for="'+P+'trim"><span>Trim</span><select id="'+P+'trim"><option>Not sure / any trim</option></select></label></div>'+
          '<label class="f" for="'+P+'size">Tire size (optional)<input id="'+P+'size" value="'+esc(W.size)+'" placeholder="e.g. 265/70R17, printed on the sidewall"></label>';
      }else if(s===2&&F){
        h='<h3>What does the fleet <span class="red">need?</span></h3><p style="margin:0;color:#aaa;font-size:14px">Pick one or more.</p><div class="chips" style="margin-top:12px">'+FNEEDS.map(function(x){return '<button type="button" class="chip" data-need="'+esc(x)+'" aria-pressed="'+(!!W.needs[x])+'">'+esc(x)+'</button>'}).join('')+'</div>';
      }else if(s===2){
        var mob=W.where==='mobile',N=navSlugs(),SVx=SVm();
        function chip(sl){var v=SVx[sl],off=!allowed(sl);return '<button type="button" class="chip'+(off?' off':'')+'" data-svc="'+sl+'" aria-pressed="'+(!!(W.svc[sl]&&!off))+'"'+(off?' title="'+(mob?'Shop only. Tap to switch to the shop.':'Mobile only. Tap to switch to mobile.')+'"':'')+'>'+esc(v.label)+'</button>'}
        function grp(t,m){return '<div class="chipgrp">'+t+'</div><div class="chips">'+N.filter(function(x){return SVx[x]&&SVx[x].mode===m}).map(chip).join('')+'</div>'}
        h='<h3>What do you need?</h3><p style="margin:0;color:#aaa;font-size:14px">Pick one or more.</p>'+grp('Mobile or at the shop','both')+grp('Mobile only (we come to you)','mobile')+grp('Shop only','shop')+
          '<p class="alert" style="margin-top:14px">'+(mob?'You picked <b>at my location</b>, so shop-only services are greyed out. <button type="button" class="linkbtn" data-sw="toshop" style="padding:0 4px;text-transform:none;letter-spacing:0">Switch to the shop to unlock them</button>':'You picked <b>the Sunrise shop</b>, so lockouts and jump starts are greyed out (we come to you for those). <button type="button" class="linkbtn" data-sw="tomobile" style="padding:0 4px;text-transform:none;letter-spacing:0">Switch to mobile</button>')+'</p>';
      }else if(s===3){
        if(Q){
          h='<h3>When do you need service?</h3><div class="windows" role="group" aria-label="Timing">'+TIMING.map(function(t){return '<button type="button" data-timing="'+esc(t)+'" aria-pressed="'+(W.timing===t)+'">'+esc(t)+'</button>'}).join('')+'</div>';
        }else{
          var b=BK();if(b&&!b.live())try{b.boot()}catch(e){}
          if(!W.day){var fk=ETCal.firstOpen();W.day=fk||null}
          var w=wins();if(W.win&&!w.some(function(x){return x.k===W.win}))W.win=null;
          h='<h3>Pick a day and time</h3>'+(W.day?ETCal.html(W.day):'<p class="alert">No open days right now. Please call '+PHONE+'.</p>')+
            (w.length?'<div class="windows" role="group" aria-label="Arrival window">'+w.map(function(x){return '<button type="button" data-win="'+x.k+'" aria-pressed="'+(x.k===W.win)+'">'+esc(x.l)+'</button>'}).join('')+'</div>':'<p style="margin:0;color:#aaa">No times left that day. Please pick another day.</p>')+
            '<p style="margin:0;color:#aaa;font-size:13px">Pick your preferred day and window. This is a request: we confirm the exact time by phone.</p>';
        }
      }else if(s===4){
        h='<h3>Who should we contact?</h3>'+(F?'<label class="f" for="'+P+'company">Company name<input id="'+P+'company" autocomplete="organization" value="'+esc(W.company)+'" placeholder="Business or fleet name"></label>':'')+
          '<label class="f" for="'+P+'name">'+(F?'Contact name':'Name')+'<input id="'+P+'name" autocomplete="name" value="'+esc(W.name)+'" placeholder="First and last name"></label>'+
          '<label class="f" for="'+P+'phone">Mobile number<input id="'+P+'phone" type="tel" autocomplete="tel" value="'+esc(W.phone)+'" placeholder="(954) 555-0123"></label>'+
          '<label class="f" for="'+P+'email">Email'+(F?'':' (optional)')+'<input id="'+P+'email" type="email" autocomplete="email" value="'+esc(W.email)+'" placeholder="name@example.com"></label>'+
          (F?'<div class="chipgrp">Preferred contact</div><div class="chips">'+FPREF.map(function(x){return '<button type="button" class="chip" data-pref="'+esc(x)+'" aria-pressed="'+(W.pref===x)+'">'+esc(x)+'</button>'}).join('')+'</div>':'')+'<label class="f" for="'+P+'notes">Anything else we should know? (optional)<textarea id="'+P+'notes" maxlength="300" placeholder="'+(F?'Tire sizes, current brands, schedules, anything that helps':'Symptoms, tire size, gate code, etc.')+'">'+esc(W.notes)+'</textarea></label>'+
          '<label class="toggle" for="'+P+'consent"><input type="checkbox" id="'+P+'consent"'+(W.consent?' checked':'')+'> It is OK to call or text me about this request.</label>'+
          '<label class="toggle" for="'+P+'sms" style="align-items:flex-start"><input type="checkbox" id="'+P+'sms"'+(W.sms?' checked':'')+' style="margin-top:3px"><span style="font-size:12px;color:#aaa;font-weight:400">'+esc(smsText())+'</span></label>'+
          '<p style="margin:6px 0 0;font-size:11px;line-height:1.4;color:#999">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.</p>';
      }else{
        var a=chosen(),i2=dayInfo(),wl=wins().filter(function(x){return x.k===W.win})[0];
        h='<div class="done-step step"><h3>'+(Q?'Request received':'Request received')+', '+esc((W.name.split(' ')[0])||'friend')+'.</h3>'+
          '<p style="margin:0;color:#ccc">'+esc(labels(a).join(', '))+' &middot; '+esc(F?([W.company,W.fsize].filter(Boolean).join(', ')+(vehList()?' ('+vehList()+')':'')):vehText())+' &middot; '+(W.where==='mobile'?'Mobile at '+esc(W.loc)+' '+esc(W.zip):'Sunrise shop')+(Q?(W.timing?' &middot; '+esc(W.timing):''):(i2&&wl?' &middot; '+esc(i2.d+' '+i2.m)+', '+esc(wl.l):''))+'</p>'+
          '<p style="margin:0;color:#ccc">'+esc(o.doneMsg||'This was a request, not a confirmed appointment. We will contact you to confirm.')+' Need it sooner? Call <a href="tel:+19547731896" style="color:#fff"><b>'+PHONE+'</b></a>.</p>'+
          '<button type="button" class="linkbtn" data-w="restart" style="justify-self:start">Start another request</button></div>';
        body.innerHTML=h;return;
      }
      body.innerHTML='<div class="step'+(W.dir<0?' back':'')+'">'+h+'<div class="err" id="'+P+'err"></div></div>';
      if(s===0&&W.where==='mobile'&&window.ETAddrWire){var li=$w('loc'),ul=$w('ac');if(li&&ul)window.ETAddrWire(li,ul,$w('zip'),false);zipCheck()}
      if(s===1)buildVeh();
    }
    function vehText(){var v=W.vp||{};return [v.year,v.make,v.model,/^Not sure|^Other/.test(v.trim||'')?'':v.trim].filter(Boolean).join(' ')}
    function vehList(){return Object.keys(W.vt).filter(function(k){return W.vt[k]}).join(', ')}
    function buildVeh(){
      var Y=$w('year'),M=$w('make'),D=$w('model'),T=$w('trim');if(!Y||typeof initVehPicker!=='function')return;
      var v=W.vp||ETMem.get('et_vehicle')||{};
      Y.innerHTML='<option value="">Year</option>'+document.getElementById('v-year').innerHTML.replace(/ selected(="[^"]*")?/g,'');
      M.innerHTML='<option value="">Make</option>'+document.getElementById('v-make').innerHTML.replace(/ selected(="[^"]*")?/g,'');
      T.innerHTML='<option>Not sure / any trim</option>';M.value=v.make||'';Y.value='';
      initVehPicker(Y,M,D,T,{year:v.make?(v.year||''):'',model:v.make?(v.model||''):'',trim:v.make?(v.trim||null):null,blank:true});
    }
    function err(m){var e=$w('err');if(e)e.textContent=m;return false}
    function readVeh(){var g=function(i){var e=$w(i);return e?e.value:''};return {year:g('year'),make:g('make'),model:g('model'),trim:g('trim')}}
    function save(){
      var s=W.step,g=function(id){var el=$w(id);return el?el.value.trim():''};
      if(s===0){
        if(!W.where)return err('Choose the shop or your location so we plan the visit.');
        if(W.where==='mobile'){
          W.loc=g('loc');W.zip=g('zip');
          var le=$w('loc');W.lat=le&&le.dataset.lat?+le.dataset.lat:null;W.lng=le&&le.dataset.lng?+le.dataset.lng:null;
          if(W.loc.length<5||!houseNo(W.loc))return err('Enter the street address with the house number.');
          if(!/^[0-9]{5}$/.test(W.zip))return err('Enter a 5-digit ZIP code.');
          if(W.zipOk===false)return err('That ZIP is outside our service area. Call '+PHONE+' or pick the shop.');
          if(W.zipOk===null)return err('One second, checking your ZIP. Tap Next again.');
        }
      }
      if(s===1&&F){
        W.fsize=g('fsize');W.size=g('size');var fv=readVeh();W.vp=(fv.make&&fv.model&&!/^(Loading|Model$|Select)/.test(fv.model))?fv:null;
        if(!W.fsize)return err('Choose your fleet size.');
        if(!vehList())return err('Pick at least one vehicle type.');
      }else if(s===1){
        var v=readVeh();W.vp=v;W.size=g('size');
        if(!v.year||!v.make||!v.model||/^(Loading|Model$|Select)/.test(v.model))return err('Choose your vehicle year, make and model so we have the right parts.');
        try{ETMem.set('et_vehicle',{year:v.year,make:v.make,model:v.model,trim:v.trim,size:W.size})}catch(e){}
      }
      if(s===2&&!chosen().length)return err(F?'Pick at least one service your fleet needs.':'Pick at least one service.');
      if(s===3){if(Q){if(!W.timing)return err('Pick when you need service.')}else if(!W.day||!W.win)return err('Please pick a day and a time window.')}
      if(s===4){
        if(F){W.company=g('company');if(W.company.length<2)return err('Please enter your company name.')}
        W.name=g('name');W.phone=g('phone');W.email=g('email');W.notes=g('notes');W.consent=$w('consent').checked;W.sms=$w('sms').checked;
        var ph=W.phone.replace(/\D/g,'');if(ph.length===11&&ph[0]==='1')ph=ph.slice(1);
        if(W.name.length<2)return err('Please enter your name.');
        if(!/^[2-9][0-9]{9}$/.test(ph))return err('Enter a 10-digit US phone number.');
        if(F&&!W.email)return err('Please enter an email so we can send your quote.');
        if(W.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(W.email))return err('Enter an email like name@example.com');
        if(!W.consent)return err('Please tick the box so we may contact you about this request.');
      }
      return true;
    }
    function submit(){
      if(W.busy)return;
      var a=chosen(),parts=[W.where==='mobile'?'MOBILE: service at customer location':'AT SHOP',(Q?'QUOTE REQUEST, timing: '+W.timing:''),'Services: '+labels(a).join(', ')].filter(Boolean);
      if(W.vp&&W.vp.trim&&!/^Not sure|^Other/.test(W.vp.trim))parts.push('Trim: '+W.vp.trim);
      if(W.notes)parts.push(W.notes);
      var b=BK();
      if(!b||(!Q&&!b.live()))return err('Online booking is not open right now, so nothing was sent. Please call '+PHONE+' and we will book you in.');
      var d=dayInfo(),sz=W.size,v=W.vp||{};
      var svcs=labels(a).join('|'),pin=W.where==='mobile'&&W.lat!=null&&W.lng!=null;
      var tr=v.trim&&!/^Not sure|^Other/.test(v.trim)?v.trim:'';
      var bodyJ={name:W.name,phone:W.phone,email:W.email,address:W.where==='mobile'?W.loc:b.SHOP.addr,zip:W.where==='mobile'?W.zip:b.SHOP.zip,
        vehicle_year:v.year,vehicle_make:v.make,vehicle_model:v.model,tire_size:/^[A-Za-z0-9\/ .\-]{1,20}$/.test(sz)?sz:'',
        service_type:Q?'':b.serviceKey(a),pref_date:Q?'':isoOf(d.date),pref_window:Q?'':W.win,notes:parts.join(' | ').slice(0,500),consent:true,sms_consent:W.sms,sms_marketing_consent:false,lang:'en',website:'',
        location_type:W.where||'',lat:pin?W.lat:'',lng:pin?W.lng:'',vehicle_trim:tr,services:svcs.slice(0,500)};
      if(Q){bodyJ.kind=F?'fleet':'quote';bodyJ.timing=F?(W.timing||''):W.timing;
        if(F){bodyJ.company=W.company;bodyJ.fleet_size=W.fsize;bodyJ.vehicle_types=vehList().split(', ').join('|');bodyJ.contact_pref=W.pref||'';if(!W.where){bodyJ.location_type=''}}}
      Object.keys(bodyJ).forEach(function(k){if(bodyJ[k]===''&&k!=='website')delete bodyJ[k]});
      W.busy=true;nextB.disabled=true;var lbl=nextB.textContent;nextB.textContent='Sending...';
      function idle(){W.busy=false;nextB.disabled=false;nextB.textContent=lbl}
      window.ETRecaptcha.token(Q?(F?'fleet':'quote'):'schedule').then(function(rt){bodyJ.recaptcha_token=rt;
      return fetch(b.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'content-type':'application/json'},body:JSON.stringify(bodyJ)})})
        .then(function(r){return r.json().catch(function(){return null}).then(function(j){return {status:r.status,j:j}})}).then(function(res){
          var j=res.j;idle();j=j||{};
          if(window.ETRecaptcha.isVerifyFail(res.status,j)){err(window.ETRecaptcha.MSG);return}
          if(j.ok===true){W.done=true;W.step=5;W.dir=1;if(!Q)o.doneMsg=(typeof j.message==='string'&&j.message?j.message+'. ':'')+'This was a request, not a confirmed appointment. We will contact you to confirm the day and time.';render();return}
          var c=j.code,msg=typeof j.message==='string'&&j.message?j.message:'';
          var back=function(n,m){W.step=n;W.dir=-1;render();err(m)};
          if(c==='out_of_area')back(0,'That ZIP is outside our service area. Call '+PHONE+'.');
          else if(c==='closed'||c==='notice'||c==='date_range')back(3,msg||'That day or time is not available. Please pick another.');
          else if(c==='rate_limited')err('We got a lot of requests just now. Please try again in a bit, or call '+PHONE+'.');
          else if(c==='disabled')err('Online booking is paused right now. Please call '+PHONE+'.');
          else if(c==='invalid'&&j.field){var st={address:0,zip:0,services:2,company:4,email:4,name:4,phone:4,vehicle_year:1,vehicle_make:1,vehicle_model:1,tire_size:1,service_type:2,pref_date:3,pref_window:3}[j.field];if(st!=null)back(st,msg||'Please check that and try again.');else err(msg||'Please check that and try again.')}
          else err('We could not send that just now. Please try again, or call '+PHONE+'.');
        }).catch(function(){idle();err('We could not send that just now. Please check your connection and try again, or call '+PHONE+'.')});
    }
    body.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      if(b.dataset.where){W.where=b.dataset.where;Object.keys(W.svc).forEach(function(s){if(!allowed(s))delete W.svc[s]});W.dir=1;render();var z=$w('loc');if(z)z.focus({preventScroll:true});return}
      if(b.dataset.svc){var sl=b.dataset.svc;
        if(!allowed(sl)){if(W.where==='mobile'){W.where='shop';W.svc[sl]=true;render()}else{W.where='mobile';W.svc[sl]=true;W.step=0;W.dir=-1;render()}return}
        if(W.svc[sl])delete W.svc[sl];else W.svc[sl]=true;b.setAttribute('aria-pressed',String(!!W.svc[sl]));return}
      if(b.dataset.sw){if(b.dataset.sw==='toshop'){W.where='shop';Object.keys(W.svc).forEach(function(s){if(!allowed(s))delete W.svc[s]});render()}else{W.where='mobile';W.step=0;W.dir=-1;render()}return}
      if(b.dataset.vt){var k=b.dataset.vt;if(W.vt[k])delete W.vt[k];else W.vt[k]=true;b.setAttribute('aria-pressed',String(!!W.vt[k]));return}
      if(b.dataset.need){var n=b.dataset.need;if(W.needs[n])delete W.needs[n];else W.needs[n]=true;b.setAttribute('aria-pressed',String(!!W.needs[n]));return}
      if(b.dataset.pref){W.pref=b.dataset.pref;[].forEach.call(body.querySelectorAll('[data-pref]'),function(x){x.setAttribute('aria-pressed',String(x===b))});return}
      if(b.dataset.day){W.day=b.dataset.day;W.win=null;render();return}
      if(b.dataset.win){W.win=b.dataset.win;render();return}
      if(b.dataset.timing){W.timing=b.dataset.timing;render();return}
      if(b.dataset.w==='restart'){var keep={name:W.name,phone:W.phone,email:W.email,vp:W.vp};W=Object.assign({where:'',loc:'',zip:'',zipOk:null,vp:null,size:'',svc:{},day:null,win:null,timing:'',notes:'',consent:false,sms:false,step:0,dir:-1,busy:false,done:false,fsize:'',vt:{},needs:{},company:W.company,pref:'Phone call'},keep);render()}
    });
    body.addEventListener('input',function(e){if(e.target.id===P+'zip'){W.zip=e.target.value.replace(/\D/g,'').slice(0,5);if(e.target.value!==W.zip)e.target.value=W.zip;zipCheck()}});
    body.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='checkbox'&&!(e.target.getAttribute('aria-expanded')==='true')){e.preventDefault();nextB.click()}});
    nextB.addEventListener('click',function(){
      if(W.step===4){if(save())submit();return}
      if(!save())return;W.step++;W.dir=1;render();
      var f=body.querySelector('input,button.opt');if(f&&W.step<5)try{f.focus({preventScroll:true})}catch(x){}
    });
    backB.addEventListener('click',function(){if(W.step>0&&W.step<5){W.step--;W.dir=-1;render()}});
    render();
    return {W:W,render:render,set:function(p){Object.assign(W,p);if(W.step<5)render()}};
  }
  var homeWiz=makeWiz({root:'wiz',p:'w-',mode:'book'});
  window.ETWizHome=homeWiz;
  var quoteWiz=makeWiz({root:'qwiz',p:'qz-',mode:'quote',doneMsg:'Our team will review this and contact you with pricing. This is a quote request, not a confirmed appointment.'});
  window.ETWizQuote=quoteWiz;
  window.ETWizFleet=makeWiz({root:'cwiz',p:'cz-',mode:'fleet',doneMsg:'Our team will review your fleet details and follow up with pricing and service options. This is a quote request, not a confirmed appointment.'});
  /* other pages still prefill the (hidden) legacy quote fields; pull them into the wizard whenever the Quote page opens */
  function importQuote(){
    if(!quoteWiz)return;var g=function(id){return document.getElementById(id)},p={},have=false;
    var det=g('q-details'),mob=g('q-mobile'),loc=g('q-loc'),pk=g('pick'),svc={};
    if(pk)[].forEach.call(pk.querySelectorAll('input:checked'),function(i){var nm=i.value.toLowerCase();var SVx=(window.ET&&ET.SV)||{};Object.keys(SVx).forEach(function(sl){if(SVx[sl].label.toLowerCase()===nm||SVx[sl].name.toLowerCase()===nm)svc[sl]=true});i.checked=false;have=true});
    if(Object.keys(svc).length){quoteWiz.W.svc=Object.assign(quoteWiz.W.svc,svc)}
    if(det&&det.value.trim()){quoteWiz.W.notes=(det.value.trim()+(quoteWiz.W.notes?' '+quoteWiz.W.notes:'')).slice(0,300);det.value='';have=true}
    if(mob&&mob.checked){if(!quoteWiz.W.where)quoteWiz.W.where='mobile';mob.checked=false;have=true}
    if(loc&&loc.value.trim()){var v=loc.value.trim();if(/^[0-9]{5}$/.test(v))quoteWiz.W.zip=v;else quoteWiz.W.loc=v;loc.value='';have=true}
    var qw=g('q-when');if(qw&&qw.value){quoteWiz.W.timing=qw.value;qw.value='';have=true}
    if(have)quoteWiz.render();
  }
  window.importQuote=importQuote;
  ET.onShow.quote=function(){try{importQuote()}catch(e){console.error(e)}};

  // ===== v5: Instagram gallery =====
  // Live site: fetch('/gallery/gallery.json') written by sync-instagram.mjs every 6 hours.
  // Latest public reels from @extremetires (thumbnails hosted locally; tiles link to the real posts).
  var GALLERY={updated:'2026-11-13',items:[
    {id:'r1',file:ETM+'etm-ig-Dfrx3ZsgdfF.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 13 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/Dfrx3ZsgdfF/'},
    {id:'r2',file:ETM+'etm-ig-DfpNGY7nJC1.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 12 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfpNGY7nJC1/'},
    {id:'r3',file:ETM+'etm-ig-Dfmoas6CjeM.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 11 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/Dfmoas6CjeM/'},
    {id:'r4',file:ETM+'etm-ig-DfkDYv6D7WI.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 10 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfkDYv6D7WI/'},
    {id:'r5',file:ETM+'etm-ig-DfhetrtkoNS.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 9 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfhetrtkoNS/'},
    {id:'r6',file:ETM+'etm-ig-DfcYyjLOAVV.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 7 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfcYyjLOAVV/'},
    {id:'r7',file:ETM+'etm-ig-DfZwZ3YnDs3.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 6 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfZwZ3YnDs3/'},
    {id:'r8',file:ETM+'etm-ig-DfXLh_ujQXS.jpg',category:'reel',tags:[],isVideo:true,caption:'Reel · Nov 5 · watch on Instagram',permalink:'https://www.instagram.com/extremetires/reel/DfXLh_ujQXS/'}
  ]};
  // LIVE FEED: paste the Behold (or compatible JSON) feed URL below and the grid updates itself whenever @extremetires posts.
  // Leave empty to keep the built-in latest reels above.
  var IG_FEED_URL='';
  if(IG_FEED_URL){
    fetch(IG_FEED_URL,{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){
      var posts=(j&&(j.posts||j.data||j))||[];
      var items=posts.slice(0,12).map(function(p,n){
        var img=p.thumbnailUrl||(p.sizes&&p.sizes.medium&&p.sizes.medium.mediaUrl)||p.mediaUrl||p.media_url||p.thumbnail_url;
        var cap=String(p.prunedCaption||p.caption||'View on Instagram').replace(/\s+/g,' ').slice(0,110);
        return img&&(p.permalink)?{id:'l'+n,file:img,category:'reel',tags:[],isVideo:/VIDEO|REEL/i.test(p.mediaType||p.media_type||''),caption:cap,permalink:p.permalink}:null}).filter(Boolean);
      if(items.length){GALLERY.items.length=0;items.forEach(function(i){GALLERY.items.push(i)});window.dispatchEvent(new Event('et-feed'))}
    }).catch(function(){});
  }
  var IGCATS=[['all','All'],['reel','Reels'],['google','Customer photos']];
  /* CUSTOMER PHOTOS: photos customers posted with their Google reviews (credited by first name + last initial). Metadata stripped. */
  var GLINK='https://www.google.com/maps/place/Extreme+Mobile+Tires/@26.1658848,-80.2520611,17z';
  var REVIEWS=[
    {id:'g1',file:ETM+'etm-reviews-shop-showroom.webp',category:'google',tags:[],isVideo:false,caption:'Wheel and tire showroom · photo by James B. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g2',file:ETM+'etm-reviews-shop-wheel-wall.webp',category:'google',tags:[],isVideo:false,caption:'Wheel wall at the Sunrise shop · photo by James B. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g3',file:ETM+'etm-reviews-shop-front-counter.webp',category:'google',tags:[],isVideo:false,caption:'Front counter at the Sunrise shop · photo by James B. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g4',file:ETM+'etm-reviews-van-motorhome-call.webp',category:'google',tags:[],isVideo:false,caption:'Mobile service van on a motorhome call · photo by Evgen O. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g5',file:ETM+'etm-reviews-van-beside-motorhome.webp',category:'google',tags:[],isVideo:false,caption:'Mobile service van beside a motorhome · photo by Evgen O. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g6',file:ETM+'etm-reviews-van-on-location.webp',category:'google',tags:[],isVideo:false,caption:'Mobile tire service van on location · photo by Evgen O. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g7',file:ETM+'etm-reviews-van-rear.webp',category:'google',tags:[],isVideo:false,caption:'Mobile tire service van, rear view · photo by Taynor G. on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g8',file:ETM+'etm-reviews-van-roadside.webp',category:'google',tags:[],isVideo:false,caption:'Mobile van on the roadside · photo by Pressure People LLC on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g9',file:ETM+'etm-reviews-blown-truck-tire.webp',category:'google',tags:[],isVideo:false,caption:'Blown commercial truck tire · photo by Pressure People LLC on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g10',file:ETM+'etm-reviews-blown-wheel-close.webp',category:'google',tags:[],isVideo:false,caption:'Commercial wheel after a blowout · photo by Pressure People LLC on Google',lbLink:GLINK,pos:'50% 50%'},
    {id:'g11',file:ETM+'etm-reviews-blown-wheel-inner.webp',category:'google',tags:[],isVideo:false,caption:'Commercial wheel, inner side · photo by Pressure People LLC on Google',lbLink:GLINK,pos:'50% 50%'}
  ];
  ET.GALLERY=GALLERY; ET.IGCATS=IGCATS; ET.SHOP=[]; ET.REVIEWS=REVIEWS;
  /* Customer photos manifest: review-sync/sync_review_photos.py appends new Google-review photos to this file; no code edit needed. */
  fetch(ETM+'etm-reviews-gallery.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(j){
    var rows=(j&&j.items)||[];if(!rows.length)return;
    REVIEWS.length=0;
    rows.forEach(function(r,n){if(typeof r.file!=='string'||r.file.indexOf('media/reviews/')!==0)return;r.file=ETM+'etm-reviews-'+r.file.slice(14);
      REVIEWS.push({id:'g'+n,file:r.file,category:'google',tags:[],isVideo:false,caption:String(r.caption||'Customer photo on Google').slice(0,110),lbLink:j.link||GLINK,pos:'50% 50%'})});
    window.dispatchEvent(new Event('et-feed'));
  }).catch(function(){});
  /* SHOP PHOTOS: techs add these from the ops app; they go straight into the gallery. Public list, newest first. */
  var SHOP_CATS={tires:'Tires',wheels:'Wheels',mobile:'Mobile van',shop:'Shop',fleet:'Fleet',lifts:'Lifts',other:'Shop work'};
  fetch('https://qaxxwpojwpqkwqlpzrck.supabase.co/functions/v1/gallery-feed',{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}).then(function(r){return r.ok?r.json():null}).then(function(j){
    var rows=(j&&j.items)||[];
    ET.SHOP.length=0;
    rows.forEach(function(r){
      if(!r||typeof r.url!=='string'||r.url.indexOf('https://qaxxwpojwpqkwqlpzrck.supabase.co/storage/v1/object/public/website-gallery/')!==0)return;
      ET.SHOP.push({id:'s'+String(r.id).slice(0,8),file:r.url,category:SHOP_CATS[r.category]?r.category:'other',tags:[],isVideo:false,shop:true,caption:String(r.caption||SHOP_CATS[r.category]||'From the shop').slice(0,110),pos:'50% 50%'});
    });
    IGCATS.length=1;
    var seen={};ET.SHOP.forEach(function(i){seen[i.category]=1});
    IGCATS.push(['reel','Reels']);Object.keys(SHOP_CATS).forEach(function(k){if(seen[k])IGCATS.push([k,SHOP_CATS[k]])});IGCATS.push(['google','Customer photos']);
    window.dispatchEvent(new Event('et-feed'));
  }).catch(function(){});
  var igFilter='all', igGrid=document.getElementById('ig-grid');
  function igRender(){
    var rows=ET.SHOP.slice(0,8).concat(GALLERY.items).filter(function(i){return igFilter==='all'||i.category===igFilter||i.tags.indexOf(igFilter)>-1});
    igGrid.innerHTML=rows.map(function(i){
      if(i.shop)return '<a class="ig-tile" href="#gallery" data-view-link="gallery" aria-label="'+esc(i.caption)+' (opens the gallery)"><img src="'+esc(i.file)+'" alt="'+esc(i.caption)+'" loading="lazy" width="280" height="280"><span class="cap">'+esc(i.caption)+'</span></a>';
      return '<a class="ig-tile" href="'+i.permalink+'" target="_blank" rel="noopener" aria-label="'+esc(i.caption)+' (opens Instagram)"><img src="'+i.file+'" alt="" loading="lazy" width="280" height="280">'+
        '<span class="vid"><svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="#fff"/></svg></span>'+
        '<span class="cap">'+esc(i.caption)+'</span></a>'}).join('')||'<p style="color:#999">No posts in this category yet.</p>';
  }
  document.getElementById('ig-chips').innerHTML=IGCATS.map(function(c){return '<button type="button" data-igf="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+c[1]+'</button>'}).join('');
  document.getElementById('ig-chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;igFilter=b.dataset.igf;
    this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});igRender()});
  document.getElementById('ig-updated').textContent='Latest reels from @extremetires. Tap one to watch it on Instagram.';document.getElementById('ig-chips').hidden=true;
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
  window.addEventListener('et-feed',igRender);

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
      if(vid&&localOK){ vid.muted=true; vid.src=ETM+'etm-hero.mp4';
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
    function tapPlay(e){ e.preventDefault(); if(!vid.getAttribute('src'))vid.src=ETM+'etm-hero.mp4'; vid.muted=false;
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

  // Mobile page quote form (same fields and messages as the Quote page, plus vehicle + remembered details)
  var mpick=document.getElementById('mq-pick'), mform=document.getElementById('mq-form');
  if(mpick&&mform){
    var $m=function(id){return document.getElementById(id)};
    mpick.innerHTML=SERVICES.map(function(s,i){
      return '<label for="mpk'+i+'"><input type="checkbox" id="mpk'+i+'" name="svc" value="'+s[1]+'">'+pimg(s[0],true)+'<span>'+s[1]+'</span></label>';
    }).join('');

    /* ---- vehicle: pre-filled from the homepage finder (shared et_vehicle), saved back when changed ---- */
    var builtSig=null;
    function vehSig(v){return v&&v.make?[v.year,v.make,v.model,v.trim].join('|'):''}
    function vehNow(){
      var y=$m('mq-vyear').value,mk=$m('mq-vmake').value,d=$m('mq-vmodel').value,t=$m('mq-vtrim').value;
      if(!y||!mk)return '';
      return [y,mk,(d&&!/Loading|^Model$/.test(d))?d:'',/^Not sure/.test(t)?'':t].filter(Boolean).join(' ');
    }
    function saveMobVeh(){
      var y=$m('mq-vyear').value,mk=$m('mq-vmake').value,d=$m('mq-vmodel').value;
      if(!y||!mk||/Loading/.test(d))return;
      var o=ETMem.get('et_vehicle')||{};
      var v={year:y,make:mk,model:d,trim:$m('mq-vtrim').value,size:$m('mq-size').value||o.size||''};
      builtSig=vehSig(v);ETMem.set('et_vehicle',v);
    }
    function buildVeh(){
      var v=ETMem.get('et_vehicle')||{}, sig=vehSig(v);
      if(builtSig!==null&&sig===builtSig)return;               // nothing new since the last build
      ['mq-vyear','mq-vmake','mq-vmodel','mq-vtrim'].forEach(function(id){var o=$m(id),n=o.cloneNode(false);o.parentNode.replaceChild(n,o)}); // drop old listeners
      var Y=$m('mq-vyear'),M=$m('mq-vmake'),D=$m('mq-vmodel'),T=$m('mq-vtrim');
      Y.innerHTML='<option value="">Year</option>'+$m('v-year').innerHTML.replace(/ selected(="[^"]*")?/g,'');
      M.innerHTML='<option value="">Make</option>'+$m('v-make').innerHTML.replace(/ selected(="[^"]*")?/g,'');
      T.innerHTML='<option>Not sure / any trim</option>';
      M.value=v.make||'';Y.value='';
      initVehPicker(Y,M,D,T,{year:v.make?(v.year||''):'',model:v.make?(v.model||''):'',trim:v.make?(v.trim||null):null,blank:true});
      [Y,M,D,T].forEach(function(el){el.addEventListener('change',function(){saveMobVeh();setTimeout(saveMobVeh,1600);note()})});
      if(v.size&&!$m('mq-size').value)$m('mq-size').value=v.size;
      builtSig=sig; note(v.make?v:null);
    }
    function note(v){
      var n=$m('mq-vnote');
      if(v&&v.make){n.innerHTML='<b>&#10003; Vehicle saved from your search:</b> '+ET.esc([v.year,v.make,v.model].filter(Boolean).join(' '))+' <button type="button" id="mq-vclear">Not your vehicle? Clear</button>';n.hidden=false;
        $m('mq-vclear').onclick=function(){ETMem.del('et_vehicle');builtSig=null;$m('mq-size').value='';buildVeh();n.hidden=true}}
      else n.hidden=true;
    }
    $m('mq-size').addEventListener('change',function(){var o=ETMem.get('et_vehicle')||{};o.size=this.value.trim();ETMem.set('et_vehicle',o)});
    buildVeh();
    window.mqRefreshVehicle=buildVeh;

    /* ---- contact details: browser autofill + our own remember-me (shared with the Quote page) ---- */
    var CF=[['first','first'],['last','last'],['phone','phone'],['email','email'],['loc','loc']];
    function rememberContact(pfx){
      var o={};CF.forEach(function(f){var el=document.getElementById(pfx+f[0]);if(el&&el.value.trim())o[f[1]]=el.value.trim()});
      if(Object.keys(o).length)ETMem.set('et_contact',Object.assign(ETMem.get('et_contact')||{},o));
    }
    ['mq-','q-'].forEach(function(pfx){
      var c=ETMem.get('et_contact')||{};
      CF.forEach(function(f){var el=document.getElementById(pfx+f[0]);if(!el)return;if(c[f[1]]&&!el.value)el.value=c[f[1]];el.addEventListener('change',function(){rememberContact(pfx)})});
    });

    var MMSG={'mq-first':'Please enter your name.','mq-last':'Please enter your name.','mq-phone':'This field is required','mq-email':'This field is required','mq-when':'Please select when you need service.'};
    mform.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=null;
      Object.keys(MMSG).forEach(function(id){
        var el=document.getElementById(id), err=mform.querySelector('.err[data-for="'+id+'"]')||{};
        var ok=el.value.trim()!=='' && (id!=='mq-email' || /.+@.+\..+/.test(el.value));
        if(id==='mq-email' && el.value.trim()!=='' && !ok) err.textContent='Enter an email like name@example.com';
        else err.textContent=ok?'':MMSG[id];
        if(!ok && !bad) bad=el;
      });
      var md=document.getElementById('mq-done');
      if(bad){md.hidden=true;bad.focus();return;}
      rememberContact('mq-');saveMobVeh();
      var mp=[].slice.call(mpick.querySelectorAll('input:checked')).map(function(i){return i.value});
      var veh=vehNow(), sz=$m('mq-size').value.trim();
      md.textContent='Prototype only, nothing was sent. On the live site this goes to the Omnisend form and the shop gets a lead'+(mp.length?' for: '+mp.join(', '):'')+(veh?' | Vehicle: '+veh:'')+(sz?' | Tire size: '+sz:'')+' | When: '+$m('mq-when').value+((($m('mq-loc').value||'')+' '+($m('mq-zip').value||'')).trim()?' | Where: '+(($m('mq-loc').value||'')+' '+($m('mq-zip').value||'')).trim():'')+'.';
      md.hidden=false;
    });
  }
})();
