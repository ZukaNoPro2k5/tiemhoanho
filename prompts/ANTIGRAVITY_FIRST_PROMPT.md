# Antigravity — First Project Prompt

Recommended: run in a dedicated worktree/project and use the browser agent for visual verification.

```text
/goal Audit and implement TiemHoaWeb Milestone 1: Bouquet interaction prototype.

First read:
@AGENTS.md
@docs/01_PRD_MVP.md
@docs/02_GAME_DESIGN.md
@docs/03_UX_UI_SPEC.md
@docs/04_DESIGN_SYSTEM.md
@docs/05_TECH_ARCHITECTURE.md
@docs/08_IMPLEMENTATION_PLAN.md

Assume Milestone 0 must already be present; verify it and fix only blocking foundation issues.

Milestone 1 deliverables:
- bouquet canvas;
- flower tray with temporary/data-driven flower assets;
- tap to add using deterministic assisted placement;
- drag to reposition with normalized coordinates;
- select/remove;
- maximum stem validation;
- wrap preview;
- unit/component tests for core interactions.

Verification:
- run lint, typecheck and tests;
- use browser tooling to test at 390x844;
- check that dragging a flower does not scroll the page;
- check 360px width for overflow;
- capture/report visual and interaction issues before declaring completion.

Do not build orders, economy, backend, farming, multiplayer or unrelated screens.
```
