# Claude Code — First Project Prompt

Use this prompt after opening the TiemHoaWeb repository in an isolated worktree.

~~~text
Read:
- AGENTS.md
- CLAUDE.md
- README.md
- docs/AI_DEVELOPMENT_SYSTEM.md
- docs/00_PRODUCT_VISION.md through docs/13_MULTI_AGENT_WORKFLOW.md as relevant
- the selected .agents/skills/*/SKILL.md and .agents/workflows/* playbook

First inspect the actual repository. Report CURRENT STATE and a short GAP ANALYSIS before assuming framework, dependencies, renderer, state library, tests or CI.

Classify the task as SMALL, MEDIUM or LARGE.
For LARGE work, write/read the feature spec and implementation plan before editing.
Use existing patterns and the smallest reversible architecture. Preserve the documented MVP, DOM/SVG-first direction and explainable gameplay rules. Do not bootstrap React, PixiJS, Motion, backend or unrelated gameplay unless the task explicitly enters Milestone 0 and the repository inspection justifies it.

When product/code/docs conflict:
- stop the conflicting change;
- report verified facts, inference and assumption separately;
- propose the smallest decision/ADR path;
- do not silently change behavior.

When implementation is complete, hand off to Codex for logic/test review and Antigravity for browser/mobile QA when applicable.

End with:
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP

Never claim a command, browser flow or visual check was tested unless it actually ran.
~~~
