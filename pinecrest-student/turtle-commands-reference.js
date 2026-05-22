/* Turtle command reference UI — topic chips + command table */
(function () {
  var data = window.TURTLE_COMMANDS;
  if (!data || !data.groups || !data.groups.length) return;

  var toolbar = document.getElementById('turtleCommandTopics');
  var titleEl = document.getElementById('turtleCommandTitle');
  var tableBody = document.getElementById('turtleCommandTableBody');
  var sampleEl = document.getElementById('turtleCommandSample');
  var activeId = data.groups[0].id;

  function findGroup(id) {
    for (var i = 0; i < data.groups.length; i++) {
      if (data.groups[i].id === id) return data.groups[i];
    }
    return data.groups[0];
  }

  function renderTable(commands) {
    if (!tableBody) return;
    tableBody.innerHTML = commands
      .map(function (row) {
        return (
          '<tr><td><code>' +
          row.cmd +
          '</code></td><td>' +
          row.meaning +
          '</td></tr>'
        );
      })
      .join('');
  }

  function setActiveChip(id) {
    if (!toolbar) return;
    toolbar.querySelectorAll('.turtle-cmd-chip').forEach(function (chip) {
      var on = chip.getAttribute('data-cmd-group') === id;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function showGroup(id) {
    var group = findGroup(id);
    activeId = group.id;
    setActiveChip(group.id);
    if (titleEl) titleEl.textContent = group.title;
    renderTable(group.commands);
  }

  if (toolbar) {
    data.groups.forEach(function (group) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'turtle-cmd-chip';
      btn.setAttribute('data-cmd-group', group.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = group.label;
      btn.addEventListener('click', function () {
        showGroup(group.id);
      });
      toolbar.appendChild(btn);
    });
  }

  if (sampleEl && data.sample) {
    sampleEl.textContent = data.sample;
  }

  var hash = (location.hash || '').replace(/^#/, '');
  if (hash && findGroup(hash).id === hash) {
    showGroup(hash);
  } else {
    showGroup(data.groups[0].id);
  }
})();
