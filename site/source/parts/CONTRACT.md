# Extreme Tires v6 — page-module contract (read fully before building)

You are building part of ONE static prototype site for **Extreme Tires** (mobile tire service + tire shop, Sunrise FL).
Base files (read them first): `../template.html` (CSS tokens + existing Home/Tires/Mobile/Quote pages, router, JS helpers) and `../build6.py`.
Deliver ONLY your own files: `parts/<letter>.html`, `parts/<letter>.css`, `parts/<letter>.js`. **Never edit template.html or other agents' files.**

## Look & feel (already set in template.html — reuse, don't redefine)
Black / signal red / white, yellow accent. Fonts: **Montserrat** (display, var(--display)) + **Inter** (body, var(--body)).
Tokens: --ink --char --red --red-deep --yellow --paper --mist --steel --line, --ease.
Reuse existing classes: `.wrap` `.phead` (dark page header with breadcrumbs `.crumbs`, h1, p, `.sample-note`) `.eyebrow` `.sec-head` `.btn .btn-red/.btn-dark/.btn-ghost` `.btns` `.card` `.f` (form label) inputs/selects/textarea (already styled) `.err` `.zipres` `.svc-grid .svc` `.offer-grid .offer` `.finance` `.faq details/summary` `.slot` `.lift-grid .lift` `.how-grid` `.combo` `.club` `.opts .opt` `.windows` `.cities` `.tags`. Icons: `<svg aria-hidden="true"><use href="#i-brake"/></svg>` ids: brake wheel lift oil susp align balance install repair rotate tpms pay van.
Type scale (Montserrat is wide): h1 `clamp(32px,4.6vw,58px)`, h2 `clamp(26px,3.2vw,40px)`, h3 20–26px, body 16px. Section padding ≈ 56–64px. Mobile-first: works at 400px, no horizontal scroll, ≥16px gutters (`.wrap` handles it), tap targets ≥44px.
New CSS: prefix EVERY new class with a short unique prefix for your view (e.g. `wh-`, `sv-`) to avoid collisions. Use tokens, no hard-coded off-palette colors. Motion: subtle only; respect `prefers-reduced-motion`.

## Page markup contract
Each page is a section: `<section id="view-NAME" data-view="NAME" hidden> … </section>` (all start `hidden`). Start with a `.phead` (breadcrumbs "Home / Page"). Exactly one `<h1>`. Real headings hierarchy. Alt text/aria labels. Every interactive control needs a visible focus state (already global).
Links between pages: `<a href="#NAME" data-view-link="NAME">` or with param `<a href="#service/brake-repair" data-view-link="service" data-param="brake-repair">`. Optional `data-anchor="elementId"` scrolls to an id after switching. Quote pre-select: `data-svc="Service Label"` on a link to `quote`. Never use `javascript:` hrefs. External links: `target="_blank" rel="noopener"`.
**View ids (fixed, shared by all agents):** home tires mobile quote (exist) + wheels services service(param) schedule advisor commercial brands brand(param) tips tip(param) coupons financing reviews about locations contact gallery cities city(param) terms privacy accessibility sitemap notfound.
Param pages = ONE section with a container; render from a data table in your JS: `ET.onShow.service=function(param){ …render into container… }` (called every time the page is shown; unknown/empty param → friendly not-found state with link back to the hub). Slugs are fixed:
- service: brake-repair wheel-alignment tire-installation tire-repair tire-balancing tire-rotation suspension-repair oil-changes tpms-service custom-wheels lift-kits
- city: sunrise plantation tamarac lauderhill weston davie coral-springs pembroke-pines fort-lauderdale hollywood miramar boca-raton miami-gardens hialeah
- brand: michelin bfgoodrich uniroyal cooper firestone bridgestone hankook hercules kumho general continental pirelli nexen nitto toyo falken yokohama ironman ohtsu
- tip: your slugs (tire care + car care articles)

## JS contract (your `parts/<letter>.js`)
It is auto-wrapped in an IIFE + try/catch and runs AFTER the main script. Globals available: `window.ET` = { show(view,anchor,param), setHash, hasView, esc(str), money(n), county(zip)→'Broward'|'Miami-Dade'|'Palm Beach'|''|null, icon(id)→svg html, SERVICES, STORE (storefront photo data-URI), GALLERY, IGCATS, onShow{}, pages[], reduce }.
Register jump-menu entries: `ET.pages.push({id:'wheels',label:'Wheels'})`; for param pages push one sample: `{id:'service',param:'brake-repair',label:'Service: Brake Repair'}`.
Forms: handle `submit` with `preventDefault()`, validate (same friendly messages style as the Quote form), then show an inline confirmation that says "Prototype only, nothing was sent." Never claim a message was sent.
Escape any dynamic text with ET.esc. No external network calls. No external images (only inline SVG/CSS, or ET.STORE for the storefront photo; use `background-position` / `object-position` crops for variety).

