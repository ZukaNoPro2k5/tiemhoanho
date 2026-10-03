# Skill: Game Economy

## Purpose

Keep TiemHoaWeb balance explainable, centralized and gentle. Prevent agents from inventing currencies, rewards or progression curves while implementing isolated features.

## When to Use

Use for prices, bouquet cost, rewards, cash, reputation, XP, unlock thresholds, rarity, day summaries or any change that changes player value. Read docs/02_GAME_DESIGN.md, docs/06_DATA_MODEL.md and docs/12_DECISIONS.md first.

## Rules

- Keep balance values in named configuration or content data, not scattered through components.
- Treat the documented score breakdown and reputation rewards as contracts until an accepted decision changes them.
- Every reward has a player-facing reason and a deterministic calculation.
- Use integer money units consistently; do not mix display formatting with arithmetic.
- Add boundary tests for budget fit, score tiers, freshness and reputation rewards.
- A balance change records the old behavior, new behavior, reason, affected content and migration/replay impact.
- Prefer a small explicit balance table over a generic economy framework.

Example shape once application code exists:

~~~
const rewardConfig = {
  reputationByTier: {
    delighted: 5,
    happy: 3,
    okay: 1,
    disappointed: 0,
  },
} as const;
~~~

## Forbidden Patterns

- A new currency, XP formula, rarity tier or progression gate without a decision.
- Numeric literals such as reward = 25 or price = 180 spread across UI and domain files.
- Hidden multipliers, random reward ranges or opaque beauty scores.
- Balance logic inside React event handlers.
- Changing a price because it “feels right” without a test or content review.
- Tying core rewards to sharing or account creation in MVP.

## Examples

Good: scoreBouquet returns a breakdown, reaction tier and reason chips; a central reward config maps the tier to reputation.

Bad: a delivery button directly adds an arbitrary cash amount and a second component applies another undocumented bonus.

## Checklist

- Which config/content source owns this value?
- Is the calculation deterministic and unit-tested at boundaries?
- Does the player receive an understandable reason?
- Does the change alter an accepted product/economy decision?
- Are money units and display formatting separated?
- Does the balance remain low-stress and forgiving?

## Definition of Done

An economy change is ready when all affected values are centralized, boundary tests pass, player-facing reasoning is present and any decision/migration impact is documented.
