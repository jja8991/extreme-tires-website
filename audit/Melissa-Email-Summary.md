# Batch A: Melissa's latest website-change requests and mockups (Gmail read-only)

Scope, per Justin: only Melissa's most recent messages about changing the website, and the mockups. Non-website threads get one line each.

Saved mockups (downloaded from Melissa's Google Drive, which Justin's account can open) are in:
`/tmp/claude-0/-home-user-swarm-hq/5b315b9d-531a-53d8-9091-103f4a3c4fbc/scratchpad/melissa/mockups/`

---

## Current site, platform and vendor

- **Current site URL:** https://www.extrememobiletires.com/
  - This is the domain in Melissa's signature and the one she wants everything to point to.
  - She also wants www.extremetireshop.com to redirect to it.
- **Platform today: NetDriven / LeadVenture.** Melissa's design is "Prepared as the working specification for NetDriven."
  - Kyle (NetDriven) says the agreement "runs until April 30th."
  - Melissa: "Simon gave him a call and we're currently waiting on a pay-out quote to end the contract earlier."
  - On Oct 20 she postponed NetDriven's Reputation Management onboarding "until further notice."
  - So the site change is moving away from NetDriven, with Justin doing the redesign. The emails don't say what the new host will be.
- **Domain:**
  - extrememobiletires.com was transferred from DS Domains / Dealer Spike to Extreme's GoDaddy (account under tiredroponline@gmail.com) on Oct 15.
  - "They still control the DNS with CloudFlare protection."
  - Melissa's Oct 20 plan:
    1. Add the domain to Extreme's own Cloudflare.
    2. Keep the M365 MX, CNAME and TXT records as DNS-only.
    3. Switch the nameservers.
    4. Re-verify in M365.
  - She wrote: "Might need Justin help with this later."
- **Shopify:** "Domain Host Shopify… BASIC PLAN > ONE MAIN USER PERMITTED > rivvdapparel@gmail.com" (Oct 17). A Shopify store for Extreme Tires & Wheels was mid-setup on Oct 19, with the EIN question unresolved.
- **Tire Guru:** Mitch Tryon (Tire Guru CSM) emailed Justin on Oct 19: "Extreme is adding Tire Match/Service Match widget to your website." He wants a 1-hour kickoff via https://calendly.com/mitch-tryon
- **Omnisend** powers the Request-a-Quote form, SMS/email and push. Melissa: "Using Omnisend."

---

## Website thread 1 (primary): "Extreme Tires Website Redesign Information"
- Thread 1a15948ea2cc64d0. The key message is 1a15948ea2cc64d0, Melissa to Justin, 2026-10-20 12:28Z (08:28 ET). It is her most recent design message.
- CC: Simon (extremetire2010@gmail.com, Simon@extremetireshop.com), onlinesales@extremetireshop.com. Brittney is added on later replies.

### Every website change Melissa asks for (verbatim)
- "This is the website design I proposed. I want it to look more modern, but still have that personal and inviting feel with photos and videos."
- "Prepared as the working specification for NetDriven 🔗 https://lucid.app/lucidchart/69f4cf2c-a4f4-40e0-b8cd-8e4d5a49e675/view"
- "I have photos selected for the Home page and additional photos in the share folder that can be used for other pages."
- "SITE STRUCTURE & COPY" (Drive folder link)
- "This is the video I shared to embed into the background of the header page in the Hero section: https://youtu.be/iV1QXEGjeLg"
- "Some of the inspiration, including for the additional pages, came from the PepBoys website: https://www.pepboys.com/auto-service-repair"
- "There's additional things that I was in the middle of working on with them as well, shown here: _Additional Info.pdf / LANDING-REQUEST-A-QUOTE.png / LANDING-HEADER.png / Using Omnisend."
- "If you need additional information from me to make all this possible, please let me know."

