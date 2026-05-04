# State

Current status: "Steps 1–3 audited and clean. Data layer complete: canonical presets, venues, generated docs bundle, LFExaminer supplement, Dolby count checker, and taxonomy/stats all done. The `docs/` Step 4 GUI is a rough functional prototype — intentionally not polished. A full Overhaul V2 redesign is next."

Current priority: Overhaul V2 — ground-up website redesign per the Overhaul Bible (`Downloads/Overhaul V2/LIEMAX-Overhaul-Bible.md`). Data layer is ready; no new data work is needed before starting the build.

Priority 0 follow-up complete: dome ranking/projection distinctions and diagnosis-stage scale depiction.
Priority 0 visual hotfix complete: docs assets are cache-busted together, dome SVGs use fixed heights/resolved colors, and the browser now renders dome geometry instead of stale flat rectangles.

## Priority 0 Working Context

Goal: preserve the full todo roadmap in repo context, then make the diagnosis-first website safer to trust before larger Step 4 work continues.

Chunk checklist:
- [x] Persist full Priority 0-4 roadmap in `.ai/ROADMAP.md`.
- [x] Keep homepage search dropdown closed on initial load while preserving user-triggered opening.
- [x] Import U.S. IMAX Dome rows from `r-imax/imaxguide` / 143190 U.S. CSV into canonical `src/data/venues/`.
- [x] Mirror those dome rows in the temporary `docs/` data bundle until Priority 1 unifies frontend data with canonical JSON.
- [x] Tighten `docs/diagnosis.js` so `true_dome` requires explicit dome-capable projection/mode evidence.
- [x] Rank Dome above Hybrid and LIEMAX while keeping flat True IMAX 1.43 above Dome.
- [x] Distinguish `IMAX Laser for Dome` from `IMAX GT Dome 15/70mm` on the Diagnosis card.
- [x] Add immediate diagnosis-stage screen/dome scale visualization, including dome-specific circular cross-section depiction from reported dome diameter.
- [x] Update site copy for dome caveats, IMAX non-affiliation, and license-under-review language.
- [x] Run `npm run validate:schema`, `npm run validate:docs`, full `npm run ci`, and `git diff --check`.

Priority 0 caveats:
- The old Metreon/Lincoln featured example ID follow-up is stale: `docs/app.jsx` already uses generated `_and_imax` IDs for both venues.
- Dome modeling should use `research/IMAX Dome Research.md` and `research/Master Research.md` for fixed dome FOV and explanatory caveats, not just the sparse CSV fields.
- Dome CSV rows with `Height = 0 m` and a nonzero width should treat width as dome diameter and store both width and height as that diameter with physical aspect ratio `1.0`.

Priority 0 verification:
- `npm run validate:schema`: 133 passed, 0 failed.
- `npm run validate:docs`: 44 passed, 0 failed.
- `npm run ci`: passed.
- `git diff --check`: passed.
- Browser check on `http://127.0.0.1:5173/?v=priority0-dome-5`: homepage search stays closed on load; Mugar diagnoses as `IMAX Laser for Dome`; Chrysler diagnoses as `IMAX GT Dome 15/70mm film`; diagnosis and comparison views both render circular dome SVG geometry with fixed 180° × 125° coverage.

Priority 0 follow-up notes:
- Dome ranking should read as flat True IMAX 1.43 above Dome, Dome above Hybrid, Hybrid above LIEMAX.
- `docs/diagnosis.js` distinguishes `IMAX Laser for Dome` from `IMAX GT Dome 15/70mm` in the diagnosis headline.
- Diagnosis cards now include an immediate 2D scale figure; dome figures are drawn as scaled circular cross-sections from reported dome diameter, not flat rectangles.
- The docs page intentionally version-tags `styles.css`, `stage.js`, and `app.jsx` together to avoid stale mixed asset loads during local browser testing.
- Dome native contrast remains a research gap. Keep digital dome laser contrast unknown unless an IMAX/dome-specific source is found; film dome may use photochemical/15/70 estimates only with caveats because dome screen geometry and scatter make perceived contrast venue-specific.

## Priority 1 Planning Snapshot

Priority 1 improved the Step 4 product experience without starting a full redesign or backend. The saved plan is `.ai/PRIORITY1_PLAN.md`.

