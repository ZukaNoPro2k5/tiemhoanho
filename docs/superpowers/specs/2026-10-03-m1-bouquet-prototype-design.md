# Milestone 1 — Bouquet Interaction Prototype: Design

**Date:** 2026-10-03
**Status:** draft for review
**Level:** LARGE
**Base:** `main` at `5e994f1` (Milestone 0 merged)
**Backlog:** B-01–B-10, B-12, B-13 (B-11 price is Milestone 2)

## 1. Goal

Answer one question: **does arranging flowers on a phone feel good, and do the results look intentionally composed?** This is the largest product risk named in docs/01_PRD_MVP.md §9.

Success means, on a real iPhone (Safari) and a real Android phone (Chrome):

- A first-time user can add, move, rotate, resize, reorder and remove stems without instruction.
- Dragging never scrolls or zooms the page and feels immediate.
- A bouquet built from random taps still looks like a bouquet or basket, not a pile of stickers.
- The same stored layout always reconstructs the same arrangement at any canvas size.

## 2. Decisions captured during brainstorming

| # | Decision | Notes |
|---|---|---|
| 1 | Test devices: **both** iPhone Safari and Android Chrome | Add a WebKit Playwright project; real-device checks via LAN preview |
| 2 | Entry: a **"Vào xếp hoa"** button on the shop shell switches to the designer; **Quay lại** returns. Screen state in `App`, **no router** | Revisit routing when a third screen or deep link is needed (ADR-002) |
| 3 | Wrap preview: **3 wraps** (kem, hồng phấn, kraft), each with back and front layers | Ribbon/card stay in Milestone 2 |
| 4 | Player authorship over composition: assist only proposes the first placement; the player can move, rotate, resize and reorder layers | Product direction: creative composing, not recipe precision |
| 5 | Two **arrangement styles** in M1: **Bó** (hand-tied bouquet) and **Lẵng** (basket) | One basket design in M1; no basket picker |
| 6 | "Kệ hoa làm sẵn" (pre-made display shelf customers browse) is **not M1**; record as proposed decision D-007 | Only impact on M1: `arrangementStyle` on the draft |

## 3. Reference research (summary)

Hands-on review at 390x844 of the viral Vietnamese web shop games discussed on Threads (Tiệm Mì Cay · Góc Phố, Tiệm Trà Nhỏ) plus press coverage:

- **Adopt:** one workstation screen with phase states instead of page navigation; order/request always visible at top; inline coach step with *Bỏ qua* instead of tutorial carousels; disabled primary action always states why; visible target zones; forgiving reset ("Đổ ly"); large tray cards with counts; short toasts.
- **Diverge:** no countdown pressure (players report exhaustion); the core verb is **free composition**, not recipe accuracy; local-first save (the original Tiệm Trà Nhỏ shut down and players lost progress); the shareable artifact is the bouquet itself, not a revenue screenshot.

## 4. Approach

**Chosen:** DOM layers with CSS transforms (D-004). Each flower head is an absolutely positioned element containing inline SVG art, transformed with `translate() rotate() scale()`. During drag the dragged element's transform is written directly through a ref; normalized state is committed on `pointerup`.

Rejected: a single SVG scene (simpler export, but transform-heavy SVG tends to jank on iOS Safari); Canvas/PixiJS (contradicts D-004, unjustified for ≤9 stems).

**State:** `useReducer` over a pure TypeScript reducer in `src/domain/bouquet`. No Zustand until Milestone 3 persistence; the same reducer moves into the store then.

## 5. Module layout

