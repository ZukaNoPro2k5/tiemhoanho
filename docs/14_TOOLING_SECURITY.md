# Tooling and Security Recommendations

## Policy

Use few high-value tools. This document recommends capabilities; it does not install MCP servers or invent vendor-specific configuration syntax. Confirm the current official documentation and permission model before enabling a tool.

Least privilege applies to every agent and connector:

- no production secrets by default;
- no unrestricted destructive shell or cloud actions;
- no production database writes by default;
- no cloud-resource deletion or billing access;
- no force push or automatic merge of main;
- project-scoped and read-only first for external data.

## Recommendation matrix

| Tool | Priority | Agent | Purpose | When | Benefit | Risk | Permission | Install now? |
|---|---|---|---|---|---|---|---|---|
| GitHub integration | Core later | Claude/Codex | Branch, PR, issue and review context | Once app work and PR flow exist | Keeps handoffs tied to source control | Broad repo write access or accidental merge | Repository-scoped; read/review first; no main merge | No — repository foundation is local |
| Playwright or equivalent browser automation | Core later | Antigravity/Codex | Critical mobile flows and regression | When an app and start command exist | Reproducible browser evidence | Tests can touch real external services | Local/preview environment; test data only | No — no app exists |
| Chrome DevTools or equivalent | Core later | Antigravity/Codex | Console, layout and performance inspection | During visual/performance QA | Finds overflow, errors, long tasks and frame drops | Can expose sensitive local data | Local/preview browser only | No — no app exists |
| Context7 or official docs lookup | Recommended later | Claude/Codex | Version-accurate library/API docs | When a selected dependency has a current API question | Reduces stale API assumptions | Untrusted or mismatched documentation | Read-only; prefer official sources | No |
| Figma integration | Recommended later | Claude/Antigravity | Inspect approved visual source | When an approved Figma file exists | Aligns implementation with design decisions | Read/write design drift or data exposure | Project-scoped read-only first | No |
| Storybook | Recommended later | Codex/Antigravity | Isolate reusable DOM component states | After reusable UI components exist | Fast component state review | Duplicates app setup or pulls focus from game scene | Local-only; no production data | No |
| Preview hosting integration | Recommended later | Codex/Antigravity | Share a reviewable build | After a deploy target and CI exist | Enables browser QA on a stable preview | Secret leakage or unintended public release | Preview-only credentials; no production write | No |
| Motion tooling | Conditional | Antigravity/Codex | Support an adopted animation library | Only after Motion is selected in app code | Consistent animation primitives | Extra dependency and abstraction | Local code only | No |
| PixiJS tooling | Conditional | Antigravity/Codex | Accelerate a measured renderer migration | Only after DOM/SVG limitations are demonstrated and ADR accepted | Could improve complex scene rendering | Premature engine complexity and accessibility cost | Local code only | No |
| Supabase/database integration | Not needed for MVP | Claude/Codex | Future cloud save/account/community data | Only after client-first MVP validates need | Shared persistence when explicitly required | Production data exposure and backend scope creep | Project-scoped; read-only initially; no production writes | No |
| Vercel or other deployment tool | Not needed now | Codex/Antigravity | Future preview/production deployment | After app build and deployment decision | Simple hosting/review flow | Deploying unfinished or secret-bearing code | Preview-only until release process is accepted | No |

## Tool selection rule

A new tool must name the pain it removes, the agent that uses it, the environment it touches, the minimum permission, the verification path and the cost if it is wrong. If those cannot be stated, do not add the tool.

## Secure operating defaults

- Keep GitHub main protected by process: branch review, focused commits and evidence before merge.
- Keep browser tests on local or preview environments with deterministic test data.
- Use read-only/project-scoped database access if a backend is ever introduced.
- Keep secrets outside the repository and do not paste them into prompts, logs or screenshots.
- Never grant production database write access, cloud deletion, billing changes or unrestricted shell access merely to make an agent convenient.
- Review connector scopes when enabling or removing a tool.

## Current recommendation

Install no external tool for this documentation-only repository. When Milestone 0 creates an application, re-evaluate GitHub, browser automation and DevTools first; choose the rest only when a concrete pain is observed.
