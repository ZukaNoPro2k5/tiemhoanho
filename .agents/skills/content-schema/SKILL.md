# Skill: Content Schema

## Purpose

Keep flowers, materials, customers, orders, dialogue and rewards data-driven, valid and easy for designers to extend without editing React flow components.

## When to Use

Use when adding or changing content definitions, schema types, validation, seed data, Vietnamese copy or content loading. Read docs/06_DATA_MODEL.md and docs/07_CONTENT_SCHEMA.md first.

## Rules

- Use the canonical ColorFamily, MoodTag, FlowerRole and material/order contracts before adding a new union value.
- Keep static content in the repository's content layer, separate from rendering and domain logic.
- Give every content entry a stable ID, localized display text and required asset references.
- Validate content at the boundary where it enters the game; use native TypeScript/runtime checks when they are sufficient.
- Customer lines should sound like short, natural Vietnamese chat speech, not objectives or database fields.
- Keep romantic and family stories inclusive; avoid humiliation, cruelty, stereotypes and real player data.
- Assemble orders from data templates; do not hard-code customer copy in feature components.
- A schema change that alters save or scoring semantics requires a decision and migration note.

## Forbidden Patterns

- Ad hoc string tags that bypass the canonical unions.
- Content branches such as if flowerId equals a specific ID inside UI components.
- User-facing copy embedded in button/render logic.
- A validation library added without a measured need or current stack inspection.
- Fake placeholder content shipped as if it were approved Vietnamese copy.
- Real personal names, player data or unreviewed copyrighted assets.

## Examples

Good: an order template declares occasion, budget range, desired tags, optional colors and a Vietnamese customerLine; a component renders the fields generically.

Bad: a customer card checks for “yellow-graduation-special” and secretly changes scoring for that one string.

## Checklist

- Is this data in the content layer?
- Does it use canonical IDs/unions and validate required fields?
- Can a designer add another entry without editing the flow component?
- Does copy fit the short, warm Vietnamese tone?
- Are asset IDs stable and resolvable?
- Does the change affect save, score, analytics or migration contracts?

## Definition of Done

Content is ready when its schema validation passes, IDs/assets are stable, copy safeguards are satisfied and no component-specific content branch is required.
