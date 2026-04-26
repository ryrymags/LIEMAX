# State

Current status: "Step 3 complete. Steps 1, 2, and 3 done. Ready for Step 4."

## Completed

- Step 1: Research & Data Schema.
- Step 2: Math Engine.
- `schema/theater.schema.json` is version `1.3.0` (added `dolby_cinema_single_laser` projector_type; previously 1.2.0).
- `src/math/` exists and has 129 passing validation tests.
- Audit fixes are applied for resolver derived-field recomputation, cropped masking bars, dome scan-equivalent validation, and tablet default viewing distance.
- Sparse 143190.xyz import mapping exists under `src/data/`.
- Hybrid projection modes are schema-backed for digital + film IMAX venues.
- Research updated: Dolby Cinema section corrected (dual-laser E3LH vs new single-laser Christie variant); RPX section fully resolved with derived brightness, published contrast (1,850:1), and projector type discipline.

## Step 3 Complete

### Format Presets (`src/data/presets/`)
- `imax_gt_dual_laser`, `imax_cola`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`
- `dolby_cinema`, `dolby_cinema_single_laser`, `rpx`
- `standard_multiplex`, `screenx`

### Venues (`src/data/venues/`)
- `apple_providence_imax` (sparse 143190 import + hybrid projection modes)
- `mugar_omni_boston` (dome geometry, institutional)

### Home Display Presets (`src/data/home_display_presets/`)
- `oled_flagship`, `oled_midrange`, `miniled_qled`, `standard_qled`, `standard_lcd`
- `iphone_pro`, `android_flagship`, `home_projector`

### Content Formats (`src/data/content_formats/content_formats.json`)
- `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`, `ultrawide_235`

## Active

- Step 4: assemble data files into a queryable database / bundle for the frontend.

## Project Memory Milestone

Math Engine Validated - No refactors permitted without explicit instruction.
