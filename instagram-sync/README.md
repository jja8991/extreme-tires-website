# Instagram → Website Gallery (Extreme Tires)

New posts on **@extremetires** show up in the website gallery automatically, every 6 hours.

```
Instagram post ─► sync-instagram.mjs (every 6h) ─► downloads photo to /public/gallery/
                                                  ─► updates gallery.json (tags from hashtags)
                                                  ─► website gallery reads gallery.json
```

## Files
| File | What it does |
|---|---|
| `sync-instagram.mjs` | Pulls posts, downloads photos, tags them, writes `gallery.json`, removes posts deleted on Instagram, refreshes the token |
| `.github/workflows/instagram-sync.yml` | Runs the sync every 6 hours (plus a manual "Run workflow" button) and commits new photos |

Put `sync-instagram.mjs` in the site repo at `scripts/`, and the workflow at `.github/workflows/`.

## One-time setup (about 30 min, needs Melissa's Instagram login)
1. **Make the Instagram a professional account.** In the Instagram app: Settings → Account type and tools → Switch to professional (Business). It's free.
2. **Create a Meta app.** At developers.facebook.com → My Apps → Create app → choose **"Instagram API with Instagram login."**
3. **Add Extreme's Instagram as a tester** under App roles, then accept the invite in the Instagram app.
4. **Generate an access token** in the app dashboard (Instagram → API setup → Generate token). Choose the long-lived one, which lasts 60 days.
5. **Add the repo secrets** (GitHub repo → Settings → Secrets → Actions):
   - `IG_TOKEN` = the token from step 4
   - `GH_PAT` = a fine-grained GitHub token with **Secrets: write** on this repo. The workflow uses it to save the refreshed Instagram token, so the token never expires as long as the sync keeps running.
6. **Run it once:** GitHub → Actions → "Instagram gallery sync" → Run workflow.

## Test it safely first
```bash
IG_TOKEN=xxxx node scripts/sync-instagram.mjs --dry-run   # lists what it would add, writes nothing
```

## Posting rules for the team
- Hashtags sort the gallery. `#jeep #wrangler #gladiator #bronco` → **Jeep**, `#truck #f150 #tacoma…` → **Trucks**, `#lifted #leveling` → **Lifts**, `#wheels #rims` → **Wheels**, `#mobiletires` → **Mobile**.
- Add **`#nogallery`** to any post that should stay off the website.
- Delete a post on Instagram and it disappears from the site on the next sync.
- Only Extreme's **own** posts are pulled. If you repost a customer's photo, get their OK first.

## Logs and troubleshooting
- Each run writes `logs/instagram-sync-YYYY-MM-DD.log`, kept as a downloadable artifact for 14 days on each workflow run.
- "Instagram token expired or invalid" → generate a new token (step 4) and update `IG_TOKEN`.
- No new photos → check that the account is still a professional account and the app is still connected.

## If the new site ends up on Shopify instead
Use a Shopify Instagram feed app (Instafeed, for example) instead of this script. It's no-code, with the same result, and costs a few dollars a month.
