# Roadmap

## Current Summary Pane

- GREEN `.ai/`: All three steps audited 2026-04-26. Steps 1–3 are clean. Ready for Step 4.
- GREEN `src/math/`: 133/133 tests pass. Resolver handles dome, hybrid, ScreenX, masking, and FOV correctly. No edge case gaps that block Step 4.
- GREEN `schema/`: v1.3.1 source of truth. Supports all required projector types, projection-mode arrays, dome geometry, sparse 143190 imports, home displays. Adds `r_imax_csv` source quality for 143190-sourced fields. Multi-wall ScreenX geometry and structured renovation status remain additive future work.
- GREEN `src/data/`: All Step 3 JSON records pass schema validation. 12 format presets (added cinemark_xd). imax_cola/xenon contrast/brightness sources upgraded to published_cto; Dolby single-laser updated to Christie Eclipse specs. Validation suite covers Mugar dome-laser/no-film invariants, 1.43 digital guardrails, and ScreenX capability preservation.
- GREEN `research/`: Home Theater Research preset ID table corrected to match canonical AGENTS.md filenames.
- GREEN repo root/docs: README and `CLAUDE.md` are good entry points.

## Known Low-Confidence Data Items (do not block Step 4)

- `dolby_cinema_single_laser.json` brightness_fl ~31 fL: community estimate from AMC Southlands firsthand reports; no Dolby-published per-venue fL spec yet.
- `cinemark_xd.json` brightness_fl ~16 fL: derived from Barco SP4K specs; Cinemark publishes no fL target.
- Deferred home display presets: `oled_budget` and `iphone_standard` (add in Step 4 if per-budget comparison is a priority feature).

## Top Step 4 Headache Risks

1. Import drift: 143190 rows are sparse; do not invent seating, brightness, contrast, sound, or exact projector specs from missing fields.
2. Aspect-ratio drift: agents must require both 1.43 screen and a 1.43-capable projector/mode, else default digital capability to 1.90.
3. Future PLF modeling: ScreenX, ACX renovation status, and per-field provenance can be represented loosely today, but richer UI will want additive schema fields before data scales.

## Step 3: Presets

This step is where research becomes product data. 143190 rows remain sparse baseline facts; presets are schema-shaped, source-aware, and fill gaps in imported venue records.

**Complete:**
- `imax_gt_dual_laser`, `imax_cola`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`, `imax_dome_laser`
- `dolby_cinema` (dual-laser E3LH), `dolby_cinema_single_laser` (Christie Eclipse 2025+, ~31 fL), `rpx`, `standard_multiplex`, `screenx`, `cinemark_xd`
- Venues: `apple_providence_imax`, `mugar_omni_boston` (current digital dome laser; 23.20 m dome per 143190, medium confidence)
- Home display tier presets: OLED flagship, OLED midrange, Mini-LED/Neo QLED, standard QLED, standard LCD, iPhone Pro, Android flagship, home projector
- Content formats array: `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`, `ultrawide_235`

## Step 4: Website

Build the static client app after presets exist. The website should:

- compare theaters, formats, and home displays
- visualize aspect-ratio masking and crop/letterbox/pillarbox outcomes
- show PPD, FOV, brightness, screen area, contrast, and resolution in user-facing language
- support custom user-entered specs
- remain deployable on free static hosting such as Netlify or Vercel

Tech stack remains TBD. Likely React or plain TypeScript + Vite; keep it buildable to static files.

### Step 4 Phasing

**Phase 4a — Data layer:** Bundle all JSON files into a queryable in-memory database (flat import or tiny library like `fuse.js` for search). Build the resolver call chain so every comparison starts from `resolveVenue(preset, venue)`. Venue data: pull/cache the full 143190 global CSV (all countries — not Americas-only). Format presets: US-dominant chains at launch; international format presets (Vue, Kinepolis, MJX, etc.) added via community feedback.

Status 2026-04-26: scaffolded. React/Vite dependencies, `tsconfig.app.json`, `vite.config.ts`, `index.html`, and Netlify CSV proxy redirects are added. `src/data/index.ts` explicitly imports all authored JSON records. `src/data/csvLoader.ts` fetches the current 143190/r-imax regional CSV files through `/api/imax-csv/*`, normalizes them into one cached TSV, and maps rows through the locked import helper. `src/data/comparables.ts` returns 22 baseline comparable items with no CSV rows and dedupes static venue records ahead of imported venues. Verification passes: repo typecheck, app `tsc`, math validation, schema/data validation.

**Phase 4b — Functional UI:** Working comparison page — pick two items (theater A vs. theater B, or theater vs. home display), show math results in plain language. No design polish yet. Get the core feature working end-to-end first.

Status 2026-04-26: functional baseline implemented. React app state loads/caches 143190 venues, builds comparable items, resolves selected items, computes metrics inline, and renders side-by-side panels. Components include item/content/seat selectors, metric rows, brightness comparison, and CSV status. `src/lib/computeMetrics.ts` handles flat cinema, dome cinema, film scan-equivalent ranges, home displays, masking/crop loss, PPD warnings, OLED infinite contrast, projector missing-screen guard, and missing-dimension preset warnings. Verification passes: `npm run typecheck`, `npm run ci`, `npm run build`, math validation, schema/data validation, localhost Vite smoke test, and direct metrics smoke test for Providence crop loss / OLED contrast / Mugar dome FOV.

**Phase 4c — Design polish:** After Phase 4b works, use design tooling to improve visual quality:
- `/design:frontend-design` (Claude Design skill) — generates design-system tokens, component specs, accessible color palette
- Figma MCP connector (available in Claude Code as `mcp__plugin_design_figma__*`) — for high-fidelity mockups and developer-handoff specs
- As alternative: rapid wireframe iteration via Claude's frontend-design skill before committing to Figma
- Do NOT start design polish before Phase 4b functional baseline exists.

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
