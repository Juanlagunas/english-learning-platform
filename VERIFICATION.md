# Release verification

Date: 2026-10-30.

Measured locally: dependency installation from cache, TypeScript checks, ESLint without warnings, 36 passing unit tests, and production build. The built HTML references `/english-learning-platform/assets/`.

Tests cover all 60 sessions, unique conversations, five written tasks per session, all 17 connectors, all seven assessments, target answer validation, contraction variants, wrong tense rejection, review intervals/reset, self-assessment distinction, JSON/storage roundtrip, malformed imports, storage failure reporting, and measured weekly practice.

Local browser preview was unavailable: the execution sandbox rejected opening the Vite port with EPERM. The initial Pages release was loaded in Chrome, the first lesson was completed, incorrect/correct feedback was exercised, Spanish help and transcript were toggled, the speech synthesis ended event was observed, tutor export text was generated, and progress survived a reload. The download-event bridge timed out during browser export testing; a browser-file roundtrip has not been claimed. Core JSON roundtrip is tested automatically. Audio/correction addendum checks are performed after its release. A local npm security audit could not contact the registry because DNS resolution was unavailable; no successful audit is claimed.

Speech output varies by device. Automated model-answer tests do not measure pronunciation or pedagogical outcomes. New offline reload is not promised; no service worker is installed.

The addendum adds 14 tests covering three-failure reteaching, consecutive retrieval and reset, help-triggered reset, transfer, defer, state roundtrip, backward-compatible import, invalid streaks/intervals, verified equivalent rewrites, grammar preservation, all transfer tasks, and voice ranking/preference/fallback. The latest audio requirement uses only two speeds: default 1.0 and alternative 0.85. Voice quality ranking is inferred from language and voice names, not measured acoustically.

Observed on public Pages after the addendum: default Speed option is 1.0; alternative 0.85 is present. Google US English was ranked first on the test device. The preview emitted Playing and Sample finished states. Saving a different available voice (Samantha) survived reload; Google US English was restored afterward. Transcript and Spanish translation were initially hidden and toggled independently. Three incorrect answers led to reteaching; two correct retrievals followed by a mistake reset the streak to zero; three subsequent correct answers opened the distinct transfer prompt. Reload retained that transfer state, and correct transfer scheduled review. A separate rendering regression test ensures saved free writing never displays a closed-task mastery claim.

Subtitle tests verify hidden-by-default behavior, persisted show/hide preference, denied-storage fallback, exact utterance rendering, and independent Spanish visibility. No dependency or external service was added. Mobile Pages was observed at 390 px: document width equaled viewport width, and the week-12/session-5 content opened successfully.

## Kokoro integration (2026-10-30)

Measured: 36 tests pass, typecheck and ESLint pass, and production build emits a separate worker plus WASM asset under the configured Pages base. The initial page JavaScript remains about 331 KB before gzip; the model is not included in Git or the initial bundle. Six additional tests cover five voice choices, persisted engine/voice, lazy generation, progress messages, correct replay cache keys, cancellation/superseding, and visible errors.

Local production preview is now available through Python's static server at the Pages subpath. The first WASM Heart sample reached the audio ended state in Chrome, but the CPU comparison had substantial latency in this test. Based on that observation the final integration prefers WebGPU fp32 when available, retains WASM q8 for devices without WebGPU, and displays honest download sizes (~90–330 MB plus runtime/voice files). Speech buttons are disabled during generation while Stop remains enabled, preventing repeated clicks from queueing new computations. Further runtime observations are recorded in the release handoff.

The accelerated local preview produced valid media for all five proposals (Heart, Bella, Sarah, Michael and Puck), with sample WAV durations in the roughly 7–8 second range and `readyState: 4`; ended states were also observed. The browser backup reached its finished state. Sarah was selected at the learner's request, remained selected after reload, and normal speed remained 1.0. Subtitles continued to show the exact common sample. This is a functional playback observation; the learner's preference for Sarah is not an acoustic benchmark.

The first production-dependency audit found three inherited high-severity sharp advisories in the default Transformers.js dependency tree. The official sharp release 0.35.5 was verified, a project-local override was applied, and a subsequent `npm audit --omit=dev --audit-level=high` reported zero vulnerabilities. The same audit is now a deployment gate. The browser export of Transformers.js explicitly ignores sharp; the override also keeps the installed dependency tree patched.
