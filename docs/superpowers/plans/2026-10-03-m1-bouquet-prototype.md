# Milestone 1 — Bouquet Interaction Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the touch-first Bouquet Designer prototype (Bó and Lẵng, assisted placement, drag, select/rotate/resize/reorder/remove, undo, three wraps) so the team can judge on real phones whether arranging flowers feels good.

**Architecture:** A pure TypeScript domain (`src/domain/bouquet`) owns placement, the draft reducer and undo; content files own every number and every Vietnamese string; React renders DOM heads positioned by percentage over SVG stem/wrap layers and moves the dragged head with the CSS `translate` property, committing to the reducer only on release. `App` switches between the shop shell and the designer with local state.

**Tech Stack:** React 19, strict TypeScript 6, Vite 8, Vitest 5 + Testing Library, Playwright 1.63 (Chromium + WebKit), plain CSS with tokens. No new dependencies.

**Spec:** [docs/superpowers/specs/2026-10-03-m1-bouquet-prototype-design.md](../specs/2026-10-03-m1-bouquet-prototype-design.md)

**Provenance:** Every code block below was run in a scratch copy of `main` at `5e994f1` before this plan was written: 57 unit/component tests, 11 Chromium E2E tests, ESLint, `tsc --noEmit` and Prettier all passed. WebKit could not run on the planning machine (missing `libevent`/`libavif`; needs `sudo npx playwright install-deps webkit`). A mutation check confirmed the drag E2E fails when `touch-action: none` is removed.

## Global Constraints

- Node `^22.13.0 || ^24.0.0`; npm with the committed lockfile; **add no dependencies**.
- TypeScript flags stay as configured, including `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- `src/domain/**` imports nothing from React, `features`, `components` or the DOM.
- All tunable numbers live in `src/content/bouquetRules.ts`; all designer copy lives in `src/content/designer.ts`.
- Colors, radii, shadows and motion use tokens from `src/styles/tokens.css` (ADR-002). New art colors are added there as tokens.
- Every interactive target is at least 44×44 CSS px; nothing depends on hover or long-press.
- No router, Motion, Zustand, persistence, price, scoring, ribbon/card or basket picker.
- `npm run format:check`, `npm run lint` (zero warnings), `npm run typecheck`, `npm test`, `npm run test:e2e` must pass before each handoff.
- Commits use Conventional Commit style and end with the attribution line the executing agent's harness requires.

## Review Focus

1. **Rapid repeated taps on a tray card past the limit** — exactly 9 stems, every card disabled, the reason shown, no double-tap zoom. Pinned by Task 5 (`stops at nine stems no matter how many taps arrive`), Task 10 (`stops at nine stems even under rapid taps and says why`) and Task 12 (`tray scrolls sideways and stops adding at nine stems`).
2. **A touch drag ends without any click event** — the very next tap on a stem must still select it. Pinned by Task 10 (`selects on the next tap after a touch drag that fired no click`); this bug was found while validating the plan.
3. **A second finger lands during a drag** — ignored; the first finger keeps control. Pinned by Task 10 (`ignores a second finger while the first one drags`).
4. **Removing or undoing while a stem is selected** — selection ends and a restored stem comes back unselected; the wrap row returns. Pinned by Task 10 (`brings a removed stem back with undo, unselected`); this bug was found while validating the plan.
5. **Viewport size changes after composing (rotation, browser chrome)** — heads stay at the same relative plane position. Pinned by Task 12 (`keeps stem positions proportional when the viewport changes`). Also: switching style and undoing restores manual adjustments exactly — Task 6 (`restores manual adjustments after a style switch`).

## Ownership

| Part | Owner | Branch | Tasks |
|---|---|---|---|
| A — Domain and content | Codex | `feature/m1-bouquet-domain` | 1–7 |
| B — Designer UI | Antigravity | `feature/m1-bouquet-ui` (from `main` after Part A merges) | 8–13 |
| C — Docs and review | Claude | `chore/m1-bouquet-spec` and PR reviews | 14 |

After Part A merges, its exported names and types are frozen for Part B. A change needs a handoff to the other owner.

## File Map

```text
src/domain/catalog.ts                      shared content types (Id, FlowerDefinition, MaterialDefinition…)
src/domain/bouquet/types.ts                draft, stem, profile, rules and context types
src/domain/bouquet/random.ts               FNV-1a hash, mulberry32 PRNG, jitter
src/domain/bouquet/geometry.ts             rounding, region clamp, anchors, stem paths, plane pixel mapping
src/domain/bouquet/compose.ts              deterministic assisted placement
src/domain/bouquet/draft.ts                pure draft reducer and selectors
src/domain/bouquet/history.ts              undo wrapper
src/content/flowers.ts                     6 prototype flowers
src/content/wraps.ts                       3 wraps + default
src/content/bouquetRules.ts                rules, Bó and Lẵng profiles, bouquetContext
src/content/designer.ts                    Vietnamese designer copy
src/components/art/FlowerArt.tsx           temporary flower heads
src/components/art/ContainerArt.tsx        temporary wraps and basket (back/front)
src/features/bouquet/useStemDrag.ts        pointer drag hook
src/features/bouquet/StemView.tsx          one memoized head
src/features/bouquet/StemLayer.tsx         SVG stems
src/features/bouquet/BouquetCanvas.tsx     composition plane
src/features/bouquet/FlowerTray.tsx        tray
src/features/bouquet/WrapPicker.tsx        wrap swatches
src/features/bouquet/StemActions.tsx       selected-stem toolbar
src/features/bouquet/BouquetDesigner.tsx   screen + reducer wiring
src/styles/designer.css                    designer styles and art classes
Modified: src/app/App.tsx, src/app/App.test.tsx, src/content/shell.ts, src/components/ShopScene.tsx,
          src/styles/global.css, src/styles/tokens.css, e2e/shell.spec.ts, playwright.config.ts,
          .github/workflows/ci.yml, docs/06_DATA_MODEL.md, docs/02_GAME_DESIGN.md, docs/08_IMPLEMENTATION_PLAN.md,
          docs/09_TASK_BACKLOG.md, docs/12_DECISIONS.md
New tests: src/domain/bouquet/{random,geometry,compose,draft,history}.test.ts, src/content/bouquetRules.test.ts,
           src/features/bouquet/BouquetDesigner.test.tsx, e2e/designer.spec.ts
```

---

# Part A — Domain and content (Codex)

Setup once:

```bash
git switch main && git pull --ff-only
git switch -c feature/m1-bouquet-domain
npm ci
```

### Task 1: Shared types and seeded randomness

**Files:**
- Create: `src/domain/catalog.ts`, `src/domain/bouquet/types.ts`, `src/domain/bouquet/random.ts`
- Test: `src/domain/bouquet/random.test.ts`

**Interfaces:**
- Produces: `Id`, `ColorFamily`, `FlowerRole`, `MoodTag`, `FlowerDefinition`, `MaterialDefinition` (catalog); `ArrangementStyle`, `StemSize`, `Freshness`, `Point`, `PlacedStem`, `BouquetDraft`, `Region`, `StemAnchor`, `StyleProfile`, `BouquetRules`, `BouquetContext` (types); `hashString(value: string): number`, `mulberry32(seed: number): () => number`, `jitter(random: () => number, amplitude: number): number`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { hashString, jitter, mulberry32 } from './random';

describe('seeded randomness', () => {
  it('hashes strings to stable unsigned 32-bit values', () => {
    expect(hashString('pink-tulip#1:bouquet')).toBe(
      hashString('pink-tulip#1:bouquet'),
    );
    expect(hashString('a')).not.toBe(hashString('b'));
    expect(hashString('')).toBe(0x811c9dc5);
  });

  it('replays the same sequence for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    for (const value of first) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('keeps jitter inside its amplitude', () => {
    const random = mulberry32(7);
    for (let index = 0; index < 200; index += 1) {
      expect(Math.abs(jitter(random, 0.02))).toBeLessThanOrEqual(0.02);
    }
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/domain/bouquet/random.test.ts`
Expected: FAIL — cannot resolve `./random`.

- [ ] **Step 3: Add the catalog types** (moved from the conceptual contract in docs/06)

```ts
export type Id = string;

export type ColorFamily =
  | 'pink'
  | 'red'
  | 'white'
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'orange'
  | 'green'
  | 'cream';

export type FlowerRole = 'focal' | 'secondary' | 'filler' | 'foliage';

export type MoodTag =
  | 'romantic'
  | 'gentle'
  | 'cheerful'
  | 'elegant'
  | 'warm'
  | 'fresh'
  | 'grateful'
  | 'supportive'
  | 'playful';

export interface FlowerDefinition {
  id: Id;
  nameVi: string;
  basePrice: number;
  colors: ColorFamily[];
  tags: MoodTag[];
  role: FlowerRole;
  assetId: Id;
  unlockReputation?: number;
}

export interface MaterialDefinition {
  id: Id;
  type: 'wrap' | 'ribbon' | 'card';
  nameVi: string;
  price: number;
  colors: ColorFamily[];
  tagModifiers?: Partial<Record<MoodTag, number>>;
  assetId: Id;
}
```

- [ ] **Step 4: Add the bouquet types**

```ts
import type { FlowerDefinition, FlowerRole, Id } from '../catalog';

export type ArrangementStyle = 'bouquet' | 'basket';
export type StemSize = 'small' | 'medium' | 'large';
export type Freshness = 0 | 1 | 2 | 3;

export interface Point {
  x: number;
  y: number;
}

export interface PlacedStem {
  instanceId: Id;
  flowerId: Id;
  x: number;
  y: number;
  rotationDeg: number;
  scale: number;
  size: StemSize;
  zIndex: number;
  freshnessAtUse: Freshness;
}

export interface BouquetDraft {
  arrangementStyle: ArrangementStyle;
  stems: PlacedStem[];
  nextStemSeq: number;
  wrapId?: Id;
  ribbonId?: Id;
  cardId?: Id;
}

/** Allowed head area: an ellipse in plane units, cut off below yMax. */
export interface Region {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  yMax: number;
}

export type StemAnchor =
  | { kind: 'point'; x: number; y: number }
  | { kind: 'rim'; y: number; x0: number; x1: number };

export interface StyleProfile {
  style: ArrangementStyle;
  anchor: StemAnchor;
  region: Region;
  fanAngleDeg: number;
  slots: Record<FlowerRole, readonly Point[]>;
}

export interface BouquetRules {
  maxStems: number;
  minStemsToDeliver: number;
  rotateStepDeg: number;
  maxRotationDeg: number;
  sizeMultiplier: Record<StemSize, number>;
  roleBaseScale: Record<FlowerRole, number>;
  zBand: Record<FlowerRole, number>;
  minHeadDistance: number;
  positionJitter: number;
  rotationJitterDeg: number;
  /** Plane width divided by height (4:5). */
  planeAspect: number;
  undoLimit: number;
  dragThresholdPx: number;
  keyboardStep: number;
  freshnessAtUse: Freshness;
}

export interface BouquetContext {
  rules: BouquetRules;
  profiles: Record<ArrangementStyle, StyleProfile>;
  flowers: Readonly<Record<Id, FlowerDefinition>>;
}
```

- [ ] **Step 5: Implement the PRNG**

```ts
/** FNV-1a 32-bit hash; stable across engines. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Seeded PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Symmetric offset in [-amplitude, amplitude). */
export function jitter(random: () => number, amplitude: number): number {
  return (random() * 2 - 1) * amplitude;
}
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/domain/bouquet/random.test.ts && npm run typecheck`
Expected: 3 tests PASS; typecheck clean.

- [ ] **Step 7: Commit**

```bash
git add src/domain
git commit -m "feat(m1): bouquet domain types and seeded randomness"
```

### Task 2: Plane geometry

**Files:**
- Create: `src/domain/bouquet/geometry.ts`
- Test: `src/domain/bouquet/geometry.test.ts`

**Interfaces:**
- Consumes: `Point`, `Region`, `StemAnchor` (Task 1).
- Produces: `PLANE_VIEWBOX` (`{ width: 100, height: 125 }`), `roundTo(value, digits = 4)`, `clamp(value, min, max)`, `clampToRegion(point, region): Point`, `anchorFor(head, anchor): Point`, `headDistance(a, b, planeAspect): number`, `stemPathD(head, anchor): string`, `toPlanePixels(point, width, height)`, `fromPlanePixels(pixels, width, height)`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import {
  anchorFor,
  clampToRegion,
  fromPlanePixels,
  headDistance,
  roundTo,
  stemPathD,
  toPlanePixels,
} from './geometry';
import type { Region } from './types';

const region: Region = { cx: 0.5, cy: 0.4, rx: 0.3, ry: 0.2, yMax: 0.5 };

describe('plane geometry', () => {
  it('rounds to 4 digits and never returns negative zero', () => {
    expect(roundTo(0.123456)).toBe(0.1235);
    expect(Object.is(roundTo(-0.00001), 0)).toBe(true);
  });

  it('leaves points inside the region untouched', () => {
    expect(clampToRegion({ x: 0.55, y: 0.38 }, region)).toEqual({
      x: 0.55,
      y: 0.38,
    });
  });

  it('pulls outside points back onto the ellipse edge', () => {
    const point = clampToRegion({ x: 2, y: 0.4 }, region);
    expect(point).toEqual({ x: 0.8, y: 0.4 });
  });

  it('never lets a head sink below yMax', () => {
    expect(clampToRegion({ x: 0.5, y: 0.59 }, region).y).toBe(0.5);
  });

  it('anchors bouquet stems to one point and basket stems to the rim', () => {
    expect(
      anchorFor({ x: 0.1, y: 0.3 }, { kind: 'point', x: 0.5, y: 0.9 }),
    ).toEqual({ x: 0.5, y: 0.9 });
    expect(
      anchorFor({ x: 0.1, y: 0.3 }, { kind: 'rim', y: 0.6, x0: 0.2, x1: 0.8 }),
    ).toEqual({ x: 0.2, y: 0.6 });
    expect(
      anchorFor({ x: 0.5, y: 0.3 }, { kind: 'rim', y: 0.6, x0: 0.2, x1: 0.8 }),
    ).toEqual({ x: 0.5, y: 0.6 });
  });

  it('measures vertical distance in width units on the 4:5 plane', () => {
    expect(headDistance({ x: 0, y: 0 }, { x: 0, y: 0.08 }, 0.8)).toBeCloseTo(
      0.1,
    );
  });

  it('draws stems in the 100x125 viewBox', () => {
    expect(stemPathD({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 })).toBe(
      'M50 25Q50 66.25 50 100',
    );
  });

  it('maps the same normalized point proportionally at any plane size', () => {
    const point = { x: 0.25, y: 0.6 };
    expect(toPlanePixels(point, 320, 400)).toEqual({ x: 80, y: 240 });
    expect(toPlanePixels(point, 400, 500)).toEqual({ x: 100, y: 300 });
    expect(fromPlanePixels({ x: 100, y: 300 }, 400, 500)).toEqual(point);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/domain/bouquet/geometry.test.ts`
