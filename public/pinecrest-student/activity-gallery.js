/* Class gallery — reads turn-ins from IndexedDB (same store as activity-turnin.js) */
(function () {
  const DB_NAME = 'pinecrest_activity_turnins_v1';
  const STORE = 'turnins';

  const ACTIVITY_LAYERS = {
    '1': { label: 'Layer 1 · Color Art Lab', href: 'color-art-lab/' },
    '2': { label: 'Layer 2 · Initials on a Grid', href: 'initials-grid/' },
    '3': { label: 'Layer 3 · Flag Challenge', href: 'flag-challenge/' }
  };

  const galleryEl = document.getElementById('submitGallery');
  const totalsEl = document.getElementById('galleryTotals');
  const filterEl = document.getElementById('galleryFilters');
  const modalEl = document.getElementById('galleryModal');
  const modalBodyEl = document.getElementById('galleryModalBody');
  const modalCloseEl = document.getElementById('galleryModalClose');

  if (!galleryEl) return;

  let activeFilter = 'all';

  function layerInfo(level) {
    return ACTIVITY_LAYERS[String(level)] || { label: 'Layer ' + level, href: '#' };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatWhen(ts) {
    return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function openDb() {
    return new Promise(function (resolve, reject) {
      const req = indexedDB.open(DB_NAME, 1);
      req.onerror = function () { reject(req.error); };
      req.onsuccess = function () { resolve(req.result); };
      req.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
    });
  }

  function getAll() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = function () { resolve(req.result || []); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function renderTotals(items) {
    if (!totalsEl) return;
    const counts = { all: items.length, '1': 0, '2': 0, '3': 0 };
    items.forEach(function (item) {
      const k = String(item.level);
      if (counts[k] != null) counts[k]++;
    });
    totalsEl.innerHTML =
      '<div class="submit-total-card"><span class="num">' + counts.all + '</span><span class="lbl">total pieces</span></div>' +
      '<div class="submit-total-card"><span class="num">' + counts['1'] + '</span><span class="lbl">layer 1</span></div>' +
      '<div class="submit-total-card"><span class="num">' + counts['2'] + '</span><span class="lbl">layer 2</span></div>' +
      '<div class="submit-total-card"><span class="num">' + counts['3'] + '</span><span class="lbl">layer 3</span></div>';
  }

  function openModal(item) {
    if (!modalEl || !modalBodyEl) return;
    const info = layerInfo(item.level);
    let html = '<div class="gallery-modal-head">' +
      '<strong>' + escapeHtml(item.studentName) + '</strong>' +
      '<span>' + escapeHtml(info.label) + ' · ' + formatWhen(item.createdAt) + '</span>' +
      '</div>';

    if (item.screenshotDataUrl) {
      html += '<img class="gallery-modal-img" src="' + item.screenshotDataUrl + '" alt="Screenshot by ' + escapeHtml(item.studentName) + '">';
    }

    if (item.codeText) {
      const name = item.codeName || 'code.py';
      html += '<p class="gallery-modal-code-label">' + escapeHtml(name) + '</p>' +
        '<pre class="gallery-modal-code">' + escapeHtml(item.codeText) + '</pre>';
    }

    if (!item.screenshotDataUrl && !item.codeText) {
      html += '<p class="gallery-modal-empty">No screenshot or code stored for this turn-in.</p>';
    }

    html += '<a class="gallery-modal-link" href="' + escapeHtml(info.href) + '">Open ' + escapeHtml(info.label.split(' · ')[1] || 'activity') + ' →</a>';
    modalBodyEl.innerHTML = html;
    modalEl.hidden = false;
    document.body.classList.add('gallery-modal-open');
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove('gallery-modal-open');
    if (modalBodyEl) modalBodyEl.innerHTML = '';
  }

  if (modalCloseEl) modalCloseEl.addEventListener('click', closeModal);
  if (modalEl) {
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function renderGallery(items) {
    items.sort(function (a, b) { return b.createdAt - a.createdAt; });
    if (activeFilter !== 'all') {
      items = items.filter(function (item) { return String(item.level) === activeFilter; });
    }

    galleryEl.innerHTML = '';
    items.forEach(function (item) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-item';
      card.setAttribute('data-level', String(item.level));

      let visual = '';
      if (item.screenshotDataUrl) {
        visual = '<img src="' + item.screenshotDataUrl + '" alt="">';
      } else {
        visual = '<div class="gallery-item-placeholder"><span>{ }</span><small>code only</small></div>';
      }

      const tags = [];
      if (item.hasCode) tags.push('code');
      if (item.synced) tags.push('sent');

      card.innerHTML =
        visual +
        '<span class="gallery-item-layer">L' + escapeHtml(String(item.level)) + '</span>' +
        '<span class="gallery-meta">' + escapeHtml(item.studentName) +
        (tags.length ? ' · ' + tags.join(', ') : '') + '</span>';

      card.addEventListener('click', function () { openModal(item); });
      galleryEl.appendChild(card);
    });
  }

  function render() {
    return getAll().then(function (items) {
      renderTotals(items);
      renderGallery(items);
    }).catch(function () {
      galleryEl.innerHTML = '';
    });
  }

  if (filterEl) {
    filterEl.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter');
      filterEl.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render();
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) render();
  });

  render();
})();
