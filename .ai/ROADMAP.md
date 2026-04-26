# Roadmap

## Current Summary Pane

- GREEN `.ai/`: Context compressed; truth discipline now forbids inferred 1.43:1 capability and documents 143190 as the primary venue baseline.
- GREEN `src/math/`: Resolver supports schema-backed hybrid projection modes, source-aware 1.43 defaults, audit regression hardening, and 129 passing validation tests.
- GREEN `schema/`: v1.3.0 source of truth. Added `dolby_cinema_single_laser` projector_type. Supports sparse 143190 imports, projection-mode arrays, lightweight provenance, presets, venues, home displays, Atmos, and simple ScreenX flags. Multi-wall ScreenX geometry and structured renovation status remain additive future work.
- GREEN `src/data/`: 143190 import mapper and fixtures preserved. `src/data/presets/` and `src/data/venues/` now exist with IMAX, Dolby Cinema, and RPX presets plus Providence and Mugar Omni venue drafts.
- GREEN `research/`: Updated April 2026 — Dolby Cinema section corrected (dual-laser E3LH primary vs new single-laser Christie 2025+), RPX fully resolved with derived brightness and published contrast. Providence/Mugar facts promoted to schema-shaped venue records.
- GREEN repo root/docs: README and `CLAUDE.md` are good entry points. Completed Step 1/2 details archived in `docs/archive/HISTORY.md`.

Top headache risks:

1. Import drift: 143190 rows are sparse; do not invent seating, brightness, contrast, sound, or exact projector specs from missing fields.
2. Aspect-ratio drift: agents must require both 1.43 screen and a 1.43-capable projector/mode, else default digital capability to 1.90.
3. Future PLF modeling: ScreenX, ACX renovation status, and per-field provenance can be represented loosely today, but richer UI will want additive schema fields before data scales.

## Step 3: Presets

This step is where research becomes product data. 143190 rows remain sparse baseline facts; presets are schema-shaped, source-aware, and fill gaps in imported venue records.

**Done:**
- `imax_gt_dual_laser`, `imax_cola`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`
- `dolby_cinema` (dual-laser E3LH), `dolby_cinema_single_laser` (Christie 2025+), `rpx`
- Venues: `apple_providence_imax`, `mugar_omni_boston`

**Remaining:**
- Standard multiplex preset
- ScreenX preset (capability-flag level; no geometry additions needed yet)
- Home display tier presets: OLED flagship, OLED midrange, Mini-LED/Neo QLED, standard QLED, standard LCD, iPhone Pro, Android flagship, home projector
- Content formats array: `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`

## Step 4: Website

Build the static client app after presets exist. The website should:

- compare theaters, formats, and home displays
- visualize aspect-ratio masking and crop/letterbox/pillarbox outcomes
- show PPD, FOV, brightness, screen area, contrast, and resolution in user-facing language
- support custom user-entered specs
- remain deployable on free static hosting such as Netlify or Vercel

Tech stack remains TBD.

## Step 5: Community Data Workflow

Add a lightweight contribution path after the static comparison app exists:

- let users suggest venue corrections, local renovation notes, and source links
- preserve source quality, timestamps, confidence, and status notes
- prefer GitHub issues/PRs or another free static-friendly workflow at first
- do not allow unscreened edits to become authoritative public data
- keep 143190.xyz as the primary IMAX venue baseline instead of trying to out-database it

## Step 6: 3D Simulation

Use Three.js for the advanced simulation phase:

- start with one generic IMAX layout
- support front, middle, back, and optimal seats
- render flat screens, dome screens, and future premium formats separately
- show aspect-ratio changes on the virtual screen
- include human-scale reference near the screen base

Do not begin this phase before presets and the website foundation are in place.
