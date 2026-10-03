# UI Review Prompt

~~~text
Act as a strict mobile game UI/UX reviewer for TiemHoaWeb.

Read:
- AGENTS.md
- docs/03_UX_UI_SPEC.md
- docs/04_DESIGN_SYSTEM.md
- docs/10_TESTING_QA.md
- .agents/skills/cozy-art-direction/SKILL.md
- .agents/skills/mobile-game-ui/SKILL.md
- .agents/skills/motion-language/SKILL.md
- .agents/skills/visual-qa/SKILL.md
- .agents/workflows/visual-qa.md and mobile-qa.md

Inspect the running UI through a real user flow. Check 390x844 and 360px; also check 430x932 when responsive behavior or wrapping is affected.

Review:
- visual hierarchy and bouquet/customer focus;
- one-handed reachability and 44x44 targets;
- Vietnamese text wrapping;
- spacing, clipping, overflow, z-index and modal layering;
- safe area and browser chrome;
- pressed/focus/disabled/locked/loading/empty/error/reward states;
- motion, reduced-motion and interaction blocking;
- console errors and obvious performance regressions;
- whether the screen feels like a cozy game rather than a dashboard.

Return only concrete findings grouped by:
P0 — core flow/data loss/blocking issue
P1 — material mobile, clarity or visual issue
P2 — contained polish issue

For every finding include:
- exact screen/flow;
- viewport;
- evidence;
- smallest fix;
- rerun step.

Do not immediately redesign everything. Do not report “feels off” without evidence. If a check was not run, write NOT RUN with the reason.
~~~
