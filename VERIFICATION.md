# Release verification

Date: 2026-10-30.

Measured locally: dependency installation from cache, TypeScript checks, ESLint without warnings, 12 passing unit tests, and production build. The built HTML references `/english-learning-platform/assets/`.

Tests cover all 60 sessions, unique conversations, five written tasks per session, all 17 connectors, all seven assessments, target answer validation, contraction variants, wrong tense rejection, review intervals/reset, self-assessment distinction, JSON/storage roundtrip, malformed imports, storage failure reporting, and measured weekly practice.

Local browser preview was unavailable: the execution sandbox rejected opening the Vite port with EPERM. Runtime browser checks are performed on Pages after deployment; observations are added here after verification. A local npm security audit could not contact the registry because DNS resolution was unavailable; no successful audit is claimed.

Speech output varies by device. Automated model-answer tests do not measure pronunciation or pedagogical outcomes. New offline reload is not promised; no service worker is installed.
