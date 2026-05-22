# codewithbrett.com

## School isolation

**Each school is its own project.** Do not mix brands, copy, or assets between folders. Read `SCHOOL-ISOLATION.md` before editing any school content.

## Live routes

| URL | Page |
|-----|------|
| `/` | Blank neutral page (no school branding) |
| `/ursuline-ai/` | Ursuline — *AI, the Brain, and Serviam* (direct link only) |
| `/ursuline/` | Redirects to `/ursuline-ai/` |
| `/pinecrest-teacher/` | Faculty PD (*Prompt Like a Pro*) |
| `/pinecrest-student/` | 6th grade CS student lesson |

Old URLs (`/pinecrest/class/`, `/student/`, etc.) redirect to `/pinecrest-student/`.

**Production:** [www.codewithbrett.com](https://www.codewithbrett.com/ursuline-ai/) — deployed via Vercel (`pinecrestlessons` project).

## Local preview

```bash
npm install
./serve.sh
```

Opens Next.js on **http://127.0.0.1:3000/**

- http://127.0.0.1:3000/ursuline-ai/ — Ursuline AI lesson
- http://127.0.0.1:3000/pinecrest-student/ — Pine Crest student lesson
- http://127.0.0.1:3000/pinecrest-teacher/ — Pine Crest faculty deck

Production build: `npm run build` (static export to `out/`).

## Editing Pine Crest student lesson

Source files live in `public/pinecrest-student/`. Main files:

- `public/pinecrest-student/index.html`
- activity folders (`color-art-lab/`, `initials-grid/`, `flag-challenge/`, `turtle-playground/`)

## Editing Ursuline AI lesson

Next.js app route: `app/ursuline-ai/`. Student handouts in `public/artifacts/`. Faculty materials in `public/artifacts/team/`.
