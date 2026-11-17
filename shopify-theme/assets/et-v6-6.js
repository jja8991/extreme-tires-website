try{(function(){
var $=function(id){return document.getElementById(id)};
var esc=ET.esc;
[['coupons','Coupons & Offers'],['financing','Financing'],['reviews','Reviews'],['about','About Us'],['locations','Locations'],['contact','Contact Us']].forEach(function(p){ET.pages.push({id:p[0],label:p[1]})});

/* ---------- COUPONS ---------- */
var OFFERS=[
  {id:'align',kind:'tire',label:'House offer',title:'Alignment with tire purchase',amt:'Ask us',svc:'Wheel Alignments',how:'house'},
  {id:'oil',kind:'service',label:'House offer',title:'Oil change special',amt:'Ask us',svc:'Oil Changes',how:'house'},
  {id:'rb-hankook-80',kind:'rebate',label:'Hankook rebate',title:'Hankook Season of Savings',amt:'$80',exp:'Nov 1 to Dec 12, 2026',img:'hankook-80',w:1200,h:800,fine:'Buy a set of 4 eligible Hankook Dynapro AT2 Xtreme, Dynapro HT2, Dynapro HPX or Weatherflex GT tires. Hankook sets the full terms.',alt:'Hankook Season of Savings: get $80 on a set of 4 eligible Dynapro or Weatherflex tires, November 1 to December 12, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-pirelli-100',kind:'rebate',label:'Pirelli rebate',title:'Pirelli WeatherActive rebate',amt:'$100',exp:'Nov 1 to Nov 30, 2026',img:'pirelli-100',w:681,h:351,fine:'On qualifying Pirelli Scorpion WeatherActive and Cinturato WeatherActive tires. Pirelli sets the full terms.',alt:'Pirelli $100 rebate on Scorpion WeatherActive and Cinturato WeatherActive tires, November 1 to 30, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-goodyear-100',kind:'rebate',label:'Goodyear rebate',title:'Goodyear rebate',amt:'Up to $100',exp:'Buy by Nov 30, 2026',img:'goodyear-100',w:1200,h:400,fine:'Buy a set of 4 qualifying Goodyear tires 9/1/26 to 11/30/26. Submit the form by 12/31/2026. Rebate amount varies by tire. One rebate per set of 4 bought in a single transaction, limit 4 per household. Cannot be combined with other Goodyear tire rebate offers. Paid as a Goodyear Mastercard Prepaid Card.',alt:'Goodyear: get up to $100 back by online or mail-in rebate on a set of 4 qualifying tires, September 1 to November 30, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-goodyear-200-card',kind:'rebate',label:'Goodyear rebate',title:'Goodyear rebate with the Goodyear Credit Card',amt:'Up to $200',exp:'Buy by Nov 30, 2026',img:'goodyear-200-card',w:1200,h:630,fine:'On a set of 4 select Goodyear tires when you use the Goodyear Credit Card on purchases made 9/1/2026 to 11/30/2026. Online or mail-in rebate, paid by prepaid card. Submit the form by 12/31/2026.',alt:'Goodyear: get up to $200 back on a set of 4 select tires with the Goodyear Credit Card, September 1 to November 30, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-cooper-70',kind:'rebate',label:'Cooper rebate',title:'Cooper rebate',amt:'Up to $70',exp:'Buy by Nov 30, 2026',img:'cooper-70',w:1200,h:400,fine:'Buy a set of 4 qualifying Cooper tires 9/1/26 to 11/30/26. Submit the rebate by 12/31/26. Rebate amount varies by tire. One rebate per set of 4 bought in a single transaction, limit 4 per household. Cannot be combined with other Cooper tire rebate offers. Paid as a Cooper Mastercard Prepaid Card.',alt:'Cooper Tires: get $70 back by online or mail-in rebate on a set of 4 qualifying tires, September 1 to November 30, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-cooper-140-card',kind:'rebate',label:'Cooper rebate',title:'Cooper rebate with the Goodyear Credit Card',amt:'Up to $140',exp:'Buy by Nov 30, 2026',img:'cooper-140-card',w:1200,h:630,fine:'On a set of 4 select Cooper tires when you use the Goodyear Credit Card on purchases made 9/1/2026 to 11/30/2026. Online or mail-in rebate, paid by prepaid card. Base rebates do not require the card. Submit the form by 12/31/2026.',alt:'Cooper Tires: get up to $140 back on a set of 4 select tires with the Goodyear Credit Card, September 1 to November 30, 2026',svc:'Tire Installation',how:'rebate'},
  {id:'rb-continental-110',kind:'rebate',label:'Continental rebate',title:'Continental rebate',amt:'$110',exp:'November offer, ask us for the end date',img:'continental-110',w:1200,h:800,fine:'When you purchase a set of 4 qualifying Continental tires. Continental sets the full terms, ask us for the details.',alt:'Continental $110 rebate when you purchase a set of 4 qualifying tires',svc:'Tire Installation',how:'rebate'},
  {id:'rb-continental-200-card',kind:'rebate',label:'Continental rebate',title:'Continental rebate with the Continental credit card',amt:'Up to $200',exp:'November offer, ask us for the end date',img:'continental-200-card',w:1200,h:800,fine:'When you purchase a set of 4 qualifying Continental tires with the Continental Synchrony Car Care credit card. Continental sets the full terms, ask us for the details.',alt:'Continental: get up to a $200 rebate on a set of 4 qualifying tires with the Continental Synchrony Car Care credit card',svc:'Tire Installation',how:'rebate'}
];
OFFERS.sort(function(x,y){return (x.img?0:1)-(y.img?0:1)});
var CP_TABS=[['all','All offers'],['tire','Tire specials'],['service','Service specials'],['rebate','Manufacturer rebates']];
var cpFilter='all';
function cpRender(){
  var rows=OFFERS.filter(function(o){return cpFilter==='all'||o.kind===cpFilter});
  $('cp-grid').innerHTML=rows.map(function(o){
    var redeem=o.how==='house'
      ?'Mention this offer when you book, or show it on your phone at the counter.'
      :'Rebate rules come from the manufacturer. Tell us when you book and we will point you to the current form.';
    if(o.img){
      var src=ETM+'etm-rebates-'+o.img+'.webp';
      return '<article class="cp-card cp-real" data-id="'+o.id+'">'+
        '<a class="cp-ban" href="'+src+'" target="_blank" rel="noopener" aria-label="Open the full '+esc(o.title)+' banner"><img src="'+src+'" width="'+o.w+'" height="'+o.h+'" alt="'+esc(o.alt)+'" loading="lazy" decoding="async"></a>'+
        '<div class="cp-kind">'+esc(o.label)+'</div><h3>'+esc(o.title)+'</h3><div class="cp-amt">'+esc(o.amt)+'</div>'+
        '<div class="cp-exp">'+esc(o.exp)+'</div>'+
        '<p class="cp-fine">'+esc(o.fine)+'</p>'+
        '<p class="cp-redeem"><b>How to redeem</b>'+esc(redeem)+'</p>'+
        '<a class="btn btn-red cp-claim" href="#quote" data-view-link="quote" data-svc="'+esc(o.svc)+'">Book with this rebate</a></article>';
    }
    return '<article class="cp-card" data-id="'+o.id+'"><span class="sample">Sample</span>'+
      '<div class="cp-kind">'+esc(o.label)+'</div><h3>'+esc(o.title)+'</h3><div class="cp-amt">'+esc(o.amt)+'</div>'+
      '<div class="cp-exp">Expires MM/DD</div>'+
      '<p class="cp-fine">Fine print placeholder: eligible vehicles, sizes and exclusions. Simon to confirm.</p>'+
      '<p class="cp-redeem"><b>How to redeem</b>'+esc(redeem)+'</p>'+
      '<button type="button" class="btn btn-red cp-claim" aria-expanded="false" aria-controls="cp-code-'+o.id+'">Claim</button>'+
      '<div class="cp-code" id="cp-code-'+o.id+'" hidden><small>Sample code, not valid</small><code>SAMPLE-0000</code>'+
      '<a href="#quote" data-view-link="quote" data-svc="'+esc(o.svc)+'">Use at booking</a></div></article>';
  }).join('');
  $('cp-count').textContent='Showing '+rows.length+' of '+OFFERS.length+' offers.';
}
$('cp-tabs').innerHTML=CP_TABS.map(function(t){return '<button type="button" data-f="'+t[0]+'" aria-pressed="'+(t[0]==='all')+'">'+t[1]+'</button>'}).join('');
$('cp-tabs').addEventListener('click',function(e){
  var b=e.target.closest('button'); if(!b)return;
  cpFilter=b.dataset.f;
  this.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',String(o===b))});
  cpRender();
});
$('cp-grid').addEventListener('click',function(e){
  var b=e.target.closest('button.cp-claim'); if(!b)return;
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
  else{ETZipOutside(out,'That ZIP is outside our regular route, but ask us, we may still be able to help.');out.classList.add('no')}
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