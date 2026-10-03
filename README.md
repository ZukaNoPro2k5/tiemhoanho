# TiemHoaWeb — AI Development System

TiemHoaWeb is a mobile-first cozy flower-shop web game where the player makes beautiful bouquets, serves small customer stories and gradually personalizes a flower shop.

This repository contains the product specification, AI development system and Milestone 0 application foundation. The runtime is Vite + React + strict TypeScript. The shop shell is deliberately non-interactive; gameplay begins in later milestones.

## Run locally

Use Node **22.13+ on the 22 line**, or Node **24.x**, and npm. Install from the lockfile:

```bash
npm ci
npm run dev
```

Vite prints the local address (normally `http://localhost:5173`). To view the production build, including the PWA:

```bash
npm run build
npm run preview
```

### Quality commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

`npm run format` formats the application/configuration and README; existing product and agent docs are intentionally excluded to avoid unrelated rewrites. `npm run test:watch` runs unit tests interactively. Linux environments without browser system libraries can use `npx playwright install --with-deps chromium`.

Playwright runs against an isolated production preview on port 4173; free that port before running tests. Its default viewport is 390x844; the smoke suite also covers 360x800, 375x667, 430x932 and centered desktop. Run `npm run test:e2e -- --grep 360x800` for the narrow layout. Screenshots are attached to `playwright-report/`; inspect them with `npx playwright show-report`.

### PWA limits

The worker runs in production over HTTPS or localhost, and precaches only the static shell. Dev mode deliberately has no worker. After a successful online load, the shell can reload offline. Installation UI depends on browser support; iOS users install through Share → Add to Home Screen. App icons are provisional botanical artwork. Regenerate the committed PNG icons from `public/favicon.svg` with `npm run icons:generate` after installing Chromium. There is no gameplay save yet.

The current build targets root hosting (`/`). Configure Vite base and manifest/worker scope together before hosting under a subpath. Automatic worker updates are acceptable for this stateless foundation; review prompting before adding gameplay drafts or saves.

## North star

Protect the moment when a player finishes a bouquet and wants to save or share it.

Priority order:

UI/UX & visual delight > bouquet interaction > customer emotion > progression > management depth

## Agent quickstart

1. Read AGENTS.md.
2. Read docs/AI_DEVELOPMENT_SYSTEM.md for roles, task levels, skills and workflows.
3. Read docs/01_PRD_MVP.md and the domain documents relevant to the task.
4. Inspect the actual repository before assuming a framework, package or source path.
5. Use a dedicated branch/worktree and one active owner per task.
6. End with the standard SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP handoff.

## Current state

- Product, gameplay, UX, design, architecture, data, content, QA and collaboration docs exist under docs/.
- Shared agent rules exist in AGENTS.md, CLAUDE.md, .agents/rules/ and .claude/rules/.
- Project skills and workflow playbooks live under .agents/skills/ and .agents/workflows/.
- Milestone 0 adds the runtime, CSS/Tailwind theme tokens, ESLint/Prettier, Vitest/Testing Library, Playwright, basic PWA and GitHub Actions CI.
- No gameplay, player save, backend or repository-local MCP configuration is implemented.
- Foundation choices are recorded in [ADR-002](docs/decisions/002-m0-application-foundation.md).

## Product scope

MVP validates the 60–120 second loop:

```
customer request -> bouquet design -> wrap/ribbon/card -> delivery
-> explainable reaction -> cash/reputation -> diary/share
```

MVP includes local versioned save and installable PWA basics. It excludes multiplayer, guilds, gacha, energy/lives, large farming, employee simulation, city maps, mandatory accounts and payments.

## Task routing

| Level  | Use for                                                     | Default path                                                                      |
| ------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| SMALL  | Copy, icon, isolated CSS/config                             | Implementer self-review; targeted checks; browser QA only for visible behavior    |
| MEDIUM | Component, modal, customer card, inventory slice, animation | Codex logic/tests or Antigravity UI; affected browser QA                          |
| LARGE  | Bouquet crafting, progression, save, economy, decorating    | Claude architecture → Codex implementation/review → Antigravity browser/mobile QA |

Start with .agents/workflows/implement-feature.md; use review-feature.md, visual-qa.md, mobile-qa.md, fix-ui-issue.md or regression-check.md as the task requires.

## Documentation map

| Task                       | Read                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Product/feature            | docs/01_PRD_MVP.md, docs/02_GAME_DESIGN.md                                                  |
| UI/UX                      | docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md                                             |
| Architecture/state/content | docs/05_TECH_ARCHITECTURE.md, docs/06_DATA_MODEL.md, docs/07_CONTENT_SCHEMA.md              |
| Planning/QA                | docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/10_TESTING_QA.md              |
| Agents/tools               | docs/13_MULTI_AGENT_WORKFLOW.md, docs/14_TOOLING_SECURITY.md, docs/AI_DEVELOPMENT_SYSTEM.md |

## Project skills

Use only the skills relevant to the task:

- cozy-art-direction
- mobile-game-ui
- motion-language
- flower-shop-gameplay
- game-economy
- content-schema
- asset-pipeline
- game-state-management
- visual-qa
- performance-budget

pixijs-scene is deliberately not present because the current decision is DOM/SVG first. Revisit it only with measured evidence and an accepted decision.

## Verification

Run the quality commands above and `git diff --check`. CI installs from the lockfile, checks format/lint/types/unit/build and runs Chromium smoke tests. Foundation browser tests verify shell loading, viewport overflow, runtime/network errors, PWA metadata/icons and offline reload. Review actual screenshots before claiming mobile quality; automated checks do not replace physical-device QA.