```text
src/domain/bouquet/        pure TS, no React/DOM imports
  types.ts                 PlacedStem, BouquetDraft, ArrangementStyle, StyleProfile
  random.ts                seeded PRNG (mulberry32) + string hash
  geometry.ts              region clamp, stem anchor, stemTransform(stem, planeSize)
  compose.ts               composeStem(draft, flower, profile) -> PlacedStem
  draft.ts                 reducer + actions (add/move/rotate/resize/reorder/remove/clear/setWrap/setStyle)
  history.ts               undo wrapper { present, past } capped by rules
src/content/
  flowers.ts               6 FlowerDefinition entries
  wraps.ts                 3 wrap MaterialDefinition entries + 1 basket
  bouquetRules.ts          all tunable numbers and both StyleProfiles
  designer.ts              all Vietnamese designer copy
src/features/bouquet/
  BouquetDesigner.tsx      screen: top bar, canvas, context row, tray, bottom bar
  BouquetCanvas.tsx        fixed-aspect composition plane, layers
  StemView.tsx             one head; memoized by stem identity
  StemLayer.tsx            SVG layer drawing stems from heads to anchor
  FlowerTray.tsx           horizontal tray of flower cards
  WrapPicker.tsx           3 swatches (Bó only)
  StemActions.tsx          rotate / size / layer / remove for the selected stem
  useStemDrag.ts           pointer capture, tap-vs-drag threshold, transient transform
src/components/art/        temporary SVG art: 6 flowers, 3 wraps (back+front), 1 basket (back+front)
src/app/App.tsx            screen state: 'shop' | 'designer'
```

Domain files must not import from `features`, `components` or React. Content files hold data only.

## 6. Data contracts

Extends docs/06_DATA_MODEL.md; update that document in the same PR.

```ts
type ArrangementStyle = 'bouquet' | 'basket';
type StemSize = 'small' | 'medium' | 'large';

interface PlacedStem {
  instanceId: Id;          // `${flowerId}#${seq}`, seq from draft.nextStemSeq
  flowerId: Id;
  x: number;               // head position, 0..1 of plane width
  y: number;               // head position, 0..1 of plane height
  rotationDeg: number;
  scale: number;           // derived from role base × size at write time
  size: StemSize;          // new: player-chosen size step
  zIndex: number;
  freshnessAtUse: 0 | 1 | 2 | 3; // M1 always 3 (no inventory yet)
}

