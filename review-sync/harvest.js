// Paste into the browser on the Google Maps listing with the Reviews tab open (sort = Newest).
// Scrolls the reviews list, returns JSON [{token,name}] of every review photo found. Feed it to sync_review_photos.py.
(async () => {
  const found = new Map();
  const pane = () => [...document.querySelectorAll('div')].filter(d => d.scrollHeight > d.clientHeight + 200 && getComputedStyle(d).overflowY !== 'visible' && d.querySelector('[data-review-id]')).sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
  const grab = () => document.querySelectorAll('[data-review-id]').forEach(r => {
    const name = ((r.querySelector('.d4r55') || {}).textContent || '').trim();
    r.querySelectorAll('*').forEach(el => {
      const m = (getComputedStyle(el).backgroundImage || '').match(/url\("?https:\/\/lh3\.googleusercontent\.com\/grass-cs\/([^=")]+)/);
      if (m && !found.has(m[1])) found.set(m[1], name);
    });
  });
  let last = -1, stall = 0;
  for (let i = 0; i < 40 && stall < 6; i++) {          // ~40 iterations is plenty for the newest reviews
    grab(); const p = pane(); if (!p) break;
    p.scrollTop = p.scrollHeight - 500; p.dispatchEvent(new WheelEvent('wheel', { deltaY: 600, bubbles: true })); await new Promise(r => setTimeout(r, 600));
    p.scrollTop = p.scrollHeight; p.dispatchEvent(new WheelEvent('wheel', { deltaY: 600, bubbles: true })); await new Promise(r => setTimeout(r, 1400));
    const n = document.querySelectorAll('[data-review-id]').length; stall = n === last ? stall + 1 : 0; last = n;
  }
  grab();
  return JSON.stringify([...found].map(([token, name]) => ({ token, name })));
})();
