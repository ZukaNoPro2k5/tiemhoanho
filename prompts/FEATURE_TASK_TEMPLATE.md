# Feature Task Prompt Template

Use this prompt for any substantial task.

```text
You are implementing [TASK ID / NAME] in TiemHoaWeb.

Before coding:
1. Read AGENTS.md.
2. Read docs/01_PRD_MVP.md.
3. Read these task-specific docs: [FILES].
4. Inspect the existing implementation and tests.

Goal:
[ONE CLEAR OUTCOME]

Acceptance criteria:
- [AC1]
- [AC2]
- [AC3]

Constraints:
- Preserve mobile-first UX at 390x844.
- Do not add unrelated features or dependencies.
- Keep domain logic outside React components where applicable.
- Reuse existing design tokens/components.

Execution:
1. Write a concise implementation plan.
2. Implement the smallest coherent solution.
3. Add/update tests.
4. Run lint, typecheck, relevant tests and E2E if flow changes.
5. Verify the mobile UI.
6. Summarize changed files, verification run, and any remaining risk.

If a documented product/architecture decision must change, update docs/12_DECISIONS.md rather than silently changing behavior.
```
