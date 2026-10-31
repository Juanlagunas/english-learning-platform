# Inglés Lagunas

A free, static **American English** practice app for A2–B1 learning, built with React, TypeScript, and Vite. The curriculum uses **42 software-engineering lessons and 18 everyday-English lessons**. All workplace scenarios use fictional **Project Orion**; everyday situations are also fictional. No account, API key, paid service, backend, or AI grading. Neural voice synthesis runs locally and is separate from answer evaluation. The existing 60 lesson IDs and exercise IDs are unchanged.

## Practice

- 60 authored sessions across 12 weeks, five sessions per week; a flexible 90-calendar-day roadmap, not 90 consecutive days or a CEFR guarantee.
- Weeks 1–6 alternate three technology lessons with two everyday lessons; weeks 7–12 use four technology lessons and one everyday lesson. Simple introductions and routines lead into weekly updates, status reports, API/integration work, microservices, testing, deployments, incidents, estimation, technical decisions, leadership, and respectful negotiation. Vocabulary is taught in full situations, not isolated word lists.
- Each session has an objective, one audio-first conversation, five written exercises, a speaking prompt, explanation, Spanish help, and retrieval review.
- Listening comprehension, cloze, word ordering, connectors, targeted rewrites, and short free writing with model answers and a self-assessment rubric.
- All 17 requested connectors have meaning, usage, contrasting uses, examples, pronunciation through TTS, and active practice. Seven conversational rescue phrases are included.
- 5/10-minute micro-sessions save partial practice. 15/30-minute sessions cover the full lesson. Each closed task must be transferred successfully or explicitly deferred, with writing and speaking reflections saved, before a full completion is recorded. Lesson completion is not a claim that every exercise has been mastered.
- A diagnostic and six biweekly checkpoints sample listening, grammar, writing, and speaking. Listening/grammar are model checks; writing/speaking are explicitly self-scored. Results compare practice snapshots, not certified proficiency.
- Persisted spaced reviews: mistakes and deferred exercises are due the next day; successful reviews advance through 1, 3, 7, 14, and 30 days. Open writing uses self-assessment to choose the interval.
- Three lesson states (Not started / In progress / Completed), completed/remaining counts and percentage, Continue Learning, saved drafts/step/oral reflections/partial assessments, measured practice minutes, weekly targets, error patterns, JSON backup/restore, and tutor handoff text. A correction-prompt builder copies a response for optional manual use in ChatGPT; the app never calls an AI API.

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

- `src/lesson-data.json`: 60 editorial rows and 12 week descriptions. The ordered row fields are title, audio conversation, correct interpretation, cloze prompt, cloze answer, unnatural sentence, natural rewrite, and explanation. Matching translations, two distractors, and technology/general contexts share the same row index.
- `src/content.ts`: adapts editorial rows into typed `Lesson` / `Task` objects, with reusable pedagogy, interleaving, and seven assessment forms.
- `src/connectors.ts`: structured connector reference and practice examples.
- `src/types.ts`: content and versioned progress schema.
- `src/grading.ts`: shared deterministic normalization and grading.
- `src/progress.ts` / `src/useProgress.ts`: completion, resume, assessment scoring, immediate protected persistence.
- `src/engine.ts`: Leitner-inspired scheduling, progress validation/storage, metrics, and tutor export.
- `src/Audio.tsx`: Sarah playback/sample, two speeds, subtitles, saved preferences, and failure notices.
- `src/kokoro.worker.ts` / `src/kokoroClient.ts`: lazy local synthesis in a dedicated worker, WebGPU acceleration with single-thread WASM fallback for Pages compatibility, cancellation and a small in-memory replay cache.
- `src/neuralVoices.ts`: Sarah US voice ID and compatibility with stored preferences from earlier versions.
- `src/Exercise.tsx`, `src/Practice.tsx`: accessible exercise, lesson, speaking, and assessment flows.
- `src/App.tsx`: dashboard, learning path, language reference, review queue, progress and data portability.
- `tests/engine.test.ts` and `tests/learning.test.ts`: curriculum contract, grading, scheduler, malformed imports, persistence, honest metrics, correction state transitions, and voice preference/ranking.

