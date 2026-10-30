# Compass — English for your everyday work

A free, static English practice app for A2–B1 learning, built with React, TypeScript, and Vite. All workplace scenarios use fictional **Project Orion**. No account, API key, paid service, backend, or AI grading.

## Practice

- 60 authored sessions across 12 weeks, five sessions per week; a flexible 90-calendar-day roadmap, not 90 consecutive days or a CEFR guarantee.
- Each session has an objective, one audio-first conversation, five written exercises, a speaking prompt, explanation, Spanish help, and retrieval review.
- Listening comprehension, cloze, word ordering, connectors, targeted rewrites, and short free writing with model answers and a self-assessment rubric.
- All 17 requested connectors have meaning, usage, contrasting uses, examples, pronunciation through TTS, and active practice. Seven conversational rescue phrases are included.
- 5/10-minute micro-sessions save partial practice. 15/30-minute sessions cover the full lesson. Each closed task must be transferred successfully or explicitly deferred, with writing and speaking reflections saved, before a full completion is recorded. Lesson completion is not a claim that every exercise has been mastered.
- A diagnostic and six biweekly checkpoints sample listening, grammar, writing, and speaking. Listening/grammar are model checks; writing/speaking are explicitly self-scored. Results compare practice snapshots, not certified proficiency.
- Persisted spaced reviews: mistakes and deferred exercises are due the next day; successful reviews advance through 1, 3, 7, 14, and 30 days. Open writing uses self-assessment to choose the interval.
- Progress dashboard, measured practice minutes, weekly targets, error patterns, JSON backup/restore, and tutor handoff text. A correction-prompt builder copies a response for optional manual use in ChatGPT; the app never calls an AI API.

## Local development

Requirements: Node.js 22.12+ and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/english-learning-platform/`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run preview` serves the production build locally when your environment permits opening a port.

## Architecture and content

- `src/lesson-data.json`: 60 editorial rows and 12 week descriptions. The ordered row fields are title, audio conversation, correct interpretation, cloze prompt, cloze answer, unnatural sentence, natural rewrite, and explanation.
- `src/content.ts`: adapts editorial rows into typed `Lesson` / `Task` objects, with reusable pedagogy, interleaving, and seven assessment forms.
- `src/connectors.ts`: structured connector reference and practice examples.
- `src/types.ts`: content and versioned progress schema.
- `src/engine.ts`: deterministic normalization/grading, Leitner-inspired scheduling, progress validation/storage, metrics, and tutor export.
- `src/Audio.tsx`: browser speech synthesis, English voice discovery and voice-change events, playback and rate selection, and failure notices.
- `src/Exercise.tsx`, `src/Practice.tsx`: accessible exercise, lesson, speaking, and assessment flows.
- `src/App.tsx`: dashboard, learning path, language reference, review queue, progress and data portability.
- `tests/engine.test.ts` and `tests/learning.test.ts`: curriculum contract, grading, scheduler, malformed imports, persistence, honest metrics, correction state transitions, and voice preference/ranking.

To add content, preserve unique task/session IDs and update the curriculum contract tests. Objective tasks declare explicit accepted answers; do not label model matching as AI evaluation. Rewrites accept verified equivalents, diagnose known target errors, and explicitly mark unfamiliar alternatives as uncertain rather than incorrect. Use the optional ChatGPT correction prompt for nuance. Normalization accepts case, punctuation, whitespace, and common contractions.

## Privacy, persistence, and limitations

Closed tasks use an explicit `INITIAL_ATTEMPTS → RETEACH → MASTERY → TRANSFER → REVIEW` state machine. Three misses reveal the model and a brief explanation; mastery requires three consecutive correct retrievals. Mistakes reset the streak. Opening a solution, hint, transcript, or translation during mastery resets the streak. A correct initial answer can move directly to transfer without claiming a three-answer mastery streak. Transfer uses a new UX scenario or verified vocabulary substitutions. Known grammar errors are never normalized away. History, hint usage, current stage, answer, and streak are saved. “Review later” preserves the stage, schedules the structure, and lets the learner continue. Review intervals default to 1, 3, and 7 days and are configurable on Progress; longer successful intervals are 14 and 30 days.

Progress is in `localStorage` under `compass-progress-v1`, schema version 1. It belongs to this browser and origin; no syncing occurs. JSON export includes answer drafts, attempts, measured practice, reviews, completions, correction stages and streaks, hint history, review intervals, and assessment snapshots. Existing version-1 files are extended with default correction state without discarding earlier history. Voice preference stays browser-local and is not part of the learning-progress file. Import validates the entire structure before replacing local state. A malformed or inaccessible local save is not silently overwritten. Storage failures produce a visible export reminder. Export before changing device, clearing browser data, or importing another history.

Tutor text export includes recent answers and weak topics. Share it manually only when you choose. Use fictional details; do not enter confidential or personal information. The app has no analytics, ads, login, cookies, microphone access, or application API calls. Browser-provided speech voices may use their provider’s network service. GitHub, as hosting provider, may retain its normal request logs. Optional clipboard actions need browser support and have a selectable-text fallback.

Audio is **browser-generated speech, not a human recording**. Available English voices depend on browser/device configuration. Available en-US voices are prioritized with name hints for Natural/Neural/Enhanced/Premium and Google voices; this ranking is a heuristic, not a measured quality claim. Expand Voice, preview a sample, then apply a choice. The voice URI is saved separately under `compass-english-voice` in localStorage and reused across lessons and reloads. Unavailable saved voices fall back with a visible notice. Speed defaults to 1.0 with 0.85 as the alternative; speech requires a user click. If audio is unsupported or silent, reveal the conversation text. Some voices require network connectivity. Audio pronunciation and intelligibility should also be checked on your own device. No microphone recording or speech recognition is required or implemented.

All curriculum ships with the initial JavaScript bundle, so navigation and practice continue without network requests after loading. There is no service worker: a new offline tab/reload is not guaranteed to work. Practice time counts visible, recently active lesson time (up to two minutes since interaction), not the selected session duration; assessment/review browsing time is not counted. The current minute can be lost on abrupt tab closure. Weekly goal days require 15 measured minutes; the suggested target is five 30-minute days. Brief practice is still saved. A streak is informational and never locks content.

## GitHub Pages deployment

The repository is public. `vite.config.ts` sets base to `/english-learning-platform/`. Navigation is in-app state, with no nested paths to cause refresh 404s. `.github/workflows/deploy.yml` installs from the lockfile, typechecks, lints, runs tests, builds, and deploys using official GitHub Pages actions and `contents: read`, `pages: write`, `id-token: write` permissions. It runs on pushes to `main` and manual workflow dispatch.

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** if not already configured. No custom token or repository secret is needed. Check the workflow's deployment URL after successful deployment; configuration alone does not prove the site is live.

Technical references: [Vite's GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [MDN speech synthesis voices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices).

## Verification scope

Automated tests check content completeness and core logic; they do not certify English proficiency, natural voice quality, or every browser. The repository workflow is the repeatable gate for code changes. See `VERIFICATION.md` for the observed release checks and browser limitations.
