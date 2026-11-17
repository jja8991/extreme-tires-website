#!/usr/bin/env python3
"""Convert the v6 single-file prototype (site/index.html) into a Shopify Liquid theme layout.
Usage: convert.py <site_dir> <out_theme_dir>"""
import re, os, sys, base64, shutil, json
site, out = sys.argv[1], sys.argv[2]
t = open(os.path.join(site, 'index.html'), encoding='utf-8').read()
if os.path.exists(out): shutil.rmtree(out)
for d in ('layout','snippets','assets','templates'): os.makedirs(os.path.join(out,d))
def flat(p): return 'etm-' + p.replace('/','-')
def W(rel, s):
    with open(os.path.join(out, rel), 'w', encoding='utf-8') as f: f.write(s)

# ---- split document
s0 = t.index('<style>'); s1 = t.index('</style>')
css = t[s0+7:s1]
b0 = t.index('<body>') + 6
rest = t[b0:t.rindex('</body>')]
# html = everything before first plain <script> (after the ld+json); scripts = remaining blocks
first = re.search(r'<script>', rest).start()
html, tail = rest[:first], rest[first:]
scripts = [m.group(1) for m in re.finditer(r'<script>(.*?)</script>', tail, re.S)]
assert not re.sub(r'<script>.*?</script>', '', tail, flags=re.S).strip(), 'unexpected non-script tail'
assert '{{' not in t and '{%' not in t

# ---- extract inline base64 images into asset files
n = [0]
def b64(m):
    n[0] += 1; ext = 'jpg' if m.group(1) == 'jpeg' else m.group(1)
    name = f'etm-embedded-{n[0]}.{ext}'
    open(os.path.join(out,'assets',name),'wb').write(base64.b64decode(m.group(2)))
    return '{{ etm }}' + name
html = re.sub(r'data:image/(jpeg|png);base64,([A-Za-z0-9+/=]{100,})', b64, html)

# ---- media path rewrite
def html_media(m): return '{{ etm }}' + flat(m.group(1))
html = re.sub(r'media/([A-Za-z0-9_./-]*[A-Za-z0-9_])(?=["\'\s)])', html_media, html)
def js_media(m): return "ETM+'" + flat(m.group(2)) + "'"
def fix_js(s):
    s = re.sub(r'=\\?"media/([^"\\]*)\\?"', lambda m: '="\'+ETM+\'' + flat(m.group(1)) + '"', s)
    s = re.sub(r"(['\"])media/([^'\"]*)\1", js_media, s)
    s = s.replace("'dark/'", "'dark-'")
    for d in ('services/dark/','services/','brands/','rebates/','reviews/'):
        s = s.replace('media/'+d, "'+ETM+'" + flat(d))
    return s
scripts = [fix_js(s) for s in scripts]
# review-photo manifest (gallery.json) stores 'media/reviews/x.webp'; map to flat theme asset names at runtime
old1="rows.forEach(function(r,n){if(typeof r.file!=='string'||r.file.indexOf(ETM+'etm-reviews-')!==0)return;"
new1="rows.forEach(function(r,n){if(typeof r.file!=='string'||r.file.indexOf('media/reviews/')!==0)return;r.file=ETM+'etm-reviews-'+r.file.slice(14);"
assert any(old1 in x for x in scripts), 'review manifest patch not found'
scripts=[x.replace(old1,new1) for x in scripts]
for s in scripts + [html]:
    left = [x for x in re.findall(r'.{30}media/.{30}', s)]
    if left: print('LEFTOVER media refs:', left[:5])

# ---- write body snippets (<=200KB each, split on newlines)
HDR = "{%- assign etm = 'etm-pixel.gif' | asset_url | split: 'etm-pixel.gif' | first -%}\n"
chunks, cur, size = [], [], 0
for line in html.split('\n'):
    if size + len(line) > 190000: chunks.append('\n'.join(cur)); cur, size = [], 0
    cur.append(line); size += len(line) + 1
chunks.append('\n'.join(cur))
for i, c in enumerate(chunks, 1): W(f'snippets/et-v6-body-{i}.liquid', HDR + c)
# 1x1 gif so the asset base can be derived
open(os.path.join(out,'assets','etm-pixel.gif'),'wb').write(base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))

# ---- css + js assets
W('assets/et-v6.css', css)
for i, s in enumerate(scripts, 1): W(f'assets/et-v6-{i}.js', s)

# ---- layout
head = t[:s0]
title = re.search(r'<title>(.*?)</title>', head, re.S).group(1)
desc = re.search(r'<meta name="description" content="(.*?)">', head, re.S).group(1)
layout = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0d0d0e">
<title>%s</title>
<meta name="description" content="%s">
<link rel="canonical" href="{{ canonical_url }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap">
{{ 'et-v6.css' | asset_url | stylesheet_tag }}
{%%- assign etm = 'etm-pixel.gif' | asset_url | split: 'etm-pixel.gif' | first -%%}
<script>window.ETM = "{{ etm }}";</script>
{{ content_for_header }}
</head>
<body>
""" % (title, desc)
for i in range(1, len(chunks)+1): layout += "{%% render 'et-v6-body-%d' %%}\n" % i
layout += "{{ content_for_layout }}\n"
for i in range(1, len(scripts)+1): layout += "<script src=\"{{ 'et-v6-%d.js' | asset_url }}\"></script>\n" % i
layout += "</body>\n</html>\n"
W('layout/et-v6.liquid', layout)
W('templates/index.json', json.dumps({"layout":"et-v6","sections":{},"order":[]}, indent=2))

# ---- media assets (flat names)
count = 0
for root, _, files in os.walk(os.path.join(site, 'media')):
    for f in files:
        src = os.path.join(root, f); rel = os.path.relpath(src, site)
        shutil.copy(src, os.path.join(out, 'assets', flat(rel[len('media/'):]))); count += 1
print('chunks', len(chunks), 'scripts', len(scripts), 'media files', count, 'css KB', len(css)//1024)
for f in sorted(os.listdir(os.path.join(out,'snippets')))+['layout/et-v6.liquid']:
    p = os.path.join(out, f if f.startswith('layout') else 'snippets/'+f); print(f, os.path.getsize(p)//1024, 'KB')
