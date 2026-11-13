#!/usr/bin/env python3
"""
Adds new Google-review photos to the website gallery.

Input : a JSON file produced by harvest.js (list of {token, name}) -- see README.md
Does  : skips photos already in site/media/reviews/gallery.json (dedupe by token),
        downloads new ones, strips metadata, converts to WebP, appends to the manifest.
Output: site/media/reviews/*.webp + updated gallery.json  (the site reads gallery.json at load)

Usage : python3 -I review-sync/sync_review_photos.py harvest.json [--dry-run]
Log   : review-sync/sync-log.txt (timestamped)
"""
import json, sys, os, io, time, hashlib, urllib.request, datetime
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, 'site', 'media', 'reviews')
MANIFEST = os.path.join(MEDIA, 'gallery.json')
LOG = os.path.join(ROOT, 'review-sync', 'sync-log.txt')
GLINK = 'https://www.google.com/maps/place/Extreme+Mobile+Tires/@26.1658848,-80.2520611,17z'
SKIP = os.path.join(ROOT, 'review-sync', 'skip.json')   # tokens a human rejected; never re-added

def log(msg):
    line = '%s  %s' % (datetime.datetime.now().isoformat(timespec='seconds'), msg)
    print(line)
    with open(LOG, 'a', encoding='utf-8') as f: f.write(line + '\n')

def short_name(n):
    p = (n or '').strip().split()
    if len(p) >= 2 and not any(w.lower() in ('llc', 'inc', 'co') for w in p):
        return '%s %s.' % (p[0].title(), p[-1][0].upper())
    return (n or 'A customer').strip().title()

def fetch(token):
    url = 'https://lh3.googleusercontent.com/grass-cs/%s=w1400' % token
    last = None
    for _ in range(3):
        try:
            with urllib.request.urlopen(url, timeout=40) as r: return r.read()
        except Exception as e:
            last = e; time.sleep(2)
    raise last

def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    dry = '--dry-run' in sys.argv
    harvest = json.load(open(sys.argv[1], encoding='utf-8'))
    os.makedirs(MEDIA, exist_ok=True)
    man = json.load(open(MANIFEST, encoding='utf-8')) if os.path.exists(MANIFEST) else {'items': []}
    have = {i.get('token') for i in man['items'] if i.get('token')}
    skip = set(json.load(open(SKIP))) if os.path.exists(SKIP) else set()
    new = [h for h in harvest if h['token'] not in have and h['token'] not in skip]
    log('harvest=%d  already in gallery=%d  new=%d%s' % (len(harvest), len(harvest) - len(new), len(new), '  (dry run)' if dry else ''))
    added = 0
    for h in new:
        if dry: continue
        try:
            im = ImageOps.exif_transpose(Image.open(io.BytesIO(fetch(h['token'])))).convert('RGB')  # drops EXIF/GPS
            if min(im.size) < 400: log('skip tiny image ' + h['token'][:12]); continue
            im.thumbnail((1200, 1200))
            name = 'g-' + hashlib.sha1(h['token'].encode()).hexdigest()[:10] + '.webp'
            im.save(os.path.join(MEDIA, name), 'WEBP', quality=80, method=6)
            who = short_name(h.get('name'))
            man['items'].insert(0, {'id': name[:-5], 'token': h['token'], 'file': 'media/reviews/' + name,
                                    'caption': 'Customer photo · %s on Google' % who, 'credit': who,
                                    'added': datetime.date.today().isoformat()})
            added += 1
        except Exception as e:
            log('FAILED %s: %s' % (h['token'][:12], e))
    if added:
        man['updated'] = datetime.date.today().isoformat(); man['link'] = GLINK
        json.dump(man, open(MANIFEST, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    log('added %d photo(s); gallery now has %d customer photos' % (added, len(man['items'])))
    print('ADDED=%d' % added)

if __name__ == '__main__': main()
