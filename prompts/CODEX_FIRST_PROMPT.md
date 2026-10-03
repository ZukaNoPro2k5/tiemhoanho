# Codex — First Project Prompt

Use this prompt in a dedicated branch/worktree for implementation, refactor, test or review work.

~~~text
Read:
- AGENTS.md
- README.md
- docs/AI_DEVELOPMENT_SYSTEM.md
- the task-specific product/domain/UI docs
- the selected .agents/skills/*/SKILL.md
- the relevant .agents/workflows/implement-feature.md, review-feature.md or regression-check.md

Inspect the repository and current diff before editing. Confirm the task level, owner, scope and non-goals. Reuse existing patterns. Keep domain rules pure and deterministic, content data-driven, saves versioned and UI state separate from gameplay/persistence state.

Implement only the requested slice. Do not install packages, bootstrap a framework, add a game engine, add a backend or rewrite architecture unless the task explicitly authorizes it and the repository evidence supports it.

For implementation:
- run the relevant formatter/lint, typecheck and tests;
- add or update behavior tests for changed domain/state rules;
- ask Antigravity/browser QA for changed mobile UI or flows;
- use PASS, FAIL or NOT RUN with the exact command/manual flow.

For review:
- inspect the full diff;
- check product, UX, engineering, state/economy/content and performance contracts;
- report P0/P1/P2 findings with exact evidence and smallest fixes;
- do not redesign without a reproducible finding.

End with:
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP

Do not claim tested from inspection or from a build alone.
~~~