Her later replies in the thread (12:15, 13:14, 13:17 ET) cover email accounts and DNS, not design. The one website-related line:
- "*Web Rerouting is Configured:* www.extremetireshop.com to point directly to www.extrememobiletires.com"
  - A @ to 188.114.96.0 (or 188.114.97.0)
  - CNAME www to www.extrememobiletires.com
  - Her note: "Not sure if it will work, after the DNS transfer… Might need Justin help with this later."

### Requirements written inside _Additional Info.pdf (Melissa's own wording)
- Socials:
  - Facebook https://www.facebook.com/Extremetiresandwheels
  - Instagram https://www.instagram.com/extremetires
  - Threads https://www.threads.com/@extremetires
  - TikTok https://www.tiktok.com/@extremetires
- "Financing Extreme Tires - Sunrise: WEBSITE FORM > Kafene Lease Application" (https://application.kafene.com/applications/new)
- "Wheel Visualizer > Wheel Configurator" (links to https://www.netdriven.com/lp/tire-service-toolkit/)
- "Cookie w-Net Driven Support Alternative ?"
- "Email info@extrememobiletire.com sales@extrememobiletire.com contact@extrememobiletire.com > Email Forwarding for www.extrememobiletires.com/Contact/Find-Us"
- "Integrate Website w-Omnisend > SMS/TEXT & EMAIL"
  - Snippet with brandID 6ac4013571f964d84476ab46 and launcher https://omnisnippet1.com/inshop/launcher-v2.js
  - Placement: "on every page of your website right before the closing </body> tag."
- "HEADER > PRIVATE PAGE FOR LEADS" plus full inline-HTML for the "A BETTER QUOTE STARTS WITH THE RIGHT DETAILS" header (see the LANDING-HEADER mockup below).
- "ADD EMBED FORM AFTER THE HEADER > PRIVATE PAGE FOR LEADS `<div id="omnisend-embedded-v2-6aca69f5d904f7153ac6fb26"></div>`"
- "OMNISEND PUSH NOTIFICATIONS — NEW CODE":
  1. "Turn on push notifications Download a service-worker.js file"
  2. "Upload the service-worker.js file to the root folder of your website"
  3. "Check if the connection is successful"
- "HEADER > BG WHITE | EMBED CODE PROVIDED"
- "FORM OVER GRAY BG WITH SHADOW IF POSSIBLE > EXAMPLE: https://omniform1.com/forms/v1/landingPage/6ac4013571f964d84476ab46/6acabf714c748963b34c52c4"

### All design / mockup links in the email bodies (full URLs)
- Lucidchart spec: https://lucid.app/lucidchart/69f4cf2c-a4f4-40e0-b8cd-8e4d5a49e675/view. Not retrievable here; it needs a Lucid login. Open it in a browser.
- SITE STRUCTURE & COPY: https://drive.google.com/open?id=1HnGRjfEjjAAK2t9IurfbZ2Sel3uwfun8. This is a Drive folder and **it is empty** (no files inside, created 2026-09-16).
- _Additional Info.pdf: https://drive.google.com/open?id=1rRQWtN-2C33e-TNKOu1V6Edz6SQhSvNw
- LANDING-REQUEST-A-QUOTE.png: https://drive.google.com/open?id=1zMC-NNq2LLv574FtskVu_sY7s7DpVqcV
- LANDING-HEADER.png: https://drive.google.com/open?id=1lQwEa72ea_ZYBI21Y8OkXYIYkGt02j9R
- Hero video: https://youtu.be/iV1QXEGjeLg
- Inspiration: https://www.pepboys.com/auto-service-repair
- No Canva, Figma or Dropbox links appear in any of the 8 threads.

### Gmail attachments on her messages in this thread (none are design mockups)
- Gmail returns attachment filename, mimeType and id, but no per-attachment size and no file bytes. FULL_CONTENT only gives inline `cid:` references, and this connector has no attachment-download tool. So these could not be saved.
- The image attachments are M365 email/2FA setup screenshots.

| Message id | Filename | mimeType | Attachment id (prefix) | What the email says |
|---|---|---|---|---|
| 1a15a192de456be3 (12:15 ET) | TireDrop Microsoft Login Authenticator.png (x2) | image/png | ANGjdJ8bUN4Rh…, ANGjdJ_jSFPj… | Tire Drop M365 Authenticator setup |
| 1a15a192de456be3 | TireDrop Email Set-up.png (x2) | image/png | ANGjdJ8gZZCP…, ANGjdJ_a76_C… | info@tiredroponline.com setup |
| 1a15a192de456be3 | RIVVD Microsoft Login Authenticator.png (x2) | image/png | ANGjdJ-XwTgh…, ANGjdJ-j37MM… | RIVVD Authenticator setup |
| 1a15a192de456be3 | RIVVD Email Set-up.png (x2) | image/png | ANGjdJ-pMDzM…, ANGjdJ_Qr4GJ… | info@rivvd.com setup |
| 1a15a4f3f6983015 (13:14 ET) | the same 4 PNGs re-quoted | image/png | ANGjdJ82nDro…, ANGjdJ-6Bhm8…, ANGjdJ-9_u0b…, ANGjdJ8OI-iX… | (quoted) |
| 1a15a4f3f6983015 | extremetireshop domain - Microsoft 365 admin center.pdf | application/pdf | ANGjdJ-EXGzn… | "Records attached": the DNS records for extremetireshop.com |
| 1a15a519f143facf (13:17 ET) | the same 4 PNGs re-quoted + image.png | image/png | ANGjdJ_HTovs…, ANGjdJ8lTS1C…, ANGjdJ_ahUPV…, ANGjdJ9o91nD…, ANGjdJ8-rZJP… | image.png sits under the "Microsoft 365 admin center" link |

Message sizeEstimates: 1a15a192de456be3 is about 5.58 MB, 1a15a4f3f6983015 about 2.90 MB, 1a15a519f143facf about 2.88 MB. (Note: the 12:15 message contains M365 Authenticator secret keys in plain text; they are not reproduced here.)

---

## Website thread 2: "NETDRIVEN WEBSITE ASSETS"
- Thread 1a155a04c8c8a651. Melissa to Justin, 2026-10-19 19:25Z, with follow-ups to Oct 20 00:18Z.
- Change requested: none beyond sharing the asset folder, "NetDriven Website Assets": https://drive.google.com/open?id=1cLfdES4VfF_MGG6SEFwTpfz_AO3tfyZT
- The follow-ups contain Gmail logins (passwords not reproduced) and two SharePoint marketing sheets. They're not website design. Attachments are image.png on msg 1a155e69c39c8eab ("Connect to rivvdapparel@gmail.com" screenshot) and msg 1a156ad214843461.
- Contents of the Drive folder. I enumerated it and saved the mockups:
  - `02. HEADERS & FOOTER/` contains HEADERS_For Main Pages.png and FOOTER_Extreme Tires.png
  - `LOGO/` contains ET Logo.jpg (21 KB, id 1d2FhKyxmtOVZfnIanjGqCwddfaiin4b0) and ET Logo_90x90.jpg (2.5 KB, id 1_XsXp5QpJSOrAg-jEvDckpl1g5MlZfeN). Not saved locally.
  - Gallery Example.png
  - Extreme Mobile Tires Sitemap Diagram.png
  - SITE STRUCTURE & COPY/ (empty)
  - The Drive listing showed no further files in this folder. The "photos selected for the Home page" Melissa mentions were not found in it.

---

## MOCKUPS: saved files and detailed descriptions

All are owned by melissa.extremetires@gmail.com and come from Google Drive, not Gmail attachments.

### 1. LANDING-REQUEST-A-QUOTE.png
- Drive id 1zMC-NNq2LLv574FtskVu_sY7s7DpVqcV. image/png, 3,761,473 bytes, 2086x5292. Modified 2026-10-10.
- Saved as `mockups/LANDING-REQUEST-A-QUOTE.png`.
- Email context: listed under "additional things that I was in the middle of working on with them… Using Omnisend."
- Full-page landing mockup with rounded card corners on a dark charcoal (#3a3a3a-ish) page background. Top to bottom:
  1. **Top bar (yellow, about #FDD535):**
     - Left: "TIRES · WHEELS · AUTO SERVICE" in small black bold caps.
     - Right: the red "EXTREME TIRES" italic logo badge with a wheel icon.
  2. **Dark hero band (near-black #1c1c1c):**
     - Big condensed white heading "REQUEST A QUOTE" (Anton/Oswald-style condensed sans).
     - Subtext: "Answer a few questions so our team can understand your needs and contact you."
     - Bold "(954) 773-1896" and "7712 West Oakland Park Blvd, Sunrise, FL 33351".
     - Right-aligned "STORE HOURS: Mon–Fri: 8:00 AM–6:30 PM, Sat: 8:00 AM–4:00 PM, Sun: Closed".
  3. **Full-width storefront photo:**
     - Gray Extreme Tires building with a red awning, a red stripe and "EXTREME TIRES" lettering.
     - Two gray lifted Jeep Gladiators on black wheels, blue sky and palms.
     - A thick red rule below the photo.
  4. **Light gray (#ececec) form section:**
     - "What do you need help with?" with sub "A few details now means less back-and-forth later."
     - "SERVICES WE OFFER" dropdown (shown set to "Tire Balancing").
     - Helper line: "Not sure what you need? Request a quote and describe the symptoms. Our team can help you determine the next step."
  5. **Service icon grid (white tiles, red pictogram icons, black bold labels), 6x2:**
     - Row 1: Brake Repair, Custom Wheels Service, Lift Kits, Oil Changes, Suspension Repair, Wheel Alignments.
     - Row 2: Tire Balancing, Tire Installation, Tire Repair, Tire Rotation, TPMS Service, "Shop Now, Pay Later" (cash icon, i.e. financing).
  6. **Contact fields (3-column, underline inputs with red underline):**
     - First name, Last name, Phone number; Email, Location or service area ("City, ZIP, or address"), "When do you need service?" ("Choose timing" dropdown).
     - Red validation text: "Please enter your name." / "This field is required" / "Please select when you need service."
     - Checkbox: "I'd prefer mobile service at my location".
  7. **Dark band heading:** "WHAT IS HAPPENING WITH THE VEHICLE?" in white caps with a red underline.
  8. **4 white icon tiles on charcoal:** Tire Installation, Tire Repair, Lift Kits, Oil Changes. A red rule follows.
  9. **Gray section with 4 checkboxes:**
     - "Flat, leak, or tire damage" / "Need new tires or pricing" / "Vibration, balancing, or rotation" / "Brakes, alignment, suspension, or other service".
     - Textarea "Vehicle and service details" (placeholder "Vehicle year/make/model, tire size, symptoms, or service needed").
  10. **CTA:** full-width muted red (#c0413f) button "REQUEST MY QUOTE" with white outline. Fine print: "Your request starts a quote conversation. Pricing and service recommendations will be confirmed by our team."
  11. **Footer:** black, thin white rule, "Copyright © 2007-2026 Extreme Tires".
- Overall: a red, black, yellow and white palette. Clean sans body text (Avenir/Verdana-like), with condensed display type for the H1.

### 2. LANDING-HEADER.png
- Drive id 1lQwEa72ea_ZYBI21Y8OkXYIYkGt02j9R. image/png, 87,653 bytes, 2112x452. Modified 2026-10-10.
- Saved as `mockups/LANDING-HEADER.png`.
- Email context: listed alongside the Request-a-Quote PNG. The PDF says "HEADER > PRIVATE PAGE FOR LEADS" and "HEADER > BG WHITE | EMBED CODE PROVIDED".
- White background header block for the leads page:
  - A thick red (#FF2400) vertical bar on the left.
  - Red letter-spaced eyebrow "EXTREME TIRES · SUNRISE, FL".
  - Huge black heavy (900-weight Arial/Helvetica) H2 "A BETTER QUOTE STARTS WITH THE RIGHT DETAILS".
  - Gray (#5d6570) body: "Share a few details about your vehicle and service needs so our team can provide a more accurate quote with less back-and-forth."
  - A row of 4 light-gray (#F1F1F1) chips, each with a 4px red left border and bold dark text: "✓ Vehicle year, make & model", "✓ Tire size or wheel details", "✓ Location & vehicle condition", "✓ Preferred timing & urgency".
  - Responsive grid, minmax 220px.
  - The exact HTML is in _Additional Info.pdf page 2-3.
- The Omnisend embed form `omnisend-embedded-v2-6aca69f5d904f7153ac6fb26` goes directly under it, "FORM OVER GRAY BG WITH SHADOW IF POSSIBLE".

### 3. _Additional Info.pdf
- Drive id 1rRQWtN-2C33e-TNKOu1V6Edz6SQhSvNw. application/pdf, 3,538,429 bytes, 5 pages. Google Docs export, modified 2026-10-14.
- Saved as `mockups/_Additional-Info.pdf`.
- Page by page:
  - p1: Additional Info list (socials, financing/Kafene, wheel configurator, email forwarding, Omnisend snippet), with red section labels.
  - p2-3: HEADER HTML code, the Omnisend embed div, and the push-notification steps.
  - p4: "HEADER > BG WHITE | EMBED CODE PROVIDED". Shows the LANDING-HEADER rendering, the "FORM OVER GRAY BG WITH SHADOW IF POSSIBLE" note with the omniform1 example link, and the top half of the Request-a-Quote mockup.
  - p5: the bottom half of the Request-a-Quote mockup.

### 4. HEADERS_For Main Pages.png
- Drive id 1W9wCChAmQfdWGEI0_YcL1J9iBmB4V-5q, in NetDriven Website Assets / 02. HEADERS & FOOTER. image/png, 433,187 bytes, 3471x2476. Modified 2026-09-15.
- Saved as `mockups/HEADERS_For-Main-Pages.png`.
- Header wireframe for the main pages:
  1. **Red utility bar:** "(954) 773-1896" and "7712 West Oakland Park Blvd | Sunrise, FL 33351" in white bold.
  2. **Black nav bar, centered logo split nav:**
     - Left: TIRES, WHEELS (shown as active/hover state, with yellow text on a red box), MOBILE SERVICE.
     - Center: the "EXTREME TIRES / MOBILE TIRE SERVICE" red badge logo.
     - Right: AUTO SERVICE, COUPON, MORE.
     - White uppercase sans throughout.
  3. **Hero split 50/50:**
     - Left: gray image placeholder (mountain/sun icon), i.e. a photo slot.
     - Right: solid red panel with three light-gray placeholder bars (headline, subline, CTA/search).
  4. **Black band** with large bold white "Shop For Brand New Tires" (Montserrat-style heavy).

### 5. FOOTER_Extreme Tires.png
- Drive id 1uX2-P9G5mvGRFo4epqKrW-nvCdOqeN3p. image/png, 857,486 bytes, 3510x2331. Modified 2026-09-15.
- Saved as `mockups/FOOTER_Extreme-Tires.png`.
- Footer design:
  1. **White brand strip** with tire brand logos: Continental, Pirelli, Nexen, Nitto.
  2. **Black footer, 4 columns plus hours** (heavy uppercase headings):
     - **TIRES & WHEELS:** Shop Tires, Shop Wheels, Commercial Tires, Tire Brands, Tire Size, Tire Care Tips.
     - **SERVICES:** Mobile Tire Service, Tire Installation, Tire Repair, Tire Rotation, Tire Balancing, Wheel Alignment, Brake Repair, Suspension Repair, View All Services.
     - **ABOUT & SUPPORT:** About Us, Locations, Reviews, News & Gallery, Coupons, Financing, Contact Us.
     - **VISIT & CONTACT:** PHONE NUMBER (954) 773-1896; OUR LOCATION 7712 West Oakland Park Blvd, Sunrise, FL 33351.
     - **STORE HOURS:** Mon–Fri 8:00 AM–6:30 PM, Sat 8:00 AM–4:00 PM, Sun Closed.
     - **SOCIALS:** Facebook, Instagram, Threads and TikTok icons.
  3. **Bottom bar:** "Copyright © 2007-2026 Terms of Use | Privacy | Your Privacy Choices [toggle icon] | Accessibility | Sitemap".

### 6. Extreme Mobile Tires Sitemap Diagram.png
- Drive id 14-evsVVOUnCgJBWmxtnkMn3z9qbxsD8M. image/png, 1,463,079 bytes, 1536x1024. Modified 2026-09-16.
- Saved as `mockups/Extreme-Mobile-Tires-Sitemap-Diagram.png`.
- Title: "EXTREME MOBILE TIRES — WEBSITE NAVIGATION & SITE STRUCTURE". Dark navy header, red HOME node, and navy column headers on a light background.
- **Top nav:** HOME, TIRES, WHEELS, MOBILE SERVICE, [logo], AUTO SERVICE, COUPONS, MORE ▾.
- **TIRES:**
  - Car, Truck & SUV Tires, with E-COMMERCE: Vehicle Search, Tire Size Search, Filter Results, Tire Product Pages, Add to Cart, Checkout.
  - Commercial Tires, with E-COMMERCE / QUOTE: Product Catalog, Request Quote, Add to Cart (if applicable), Checkout (if applicable).
  - Tire Care Tips: Tire Pressure, Tire Rotation, Tire Balancing, Tread Depth, Alignment, TPMS, Tire Replacement.
- **WHEELS:**
  - E-COMMERCE: Wheel Search, Vehicle / Fitment, Wheel Filters, Wheel Product Pages, Add to Cart, Checkout.
  - Wheel Installation: Installation Services, Fitment Guidance, Service Appointment.
- **MOBILE SERVICE:**
  - Mobile Wheel Service: Tire Installation, Balancing, Repairs, Oil Changes.
  - Extreme Mobile Tires Videos: Service Videos, Customer Stories, How-To Videos.
- **AUTO SERVICE:**
  - Our Services: Brake Repair, Wheel Alignment, Tire Installation, Tire Repair, Tire Balancing, Tire Rotation, Suspension Repair, Oil Changes, TPMS Service, Custom Wheels, Lift Kits.
  - Schedule a Repair: Book Appointment, Service Request.
  - Car Care Tips: Maintenance Tips, Vehicle Care.
  - Diagnostic Center: Diagnostics & Inspections, Check Engine Light.
  - Maintenance Advisor: Service Reminders, Maintenance Schedule.
- **COUPONS:** Current Offers (Tire Specials, Service Specials, Manufacturer Rebates).
- **MORE > ABOUT & SUPPORT:**
  - About Us: Our Story, Our Team, Our Commitment, Why Extreme Tires.
  - Locations: Sunrise Location, Directions, Service Area.
  - Contact Us: Contact Form, Phone / Email, General Questions.
  - Reviews: Customer Reviews, Google Reviews, Leave a Review.
  - Financing: Payment Options, Application, Terms / Disclosures.
  - News & Gallery: News, Gallery, Videos, Tire Tips.
- **Footer notes:**
  - "E-COMMERCE FLOW (TIRES & WHEELS) — Integrated within Tires and Wheels — not a separate navigation item: Search → Filter → Product Page → Add to Cart → Checkout."
  - "KEY NOTES: E-commerce functionality is integrated into the Tires and Wheels sections. The primary navigation remains compact and clean. 'More' houses the About & Support section (including News & Gallery). This structure supports a seamless shopping experience and strong SEO."
  - Tagline: "EXPERIENCE CONVENIENCE".

### 7. Gallery Example.png
- Drive id 1dFBnotIiE-xgVPQIEpNgTH5WE8m4eOHh. image/png, 540,703 bytes, 476x633. Modified 2026-09-16.
- Saved as `mockups/Gallery-Example.png`.
- A reference for the gallery page:
  - Red header band with white bold-italic "Gallery".
  - Dark diamond-plate texture background.
  - A 4-column x 5-row grid of rounded-corner photos of customer vehicles with custom wheels and lifts, outside a shop. The cars include trucks, Jeeps, a Mustang, a Camaro and a Charger.
  - Note: the shop in these photos shows another business's signage, so it's an inspiration example, not Extreme's own photos.

Not saved: ET Logo.jpg and ET Logo_90x90.jpg (in the LOGO folder, ids above). They're small and can be pulled the same way if needed.

---

## Non-website threads (one line each)
- 1a15a7d7b30ff634 "Net Driven - Reputation Management": not website design. Melissa postponed NetDriven RepMan onboarding on Oct 20.
- 1a156437ac003750 "Extreme Tires-N-Accessories" (Tire Guru): only relevant as a vendor note. The Tire Match/Service Match widget is coming to the site; book with Mitch at https://calendly.com/mitch-tryon. Not Melissa.
- 1a155eba21becf7d ATD "test creds; SDKs; product file": not website (ATD/supply). The message is encrypted; attachment message_v4.rpmsg.
- 1a155e40fd3e0650 "SHOPIFY SET UP": not website design. Shopify EIN/business-type question, and she later said "Completely disregard."
- 1a14bb5d92aa5868 "LOGIN FOR SHOPIFY + INFO SHEETS": not website design. Shopify logins and marketing sheets; notes "Domain Host Shopify / BASIC PLAN > ONE MAIN USER".
- 1a1420fbecd27e14 "Domain Release": not website design. extrememobiletires.com was transferred to Extreme's GoDaddy; "add protection" to tiredrop.com and extrememobiletires.com.

---

## Batch summary
- **Melissa's latest design direction (Oct 20, 08:28 ET):** "more modern, but still have that personal and inviting feel with photos and videos."
  - The spec is the Lucidchart (it needs a login; not fetched).
  - Hero background video: https://youtu.be/iV1QXEGjeLg
  - Inspiration for the inner pages: PepBoys auto-service-repair.
- **Mockups to build from (all saved locally):**
  - Sitemap/nav: Home, Tires, Wheels, Mobile Service, Auto Service, Coupons, More, with e-commerce inside Tires and Wheels.
  - Main-page header: red utility bar, black split nav with centered logo, image/red split hero, "Shop For Brand New Tires".
  - Footer: brand logos strip, 4-column black footer, socials.
  - Gallery reference.
  - Request-a-Quote leads landing page: yellow, black and red, using the Omnisend form.
  - White landing header with the exact HTML.
- **Features to wire in:**
  - Omnisend site-wide snippet, push service-worker.js at the site root, and embed form.
  - Kafene financing form.
  - Wheel configurator.
  - Tire Guru Tire Match/Service Match widget.
  - Tire and wheel e-commerce flow.
  - Socials.
  - www.extremetireshop.com redirect.
- **Platform:** currently NetDriven/LeadVenture at www.extrememobiletires.com, with an early exit under way (contract to April 30, pay-out quote pending). Melissa wants Justin's help with the Cloudflare DNS cutover.
- **Gaps:**
  - The Lucidchart is login-gated.
  - The "SITE STRUCTURE & COPY" folder is empty.
  - The selected Home-page photos weren't found in the shared asset folder. Ask Melissa for the photos and the page copy.
