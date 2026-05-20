/* Class gallery — embedded Google Drive folder (uploads appear after refresh) */
(function () {
  var cfg = window.ACTIVITY_CONFIG || {};
  var folderId = cfg.googleFolderId || parseFolderId(cfg.googleFolderUrl);
  var folderUrl = cfg.googleFolderUrl || (folderId ? 'https://drive.google.com/drive/folders/' + folderId : '');
  var resourceKey = cfg.googleFolderResourceKey || '';

  var frameEl = document.getElementById('galleryDriveFrame');
  var openEl = document.getElementById('galleryDriveOpen');
  var uploadEl = document.getElementById('galleryDriveUpload');
  var refreshEl = document.getElementById('galleryDriveRefresh');
  function parseFolderId(url) {
    if (!url) return '';
    var m = String(url).match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : '';
  }

  function driveEmbedSrc(id) {
    var src = 'https://drive.google.com/embeddedfolderview?id=' + encodeURIComponent(id);
    if (resourceKey) src += '&resourcekey=' + encodeURIComponent(resourceKey);
    return src + '#grid';
  }

  function wireFolderLinks() {
    [openEl, uploadEl].forEach(function (el) {
      if (el && folderUrl) el.href = folderUrl;
    });
  }

  function showSetupMessage() {
    if (!frameEl) return;
    frameEl.innerHTML =
      '<p class="gallery-drive-placeholder">Set <code>googleFolderUrl</code> in <code>activity-config.js</code> to show class work.</p>';
  }

  function mountIframe() {
    if (!frameEl) return;
    if (!folderId) {
      showSetupMessage();
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.title = 'Class submissions folder';
    iframe.loading = 'lazy';
    iframe.setAttribute('allow', 'autoplay');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.src = driveEmbedSrc(folderId);
    frameEl.innerHTML = '';
    frameEl.appendChild(iframe);
  }

  function refreshGallery() {
    var iframe = frameEl && frameEl.querySelector('iframe');
    if (!iframe) {
      mountIframe();
      return;
    }
    var src = iframe.src;
    iframe.src = 'about:blank';
    iframe.src = src;
  }

  wireFolderLinks();
  mountIframe();

  if (refreshEl) {
    refreshEl.addEventListener('click', refreshGallery);
  }
})();
