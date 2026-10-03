# Skill: Motion Language

## Purpose

Give TiemHoaWeb animation a consistent cozy personality: calm navigation, tactile interaction and expressive rewards without blocking play.

## When to Use

Use when adding or reviewing transitions, state changes, bouquet placement, customer arrival, reward feedback, unlocks, ambient movement or error/success feedback. Read docs/03_UX_UI_SPEC.md and docs/04_DESIGN_SYSTEM.md first.

## Rules

| Category | Intent | Default character |
|---|---|---|
| navigation | orient between views | subtle |
| feedback | confirm a tap or selection | tactile |
| reward | celebrate a successful delivery | delightful |
| character | show customer personality | warm |
| ambient | make the shop feel alive | calm |
| attention | guide without panic | gentle |
| error | explain a problem | clear, not aggressive |
| success | confirm completion | warm and brief |
| unlock | mark a new possibility | curious and expressive |

- Prefer opacity and transform animation over layout properties.
- Use the design-system timing ranges: micro 120–180ms, standard 220–320ms, celebration no more than about 600ms before interaction is available.
- Animate the changed object when possible; do not make the whole screen bounce for a local event.
- Make rewards more expressive than navigation, but keep the result legible.
- Respect prefers-reduced-motion with a simpler state change or short fade.
- Keep animation interruptible when the player needs to continue.
- Test rapid taps, repeated completion and unmount/navigation during motion.

## Forbidden Patterns

- Indiscriminate transition: all.
- Layout thrashing from width/height/top/left animation when transform works.
- Constant particles or ambient motion that competes with the bouquet.
- Excessive bounce, screen shake or slot-machine reward behavior.
- Blocking animations longer than roughly 600ms.
- Motion that is the only way to understand a state change.
- Ignoring prefers-reduced-motion.

## Examples

Good: a newly placed stem settles with a small damped transform, then the cost label updates immediately.

Bad: the entire screen shakes and fires confetti after every flower tap while the player waits for a long reward animation.

## Checklist

- Which motion category is this?
- Is the duration proportional to the importance of the event?
- Can the user interact during or immediately after the animation?
- Does reduced motion preserve the same meaning?
- Are transforms/opacity used instead of layout properties?
- Does repeated interaction remain calm and responsive?
- Is visual hierarchy still clear in a screenshot?

## Definition of Done

A motion change is ready when its category, timing, reduced-motion behavior and interaction availability are clear, and a mobile check shows no jank or blocking feedback.
