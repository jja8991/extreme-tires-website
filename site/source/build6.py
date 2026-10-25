#!/usr/bin/env python3
"""Assemble the Extreme Tires prototype from template.html + parts/<id>.{html,css,js}.
Usage: python3 build6.py [--out FILE] [--parts a,b,c,d]
Missing parts are skipped. Each part's JS is wrapped so one failing module cannot break the rest."""
import base64, io, os, sys, argparse, re
from html.parser import HTMLParser
from PIL import Image
ap=argparse.ArgumentParser(); ap.add_argument('--out',default='extreme-tires-prototype.html'); ap.add_argument('--parts',default='a,b,c,d')
ap.add_argument('--document',action='store_true',help='wrap in a full HTML document (doctype, charset, mobile viewport). REQUIRED for anything served as a website; omit only for Claude artifacts, which add their own skeleton')
ap.add_argument('--launch',action='store_true',help='add class "launch" to <html>: hides every .note-int internal note (needs --document)')
args=ap.parse_args()
args.out=os.path.abspath(args.out)  # resolve before chdir below
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def uri(path,fmt,maxw=None,q=80):
    im=Image.open(path).convert('RGB')
    if maxw and im.width>maxw: im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,fmt,quality=q) if fmt=='JPEG' else im.save(b,fmt,optimize=True)
    return f"data:image/{'jpeg' if fmt=='JPEG' else 'png'};base64,"+base64.b64encode(b.getvalue()).decode()
