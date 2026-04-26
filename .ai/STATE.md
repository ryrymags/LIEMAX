# State

Current status: "Step 3 Presets active. Steps 1 and 2 complete."

Product context refreshed: `.ai/PROJECT.md` now explicitly preserves the LIEMAX north star, user outcomes, custom/preset/known-theater entry paths, community provenance intent, and future first-person simulation goals.

## Completed

- Step 1: Research & Data Schema.
- Step 2: Math Engine.
- `schema/theater.schema.json` is version `1.3.0` (added `dolby_cinema_single_laser` projector_type; previously 1.2.0).
- `src/math/` exists and has 129 passing validation tests.
- Audit fixes are applied for resolver derived-field recomputation, cropped masking bars, dome scan-equivalent validation, and tablet default viewing distance.
- Sparse 143190.xyz import mapping exists under `src/data/`.
- Hybrid projection modes are schema-backed for digital + film IMAX venues.
- Research updated: Dolby Cinema section corrected (dual-laser E3LH vs new single-laser Christie variant); RPX section fully resolved with derived brightness, published contrast (1,850:1), and projector type discipline.

## Step 3 Progress

Presets created in `src/data/presets/`:
- `imax_gt_dual_laser`, `imax_cola`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`
- `dolby_cinema`, `dolby_cinema_single_laser`, `rpx`

Venues created in `src/data/venues/`:
- `apple_providence_imax` (sparse 143190 import + hybrid projection modes)
- `mugar_omni_boston` (dome geometry, institutional)

## Remaining Step 3 Work

- Standard multiplex preset
- ScreenX preset (simple flag-based)
- Home display tier presets (OLED flagship, OLED midrange, Mini-LED, standard QLED, standard LCD, iPhone Pro, Android flagship)
- Content formats array (`imax_143`, `scope_239`, `flat_185`, `tv_178`, etc.)

## Active

- Step 3 Presets in progress.
- 143190.xyz rows are the primary venue baseline; presets/research enrich missing fields.

## Project Memory Milestone

Math Engine Validated - No refactors permitted without explicit instruction.
