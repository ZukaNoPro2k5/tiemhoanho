# Skill: Flower Shop Gameplay

## Purpose

Protect the cozy, low-stress bouquet loop and make every meaningful action understandable, forgiving and emotionally rewarding.

## When to Use

Use when changing orders, bouquet creation, finishing, customer reactions, rewards, progression, tutorial flow or any gameplay feedback. Read docs/01_PRD_MVP.md and docs/02_GAME_DESIGN.md first.

## Rules

- Preserve the readable loop: customer request -> flower selection -> arrangement -> wrap/ribbon/card -> delivery -> explainable reaction -> reward -> diary.
- A first-time player should complete the first bouquet within two minutes without reading a manual.
- Requests expose the constraints that affect scoring. Do not hide hard requirements.
- A meaningful action should produce coordinated visual, motion and state feedback.
- Weak results teach without forcing a restart. Failure is a softer reaction, not a punitive dead end.
- Keep progression shallow in MVP. Protect making something beautiful before adding management depth.
- Prefer small surprises, collection desire and customer context over modal spam or long tutorial text.
- Keep score explainable through tags, colors, budget, freshness and simple structure rules.
- Keep reward changes centralized and visible; do not let a plain numeric mutation stand in for UX.

## Forbidden Patterns

- Opaque AI beauty scores or pixel-level scoring in MVP.
- Hidden order requirements or surprise punishment.
- Mandatory account walls, energy/lives or gacha loops.
- Tutorial carousels that delay the first bouquet.
- A reward such as coin += 30 without a visible reaction/reward treatment.
- Adding a new currency, XP formula or progression gate without the economy/content decision path.
- Turning every customer into a stereotype or cruel joke.

## Examples

Good: after delivery, the customer reacts with one contextual Vietnamese line, two or three reason chips, a visible score tier and a short cash/reputation reward before the next action.

Bad: delivery silently updates cash, opens three popups and gives a hidden beauty score the player cannot learn from.

## Checklist

- Is the request understandable without external instructions?
- Does the action produce visual, motion and state feedback?
- Can the player recover from a weak result quickly?
- Is scoring/reward reasoning visible and deterministic?
- Does this add unnecessary reading, modal friction or management depth?
- Does content preserve warm, inclusive and non-humiliating customer stories?
- Does the change protect the bouquet as the product's main artifact?

## Definition of Done

A gameplay change is ready when its state transition is deterministic/testable, its feedback is visible, its failure path is forgiving and the relevant PRD/game-design acceptance criteria are covered.