Expected: FAIL — cannot resolve `./geometry`.

- [ ] **Step 3: Implement**

```ts
import type { Point, Region, StemAnchor } from './types';

/** SVG viewBox matching the 4:5 composition plane. */
export const PLANE_VIEWBOX = { width: 100, height: 125 } as const;

export function roundTo(value: number, digits = 4): number {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  // Normalize -0 so JSON round-trips compare equal.
  return rounded === 0 ? 0 : rounded;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampToRegion(point: Point, region: Region): Point {
  const dx = (point.x - region.cx) / region.rx;
  const dy = (point.y - region.cy) / region.ry;
  const distance = Math.hypot(dx, dy);
  let { x, y } = point;
  if (distance > 1) {
    x = region.cx + (dx / distance) * region.rx;
    y = region.cy + (dy / distance) * region.ry;
  }
  return { x: roundTo(x), y: roundTo(Math.min(y, region.yMax)) };
}

export function anchorFor(head: Point, anchor: StemAnchor): Point {
  return anchor.kind === 'point'
    ? { x: anchor.x, y: anchor.y }
    : { x: clamp(head.x, anchor.x0, anchor.x1), y: anchor.y };
}

/** Distance in plane-width units, correcting for the taller plane. */
export function headDistance(a: Point, b: Point, planeAspect: number): number {
  return Math.hypot(a.x - b.x, (a.y - b.y) / planeAspect);
}

/** Quadratic stem path in PLANE_VIEWBOX units, from head to anchor. */
export function stemPathD(head: Point, anchor: Point): string {
  const { width, height } = PLANE_VIEWBOX;
  const controlX = anchor.x + (head.x - anchor.x) * 0.2;
  const controlY = head.y + (anchor.y - head.y) * 0.55;
  const f = (value: number) => roundTo(value, 2);
  return `M${f(head.x * width)} ${f(head.y * height)}Q${f(controlX * width)} ${f(controlY * height)} ${f(anchor.x * width)} ${f(anchor.y * height)}`;
}

export function toPlanePixels(
  point: Point,
  width: number,
  height: number,
): Point {
  return { x: point.x * width, y: point.y * height };
}

export function fromPlanePixels(
  pixels: Point,
  width: number,
  height: number,
): Point {
  return { x: pixels.x / width, y: pixels.y / height };
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run src/domain/bouquet/geometry.test.ts`
Expected: 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/bouquet/geometry.ts src/domain/bouquet/geometry.test.ts
git commit -m "feat(m1): composition plane geometry"
```

### Task 3: Prototype content and style profiles

**Files:**
- Create: `src/content/flowers.ts`, `src/content/wraps.ts`, `src/content/bouquetRules.ts`
- Test: `src/content/bouquetRules.test.ts`

**Interfaces:**
- Consumes: catalog and bouquet types (Task 1).
- Produces: `flowers: readonly FlowerDefinition[]`, `flowersById`, `wraps: readonly MaterialDefinition[]`, `defaultWrapId = 'wrap-cream'`, `bouquetRules: BouquetRules`, `bouquetContext: BouquetContext`. Flower ids: `red-rose`, `pink-tulip`, `sunflower`, `daisy`, `babys-breath`, `eucalyptus`. Wrap ids: `wrap-cream`, `wrap-blush`, `wrap-kraft`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import type { FlowerRole } from '../domain/catalog';
import { bouquetContext, bouquetRules } from './bouquetRules';
import { flowers } from './flowers';
import { defaultWrapId, wraps } from './wraps';

const roles: FlowerRole[] = ['focal', 'secondary', 'filler', 'foliage'];

describe('bouquet content', () => {
  it('has unique flower ids covering every role', () => {
    expect(new Set(flowers.map((f) => f.id)).size).toBe(flowers.length);
    for (const role of roles) {
      expect(flowers.some((f) => f.role === role)).toBe(true);
    }
  });

  it('offers three wraps including the default', () => {
    expect(wraps).toHaveLength(3);
    expect(wraps.some((wrap) => wrap.id === defaultWrapId)).toBe(true);
  });

  it.each(['bouquet', 'basket'] as const)(
    'defines enough in-region slots per role for %s',
    (style) => {
      const { region, slots } = bouquetContext.profiles[style];
      for (const role of roles) {
        expect(slots[role].length).toBeGreaterThanOrEqual(
          bouquetRules.maxStems,
        );
        for (const slot of slots[role]) {
          const dx = (slot.x - region.cx) / region.rx;
          const dy = (slot.y - region.cy) / region.ry;
          expect(Math.hypot(dx, dy)).toBeLessThanOrEqual(1);
          expect(slot.y).toBeLessThanOrEqual(region.yMax);
        }
      }
    },
  );
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/content/bouquetRules.test.ts`
Expected: FAIL — cannot resolve `./bouquetRules`.

- [ ] **Step 3: Add the flowers** (tags from docs/07; prices are provisional balance values)

```ts
import type { FlowerDefinition, Id } from '../domain/catalog';

/** Milestone 1 prototype set. Prices are provisional balance values. */
export const flowers: readonly FlowerDefinition[] = [
  {
    id: 'red-rose',
    nameVi: 'Hồng đỏ',
    basePrice: 30000,
    colors: ['red'],
    tags: ['romantic', 'warm'],
    role: 'focal',
    assetId: 'flower-red-rose',
  },
  {
    id: 'pink-tulip',
    nameVi: 'Tulip hồng',
    basePrice: 28000,
    colors: ['pink'],
    tags: ['gentle', 'romantic'],
    role: 'focal',
    assetId: 'flower-pink-tulip',
  },
  {
    id: 'sunflower',
    nameVi: 'Hướng dương',
    basePrice: 35000,
    colors: ['yellow'],
    tags: ['cheerful', 'supportive', 'warm'],
    role: 'focal',
    assetId: 'flower-sunflower',
  },
  {
    id: 'daisy',
    nameVi: 'Cúc họa mi',
    basePrice: 15000,
    colors: ['white', 'yellow'],
    tags: ['fresh', 'gentle', 'cheerful'],
    role: 'secondary',
    assetId: 'flower-daisy',
  },
  {
    id: 'babys-breath',
    nameVi: "Baby's breath",
    basePrice: 12000,
    colors: ['white'],
    tags: ['gentle', 'fresh'],
    role: 'filler',
    assetId: 'flower-babys-breath',
  },
  {
    id: 'eucalyptus',
    nameVi: 'Eucalyptus',
    basePrice: 10000,
    colors: ['green'],
    tags: ['fresh', 'elegant'],
    role: 'foliage',
    assetId: 'flower-eucalyptus',
  },
];

export const flowersById: Readonly<Record<Id, FlowerDefinition>> =
  Object.fromEntries(flowers.map((flower) => [flower.id, flower]));
```

- [ ] **Step 4: Add the wraps**

```ts
import type { MaterialDefinition } from '../domain/catalog';

/** Bó wraps for Milestone 1. Lẵng uses a single basket drawn as style art. */
export const wraps: readonly MaterialDefinition[] = [
  {
    id: 'wrap-cream',
    type: 'wrap',
    nameVi: 'Giấy kem',
    price: 15000,
    colors: ['cream'],
    assetId: 'wrap-cream',
  },
  {
    id: 'wrap-blush',
    type: 'wrap',
    nameVi: 'Giấy hồng phấn',
    price: 15000,
    colors: ['pink'],
    assetId: 'wrap-blush',
  },
  {
    id: 'wrap-kraft',
    type: 'wrap',
    nameVi: 'Giấy kraft',
    price: 12000,
    colors: ['cream'],
    assetId: 'wrap-kraft',
  },
];

export const defaultWrapId = 'wrap-cream';
```

- [ ] **Step 5: Add rules and both profiles.** Every slot must stay inside its region; the test enforces it. Tune visually later only in this file.

```ts
import type {
  BouquetContext,
  BouquetRules,
  StyleProfile,
} from '../domain/bouquet/types';
import { flowersById } from './flowers';

/** Every tunable Bouquet Designer number lives here. */
export const bouquetRules: BouquetRules = {
  maxStems: 9,
  minStemsToDeliver: 3,
  rotateStepDeg: 15,
  maxRotationDeg: 60,
  sizeMultiplier: { small: 0.85, medium: 1, large: 1.15 },
  roleBaseScale: { focal: 1, secondary: 0.85, filler: 0.75, foliage: 1.1 },
  zBand: { foliage: 100, filler: 200, secondary: 300, focal: 400 },
  minHeadDistance: 0.1,
  positionJitter: 0.015,
  rotationJitterDeg: 4,
  planeAspect: 0.8,
  undoLimit: 30,
  dragThresholdPx: 6,
  keyboardStep: 0.02,
  freshnessAtUse: 3,
};

/** Hand-tied bouquet: tall fan, stems meet at one binding point. */
const bouquetProfile: StyleProfile = {
  style: 'bouquet',
  anchor: { kind: 'point', x: 0.5, y: 0.86 },
  region: { cx: 0.5, cy: 0.38, rx: 0.36, ry: 0.3, yMax: 0.62 },
  fanAngleDeg: 28,
  slots: {
    focal: [
      { x: 0.5, y: 0.3 },
      { x: 0.38, y: 0.36 },
      { x: 0.62, y: 0.36 },
      { x: 0.5, y: 0.44 },
      { x: 0.44, y: 0.22 },
      { x: 0.56, y: 0.22 },
      { x: 0.3, y: 0.46 },
      { x: 0.7, y: 0.46 },
      { x: 0.5, y: 0.16 },
    ],
    secondary: [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.4, y: 0.48 },
      { x: 0.6, y: 0.48 },
      { x: 0.22, y: 0.4 },
      { x: 0.78, y: 0.4 },
      { x: 0.5, y: 0.54 },
      { x: 0.35, y: 0.18 },
      { x: 0.65, y: 0.18 },
    ],
    filler: [
      { x: 0.2, y: 0.26 },
      { x: 0.8, y: 0.26 },
      { x: 0.28, y: 0.16 },
      { x: 0.72, y: 0.16 },
      { x: 0.16, y: 0.38 },
      { x: 0.84, y: 0.38 },
      { x: 0.5, y: 0.1 },
      { x: 0.26, y: 0.52 },
      { x: 0.74, y: 0.52 },
    ],
    foliage: [
      { x: 0.18, y: 0.5 },
      { x: 0.82, y: 0.5 },
      { x: 0.15, y: 0.34 },
      { x: 0.85, y: 0.34 },
      { x: 0.26, y: 0.58 },
      { x: 0.74, y: 0.58 },
      { x: 0.22, y: 0.2 },
      { x: 0.78, y: 0.2 },
      { x: 0.5, y: 0.6 },
    ],
  },
};

/** Basket: wide, low dome, stems stand in the basket rim. */
const basketProfile: StyleProfile = {
  style: 'basket',
  anchor: { kind: 'rim', y: 0.62, x0: 0.22, x1: 0.78 },
  region: { cx: 0.5, cy: 0.44, rx: 0.46, ry: 0.22, yMax: 0.6 },
  fanAngleDeg: 40,
  slots: {
    focal: [
      { x: 0.5, y: 0.36 },
      { x: 0.38, y: 0.4 },
      { x: 0.62, y: 0.4 },
      { x: 0.5, y: 0.28 },
      { x: 0.28, y: 0.44 },
      { x: 0.72, y: 0.44 },
      { x: 0.44, y: 0.48 },
      { x: 0.56, y: 0.48 },
      { x: 0.5, y: 0.44 },
    ],
    secondary: [
      { x: 0.3, y: 0.34 },
      { x: 0.7, y: 0.34 },
      { x: 0.4, y: 0.3 },
      { x: 0.6, y: 0.3 },
      { x: 0.18, y: 0.46 },
      { x: 0.82, y: 0.46 },
      { x: 0.36, y: 0.52 },
      { x: 0.64, y: 0.52 },
      { x: 0.5, y: 0.54 },
    ],
    filler: [
      { x: 0.2, y: 0.36 },
      { x: 0.8, y: 0.36 },
      { x: 0.3, y: 0.26 },
      { x: 0.7, y: 0.26 },
      { x: 0.1, y: 0.44 },
      { x: 0.9, y: 0.44 },
      { x: 0.5, y: 0.24 },
      { x: 0.24, y: 0.54 },
      { x: 0.76, y: 0.54 },
    ],
    foliage: [
      { x: 0.1, y: 0.52 },
      { x: 0.9, y: 0.52 },
      { x: 0.16, y: 0.4 },
      { x: 0.84, y: 0.4 },
      { x: 0.26, y: 0.58 },
      { x: 0.74, y: 0.58 },
      { x: 0.06, y: 0.46 },
      { x: 0.94, y: 0.46 },
      { x: 0.5, y: 0.58 },
    ],
  },
};

export const bouquetContext: BouquetContext = {
  rules: bouquetRules,
  profiles: { bouquet: bouquetProfile, basket: basketProfile },
  flowers: flowersById,
};
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/content && npm run typecheck`
Expected: 4 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/flowers.ts src/content/wraps.ts src/content/bouquetRules.ts src/content/bouquetRules.test.ts
git commit -m "feat(m1): prototype flowers, wraps and arrangement profiles"
```

### Task 4: Deterministic assisted placement

**Files:**
- Create: `src/domain/bouquet/compose.ts`
- Test: `src/domain/bouquet/compose.test.ts` (+ generated `__snapshots__/compose.test.ts.snap`)

**Interfaces:**
- Consumes: geometry (Task 2), random (Task 1), `bouquetContext` (Task 3, tests only). The test also imports `applyDraftAction` and `createEmptyDraft` from Task 5, so write Task 5's `draft.ts` before running this test, or run Tasks 4 and 5 test steps together.
- Produces: `stemScale(role, size, rules): number`, `nextZIndex(stems, band): number`, `composeStem(stems, flowerId, instanceId, style, ctx): PlacedStem | null`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import { composeStem, nextZIndex } from './compose';
import { applyDraftAction, createEmptyDraft } from './draft';
import { headDistance } from './geometry';
import type { ArrangementStyle, BouquetDraft, PlacedStem } from './types';

const ctx = bouquetContext;
const sequence = [
  'red-rose',
  'pink-tulip',
  'sunflower',
  'daisy',
  'daisy',
  'babys-breath',
  'babys-breath',
  'eucalyptus',
  'eucalyptus',
];

function build(style: ArrangementStyle, flowerIds = sequence): BouquetDraft {
  let draft = applyDraftAction(
    createEmptyDraft('wrap-cream'),
    { type: 'setStyle', style },
    ctx,
  );
  for (const flowerId of flowerIds) {
    draft = applyDraftAction(draft, { type: 'add', flowerId }, ctx);
  }
  return draft;
}

function insideRegion(stem: PlacedStem, style: ArrangementStyle): boolean {
  const { region } = ctx.profiles[style];
  const dx = (stem.x - region.cx) / region.rx;
  const dy = (stem.y - region.cy) / region.ry;
  return Math.hypot(dx, dy) <= 1.0001 && stem.y <= region.yMax;
}

describe.each<ArrangementStyle>(['bouquet', 'basket'])(
  'assisted placement (%s)',
  (style) => {
    it('produces an identical draft for the same add sequence', () => {
      expect(build(style)).toEqual(build(style));
      expect(build(style)).toMatchSnapshot();
    });

    it('keeps every head inside the style region', () => {
      for (const stem of build(style).stems) {
        expect(insideRegion(stem, style)).toBe(true);
      }
    });

    it('keeps heads apart while free slots exist', () => {
      const { stems } = build(style);
      for (const [index, a] of stems.entries()) {
        for (const b of stems.slice(index + 1)) {
          expect(
            headDistance(a, b, ctx.rules.planeAspect),
          ).toBeGreaterThanOrEqual(ctx.rules.minHeadDistance);
        }
      }
    });

    it('places focal flowers closer to the center than foliage', () => {
      const { region } = ctx.profiles[style];
      const { stems } = build(style);
      const meanDistance = (role: string) => {
        const group = stems.filter(
          (stem) => ctx.flowers[stem.flowerId]?.role === role,
        );
        return (
          group.reduce(
            (sum, stem) =>
              sum +
              headDistance(
                stem,
                { x: region.cx, y: region.cy },
                ctx.rules.planeAspect,
              ),
            0,
          ) / group.length
        );
      };
      expect(meanDistance('focal')).toBeLessThan(meanDistance('foliage'));
    });
  },
);

describe('composeStem details', () => {
  it('returns null for an unknown flower', () => {
    expect(composeStem([], 'no-such-flower', 'x#1', 'bouquet', ctx)).toBeNull();
  });

  it('tilts heads outward from the center', () => {
    const { stems } = build('bouquet', ['eucalyptus', 'eucalyptus']);
    const [left, right] = [...stems].sort((a, b) => a.x - b.x);
    expect(left?.rotationDeg).toBeLessThan(0);
    expect(right?.rotationDeg).toBeGreaterThan(0);
  });

  it('stacks z-index by role band, later stems on top', () => {
    const { stems } = build('bouquet', [
      'pink-tulip',
      'eucalyptus',
      'red-rose',
    ]);
    expect(stems.map((stem) => stem.zIndex)).toEqual([400, 100, 401]);
    expect(nextZIndex(stems, 100)).toBe(101);
  });

  it('starts every new stem at medium size with role scale', () => {
    const [stem] = build('bouquet', ['daisy']).stems;
    expect(stem?.size).toBe('medium');
    expect(stem?.scale).toBe(0.85);
    expect(stem?.freshnessAtUse).toBe(3);
  });
});
```

