# Step 3 Briefing — Presets

**STATUS: COMPLETE.** All presets, home display presets, venues, and content formats are authored. See `.ai/STATE.md` for the full inventory. Proceed to Step 4.

Cold-start: read `.ai/STATE.md` → `.ai/AGENTS.md` → `.ai/REQUIREMENTS.md` → this file.

## What Step 3 Is

Step 3 translates research into schema-shaped product data. The math engine (Step 2) can compute PPD, FOV, masking, and brightness comparisons — but it needs real default specs. Presets are what make the engine useful without requiring users to fill out spec sheets. A venue that references `imax_cola` as its `preset_id` automatically inherits correct brightness, contrast, resolution, AR capabilities, and sound config; only fields the venue meaningfully overrides need to be specified.

Three entity types are produced in Step 3:
- `format_preset` — cinema format defaults (e.g., `imax_gt_dual_laser`, `dolby_cinema`)
- `home_display_preset` — home display tier defaults (e.g., `oled_flagship`, `iphone_pro`)
- `content_format` — aspect ratios for masking math (e.g., `imax_143`, `scope_239`)

---

## File Structure

```
src/data/presets/            ← format_preset JSON files (one per format)
src/data/venues/             ← venue_record JSON files (one per venue)
src/data/home_display_presets/  ← home_display_preset JSON files (one per tier)
src/data/content_formats/    ← content_format JSON files or a single array
```

Each file is a standalone JSON object matching the schema entity type. They are not yet assembled into a full database — that happens in Step 4.

Schema source of truth: `schema/theater.schema.json` v1.4.0.
- `format_preset` definition: `schema.definitions.format_preset`
- `home_display_preset` definition: `schema.definitions.home_display_preset`
- `content_format` definition: `schema.definitions.content_format`

---

## What Is Done

### Format Presets (`src/data/presets/`)
| File | ID | Notes |
|------|----|-------|
| `imax_gt_dual_laser.json` | `imax_gt_dual_laser` | Dual 4K RGB laser, 1.43:1, 22 fL, 8,000:1, 12.1 audio |
| `imax_cola.json` | `imax_cola` | Single 4K laser, 1.90:1, 22 fL, 10,000:1, 12.1 audio |
| `imax_dual_xenon.json` | `imax_dual_xenon` | Dual 2K xenon, 1.90:1, 22 fL spec (degrades 12–14 fL in practice), 2,500:1, legacy |
| `imax_1570_film.json` | `imax_1570_film` | 15/70 film, 1.43:1, scan-equiv 8.8K–11.7K, photochemical |
| `imax_dome_film.json` | `imax_dome_film` | Hemispherical 15/70 film, 180°×125° FOV, 83% hemisphere coverage |
| `imax_dome_laser.json` | `imax_dome_laser` | Hemispherical digital laser dome, 4K, 1.43-capable via dome optics, no film scan-equivalent fields |
| `dolby_cinema.json` | `dolby_cinema` | Dual-laser Christie E3LH, 31 fL, 1M:1 dynamic, Atmos, recliners |
| `dolby_cinema_single_laser.json` | `dolby_cinema_single_laser` | Christie Eclipse-based (May 2025+), ~31 fL community estimate, 20M:1 contrast, 58 ft max screen |
| `rpx.json` | `rpx` | 4K xenon default, 14 fL floor, 1,850:1 contrast, weakest PLF |
| `standard_multiplex.json` | `standard_multiplex` | Baseline 4K laser multiplex room, 1.85:1, 14 fL |
| `screenx.json` | `screenx` | Standard main screen plus ScreenX side-wall capability flag |
| `cinemark_xd.json` | `cinemark_xd` | Barco 4K laser, 1.90:1, 16 fL derived, 2,000:1 floor, Auro 11.1, 168 US screens |

### Venues (`src/data/venues/`)
| File | ID | Notes |
|------|----|-------|
| `apple_providence_imax.json` | `apple_providence_imax` | Hybrid CoLa digital + 15/70 film; 1.43:1 screen from 143190 CSV |
| `mugar_omni_boston.json` | `mugar_omni_boston` | IMAX Dome, Museum of Science Boston; post-2021 dome laser; 23.20 m dome diameter per 143190 CSV (r_imax_csv, medium confidence) |

---

## Final Batch Completed

The following sections describe the final Step 3 batch that has now been authored and validated.

### 1. Standard Multiplex Preset

**File:** `src/data/presets/standard_multiplex.json`
**ID:** `standard_multiplex`
**tier:** `"base"`

Key specs from `research/Master Research.md` §5.1 and general knowledge:
- Screen: 45 ft wide × 24 ft tall typical (13.7m × 7.3m); flat; `aspect_ratio: 1.85`; not perforated
- Projection: `type: "standard_4k_laser"` for modern rooms (override to `standard_2k_xenon` at older venues); 4096 × 2160; 14 fL; ~2,000:1 contrast; no HDR
- Sound: `"5.1 or 7.1 Surround"`; `is_object_based: null` (Atmos at some but not default)
- `min_content_ar_supported: 1.85`; no 1.43:1 capability
- `ticket_premium_usd: null`

