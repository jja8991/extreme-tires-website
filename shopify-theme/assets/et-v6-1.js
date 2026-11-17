
/* reCAPTCHA v3 (invisible). Public site key only; the secret lives server-side in booking-intake. Loads lazily on first form focus or at submit. Never blocks a submit: resolves '' on any failure/timeout. */
(function(){
  var KEY='6Lc0UB8uAAAAAMo91UuudTy0dtsCeW8CsBEBqMyj',loading=null;
  function load(){
    if(loading)return loading;
    loading=new Promise(function(res){
      if(window.grecaptcha&&window.grecaptcha.ready){res(true);return}
      try{
        var s=document.createElement('script');s.src='https://www.google.com/recaptcha/api.js?render='+KEY;s.async=true;
        s.onload=function(){res(true)};s.onerror=function(){res(false)};document.head.appendChild(s);
      }catch(e){res(false)}
    });
    return loading;
  }
  function token(action){
    return new Promise(function(done){
      var fin=false;function end(v){if(!fin){fin=true;clearTimeout(t);done(typeof v==='string'?v:'')}}
      var t=setTimeout(function(){end('')},3000);
      try{
        load().then(function(ok){
          if(!ok||!window.grecaptcha||!window.grecaptcha.ready){end('');return}
          window.grecaptcha.ready(function(){
            try{window.grecaptcha.execute(KEY,{action:'booking'}).then(end,function(){end('')})}catch(e){end('')}
          });
        },function(){end('')});
      }catch(e){end('')}
    });
  }
  /* A 400 from booking-intake about verification (not a field validation error) */
  function isVerifyFail(status,j){
    if(status!==400||!j||j.field)return false;
    return /recaptcha|captcha|verif/i.test([j.code,j.error,j.message].filter(function(x){return typeof x==='string'}).join(' '));
  }
  window.ETRecaptcha={token:token,load:load,isVerifyFail:isVerifyFail,
    MSG:'We couldn\u2019t verify this request. Please call or text (954) 773-1896.'};
  document.addEventListener('focusin',function(e){
    var t=e.target;if(t&&t.closest&&/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)&&t.closest('form,#wiz,#qwiz,#cwiz'))load();
  },true);
})();
