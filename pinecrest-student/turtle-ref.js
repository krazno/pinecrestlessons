/* Turtle commands reference — three sections on the lesson page */
(function () {
  var data = window.TURTLE_COMMANDS;
  if (!data || !data.refSections || !data.refSections.length) return;

  var toolbar = document.getElementById('turtleRefTopics');
  var titleEl = document.getElementById('turtleRefTitle');
  var tagEl = document.getElementById('turtleRefTag');
  var panelEl = document.getElementById('turtleRefPanel');
  var activeId = data.refSections[0].id;

  function bindTurtleCopyButtons() {
    if (!panelEl || panelEl._turtleCopyBound) return;
    panelEl._turtleCopyBound = true;
    panelEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.turtle-ref-copy-btn');
      if (!btn) return;
      var ide = btn.closest('[data-turtle-copy]');
      if (!ide) return;
      var encoded = ide.getAttribute('data-turtle-copy');
      if (!encoded) return;
      var label = btn.textContent;
      copyToClipboard(decodeURIComponent(encoded)).then(function (ok) {
        if (!ok) return;
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        window.setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('is-copied');
        }, 2000);
      });
    });
  }

  bindTurtleCopyButtons();

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function copyToClipboard(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function splitCodeAndComment(line) {
    var inStr = false;
    var quote = '';
    for (var i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      if (inStr) {
        if (ch === quote && line.charAt(i - 1) !== '\\') inStr = false;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inStr = true;
        quote = ch;
        continue;
      }
      if (ch === '#') {
        return { code: line.slice(0, i), comment: line.slice(i) };
      }
    }
    return { code: line, comment: '' };
  }

  function highlightCodeTokens(line) {
    var parts = [];
    var body = escapeHtml(line);
    body = body.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, function (match) {
      parts.push('<span class="hl-str">' + match + '</span>');
      return '\x00S' + (parts.length - 1) + '\x00';
    });
    body = body.replace(/\b(def|return|if|else|elif|for|in|while|not|and|or|import|from|True|False|range)\b/g, '<span class="hl-kw">$1</span>');
    body = body.replace(/\bturtle\b/g, '<span class="hl-fn">turtle</span>');
    body = body.replace(/\b([a-z_][a-z0-9_]*)\s*(?=\()/gi, function (m) {
      var skip = ['if', 'for', 'def', 'in', 'return', 'else', 'elif', 'while', 'not', 'and', 'or', 'import', 'range'];
      if (skip.indexOf(m.toLowerCase()) >= 0) return m;
      return '<span class="hl-name">' + m + '</span>';
    });
    body = body.replace(/\b(\d+)\b/g, '<span class="hl-num">$1</span>');
    body = body.replace(/\x00S(\d+)\x00/g, function (_, i) {
      return parts[Number(i)];
    });
    return body;
  }

  function highlightCodeLine(line) {
    if (/^\s*#/.test(line)) {
      return '<span class="hl-com">' + escapeHtml(line) + '</span>';
    }
    var split = splitCodeAndComment(line);
    var out = highlightCodeTokens(split.code);
    if (split.comment) {
      out += '<span class="hl-com">' + escapeHtml(split.comment) + '</span>';
    }
    return out;
  }

  function renderIdeCode(code, filename, extraClass) {
    var lines = code.split('\n');
    var body = lines
      .map(function (line, i) {
        var n = String(i + 1);
        return (
          '<div class="ide-line"><span class="ide-ln">' +
          n +
          '</span><span class="ide-txt">' +
          highlightCodeLine(line) +
          '</span></div>'
        );
      })
      .join('');
    return (
      '<div class="turtle-ref-ide ide-window' +
      (extraClass ? ' ' + extraClass : '') +
      '" data-turtle-copy="' +
      encodeURIComponent(code) +
      '">' +
      '<div class="ide-titlebar">' +
      '<span class="ide-dot r"></span><span class="ide-dot y"></span><span class="ide-dot g"></span>' +
      '<span class="ide-fname">' +
      escapeHtml(filename) +
      '</span>' +
      '<button type="button" class="turtle-ref-copy-btn" aria-label="Copy code to paste in your editor">Copy code</button>' +
      '</div>' +
      '<div class="ide-body">' +
      body +
      '</div></div>'
    );
  }

  function renderMiniIde(cmd) {
    return (
      '<div class="turtle-step-code ide-window" aria-label="Code example">' +
      '<div class="ide-body turtle-step-code-body">' +
      '<div class="ide-line"><span class="ide-txt">' +
      highlightCodeLine(cmd) +
      '</span></div>' +
      '</div></div>'
    );
  }

  function cmdEmoji(cmd) {
    if (cmd.indexOf('forward') >= 0 || cmd.indexOf('backward') >= 0) return '🏃';
    if (cmd.indexOf('right') >= 0 || cmd.indexOf('left') >= 0) return '🔄';
    if (cmd.indexOf('penup') >= 0 || cmd.indexOf('pendown') >= 0) return '✋';
    if (cmd.indexOf('color') >= 0) return '🎨';
    if (cmd.indexOf('circle') >= 0) return '⭕';
    if (cmd.indexOf('goto') >= 0 || cmd.indexOf('home') >= 0) return '📍';
    if (cmd.indexOf('width') >= 0) return '📏';
    if (cmd.indexOf('speed') >= 0) return '⚡';
    if (cmd.indexOf('write') >= 0) return '💬';
    if (cmd.indexOf('import') >= 0) return '📦';
    if (cmd.indexOf('Turtle') >= 0) return '🐢';
    if (cmd.indexOf('done') >= 0) return '🪟';
    return '🐢';
  }

  function renderCommandTable(commands) {
    var rows = commands
      .map(function (row) {
        return (
          '<tr><td class="turtle-cmd-cell"><span class="turtle-cmd-emoji" aria-hidden="true">' +
          cmdEmoji(row.cmd) +
          '</span><code class="turtle-cmd-pill">' +
          row.cmd +
          '</code></td><td class="turtle-cmd-meaning">' +
          row.meaning +
          '</td></tr>'
        );
      })
      .join('');
    return (
      '<div class="turtle-ref-table-wrap turtle-cmd-table-wrap">' +
      '<table class="turtle-ref-table turtle-cmd-table"><thead><tr>' +
      '<th scope="col">Command</th><th scope="col">Meaning</th>' +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>'
    );
  }

  function renderReminders() {
    if (!data.reminders || !data.reminders.length) return '';
    var chips = data.reminders
      .map(function (row) {
        return '<span><strong>' + row.term + '</strong> = ' + row.meaning + '</span>';
      })
      .join('');
    return (
      '<div class="turtle-ref-reminders-wrap">' +
      '<p class="turtle-ref-reminders-label">Quick reminders</p>' +
      '<div class="turtle-ref-board">' +
      chips +
      '</div></div>'
    );
  }

  function renderGettingStarted(section) {
    var concepts = section.concepts
      .map(function (c) {
        var icon = c.icon || '🐢';
        return (
          '<article class="turtle-step-card">' +
          '<div class="turtle-step-badge">' +
          '<span class="turtle-step-icon">' +
          icon +
          '</span>' +
          '<span class="turtle-step-num">' +
          c.step +
          '</span></div>' +
          '<div class="turtle-step-main">' +
          '<h3 class="turtle-step-title">' +
          c.title +
          '</h3>' +
          renderMiniIde(c.cmd) +
          '<p class="turtle-step-text">' +
          c.text +
          '</p></div></article>'
        );
      })
      .join('');

    var whereToCode = section.whereToCode
      ? '<div class="turtle-ref-where-code">' +
        (section.leadQuestion
          ? '<p class="turtle-ref-lead-question">' + section.leadQuestion + '</p>'
          : '') +
        (section.leadAnswer
          ? '<p class="turtle-ref-lead-answer">' + section.leadAnswer + '</p>'
          : '') +
        '<p class="turtle-ref-where-code-label">Where to write your code</p>' +
        '<p class="turtle-ref-where-code-text">' +
        section.whereToCode +
        '</p></div>'
      : '';

    return (
      whereToCode +
      '<div class="turtle-ref-steps">' +
      concepts +
      '</div>' +
      '<div class="turtle-ref-starter-block">' +
      '<p class="turtle-ref-starter-label">🎮 Full starter program</p>' +
      renderIdeCode(section.starterCode, section.starterFilename, 'turtle-ref-ide--full') +
      '</div>'
    );
  }

  function renderDrawingMethods(section) {
    var sandboxUrl = data.pythonSandboxTurtle || 'https://pythonsandbox.com/turtle';
    var playground =
      section.playgroundLink ?
        '<p class="turtle-ref-playground-link">Try commands in Mu, <a href="' +
        sandboxUrl +
        '" target="_blank" rel="noopener">Python Sandbox (turtle)</a>, or the <a href="turtle-playground/">Turtle Playground</a> preview.</p>'
      : '';

    return (
      '<div class="turtle-ref-panel-intro turtle-ref-callout">' +
      section.intro +
      '</div>' +
      renderCommandTable(section.commands) +
      renderReminders() +
      playground
    );
  }

  function renderExampleStage(section) {
    var previewHead =
      section.demo === 'square-coords'
        ? 'Drawing preview · (x, y) by quadrant'
        : 'Drawing preview';
    var previewAria =
      section.demo === 'square-coords'
        ? 'Preview of square drawn with x and y coordinates'
        : 'Preview of square drawn with forward and turn';
    return (
      '<div class="turtle-ref-example-stage">' +
      renderIdeCode(section.exampleCode, section.exampleFilename, 'turtle-ref-ide--example') +
      '<div class="turtle-ref-example-output">' +
      '<div class="turtle-ref-example-output-head">' +
      previewHead +
      '</div>' +
      '<div class="turtle-ref-demo-wrap turtle-ref-demo-wrap--inline" id="turtleRefDemoWrap">' +
      '<canvas id="turtleRefDemoCanvas" class="turtle-ref-demo-canvas" width="400" height="320" aria-label="' +
      previewAria +
      '"></canvas>' +
      '</div></div></div>'
    );
  }

  function renderCornerTable(rows) {
    var body = rows
      .map(function (row) {
        return (
          '<tr><td>' +
          row.point +
          '</td><td>' +
          (row.quadrant || row.corner) +
          '</td><td><code>(' +
          row.x +
          ', ' +
          row.y +
          ')</code></td></tr>'
        );
      })
      .join('');
    return (
      '<div class="turtle-ref-corners-wrap">' +
      '<p class="turtle-ref-corners-label">Square vertices by quadrant</p>' +
      '<div class="turtle-ref-table-wrap">' +
      '<table class="turtle-ref-table turtle-ref-corners-table"><thead><tr>' +
      '<th scope="col">Point</th><th scope="col">Quadrant</th><th scope="col">(x, y)</th>' +
      '</tr></thead><tbody>' +
      body +
      '</tbody></table></div></div>'
    );
  }

  function renderSimpleExample(section) {
    return (
      '<div class="turtle-ref-panel-intro turtle-ref-callout">' +
      section.intro +
      '</div>' +
      renderExampleStage(section)
    );
  }

  function renderMathExample(section) {
    var table = section.cornerRows ? renderCornerTable(section.cornerRows) : '';
    return (
      '<div class="turtle-ref-panel-intro turtle-ref-callout">' +
      section.intro +
      '</div>' +
      '<p class="turtle-ref-math-hint">Tip: <strong>x</strong> is negative left of the origin and positive right; <strong>y</strong> is negative below and positive above. Visit each point in quadrant order — the table matches your <code>goto</code> lines.</p>' +
      table +
      renderExampleStage(section)
    );
  }

  function findSection(id) {
    for (var i = 0; i < data.refSections.length; i++) {
      if (data.refSections[i].id === id) return data.refSections[i];
    }
    return data.refSections[0];
  }

  function setActiveChip(id) {
    if (!toolbar) return;
    toolbar.querySelectorAll('.turtle-cmd-chip').forEach(function (chip) {
      var on = chip.getAttribute('data-turtle-section') === id;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function bindDemoButtons(section) {
    var wrap = document.getElementById('turtleRefDemoWrap');
    var canvas = document.getElementById('turtleRefDemoCanvas');
    if (!wrap || !canvas) return;

    var half = (data.squareHalf != null ? data.squareHalf : 40);
    var showLabels = !!(section && section.showCornerLabels);
    var corners = [
      [-half, -half],
      [half, -half],
      [half, half],
      [-half, half],
      [-half, -half]
    ];

    function turtleToCanvas(tx, ty, cx, cy, unit) {
      return { x: cx + tx * unit, y: cy - ty * unit };
    }

    function drawCoordsSquare() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var w = rect.width || 400;
      var h = rect.height || 320;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2;
      var unit = (Math.min(w, h) * 0.28) / half;

      ctx.strokeStyle = 'rgba(0, 255, 224, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      ctx.fillStyle = 'rgba(212, 255, 58, 0.85)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('x', w - 14, cy - 6);
      ctx.textAlign = 'right';
      ctx.fillText('y', cx - 8, 14);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 46, 147, 0.9)';
      ctx.fillText('(0, 0)', cx, cy - 10);

      ctx.strokeStyle = '#00ffe0';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      var first = turtleToCanvas(corners[0][0], corners[0][1], cx, cy, unit);
      ctx.moveTo(first.x, first.y);
      for (var i = 1; i < corners.length; i++) {
        var pt = turtleToCanvas(corners[i][0], corners[i][1], cx, cy, unit);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      if (showLabels) {
        var labelCorners = corners.slice(0, 4);
        var labels = ['1', '2', '3', '4'];
        for (var j = 0; j < labelCorners.length; j++) {
          var lc = turtleToCanvas(labelCorners[j][0], labelCorners[j][1], cx, cy, unit);
          ctx.fillStyle = '#ff2e93';
          ctx.beginPath();
          ctx.arc(lc.x, lc.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(212, 255, 58, 0.95)';
          ctx.font = '11px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            '(' + labelCorners[j][0] + ', ' + labelCorners[j][1] + ')',
            lc.x,
            lc.y - 12
          );
          ctx.fillStyle = '#fff';
          ctx.fillText(labels[j], lc.x, lc.y + 4);
        }
      } else {
        ctx.fillStyle = '#ff2e93';
        ctx.beginPath();
        ctx.arc(first.x, first.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawLoopSquare() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var w = rect.width || 400;
      var h = rect.height || 320;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2;
      var side = Math.min(w, h) * 0.28;
      var startX = cx - side / 2;
      var startY = cy - side / 2;
      var steps = [
        { x: 0, y: 0 },
        { x: side, y: 0 },
        { x: side, y: side },
        { x: 0, y: side },
        { x: 0, y: 0 }
      ];

      ctx.strokeStyle = '#00ffe0';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (var k = 1; k < steps.length; k++) {
        ctx.lineTo(startX + steps[k].x, startY + steps[k].y);
      }
      ctx.stroke();

      ctx.fillStyle = '#ff2e93';
      ctx.beginPath();
      ctx.arc(startX, startY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    var demo = (section && section.demo) || 'square-loop';
    function redraw() {
      if (demo === 'square-coords') {
        drawCoordsSquare();
      } else {
        drawLoopSquare();
      }
    }

    redraw();
  }

  function showSection(id) {
    var section = findSection(id);
    activeId = section.id;
    setActiveChip(section.id);
    if (titleEl) titleEl.textContent = section.title;
    if (tagEl) tagEl.textContent = section.tag;

    if (!panelEl) return;

    if (section.id === 'getting-started') {
      panelEl.innerHTML = renderGettingStarted(section);
    } else if (section.id === 'drawing-methods') {
      panelEl.innerHTML = renderDrawingMethods(section);
    } else if (section.id === 'simple-example') {
      panelEl.innerHTML = renderSimpleExample(section);
      bindDemoButtons(section);
    } else if (section.id === 'math-example') {
      panelEl.innerHTML = renderMathExample(section);
      bindDemoButtons(section);
    }

    if (history.replaceState) {
      history.replaceState(null, '', '#turtle-' + section.id);
    }
  }

  if (toolbar) {
    data.refSections.forEach(function (section) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'turtle-cmd-chip';
      btn.setAttribute('data-turtle-section', section.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = section.label;
      btn.addEventListener('click', function () {
        showSection(section.id);
      });
      toolbar.appendChild(btn);
    });
  }

  var hash = (location.hash || '').replace(/^#/, '');
  var hashId = hash.replace(/^turtle-/, '');
  if (hashId && findSection(hashId).id === hashId) {
    showSection(hashId);
  } else {
    showSection(data.refSections[0].id);
  }

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace(/^#/, '').replace(/^turtle-/, '');
    if (h && findSection(h).id === h) showSection(h);
  });

  function openTurtleRefIfHash() {
    var hash = (location.hash || '').replace(/^#/, '');
    if (hash !== 'turtleRef' && !hash.startsWith('turtle-')) return;
    var details = document.querySelector('#turtleRef .turtle-ref-details');
    if (details && !details.open) details.open = true;
  }

  openTurtleRefIfHash();
  window.addEventListener('hashchange', openTurtleRefIfHash);
})();
