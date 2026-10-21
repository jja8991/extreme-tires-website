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
  ET.subscribe({phone:$('cp-club-phone').value.trim(),email:$('cp-club-email').value.trim(),smsOk:$('cp-club-sms').checked,emailOk:$('cp-club-em').checked,hp:$('cp-club-hp').value,
    source:'coupons-club',msg:$('cp-club-msg'),btn:this.querySelector('button'),focus:{phone:$('cp-club-phone'),email:$('cp-club-email'),sms:$('cp-club-sms'),em:$('cp-club-em')}});
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
