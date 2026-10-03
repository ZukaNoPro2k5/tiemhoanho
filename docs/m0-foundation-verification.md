# Milestone 0 verification — 2026-10-03

## Scope

A-01–A-06 completed on `feature/m0-foundation` in `/home/tts/Downloads/tiemhoa-codex`, based on `main` at `7799319`. Codex is the sole implementer. No gameplay, player save, backend, merge, push or deployment was performed.

## Executed checks

Environment: Linux, Node 22.20.0, npm 10.9.3, Playwright Chromium 153.0.8010.12. Dependency versions are committed in the npm lockfile.

| Command / check                                                                  | Result | Evidence                                                                                                                             |
| -------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm install` / `npm ci`                                                         | PASS   | Clean lockfile installation; audit reported 0 vulnerabilities. A transitive glob deprecation warning remains.                        |
| `npm run format` / `npm run format:check`                                        | PASS   | Prettier checks application/configuration, README and the new foundation docs without reformatting existing product docs.            |
| `npm run lint`                                                                   | PASS   | ESLint with zero warnings allowed.                                                                                                   |
| `npm run typecheck`                                                              | PASS   | Strict TypeScript, including app, configs and E2E tests.                                                                             |
| `npm test`                                                                       | PASS   | 2 component tests. Both first failed against the empty App, then passed against the real shell. No domain rules exist yet.           |
| `npm run build`                                                                  | PASS   | Vite production build and generated service worker. Executed through `npm run test:e2e` as well as standalone during implementation. |
| `npm run test:e2e`                                                               | PASS   | 7 smoke checks against production preview, 0 retries locally.                                                                        |
| `npm run icons:generate`                                                         | PASS   | Reproduces 192/512, maskable 512 and Apple 180 PNGs from the local SVG mark.                                                         |
| `npm run dev`                                                                    | PASS   | Dev server launched; an actual Chromium page rendered the heading without page errors.                                               |
| `npm run preview`                                                                | PASS   | Used by browser tests and additional production fallback checks.                                                                     |
| `git diff --check`                                                               | PASS   | No whitespace errors; new source/configuration also checked by formatter/lint/typecheck.                                             |
| `bash -n scripts/setup-worktrees.sh` / `node --check scripts/generate-icons.mjs` | PASS   | Existing worktree helper unchanged; asset helper parses correctly.                                                                   |

## Browser and visual evidence

The suite verifies 360x800, 375x667, 390x844, 430x932 and 1440x900. All have readable shop content, no horizontal overflow and no loading/network/console/page errors during online launch. The 390x844 footer fits in the viewport. Short portrait layouts scroll naturally and the footer remains reachable. Desktop centers a stage no wider than 430px.

Screenshots of all five sizes were inspected directly for hierarchy, Vietnamese glyphs, wrapping and clipping. Evidence is attached to `playwright-report/` and stored in `test-results/shell-production-shell-at-<width>x<height>/shell.png` (ignored generated artifacts). The shop is a non-interactive placeholder; no hover or touch-only action exists. Shared control styles reserve 44px targets and visible focus for future controls, but this milestone claims no gameplay interaction verification.

Reduced-motion emulation leaves the shell readable and has zero running animations. The shell currently has no ambient animation.

The PWA test checks the Vietnamese standalone manifest, real PNG responses and their declared dimensions, a maskable icon, active service-worker control, and successful offline reload of the heading and inline illustration. Its first run caught missing icon files; it passed after generating them. The final worker precaches 10 static entries (232.93 KiB), without duplicate icon entries or runtime API caching.

Additional direct production browser checks passed:

- JavaScript disabled: the HTML no-script message is visible.
- Service workers blocked: the normal shell still loads without page errors.
- Simulated safe-area values (20px top / 34px bottom): computed padding is 52px / 54px, no horizontal overflow, footer reachable.

No asynchronous content, loading queue, gameplay save or inventory exists, so data-empty/loading/recovery states are not applicable to this foundation.

## Build payload

Vite measured the main JS at 225.98 kB (70.86 kB gzip) and CSS at 11.38 kB (3.38 kB gzip). Artwork is inline SVG and fonts are local system faces; there are no font or asset services on the critical rendering path. These are build measurements, not claims about mobile FPS or physical-device performance.

## Self-review and limitations

Reviewed every new source/configuration/test file, the lockfile's root metadata and all modified-document diffs against the assigned milestone. Source/content/styles remain separate, strict types pass, dependencies have immediate consumers, no excluded feature or unrelated agent/worktree changes were introduced. The only gameplay-doc correction is canonical `warm` replacing noncanonical `affection` in the example.

Routing, Motion, Zustand, gameplay persistence and empty feature directories were deliberately deferred (ADR-002). The author performed this review; independent Claude and Antigravity reviews have not been started, as instructed.

NOT RUN: GitHub-hosted CI (workflow added but no push), Safari/WebKit/Firefox, physical-device notches/browser chrome, browser installation UI and mid-range device performance. The automated Chromium checks validate manifest/offline behavior but do not prove installation on every browser.

The shell targets root hosting over HTTPS or localhost. Subpath hosting requires a coordinated base/manifest/worker-scope change. Provisional art/system fonts may be refined later. Automatic PWA update activation must be reconsidered before persistent or in-flight gameplay state exists.

## Follow-up

1. Claude architecture/foundation review.
2. Antigravity 390x844 mobile/browser smoke QA, then physical-device checks where available.

Do not start Milestone 1 as part of this handoff.