- [ ] **Step 2: Implement placement**

```ts
import type { FlowerRole, Id } from '../catalog';
import { clamp, clampToRegion, headDistance, roundTo } from './geometry';
import { hashString, jitter, mulberry32 } from './random';
import type {
  ArrangementStyle,
  BouquetContext,
  BouquetRules,
  PlacedStem,
  Point,
  StemSize,
} from './types';

export function stemScale(
  role: FlowerRole,
  size: StemSize,
  rules: BouquetRules,
): number {
  return roundTo(rules.roleBaseScale[role] * rules.sizeMultiplier[size]);
}

/** Next free z-index inside a role band of width 100. */
export function nextZIndex(stems: readonly PlacedStem[], band: number): number {
  const inBand = stems
    .map((stem) => stem.zIndex)
    .filter((z) => z >= band && z < band + 100);
  return inBand.length === 0 ? band : Math.max(...inBand) + 1;
}

/**
 * Deterministic assisted placement. The same stems, flower, instanceId and
 * style always produce the same stem. Returns null for an unknown flower.
 */
export function composeStem(
  stems: readonly PlacedStem[],
  flowerId: Id,
  instanceId: Id,
  style: ArrangementStyle,
  ctx: BouquetContext,
): PlacedStem | null {
  const flower = ctx.flowers[flowerId];
  if (!flower) return null;
  const { rules } = ctx;
  const profile = ctx.profiles[style];
  const random = mulberry32(hashString(`${instanceId}:${style}`));

  // Jitter every candidate up front so the chosen head is the one measured.
  const candidates = profile.slots[flower.role].map((slot) =>
    clampToRegion(
      {
        x: slot.x + jitter(random, rules.positionJitter),
        y: slot.y + jitter(random, rules.positionJitter),
      },
      profile.region,
    ),
  );

  let head: Point = { x: profile.region.cx, y: profile.region.cy };
  let bestDistance = -1;
  for (const candidate of candidates) {
    const nearest = stems.reduce(
      (min, stem) =>
        Math.min(min, headDistance(candidate, stem, rules.planeAspect)),
      Infinity,
    );
    if (nearest >= rules.minHeadDistance) {
      head = candidate;
      break;
    }
    if (nearest > bestDistance) {
      head = candidate;
      bestDistance = nearest;
    }
  }

  const tilt =
    (profile.fanAngleDeg * (head.x - profile.region.cx)) / profile.region.rx +
    jitter(random, rules.rotationJitterDeg);
  const size: StemSize = 'medium';

  return {
    instanceId,
    flowerId,
    x: head.x,
    y: head.y,
    rotationDeg: roundTo(
      clamp(tilt, -rules.maxRotationDeg, rules.maxRotationDeg),
      2,
    ),
    scale: stemScale(flower.role, size, rules),
    size,
    zIndex: nextZIndex(stems, rules.zBand[flower.role]),
    freshnessAtUse: rules.freshnessAtUse,
  };
}
```

- [ ] **Step 3: Continue with Task 5 Steps 1–3, then run both**

Run: `npx vitest run src/domain/bouquet/compose.test.ts`
Expected: 12 tests PASS; `2 snapshots written` on the first run. Commit the snapshot file. If a later tuning of `bouquetRules.ts` changes placement on purpose, review the visual result first, then update with `npx vitest run -u` and say so in the handoff.

### Task 5: Draft reducer

**Files:**
- Create: `src/domain/bouquet/draft.ts`
- Test: `src/domain/bouquet/draft.test.ts`

**Interfaces:**
- Consumes: `composeStem`, `stemScale` (Task 4); geometry (Task 2).
- Produces: `type DraftAction` (`add | move | rotate | resize | reorder | remove | clear | setWrap | setStyle`), `createEmptyDraft(wrapId): BouquetDraft`, `canAddStem(draft, rules)`, `usedCount(draft, flowerId)`, `renderOrder(stems)`, `reorderNeighbor(stems, instanceId, direction)`, `canResize(stem, direction)`, `applyDraftAction(draft, action, ctx): BouquetDraft` (returns the **same reference** for a no-op).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import {
  applyDraftAction,
  canAddStem,
  canResize,
  createEmptyDraft,
  renderOrder,
  reorderNeighbor,
  usedCount,
  type DraftAction,
} from './draft';
import type { BouquetDraft } from './types';

const ctx = bouquetContext;

function run(actions: DraftAction[], start = createEmptyDraft('wrap-cream')) {
  return actions.reduce(
    (draft, action) => applyDraftAction(draft, action, ctx),
    start,
  );
}

const add = (flowerId: string): DraftAction => ({ type: 'add', flowerId });

