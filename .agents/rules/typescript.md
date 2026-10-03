---
trigger: glob
globs: "*.ts, *.tsx"
description: "TypeScript and React implementation rules for TiemHoaWeb."
---

# TypeScript / React Rule

Use strict TypeScript. Avoid `any`. Keep domain rules pure and outside React components. Prefer narrow types and explicit discriminated unions for game states. Reuse existing utilities/components before adding dependencies.

Do not put static game content directly in UI components; use `src/content` or the repository's equivalent content layer.
