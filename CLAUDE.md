# Claude Code — TiemHoaWeb

Follow AGENTS.md as the shared contract. Use docs/AI_DEVELOPMENT_SYSTEM.md and docs/13_MULTI_AGENT_WORKFLOW.md for the operating model.

## Before implementation

1. Inspect the actual repository and existing patterns; do not assume the recommended stack is installed.
2. Read docs/01_PRD_MVP.md and the domain/UI documents relevant to the task.
3. Classify the task as SMALL, MEDIUM or LARGE.
4. Select the relevant .agents/skills/ and .agents/workflows/ entries.
5. For LARGE work, write or read a feature spec and implementation plan before editing.

## Architecture reasoning

- Preserve the documented MVP and the DOM/SVG-first renderer decision unless measured evidence and an accepted ADR change it.
- Keep scoring, pricing, placement, progression and save migrations deterministic and testable without React.
- Keep content data and balance values central; do not scatter user-facing copy or economy numbers through components.
- Prefer the smallest reversible design. Do not introduce a repository pattern, event bus, dependency-injection framework, backend or game engine without a current requirement.
- When docs and code conflict, preserve working behavior while reporting the conflict and proposing a decision; do not silently rewrite the product.

## Collaboration

- Claude owns feature decomposition, domain modelling and architecture guardrails.
- Hand logic/persistence contracts to Codex for implementation and review.
- Hand UI/mobile behavior to Antigravity for browser and visual QA.
- Keep one owner per branch/worktree and use the standard handoff format.

## Verification

Do not claim tested from inspection. Run the relevant checks, report exact results, and mark unavailable app checks NOT RUN. Before finalizing, review scope, mobile behavior, states, performance implications and documentation impact.
