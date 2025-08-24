// script.js
(() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* -------------------------------------------------------
   * 1) Footer year
   * ----------------------------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
   * 2) Active nav backup (if aria-current not present)
   * ----------------------------------------------------- */
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const isMatch =
      (path === '' && href.endsWith('index.html')) ||
      path === href;
    if (isMatch) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('is-active');
    }
  });

  /* -------------------------------------------------------
   * 3) Abstracts (<details class="abstract">)
   *    - Only one open at a time
   *    - Esc closes any open
   * ----------------------------------------------------- */
  // When any abstract toggles open, close others
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.matches('details.abstract') && d.open) {
      $$('details.abstract[open]').forEach(other => {
        if (other !== d) other.open = false;
      });
    }
  }, true);

  /* -------------------------------------------------------
   * 4) Thumbnails (CSS-only zoom via <details class="thumb">)
   *    - Only one open at a time
   *    - Click outside closes
   *    - Esc closes
   *    Markup expected:
   *      <details class="thumb">
   *        <summary><img class="paper__thumb" ...></summary>
   *      </details>
   * ----------------------------------------------------- */
  const closeAllThumbs = () => {
    $$('details.thumb[open]').forEach(d => { d.open = false; });
  };

  // When a thumb opens, close other thumbs
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.matches('details.thumb') && d.open) {
      $$('details.thumb[open]').forEach(other => {
        if (other !== d) other.open = false;
      });
    }
  }, true);

  // Click outside any thumb closes all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('details.thumb')) {
      closeAllThumbs();
    }
  });

  // Esc closes thumbs and abstracts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllThumbs();
      $$('details.abstract[open]').forEach(d => { d.open = false; });
    }
  });

  // Small a11y nicety: make summaries act like buttons
  $$('details.thumb > summary').forEach(s => {
    s.setAttribute('role', 'button');
    s.setAttribute('aria-label', 'Toggle image zoom');
  });
})();
