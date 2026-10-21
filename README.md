# Extreme Tires website redesign

Prototype, research and tooling for the Extreme Tires (Sunrise, FL) mobile tire service + shop website.

| Folder | What's in it |
|---|---|
| `docs/` | **Start here:** `00-START-HERE-Cowork-Brief.md` (every fact, contact, decision, open item), `01-Cowork-Starter-Prompt.md`, image shot list |
| `site/` | **v6 prototype** (`index.html`, 83 pages, open in any browser) + `Start-ExtremeSite.ps1` local server (http://localhost:8080). `source/` = template, page modules, assets and `build6.py`; `tools/crawl.js` = link/overflow/error checker |
| `design/melissa-mockups/` | Melissa's header, footer, sitemap and Request-a-Quote mockups + her Additional Info PDF |
| `audit/` | Old-site super audit (4.1/10), competitor gap research, summary of Melissa's emails |
| `instagram-sync/` | Instagram → gallery auto-sync script and setup guide. The workflow file is saved as `.disabled`: move it to `.github/workflows/` only after the Instagram token secrets are set |

**Run it on your PC (Windows):** `git clone https://github.com/jja8991/extreme-tires-website` or run `Setup-ExtremeCowork.ps1` (clones/updates `Documents\Extreme-Tires-Cowork` and opens the prototype).

**Rules:** never invent prices, policies, reviews or coupon values (placeholders stay labeled). Never commit passwords, tokens or 2FA keys.