interface BouquetDraft {
  arrangementStyle: ArrangementStyle; // new
  stems: PlacedStem[];
  nextStemSeq: number;                // new: keeps instanceIds unique and deterministic
  wrapId?: Id;                        // Bó only in M1
  ribbonId?: Id;                      // unused in M1
  cardId?: Id;                        // unused in M1
}
```

**Composition plane:** fixed aspect ratio **4:5** (width:height), centered in the available canvas space. Normalized coordinates map uniformly, so the layout never distorts across viewports.

### Style profile (data in `bouquetRules.ts`)

```ts
interface StyleProfile {
  style: ArrangementStyle;
  anchor:                       // where stems converge
    | { kind: 'point'; x: number; y: number }            // Bó: binding point
    | { kind: 'rim'; y: number; x0: number; x1: number }; // Lẵng: basket rim segment
  region: { cx: number; cy: number; rx: number; ry: number; yMax: number }; // allowed head area
  fanAngleDeg: number;          // max outward tilt at region edge
  slots: Record<FlowerRole, { x: number; y: number }[]>; // ordered preferred head positions
}
```

Initial values are the implementer's to tune visually; they must live only in `bouquetRules.ts`. Starting guidance: Bó is tall and narrow (region roughly `cx .5, cy .38, rx .36, ry .30`, binding point near `(.5, .86)`); Lẵng is wide and low (region roughly `cx .5, cy .45, rx .45, ry .22`, rim near `y .62` from `.2` to `.8`).

### Rules (`bouquetRules.ts`)

- `MAX_STEMS = 9`, `MIN_STEMS_TO_DELIVER = 3` (shown as progress only; delivery is M2).
- `ROTATE_STEP_DEG = 15`, rotation clamped to ±60°.
- Size multipliers: small 0.85, medium 1.0, large 1.15. Role base scale: focal 1.0, secondary 0.85, filler 0.75, foliage 1.1.
- `MIN_HEAD_DISTANCE` (normalized), `JITTER` (position ± and rotation ±), `UNDO_LIMIT = 30`, `DRAG_THRESHOLD_PX = 6`.
- Z bands: foliage 100, filler 200, secondary 300, focal 400; within a band, later stems sit higher.

## 7. Assisted placement (`composeStem`)

Deterministic: identical `(draft, flowerId, profile)` returns an identical stem.

1. `seed = hash(flowerId + ':' + draft.nextStemSeq + ':' + style)`; PRNG from seed.
2. Walk `profile.slots[role]` in order; choose the first slot whose distance to every existing head ≥ `MIN_HEAD_DISTANCE`. If none qualifies, choose the slot with the largest minimum distance.
3. Apply position jitter from the PRNG, then clamp into the region.
4. `rotationDeg = fanAngleDeg × (x − anchorX) / region.rx + rotation jitter`, clamped. For Lẵng, `anchorX` is the head's x clamped to the rim.
5. `size = 'medium'`; `scale = roleBase × sizeMultiplier`; `zIndex = band + count of stems in that band`.
6. `nextStemSeq` increments.

**Switching style** with stems present re-composes every stem in its original add order under the new profile (manual adjustments are discarded) and pushes one undo entry. The UI shows "Đã xếp lại theo dáng lẵng/bó".

**Move:** `moveStem(id, x, y)` clamps into the region; rotation is not recomputed (player-owned after placement).

**Reorder:** "Lên trước" and "Ra sau" swap `zIndex` with the nearest stem above/below, crossing role bands if the player asks.

## 8. Rendering and reconstruction

- `stemTransform(stem, planeWidth, planeHeight)` is pure and returns pixel translate/rotate/scale. The same draft renders proportionally at every plane size.
- `StemLayer` draws each stem as a soft quadratic path from the head to its anchor (Bó: the binding point; Lẵng: the rim point below the head). The front wrap/basket layer covers the lower stems.
- Layer order: wrap/basket back → stem paths → heads (by `zIndex`) → wrap/basket front (`pointer-events: none`). Region `yMax` keeps heads above the front layer.
- Reconstruction contract: `JSON.parse(JSON.stringify(draft))` renders identically to `draft`. This is the M1 exit criterion; storage itself is Milestone 3.

## 9. Screen and interaction

```text
┌───────────────────────────────┐
│ ←  Xếp hoa          [Bó|Lẵng] │
├───────────────────────────────┤
│   COMPOSITION PLANE (4:5)     │  ~52% of height; ghost region shown while dragging
├───────────────────────────────┤
│ ○ kem  ○ hồng phấn  ○ kraft   │  context row: wraps, or StemActions when a stem is selected
├───────────────────────────────┤
│ [flower cards …]  →           │  horizontal tray, "×2" used-count badge
├───────────────────────────────┤
│ ↶ Hoàn tác   5/9 cành  Làm lại│
└───────────────────────────────┘
```

- **Tap tray card:** add via `composeStem`; head pops in (scale .8 → 1, `--motion-micro`). At 9 stems cards are disabled and the row says "Bó đã đủ 9 cành — chọn một bông để xoá nếu muốn đổi."
- **Drag head:** pointer capture; movement under `DRAG_THRESHOLD_PX` counts as a tap. Lift feedback (shadow, 1.05 scale). Transform and that stem's path update via refs only; `moveStem` dispatches on `pointerup`. `pointercancel` restores the committed position.
- **Tap head:** select (visible ring, not color-only) and swap the context row to StemActions: ⟲ ⟳, − +, Lên trước, Ra sau, Xoá. Tap empty plane to deselect.
- **Hoàn tác:** undo up to 30 steps. **Làm lại:** clear all stems (undoable, so no confirm dialog).
- **Lẵng** hides the wrap picker (single basket). A new draft starts as Bó with the kem wrap; `wrapId` is kept across style switches so returning to Bó restores the chosen wrap.
- **Touch:** plane `touch-action: none`; tray `touch-action: pan-x`; `user-select: none` and `-webkit-touch-callout: none` on heads; no long-press or pinch required.
- **Accessibility:** each head is a button labelled "Tulip hồng, cành 3"; arrow keys move the selected stem by 0.02; every target ≥ 44px; focus visible.
- **Reduced motion:** no pop/lift/settle animation; state changes remain visible.
- **Performance:** `StemView` is memoized; dragging one stem must not re-render the others.
- Vietnamese copy lives in `src/content/designer.ts`. Colors, radii, shadows and motion use tokens from `src/styles/tokens.css` (ADR-002).

States: empty plane shows a soft hint "Chạm một bông hoa bên dưới để bắt đầu"; no loading or error states exist (static content).

## 10. Content (temporary)

| Flower (from docs/07 seed) | Role | Colors |
|---|---|---|
| Hồng đỏ | focal | red |
| Tulip hồng | focal | pink |
| Hướng dương | focal | yellow |
| Cúc họa mi | secondary | white, yellow |
| Baby's breath | filler | white |
| Eucalyptus | foliage | green |

Tags and prices follow docs/07 and are carried as data even though M1 does not score or price. Art is flat cozy SVG in the existing palette, explicitly temporary.

## 11. Testing

**Unit (Vitest, no DOM):**
- `composeStem` determinism: a fixed add sequence produces a byte-identical draft for both styles (fixture snapshot).
- Heads keep `MIN_HEAD_DISTANCE` while free slots exist; focal heads average closer to the region center than foliage.
- Clamp keeps heads inside the region and above `yMax`.
- `MAX_STEMS` enforced; rotate step and clamp; size multipliers; reorder crosses bands; remove; clear; undo limit; style switch re-composes and is undoable.
- JSON round-trip equality; `stemTransform` is proportional at two plane sizes.

**Component (Testing Library):** tray add, disabled at 9, select shows actions, remove, Bó/Lẵng switch hides wrap picker, keyboard move.

**E2E (Playwright, 390x844, touch, Chromium + WebKit projects):** shell → "Vào xếp hoa"; add 3 stems; drag one stem with touch-type pointer events and assert its position changed while `window.scrollY` and `visualViewport.scale` are unchanged; the tray still scrolls horizontally; no horizontal overflow at 360x800; reduced motion leaves no running animations. Keep the existing M0 shell tests green.

**Real devices (manual, recorded in a verification doc):** iPhone Safari and Android Chrome via `npm run preview -- --host 0.0.0.0` on the LAN. Check drag smoothness, no scroll/zoom fight, no long-press callout, readable at arm's length, both styles, all wraps.

**Performance:** Chrome Performance trace while dragging with 4× CPU throttling: no long task > 50 ms; React Profiler shows only the dragged stem re-rendering.

## 12. Ownership and sequence

1. **Codex — `feature/m1-bouquet-domain`:** types, random, geometry, compose, draft, history, content and rules files, unit tests, docs/06 update. After merge, the domain contract is frozen for the UI branch; changes need a handoff.
2. **Antigravity — `feature/m1-bouquet-ui`** (from `main` after step 1 merges): temporary art, designer screen, drag hook, component and E2E tests, WebKit project, real-device QA, M0 P2 fix (ShopScene window note covered by petals).
3. **Claude:** review both PRs against this spec; write D-007 "Kệ hoa làm sẵn" (status: proposed) in docs/12_DECISIONS.md; update docs/02 (arrangement styles) and docs/08 (M1 deliverables).

Each branch hands off with SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP.

## 13. Out of scope

Price/cost display, customers and orders, scoring, persistence, inventory/freshness, ribbon and card, basket picker, pinch/two-finger gestures, routing library, Motion/Zustand, the pre-made shelf feature itself, analytics.

## 14. Exit criteria (from docs/08 plus this spec)

- Interaction works with touch and pointer on Chromium and WebKit, and on both real devices.
- No page-scroll or zoom conflict inside the plane.
- A draft reconstructs identically from its JSON at any plane size.
- Drag remains responsive on the target phones; performance check recorded.
- lint, typecheck, format:check, unit, component and E2E suites pass locally and in CI.
