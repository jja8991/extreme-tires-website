
/* mobile quote wizard */
(function(){
  var f=document.getElementById('mq-form'); if(!f)return;
  var steps=[].slice.call(f.querySelectorAll('.mq-step')), cur=1;
  var back=document.getElementById('mq-back'), next=document.getElementById('mq-next'), sub=document.getElementById('mq-submit');
  var prog=[].slice.call(document.querySelectorAll('#mq-prog li')), fill=document.getElementById('mq-barfill');
  var NEXT={1:'Next: Vehicle',2:'Next: Service',3:'Next: When',4:'Next: Your details'};
  var REQ={4:{'mq-when':'Please pick a day and time.'},5:{'mq-first':'Please enter your name.','mq-last':'Please enter your name.','mq-phone':'This field is required','mq-email':'This field is required'}};
  function check(n){
    var bad=null,m=Object.assign({},REQ[n]||{});
    if(n===1&&document.getElementById('mq-mobile').checked){m=(document.getElementById('mq-zip').value.trim()&&!window.__etLive)?{}:{'mq-loc':'Enter a ZIP or address so the van knows where to go.'}}
    Object.keys(m).forEach(function(id){
      var el=document.getElementById(id), err=f.querySelector('.err[data-for="'+id+'"]');
      var ok=el.value.trim()!==''&&(id!=='mq-email'||/.+@.+\..+/.test(el.value));
      if(err)err.textContent=ok?'':(id==='mq-email'&&el.value.trim()?'Enter an email like name@example.com':m[id]);
      if(!ok&&!bad)bad=el;
    });
    if(bad)bad.focus();
    return !bad;
  }
  function go(n,noScroll){
    cur=n;
    steps.forEach(function(s){s.hidden=(+s.dataset.step!==n)});
    prog.forEach(function(li){var k=+li.dataset.s;li.classList.toggle('on',k===n);li.classList.toggle("ok",k<n)});
    fill.style.width=(n*20)+'%';
    back.hidden=n===1; next.hidden=n===5; sub.hidden=n!==5;
    if(NEXT[n])next.textContent=NEXT[n];
    if(!noScroll){var t=document.getElementById('mq-prog');if(t&&t.scrollIntoView)t.scrollIntoView({behavior:'smooth',block:'start'})}
  }
  next.addEventListener('click',function(){if(check(cur))go(cur+1)});
  back.addEventListener('click',function(){go(cur-1)});
  prog.forEach(function(li){li.addEventListener('click',function(){var k=+li.dataset.s;if(k<cur)go(k)})});
  f.addEventListener('keydown',function(e){if(e.key==='Enter'&&cur<5&&e.target.tagName!=='TEXTAREA'&&e.target.tagName!=='BUTTON'){e.preventDefault();next.click()}});
  /* if the existing submit validator finds a problem, jump to that step */
  f.addEventListener('submit',function(){
    setTimeout(function(){
      var e=f.querySelector('.err:not(:empty)');
      if(e){var st=e.closest('.mq-step');if(st&&+st.dataset.step!==cur)go(+st.dataset.step,true);var inp=e.parentNode.querySelector('input,select');if(inp)inp.focus()}
    },0);
  },true);

  /* keep the hidden "when" value in step with the calendar + time buttons */
  function pretty(k){var d=new Date(k+'T12:00:00');return isNaN(d)?k:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
  function syncWhen(){
    var d=document.querySelector('#days .cal-d[aria-pressed="true"]'),t=document.querySelector('#times button[aria-pressed="true"]');
    var w=document.getElementById('mq-when'),sum=document.getElementById('mq-slot-sum');
    if(d&&t){w.value=pretty(d.dataset.day)+' at '+t.dataset.time;sum.innerHTML='Your slot: <b>'+w.value+'</b>'}else{w.value='';sum.textContent=''}
  }
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#days,#times'))setTimeout(syncWhen,0)});
  syncWhen();
  go(1,true);
})();
