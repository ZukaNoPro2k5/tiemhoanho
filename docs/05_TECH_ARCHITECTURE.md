# Technical Architecture

## 1. Architecture principle

MVP is a client-first web game. Keep domain logic deterministic and portable. Do not add server complexity until a feature actually requires shared/cloud state.

## 2. Recommended stack

For a new project:

- Vite
- React
- TypeScript strict
- Tailwind CSS
- Motion
- Zustand
- Vitest + Testing Library
- Playwright
- vite-plugin-pwa

Use the current stable versions at project initialization. Lock versions in the package manager lockfile.

### Milestone 0 implementation

The actual foundation uses Vite/React/strict TypeScript, CSS variables integrated with Tailwind, Vitest/Testing Library, Playwright and vite-plugin-pwa. Motion, Zustand and a router are deferred until real consumers exist. Only `app`, `components`, `content`, `styles` and test setup exist under `src`; the structure below describes future gameplay work, not directories to scaffold now. See [ADR-002](decisions/002-m0-application-foundation.md).

## 3. Proposed source structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   └── game/
├── features/
│   ├── shop/
│   ├── orders/
│   ├── bouquet/
│   ├── reaction/
│   ├── diary/
│   └── day-summary/
├── domain/
│   ├── bouquet/
│   │   ├── scoreBouquet.ts
│   │   ├── composeStem.ts
│   │   └── types.ts
│   ├── economy/
│   ├── orders/
│   └── progression/
├── content/
│   ├── flowers.ts
│   ├── materials.ts
│   ├── customers.ts
│   └── orders.ts
├── store/
│   ├── gameStore.ts
│   ├── persistence.ts
│   └── migrations.ts
├── lib/
├── styles/
└── assets/
```

## 4. Separation rules

### Domain layer

Pure TypeScript. No React imports. Must be unit-testable without DOM.

Contains:

- scoring;
- order generation;
- pricing;
- progression;
- deterministic bouquet placement helper;
- day summary calculations.

### Feature layer

Coordinates UI and store operations.

### Content layer

Static data only. No component logic.

### Store

Holds game state and mutation actions. Do not put rendering concerns here.

## 5. Rendering bouquet

Start with DOM/SVG layering.

Each stem is absolutely positioned in a normalized composition plane. Transform should use:

```text
translate(x, y) rotate(rotation) scale(scale)
```

Prefer GPU-friendly transforms. During drag, avoid React state churn on every pointer event if it causes frame drops; use local transient transform and commit normalized state at end or throttle updates.

A game engine is a fallback, not a default dependency.

## 6. Persistence

MVP local save:

```ts
interface PersistedSave {
  schemaVersion: number;
  savedAt: string;
  game: SerializableGameState;
}
```

Rules:

- Never persist derived UI state.
- Add a migration for each incompatible schema change.
- If migration fails, preserve the raw save long enough to offer reset/recovery rather than crashing.

## 7. Share card

Generate from stable bouquet data, not a screenshot of arbitrary current DOM where possible.

Implementation choices:

1. Render a dedicated share-card component/canvas at known dimensions.
2. Export image.
3. Use Web Share API with file support when available.
4. Fallback to save/copy action.

## 8. PWA/offline

Cache:

- app shell;
- static content data;
- flower/material assets required by current build.

Do not cache remote mutable APIs aggressively if introduced later.

## 9. Future backend boundary

If cloud sync/community features are introduced, create a repository/service interface so domain/UI does not bind directly to a vendor SDK.

Possible future service: Supabase or equivalent for auth, save sync, challenge submissions and content delivery. Not part of MVP unless explicitly approved.

## 10. Performance budgets

Targets, not excuses:

- Interactions in Bouquet Designer should visually respond within one frame where possible.
- Target 60fps during drag on common mid-range mobile hardware.
- Avoid loading all high-resolution assets before first interaction.
- Lazy-load diary/history screens.
- Compress image assets and provide explicit dimensions.
- Avoid unnecessary rerenders of all placed stems during one-stem drag.

## 11. Security/privacy

MVP stores only game state locally. Do not collect personal information by default.

If analytics is later enabled:

- no customer-identifying data;
- do not transmit freeform user text unless explicitly needed/consented;
- document events in `docs/11_ANALYTICS.md`.
