# LIEMAX Project Context

> **Last Updated:** 2026-04-24 15:38 EDT
> **Repo:** https://github.com/ryrymags/LIEMAX
> **Owner:** Ryan ("ryrymags")

## Quick Status

- **Where we are:** Step 2 (Math Engine) just completed. 96 tests passing.
- **What's done:** Schema (`schema/theater.schema.json` v1.1.1) + Math Engine (`src/math/`) + Research dump (`research/`)
- **What's next:** Step 3 — populate format presets with real data from research docs. First time real data flows through the resolver.

---

## Repo Structure

```
LIEMAX/
├── README.md                          ← short pitch + entry points
├── LIEMAX_PROJECT_CONTEXT_*.md        ← this file (engineering journal)
├── package.json
├── tsconfig.json
├── .gitignore
├── schema/
│   └── theater.schema.json            ← v1.1.1, source of truth for data model
├── research/                          ← raw research docs (added by Ryan, Apr 25)
└── src/
    └── math/                          ← pure-function math engine (Step 2)
        ├── index.ts                   ← barrel export
        ├── types.ts                   ← resolved-record interfaces
        ├── constants.ts               ← sourced conversion factors + thresholds
        ├── geometry.ts                ← unit conversions, dimensions, areas
        ├── fov.ts                     ← horizontal/vertical/dome FOV
        ├── ppd.ts                     ← pixels-per-degree (cinema/home/film/dome/off-axis)
        ├── masking.ts                 ← AR masking, effective area, crop loss
        ├── brightness.ts              ← fL↔nits, cinema-vs-home comparison
        ├── seating.ts                 ← SMPTE/THX distance derivation
        ├── resolver.ts                ← preset+venue field-level merge
        └── validate.ts                ← 96-test suite (run via `npm run validate`)
```

---

## Project Vision

A website that visualizes and compares movie screens and aspect ratios, with an emphasis on IMAX theaters. The goal is to eradicate "LIEMAX" misconceptions and educate people on the real capabilities of their local theaters.

**Core question the site answers:** *"What will this actually look like from my seat?"*

We are NOT trying to out-database existing resources. We are the **interpretation and visualization layer** on top of that data — translating raw specs into experiential understanding.

---

## Key Differentiators

1. **Experience-focused, not spec-focused.** Helps users understand what specs *mean* for their viewing experience.
2. **Format-agnostic comparisons.** Organizes by underlying variables (screen size, brightness, resolution, seating geometry), not brand categories. Formats are attributes, not categories.
3. **Simulated first-person theater environments.** Eventually: sit in a virtual seat and see what different theaters/aspect ratios actually look like.
4. **Community-driven updates.** Users can suggest corrections and additions to theater data.
5. **Preset system.** Lowers the barrier — users who don't know their theater's specs can still compare.

---

## External Data Sources & References

| Source | URL | Notes |
|--------|-----|-------|
| Anthony Lavado's IMAX DB | https://143190.xyz/ | Primary data source. GitHub-backed, consistently updated (last commit Mar 30, 2026). |
| LFExaminer IMAX Size Tool | https://addons.mozilla.org/en-US/firefox/addon/lfexaminer-imax-size-tool/ | Firefox extension by u/Many_Reindeer6636. Visual comparison tool. |
| LFExaminer (main site) | lfexaminer.com | Not updated since ~2021. Secondary/manual reference only, NOT a live integration target. |
| Reddit r/imax | https://www.reddit.com/r/imax/ | Community knowledge base. |

**Decision:** Build around 143190.xyz as the primary external data source. LFExaminer is a manual reference for gap-filling, not a live integration.

**Data Flow (143190.xyz):** There is no live API. The database is a community-maintained CSV export (CC BY-SA 4.0 via `r-imax/imaxguide` GitHub repo).
- Periodically pull fresh CSV export from 143190.xyz or the GitHub repo
- Ingest script generates/updates `VenueRecord` objects — overwrites `screen.width_m`, `screen.height_m`, `projection.type`, `capabilities.min_content_ar_supported`
- Preset fills everything the CSV doesn't carry (brightness, contrast, sound, seating geometry — research-derived specs that don't change week to week)
- Flow: **CSV export → ingest script → update VenueRecord fields → preset fills gaps**
- Eventually: lightweight diff script that compares latest CSV against existing venue records, updates only changed fields, bumps `metadata.last_verified`. Schema already shaped for this (`metadata.last_verified`, `metadata.data_source: "r_imax_csv"`, `metadata.source_url`).

