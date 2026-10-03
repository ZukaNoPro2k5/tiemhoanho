# Skill: Asset Pipeline

## Purpose

Keep flower-shop art performant, composable and consistently addressable on mobile web.

## When to Use

Use when adding, exporting, converting, naming, loading or reviewing images, SVGs, sprite sheets, atlases, fonts, particles, sound or music. Read docs/04_DESIGN_SYSTEM.md, docs/05_TECH_ARCHITECTURE.md and docs/10_TESTING_QA.md first.

## Rules

- Use stable lowercase asset IDs with a clear domain prefix, for example flowers/tulip-pink or materials/wrap-cream.
- Separate source art from optimized runtime assets when both exist; never use source files as an accidental production payload.
- Prefer WebP/AVIF for raster art when browser support and transparency needs allow it; use SVG for simple UI/vector shapes and PNG when lossless transparency is materially better.
- Record native dimensions, intended display size and anchor metadata for composable bouquet assets.
- Keep flower stems anchored consistently at bottom-center so normalized placement reconstructs predictably.
- Load core first-interaction assets before non-core diary/history content; lazy-load expensive or rarely visited assets.
- Compress images and inspect transparent bounds. A large canvas with a tiny flower still consumes memory and harms composition.
- Keep fonts limited and verify Vietnamese glyph coverage before shipping.
- Treat audio as optional until visual quality and load budgets are proven.

## Suggested mobile budgets

These are targets for measurement, not excuses to reduce visual quality blindly:

- No single routine mobile raster asset above 500 KB without an explicit reason.
- Avoid committing a 10 MB asset when an optimized variant can meet the same visual role.
- Keep first-interaction image payload small enough to preserve a fast shell; measure the actual build before setting a hard total.
- Avoid loading the complete collection or all seasonal assets on first entry.

## Forbidden Patterns

- Uncompressed 10 MB assets committed to the runtime asset tree.
- Mixed naming, missing IDs or duplicate files that represent one visual.
- Flower assets without anchor/dimension metadata when used in composition.
- Preloading every high-resolution asset, atlas and audio file at app start.
- Using arbitrary screenshot crops as the source of reconstructable bouquet records.
- Per-component remote asset URLs that bypass the content/asset contract.

## Examples

Good: flowers/tulip-pink.webp has known native dimensions and bottom-center anchor metadata; the tray loads a small preview while the composition uses the optimized full asset.

Bad: a 4000x4000 transparent PNG is committed for a tiny tray icon and loaded before the first customer appears.

## Checklist

- Is the filename/asset ID stable and searchable?
- Is the format appropriate for transparency and visual role?
- Are dimensions, anchor and intended display size known?
- Is the asset compressed and within its budget or explicitly justified?
- Is it core, lazy-loaded or optional?
- Can saved bouquet data reconstruct it without a screenshot dependency?
- Does the asset include Vietnamese font coverage where relevant?

## Definition of Done

An asset change is ready when optimized files, metadata, loading priority and measured size are clear, with no unexplained large payload or missing anchor contract.
