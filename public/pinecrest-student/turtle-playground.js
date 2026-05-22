/* Turtle Playground — canvas preview + Python code */
(function () {
  const PATTERN_CODE = {
    hex: {
      label: 'hexagon',
      code: `import turtle

t = turtle.Turtle()
t.speed(0)

colors = ["#ff5f56", "#ffbd2e", "#27c93f", "#00ffe0", "#9b5cff", "#ff2e93"]
for i in range(6):
    t.color(colors[i])
    t.forward(60)
    t.left(60)

turtle.done()`
    },
    star: {
      label: 'star',
      code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.color("#00ffe0")

for i in range(5):
    t.forward(120)
    t.right(144)

turtle.done()`
    },
    spiral: {
      label: 'spiral',
      code: `import turtle

t = turtle.Turtle()
t.speed(0)

for i in range(80):
    t.color(f"hsl({i * 4}, 100%, 60%)")
    t.forward(i * 1.4)
    t.right(35)

turtle.done()`
    },
    flower: {
      label: 'flower',
      code: `import turtle

t = turtle.Turtle()
t.speed(0)

for i in range(36):
    t.color(f"hsl({i * 10}, 90%, 65%)")
    for j in range(6):
        t.forward(20)
        t.left(60)
    t.right(10)

turtle.done()`
    },
    koch: {
      label: 'snowflake',
      code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.color("cyan")

def koch(length, depth):
    if depth == 0:
        t.forward(length)
        return
    koch(length / 3, depth - 1)
    t.left(60)
    koch(length / 3, depth - 1)
    t.right(120)
    koch(length / 3, depth - 1)
    t.left(60)
    koch(length / 3, depth - 1)

for side in range(3):
    koch(180, 3)
    t.right(120)

turtle.done()`
    }
  };

  const tCanvas = document.getElementById('turtleCanvas');
  const tGridCanvas = document.getElementById('turtleGridCanvas');
  const tCanvasWrap = document.getElementById('turtleCanvasWrap');
  const tCoordsText = document.getElementById('turtleCoordsText');
  const tCrosshair = document.getElementById('turtleCrosshair');
  const codeEl = document.getElementById('playgroundCode');
  const patternNameEl = document.getElementById('playgroundPatternName');
  const tCtx = tCanvas ? tCanvas.getContext('2d') : null;
  const tGridCtx = tGridCanvas ? tGridCanvas.getContext('2d') : null;

  if (!tCanvas || !tCtx) return;

  const TURTLE_GRID_UNIT = 25;
  let currentTurtleRun = 0;
  let activePattern = null;

  const DEFAULT_HINT = 'Pick a shape below. You will see the Python code here and a live drawing on the left.';

  function turtleCanvasSize() {
    if (!tCanvasWrap) return { w: 0, h: 0, cx: 0, cy: 0 };
    const r = tCanvasWrap.getBoundingClientRect();
    return { w: r.width, h: r.height, cx: r.width / 2, cy: r.height / 2 };
  }

  function screenToTurtle(px, py) {
    const { cx, cy } = turtleCanvasSize();
    return {
      x: Math.round((px - cx) / TURTLE_GRID_UNIT),
      y: Math.round((cy - py) / TURTLE_GRID_UNIT)
    };
  }

  function drawTurtleGrid() {
    if (!tGridCanvas || !tGridCtx || !tCanvasWrap) return;
    const dpr = window.devicePixelRatio || 1;
    const r = tCanvasWrap.getBoundingClientRect();
    const w = r.width;
    const h = r.height;
    if (w < 10 || h < 10) return;
    tGridCanvas.width = w * dpr;
    tGridCanvas.height = h * dpr;
    tGridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tGridCtx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const u = TURTLE_GRID_UNIT;

    tGridCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    tGridCtx.lineWidth = 1;
    for (let x = cx % u; x <= w; x += u) {
      tGridCtx.beginPath();
      tGridCtx.moveTo(x, 0);
      tGridCtx.lineTo(x, h);
      tGridCtx.stroke();
    }
    for (let y = cy % u; y <= h; y += u) {
      tGridCtx.beginPath();
      tGridCtx.moveTo(0, y);
      tGridCtx.lineTo(w, y);
      tGridCtx.stroke();
    }

    tGridCtx.strokeStyle = 'rgba(0, 255, 224, 0.45)';
    tGridCtx.lineWidth = 1.5;
    tGridCtx.beginPath();
    tGridCtx.moveTo(cx, 0);
    tGridCtx.lineTo(cx, h);
    tGridCtx.stroke();
    tGridCtx.beginPath();
    tGridCtx.moveTo(0, cy);
    tGridCtx.lineTo(w, cy);
    tGridCtx.stroke();

    tGridCtx.fillStyle = 'rgba(212, 255, 58, 0.85)';
    tGridCtx.font = '10px JetBrains Mono, monospace';
    tGridCtx.textAlign = 'center';
    tGridCtx.textBaseline = 'middle';
    for (let tx = 0; cx + tx * u <= w; tx++) {
      const px = cx + tx * u;
      if (tx !== 0) tGridCtx.fillText(String(tx), px, cy + 14);
    }
    for (let tx = 1; cx - tx * u >= 0; tx++) {
      tGridCtx.fillText(String(-tx), cx - tx * u, cy + 14);
    }
    tGridCtx.textAlign = 'right';
    for (let ty = 0; cy - ty * u >= 0; ty++) {
      if (ty !== 0) tGridCtx.fillText(String(ty), cx - 8, cy - ty * u);
    }
    for (let ty = 1; cy + ty * u <= h; ty++) {
      tGridCtx.fillText(String(-ty), cx - 8, cy + ty * u);
    }

    tGridCtx.fillStyle = 'rgba(255, 46, 147, 0.9)';
    tGridCtx.textAlign = 'center';
    tGridCtx.fillText('(0, 0)', cx, cy - 12);
  }

  function updateTurtleCoords(clientX, clientY) {
    if (!tCanvasWrap || !tCoordsText) return;
    const rect = tCanvasWrap.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
      if (tCrosshair) tCrosshair.classList.remove('show');
      tCoordsText.textContent = 'x: —, y: —';
      return;
    }
    const { x, y } = screenToTurtle(px, py);
    tCoordsText.textContent = 'x: ' + x + ', y: ' + y;
    if (tCrosshair) {
      tCrosshair.classList.add('show');
      tCrosshair.style.left = px + 'px';
      tCrosshair.style.top = py + 'px';
    }
  }

  function resizeTurtle() {
    const r = tCanvas.getBoundingClientRect();
    tCanvas.width = r.width * window.devicePixelRatio;
    tCanvas.height = r.height * window.devicePixelRatio;
    tCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    drawTurtleGrid();
    if (activePattern && PATTERNS[activePattern]) {
      redrawPattern(activePattern, false);
    }
  }

  function clearTurtle() {
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
  }

  class Turtle {
    constructor(ctx) {
      this.ctx = ctx;
      this.reset();
    }
    reset() {
      const w = this.ctx.canvas.width / window.devicePixelRatio;
      const h = this.ctx.canvas.height / window.devicePixelRatio;
      this.x = w / 2;
      this.y = h / 2;
      this.heading = -90;
      this.color = '#9b5cff';
      this.width = 1.5;
      this.steps = [];
    }
    setColor(c) { this.color = c; }
    setWidth(w) { this.width = w; }
    forward(d) {
      const rad = this.heading * Math.PI / 180;
      const nx = this.x + Math.cos(rad) * d;
      const ny = this.y + Math.sin(rad) * d;
      this.steps.push({ from: [this.x, this.y], to: [nx, ny], color: this.color, width: this.width });
      this.x = nx;
      this.y = ny;
    }
    left(deg) { this.heading -= deg; }
    right(deg) { this.heading += deg; }
  }

  const PATTERNS = {
    hex: (t) => {
      for (let i = 0; i < 6; i++) {
        t.setColor('hsl(' + (i * 60) + ', 100%, 60%)');
        t.forward(60);
        t.left(60);
      }
    },
    star: (t) => {
      for (let i = 0; i < 5; i++) {
        t.setColor('hsl(' + (i * 72 + 180) + ', 100%, 65%)');
        t.forward(120);
        t.right(144);
      }
    },
    spiral: (t) => {
      for (let i = 0; i < 80; i++) {
        t.setColor('hsl(' + (i * 4) + ', 100%, 60%)');
        t.forward(i * 1.4);
        t.right(35);
      }
    },
    flower: (t) => {
      for (let i = 0; i < 36; i++) {
        t.setColor('hsl(' + (i * 10) + ', 90%, 65%)');
        for (let j = 0; j < 6; j++) {
          t.forward(20);
          t.left(60);
        }
        t.right(10);
      }
    },
    koch: (t) => {
      function koch(d, n) {
        if (n === 0) { t.forward(d); return; }
        koch(d / 3, n - 1); t.left(60);
        koch(d / 3, n - 1); t.right(120);
        koch(d / 3, n - 1); t.left(60);
        koch(d / 3, n - 1);
      }
      t.setColor('#00ffe0');
      for (let i = 0; i < 3; i++) {
        koch(180, 3);
        t.right(120);
      }
    }
  };

  function showCode(pattern) {
    if (!codeEl) return;
    if (!pattern || !PATTERN_CODE[pattern]) {
      if (patternNameEl) patternNameEl.textContent = 'pick a shape';
      codeEl.innerHTML = '<p class="playground-code-hint">' + DEFAULT_HINT + '</p>';
      return;
    }
    if (patternNameEl) patternNameEl.textContent = PATTERN_CODE[pattern].label;
    codeEl.textContent = PATTERN_CODE[pattern].code;
  }

  function setActiveChip(pattern) {
    document.querySelectorAll('.turtle-playground .chip[data-pattern]').forEach(function (chip) {
      chip.classList.toggle('is-active', chip.dataset.pattern === pattern);
    });
  }

  async function redrawPattern(p, animate) {
    if (!PATTERNS[p]) return;
    currentTurtleRun++;
    const myRun = currentTurtleRun;
    clearTurtle();
    const t = new Turtle(tCtx);
    if (p === 'koch') { t.x -= 90; t.y += 50; }
    PATTERNS[p](t);
    const delay = animate === false ? 0 : 8;
    for (const s of t.steps) {
      if (myRun !== currentTurtleRun) return;
      tCtx.strokeStyle = s.color;
      tCtx.lineWidth = s.width;
      tCtx.lineCap = 'round';
      tCtx.beginPath();
      tCtx.moveTo(s.from[0], s.from[1]);
      tCtx.lineTo(s.to[0], s.to[1]);
      tCtx.stroke();
      if (delay > 0) await new Promise(function (r) { setTimeout(r, delay); });
    }
  }

  async function selectPattern(p) {
    if (p === 'clear') {
      activePattern = null;
      currentTurtleRun++;
      clearTurtle();
      setActiveChip(null);
      showCode(null);
      return;
    }
    activePattern = p;
    setActiveChip(p);
    showCode(p);
    await redrawPattern(p, true);
  }

  window.addEventListener('resize', resizeTurtle);
  setTimeout(resizeTurtle, 50);

  if (tCanvasWrap) {
    tCanvasWrap.addEventListener('mousemove', function (e) {
      updateTurtleCoords(e.clientX, e.clientY);
    });
    tCanvasWrap.addEventListener('mouseleave', function () {
      if (tCoordsText) tCoordsText.textContent = 'x: —, y: —';
      if (tCrosshair) tCrosshair.classList.remove('show');
    });
  }

  document.querySelectorAll('.turtle-playground .chip[data-pattern]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      selectPattern(chip.dataset.pattern);
    });
  });

  showCode(null);
})();
