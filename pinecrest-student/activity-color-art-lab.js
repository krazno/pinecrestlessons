/* Color Art Lab — mission checklist, function spotlight, live Run preview */
(function () {
  var CHECK_KEY = 'pinecrest_color_art_mission_checks';

  var STARTER_SIMPLE_CODE =
    '# Mission 1 · Color Art Lab — starter (simple)\n' +
    'import turtle\n' +
    '\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)\n' +
    '\n' +
    'def draw_bubble(size, color):\n' +
    '    # Big bubbles get thicker lines\n' +
    '    if size > 50:\n' +
    '        t.width(6)\n' +
    '    else:\n' +
    '        t.width(3)\n' +
    '    t.color(color)\n' +
    '    t.circle(size)\n' +
    '\n' +
    '# Blue bubble — left\n' +
    't.penup()\n' +
    't.goto(-180, -40)\n' +
    't.pendown()\n' +
    'draw_bubble(35, "blue")\n' +
    '\n' +
    '# Green bubble — center\n' +
    't.penup()\n' +
    't.goto(0, -40)\n' +
    't.pendown()\n' +
    'draw_bubble(60, "green")\n' +
    '\n' +
    '# Purple bubble — right\n' +
    't.penup()\n' +
    't.goto(180, -40)\n' +
    't.pendown()\n' +
    'draw_bubble(85, "purple")\n' +
    '\n' +
    't.hideturtle()\n' +
    'turtle.done()';

  var MATH_CODE =
    '# Mission 1 · Color Art Lab — math (x, y coordinates)\n' +
    'import turtle\n' +
    '\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)\n' +
    '\n' +
    'def move_to(x, y):\n' +
    '    t.penup()\n' +
    '    t.goto(x, y)\n' +
    '    t.pendown()\n' +
    '\n' +
    'def draw_bubble(x, y, size, color):\n' +
    '    if size > 50:\n' +
    '        t.width(6)\n' +
    '    else:\n' +
    '        t.width(3)\n' +
    '    t.color(color)\n' +
    '    move_to(x, y)\n' +
    '    t.circle(size)\n' +
    '\n' +
    'draw_bubble(-180, -40, 35, "blue")\n' +
    'draw_bubble(0, -40, 60, "green")\n' +
    'draw_bubble(180, -40, 85, "purple")\n' +
    '\n' +
    't.hideturtle()\n' +
    'turtle.done()';

  var VERSIONS = {
    starter: {
      code: STARTER_SIMPLE_CODE,
      spotlight: {
        draw_bubble_fn: [7, 14],
        three_bubbles: [16, 32],
        your_turn: [28, 36]
      },
      defaultSpotlight: 'draw_bubble_fn',
      visualHead: 'Drawing preview',
      runHint:
        'Click <strong>Run example</strong> to animate three colorful circles. Copy the <strong>Starter</strong> code into your editor and run it for real.',
      usePlane: false
    },
    math: {
      code: MATH_CODE,
      spotlight: {
        move_to: [7, 11],
        draw_bubble: [13, 21],
        your_turn: [23, 25]
      },
      defaultSpotlight: 'move_to',
      visualHead: 'Coordinate plane',
      runHint:
        'The coordinate plane matches Python turtle: <strong>(0, 0)</strong> is the center. Click <strong>Run example</strong> to animate the bubbles on the grid.',
      usePlane: true
    }
  };

  var activeVersion = 'starter';

  var BUBBLES = [
    { x: -180, y: -40, size: 35, color: '#3b82f6', stroke: 3 },
    { x: 0, y: -40, size: 60, color: '#22c55e', stroke: 6 },
    { x: 180, y: -40, size: 85, color: '#a855f7', stroke: 6 }
  ];

  var PLANE_SCALE = 0.52;
  var PLANE_CY_OFFSET = 10;
  var PLANE_GRID_STEP = 50;
  var PLANE_LABEL_STEP = 100;

  function getVersionConfig() {
    return VERSIONS[activeVersion] || VERSIONS.starter;
  }

  function wrapCodeLines() {
    var pre = document.getElementById('starterExampleCode');
    if (!pre) return;

    var lines = getVersionConfig().code.split('\n');
    pre.textContent = '';
    lines.forEach(function (line, i) {
      var span = document.createElement('span');
      span.className = 'code-line';
      span.dataset.line = String(i + 1);
      span.textContent = line + (i < lines.length - 1 ? '\n' : '');
      pre.appendChild(span);
    });
  }

  function setSpotlight(key) {
    var pre = document.getElementById('starterExampleCode');
    if (!pre) return;

    var range = getVersionConfig().spotlight[key];
    pre.querySelectorAll('.code-line').forEach(function (line) {
      var n = parseInt(line.dataset.line, 10);
      var on = range && n >= range[0] && n <= range[1];
      line.classList.toggle('is-highlight', on);
    });

    document.querySelectorAll('.fn-spotlight-btn[data-version="' + activeVersion + '"]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.spotlight === key);
    });

    if (key === 'your_turn') {
      var panel = document.getElementById('tryChangingPanel');
      if (panel) {
        panel.open = true;
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function initSpotlight() {
    document.querySelectorAll('.fn-spotlight-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.version && btn.dataset.version !== activeVersion) return;
        setSpotlight(btn.dataset.spotlight);
      });
    });
  }

  function switchVersion(version) {
    if (!VERSIONS[version]) version = 'starter';
    activeVersion = version;
    var cfg = getVersionConfig();

    document.querySelectorAll('.starter-version-tab').forEach(function (tab) {
      var on = tab.dataset.version === version;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    var panelStarter = document.getElementById('starterPanelStarter');
    var panelMath = document.getElementById('starterPanelMath');
    if (panelStarter) panelStarter.hidden = version !== 'starter';
    if (panelMath) panelMath.hidden = version !== 'math';

    var visualHead = document.getElementById('starterVisualHead');
    var runHint = document.getElementById('starterRunHint');
    if (visualHead) visualHead.textContent = cfg.visualHead;
    if (runHint) runHint.innerHTML = cfg.runHint;

    wrapCodeLines();
    setSpotlight(cfg.defaultSpotlight);
    refreshPreview();
  }

  function initVersionTabs() {
    document.querySelectorAll('.starter-version-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchVersion(tab.dataset.version);
      });
    });
    switchVersion('starter');
  }

  function loadChecks() {
    try {
      var raw = localStorage.getItem(CHECK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecks(state) {
    try {
      localStorage.setItem(CHECK_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function initMissionChecklist() {
    var list = document.getElementById('missionChecklist');
    if (!list) return;

    var state = loadChecks();
    list.querySelectorAll('.mission-check-item').forEach(function (label) {
      var id = label.dataset.checkId;
      var input = label.querySelector('input');
      if (!id || !input) return;

      if (state[id]) {
        input.checked = true;
        label.classList.add('is-done');
      }

      input.addEventListener('change', function () {
        state[id] = input.checked;
        label.classList.toggle('is-done', input.checked);
        saveChecks(state);
      });
    });
  }

  function turtleToCanvas(cx, cy, scale, tx, ty) {
    return { x: cx + tx * scale, y: cy - ty * scale };
  }

  function getStageMetrics() {
    var canvas = document.getElementById('starterLiveCanvas');
    var parent = canvas && canvas.parentElement;
    var rect = parent ? parent.getBoundingClientRect() : { width: 0, height: 0 };
    var w = Math.max(280, rect.width || 0);
    var h = Math.max(220, rect.height || 0);
    var cx = w / 2;
    var cy = h / 2 + PLANE_CY_OFFSET;
    return {
      canvas: canvas,
      frame: document.getElementById('starterOutputFrame'),
      w: w,
      h: h,
      cx: cx,
      cy: cy,
      scale: PLANE_SCALE,
      dpr: window.devicePixelRatio || 1
    };
  }

  function setupCanvas(metrics) {
    var canvas = metrics.canvas;
    var ctx = canvas.getContext('2d');
    canvas.width = Math.max(1, metrics.w * metrics.dpr);
    canvas.height = Math.max(1, metrics.h * metrics.dpr);
    canvas.style.width = metrics.w + 'px';
    canvas.style.height = metrics.h + 'px';
    ctx.setTransform(metrics.dpr, 0, 0, metrics.dpr, 0, 0);
    return ctx;
  }

  function drawCoordinatePlane(ctx, metrics) {
    var w = metrics.w;
    var h = metrics.h;
    var cx = metrics.cx;
    var cy = metrics.cy;
    var scale = metrics.scale;
    var step = PLANE_GRID_STEP;

    ctx.fillStyle = '#03040a';
    ctx.fillRect(0, 0, w, h);

    var xStart = Math.floor(-cx / scale / step) * step;
    var xEnd = Math.ceil((w - cx) / scale / step) * step;
    var yStart = Math.floor(-(h - cy) / scale / step) * step;
    var yEnd = Math.ceil(cy / scale / step) * step;

    ctx.strokeStyle = 'rgba(0, 255, 224, 0.1)';
    ctx.lineWidth = 1;
    for (var gx = xStart; gx <= xEnd; gx += step) {
      if (gx === 0) continue;
      var px = cx + gx * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    for (var gy = yStart; gy <= yEnd; gy += step) {
      if (gy === 0) continue;
      var py = cy - gy * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 255, 224, 0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(212, 255, 58, 0.55)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var tx = xStart; tx <= xEnd; tx += PLANE_LABEL_STEP) {
      if (tx === 0) continue;
      var tpx = cx + tx * scale;
      if (tpx < 14 || tpx > w - 14) continue;
      ctx.fillText(String(tx), tpx, cy + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var ty = yStart; ty <= yEnd; ty += PLANE_LABEL_STEP) {
      if (ty === 0) continue;
      var tpy = cy - ty * scale;
      if (tpy < 14 || tpy > h - 14) continue;
      ctx.fillText(String(ty), cx - 7, tpy);
    }

    ctx.fillStyle = 'rgba(255, 46, 147, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('(0, 0)', cx, cy - 6);

    ctx.fillStyle = 'rgba(212, 255, 58, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('x', w - 12, cy);
    ctx.textAlign = 'right';
    ctx.fillText('y', cx - 8, 12);

    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(155, 92, 255, 0.55)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('II', 8, 8);
    ctx.textAlign = 'right';
    ctx.fillText('I', w - 8, 8);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('III', 8, h - 8);
    ctx.textAlign = 'right';
    ctx.fillText('IV', w - 8, h - 8);
  }

  function drawGotoMarkers(ctx, metrics) {
    BUBBLES.forEach(function (bubble) {
      var pos = turtleToCanvas(metrics.cx, metrics.cy, metrics.scale, bubble.x, bubble.y);
      ctx.fillStyle = 'rgba(255, 46, 147, 0.85)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(212, 255, 58, 0.9)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('(' + bubble.x + ', ' + bubble.y + ')', pos.x, pos.y - 8);
    });
  }

  function paintSimplePreview(ctx, metrics, progressByBubble) {
    ctx.fillStyle = '#03040a';
    ctx.fillRect(0, 0, metrics.w, metrics.h);
    if (!progressByBubble) return;
    for (var i = 0; i < progressByBubble.length; i++) {
      if (progressByBubble[i] > 0) {
        drawBubble(ctx, metrics.cx, metrics.cy, metrics.scale, BUBBLES[i], progressByBubble[i]);
      }
    }
  }

  function paintPreview(ctx, metrics, progressByBubble) {
    if (getVersionConfig().usePlane) {
      drawCoordinatePlane(ctx, metrics);
      drawGotoMarkers(ctx, metrics);
    } else {
      paintSimplePreview(ctx, metrics, progressByBubble);
      return;
    }
    if (!progressByBubble) return;
    for (var i = 0; i < progressByBubble.length; i++) {
      var p = progressByBubble[i];
      if (p > 0) {
        drawBubble(ctx, metrics.cx, metrics.cy, metrics.scale, BUBBLES[i], p);
      }
    }
  }

  function refreshPreview() {
    var frame = document.getElementById('starterOutputFrame');
    var canvas = document.getElementById('starterLiveCanvas');
    var img = frame && frame.querySelector('img');
    var usePlane = getVersionConfig().usePlane;

    if (!frame || !canvas) return null;

    if (usePlane) {
      frame.classList.add('has-plane');
      canvas.hidden = false;
      canvas.removeAttribute('aria-hidden');
      if (img) {
        img.hidden = true;
        img.setAttribute('aria-hidden', 'true');
      }
      var metrics = getStageMetrics();
      if (!metrics.canvas) return null;
      var ctx = setupCanvas(metrics);
      paintPreview(ctx, metrics, null);
      return { ctx: ctx, metrics: metrics };
    }

    frame.classList.remove('has-plane');
    frame.classList.remove('is-live');
    canvas.hidden = true;
    canvas.setAttribute('aria-hidden', 'true');
    if (img) {
      img.hidden = false;
      img.removeAttribute('aria-hidden');
    }
    return null;
  }

  function drawBubble(ctx, cx, cy, scale, bubble, progress) {
    var pos = turtleToCanvas(cx, cy, scale, bubble.x, bubble.y);
    var r = bubble.size * scale * progress;
    if (r < 1) return;

    ctx.strokeStyle = bubble.color;
    ctx.lineWidth = bubble.stroke;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - r, r, 0, Math.PI * 2 * progress);
    if (progress >= 1) ctx.closePath();
    ctx.stroke();
  }

  function runStarterExample() {
    var runBtn = document.getElementById('runStarterExample');
    var frame = document.getElementById('starterOutputFrame');
    var canvas = document.getElementById('starterLiveCanvas');
    var img = frame && frame.querySelector('img');
    if (!canvas) return;

    if (frame) frame.classList.add('is-live');
    canvas.hidden = false;
    canvas.removeAttribute('aria-hidden');
    if (img) {
      img.hidden = true;
      img.setAttribute('aria-hidden', 'true');
    }

    var metrics = getStageMetrics();
    if (!metrics.canvas) return;
    var ctx = setupCanvas(metrics);
    metrics.frame = frame;

    if (runBtn) runBtn.disabled = true;

    var i = 0;
    function animateBubble() {
      if (i >= BUBBLES.length) {
        var done = [];
        for (var d = 0; d < BUBBLES.length; d++) done.push(1);
        paintPreview(ctx, metrics, done);
        if (runBtn) runBtn.disabled = false;
        return;
      }
      var start = null;
      var duration = 700;

      function frameLoop(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        var progress = [];
        for (var j = 0; j < BUBBLES.length; j++) {
          if (j < i) progress.push(1);
          else if (j === i) progress.push(t);
          else progress.push(0);
        }
        paintPreview(ctx, metrics, progress);
        if (t < 1) {
          requestAnimationFrame(frameLoop);
        } else {
          i++;
          setTimeout(animateBubble, 120);
        }
      }
      requestAnimationFrame(frameLoop);
    }

    animateBubble();
  }

  function initRun() {
    var runBtn = document.getElementById('runStarterExample');
    if (runBtn) {
      runBtn.addEventListener('click', runStarterExample);
    }
  }

  function initPreviewPanel() {
    var starterPanel = document.querySelector('.mission-panel--starter');
    if (starterPanel) {
      starterPanel.addEventListener('toggle', function () {
        if (starterPanel.open) requestAnimationFrame(refreshPreview);
      });
    }
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshPreview, 120);
    });
  }

  initSpotlight();
  initMissionChecklist();
  initVersionTabs();
  initPreviewPanel();
  initRun();
})();
