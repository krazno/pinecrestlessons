/* Flag Challenge — mission checklist persistence */
(function () {
  var CHECK_KEY = 'pinecrest_flag_challenge_mission_checks';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMissionChecklist);
  } else {
    initMissionChecklist();
  }
})();
