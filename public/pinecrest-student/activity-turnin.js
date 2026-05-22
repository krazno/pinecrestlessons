/* Activity turn-in — IndexedDB + optional Formspree (per activity page) */
(function () {
  const ACTIVITY_SUBMIT = window.ACTIVITY_SUBMIT || { formspreeId: '' };
  const TURNIN = window.ACTIVITY_TURNIN || {};
  const fixedLevel = TURNIN.level != null ? String(TURNIN.level) : null;

  const ACTIVITY_LAYERS = {
    '1': 'Layer 1 · Color Art Lab',
    '2': 'Layer 2 · Initials on a Grid',
    '3': 'Layer 3 · Flag Challenge'
  };

  function activityLayerLabel(level) {
    return ACTIVITY_LAYERS[String(level)] || ('Layer ' + level);
  }

  const DB_NAME = 'pinecrest_activity_turnins_v1';
  const STORE = 'turnins';
  const NAME_KEY = 'pinecrest_student_name';

  const nameInput = document.getElementById('turninName');
  const levelSelect = document.getElementById('turninLevel');
  const screenshotInput = document.getElementById('turninScreenshot');
  const codeFileInput = document.getElementById('turninCodeFile');
  const codePaste = document.getElementById('turninCodePaste');
  const screenshotBox = document.getElementById('turninScreenshotBox');
  const codeBox = document.getElementById('turninCodeBox');
  const screenshotNameEl = document.getElementById('turninScreenshotName');
  const codeFileNameEl = document.getElementById('turninCodeFileName');
  const submitBtn = document.getElementById('turninSubmitBtn');
  const clearBtn = document.getElementById('turninClearBtn');
  const statusEl = document.getElementById('turninStatus');
  const historyEl = document.getElementById('turninHistory');
  const submitMeta = document.getElementById('submitMeta');

  if (!nameInput || !submitBtn || !historyEl) return;

  if (fixedLevel && levelSelect) {
    levelSelect.value = fixedLevel;
    levelSelect.closest('.turnin-field').hidden = true;
  }

  const levelFixedEl = document.getElementById('turninLevelFixed');
  if (fixedLevel && levelFixedEl) {
    levelFixedEl.textContent = activityLayerLabel(fixedLevel);
  }

  if (ACTIVITY_SUBMIT.formspreeId && submitMeta) {
    submitMeta.textContent = 'sent for teacher review';
  } else if (submitMeta) {
    submitMeta.textContent = 'saved on this device';
  }

  const savedName = localStorage.getItem(NAME_KEY);
  if (savedName) nameInput.value = savedName;

  function setStatus(msg, kind) {
    statusEl.textContent = msg || '';
    statusEl.className = 'turnin-status' + (kind ? ' ' + kind : '');
  }

  function getLevel() {
    return fixedLevel || (levelSelect && levelSelect.value) || '1';
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsDataURL(file);
    });
  }

  function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsText(file);
    });
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

  function putItem(item) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(item);
        tx.oncomplete = function () { resolve(item); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function deleteItem(id) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function syncToFormspree(payload) {
    if (!ACTIVITY_SUBMIT.formspreeId) return Promise.resolve(false);
    const fd = new FormData();
    fd.append('student_name', payload.studentName);
    fd.append('level', activityLayerLabel(payload.level));
    fd.append('_subject', payload.studentName + ' · ' + activityLayerLabel(payload.level) + ' · Pine Crest CS');
    if (payload.screenshotFile) fd.append('screenshot', payload.screenshotFile, payload.screenshotFile.name);
    if (payload.codeFile) fd.append('code_file', payload.codeFile, payload.codeFile.name);
    if (payload.codeText) fd.append('code_text', payload.codeText);
    return fetch('https://formspree.io/f/' + ACTIVITY_SUBMIT.formspreeId, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) return res.json().then(function (j) { throw new Error(j.error || 'Could not send to teacher.'); });
      return true;
    });
  }

  function formatWhen(ts) {
    return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderHistory() {
    const lv = getLevel();
    return getAll().then(function (items) {
      items = items.filter(function (item) { return String(item.level) === String(lv); });
      items.sort(function (a, b) { return b.createdAt - a.createdAt; });
      historyEl.innerHTML = '';
      items.forEach(function (item) {
        const row = document.createElement('div');
        row.className = 'turnin-history-item';
        const tags = [];
        if (item.hasScreenshot) tags.push('<span class="turnin-tag">screenshot</span>');
        if (item.hasCode) tags.push('<span class="turnin-tag">code</span>');
        if (item.synced) tags.push('<span class="turnin-tag">sent</span>');
        row.innerHTML =
          '<div class="meta"><strong>' + escapeHtml(item.studentName) + '</strong>' +
          '<span>' + escapeHtml(activityLayerLabel(item.level)) + ' · ' + formatWhen(item.createdAt) + '</span>' +
          '<div>' + tags.join('') + '</div></div>';
        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = 'remove';
        del.addEventListener('click', function () {
          deleteItem(item.id).then(renderHistory);
        });
        row.appendChild(del);
        historyEl.appendChild(row);
      });
    });
  }

  function updateFileLabels() {
    const sf = screenshotInput.files && screenshotInput.files[0];
    const cf = codeFileInput.files && codeFileInput.files[0];
    screenshotBox.classList.toggle('has-file', !!sf);
    codeBox.classList.toggle('has-file', !!cf);
    screenshotNameEl.textContent = sf ? sf.name : '';
    codeFileNameEl.textContent = cf ? cf.name : '';
  }

  screenshotInput.addEventListener('change', updateFileLabels);
  codeFileInput.addEventListener('change', updateFileLabels);

  function clearForm() {
    screenshotInput.value = '';
    codeFileInput.value = '';
    codePaste.value = '';
    updateFileLabels();
    setStatus('', '');
  }

  clearBtn.addEventListener('click', clearForm);

  submitBtn.addEventListener('click', async function () {
    const studentName = nameInput.value.trim();
    const level = getLevel();
    const screenshotFile = screenshotInput.files && screenshotInput.files[0];
    const codeFile = codeFileInput.files && codeFileInput.files[0];
    const codeText = codePaste.value.trim();

    if (!studentName) {
      setStatus('Please enter your name.', 'err');
      nameInput.focus();
      return;
    }
    if (!screenshotFile && !codeFile && !codeText) {
      setStatus('Add a screenshot, a .py file, or paste your code.', 'err');
      return;
    }

    localStorage.setItem(NAME_KEY, studentName);
    submitBtn.disabled = true;
    setStatus('Saving…', '');

    try {
      let screenshotDataUrl = null;
      let codeStoredText = codeText || null;
      let codeStoredName = codeFile ? codeFile.name : (codeText ? 'pasted_code.py' : null);

      if (screenshotFile) screenshotDataUrl = await readFileAsDataUrl(screenshotFile);
      if (codeFile) codeStoredText = await readFileAsText(codeFile);

      const item = {
        id: 'turnin_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        studentName: studentName,
        level: level,
        createdAt: Date.now(),
        hasScreenshot: !!screenshotFile,
        hasCode: !!(codeFile || codeText),
        screenshotDataUrl: screenshotDataUrl,
        codeText: codeStoredText,
        codeName: codeStoredName,
        synced: false
      };

      const synced = await syncToFormspree({
        studentName: studentName,
        level: level,
        screenshotFile: screenshotFile,
        codeFile: codeFile,
        codeText: codeStoredText
      });
      item.synced = synced;
      await putItem(item);

      const msg = synced
        ? 'Turned in! Your teacher can review your work.'
        : 'Saved on this device. (Ask your teacher to enable online turn-in.)';
      setStatus(msg, 'ok');
      clearForm();
      await renderHistory();
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Try again.', 'err');
    } finally {
      submitBtn.disabled = false;
    }
  });

  renderHistory();
})();
