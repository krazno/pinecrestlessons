# codewithbrett.com

## School isolation

**Each school is its own project.** Do not mix brands, copy, or assets between folders. Read `SCHOOL-ISOLATION.md` before editing any school content.

## Live routes

| URL | Page |
|-----|------|
| `/` | Blank (single neutral color — no school branding) |
| `/ursuline-ai/` | Ursuline — *AI, the Brain, and Serviam* (student lesson + lab) |
| `/ursuline/` | Redirects to `/ursuline-ai/` |
| `/pinecrest-teacher/` | Faculty PD (*Prompt Like a Pro*) |
| `/pinecrest-student/` | **6th grade CS student lesson (only student page)** |

Old URLs (`/pinecrest/class/`, `/student/`, etc.) redirect to `/pinecrest-student/`.

## Local preview

```bash
cd codewithbrett
npm install
./serve.sh
```

Opens Next.js on **http://127.0.0.1:3000/**

- http://127.0.0.1:3000/ursuline-ai/ — Ursuline AI lesson
- http://127.0.0.1:3000/pinecrest-student/ — Pine Crest student lesson
- http://127.0.0.1:3000/pinecrest-teacher/ — Pine Crest faculty deck

Production build: `npm run build` (static export to `out/`).

**One student page only:** `/pinecrest-student/` is the full interactive lesson. The old minimal green landing page has been removed.

## Editing the student lesson

Source of truth is usually `pinecrest_lessons`; sync with:

```bash
rsync -a --delete ../pinecrest_lessons/pinecrest-student/ public/pinecrest-student/
```

Main files:

- `pinecrest-student/index.html`
- `pinecrest-student/logo.png`
- activity folders (`color-art-lab/`, `initials-grid/`, `flag-challenge/`, `turtle-playground/`)

Form links are set in the `CLASS_LINKS` object near the bottom of `index.html`.

### Activity turn-ins (3 levels)

The student page includes **Level one / two / three** placeholders and a **Turn in work** block (screenshot + code + name) above the exit ticket.

To receive submissions for review, set `ACTIVITY_SUBMIT.formspreeId` in `pinecrest-student/index.html` (see `pinecrest-teacher/activity-submissions.html`).