### 2. ScreenX Preset

**File:** `src/data/presets/screenx.json`
**ID:** `screenx`
**tier:** `"specialty"`

ScreenX is an add-on, not a standalone format. The main screen is a standard 4K flat screen; multi-wall content extends onto side walls for ~20–40% of the runtime on mastered titles only. Base on a standard multiplex screen spec:
- Same screen dimensions, projection, and AR as standard multiplex
- Key differentiator: `capabilities.has_screenx: true`
- `short_description`: "Side-wall 270° projection on mastered sequences (~20–40% of runtime). Main screen is standard 4K — no resolution or contrast improvement."
- `known_limitations`: ["Side walls only active on specifically mastered sequences — most of the film plays front-only", "Does not improve main-screen resolution, brightness, or contrast"]
- Do NOT attempt multi-wall geometry schema additions — `has_screenx: true` flag is sufficient for v1

### 2.5. IMAX Dome Laser Preset / Mugar Audit Fix

**File:** `src/data/presets/imax_dome_laser.json`
**ID:** `imax_dome_laser`
**tier:** `"specialty"`

This preset separates current digital dome laser venues from legacy/current 15/70 dome film venues.
- Projection: `type: "imax_dome_laser"`, `light_source: "rgb_laser"`, 4096 × 2160, no scan-equivalent film fields
- `min_content_ar_supported: 1.43`; `supports_143_digital: true`; `supports_1570_film: false`
- `anamorphic_stretch: true` to distinguish dome laser optics from flat CoLa/XT limits
- Mugar Omni uses this preset for current post-2021 modeling. Its 76 ft dome diameter is a low-confidence estimate; because width and height both store dome diameter, stored physical `aspect_ratio` is `1.0`, not the 1.43 content capability.

### 3. Home Display Presets

**Directory:** `src/data/home_display_presets/`
**Schema entity:** `home_display_preset` (NOT `format_preset` — different shape)

Required fields per schema: `id`, `display_name`, `device_category`, `tier`, `default_aspect_ratio`, `default_screen_diagonal_in`, `default_viewing_distance_ft`, `default_display_optics`

Viewing distance derivation for TVs: `1.5 × screen_height_ft`. For a 16:9 screen: `height_in = diagonal / √(1.78² + 1) = diagonal / 2.0417`.

| File | ID | diagonal | viewing_dist | Notes |
|------|----|----------|--------------|-------|
| `oled_flagship.json` | `oled_flagship` | 65" | 4.0 ft | LG G5 / Samsung S95F tier |
| `oled_midrange.json` | `oled_midrange` | 65" | 4.0 ft | LG C4 / Samsung S95D tier |
| `miniled_qled.json` | `miniled_qled` | 65" | 4.0 ft | Samsung QN90D / Hisense U8N tier |
| `standard_qled.json` | `standard_qled` | 55" | 3.4 ft | Mid-range QLED LCD |
| `standard_lcd.json` | `standard_lcd` | 50" | 3.1 ft | Budget LCD |
| `iphone_pro.json` | `iphone_pro` | 6.3" | 1.0 ft | iPhone 15/16 Pro tier |
| `android_flagship.json` | `android_flagship` | 6.9" | 1.0 ft | Samsung Galaxy S25 Ultra tier |
| `home_projector.json` | `home_projector` | null | null | DLP default; wide spec variance |

**Spec table from `research/Home Theater Research.md`:**

| ID | panel_tech | peak_hdr_nits | fullscreen_nits | sdr_nits | contrast_sequential | dci_p3_pct | hdr_formats | is_per_pixel_emissive |
|----|------------|---------------|-----------------|----------|---------------------|------------|-------------|----------------------|
| `oled_flagship` | `woled` | 2268 | 331 | 510 | null (OLED) | 99 | `["dolby_vision","hdr10","hlg"]` | true |
| `oled_midrange` | `woled` | 1049 | 257 | 296 | null (OLED) | 98 | `["dolby_vision","hdr10","hlg"]` | true |
| `miniled_qled` | `miniled_lcd` | 2024 | 689 | 236 | 10000 | 100 | `["hdr10","hdr10_plus"]` | false |
| `standard_qled` | `qled_lcd` | 1000 | 300 | 200 | 4500 | 82 | `["dolby_vision","hdr10","hlg"]` | false |
| `standard_lcd` | `standard_lcd` | 300 | 150 | 150 | 1500 | 72 | `["hdr10"]` | false |
| `iphone_pro` | `amoled` | 2000 | null | null | null (OLED) | 100 | `["dolby_vision","hdr10","hlg"]` | true |
| `android_flagship` | `qd_oled` | 1750 | null | null | null (OLED) | 91 | `["hdr10","hdr10_plus"]` | true |
| `home_projector` | `projector_dlp` | null | 200 | 200 | 2000 | 72 | `["hdr10"]` | false |

