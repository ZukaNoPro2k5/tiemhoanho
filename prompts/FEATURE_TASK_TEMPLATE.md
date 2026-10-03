# Feature Task Prompt Template

~~~text
You are implementing [TASK ID / NAME] in TiemHoaWeb.

Owner: [CLAUDE / CODEX / ANTIGRAVITY / NAME]
Reviewer: [NAME / AGENT]
Level: [SMALL / MEDIUM / LARGE]
Branch/worktree: [BRANCH AND PATH]

Before coding:
1. Read AGENTS.md and docs/AI_DEVELOPMENT_SYSTEM.md.
2. Read docs/01_PRD_MVP.md.
3. Read these task-specific docs: [FILES].
4. Read these project skills: [SKILLS].
5. Use this workflow: [WORKFLOW].
6. Inspect the existing implementation, patterns and tests.

Goal:
[ONE CLEAR OUTCOME]

Context:
[WHY THIS MATTERS TO THE BOUQUET/CUSTOMER/SHOP EXPERIENCE]

Scope:
- [IN SCOPE]

Non-goals:
- [EXPLICITLY OUT OF SCOPE]

Acceptance criteria:
- [AC1]
- [AC2]
- [AC3]

Files likely involved:
- [PATHS OR SAY UNKNOWN UNTIL INSPECTION]

Tests:
- [UNIT/COMPONENT/INTEGRATION/E2E CHECKS]

Visual requirements:
- [390x844 / 360px / 430x932 / states / motion]

Performance constraints:
- [BUNDLE / ASSET / DRAG / RENDERING REQUIREMENTS OR NOT APPLICABLE]

Execution:
1. Classify and plan the smallest coherent slice.
2. Implement without changing unrelated architecture or product behavior.
3. Add/update tests for changed rules and states.
4. Run relevant automated checks.
5. Run browser/mobile QA when the flow or UI changes.
6. Update docs/decisions when a contract changes.
7. Report evidence and risks.

Handoff:
SUMMARY

CHANGED

TESTED

NOT TESTED

RISKS

FOLLOW-UP
~~~
