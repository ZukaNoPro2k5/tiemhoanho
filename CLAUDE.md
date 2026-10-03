# Claude Code — TiemHoaWeb

Follow `AGENTS.md` as the project-wide engineering contract.

Before a non-trivial implementation task:

1. Read `docs/01_PRD_MVP.md`.
2. Read the relevant UX/architecture/data document.
3. Inspect existing implementation before proposing changes.
4. Make a concise implementation plan.
5. Implement the smallest coherent slice.
6. Verify with tests and mobile visual checks.

Never optimize for feature count at the expense of the core bouquet experience.

Useful references:

- UI work: `docs/03_UX_UI_SPEC.md`, `docs/04_DESIGN_SYSTEM.md`
- Game rules: `docs/02_GAME_DESIGN.md`
- Architecture: `docs/05_TECH_ARCHITECTURE.md`
- Data: `docs/06_DATA_MODEL.md`, `docs/07_CONTENT_SCHEMA.md`
- Roadmap/tasks: `docs/08_IMPLEMENTATION_PLAN.md`, `docs/09_TASK_BACKLOG.md`
- QA: `docs/10_TESTING_QA.md`

When a task is ambiguous, preserve documented behavior and choose the simplest reversible implementation. Record meaningful decisions in `docs/12_DECISIONS.md`.
