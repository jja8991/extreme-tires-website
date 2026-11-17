
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
  // Scroll-reveal: sections and card grids glide in as they enter the screen (safe fallback: everything visible without IO)
  (function(){
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    function arm(root){
      root.querySelectorAll('section > .wrap, .mobile-banner, .photo-quote .wrap, .flow-top, #wiz, .how-img .wrap').forEach(function(el){
        if(el.classList.contains('rv')||el.closest('.hero'))return;
        el.classList.add('rv');
        el.querySelectorAll(':scope > .opts > *, :scope > .rev-slots > *, :scope > .grid > *, :scope > .tiles > *, :scope > .ig-grid > *').forEach(function(c,i){c.classList.add('rv');c.style.setProperty('--d',(i%6)*.07+'s');io.observe(c)});
        io.observe(el);
      });
    }
    arm(document);
    // views are shown/hidden by the router; arm any that appear later
    new MutationObserver(function(){arm(document)}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
    setTimeout(function(){document.querySelectorAll('.rv:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in')})},1200);
  })();
  ET.start();
})();
