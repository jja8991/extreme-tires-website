# Review-photo sync (Google reviews -> website gallery)

The gallery's **Customer photos** filter reads `site/media/reviews/gallery.json`. Adding photos = appending to that file + dropping WebP files next to it. No site code edit needed.

1. Open the Google Maps listing (Extreme Mobile Tires, 7712 W Oakland Park Blvd), Reviews tab, sort **Newest**.
2. Run `harvest.js` in the page; save its output as `harvest.json`.
3. `python3 -I review-sync/sync_review_photos.py harvest.json` (`--dry-run` to preview).
   - skips anything already in the gallery (dedupe by Google photo id)
   - skips ids listed in `skip.json` (photos a human rejected)
   - strips metadata/GPS, resizes to 1200px WebP, credits reviewer as "First L."
4. Commit + push `site/media/reviews/` -> Vercel redeploys.

To remove a photo for good: delete its item from `gallery.json` and add its `token` to `skip.json`.
Log: `sync-log.txt`. Photos belong to the reviewers; keep the credit + the "See our Google reviews" link.
