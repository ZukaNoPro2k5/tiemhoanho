# Antigravity — First Project Prompt

Use this prompt in a dedicated visual/UX worktree with browser tooling available.

~~~text
Read:
- AGENTS.md
- README.md
- docs/AI_DEVELOPMENT_SYSTEM.md
- docs/03_UX_UI_SPEC.md
- docs/04_DESIGN_SYSTEM.md
- docs/10_TESTING_QA.md
- the selected .agents/skills/mobile-game-ui/SKILL.md, cozy-art-direction/SKILL.md, motion-language/SKILL.md and visual-qa/SKILL.md
- .agents/workflows/visual-qa.md and mobile-qa.md

Inspect the running app and perform the real user flow. Do not treat page load or a generated screenshot as visual proof.

Check 390x844 first. Add 360px and 430x932 when layout, wrapping, safe area or responsive behavior is affected. Inspect:
- visual hierarchy and bouquet/customer focus;
- one-handed reach and 44x44 touch targets;
- safe-area/browser-bar behavior;
- overflow, clipping, text wrapping and z-index;
- pressed/focus/disabled/empty/loading/error/reward states;
- drag versus page scroll;
- motion and prefers-reduced-motion;
- console errors and performance symptoms.

Report findings as P0/P1/P2 with exact flow, viewport, evidence and smallest fix. After a fix, rerun the same flow and viewport.

End with:
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP

No browser check is PASS without naming the viewport and user flow.
~~~