Completed Priority 1 goals:
- Homepage now explains why the site exists before asking for a search: IMAX branding spans 1.43 GT/15/70, 1.90 multiplex digital, legacy Xenon, and dome experiences; LIEMAX is defined for novice users.
- Integrated IMAX 101 section covers screen/projector taxonomy, 15/70 vs standard 70mm, CoLa/Laser XT/Dual Xenon, dome behavior, PPD/FOV/source confidence, and curated film examples.
- “Try” recommendations are privacy-friendly randomized curated examples across regions/categories, not static New England defaults.
- Static national stats and explicit user-selected state stats are shown from the current `docs/data.js` bundle with no IP geolocation.
- Diagnosis cards now expose source confidence, 1.43-on-1.90 vertical frame loss/retention, and flat front/mid/back seat FOV/distance summaries; dome venues keep fixed 180° × 125° FOV.
- Docs regression validation expanded to 58 checks and full CI is green.

Priority 1 verification:
- `npm run validate:docs`: 58 passed, 0 failed.
- `npm run ci`: passed.
- `git diff --check`: passed.
- Browser DOM/runtime check on `http://127.0.0.1:5173/?v=priority1-edu-1`: homepage search remains closed on load; state stats update only after explicit state selection; Lincoln Square diagnosis renders seat geometry/source confidence; workbench opens; McWane dome diagnosis renders fixed dome FOV education; browser console has no errors. Browser screenshot capture timed out in the in-app browser, so visual QA used DOM/runtime inspection.

## Phase 4a Canonical Docs Data Unification

Completed Phase 4a goals:
- `docs/data.js` is now generated from canonical `src/data` inputs instead of hand-maintained prototype constants.
- The current U.S. 143190 docs snapshot lives in `src/data/fixtures/imax_143190_us_rows.json`; docs comparison cards/home examples live in `src/data/frontend/comparison_records.json`.
- `src/docs/buildDocsData.ts` resolves cinema records through `resolveVenue()` and home records through `resolveHomeDisplay()`, then emits the stable `window.LIEMAX_DATA` browser shape with `canonicalId`.
- `window.LIEMAX_WORKBENCH` is generated in `docs/workbench.js`; `docs/app.jsx` delegates presentation-mode resolution, stats, comparison rows, and verdicts through it.
- `npm run validate:docs` now checks generated files are current before running docs regressions.
- `src/data/validate.ts` validates the promoted docs 143190 snapshot and frontend comparison/home records.

Phase 4a verification:
- `npm run validate:schema`: 147 passed, 0 failed.
- `npm run validate:docs`: 63 passed, 0 failed.
- `npm run ci`: passed.
- `git diff --check`: passed.
- Browser DOM/runtime check on `http://127.0.0.1:5173/?v=phase4a-canonical-1`: homepage search remains closed on load; national/state stats render; Lincoln Square diagnosis preserves 1.43 display, source confidence, and scale figure; workbench opens; Mugar dome diagnosis renders `IMAX Laser for Dome` and dome scale (`ft dome diameter`, `180° H × 125° V`); browser console has no errors.

## Priority 2 LFExaminer Xenon Supplement

Completed Priority 2 LFExaminer goals:
- Added `src/data/lfexaminerImport.ts` to parse the attached LFExaminer all-entries Apple webarchive, preserve raw LFExaminer rows, and map U.S. IMAX-labeled `D`/`1570+D` rows to `imax_dual_xenon` venue records.
- Added `src/data/fixtures/lfexaminer_us_imax_rows.json` with 320 U.S. IMAX LFExaminer candidates from the 1,617-row archived table.
- Schema bumped to `1.4.0` with `lfexaminer` source quality and `source_lfexaminer` raw row support.
- `docs/data.js` now promotes 246 comparable unmatched LFExaminer rows into search/comparison/state-national stats as low-confidence archival 2021 data; 143190/authored current records win conflicts.
- Site copy now says Xenon-only rows include archival LFExaminer 2021 data and may be stale, instead of saying older Xenon-only rows are simply missing.

