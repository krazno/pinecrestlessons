/* Turtle Playground — canvas preview + Python code */
(function () {
  const HEX_COLORS = '["#ff5f56", "#ffbd2e", "#27c93f", "#00ffe0", "#9b5cff", "#ff2e93"]';

  function hexExpandedBody() {
    var lines = ['# Draw all 6 sides (repeated steps — no loop yet)'];
    for (var i = 0; i < 6; i++) {
      lines.push('t.color(colors[' + i + '])  # pick a color');
      lines.push('t.forward(60)  # one side of the hexagon');
      lines.push('t.left(60)  # turn for the next side');
    }
    return lines.join('\n');
  }

  const TURTLE_HEAD = '# Load the turtle library\nimport turtle\n\n# Create a turtle named t\nt = turtle.Turtle()\nt.speed(0)\n';
  const TURTLE_DONE = '\n# Keep the drawing window open\nturtle.done()';

  const GRID_SCALE_X = 50;
  const GRID_SCALE_Y = 40;
  const GRID_OFFSET_X = -75;
  const GRID_OFFSET_Y = -100;
  const LETTER_COLORS = ['#00ffe0', '#ff2e93', '#d4ff3a', '#ffb800', '#9b5cff', '#ff5f56'];
  const LETTER_LINE_COLORS = ['"cyan"', '"magenta"', '"#d4ff3a"', '"#ffb800"', '"#9b5cff"', '"#ff5f56"'];

  function gridPointToTurtle(gx, gy) {
    return {
      x: gx * GRID_SCALE_X + GRID_OFFSET_X,
      y: gy * GRID_SCALE_Y + GRID_OFFSET_Y
    };
  }

  function buildLetterCode(letterName, segments) {
    var lines = [
      '# Pinecrest letter — turtle x/y coordinates',
      'import turtle',
      '',
      't = turtle.Turtle()',
      't.speed(0)',
      't.width(3)',
      '',
      '# (0, 0) is the center of the screen · x right · y up',
      'def draw_line(x1, y1, x2, y2):',
      '    t.penup()',
      '    t.goto(x1, y1)',
      '    t.pendown()',
      '    t.goto(x2, y2)',
      '',
      '# Letter ' + letterName
    ];
    segments.forEach(function (seg, i) {
      var a = gridPointToTurtle(seg[0][0], seg[0][1]);
      var b = gridPointToTurtle(seg[1][0], seg[1][1]);
      lines.push('t.color(' + LETTER_LINE_COLORS[i % LETTER_LINE_COLORS.length] + ')');
      lines.push('# (' + a.x + ', ' + a.y + ') → (' + b.x + ', ' + b.y + ')');
      lines.push('draw_line(' + a.x + ', ' + a.y + ', ' + b.x + ', ' + b.y + ')');
    });
    lines.push('', '# Keep the window open', 'turtle.done()');
    return lines.join('\n');
  }

  function buildLibShapeCode(shapeName) {
    return (
      TURTLE_HEAD +
      '# Change the turtle icon (built-in shapes from the library)\n' +
      't.shape("' +
      shapeName +
      '")\n' +
      't.forward(1)  # tiny move so the icon is visible\n' +
      TURTLE_DONE
    );
  }

  const PATTERN_CODE = {
    hex: {
      label: 'hexagon',
      canOptimize: true,
      codeSimple: `${TURTLE_HEAD}
# List of colors for each side
colors = ${HEX_COLORS}
${hexExpandedBody()}${TURTLE_DONE}`,
      codeLoop: `${TURTLE_HEAD}
# List of colors for each side
colors = ${HEX_COLORS}
# Loop repeats the same 3 lines 6 times
for i in range(6):
    t.color(colors[i])
    t.forward(60)
    t.left(60)${TURTLE_DONE}`
    },
    star: {
      label: 'star',
      canOptimize: true,
      codeSimple: `${TURTLE_HEAD}
t.color("#00ffe0")

# Draw 5 points of the star (same steps repeated)
t.forward(120)
t.right(144)
t.forward(120)
t.right(144)
t.forward(120)
t.right(144)
t.forward(120)
t.right(144)
t.forward(120)
t.right(144)${TURTLE_DONE}`,
      codeLoop: `${TURTLE_HEAD}
t.color("#00ffe0")

# Loop draws each point of the star
for i in range(5):
    t.forward(120)
    t.right(144)${TURTLE_DONE}`
    },
    spiral: {
      label: 'spiral',
      canOptimize: false,
      code: `${TURTLE_HEAD}
# Loop: longer line and new color each time
for i in range(80):
    t.color(f"hsl({i * 4}, 100%, 60%)")
    t.forward(i * 1.4)
    t.right(35)${TURTLE_DONE}`
    },
    flower: {
      label: 'flower',
      canOptimize: false,
      code: `${TURTLE_HEAD}
# Outer loop: 36 petals
for i in range(36):
    t.color(f"hsl({i * 10}, 90%, 65%)")
    # Inner loop: draw one small hexagon
    for j in range(6):
        t.forward(20)
        t.left(60)
    t.right(10)${TURTLE_DONE}`
    },
    star: {
      label: 'star',
      canOptimize: false,
      code: `${TURTLE_HEAD}
t.color("cyan")
# Draw a star with one loop
for i in range(5):
    t.forward(100)
    t.right(144)${TURTLE_DONE}`
    },
    letter_p: {
      label: 'Pinecrest · P',
      canOptimize: false,
      code: buildLetterCode('P', [[[0, 0], [0, 5]], [[0, 5], [2, 5]], [[2, 5], [2, 3]], [[2, 3], [0, 3]]])
    },
    letter_i: {
      label: 'Pinecrest · I',
      canOptimize: false,
      code: buildLetterCode('I', [[[1, 0], [1, 5]]])
    },
    letter_n: {
      label: 'Pinecrest · N',
      canOptimize: false,
      code: buildLetterCode('N', [[[0, 0], [0, 5]], [[0, 5], [2, 0]], [[2, 0], [2, 5]]])
    },
    letter_c: {
      label: 'Pinecrest · C',
      canOptimize: false,
      code: buildLetterCode('C', [[[3, 0], [0, 0]], [[0, 0], [0, 5]], [[0, 5], [3, 5]]])
    },
    letter_r: {
      label: 'Pinecrest · R',
      canOptimize: false,
      code: buildLetterCode('R', [[[0, 0], [0, 5]], [[0, 5], [2, 5]], [[2, 5], [2, 3]], [[2, 3], [0, 3]], [[2, 3], [2, 0]]])
    },
    letter_e: {
      label: 'Pinecrest · E',
      canOptimize: false,
      code: buildLetterCode('E', [[[0, 5], [2, 5]], [[0, 5], [0, 0]], [[0, 2], [2, 2]], [[0, 0], [2, 0]]])
    },
    letter_e2: {
      label: 'Pinecrest · E',
      canOptimize: false,
      code: buildLetterCode('E', [[[0, 5], [2, 5]], [[0, 5], [0, 0]], [[0, 2], [2, 2]], [[0, 0], [2, 0]]])
    },
    letter_s: {
      label: 'Pinecrest · S',
      canOptimize: false,
      code: buildLetterCode('S', [[[3, 5], [0, 5]], [[0, 5], [0, 3]], [[0, 3], [3, 3]], [[3, 3], [3, 0]], [[3, 0], [0, 0]]])
    },
    letter_t: {
      label: 'Pinecrest · T',
      canOptimize: false,
      code: buildLetterCode('T', [[[0, 5], [3, 5]], [[1, 5], [1, 0]]])
    }
  };

  const tCanvas = document.getElementById('turtleCanvas');
  const tGridCanvas = document.getElementById('turtleGridCanvas');
  const tCanvasWrap = document.getElementById('turtleCanvasWrap');
  const tCoordsText = document.getElementById('turtleCoordsText');
  const tCrosshair = document.getElementById('turtleCrosshair');
  const codeEl = document.getElementById('playgroundCode');
  const patternNameEl = document.getElementById('playgroundPatternName');
  const optimizeBtn = document.getElementById('codeOptimizeBtn');
  const tCtx = tCanvas ? tCanvas.getContext('2d') : null;
  const tGridCtx = tGridCanvas ? tGridCanvas.getContext('2d') : null;

  if (!tCanvas || !tCtx) return;

  const TURTLE_GRID_UNIT = 25;
  let currentTurtleRun = 0;
  let activePattern = null;
  let codeUsesLoop = false;

  const DEFAULT_HINT = 'Pick a drawing pattern, a Pinecrest letter, or a library shape. Turtle coordinates use (0, 0) at the center.';

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

  function gridToCanvas(gx, gy) {
    var size = turtleCanvasSize();
    var tx = gx * GRID_SCALE_X + GRID_OFFSET_X;
    var ty = gy * GRID_SCALE_Y + GRID_OFFSET_Y;
    return { x: size.cx + tx, y: size.cy - ty };
  }

  function drawGridSegment(t, gx1, gy1, gx2, gy2, color) {
    var from = gridToCanvas(gx1, gy1);
    var to = gridToCanvas(gx2, gy2);
    t.setColor(color);
    t.setWidth(2.5);
    t.steps.push({
      from: [from.x, from.y],
      to: [to.x, to.y],
      color: color,
      width: t.width
    });
    t.x = to.x;
    t.y = to.y;
  }

  function letterPattern(segments) {
    return function (t) {
      segments.forEach(function (seg, i) {
        drawGridSegment(t, seg[0][0], seg[0][1], seg[1][0], seg[1][1], LETTER_COLORS[i % LETTER_COLORS.length]);
      });
    };
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
    star: (t) => {
      t.setColor('#00ffe0');
      for (let i = 0; i < 5; i++) {
        t.forward(100);
        t.right(144);
      }
    },
    letter_p: letterPattern([[[0, 0], [0, 5]], [[0, 5], [2, 5]], [[2, 5], [2, 3]], [[2, 3], [0, 3]]]),
    letter_i: letterPattern([[[1, 0], [1, 5]]]),
    letter_n: letterPattern([[[0, 0], [0, 5]], [[0, 5], [2, 0]], [[2, 0], [2, 5]]]),
    letter_c: letterPattern([[[3, 0], [0, 0]], [[0, 0], [0, 5]], [[0, 5], [3, 5]]]),
    letter_r: letterPattern([[[0, 0], [0, 5]], [[0, 5], [2, 5]], [[2, 5], [2, 3]], [[2, 3], [0, 3]], [[2, 3], [2, 0]]]),
    letter_e: letterPattern([[[0, 5], [2, 5]], [[0, 5], [0, 0]], [[0, 2], [2, 2]], [[0, 0], [2, 0]]]),
    letter_e2: letterPattern([[[0, 5], [2, 5]], [[0, 5], [0, 0]], [[0, 2], [2, 2]], [[0, 0], [2, 0]]]),
    letter_s: letterPattern([[[3, 5], [0, 5]], [[0, 5], [0, 3]], [[0, 3], [3, 3]], [[3, 3], [3, 0]], [[3, 0], [0, 0]]]),
    letter_t: letterPattern([[[0, 5], [3, 5]], [[1, 5], [1, 0]]])
  };

  if (window.TURTLE_COMMANDS && window.TURTLE_COMMANDS.libraryShapes) {
    window.TURTLE_COMMANDS.libraryShapes.forEach(function (name) {
      var key = 'shape_' + name;
      PATTERN_CODE[key] = {
        label: 't.shape("' + name + '")',
        canOptimize: false,
        code: buildLibShapeCode(name)
      };
      PATTERNS[key] = function (t) {
        t.setColor('#00ffe0');
        t.setWidth(2);
        t.forward(30);
      };
    });
  }

  function patternCodeText(pattern) {
    var entry = PATTERN_CODE[pattern];
    if (!entry) return '';
    if (entry.canOptimize) {
      return codeUsesLoop ? entry.codeLoop : entry.codeSimple;
    }
    return entry.code;
  }

  function updateOptimizeButton(pattern) {
    if (!optimizeBtn) return;
    var entry = pattern && PATTERN_CODE[pattern];
    if (!entry || !entry.canOptimize) {
      optimizeBtn.hidden = true;
      optimizeBtn.setAttribute('aria-pressed', 'false');
      return;
    }
    optimizeBtn.hidden = false;
    if (codeUsesLoop) {
      optimizeBtn.textContent = '← Show repeated steps';
      optimizeBtn.setAttribute('aria-pressed', 'true');
    } else {
      optimizeBtn.textContent = 'Use a loop →';
      optimizeBtn.setAttribute('aria-pressed', 'false');
    }
  }

  function showCode(pattern) {
    if (!codeEl) return;
    if (!pattern || !PATTERN_CODE[pattern]) {
      if (patternNameEl) patternNameEl.textContent = 'Choose below';
      codeEl.innerHTML = '<p class="playground-code-hint">' + DEFAULT_HINT + '</p>';
      updateOptimizeButton(null);
      return;
    }
    if (patternNameEl) patternNameEl.textContent = PATTERN_CODE[pattern].label;
    codeEl.textContent = patternCodeText(pattern);
    updateOptimizeButton(pattern);
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
    if (p === 'star') { t.x -= 50; t.y += 30; }
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
      codeUsesLoop = false;
      currentTurtleRun++;
      clearTurtle();
      setActiveChip(null);
      showCode(null);
      return;
    }
    activePattern = p;
    codeUsesLoop = false;
    setActiveChip(p);
    showCode(p);
    await redrawPattern(p, true);
  }

  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', function () {
      if (!activePattern || !PATTERN_CODE[activePattern] || !PATTERN_CODE[activePattern].canOptimize) return;
      codeUsesLoop = !codeUsesLoop;
      showCode(activePattern);
    });
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

  var libWrap = document.getElementById('turtleLibShapes');
  if (libWrap && window.TURTLE_COMMANDS && window.TURTLE_COMMANDS.libraryShapes) {
    window.TURTLE_COMMANDS.libraryShapes.forEach(function (name) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip chip-lib-shape';
      btn.setAttribute('data-pattern', 'shape_' + name);
      btn.textContent = name;
      libWrap.appendChild(btn);
    });
  }

  document.querySelectorAll('.turtle-playground .chip[data-pattern]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      selectPattern(chip.dataset.pattern);
    });
  });

  showCode(null);
})();
