# Skill: Cozy Art Direction

## Purpose

Keep TiemHoaWeb visually warm, tactile, handmade and collectible without drifting into a generic mobile game, SaaS dashboard or childish cartoon style.

## When to Use

Use when creating or reviewing surfaces, cards, buttons, shop scenes, bouquet presentation, reward moments, empty states, icons, typography or visual tokens. Read docs/00_PRODUCT_VISION.md and docs/04_DESIGN_SYSTEM.md first.

## Rules

- Prefer warm stationery, botanical and softly playful language.
- Let flower and customer art carry color; keep large surfaces calm and readable.
- Use the existing design-system tokens before inventing new colors.
- Use soft organic shapes and restrained radii. Cards and sheets may be rounded, but not every element should be a pill.
- Use one friendly display face for headings and one readable UI face for body/control text. Verify Vietnamese diacritics.
- Keep borders warm and subtle; use one restrained soft shadow rather than stacked elevation.
- Preserve hierarchy: bouquet/customer imagery first, request/context second, primary action third.
- Treat empty states and rewards as part of the shop personality, not generic placeholders.
- Rarity or unlock presentation should feel like a small discovery, not a casino reward.

## Forbidden Patterns

- Glassmorphism on every surface.
- Neon, cyberpunk, loud gradients or cold enterprise gray.
- Excessive shadows, decorative noise or perfect geometric decoration everywhere.
- Bootstrap-like unthemed controls.
- Emoji as the complete icon system.
- Tiny text or low-contrast copy that sacrifices readability for mood.
- Hard-coded one-off colors when a token or asset color should be used.

## Examples

Good: a paper-like bouquet card with a warm border, a clear Vietnamese title, a small botanical accent and a single soft elevation.

Bad: a gray dashboard tile with a gradient blob, three metric badges and a tiny generic flower emoji.

## Checklist

- Does the screen feel like a little flower shop rather than an admin panel?
- Is the bouquet/customer visual focus preserved?
- Are surfaces, radius, border and shadow choices restrained?
- Do Vietnamese diacritics and body text remain readable?
- Are empty, locked and reward states charming without becoming noisy?
- Does the implementation reuse current tokens or document a new token decision?

## Definition of Done

A visual change is ready when its hierarchy is clear at 390x844, it follows the design-system vocabulary, it has no forbidden generic treatment and its relevant states have been reviewed.
