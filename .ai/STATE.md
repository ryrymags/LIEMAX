# State

Current status: "Steps 1–3 audited and clean. GUI-work has the Step 4 comparison workbench plus Batch 2 workbench audit fixes."

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
- Step 4 Batch 2 audit remediation applied: `docs/` workbench now exposes `cinemark_xd` and `dolby_cinema_single_laser`, corrects Reading GT mid-seat estimate to ~75 ft, discloses the 143190 Xenon-only venue gap near search, and adds docs regression validation for Providence 15/70 vs Reading GT visible-area/native-contrast winners.
- Step 4 CoLa utilization clamp applied: `docs/` workbench visible content area/FOV/utilization now clamp presentation windows to physical screen bounds, with regression coverage for Assembly Row vs Boston Common CoLa.

## Known Low-Confidence Items (tracked, not blockers)

- `dolby_cinema_single_laser.json` brightness_fl: ~31 fL is a community estimate from firsthand AMC Southlands reports (May 2025); no Dolby-published per-venue fL spec yet.
- `cinemark_xd.json` brightness_fl: ~16 fL is derived from Barco SP4K specs + screen geometry; Cinemark publishes no fL target.
- Reading GT workbench seating distances: front 40 ft / mid 75 ft / back 84 ft are community/derived estimates for a dedicated GT auditorium, not published venue measurements.
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

- Step 4: diagnosis-first homepage implemented (2026-05-01). `docs/` now opens on a parchment search page; selecting a venue shows a noir DiagnosisCard with category badge, spec strip, and mode breakdown. The comparison workbench is available as a collapsible accordion below the diagnosis card. `docs/diagnosis.js` provides `window.LIEMAX_DIAGNOSE` (`classify`, `diagnose`, `LABELS`). Diagnosis validation covers Providence, Reading, Boston Common, Metreon, and Lincoln Square. 26 docs workbench checks pass (+ 6 new diagnosis tests). Full CI: 273 pass, 0 fail.
- Step 4 diagnosis follow-ups to remember: fix Metreon/Lincoln featured example ids in `docs/app.jsx` (`_and_imax`), and require explicit 1.43-capable dome projection/mode before classifying future dome rows as `true_dome`.
- Step 4: functional comparison workbench lives in `docs/`, with side A and side B allowed to select the same venue for A/B testing.
- Current Step 4 caveat: `docs/` still uses a prototype data bundle rather than resolving directly from canonical `src/data` JSON; keep `npm run validate:docs` in CI until Phase 4a unifies the data path.
- Branch note: `GUI-work` is the active Step 4 branch, squashed onto `main` after the local Steps 1-3 merge commit `fb74985` (`Merge Steps 1-3 overhaul: schema, math, data, presets, compare engine`).
- Reset note: on 2026-04-29, `codex/overhaul` was intentionally reset to pre-GUI commit `970b870d0fadfc8c845324a7a1acac8d51e3fc80` (`Add cinemark_xd preset; upgrade preset sources to published_cto; schema v1.3.1`).
- Backup note: the pre-reset GUI work is preserved on branch `codex/gui-wip-backup` at commit `b874f88` (`Backup current GUI work before rebuild`).
- Dev convenience: `boot-website.command` remains at repo root as the launcher for the future frontend rebuild; it may not start a website until Step 4 frontend tooling exists again.

## Project Memory Milestone

Math Engine Validated - No refactors permitted without explicit instruction.