def brands_uri():
    # Normalise the four partner logos: greyscale ink on white, one equal height, equal spacing
    src=Image.open('assets/brands.png').convert('RGB'); W,H=src.size
    g=src.convert('L'); px=g.load()
    cols=[any(px[x,y]<235 for y in range(H)) for x in range(W)]
    spans=[];x=0
    while x<W:
        if cols[x]:
            s=x
            while x<W and (cols[x] or any(cols[min(W-1,x+k)] for k in range(1,40))): x+=1
            spans.append((s,x))
        else: x+=1
    spans=[s for s in spans if s[1]-s[0]>40][:4]
    logos=[]
    for i,(a,b) in enumerate(spans):
        crop=src.crop((a,0,b,H)); lum=crop.convert('L'); hi=175 if i==1 else 245   # Pirelli: drop the yellow block
        ink=lum.point(lambda v:int(255*max(0,min(1,(hi-v)/max(1,hi-70)))))
        bb=ink.point(lambda v:255 if v>25 else 0).getbbox() or (0,0,crop.width,crop.height)
        ink=ink.crop(bb)
        logos.append(ink)
    TH=56; items=[]
    for ink in logos:
        w=round(ink.width*TH/ink.height); items.append(ink.resize((w,TH),Image.LANCZOS).point(lambda v:min(255,int(v*2.2))))
    def paste(out,ink,x,y):
        out.paste(Image.new('RGB',ink.size,(58,58,60)),(x,y),ink)
    gap=70; total=sum(i.width for i in items)+gap*(len(items)-1)
    wide=Image.new('RGB',(total+40,TH+16),(255,255,255)); x=20
    for ink in items: paste(wide,ink,x,8); x+=ink.width+gap
    cw=max(i.width for i in items)+60; sq=Image.new('RGB',(cw*2,(TH+36)*2),(255,255,255))
    for n,ink in enumerate(items): paste(sq,ink,(n%2)*cw+(cw-ink.width)//2,(n//2)*(TH+36)+18)
    def enc(im):
        b=io.BytesIO(); im.save(b,'PNG',optimize=True); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
    global BR_SIZE,BR2,BR2_SIZE
    BR_SIZE=wide.size; BR2=enc(sq); BR2_SIZE=sq.size
    return enc(wide)
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
  var HEAD={service:'Ready to book this service?',services:'Ready to book this service?',tires:'Found your tires? Book the install.',brands:'Found your tires? Book the install.',brand:'Found your tires? Book the install.',wheels:'Found your wheels? Book the install.',mobile:'Ready for the van to come to you?',commercial:'Ready to talk fleet service?',financing:'Ready to shop now, pay later?',city:'Ready for service near you?',cities:'Ready for service near you?',locations:'Ready for service near you?'};
  document.querySelectorAll('[data-view]').forEach(function(el){
    if(skip[el.dataset.view]||el.querySelector(':scope > .cta-band'))return;
    var s=document.createElement('section');s.className='cta-band';s.setAttribute('aria-label','Book or contact us');
    s.innerHTML='<div class="wrap"><div><h2>'+(HEAD[el.dataset.view]||'Ready when you are')+'</h2><p>Book in 60 seconds, or call and talk to a real person. Mon\u2013Fri 8\u20136:30 \u00b7 Sat 8\u20134.</p></div><div class="cta-actions"><a class="btn btn-red" href="#start" data-go="home">Book in 60 seconds</a><a class="btn btn-ghost" href="#quote" data-view-link="quote">Request a quote</a><a class="btn btn-ghost" href="tel:+19547731896">Call (954) 773-1896</a></div></div>';
    el.appendChild(s);
  });
  ET.start();
})();
</script>'''
t=t.replace('/*PARTS_CSS*/',css).replace('<!--PARTS_HTML-->',html).replace('<!--PARTS_JS-->',js+tail)
t=t.replace('{{LOGO}}',uri('assets/logo.png','PNG')).replace('{{STORE}}',uri('assets/store.jpg','JPEG',1400,78)).replace('{{BRANDS}}',brands_uri()).replace('{{BRANDS2}}',BR2)
assert '{{' not in t
t=t.replace('width="2720" height="178"','width="%d" height="%d"'%BR_SIZE).replace('width="2721" height="179"','width="%d" height="%d"'%BR2_SIZE)
if args.document:
    i=t.index('</style>')+len('</style>')
    head=('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
          '<meta name="theme-color" content="#0d0d0e">\n')
    t=head+t[:i]+'\n</head>\n<body>\n'+t[i:]+'\n</body>\n</html>\n'
if args.launch:
    if args.document: t=t.replace('<html lang="en">','<html lang="en" class="launch">',1)
    else: print('WARNING: --launch needs --document (no <html> tag in a fragment)')
class Chk(HTMLParser):
    VOID={'br','img','input','hr','meta','link','source','area','base','col','embed','param','track','wbr'}
    def __init__(s):
        super().__init__(convert_charrefs=True); s.stack=[]; s.view=None; s.viewdepth=None; s.res={}; s.skip=0
    def rec(s,v): return s.res.setdefault(v,{'note-int':0,'Sample':0,'XX':0,'MM/DD':0})
    def handle_starttag(s,tag,attrs):
        if tag in s.VOID: 
            return
        a=dict(attrs); cls=(a.get('class') or '').split()
        s.stack.append((tag,'note-int' in cls))
        if tag in('script','style'): s.skip+=1
        if tag=='section' and a.get('data-view') and s.view is None: s.view=a['data-view']; s.viewdepth=len(s.stack); s.rec(s.view)
        if 'note-int' in cls and s.view: s.rec(s.view)['note-int']+=1
    def handle_endtag(s,tag):
        while s.stack and s.stack[-1][0]!=tag and tag not in s.VOID: s.stack.pop()
        if not s.stack or tag in s.VOID: return
        if s.view and tag=='section' and len(s.stack)==s.viewdepth: s.view=None
        if tag in('script','style'): s.skip-=1
        s.stack.pop()
    def handle_data(s,d):
        if not s.view or s.skip or any(n for _,n in s.stack): return
        r=s.rec(s.view)
        r['Sample']+=len(re.findall(r'\bSample\b',d,re.I)); r['XX']+=len(re.findall(r'XX',d)); r['MM/DD']+=len(re.findall(r'MM/DD',d))
try:
    c=Chk(); c.feed(t)
    print('\nLAUNCH CHECKLIST (static page markup; text rendered by JS data tables is not counted)')
    print('  %-14s %9s %8s %4s %6s'%('page','note-int','Sample','XX','MM/DD'))
    tot=[0,0,0,0]
    for v,r in c.res.items():
        print('  %-14s %9d %8d %4d %6d'%(v,r['note-int'],r['Sample'],r['XX'],r['MM/DD']))
        for i,k in enumerate(['note-int','Sample','XX','MM/DD']): tot[i]+=r[k]
    print('  %-14s %9d %8d %4d %6d'%('TOTAL',*tot))
    print('  note-int elements vanish with --launch; Sample / XX / MM/DD outside notes must be replaced with real content before launch.\n')
except Exception as e: print('launch checklist skipped:',e)
open(args.out,'w',encoding='utf-8').write(t); print(args.out, len(t)//1024,'KB', '(full document)' if args.document else '(fragment)')
