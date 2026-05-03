# Roadmap

## Current Summary Pane

- GREEN `.ai/`: All three steps audited 2026-04-26. Steps 1–3 are clean. Ready for Step 4.
- GREEN `src/math/`: 133/133 tests pass. Resolver handles dome, hybrid, ScreenX, masking, and FOV correctly. No edge case gaps that block Step 4.
- GREEN `schema/`: v1.5.0 source of truth. Supports all required projector types, projection-mode arrays, dome geometry, sparse 143190 imports, LFExaminer archival source rows, screen width confidence, home displays, and `r_imax_csv`/`lfexaminer` source quality. Multi-wall ScreenX geometry and structured renovation status remain additive future work.
- GREEN `src/data/`: All Step 3 JSON records pass schema validation. 12 format presets (added cinemark_xd). imax_cola/xenon contrast/brightness sources upgraded to published_cto; Dolby single-laser updated to Christie Eclipse specs. Validation suite covers Mugar dome-laser/no-film invariants, 1.43 digital guardrails, ScreenX capability preservation, promoted docs 143190 rows, LFExaminer U.S. IMAX D/1570+D rows, and frontend comparison/home records.
- GREEN `docs/`: Step 4 diagnosis-first homepage shipped (2026-05-01), Priority 1 education-first overhaul complete, Phase 4a canonical data unification complete, Priority 2 LFExaminer Xenon supplement added, and pre-GUI LIEMAX/IMAX Lite taxonomy fixed. Search page now explains why LIEMAX exists for novice users, randomizes curated examples across regions/categories, shows national and explicit state-selected stats from generated DB tokens, then flows into DiagnosisCard (noir panel, category badge/spec strip/source confidence/seat geometry/aspect-ratio penalty, mode breakdown, immediate scale visualization) and optional comparison workbench accordion. `docs/data.js` and `docs/workbench.js` are generated from canonical `src/data`/`src/docs` sources; `window.LIEMAX_DATA` remains stable and `window.LIEMAX_WORKBENCH` owns comparison helpers. Dome diagnoses distinguish `IMAX Laser for Dome` from `IMAX GT Dome 15/70mm`, rank Dome above Hybrid/LIEMAX, and draw dome screens as scaled circular cross-sections rather than flat rectangles. Docs validation is 83/83 and full CI passes.
- GREEN `research/`: Home Theater Research preset ID table corrected to match canonical AGENTS.md filenames; Batch 2 workbench audit addendum added to Master/Dome research.
- GREEN repo root/docs: README and `CLAUDE.md` are good entry points.

## Prioritized Todo Backlog

### Priority 0 — Trust-Critical Website/Data Fixes

- Persist the roadmap in `.ai/ROADMAP.md` and track active Priority 0 progress in `.ai/STATE.md`.
- Keep the diagnosis homepage search dropdown closed on initial page load while preserving user-triggered opening.
- Import U.S. IMAX Dome rows from `r-imax/imaxguide` / 143190 U.S. CSV into canonical venue records and the temporary `docs/` prototype bundle.
- Use `research/IMAX Dome Research.md` and `research/Master Research.md` for dome defaults and caveats: 180° horizontal FOV, 125° vertical FOV, 83% default hemisphere coverage, 105°/20° vertical split, fixed dome FOV, dome-master caveat, and non-linear digital dome mapping.
- Tighten diagnosis logic so `true_dome` requires dome geometry/name evidence plus explicit dome-capable projection or mode evidence.
- Rank Dome as a real IMAX 1.43 category below flat True IMAX 1.43 and above Hybrid/LIEMAX.
- Distinguish `IMAX Laser for Dome` and `IMAX GT Dome 15/70mm` in user-facing diagnosis copy.
- Show a 2D scale figure immediately on the diagnosis screen; draw domes from reported dome diameter as circular cross-sections instead of flat rectangles.
- Add visible IMAX Corporation non-affiliation copy.
- Clarify that MIT is the current license but the license choice is under review if non-commercial reuse is desired.
- Mark the old Metreon/Lincoln `_and_imax` featured-id task resolved if the current code still uses the generated `_and_imax` IDs.
- DONE: Align LIEMAX taxonomy before GUI polish: LIEMAX = legacy Dual Xenon; IMAX Lite = CoLa/Laser XT; generated DB tokens replace hardcoded launch stats; Dolby Cinema count uses `db.dolby_cinema_us_count`; DMR first-use tooltip resolved to Block 4.

### Priority 1 — Core Step 4 Product Work