---

## Build Order (Agreed Upon)

### Step 1: Research & Data Schema ← **COMPLETE — schema v1.1.1**
- Dump all existing research into structured format
- Design a JSON schema for theaters/screens that captures everything needed
- Screen dimensions, projector specs, brightness, resolution, aspect ratios, seating geometry
- **Lives at:** `schema/theater.schema.json`

### Step 2: Math Engine ← **COMPLETE — 10 files, 96 tests passing, audited**
- PPD (pixels per degree) formulas
- Field of view calculations from seating distance
- Brightness comparisons (foot-lamberts)
- Resolution equivalences (including contentious ones like 15/70 film and GT laser pixel-offset supersampling)
- All written as pure, testable functions — no UI
- Must be **bulletproof** — this audience will tear apart bad math
- Be transparent about methodology and cite sources
- **Lives at:** `src/math/` — see `src/math/index.ts` for the public surface, `src/math/validate.ts` for the test suite (`npm run validate`)

### Step 3: Presets
- Define default specs for common theater types:
  - Standard IMAX Digital (single laser, dual laser)
  - IMAX GT Laser (1.43:1 capable)
  - IMAX with 15/70mm Film
  - IMAX Dome / OMNIMAX
  - Dolby Cinema
  - Generic RPX
  - Standard Multiplex
  - ScreenX
  - (others TBD)
- This is where research directly becomes product

### Step 4: Build the Website
- Give Claude Code clear, scoped tasks with the data model, math, and seed data ready
- Tech stack TBD (likely static site on Netlify/Vercel)

### Step 5: Community & Data Sharing
- User-created theater entries (saveable, shareable)
- "Suggest an edit" + review queue model (like OpenStreetMap)
- Timestamps and version history on theater data
- Lightweight to start — possibly GitHub Issues/PRs as submission pipeline
- Needs moderation strategy to prevent trolling

### Step 6: Advanced Simulation
- Three.js first-person theater environments
- Sit in virtual seats (front, middle, back, optimal)
- Multiple theater types (IMAX, Dome, ScreenX, multiplex)
- Real movie stills on screens in proper aspect ratios
- Start with ONE generic IMAX layout, prove the concept, then branch out
- Show human-scale reference (person standing at screen base)

---

## Core Features (Detailed)

### Comparison Engine
- Select theaters from 143190.xyz data OR enter custom specs
- Switch between compatible aspect ratios on a screen with live stat updates
- Side-by-side comparisons across any format

### Statistics & Metrics
- **Pixels Per Degree (PPD):** The real measure of perceived sharpness
- **Brightness (foot-lamberts):** Dolby Vision vs IMAX vs standard
- **Field of View (FOV):** From specific seating positions
- **Screen Area:** Total and visible (accounting for masking/aspect ratio)
- **Resolution:** Native, effective, and perceived
- **Contrast Ratio**
- **Aspect Ratio:** With visual representation of what you gain/lose

### Custom Input System
- Enter screen width, height, projector type, sound system, etc.
- Presets for when users don't know specs (e.g., "Standard RPX")
- Should handle non-IMAX theaters too (Dolby, RPX, standard, LPF, etc.)

### Simulation (Future)
- First-person view from different seats
- Aspect ratio switching on the virtual screen
- Different theater geometries (stadium vs IMAX vs dome)
- Proper movie stills (1.43:1, 1.90:1, 2.39:1)
- IMAX seating is steeper/more vertical than standard theaters

### Community Features (Future)
- Suggest updates to theater data
- Timestamped entries with change history
- Past versions viewable
- Intelligent validation system
- Example: Providence Place IMAX switched from Showcase to Apple Cinemas, got CoLa digital projector, upgrading seats, fixing 70mm projector for The Odyssey — only locals would know this

---

## Hosting & Constraints

- **Free hosting** — no paid domains, no ads, no personal server resources
- Likely **Netlify or Vercel** (static site)
- Client-side rendering for comparisons and simulations
- Backend requirements (community features) may need creative solutions:
  - GitHub repo as pseudo-backend (theater data as JSON, PRs for updates)
  - GitHub Issues as lightweight submission pipeline
  - Defer full backend until necessary

---

## Technical Considerations

### Math Engine Notes
- 15/70mm IMAX film resolution equivalence is **contentious** — be transparent about methodology
- GT laser pixel-offset supersampling resolution claims are debated — cite sources
- IMAX Dome: huge surface area but perceived sharpness is lower than flat screens
- PPD varies by seating position — must account for distance AND screen curvature

