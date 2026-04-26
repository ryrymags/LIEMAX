# State

Current status: "Steps 1–3 audited and clean. Phase 4b annotation follow-up fixes committed with checks passing."

## Completed

- Step 1: Research & Data Schema. Audited 2026-04-26 — schema clean, cinema presets clean, research notes properly caveated.
- Step 2: Math Engine. Audited 2026-04-26 — 133/133 tests pass, all edge cases covered (dome, hybrid, ScreenX, masking, FOV). No blockers.
- Step 3: All presets, venues, home displays, content formats authored and validated. Audited 2026-04-26 — data quality clean after two fixes (imax_cola contrast_notes added; Home Theater Research naming table corrected to match canonical AGENTS.md IDs).
- `schema/theater.schema.json` is version `1.3.1` (added `r_imax_csv` source quality enum for 143190.xyz-sourced fields).
- `src/math/` exists and has 133 passing validation tests.
- Sparse 143190.xyz import mapping exists under `src/data/`.
- Hybrid projection modes are schema-backed for digital + film IMAX venues.
- Research updated: Dolby Cinema section corrected; RPX section fully resolved; Home Theater Research preset ID table updated to match canonical filenames.
- Step 3 audit remediation applied: schema-valid standard/ScreenX light sources, computable Mugar dome geometry, Mugar post-2021 dome-laser modeling, corrected RPX geometry, full Step 3 data validation, ScreenX capability preservation, and imax_cola contrast source downgraded to community_estimate with explanation.

## Known Low-Confidence Items (tracked, not blockers)

- `dolby_cinema_single_laser.json` brightness_fl: ~31 fL is a community estimate from firsthand AMC Southlands reports (May 2025); no Dolby-published per-venue fL spec yet.
- `cinemark_xd.json` brightness_fl: ~16 fL is derived from Barco SP4K specs + screen geometry; Cinemark publishes no fL target.
- Two deferred home display presets: `oled_budget` (Sony Bravia 8 / LG B-series tier) and `iphone_standard` — add in Step 4 if per-budget comparison features are prioritized.

## Resolved Items (previously low-confidence)

- `mugar_omni_boston.json` dome diameter: resolved to 23.20 m (76.1 ft) per 143190.xyz CSV (`r_imax_csv`, medium confidence). Source-basis note added.
- `imax_cola.json` contrast_sequential: 10,000:1 confirmed `published_cto` — IMAX CTO Bonnick, CinemaCon 2018, Display Daily.
- `imax_dual_xenon.json` contrast_sequential: revised to 2,500:1 (`published_cto`); brightness_fl revised to 22.0 (same IMAX calibration target as laser — lamp aging caveat documented).

## GUI Design Note

Once Step 4 produces a functional website (working comparisons, math-connected UI), design polish should use specialized tooling. Options:
- **Claude Design skill** (`/design:frontend-design` or `/design:design-system`) — generates design-system specs, component variants, and WCAG-compliant color tokens
- **Figma** (via Figma MCP connector available in Claude Code) — high-fidelity mockups and developer handoff specs
- **ChatGPT o3 canvas mode** — alternative for rapid wireframe iteration if Figma is not set up
Priority order: get functional → then design polish. Do not invest in visual design before Step 4 data layer works.

## Step 3 Complete

### Format Presets (`src/data/presets/`)
- `imax_gt_dual_laser`, `imax_cola`, `imax_dual_xenon`, `imax_1570_film`, `imax_dome_film`, `imax_dome_laser`
- `dolby_cinema`, `dolby_cinema_single_laser`, `rpx`
- `standard_multiplex`, `screenx`, `cinemark_xd`

### Venues (`src/data/venues/`)
- `apple_providence_imax` (sparse 143190 import + hybrid projection modes)
- `mugar_omni_boston` (post-2021 IMAX Dome laser; 23.20 m dome diameter per 143190 CSV, medium confidence)

### Home Display Presets (`src/data/home_display_presets/`)
- `oled_flagship`, `oled_midrange`, `miniled_qled`, `standard_qled`, `standard_lcd`
- `iphone_pro`, `android_flagship`, `home_projector`

### Content Formats (`src/data/content_formats/content_formats.json`)
- `imax_143`, `imax_digital_190`, `scope_239`, `flat_185`, `tv_178`, `panavision_220`, `ultrawide_235`

## Active

