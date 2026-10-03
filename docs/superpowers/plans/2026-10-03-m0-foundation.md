# Milestone 0 — Application Foundation Implementation Plan

**Goal:** Complete A-01–A-06 only, using the implementation brief supplied by the user on 2026-10-03.

**Owner:** Codex, sole implementer on `feature/m0-foundation`. Execute inline; review the diff locally. Claude foundation review and Antigravity mobile QA are follow-up tasks, not dispatched here.

**Architecture:** A single React shell, a decorative SVG storefront, centralized Vietnamese copy and CSS tokens. Vite builds a static client application. No gameplay, routes without screens, persistence, server or state library.

**Tech stack:** React, strict TypeScript, Vite, Tailwind CSS token integration, ESLint, Prettier, Vitest/Testing Library, Playwright, vite-plugin-pwa, npm lockfile.

## Constraints and review focus

- Primary 390x844; support 360–430px, short portrait and centered desktop. Verify overflow and visible content in real Chromium screenshots.
- No customers, designer, scoring, economy, inventory, diary or progression.
- Local fonts and SVG keep the first render independent of remote services; Vietnamese text must remain readable.
- No fake start button. The static shell explains that the shop is being prepared.
- Basic precached shell only. Verify service worker activation and offline reload in a fresh browser context; HTTPS required outside localhost.
- Shell has no async data, loading queue or gameplay save; their states are inapplicable. Provide an HTML no-script message.

## Tasks

- [x] A-01/A-02: Add package/config files, lockfile, strict TS, formatting/linting, unit-test setup. Run a shell accessibility test against an empty App first to demonstrate failure, then build the shell.
  - Files: package.json, package-lock.json, tsconfig.json, vite.config.ts, eslint.config.js, .prettierrc.json, .prettierignore, index.html, src/main.tsx, src/test/setup.ts, src/app/App.test.tsx.
  - Commands: npm install; npm test; npm run lint; npm run typecheck.
- [x] A-03/A-04: Add CSS palette/spacing/radius/shadow/type/motion/safe-area tokens, content definitions, App and non-interactive ShopScene SVG.
  - Files: src/styles/tokens.css, src/styles/global.css, src/content/shell.ts, src/app/App.tsx, src/components/ShopScene.tsx.
  - Test: main landmark and accessible Vietnamese heading, shop scene equivalent text, truthful pre-game state, no gameplay controls.
  - Commands: npm test; npm run build. Browser checks run after Playwright setup.
- [x] A-05: Configure basic generated PWA worker and Vietnamese manifest; generate 192/512 PNG, maskable and Apple icons from the same local SVG mark.
  - Files: vite.config.ts, public/icons/*, public/favicon.svg.
  - Verify: production manifest, icon dimensions, active SW and cached shell offline reload using Playwright.
- [x] A-06/browser foundation: Add CI and production-preview smoke tests; check render, network/runtime errors, no horizontal overflow and safe mobile layout at 360x800, 375x667, 390x844, 430x932, 1440x900 and reduced motion.
  - Files: playwright.config.ts, e2e/shell.spec.ts, .github/workflows/ci.yml.
  - Commands: npx playwright install chromium; npm run test:e2e; inspect screenshot attachments.
- [x] Update runtime instructions and foundation state, record ADR, replace noncanonical `affection` example with `warm`.
  - Files: README.md, docs/AI_DEVELOPMENT_SYSTEM.md, docs/05_TECH_ARCHITECTURE.md, docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/12_DECISIONS.md, docs/decisions/002-m0-application-foundation.md, docs/02_GAME_DESIGN.md.
- [x] Final verification: npm ci; npm run format:check; npm run lint; npm run typecheck; npm test; npm run build; npm run test:e2e; git diff --check; review new and modified files. Record actual evidence and limitations in the handoff.

## Execution notes

The user has supplied the complete milestone specification and explicitly requested implementation. No additional design approval is needed. Product-specific documentation changes are limited to the canonical MoodTag correction; development/architecture documents are updated to describe the actual runtime. No merge, push, deployment or next milestone is part of this task.

Verification evidence: [Milestone 0 checks](../../m0-foundation-verification.md). Final self-review complete; external reviews remain follow-up, per the user instruction.
