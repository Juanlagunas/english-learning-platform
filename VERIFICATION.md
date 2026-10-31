# Release verification

Stable-platform audit: **2026-10-31**. See the [audit report](specs/001-stable-90-day-learning/audit-report.md) for the measured QA-01–QA-18 evidence, reproduced defects, compatibility checks, and browser limitations.

Measured locally: typecheck, lint, **55 passing tests** across seven files, production build, and production dependency audit with zero vulnerabilities. The final workflow repeats the gates on GitHub Pages. The browser exercised correction, reload/resume, completion versus mastery, a real exported-backup restore cycle, Sarah playback/replay/stop, independent subtitles/Spanish, the diagnostic, lesson 60, and a 390 px mobile view.

The current release uses **Sarah only, in American English**, with 1.0 default and 0.85 alternative. Earlier releases offered five voices and browser synthesis; that choice was superseded by the user's explicit single-voice instruction. Existing storage keys and version-1 progress remain compatible. No runtime dependency or speech service was added during this audit.

Limits: the native file picker automation failed due extension file-access permissions; the same real backup was restored using the built-in pasted-JSON alternative. Full browser-process restart and 90 elapsed days were not tested. Speech quality/performance depends on the existing local model and device, and a fresh offline reload is not guaranteed. See the linked report for precise scope; no unexecuted browser case is claimed as passed.


## Current curricular update — 2026-10-31

The [software curriculum verification report](specs/002-software-american-curriculum/audit-report.md) is the current release record. It covers the 42 technology / 18 everyday lesson mix, unchanged IDs, paired dialogue/answer/translation/transfer review, revision-aware progress compatibility, and the latest checks/publication. Earlier counts above describe the preceding stability audit rather than the current test suite.
