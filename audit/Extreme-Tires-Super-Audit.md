# Extreme Tires — Old Site Super Audit (extrememobiletires.com)

Source: Site Audit & Rebuild Kit (captured Oct 19, 2026). Final score 4.1/10 (12-category average of 3 independent audits; kit's own score was 4.8).

---

## Part A — Homepage, URL inventory, SEO
# Agent A: Super Audit, kit.txt lines 1-1451
Scope: executive summary, homepage record, URL inventory, asset list, SEO tags. Line refs are kit.txt line numbers. I checked a few facts outside the slice to confirm or contradict claims, and every such check is marked "(outside slice)".

Evidence caveat: the kit was captured with WebFetch, which paraphrases (L112-114, L296-300). Nobody captured screenshots, colors, fonts, page speed, Core Web Vitals, JSON-LD or the rendered mobile layout. Scores for design, performance and schema are therefore low-confidence.

---

## Scorecard (1-10; 10 = Pep Boys / top Tire Guru-Shopify dealer)

| # | Category | Score |
|---|---|---|
| 1 | First impression & hero | 3 |
| 2 | Navigation & IA | 5 |
| 3 | Visual design & brand consistency | 4 (low confidence) |
| 4 | Mobile-service positioning | 4 |
| 5 | Conversion paths | 4 |
| 6 | Online tire/wheel shopping | 5 |
| 7 | Content quality & copy | 3 |
| 8 | Local SEO | 4 |
| 9 | Technical health | 3 |
| 10 | Trust & social proof | 6 |
| 11 | Offers, coupons & retention | 4 |
| 12 | Accessibility, legal & compliance | 4 |

Unweighted mean is about 4.1/10. That is lower than the kit's 4.8 (see section D).

### 1. First impression & hero: 3
- L159: "Hero slider (3 images, no text overlay)"
- L421: "Hero slider (3 slides, no alt text)". L425: "(Slide overlay text NOT RETRIEVED.)" The overlay was not retrieved, so "no text" is likely but not proven.
- L314: H1 "Tires and Tire Services in Sunrise, FL, Welcome to Extreme Tires". It is generic and doesn't mention mobile.
- One plus: L160 "'Shop for Tires' selector: license plate lookup, or year / make / model / option / size" sits right below the hero.
- **Fix:** Replace the slider with one static hero. Give it the headline "Mobile tire service, we come to you, Broward / Miami-Dade / Palm Beach" and two buttons: "Call (954) 773-1896" (tel:) and "Book mobile install". Keep the plate/YMM lookup directly under it.

### 2. Navigation & information architecture: 5
- L152-154: the nav is sensible and puts Mobile Service at the top level: "Home · Tires (...) · Mobile Service (+ Videos) · Wheels · Services (...) · Coupons · About (...) · Contact (Find Us)".
- Advice content is split across three places: "Tire Care Tips" (L451), "Car Care Tips" (L456) and News with 97 articles (L149).
- Several pieces of content have two URLs: `/Services/Lift-Kits` (L1042) and `/Services/cat/lift-kits` (L899); `/About/Reviews` (L1045) and `/About/Read-Our-Reviews` (L554); `/Tires/Instant-Price` (L1036) and `/Tires/Tire-Catalog/Instant-Price` (L1030).
- L1051: `/Contact/Jobs` exists but isn't in the nav. L462: "Login (/Login?returnurl=%2f)" is exposed in the public footer.
- **Fix:** Merge the three tips/news areas into one "Tire & Car Tips" hub. Give each service exactly one URL.

### 3. Visual design & brand consistency: 4 (low confidence; no screenshots in kit)
- L41 (kit's own words): "Stock template."
- Brand inconsistency: L428: logo alt "Extreme Tires - (Davie, FL)" - note stale "Davie" city. L1418-1419: /Tires H3 "Shop For Brand New Tires in Davie, FL".
- L126: the business email is extremetire2010@gmail.com. A Gmail address undercuts a professional brand.
- **Fix:** Do a brand pass: one city (Sunrise), an email on the domain, and an updated logo alt.

### 4. Mobile-service positioning: 4
- Pluses: the domain is extreme**mobile**tires.com. There is a top-level nav item and a homepage tile (L162), and the closing H3 reads "Make a Mobile Tire Installation Appointment Today" (L323). "Help! I need a tire repair" links to /Mobile-Service (L329-330).
- The homepage title leaves mobile out: L303 "Auto Repair & Tire Shop in Sunrise, FL | Extreme Tires".
- /Mobile-Service has **no H1**. Its outline starts at "H2 Mobile Service; H2 We Offer Mobile Tire Service" (L1430).
- The strongest mobile heading on the site is on the location page, not the mobile page: /Contact/Find-Us "H2 Mobile Tire Service in Sunrise, FL - Convenience Wherever You Are" (L1432).
- **Fix:** Make /Mobile-Service the main landing page, with an H1 like "Mobile Tire Service in Sunrise & South Florida". Cover how it works, the coverage map, what can be done on-site, and a "we come to you" CTA. Put "Mobile Tire Service" first in the homepage title.

### 5. Conversion paths: 4
- Present: phone "(954) 773-1896 (tel link)" (L434), "Schedule an Appointment" -> /Services/Schedule-A-Repair (L333), and five "How can we assist" links (L328-330).
- Broken on the page: L466-467 "Unfilled template tokens leaked into the page: [GEOTITLE], [GEOHOURSMONDAY], [GEODIRECTIONLINK], [GEOPHONE] (the 'Directions' link points to /[GEODIRECTIONLINK])."
- L49 (kit): "No prices, no WhatsApp or chat, no email capture". (Outside slice, L2943: the schedule form only says the shop will "contact the customer within 24 hours". There is no instant confirmation.)
- (Outside slice, L2664) A per-service "REQUEST QUOTE" path does exist (`/Tires/Advanced-Quoting?catsvc=...`), and the form offers "Text (SMS)" as a preferred contact (L2954). A quote and text path exists but is buried.
- **Fix:** Add a sticky mobile bar with Call / Text / Book on every page. Fix the leaked [GEO*] tokens so the Directions, hours and phone blocks work.

### 6. Online tire/wheel shopping: 5
- Pluses: plate or YMM lookup (L160); catalog, "Instant-Price" and "Advanced-Quoting" pages (L1027-1036); "several hundred" Hankook and commercial product pages (L150, L488-490).
- /Tires has three H1s and a stale city: L1418 "H1 'Filter By' + 'TIRE CATALOG' + 'Tire Catalog' (three H1s) and an H3 'Shop For Brand New Tires in Davie, FL'".
- Wheels: L186 "Wheels page is logos only, with no products". The 27 wheel brand logos are files named 1.png-27.png (L1312-1367).
- L176 "No prices appear anywhere on the site". I can't confirm this. Instant-Price pages exist (L1036), but nobody captured what the catalog shows after a vehicle is selected.
- **Fix:** Keep a real tire-catalog integration that shows "starting at" prices. Add wheel products or a wheel-quote form instead of a logo wall.

### 7. Content quality & copy: 3
- L45: "97 thin news posts". IDs 9721-9808 run in one unbroken sequence (88 articles), and the highest is "Website-Launch-Announcement" (L889). That points to a bulk import of syndicated content at launch (my inference).
- Some articles don't fit a Sunrise, FL market: "Why-You-Should-Store-Your-Winter-Tires" (L743), "Do-You-Need-Winter-Tires" (L771), "Tips-to-Prep-Your-Car-for-Winter" (L655), "Why-Do-Tires-Go-Flat-in-Cold-Weather" (L634), "Tips-for-Winterizing-Your-Vehicle" (L768). Others are dated or off-topic: "Social-Distancing-Behind-the-Wheel" (L708), "Strange-Traffic-Laws-from-Around-the-World" (L831).
- Several articles cover the same topic twice: "3-Big-Reasons-to-Not-Mix-Tires" (L628) vs "Why-You-Shouldnt-Mix-Tires" (L840); "What-Are-Nitrogen-Filled-Tires" (L619) vs "What-to-Know-About-Nitrogen-Filled-Tires" (L735); "Should-You-Plug-or-Replace-a-Tire" (L667) vs "Should-I-Repair-or-Replace-My-Tire" (L811); "How-to-Choose-the-Right-Tire" (L681) / "Which-Tire-is-Right-for-You" (L802) / "How-to-Buy-New-Tires" (L828) / "What-to-Consider-When-Buying-New-Tires" (L607).
- L237-242: "[NDClientName] placeholder on the Brake Repair page", typos "surounding", "PLan", "A leftover developer note on the Yokohama page", "Continental brand stats are from 2012", "Every brand page repeats the same intro".
- **Fix:** Cut news down to about 10-15 locally relevant posts and 301 the rest. Write original copy for mobile service, the top 5 services, and fleet work.

### 8. Local SEO: 4
- Title tags are mostly "... in Sunrise, FL | Extreme Tires" (L1413). The weak ones: "/Services: Services | Extreme Tires" (L1387) and "/Contact/Find-Us: Sunrise, FL Location information - Extreme Tires" (L1400).
- NAP conflicts: Yelp "https://www.yelp.com/biz/extreme-tires-davie-4" (L141, L443), logo alt "Davie, FL" (L428), and the Google profile linked through a shortener "https://tinyurl.com/2n45yu3x" (L140).
- Heading problems: L469 "Multiple H1s on other pages; heading hierarchy skips levels (H1 -> H3)". /Contact/Find-Us H1 is just "Extreme Tires" (L1432). /Mobile-Service has no H1 (L1430).
- The service area is three counties (L132, L439), but the inventory has no city or area pages (L509-1127). Meta descriptions mention "Miami, Boca" (L1387-1388), and no page targets those places.
- **Fix:** Add LocalBusiness/AutomotiveBusiness + TireShop JSON-LD with NAP, hours and geo (26.0928, -80.238; L130). Add 4-6 service-area pages (for example Fort Lauderdale, Plantation, Davie, Miami-Dade, Boca/Palm Beach). Davie is the old brand, so a Davie page can legitimately capture that search equity. Fix the Yelp listing name and link GBP directly.

### 9. Technical health: 3
- Placeholders: L466 [GEO*] tokens; L237 [NDClientName].
- 404 text inside a live page: L1420 "/About ... contains the text 'Uh oh! Page not found!'". (The kit says it is in the footer sitewide, L236/L53. The only captured instance is /About.)
- URL hygiene: brand URLs contain spaces and the ® symbol ("Michelin®", "Mickey Thompson", "Bridgestone Ag"; L926, L951-981, L1004-1025). There is a case-variant duplicate, "/Services/Schedule-A-Repair (case variant of /Services/Schedule-a-Repair)" (L1110-1112). Form-response pages are in the sitemap: `/Services/Schedule-Service-Response` (L1039) and `/Contact/Find-Us/Contact-Us-Response` (L1048). Image URLs contain raw spaces: "source URL contained raw spaces" (L1290-1297). Files labeled as PDFs are actually JPGs: "Coupon 'PDF' links ... are actually .jpg files in a /PDFs/ path" (L471).
- The two sitemaps disagree: sitemap.aspx has 161 URLs while sitemap.xml has 45 pages plus hundreds of products (L485-490). Page 3 and beyond were never requested (L503). Bridgestone brand page: "server error twice" (L253).
- **Fix:** Ship a full 301 map in the rebuild (section C). Until then, set the response pages and /Login to noindex and remove them from the sitemap.

### 10. Trust & social proof: 6
- L225-226: "27 entries (26 distinct; one duplicate), 4.9 average, 26 five-star and one 1-star ... Dated Dec 2020 to Oct 2026"
- L37: "Hunter Engineering logo, 19 tire brands". Named staff (L227).
- The homepage reviews have problems: "star ratings not shown in source" (L347-348). One reviewer is shown as "Steven McDaniel / Stanley Williams (as shown)" (L353). Ina Felsher's review praises "Ryan" (L352), and Ryan is missing from the kit's staff list (L227).
- These are first-party reviews only. No Google rating or review count was captured, and the Google link is a tinyurl (L140).
- **Fix:** Embed a live Google review widget showing count and rating. Remove the duplicate review. Add an "N tires installed / since 2007" stat (copyright 2007, L134) and photos of the actual fleet vans (asset at L1290).

### 11. Offers, coupons & retention: 4
- L192-216: 10 offers, but the two house offers are "Alignment with purchase n/a" and "Oil Change Special n/a" (no value shown). The other 8 are manufacturer rebates, not the shop's own offers.
- L218: "Terms and expiry dates are baked into images or PDFs and were not captured." The coupons exist only as images (L1231-1261), so they can't be crawled or read by a screen reader.
- The alignment coupon image is named "1469-2024319114539Alignment..." (L1231). The filename suggests a March 2024 upload (my inference), so the offer may be stale.
- L49: "no email capture, coupons with no deadlines". Several rebates link off-site (L390-397).
- **Fix:** Turn the two house offers into HTML coupons with a stated value and expiry date, plus a "text me this coupon" SMS opt-in.

### 12. Accessibility, legal & compliance: 4
- Present: L462 "Terms of Use (/terms), Privacy (/privacy), Your Privacy Choices (TrustArc), Accessibility (/accessibility)".
- Missing alt text: hero "no alt text" (L421); "(Social icons have no alt text/labels.)" (L447); "hero, social icons and most others have none" (L1141).
- Heading levels skip (L469). Coupon terms exist only as images (L218). The logo alt text names the wrong city (L428).
- L1437-1443: robots.txt is reasonable. It allows AI search agents and blocks training crawlers. It also disallows "Privacy" .aspx, which is minor.
- L269-272: reusing reviews, photos and manufacturer rebate art in a rebuild needs owner and manufacturer permission.
- **Fix:** Label all icons and images, publish coupon terms as text, and keep a single H1 per page.

---

## A. Critical bugs (visibly broken now)
1. Raw template tokens on the homepage: [GEOTITLE], [GEOHOURSMONDAY], [GEODIRECTIONLINK], [GEOPHONE]. The Directions link goes to `/[GEODIRECTIONLINK]` and is dead (L466-467).
2. "Uh oh! Page not found!" text appears inside /About (L1420). The kit says it also shows in the footer (L236); that is unverified beyond /About.
3. The [NDClientName] placeholder shows on the Brake Repair page (L237).
4. "Davie, FL" appears on a Sunrise business: in the logo alt (L428), the Yelp slug (L443), and the /Tires H3 (L1419).
5. The /Tires page has three H1s ("Filter By", "TIRE CATALOG", "Tire Catalog") (L1418).
6. /Mobile-Service, the key differentiator, has no H1 (L1430).
7. Coupon links labeled as PDFs open JPGs (L471). Two house coupons show no value (L192-193).
8. The Bridgestone brand page returned a server error twice (L253).
9. A leftover developer note sits on the Yokohama page (L239).

## B. Quick wins (under 1 hour each, in the current CMS)
- Change the logo alt to "Extreme Tires - Mobile Tire Service, Sunrise, FL" (L428).
- Fix the "Davie" H3 on /Tires (L1419) and the typos "surounding" and "PLan" (L238).
- Remove the Yokohama dev note (L239) and fill or delete [NDClientName] (L237).
- Fill the GEO location record in the CMS (or hard-code NAP and hours) so the [GEO*] tokens resolve (L466).
- Rewrite the homepage title to "Mobile Tire Service & Tire Shop in Sunrise, FL | Extreme Tires" and the /Services title to "Tire & Auto Services in Sunrise, FL | Extreme Tires" (L303, L1387).
- Fix the stray space in the /Tires meta description, "Extreme Tires ." (L1421).
- Replace the Google tinyurl with the direct GBP or review link (L140). Label the social icons (L447).
- Remove the duplicate "Paul Var" review (L225; outside slice, L3647).
- Add value and expiry text to "Alignment with purchase" and "Oil Change Special" (L192-193).
- Ask Yelp to rename the listing to Sunrise (the kit also references /extreme-tires-sunrise, L141).

## C. SEO specifics

### Current title / meta / H1 per key page (only fetched pages; the rest were NOT captured, L1407-1410)
| Page | Title (L) | Meta description (fragments, L) | H1 (L) |
|---|---|---|---|
| / | "Auto Repair & Tire Shop in Sunrise, FL \| Extreme Tires" (L303) | "family owned auto repair & tire shop delivering quality & reliable services to drivers in Sunrise, FL" ... "Schedule your appointment today!" (L304-305) | "Tires and Tire Services in Sunrise, FL, Welcome to Extreme Tires" (L314) |
| /Tires | "Shop for Tires in Sunrise, FL \| Extreme Tires" (L1384) | "Shop for tires from industry-leading brands at Extreme Tires ." ... "serves Broward County, Dade County & nearby areas." (L1384-1385) | 3 H1s: Filter By / TIRE CATALOG / Tire Catalog (L1424) |
| /Services | "Services \| Extreme Tires" (L1387) | "See the tire services and more that we provide" ... "Sunrise, Broward, Miami, Boca, Palm Beach" (L1387-1388) | "Services" (L1426) |
| /Coupons | "Automotive Coupons Sunrise, FL \| Extreme Tires" (L1390) | "Save money on your next auto service at Extreme Tires..." (L1390-1391) | "Coupons" (level not stated, L1428) |
| /About | "About Us \| Extreme Tires, Sunrise, FL" (L1393) | "Learn more about Extreme Tires & why drivers in Sunrise, FL..." (L1393-1394) | "Tires and Tire Service in Sunrise, FL" (L1429) |
| /Mobile-Service | "Mobile Tire Mounting & Repair Services \| Extreme Tires \| Sunrise, FL" (L1396) | "...tire mounting, balancing, & repair services without leaving your home or office." (L1396-1398) | **none** (starts at H2, L1430) |
| /Contact/Find-Us | "Sunrise, FL Location information - Extreme Tires" (L1400) | "Extreme Tires is located at 7712 West Oakland Park Blvd." (L1400) | "Extreme Tires" (L1432) |
| /Wheels | "Shop for Wheels in Sunrise, FL \| Extreme Tires" (L1403) | "Extreme Tires is Sunrise, FL's premier wheel & rim shop." (L1403) | "Wheels" (L1435) |

### URL counts by type (195 listed; I verified the totals against the table)
| Type | Count | Lines |
|---|---|---|
| Main pages (sitemap.aspx) | 19 | L512-559 |
| News categories | 3 | L562-569 |
| News articles (I counted 97 unique IDs: 88 in 9721-9808 + 9 in 10911-10932) | 97 | L571-891 |
| Service categories (/Services/cat/...) | 11 | L893-923 |
| Brand pages (23 passenger/LT + 8 "Ag" farm brands) | 31 | L925-1025 |
| Extra pages (sitemap.xml only: Tire-Catalog, Instant-Price x2, Advanced-Quoting, 2 response pages, Lift-Kits, About/Reviews, Jobs) | 9 | L1027-1052 |
| Commercial tire brand pages (/ctbrands/b/N) | 17 | L1054-1108 |
| Other (case-variant Schedule-A-Repair, map-card details, terms, privacy, accessibility, sitemap.aspx, Login, PreviewCoupon) | 8 | L1110-1127 |
| **Total** | **195** | L491 |
| Not enumerated: commercial product pages + Hankook product pages, "several hundred" each; sitemap.xml?page=3+ unchecked | unknown | L493-504 |

### Must 301-redirect in a rebuild
- **Money pages, 1:1 to their new equivalents:** /, /Tires, /Tires/Commercial-Tires, /Mobile-Service, /Mobile-Service/Extreme-Mobile-Tires-Videos, /Wheels, /Services, /Services/Schedule-a-Repair (plus the case variant /Services/Schedule-A-Repair), /Coupons, /About, /About/Read-Our-Reviews plus /About/Reviews, /About/Gallery, /Contact, /Contact/Find-Us (plus /Contact/Find-Us/Mode/1/7712-.../details), /Contact/Jobs.
- **All 11 /Services/cat/{service} URLs** (and /Services/Lift-Kits) go to the new per-service pages. Services that tie in mobile (tire installation, tire repair, balancing) should link to the mobile page.
- **31 brand URLs, including the encoded ® and space variants** (`Michelin%C2%AE`, `Mickey%20Thompson`, `... Ag`). Kept brands map to the new brand pages. The 8 Ag brands go to /Tires/Commercial-Tires, or return 410 if farm tires are dropped.
- **17 commercial-brand URLs and every product URL pattern** (`/Tires/Commercial-Tires/view/cttire/...`, `/Tires/view/single/tireid/Hankook{ID}`) map by pattern rules to the new catalog or brand pages. Before cutover, pull all sitemap.xml pages (page 3 and beyond were never fetched, L503) and cross-check against GSC for traffic.
- **Tools:** /Tires/Tire-Catalog, /Tires/Tire-Catalog/Instant-Price, /Tires/Instant-Price, /Tires/Advanced-Quoting go to the new tire search/quote. /Services/Diagnostic-Center and /Services/Maintenance-Adviser go to a replacement page or /Services.
- **97 news articles:** keep about 10-15 with traffic or backlinks (301 1:1). Point the rest at the closest service page or the tips hub. Don't send them all to the homepage. The 3 /News/CategoryID/ URLs go to the hub.
- **Coupon and legal:** /DesktopModules/CouponClient/PreviewCoupon.aspx?couponId=110827 goes to /coupons; /terms, /privacy, /accessibility go 1:1.
- **Do not redirect; let them die or set noindex:** the two -Response pages, /Login, /sitemap.aspx (replace with /sitemap.xml).

## D. Where the kit's 4.8/10 is wrong or missing things
1. **The math is right but the method is lenient.** (7.0+5.5+4.5+4.0+3.0)/5 = 4.8 (L35-51). With only five categories, nothing scores mobile-service positioning, content quality, offers/retention, accessibility, or the shopping experience separately. Those are where this site is weakest, which is why my 12-category mean comes out near 4.1.
2. **Design/UX 5.5 is listed under "Keep and amplify"** (L55-57) even though the same section calls it a "Stock template" whose hero "has no headline or button" (L41). No screenshots were captured, so a design score has no visual evidence behind it.
3. **"No schema markup" (L45) is unverified.** No section in my slice shows JSON-LD was inspected. The tool summarizes pages (L296-300) and is unlikely to expose script tags. Confirm with view-source or Google's Rich Results Test before claiming it.
4. **"'Page not found' block sits in the footer" (L53, L236) has only one captured instance:** the text inside /About (L1420). The kit never shows it as sitewide.
5. **"'Davie, FL' ... (logo alt text, Yelp slug, page titles)" (L234):** none of the 8 captured title tags contains "Davie" (L1381-1404). The captured on-page instance is an H3 on /Tires (L1419).
6. **"No prices appear anywhere" (L176)** conflicts with the existence of /Tires/Instant-Price and /Tires/Tire-Catalog/Instant-Price (L1030, L1036). The post-vehicle-selection results were never captured.
7. **Conversions 4.0 under-credits the existing paths.** There is a plate lookup (L160), a tel link (L434), per-service "Request Quote" links (outside slice, L2664), and SMS as a contact preference (outside slice, L2954). The real problem is that these are buried, and the hours, phone and directions blocks are broken by [GEO*] tokens. Saying the site has no such paths is wrong.
8. **The kit contradicts itself on Mastercraft:** L418-419 says "Goodyear, Mastercraft, Kelly and Dunlop link only to /Tires (no brand page in sitemap)", but /Tires/brands/Mastercraft is in the sitemap (L965). Goodyear has a $100 rebate on the homepage (L199) and no brand page at all. That gap is worth fixing.
9. **Things it missed:** /Mobile-Service has no H1 (L1430). /Contact/Find-Us does the mobile page's SEO job (L1432). Five winter-themed articles target a South Florida audience (L634-771). Several articles cover the same topic twice (section 7). Two duplicate URLs and the case-variant URL (section 2) were not flagged as canonical risks. Response pages sit in the sitemap (L1039, L1048). There are 8 irrelevant "Ag" farm-tire brand pages (L1004-1025). The Google profile is linked via a tinyurl (L140), which loses link equity and looks untrustworthy. The business email is Gmail (L126). The review data has quality problems: an ambiguous author (L353), and staff named "Ryan" in a review (L352) while the staff list omits him (L227).
10. **Trust 7.0 is a little high.** It rests only on 27 site-hosted reviews with no stars shown in the homepage source (L347-348), one duplicate, and no Google rating or count captured. I'd put it at 6 until GBP numbers are shown.
11. **The "7 / 10 rebuild kit completeness" score (L65) is generous.** Missing items: product URLs not enumerated (L488-490), sitemap.xml page 3 and beyond never requested (L503), titles and meta for 187 of 195 URLs not captured (L1407-1410), and no body copy verbatim (L112-114). The 301 map can't be finished from this kit; it needs a full crawl plus GSC export.

---
## Part B — Tires, wheels, brands
# Agent B: Part 01 (Tires, Commercial Tires, Tire Care Tips, Wheels, Brands)

Source: kit.txt lines 1452-2617, plus context from lines 1-300. All quotes are copied from the kit with their kit.txt line numbers. The kit's own extraction caveat applies: long body copy was paraphrased by WebFetch (L1464, L1896-1898), so only text in quote marks counts as verbatim.

---

## Scores (12-category rubric)

### 1. First impression and hero: 4/10
- The hero image on /Tires is a stock city image named for the wrong city: "Shop-For-Tires-Davie-FL.jpg (hero; alt: "Shop for Quality Tires in Davie, FL")" (L1534-1535). The same hero is reused on every brand page (L1936).
- The first content heading a shopper sees on /Tires and on every brand page is a sidebar label, not a value proposition: "H1: Filter By (sidebar)" then "H1: TIRE CATALOG" (L1468-1469, L1909).
- The Wheels hero works: "Pink sports car in driveway ... and the Extreme Tires mobile tire and wheel service van in the background" (L1839-1841). The Commercial hero also shows the van servicing an excavator (L1668-1669). These are the strongest first impressions in the slice.
- **Fix:** Replace the Davie stock hero on /Tires and all brand pages with a real photo of the van, and put a one-line H1 over it: "Tires delivered and installed at your home or fleet yard, Sunrise and Broward".

### 2. Navigation and information architecture: 5/10
- The nav structure is logical: "/Tires , /Tires/Commercial-Tires , /Tires/Tire-Care-Tips , /Mobile-Service ... /Wheels" (L1567-1570).
- Brand URLs are inconsistent. /Tires/brands/Samson "did not return a Samson page. It returned the all-brands index" (L2575-2576). Ag slugs look like "/Tires/brands/Samson%20Ag" (L2578). OHTSU uses "/Tires/brands/Ohtsu ; product links use /OHTSU/" (L2549-2550).
- Consumer and commercial brands live in two separate URL trees: "/Tires/Commercial-Tires/view/ctbrands/b/" with numeric IDs (L1678-1681), next to "/Tires/brands/{Brand}" (L1891).
- Footer and in-body links mix casing and paths: "https://www.extrememobiletires.com/find-us (NOTE: lowercase, differs from /Contact/Find-Us used elsewhere; confirm it resolves)" (L1764-1765). Body links also use "/services" and "/contact" in lowercase (L1932).
- **Fix:** In the rebuild, use one brand taxonomy (/tires/brands/{slug} with a filter for commercial and ag), and set up a 301 map for /ctbrands/b/{n}, the %20Ag slugs and /find-us.

### 3. Visual design and brand consistency: 4/10
- Town names conflict on the same page. One example is "H3: Shop For Brand New Tires in Davie, FL (NOTE: says Davie, everything else says Sunrise)" (L1470). Another is "logo.png (alt: "Extreme Tires - (Davie, FL)")" (L1533).
- Toyo: "first heading and logo alt text say Davie, FL; title, meta and body say Sunrise, FL" (L2472).
- Wheel brands appear as "logo tiles with empty alt text" (L1827) with mixed file types and file names "1.png ... 5.jpg ... 25.jpg" (L1843-1871).
- Many product cards show no photo: Firestone has "most product cards use the _NoImage.jpg placeholder (about 50 unique real photos)" out of about 185 (L2143, L2174-2175). Hercules has "many TIS Offroad entries with placeholder images" (L2221).
- **Fix:** Find and replace every "Davie" string in the theme (H3, logo alt, hero file name and alt). Hide products that have no image, or show a branded fallback in place of the generic "_NoImage.jpg".

### 4. Mobile-service positioning: 5/10
- The block exists on every page, but it is generic and placed last: "H3: Make a Mobile Tire Installation Appointment Today" (L1478, L1594, L1710, L1795). Its body text talks about the catalog and never explains mobile service: "We understand that buying new tires can be overwhelming." / "Let us help you choose ... online tire catalog." (L1925-1926).
- Commercial does it best: "H2: Mobile Tire Service for Commercial & Industrial Vehicles" and "With our cutting-edge mobile unit, we bring convenience and efficiency to you." (L1591, L1626). The kit also captured "Simply give us a call." (L1631), so the only next step is a phone call. No fleet form was captured.
- Wheels: "We provide the convenience of mobile custom wheel installation," / "so you can upgrade your wheels without leaving your driveway." (L1809-1810).
- Nothing in this slice states a mobile service radius, a fee, response times or booking slots. The kit only says "Broward County, Dade County, Palm Beach County and surounding areas" (L1924).
- **Fix:** Rewrite the shared "Make a Mobile Tire Installation Appointment" block into a real mobile-service module with three steps (pick tires, pick a place and time, we install), a service-area map and a "Book mobile install" button. It already shows on every catalog and brand page, so one template edit changes about 30 pages.

### 5. Conversion paths: 4/10
- The tire search CTAs exist: "Find Your Tires, Send Me A Quote, Schedule An Appointment, Shop Services, Browse Savings" (L1524). Commercial adds "Find Tires", "Get Quote" (L1658).
- The phone number is a tap-to-call link on Tire Care Tips: "Phone: tel:(954) 773-1896" (L1770). On Commercial the CTA is "Give us a ring and let's see what we can do!" (L1618).
- The Wheels page has no shopping path at all: "Wheel brand tiles do not link anywhere; there are no wheel product pages, sizes, finishes or pricing on this page." (L1883). The only CTA is "Contact Us About Wheels" (L1835).
- The product detail page ends in a broken directions link: "A "Directions" link has an unfilled [GEODIRECTIONLINK] placeholder." (L2599). This slice shows no text, WhatsApp or chat option.
- **Fix:** Add a sticky "Call / Text / Get a quote" bar to the catalog and product templates. Make every wheel tile open a quote form with the brand pre-filled.

### 6. Online tire and wheel shopping experience: 3/10
- Search entry points are reasonable: "Tabs: Search by Vehicle | Search by Tire Size | Search by Brand" and "Search by License Plate: Select State" (L1513-1516).
- Product pages are almost empty. The Michelin X detail page has "No product description, specs, pricing or reviews." It has only two sizes, "125R15" and "155R15" (L2597-2598).
- Each card has "Submit Review" links (L1905), but no reviews were captured anywhere. The executive summary says "No prices appear anywhere on the site." (L176).
- Wheels: there is no catalog or visualizer, and the page is "logos only, with no products" (L186, L1883).
- The catalog is padded with irrelevant SKUs. Firestone lists "many legacy/Latin-market items such as Campeon De Lujo, Super Traccion, Tempa Spare" (L2145-2146). The Commercial size dropdown has "about 80 values, from 1400 down to 6.5" (L1657).
- **Fix:** Move to a modern tire-catalog integration that shows starting prices, specs and out-the-door install pricing, with "Book mobile install" on each SKU. Add at least a wheel quote-by-vehicle form.

### 7. Content quality and copy: 4/10
- Typos on the live site: "surounding" (L1642, L1741, L1817, L1924), "custom wheels are elevate your ride" (L1812), "Promise PLan(TM)" (L1950), "roughest" (L2010-2011), "got it start" (L2561), "has the best Michelin(R) X tires you can ask for for your vehicle" (L2594-2595), and "Contact us today for a new set of Nitto tires today." (L2439-2440).
- Brand copy is generic manufacturer history that also appears on other dealer sites. It sounds like the manufacturer talking, not the shop: "As an American company since 1914, our focus is on making quality tires" (Cooper, L2082) and "It's why we put more science into our tires" (Michelin, L1962).
- Outdated facts: "As of 2012, Continental employs approximately 170,000 employees in 46 countries." (L2324).
- The Tire Care Tips page is the best original copy in the slice. It is concrete and it offers something: "Rotate your tires every 5,000–7,500 miles" and "ask a pro at Extreme Tires for a free tread check." (L1726-1727). It has "No body images" (L1760).
- **Fix:** Fix the eight typos now. Rewrite brand-page intros in the shop's own voice: what the shop stocks, popular sizes for South Florida drivers, and a note that the tires can be installed at your home.

### 8. Local SEO: 5/10
- Title tags are localized and consistent: "Shop for Tires in Sunrise, FL | Extreme Tires" (L1460), "Shop Commercial Tires in Sunrise, FL" (L1582), and the brand pattern "{Brand} Tires Carried | Extreme Tires in Sunrise, FL" (L1892).
- None of the titles mention mobile service, which is the shop's main search keyword. Example: "Shop for Wheels in Sunrise, FL | Extreme Tires" (L1784).
- The H1 structure is broken. There are three H1s per page and none of them is local: "H1: Filter By (sidebar) / H1: TIRE CATALOG / ... / H1: Tire Catalog" (L1468-1472). The visible H3 names the wrong city: "Shop For Brand New Tires in Davie, FL" (L1470, L1910). On Yokohama and the brand index it is promoted to H2 (L2513, L2584).
- Meta descriptions are templated near-duplicates: "Extreme Tires in Sunrise, FL carries the best {Brand} tires for you and your vehicle." (L1893). Some are shorter variants (Kumho L2247-2248, General L2278-2279).
- NAP in the body is consistent: "(954) 773-1896 / 7712 West Oakland Park Blvd, Sunrise, FL 33351" (L1529, L1757). The Yelp profile still uses the "extreme-tires-davie-4" slug (L1571). This slice has no evidence of schema.
- **Fix:** Use one H1 per page that includes the city and "mobile", for example "Michelin Tires in Sunrise, FL: Installed at Your Home or Our Shop". Delete the Davie H3. Add "Mobile" to the title tags of /Tires, /Wheels and /Tires/Commercial-Tires.

### 9. Technical health: 3/10
- Template placeholders and developer notes are visible: "Store hours show unpopulated [GEO...] placeholders" (L1530), "unfilled [GEODIRECTIONLINK] placeholder" (L2599), and "the live page contains a leftover developer note (div "should not be deleted") visible in the text." (Yokohama, L2524).
- The Bridgestone page broke during capture: "Two fetch attempts returned SERVER_ERROR" (L2127). Firestone "also failed on the first try before succeeding on retry" (L2128-2129). This points to oversized pages, with 185 product cards on one page.
- A brand slug falls back silently: the Samson URL returns the brand index instead of a 404 or a redirect (L2574-2577).
- Content is thin and duplicated at scale. "Every brand page repeats the SHARED BLOCKS" (L1899). Product pages hold only the shared blocks (L2597). "Product grids (30 to 185 cards per brand)" (L1903) link to "/Tires?tireid={id}&view=SubmitReview" URLs (L1905), which are likely to be crawled as more thin URLs. The kit does not confirm this.
- The commercial tire guide is script-rendered and did not come through: "likely a script-rendered widget" (L1653-1654). It may be invisible to crawlers too, but the kit does not confirm this.
- **Fix:** Remove the Yokohama developer note and the [GEO...] and [GEODIRECTIONLINK] tokens (or replace them with static text). Ask Net Driven to paginate or lazy-load brand product grids so Bridgestone loads.

### 10. Trust and social proof: 5/10
- Brand-backed guarantees are mentioned: "backed by the MICHELIN(R) Promise Plan(TM)" (L1970), "Firestone 30-day “buy & try” guarantee" (L2166), "45-day road test or mileage warranty" (Cooper, L2102), and a "warranty guide PDF" (L1990).
- There is a strong real-world image: "The Extreme Tires purple and blue mobile van ... providing tire service for an excavator" (L1668-1669).
- Product pages show no reviews ("No product description, specs, pricing or reviews", L2597), even though the site has 27 reviews at 4.9 (L225). None of them appear on tire or wheel pages.
- Unproven superlatives weaken trust: "We are the go-to tire supplier in the area because our selection is second to none." (L2455). The Yokohama copy has "prices described as among the lowest around" (L2516).
- **Fix:** Put a review strip on the catalog and brand templates (the 4.9 rating plus two quotes about mobile installs), next to the brand warranty badges.

### 11. Offers, coupons and retention: 3/10
- The only offer link in this slice is generic: "Browse Savings: https://www.extrememobiletires.com/coupons" (L1545, L1932).
- Brand pages never show their active rebate, even though the coupons list has one for nearly every brand. Examples are "BFGoodrich $80 rebate", "Michelin $80 fall promotion" and "Kumho $80 rebate" (L195-216, context section).
- The one retention-style hook is "ask a pro at Extreme Tires for a free tread check" (L1727). It is buried in a bullet list with no CTA.
- The slice shows no email or SMS capture and no rotation or reminder program.
- **Fix:** Add a "Current rebate: $X" banner to each matching brand page (Michelin, BFGoodrich, Cooper, Goodyear, Bridgestone, Firestone, General, Kumho) that links to the manufacturer's offer page. Turn "free tread check" into a bookable CTA.

### 12. Accessibility, legal and compliance: 4/10
- Images are missing alt text: "Wheel Brands (27, shown as logo tiles with empty alt text)" (L1827) and "sidewall-v1.jpg (tire sidewall diagram, no alt)" (L1536).
- Where alt text exists, it is wrong: "alt: "Extreme Tires - (Davie, FL)"" (L1533).
- Legal infrastructure is present: "/terms , /privacy , /accessibility" (L1570, L1774), a TrustArc privacy-choices icon (L1539), and a catalog disclaimer "ALTHOUGH THE DATA AND INFORMATION ARE BELIEVED TO BE ACCURATE" (L1508-1509).
- The heading hierarchy is broken (three H1s, an H3 before any H2; L1468-1472), which hurts screen-reader navigation. Manufacturer claims such as "Stops up to 15 feet shorter on wet roads" (L2027) appear without their test footnotes in the capture ("Test footnotes omitted by tool", L2033). Check on the live page that the footnotes are present.
- **Fix:** Add alt text to all 27 wheel logos and the sidewall diagram, and reduce the heading structure to one H1 per page.

---

## (a) Critical bugs (visibly broken now)
1. **Wrong city "Davie, FL"** in the H3 "Shop For Brand New Tires in Davie, FL" on /Tires and on every brand page (L1470, L1909-1910), in the H2 on Yokohama and the brand index (L2513, L2584), in the logo alt text (L1533), in the hero file name and alt (L1534-1535, L1936), and on the Toyo heading and logo alt (L2472).
2. **Leftover developer note** visible on the Yokohama page: div "should not be deleted" (L2524).
3. **Unfilled placeholders**: [GEO...] store hours on /Tires (L1530), and [GEODIRECTIONLINK] on the "Directions" link of the product detail page (L2599).
4. **Bridgestone brand page returns a server error** (two failures, L2127). This is a major brand, and it is linked from /Tires, /Wheels, Tire Care Tips and the commercial list (L2130-2131).
5. **The /Tires/brands/Samson URL silently serves the brand index** (L2575-2577).
6. **Wheel brand tiles are dead**. They do not link anywhere (L1883).
7. **Typos on live pages**: "surounding" (sitewide shared block, L1924), "wheels are elevate" (L1812), "PLan" (L1950), "for for" in the Michelin X meta (L2595), "got it start" (L2561), and "today ... today" (L2439-2440).
8. **Outdated stat**: Continental "As of 2012 ..." (L2324).
9. **Possible broken link**: /find-us in lowercase on Tire Care Tips (L1764-1765). The kit does not say whether it resolves.

## (b) Quick wins under 1 hour
1. Find and replace "Davie" with "Sunrise" in the skin's H3 text and the logo alt text (one template string fixes about 30 or more pages).
2. Delete the Yokohama developer-note div.
3. Fix "surounding" in the shared mobile-appointment block (one edit fixes every catalog and brand page), plus "are elevate", "PLan", "for for", "got it start" and the doubled "today".
4. Delete or update the Continental 2012 employee sentence.
5. Change the /find-us link on Tire Care Tips to /Contact/Find-Us.
6. Add alt text to the 27 wheel logos and the sidewall diagram.
7. Point each wheel tile at /Contact (or a quote form) with the brand name in the link text.
8. Add "Mobile" to the title tags for /Tires, /Wheels and /Tires/Commercial-Tires. Example: "Mobile Tire Installation and Tires in Sunrise, FL | Extreme Tires".
9. Turn "free tread check" (L1727) into a bolded CTA button that links to /Services/Schedule-a-Repair.
10. Add a one-line rebate callout plus a link on the eight brand pages that have a current rebate.

## (c) Brands carried

**Consumer tire brands (with brand pages captured in this slice):** Michelin, BFGoodrich, Uniroyal, Cooper, Firestone, Hankook, Hercules, Kumho, General, Continental, Pirelli, Nexen, Nitto, Toyo, Falken, Yokohama, Ironman, OHTSU (L1943-2572). Bridgestone has a page but it failed to load (L2125-2132).

**Homepage logo row (19), from context L182-183:** Michelin, BFGoodrich, Uniroyal, Goodyear, Cooper, Mastercraft, Kelly, Dunlop, Bridgestone, Firestone, Hankook, Hercules, Kumho, General, Continental, Pirelli, Nexen, Nitto, Toyo. **Goodyear, Mastercraft, Kelly and Dunlop have logos on the homepage, but no brand page was captured for any of them.** Goodyear also has a $100 rebate (L199) and no captured page to support it. Whether those pages exist is not captured.

**Commercial tire brands (17, L1660-1661):** BFGoodrich, Bridgestone, Continental, Falken, Firestone, General, Hankook, Hercules, Ironman, Kumho, Michelin, Ohtsu, Pirelli, Samson, Toyo, Uniroyal, Yokohama.

**Agricultural brands:** the index has 31 tiles, 23 of them standard and 8 ag, "e.g. Carlisle Ag, Samson Ag, Michelin Ag" (L2587). The full list of 31 is not captured (L2589).

**Wheel brands (27, L1828-1830):** Advanti, American Force, Black Rock, Center Line, Cragar, Cruiser Alloy, Deegan 38, Dick Cepek, Drifz, Dropstars, Focal, Fondmental, Gear, ICW Racing, Konig, Lexani, Mamba, Maxxim, Mickey Thompson, Monster, Motive, Sota Offroad, TIS, Ultra Motorsports, Ultra Muscle, Walker Evans, Worx. (Mickey Thompson also has a $100 rebate, L201.) None of them has a page.

**Equipment trust brand:** Hunter Engineering (L185, context).

**Thin or duplicate brand pages:**
| Brand | Assessment | Evidence |
|---|---|---|
| All brand pages | Same shared intro and shared mobile block, same Davie H3, same templated meta | L1899-1941, L1893 |
| Brand index | Shared blocks only, no H3s | L2585-2586 |
| Michelin X product page (and by extension every /m/{id} product page) | Shared blocks only; no description, specs, price or reviews | L2596-2597 |
| Yokohama | Thin: a short dealer blurb plus a manufacturer boilerplate line pointing to "visit www.yokohamatire.com"; developer note bug | L2515-2524 |
| OHTSU | Thin: 5 products and a short history | L2555 |
| Ironman | Thin: generic "proud to be an Ironman tire dealer" copy | L2539-2546 |
| Uniroyal | Thin: intro truncated vs other brands; feature lines not tied to model names | L2051-2052, L2060-2064 |
| Firestone, Hankook, Hercules, Kumho, General, Continental, Pirelli, Nexen, Nitto, Toyo | Formula pages: "[Brand]: tagline" H2, a generic "Types of X Tires" list, a company history, and the same closing lines ("Shop our online tire catalog to browse our selection of X tires.", "Finding the right tires for your needs can be overwhelming.", "Your tire search stops here at Extreme Tires." repeated across Nexen/Toyo L2386/L2452 and Hercules/Nitto L2223/L2416) | L2142-2471 |
| Michelin, BFGoodrich, Cooper | Richer, but the copy is supplied by the manufacturer and written in its voice ("we", "our") | L1955-2120 |
| Falken | The only rich, multi-section page (the kit calls it "the only brand page with a rich, original, multi-section story", but notes it "Uses brand-supplied copy") | L2507 |
| Samson | No page; the URL serves the index | L2574-2578 |
| Bridgestone | Server error; nothing captured | L2125-2129 |

## (d) What the shopping flow is missing compared with a modern tire dealer
1. **Prices.** No prices anywhere (L176), not even "starting at" prices, and no out-the-door install price with mounting, balancing, TPMS and disposal.
2. **Real product detail pages.** No description, specs (load or speed index, UTQG, treadwear warranty), photos or reviews (L2597). Many cards use the _NoImage placeholder (L2175).
3. **Cart, checkout and deposits.** Not captured, and no evidence any exist. The flow ends at "Send Me A Quote" or "Schedule An Appointment" (L1524).
4. **A choice of mobile install vs in-shop install at checkout**, with date and time slots and the service-area or ZIP check that suits their main differentiator. This is missing; the mobile block is boilerplate (L1922-1931).
5. **Filters and sorting on results** (season, type, price, rating, warranty miles, run-flat or LT). The capture shows only an "H1: Filter By (sidebar)" label (L1468). The filter options are not captured.
6. **Good / better / best recommendations** and side-by-side comparison. The kit mentions an "interactive tire catalog, where you can compare commercial tire brands" (L1613), but no compare UI was captured.
7. **A wheel shopping flow**: wheel catalog by vehicle, fitment, finishes, sizes, prices, a visualizer showing wheels on your car, and tire-and-wheel packages. The current page is logos only (L1883).
8. **Rebates shown on brand and product pages** (they exist on /coupons, L195-216, but are not tied to the products).
9. **Reviews on products and the brand template** (Submit Review links exist, but no review content shows, L1905).
10. **A fleet or commercial quote form** with vehicle count, positions (steer, drive, trailer) and yard location. Today it is "Give us a ring" (L1618), and the commercial tire guide does not render (L1653).
11. **Financing or pay-over-time**: not captured anywhere in the slice.
12. **Text, WhatsApp or chat quote**: none in the slice.

## (e) What the kit's 4.8/10 scoring got wrong or missed
1. **It folds online shopping into "Conversions" and "Design/UX"** and never scores the catalog itself. For a tire dealer, shopping is the core job. My slice supports about 3/10 for it: no price, specs or reviews on product pages, no wheel catalog, and a Bridgestone page that crashes. Scoring it separately would pull the overall below 4.8.
2. **Trust at 7.0 is generous for the tire and wheel pages.** The 27 reviews do not appear on any catalog, brand or product page in my slice (L2597). Unproven superlatives ("second to none", L2226, L2455) and manufacturer-voice copy weaken trust. 7.0 is fair only for the homepage.
3. **It undercounts the Davie problem.** The summary lists "logo alt text, Yelp slug, page titles" (L234). In my slice, though, every title says Sunrise. The Davie text actually sits in the visible H3 and H2 on every catalog and brand page (L1470, L1910, L2513, L2584), in the hero image name and alt (L1535), and on Toyo (L2472). "Page titles" looks wrong. The kit's own data puts the problem in on-page headings, which shoppers can see.
4. **It misses the brand coverage gap.** Goodyear, Mastercraft, Kelly and Dunlop are on the homepage logo row (L182-183) but have no captured brand pages. Goodyear has the largest rebate ($100, L199). The kit's "31 brand pages" figure (L149) is never itemized, so it cannot be checked.
5. **It misses the Samson and Ag URL problem** (L2574-2578) and the split between the consumer and commercial brand URL trees (L1678 vs L1891). Both matter for the 301 map.
6. **It misses the H1 structure** (three H1s per page, none descriptive; L1468-1472). That is a bigger SEO problem than the templated meta descriptions.
7. **It undercounts typos.** The summary lists only "surounding" and "PLan" (L238). My slice also has "are elevate" (L1812), "for for" (L2595), "got it start" (L2561), the doubled "today" (L2439-2440) and "roughest" (L2010-2011).
8. **It misses the [GEODIRECTIONLINK] placeholder** on product pages (L2599). The summary mentions only [GEO...] hours and address blocks (L235).
9. **It misses the empty alt text on all 27 wheel logos** (L1827). It does not score accessibility at all, even though /accessibility exists.
10. **"Technical 3.0" is fair**, but the reason it gives (a footer 404 and placeholders) understates page weight. Brand pages with 100 to 185 product cards caused repeated server errors (L2127-2129). That is a performance and crawlability problem, not just a cosmetic one.
11. **It describes the brand pages as "repetitive"** but credits Falken as "substantial original copy" (L241-242). The kit's own Falken note says it "Uses brand-supplied copy" (L2507), so no brand page actually has copy written by the shop.

## Not captured (within this slice)
- Bridgestone page content (L2127).
- Commercial tire guide (drive, steer, trailer; L1653).
- Full list of 31 brands on the index (L2589).
- Commercial brand pages under /ctbrands/ (L2603).
- Filter options inside the "Filter By" sidebar.
- Whether a cart or checkout exists.
- Whether /find-us resolves.
- Whether Goodyear, Mastercraft, Kelly or Dunlop brand pages exist.
- Cooper tire-condition body text (L2104-2105).
- Schema markup on these pages.

---
## Part C — Services, trust, contact, legal
# Agent C: Super Audit of Part 02 (Services) and Part 03 (Brand & Trust)

Source: kit.txt lines 2618-3889 (plus context from lines 1-300). Every quote below is copied verbatim from kit.txt with its line number. The kit paraphrases most body copy (it says so at lines 2625-2627, 3200-3202, 3416-3418), so the quotes describe what was captured. They are not necessarily the live page's exact wording. Where the kit doesn't have something, I say "not captured".

---

## Scorecard (my slice)

| # | Category | Score |
|---|---|---|
| 1 | First impression & hero | n/a from my slice |
| 2 | Navigation & IA | 5 |
| 3 | Visual design & brand consistency | 4 (thin evidence) |
| 4 | Mobile-service positioning | 5 |
| 5 | Conversion paths | 4 |
| 6 | Online tire/wheel shopping | n/a from my slice |
| 7 | Content quality & copy | 5 |
| 8 | Local SEO | 4 |
| 9 | Technical health | 3 |
| 10 | Trust & social proof | 6 |
| 11 | Offers, coupons & retention | 3 |
| 12 | Accessibility, legal & compliance | 4 |

Slice average across the 10 scored categories: 4.3 / 10.

---

### 2. Navigation & information architecture: 5/10
- The Services hub links all 11 service pages, each with Learn More, Request Quote and Schedule links (L2661-2664): "Brake Repair  /Services/cat/brake-repair  /Tires/Advanced-Quoting?catsvc=7102038|-1  /Services/Schedule-a-Repair". That structure is sound.
- There are two reviews URLs, and the one in the nav is the empty one. L3627-3629: "URL 1: https://www.extrememobiletires.com/About/Read-Our-Reviews ... Page content returned ZERO reviews". The nav site map at L3883 lists "/About/Read-Our-Reviews". The populated page is "URL 2 (canonical): https://www.extrememobiletires.com/About/Reviews" (L3632).
- The sidebar service list is shortened to 6 of the 11 services on every page: "Services: Brake Repair, Wheel Alignment, Tire Installation, Tire Repair, Tire Balancing, Suspension" (L3015, L3083, L3151, L3225). Oil changes, lift kits, custom wheels and TPMS are missing from it.
- Albums and links have generic paths. The Mobile Tire Service album is at "/About/Gallery/ID/55/Gallery" (L3547), and Car Care Tips links to a different Find Us path, "https://www.extrememobiletires.com/find-us" (L3169), than the one used everywhere else, "/Contact/Find-Us".
- **Top fix:** Point the About > Reviews nav item at /About/Reviews and 301 /About/Read-Our-Reviews to it. Put all 11 services, including Mobile Service, in the sidebar.

### 3. Visual design & brand consistency: 4/10 (only asset-level evidence)
- The brand name splits across Davie and Sunrise: "logo.png (alt: "Extreme Tires - (Davie, FL)")" (L3616), and the reviews title is "Extreme Tires - (Davie, FL) > About > Read Our Reviews" (L3628).
- Stock platform iconography is still in use, including a dead network: "https://a2.nd-cdn.us/modules/testimonials/googleplus.png" (L3720).
- The news posts use stock imagery: "AdobeStock_1001869866(1).jpeg" (L3504), "AdobeStock_308327521.jpeg" (L3517).
- On the plus side, there's a real photo library: "Album 2: Mobile Tire Service (41 images)" (L3572), with Ferraris, Porsches, RVs, a semi, a boat trailer and a golf cart (L3576-3607).
- **Top fix:** Replace the "Davie, FL" logo alt and site-name string with "Extreme Tires, Sunrise, FL" everywhere. Swap stock news images for the shop's own gallery photos.

### 4. Mobile-service positioning: 5/10
- The main heading on the key page links to a parked domain. "H2: We Offer Mobile Tire Service (links to tiresonsite.com)" (L3206), and L3251-3252 note: "tiresonsite.com appears to be a parked/for-sale domain; the H2 link is likely stale".
- The booking form has no "come to me" option. The wait preference only offers "I will wait for my vehicle" / "I will leave my vehicle" (L2952), and the service dropdown (L2947-2948) has no "Mobile service" entry.
- The mobile page lists capabilities but not the specifics a visitor needs: "Mobile Tire Mounting / Mobile High-Speed Balance / Mobile Tire Repairs" (L3208), with the service area only at county level, "Sunrise, FL, plus Broward, Dade, and Palm Beach counties and nearby areas" (L3218). Trip fee, response time, how it works and a coverage map are all not captured.
- The site does carry a lot of mobile proof: every page has the H3 "Make a Mobile Tire Installation Appointment Today" (L2634, L2733), there are 3 Instagram reels (L3245-3247), 4 YouTube videos (L3300-3305) and a 41-photo mobile album (L3572). The videos have no titles: "Video titles: NONE visible on the page." (L3298)
- Copy is stale: mobile oil change is "announced as a new offering" (L3219).
- **Top fix:** Remove or retarget the tiresonsite.com H2 link. Add a "Mobile: come to my home/work" choice plus an address field at the top of Schedule a Repair.

### 5. Conversion paths: 4/10
- The booking promise is soft, and the meta overpromises. The meta says "Quick, easy booking 24/7." (L2929-2930), but the body says "Submitting does not guarantee the chosen time; the shop says it will contact the customer within 24 hours to set a time." (L2940-2941)
- The form has too many steps for a single-location shop. It asks for vehicle Year/Make/Model/Option/Size, a "location search (city/state/ZIP), "Use current location", first and second choice date/time ... location selection (required)", and full street address (L2950-2953).
- Nine "Watch Video" CTAs do nothing: "are javascript: void placeholders, no real video URL." (L2686-2688)
- There are some good pieces: a click-to-call link, "Call Us Today!" tel: +1 (954) 773-1896 (L3228), an SMS contact preference, "Preferred contact: Telephone, Email, Text (SMS)" (L2954), and a Request Quote link per service. Prices: "None listed." (L2691-2692). WhatsApp, chat and text-to-quote don't appear anywhere in the slice.
- **Top fix:** Replace the request form with real-time booking, or at least a 4-field "text me a quote" form (name, phone, service, mobile or shop). Add starting-at prices.

### 7. Content quality & copy: 5/10
- The service pages have useful symptom lists, for example Wheel Alignments: "The steering wheel is off-center when driving straight"; "The car pulls to one side or the other" (L2774-2775). Brake and suspension pages have similar lists (L2758-2759, L2849-2851).
- Template residue shows on live pages: "Contains an unpopulated "[NDClientName]" placeholder." (L2756-2757), and the typo "(Source typo "surounding" appears in original.)" (L2810).
- Thin and boilerplate pages. The videos page has "Meta description: NOT PRESENT on page." (L3275). The same footer promo with "brands Michelin, BFGoodrich, Uniroyal" repeats on every page (L2654-2655, L3010, L3070, L3143). Car Care Tips has "(No content photos on the page.)" (L3166).
- The news is generic and dated irregularly. "Listing is paginated ("Page 1 of 10")" (L3464). Image upload paths postdate the article dates: article dated "3/24/2025" uses an image in "uploads/2025/10/16/" (L3513-3517), and article "5 Things to Consider" has the slug "What-to-Consider-When-Buying-New-Tires" (L3518-3520).
- **Top fix:** Clear [NDClientName] and the typo, then rewrite the Mobile Service and About pages in the owner's voice (Simon, real jobs, real photos).

### 8. Local SEO: 4/10
- Service titles follow a city+county template, but none mention mobile: "Brake Repair Sunrise, FL Broward County Dade County | Extreme Tires" (L2752), and the same pattern repeats for all 11 (L2765-2911).
- The meta descriptions are templated duplicates and promise prices the site doesn't show: "Our prices on {Service} are going to save you money in Sunrise, FL, Broward County, and Dade County." (L2731-2732)
- Two service pages have no H1: Brake Repair "Headings: no H1." (L2753), Tire Rotation "(no H1)" (L2818).
- NAP and service area are inconsistent. The Yelp listing is split: "https://www.yelp.com/biz/extreme-tires-sunrise and https://www.yelp.com/biz/extreme-tires-davie-4" (L3725). Google is linked through a URL shortener, "https://tinyurl.com/2n45yu3x" (L3041). Hours appear as "[GEOHOURSMONDAY]...[GEOHOURSSUNDAY] unpopulated placeholders" on Contact (L3751) but as real hours on Find Us (L3780-3782). The service area changes from page to page: "Broward, Miami, Boca Raton and Palm Beach" (L2638) vs "Sunrise, Davie, and Pembroke Pines" (L2804). There are no city or service-area pages, and there's "No map iframe on page." (L3786). Schema is not captured in my slice.
- **Top fix:** Make one canonical NAP block with real hours (no GEO tokens), link the real Google Business Profile URL, merge the Yelp listings, and add "Mobile" to the title tags of the service and city pages.

### 9. Technical health: 3/10
- Placeholders render on pages: "Store hours are unpopulated placeholders." (L3019), "[GEO...] hours/location placeholders unpopulated" (L3265), "Fax blank; hours placeholders unpopulated." (L3402-3403), "fax field empty" (L3093).
- There are dead links: the javascript:void videos (L2686-2688), the parked tiresonsite.com H2 (L3251-3252), and the empty Read-Our-Reviews page (L3629).
- The Diagnostic Center and Maintenance Adviser are vendor widgets: "The diagnostic tool is a third-party widget ... it cannot be copied, only rebuilt or linked." (L2996-2997), "The schedule lookup is a third-party widget." (L3057-3058)
- Asset hygiene is poor. "Base path (filenames contain spaces; URL-encode when reusing)" (L3551). The mobile page images are "Extreme Mobile Tire Service Fleet Vans.png" (L3238). Social links carry tracking parameters: "instagram.com/extremetires?igsh=MXM2OHdmMjh4aGxiaA==" (L3042), "youtube.com/@extremetires2010?si=yLcHVsIRjCPt583l" (L3043).
- **Top fix:** In the DNN admin, populate the GEO hours module and set fax to hidden. That one change clears the placeholders across about 6 page types.

### 10. Trust & social proof: 6/10
- The headline stats are strong: "Average Rating 4.9" and "Showing 1-5 of 27 reviews" (L3636-3637). Customers name staff by name (L3707-3708). The alignment page names its equipment: "Uses the Hunter Hawkeye alignment system" (L2771-2772).
- Review velocity is weak. Only two distinct reviews are from 2026 ("Paul Var ... Tue Oct 13, 2026" L3645, "Dawn Rella ... Tue Apr 14, 2026" L3649), and the newest one is duplicated: "Paul Var (duplicate entry), 5/5, Tue Oct 13, 2026: same text as #1" (L3647). Category tags are sparse: "Tire Installation (4), Tire Rotation (1)" (L3637), with none tagged mobile.
- One negative review has no captured reply: "Yukno, 1/5, Mon Dec 30, 2024: "Be careful"" (L3705). At least one other review did get a reply: "business replied with thanks and holiday wishes" (L3660).
- Review collection goes to the on-site widget, not Google: "Submit a review: https://www.extrememobiletires.com/About/Reviews/ctl/WriteReview/..." (L3730). The About page has no staff section, so team bios and photos are not captured. "H2: A Few Words from Our Team" (L3422) is the only team element.
- **Top fix:** Point "Submit a review" at the Google review link, reply to the 1-star, and remove the duplicate Paul Var entry. Then pull the 55 real gallery photos (L3549, L3572) onto the Mobile Service and About pages.

### 11. Offers, coupons & retention: 3/10
- Every coupon is an image, so the terms can't be read as text: "The page shows NO terms or expiry dates in text; coupons are images." (L3329-3330). The Oil Change detail page "returned only the title, no terms/expiry" (L3331).
- Only 2 of the 11 offers are the shop's own (Alignment with purchase, Oil Change Special), and neither has a stated value. The other 9 are manufacturer rebates that link off-site (L3341-3373).
- One coupon looks old. The Alignment coupon image is "https://c1.nd-cdn.us/1469-2024319114539 Alignment with purchase.jpg" (L3344-3345). Its filename appears to encode 2024-03-19, while the rest follow the "1214-2026..." pattern (L3347-3373).
- Retention capture is missing: no email or SMS signup appears anywhere in my slice. SMS exists only as a contact preference on the booking form (L2954).
- **Top fix:** Rebuild the 2 shop coupons as HTML text with a dollar value, expiry date and fine print, each with a "text this coupon to me" button that captures the phone number.

### 12. Accessibility, legal & compliance: 4/10
- All the pages exist: "Terms, Privacy, Accessibility, Sitemap (/terms, /privacy, /accessibility, /sitemap.aspx)" (L2982), plus a TrustArc privacy-choices icon (L2742-2743). The privacy policy covers "SMS (HELP/STOP); CCPA/CPRA section" (L3856), "Last updated: March 14, 2025" (L3857).
- It's vendor boilerplate with the wrong entity and jurisdiction: "ownership (LeadVenture Inc. or Extreme Tires - (Davie, FL))" and "Delaware governing law" (L3832-3835). The terms say "under 13 excluded" (L3834) but the privacy policy says "Children Under Sixteen" (L3847). Terms "Last updated: October 2024" (L3836).
- The accessibility statement is a vendor template with no WCAG level. "As a dealer serving the public good..." and "compliant with W3C standards for HTML and CSS." (L3870-3874). Feedback goes to the vendor: "feedback by emailing website partner" (L3876-3877).
- Image text is weak. "Captions = same as filename (without extension)." (L3570) and "(Items 32-41 other than 35 have bare numeric captions.)" (L3609). Two service pages are missing H1s (L2753, L2818). There is a good example to copy: the lift-kit alt text, "Trucks inside the service garage at Extreme Tires in Sunrise, Florida..." (L2892-2893).
- **Top fix:** Draft shop-specific Terms and Privacy for a Florida business, with one consistent age threshold, and have counsel review them (the kit already advises this at L3819-3823). Rewrite the accessibility statement with a WCAG 2.2 AA target and a shop contact for feedback.

---

## (a) Critical bugs (visibly broken now)
1. The Mobile Service H2 "We Offer Mobile Tire Service" links to tiresonsite.com, which "appears to be a parked/for-sale domain" (L3206, L3251-3252). This is the differentiator's main page.
2. The About > Reviews nav link (/About/Read-Our-Reviews, L3883) shows "ZERO reviews" (L3629) and carries a Davie title (L3628).
3. Nine "Watch Video" buttons on the Services page are "javascript: void placeholders" (L2686-2688).
4. Unpopulated "[GEOHOURSMONDAY]...[GEOHOURSSUNDAY]" hours render on Contact (L3751), plus GEO placeholders on Diagnostic (L3019), Mobile (L3265) and Coupons (L3403).
5. "[NDClientName]" shows on Brake Repair (L2756-2757).
6. The newest review (Paul Var, Oct 13 2026) appears twice on page 1 (L3645-3647).
7. Brake Repair and Tire Rotation have no H1 (L2753, L2818).

## (b) Quick wins under 1 hour
- Delete or retarget the tiresonsite.com link (L3206).
- Repoint the nav Reviews link to /About/Reviews (L3632) and 301 /About/Read-Our-Reviews.
- Remove the 9 "Watch Video" buttons, or link them to the 4 YouTube IDs already on the site (L3300-3305).
- Fill the GEO hours module and hide the empty fax field (L3093, L3402).
- Replace "[NDClientName]" with "Extreme Tires" and fix "surounding" (L2756, L2810).
- Change the logo alt from "Extreme Tires - (Davie, FL)" to Sunrise (L3616).
- Delete the duplicate Paul Var review (L3647) and reply publicly to the 1-star (L3705).
- Change "Submit a review" to the Google review URL (L3730) and swap the tinyurl for the real GBP link (L3041).
- Strip the igsh/si tracking parameters from social links (L3042-3043).
- Add "Mobile service at my location" to the booking dropdown (L2947-2948).
- Fix the Schedule meta "Quick, easy booking 24/7" to match the 24-hour callback reality (L2929-2930, L2940-2941).
- Add H1s to Brake Repair and Tire Rotation.
- Add titles to the 4 videos and a meta description to the videos page (L3275, L3298).
- Remove or replace the googleplus.png review icon (L3720).
- Remove "new" from the mobile oil change copy (L3219).

## (c) Services offered and current coupons

**11 service categories** (L2632-2633, L2661-2684): Brake Repair; Custom Wheels; Lift Kits (incl. leveling kits, L2878); Oil Changes (in-shop and mobile; conventional, synthetic blend, full synthetic, L2898-2903); Suspension Repair; Tire Balancing (high-speed, mobile and in-shop, L2833-2836); Tire Installation; Tire Repair; Tire Rotation; TPMS Service (diagnostics, repair, maintenance, L2913); Wheel Alignments (Hunter Hawkeye, mobile offered, L2771-2772).

**Sub-services and capabilities named:**
- Repair and mobile: "Flat tire repair; Tire rotation; Tire mounting; Tire balancing; Mobile tire repair; Roadside tire repair" (L2790), plus patching, plugging and sealing (L2787). Mobile Tire Mounting, Mobile High-Speed Balance, Mobile Tire Repairs and mobile oil change (L3208, L3219).
- Specialty work: "specializes in low-profile tire installations and custom wheels" (L2641); custom wheel procurement and install "at our shop or at your location" (L2861); lifted and lowered vehicle alignments (news, L3507-3508); "sports cars, luxury vehicles and tractor trailers" (L2638).
- Vehicle types in the gallery: RV, semi, boat trailer, golf cart and travel bus (L3583-3607).
- Online tools: Diagnostic Center and Maintenance Adviser (L2989, L3050).

**Featured wheel brands** (L2864-2865): Advanti, American Force, Gear Alloy Wheels, Mickey Thompson, Monster, Ultra Motorsports, Walker Evans, The Western Wheels.

**Coupons (11)** (L3341-3373). No terms or expiry are captured in text for any of them (L3329-3332).
| # | Offer | Link | Notes |
|---|---|---|---|
| 1 | Alignment with purchase | /Services/cat/wheel-alignments | Value not stated. Image filename "1469-2024319114539" suggests March 2024 |
| 2 | Oil Change Special | PreviewCoupon.aspx?couponId=110827 | Value not stated. Detail page shows title only |
| 3 | BFGoodrich $80 Rebate | c1.nd-cdn.us/PDFs/36291BFGoodrich-info2.jpg | |
| 4 | Cooper $70 Rebate | c1.nd-cdn.us/PDFs/13870cooper-info-2.jpg | |
| 5 | Goodyear $100 Rebate | c1.nd-cdn.us/PDFs/53687goodyear-info.jpg | |
| 6 | Michelin $80 Fall Promotion | c1.nd-cdn.us/PDFs/86101michelin-info.jpg | |
| 7 | Mickey Thompson $100 Rebate | mickeythompsontires.com/offer/ | |
| 8 | Bridgestone $80 Rebate | bridgestonerewards.com | |
| 9 | Firestone $70 Rebate | firestonerewards.com | |
| 10 | General Tire $90 Fall Rebate | GT26_Promo-2_RebateForm PDF | |
| 11 | Kumho $80 Rebate | kumhotireusa.com/rebates-and-promotions/131 | |

The kit says the coupons are "dated fall 2026 per image filenames (Aug-Oct 2026); verify currency before reuse." (L3331-3332).

## (d) Review stats and named staff
- **Count and rating:** 27 entries (26 distinct), 4.9 average, all 5/5 except one 1/5 (L3636-3641). Spread over Dec 31 2020 (L3703) to Oct 13 2026 (L3645). The 1-star is dated Dec 30 2024 (L3705). Distinct reviews by year from the captured list: 2026: 2, 2025: 3, 2024: 5 (incl. the 1-star), 2023: 4, 2021: 11, 2020: 1 (26 total). Only 2 reviews have been added in the last 12 months.
- **Service tags:** Tire Installation (4), Tire Rotation (1) (L3637).
- **Owner replies:** one reply captured, on John's Dec 2024 review (L3660). No reply captured on the 1-star.
- **Off-site counts** (Google, Yelp, Facebook): not captured.
- **Staff named by customers** (L3708): Jason (counter), Adam, Alvaro, AV, Pete, Simon (owner), Carlos, Jeremy, Kenneth, Shawn.
- **Strong quotes to reuse** (exact as captured): "WOW.GREAT SERVICE.SHAWN CAME OUT LATE FRIDAY AFTERNOON" (8 tires on 4 trucks in about 1 hr 20 min, L3686-3687); "i used their mobile service for tire installation and couldn't be happier." (L3657-3658); "They have a customer for life!" (L3670).

## (e) How well Schedule a Repair works
**Grade: weak (about 4/10).**

What's good:
- One central URL, linked from every service page (L2738).
- A dropdown that includes "I'm not sure" (L2947).
- A free-text message field (L2949).
- Two preferred time slots (L2951).
- An SMS contact preference (L2954).

Problems:
1. It's a request, not a booking. "does not guarantee the chosen time; ... will contact the customer within 24 hours" (L2940-2941). The meta still promises "Quick, easy booking 24/7" (L2930).
2. There's no mobile or at-my-location choice, even though mobile is the differentiator (L2947-2952).
3. It's long and partly pointless. A single-shop business requires a "location selection (required)" plus a location search and geolocation (L2951-2952), alongside 5 vehicle fields and 7 personal fields (L2950-2953).
4. The year range "2027 back to 1980" (L2950) excludes the classics in the gallery, such as the El Camino (L3562) and the classic blue truck (L3600).
5. Contact Us is a separate form with CAPTCHA, where "Email Address (required)" but Telephone is optional (L3749). For a phone-first service, that's backwards.
6. What happens after submission (confirmation page, email or SMS confirmation) and the Request Quote (/Tires/Advanced-Quoting) flow are not captured.

## (f) What the kit's 4.8/10 scoring got wrong or missed
1. **Missed: the parked-domain link on the Mobile Service H2** (L3206, L3251-3252). It isn't in the "Content problems" list (L233-244) or the Technical rationale (L53), and it's arguably the worst trust bug on the most important page.
2. **Missed: the javascript:void "Watch Video" buttons** (L2686-2688) and the empty /About/Read-Our-Reviews page that the nav uses (L3629, L3883).
3. **Missed: the booking form has no mobile option**, and the "24/7 booking" meta contradicts the 24-hour callback (L2930, L2940-2941, L2947-2952). The Conversions rationale (L49) doesn't mention the booking flow at all.
4. **Contradiction about coupons.** Line 49 says "coupons with no deadlines", but L218 and L3329-3330 say terms and expiry are baked into images and not captured. The accurate claim is that deadlines aren't stated in text.
5. **The "fall 2026" coupon dating is not fully right.** The Alignment coupon filename "1469-2024319114539" (L3344) suggests 2024, which contradicts L3331-3332.
6. **Trust at 7.0 is a bit generous.** It counts "27 reviews at a 4.9 average" (L37) but ignores velocity (2 reviews in the last 12 months), the duplicate top review, the unanswered 1-star, the on-site-only review collection (L3730), the Google+ icon (L3720) and the tinyurl Google link. It also underuses the real strengths: 55 gallery photos (L3549, L3572) and the Hunter Hawkeye system (L2771-2772). On balance I score it 6.
7. **SEO misses:** no H1 on 2 service pages (L2753, L2818); templated duplicate meta descriptions that claim savings on prices the site doesn't show (L2731-2732); no "mobile" in the service titles; split Yelp listings (L3725); service-area wording that changes by page (L2638 vs L2804).
8. **Legal and accessibility aren't scored at all** in the kit's five categories. It misses the "Davie, FL" and LeadVenture ownership language with Delaware law (L3832-3835), the conflicting under-13 vs under-16 thresholds (L3834 vs L3847), accessibility feedback routed to the vendor with no WCAG level (L3870-3877), and filename or numeric image captions (L3570, L3609).
9. **Retention is not called out.** There's no email or SMS capture in any page of this slice. The kit mentions "no email capture" (L49) but doesn't score retention separately.
