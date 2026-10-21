# Extreme Tires Website Redesign: Claude Cowork Project Brief
*Handoff from Claude Code session · Oct 20, 2026 · Owner: Justin (justinabruscati8991@gmail.com)*

> **Read this file first.** It holds every fact, decision, file and open item on the project so far.
> Rule: never invent prices, policies, reviews or claims for Extreme Tires. Anything not confirmed below is a **placeholder** until Simon or Melissa approves it.

---

## 1. Business facts (confirmed)
| Field | Value |
|---|---|
| Business | **Extreme Tires** (also "Extreme Mobile Tires"): tire shop + **mobile tire service** |
| Address | **7712 West Oakland Park Blvd, Sunrise, FL 33351** |
| Phone | **(954) 773-1896** |
| Hours | Mon–Fri 8:00 AM–6:30 PM · Sat 8:00 AM–4:00 PM · Sun closed |
| Service area | Broward, Miami-Dade, Palm Beach counties |
| In business | Copyright line 2007–2026 |
| Coordinates | 26.0928, -80.238 |
| Current site | https://www.extrememobiletires.com (Net Driven / LeadVenture, DNN CMS) |
| Second domain | www.extremetireshop.com (to redirect → extrememobiletires.com) |
| Socials | facebook.com/Extremetires · instagram.com/extremetires · youtube.com/@extremetires2010 · Threads · TikTok |
| Equipment | Hunter Engineering alignment (Hawkeye) |
| Services | Tire install, balancing (incl. mobile high-speed), tire repair/roadside, rotation, TPMS, brakes, alignment, suspension, oil change (incl. mobile), lift & leveling kits, custom wheels, fleet/commercial |
| Tire brands (site) | Michelin, BFGoodrich, Uniroyal, Cooper, Firestone, Bridgestone, Hankook, Hercules, Kumho, General, Continental, Pirelli, Nexen, Nitto, Toyo, Falken, Yokohama, Ironman, OHTSU (+ Goodyear, Mastercraft, Kelly, Dunlop logos) |
| Wheel brands | 27 incl. Mickey Thompson, Advanti, Worx |
| Financing | Kafene lease-to-own: https://application.kafene.com/applications/new |
| Staff named by customers | Simon (owner), Jason (counter), Adam, Alvaro, AV, Pete, Carlos, Jeremy, Kenneth, Shawn, Ryan |

### Reviews (public aggregators, Oct 2026)
| Source | Rating | Count |
|---|---|---|
| Birdeye (includes Google) | **4.7★** | **1,319** |
| Chamber of Commerce (Google-sourced samples) | 4.6★ | 542 |
| MapQuest | 4.4★ | 109 |
| Yelp | 4.2★ | 106 |
| Old website widget | 4.9★ | 27 (only 2 in the last 12 months) |
Google's exact count is **not yet verified** (needs Google Business Profile access).
Recurring complaints: waits longer than quoted, occasional specialty-work issues.

---

