# Agent Briefing

Cold-start order: read `.ai/STATE.md`, then this file, then `.ai/REQUIREMENTS.md`. Read `.ai/STEP3.md` when auditing or extending preset data. Read `.ai/OVERHAUL_BIBLE.md` before any frontend work.

## Mission

LIEMAX = static web app for explaining what cinema/home screens look like from a real seat. IMAX emphasis, format-agnostic math. Core variables: screen size/AR, content AR, brightness, resolution, PPD, FOV, seating geometry, contrast, masking.

## State

- Branch: `GUI-work`, squashed on top of the clean Steps 1-3 foundation in `main`.
- Audited 2026-04-26: Steps 1, 2, and 3 are clean. All 133 math tests + 87 schema/data checks pass.
- Done: Step 1 schema/research; Step 2 math engine (133 passing tests); sparse 143190 import foundation; LFExaminer supplemental Xenon import foundation; schema v1.6.0 (adds r_imax_csv + lfexaminer source quality/source rows, screen width confidence, and 3D POV seating geometry fields).
- Done in Step 3: IMAX presets (GT, CoLa, dual xenon, 15/70, dome film, dome laser), Dolby Cinema (dual-laser + single-laser variants), RPX, standard multiplex, ScreenX, Cinemark XD, home display tier presets, content formats, Providence Place, and Mugar Omni venue drafts.
- Active: Step 4 — the `docs/` GUI is a **rough functional prototype only**; the next major work item is the Overhaul V2 redesign. Read `.ai/OVERHAUL_BIBLE.md` before touching any frontend code.
- GUI design tooling for Overhaul V2: Claude Design skill (`/design:frontend-design`), Figma MCP connector, or equivalent.

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
- Format preset IDs: `imax_cola`, `imax_gt_dual_laser`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`, `imax_dome_laser`, `dolby_cinema`, `dolby_cinema_single_laser`, `rpx`, `standard_multiplex`, `screenx`, `cinemark_xd`.
- Home display preset IDs: `oled_flagship`, `oled_midrange`, `miniled_qled`, `standard_qled`, `standard_lcd`, `iphone_pro`, `android_flagship`, `home_projector`.
- Content format IDs: `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`, `ultrawide_235`.
- Source quality enum: `published_official`, `published_cto`, `trade_reporting`, `community_estimate`, `derived`, `r_imax_csv`, `lfexaminer`, `user_submitted`, `unknown`.

## Map

- `.ai/PROJECT.md`: vision/stack/data strategy.
- `.ai/REQUIREMENTS.md`: hard constraints.
- `.ai/ROADMAP.md`: active Summary Pane + next tasks.
- `.ai/STATE.md`: branch/status snapshot.
- `.ai/STEP3.md`: detailed Step 3 preset inventory, specs, pitfalls, verification.
- `.ai/OVERHAUL_BIBLE.md`: master reference for the Overhaul V2 redesign — site architecture, page flow, layer structure, verdict tier logic, tooltip system, build sequence, and data accuracy commitments. Read this before any frontend work.
- `CLAUDE.md`: Claude pointer.
- `README.md`: public overview.
- `schema/theater.schema.json`: canonical model v1.6.0.
- `src/math/`: pure math engine; `validate.ts` = validation suite (immutable).
- `src/data/`: 143190 import mapper, fixtures, and schema/import validation.
- `src/data/presets/`: format preset JSON files (one per format).
- `src/data/venues/`: venue record JSON files (one per venue).
- `src/data/home_display_presets/`: home display tier preset JSON files.
- `src/data/content_formats/`: content format aspect-ratio definitions.
- `research/`: evidence — Master Research.md, IMAX Dome Research.md, Home Theater Research.md.

## Step 3 Audit Note

- Mugar Omni is modeled as current post-2021 `imax_dome_laser`, not active 15/70 film. Dome diameter is 23.20 m (76.1 ft) per 143190.xyz CSV (`r_imax_csv`; confidence `medium`). Physical dome `aspect_ratio` is `1.0` when width and height both store diameter, while `capabilities.min_content_ar_supported` remains `1.43`.
- 143190.xyz is the authoritative IMAX venue source; use `r_imax_csv` source quality for fields sourced from it. Full global CSV — all countries, not Americas-only.
- LFExaminer is supplemental archival coverage for U.S. IMAX Xenon rows only. Treat `lfexaminer` rows as low-confidence 2021 data; 143190/authored current records win conflicts.
