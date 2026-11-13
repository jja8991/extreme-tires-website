// Vercel Cron: daily check of the Google listing for new customer photos -> adds them to the site gallery.
// Flow: Google Places API (New) -> new photos only (deduped) -> ONE git commit via GitHub API -> Vercel redeploys.
// Env vars (Vercel > Settings > Environment Variables):
//   GOOGLE_PLACES_API_KEY  Places API (New) key        GITHUB_TOKEN  fine-grained token, Contents: read+write on the repo
//   CRON_SECRET            any long random string (Vercel sends it as a Bearer token on cron calls)
//   GOOGLE_PLACE_ID        optional; looked up automatically if missing
const crypto = require('crypto');
const REPO = 'jja8991/extreme-tires-website', BRANCH = 'main';
const MANIFEST = 'site/media/reviews/gallery.json', SKIP = 'review-sync/skip.json';
const MAX_NEW = 6; // per run, so a surprise batch never floods the gallery
const log = (...a) => console.log(new Date().toISOString(), ...a);

async function gh(path, opt = {}) {
  const r = await fetch('https://api.github.com/repos/' + REPO + path, {
    ...opt, headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'et-review-sync' },
    body: opt.body ? JSON.stringify(opt.body) : undefined });
  if (!r.ok) throw new Error('GitHub ' + path + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}
async function readJson(path, fallback) {
  try { const f = await gh('/contents/' + path + '?ref=' + BRANCH); return JSON.parse(Buffer.from(f.content, 'base64').toString('utf8')); }
  catch (e) { if (/ 404 /.test(e.message)) return fallback; throw e; }
}
const gKey = () => process.env.GOOGLE_PLACES_API_KEY;
async function placeId() {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': gKey(), 'X-Goog-FieldMask': 'places.id,places.displayName' },
    body: JSON.stringify({ textQuery: 'Extreme Mobile Tires 7712 W Oakland Park Blvd Sunrise FL 33351' }) });
  const j = await r.json(); if (!j.places || !j.places[0]) throw new Error('place not found: ' + JSON.stringify(j).slice(0, 200));
  return j.places[0].id;
}
const shortName = n => { const p = (n || '').trim().split(/\s+/); return p.length > 1 && !/^(llc|inc|co)$/i.test(p[p.length - 1]) && p.length < 4 ? p[0] + ' ' + p[p.length - 1][0].toUpperCase() + '.' : (n || 'A customer'); };

module.exports = async (req, res) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== 'Bearer ' + process.env.CRON_SECRET) return res.status(401).json({ error: 'unauthorized' });
  for (const k of ['GOOGLE_PLACES_API_KEY', 'GITHUB_TOKEN']) if (!process.env[k]) return res.status(500).json({ error: 'missing env ' + k });
  try {
    const id = await placeId();
    const pr = await fetch('https://places.googleapis.com/v1/places/' + id + '?fields=displayName,photos', { headers: { 'X-Goog-Api-Key': gKey() } });
    if (!pr.ok) throw new Error('Places ' + pr.status + ' ' + (await pr.text()).slice(0, 200));
    const place = await pr.json(), photos = place.photos || [];
    const man = await readJson(MANIFEST, { items: [] }), skip = new Set(await readJson(SKIP, []));
    const have = new Set(man.items.map(i => i.token));
    const fresh = photos.map(p => ({ p, token: 'places:' + crypto.createHash('sha1').update(p.name).digest('hex').slice(0, 16) }))
      .filter(x => !have.has(x.token) && !skip.has(x.token)).slice(0, MAX_NEW);
    log('places photos', photos.length, 'new', fresh.length);
    if (!fresh.length) return res.status(200).json({ added: 0, seen: photos.length });

    const blobs = [], items = [];
    for (const { p, token } of fresh) {
      const m = await fetch('https://places.googleapis.com/v1/' + p.name + '/media?maxWidthPx=1200&skipHttpRedirect=true', { headers: { 'X-Goog-Api-Key': gKey() } });
      const uri = (await m.json()).photoUri; if (!uri) continue;
      const img = Buffer.from(await (await fetch(uri)).arrayBuffer()); if (img.length < 20000) continue;
      const by = (p.authorAttributions && p.authorAttributions[0] && p.authorAttributions[0].displayName) || '';
      const owner = /extreme/i.test(by), file = 'media/reviews/' + token.replace(':', '-') + '.jpg', who = owner ? '' : shortName(by);
      blobs.push({ path: 'site/' + file, buf: img });
      items.push({ id: token.replace(':', '-'), token, file, caption: owner ? 'From the shop · on Google' : 'Customer photo · ' + who + ' on Google', credit: owner ? 'Extreme Tires' : who, added: new Date().toISOString().slice(0, 10) });
    }
    if (!items.length) return res.status(200).json({ added: 0, seen: photos.length });
    man.items = items.concat(man.items); man.updated = new Date().toISOString().slice(0, 10);

    const ref = await gh('/git/ref/heads/' + BRANCH), base = await gh('/git/commits/' + ref.object.sha);
    const tree = [];
    for (const b of blobs) { const bl = await gh('/git/blobs', { method: 'POST', body: { content: b.buf.toString('base64'), encoding: 'base64' } }); tree.push({ path: b.path, mode: '100644', type: 'blob', sha: bl.sha }); }
    const mb = await gh('/git/blobs', { method: 'POST', body: { content: JSON.stringify(man, null, 1), encoding: 'utf-8' } });
    tree.push({ path: MANIFEST, mode: '100644', type: 'blob', sha: mb.sha });
    const t = await gh('/git/trees', { method: 'POST', body: { base_tree: base.tree.sha, tree } });
    const c = await gh('/git/commits', { method: 'POST', body: { message: 'Gallery: add ' + items.length + ' new customer photo(s) from Google (auto)', tree: t.sha, parents: [ref.object.sha] } });
    await gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: c.sha } });
    log('committed', c.sha, items.length);
    return res.status(200).json({ added: items.length, commit: c.sha });
  } catch (e) { log('ERROR', e.message); return res.status(500).json({ error: e.message }); }
};
