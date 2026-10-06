# Milestone 1 Verification — Bouquet Designer

## Scope

Milestone 1 Bouquet Interaction Prototype verification completed on `feature/m1-bouquet-ui` (Lane B Phase 2) in worktree `../tiemhoa-m1-ui`.
Tasks 8–12 integrated onto `origin/main` with the temporary domain scaffold (`0250b58`) completely dropped via rebase.
Task 13 tuning, snapshot updates, performance traces, and verification evidence recorded.

## Executed Checks

Environment: Linux (x86_64), Node 22.20.0, npm 10.9.3, Playwright 1.53.0 (Chromium 153.0.8010.12, WebKit 20.4).

| Command / Check | Result | Evidence |
|---|---|---|
| `git rebase --onto origin/main 0250b58` | PASS | Rebased cleanly onto `origin/main` (Lane A domain + Lane C docs merged). TEMP scaffold dropped without conflict. |
| `npm ci` | PASS | Clean dependency install against committed package-lock.json. |
| `npm run format:check` | PASS | Prettier checks all application, component, content, styles, and test files with zero warnings. |
| `npm run lint` | PASS | ESLint passes with `--max-warnings 0` across all workspaces. |
| `npm run typecheck` | PASS | Strict TypeScript compiler (`tsc --noEmit`) passes with 0 errors. |
| `npm test` | PASS | 57 unit/component tests pass: 44 domain & content tests + 3 App shell tests + 10 BouquetDesigner tests. |
| `npm run test:e2e` | PASS | 15 E2E tests pass (11 Chromium mobile + 4 WebKit mobile) in 8.1s. |
| `npx vitest run -u src/domain/bouquet/compose.test.ts` | PASS | Snapshot updated for basket foliage tuning; 12/12 compose tests pass. |
| Mutation test on `touch-action: none` | PASS | Temporarily replacing with `touch-action: auto` failed drag assertion (`Expected: > 20, Received: 0`), proving scroll arbitration enforcement. |
| `git diff --check` | PASS | Clean diff with zero whitespace or conflict errors. |

## Integrator P2 Findings Resolved

1. **Selection ring visibility behind overlapping heads:**
   - **Problem:** Back-band stems (e.g. foliage with zIndex ~100) had their selection ring (`::after`) obscured by higher zIndex heads when selected.
   - **Fix:** In `src/styles/designer.css`, added `.stem-head[aria-pressed=true] { z-index: 600 !important; }`. Visual elevation only; `stem.zIndex` in draft domain state is untouched.

2. **Lẵng at 360x800 eucalyptus clipping:**
   - **Problem:** The basket dome region bounded only the center point; foliage head art extends outward, causing eucalyptus at x=0.06 to clip against the left plane edge.
   - **Fix:** In `src/content/bouquetRules.ts`, tightened `basketProfile.region.rx` from 0.46 to 0.42 and shifted outer foliage slots from x=0.06/0.94 to x=0.12/0.88, ensuring all head art stays completely within the canvas bounds.

3. **Pink tulip contrast on blush wrap (`Giấy hồng phấn`):**
   - **Problem:** Pink tulip petals and blush wrap previously shared `--rose-300`, causing the tulip to blend into the wrap.
   - **Fix:** Added `--flower-pink: #f5a6b0` and `--flower-pink-outline: #be5363` in `src/styles/tokens.css`. Updated `.art-pink` in `src/styles/designer.css` with a 2px deep outline and rich petal fill.

### Compose Snapshot Diff
- Basket arrangement: `eucalyptus#8` moved from x=0.1132 to x=0.1532; `eucalyptus#9` moved from x=0.8939 to x=0.8539. Minor fan angle adjustments in other basket stems reflecting the tighter `rx`.
- Bouquet arrangement: 100% identical and unchanged.

## Performance and Profiler Measurements

1. **4× CPU Throttled Drag Trace:**
   - Method: Chromium CDP session with `Emulation.setCPUThrottlingRate({ rate: 4 })`. Continuous touch dragging for 5,000 ms (50 touch move dispatches).
   - Metric: `PerformanceObserver` observing `longtask` entries (> 50 ms).
   - Result: **0 long tasks (> 50 ms)** recorded during active gesture execution.
2. **React Render Isolation:**
   - Architecture: `useStemDrag` mutates `element.style.translate` and updates SVG path `d` directly via ref during drag.
   - Profiler: 0 component re-renders during active drag motion. Re-render occurs exactly once on pointerup commit.

## Device and Browser Matrix

| Device / Browser | Target Viewport | Status | Notes |
|---|---|---|---|
| Chromium (Mobile CDP) | 390x844 | PASS | Real touch events dispatched via CDP; full E2E flow verified. |
| Chromium (Mobile CDP) | 360x800 | PASS | Tray scrolling, 360px no-overflow, 9-stem limit verified. |
| Chromium (Mobile CDP) | 375x667 | PASS | Touch drag with scroll isolation verified. |
| Chromium (Mobile CDP) | 430x932 | PASS | Responsive canvas scaling verified. |
| WebKit (Mobile Pointer) | 390x844 | PASS | All 4 designer E2E tests pass. |
| WebKit (Mobile Pointer) | 360x800 | PASS | Style switch, reduced motion, and tray sideways scroll pass. |
| Physical iPhone (Safari) | Hardware | NOT RUN | Physical device unavailable in Linux headless development environment. |
| Physical Android (Chrome) | Hardware | NOT RUN | Physical device unavailable in Linux headless development environment. |

## Visual Screenshots

Screenshots captured from production preview builds at `360x800` and `390x844` across all core states:
- `docs/screenshots/390x844-bouquet-empty.png`
- `docs/screenshots/390x844-bouquet-9stems.png`
- `docs/screenshots/390x844-bouquet-selected.png` (Pink tulip on blush wrap with elevated selection ring)
- `docs/screenshots/390x844-basket-empty.png`
- `docs/screenshots/390x844-basket-9stems.png`
- `docs/screenshots/390x844-basket-selected.png`
- `docs/screenshots/360x800-bouquet-empty.png`
- `docs/screenshots/360x800-bouquet-9stems.png`
- `docs/screenshots/360x800-bouquet-selected.png`
- `docs/screenshots/360x800-basket-empty.png`
- `docs/screenshots/360x800-basket-9stems.png` (Eucalyptus on left edge within bounds)
- `docs/screenshots/360x800-basket-selected.png`

## Explicit NOT RUN List

1. Physical iPhone Safari gesture arbitration and tactile haptic review (marked NOT RUN due to headless environment).
2. Physical Android Chrome touch response on mid-range hardware (marked NOT RUN due to headless environment).
3. Production server deployment and subpath hosting (MVP runs locally / preview).
