
/* Live booking: the wizard above is the ONE form. When the shop has booking switched ON in the ops app, it reads open days/hours
   from the booking-intake endpoint and sends the request there. If the endpoint is off or unreachable the wizard stays a prototype. */
(function(){
  var BOOK={endpoint:'https://qaxxwpojwpqkwqlpzrck.supabase.co/functions/v1/booking-intake'},PHONE='(954) 773-1896';
  var f=document.getElementById('mq-form'); if(!f||!window.ETCal)return;
  var $=function(id){return document.getElementById(id)};
  var cfg=null,live=false,zipState=null,zipSeq=0,busy=false,done=false;
  var daysEl=$('days'),timesEl=$('times'),zip=$('mq-zip'),znote=$('mq-zip-note'),sub=$('mq-submit'),next=$('mq-next');
  var WIN=[{k:'morning',l:'Morning (8 am to noon)',a:480,b:720},{k:'midday',l:'Midday (noon to 3 pm)',a:720,b:900},{k:'afternoon',l:'Afternoon (3 to 6 pm)',a:900,b:1080},{k:'evening',l:'Evening (6 to 9 pm)',a:1080,b:1260},{k:'any',l:'Any time that day',a:0,b:1440}];
  function tm(s){var m=/^(\d\d):(\d\d)/.exec(s||'');return m?(+m[1])*60+(+m[2]):0}
  function isoOf(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function shopNow(){
    var p={};
    try{new Intl.DateTimeFormat('en-US',{timeZone:(cfg&&cfg.timezone)||'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value})}
    catch(e){var d=new Date();return {ymd:isoOf(d),min:d.getHours()*60+d.getMinutes()}}
    return {ymd:p.year+'-'+p.month+'-'+p.day,min:(+p.hour)*60+(+p.minute)};
  }
  function dayN(ymd,now){return Math.round((Date.parse(ymd+'T12:00:00Z')-Date.parse(now.ymd+'T12:00:00Z'))/864e5)}
  function ivs(ymd){return (cfg.hours||{})[String(new Date(ymd+'T12:00:00Z').getUTCDay())]||[]}
  function windowsFor(ymd){
    var now=shopNow(),n=dayN(ymd,now),notice=(cfg.min_notice_hours||0)*60,iv=ivs(ymd);
    return WIN.filter(function(w){var lo=1e9,hi=-1;iv.forEach(function(i){var l=Math.max(tm(i.open),w.a),h=Math.min(tm(i.close),w.b);if(l<h){lo=Math.min(lo,l);hi=Math.max(hi,h)}});return hi>lo&&n*1440+hi>now.min+notice});
  }
  function pressedDay(){
    var b=daysEl.querySelector('button.cal-d[aria-pressed="true"]'),i=b?ETCal.info(b.dataset.day):null;
    return i?{key:b.dataset.day,iso:isoOf(i.date)}:null;
  }
  function renderWins(){
    var d=pressedDay(); if(!d){timesEl.innerHTML='';return}
    var list=windowsFor(d.iso);
    timesEl.innerHTML=list.length?list.map(function(w,i){return '<button type="button" aria-pressed="'+(i===0)+'" data-time="'+w.l+'" data-win="'+w.k+'">'+w.l+'</button>'}).join(''):'<p class="mq-fine">No times left that day. Please pick another day.</p>';
  }
  function fmt(h){var m=tm(h),hh=Math.floor(m/60),mm=m%60,ap=hh>=12?'pm':'am';hh=hh%12||12;return hh+(mm?':'+('0'+mm).slice(-2):'')+' '+ap}
  function hoursText(){
    var order=[1,2,3,4,5,6,0],N=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],g=[],last=null;
    order.forEach(function(d){
      var iv=(cfg.hours||{})[String(d)]||[],t=iv.length?iv.map(function(x){return fmt(x.open)+'–'+fmt(x.close)}).join(', '):'closed';
      if(last&&last.t===t){last.to=d}else{last={t:t,from:d,to:d};g.push(last)}
    });
    return g.map(function(x){return (x.from===x.to?N[x.from]:N[x.from]+'–'+N[x.to])+' '+x.t}).join(' · ')+'. Need today? Call '+PHONE+'.';
  }
  function fixKey(){var t=hoursText();daysEl.querySelectorAll('.cal-key').forEach(function(k){if(k.textContent!==t)k.textContent=t})}
  function kick(){daysEl.dispatchEvent(new Event('click',{bubbles:true}))}    // lets the wizard refresh its hidden "when" value
  function applyCfg(){
    var now=shopNow(),blocked={},t=new Date(),i;t.setHours(0,0,0,0);
    for(i=0;i<=62;i++){
      var d=new Date(t);d.setDate(d.getDate()+i);var iso=isoOf(d),iv=ivs(iso),n=dayN(iso,now),last=iv.length?Math.max.apply(null,iv.map(function(x){return tm(x.close)})):0;
      if(!iv.length||n<0||n>(cfg.max_days_ahead||30)||n*1440+last<=now.min+(cfg.min_notice_hours||0)*60)blocked[iso]=true;
    }
    ETCal.setBlocked(blocked);
    var fk=ETCal.firstOpen(); if(!fk){ETCal.setBlocked({});return false}
    daysEl.innerHTML=ETCal.html(fk);
    var b=daysEl.querySelector('.cal-d[data-day="'+fk+'"]');if(b)b.setAttribute('aria-pressed','true');
    renderWins();fixKey();kick();return true;
  }
  new MutationObserver(function(){if(live)fixKey()}).observe(daysEl,{childList:true,subtree:true});
  daysEl.addEventListener('click',function(e){if(live&&e.target.closest&&e.target.closest('button.cal-d')){renderWins()}});

  /* ZIP in service area (read from the same endpoint) */
  function zipCheck(){
    var z=zip.value.replace(/\D/g,'').slice(0,5);if(z!==zip.value)zip.value=z;
    zipState=null;znote.textContent='';znote.className='mq-zipnote';
    var ze=f.querySelector('.err[data-for="mq-zip"]');if(ze)ze.textContent='';
    if(z.length!==5||!live)return;
    var my=++zipSeq;
    fetch(BOOK.endpoint+'?zip='+z,{cache:'no-store',credentials:'omit',mode:'cors'}).then(function(r){return r.json()}).then(function(c){
      if(my!==zipSeq||!c)return;
      if(c.zip_in_area===true){zipState=true;znote.textContent='Good news, we come to that ZIP.';znote.className='mq-zipnote ok'}
      else if(c.zip_in_area===false){zipState=false;znote.textContent='That ZIP is outside our service area. Call '+PHONE+' and we will see what we can do.';znote.className='mq-zipnote no'}
    }).catch(function(){});
  }
  zip.addEventListener('input',zipCheck);
  $('mq-loc').addEventListener('input',function(){setErr(errFor('mq-loc'),'')});

  /* what the customer picked -> the shop's service list */
  function services(){
    var names=[].slice.call(document.querySelectorAll('#mq-pick input:checked')).map(function(i){return i.value});
    var sy=[1,2,3,4].filter(function(n){return $('mq-sy'+n).checked});
    var has=function(x){return names.indexOf(x)>-1};
    var T=(window.ET&&ET.SVC_TYPE)||{},SVm=(window.ET&&ET.SV)||{},key='',i,sl;
    for(i=0;i<names.length&&!key;i++){for(sl in SVm){if(SVm[sl].label===names[i]&&T[sl]){key=T[sl];break}}}
    if(!key)key=sy.indexOf(1)>-1?'flat_repair':sy.indexOf(2)>-1?'new_tires':sy.indexOf(3)>-1?'rotation_check':sy.indexOf(4)>-1?'roadside_assist':(names.length?'new_tires':'');
    var okKeys=(cfg&&cfg.service_types||[]).map(function(t){return t.key});
    if(key&&okKeys.length&&okKeys.indexOf(key)<0)key=okKeys[0];
    var extra=names.slice();
    if(sy.indexOf(4)>-1)extra.push('Locked out or dead battery');
    return {key:key,list:extra};
  }
  function pv(id,re){var v=($(id).value||'').trim();return re.test(v)?'':v}
  var PH=/^(Year|Make|Model|Loading|Select|Not sure|Choose)/i;
  function setErr(el,msg){if(el)el.textContent=msg||''}
  function errFor(id){return f.querySelector('.err[data-for="'+id+'"]')}
  function houseNo(a){return /[0-9]/.test(String(a||'').replace(/\b[0-9]+(?:st|nd|rd|th)\b/gi,' '))}
  /* returns {el,msg,show} for the first problem on a step, else null */
  function check(n){
    if(n===1){
      var a=($('mq-loc').value||'').trim();
      if(a.length<5||!houseNo(a))return {el:errFor('mq-loc'),msg:'Enter the street address with the house number.',focus:$('mq-loc')};
      if(!/^[0-9]{5}$/.test(zip.value))return {el:errFor('mq-zip'),msg:'Enter a 5-digit ZIP code.',focus:zip};
      if(zipState===false)return {el:errFor('mq-zip'),msg:'That ZIP is outside our service area. Call '+PHONE+'.',focus:zip};
      if(zipState===null)return {el:errFor('mq-zip'),msg:'One second, checking your ZIP. Tap again.',focus:zip};
    }
    if(n===2){if(!pv('mq-vmake',PH)||!pv('mq-vmodel',PH))return {el:$('mq-s2err'),msg:'Choose your vehicle make and model so we bring the right tires.',focus:$('mq-vmake')}}
    if(n===3){if(!services().key)return {el:$('mq-s1err'),msg:'Pick what you need so we send the right service.',focus:$('mq-pick')}}
    if(n===4){
      if(!pressedDay()||!timesEl.querySelector('button[aria-pressed="true"][data-win]'))return {el:$('mq-slot-err'),msg:'Please pick a day and a time window.',focus:null};
    }
    if(n===5){
      var ph=($('mq-phone').value||'').replace(/\D/g,'');if(ph.length===11&&ph[0]==='1')ph=ph.slice(1);
      if(($('mq-first').value||'').trim().length<1)return {el:errFor('mq-first'),msg:'Please enter your name.',focus:$('mq-first')};
      if(($('mq-last').value||'').trim().length<1)return {el:errFor('mq-last'),msg:'Please enter your name.',focus:$('mq-last')};
      if(!/^[2-9][0-9]{9}$/.test(ph))return {el:errFor('mq-phone'),msg:'Enter a 10-digit US phone number.',focus:$('mq-phone')};
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(($('mq-email').value||'').trim()))return {el:errFor('mq-email'),msg:'Enter an email like name@example.com',focus:$('mq-email')};
      if(!$('mq-consent').checked)return {el:$('mq-consent-err'),msg:'Please tick the box so we may contact you about this request.',focus:$('mq-consent')};
      if($('mq-mkt').checked&&!$('mq-sms').checked)return {el:$('mq-mkt-err'),msg:'To get promotional texts, please also tick the service text message box above. Or untick this box to continue without texts.',focus:$('mq-mkt')};
    }
    return null;
  }
  function curStep(){var s=f.querySelector('.mq-step:not([hidden])');return s?+s.dataset.step:1}
  function showErr(p){setErr(p.el,p.msg);try{(p.focus||p.el).scrollIntoView({block:'center',behavior:'smooth'});if(p.focus&&p.focus.focus)p.focus.focus({preventScroll:true})}catch(e){}}
  function clearErrs(){['mq-s1err','mq-s2err','mq-slot-err','mq-consent-err','mq-mkt-err','mq-live-err'].forEach(function(i){setErr($(i),'')})}
  ['mq-pick','mq-sy1','mq-sy2','mq-sy3','mq-sy4'].forEach(function(i){var e=$(i);if(e)e.addEventListener('change',function(){setErr($('mq-s1err'),'')})});
  $('mq-consent').addEventListener('change',function(){setErr($('mq-consent-err'),'')});
  $('mq-mkt').addEventListener('change',function(){setErr($('mq-mkt-err'),'')});
  daysEl.addEventListener('click',function(){setErr($('mq-slot-err'),'')});
  timesEl.addEventListener('click',function(){setErr($('mq-slot-err'),'')});
  next.addEventListener('click',function(e){
    if(!live)return;
    var p=check(curStep());
    if(p){e.preventDefault();e.stopImmediatePropagation();showErr(p)}else{clearErrs()}
  },true);

  /* send */
  function stepOfField(fld){
    return {service_type:3,vehicle_year:2,vehicle_make:2,vehicle_model:2,tire_size:2,address:1,zip:1,pref_date:4,pref_window:4,name:5,phone:5,email:5,consent:5}[fld]||5;
  }
  function goStep(k){var li=document.querySelector('#mq-prog li[data-s="'+k+'"]');if(li&&k<curStep())li.click()}
  function fail(msg,k){
    var el={1:errFor('mq-zip'),2:$('mq-s2err'),3:$('mq-s1err'),4:$('mq-slot-err'),5:$('mq-live-err')}[k]||$('mq-live-err');
    goStep(k);setErr(el,msg);try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}
  }
  f.addEventListener('submit',function(e){
    if(!live||done)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(busy)return;
    clearErrs();
    for(var n=1;n<=5;n++){var p=check(n);if(p){if(n<curStep())goStep(n);showErr(p);return}}
    var sv=services(),d=pressedDay(),w=timesEl.querySelector('button[aria-pressed="true"][data-win]');
    var y=($('mq-vyear').value||'').trim(),size=($('mq-size').value||'').trim(),trim=pv('mq-vtrim',/^Not sure/i);
    var notes=[($('mq-details').value||'').trim()];
    if(sv.list.length)notes.push('Services: '+sv.list.join(', '));
    if(trim)notes.push('Trim: '+trim);
    var body={
      name:($('mq-first').value.trim()+' '+$('mq-last').value.trim()).trim(),phone:$('mq-phone').value.trim(),email:$('mq-email').value.trim(),
      address:$('mq-loc').value.trim(),zip:zip.value,vehicle_year:/^(19|20)[0-9]{2}$/.test(y)?y:'',vehicle_make:pv('mq-vmake',PH),vehicle_model:pv('mq-vmodel',PH),
      tire_size:/^[A-Za-z0-9\/ .\-]{1,20}$/.test(size)?size:'',service_type:sv.key,pref_date:d.iso,pref_window:w.dataset.win,
      notes:notes.filter(Boolean).join(' | ').slice(0,500),consent:true,sms_consent:$('mq-sms').checked,sms_marketing_consent:$('mq-mkt').checked,lang:'en'
    };
    Object.keys(body).forEach(function(k){if(body[k]===''||body[k]==null)delete body[k]});
    body.website=$('mq-hp').value;
    busy=true;sub.disabled=true;var lbl=sub.textContent;sub.textContent='Sending...';
    function idle(){busy=false;sub.disabled=false;sub.textContent=lbl}
    window.ETRecaptcha.token('mobile').then(function(rt){body.recaptcha_token=rt;
    return fetch(BOOK.endpoint,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'content-type':'application/json'},body:JSON.stringify(body)})})
      .then(function(r){return r.json().catch(function(){return null}).then(function(j){return {status:r.status,j:j||{}}})})
      .then(function(res){
        idle();var j=res.j;
        if(window.ETRecaptcha.isVerifyFail(res.status,j)){fail(window.ETRecaptcha.MSG,5);return}
        if(j.ok===true){
          done=true;var md=$('mq-done');
          md.textContent=(typeof j.message==='string'&&j.message?j.message:'Request received — we will confirm by phone')+'. This was a request, not a confirmed appointment. We will contact you to confirm the day and time.';
          md.hidden=false;sub.hidden=true;$('mq-back').hidden=true;
          try{md.setAttribute('tabindex','-1');md.scrollIntoView({block:'center',behavior:'smooth'});md.focus({preventScroll:true})}catch(_){}
          return;
        }
        var c=j.code,k=stepOfField(j.field);
        if(c==='out_of_area'){zipState=false;znote.textContent='That ZIP is outside our service area. Call '+PHONE+' and we will see what we can do.';znote.className='mq-zipnote no';fail('That ZIP is outside our service area.',1)}
        else if(c==='closed'||c==='notice'||c==='date_range'){fail(typeof j.message==='string'&&j.message?j.message:'That day or time is not available. Please pick another.',4)}
        else if(c==='consent'){fail('Please tick the box so we may contact you about this request.',5)}
        else if(c==='rate_limited'){fail('We got a lot of requests just now. Please try again in a bit, or call '+PHONE+'.',5)}
        else if(c==='disabled'){fail('Online booking is paused right now. Please call '+PHONE+'.',5)}
        else if(c==='invalid'&&j.field){fail(typeof j.message==='string'&&j.message?j.message:'Please check that and try again.',k)}
        else{fail('We could not send that just now. Please try again, or call '+PHONE+'.',5)}
      })
      .catch(function(){idle();fail('We could not send that just now. Please check your connection and try again, or call '+PHONE+'.',5)});
  },true);

  /* go live only when the shop has booking switched on */
  function validCfg(c){return c&&c.enabled===true&&Array.isArray(c.service_types)&&c.service_types.length&&c.hours&&typeof c.hours==='object'}
  function boot(){
    fetch(BOOK.endpoint,{cache:'no-store',credentials:'omit',mode:'cors'}).then(function(r){return r.json()}).then(function(c){
      if(!validCfg(c))return;
      cfg=c;if(!applyCfg()){cfg=null;return}
      live=true;window.__etLive=true;f.classList.add('mq-live-on');
      var mob=$('mq-mobile');if(mob){mob.checked=true;var l=mob.closest('label');if(l)l.hidden=true}
      $('mq-consent-wrap').hidden=false;sub.textContent='Send my booking request';
      var sn=$('slot-note');if(sn)sn.textContent='Pick your preferred day and a time window. This is a request: we confirm the exact time by phone.';
      zipCheck();
    }).catch(function(){});
  }
  var idle=window.requestIdleCallback||function(fn){setTimeout(fn,600)};
  idle(boot);
})();