### Simulation Notes
- Three.js can handle simplified theater geometry client-side
- Flat screen plane + tiered seating + proper FOV camera = viable starting point
- Multiple theater types = maintaining a library of 3D environments (scope carefully)
- Don't need photorealism — "crude but good enough" is the stated goal

### Data Architecture Notes
- Layered approach to data:
  - **Presets:** Built-in defaults for common formats (always available)
  - **User-created entries:** Personal, saveable, shareable
  - **Verified public data:** Gradually promoted from user submissions
- Theater data should include: source, timestamp, confidence level
- Avoid pure wiki model (trolling risk) AND pure gatekeeper model (doesn't scale)

---

## Open Questions

Active, unresolved. (For resolved decisions, see Decisions Log below.)

- [ ] Tech stack decision (React? Svelte? Vanilla? — affects Netlify/Vercel deployment)
- [ ] Community moderation strategy details
- [ ] What movie stills to use for simulation (licensing?)

---

## Decisions Log

Resolved decisions with reasoning, ordered roughly chronologically.

| Decision | Outcome | Resolved |
|---|---|---|
| Off-axis PPD scope | Math written in Step 2 (see `src/math/ppd.ts:offAxisPpd`); UI exposure deferred to Step 4. Schema has nullable `seat_offset_from_center_ft`. | Apr 23 |
| 143190.xyz integration | Seed `theater_name`, location, screen dims, projector type, max AR from r-imax CSV; fill optical specs from preset defaults with venue overrides. | Apr 23 |
| 15/70 film resolution equivalence | Express as ~8.8K–11.7K scan-equivalent range, not single number. Always labeled grain-limited in practice. (`src/math/ppd.ts`, modes `scan_equivalent_low/high`.) | Apr 23 |
| GT laser supersampling | ~5.8K illustrative (√2 × 4096). Always labeled non-official. (`src/math/ppd.ts`, mode `supersampled`.) | Apr 23 |
| IMAX Dome handling | Modeled as `geometry: hemispherical` with explicit dome FOV fields (180° × 125°). PPD = pixels / FOV (avg across dome). | Apr 23 |
| Sound system depth | Descriptive attribute in v1: name, object-based bool, channel count. SPL deferred. | Apr 23 |
| Historical data approach | Current state only + structured `history` changelog array per venue. | Apr 23 |
| Seating distance estimation | SMPTE/THX multipliers: 0.87×/1.5×/2.25× screen width. Tagged with `viewing_distance_source: derived_from_screen_width`. (`src/math/seating.ts`.) | Apr 23 |
| Brightness defaults | IMAX = 22 fL; standard xenon = 14 fL; Dolby = 31 fL; XD = 22–35; RPX = 14–20; Samsung Onyx = 146. | Apr 23 |
| Contrast defaults | CoLa ~10K:1; dual xenon ~2–2.6K:1; RPX 1,850:1; XD ~5–10K:1. | Apr 23 |
| Screen curvature representation | Enum `flat`/`slight_cylindrical_curve`/`hemispherical` + nullable `curvature_radius_ft`. | Apr 23 |
| AR masking math | Full content-AR × screen-AR matrix (letterbox / pillarbox / crop). (`src/math/masking.ts`.) | Apr 23 |
| Schema storage | Repo (`schema/theater.schema.json`) is source of truth; project files mirror for Claude session context. | Apr 23 |
| Math engine language | TypeScript. Type safety matches JSON schema; easy to consume in any web stack later. | Apr 24 |
| Dome PPD model | Simple `pixels / dome_FOV_degrees` with caveat about non-linear pixel mapping. Quantifies "dome trades sharpness for immersion" (~22.8 vs ~77 PPD). | Apr 24 |
| Off-axis PPD timing | Implement now (Step 2), wire to UI in Step 4. | Apr 24 |
| README vs PROJECT_CONTEXT | Separate files. README = 30-second pitch + entry points. PROJECT_CONTEXT = engineering journal. | Apr 24 |
| File timestamping | ISO 8601 in filenames (`YYYY-MM-DD_HHMM`) for chronological sorting. EDT in entries (technically correct vs EST in late April). | Apr 24 |

---

## Research Status

- [x] Ryan's existing research dumped and organized
- [x] Format of existing research: Three project knowledge docs — (1) IMAX Dome deep-dive, (2) Premium Cinema Master Reference, (3) Missing Data & Gap Analysis
- [x] Research reviewed and gap analysis completed
- [x] Gap analysis RESOLVED — Ryan filled all missing data (brightness, contrast, seating geometry, curvature, AR masking math, sound recommendation, 143190.xyz structure, historical data approach)
- [x] Data schema design: **COMPLETE — `theater.schema.json` v1.1.1 (cinema + home display support)**
- [x] 143190.xyz CSV structure: INFERRED from GitHub repo — fields: theater_name, city/state/country, screen_width_m, screen_height_m, projector_type, max_aspect_ratio
- [x] Math engine: **COMPLETE — 8 TypeScript modules, 96 tests, audited. PPD, FOV, masking, brightness, seating, dome, off-axis, resolver.**

---

## Session Log

### Session 1 — April 23, 2026
- Reviewed Ryan's project vision document (stream of consciousness + ChatGPT/Claude Opus feedback)
- Agreed on build order (6 steps)
- Identified 143190.xyz as primary data source, LFExaminer as secondary reference only
- Created this context document
- **Next:** Ryan shares existing research → we design the data schema together

### Session 2 — April 23, 2026, ~8:45 PM EDT
- **Research files reviewed in full:**
  - `IMAX_Dome_Projection__Specs_and_FOV.md` — Deep technical synthesis of Dome/OMNIMAX projection (212 lines). Covers 15/70 rolling loop mechanics, 30mm fisheye optics, 9.4mm lens offset, 180°×125° FOV, 80-86% hemisphere coverage math, film-to-4K-laser transition, audio architecture, dome mastering process.
  - `RESEARCH_premium-cinema-master-2026-2_docx__1_.md` — Comprehensive 670-line master reference (April 2026). Covers: historical context, IMAX format taxonomy (15/70, GT Dual Laser, dual xenon, CoLa/XT, Dome), Dolby Cinema, XD, RPX, ScreenX, 4DX, D-BOX, Infinity Vision. Includes PPD tables, area comparisons, business data, New England venue guide, common misconceptions, open questions, and refresh methodology. Already audited against primary sources with corrections applied.

- **Research quality assessment:** Publication-quality. Self-critical about disputed numbers (15/70 resolution range, Dolby contrast caveat, GT supersampling). Real venue dimensions from IMAX Americas CSV. Strong math foundations (PPD formula, area formulas, hemisphere coverage).

- **Gap analysis completed — missing data for schema/math engine:**
  1. **Brightness:** Only GT Laser (~22 fL) and Dolby Cinema (~31 fL / 106 cd/m²) documented. Missing: CoLa, standard xenon, XD, RPX, standard 2K/4K digital, 15/70 film projection.
  2. **Seating geometry:** Only a few example distances in PPD table. Need front/mid/back row distances per theater type, rake angles (Dome 30° documented; GT steeper than standard; others unknown), screen height off floor.
  3. **Contrast ratios:** 15/70 (~4,000:1), GT Laser (~8,000:1), Dolby (~1M:1 dynamic / ~5-7.5K:1 native) documented. Missing: CoLa, standard xenon, XD, RPX.
  4. **Sound system depth:** IMAX 12.1 and Dolby Atmos well-covered. XD/RPX/standard configs fuzzy. Decision needed: is sound a visual/descriptive feature or a numerical comparison metric?
  5. **Screen curvature:** Dome (hemispherical) and flat screens described, but GT curvature radius unknown. CoLa flat vs curved unknown. Affects edge-seat FOV calculations.
  6. **143190.xyz CSV structure:** Need column headers to map into schema. Ryan confirmed CSV exists (IMAX Americas CSV referenced in research) — need to share its structure.
  7. **Aspect ratio masking matrix:** Math needed for every content-AR × screen-AR combination (effective visible area).

- **Confirmed math is solid:**
  - PPD formula correct
  - Area comparison formulas correct
  - Hemisphere coverage calculation verified
  - Enhancement needed: off-axis PPD and screen curvature handling (Step 2 scope)

- **Decisions needed before schema draft:**
  1. 143190.xyz CSV column headers
  2. Sound: descriptive attribute or numerical comparison metric?
  3. Historical data support (theater upgrade history) or current-state only?
  4. Seating distance estimation approach (formula from screen size? community data? both?)

- **Next:** Resolve open questions above → draft the JSON schema for theater/screen data model

### Session 2 (cont.) — April 23, 2026, ~9:30 PM EDT
- **New file reviewed:** `Premium_Cinema_Schema__Missing_Data___Gap_Analysis.md` (305 lines). Ryan filled ALL gaps from the Session 2 gap analysis with sourced data.
- **All major gaps now closed:**
  - Brightness: complete table across all tiers (all IMAX = 22 fL; standard xenon = 14 fL DCI; Dolby 2D = 31 fL; XD ~22-35; RPX ~14-20; Onyx ~146)
  - Contrast: complete (CoLa ~10K:1; dual xenon ~2-2.6K:1; 15/70 ~4-5K:1; RPX 1,850:1; XD ~5-10K:1; Dolby 1M:1 dynamic / ~5-7.5K:1 native)
  - Seating geometry: SMPTE/THX multiplier formula (front=0.87×, mid=1.5×, back=2.0-2.5× screen width); derived distances for all NE venues; rake angles (standard 5°, Dolby ~8-12°, Dome 30°); screen bottom height default 5 ft
  - Screen curvature: enum approach (flat/slight_cylindrical_curve/hemispherical) + nullable radius
  - AR masking matrix: full formulas + complete content-AR × screen-AR table with utilization percentages
  - Sound: descriptive attribute in v1 (name, object-based bool, channel count); SPL deferred
  - 143190.xyz: structure inferred from r-imax GitHub repo — seeds name, location, screen dims, projector type, max AR; optical performance from format defaults
  - Historical data: current state + `history` changelog array
  - Off-axis PPD: formula provided with curved-screen correction; recommended as Step 2 math with schema field included now
- **Decisions confirmed (from Ryan's recommendations):**
  - Sound = descriptive attribute, not numeric comparison (v1)
  - Historical = current state + changelog array
  - Curvature = enum + nullable radius
  - Seating = derived from screen width via SMPTE/THX multipliers
- **One pending micro-decision:** off-axis PPD in v1 UI or v2? Leaning: include `seat_offset_from_center_ft` in schema, implement math in Step 2.
- **Status: READY TO DRAFT JSON SCHEMA** — all inputs available
- **Next:** Confirm off-axis decision → draft the full theater/screen JSON schema (Step 1 deliverable)

### Session 2 (cont.) — April 23, 2026, ~10:00 PM EDT
- **Decision confirmed:** Off-axis PPD deferred to Step 2. Schema includes `seat_offset_from_center_ft` as nullable field; math engine v1 is center-seat only.
- **Storage decision:** JSON schema stored in BOTH repo (source of truth) and project files (Claude session context).
- **Action:** Drafting full JSON schema — the Step 1 deliverable.
- **SCHEMA DRAFTED: `theater.schema.json` (v1.0.0)** — Valid JSON Schema draft-07. Defines three entity types:
  1. **`format_preset`** — Default specs per format tier (e.g., "IMAX GT Dual Laser"). Fields: screen, projection, sound, seating, capabilities, tier, ticket premium, known limitations.
  2. **`venue_record`** — Specific real-world theater. References a preset by ID; non-null fields override preset defaults. Includes location, coordinates, history changelog, metadata with provenance tracking.
  3. **`content_format`** — Content aspect ratio definitions for masking math (e.g., "IMAX 1.43:1", "Scope 2.39:1"). Includes example films, area comparison vs scope, home release behavior.
  - Inheritance model: venue fields override preset defaults; null = fall through to preset.
  - Key enums: `source_quality` (provenance tracking), `screen_geometry` (flat/curved/hemispherical), `projector_type` (14 types), `seat_type`, `distance_source`, `hdr_type`, `tier` (flagship/premium/standard/base/specialty).
  - Dome-specific fields: `dome_coverage_pct`, `dome_fov_horizontal_deg`, `dome_fov_vertical_deg`, `dome_fov_above_horizon_deg`, `dome_fov_below_horizon_deg`.
  - Step 2 reserved field: `seat_offset_from_center_ft` (off-axis PPD).
  - Schema validated as valid JSON and valid JSON Schema draft-07.
  - **Storage:** repo (`schema/theater.schema.json`) + project files.
- **Next:** Populate preset data (Step 3 seed) → begin math engine (Step 2)

### Session 2 (cont.) — April 23, 2026, ~10:45 PM EDT
- **Perplexity peer review of schema.** Ryan ran v1.0.0 through Perplexity for structural review. 7 items flagged; 4 accepted as fixes, 3 rejected.
- **Fixes applied (→ v1.0.1):**
  1. `screen.aspect_ratio`: made nullable, removed from `required`. Prevents validation failures on partial venue overrides from CSV imports. Physical screen AR is now distinct from `capabilities.min_content_ar_supported` (content displayability).
  2. `max_aspect_ratio_tall` → renamed to `min_content_ar_supported`. Lower AR number = taller image, so "min supported AR" reads naturally. Test: `min_content_ar_supported <= 1.43` → can show full IMAX.
  3. `hdr_type`: added `"photochemical"` for 15/70 film. `"none"` implied no DR advantage; `"photochemical"` correctly represents film's chemical emulsion latitude.
  4. `has_voice_of_god` → renamed to `dome_zenith_channel`. Avoids false positives for Dolby Atmos overhead speakers, which are structurally different from the dome's physical apex speaker array.
- **Rejected (out of scope or non-issues):**
  - Lamp age degradation flag: can't track per-venue lamp age; not a schema field. (Ryan agreed.)
  - `contrast_dynamic` integer concern: 1,000,000 is a valid JSON integer. Non-issue.
  - `data_source` enum renaming: `r_imax_csv` is correct — we pull timestamped CSV exports, not live DB queries.
- **Added:** Resolver merge note in schema top-level description — field-level merge (`{ ...preset, ...venue }` per sub-object), not object-level replacement. Step 2 implementation note.
- **Schema v1.0.1 validated:** valid JSON + valid JSON Schema draft-07 + all 4 fixes programmatically verified.
- **Next:** Populate preset data (Step 3 seed) → begin math engine (Step 2)

### Session 2 (cont.) — April 23, 2026, ~11:15 PM EDT
- **143190.xyz data flow clarified** and added to External Data Sources section. No live API — periodic CSV pull → ingest script → VenueRecord update → preset fills gaps. Schema already supports this via nullable overrides + metadata timestamps. Diff-based ingest script is a Step 2 deliverable.
- **RESEARCH GAP IDENTIFIED: Home displays (TVs, phones, projectors).** Schema v1.0.1 only covers cinema venues. The comparison engine needs home display records to answer "how does my TV compare to IMAX?" — a core user question.
- **New research file added:** `Home_Display_Reference___Cinema_Comparison_Schema.md` (359 lines). Covers:
  - Panel tech taxonomy: WOLED, QD-OLED, Mini-LED, QLED LCD, standard LCD (with 2024-2025 flagship specs)
  - Brightness: full nits table across all TV tiers + cinema cross-reference. Key insight: standard OLED full-screen is 3-6× brighter than DCI multiplex in raw nits, but ambient light is the real variable.
  - Contrast: OLED = infinite/per-pixel (can't store as integer — needs `is_per_pixel_oled` boolean + null contrast); Mini-LED ~5K-20K:1; standard LCD ~1K-4K:1
  - Color gamut: DCI-P3 coverage % across all tiers; film = "photochemical, not specifiable as %"
  - Resolution/PPD: iPhones (460 PPI, ~275 PPD at 12in — far past retinal); TV PPD at rec. distances (~82-110 PPD); 8K marginal benefit per Cambridge study
  - HDR formats: HDR10, HDR10+, Dolby Vision, HLG, DV IQ — compatibility matrix
  - Viewing environment: ambient lux (cinema ~1-5; dim room ~50-200; bright ~1K-10K) — most consequential variable in home-vs-cinema comparisons
  - 10 proposed home display presets (OLED flagship → Android phone)
  - User input UX: what users know (brand, size, "OLED") vs. what they don't (nits, contrast, P3%)
- **Schema update needed before Step 2:** Add `HomeDisplayPreset`, `HomeDisplayRecord`, `panel_tech` enum, `viewing_environment` object, `is_per_pixel_oled` flag, `hdr_format_array`, `screen_diagonal_in`, `color_gamut_dci_p3_pct`. Same inheritance model as cinema. Masking math extends to accept home displays — no new math, just new input type.
- **Next session:** Update `theater.schema.json` → v1.1.0 with home display support → then Step 2 (math engine) or Step 3 (preset data)

### Session 3 — April 24, 2026, ~12:00 AM EDT
- **Schema updated to v1.1.0** — home display support added. All new additions validated (valid JSON + valid JSON Schema draft-07).
- **New enums added:**
  - `panel_tech`: woled, qd_oled, tandem_oled, miniled_lcd, qled_lcd, standard_lcd, amoled, projector_dlp/lcd/lcos
  - `hdr_formats_supported`: array of HDR formats (TVs support multiple simultaneously, unlike cinema's single hdr_type)
  - `device_category`: tv, phone, tablet, monitor, home_projector
- **New definition types:**
  - `display_optics`: home equivalent of `projection`. Nits as native unit (not fL). Three brightness tiers: peak_hdr (spec sheet), fullscreen (fair cinema comparison), sdr. `is_per_pixel_emissive` boolean for OLED infinite contrast handling (null contrast_sequential + display "Infinite (OLED)"). PPI field for PPD calc. `color_gamut_dci_p3_pct` for numeric gamut comparison.
  - `home_display_preset`: parallel to `format_preset`. Carries `default_viewing_distance_ft` (1.5× screen height for TVs, 1.0 ft for phones), `default_screen_diagonal_in`, `default_aspect_ratio`, `default_display_optics`. Users don't need to measure — presets provide sensible defaults.
  - `home_display_record`: parallel to `venue_record`. User's specific setup. Fields: `user_label`, `brand`, `model`, `screen_diagonal_in`, `viewing_distance_ft` (override), `year_purchased`, `display_optics` (override). Same inheritance: null fields fall through to preset.
- **Explicitly excluded (Ryan's call):**
  - `viewing_environment` / ambient lux modeling — overkill for v1. If needed later, trivially addable as a new definition.
- **Design decisions:**
  - Viewing distance is both preset-default AND user-overridable. Presets carry sensible defaults so nobody has to measure. Enthusiasts override.
  - `display_optics` is a separate type from `projection` — they share comparable fields (brightness, contrast, gamut, HDR, resolution) but in native units for their context. The math engine accepts either as input.
  - Same inheritance model as cinema: record overrides preset, field-level merge.
- **Schema totals:** 23 definitions, 6 top-level arrays (presets, venues, content_formats, home_display_presets, home_displays + schema_version).
- **Next:** Step 2 (math engine) or Step 3 (preset population with real data from research docs)

### Session 3 (cont.) — April 24, 2026
- **Perplexity peer review of v1.1.0:** All clear. One fix applied: removed `"none"` from `hdr_formats_supported` enum — empty array `[]` is cleaner for "no HDR support." Positive callouts: `is_per_pixel_emissive` naming (future-proof for microLED), three-tier brightness split, `tandem_oled` enum, `year_purchased` fallback, `projector_lcos` inclusion.
- **Next:** Step 2 (math engine) or Step 3 (preset population)

### Session 4 — April 24, 2026, ~afternoon EDT
- **Step 2 (Math Engine) kicked off and CORE COMPLETE.**
- **Ryan's decisions (3 open questions resolved):**
  1. Off-axis PPD: **write now** — math ready for Step 4 to wire up
  2. Dome PPD: **simple average** — `H_px / dome_FOV_degrees` with caveat about non-linear pixel mapping. Quantifies "dome trades sharpness for immersion" in one number (22.8 vs 77 PPD).
  3. Language: **TypeScript** — type safety matching JSON schema, easy to strip types later if needed
- **Math engine written: 8 files, 7 groups, ~700 lines of documented TypeScript.**
  - `types.ts` — resolved record interfaces (post-merger, no nulls)
  - `constants.ts` — sourced conversion factors, human vision thresholds (60/80/120 PPD), SMPTE/THX multipliers, DCI/IMAX brightness targets
  - `geometry.ts` — m↔ft, diagonal→W/H, flat area, dome area, AR, PPI
  - `fov.ts` — horizontal FOV, asymmetric vertical FOV (screen bottom ≠ eye level), dome FOV (fixed per spec), home display FOV
  - `ppd.ts` — universal `computePpd()` + cinema (4 resolution modes: native/scan_equiv_low/high/supersampled), dome (avg across FOV), home display, off-axis
  - `masking.ts` — content-AR × screen-AR matrix (letterbox/pillarbox/crop), utilization%, extra area vs scope, content crop loss
  - `brightness.ts` — fL↔nits, cinema-vs-home comparison (uses fullscreen_nits not peak HDR), brightness context strings
  - `seating.ts` — SMPTE/THX distance derivation, home default distances
  - `resolver.ts` — field-level preset+venue merge (cinema + home display)
  - `index.ts` — barrel export
- **Validation: 51 tests, all passing.** Verified against research doc PPD table, masking math, brightness values, area comparisons. Key validations:
  - Reading GT mid-row PPD: 76.83 (research: ~77) ✓
  - 55" 4K TV PPD at 8ft: 137.06 (research: ~137) ✓
  - 4K Dome PPD: 22.76 (expected: 22.8) ✓
  - 1.43→1.90 crop loss: 24.74% (research: ~24.7%) ✓
  - All fL↔nits round-trips exact ✓
- **Finding: Off-axis average PPD counterintuitively INCREASES** (narrower FOV → more px/deg). Real degradation is keystoning + non-uniform pixel distribution, not average PPD. Function includes explanatory caveat. Documented in code.
- **Finding: Vertical FOV at mid-row GT is ~39.8°, not ~44°.** Eye height (3.75 ft) is below screen bottom (5 ft), so viewer looks UP at entire screen. Previous ~44° estimate was rough; math engine gives the precise geometry.
- **Architecture: One universal PPD formula** — `H_px / (2 × arctan(W/2D) × 180/π)` works for cinema AND home. No separate PPI-based formula needed; screen width is derived from diagonal+AR for home displays.
- **Next:** Step 3 (preset population with real data) or peer review of math engine

### Session 4 (cont.) — 2026-04-24 ~13:00 EDT
- **Self-audit completed. 9 issues found, all fixed:**
  1. **BUG: Off-axis PPD docstring stale (3 places)** — said PPD decreases off-axis; actually increases (counterintuitively). Docstring rewritten with correct explanation: FOV shrinks → more px/deg, but image quality degrades from keystoning/non-uniform stretch.
  2. **Inaccurate comment: fov.ts vertical FOV** — said "sum of absolute angles" but code does algebraic sum (correct). Fixed comment.
  3. **Parameter naming: `horizontalFov`, `offAxisPpd`** — params said "Ft" but math is unit-agnostic. Renamed to generic (`screenWidth`, `viewingDistance`, `lateralOffset`). Docstrings now state "units must match."
  4. **Missing tests: Resolver** — added 13 tests: field-level merge, venue override, preset fallthrough, derived fields (ft from m, AR from dims, brightness cd/m², viewing distances), measured distances NOT overwritten, home display resolver with overrides, bare record (all from preset), PPI derivation from overridden diagonal.
  5. **Missing tests: Composition functions** — added 20 tests: `cinemaPpd` (native, supersampled, film-throws-on-digital), `homeDisplayPpd`, `computeCinemaFov`, `domeFov` (+ throws on flat), `compareBrightness` (home brighter + cinema brighter), `brightnessCinemaContext` (3 tiers), `areaComparisonPct`.
  6. **Unused imports** — removed `ContentFormat`, `ResolvedScreen` from masking.ts, `DEG_TO_RAD` from fov.ts.
  7. **DRY: `homeDisplayFov`** — now calls `horizontalFov` instead of duplicating formula.
  8. **JSDoc typo** — `brightnessCinemaContext` param casing fixed.
  9. **Edge case documented** — resolver assumes meters as canonical input (AR derivation uses `width_m`). Not a bug for CSV pipeline but noted.
- **Test suite: 51 → 96 tests, all passing.**
- **Status: Step 2 COMPLETE. Math engine is audited, tested, and ready for integration.**
- **Next:** Step 3 (preset population with real data from research docs)

### Session 5 — 2026-04-24 ~14:00 EDT
- **Repo organization discussion.** Ryan asked how to structure the GitHub repo now that we have ~12 new files (schema + math engine + research).
- **Recommended structure** (now reflected in Repo Structure section above): `schema/`, `research/`, `src/math/`, plus root config files (README, package.json, tsconfig.json, .gitignore).
- **README vs PROJECT_CONTEXT decision:** Keep them separate. README is the 30-second pitch + entry points. PROJECT_CONTEXT is the engineering journal. README points outward; PROJECT_CONTEXT points inward.
- **README drafted** for Ryan to drop in repo root — short (~50 lines), points to schema/research/math/context.

### Session 6 — 2026-04-24 15:38 EDT
- **PROJECT_CONTEXT cleanup applied.**
  - Tightened header into Quick Status (3 bullets: where, done, next)
  - Added Repo Structure section mirroring README
  - Split Open Questions into clean active list + new Decisions Log table (16 resolved decisions with file-path references)
  - Added file-path cross-references to Step 1 (`schema/theater.schema.json`) and Step 2 (`src/math/`)
- **Filename convention switched** to ISO 8601: `LIEMAX_PROJECT_CONTEXT_YYYY-MM-DD_HHMM.md`. Sorts chronologically, no spaces, no ambiguous "afternoon."
- **Timestamp convention** clarified: ISO 8601 date + 24-hour time + EDT (technically correct for late April; EST would be the winter standard).
- **Session log compression** deferred — only 6 sessions in, not yet warranted. Will revisit at ~10 sessions.
- **Next:** Step 3 (preset population) — first time real data flows through the resolver and math engine