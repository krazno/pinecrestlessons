/* Initials on a Grid — graph paper → coordinates → draw_H() / draw_B() / draw_B_round() */
(function () {
  var CHECK_KEY = 'pinecrest_initials_grid_mission_checks';

  function arcToLineSegments(cx, cy, r, startRad, endRad, clockwise, steps, color) {
    var out = [];
    var sweep = endRad - startRad;
    if (clockwise) {
      if (sweep > 0) sweep -= Math.PI * 2;
    } else if (sweep < 0) {
      sweep += Math.PI * 2;
    }
    for (var i = 0; i < steps; i++) {
      var a1 = startRad + (sweep * i) / steps;
      var a2 = startRad + (sweep * (i + 1)) / steps;
      out.push({
        x1: cx + r * Math.cos(a1),
        y1: cy + r * Math.sin(a1),
        x2: cx + r * Math.cos(a2),
        y2: cy + r * Math.sin(a2),
        color: color
      });
    }
    return out;
  }

  var STARTER_CODE_H =
    '# Mission 2 · Initials — sample letter H\n' +
    'import turtle\n' +
    '\n' +
    't = turtle.Turtle()\n' +
    't.speed(3)\n' +
    '\n' +
    'def draw_H():\n' +
    '    # Left vertical line\n' +
    '    t.color("blue")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(-50, 100)\n' +
    '\n' +
    '    # Middle horizontal line\n' +
    '    t.color("green")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, 0)\n' +
    '    t.pendown()\n' +
    '    t.goto(50, 0)\n' +
    '\n' +
    '    # Right vertical line\n' +
    '    t.color("blue")\n' +
    '    t.penup()\n' +
    '    t.goto(50, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(50, 100)\n' +
    '\n' +
    '\n' +
    'draw_H()\n' +
    '\n' +
    'turtle.done()';

  var STARTER_CODE_B =
    '# Mission 2 · Initials — block letter B (straight lines)\n' +
    'import turtle\n' +
    '\n' +
    't = turtle.Turtle()\n' +
    't.speed(3)\n' +
    '\n' +
    'def draw_B():\n' +
    '    # Spine (left side)\n' +
    '    t.color("blue")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(-50, 100)\n' +
    '\n' +
    '    # Top bar (across the top bump)\n' +
    '    t.color("cyan")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, 100)\n' +
    '    t.pendown()\n' +
    '    t.goto(40, 100)\n' +
    '\n' +
    '    # Right side of top bump\n' +
    '    t.penup()\n' +
    '    t.goto(40, 100)\n' +
    '    t.pendown()\n' +
    '    t.goto(40, 0)\n' +
    '\n' +
    '    # Middle bar (between the two bumps)\n' +
    '    t.color("green")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, 0)\n' +
    '    t.pendown()\n' +
    '    t.goto(40, 0)\n' +
    '\n' +
    '    # Bottom bar\n' +
    '    t.color("cyan")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(40, -100)\n' +
    '\n' +
    '    # Right side of bottom bump\n' +
    '    t.penup()\n' +
    '    t.goto(40, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(40, 0)\n' +
    '\n' +
    '\n' +
    'draw_B()\n' +
    '\n' +
    'turtle.done()';

  var STARTER_CODE_B_ROUND =
    '# Mission 2 · Initials — round letter B (half-circles)\n' +
    'import turtle\n' +
    '\n' +
    't = turtle.Turtle()\n' +
    't.speed(3)\n' +
    '\n' +
    'def draw_B_round():\n' +
    '    # Spine (left side)\n' +
    '    t.color("blue")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, -100)\n' +
    '    t.pendown()\n' +
    '    t.goto(-50, 100)\n' +
    '\n' +
    '    # Top bump — half circle (opens to the right)\n' +
    '    t.color("cyan")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, 50)\n' +
    '    t.pendown()\n' +
    '    t.setheading(270)\n' +
    '    t.circle(50, 180)\n' +
    '\n' +
    '    # Bottom bump — half circle\n' +
    '    t.color("green")\n' +
    '    t.penup()\n' +
    '    t.goto(-50, -50)\n' +
    '    t.pendown()\n' +
    '    t.setheading(270)\n' +
    '    t.circle(50, -180)\n' +
    '\n' +
    '\n' +
    'draw_B_round()\n' +
    '\n' +
    'turtle.done()';

  var LETTER_H = [
    { x1: -50, y1: -100, x2: -50, y2: 100, color: '#3b82f6' },
    { x1: -50, y1: 0, x2: 50, y2: 0, color: '#22c55e' },
    { x1: 50, y1: -100, x2: 50, y2: 100, color: '#3b82f6' }
  ];

  var LETTER_B = [
    { x1: -50, y1: -100, x2: -50, y2: 100, color: '#3b82f6' },
    { x1: -50, y1: 100, x2: 40, y2: 100, color: '#22d3ee' },
    { x1: 40, y1: 100, x2: 40, y2: 0, color: '#22d3ee' },
    { x1: -50, y1: 0, x2: 40, y2: 0, color: '#22c55e' },
    { x1: -50, y1: -100, x2: 40, y2: -100, color: '#22d3ee' },
    { x1: 40, y1: -100, x2: 40, y2: 0, color: '#22d3ee' }
  ];

  var LETTER_B_ROUND = [{ x1: -50, y1: -100, x2: -50, y2: 100, color: '#3b82f6' }]
    .concat(arcToLineSegments(0, 50, 50, Math.PI, -Math.PI / 2, false, 20, '#22d3ee'))
    .concat(arcToLineSegments(0, -50, 50, Math.PI, Math.PI / 2, true, 20, '#22c55e'));

  var LETTERS = {
    H: {
      code: STARTER_CODE_H,
      segments: LETTER_H,
      svg: '../examples/initials-letter-h.svg',
      spotlight: { draw_H: [7, 30] },
      defaultSpotlight: 'draw_H',
      runHint:
        'The coordinate plane matches Python turtle. Click <strong>Run example</strong> to draw letter <strong>H</strong> on the grid.'
    },
    B: {
      code: STARTER_CODE_B,
      segments: LETTER_B,
      svg: '../examples/initials-letter-b.svg',
      spotlight: { draw_B: [7, 48] },
      defaultSpotlight: 'draw_B',
      runHint:
        'The coordinate plane matches Python turtle. Click <strong>Run example</strong> to draw a <strong>block B</strong> (six straight lines).'
    },
    R: {
      code: STARTER_CODE_B_ROUND,
      segments: LETTER_B_ROUND,
      svg: '../examples/initials-letter-b-round.svg',
      spotlight: { draw_B_round: [7, 40] },
      defaultSpotlight: 'draw_B_round',
      runHint:
        'The coordinate plane matches Python turtle. Click <strong>Run example</strong> to draw a <strong>round B</strong> with two half-circles.'
    }
  };

  var activeLetter = 'H';

  var PLANE_SCALE = 0.55;
  var PLANE_CY_OFFSET = 8;
  var PLANE_GRID_STEP = 50;
  var PLANE_LABEL_STEP = 100;

  function getLetterConfig() {
    return LETTERS[activeLetter] || LETTERS.H;
  }

  function getActiveSegments() {
    return getLetterConfig().segments;
  }

  function turtleToCanvas(cx, cy, scale, tx, ty) {
    return { x: cx + tx * scale, y: cy - ty * scale };
  }

  function wrapCodeLines() {
    var pre = document.getElementById('starterExampleCode');
    if (!pre) return;

    var lines = getLetterConfig().code.split('\n');
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

    var range = getLetterConfig().spotlight[key];
    pre.querySelectorAll('.code-line').forEach(function (line) {
      var n = parseInt(line.dataset.line, 10);
      line.classList.toggle('is-highlight', range && n >= range[0] && n <= range[1]);
    });

    document.querySelectorAll('.fn-spotlight-btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.spotlight === key);
    });
  }

  function switchLetter(letter) {
    if (!LETTERS[letter]) letter = 'H';
    activeLetter = letter;
    var cfg = getLetterConfig();
    var label = letter;

    document.querySelectorAll('.fn-spotlight-btn[data-letter]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.letter === letter);
    });

    var runHint = document.getElementById('starterRunHint');
    if (runHint) runHint.innerHTML = cfg.runHint;

    var frame = document.getElementById('starterOutputFrame');
    if (frame) {
      frame.setAttribute('aria-label', 'Turtle coordinate plane — letter ' + label + ' preview');
    }

    var canvas = document.getElementById('starterLiveCanvas');
    if (canvas) {
      canvas.setAttribute('aria-label', 'Coordinate plane; run the example to draw letter ' + label);
    }

    var img = document.getElementById('starterPreviewImg');
    if (img) img.src = cfg.svg;

    wrapCodeLines();
    setSpotlight(cfg.defaultSpotlight);
    refreshCoordinatePlane();
  }

  function initSpotlight() {
    document.querySelectorAll('.fn-spotlight-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var letter = btn.dataset.letter;
        if (letter && letter !== activeLetter) switchLetter(letter);
        setSpotlight(btn.dataset.spotlight);
      });
    });
    switchLetter('H');
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
  }

  function drawSegment(ctx, metrics, seg, progress) {
    var from = turtleToCanvas(metrics.cx, metrics.cy, metrics.scale, seg.x1, seg.y1);
    var to = turtleToCanvas(metrics.cx, metrics.cy, metrics.scale, seg.x2, seg.y2);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress);
    ctx.stroke();
  }

  function paintPreview(ctx, metrics, progressBySegment) {
    var segments = getActiveSegments();
    drawCoordinatePlane(ctx, metrics);
    if (!progressBySegment) return;
    for (var i = 0; i < progressBySegment.length; i++) {
      if (progressBySegment[i] > 0) {
        drawSegment(ctx, metrics, segments[i], progressBySegment[i]);
      }
    }
  }

  function showCoordinateCanvas() {
    var frame = document.getElementById('starterOutputFrame');
    var canvas = document.getElementById('starterLiveCanvas');
    if (!frame || !canvas) return;
    frame.classList.add('has-plane');
    canvas.hidden = false;
    canvas.removeAttribute('aria-hidden');
  }

  function refreshCoordinatePlane() {
    showCoordinateCanvas();
    var metrics = getStageMetrics();
    if (!metrics.canvas) return null;
    var ctx = setupCanvas(metrics);
    paintPreview(ctx, metrics, null);
    return { ctx: ctx, metrics: metrics };
  }

  function runStarterExample() {
    var runBtn = document.getElementById('runStarterExample');
    var stage = refreshCoordinatePlane();
    if (!stage) return;

    var ctx = stage.ctx;
    var metrics = stage.metrics;
    var segments = getActiveSegments();
    if (metrics.frame) metrics.frame.classList.add('is-live');

    if (runBtn) runBtn.disabled = true;

    var i = 0;
    function animateNext() {
      if (i >= segments.length) {
        var done = [];
        for (var d = 0; d < segments.length; d++) done.push(1);
        paintPreview(ctx, metrics, done);
        if (runBtn) runBtn.disabled = false;
        return;
      }
      var start = null;
      var duration = 500;

      function frameLoop(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        var progress = [];
        for (var j = 0; j < segments.length; j++) {
          if (j < i) progress.push(1);
          else if (j === i) progress.push(t);
          else progress.push(0);
        }
        paintPreview(ctx, metrics, progress);
        if (t < 1) {
          requestAnimationFrame(frameLoop);
        } else {
          i++;
          setTimeout(animateNext, 100);
        }
      }
      requestAnimationFrame(frameLoop);
    }

    animateNext();
  }

  function initRun() {
    var runBtn = document.getElementById('runStarterExample');
    if (runBtn) runBtn.addEventListener('click', runStarterExample);
  }

  function initCoordinatePlane() {
    refreshCoordinatePlane();
    var starterPanel = document.querySelector('.mission-panel--starter');
    if (starterPanel) {
      starterPanel.addEventListener('toggle', function () {
        if (starterPanel.open) requestAnimationFrame(refreshCoordinatePlane);
      });
    }
    var planPanel = document.getElementById('gridPlanPanel');
    if (planPanel) {
      planPanel.addEventListener('toggle', function () {
        if (planPanel.open) requestAnimationFrame(refreshCoordinatePlane);
      });
    }
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshCoordinatePlane, 120);
    });
  }

  initSpotlight();
  initMissionChecklist();
  initCoordinatePlane();
  initRun();
})();
