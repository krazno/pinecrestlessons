(function () {
  var TOPICS = [
    {
      id: 'if',
      label: 'if',
      title: 'if — run code when a test is true',
      tag: 'conditionals',
      pattern: 'if condition:\n    # indented block runs when condition is True',
      meaning: 'Python checks the <strong>condition</strong>. If it is <strong>True</strong>, the indented lines under <code>if</code> run. If it is <strong>False</strong>, Python skips that block.',
      filename: 'check_score.py',
      code: 'score = 90\npassing = 80\n\nif score >= passing:\n    print("You passed!")\n',
      output: 'You passed!',
      reminder: 'The line after <code>if</code> ends with a <strong>colon</strong>. The next lines must be <strong>indented</strong> (usually 4 spaces).'
    },
    {
      id: 'else',
      label: 'else',
      title: 'else — run code when the if was false',
      tag: 'conditionals',
      pattern: 'if condition:\n    # runs when True\nelse:\n    # runs when False',
      meaning: '<code>else</code> gives you a second path. When the <code>if</code> test is <strong>False</strong>, Python runs the <code>else</code> block instead.',
      filename: 'pass_or_retry.py',
      code: 'score = 70\npassing = 80\n\nif score >= passing:\n    print("You passed!")\nelse:\n    print("Keep practicing.")\n',
      output: 'Keep practicing.',
      reminder: '<code>else</code> does <strong>not</strong> take a condition. It only runs when the <code>if</code> above was false.'
    },
    {
      id: 'elif',
      label: 'elif',
      title: 'elif — check another condition',
      tag: 'conditionals',
      pattern: 'if condition1:\n    ...\nelif condition2:\n    ...\nelse:\n    ...',
      meaning: 'Use <code>elif</code> (else if) when you have <strong>more than two choices</strong>. Python checks from top to bottom and stops at the first true test.',
      filename: 'letter_grade.py',
      code: 'score = 85\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("Keep going")\n',
      output: 'B',
      reminder: 'Only <strong>one</strong> branch runs — the first condition that is true. Order matters.'
    },
    {
      id: 'compare',
      label: 'comparisons',
      title: 'Comparison operators — True or False',
      tag: 'tests',
      pattern: '==  equal     !=  not equal\n<   less      >   greater\n<=  less/equal  >=  greater/equal',
      meaning: 'Conditions inside <code>if</code> usually use these operators. They compare values and give you <strong>True</strong> or <strong>False</strong>.',
      filename: 'compare.py',
      code: 'age = 12\n\nif age >= 13:\n    print("teen")\nelse:\n    print("not a teen yet")\n\nprint(10 == 10)   # True\nprint(5 != 5)     # False\n',
      output: 'not a teen yet\nTrue\nFalse',
      reminder: 'Use <code>==</code> to compare. A single <code>=</code> is for <strong>assignment</strong> (storing a value), not comparing.'
    },
    {
      id: 'and-or',
      label: 'and / or',
      title: 'and / or — combine conditions',
      tag: 'tests',
      pattern: 'if a and b:   # both must be True\nif a or b:    # at least one True\nif not a:     # flip True ↔ False',
      meaning: '<strong>and</strong> needs every part to be true. <strong>or</strong> needs at least one part to be true. <strong>not</strong> reverses true/false.',
      filename: 'club_signup.py',
      code: 'age = 11\nhas_permission = True\n\nif age >= 10 and has_permission:\n    print("Welcome to the club!")\nelse:\n    print("Sorry, not yet.")\n',
      output: 'Welcome to the club!',
      reminder: 'Read <code>and</code> as “both must be yes.” Read <code>or</code> as “at least one yes.”'
    },
    {
      id: 'for-range',
      label: 'for + range',
      title: 'for loop — repeat a set number of times',
      tag: 'loops',
      pattern: 'for variable in range(count):\n    # repeat this block',
      meaning: '<code>range(n)</code> counts from <strong>0</strong> up to <strong>n − 1</strong>. The loop variable (<code>i</code>) changes each time through the loop.',
      filename: 'count_loop.py',
      code: 'for i in range(3):\n    print("Hello", i)\n',
      output: 'Hello 0\nHello 1\nHello 2',
      reminder: '<code>range(3)</code> runs <strong>3 times</strong> with values 0, 1, 2 — not 1, 2, 3.'
    },
    {
      id: 'for-list',
      label: 'for + list',
      title: 'for loop — go through each item in a list',
      tag: 'loops',
      pattern: 'for item in my_list:\n    # use item each time',
      meaning: 'Instead of counting, you can loop over a <strong>list</strong>. Each time, <code>item</code> is the next value in the list.',
      filename: 'colors.py',
      code: 'colors = ["red", "blue", "green"]\n\nfor color in colors:\n    print(color)\n',
      output: 'red\nblue\ngreen',
      reminder: 'The loop variable name is yours — <code>color</code>, <code>n</code>, <code>letter</code>, etc. Pick something that describes the data.'
    },
    {
      id: 'while',
      label: 'while',
      title: 'while loop — repeat while a condition is true',
      tag: 'loops',
      pattern: 'while condition:\n    # repeat until condition is False',
      meaning: 'A <code>while</code> loop keeps going as long as the test stays <strong>True</strong>. Make sure something inside the loop eventually makes the condition <strong>False</strong>, or it runs forever.',
      filename: 'countdown.py',
      code: 'count = 3\n\nwhile count > 0:\n    print(count)\n    count = count - 1\n\nprint("Go!")\n',
      output: '3\n2\n1\nGo!',
      reminder: 'Update the variable inside the loop (<code>count = count - 1</code>) so the loop can stop.'
    },
    {
      id: 'if-in-loop',
      label: 'if inside loop',
      title: 'if inside a for loop — check each item',
      tag: 'mix',
      pattern: 'for item in items:\n    if test:\n        # do something',
      meaning: 'You can put <code>if</code> <strong>inside</strong> a loop to make a decision for every item. This shows up a lot in turtle and list activities.',
      filename: 'find_67.py',
      code: 'numbers = [12, 45, 67, 88]\n\nfor n in numbers:\n    if n == 67:\n        print("Found it:", n)\n',
      output: 'Found it: 67',
      reminder: 'Indent the <code>if</code> block <strong>inside</strong> the <code>for</code> loop — one level deeper than <code>for</code>.'
    }
  ];

  var toolbar = document.getElementById('syntaxTopics');
  var titleEl = document.getElementById('syntaxTitle');
  var tagEl = document.getElementById('syntaxTag');
  var patternEl = document.getElementById('syntaxPattern');
  var meaningEl = document.getElementById('syntaxMeaning');
  var codeEl = document.getElementById('syntaxCode');
  var outputEl = document.getElementById('syntaxOutput');
  var reminderEl = document.getElementById('syntaxReminder');
  var fnameEl = document.getElementById('syntaxFilename');
  var activeId = TOPICS[0].id;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
    body = body.replace(/\b(def|return|if|else|elif|for|in|while|not|and|or|import|from|True|False)\b/g, '<span class="hl-kw">$1</span>');
    body = body.replace(/\b(print|range|len|str|int)\b/g, '<span class="hl-fn">$1</span>');
    body = body.replace(/\b([a-z_][a-z0-9_]*)\s*(?=\()/gi, function (m) {
      var skip = ['if', 'for', 'def', 'in', 'return', 'print', 'str', 'range', 'else', 'elif', 'while', 'not', 'and', 'or'];
      if (skip.indexOf(m.toLowerCase()) >= 0) return m;
      return '<span class="hl-name">' + m + '</span>';
    });
    body = body.replace(/\b(\d+)\b/g, '<span class="hl-num">$1</span>');
    body = body.replace(/\x00S(\d+)\x00/g, function (_, i) { return parts[Number(i)]; });
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

  function renderCode(code) {
    return code.split('\n').map(function (line, i) {
      var n = String(i + 1).padStart(2, ' ');
      return '<div class="syntax-ide-line"><span class="syntax-ide-ln">' + n + '</span><span class="syntax-ide-txt">' + highlightCodeLine(line) + '</span></div>';
    }).join('');
  }

  function findTopic(id) {
    for (var i = 0; i < TOPICS.length; i++) {
      if (TOPICS[i].id === id) return TOPICS[i];
    }
    return TOPICS[0];
  }

  function setActiveChip(id) {
    if (!toolbar) return;
    toolbar.querySelectorAll('.syntax-chip').forEach(function (chip) {
      var on = chip.getAttribute('data-topic') === id;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function showTopic(id) {
    var topic = findTopic(id);
    activeId = topic.id;
    setActiveChip(topic.id);
    if (titleEl) titleEl.textContent = topic.title;
    if (tagEl) tagEl.textContent = topic.tag;
    if (patternEl) patternEl.textContent = topic.pattern;
    if (meaningEl) meaningEl.innerHTML = topic.meaning;
    if (codeEl) codeEl.innerHTML = renderCode(topic.code);
    if (outputEl) outputEl.textContent = topic.output;
    if (reminderEl) reminderEl.innerHTML = topic.reminder;
    if (fnameEl) fnameEl.textContent = topic.filename;
    if (history.replaceState) {
      history.replaceState(null, '', '#' + topic.id);
    }
  }

  if (toolbar) {
    TOPICS.forEach(function (topic) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'syntax-chip';
      btn.setAttribute('data-topic', topic.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = topic.label;
      btn.addEventListener('click', function () { showTopic(topic.id); });
      toolbar.appendChild(btn);
    });
  }

  var hash = (location.hash || '').replace(/^#/, '');
  if (hash && findTopic(hash).id === hash) {
    showTopic(hash);
  } else {
    showTopic(TOPICS[0].id);
  }

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace(/^#/, '');
    if (h && findTopic(h).id === h) showTopic(h);
  });
})();
