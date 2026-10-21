#!/usr/bin/env node
/**
 * Extreme Tires — Instagram → Website Gallery sync
 *
 * Pulls Extreme's own posts from the Instagram API (Instagram Login, professional account),
 * downloads each photo to the website's storage (Instagram's media URLs expire),
 * tags it by hashtag (#jeep, #lifted, #wheels ...) and writes gallery.json for the site.
 *
 * Usage:
 *   IG_TOKEN=xxxx node sync-instagram.mjs            # real run
 *   IG_TOKEN=xxxx node sync-instagram.mjs --dry-run  # show what would change, write nothing
 *   IG_MOCK=./mock node sync-instagram.mjs           # offline test with saved API pages
 *
 * Env:
 *   IG_TOKEN     long-lived Instagram user access token (required unless IG_MOCK)
 *   OUT_DIR      where images + gallery.json go (default ./public/gallery)
 *   LOG_DIR      log folder (default ./logs)
 *   MAX_ITEMS    newest N items kept in the gallery (default 200)
 *   IG_MOCK      folder with page-1.json, page-2.json ... for offline testing
 *
 * Posting rules for Extreme's team:
 *   - Add #nogallery to a caption to keep that post off the website.
 *   - Hashtags drive the gallery filters (see TAGS below).
 *   - Only Extreme's own posts are pulled. Reposted customer photos still need the customer's OK.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const API = 'https://graph.instagram.com/v21.0';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}';
const DRY = process.argv.includes('--dry-run');
const OUT_DIR = process.env.OUT_DIR || './public/gallery';
const LOG_DIR = process.env.LOG_DIR || './logs';
const MAX_ITEMS = Number(process.env.MAX_ITEMS || 200);
const TOKEN = process.env.IG_TOKEN || '';
const MOCK = process.env.IG_MOCK || '';

// Hashtag → gallery filter. First match wins for the main category; all matches become tags.
const TAGS = {
  jeep: ['jeep', 'wrangler', 'gladiator', 'jeeplife', 'bronco'],
  truck: ['truck', 'f150', 'silverado', 'ram', 'tacoma', 'tundra', 'sierra', 'trucks'],
  lift: ['lifted', 'liftkit', 'leveling', 'levelingkit', 'lift'],
  wheels: ['wheels', 'rims', 'fuelwheels', 'customwheels', 'offroadwheels'],
  fleet: ['fleet', 'commercial', 'boxtruck', 'trailer', 'rv'],
  mobile: ['mobiletires', 'mobiletireservice', 'mobileservice', 'wecometoyou'],
};

// ---------- logging (timestamped, to console + daily file) ----------
const day = new Date().toISOString().slice(0, 10);
const logFile = path.join(LOG_DIR, `instagram-sync-${day}.log`);
async function log(level, msg) {
  const line = `${new Date().toISOString()} [${level}] ${msg}`;
  (level === 'ERROR' ? console.error : console.log)(line);
  try { await fs.mkdir(LOG_DIR, { recursive: true }); await fs.appendFile(logFile, line + '\n'); } catch { /* logging must never kill the sync */ }
}

// ---------- API ----------
async function getJSON(url, attempt = 1) {
  const res = await fetch(url);
  if (res.status === 429 || res.status >= 500) {
    if (attempt <= 3) {
      const wait = 2000 * 2 ** (attempt - 1);
      await log('WARN', `HTTP ${res.status}, retrying in ${wait / 1000}s (attempt ${attempt}/3)`);
      await new Promise(r => setTimeout(r, wait));
      return getJSON(url, attempt + 1);
    }
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = body.error || {};
    // 190 = expired/invalid token: the most common failure, so say exactly what to do.
    if (e.code === 190) throw new Error('Instagram token expired or invalid. Generate a new long-lived token and update the IG_TOKEN secret.');
    throw new Error(`Instagram API ${res.status}: ${e.message || 'unknown error'}`);
  }
  return body;
}

async function fetchAllMedia() {
  if (MOCK) {
    const files = (await fs.readdir(MOCK)).filter(f => /^page-\d+\.json$/.test(f)).sort();
    const pages = await Promise.all(files.map(async f => JSON.parse(await fs.readFile(path.join(MOCK, f), 'utf8'))));
    return pages.flatMap(p => p.data || []);
  }
  if (!TOKEN) throw new Error('IG_TOKEN is not set.');
  const items = [];
  let url = `${API}/me/media?fields=${encodeURIComponent(FIELDS)}&limit=50&access_token=${TOKEN}`;
  while (url && items.length < MAX_ITEMS * 2) {
    const page = await getJSON(url);
    items.push(...(page.data || []));
    url = page.paging?.next || null;
  }
  return items;
}

