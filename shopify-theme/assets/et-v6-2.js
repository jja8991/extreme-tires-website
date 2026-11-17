
/* ===== Google Maps Platform (browser key) =====
   One key, referrer-locked to this site's *.vercel.app domains and limited to Maps JavaScript API + Places API (New).
   Safe to ship in front-end code. A custom domain must be added to the key's HTTP referrer list or Google calls will 403
   (every feature below then falls back silently: address search uses Geoapify, ratings keep their static text). */
var GMAPS_BROWSER_KEY='AIzaSyAyXNBlL0iZoJ3US0n2eeHg0nPp7nUlSFg';
/* Optional: paste the shop's Google Place ID (starts with ChIJ) to skip the one-time lookup. Same value as GOOGLE_PLACE_ID in the Vercel env. */
var GOOGLE_PLACE_ID='ChIJl0Mnr4YH2YgRlBZK7OTtVvs';
(function(){try{
  var KEY=(typeof GMAPS_BROWSER_KEY==='string'&&GMAPS_BROWSER_KEY)||'',API='https://places.googleapis.com/v1/';
  var ss=null,ls=null;try{ss=window.sessionStorage}catch(e){}try{ls=window.localStorage}catch(e){}
  var dead=false,tok=null,warned={},MAXREQ=40,TTL=6*3600*1000;
  function warn(k,msg,e){if(warned[k])return;warned[k]=1;try{console.warn('[ET Google] '+msg,e||'')}catch(x){}}
  function sget(k){try{return ss&&ss.getItem(k)}catch(e){return null}}
  function sset(k,v){try{ss&&ss.setItem(k,v)}catch(e){}}
  function newTok(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)}
  function on(){return !!KEY&&!dead&&typeof window.fetch==='function'}

  /* ---- Address autocomplete: Places API (New) Autocomplete over fetch, prediction text only (no Place Details call) ---- */
  function suggest(q){
    q=String(q||'').trim();
    if(!on()||q.length<4)return Promise.resolve(null);
    var n=+(sget('et_gac_n')||0);
    if(n>=MAXREQ){warn('cap','autocomplete request cap reached for this session, using fallback');return Promise.resolve(null)}
    sset('et_gac_n',String(n+1));
    if(!tok)tok=newTok();
    return fetch(API+'places:autocomplete',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','X-Goog-Api-Key':KEY},
      body:JSON.stringify({input:q,sessionToken:tok,includedRegionCodes:['us'],languageCode:'en',
        locationBias:{circle:{center:{latitude:26.15,longitude:-80.28},radius:50000}}})})
    .then(function(r){
      if(!r.ok){dead=true;warn('http','autocomplete failed with HTTP '+r.status+', falling back to the free address search');return null}
      return r.json();
    }).then(function(j){
      if(!j)return null;
      var out=[];
      (j.suggestions||[]).forEach(function(s){
        var p=s&&s.placePrediction;if(!p)return;
        var sf=p.structuredFormat||{},main=(sf.mainText&&sf.mainText.text)||'',sec=(sf.secondaryText&&sf.secondaryText.text)||'',
            full=(p.text&&p.text.text)||(main+(sec?', '+sec:''));
        full=full.replace(/,\s*USA$/,'');sec=sec.replace(/,\s*USA$/,'');
        if(!main&&!full)return;
        var street=/^\d/.test(main)?main:full,z=full.match(/\bFL\s+(\d{5})\b/);
        out.push({l1:street,l2:street===main?sec:'',zip:z?z[1]:''});
      });
      return out.slice(0,5);
    }).catch(function(e){dead=true;warn('net','autocomplete request error, falling back',e);return null});
  }
  function endSession(){tok=null}

  /* ---- Live Google rating + review count: Place Details, field mask rating,userRatingCount, cached 6h per browser session ---- */
  function fmtN(n){try{return n.toLocaleString('en-US')}catch(e){return String(n)}}
  function apply(d){
    try{
      var r=+d.r,c=+d.n;if(!(r>=1&&r<=5)||!(c>=1))return;
      var card=document.getElementById('g-rv-card');
      if(card){
        var sc=card.querySelector('.rv-score'),st=card.querySelector('.rv-stars'),ct=card.querySelector('.g-count');
        if(sc)sc.innerHTML=r.toFixed(1)+'<small>/ 5</small>';
        if(st)st.style.setProperty('--r',String(r));
        if(ct)ct.textContent=fmtN(c)+' reviews';
        card.hidden=false;
        var note=document.getElementById('rv-src-note-t');if(note)note.textContent='Google figures are live from Google. Other sites from public listings, Oct 2026.';
      }
      var pf=document.getElementById('g-platform');
      if(pf)pf.innerHTML='Google <b>'+r.toFixed(1)+' &middot; '+fmtN(c)+'</b>';
    }catch(e){warn('apply','could not paint the live rating',e)}
  }
  function placeId(){
    if(GOOGLE_PLACE_ID)return Promise.resolve(GOOGLE_PLACE_ID);
    var id=null;try{id=ls&&ls.getItem('et_g_pid')}catch(e){}
    if(id)return Promise.resolve(id);
    /* one-time lookup, IDs-only field mask (no billable data), remembered in localStorage */
    return fetch(API+'places:searchText',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json','X-Goog-Api-Key':KEY,'X-Goog-FieldMask':'places.id'},
      body:JSON.stringify({textQuery:'Extreme Mobile Tires 7712 W Oakland Park Blvd Sunrise FL 33351',maxResultCount:1,
        locationBias:{circle:{center:{latitude:26.1659,longitude:-80.2521},radius:2000}}})})
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
    .then(function(j){var v=j&&j.places&&j.places[0]&&j.places[0].id;if(!v)throw new Error('place not found');try{ls&&ls.setItem('et_g_pid',v)}catch(e){}return v});
  }
  function rating(){
    if(!on())return;
    var raw=sget('et_g_rating'),c=null;try{c=raw?JSON.parse(raw):null}catch(e){}
    if(c&&Date.now()-c.t<(c.fail?30*60*1000:TTL)){if(!c.fail)apply(c);return}
    placeId().then(function(id){
      return fetch(API+'places/'+encodeURIComponent(id),{credentials:'omit',headers:{'X-Goog-Api-Key':KEY,'X-Goog-FieldMask':'rating,userRatingCount'}});
    }).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
    .then(function(j){
      var d={t:Date.now(),r:j&&j.rating,n:j&&j.userRatingCount};
      if(!(d.r>=1&&d.r<=5)||!(d.n>=1))throw new Error('no rating in response');
      sset('et_g_rating',JSON.stringify(d));apply(d);
    }).catch(function(e){sset('et_g_rating',JSON.stringify({t:Date.now(),fail:1}));warn('rating','live rating unavailable, keeping the static text',e)});
  }
  window.ETGoogle={on:on,suggest:suggest,endSession:endSession,rating:rating};
  /* single rating fetch, after the page has gone idle */
  function kick(){var f=function(){try{rating()}catch(e){warn('rating2','rating error',e)}};
    if('requestIdleCallback' in window)requestIdleCallback(f,{timeout:4000});else setTimeout(f,2500)}
  if(document.readyState==='complete')kick();else window.addEventListener('load',kick,{once:true});
}catch(e){try{console.warn('[ET Google] disabled',e)}catch(x){}}})();
