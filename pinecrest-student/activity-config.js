/* Set your class Google Drive folder once — used on activity pages + class gallery embed */
(function () {
  var FOLDER_ID = '1Ba48ZTAtgJGDwemyXqB7CkK3HM2h_6tN';
  var FOLDER_URL = 'https://drive.google.com/drive/folders/' + FOLDER_ID + '?usp=sharing';

  window.ACTIVITY_CONFIG = {
    googleFolderUrl: FOLDER_URL,
    googleFolderId: FOLDER_ID,
    /* If the embed is empty, copy resourcekey=… from the folder sharing link into here */
    googleFolderResourceKey: ''
  };

  function folderUrl() {
    var c = window.ACTIVITY_CONFIG;
    return (c && c.googleFolderUrl) || '';
  }

  document.querySelectorAll('[data-class-folder]').forEach(function (el) {
    var url = folderUrl();
    if (url) {
      el.href = url;
      el.removeAttribute('aria-disabled');
    } else {
      el.href = '#';
      el.setAttribute('aria-disabled', 'true');
    }
  });
})();
