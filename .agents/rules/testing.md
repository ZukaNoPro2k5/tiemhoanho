---
trigger: glob
globs: "*.test.ts, *.test.tsx, *.spec.ts, *.spec.tsx, tests/**/*.ts"
description: "Testing conventions for TiemHoaWeb."
---

# Testing Rule

Read `docs/10_TESTING_QA.md`.

Test behavior and domain outcomes rather than implementation details. Critical flow changes require E2E coverage. Scoring and placement logic must have deterministic unit tests.