// Long-lived tokens last 60 days; refreshing extends them. Run at least monthly.
async function refreshToken() {
  if (MOCK || !TOKEN) return null;
  try {
    const r = await getJSON(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`);
    await log('INFO', `Token refreshed, valid ~${Math.round((r.expires_in || 0) / 86400)} more days.`);
    return r.access_token || null;
  } catch (e) {
    await log('WARN', `Token refresh skipped: ${e.message}`);
    return null;
  }
}

// ---------- helpers ----------
function hashtags(caption = '') {
  return [...caption.toLowerCase().matchAll(/#([a-z0-9_]+)/g)].map(m => m[1]);
}
function classify(tags) {
  const hits = Object.entries(TAGS).filter(([, words]) => words.some(w => tags.includes(w))).map(([k]) => k);
  return { category: hits[0] || 'shop', tags: hits };
}
function cleanCaption(caption = '') {
  // Site shows the first line without hashtags, max 140 chars.
  const first = caption.split('\n')[0].replace(/#[\w]+/g, '').replace(/\s+/g, ' ').trim();
  return first.length > 140 ? first.slice(0, 137) + '…' : first;
}
// One post can hold several photos (carousel). Each photo becomes its own gallery tile.
function expand(post) {
  const kids = post.media_type === 'CAROUSEL_ALBUM' ? (post.children?.data || []) : [post];
  return kids.map((k, i) => ({
    id: kids.length > 1 ? `${post.id}-${i + 1}` : post.id,
    isVideo: k.media_type === 'VIDEO',
    src: k.media_type === 'VIDEO' ? (k.thumbnail_url || post.thumbnail_url) : k.media_url,
  })).filter(x => x.src);
}
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`not an image (${type || 'no type'})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error('file too small, probably an error page');
  await fs.writeFile(dest, buf);
  return buf.length;
}

// ---------- main ----------
async function main() {
  await log('INFO', `Sync start${DRY ? ' (DRY RUN, nothing is written)' : ''}${MOCK ? ' (MOCK data)' : ''}`);
  const jsonPath = path.join(OUT_DIR, 'gallery.json');
  const current = (await exists(jsonPath)) ? JSON.parse(await fs.readFile(jsonPath, 'utf8')) : { items: [] };
  const known = new Map(current.items.map(i => [i.id, i]));

  const posts = await fetchAllMedia();
  await log('INFO', `Fetched ${posts.length} posts from Instagram.`);

  let added = 0, skipped = 0, failed = 0, hidden = 0;
  const next = [];
  if (!DRY) await fs.mkdir(OUT_DIR, { recursive: true });

  for (const post of posts) {
    const tags = hashtags(post.caption);
    if (tags.includes('nogallery')) { hidden++; continue; }
    const { category, tags: cats } = classify(tags);
    for (const m of expand(post)) {
      if (known.has(m.id)) { next.push(known.get(m.id)); skipped++; continue; } // duplicate detection
      const file = `ig-${m.id}.jpg`;
      const item = {
        id: m.id, file, category, tags: cats, isVideo: m.isVideo,
        caption: cleanCaption(post.caption), permalink: post.permalink, date: post.timestamp,
      };
      if (DRY) { await log('INFO', `[dry-run] would add ${file} (${category})`); next.push(item); added++; continue; }
      try {
        const bytes = await download(m.src, path.join(OUT_DIR, file));
        await log('INFO', `Added ${file} · ${category} · ${(bytes / 1024).toFixed(0)} KB`);
        next.push(item); added++;
      } catch (e) {
        failed++; await log('ERROR', `Could not save ${m.id}: ${e.message}`);
      }
    }
  }

  // Posts deleted on Instagram drop off the site too. Their image files are removed below.
  const keepIds = new Set(next.map(i => i.id));
  const removed = current.items.filter(i => !keepIds.has(i.id));

  next.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const trimmed = next.slice(0, MAX_ITEMS);
  const out = { updated: new Date().toISOString(), source: 'instagram', count: trimmed.length, items: trimmed };

  if (!DRY) {
    await fs.writeFile(jsonPath, JSON.stringify(out, null, 2));
    for (const r of removed.concat(next.slice(MAX_ITEMS))) {
      await fs.rm(path.join(OUT_DIR, r.file), { force: true });
      await log('INFO', `Removed ${r.file} (deleted on Instagram or past the ${MAX_ITEMS}-item cap)`);
    }
    const fresh = await refreshToken();
    if (fresh && process.env.GITHUB_OUTPUT) {
      // Hand the refreshed token to the workflow, which stores it back as a secret.
      console.log(`::add-mask::${fresh}`);
      await fs.appendFile(process.env.GITHUB_OUTPUT, `new_token=${fresh}\n`);
    }
  }

  await log('INFO', `Done. Added ${added}, unchanged ${skipped}, hidden #nogallery ${hidden}, removed ${removed.length}, failed ${failed}. Gallery now ${trimmed.length} items.`);
  if (failed && !added && !skipped) process.exitCode = 1;
}

main().catch(async e => { await log('ERROR', e.message); process.exitCode = 1; });