To edit content, preserve task/session IDs and update the curriculum contract tests. Bump `CONTENT_REVISION` when expected meaning changes. Current state and correction-history entries carry this revision; reconciliation preserves previous answers, drafts, completions, review dates, and assessment snapshots while leaving revised items pending for a new check. Old attempts do not score a new assessment. A saved draft may need editing to fit the new prompt; the exercise explains that change. Objective tasks declare explicit accepted answers; do not label model matching as AI evaluation. Rewrites accept verified equivalents, diagnose known target errors, and explicitly mark unfamiliar alternatives as uncertain rather than incorrect. Use the optional ChatGPT correction prompt for nuance. Normalization accepts case, punctuation, whitespace, and common contractions.

## Privacy, persistence, and limitations

Closed tasks use an explicit `INITIAL_ATTEMPTS → RETEACH → MASTERY → TRANSFER → REVIEW` state machine. Three misses reveal the model and a brief explanation; mastery requires three consecutive correct retrievals. Mistakes reset the streak. Opening a solution, hint, transcript, or translation during mastery resets the streak. A correct initial answer can move directly to transfer without claiming a three-answer mastery streak. Transfer uses a new UX scenario or verified vocabulary substitutions. Known grammar errors are never normalized away. History, hint usage, current stage, answer, and streak are saved. “Review later” preserves the stage, schedules the structure, and lets the learner continue. Review intervals default to 1, 3, and 7 days and are configurable on Progress; longer successful intervals are 14 and 30 days.

Progress is in `localStorage` under `compass-progress-v1`, schema version 1. It belongs to this browser and origin; no syncing occurs. JSON export includes answer drafts, attempts, measured practice, reviews, completions, correction stages and streaks, hint history, review intervals, and assessment snapshots. Existing version-1 files are extended with default correction state without discarding earlier history. The backup also includes voice and subtitle preferences when browser storage is accessible. Import validates the entire structure before replacing local state. A malformed or inaccessible local save is not silently overwritten. Storage failures produce a visible export reminder. Export before changing device, clearing browser data, or importing another history.

Tutor text export includes recent answers and weak topics. Share it manually only when you choose. Use fictional details; do not enter confidential or personal information. The app has no analytics, ads, login, cookies, microphone access, or application API calls. GitHub, as hosting provider, may retain its normal request logs. Optional clipboard actions need browser support and have a selectable-text fallback.

Audio uses **Sarah in American English only** (`af_sarah`), generated locally with the existing Kokoro integration. There is no voice or engine selector and no automatic substitution with a browser voice. The installed synthesizer identifies Sarah as `en-us`; [upstream voice metadata](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) places her under American English. Lessons, models, and optional tutor prompts use American spelling, vocabulary, and phrasing; the HTML language is `en-US`. The local corrector still treats unfamiliar rewrites as uncertain rather than falsely incorrect.

The model downloads only after Play or the Sarah sample is clicked: approximately 330 MB for accelerated WebGPU fp32 or 90 MB for compatible single-thread WASM q8, plus runtime and small voice files. Downloads use the existing Hugging Face/runtime CDN sources and may be cached. Text is processed in a Web Worker on the device, not sent to a speech-generation API. Generated WAV data stays in local blobs. The first request can be slow, and model availability, performance, pronunciation artifacts, and cache retention depend on the device/browser. Failures are visible and offer subtitles without using another voice. No new provider, runtime dependency, paid API, or backend was added.

