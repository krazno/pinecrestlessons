# codewithbrett.com

## Live routes

| URL | Page |
|-----|------|
| `/` | Splash — teacher or student, passcode **67** |
| `/pinecrest-teacher/` | Faculty PD (*Prompt Like a Pro*) |
| `/pinecrest-student/` | **6th grade CS student lesson (only student page)** |

Old URLs (`/pinecrest/class/`, `/student/`, etc.) redirect to `/pinecrest-student/`.

## Local preview

```bash
cd codewithbrett
python3 -m http.server 8765
```

- http://localhost:8765/
- http://localhost:8765/pinecrest-student/
- http://localhost:8765/pinecrest-teacher/

**Use `pinecrest-student` only** for the student lesson. Do not serve the old `pinecrest_lessons` repo for class — that repo redirects here.

## Editing the student lesson

Change **only**:

- `pinecrest-student/index.html`
- `pinecrest-student/logo.png`

Form links are set in the `CLASS_LINKS` object near the bottom of `index.html`.

### Activity turn-ins (3 levels)

The student page includes **Level one / two / three** placeholders and a **Turn in work** block (screenshot + code + name) above the exit ticket.

To receive submissions for review, set `ACTIVITY_SUBMIT.formspreeId` in `pinecrest-student/index.html` (see `pinecrest-teacher/activity-submissions.html`).
