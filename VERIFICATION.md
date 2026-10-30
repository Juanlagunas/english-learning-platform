# Release verification

Date: 2026-10-30.

Measured locally: dependency installation from cache, TypeScript checks, ESLint without warnings, 30 passing unit tests, and production build. The built HTML references `/english-learning-platform/assets/`.

Tests cover all 60 sessions, unique conversations, five written tasks per session, all 17 connectors, all seven assessments, target answer validation, contraction variants, wrong tense rejection, review intervals/reset, self-assessment distinction, JSON/storage roundtrip, malformed imports, storage failure reporting, and measured weekly practice.

Local browser preview was unavailable: the execution sandbox rejected opening the Vite port with EPERM. The initial Pages release was loaded in Chrome, the first lesson was completed, incorrect/correct feedback was exercised, Spanish help and transcript were toggled, the speech synthesis ended event was observed, tutor export text was generated, and progress survived a reload. The download-event bridge timed out during browser export testing; a browser-file roundtrip has not been claimed. Core JSON roundtrip is tested automatically. Audio/correction addendum checks are performed after its release. A local npm security audit could not contact the registry because DNS resolution was unavailable; no successful audit is claimed.

Speech output varies by device. Automated model-answer tests do not measure pronunciation or pedagogical outcomes. New offline reload is not promised; no service worker is installed.

The addendum adds 14 tests covering three-failure reteaching, consecutive retrieval and reset, help-triggered reset, transfer, defer, state roundtrip, backward-compatible import, invalid streaks/intervals, verified equivalent rewrites, grammar preservation, all transfer tasks, and voice ranking/preference/fallback. The latest audio requirement uses only two speeds: default 1.0 and alternative 0.85. Voice quality ranking is inferred from language and voice names, not measured acoustically.

Observed on public Pages after the addendum: default Speed option is 1.0; alternative 0.85 is present. Google US English was ranked first on the test device. The preview emitted Playing and Sample finished states. Saving a different available voice (Samantha) survived reload; Google US English was restored afterward. Transcript and Spanish translation were initially hidden and toggled independently. Three incorrect answers led to reteaching; two correct retrievals followed by a mistake reset the streak to zero; three subsequent correct answers opened the distinct transfer prompt. Reload retained that transfer state, and correct transfer scheduled review. A separate rendering regression test ensures saved free writing never displays a closed-task mastery claim.

Subtitle tests verify hidden-by-default behavior, persisted show/hide preference, denied-storage fallback, exact utterance rendering, and independent Spanish visibility. No dependency or external service was added. Mobile Pages was observed at 390 px: document width equaled viewport width, and the week-12/session-5 content opened successfully.
