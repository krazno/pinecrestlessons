# codewithbrett.com

## Live routes

| URL | Page |
|-----|------|
| `/` | Splash — teacher or student, passcode **67** |
| `/pinecrest-teacher/` | **Only teacher page** — faculty PD (*Prompt Like a Pro*) |
| `/pinecrest-student/` | **6th grade CS student lesson (only student page)** |

Old URLs (`/pinecrest/class/`, `/student/`, etc.) redirect to `/pinecrest-student/`.

## Clone on another machine

```bash
git clone https://github.com/krazno/pinecrestlessons.git
cd pinecrestlessons
python3 -m http.server 8765
```

Then open http://localhost:8765/pinecrest-student/ (students) or http://localhost:8765/pinecrest-teacher/ (faculty).

**Production:** [pinecrestlessons on Vercel](https://pinecrestlessons.vercel.app/) — if `codewithbrett.com` still shows an old student layout, hard-refresh (Shift+Reload) or confirm the domain points at this repo’s latest deploy.

## Local preview

```bash
cd pinecrest_lessons   # or codewithbrett — same student lesson after sync
python3 -m http.server 8765
```

- http://localhost:8765/
- http://localhost:8765/pinecrest-student/
- http://localhost:8765/pinecrest-teacher/

**One student page only:** `/pinecrest-student/` is the full interactive lesson (boot screen, easter eggs, predict-the-output, activities). There is no separate “simple” student landing page.

**One teacher page only:** `/pinecrest-teacher/` is the full faculty deck. Old `/pinecrest-teacher/activity-submissions` URLs redirect here.

## Editing the student lesson

Edit in this repo, then sync to production if you deploy from `codewithbrett`:

```bash
rsync -a --delete pinecrest-student/ ../codewithbrett/pinecrest-student/
```

Main files:

- `pinecrest-student/index.html`
- `pinecrest-student/logo.png`
- activity folders (`color-art-lab/`, `initials-grid/`, `flag-challenge/`, `turtle-playground/`, `python-syntax-guide/`)

Form links are set in the `CLASS_LINKS` object near the bottom of `index.html`.

### Activity turn-ins (3 levels)

Sequence: **Activity 1** Color Art Lab → **Activity 2** Initials on a Grid → **Activity 3** Poké Ball-inspired Flag. Activity 1 is required; 2 and 3 are optional. Requirements for each mission are on the student homepage in the **Mission objectives** table.

Each layer has its own activity page (`color-art-lab/`, `initials-grid/`, `flag-challenge/`) with **Submit your work** (Google Drive) at the bottom. Teacher examples use **Code** / **Output** panels.

Set your class folder URL once in `pinecrest-student/activity-config.js` (`googleFolderId` / `googleFolderUrl`). Share the folder so students can **upload** (e.g. anyone with the link can edit, or your school domain). The lesson page embeds the folder in step 04; students click **Refresh gallery** after uploading. Replace preview SVGs in `pinecrest-student/examples/` with real screenshots if you prefer.