Priority 2 LFExaminer verification:
- `npm run validate:schema`: passed.
- `npm run validate:docs`: 71 passed, 0 failed.
- 2026-05-03 follow-up: strengthened LFExaminer-vs-143190 duplicate suppression so 143190 rows win despite venue-name drift such as trailing `& IMAX`, auditorium counts, `Stadium`, or circuit naming differences. Boston Common is now explicitly guarded so the LFExaminer Dual Xenon archival row cannot appear beside the 143190 CoLa row.
- 2026-05-04 follow-up: extended duplicate suppression to authored current 143190 venues and matching screen dimensions, removing stale LFExaminer overlaps from search/stats for rows such as Providence Place, Fayetteville 14, Edwards Renaissance, Ontario Palace, Edwards Valencia, and Stockton City Centre/Center.

Priority 2 LFExaminer caveats:
- LFExaminer was last updated 2021-10-17; any LFExaminer-sourced venue may have closed or upgraded.
- Eight LFExaminer U.S. IMAX candidates lack screen dimensions and remain source-fixture only until measured or otherwise sourced.
- LFExaminer non-IMAX giant-screen `D` rows are intentionally excluded from this pass.

## Dolby Cinema Count Checker

Completed 2026-05-03:
- Added a TypeScript Dolby Cinema U.S. count checker under `src/data/` that uses Dolby's JSON `mapBoundedCinemas` endpoint, not the static HTML app shell.
- The checker bootstraps a fresh Dolby finder XSRF cookie/header pair, posts the HAR-derived wide bounding-box request, normalizes longitudes, filters to contiguous U.S. coordinates, saves successful snapshots, and logs count/ID-set diffs.
- Latest successful baseline snapshot counted 175 contiguous-U.S. Dolby Cinema theaters and is stored in `src/data/fixtures/dolby_cinema_us_snapshots.json`.
- Generated docs data now exposes `window.LIEMAX_DATA.db.dolby_cinema_us_count` plus snapshot metadata; the website stats panel displays the national Dolby Cinema count.
- Added manual GitHub Actions groundwork in `.github/workflows/dolby-cinema-count.yml`; the daily cron remains commented until the website is live.

Dolby checker verification:
- `npm run dolby:check`: baseline saved, 175 contiguous-U.S. theaters.
- `npm run validate:dolby`: 28 passed, 0 failed.
- `npm run validate:docs`: 75 passed, 0 failed.
- `npm run ci`: passed.

## Pre-GUI Taxonomy + Stats Fixes

Completed 2026-05-03:
- Updated product taxonomy so LIEMAX means legacy `imax_dual_xenon` only, while `imax_cola` and `imax_laser_xt` classify as `imax_lite`.
- Hybrid CoLa + 15/70 venues now explain that regular digital showings are IMAX Lite, not LIEMAX.
- Schema bumped to `1.5.0` with `screen.width_confidence`; 143190/r-imax rows mark confirmed width, LFExaminer/frontend typical rows mark community-estimate width, and width sub-labels only fire from confirmed widths.
- Generated docs DB now exposes `total_us_imax`, `imax_lite_count`, `liemax_count`, `liemax_pct`, `liemax_lfexaminer_count`, `liemax_lfexaminer_pct`, `liemax_current_source_count`, `not_full_143_digital_count`, `not_full_143_digital_pct`, `gt_laser_count`, `film_conditional_count`, and `dome_count`.
- Current generated national split: 380 U.S. IMAX rows; 103 IMAX Lite; 251 LIEMAX; 246 LIEMAX rows from archival LFExaminer; 354 / 93% not full-height 1.43 digital; 14 GT Laser every-showtime flat True IMAX; 21 film-conditional; 11 Dome; 175 contiguous-U.S. Dolby Cinema rows from the saved Dolby finder snapshot.
- Overhaul V1 planning docs were updated to use `{{db.*}}` tokens, resolve DMR first introduction to Block 4, and keep Layer 3 chevrons inert until real anchors exist.

Pre-GUI taxonomy verification:
- `npm run validate:schema`: 182 passed, 0 failed.
- `npm run validate:docs`: 85 passed, 0 failed.
- `npm run ci`: passed.
- `git diff --check`: passed.

## Screen Tags + Side Picker Filters

