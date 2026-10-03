# ADR-001: Repository-Local AI Development System v1

**Status:** accepted

**Date:** 2026-10-03

## Context

TiemHoaWeb is intended to be developed by Claude Code, OpenAI Codex and Google Antigravity. The repository already contains product, UX, gameplay and technical documents, but it has no application runtime yet. Without a shared operating layer, agents may duplicate instructions, edit the same working tree, invent dependencies or claim verification that was not run.

The project needs a small system that is useful before the application stack exists and remains understandable when source code is added.

## Decision

Use a repository-local AI development layer with:

- a concise root AGENTS.md shared contract;
- role-specific CLAUDE.md guidance;
- .agents/AGENTS.md conventions;
- ten domain-specific .agents/skills/*/SKILL.md files;
- six tool-agnostic .agents/workflows/*.md playbooks;
- a human-facing docs/AI_DEVELOPMENT_SYSTEM.md guide;
- a docs/14_TOOLING_SECURITY.md recommendation matrix;
- explicit Git branches/worktrees and standard handoffs;
- one safe scripts/setup-worktrees.sh helper;
- focused prompts/templates that route agents to the same system.

Preserve the existing product/domain documents as source of truth. Keep the documented DOM/SVG-first renderer decision. Do not install packages, external MCP servers or application/gameplay code as part of this foundation.

## Alternatives considered

### Documentation-only edits

Lower immediate effort, but recurring decisions about skills, QA and handoffs would remain implicit and inconsistent.

### Full React/Pixi/Motion stack bootstrap

Would create visible implementation progress, but the repository has no confirmed package/runtime context. It violates the request to inspect first and creates dependency/renderer decisions before a playable slice proves the need.

### Repository-local Markdown system

Chosen because it is inspectable by all three agents, versioned with the product docs, easy to review in Git and does not require vendor-specific configuration or external permissions.

## Consequences

Positive:

- Agents can route a task to a role, level, skill and workflow without re-prompting the whole product context.
- Worktree ownership and evidence-based handoffs reduce overlapping edits and unverifiable claims.
- Domain-specific skills preserve cozy/mobile/gameplay constraints while keeping AGENTS.md short.
- Tooling remains least-privilege and deferred until the application creates a real need.

Costs:

- Agents must maintain several small files and choose the relevant skill/workflow.
- Markdown workflows cannot enforce permissions or tests by themselves.
- The stack and runtime remain intentionally unresolved until Milestone 0.

## Verification / migration

- Required sections, project-doc references and handoff markers are checked with shell scans.
- Markdown whitespace is checked with git diff --check.
- scripts/setup-worktrees.sh is syntax-checked and tested in an isolated temporary clone.
- When application code is added, add the selected package scripts, CI and browser commands to the system guide without rewriting the product docs.
- If a renderer, backend, state library or external tool is accepted later, add an ADR and update the affected skills/workflows before implementation.