**Key known_limitations to include:**
- OLED: "Full-screen brightness drops to ~257–331 nits due to OLED thermal limits — spec-sheet peak brightness applies only to small bright highlights on dark backgrounds"
- Mini-LED: "Zone-based local dimming produces halos around bright objects on dark backgrounds — does not achieve OLED per-pixel blacks"
- Samsung (miniled_qled, android_flagship): "No Dolby Vision support (Samsung policy)"
- Home projector: "Brightness and contrast vary widely by model; treat defaults as low-confidence estimates"

**Aspect ratios:**
- TVs: `default_aspect_ratio: 1.78` (16:9)
- iPhones: `default_aspect_ratio: 2.17` (19.5:9 landscape for video)
- Android flagship: `default_aspect_ratio: 2.17` (3120:1440 ≈ 2.17)

**Resolution:**
- TVs: `resolution_horizontal_px: 3840`, `resolution_vertical_px: 2160`
- iPhone Pro 6.3": `resolution_horizontal_px: 2622`, `resolution_vertical_px: 1206`, `ppi: 460`
- Galaxy S25 Ultra 6.9": `resolution_horizontal_px: 3120`, `resolution_vertical_px: 1440`, `ppi: 498`

### 4. Content Formats

**File:** `src/data/content_formats/content_formats.json` (array of `content_format` objects)

Formula for `extra_area_vs_scope_pct`: `(2.39 / aspect_ratio - 1) × 100`

| ID | display_name | aspect_ratio | extra_area_vs_scope_pct | home_release_behavior |
|----|--------------|-------------|------------------------|-----------------------|
| `imax_143` | IMAX 1.43:1 | 1.43 | 67.1 | "Cropped to 1.78:1 for home release — loses ~19.7% of vertical content. No consumer display standard can show the full 1.43:1 frame." |
| `imax_digital_190` | IMAX Digital 1.90:1 | 1.90 | 25.8 | "Preserved on IMAX Enhanced certified displays. Cropped to 1.78:1 on standard 16:9 TVs, showing ~6.3% more than the 16:9 frame." |
| `scope_239` | Anamorphic Scope 2.39:1 | 2.39 | 0.0 | "Displayed with thin letterbox bars on 16:9 TV. IMAX venues show scope at 1.90:1 max width — no extra height benefit." |
| `flat_185` | Standard Flat 1.85:1 | 1.85 | 29.2 | "Thin pillarbox bars on 16:9 TV. Near-full use of screen width." |
| `tv_178` | 16:9 / TV Native | 1.78 | 34.3 | "Fills the entire 16:9 TV screen. Wider than IMAX digital — but a TV is not a cinema." |
| `panavision_220` | 65mm / Panavision 2.20:1 | 2.20 | 8.6 | "Letterboxed on 16:9 TV. Used for Nolan dialogue sequences interspersed with 1.43:1 IMAX footage." |
| `ultrawide_235` | Scope 2.35:1 | 2.35 | 1.7 | "Near-identical to 2.39:1 in practice; older anamorphic prints. Slight letterbox on 16:9 TV." |

Include `example_films` where useful:
- `imax_143`: `["Oppenheimer (2023)", "Dunkirk (2017)", "Interstellar (2014)", "The Dark Knight (2008)"]`
- `scope_239`: `["Dune: Part Two (2024)", "The Batman (2022)", "Avatar: Fire and Ash (2025)"]`
- `panavision_220`: `["Oppenheimer dialogue sequences", "No Time to Die (2021)"]`

---

## Pitfalls

- **Home display presets use `home_display_preset` schema shape, not `format_preset`.** They have different required fields — check `schema.definitions.home_display_preset`. Do not use `format_preset` fields like `default_screen` or `default_projection`.
- **OLED `contrast_sequential` must be `null`**, not a large number. The UI renders "Infinite (OLED)" as a special case. `is_per_pixel_emissive: true` is what signals this.
- **Samsung products (mini-LED TVs, Galaxy phones) do not support Dolby Vision.** `hdr_formats` must not include `"dolby_vision"` for Samsung-tier presets.
- **Phone aspect ratios are for landscape video viewing** (width > height). iPhone 6.3" in landscape = 2622 × 1206 → AR = 2.174. Do not use portrait (1206/2622 = 0.46).
- **ScreenX preset should NOT add multi-wall geometry fields** — the schema has `has_screenx: true` flag which is sufficient. Geometry additions are explicitly deferred future work.
- **Do not infer 1.43:1 digital capability** for any preset or venue unless `projector_type` is `imax_gt_dual_laser`, `imax_dome_laser`, or film capability is `imax_1570_film`. CoLa is always 1.90:1 max.
- **Keep dome geometry and content capability separate.** For a dome venue whose width and height both store physical diameter, `screen.aspect_ratio` should be `1.0`; 1.43 belongs in `projection.min_content_ar_supported` / `capabilities.min_content_ar_supported`.

---

## Verification

After each preset batch:
- `npm run ci` — confirms math engine still clean and schema/data validation passes
- Manual spot-check: load preset JSON, verify all required fields present, check `min_content_ar_supported` matches the format's actual capability
- For home display presets: confirm `default_viewing_distance_ft` is plausible (TV: 3–8 ft; phone: 1.0 ft)
- For content formats: verify `extra_area_vs_scope_pct = (2.39 / aspect_ratio - 1) × 100` matches the table above
