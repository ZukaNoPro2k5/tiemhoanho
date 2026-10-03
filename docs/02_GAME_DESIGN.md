# Game Design Specification

## 1. Core session

A normal MVP day contains 5 customers and should take roughly 4–7 minutes depending on how much time a player spends designing bouquets.

An individual order should normally take 45–120 seconds.

## 2. Order model

Each order contains:

- `occasion`: birthday, graduation, first_date, apology, thank_you, anniversary, encouragement, confession, etc.
- `budgetMin` / `budgetMax`.
- `desiredTags`: 1–3 semantic tags such as `romantic`, `cheerful`, `gentle`, `elegant`, `warm`.
- `preferredColors`: optional 0–2 color families.
- `avoidTags`: optional and used sparingly.
- `customerLine`: natural-language Vietnamese request.

The request shown to the user must be enough to infer scoring constraints.

## 3. Bouquet building

### Selection constraints

- Minimum 3 stems to deliver.
- Maximum 9 stems in MVP.
- A foliage item counts as a stem for UI but may have a lower cost.
- Duplicate flower types are allowed.

### Composition representation

Each placed stem stores normalized values independent of viewport:

- `x`: 0..1
- `y`: 0..1
- `rotationDeg`
- `scale`
- `zIndex`

The renderer converts normalized positions into the bouquet viewport.

### Auto-compose assist

When the player adds a flower, place it using a deterministic composition helper rather than pure random coordinates. The helper should:

- Favor a fan/rounded silhouette.
- Keep focal flowers near the visual center.
- Offset duplicates.
- Keep foliage slightly wider/lower.
- Avoid exact overlaps.
- Use a deterministic seed so a saved bouquet reconstructs consistently.

The player can then drag to adjust.

## 4. Flower metadata

Each flower has:

- Base price.
- Color family.
- Semantic tags.
- Visual role: focal / secondary / filler / foliage.
- Freshness.
- Asset id.

Example:

```ts
{
  id: 'pink-tulip',
  nameVi: 'Tulip hồng',
  basePrice: 28000,
  colors: ['pink'],
  tags: ['gentle', 'romantic'],
  role: 'focal'
}
```

## 5. Satisfaction scoring

Keep scoring explainable. Suggested MVP score (0–100):

- 40 points: desired semantic tags.
- 20 points: preferred color match.
- 20 points: budget fit.
- 10 points: freshness.
- 10 points: bouquet variety/structure sanity.

Do not score pixel-level aesthetic beauty.

### Budget score

- Inside requested range: full 20.
- Up to 10% over/under: 12–19 with linear falloff.
- Beyond 25%: 0.

### Tag score

Build bouquet tag weights from the selected flowers plus wrap/ribbon modifiers. Award proportionally for requested tags.

### Color score

If no preferred color is requested, award full points and do not invent a hidden preference.

### Freshness score

Average selected stem freshness.

### Sanity score

Simple rules only, e.g. at least one focal/secondary flower and not all foliage.

## 6. Reaction tiers

- 90–100: `delighted`
- 75–89: `happy`
- 55–74: `okay`
- 0–54: `disappointed`

Reaction copy should mention one concrete reason when possible.

Examples:

- “Đúng màu mình thích luôn, xinh quá trời 🥹”
- “Bó này nhẹ nhàng đúng kiểu mình cần.”
- “Xinh đó, nhưng hơi vượt ngân sách của mình một chút.”

## 7. Rewards

MVP rewards:

- Customer pays final bouquet price.
- Reputation gain derives from satisfaction.
- No premium currency.

Suggested reputation gain:

- delighted: +5
- happy: +3
- okay: +1
- disappointed: +0

## 8. Day loop

At day start:

- Generate/choose 5 orders.
- Refresh curated inventory.
- Later P1: show special event/weather.

At day end:

- Revenue.
- Cost of used stems/materials.
- Profit.
- Average satisfaction.
- Best bouquet thumbnail.

## 9. Progression

MVP progression is deliberately shallow:

- Reputation unlocks a few flowers/materials across early days.
- Avoid XP bars everywhere.
- Use named shop reputation stages later:
  - Tiệm mới mở
  - Tiệm nhỏ được yêu thích
  - Tiệm hoa của khu phố
  - Florist nổi tiếng
  - Dream Flower Shop

## 10. Failure philosophy

No harsh fail state. A weak bouquet gives weaker reaction/reputation, not a forced restart.

The player should be able to learn from feedback and immediately try another order.
