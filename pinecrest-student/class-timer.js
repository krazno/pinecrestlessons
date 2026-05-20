/* Class timer — 45 min (student) · 20 min (faculty sprint) */
(function () {
  var ET = 'America/New_York';
  var isFaculty =
    document.body.classList.contains('faculty-page') ||
    /\/pinecrest-teacher\/?/.test(window.location.pathname);
  var CLASS_SEC = isFaculty ? 20 * 60 : 45 * 60;
  var MARK_15 = isFaculty ? 10 * 60 : 15 * 60;
  var MARK_10 = isFaculty ? 5 * 60 : 10 * 60;
  var MARK_5 = isFaculty ? 2 * 60 : 5 * 60;
  var STORAGE_KEY = isFaculty ? 'pinecrest_faculty_timer_v1' : 'pinecrest_class_timer_v1';
  var initialDisplay = isFaculty ? '20:00' : '45:00';

  function injectTimerBar() {
    if (document.getElementById('classTimerBar')) return;

    var isSubpage = /\/(color-art-lab|initials-grid|flag-challenge|turtle-playground|python-syntax-guide)\//.test(
      window.location.pathname
    );
    var home = isSubpage ? '../' : '';

    var header = document.createElement('header');
    header.className = 'status-bar status-bar--activity';
    header.id = 'classTimerBar';
    header.setAttribute('aria-label', 'Class timer');
    header.innerHTML =
      '<div class="status-left">' +
      '<a class="status-lesson-link" href="' +
      home +
      '#activity">← Lesson</a>' +
      '</div>' +
      '<div class="status-center" aria-live="polite">' +
      '<div class="class-timer-remaining" id="classTimerRemaining">' + initialDisplay + '</div>' +
      '<div class="class-timer-sublabel" id="classTimerSublabel">' + (isFaculty ? 'Sprint time remaining' : 'Class time remaining') + '</div>' +
      '</div>' +
      '<div class="status-right">' +
      '<div class="status-clock-wrap">' +
      '<span class="status-item bright" id="clock">--:-- -- ET</span>' +
      '<span class="status-clock-label">Now</span>' +
      '</div>' +
      '<button type="button" class="class-timer-btn primary" id="classTimerStart" aria-label="Start class timer">▶ Start</button>' +
      '<button type="button" class="class-timer-btn" id="classTimerReset" aria-label="Reset class timer">↺ Reset</button>' +
      '</div>';

    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add('has-class-timer');
    updateSiteHeaderOffsets();
  }

  function updateSiteHeaderOffsets() {
    var bar = document.getElementById('classTimerBar');
    var sub = document.querySelector(
      '.activity-top, .playground-top, .syntax-top, .faculty-jump-nav'
    );
    if (bar) {
      document.documentElement.style.setProperty(
        '--class-timer-h',
        Math.ceil(bar.getBoundingClientRect().height) + 'px'
      );
    }
    if (sub) {
      if (sub.classList.contains('faculty-jump-nav')) {
        document.documentElement.style.setProperty(
          '--faculty-jump-h',
          Math.ceil(sub.getBoundingClientRect().height) + 'px'
        );
      } else {
        document.documentElement.style.setProperty(
          '--page-subnav-h',
          Math.ceil(sub.getBoundingClientRect().height) + 'px'
        );
      }
    }
  }

  function initClock() {
    var clockEl = document.getElementById('clock');
    /* Student lesson page runs its own clock + date */
    if (!clockEl || document.getElementById('statusDate')) return;

    function tick() {
      clockEl.textContent =
        new Intl.DateTimeFormat('en-US', {
          timeZone: ET,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date()) + ' ET';
    }

    tick();
    setInterval(tick, 1000);
  }

  function initClassTimer() {
    var bar = document.getElementById('classTimerBar');
    var remainingEl = document.getElementById('classTimerRemaining');
    var sublabelEl = document.getElementById('classTimerSublabel');
    var startBtn = document.getElementById('classTimerStart');
    var resetBtn = document.getElementById('classTimerReset');
    if (!bar || !remainingEl || !startBtn || !resetBtn) return;

    var sec = CLASS_SEC;
    var running = false;
    var intervalId = null;
    var endsAt = null;
    var flashed15 = false;
    var flashed10 = false;

    function formatTime(s) {
      var m = Math.floor(s / 60);
      var ss = s % 60;
      return m + ':' + String(ss).padStart(2, '0');
    }

    function save() {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            sec: sec,
            running: running,
            endsAt: endsAt,
            flashed15: flashed15,
            flashed10: flashed10
          })
        );
      } catch (e) {}
    }

    function load() {
      try {
        var raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        var st = JSON.parse(raw);
        if (typeof st.sec === 'number') sec = st.sec;
        flashed15 = !!st.flashed15;
        flashed10 = !!st.flashed10;
        if (st.running && st.endsAt) {
          endsAt = st.endsAt;
          sec = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
          if (sec > 0) {
            running = true;
            startBtn.innerHTML = '⏸ Pause';
            startInterval();
          }
        }
      } catch (e) {}
    }

    function flashWarn() {
      bar.classList.remove('is-flashing');
      void bar.offsetWidth;
      bar.classList.add('is-flashing');
      function onEnd(e) {
        if (e.animationName !== 'classTimerWarnFlash') return;
        bar.classList.remove('is-flashing');
        bar.removeEventListener('animationend', onEnd);
      }
      bar.addEventListener('animationend', onEnd);
    }

    function checkMilestones(prevSec) {
      if (prevSec > MARK_15 && sec <= MARK_15 && !flashed15) {
        flashed15 = true;
        flashWarn();
      }
      if (prevSec > MARK_10 && sec <= MARK_10 && !flashed10) {
        flashed10 = true;
        flashWarn();
      }
    }

    function paint() {
      remainingEl.textContent = sec > 0 ? formatTime(sec) : '0:00';
      var isFinal = running && sec > 0 && sec <= MARK_5;
      bar.classList.toggle('is-final', isFinal);
      if (sublabelEl) {
        if (sec === 0) {
          sublabelEl.textContent = isFaculty ? 'Sprint time is up' : 'Class time is up';
        } else if (isFinal) {
          sublabelEl.textContent = isFaculty ? 'Last 2 minutes' : 'Last 5 minutes';
        } else if (running) {
          sublabelEl.textContent = isFaculty ? 'Sprint time remaining' : 'Class time remaining';
        } else {
          sublabelEl.textContent = isFaculty
            ? 'Click Start when the sprint begins'
            : 'Click Start when class begins';
        }
      }
      save();
    }

    function stopInterval() {
      clearInterval(intervalId);
      intervalId = null;
    }

    function startInterval() {
      stopInterval();
      intervalId = setInterval(tickTimer, 250);
    }

    function tickTimer() {
      var prevSec = sec;
      if (endsAt) sec = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      checkMilestones(prevSec);
      paint();
      if (sec <= 0) {
        running = false;
        endsAt = null;
        stopInterval();
        startBtn.innerHTML = '▶ Start';
        save();
      }
    }

    startBtn.addEventListener('click', function () {
      if (running) {
        if (endsAt) sec = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
        running = false;
        endsAt = null;
        stopInterval();
        startBtn.innerHTML = '▶ Resume';
        paint();
        return;
      }
      running = true;
      endsAt = Date.now() + sec * 1000;
      startBtn.innerHTML = '⏸ Pause';
      startInterval();
      paint();
    });

    resetBtn.addEventListener('click', function () {
      running = false;
      endsAt = null;
      stopInterval();
      sec = CLASS_SEC;
      flashed15 = false;
      flashed10 = false;
      bar.classList.remove('is-flashing', 'is-final');
      startBtn.innerHTML = '▶ Start';
      paint();
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    });

    load();
    paint();

    document.querySelectorAll('.status-bar a.status-nav-link[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        if (id === 'learningGoals') {
          var details = target.querySelector('details');
          if (details && !details.open) details.open = true;
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (!document.getElementById('classTimerBar')) {
    injectTimerBar();
  } else {
    document.body.classList.add('has-class-timer');
    updateSiteHeaderOffsets();
  }
  initClock();
  initClassTimer();
  window.addEventListener('resize', updateSiteHeaderOffsets);
  window.addEventListener('load', updateSiteHeaderOffsets);
  requestAnimationFrame(updateSiteHeaderOffsets);
})();
