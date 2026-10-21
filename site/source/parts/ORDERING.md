# Sitewide re-ordering pass: customer journey + conversion rules

Goal: on EVERY page a customer finds what they need fast and the next step to book/buy/call is always obvious. You own the same page files as before (parts/<letter>.html/.css/.js). Do NOT edit template.html, build6.py, other agents' files, or the shared Home/Tires/Mobile/Quote pages (the lead is doing those).

## What the lead already added (don't duplicate)
- Red **"Book Now"** button in the header; "Book in 60 seconds" first in the mobile menu.
- A shared closing **"Ready when you are" CTA band** (Book in 60 seconds / Request a quote / Call) is auto-appended to the END of every page EXCEPT: home, quote, schedule, contact, notfound, terms, privacy, accessibility, sitemap. So do NOT build your own closing "ready to book" band on pages that get it — remove yours if you have one so there aren't two. Pages without the band (schedule, contact, legal, sitemap, 404) should end naturally.
- Sticky Call / Text / Get a Quote bar on phones.

## Ordering rules (apply to each of your pages, top to bottom)
1. **Above the fold** (first ~700px at 1440 and the first phone screen): H1, ONE sentence of value, ONE primary red CTA, plus phone/text as secondary. No block of background copy before the action.
2. **Answer the visitor's first question next**: what is it / what do I get / is it available to me (mobile vs shop, coverage, price placeholder).
3. **Put the doing before the reading**: forms, finders, checkers, calculators, pickers and "book" actions go ABOVE explainer/reference content. Long explainers, specs, history and legal-ish detail go lower.
4. **Proof next to action**: put a compact trust element (rating line / "4.7★ from 1,319 reviews" using the contract's aggregator numbers / Hunter alignment / mobile + shop) near the primary CTA, not buried at the bottom.
5. **FAQ near the bottom** (just above the shared CTA band); **related links** (next steps) right before it, so there are no dead ends.
6. **One red button per screen**: a page can have several CTAs, but only the primary action is `.btn-red`; secondary = `.btn-dark`/`.btn-ghost`. Never two competing red buttons in the same viewport.
7. **Scannability**: sections ≤ ~3 per screen on mobile, short intros (≤2 lines), headings that state the benefit, consistent order across sibling pages (all service pages same order, all brand pages same order, all city pages same order, all tips same order).
8. **Mobile**: primary CTA reachable without scrolling past a wall of text; tables → stacked cards; tap targets ≥44px.
9. Keep honesty rules (placeholders stay labeled). Don't change facts. **Keep every element id and every existing link/hook working** (other pages link to your ids; param pages' ET.onShow hooks must still render). Don't rename view ids or slugs.

## Deliver
1. Re-order/trim your pages; remove duplicated or redundant blocks (say what you removed).
2. Test with: `cd /tmp/claude-0/-home-user-swarm-hq/5b315b9d-531a-53d8-9091-103f4a3c4fbc/scratchpad/proto && python3 build6.py --parts <letter> --out parts/test-<letter>.html` then Playwright screenshots at 1440 and 400, READ them. Also confirm no overflow, no console errors, one h1 per page.
3. Reply in ≤150 words: for each page, the new section order (comma-separated) and anything removed/moved. No code.