describe('draft reducer', () => {
  it('starts as an empty Bó with the given wrap', () => {
    expect(createEmptyDraft('wrap-cream')).toEqual({
      arrangementStyle: 'bouquet',
      stems: [],
      nextStemSeq: 1,
      wrapId: 'wrap-cream',
    });
  });

  it('adds stems with deterministic, unique instance ids', () => {
    const draft = run([add('daisy'), add('daisy')]);
    expect(draft.stems.map((stem) => stem.instanceId)).toEqual([
      'daisy#1',
      'daisy#2',
    ]);
    expect(draft.nextStemSeq).toBe(3);
    expect(usedCount(draft, 'daisy')).toBe(2);
  });

  it('stops at nine stems no matter how many taps arrive', () => {
    const draft = run(Array.from({ length: 12 }, () => add('red-rose')));
    expect(draft.stems).toHaveLength(9);
    expect(canAddStem(draft, ctx.rules)).toBe(false);
  });

  it('ignores unknown flowers and unknown stems without changing the draft', () => {
    const draft = run([add('daisy')]);
    expect(applyDraftAction(draft, add('nope'), ctx)).toBe(draft);
    expect(
      applyDraftAction(draft, { type: 'remove', instanceId: 'nope#1' }, ctx),
    ).toBe(draft);
  });

  it('moves a stem and clamps it into the region', () => {
    const draft = run([
      add('daisy'),
      { type: 'move', instanceId: 'daisy#1', x: 5, y: 0.38 },
    ]);
    const { region } = ctx.profiles.bouquet;
    expect(draft.stems[0]).toMatchObject({
      x: region.cx + region.rx,
      y: 0.38,
    });
  });

  it('rotates in 15° steps and stops at ±60°', () => {
    const start = run([add('daisy')]);
    const base = start.stems[0]?.rotationDeg ?? 0;
    const once = applyDraftAction(
      start,
      { type: 'rotate', instanceId: 'daisy#1', direction: 1 },
      ctx,
    );
    expect(once.stems[0]?.rotationDeg).toBeCloseTo(base + 15);
    const many = run(
      Array.from({ length: 10 }, () => ({
        type: 'rotate' as const,
        instanceId: 'daisy#1',
        direction: 1 as const,
      })),
      start,
    );
    expect(many.stems[0]?.rotationDeg).toBe(60);
    expect(
      applyDraftAction(
        many,
        { type: 'rotate', instanceId: 'daisy#1', direction: 1 },
        ctx,
      ),
    ).toBe(many);
  });

  it('resizes through small, medium and large', () => {
    const larger = run([
      add('daisy'),
      { type: 'resize', instanceId: 'daisy#1', direction: 1 },
    ]);
    expect(larger.stems[0]).toMatchObject({ size: 'large', scale: 0.9775 });
    const stem = larger.stems[0];
    expect(stem && canResize(stem, 1)).toBe(false);
    expect(
      applyDraftAction(
        larger,
        { type: 'resize', instanceId: 'daisy#1', direction: 1 },
        ctx,
      ),
    ).toBe(larger);
  });

  it('reorders across role bands when the player asks', () => {
    const draft = run([add('red-rose'), add('eucalyptus')]);
    expect(renderOrder(draft.stems).map((s) => s.flowerId)).toEqual([
      'eucalyptus',
      'red-rose',
    ]);
    const forward = applyDraftAction(
      draft,
      { type: 'reorder', instanceId: 'eucalyptus#2', direction: 'forward' },
      ctx,
    );
    expect(renderOrder(forward.stems).map((s) => s.flowerId)).toEqual([
      'red-rose',
      'eucalyptus',
    ]);
    expect(
      reorderNeighbor(forward.stems, 'eucalyptus#2', 'forward'),
    ).toBeUndefined();
    expect(
      applyDraftAction(
        forward,
        { type: 'reorder', instanceId: 'eucalyptus#2', direction: 'forward' },
        ctx,
      ),
    ).toBe(forward);
  });

  it('removes and clears stems but keeps ids unique afterwards', () => {
    const cleared = run([add('daisy'), add('daisy'), { type: 'clear' }]);
    expect(cleared.stems).toEqual([]);
    expect(run([add('daisy')], cleared).stems[0]?.instanceId).toBe('daisy#3');
  });

  it('keeps the chosen wrap across style switches', () => {
    const draft = run([
      { type: 'setWrap', wrapId: 'wrap-kraft' },
      { type: 'setStyle', style: 'basket' },
      { type: 'setStyle', style: 'bouquet' },
    ]);
    expect(draft.wrapId).toBe('wrap-kraft');
  });

  it('re-composes every stem when the style changes', () => {
    const bouquet = run([add('red-rose'), add('daisy'), add('eucalyptus')]);
    const basket = applyDraftAction(
      bouquet,
      { type: 'setStyle', style: 'basket' },
      ctx,
    );
    expect(basket.arrangementStyle).toBe('basket');
    expect(basket.stems.map((s) => s.instanceId)).toEqual(
      bouquet.stems.map((s) => s.instanceId),
    );
    expect(basket.stems).not.toEqual(bouquet.stems);
    expect(
      applyDraftAction(basket, { type: 'setStyle', style: 'basket' }, ctx),
    ).toBe(basket);
  });

  it('reconstructs identically from JSON', () => {
    const draft = run([
      add('red-rose'),
      add('pink-tulip'),
      add('eucalyptus'),
      { type: 'rotate', instanceId: 'red-rose#1', direction: -1 },
      { type: 'move', instanceId: 'pink-tulip#2', x: 0.31, y: 0.27 },
      { type: 'setStyle', style: 'basket' },
      { type: 'resize', instanceId: 'eucalyptus#3', direction: -1 },
    ]);
    const restored = JSON.parse(JSON.stringify(draft)) as BouquetDraft;
    expect(restored).toEqual(draft);
    expect(renderOrder(restored.stems)).toEqual(renderOrder(draft.stems));
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/domain/bouquet/draft.test.ts`
Expected: FAIL — cannot resolve `./draft`.

- [ ] **Step 3: Implement the reducer**

```ts
import type { Id } from '../catalog';
import { composeStem, stemScale } from './compose';
import { clamp, clampToRegion, roundTo } from './geometry';
import type {
  ArrangementStyle,
  BouquetContext,
  BouquetDraft,
  BouquetRules,
  PlacedStem,
  StemSize,
} from './types';

export type DraftAction =
  | { type: 'add'; flowerId: Id }
  | { type: 'move'; instanceId: Id; x: number; y: number }
  | { type: 'rotate'; instanceId: Id; direction: 1 | -1 }
  | { type: 'resize'; instanceId: Id; direction: 1 | -1 }
  | { type: 'reorder'; instanceId: Id; direction: 'forward' | 'backward' }
  | { type: 'remove'; instanceId: Id }
  | { type: 'clear' }
  | { type: 'setWrap'; wrapId: Id }
  | { type: 'setStyle'; style: ArrangementStyle };

const SIZES: readonly StemSize[] = ['small', 'medium', 'large'];

export function createEmptyDraft(wrapId: Id): BouquetDraft {
  return { arrangementStyle: 'bouquet', stems: [], nextStemSeq: 1, wrapId };
}

export function canAddStem(draft: BouquetDraft, rules: BouquetRules): boolean {
  return draft.stems.length < rules.maxStems;
}

export function usedCount(draft: BouquetDraft, flowerId: Id): number {
  return draft.stems.filter((stem) => stem.flowerId === flowerId).length;
}

/** Back-to-front paint order: zIndex, then add order. */
export function renderOrder(stems: readonly PlacedStem[]): PlacedStem[] {
  return stems
    .map((stem, index) => ({ stem, index }))
    .sort((a, b) => a.stem.zIndex - b.stem.zIndex || a.index - b.index)
    .map(({ stem }) => stem);
}

/** Nearest stem above (forward) or below (backward) the given stem. */
export function reorderNeighbor(
  stems: readonly PlacedStem[],
  instanceId: Id,
  direction: 'forward' | 'backward',
): PlacedStem | undefined {
  const target = stems.find((stem) => stem.instanceId === instanceId);
  if (!target) return undefined;
  let best: PlacedStem | undefined;
  for (const stem of stems) {
    if (stem === target) continue;
    const isCandidate =
      direction === 'forward'
        ? stem.zIndex > target.zIndex
        : stem.zIndex < target.zIndex;
    const isCloser =
      !best ||
      (direction === 'forward'
        ? stem.zIndex < best.zIndex
        : stem.zIndex > best.zIndex);
    if (isCandidate && isCloser) best = stem;
  }
  return best;
}

export function canResize(stem: PlacedStem, direction: 1 | -1): boolean {
  return SIZES[SIZES.indexOf(stem.size) + direction] !== undefined;
}

function updateStem(
  draft: BouquetDraft,
  instanceId: Id,
  update: (stem: PlacedStem) => PlacedStem,
): BouquetDraft {
  const index = draft.stems.findIndex((stem) => stem.instanceId === instanceId);
  const current = draft.stems[index];
  if (!current) return draft;
  const next = update(current);
  if (next === current) return draft;
  const stems = draft.stems.slice();
  stems[index] = next;
  return { ...draft, stems };
}

/**
 * Pure draft reducer. Returns the same draft reference when the action changes
 * nothing, so history can skip no-op entries.
 */
export function applyDraftAction(
  draft: BouquetDraft,
  action: DraftAction,
  ctx: BouquetContext,
): BouquetDraft {
  const { rules } = ctx;
  switch (action.type) {
    case 'add': {
      if (!canAddStem(draft, rules)) return draft;
      const stem = composeStem(
        draft.stems,
        action.flowerId,
        `${action.flowerId}#${draft.nextStemSeq}`,
        draft.arrangementStyle,
        ctx,
      );
      if (!stem) return draft;
      return {
        ...draft,
        stems: [...draft.stems, stem],
        nextStemSeq: draft.nextStemSeq + 1,
      };
    }
    case 'move': {
      const { region } = ctx.profiles[draft.arrangementStyle];
      return updateStem(draft, action.instanceId, (stem) => {
        const point = clampToRegion({ x: action.x, y: action.y }, region);
        return point.x === stem.x && point.y === stem.y
          ? stem
          : { ...stem, ...point };
      });
    }
    case 'rotate':
      return updateStem(draft, action.instanceId, (stem) => {
        const rotationDeg = roundTo(
          clamp(
            stem.rotationDeg + action.direction * rules.rotateStepDeg,
            -rules.maxRotationDeg,
            rules.maxRotationDeg,
          ),
          2,
        );
        return rotationDeg === stem.rotationDeg
          ? stem
          : { ...stem, rotationDeg };
      });
    case 'resize':
      return updateStem(draft, action.instanceId, (stem) => {
        const size = SIZES[SIZES.indexOf(stem.size) + action.direction];
        const role = ctx.flowers[stem.flowerId]?.role;
        if (!size || !role) return stem;
        return { ...stem, size, scale: stemScale(role, size, rules) };
      });
    case 'reorder': {
      const target = draft.stems.find(
        (stem) => stem.instanceId === action.instanceId,
      );
      const other = reorderNeighbor(
        draft.stems,
        action.instanceId,
        action.direction,
      );
      if (!target || !other) return draft;
      return {
        ...draft,
        stems: draft.stems.map((stem) => {
          if (stem === target) return { ...stem, zIndex: other.zIndex };
          if (stem === other) return { ...stem, zIndex: target.zIndex };
          return stem;
        }),
      };
    }
    case 'remove': {
      const stems = draft.stems.filter(
        (stem) => stem.instanceId !== action.instanceId,
      );
      return stems.length === draft.stems.length ? draft : { ...draft, stems };
    }
    case 'clear':
      return draft.stems.length === 0 ? draft : { ...draft, stems: [] };
    case 'setWrap':
      return draft.wrapId === action.wrapId
        ? draft
        : { ...draft, wrapId: action.wrapId };
    case 'setStyle': {
      if (draft.arrangementStyle === action.style) return draft;
      // Re-place every stem in add order; manual adjustments are discarded.
      const stems: PlacedStem[] = [];
      for (const stem of draft.stems) {
        const placed = composeStem(
          stems,
          stem.flowerId,
          stem.instanceId,
          action.style,
          ctx,
        );
        if (placed) stems.push(placed);
      }
      return { ...draft, arrangementStyle: action.style, stems };
    }
  }
}
```

- [ ] **Step 4: Run and confirm Tasks 4 and 5 pass**

Run: `npx vitest run src/domain && npm run typecheck && npm run lint`
Expected: compose 12 + draft 12 (+ earlier) PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/bouquet/compose.ts src/domain/bouquet/compose.test.ts src/domain/bouquet/__snapshots__ src/domain/bouquet/draft.ts src/domain/bouquet/draft.test.ts
git commit -m "feat(m1): deterministic placement and bouquet draft reducer"
```

### Task 6: Undo history

**Files:**
- Create: `src/domain/bouquet/history.ts`
- Test: `src/domain/bouquet/history.test.ts`

**Interfaces:**
- Consumes: `applyDraftAction`, `DraftAction` (Task 5).
- Produces: `DraftHistory { present; past }`, `type HistoryAction = DraftAction | { type: 'undo' }`, `createHistory(draft)`, `canUndo(history)`, `reduceHistory(history, action, ctx)`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { bouquetContext } from '../../content/bouquetRules';
import { createEmptyDraft } from './draft';
import {
  canUndo,
  createHistory,
  reduceHistory,
  type DraftHistory,
  type HistoryAction,
} from './history';

const ctx = bouquetContext;

function run(actions: HistoryAction[], start?: DraftHistory) {
  return actions.reduce(
    (history, action) => reduceHistory(history, action, ctx),
    start ?? createHistory(createEmptyDraft('wrap-cream')),
  );
}

describe('undo history', () => {
  it('undoes the last change and stops when empty', () => {
    const history = run([
      { type: 'add', flowerId: 'daisy' },
      { type: 'add', flowerId: 'red-rose' },
      { type: 'undo' },
    ]);
    expect(history.present.stems.map((s) => s.flowerId)).toEqual(['daisy']);
    const empty = run([{ type: 'undo' }, { type: 'undo' }], history);
    expect(empty.present.stems).toEqual([]);
    expect(canUndo(empty)).toBe(false);
    expect(reduceHistory(empty, { type: 'undo' }, ctx)).toBe(empty);
  });

  it('does not record no-op actions', () => {
    const history = run([
      { type: 'add', flowerId: 'daisy' },
      { type: 'setWrap', wrapId: 'wrap-cream' },
      { type: 'remove', instanceId: 'missing#9' },
    ]);
    expect(history.past).toHaveLength(1);
  });

  it('brings back a removed stem', () => {
    const added = run([{ type: 'add', flowerId: 'daisy' }]);
    const restored = run(
      [{ type: 'remove', instanceId: 'daisy#1' }, { type: 'undo' }],
      added,
    );
    expect(restored.present).toEqual(added.present);
  });

  it('restores manual adjustments after a style switch', () => {
    const adjusted = run([
      { type: 'add', flowerId: 'red-rose' },
      { type: 'move', instanceId: 'red-rose#1', x: 0.33, y: 0.25 },
      { type: 'resize', instanceId: 'red-rose#1', direction: 1 },
    ]);
    const back = run(
      [{ type: 'setStyle', style: 'basket' }, { type: 'undo' }],
      adjusted,
    );
    expect(back.present).toEqual(adjusted.present);
  });

  it('keeps at most undoLimit entries', () => {
    const actions: HistoryAction[] = Array.from({ length: 40 }, (_, index) => ({
      type: 'setWrap',
      wrapId: index % 2 === 0 ? 'wrap-blush' : 'wrap-kraft',
    }));
    expect(run(actions).past).toHaveLength(ctx.rules.undoLimit);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/domain/bouquet/history.test.ts`
Expected: FAIL — cannot resolve `./history`.

- [ ] **Step 3: Implement**

```ts
import { applyDraftAction, type DraftAction } from './draft';
import type { BouquetContext, BouquetDraft } from './types';

export interface DraftHistory {
  present: BouquetDraft;
  past: readonly BouquetDraft[];
}

export type HistoryAction = DraftAction | { type: 'undo' };

export function createHistory(draft: BouquetDraft): DraftHistory {
  return { present: draft, past: [] };
}

export function canUndo(history: DraftHistory): boolean {
  return history.past.length > 0;
}

export function reduceHistory(
  history: DraftHistory,
  action: HistoryAction,
  ctx: BouquetContext,
): DraftHistory {
  if (action.type === 'undo') {
    const previous = history.past.at(-1);
    if (!previous) return history;
    return { present: previous, past: history.past.slice(0, -1) };
  }
  const next = applyDraftAction(history.present, action, ctx);
  if (next === history.present) return history;
  return {
    present: next,
    past: [...history.past, history.present].slice(-ctx.rules.undoLimit),
  };
}
```

- [ ] **Step 4: Run and confirm it passes**

Run: `npx vitest run src/domain/bouquet/history.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/bouquet/history.ts src/domain/bouquet/history.test.ts
git commit -m "feat(m1): bounded undo history for bouquet drafts"
```

### Task 7: Data-model docs, verification and handoff

**Files:**
- Modify: `docs/06_DATA_MODEL.md`

- [ ] **Step 1: Update docs/06.** In the `PlacedStem` block add `size: 'small' | 'medium' | 'large';` after `scale`. In `BouquetDraft` add `arrangementStyle: 'bouquet' | 'basket';` and `nextStemSeq: number;` above `stems`. Below the code block add:

```markdown
Milestone 1 implements these contracts in `src/domain/catalog.ts` and `src/domain/bouquet/types.ts`. `PlacedStem.x/y` is the flower-head position on a 4:5 plane; stems are drawn from the head to the style anchor and are not stored. `instanceId` is `flowerId#seq`. `freshnessAtUse` is always 3 until inventory exists.
```

- [ ] **Step 2: Full verification**

Run: `npm run format:check && npm run lint && npm run typecheck && npm test && npm run test:e2e && git diff --check`
Expected: all PASS; unit suite 46 tests (2 App + 44 domain/content); existing 7 shell E2E unchanged.

- [ ] **Step 3: Commit, push and open a PR**

```bash
git add docs/06_DATA_MODEL.md
git commit -m "docs(m1): record bouquet draft contract"
git push -u origin feature/m1-bouquet-domain
gh pr create --base main --title "feat(m1): bouquet domain and content" --body "Implements Part A of docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md"
```

- [ ] **Step 4: Hand off** to Claude for review in the standard SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP format, with the CI run result. Do not merge without that review.

---

# Part B — Designer UI (Antigravity)

Setup once, after Part A is merged:

```bash
git switch main && git pull --ff-only
git switch -c feature/m1-bouquet-ui
npm ci
npx playwright install chromium webkit   # Linux may need: sudo npx playwright install-deps webkit
```

### Task 8: Copy, art tokens and temporary art

**Files:**
- Create: `src/content/designer.ts`, `src/components/art/FlowerArt.tsx`, `src/components/art/ContainerArt.tsx`
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: `Id`, `ArrangementStyle`.
- Produces: `designerCopy` (keys used later: `enter, back, title, styleGroupLabel, styles, restyled, planeLabel, emptyHint, full(max), stemCount(n, max), stemLabel(name, position), usedCount(n), trayLabel, wrapLabel, wrapShort, undo, clear, actionsLabel, actions.{rotateLeft, rotateRight, smaller, larger, forward, backward, remove}`); `<FlowerArt assetId />` (100×100 viewBox); `<ContainerArt style wrapId layer />` (100×125 viewBox, `layer: 'back' | 'front'`).

- [ ] **Step 1: Add the copy**

```ts
import type { ArrangementStyle } from '../domain/bouquet/types';

export const designerCopy = {
  enter: 'Vào xếp hoa',
  back: 'Quay lại',
  title: 'Xếp hoa',
  styleGroupLabel: 'Kiểu dáng',
  styles: { bouquet: 'Bó', basket: 'Lẵng' } satisfies Record<
    ArrangementStyle,
    string
  >,
  restyled: {
    bouquet: 'Đã xếp lại theo dáng bó',
    basket: 'Đã xếp lại theo dáng lẵng',
  } satisfies Record<ArrangementStyle, string>,
  planeLabel: 'Khung xếp hoa',
  emptyHint: 'Chạm một bông hoa bên dưới để bắt đầu',
  full: (max: number) =>
    `Bó đã đủ ${max} cành — chọn một bông để xoá nếu muốn đổi.`,
  stemCount: (count: number, max: number) => `${count}/${max} cành`,
  stemLabel: (name: string, position: number) => `${name}, cành ${position}`,
  usedCount: (count: number) => `×${count}`,
  trayLabel: 'Khay hoa',
  wrapLabel: 'Giấy gói',
  /** Short visible swatch names; the full nameVi stays the accessible name. */
  wrapShort: {
    'wrap-cream': 'Kem',
    'wrap-blush': 'Hồng phấn',
    'wrap-kraft': 'Kraft',
  } as Record<string, string>,
  undo: 'Hoàn tác',
  clear: 'Làm lại',
  actionsLabel: 'Chỉnh bông đang chọn',
  actions: {
    rotateLeft: 'Xoay trái',
    rotateRight: 'Xoay phải',
    smaller: 'Nhỏ lại',
    larger: 'To lên',
    forward: 'Lên trước',
    backward: 'Ra sau',
    remove: 'Xoá',
  },
} as const;
```

- [ ] **Step 2: Add art tokens**

```diff
--- a/src/styles/tokens.css
+++ b/src/styles/tokens.css
@@ -12,6 +12,14 @@
   --butter-300: #f0d98a;
   --paper: #fffdf8;
   --danger: #bd5f62;
+  /* Temporary Milestone 1 flower/container art palette. */
+  --flower-red: #c9575c;
+  --flower-red-deep: #a8434a;
+  --flower-yellow: #f2c84b;
+  --flower-seed: #7a5a3a;
+  --kraft-300: #d8b48c;
+  --basket-500: #b98a5c;
+  --basket-700: #8c6441;
   --border-warm: rgb(68 58 54 / 14%);
   --shadow-soft: 0 6px 20px rgb(68 58 54 / 10%);
   --shadow-float: 0 10px 30px rgb(68 58 54 / 14%);
```

- [ ] **Step 3: Add the flower art**

```tsx
import type { Id } from '../../domain/catalog';

/** Temporary flat flower heads, drawn in a 100x100 box centered at 50,50. */
function Petals({
  count,
  rx,
  ry,
  distance,
  className,
}: {
  count: number;
  rx: number;
  ry: number;
  distance: number;
  className: string;
}) {
  return (
    <g className={className}>
      {Array.from({ length: count }, (_, index) => (
        <ellipse
          key={index}
          cx="50"
          cy={50 - distance}
          rx={rx}
          ry={ry}
          transform={`rotate(${(360 / count) * index} 50 50)`}
        />
      ))}
    </g>
  );
}

const art: Record<Id, () => React.JSX.Element> = {
  'flower-red-rose': () => (
    <>
      <Petals count={6} rx={16} ry={20} distance={14} className="art-red" />
      <circle cx="50" cy="50" r="18" className="art-red-deep" />
      <path d="M41 50Q50 38 59 50Q50 60 41 50Z" className="art-red" />
    </>
  ),
  'flower-pink-tulip': () => (
    <>
      <path d="M30 34Q50 22 70 34L66 70Q50 80 34 70Z" className="art-pink" />
      <path d="M36 30L44 46L50 26L56 46L64 30" className="art-pink-deep" />
    </>
  ),
  'flower-sunflower': () => (
    <>
      <Petals count={14} rx={7} ry={16} distance={26} className="art-yellow" />
      <circle cx="50" cy="50" r="20" className="art-seed" />
    </>
  ),
  'flower-daisy': () => (
    <>
      <Petals count={12} rx={6} ry={15} distance={22} className="art-white" />
      <circle cx="50" cy="50" r="11" className="art-yellow" />
    </>
  ),
  'flower-babys-breath': () => (
    <g className="art-white">
      {[
        [50, 30],
        [34, 44],
        [66, 44],
        [42, 62],
        [58, 62],
        [50, 48],
        [26, 60],
        [74, 60],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />
      ))}
    </g>
  ),
  'flower-eucalyptus': () => (
    <g className="art-leaf">
      {[18, 36, 54, 72].map((cy, index) => (
        <ellipse
          key={cy}
          cx={index % 2 === 0 ? 40 : 60}
          cy={cy}
          rx="13"
          ry="9"
        />
      ))}
    </g>
  ),
};

export function FlowerArt({ assetId }: { assetId: Id }) {
  const Art = art[assetId];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {Art ? <Art /> : <circle cx="50" cy="50" r="30" className="art-pink" />}
    </svg>
  );
}
```

- [ ] **Step 4: Add the container art**

```tsx
import type { Id } from '../../domain/catalog';
import type { ArrangementStyle } from '../../domain/bouquet/types';

/** Temporary wrap and basket layers in the 100x125 plane viewBox. */
const wrapClass: Record<Id, string> = {
  'wrap-cream': 'art-wrap-cream',
  'wrap-blush': 'art-wrap-blush',
  'wrap-kraft': 'art-wrap-kraft',
};

interface ContainerArtProps {
  style: ArrangementStyle;
  wrapId: Id | undefined;
  layer: 'back' | 'front';
}

export function ContainerArt({ style, wrapId, layer }: ContainerArtProps) {
  return (
    <svg
      className={`plane-layer plane-${layer}`}
      viewBox="0 0 100 125"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {style === 'bouquet' ? (
        <WrapLayer
          layer={layer}
          className={wrapClass[wrapId ?? ''] ?? 'art-wrap-cream'}
        />
      ) : (
        <BasketLayer layer={layer} />
      )}
    </svg>
  );
}

function WrapLayer({
  layer,
  className,
}: {
  layer: 'back' | 'front';
  className: string;
}) {
  return layer === 'back' ? (
    <path d="M14 46L50 112L86 46Q50 30 14 46Z" className={className} />
  ) : (
    <g className={className}>
      <path d="M26 72L50 118L74 72Q50 84 26 72Z" />
      <path d="M44 104H56L54 110H46Z" className="art-tie" />
    </g>
  );
}

function BasketLayer({ layer }: { layer: 'back' | 'front' }) {
  return layer === 'back' ? (
    <path d="M18 78Q50 18 82 78" className="art-basket-handle" fill="none" />
  ) : (
    <g>
      <path d="M16 76H84L76 112Q50 120 24 112Z" className="art-basket" />
      <path d="M20 88H80M23 100H77" className="art-basket-weave" />
    </g>
  );
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint`
Expected: clean (the art is exercised by Task 10 tests).

```bash
git add src/content/designer.ts src/components/art src/styles/tokens.css
git commit -m "feat(m1): designer copy and temporary flower art"
```

### Task 9: Plane, stems and drag

**Files:**
- Create: `src/features/bouquet/useStemDrag.ts`, `src/features/bouquet/StemView.tsx`, `src/features/bouquet/StemLayer.tsx`, `src/features/bouquet/BouquetCanvas.tsx`

**Interfaces:**
- Consumes: geometry, draft types, `bouquetContext`, `designerCopy`, art components.
- Produces: `useStemDrag(options): StemDrag` with `down(event, stem)`, `move`, `up`, `cancel`, `consumeDragClick()`; `<BouquetCanvas draft selectedId onSelect(id | null) onMove(id, point) />`. The plane is `role="group"` named `designerCopy.planeLabel`; every head is a `button` named `designerCopy.stemLabel(...)` with `aria-pressed` for selection and `data-stem-id`.

Rules this code enforces (keep them when editing):
- A second pointer is ignored while one drag is active.
- Movement under `rules.dragThresholdPx` is a tap; the click after a real drag is swallowed once, and the guard resets on every `pointerdown` (touch drags fire no click).
- During a drag only the dragged head's `style.translate` and its stem path `d` change; React state changes once on release.
- `pointercancel` restores the committed stem path.

- [ ] **Step 1: Add the drag hook**

```ts
import {
  useLayoutEffect,
  useMemo,
  useRef,
  type PointerEvent,
  type RefObject,
} from 'react';
import type { Id } from '../../domain/catalog';
import type { Point } from '../../domain/bouquet/types';

interface DragOptions {
  planeRef: RefObject<HTMLElement | null>;
  thresholdPx: number;
  clamp: (point: Point) => Point;
  onPreview: (instanceId: Id, point: Point) => void;
  onCommit: (instanceId: Id, point: Point) => void;
  onCancel: (instanceId: Id) => void;
}

interface ActiveDrag {
  instanceId: Id;
  pointerId: number;
  element: HTMLElement;
  startX: number;
  startY: number;
  origin: Point;
  rect: DOMRect;
  dragging: boolean;
  last: Point;
}

export interface StemDrag {
  down: (
    event: PointerEvent<HTMLElement>,
    stem: { instanceId: Id } & Point,
  ) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  up: (event: PointerEvent<HTMLElement>) => void;
  cancel: (event: PointerEvent<HTMLElement>) => void;
  /** True once after a drag ends, so the trailing click does not select. */
  consumeDragClick: () => boolean;
}

/**
 * Pointer drag for one stem at a time. Moves the element with the CSS
 * `translate` property during the gesture and commits once on release, so
 * React does not re-render while the finger moves.
 */
export function useStemDrag(options: DragOptions): StemDrag {
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });
  const active = useRef<ActiveDrag | null>(null);
  const draggedRecently = useRef(false);

  return useMemo<StemDrag>(() => {
    const finish = (drag: ActiveDrag) => {
      drag.element.style.translate = '';
      delete drag.element.dataset.dragging;
      active.current = null;
    };

    return {
      down(event, stem) {
        if (active.current) return; // ignore a second finger
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        // Touch drags fire no trailing click, so reset the flag per gesture.
        draggedRecently.current = false;
        const plane = optionsRef.current.planeRef.current;
        if (!plane) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Synthetic events in tests have no capturable pointer.
        }
        active.current = {
          instanceId: stem.instanceId,
          pointerId: event.pointerId,
          element: event.currentTarget,
          startX: event.clientX,
          startY: event.clientY,
          origin: { x: stem.x, y: stem.y },
          rect: plane.getBoundingClientRect(),
          dragging: false,
          last: { x: stem.x, y: stem.y },
        };
      },
      move(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.dragging) {
          if (Math.hypot(dx, dy) < optionsRef.current.thresholdPx) return;
          drag.dragging = true;
          drag.element.dataset.dragging = 'true';
        }
        const point = optionsRef.current.clamp({
          x: drag.origin.x + dx / drag.rect.width,
          y: drag.origin.y + dy / drag.rect.height,
        });
        drag.last = point;
        drag.element.style.translate = `${(point.x - drag.origin.x) * drag.rect.width}px ${(point.y - drag.origin.y) * drag.rect.height}px`;
        optionsRef.current.onPreview(drag.instanceId, point);
      },
      up(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        finish(drag);
        if (drag.dragging) {
          draggedRecently.current = true;
          optionsRef.current.onCommit(drag.instanceId, drag.last);
        }
      },
      cancel(event) {
        const drag = active.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        finish(drag);
        optionsRef.current.onCancel(drag.instanceId);
      },
      consumeDragClick() {
        const value = draggedRecently.current;
        draggedRecently.current = false;
        return value;
      },
    };
  }, []);
}
```

- [ ] **Step 2: Add the head view**

```tsx
import { memo, type KeyboardEvent } from 'react';
import { FlowerArt } from '../../components/art/FlowerArt';
import type { Id } from '../../domain/catalog';
import type { PlacedStem } from '../../domain/bouquet/types';
import type { StemDrag } from './useStemDrag';

interface StemViewProps {
  stem: PlacedStem;
  assetId: Id;
  label: string;
  selected: boolean;
  drag: StemDrag;
  onSelect: (instanceId: Id) => void;
  onNudge: (instanceId: Id, dx: number, dy: number) => void;
}

const arrowSteps: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export const StemView = memo(function StemView({
  stem,
  assetId,
  label,
  selected,
  drag,
  onSelect,
  onNudge,
}: StemViewProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = arrowSteps[event.key];
    if (!step) return;
    event.preventDefault();
    onNudge(stem.instanceId, step[0], step[1]);
  };

  return (
    <button
      type="button"
      className="stem-head"
      data-stem-id={stem.instanceId}
      aria-label={label}
      aria-pressed={selected}
      style={{
        left: `${stem.x * 100}%`,
        top: `${stem.y * 100}%`,
        zIndex: stem.zIndex,
        transform: `translate(-50%, -50%) rotate(${stem.rotationDeg}deg) scale(${stem.scale})`,
      }}
      onPointerDown={(event) => drag.down(event, stem)}
      onPointerMove={drag.move}
      onPointerUp={drag.up}
      onPointerCancel={drag.cancel}
      onClick={() => {
        if (!drag.consumeDragClick()) onSelect(stem.instanceId);
      }}
      onKeyDown={onKeyDown}
    >
      <FlowerArt assetId={assetId} />
    </button>
  );
});
```

- [ ] **Step 3: Add the stem layer**

```tsx
import { memo, type RefObject } from 'react';
import type { Id } from '../../domain/catalog';
import { anchorFor, stemPathD } from '../../domain/bouquet/geometry';
import type { PlacedStem, StemAnchor } from '../../domain/bouquet/types';

interface StemLayerProps {
  stems: readonly PlacedStem[];
  anchor: StemAnchor;
  pathRefs: RefObject<Map<Id, SVGPathElement>>;
}

/** Stems from each head to the binding point or basket rim. */
export const StemLayer = memo(function StemLayer({
  stems,
  anchor,
  pathRefs,
}: StemLayerProps) {
  return (
    <svg
      className="plane-layer"
      viewBox="0 0 100 125"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {stems.map((stem) => (
        <path
          key={stem.instanceId}
          ref={(element) => {
            if (element) pathRefs.current.set(stem.instanceId, element);
            else pathRefs.current.delete(stem.instanceId);
          }}
          d={stemPathD(stem, anchorFor(stem, anchor))}
          className="art-stem"
        />
      ))}
    </svg>
  );
});
```

- [ ] **Step 4: Add the canvas**

```tsx
import { useCallback, useLayoutEffect, useRef } from 'react';
import { ContainerArt } from '../../components/art/ContainerArt';
import { bouquetContext } from '../../content/bouquetRules';
import { designerCopy } from '../../content/designer';
import type { Id } from '../../domain/catalog';
import {
  anchorFor,
  clampToRegion,
  stemPathD,
} from '../../domain/bouquet/geometry';
import type { BouquetDraft, Point } from '../../domain/bouquet/types';
import { StemLayer } from './StemLayer';
import { StemView } from './StemView';
import { useStemDrag } from './useStemDrag';

interface BouquetCanvasProps {
  draft: BouquetDraft;
  selectedId: Id | null;
  onSelect: (instanceId: Id | null) => void;
  onMove: (instanceId: Id, point: Point) => void;
}

export function BouquetCanvas({
  draft,
  selectedId,
  onSelect,
  onMove,
}: BouquetCanvasProps) {
  const { rules, profiles, flowers } = bouquetContext;
  const profile = profiles[draft.arrangementStyle];
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef(new Map<Id, SVGPathElement>());
  const draftRef = useRef(draft);
  useLayoutEffect(() => {
    draftRef.current = draft;
  });

  const setPath = (instanceId: Id, head: Point) => {
    pathRefs.current
      .get(instanceId)
      ?.setAttribute('d', stemPathD(head, anchorFor(head, profile.anchor)));
  };

  const drag = useStemDrag({
    planeRef,
    thresholdPx: rules.dragThresholdPx,
    clamp: (point) => clampToRegion(point, profile.region),
    onPreview: setPath,
    onCommit: onMove,
    onCancel: (instanceId) => {
      const stem = draftRef.current.stems.find(
        (item) => item.instanceId === instanceId,
      );
      if (stem) setPath(instanceId, stem);
    },
  });

  const onNudge = useCallback(
    (instanceId: Id, dx: number, dy: number) => {
      const stem = draftRef.current.stems.find(
        (item) => item.instanceId === instanceId,
      );
      if (!stem) return;
      onMove(instanceId, {
        x: stem.x + dx * rules.keyboardStep,
        y: stem.y + dy * rules.keyboardStep,
      });
    },
    [onMove, rules.keyboardStep],
  );
  const onSelectStem = useCallback(
    (instanceId: Id) => onSelect(instanceId),
    [onSelect],
  );

  return (
    <div
      ref={planeRef}
      className="bouquet-plane"
      role="group"
      aria-label={designerCopy.planeLabel}
      data-style={draft.arrangementStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onSelect(null);
      }}
    >
      <ContainerArt
        style={draft.arrangementStyle}
        wrapId={draft.wrapId}
        layer="back"
      />
      <StemLayer
        stems={draft.stems}
        anchor={profile.anchor}
        pathRefs={pathRefs}
      />
      <ContainerArt
        style={draft.arrangementStyle}
        wrapId={draft.wrapId}
        layer="front"
      />
      {draft.stems.map((stem, index) => {
        const flower = flowers[stem.flowerId];
        if (!flower) return null;
        return (
          <StemView
            key={stem.instanceId}
            stem={stem}
            assetId={flower.assetId}
            label={designerCopy.stemLabel(flower.nameVi, index + 1)}
            selected={stem.instanceId === selectedId}
            drag={drag}
            onSelect={onSelectStem}
            onNudge={onNudge}
          />
        );
      })}
      {draft.stems.length === 0 && (
        <p className="plane-hint">{designerCopy.emptyHint}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint`
Expected: clean. (Behavior is tested through the screen in Task 10.)

```bash
git add src/features/bouquet/useStemDrag.ts src/features/bouquet/StemView.tsx src/features/bouquet/StemLayer.tsx src/features/bouquet/BouquetCanvas.tsx
git commit -m "feat(m1): composition plane with pointer drag"
```

### Task 10: Designer screen, tray and tools

**Files:**
- Create: `src/features/bouquet/FlowerTray.tsx`, `src/features/bouquet/WrapPicker.tsx`, `src/features/bouquet/StemActions.tsx`, `src/features/bouquet/BouquetDesigner.tsx`, `src/styles/designer.css`
- Modify: `src/styles/global.css` (import only in this task)
- Test: `src/features/bouquet/BouquetDesigner.test.tsx`

**Interfaces:**
- Produces: `<BouquetDesigner onBack />` rendering a `main` with a level-1 heading `designerCopy.title` that receives focus on mount.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BouquetDesigner } from './BouquetDesigner';

function setup() {
  render(<BouquetDesigner onBack={vi.fn()} />);
  const tray = screen.getByRole('list', { name: 'Khay hoa' });
  const plane = screen.getByRole('group', { name: 'Khung xếp hoa' });
  const addFlower = (name: string) =>
    fireEvent.click(
      within(tray).getByRole('button', { name: new RegExp(name) }),
    );
  const stems = () => within(plane).queryAllByRole('button');
  return { tray, plane, addFlower, stems };
}

describe('Bouquet Designer', () => {
  it('starts empty with a hint and the wrap picker', () => {
    const { stems } = setup();
    expect(stems()).toHaveLength(0);
    expect(
      screen.getByText('Chạm một bông hoa bên dưới để bắt đầu'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /Giấy kem/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('0/9 cành')).toBeVisible();
  });

  it('adds stems from the tray and shows the used count', () => {
    const { addFlower, stems, tray } = setup();
    addFlower('Tulip hồng');
    addFlower('Tulip hồng');
    expect(stems().map((stem) => stem.getAttribute('aria-label'))).toEqual([
      'Tulip hồng, cành 1',
      'Tulip hồng, cành 2',
    ]);
    expect(within(tray).getByText('×2')).toBeVisible();
    expect(screen.getByText('2/9 cành')).toBeVisible();
  });

  it('stops at nine stems even under rapid taps and says why', () => {
    const { addFlower, stems, tray } = setup();
    for (let index = 0; index < 12; index += 1) addFlower('Hồng đỏ');
    expect(stems()).toHaveLength(9);
    for (const card of within(tray).getAllByRole('button')) {
      expect(card).toBeDisabled();
    }
    expect(screen.getByRole('status')).toHaveTextContent('Bó đã đủ 9 cành');
  });

  it('selects a stem, shows its tools and removes it', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    const [stem] = stems();
    fireEvent.click(stem!);
    expect(stem).toHaveAttribute('aria-pressed', 'true');
    const toolbar = screen.getByRole('toolbar', {
      name: 'Chỉnh bông đang chọn',
    });
    fireEvent.click(within(toolbar).getByRole('button', { name: 'Xoá' }));
    expect(stems()).toHaveLength(0);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Giấy kem/ })).toBeVisible();
  });

  it('brings a removed stem back with undo, unselected', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    fireEvent.click(stems()[0]!);
    fireEvent.click(screen.getByRole('button', { name: 'Xoá' }));
    fireEvent.click(screen.getByRole('button', { name: /Hoàn tác/ }));
    expect(stems()).toHaveLength(1);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('deselects when the empty plane is tapped', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    fireEvent.click(stems()[0]!);
    fireEvent.click(plane);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('switches to Lẵng, hides the wrap picker and announces the re-layout', () => {
    const { addFlower } = setup();
    addFlower('Hồng đỏ');
    fireEvent.click(screen.getByRole('button', { name: 'Lẵng' }));
    expect(screen.getByRole('button', { name: 'Lẵng' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.queryByRole('button', { name: /Giấy kem/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Đã xếp lại theo dáng lẵng',
    );
  });

  it('moves the selected stem with arrow keys', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    const stem = stems()[0]!;
    const before = stem.style.left;
    fireEvent.keyDown(stem, { key: 'ArrowRight' });
    expect(stems()[0]!.style.left).not.toBe(before);
  });

  it('ignores a second finger while the first one drags', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    plane.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 320, height: 400 }) as DOMRect;
    const stem = stems()[0]!;
    const left = stem.style.left;
    fireEvent.pointerDown(stem, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerDown(stem, { pointerId: 2, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(stem, { pointerId: 2, clientX: 300, clientY: 300 });
    fireEvent.pointerUp(stem, { pointerId: 2, clientX: 300, clientY: 300 });
    expect(stems()[0]!.style.left).toBe(left);
    fireEvent.pointerMove(stem, { pointerId: 1, clientX: 80, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 1, clientX: 80, clientY: 100 });
    expect(stems()[0]!.style.left).not.toBe(left);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects on the next tap after a touch drag that fired no click', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    plane.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 320, height: 400 }) as DOMRect;
    const stem = stems()[0]!;
    fireEvent.pointerDown(stem, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(stem, { pointerId: 1, clientX: 70, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 1, clientX: 70, clientY: 100 });
    fireEvent.pointerDown(stem, { pointerId: 2, clientX: 70, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 2, clientX: 70, clientY: 100 });
    fireEvent.click(stem);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'true');
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/features`
Expected: FAIL — cannot resolve `./BouquetDesigner`.

- [ ] **Step 3: Add the tray**

```tsx
import { FlowerArt } from '../../components/art/FlowerArt';
import { designerCopy } from '../../content/designer';
import { flowers } from '../../content/flowers';
import type { Id } from '../../domain/catalog';
import { usedCount } from '../../domain/bouquet/draft';
import type { BouquetDraft } from '../../domain/bouquet/types';

interface FlowerTrayProps {
  draft: BouquetDraft;
  disabled: boolean;
  onAdd: (flowerId: Id) => void;
}

export function FlowerTray({ draft, disabled, onAdd }: FlowerTrayProps) {
  return (
    <ul className="flower-tray" aria-label={designerCopy.trayLabel}>
      {flowers.map((flower) => {
        const used = usedCount(draft, flower.id);
        return (
          <li key={flower.id}>
            <button
              type="button"
              className="tray-card"
              disabled={disabled}
              onClick={() => onAdd(flower.id)}
            >
              <FlowerArt assetId={flower.assetId} />
              <span className="tray-name">{flower.nameVi}</span>
              {used > 0 && (
                <span className="tray-count">
                  {designerCopy.usedCount(used)}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 4: Add the wrap picker**

```tsx
import { designerCopy } from '../../content/designer';
import { wraps } from '../../content/wraps';
import type { Id } from '../../domain/catalog';

interface WrapPickerProps {
  wrapId: Id | undefined;
  onChange: (wrapId: Id) => void;
}

export function WrapPicker({ wrapId, onChange }: WrapPickerProps) {
  return (
    <div
      className="context-row"
      role="group"
      aria-label={designerCopy.wrapLabel}
    >
      {wraps.map((wrap) => (
        <button
          key={wrap.id}
          type="button"
          className="wrap-swatch"
          data-wrap={wrap.id}
          aria-pressed={wrap.id === wrapId}
          aria-label={wrap.nameVi}
          onClick={() => onChange(wrap.id)}
        >
          <span className="swatch-dot" aria-hidden="true" />
          {designerCopy.wrapShort[wrap.id] ?? wrap.nameVi}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Add the stem toolbar**

```tsx
import { designerCopy } from '../../content/designer';
import { canResize, reorderNeighbor } from '../../domain/bouquet/draft';
import type { DraftAction } from '../../domain/bouquet/draft';
import type { PlacedStem } from '../../domain/bouquet/types';

interface StemActionsProps {
  stem: PlacedStem;
  stems: readonly PlacedStem[];
  dispatch: (action: DraftAction) => void;
}

export function StemActions({ stem, stems, dispatch }: StemActionsProps) {
  const { instanceId } = stem;
  const { actions } = designerCopy;
  const buttons: { label: string; action: DraftAction; disabled?: boolean }[] =
    [
      {
        label: actions.rotateLeft,
        action: { type: 'rotate', instanceId, direction: -1 },
      },
      {
        label: actions.rotateRight,
        action: { type: 'rotate', instanceId, direction: 1 },
      },
      {
        label: actions.smaller,
        action: { type: 'resize', instanceId, direction: -1 },
        disabled: !canResize(stem, -1),
      },
      {
        label: actions.larger,
        action: { type: 'resize', instanceId, direction: 1 },
        disabled: !canResize(stem, 1),
      },
      {
        label: actions.forward,
        action: { type: 'reorder', instanceId, direction: 'forward' },
        disabled: !reorderNeighbor(stems, instanceId, 'forward'),
      },
      {
        label: actions.backward,
        action: { type: 'reorder', instanceId, direction: 'backward' },
        disabled: !reorderNeighbor(stems, instanceId, 'backward'),
      },
      { label: actions.remove, action: { type: 'remove', instanceId } },
    ];

  return (
    <div
      className="context-row stem-actions"
      role="toolbar"
      aria-label={designerCopy.actionsLabel}
    >
      {buttons.map(({ label, action, disabled }) => (
        <button
          key={label}
          type="button"
          className="action-chip"
          disabled={disabled}
          onClick={() => dispatch(action)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Add the screen**

```tsx
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { bouquetContext } from '../../content/bouquetRules';
import { designerCopy } from '../../content/designer';
import { defaultWrapId } from '../../content/wraps';
import type { Id } from '../../domain/catalog';
import { canAddStem, createEmptyDraft } from '../../domain/bouquet/draft';
import type { DraftAction } from '../../domain/bouquet/draft';
import {
  canUndo,
  createHistory,
  reduceHistory,
  type DraftHistory,
  type HistoryAction,
} from '../../domain/bouquet/history';
import type { ArrangementStyle, Point } from '../../domain/bouquet/types';
import { BouquetCanvas } from './BouquetCanvas';
import { FlowerTray } from './FlowerTray';
import { StemActions } from './StemActions';
import { WrapPicker } from './WrapPicker';

const NOTICE_MS = 2500;
const styles: ArrangementStyle[] = ['bouquet', 'basket'];

function reducer(history: DraftHistory, action: HistoryAction): DraftHistory {
  return reduceHistory(history, action, bouquetContext);
}

export function BouquetDesigner({ onBack }: { onBack: () => void }) {
  const { rules } = bouquetContext;
  const [history, dispatch] = useReducer(reducer, undefined, () =>
    createHistory(createEmptyDraft(defaultWrapId)),
  );
  const draft = history.present;
  const [selectedId, setSelectedId] = useState<Id | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => headingRef.current?.focus(), []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Selection is UI state; a stem missing from the draft is never selected.
  const selected =
    draft.stems.find((stem) => stem.instanceId === selectedId) ?? null;
  const full = !canAddStem(draft, rules);

  const onMove = useCallback(
    (instanceId: Id, point: Point) =>
      dispatch({ type: 'move', instanceId, ...point }),
    [],
  );
  const onSelect = useCallback(
    (instanceId: Id | null) => setSelectedId(instanceId),
    [],
  );
  // Removing, clearing or undoing ends the selection so a restored stem
  // does not come back already selected.
  const run = (action: HistoryAction) => {
    if (
      action.type === 'remove' ||
      action.type === 'clear' ||
      action.type === 'undo'
    ) {
      setSelectedId(null);
    }
    dispatch(action);
  };
  const onStemAction = (action: DraftAction) => run(action);
  const onStyle = (style: ArrangementStyle) => {
    if (style === draft.arrangementStyle) return;
    dispatch({ type: 'setStyle', style });
    if (draft.stems.length > 0) setNotice(designerCopy.restyled[style]);
  };

  return (
    <main className="designer">
      <header className="designer-bar">
        <button type="button" className="ghost-button" onClick={onBack}>
          ← {designerCopy.back}
        </button>
        <h1 ref={headingRef} tabIndex={-1}>
          {designerCopy.title}
        </h1>
        <div
          className="style-switch"
          role="group"
          aria-label={designerCopy.styleGroupLabel}
        >
          {styles.map((style) => (
            <button
              key={style}
              type="button"
              aria-pressed={draft.arrangementStyle === style}
              onClick={() => onStyle(style)}
            >
              {designerCopy.styles[style]}
            </button>
          ))}
        </div>
      </header>

      <BouquetCanvas
        draft={draft}
        selectedId={selected?.instanceId ?? null}
        onSelect={onSelect}
        onMove={onMove}
      />

      <p className="designer-notice" role="status">
        {notice ?? (full ? designerCopy.full(rules.maxStems) : '')}
      </p>

      {selected ? (
        <StemActions
          stem={selected}
          stems={draft.stems}
          dispatch={onStemAction}
        />
      ) : draft.arrangementStyle === 'bouquet' ? (
        <WrapPicker
          wrapId={draft.wrapId}
          onChange={(wrapId) => dispatch({ type: 'setWrap', wrapId })}
        />
      ) : (
        <div className="context-row" aria-hidden="true" />
      )}

      <FlowerTray
        draft={draft}
        disabled={full}
        onAdd={(flowerId) => dispatch({ type: 'add', flowerId })}
      />

      <footer className="designer-footer">
        <button
          type="button"
          className="ghost-button"
          disabled={!canUndo(history)}
          onClick={() => run({ type: 'undo' })}
        >
          ↶ {designerCopy.undo}
        </button>
        <span className="stem-count">
          {designerCopy.stemCount(draft.stems.length, rules.maxStems)}
        </span>
        <button
          type="button"
          className="ghost-button"
          disabled={draft.stems.length === 0}
          onClick={() => run({ type: 'clear' })}
        >
          {designerCopy.clear}
        </button>
      </footer>
    </main>
  );
}
```

- [ ] **Step 7: Add the styles**

```css
.designer {
  width: 100%;
  max-width: var(--shop-width);
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  padding: calc(var(--space-3) + var(--safe-top))
    calc(var(--space-4) + var(--safe-right))
    calc(var(--space-3) + var(--safe-bottom))
    calc(var(--space-4) + var(--safe-left));
  background: var(--cream-50);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.designer-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-2);
}
.designer-bar h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.25rem;
  text-align: center;
}
.designer-bar h1:focus {
  outline: none;
}
.ghost-button {
  border: 0;
  background: none;
  color: var(--ink-900);
  padding-inline: var(--space-2);
  border-radius: var(--radius-small);
}
.ghost-button:disabled {
  color: var(--ink-600);
  opacity: 0.5;
}
.style-switch {
  display: flex;
  padding: 2px;
  border-radius: var(--radius-button);
  background: var(--cream-100);
}
.style-switch button,
.wrap-swatch,
.action-chip {
  border: 1px solid transparent;
  background: none;
  color: var(--ink-900);
  border-radius: var(--radius-small);
  padding-inline: var(--space-3);
  font-size: var(--text-small);
}
.style-switch button[aria-pressed='true'],
.wrap-swatch[aria-pressed='true'] {
  background: var(--paper);
  border-color: var(--sage-700);
  font-weight: 600;
}

.bouquet-plane {
  position: relative;
  width: min(100%, calc(52dvh * 0.8));
  aspect-ratio: 4 / 5;
  margin-inline: auto;
  flex-shrink: 0;
  background: var(--paper);
  border: 1px solid var(--border-warm);
  border-radius: var(--radius-card);
  overflow: hidden;
  touch-action: none;
}
.plane-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.plane-hint {
  position: absolute;
  inset: 38% 12% auto;
  margin: 0;
  text-align: center;
  color: var(--ink-600);
  font-size: var(--text-small);
  pointer-events: none;
}
.stem-head {
  /* Hit area is smaller than the art so overlapping heads stay tappable. */
  position: absolute;
  width: max(var(--touch-target), 16%);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  animation: stem-pop var(--motion-micro) var(--ease-soft);
}
.stem-head svg {
  position: absolute;
  inset: -32%;
  width: 164%;
  height: 164%;
  display: block;
  pointer-events: none;
}
.stem-head[data-dragging] {
  cursor: grabbing;
  scale: 1.05;
  filter: drop-shadow(var(--shadow-float));
}
.stem-head[aria-pressed='true']::after {
  content: '';
  position: absolute;
  inset: -24%;
  border: 2px dashed var(--sage-700);
  border-radius: 50%;
}
@keyframes stem-pop {
  from {
    opacity: 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.designer-notice {
  min-height: 1.5em;
  margin: 0;
  text-align: center;
  font-size: var(--text-small);
  color: var(--sage-700);
}
.context-row {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
  min-height: var(--touch-target);
}
.swatch-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: var(--space-1);
  border-radius: 50%;
  border: 1px solid var(--border-warm);
  vertical-align: -2px;
}
[data-wrap='wrap-cream'] .swatch-dot {
  background: var(--cream-100);
}
[data-wrap='wrap-blush'] .swatch-dot {
  background: var(--rose-300);
}
[data-wrap='wrap-kraft'] .swatch-dot {
  background: var(--kraft-300);
}
.action-chip {
  background: var(--paper);
  border-color: var(--border-warm);
}
.action-chip:disabled {
  opacity: 0.45;
}

.flower-tray {
  display: flex;
  gap: var(--space-2);
  margin: 0 calc(-1 * var(--space-4));
  padding: var(--space-1) var(--space-4);
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;
}
.tray-card {
  position: relative;
  width: 80px;
  padding: var(--space-2) var(--space-1);
  display: grid;
  justify-items: center;
  gap: var(--space-1);
  border: 1px solid var(--border-warm);
  border-radius: var(--radius-small);
  background: var(--paper);
  color: var(--ink-900);
  scroll-snap-align: start;
}
.tray-card svg {
  width: 44px;
  height: 44px;
}
.tray-card:disabled {
  opacity: 0.45;
}
.tray-name {
  font-size: 0.75rem;
  line-height: 1.3;
}
.tray-count {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
  padding: 0 var(--space-1);
  border-radius: var(--radius-small);
  background: var(--sage-700);
  color: var(--paper);
  font-size: 0.7rem;
}
.designer-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stem-count {
  font-size: var(--text-small);
  color: var(--ink-600);
}

.art-red {
  fill: var(--flower-red);
}
.art-red-deep {
  fill: var(--flower-red-deep);
}
.art-pink {
  fill: var(--rose-300);
}
.art-pink-deep {
  fill: none;
  stroke: var(--rose-500);
  stroke-width: 3;
  stroke-linejoin: round;
}
.art-yellow {
  fill: var(--flower-yellow);
}
.art-seed {
  fill: var(--flower-seed);
}
.art-white {
  fill: var(--paper);
  stroke: var(--border-warm);
  stroke-width: 1.5;
}
.art-leaf {
  fill: var(--sage-500);
}
.art-stem {
  fill: none;
  stroke: var(--sage-700);
  stroke-width: 1.2;
  stroke-linecap: round;
}
.art-wrap-cream {
  fill: var(--cream-100);
}
.art-wrap-blush {
  fill: var(--rose-300);
}
.art-wrap-kraft {
  fill: var(--kraft-300);
}
.art-tie {
  fill: var(--sage-700);
}
.art-basket {
  fill: var(--basket-500);
}
.art-basket-handle {
  stroke: var(--basket-700);
  stroke-width: 3;
}
.art-basket-weave {
  fill: none;
  stroke: var(--basket-700);
  stroke-width: 1;
}
```

- [ ] **Step 8: Import them** — in `src/styles/global.css`, directly below `@import './tokens.css';`, add:

```css
@import './designer.css';
```

- [ ] **Step 9: Run and confirm it passes**

Run: `npx vitest run src/features && npm run typecheck && npm run lint`
Expected: 10 tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/features/bouquet src/styles/designer.css src/styles/global.css
git commit -m "feat(m1): bouquet designer screen with tray, wraps and stem tools"
```

### Task 11: Shop entry and M0 polish

**Files:**
- Modify: `src/app/App.tsx`, `src/app/App.test.tsx`, `src/content/shell.ts`, `src/styles/global.css`, `src/components/ShopScene.tsx`

The M0 shell promised "no gameplay controls"; it now gets exactly one real button. The preparation note is replaced by that button. The window-note fix resolves the M0 P2 finding (petals covering "hoa & những điều dịu dàng").

- [ ] **Step 1: Update the shell test first**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('application shell', () => {
  it('opens directly into a named shop with a truthful preparation state', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tiệm Hoa Nhỏ' }),
    ).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Tiệm đang được chuẩn bị',
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('gives the storefront a single accessible description', () => {
    render(<App />);
    expect(
      screen.getByRole('img', { name: /Mặt tiền tiệm hoa/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('enters the designer and returns to the shop', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Vào xếp hoa' }));
    const heading = screen.getByRole('heading', { level: 1, name: 'Xếp hoa' });
    expect(heading).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /Quay lại/ }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tiệm Hoa Nhỏ' }),
    ).toBeVisible();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/app`
Expected: FAIL — no button named `Vào xếp hoa`.

- [ ] **Step 3: Switch screens in App**

```tsx
import { useState } from 'react';
import { ShopScene } from '../components/ShopScene';
import { designerCopy } from '../content/designer';
import { shellCopy } from '../content/shell';
import { BouquetDesigner } from '../features/bouquet/BouquetDesigner';

type Screen = 'shop' | 'designer';

export function App() {
  const [screen, setScreen] = useState<Screen>('shop');

  if (screen === 'designer') {
    return <BouquetDesigner onBack={() => setScreen('shop')} />;
  }

  return (
    <main className="shop-shell">
      <header className="brand">
        <p className="eyebrow">{shellCopy.eyebrow}</p>
        <h1>{shellCopy.title}</h1>
        <p className="brand-subtitle">{shellCopy.subtitle}</p>
      </header>
      <ShopScene />
      <section className="welcome" aria-labelledby="welcome-title">
        <h2 id="welcome-title">{shellCopy.welcome}</h2>
        <p>{shellCopy.introduction}</p>
      </section>
      <aside className="preparation">
        <p className="preparation-status" role="status">
          <span className="status-dot" aria-hidden="true" />
          {shellCopy.status}
        </p>
        <button
          type="button"
          className="primary-action"
          onClick={() => setScreen('designer')}
        >
          {designerCopy.enter}
        </button>
      </aside>
      <footer className="shop-footer">{shellCopy.footer}</footer>
    </main>
  );
}
```

- [ ] **Step 4: Remove the unused preparation copy**

```diff
--- a/src/content/shell.ts
+++ b/src/content/shell.ts
@@ -10,7 +10,5 @@
   introduction:
     'Nắng đã ghé bên cửa sổ. Một tiệm hoa nhỏ đang chờ những câu chuyện của bạn.',
   status: 'Tiệm đang được chuẩn bị',
-  preparation:
-    'Những bó hoa đầu tiên sẽ sớm có mặt. Hẹn bạn một ngày thật dịu dàng.',
   footer: 'Chậm một chút, để ngắm hoa.',
 } as const;
```

- [ ] **Step 5: Style the button** (replace the `.preparation-note` rule)

```diff
--- a/src/styles/global.css
+++ b/src/styles/global.css
@@ -178,10 +178,16 @@
   border-radius: 50%;
   flex-shrink: 0;
 }
-.preparation-note {
-  font-size: var(--text-small);
-  color: var(--ink-600);
-  margin: 0;
+.primary-action {
+  display: block;
+  margin: var(--space-3) auto 0;
+  padding: var(--space-2) var(--space-6);
+  border: 0;
+  border-radius: var(--radius-button);
+  background: var(--sage-700);
+  color: var(--paper);
+  font-weight: 600;
+  box-shadow: var(--shadow-soft);
 }
 .shop-footer {
   color: var(--ink-600);
```

- [ ] **Step 6: Raise the window note above the planter**

```diff
--- a/src/components/ShopScene.tsx
+++ b/src/components/ShopScene.tsx
@@ -128,20 +128,20 @@
       <path d="M177 299H287" className="scene-line" />
       <rect
         x="63"
-        y="180"
+        y="160"
         width="88"
         height="28"
         rx="2"
         className="scene-paper"
-        transform="rotate(-4 107 194)"
+        transform="rotate(-4 107 174)"
       />
       <text
         x="107"
-        y="197"
+        y="177"
         fontSize="7.7"
         textAnchor="middle"
         className="scene-lettering"
-        transform="rotate(-4 107 194)"
+        transform="rotate(-4 107 174)"
       >
         {shellCopy.windowNote}
       </text>
```

- [ ] **Step 7: Run and confirm it passes**

Run: `npm test && npm run typecheck && npm run lint && npm run format:check`
Expected: 57 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/app src/content/shell.ts src/styles/global.css src/components/ShopScene.tsx
git commit -m "feat(m1): enter the designer from the shop shell"
```

### Task 12: Browser coverage on Chromium and WebKit

**Files:**
- Modify: `playwright.config.ts`, `e2e/shell.spec.ts`, `.github/workflows/ci.yml`
- Create: `e2e/designer.spec.ts`

Chromium drives real touch through CDP (`Input.dispatchTouchEvent`), so a missing `touch-action` makes the browser take the gesture and the drag assertion fail. WebKit has no CDP and receives touch-type pointer events, which proves the pointer path but not scroll arbitration; that is covered on a real iPhone in Task 13.

- [ ] **Step 1: Add projects**

```ts
import { defineConfig } from '@playwright/test';

const mobile = {
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', ...mobile } },
    {
      // Safari engine for the touch designer; the PWA shell suite stays on Chromium.
      name: 'webkit',
      testMatch: 'designer.spec.ts',
      use: { browserName: 'webkit', ...mobile },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
```

- [ ] **Step 2: Update the shell suite's button expectation**

```diff
--- a/e2e/shell.spec.ts
+++ b/e2e/shell.spec.ts
@@ -39,7 +39,7 @@
       'Tiệm đang được chuẩn bị',
     );
     await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
-    await expect(page.getByRole('button')).toHaveCount(0);
+    await expect(page.getByRole('button')).toHaveText(['Vào xếp hoa']);
     expect(
       await page.evaluate(
         () => document.documentElement.scrollWidth <= window.innerWidth,
```

- [ ] **Step 3: Add the designer suite**

```ts
import { expect, test, type Locator, type Page } from '@playwright/test';

async function openDesigner(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Vào xếp hoa' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Xếp hoa' }),
  ).toBeVisible();
}

async function addFlowers(page: Page, names: string[]) {
  const tray = page.getByRole('list', { name: 'Khay hoa' });
  for (const name of names) await tray.getByRole('button', { name }).click();
}

const plane = (page: Page) =>
  page.getByRole('group', { name: 'Khung xếp hoa' });

async function center(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element not visible');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/**
 * Real touch input on Chromium (CDP), so a missing touch-action would scroll
 * the page. WebKit has no CDP; it gets touch-type pointer events instead.
 */
async function touchDrag(
  page: Page,
  browserName: string,
  target: Locator,
  dx: number,
  dy: number,
) {
  const from = await center(target);
  const steps = 8;
  if (browserName === 'chromium') {
    const cdp = await page.context().newCDPSession(page);
    const send = (
      type: 'touchStart' | 'touchMove' | 'touchEnd',
      x: number,
      y: number,
    ) =>
      cdp.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
      });
    await send('touchStart', from.x, from.y);
    for (let step = 1; step <= steps; step += 1) {
      await send(
        'touchMove',
        from.x + (dx * step) / steps,
        from.y + (dy * step) / steps,
      );
    }
    await send('touchEnd', from.x + dx, from.y + dy);
    return;
  }
  const init = (x: number, y: number) => ({
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    clientX: x,
    clientY: y,
    button: 0,
    buttons: 1,
    bubbles: true,
  });
  await target.dispatchEvent('pointerdown', init(from.x, from.y));
  for (let step = 1; step <= steps; step += 1) {
    await target.dispatchEvent(
      'pointermove',
      init(from.x + (dx * step) / steps, from.y + (dy * step) / steps),
    );
  }
  await target.dispatchEvent('pointerup', init(from.x + dx, from.y + dy));
}

test('adds, drags, selects and removes stems without scrolling the page', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await openDesigner(page);
  await addFlowers(page, ['Hồng đỏ', 'Tulip hồng', 'Eucalyptus']);
  const stems = plane(page).getByRole('button');
  await expect(stems).toHaveCount(3);

  const rose = plane(page).getByRole('button', { name: 'Hồng đỏ, cành 1' });
  const before = await center(rose);
  const scrollBefore = await page.evaluate(() => ({
    y: window.scrollY,
    scale: window.visualViewport?.scale ?? 1,
  }));
  await touchDrag(page, browserName, rose, 50, -30);
  const after = await center(rose);
  expect(
    Math.abs(after.x - before.x) + Math.abs(after.y - before.y),
  ).toBeGreaterThan(20);
  expect(
    await page.evaluate(() => ({
      y: window.scrollY,
      scale: window.visualViewport?.scale ?? 1,
    })),
  ).toEqual(scrollBefore);
  await expect(rose).toHaveAttribute('aria-pressed', 'false');

  await rose.click();
  await expect(rose).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Xoá' }).click();
  await expect(stems).toHaveCount(2);
  await page.getByRole('button', { name: /Hoàn tác/ }).click();
  await expect(stems).toHaveCount(3);
});

test('keeps stem positions proportional when the viewport changes', async ({
  page,
}) => {
  await openDesigner(page);
  await addFlowers(page, ['Hướng dương', 'Cúc họa mi']);
  const relative = async () => {
    const box = await plane(page).boundingBox();
    const head = await center(
      plane(page).getByRole('button', { name: 'Hướng dương, cành 1' }),
    );
    if (!box) throw new Error('plane missing');
    return {
      x: (head.x - box.x) / box.width,
      y: (head.y - box.y) / box.height,
    };
  };
  const wide = await relative();
  await page.setViewportSize({ width: 360, height: 640 });
  const narrow = await relative();
  expect(narrow.x).toBeCloseTo(wide.x, 2);
  expect(narrow.y).toBeCloseTo(wide.y, 2);
});

test('switches style and wraps, fits 360px and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 800 });
  await openDesigner(page);
  await addFlowers(page, ['Hồng đỏ', "Baby's breath"]);
  await page.getByRole('button', { name: /Giấy kraft/ }).click();
  await expect(
    page.getByRole('button', { name: /Giấy kraft/ }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Lẵng' }).click();
  await expect(plane(page)).toHaveAttribute('data-style', 'basket');
  await expect(page.getByRole('status')).toHaveText(
    'Đã xếp lại theo dáng lẵng',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
});

test('tray scrolls sideways and stops adding at nine stems', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openDesigner(page);
  const tray = page.getByRole('list', { name: 'Khay hoa' });
  const overflow = await tray.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  if (overflow) {
    await tray.evaluate((element) => element.scrollBy({ left: 200 }));
    expect(
      await tray.evaluate((element) => element.scrollLeft),
    ).toBeGreaterThan(0);
  }
  for (let index = 0; index < 11; index += 1) {
    const card = tray.getByRole('button', { name: 'Hồng đỏ' });
    if (await card.isDisabled()) break;
    await card.click();
  }
  await expect(plane(page).getByRole('button')).toHaveCount(9);
  await expect(page.getByRole('status')).toContainText('Bó đã đủ 9 cành');
});
```

- [ ] **Step 4: Install WebKit in CI**

```diff
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -24,7 +24,7 @@
       - run: npm run typecheck
       - run: npm test
       - run: npm run build
-      - run: npx playwright install --with-deps chromium
+      - run: npx playwright install --with-deps chromium webkit
       - run: npx playwright test
       - uses: actions/upload-artifact@v7
         if: always()
```

- [ ] **Step 5: Run**

Run: `npm run test:e2e`
Expected: Chromium 11 PASS (7 shell + 4 designer); WebKit 4 PASS. If WebKit cannot start locally because of missing system libraries, run `npx playwright test --project=chromium`, record WebKit as NOT RUN locally, and rely on CI.

- [ ] **Step 6: Prove the scroll assertion bites** (do not commit this change)

```bash
sed -i 's/touch-action: none;/touch-action: auto;/g' src/styles/designer.css
npm run build && npx playwright test --project=chromium -g "adds, drags"
git checkout src/styles/designer.css
```

Expected: the drag test FAILS with `Expected: > 20, Received: 0`, then the file is restored.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts e2e .github/workflows/ci.yml
git commit -m "test(m1): touch designer E2E on Chromium and WebKit"
```

### Task 13: Visual tuning, real devices and performance

**Files:**
- Modify (tuning only): `src/content/bouquetRules.ts`, `src/components/art/*`, `src/styles/designer.css`, `src/styles/tokens.css`
- Create: `docs/m1-bouquet-verification.md`

Known items from planning screenshots at 390x844:
- Pink tulip almost disappears on the blush wrap. Give the tulip a deeper outline or petal shade.
- The selected-stem toolbar wraps to two rows. Acceptable; icon buttons are optional polish.
- After adding stems the tray keeps its scroll position. Acceptable.

- [ ] **Step 1: Tune** slot tables, art and colors until random 9-stem Bó and Lẵng arrangements look intentional. Change numbers only in `bouquetRules.ts`. After tuning: `npx vitest run -u src/domain/bouquet/compose.test.ts`, inspect the snapshot diff, and keep every other test green.

- [ ] **Step 2: Real devices.** Run `npm run build && npx vite preview --host 0.0.0.0 --port 4173` and open `http://<LAN-IP>:4173` on an iPhone (Safari) and an Android phone (Chrome). For each phone record PASS/FAIL for:
  - Bó and Lẵng: add 9 stems; drag every role; drag to every edge; release outside the plane.
  - No page scroll, rubber-band or zoom while dragging inside the plane; the tray still scrolls sideways.
  - Long-press on a head shows no callout or text selection.
  - Double-tap on a tray card adds two stems and does not zoom.
  - Select → rotate, resize, Lên trước / Ra sau, Xoá, Hoàn tác, Làm lại; switch wraps; switch Bó ↔ Lẵng and undo.
  - Subjective: does dragging feel immediate? Does the result look composed?

- [ ] **Step 3: Performance.** Use Chrome DevTools on desktop or remote-debug Android. Record a Performance trace while dragging for 5 seconds with 4× CPU throttling: no long task over 50 ms. Use React DevTools Profiler with "Highlight updates": during a drag no component re-renders; on release only the moved StemView, StemLayer and the canvas render.

- [ ] **Step 4: Write `docs/m1-bouquet-verification.md`** with the environment, the exact commands and results, the device matrix, performance numbers, screenshots at 360x800 / 390x844 (both styles, selected state) and an explicit NOT RUN list.

- [ ] **Step 5: Full verification, push and open a PR**

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run test:e2e && git diff --check
git add -A src docs/m1-bouquet-verification.md
git commit -m "chore(m1): tune bouquet art and record device verification"
git push -u origin feature/m1-bouquet-ui
gh pr create --base main --title "feat(m1): bouquet designer UI" --body "Implements Part B of docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md"
```

- [ ] **Step 6: Hand off** to Claude in the standard format, with CI results and the device matrix. Do not merge without review.

---

# Part C — Docs and review (Claude)

### Task 14: Decision record, product docs and reviews

**Files:**
- Modify: `docs/12_DECISIONS.md`, `docs/02_GAME_DESIGN.md`, `docs/08_IMPLEMENTATION_PLAN.md`, `docs/09_TASK_BACKLOG.md`

- [ ] **Step 1: Add D-007 to docs/12** (status proposed):

```markdown
## D-007 — Pre-made display shelf (Kệ hoa làm sẵn)

**Date:** 2026-10-03

**Status:** proposed

**Decision:** Besides custom orders, let the player compose bouquets and baskets during a preparation phase and display them on a shelf; some customers browse the shelf and choose one that fits their mood instead of placing a custom order.

**Reason:** Rewards free composition without recipe pressure, differentiates from viral recipe-accuracy shop games (Tiệm Mì Cay, Tiệm Trà Nhỏ) and gives the preparation phase creative work instead of stock-taking.

**Alternatives considered:** Custom orders only (current PRD); timed rush service (rejected: players report exhaustion).

**Consequences:** Needs shelf capacity, customer browsing/matching rules and a PRD update. Not before the Milestone 1 prototype proves the designer feels good. Milestone 1 only adds `arrangementStyle` to the draft.
```

- [ ] **Step 2: docs/02 §3.** Add "Arrangement styles: Bó (stems meet at a binding point, tall fan, wrap) and Lẵng (stems stand in a basket rim, wide low dome). The style is player-chosen; switching re-composes the stems." Add rotate (±15°, ±60° max), three sizes, layer reorder and undo to the player adjustments.

- [ ] **Step 3: docs/08 Milestone 1.** Change "Wrap preview" to "Wrap preview (3 wraps) and Bó/Lẵng arrangement styles"; add "Exit evidence: docs/m1-bouquet-verification.md".

- [ ] **Step 4: docs/09.** Add `B-14 Add Bó/Lẵng arrangement styles.` and `B-15 Add stem resize and layer reorder.` under EPIC B.

- [ ] **Step 5: Commit** on `chore/m1-bouquet-spec` with the spec and this plan, and open a docs PR.

- [ ] **Step 6: Review Part A** against spec §6–7 and this plan's interfaces; **review Part B** against spec §8–11, the Review Focus list and the device matrix. Report findings as P0/P1/P2 with file/flow/viewport and the smallest fix.

---

## Execution handoff

Part A and Part B are owned by Codex and Antigravity, per docs/13_MULTI_AGENT_WORKFLOW.md. Each agent executes its part task by task with superpowers:executing-plans (or subagent-driven-development if available), on its own branch, and hands back in the standard format.
