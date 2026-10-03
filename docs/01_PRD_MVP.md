# PRD — MVP v0.1

## 1. Product

**Working name:** TiemHoaWeb / Tiệm Hoa Nhỏ

**Platform:** Mobile-first web app / installable PWA.

**Primary language:** Vietnamese.

**Primary viewport:** 390x844 CSS px.

## 2. Problem / opportunity

Browser-based shop games work well when the player can understand the job immediately, perform tactile steps, see the result, earn money, and repeat. A flower-shop theme adds a strong visual and emotional advantage: the finished product can itself become collectible and shareable content.

## 3. MVP goal

Validate one question:

> Is the 60–120 second loop of receiving a request, creating a bouquet, delivering it, and seeing the reaction satisfying enough that players want another order?

## 4. Core loop

```text
Customer arrives
  -> read request
  -> choose flowers
  -> arrange bouquet
  -> choose wrapping
  -> choose ribbon/card
  -> review price
  -> deliver
  -> customer reaction + score
  -> cash/reputation
  -> save bouquet to diary
  -> next customer
```

## 5. MVP feature set

### P0 — required

1. **Shop/home scene**
   - Start/continue game.
   - Current day, cash and reputation visible but visually light.
   - Customer appears in the scene.

2. **Customer orders**
   - Each request has occasion, budget, desired mood/tags and optional color preference.
   - Copy is short, conversational Vietnamese.
   - No hidden hard requirements in MVP.

3. **Bouquet Designer**
   - Select 3–9 stems/items.
   - Mix flowers/foliage.
   - Visual bouquet updates instantly.
   - Player can reposition/adjust stems in the composition area.
   - Undo/remove item.
   - Clear cost feedback.

4. **Finishing**
   - Choose one wrap.
   - Choose one ribbon.
   - Optional card.
   - Preview final bouquet.

5. **Transparent evaluation**
   - Score based on request match, budget, freshness and simple harmony rules.
   - Player sees why the customer liked/disliked the result.
   - No opaque AI beauty score.

6. **Customer reaction**
   - Reaction tier based on score.
   - Short contextual line.
   - Reward cash + reputation.

7. **Simple day loop**
   - 5 orders per day in MVP.
   - End-of-day summary: revenue, flower cost, profit, average satisfaction.
   - Continue to next day.

8. **Inventory/freshness lite**
   - Flower inventory has quantity and freshness tier.
   - Initial MVP may auto-restock a curated set per day; manual purchasing is P1 if it delays core validation.

9. **Flower Diary**
   - Save final bouquet recipe/layout metadata.
   - Show date/day, customer, occasion, score and bouquet thumbnail/reconstruction.

10. **Share card**
   - Generate a portrait share card from a completed bouquet.
   - Web Share API when available; image save fallback.
   - No reward required for sharing.

11. **Local persistence**
   - Continue after refresh/reopen.
   - Versioned save schema.

12. **PWA basics**
   - Installable metadata/icons.
   - App shell available offline after first successful load.

### P1 — after core loop is proven

- Manual daily purchasing.
- Weather/special-day modifiers.
- Reusable regular customers/story arcs.
- Decoration purchasing and shop themes.
- Wilted flower -> dried flower conversion.
- Daily bouquet challenge.

### Out of MVP

- Multiplayer/realtime social.
- Guild/clan.
- Gacha/loot boxes.
- Energy/lives.
- Large farm/garden simulation.
- Employee scheduling.
- City map.
- Mandatory authentication.
- Payment/monetization.

## 6. Initial content target

- 12 flower/foliage types.
- 6 wraps.
- 6 ribbons.
- 8 cards/stickers.
- 12 customer identities/archetypes.
- 30 order templates assembled from data.
- 4 reaction tiers.

## 7. Success criteria for prototype

The prototype is good enough to proceed when internal/user tests show:

- A first-time user completes the first bouquet without external instruction.
- Most users understand why their result received its reaction.
- Bouquet interaction feels responsive on a mid-range mobile device.
- Finished bouquets look intentionally composed rather than randomly stacked.
- The first session can be completed without creating an account.

## 8. Non-goals

The MVP does not try to be a realistic floristry simulator. Flower meanings, prices and care behavior may be simplified for gameplay and tone, but should not contradict themselves within the game.

## 9. Key product risk

The largest risk is not lack of features. It is the Bouquet Designer producing ugly or fiddly results. Protect prototype time for composition quality, touch behavior, layering, feedback and motion.
