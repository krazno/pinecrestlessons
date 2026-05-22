/* Remember lesson scroll section · restore on “back to lesson” from subpages */
(function () {
  var STORAGE_KEY = 'pinecrestLessonReturn';
  var SUBPAGE_PATH =
    /\/(color-art-lab|initials-grid|flag-challenge|turtle-playground|python-syntax-guide)(\/|$)/;

  var SECTION_IDS = [
    'entryTicketPrep',
    'pythonFunctions',
    'predict',
    'turtleRef',
    'activity',
    'studentGallery',
    'exitTicket',
    'finishEarly',
    'resources',
    'playgroundNav',
    'learningGoals'
  ];

  var DEFAULT_RETURN = {
    'turtle-playground': 'turtleRef',
    'python-syntax-guide': 'playgroundNav',
    'color-art-lab': 'activity',
    'initials-grid': 'activity',
    'flag-challenge': 'activity'
  };

  var COLLAPSIBLE_SELECTORS = {
    resources: '#resources .resources-details',
    playgroundNav: '#playgroundNav .playground-nav-details',
    turtleRef: '#turtleRef .turtle-ref-details',
    learningGoals: '#learningGoals .learning-goals-details'
  };

  function normalizeHash(hash) {
    return String(hash || '')
      .replace(/^#/, '')
      .trim();
  }

  function saveReturn(hash) {
    hash = normalizeHash(hash);
    if (!hash) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, hash);
    } catch (e) {}
  }

  function readReturn() {
    try {
      return normalizeHash(sessionStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return '';
    }
  }

  function getScrollSectionId() {
    var y = window.scrollY + 120;
    var current = '';
    SECTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= y) current = id;
    });
    return current;
  }

  function openCollapsibleForHash(hash) {
    var sel = COLLAPSIBLE_SELECTORS[hash];
    if (!sel) return;
    var details = document.querySelector(sel);
    if (details && !details.open) details.open = true;
  }

  function scrollToHash(hash, smooth) {
    hash = normalizeHash(hash);
    if (!hash) return;
    openCollapsibleForHash(hash);
    var el = document.getElementById(hash);
    if (!el) return;
    window.requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
  }

  function lessonBackHref(hash) {
    return hash ? '../#' + hash : '../';
  }

  function subpageKey() {
    var path = location.pathname;
    if (path.indexOf('turtle-playground') !== -1) return 'turtle-playground';
    if (path.indexOf('python-syntax-guide') !== -1) return 'python-syntax-guide';
    if (path.indexOf('color-art-lab') !== -1) return 'color-art-lab';
    if (path.indexOf('initials-grid') !== -1) return 'initials-grid';
    if (path.indexOf('flag-challenge') !== -1) return 'flag-challenge';
    return '';
  }

  function resolveReturnHash() {
    var fromQuery = normalizeHash(new URLSearchParams(location.search).get('from'));
    if (fromQuery) return fromQuery;
    var stored = readReturn();
    if (stored) return stored;
    return DEFAULT_RETURN[subpageKey()] || '';
  }

  function isOutboundSubpageHref(href) {
    if (!href || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return false;
    return SUBPAGE_PATH.test(href);
  }

  function isLessonBackLink(anchor) {
    var href = anchor.getAttribute('href') || '';
    if (anchor.classList.contains('back')) return true;
    if (anchor.hasAttribute('data-lesson-back')) return true;
    return href === '..' || href === '../';
  }

  function initIndex() {
    document.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (!isOutboundSubpageHref(href)) return;
        var from =
          a.getAttribute('data-return-from') ||
          normalizeHash(location.hash) ||
          getScrollSectionId();
        saveReturn(from);
      },
      true
    );

    function onHashNav() {
      var hash = normalizeHash(location.hash);
      if (!hash) return;
      saveReturn(hash);
      scrollToHash(hash, false);
    }

    window.addEventListener('hashchange', onHashNav);
    if (location.hash) {
      setTimeout(onHashNav, 0);
      setTimeout(function () {
        scrollToHash(normalizeHash(location.hash), false);
      }, 80);
    }
  }

  function initSubpage() {
    var hash = resolveReturnHash();
    var backUrl = lessonBackHref(hash);

    document.querySelectorAll('a[href]').forEach(function (a) {
      if (!isLessonBackLink(a)) return;
      a.setAttribute('href', backUrl);
    });
  }

  if (SUBPAGE_PATH.test(location.pathname)) {
    initSubpage();
  } else {
    initIndex();
  }
})();