Completed 2026-05-04:
- Generated docs venues now expose `screen.sizeTier` / `screen.sizeLabel` for every non-preset cinema row using physical width only: Small <55 ft, Medium 55-69.9 ft, Large 70-84.9 ft, Giant >=85 ft, and Dome by hemispherical geometry.
- Natick is overridden in generated docs data from Jordan’s official IMAX page: 76 x 55 ft screen, 279 seats, official source notes, `Large Screen`, and conservative legacy digital classification until current GT Laser, CoLa/Laser XT, or 15/70 evidence exists.
- Side A / Side B pickers now show simple visible result tags only: screen-size label plus IMAX category, with 1.43/aspect-ratio capability labels kept out of default result rows.
- Side A / Side B pickers now include compact filters for category, screen size, projector, projection capability, and U.S. state, with active removable chips and a `Clear filters` action. Free-text picker search indexes these concepts.
- Visible theater tags now expose hover/focus tooltips that explain whether the tag is a screen-size tier or IMAX category; `Unknown` explicitly means the IMAX category lacks enough projector/screen evidence.
- The visible Dolby Cinema count card was removed from the main stats panel while preserving `window.LIEMAX_DATA.db.dolby_cinema_us_count` and snapshot metadata for later use.

Screen Tags + Filters verification:
- `npm run build:docs-data`: passed.
- `npm run validate:docs`: 108 passed, 0 failed.
- `npm run ci`: passed.

## Completed

- Step 1: Research & Data Schema. Audited 2026-04-26 — schema clean, cinema presets clean, research notes properly caveated.
- Step 2: Math Engine. Audited 2026-04-26 — 133/133 tests pass, all edge cases covered (dome, hybrid, ScreenX, masking, FOV). No blockers.
- Step 3: All presets, venues, home displays, content formats authored and validated. Audited 2026-04-26 — data quality clean after two fixes (imax_cola contrast_notes added; Home Theater Research naming table corrected to match canonical AGENTS.md IDs).
- `schema/theater.schema.json` is version `1.5.0` (adds `r_imax_csv`/`lfexaminer` source quality/source-row support and `screen.width_confidence`).
- `src/math/` exists and has 133 passing validation tests.
- Sparse 143190.xyz import mapping exists under `src/data/`.
- Hybrid projection modes are schema-backed for digital + film IMAX venues.
- Research updated: Dolby Cinema section corrected; RPX section fully resolved; Home Theater Research preset ID table updated to match canonical filenames.
- Step 3 audit remediation applied: schema-valid standard/ScreenX light sources, computable Mugar dome geometry, Mugar post-2021 dome-laser modeling, corrected RPX geometry, full Step 3 data validation, ScreenX capability preservation, and imax_cola contrast source downgraded to community_estimate with explanation.
- Step 4 Batch 2 audit remediation applied: `docs/` workbench now exposes `cinemark_xd` and `dolby_cinema_single_laser`, corrects Reading GT mid-seat estimate to ~75 ft, discloses the 143190 Xenon-only venue gap near search, and adds docs regression validation for Providence 15/70 vs Reading GT visible-area/native-contrast winners.
- Step 4 CoLa utilization clamp applied: `docs/` workbench visible content area/FOV/utilization now clamp presentation windows to physical screen bounds, with regression coverage for Assembly Row vs Boston Common CoLa.
- Priority 1 education-first website overhaul applied: one-page IMAX 101 explainer, stronger novice homepage copy, curated film examples, source links, randomized example chips, national/state stats, diagnosis AR-loss/source-confidence/seat-geometry panels, and expanded docs regression checks.
- Phase 4a canonical docs data unification applied: promoted docs 143190 snapshot to `src/data`, added generated docs data/runtime build, routed docs comparisons through resolver-backed generated records, and expanded schema/docs validation.
- Priority 2 LFExaminer Xenon supplement applied: parsed the archival 2021 LFExaminer theater table from webarchive, stored U.S. IMAX D/1570+D candidates, and promoted comparable unmatched rows into generated docs data with low-confidence provenance.
- Dolby Cinema U.S. count checker groundwork applied: snapshot-producing TypeScript checker, generated `db.dolby_cinema_us_count` docs token, manual GitHub Actions workflow, and validation coverage.
- Pre-GUI taxonomy/stat blockers applied: LIEMAX = Dual Xenon, IMAX Lite = CoLa/Laser XT, generated DB count tokens replace hardcoded launch stats, and Dolby count copy uses the generated snapshot token.

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

