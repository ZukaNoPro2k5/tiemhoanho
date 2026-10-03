# Skill: Mobile Game UI

## Purpose

Make every TiemHoaWeb interaction comfortable with one hand on a phone before optimizing wider layouts.

## When to Use

Use for layout, touch interaction, sheets, dialogs, navigation, forms, drag gestures, responsive behavior, safe-area handling or accessibility review. Read docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md and docs/10_TESTING_QA.md first.

## Rules

- Design and verify the primary flow at 390x844, then check 375x667 and 430x932 when the layout is affected. Check 360px width for overflow-sensitive work.
- Every critical control has at least a 44x44 CSS px hit area and a visible pressed/focus state.
- Keep the primary action within comfortable thumb reach; use bottom sheets for short contextual choices.
- Use safe-area insets for bottom actions and respect dynamic viewport height. Do not assume 100vh is stable on mobile browsers.
- Keep scrolling and drag interaction separate. Scope pointer capture and touch-action to the bouquet manipulation area.
- Critical behavior must work without hover, pinch or long-press. Provide tap or directional alternatives when drag is not the only reasonable action.
- Test Vietnamese text wrapping, browser bars, notches, keyboard opening and landscape fallback when relevant.
- Color cannot be the only state signal. Preserve contrast and meaningful labels.
- Keep density light; the shop scene should read spatially, not as a dashboard.

## Forbidden Patterns

- Desktop-first layouts merely scaled down.
- Touch targets smaller than 44x44 CSS px.
- Hover-only actions or tiny close icons as the only removal path.
- Full-screen modal stacks for simple choices.
- Fixed bottom controls that ignore safe-area insets.
- Page-scroll conflicts while dragging flowers.
- Horizontal overflow caused by a wide tray, long Vietnamese label or unbounded decoration.

## Examples

Good: a horizontally scrollable flower tray with large items, a bottom action bar padded with safe-area inset and a visible selected quantity.

Bad: a desktop grid squeezed into 360px where the primary action is hidden below an overflowing tray.

## Checklist

- Which viewport was checked: 375x667, 390x844, 430x932 or 360px?
- Are all critical hit areas at least 44x44?
- Can the flow be completed one-handed without hover?
- Are safe-area, browser chrome and dynamic height handled?
- Does text wrap naturally in Vietnamese?
- Is drag isolated from page scrolling?
- Are empty/loading/error/disabled states reachable and understandable?
- Are focus and reduced-motion behaviors preserved?

## Definition of Done

A mobile UI change is ready when the affected flow works at the required viewports without horizontal overflow, hover dependency or unsafe touch targets, and the handoff names the manual/browser evidence.