- Step 4: functional website.
- Phase 4a progress: Vite/React build tooling added without touching `tsconfig.json`; `tsconfig.app.json`, `vite.config.ts`, `index.html`, and Netlify `_redirects` are present.
- Phase 4a progress: `src/data/index.ts` explicitly bundles 12 format presets, 2 static venues, 8 home display presets, and 7 content formats.
- Phase 4a progress: `src/data/csvLoader.ts` loads 143190/r-imax regional CSV files through the `/api/imax-csv/*` proxy base, normalizes them into one cached TSV in `localStorage` with a 24h TTL, and maps rows through `map143190RowToVenue`.
- Phase 4a progress: `src/data/comparables.ts` builds the comparison item list and resolves cinema presets, venues, and home display presets through the existing resolver.
- Phase 4a verification: `npm run typecheck`, `npx tsc -p tsconfig.app.json --noEmit --pretty false`, `npm run validate`, and `npm run validate:schema` pass. `getComparableItems([])` returns 22 baseline items.
- Phase 4b progress: `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/lib/computeMetrics.ts`, and functional comparison components are implemented.
- Phase 4b progress: UI supports two item selectors grouped by cinema format / venue / home display, 7 content formats, front/mid/back seat selection, CSV load status, side-by-side metric rows, warnings, and cinema-vs-home brightness comparison.
- Phase 4b progress: `computeMetrics.ts` adapts existing locked math functions for cinema, dome, film scan-equivalent, home display, masking/crop, FOV, PPD, brightness, contrast, and resolution display without changing `src/math`.
- Phase 4b verification: `npm run typecheck`, `npm run ci`, `npm run build`, `npm run validate`, and `npm run validate:schema` pass. Dev server starts at `http://127.0.0.1:5173/`; localhost root and `/api/imax-csv/americas/unitedstates.csv` respond. Direct smoke test: Providence + IMAX 1.43 crop loss is ~24.7%, OLED contrast is infinite, and Mugar dome FOV is 180 degrees.
- Baseline commit: `e74e5d0` (`Implement Phase 4 website functional baseline`).
- Refinement commit: `1546d7a` (`Refine comparison picker and projection controls`).
- Phase 4b annotation refinement progress: page flow now prioritizes side selection/configuration, then a live comparison workbench, then one aligned raw metrics table.
- Phase 4b annotation refinement progress: side pickers have collapsed filters, scrollable result lists, honest filtered results without selected-item pinning, result counts, and an explicit `IMAX 15/70 capable` filter.
- Phase 4b annotation refinement progress: each selected side now shows summary tags/facts; Presentation AR is a searchable/custom combobox with local recent custom ratios and best-native explanations.
- Phase 4b annotation refinement progress: seat position is linked by default in the comparison workbench, with optional per-side seat comparison.
- Phase 4b annotation refinement verification: `npm run typecheck`, `npm run ci`, `npm run build`, and browser smoke checks pass for search, filters, custom AR, linked/per-side seats, aligned table, footer source, and Providence/OLED comparison behavior.
- Annotation refinement commit: `bd33547` (`Address Phase 4b annotation fixes`).
- Phase 4b deep logic QA progress: subagent audits and browser acceptance checks found and fixed stale AR query resets, incomplete IMAX 15/70/dome-film filtering/tags, incompatible filter-state combinations, sparse digital 1.43 UI guardrails, missing-size home projector optics, home IMAX 1.43 crop behavior, and dome-film PPD range display.
- Phase 4b deep logic QA verification: `npm run ci`, `npm run build`, targeted metrics probe, 27-check browser acceptance pass, and 7-check regression browser pass all pass after fixes.
- Deep logic QA commit: `b659179` (`Fix Phase 4b logic edge cases`).
- Annotation follow-up commit: `cfc8e24` (`Address Phase 4b follow-up annotations`).
- Phase 4b annotation follow-up progress: Dolby dynamic contrast now displays alongside sequential contrast; format presets with optics but no dimensions use average preset screens for computable FOV/PPD/area; selected-screen summaries label average models; search results are visually integrated with the search control; Presentation AR options are hidden until focused/typed and now read as a compact status/explanation.
- Phase 4b annotation follow-up verification: `npm run ci`, `npm run build`, targeted Dolby metrics probe, and Safari smoke check pass for average Dolby geometry, dynamic contrast row, summary language, and search integration.
- Next Step 4 chunk: continue Phase 4b/4c with manual-entry and 2D scale render planning.

## Project Memory Milestone

Math Engine Validated - No refactors permitted without explicit instruction.