### Current GUI Status

The `docs/` frontend is a **rough functional prototype only**. It was built to prove out the data layer and comparison logic — not as a shippable design. The current implementation includes the IMAX 101 section, diagnosis cards, state/national stats, and comparison workbench, but the layout, flow, and visual design are all placeholder-quality. Do not polish or extend the current `docs/` UI — a full overhaul is planned (see below).

### Next Priority: Overhaul V2

The next major work item is a ground-up redesign of the website based on the Overhaul Bible at `.ai/OVERHAUL_BIBLE.md`.

**Key architectural decisions in the V2 design:**
- Four-page structure: Home (guided flow), Compare (standalone workbench), IMAX 101 (standalone with Deep Dive), with a persistent four-item nav bar.
- Home page is a single-scroll progressive disclosure: Splash → Layer 1 (plain-English verdict) → Layer 2 (IMAX 101 curriculum, six ordered blocks) → Layer 3 (full technical diagnosis) → Layer 4 (Deep Dive entry point). Theater selection unlocks layers below the splash in-place — no page navigation.
- Layer 1 is zero-jargon; Layer 3 is technically full — same user, same session, but vocabulary is built by Layer 2 before Layer 3 is reached.
- Verdict tiers: TRUE IMAX (🟢, sub-states: gt_laser / film_conditional / both), IMAX LITE (🟡, CoLa/XT), LIEMAX (🔴, dual xenon), DOME (⚪, categorically distinct — not ranked against flat-screen tiers).
- Splash has a three-stat strip driven by `{{db.*}}` tokens (already generated); headline is *"You're probably not getting real IMAX."*
- Sitewide tooltip system: dotted underline on first use only, small card on hover/tap, optional anchor to IMAX 101 block.
- Geolocation or static region-lookup for "nearest True IMAX" callout in Layer 1; fallback to Lincoln Square (national best, not nearest).
- Build sequence in Bible section 11 defines implementation order (nav → splash → verdict transform → venue sub-states → tooltips → Layer 1 card → Blocks 1–6 → Layer 3 → accordion → workbench → Layer 4 → standalone pages → Deep Dive → stat sync).
- All `{{db.*}}` stat tokens already exist in `window.LIEMAX_DATA.db` — no new data work needed for the splash strip.

**Open questions from Bible (resolve before affected sections are built):**
- Dolby Cinema 2025 single-laser fL spec not yet published by Dolby.
- 15/70-capable venue list beyond Providence + Lincoln Square needs full tagging.
- Infinity Vision: no official venue list as of April 2026 — exclude from ladder and workbench until verifiable.
- RPX laser vs. xenon split is not uniform; do not present RPX as uniformly laser.

### Step 4 Legacy Notes

- Step 4 diagnosis follow-ups to remember: fix Metreon/Lincoln featured example ids in `docs/app.jsx` (`_and_imax`), and require explicit 1.43-capable dome projection/mode before classifying future dome rows as `true_dome`.
- Functional comparison workbench lives in `docs/`, with side A and side B allowed to select the same venue for A/B testing.
- `docs/` data is canonical-generated and includes LFExaminer archival Xenon-only IMAX supplement, but those rows are stale 2021 data; keep `npm run validate:docs` in CI as the frontend behavior guard.
- Branch note: `GUI-work` is the active Step 4 branch, squashed onto `main` after the local Steps 1-3 merge commit `fb74985` (`Merge Steps 1-3 overhaul: schema, math, data, presets, compare engine`).
- Reset note: on 2026-04-29, `codex/overhaul` was intentionally reset to pre-GUI commit `970b870d0fadfc8c845324a7a1acac8d51e3fc80` (`Add cinemark_xd preset; upgrade preset sources to published_cto; schema v1.3.1`).
- Backup note: the pre-reset GUI work is preserved on branch `codex/gui-wip-backup` at commit `b874f88` (`Backup current GUI work before rebuild`).
- Dev convenience: `boot-website.command` remains at repo root as the launcher for the future frontend rebuild; it may not start a website until Step 4 frontend tooling exists again.

## Project Memory Milestone

Math Engine Validated - No refactors permitted without explicit instruction.
