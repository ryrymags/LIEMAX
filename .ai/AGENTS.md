# Agent Briefing

Cold-start order: read `.ai/STATE.md`, then this file, then `.ai/REQUIREMENTS.md`, then `.ai/STEP3.md` if Step 3 is active.

## Mission

LIEMAX = static web app for explaining what cinema/home screens look like from a real seat. IMAX emphasis, format-agnostic math. Core variables: screen size/AR, content AR, brightness, resolution, PPD, FOV, seating geometry, contrast, masking.

## State

- Branch: `codex/overhaul`.
- Done: Step 1 schema/research; Step 2 math engine (129 passing tests); sparse 143190 import foundation; schema v1.3.0.
- Done in Step 3: IMAX presets (GT, CoLa, dual xenon, 15/70, dome), Dolby Cinema (dual-laser + single-laser variants), RPX preset, Providence Place and Mugar Omni venue drafts.
- Active: Step 3 remaining — standard multiplex, ScreenX, home display tier presets, content formats. See `.ai/STEP3.md`.

## Rules

- `src/math/` methodology is scrutinized; refactor/change only when explicitly requested.
- Run `npm run validate` after math changes.
- `schema/theater.schema.json` is data-shape source of truth.
- Inheritance is field-level: record non-null overrides preset; null falls through.
- 143190.xyz / r-imax CSV rows are the primary venue baseline and are sparse by design.
- Data must be schema-shaped, source-aware, small, atomic, provenance-clear.
- No backend unless scoped; preserve free static hosting.
- Frontend first screen = usable comparison experience, not marketing.
- Future 3D = Three.js; verify render.

## Naming

- Schema/data: `snake_case`.
- TS functions/locals: `camelCase`.
- Format preset IDs: `imax_cola`, `imax_gt_dual_laser`, `imax_1570_film`, `imax_dome_film`, `dolby_cinema`, `dolby_cinema_single_laser`, `rpx`, `standard_multiplex`, `screenx`.
- Home display preset IDs: `oled_flagship`, `oled_midrange`, `miniled_qled`, `standard_qled`, `standard_lcd`, `iphone_pro`, `android_flagship`, `home_projector`.
- Content format IDs: `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`, `ultrawide_235`.
- Source quality enum: `published_official`, `published_cto`, `trade_reporting`, `community_estimate`, `derived`, `user_submitted`, `unknown`.

## Map

- `.ai/PROJECT.md`: vision/stack/data strategy.
- `.ai/REQUIREMENTS.md`: hard constraints.
- `.ai/ROADMAP.md`: active Summary Pane + next tasks.
- `.ai/STATE.md`: branch/status snapshot.
- `.ai/STEP3.md`: detailed Step 3 briefing — remaining presets, specs, pitfalls, verification.
- `CLAUDE.md`: Claude pointer.
- `README.md`: public overview.
- `schema/theater.schema.json`: canonical model v1.3.0.
- `src/math/`: pure math engine; `validate.ts` = validation suite (immutable).
- `src/data/`: 143190 import mapper, fixtures, and schema/import validation.
- `src/data/presets/`: format preset JSON files (one per format).
- `src/data/venues/`: venue record JSON files (one per venue).
- `src/data/home_display_presets/`: home display tier preset JSON files.
- `src/data/content_formats/`: content format aspect-ratio definitions.
- `research/`: evidence — Master Research.md, IMAX Dome Research.md, Home Theater Research.md.
