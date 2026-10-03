# Skill: Performance Budget

## Purpose

Protect mobile responsiveness and visual quality with measurable targets instead of premature optimization or unbounded effects.

## When to Use

Use when changing bouquet drag, rendering, React subscriptions, assets, particles, image export, loading, bundle size or long-running browser work. Read docs/05_TECH_ARCHITECTURE.md and docs/10_TESTING_QA.md first.

## Rules

- Treat one-frame interaction response and a 60fps target during bouquet drag on common mid-range mobile hardware as goals to measure.
- Avoid rerendering every placed stem on every pointer event when local transforms or a throttled commit can preserve responsiveness.
- Prefer transform/opacity animation over layout and expensive filters.
- Lazy-load diary/history/seasonal content and non-core assets.
- Bound particles, DOM nodes, texture memory and allocations; calm ambient effects are better than unlimited effects.
- Compress assets and record dimensions; do not use image export or decoding on the critical interaction path without measuring.
- Use browser performance tools to inspect long tasks, frame drops, memory and network payloads once an app exists.
- Record the device, viewport, browser and flow for a performance finding; do not convert an unmeasured target into a hard guarantee.

## Suggested targets

- Bouquet drag remains visually responsive at 390x844 on a common mid-range mobile device.
- No known long task blocks a core tap or delivery action.
- Core shell loads only core content before first interaction; non-core screens are lazy.
- Asset and JS payloads are measured in the build and reviewed when they change materially.
- Image/texture memory is bounded by loading only the current scene and required bouquet assets.

## Forbidden Patterns

- Huge initial bundle or preload of all game content.
- Constant allocations inside pointermove/render loops.
- Unbounded particles, DOM nodes or texture memory.
- Expensive blur/filter stacks used as a default visual treatment.
- Layout-property animation when transform/opacity is viable.
- Claiming an FPS, bundle or memory result without a measured profile.
- Adding a renderer/game engine as a performance guess rather than evidence.

## Examples

Good: pointer movement updates a local visual transform and commits normalized coordinates on release; a profile checks frame time and rerender count.

Bad: every pointermove updates a global store, rerenders the entire shop and starts a new particle array.

## Checklist

- What user-visible interaction or payload is at risk?
- What device/viewport/flow was measured?
- Are React rerenders, layout work and allocations bounded?
- Are images/assets compressed and loaded by priority?
- Is the animation GPU-friendly and reduced-motion safe?
- Are targets described as measured goals rather than promises?
- Does evidence justify a new dependency or renderer?

## Definition of Done

A performance change is ready when the affected flow has a measurable target, a recorded profile or an explicit not-applicable statement, and no obvious new bundle, memory or interaction regression.
