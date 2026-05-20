/* Shared turtle command reference — used by lesson page and playground */
(function (root) {
  var PYTHON_SANDBOX_TURTLE = 'https://pythonsandbox.com/turtle';

  var SAMPLE_COMMANDS =
    'import turtle\n\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)  # 0 = fastest\n\n' +
    't.forward(100)\n';

  var COMMAND_GROUPS = [
    {
      id: 'setup',
      label: 'setup',
      title: 'Setup — start and finish your program',
      commands: [
        { cmd: 'import turtle', meaning: 'Load the turtle drawing library' },
        { cmd: 't = turtle.Turtle()', meaning: 'Create a turtle named t' },
        { cmd: 't.speed(0)', meaning: 'Draw as fast as possible (0 = fastest)' },
        { cmd: 'turtle.done()', meaning: 'Desktop Python only — not needed in Python Sandbox' }
      ]
    },
    {
      id: 'move',
      label: 'move',
      title: 'Move — go forward or backward',
      commands: [
        { cmd: 't.forward(100)', meaning: 'Move forward in the direction the turtle faces' },
        { cmd: 't.backward(50)', meaning: 'Move backward' }
      ]
    },
    {
      id: 'turn',
      label: 'turn',
      title: 'Turn — change direction',
      commands: [
        { cmd: 't.right(90)', meaning: 'Turn right (clockwise)' },
        { cmd: 't.left(90)', meaning: 'Turn left (counterclockwise)' }
      ]
    },
    {
      id: 'pen',
      label: 'pen',
      title: 'Pen — draw or move without a line',
      commands: [
        { cmd: 't.penup()', meaning: 'Lift the pen — move without drawing' },
        { cmd: 't.pendown()', meaning: 'Put the pen down — draw again' }
      ]
    },
    {
      id: 'position',
      label: 'position',
      title: 'Position — jump to a coordinate',
      commands: [
        { cmd: 't.goto(x, y)', meaning: 'Move to (x, y); (0, 0) is the center' },
        { cmd: 't.home()', meaning: 'Go back to the center, facing east' }
      ]
    },
    {
      id: 'style',
      label: 'color & size',
      title: 'Color & line size',
      commands: [
        { cmd: 't.color("blue")', meaning: 'Change the pen color' },
        { cmd: 't.width(5)', meaning: 'Make the line thicker' }
      ]
    },
    {
      id: 'shapes',
      label: 'shapes',
      title: 'Shapes — turtle library icons',
      commands: [
        { cmd: 't.shape("classic")', meaning: 'Arrow pointer (default)' },
        { cmd: 't.shape("turtle")', meaning: 'Small turtle icon' },
        { cmd: 't.shape("circle")', meaning: 'Circle icon' },
        { cmd: 't.shape("square")', meaning: 'Square icon' },
        { cmd: 't.shape("triangle")', meaning: 'Triangle icon' },
        { cmd: 't.shape("arrow")', meaning: 'Arrow icon' }
      ]
    },
    {
      id: 'draw',
      label: 'draw',
      title: 'Draw — circles and text',
      commands: [
        { cmd: 't.circle(40)', meaning: 'Draw a circle with radius 40' },
        { cmd: 't.write("Hi")', meaning: 'Write text on the screen' }
      ]
    }
  ];

  var TURTLE_LIBRARY_SHAPES = ['classic', 'turtle', 'circle', 'square', 'triangle', 'arrow'];

  var SIMPLE_COMMANDS = [
    { cmd: 't.speed(0)', meaning: 'Draw as fast as possible' },
    { cmd: 't.width(5)', meaning: 'Make the line thicker' },
    { cmd: 't.color("blue")', meaning: 'Change the pen color' },
    { cmd: 't.forward(100)', meaning: 'Move forward' },
    { cmd: 't.right(90)', meaning: 'Turn right' },
    { cmd: 't.left(90)', meaning: 'Turn left' },
    { cmd: 't.penup()', meaning: 'Move without drawing' },
    { cmd: 't.pendown()', meaning: 'Start drawing again' },
    { cmd: 't.goto(x, y)', meaning: 'Move to an x/y coordinate' },
    { cmd: 't.circle(40)', meaning: 'Draw a circle' },
    { cmd: 't.write("Hi")', meaning: 'Write text on the screen' },
    { cmd: 'turtle.done()', meaning: 'Desktop Python only — not needed in Python Sandbox' }
  ];

  var QUICK_REMINDERS = [
    { term: 'forward', meaning: 'move' },
    { term: 'left / right', meaning: 'turn' },
    { term: 'penup', meaning: 'move without drawing' },
    { term: 'pendown', meaning: 'draw again' },
    { term: 'goto', meaning: 'move to an x/y location' },
    { term: 'circle', meaning: 'draw a circle' },
    { term: 'color', meaning: 'change color' },
    { term: 'width', meaning: 'change thickness' },
    { term: 'speed', meaning: 'change drawing speed' }
  ];

  var STARTER_CODE =
    'import turtle\n\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)  # 0 = fastest\n\n' +
    't.forward(100)\n';

  var DRAWING_COMMANDS = [
    { cmd: 't.forward(100)', meaning: 'Move forward in the direction the turtle faces' },
    { cmd: 't.backward(50)', meaning: 'Move backward' },
    { cmd: 't.right(90)', meaning: 'Turn right (clockwise)' },
    { cmd: 't.left(90)', meaning: 'Turn left (counterclockwise)' },
    { cmd: 't.penup()', meaning: 'Lift the pen — move without drawing' },
    { cmd: 't.pendown()', meaning: 'Put the pen down — draw again' },
    { cmd: 't.color("blue")', meaning: 'Change the pen color' },
    { cmd: 't.circle(40)', meaning: 'Draw a circle with radius 40' },
    { cmd: 't.goto(x, y)', meaning: 'Jump to (x, y); (0, 0) is the center' },
    { cmd: 't.width(5)', meaning: 'Make the line thicker' },
    { cmd: 't.speed(0)', meaning: 'Draw as fast as possible (0 = fastest)' }
  ];

  var SQUARE_HALF = 40;
  var SQUARE_SIDE = 80;

  var EXAMPLE_LOOP_CODE =
    'import turtle\n\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)\n' +
    't.color("cyan")\n\n' +
    '# Draw a square — forward, turn, repeat 4 times\n' +
    'for i in range(4):\n' +
    '    t.forward(' +
    SQUARE_SIDE +
    ')\n' +
    '    t.right(90)\n';

  var MATH_SQUARE_CODE =
    'import turtle\n\n' +
    't = turtle.Turtle()\n' +
    't.speed(0)\n' +
    't.color("cyan")\n\n' +
    '# (0, 0) is the origin at the center of the screen\n' +
    '# Quadrant I (+, +)   II (−, +)   III (−, −)   IV (+, −)\n\n' +
    't.penup()              # lift pen — jump without drawing\n' +
    't.goto(-40, -40)       # point 1: Quadrant III\n' +
    't.pendown()\n\n' +
    't.goto(40, -40)        # point 2: Quadrant IV\n' +
    't.goto(40, 40)         # point 3: Quadrant I\n' +
    't.goto(-40, 40)        # point 4: Quadrant II\n' +
    't.goto(-40, -40)       # back to point 1 (Quadrant III)\n';

  var SQUARE_CORNER_ROWS = [
    { point: '1', quadrant: 'Quadrant III', x: -40, y: -40 },
    { point: '2', quadrant: 'Quadrant IV', x: 40, y: -40 },
    { point: '3', quadrant: 'Quadrant I', x: 40, y: 40 },
    { point: '4', quadrant: 'Quadrant II', x: -40, y: 40 }
  ];

  var REF_SECTIONS = [
    {
      id: 'getting-started',
      label: 'Getting started',
      title: 'Getting started with turtle',
      tag: 'basics',
      leadQuestion: 'What is turtle in Python?',
      leadAnswer:
        '<strong>Turtle</strong> is a built-in Python library for drawing on the screen. ' +
        'You give a turtle simple commands — <code>forward()</code>, <code>right()</code>, <code>color()</code> — and it leaves lines and shapes behind like a pen.',
      whereToCode:
        '<a class="turtle-ref-ide-cta" href="' +
        PYTHON_SANDBOX_TURTLE +
        '" target="_blank" rel="noopener">Open online IDE →</a>' +
        '<span class="turtle-ref-where-code-rest">Or use <strong>Mu</strong> on your computer (or Trinket, Replit, or IDLE). ' +
        'Click <strong>Copy code</strong> on a program below, paste into your editor, and run it. ' +
        'In the online IDE, press the green <strong>Play</strong> button; in Mu or IDLE, use <strong>Run</strong>.</span>',
      concepts: [
        {
          step: '1',
          icon: '📦',
          cmd: 'import turtle',
          title: 'Load the library',
          text:
            'Tells Python to load the <strong>turtle graphics</strong> module. ' +
            'You only write this once at the top of your file.'
        },
        {
          step: '2',
          icon: '🐢',
          cmd: 't = turtle.Turtle()',
          title: 'Create your turtle',
          text:
            'Creates a turtle and stores it in <code>t</code>. ' +
            'The turtle starts at <strong>(0, 0)</strong> in the center of the window, facing right. ' +
            'You can name the variable anything — <code>t</code> is just short for turtle.'
        },
        {
          step: '3',
          icon: '✏️',
          cmd: 't.forward(100)',
          title: 'Tell the turtle what to do',
          text:
            'Use <code>t.</code> then a command and parentheses — like <code>forward()</code>, ' +
            '<code>right()</code>, and <code>color()</code>. You see your drawing appear right away.'
        },
        {
          step: '4',
          icon: '▶️',
          cmd: 't.speed(0)',
          title: 'Run your program',
          text:
            'Paste your code into <strong>Mu</strong>, <a href="' +
            PYTHON_SANDBOX_TURTLE +
            '" target="_blank" rel="noopener">Python Sandbox</a>, or any editor you like, then run it. ' +
            'Use <code>t.speed(0)</code> to draw as fast as possible. In Mu or IDLE, add <code>turtle.done()</code> at the end if the window closes too fast.'
        }
      ],
      starterFilename: 'hello_turtle.py',
      starterCode: STARTER_CODE
    },
    {
      id: 'drawing-methods',
      label: 'Drawing methods',
      title: 'Drawing methods — the ones you use most',
      tag: 'commands',
      intro:
        'These are the turtle moves you will use most often. ' +
        'Each one starts with your turtle: <code>t.method_name(...)</code>.',
      commands: DRAWING_COMMANDS,
      playgroundLink: true
    },
    {
      id: 'simple-example',
      label: 'Simple example',
      title: 'Simple example — forward and turn',
      tag: 'try it',
      intro:
        'Draw a square the <strong>classic turtle way</strong>: move forward, turn right, repeat four times. ' +
        'Copy the code into your editor (Mu, Python Sandbox, Trinket, and more) and run it — or check the preview on the right.',
      exampleFilename: 'square.py',
      exampleCode: EXAMPLE_LOOP_CODE,
      demo: 'square-loop'
    },
    {
      id: 'math-example',
      label: 'Math example',
      title: 'Math example — same square with x and y',
      tag: 'coordinates',
      intro:
        'Same square — but you plan each <strong>point</strong> with an <strong>x</strong>, a <strong>y</strong>, and its <strong>quadrant</strong>, ' +
        'then use <code>t.goto(x, y)</code> to jump there. Use the table below, copy into your editor, and run.',
      cornerRows: SQUARE_CORNER_ROWS,
      exampleFilename: 'square_xy.py',
      exampleCode: MATH_SQUARE_CODE,
      demo: 'square-coords',
      showCornerLabels: true
    }
  ];

  root.TURTLE_COMMANDS = {
    pythonSandboxTurtle: PYTHON_SANDBOX_TURTLE,
    groups: COMMAND_GROUPS,
    simple: SIMPLE_COMMANDS,
    reminders: QUICK_REMINDERS,
    sample: SAMPLE_COMMANDS,
    libraryShapes: TURTLE_LIBRARY_SHAPES,
    refSections: REF_SECTIONS,
    drawingCommands: DRAWING_COMMANDS,
    starterCode: STARTER_CODE,
    exampleLoopCode: EXAMPLE_LOOP_CODE,
    exampleSquareCode: MATH_SQUARE_CODE,
    mathSquareCode: MATH_SQUARE_CODE,
    squareHalf: SQUARE_HALF,
    squareCornerRows: SQUARE_CORNER_ROWS
  };
})(typeof window !== 'undefined' ? window : globalThis);
