# TiemHoaWeb AI Development System v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Turn the approved AI Development System v1 design into usable repository documentation, project skills, workflow playbooks and a safe Git worktree helper without adding application dependencies or gameplay.

**Architecture:** Keep \`AGENTS.md\` as the short shared contract, put detailed TiemHoaWeb constraints in ten \`.agents/skills/*/SKILL.md\` files, and put repeatable procedures in six \`.agents/workflows/*.md\` playbooks. Supporting system/tooling docs, an ADR, updated prompts/templates and one POSIX shell helper make the workflow executable while preserving the existing product and technical documents as source of truth.

**Tech Stack:** Markdown; POSIX shell; Git worktrees; existing repository documentation. No runtime packages, framework, MCP server or application source code are introduced.

**Spec:** \`docs/superpowers/specs/2026-10-03-ai-development-system-v1-design.md\`

## Global Constraints

- \`AGENTS.md\` is the short, shared contract. Detailed rules live in domain docs and project skills.
- The documented renderer decision is React + DOM/SVG/CSS for the MVP, with a game engine deferred until performance evidence requires one.
- One task has one implementation owner at a time.
- No React/Vite project bootstrap in this change.
- No dependency installation or lockfile creation.
- No PixiJS, Motion, Zustand, Storybook, Supabase or hosting setup.
- No gameplay feature, UI screen or asset generation.
- No automatic PR creation, merge, deployment or production access.
- No tool may receive production secrets, unrestricted destructive access, production database writes, billing permissions, cloud-resource deletion or force-push authority by default.
- The required baseline viewport is 390x844. Affected mobile work also checks 360px; the wider 430x932 viewport is used when responsive behavior or layout wrapping is relevant.
- No agent may claim a check that was not run. Handoffs use \`PASS\`, \`FAIL\`, or \`NOT RUN\` with the command or manual flow named.

## Review Focus

1. Shared instructions can contradict the existing product/architecture docs; Task 1 must preserve existing decisions and add only routing/operating rules, verified by targeted conflict scans.
2. A skill can exist but be too generic to guide an agent; Tasks 2 and 3 must verify all ten skills contain the required sections and concrete TiemHoaWeb references.
3. A workflow can describe activity without producing evidence; Task 4 must verify every playbook defines entry conditions, required inputs, outputs, stop conditions and the standard handoff.
4. A worktree helper can overwrite user work or delete Git state; Task 6 must test existing-target refusal, invalid-argument refusal, shell syntax and a successful isolated clone setup.
5. Tooling guidance can accidentally grant production access or invent vendor configuration; Task 5 must verify the security matrix has explicit priorities, agent purpose, least-privilege boundaries and no unverified config syntax.

---

## File Map

### Shared contract and system documentation

- Modify: \`AGENTS.md\` — keep it concise; add shared architecture map, ownership, workflow levels, Git/worktree rules, docs map and DoD links.
- Modify: \`CLAUDE.md\` — make it Claude-specific; add architecture planning, invariants, review preparation and verification behavior without duplicating all shared rules.
- Modify: \`README.md\` — describe this as the active repository, add quickstart for agents, link the system guide, skills and workflows, and remove copy-kit wording that no longer matches the repo.
- Modify: \`docs/13_MULTI_AGENT_WORKFLOW.md\` — make the existing role/branch/handoff guidance consistent with the new system and route detailed procedures to \`.agents/workflows/\`.
- Create: \`docs/AI_DEVELOPMENT_SYSTEM.md\` — the concise operating manual and final report for agents/humans.
- Create: \`docs/14_TOOLING_SECURITY.md\` — MCP/tool recommendation matrix and least-privilege policy.
- Create: \`docs/decisions/001-ai-development-system-v1.md\` — accepted ADR for the documentation/skills/workflow architecture.

### Project-local agent layer

- Create: \`.agents/AGENTS.md\` — conventions for the \`.agents\` directory, skill loading, workflow selection and scope.
- Create: \`.agents/skills/cozy-art-direction/SKILL.md\`
- Create: \`.agents/skills/mobile-game-ui/SKILL.md\`
- Create: \`.agents/skills/motion-language/SKILL.md\`
- Create: \`.agents/skills/flower-shop-gameplay/SKILL.md\`
- Create: \`.agents/skills/game-economy/SKILL.md\`
- Create: \`.agents/skills/content-schema/SKILL.md\`
- Create: \`.agents/skills/asset-pipeline/SKILL.md\`
- Create: \`.agents/skills/game-state-management/SKILL.md\`
- Create: \`.agents/skills/visual-qa/SKILL.md\`
- Create: \`.agents/skills/performance-budget/SKILL.md\`
- Create: \`.agents/workflows/implement-feature.md\`
- Create: \`.agents/workflows/review-feature.md\`
- Create: \`.agents/workflows/visual-qa.md\`
- Create: \`.agents/workflows/mobile-qa.md\`
- Create: \`.agents/workflows/fix-ui-issue.md\`
- Create: \`.agents/workflows/regression-check.md\`

### Prompts/templates and helper

- Modify: \`prompts/CLAUDE_FIRST_PROMPT.md\` — point Claude to the system guide, skills and planning flow.
- Modify: \`prompts/CODEX_FIRST_PROMPT.md\` — point Codex to implementation/review workflows and evidence rules.
- Modify: \`prompts/ANTIGRAVITY_FIRST_PROMPT.md\` — point Antigravity to visual/mobile QA workflows and viewport matrix.
- Modify: \`prompts/FEATURE_TASK_TEMPLATE.md\` — add task level, owner, skills, workflow, non-goals and handoff sections.
- Modify: \`prompts/UI_REVIEW_PROMPT.md\` — route UI review to the visual/mobile QA skills and standard P0/P1/P2 findings.
- Modify: \`templates/TASK.md\` — add owner/level, relevant skills, workflow, handoff and evidence fields.
- Create: \`scripts/setup-worktrees.sh\` — safe, argument-driven worktree creation with no overwrite/delete behavior.

---

### Task 1: Align the shared contract and documentation index

**Files:**
- Modify: \`AGENTS.md\`
- Modify: \`CLAUDE.md\`
- Modify: \`README.md\`
- Modify: \`docs/13_MULTI_AGENT_WORKFLOW.md\`

**Interfaces:**
- Consumes: existing product docs, architecture decision D-004, existing rules under \`.agents/rules/\` and \`.claude/rules/\`.
- Produces: stable links and shared terminology used by every later skill/workflow task.

- [ ] **Step 1: Rewrite \`AGENTS.md\` as the short contract.** Keep product priorities, strict TypeScript/domain separation, 390x844/360–430px UI invariants, MVP exclusions and required verification. Add concise sections for ownership, folder ownership once \`src/\` exists, branch/worktree rules, docs map and handoff format. Link detailed rules instead of copying them.
- [ ] **Step 2: Make \`CLAUDE.md\` Claude-specific.** Keep only planning/reasoning guidance: read relevant docs, classify SMALL/MEDIUM/LARGE, protect gameplay invariants, choose the smallest reversible architecture, write a plan for large work, prepare Codex/Antigravity handoffs and never claim unrun verification.
- [ ] **Step 3: Update \`README.md\` for the active repository.** Replace “copy this folder into a root repository” instructions with the actual current state, system quickstart, task routing table, skill/workflow map and a clear note that the application stack is unconfirmed until Milestone 0 inspection.
- [ ] **Step 4: Reconcile \`docs/13_MULTI_AGENT_WORKFLOW.md\`.** Preserve its useful milestone ownership, add the three workflow levels, point detailed execution to \`.agents/workflows/\`, and make branch naming/handoff/review language match the approved spec.
- [ ] **Step 5: Run conflict and link scans.**

Run:

~~~
git diff --check
rg -n "PixiJS|DOM/SVG|force push|force-push|390x844|handoff|worktree" AGENTS.md CLAUDE.md README.md docs/13_MULTI_AGENT_WORKFLOW.md
~~~

Expected: no whitespace errors; the existing DOM/SVG decision and mobile/worktree/handoff rules remain visible; no instruction tells an agent to install PixiJS or force-push.

- [ ] **Step 6: Commit the documentation contract.**

~~~
git add AGENTS.md CLAUDE.md README.md docs/13_MULTI_AGENT_WORKFLOW.md
git commit -m "docs: align shared agent operating contract"
~~~

---

### Task 2: Create visual, interaction and gameplay skills

**Files:**
- Create: \`.agents/skills/cozy-art-direction/SKILL.md\`
- Create: \`.agents/skills/mobile-game-ui/SKILL.md\`
- Create: \`.agents/skills/motion-language/SKILL.md\`
- Create: \`.agents/skills/flower-shop-gameplay/SKILL.md\`
- Create: \`.agents/skills/visual-qa/SKILL.md\`

**Interfaces:**
- Consumes: \`docs/00_PRODUCT_VISION.md\`, \`docs/01_PRD_MVP.md\`, \`docs/02_GAME_DESIGN.md\`, \`docs/03_UX_UI_SPEC.md\`, \`docs/04_DESIGN_SYSTEM.md\`, \`docs/10_TESTING_QA.md\`.
- Produces: reusable domain guidance referenced by Antigravity workflows, UI tasks and review prompts.

- [ ] **Step 1: Create the shared \`.agents/AGENTS.md\` loader contract.** Define how agents select a skill, that skills supplement rather than override \`AGENTS.md\`, and that workflows must name their selected skills and evidence outputs.
- [ ] **Step 2: Write \`cozy-art-direction/SKILL.md\`.** Include purpose, when to use, warm/handmade/playful visual vocabulary, restrained surfaces/radii/borders/shadows, typography and Vietnamese diacritics, icon/empty/reward guidance, forbidden generic SaaS/neon/glassmorphism patterns, one good/bad example and a visual checklist.
- [ ] **Step 3: Write \`mobile-game-ui/SKILL.md\`.** Include purpose, viewport matrix \`375x667\`, \`390x844\`, \`430x932\`, thumb reach, 44x44 targets, safe-area CSS, bottom sheets, scrolling/keyboard/browser chrome, landscape fallback, pointer interaction, hover independence, focus/contrast and non-drag alternatives.
- [ ] **Step 4: Write \`motion-language/SKILL.md\`.** Define navigation, feedback, reward, character, ambient, attention, error, success and unlock categories; use the philosophy \`navigation=subtle\`, \`interaction=tactile\`, \`reward=delightful\`, \`ambient=calm\`, \`error=clear\`; forbid indiscriminate \`transition: all\`; require reduced-motion behavior and transform/opacity-first animation.
- [ ] **Step 5: Write \`flower-shop-gameplay/SKILL.md\`.** Anchor decisions in the 60–120 second order loop, low-stress/forgiving design, transparent requests/scoring, tangible visual+motion+state feedback, shallow progression, collection desire and no spammy tutorial/modal patterns. Include a bouquet completion example and forbidden opaque beauty scoring.
- [ ] **Step 6: Write \`visual-qa/SKILL.md\`.** Define entry conditions, real user flow, screenshot/viewport inspection, overflow/touch/z-index/text wrapping/console/state checks, P0/P1/P2 finding format, rerun rules and a DoD tied to evidence rather than page load.
- [ ] **Step 7: Validate required sections and project references.** Each file must contain \`## Purpose\`, \`## When to Use\`, \`## Rules\`, \`## Forbidden Patterns\`, \`## Examples\`, \`## Checklist\`; each must link to at least one existing TiemHoaWeb doc and name its definition of done.

Run:

~~~
for file in .agents/skills/{cozy-art-direction,mobile-game-ui,motion-language,flower-shop-gameplay,visual-qa}/SKILL.md; do
  test -f "$file"
  rg -q '^## Purpose$' "$file"
  rg -q '^## When to Use$' "$file"
  rg -q '^## Rules$' "$file"
  rg -q '^## Forbidden Patterns$' "$file"
  rg -q '^## Examples$' "$file"
  rg -q '^## Checklist$' "$file"
done
~~~

Expected: exit code 0.

- [ ] **Step 8: Commit the first skill group.**

~~~
git add .agents/AGENTS.md .agents/skills/cozy-art-direction .agents/skills/mobile-game-ui .agents/skills/motion-language .agents/skills/flower-shop-gameplay .agents/skills/visual-qa
git commit -m "docs: add visual and gameplay project skills"
~~~

---

### Task 3: Create data, state, asset and performance skills

**Files:**
- Create: \`.agents/skills/game-economy/SKILL.md\`
- Create: \`.agents/skills/content-schema/SKILL.md\`
- Create: \`.agents/skills/asset-pipeline/SKILL.md\`
- Create: \`.agents/skills/game-state-management/SKILL.md\`
- Create: \`.agents/skills/performance-budget/SKILL.md\`

**Interfaces:**
- Consumes: \`docs/02_GAME_DESIGN.md\`, \`docs/05_TECH_ARCHITECTURE.md\`, \`docs/06_DATA_MODEL.md\`, \`docs/07_CONTENT_SCHEMA.md\`, \`docs/10_TESTING_QA.md\`, \`docs/11_ANALYTICS.md\`.
- Produces: deterministic rules for domain/data/state/assets/performance tasks and review scope for Codex.

- [ ] **Step 1: Write \`game-economy/SKILL.md\`.** Require central balance/config data, explainable scoring/rewards, no new currency/XP/rarity without a decision, no scattered numeric literals, deterministic tests and explicit migration notes for balance changes. Include a small config example using the documented score/reputation concepts.
- [ ] **Step 2: Write \`content-schema/SKILL.md\`.** Require data-driven flowers/customers/orders/materials, canonical \`MoodTag\`/\`ColorFamily\` use, Vietnamese customer-line tone, validation at content boundaries and no user-facing copy embedded in components. Explain when a native TypeScript validator is sufficient and forbid adding a library without evidence.
- [ ] **Step 3: Write \`asset-pipeline/SKILL.md\`.** Define folder/naming conventions, asset IDs, transparent image anchors, formats, dimensions, variant/loading/cache decisions and a mobile size budget. Forbid uncompressed 10MB commits and missing dimensions/anchors for composable flower assets.
- [ ] **Step 4: Write \`game-state-management/SKILL.md\`.** Define UI, gameplay, persistent, server and transient animation boundaries; keep domain rules out of stores; specify versioned save/migration requirements and corrupt-save recovery; forbid one global store for every concern and direct vendor SDK usage in domain code.
- [ ] **Step 5: Write \`performance-budget/SKILL.md\`.** Define targets rather than absolute promises: responsive bouquet drag, 60fps target on common mid-range mobile, lazy-loaded non-core content, compressed images, no layout-property animation, limited particles, rerender/long-task checks and measurement commands to use once the app exists.
- [ ] **Step 6: Validate required sections and references.** Use the same required-section command from Task 2 for these five files. Confirm all referenced contracts exist and that no skill introduces a package or cloud service.
- [ ] **Step 7: Commit the second skill group.**

~~~
git add .agents/skills/game-economy .agents/skills/content-schema .agents/skills/asset-pipeline .agents/skills/game-state-management .agents/skills/performance-budget
git commit -m "docs: add domain and performance project skills"
~~~

---

### Task 4: Create workflow playbooks and handoff procedures

**Files:**
- Create: \`.agents/workflows/implement-feature.md\`
- Create: \`.agents/workflows/review-feature.md\`
- Create: \`.agents/workflows/visual-qa.md\`
- Create: \`.agents/workflows/mobile-qa.md\`
- Create: \`.agents/workflows/fix-ui-issue.md\`
- Create: \`.agents/workflows/regression-check.md\`

**Interfaces:**
- Consumes: ten skills from Tasks 2–3, \`AGENTS.md\`, \`docs/10_TESTING_QA.md\`, \`docs/13_MULTI_AGENT_WORKFLOW.md\`.
- Produces: deterministic procedures that prompts and agents can invoke without vendor-specific syntax.

- [ ] **Step 1: Define the common playbook header.** Every workflow starts with purpose, when to use, required inputs/docs, selected skills, owner/reviewer, outputs, stop conditions and the standard \`SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP\` handoff.
- [ ] **Step 2: Write \`implement-feature.md\`.** Require repository inspection, task-level classification, relevant docs/skills, scope/non-goals, implementation, automated verification, mobile check when UI changes and handoff. Include separate SMALL/MEDIUM/LARGE routing and a stop condition for scope growth or doc conflict.
- [ ] **Step 3: Write \`review-feature.md\`.** Require review against product, UX and engineering axes; check changed files and diff; rank concrete findings P0/P1/P2; verify tests and claims; do not redesign without evidence; emit approval, requested changes or blocked status.
- [ ] **Step 4: Write \`visual-qa.md\` and \`mobile-qa.md\`.** Use real browser flows at 390x844, add 360px and 430x932 when applicable, inspect screenshots/console/overflow/touch targets/safe areas/text/motion/empty-loading-error states, and record exact evidence and rerun conditions.
- [ ] **Step 5: Write \`fix-ui-issue.md\`.** Require reproduction at the failing viewport, smallest scoped fix, preservation of domain contracts, before/after evidence, exact rerun and no unrelated visual refactor.
- [ ] **Step 6: Write \`regression-check.md\`.** Route to the cheapest meaningful checks first, then affected unit/component/browser/visual/performance checks; distinguish not-applicable from not-run; refuse a pass claim with missing evidence.
- [ ] **Step 7: Validate workflow contracts.**

Run:

~~~
for file in .agents/workflows/*.md; do
  rg -q '^## (Purpose|When to Use|Required Inputs|Outputs|Stop Conditions)' "$file"
  rg -q 'SUMMARY' "$file"
  rg -q 'TESTED' "$file"
  rg -q 'NOT TESTED' "$file"
done
~~~

Expected: exit code 0 for all six files.

- [ ] **Step 8: Commit the workflow playbooks.**

~~~
git add .agents/workflows
git commit -m "docs: add multi-agent workflow playbooks"
~~~

---

### Task 5: Add the system guide, tooling/security matrix and ADR

**Files:**
- Create: \`docs/AI_DEVELOPMENT_SYSTEM.md\`
- Create: \`docs/14_TOOLING_SECURITY.md\`
- Create: \`docs/decisions/001-ai-development-system-v1.md\`

**Interfaces:**
- Consumes: approved design spec, updated shared docs, ten skills and six workflows.
- Produces: human-facing entry point, explicit tooling/security recommendation and accepted architectural record.

- [ ] **Step 1: Write \`docs/AI_DEVELOPMENT_SYSTEM.md\`.** Include current state, gap analysis, agent roles, source-of-truth hierarchy, skill/workflow index, SMALL/MEDIUM/LARGE matrix, Git/worktree setup, testing/QA loop, handoff format, DoD, explicit non-goals and the next five safe tasks.
- [ ] **Step 2: Write \`docs/14_TOOLING_SECURITY.md\`.** Use a table with \`Tool\`, \`Priority\`, \`Agent\`, \`Purpose\`, \`When\`, \`Benefit\`, \`Risk\`, \`Permission\` and \`Install now?\`. Classify GitHub/browser/DevTools as core when app code exists; Context7/Figma/Storybook/hosting as later; Motion/Pixi/Supabase as conditional/not needed now. State that no vendor config syntax is supplied without verified documentation.
- [ ] **Step 3: Write the ADR from \`templates/ADR.md\`.** Record that v1 uses a repository-local Markdown skills/workflows layer plus root contracts, preserves product/domain docs, keeps external tooling recommendations separate and does not bootstrap app dependencies. Include alternatives (docs-only, full stack bootstrap), consequences and verification.
- [ ] **Step 4: Check the matrix and ADR for prohibited access.**

Run:

~~~
rg -n "production|secret|database|force.?push|billing|delete|Install now\\?|Priority" docs/AI_DEVELOPMENT_SYSTEM.md docs/14_TOOLING_SECURITY.md docs/decisions/001-ai-development-system-v1.md
~~~

Expected: each sensitive capability is explicitly restricted; no row grants unrestricted access or says to install a tool immediately without a current application need.

- [ ] **Step 5: Commit the system guide and decision records.**

~~~
git add docs/AI_DEVELOPMENT_SYSTEM.md docs/14_TOOLING_SECURITY.md docs/decisions/001-ai-development-system-v1.md
git commit -m "docs: document AI system and tooling boundaries"
~~~

---

### Task 6: Create the safe Git worktree helper

**Files:**
- Create: \`scripts/setup-worktrees.sh\`

**Interfaces:**
- Consumes: an existing Git repository with a valid starting ref and explicit branch/path pairs.
- Produces: new worktrees only at absent target paths; never overwrites, deletes or force-pushes.

- [ ] **Step 1: Define the command interface.** Support \`--help\` and repeated positional pairs:

~~~
scripts/setup-worktrees.sh <branch> <path> [<branch> <path> ...]
~~~

Use the current \`HEAD\` as the starting ref. Require at least one pair. Reject an odd argument count, an empty branch/path, a path that already exists, a non-Git working directory or a branch that already exists locally. The script must not run \`rm\`, \`git reset\`, \`git checkout\`, \`git branch -D\`, \`git push --force\` or equivalent destructive operations.

- [ ] **Step 2: Implement shell safety and validation.** Start with \`#!/usr/bin/env bash\` and \`set -euo pipefail\`; resolve the repository root with \`git rev-parse --show-toplevel\`; validate all pairs before creating any worktree; then run \`git worktree add -b "$branch" "$path" HEAD\` for each pair. Print each created path and branch.
- [ ] **Step 3: Add help and actionable errors.** \`--help\` prints usage, examples for Claude/Codex/Antigravity and the no-overwrite/no-delete policy. Invalid calls exit non-zero and state the violated precondition without changing Git state.
- [ ] **Step 4: Run static validation.**

Run:

~~~
bash -n scripts/setup-worktrees.sh
scripts/setup-worktrees.sh --help
~~~

Expected: syntax exit 0; help exit 0 and includes the pair syntax and safe-operation policy.

- [ ] **Step 5: Test refusal and successful creation in an isolated temporary clone.** Use \`mktemp -d\`, create a bare origin and a temporary clone, invoke the helper with three absent paths, verify \`git worktree list\` shows all three branches, then invoke it again with an existing path and verify non-zero status without deleting or changing the existing worktree. Remove only the temporary directory created for this test.
- [ ] **Step 6: Commit the helper.**

~~~
git add scripts/setup-worktrees.sh
git commit -m "chore: add safe multi-agent worktree helper"
~~~

---

### Task 7: Update prompts and reusable task templates

**Files:**
- Modify: \`prompts/CLAUDE_FIRST_PROMPT.md\`
- Modify: \`prompts/CODEX_FIRST_PROMPT.md\`
- Modify: \`prompts/ANTIGRAVITY_FIRST_PROMPT.md\`
- Modify: \`prompts/FEATURE_TASK_TEMPLATE.md\`
- Modify: \`prompts/UI_REVIEW_PROMPT.md\`
- Modify: \`templates/TASK.md\`

**Interfaces:**
- Consumes: \`docs/AI_DEVELOPMENT_SYSTEM.md\`, \`.agents/workflows/\`, \`.agents/skills/\`, \`AGENTS.md\`.
- Produces: copyable prompts that route agents to the same operating system without duplicating all domain rules.

- [ ] **Step 1: Update Claude's first prompt.** Require reading the system guide and relevant skills, task classification, plan-first behavior for large work, architecture/product conflict reporting and a handoff to Codex/Antigravity.
- [ ] **Step 2: Update Codex's first prompt.** Route implementation/refactor/test/review work to \`implement-feature.md\`, \`review-feature.md\` and \`regression-check.md\`; require exact PASS/FAIL/NOT RUN evidence and no unrequested stack bootstrap.
- [ ] **Step 3: Update Antigravity's first prompt.** Route browser work to \`visual-qa.md\` and \`mobile-qa.md\`, require 390x844 plus affected-width checks, screenshots/console/touch findings and the standard handoff.
- [ ] **Step 4: Update the feature task template.** Add task ID/level, owner/reviewer, relevant docs, skills/workflow, scope/non-goals, acceptance criteria, tests, visual/performance requirements and the six-part handoff.
- [ ] **Step 5: Update UI review prompt and \`templates/TASK.md\`.** Use the P0/P1/P2 evidence format, route to mobile/visual skills and require “not tested” disclosure.
- [ ] **Step 6: Scan prompts for stale assumptions.**

Run:

~~~
rg -n "AI_DEVELOPMENT_SYSTEM|implement-feature|visual-qa|mobile-qa|SUMMARY|NOT TESTED|390x844" prompts templates
rg -n "install.*Pixi|add.*backend|npm install|rewrite" prompts templates || true
~~~

Expected: new prompts route to the system; no prompt instructs this foundation task to install dependencies or implement gameplay.

- [ ] **Step 7: Commit prompt/template routing.**

~~~
git add prompts templates/TASK.md
git commit -m "docs: route agent prompts through v1 workflows"
~~~

---

### Task 8: Run repository-wide validation and final handoff

**Files:**
- Modify only if validation finds a contradiction: files from Tasks 1–7.

**Interfaces:**
- Consumes: all foundation files.
- Produces: verified AI Development System v1 with a final report and no untracked implementation artifacts.

- [ ] **Step 1: Verify the expected file inventory.**

Run:

~~~
test -f AGENTS.md
test -f CLAUDE.md
test -f .agents/AGENTS.md
test "$(find .agents/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l)" -eq 10
test "$(find .agents/workflows -maxdepth 1 -name '*.md' | wc -l)" -eq 6
test -f docs/AI_DEVELOPMENT_SYSTEM.md
test -f docs/14_TOOLING_SECURITY.md
test -f docs/decisions/001-ai-development-system-v1.md
test -x scripts/setup-worktrees.sh
~~~

Expected: exit code 0.

- [ ] **Step 2: Run required-section checks for every skill and workflow.** Reuse the commands from Tasks 2–4 and include a check that every skill/workflow path referenced by the system guide exists.
- [ ] **Step 3: Check Markdown whitespace and unresolved simple paths.**

Run:

~~~
git diff --check
rg -n "TODO|TBD|to be filled|implement later|npm install <|/path/to/|example\\.com" AGENTS.md CLAUDE.md README.md .agents docs/AI_DEVELOPMENT_SYSTEM.md docs/14_TOOLING_SECURITY.md docs/decisions prompts templates scripts || true
~~~

Expected: \`git diff --check\` exits 0; the scan returns no unresolved placeholder or fake path/config content.

- [ ] **Step 4: Confirm non-goals remain intact.**

Run:

~~~
find . -maxdepth 2 -type f \( -name 'package.json' -o -name '*lock*' \) -print
find src tests .github -maxdepth 2 -print 2>/dev/null || true
git status --short
~~~

Expected: no newly created package/lockfile/src/tests/.github implementation files; only the intended foundation files are changed or committed.

- [ ] **Step 5: Review the final diff against the spec coverage map.** Confirm sections 1–5 of the spec are represented by Tasks 1, 5 and 8; skills by Tasks 2–3; workflows by Task 4; Git/worktree by Task 6; prompts/handoff by Task 7; validation/non-goals by Task 8.
- [ ] **Step 6: Commit any final corrections as one focused validation commit.**

~~~
git add AGENTS.md CLAUDE.md README.md .agents docs prompts templates scripts
git commit -m "chore: validate AI development system foundation"
~~~

- [ ] **Step 7: Report the completed foundation.** Use the requested final report sections: current architecture, files created, files modified, agent roles, skills, MCP recommendations, workflow, Git/worktree setup, testing strategy, security considerations, intentionally omitted scope and recommended next five tasks. Include exact verification commands/results and any \`NOT RUN\` checks caused by the absence of application code.

## Execution Order

Run Tasks 1 through 8 sequentially. Tasks 2 and 3 depend on the shared contract vocabulary from Task 1; Task 4 depends on both skill groups; Tasks 5–7 consume the complete skill/workflow index; Task 8 is the final integration gate.

## Spec Coverage Check

- Current-state and gap analysis: Tasks 1 and 5.
- Agent roles and documentation hierarchy: Tasks 1 and 5.
- Ten project skills with required content: Tasks 2 and 3.
- Six workflow playbooks and standard handoff: Task 4.
- SMALL/MEDIUM/LARGE routing: Tasks 1, 4 and 7.
- Git branches/worktrees and safe helper: Tasks 1 and 6.
- MCP/tool recommendations and security: Task 5.
- Testing, mobile QA and performance loop: Tasks 2–5 and 8.
- Documentation/ADR structure: Task 5.
- Prompts/templates: Task 7.
- No dependency/gameplay/engine/bootstrap scope: Global Constraints and Task 8.

## Final Verification Commands

The final implementer must run all of these before claiming completion:

~~~
bash -n scripts/setup-worktrees.sh
git diff --check
find .agents/skills -mindepth 2 -maxdepth 2 -name SKILL.md | sort
find .agents/workflows -maxdepth 1 -name '*.md' | sort
git status --short --branch
~~~

Because this repository has no application implementation yet, \`lint\`, \`typecheck\`, unit tests, E2E tests and 390x844 browser checks are \`NOT RUN — no package/app exists\`; the system guide must state this explicitly rather than fabricate results.
