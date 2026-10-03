# Testing & QA

## 1. Definition of Done

A feature is done only when:

- Acceptance criteria are met.
- TypeScript has no new errors.
- Lint passes.
- Relevant automated tests pass.
- Mobile flow is manually/visually verified at 390x844.
- No horizontal overflow.
- Touch interaction works without hover dependency.
- Loading/empty/error states are handled when applicable.
- Docs are updated if behavior/contracts changed.

## 2. Unit tests

Prioritize pure domain logic:

- bouquet price;
- tag aggregation;
- satisfaction scoring;
- score thresholds;
- deterministic placement;
- day summary;
- reputation rewards;
- save migrations.

## 3. Component tests

High-value targets:

- flower tray add/remove state;
- request sheet collapse/expand;
- cost display;
- finishing step validation;
- reaction reason rendering;
- diary empty/content states.

## 4. E2E critical paths

### E2E-01 First bouquet

1. Open fresh game.
2. Start first customer.
3. Add minimum valid flowers.
4. Choose wrap/ribbon.
5. Deliver.
6. See reaction.
7. Proceed.

### E2E-02 Persistence

1. Complete bouquet.
2. Reload.
3. State remains.
4. Diary entry is reconstructable.

### E2E-03 Full day

1. Complete 5 orders.
2. See end-day summary.
3. Start next day.

### E2E-04 Share

1. Open diary entry.
2. Generate share card.
3. Fallback path works in browser without file-share support.

## 5. Mobile viewport matrix

Minimum automated/manual checks:

- 360x800.
- 390x844 primary.
- 430x932.
- desktop centered layout around 1440x900.

## 6. Bouquet interaction QA

Test:

- rapid taps;
- dragging stem near each edge;
- dragging while page is vertically scrollable;
- deleting selected stem;
- max stem count;
- switching materials quickly;
- reloading a saved bouquet;
- reduced-motion setting.

## 7. Performance QA

Profile bouquet drag. Look for:

- unnecessary rerender of all stems;
- layout thrashing;
- oversized transparent images;
- synchronous image export blocking core interaction;
- large initial content bundles.

## 8. Visual QA rubric

Before accepting a screen:

- Does the bouquet/customer remain the visual focus?
- Is there one obvious primary action?
- Does the page feel like a game, not admin software?
- Are controls reachable with one hand?
- Does Vietnamese text wrap naturally?
- Does the screen still work at 360px width?
