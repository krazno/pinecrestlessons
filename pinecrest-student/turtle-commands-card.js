/* Turtle command card — simple table + quick reminders (resources sections) */
(function () {
  var data = window.TURTLE_COMMANDS;
  if (!data) return;

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

  document.querySelectorAll('[data-turtle-commands-card]').forEach(function (root) {
    var tableBody = root.querySelector('[data-turtle-commands-table]');
    var remindersEl = root.querySelector('[data-turtle-commands-reminders]');
    var sampleEl = root.querySelector('[data-turtle-commands-sample]');

    if (tableBody && data.simple) {
      function cardEmoji(cmd) {
        if (cmd.indexOf('forward') >= 0 || cmd.indexOf('backward') >= 0) return '🏃';
        if (cmd.indexOf('right') >= 0 || cmd.indexOf('left') >= 0) return '🔄';
        if (cmd.indexOf('penup') >= 0 || cmd.indexOf('pendown') >= 0) return '✋';
        if (cmd.indexOf('color') >= 0) return '🎨';
        if (cmd.indexOf('circle') >= 0) return '⭕';
        if (cmd.indexOf('goto') >= 0) return '📍';
        if (cmd.indexOf('width') >= 0) return '📏';
        if (cmd.indexOf('speed') >= 0) return '⚡';
        if (cmd.indexOf('write') >= 0) return '💬';
        if (cmd.indexOf('done') >= 0) return '🪟';
        return '🐢';
      }
      tableBody.innerHTML = data.simple
        .map(function (row) {
          return (
            '<tr><td class="turtle-cmd-cell"><span class="turtle-cmd-emoji" aria-hidden="true">' +
            cardEmoji(row.cmd) +
            '</span><code class="turtle-cmd-pill">' +
            row.cmd +
            '</code></td><td class="turtle-cmd-meaning">' +
            row.meaning +
            '</td></tr>'
          );
        })
        .join('');
    }

    if (remindersEl && data.reminders) {
      remindersEl.innerHTML = data.reminders
        .map(function (row) {
          return (
            '<span><strong>' +
            row.term +
            '</strong> = ' +
            row.meaning +
            '</span>'
          );
        })
        .join('');
    }

    if (sampleEl && data.sample) {
      sampleEl.textContent = data.sample;
      var copyBtn = root.querySelector('[data-turtle-sample-copy]');
      if (copyBtn) {
        copyBtn.hidden = false;
        copyBtn.addEventListener('click', function () {
          var label = copyBtn.textContent;
          copyToClipboard(data.sample).then(function (ok) {
            if (!ok) return;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('is-copied');
            window.setTimeout(function () {
              copyBtn.textContent = label;
              copyBtn.classList.remove('is-copied');
            }, 2000);
          });
        });
      }
    }
  });
})();