## HONESTY RULES (non-negotiable)
1. **Never invent**: prices, fees, policies, warranties, guarantees, coupon values, rebate amounts, review text/names, testimonials, awards, certifications, staff bios, news events, install durations, customer counts. Where content depends on the shop, use an obvious placeholder (`$XX`, `X hrs`, "Simon to confirm") inside a visible yellow `.sample-note` or `.sample` tag so a reader can't mistake it for fact.
2. Allowed facts only (below). Everything else is placeholder or generic, widely-true advice.
3. No medical/legal claims. Never say "best", "#1", "guaranteed", "lowest price" etc.
4. Don't publish personal emails or passwords. Contact forms never show an email address.
5. Legal pages: outline/draft only, with a visible banner: "Draft structure for attorney review. Not final legal text."

## FACTS you may use
- Business: **Extreme Tires** (also "Extreme Mobile Tires"). Tire shop + **mobile tire service**. 7712 West Oakland Park Blvd, Sunrise, FL 33351. Phone (954) 773-1896. Hours Mon–Fri 8:00 AM–6:30 PM, Sat 8:00 AM–4:00 PM, Sun closed. Copyright 2007–2026. Service area: Broward, Miami-Dade and Palm Beach counties. Coordinates 26.0928,-80.238.
- Socials: facebook.com/Extremetires · instagram.com/extremetires · youtube.com/@extremetires2010 (also Threads, TikTok — no URLs known).
- Equipment: Hunter Engineering alignment (Hawkeye). Mobile van does: tire installation, high-speed balancing, repairs/roadside flat repair, oil changes. Shop does everything incl. alignment, brakes, suspension, TPMS, lifts/leveling kits, custom wheel sourcing. Also fleet/commercial work (RVs, semis, boat trailers, golf carts, a bus appear in their work gallery).
- Tire brands: Michelin, BFGoodrich, Uniroyal, Cooper, Firestone, Bridgestone, Hankook, Hercules, Kumho, General, Continental, Pirelli, Nexen, Nitto, Toyo, Falken, Yokohama, Ironman, OHTSU (+ Goodyear, Mastercraft, Kelly, Dunlop logos on old site). 27 wheel brands incl. Mickey Thompson, Advanti, Worx.
- Financing: Kafene lease-to-own, application link https://application.kafene.com/applications/new (do not state terms, rates, approval times, amounts).
- Reviews (third-party aggregators, Oct 2026): Birdeye 4.7★ from 1,319 · Chamber of Commerce 4.6★ from 542 · MapQuest 4.4★ from 109 · Yelp 4.2★ from 106. Customers most often mention pricing, speed, friendly staff, mobile service, lift & wheel work. Google review link: https://www.google.com/maps/search/?api=1&query=Extreme+Tires+7712+W+Oakland+Park+Blvd+Sunrise+FL
- Staff names customers mention (first names only, roles unconfirmed except Simon = owner, Jason = counter): Simon, Jason, Adam, Alvaro, Pete, Carlos, Jeremy, Kenneth, Shawn, Ryan.
- Existing placeholders in the prototype: install $25/tire, FL $1/tire fee, 7% tax (sample pricing only).

## How to test (required)
`cd /tmp/claude-0/-home-user-swarm-hq/5b315b9d-531a-53d8-9091-103f4a3c4fbc/scratchpad/proto`
`python3 build6.py --parts <letter> --out parts/test-<letter>.html`
Then Playwright (node, `require('/opt/node22/lib/node_modules/playwright')`, `chromium.launch({executablePath:'/opt/pw-browsers/chromium'})`): open `file://…/parts/test-<letter>.html#viewname` (or `#service/brake-repair`), at 1440×900 and 400×844, take full-page screenshots, READ them and fix visible problems; assert `document.documentElement.scrollWidth <= innerWidth`, zero console/page errors, every param slug renders, forms validate + show the prototype-only confirmation. Fonts load from Google Fonts in this sandbox; don't change them.
When done reply in ≤200 words: view ids built, params, what's interactive, placeholders needing Simon/Melissa, anything you couldn't finish. Do not paste code.