Playback defaults to **1.0x**, with **0.85x** as the alternative. Play/replay, Stop, and a Sarah sample remain available. Pending results are ignored after Stop or navigation; an existing computation may finish in the background without playing. Repeated text/voice/speed uses a small session-memory cache. A browser autoplay block offers Play ready audio for a new user gesture. Existing `lagunas-kokoro-voice`, `lagunas-speech-engine`, and `compass-english-voice` keys remain compatible; old voice choices normalize to Sarah.

English subtitles are hidden by default. Show Subtitles / Hide Subtitles toggles the exact full utterance without word-level synchronization; the preference is saved under `compass-show-subtitles` and reused across lessons. The Sarah sample shows its own exact sentence. Spanish translation remains independent. Opening subtitles during mastery resets the retrieval streak. Text fallback works when Sarah cannot load or play. No microphone or speech recognition is required.

References: [Kokoro.js usage and voice metadata](https://github.com/hexgrad/kokoro/tree/main/kokoro.js), [model card and downloadable assets](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX). The package and model declare Apache-2.0 licensing.

All curriculum ships with the initial JavaScript bundle, so navigation and practice continue without network requests after loading. There is no service worker: a new offline tab/reload is not guaranteed to work. Practice time counts visible, recently active lesson time (up to two minutes since interaction), not the selected session duration; assessment/review browsing time is not counted. Time flushes every five seconds and on visibility/page exit; an abrupt process or device failure can lose the final unsaved seconds. Weekly goal days require 15 measured minutes; the suggested target is five 30-minute days. Brief practice is still saved. A streak is informational and never locks content.

## GitHub Pages deployment

The repository is public. `vite.config.ts` sets base to `/english-learning-platform/`. Navigation is in-app state, with no nested paths to cause refresh 404s. `.github/workflows/deploy.yml` installs from the lockfile, audits production dependencies, typechecks, lints, runs tests, builds, and deploys using official GitHub Pages actions and `contents: read`, `pages: write`, `id-token: write` permissions. It runs on pushes to `main` and manual workflow dispatch.

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** if not already configured. No custom token or repository secret is needed. Check the workflow's deployment URL after successful deployment; configuration alone does not prove the site is live.

Technical references: [Vite's GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [MDN speech synthesis voices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices).

## Verification scope

Automated tests check content completeness and core logic; they do not certify English proficiency, natural voice quality, or every browser. The repository workflow is the repeatable gate for code changes. See `VERIFICATION.md` for the observed release checks and browser limitations.

## Brand asset

The header displays only **Inglés Lagunas**, with a local illustrated avatar and PNG favicon. The fictional boy has light-medium brown skin and curly black hair. The source image was created with the built-in image generation tool, then copied and resized into `public/ingles-lagunas-avatar.png` (256 px) and `public/ingles-lagunas-favicon.png` (64 px). No image API is used by the app.

Generation prompt: “Small square avatar icon for Inglés Lagunas. Friendly illustrated young boy with warm light-medium brown skin, dark brown eyes, tightly curled black hair, gentle smile, and dark green shirt. Centered head-and-shoulders portrait, clean rounded forms, soft cream background. No text, compass, symbols, watermark, or extra objects.”

Legacy `compass-*` browser storage keys are deliberately retained so renaming the platform does not discard existing progress, voice, or subtitle preferences.

The `sharp` dependency brought by Transformers.js is overridden to patched 0.35.5; browser speech uses the web export where sharp is ignored. The workflow checks production dependencies with `npm audit --omit=dev --audit-level=high` before deployment.

## Specification workflow

OpenSpec owns the behavior contract; Spec Kit owns the linked plan, constitution, and implementation tasks. See [feature spec](specs/001-stable-90-day-learning/spec.md), [plan](specs/001-stable-90-day-learning/plan.md), and [audit evidence](specs/001-stable-90-day-learning/audit-report.md). Tooling is development-only; no application dependency was added.

The software-focused update is specified in [curriculum spec](specs/002-software-american-curriculum/spec.md); see its [verification report](specs/002-software-american-curriculum/audit-report.md) for the current release evidence.
