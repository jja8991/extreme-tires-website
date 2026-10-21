#!/usr/bin/env python3
"""Assemble the Extreme Tires prototype from template.html + parts/<id>.{html,css,js}.
Usage: python3 build6.py [--out FILE] [--parts a,b,c,d]
Missing parts are skipped. Each part's JS is wrapped so one failing module cannot break the rest."""
import base64, io, os, sys, argparse
from PIL import Image
ap=argparse.ArgumentParser(); ap.add_argument('--out',default='extreme-tires-prototype.html'); ap.add_argument('--parts',default='a,b,c,d')
ap.add_argument('--document',action='store_true',help='wrap in a full HTML document (doctype, charset, mobile viewport). REQUIRED for anything served as a website; omit only for Claude artifacts, which add their own skeleton')
args=ap.parse_args()
args.out=os.path.abspath(args.out)  # resolve before chdir below
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def uri(path,fmt,maxw=None,q=80):
    im=Image.open(path).convert('RGB')
    if maxw and im.width>maxw: im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,fmt,quality=q) if fmt=='JPEG' else im.save(b,fmt,optimize=True)
    return f"data:image/{'jpeg' if fmt=='JPEG' else 'png'};base64,"+base64.b64encode(b.getvalue()).decode()
def rd(p): return open(p,encoding='utf-8').read() if os.path.exists(p) else ''
t=rd('template.html')
css=html=js=''
for p in [x for x in args.parts.split(',') if x]:
    css+=f'\n/* ===== part {p} ===== */\n'+rd(f'parts/{p}.css')
    html+=f'\n<!-- ===== part {p} ===== -->\n'+rd(f'parts/{p}.html')
    j=rd(f'parts/{p}.js')
    if j.strip(): js+=f"\n<script>try{{(function(){{\n{j}\n}})();}}catch(e){{console.error('part {p} failed',e)}}</script>"
tail='''
<script>
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
    s.innerHTML='<div class="wrap"><div><h2>Ready when you are</h2><p>Book in 60 seconds, or call and talk to a real person. Mon\u2013Fri 8\u20136:30 \u00b7 Sat 8\u20134.</p></div><div class="cta-actions"><a class="btn btn-red" href="#start" data-go="home">Book in 60 seconds</a><a class="btn btn-ghost" href="#quote" data-view-link="quote">Request a quote</a><a class="btn btn-ghost" href="tel:+19547731896">Call (954) 773-1896</a></div></div>';
    el.appendChild(s);
  });
  ET.start();
})();
</script>'''
t=t.replace('/*PARTS_CSS*/',css).replace('<!--PARTS_HTML-->',html).replace('<!--PARTS_JS-->',js+tail)
t=t.replace('{{LOGO}}',uri('assets/logo.png','PNG')).replace('{{STORE}}',uri('assets/store.jpg','JPEG',1400,78)).replace('{{BRANDS}}',uri('assets/brands.png','JPEG',1600,85))
assert '{{' not in t
if args.document:
    i=t.index('</style>')+len('</style>')
    head=('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
          '<meta name="theme-color" content="#0d0d0e">\n')
    t=head+t[:i]+'\n</head>\n<body>\n'+t[i:]+'\n</body>\n</html>\n'
open(args.out,'w',encoding='utf-8').write(t); print(args.out, len(t)//1024,'KB', '(full document)' if args.document else '(fragment)')