## 2. People & vendors
| Who | Contact | Role |
|---|---|---|
| **Melissa** | melissa.extremetires@gmail.com | Extreme staff, drives the redesign, wrote the design spec |
| **Simon** | Simon@extremetireshop.com · extremetire2010@gmail.com | Owner. Approves prices and policies. |
| Online Sales | onlinesales@extremetireshop.com | Extreme |
| Marketing | Marketing@extremetireshop.com · extremetiresmarketing@gmail.com | Extreme |
| Brittney | brittney@extremetireshop.com | Extreme |
| NetDriven / LeadVenture | joshua.barrientos@netdriven.com · kyle.morris@netdriven.com · paul.zukauskas@netdriven.com | Current site vendor. **Contract runs to April 30**; payout quote pending to exit early. Reputation-management setup on hold. |
| Tire Guru (Mitch Tryon) | mitch.tryon@tireguru.net · https://calendly.com/mitch-tryon | Tire Match / Service Match widget. Wants a 1-hr kickoff with Justin. |
| ATD (tire distributor) | RKratz@atd.com · MOlean@atd.com · JGonzalez@atd.com · NZabala@atd.com | Supply (not website) |
| Omnisend | — | Forms, SMS/email, push. Embed form id `omnisend-embedded-v2-6aca69f5d904f7153ac6fb26`. Snippet + `service-worker.js` must go in the site root. |
| Shopify | Basic plan, 1 main user | Possible new platform |
| Domain | GoDaddy (Extreme's own, moved Oct 15) | DNS still controlled by the old vendor's Cloudflare. Plan: move DNS to Extreme's own Cloudflare and keep the Microsoft 365 mail records. Melissa: "Might need Justin help with this later." |

---

## 3. Melissa's design brief (her words)
- "I want it to look **more modern**, but still have that **personal and inviting feel with photos and videos**."
- Hero background video: **https://youtu.be/iV1QXEGjeLg**
- Inspiration: **https://www.pepboys.com/auto-service-repair**
- Spec (needs Lucid login): https://lucid.app/lucidchart/69f4cf2c-a4f4-40e0-b8cd-8e4d5a49e675/view
- Header: **white background**. Forms over a **gray background with shadow**.
- Needs: social links, Kafene lease form, wheel configurator, Omnisend on every page, email forwarding for the Contact page.
- Nav (her sitemap): **Home · Tires · Wheels · Mobile Service · [logo] · Auto Service · Coupons · More▾** (More = About, Locations, Contact, Reviews, Financing, News & Gallery). Tagline: **"EXPERIENCE CONVENIENCE."** E-commerce lives inside Tires and Wheels.
- Mockups: see `design/melissa-mockups/`.

---

## 4. Old-site audit: **4.1 / 10** (kit said 4.8)
| Category | Score | | Category | Score |
|---|---|---|---|---|
| First impression | 3.5 | | Content/copy | 4.0 |
| Navigation | 5.0 | | Local SEO | 4.3 |
| Visual design | 4.0 | | Technical health | **3.0** |
| Mobile-service positioning | 4.7 | | Trust/reviews | 5.7 |
| Conversion paths | 4.0 | | Offers/retention | **3.3** |
| Online tire shopping | 4.0 | | Accessibility/legal | 4.0 |

**Broken on the live site now (fix even before the rebuild):**
1. The Mobile Service page links to **tiresonsite.com, a parked, for-sale domain**.
2. `[GEOTITLE] [GEOPHONE] [GEOHOURS…]` placeholders show on the homepage and other pages. Directions → `/[GEODIRECTIONLINK]`.
3. The nav's "Reviews" goes to an empty page titled "Davie, FL". The real page is /About/Reviews.
4. "Uh oh! Page not found!" text inside /About.
5. `[NDClientName]` on Brake Repair. A developer note on the Yokohama page.
6. 9 dead "Watch Video" buttons on Services.
7. **"Davie, FL" on 30+ pages** (headings, logo alt text, hero image, Terms).
8. Bridgestone page server errors. /Tires has 3 H1s; /Mobile-Service has none.
9. Schedule a Repair = a callback form with **no mobile option**, while the page's description promises "booking 24/7".

⚠️ **Name confusion:** "Extreme Tires N Accessories, 2071 SW 70th Ave, Davie" appears in Michelin/BFG dealer listings, Yelp (`extreme-tires-davie`) and Tire Guru. It is very likely Extreme's **old location**. Claim or merge those listings.

**Rebuild SEO:** 195 URLs inventoried. Make a 301 redirect map (brand URLs with spaces or ® need encoded rules). Cut 97 thin news posts to 10–15. New title: *"Mobile Tire Service & Tire Shop in Sunrise, FL | Extreme Tires"*.

---

## 5. Competitor gaps (18 sites researched)
**Still to build (needs Simon's decisions):** deposit or online payment · price-match promise (Firestone 200%, Mavis Sunrise +5%) · written warranty / free services (Les Schwab model) · stated mobile trip fee (Tire Rack charges $90–$120) · second financing option (Affirm/Snap) · real city pages · real build gallery · lift-kit install hours.
**Extreme's edge:** the only central-Broward shop doing **mobile + in-shop** (mobile vans can't align; chains don't come to you) · lifts and wheels in central Broward · 4.7★ and named staff · can undercut Tire Rack's mobile fee · bilingual text/WhatsApp opportunity.
Review gap: Tire Hut has about 500 reviews.

---

## 6. New prototype: v6 (built): 83 pages, all reachable, 0 errors
v6 adds every page in Melissa's sitemap. **Fonts: Montserrat (headlines) + Inter (body).** Live link (private): https://claude.ai/artifact/3uVEUPjCFt8dpnjEMCKXq8
New in v6: Wheels (visualizer mock-up) · Auto Service hub + 11 service pages · Schedule a Repair · Diagnostic Center & Maintenance Advisor · Commercial/Fleet · Tire Brands + 19 brand pages · Tips (14 articles, tire-size decoder, DOT date checker) · Coupons · Financing (Kafene, no payment math) · Reviews (aggregator figures only) · About · Locations (live open/closed) · Contact · News & Gallery · Service Areas + 14 city pages · Terms / Privacy / Accessibility (drafts for attorney review) · HTML Sitemap · 404. A "Jump to page" menu in the yellow bar lists every page.
Rebuild: `python3 site/source/build6.py --out site/index.html` (needs Pillow). Check every link: `node site/tools/crawl.js <path-to-html>` (needs Playwright).
**Everything below this line in section 6 describes the v5 pages, which still exist inside v6.**
**Live link (private, share via the page's Share menu):** https://claude.ai/artifact/3uVEUPjCFt8dpnjEMCKXq8
Local copy: `site/index.html` (open in any browser) · launcher: `Start-ExtremeSite.ps1` → http://localhost:8080
Look: black / signal red / white, with yellow accents. Fonts: Saira Condensed (display) + Barlow (body). Smooth motion, all of which turns off for visitors with reduce-motion set.

| Page | Features |
|---|---|
| **Home** | Hero (storefront, slow zoom, Call/Text/WhatsApp) · 4.7★ trust bar · **"Booked in 60 seconds" 5-step booking flow** (need → vehicle + bring-your-own-tires → mobile/shop + ZIP check + parking checklist → 2-hr window → contact + text opt-in → confirmation timeline) · "How mobile works" texts timeline · tire finder · text-a-photo quote · 12-service grid · "Experience convenience" · **Mobile install + shop alignment combo** · lifts with install hours · offers with expiry dates · Kafene · **Instagram gallery** with filters + lightbox · reviews (4.7 / 1,300+) · fleet · FAQ · SMS/email sign-up · brand strip · Melissa's footer |
| **Tires** | Out-the-door set-of-4 pricing (tire + $25 install + FL $1/tire fee + 7% tax) · Mobile/Shop toggle · filters + sort · price drawer with Kafene monthly estimate → books install · tire + wheel packages |
| **Mobile** | "Do we come to you?" ZIP check · on-site services · day/time slot picker → quote · 14 service-city chips |
| **Quote** | Built 1:1 from Melissa's "Request a Quote" mockup |
| Everywhere | Sticky Call/Text/Quote bar on phones · LocalBusiness schema · meta description · skip link |
**All sample/placeholder (labeled on the page):** tire prices, the $25 install price, coupons, lift install hours, ZIP map (approximate), slot availability, review feed, gallery tiles, crew photos.

---

## 7. Instagram → gallery automation (built, tested on a mock feed)
`instagram-sync/`: `sync-instagram.mjs` + GitHub Action (every 6 hrs) + README.
Pulls @extremetires posts, downloads the photos, tags them by hashtag (#jeep #truck #lifted #wheels #mobiletires), `#nogallery` hides a post, deleted posts get removed, the token refreshes itself.
**Status:** Setup email **sent to Melissa Oct 20** (Business account → Meta developer app → token → add Justin as app Administrator; told not to email the token).
If the site moves to Shopify, use an Instagram feed app (e.g. Instafeed) instead.

---

## 8. Open decisions (need Simon or Melissa)
- [ ] **Platform:** Shopify (already paid) vs NetDriven vs custom build
- [ ] Install price per tire · mobile trip fee · deposit to book?
- [ ] Price match? Warranty / free services with tires?
- [ ] Bring-your-own-tire installs: offer?
- [ ] Current coupons with real values and expiry dates
- [ ] Lift-kit install hours
- [ ] Google Business Profile access (live reviews + automatic review requests)
- [ ] Real ZIP service map
- [ ] Claim or merge the old Davie listings

## 9. Assets still needed
See `docs/image-upload-list.md`: 11 must-have photos (storefront, van, Hunter rack, crew…), 12–20 gallery builds, staff headshots, hero video loop, and the **original logo file** (the current one is cropped from a mockup).

## 10. Next steps (in order)
1. Share the prototype link with Melissa and Simon; collect feedback.
2. Get Simon's answers (section 8).
3. Book the Tire Guru kickoff with Mitch.
4. Finish the Instagram token handoff → turn on the gallery sync.
5. Decide the platform → build production pages + 301 redirect map.
6. Fix the live-site bugs (section 4) while NetDriven is still under contract.
7. DNS move to Extreme's Cloudflare (keep the M365 mail records).

## ⚠️ Security note
Some of Melissa's emails contained **passwords and authenticator secret keys in plain text**. They were left out of every file here. Recommend changing them, and using a password manager or one-time share links from now on.
