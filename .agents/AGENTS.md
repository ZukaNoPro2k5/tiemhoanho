# Project Agent Layer

## Purpose

The .agents directory contains TiemHoaWeb-specific rules, skills and workflow playbooks. It supplements AGENTS.md; it does not override product decisions or shared safety rules.

## Skill selection

Before editing, choose only the skills relevant to the task and name them in the task notes or handoff. Read the full SKILL.md files selected. A skill is guidance for decisions, not a replacement for inspecting current code.

## Workflow selection

Start with implement-feature for implementation, review-feature for review, visual-qa or mobile-qa for browser inspection, fix-ui-issue for a targeted UI defect, and regression-check after a change or merge. The chosen workflow must name its owner, reviewer, inputs, outputs and verification evidence.

## Conflict and scope rules

- AGENTS.md and accepted docs/decisions/ remain authoritative.
- If a skill conflicts with the product/architecture docs, stop and report the conflict.
- Do not load every skill for every task; keep the active context small.
- Do not create a new skill for a one-off preference. Add one only when a recurring project-specific failure mode needs a reusable contract.
- Every handoff distinguishes TESTED from NOT TESTED.

## Current skill set

- cozy-art-direction
- mobile-game-ui
- motion-language
- flower-shop-gameplay
- game-economy
- content-schema
- asset-pipeline
- game-state-management
- visual-qa
- performance-budget
