/* Predict the output · 6, 7, or 67 — carousel + step-by-step trace */
(function initPredictCarousel() {
  var viewport = document.getElementById('predictViewport');
  if (!viewport || typeof PREDICT_SNIPPETS === 'undefined' || !PREDICT_SNIPPETS.length) return;

  var index = 0;
  var answerShown = false;
  var traceOpen = false;
  var traceStep = 0;

  var PY_KEYWORDS = {
    def: 1, return: 1, if: 1, else: 1, elif: 1, for: 1, in: 1,
    import: 1, from: 1, print: 1, and: 1, or: 1, not: 1, True: 1, False: 1
  };

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function appendText(parent, text, className) {
    var span = document.createElement('span');
    if (className) span.className = className;
    span.textContent = text;
    parent.appendChild(span);
  }

  /* Build highlighted line with DOM nodes only — no HTML strings, no broken tags. */
  function fillHighlightedLine(container, line) {
    if (/^\s*#/.test(line)) {
      var com = document.createElement('span');
      com.className = 'hl-com';
      var parts = line.split(/(\b(?:6|7|67)\b)/);
      parts.forEach(function (part) {
        if (part === '6' || part === '7' || part === '67') {
          var strong = document.createElement('strong');
          strong.textContent = part;
          com.appendChild(strong);
        } else {
          com.appendChild(document.createTextNode(part));
        }
      });
      container.appendChild(com);
      return;
    }

    var re = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b\d+\b|\b[A-Za-z_]\w*\b|[^\w\s]|\s+)/g;
    var m;
    while ((m = re.exec(line)) !== null) {
      var tok = m[0];
      var next = line.charAt(m.index + tok.length);
      if (/^["']/.test(tok)) appendText(container, tok, 'hl-str');
      else if (/^\d+$/.test(tok)) appendText(container, tok, 'hl-num');
      else if (PY_KEYWORDS[tok]) appendText(container, tok, 'hl-kw');
      else if (/^[A-Za-z_]\w*$/.test(tok) && next === '(') appendText(container, tok, 'hl-fn');
      else if (/^[A-Za-z_]\w*$/.test(tok)) appendText(container, tok, 'hl-name');
      else appendText(container, tok, '');
    }
  }

  function renderCode(codeEl, code, activeLines, dimOthers) {
    activeLines = activeLines || [];
    var activeSet = {};
    activeLines.forEach(function (n) { activeSet[n] = true; });

    codeEl.innerHTML = '';
    var lines = code.split('\n');

    lines.forEach(function (line, i) {
      var lineNum = i + 1;
      var row = document.createElement('div');
      row.className = 'ide-line';
      if (activeSet[lineNum]) row.className += ' ide-line-active';
      else if (dimOthers && activeLines.length && !/^\s*#/.test(line) && line.trim()) {
        row.className += ' ide-line-dim';
      }

      var ln = document.createElement('span');
      ln.className = 'ide-ln';
      ln.textContent = String(lineNum).padStart(2, ' ');

      var txt = document.createElement('span');
      txt.className = 'ide-txt';
      fillHighlightedLine(txt, line);

      row.appendChild(ln);
      row.appendChild(txt);
      codeEl.appendChild(row);
    });
  }

  function activeTraceLines() {
    var sn = PREDICT_SNIPPETS[index];
    if (!traceOpen || !sn.trace || !sn.trace.length) return [];
    var step = sn.trace[traceStep];
    return step && step.lines ? step.lines : [];
  }

  function updateNav() {
    var counter = document.getElementById('predictCounter');
    var prevBtn = document.getElementById('predictPrev');
    var nextBtn = document.getElementById('predictNext');
    if (counter) counter.textContent = (index + 1) + ' of ' + PREDICT_SNIPPETS.length;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= PREDICT_SNIPPETS.length - 1;
  }

  function updateDots() {
    var dotsEl = document.getElementById('predictDots');
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.predict-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.classList.toggle('done', i < index || (i === index && answerShown));
    });
  }

  function updateTraceButtons() {
    var sn = PREDICT_SNIPPETS[index];
    var total = sn.trace ? sn.trace.length : 0;
    var tracePrev = document.getElementById('traceStepPrev');
    var traceNext = document.getElementById('traceStepNext');
    var strip = document.getElementById('traceStepStrip');
    if (!tracePrev || !traceNext || !strip) return;

    if (!total) {
      tracePrev.disabled = true;
      traceNext.disabled = true;
      return;
    }
    if (!traceOpen) {
      tracePrev.disabled = true;
      traceNext.disabled = true;
      return;
    }
    tracePrev.disabled = traceStep <= 0;
    traceNext.disabled = traceStep >= total - 1;
    strip.querySelectorAll('.trace-control-btn.trace-step').forEach(function (btn, i) {
      btn.classList.toggle('is-current', i === traceStep);
      btn.classList.toggle('is-entry', i === total - 1 && !traceOpen);
      btn.classList.toggle('is-dimmed', traceOpen && i !== traceStep);
    });
  }

  function buildDots() {
    var dotsEl = document.getElementById('predictDots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    PREDICT_SNIPPETS.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'predict-dot';
      d.setAttribute('aria-label', 'Problem ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(d);
    });
  }

  function openTrace() {
    traceOpen = true;
    traceStep = 0;
    refreshCode();
    renderTracePanel();
    updateTraceCol();
    updateTraceButtons();
  }

  function buildTraceStepButtons() {
    var strip = document.getElementById('traceStepStrip');
    if (!strip) return;
    var sn = PREDICT_SNIPPETS[index];
    var total = sn.trace ? sn.trace.length : 0;
    strip.innerHTML = '';
    if (!total) return;

    for (var i = 0; i < total; i++) {
      (function (stepIndex) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'trace-control-btn trace-step';
        btn.textContent = String(stepIndex + 1);
        btn.title = 'Step ' + (stepIndex + 1);
        btn.setAttribute('aria-label', 'Go to step ' + (stepIndex + 1));
        btn.addEventListener('click', function () {
          if (!sn.trace || !sn.trace.length) return;
          if (!traceOpen) {
            openTrace();
            traceStep = stepIndex;
          } else {
            traceStep = stepIndex;
          }
          refreshCode();
          renderTracePanel();
          updateTraceCol();
          updateTraceButtons();
        });
        strip.appendChild(btn);
      })(i);
    }
    updateTraceButtons();
  }

  function updateTraceCol() {
    var traceCol = document.getElementById('predictTraceCol');
    if (!traceCol) return;
    traceCol.classList.toggle('is-on', traceOpen);
    traceCol.classList.toggle('is-off', !traceOpen);
  }

  function goToTraceStep(stepIndex) {
    var sn = PREDICT_SNIPPETS[index];
    var total = sn.trace ? sn.trace.length : 0;
    if (!traceOpen || !total) return;
    traceStep = Math.max(0, Math.min(total - 1, stepIndex));
    refreshCode();
    renderTracePanel();
    updateTraceButtons();
  }

  function renderTracePanel() {
    var panel = document.getElementById('predictTracePanel');
    if (!panel) return;
    var sn = PREDICT_SNIPPETS[index];
    var total = sn.trace ? sn.trace.length : 0;

    if (!traceOpen || !total) {
      panel.innerHTML =
        '<p class="trace-hint">Read the code on the left. When you are ready, click <strong>Start walkthrough</strong> or tap a step number below to see what each line does.</p>' +
        '<button type="button" class="btn trace-start-btn" id="traceStartBtn">Start walkthrough</button>';
      var startBtn = document.getElementById('traceStartBtn');
      if (startBtn) startBtn.addEventListener('click', openTrace);
      updateTraceButtons();
      return;
    }

    var step = sn.trace[traceStep];
    panel.innerHTML =
      '<div class="trace-step-label">Step ' + (traceStep + 1) + ' of ' + total + '</div>' +
      '<h4 class="trace-step-title">' + escapeHtml(step.title) + '</h4>' +
      '<p class="trace-step-body">' + escapeHtml(step.body) + '</p>' +
      (step.vars ? '<pre class="trace-vars">' + escapeHtml(step.vars) + '</pre>' : '');
    updateTraceButtons();
  }

  function refreshCode() {
    var codeEl = document.getElementById('predictCodeBody');
    if (!codeEl) return;
    var sn = PREDICT_SNIPPETS[index];
    renderCode(codeEl, sn.code, activeTraceLines(), traceOpen);
  }

  function snippetMetaHtml() {
    return (
      '<div class="predict-snippet-meta">' +
      '<span class="predict-counter" id="predictCounter">1 of ' + PREDICT_SNIPPETS.length + '</span>' +
      '<div class="predict-dots" id="predictDots" aria-hidden="true"></div>' +
      '</div>'
    );
  }

  function render() {
    var sn = PREDICT_SNIPPETS[index];
    var fileNum = String(index + 1).padStart(2, '0');
    var fileName = sn.file || ('snippet_' + fileNum + '.py');
    answerShown = false;
    traceOpen = false;
    traceStep = 0;

    viewport.innerHTML =
      '<article class="predict-slide">' +
      '<div class="predict-workspace" id="predictWorkspace">' +
      '<div class="predict-code-col">' +
      '<div class="ide-window"><div class="ide-titlebar"><span class="ide-dot r"></span><span class="ide-dot y"></span><span class="ide-dot g"></span><span class="ide-fname">' + fileName + '</span></div>' +
      '<div class="ide-body predict-ide-body" id="predictCodeBody"></div></div></div>' +
      '<div class="predict-trace-col is-off" id="predictTraceCol">' +
      '<div class="trace-header">Step by step</div>' +
      '<div class="trace-panel" id="predictTracePanel"></div>' +
      '<div class="trace-footer">' +
      '<button type="button" class="trace-control-btn trace-nav" id="traceStepPrev" disabled aria-label="Previous step">◀</button>' +
      '<div class="trace-step-strip" id="traceStepStrip"></div>' +
      '<button type="button" class="trace-control-btn trace-nav" id="traceStepNext" disabled aria-label="Next step">▶</button>' +
      '</div></div></div>' +
      '<div class="predict-actions">' +
      '<div class="predict-actions-bar">' +
      '<button type="button" class="predict-nav-btn" id="predictPrev" aria-label="Previous problem">◀ Previous</button>' +
      '<button type="button" class="btn primary reveal-btn" id="predictReveal">Show answer</button>' +
      '<button type="button" class="predict-nav-btn next" id="predictNext" aria-label="Next problem">Next ▶</button>' +
      '</div>' +
      '<div class="answer-panel" id="predictAnswer"><strong>Answer: ' + escapeHtml(sn.answer) + '</strong>' +
      (sn.note ? '<p class="predict-note">' + escapeHtml(sn.note) + '</p>' : '') +
      '</div>' +
      snippetMetaHtml() +
      '</div></article>';

    buildDots();
    updateNav();
    updateDots();
    buildTraceStepButtons();
    refreshCode();
    renderTracePanel();
    updateTraceCol();

    var tracePrev = document.getElementById('traceStepPrev');
    var traceNext = document.getElementById('traceStepNext');
    var reveal = document.getElementById('predictReveal');
    var panel = document.getElementById('predictAnswer');
    var prevBtn = document.getElementById('predictPrev');
    var nextBtn = document.getElementById('predictNext');

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

    if (tracePrev) tracePrev.addEventListener('click', function () { goToTraceStep(traceStep - 1); });
    if (traceNext) traceNext.addEventListener('click', function () { goToTraceStep(traceStep + 1); });

    function setAnswerVisible(visible) {
      answerShown = visible;
      if (panel) panel.classList.toggle('show', visible);
      if (reveal) {
        reveal.textContent = visible ? 'Hide answer' : 'Show answer';
        reveal.setAttribute('aria-expanded', visible ? 'true' : 'false');
        reveal.classList.toggle('done', visible);
      }
      updateDots();
    }

    if (reveal) {
      reveal.setAttribute('aria-controls', 'predictAnswer');
      reveal.setAttribute('aria-expanded', 'false');
      reveal.addEventListener('click', function () {
        setAnswerVisible(!answerShown);
      });
    }
  }

  function goTo(i) {
    index = Math.max(0, Math.min(PREDICT_SNIPPETS.length - 1, i));
    render();
  }

  render();
})();
