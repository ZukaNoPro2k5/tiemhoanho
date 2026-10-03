# Skill: Game State Management

## Purpose

Keep TiemHoaWeb state understandable by separating UI controls, gameplay rules, persistent save data, future server data and transient animation state.

## When to Use

Use when changing stores, reducers, actions, persistence, migrations, session flow, loading/recovery or stateful UI. Read docs/05_TECH_ARCHITECTURE.md and docs/06_DATA_MODEL.md first.

## Rules

| Boundary | Examples | Default home |
|---|---|---|
| UI state | modal open, selected tab, expanded request | component or feature-local state |
| Gameplay state | current order, bouquet draft, active customer | domain/store feature boundary |
| Persistent state | inventory, cash, reputation, diary, day history | versioned save/store layer |
| Server state | future account or cloud sync | explicit repository/service boundary |
| Animation state | drag position, spring progress, particles | local transient state; commit meaningful result |

- Keep domain calculations pure and independent of React/store libraries.
- Persist serializable player facts, not derived UI state or in-flight animation.
- Every incompatible persisted shape increments schemaVersion and has a migration path.
- Treat corrupt or unavailable saves as recoverable states with a reset/export option where feasible.
- Keep actions named by intent, not by component event details.
- Prevent stale state when switching customer/order/day; test transitions and reload.
- Do not bind domain code directly to a vendor SDK.

## Forbidden Patterns

- One global store for every UI, gameplay, persistence and animation concern.
- Persisting modal flags, selected DOM nodes, animation frames or derived scores without a deliberate reason.
- Mutating save objects in place without a version/migration strategy.
- Silent save reset on parse/migration failure.
- React components implementing score, price or progression rules.
- Cloud sync or mandatory accounts added to the client-first MVP by default.

## Examples

Good: a versioned save adapter loads raw data, migrates it to the current SerializableGameState and exposes a recovery state when migration fails.

Bad: a component writes an arbitrary object to localStorage and assumes a future schema can read it forever.

## Checklist

- Which boundary owns this state?
- Is it serializable and worth persisting?
- Is the state transition deterministic and unit-testable?
- Does the schema version/migration path cover incompatible changes?
- What happens when storage is missing, malformed or unavailable?
- Can the UI derive the display instead of duplicating facts?
- Does this introduce server/vendor coupling prematurely?

## Definition of Done

A state change is ready when ownership is explicit, derived/transient data is separated, persistence is versioned and recovery behavior is tested or explicitly marked not applicable.