- DONE: Detailed implementation handoff: `.ai/PRIORITY1_PLAN.md`.
- DONE: Education-first website overhaul with novice homepage framing, integrated IMAX 101, curated film examples, source links, randomized examples, national/state stats, diagnosis source confidence, aspect-ratio penalty metrics, and flat/dome seat geometry treatment.
- DONE: Unify `docs/` with canonical `src/data` through the resolver instead of duplicated prototype view-model logic.
- DONE: Improve the Diagnosis box with plain-language explanations for GT Dual Laser, 15/70, 1.43, 1.90, CoLa, Xenon, dome, PPD, FOV, and source confidence.
- DONE: Replace static New England-heavy recommendations with privacy-friendly randomized/curated examples and explicit state selection. No silent IP geolocation.
- DONE: Add seat geometry stats: front/mid/back horizontal and vertical FOV, seating depth as screen-width multiple, and best-modeled-seat caveats.

### Priority 2 — Data Coverage And Nerd Stats

- DONE: Add supplemental U.S. IMAX Xenon coverage from LFExaminer's archival 2021 table, clearly marked lower-confidence than 143190.
- DONE in Phase 4a: state/national stats now read from generated canonical docs data.
- DONE in Priority 1 docs prototype: add aspect-ratio penalty metrics for 1.43-on-1.90 vertical frame lost/retained; richer screen utilization views remain in workbench.
- DONE in Priority 1 docs prototype: add curated examples of 1.43, 1.90, scope, and flat movies.
- Add deferred home presets: `oled_budget` and `iphone_standard`.

### Priority 3 — Polish

- Do design polish only after the functional data path is solid.
- Add website animations after layout and content are stable.
- Add sourced qualitative screen curvature/gain tags: flat, mildly curved, strongly curved; low/high gain; hotspot/uniformity caveats.

### Priority 4 — Later Phases

- At website launch, enable the commented daily cron schedule in `.github/workflows/dolby-cinema-count.yml` so `db.dolby_cinema_us_count` stays fresh automatically.
- Add screened community correction workflow with source links and review status.
- Build the Step 6 Three.js simulation after Step 4 is stable, starting with one generic IMAX layout and front/mid/back/optimal seats.
- Treat Blender/real-scale renders as later support material, not a Step 4 blocker.

## Known Low-Confidence Data Items (do not block Step 4)

- `dolby_cinema_single_laser.json` brightness_fl ~31 fL: community estimate from AMC Southlands firsthand reports; no Dolby-published per-venue fL spec yet.
- `cinemark_xd.json` brightness_fl ~16 fL: derived from Barco SP4K specs; Cinemark publishes no fL target.
- Reading GT `docs/` workbench seating distances are a community/derived estimate (40/75/84 ft) pending published row-depth or floor-plan data.
- IMAX Dome native contrast: digital dome laser contrast is still unknown; 15/70 dome can inherit photochemical estimates only with explicit caveats because dome surface geometry and scatter make venue-specific perceived contrast hard to compare.
- Deferred home display presets: `oled_budget` and `iphone_standard` (add in Step 4 if per-budget comparison is a priority feature).

## Top Step 4 Headache Risks

1. Import drift: 143190 rows are sparse; do not invent seating, brightness, contrast, sound, or exact projector specs from missing fields.
2. Aspect-ratio drift: agents must require both 1.43 screen and a 1.43-capable projector/mode, else default digital capability to 1.90.
3. Future PLF modeling: ScreenX, ACX renovation status, and per-field provenance can be represented loosely today, but richer UI will want additive schema fields before data scales.
4. RESOLVED initial pass: 143190.xyz intentionally excludes venues with only Xenon projectors, so `src/data/fixtures/lfexaminer_us_imax_rows.json` now preserves LFExaminer U.S. IMAX `D`/`1570+D` candidates and `docs/data.js` promotes comparable unmatched rows as `lfexaminer` low-confidence archival 2021 venues. The LIEMAX count is now a generated Dual Xenon token with an LFExaminer-specific archival sub-count. Remaining risk: these rows may be closed/upgraded; future work should add community/official verification and fill eight LFExaminer rows that lack screen dimensions.
5. RESOLVED in Phase 4a: workbench drift is now guarded by generated `docs/data.js`, generated `docs/workbench.js`, `npm run check:docs-data`, and docs regressions. Remaining drift risk is future manual edits to generated files, which `validate:docs` should catch.

## Step 4 Diagnosis Homepage Follow-ups

- RESOLVED/STALENESS NOTE: Metreon and Lincoln Square featured example IDs in `docs/app.jsx` currently use the generated `_and_imax` form, so the older `_imax` follow-up is no longer an active blocker.
- Before adding dome venues to the `docs/` bundle, tighten `docs/diagnosis.js` dome classification so `true_dome` requires explicit 1.43-capable dome projection/mode, not dome geometry alone.
- Keep context names aligned with code: the diagnosis module is `window.LIEMAX_DIAGNOSE`, and the public helpers are `classify()`, `diagnose()`, and `LABELS`.

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

**Phase 4b — Functional UI:** Working comparison page — pick two items (theater A vs. theater B, or theater vs. home display), show math results in plain language. No design polish yet. Get the core feature working end-to-end first.

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
