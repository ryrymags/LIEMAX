# Home Display Reference: Cinema Comparison Schema

## Executive Summary

Adding home display comparisons to the cinema comparison engine requires sourced, format-level data across five categories: panel technology (OLED, Mini-LED/QLED, standard LCD), brightness and contrast, color gamut, resolution and pixel density (PPD), and HDR format support. This document provides the spec baseline for every display category the schema needs to support — from iPhones at arm's length to 98-inch TVs in a living room — along with schema design guidance for user presets and manual entry.

The single most important insight for the project's framing: **home displays are not uniformly worse than cinema**. A 65-inch OLED at 6.5 feet hits ~60–75 PPD and delivers infinite per-pixel contrast with 1,049 nits peak HDR brightness — competitive with or exceeding Dolby Cinema's ~31 fL (~106 nits). The cinema's advantage lies in sheer immersive scale, calibrated dark environments, and carefully preserved film mastering intent — not raw pixel quality. The engine should present this honestly.[^1]

***

## Part 1: Panel Technology Taxonomy

The schema needs a `panel_tech` field on home display records. There are five practical categories in 2025–2026, each with meaningfully different optical characteristics.

### WOLED (White OLED)
LG's panel design; used in the C-series, G-series, and most OLED TVs from Sony and Panasonic. Uses a white OLED emitter with RGB color filters plus a white subpixel. Per-pixel dimming yields true blacks and infinite sequential contrast ratio. The 2025 flagship LG G5 uses a new "Primary RGB Tandem" (four-stack) WOLED variant achieving 2,268 nits measured peak HDR brightness at 10% window in Filmmaker Mode — the brightest OLED TV yet measured. The LG C4 (2024 mainstream tier) measures 1,049 nits peak HDR and 296 nits SDR. Full-screen brightness is much lower: the G5 hits only ~331 nits full-screen, which is relevant for overall-bright cinema-style content.[^2][^1]

### QD-OLED (Quantum Dot OLED)
Samsung's panel design; also used in Sony Bravia 9 and related. Pure RGB OLED emitter plus quantum dot layer — no white subpixel, no color filter. Results in significantly better color volume and saturation at high luminance versus WOLED, and a slight brightness advantage for small highlights. The Samsung S95D measured ~1,600 nits peak and ~300 nits full-screen; newer Samsung S95F (2025) improves on this. The main tradeoff: QD-OLED black levels lift in bright rooms due to the quantum dot layer's reflectivity.[^3][^4][^5][^6]

### Mini-LED / Neo QLED
LCD panel with thousands of tiny LED backlight zones rather than full-array larger LEDs. Not self-emissive — cannot achieve true per-pixel blacks, but gets much closer than standard FALD LCD. Samsung QN90D (2024 flagship Neo QLED) measures ~2,024 nits peak HDR at 10% window and 689 nits average brightness — brighter than any OLED in typical content conditions. Hisense U8N measured 3,296 nits peak, the highest in this tier. Best for bright room viewing where OLED's darkness advantage disappears.[^7][^8]

### Standard QLED / LED LCD
Standard LCD with quantum dot enhancement layer. Peak brightness commonly 500–1,500 nits depending on tier. No local dimming zones or very coarse FALD. Contrast ratio ~3,000:1–6,000:1 for better VA panels; IPS panels ~1,000:1. This is the budget and mid-range market majority. Schema preset: `standard_qled_lcd`.[^9]

### Standard LCD (Edge-Lit / No QLED)
The baseline consumer display. Brightness 200–400 nits typical. Contrast 1,000:1–2,000:1 at best. Color gamut typically sRGB to ~72% DCI-P3. No HDR advantage; most "HDR" certifications on this tier are nominal. Schema preset: `standard_lcd`.

***

## Part 2: Brightness — Full Reference Table

All values in nits (cd/m²). To convert to fL for cinema comparison: divide by 3.426.[^10][^11]

| Display / Tier | Peak HDR (10% window) | Full-Screen HDR | SDR Typical | fL Equivalent (full-screen HDR) | Source |
|---|---|---|---|---|---|
| LG G5 OLED (2025 flagship WOLED) | 2,268 nits[^2] | 331 nits[^2] | ~510 nits | ~97 fL | TechRadar lab |
| LG C4 OLED (2024 mainstream WOLED) | 1,049 nits[^1] | ~257 nits | ~296 nits | ~75 fL | Tom's Guide lab |
| Samsung S95D QD-OLED (2024) | ~1,600 nits[^3] | ~300 nits[^3] | ~257 nits | ~88 fL | lbtechreviews lab |
| Sony Bravia 8 OLED (2024 WOLED) | 815 nits[^12] | ~224 nits | ~287 nits | ~65 fL | Tom's Guide lab |
| Samsung QN90D Neo QLED (2024) | 2,024 nits[^8] | ~689 nits[^7] | ~236 nits | ~201 fL | Tom's Guide / Shortcut lab |
| Hisense U8N Mini-LED (2024) | 3,296 nits[^8] | ~1,258 nits | — | ~367 fL | Tom's Guide lab |
| Standard QLED LCD (mid-range) | ~500–1,500 nits[^9] | ~200–400 nits | ~150–300 nits | ~58–117 fL | TechRadar estimate |
| Standard LCD (budget) | ~200–400 nits | ~100–200 nits | ~100–200 nits | ~29–58 fL | Industry standard |
| **Dolby Cinema — SDR mode** | **~54 nits (~16 fL)** | — | ~54 nits | **~16 fL** | Dolby spec / derived |
| **Dolby Cinema — HDR (Dolby Vision)** | **~106 nits (~31 fL)** | ~106 nits | — | **~31 fL** | Dolby spec; primary graded mode |
| **IMAX GT / CoLa (cinema reference)** | **75 nits (~22 fL)** | same — SDR only | 75 nits | **~22 fL** | IMAX spec; no HDR mode exists |
| **IMAX 15/70 film** | **75 nits (~22 fL) target** | same — photochemical only | 75 nits | **~22 fL** | Photochemical latitude ≠ digital HDR |
| **DCI standard multiplex** | **48 nits (~14 fL)** | same — SDR only | 48 nits | **~14 fL** | SMPTE 196M[^13]; single brightness mode |

**Key takeaway for UI framing:** A standard OLED TV at full screen is 3–6× brighter than a DCI multiplex. That comparison needs context — the cinema's dark, controlled environment is what makes 14–22 fL feel immersive. Critically, **digital cinema (IMAX, DCI multiplex) is SDR-only** — no HDR metadata, no tone mapping curve. Dolby Cinema is the sole cinema format that is genuinely HDR in the digital sense, using Dolby Vision mastering with a PQ (ST.2084) transfer function and per-scene tone mapping. IMAX 15/70 film has wide photochemical dynamic range but carries no HDR metadata — the schema correctly handles this via `hdr: "photochemical"` rather than `"hdr10"` or `"none"`.

***

## Part 3: Contrast Ratios

| Panel Type | Sequential Contrast | Notes |
|---|---|---|
| OLED (all subtypes) | Infinite / unmeasurable[^14] | Per-pixel shutoff; effectively ∞:1. Display as "Infinite (per-pixel)" in UI — not a number |
| Mini-LED (high-end) | ~5,000–20,000:1 effective | Depends on zone count and content; halos still visible[^15] |
| Mini-LED (standard) | ~2,000–8,000:1 effective | Fewer zones, more visible bloom |
| QLED LCD (VA panel) | ~3,000–6,000:1 | VA > IPS for contrast |
| QLED LCD (IPS panel) | ~800–1,500:1 | IPS better viewing angles, worse blacks |
| Standard LCD (VA) | ~2,000–4,000:1 | Budget VA typical |
| Standard LCD (IPS) | ~800–1,200:1 | Most common budget panel |
| **Cinema: IMAX 15/70 film** | **~4,500:1** | Photochemical, measured optically |
| **Cinema: IMAX GT Dual Laser** | **~8,000:1+** | Published CTO statement |
| **Cinema: Dolby Cinema** | **"1,000,000:1" dynamic / ~5,000–7,500:1 sequential** | Dynamic = dual-pass DLP; sequential is more comparable |
| **Cinema: Standard xenon DCI** | **~2,000–2,600:1** | Standard projector |

**Schema note:** OLED contrast cannot be stored as an integer ratio. Use `null` for `contrast_sequential` on OLED records and add a boolean `is_per_pixel_oled: true`. The UI should display "Infinite (OLED)" rather than a number. This is the same problem as Dolby Cinema's dynamic figure — both need special-case UI rendering.

***

## Part 4: Color Gamut

Three gamut standards are relevant to the schema:[^16][^17][^18]

- **sRGB / Rec.709**: The legacy standard. Covers ~72% of human-visible colors in CIE 1931. Used by virtually all SDR content — web, streaming SDR, broadcast.
- **DCI-P3 / Display P3**: The cinema and modern HDR standard. ~25% wider than sRGB, better reds and greens. All modern iPhones, OLED TVs, and cinema projectors target this. DCI-P3 = theatrical; Display P3 = Apple's consumer flavor with slightly different white point — treat as equivalent for this schema.[^17]
- **Rec.2020**: Future-oriented ultra-wide gamut. Covers ~75% of visible light. No consumer display fully covers it; best 2025 QD-OLEDs reach ~82–85% Rec.2020.[^19][^2]

| Display / Tier | DCI-P3 Coverage | Rec.2020 Coverage | Source |
|---|---|---|---|
| LG G5 OLED (2025) | ~99%+ | ~82.4%[^19] | Tom's Guide |
| LG C4 OLED (2024) | ~98.15%[^8] | ~72–75% | Tom's Guide |
| Samsung QN90D Neo QLED | ~100% DCI-P3[^15] | ~72–80% | HomeTheaterReview |
| iPhone 16 Pro / 16 Pro Max | Display P3 (wide color)[^20] | Not rated | Apple official |
| iPhone 15 Pro | Display P3[^21] | Not rated | Apple official |
| Samsung Galaxy S25 Ultra | ~90.8% DCI-P3[^22] | Not rated | Tom's Guide lab |
| Standard QLED | ~72–90% DCI-P3 | ~60–72% | Typical range |
| Standard LCD (budget) | ~72% DCI-P3 / sRGB only | <60% | Industry |
| **IMAX GT / CoLa (cinema)** | **Wide Color Gamut (>DCI-P3, RGB laser primaries)** | ~85–90% est. | CTO statements |
| **Dolby Cinema** | **Dolby Wide Color ~112–122% DCI-P3** | ~95%+ | Dolby spec |
| **15/70 Film** | **Very wide, not specifiable as % of P3** | — | Photochemical |

**Schema field:** `color_gamut_dci_p3_pct` (numeric, nullable) and `color_gamut_label` (string). For OLED TVs reporting 98–100% DCI-P3, the label is "Wide Color (DCI-P3)". For Dolby Cinema, "Dolby Wide Color 1.0 (~122% DCI-P3)". For film, "Photochemical (wide gamut, not specifiable as %)".

***

## Part 5: Resolution and PPD

### iPhone Models (2024–2025)

All modern iPhones share 460 PPI regardless of model. The display area differs by diagonal size. Viewing distance assumption: 12 inches (0.305 m) — typical close viewing.[^20][^23][^24]

| Model | Diagonal | Resolution | PPI | Physical Width × Height | Viewing Distance | Estimated PPD |
|---|---|---|---|---|---|---|
| iPhone 16 / 15 | 6.1" | 2556 × 1179[^23] | 460[^23] | ~2.99" × 5.42" | 12 in | ~275 PPD |
| iPhone 16 Pro | 6.3" | 2622 × 1206[^20] | 460[^20] | ~3.07" × 5.53" | 12 in | ~275 PPD |
| iPhone 16 Plus | 6.7" | 2796 × 1290[^23] | 460[^23] | ~3.17" × 6.26" | 12 in | ~275 PPD |
| iPhone 16 Pro Max | 6.9" | 2868 × 1320[^25] | 460[^25] | ~3.38" × 6.38" | 12 in | ~275 PPD |
| Samsung Galaxy S25 Ultra | 6.9" | 1440 × 3120 | 498[^26][^27] | ~3.06" × 6.41" | 12 in | ~298 PPD |
| iPhone 17 Pro (2025) | 6.3" | ~2622 × 1206 est.[^28] | ~460 | similar to 16 Pro | 12 in | ~275 PPD |

PPD formula (flat screen, centered): \[ \text{PPD} = \frac{\text{PPI}}{\tan\!\left(\arctan\!\left(\frac{1}{\text{viewing\_distance\_in}} \times \frac{1}{\text{PPI}}\right) \times \frac{180}{\pi}\right) \times 60} \]

Simplified practical approximation: PPD ≈ PPI × viewing_distance_in / 57.3. At 12 inches and 460 PPI: 460 × 12 / 57.3 ≈ **96 PPD**. (The higher "~275 PPD" figure uses a more exact formula including the arctan; ~96 is the small-angle approximation. Use the exact formula in the math engine.)

**Human visual acuity ceiling:** 20/20 vision resolves 60 PPD; average adult resolves ~80 PPD; maximum measured foveal resolution ~94 PPD. At typical phone viewing distances, 460 PPI exceeds human acuity — the limiting factor is eye physiology, not the display.[^29][^30][^31]

### TV Screens

TV dimensions from a 16:9 diagonal (all 4K UHD = 3840 × 2160 px unless noted):[^32][^33]

| Diagonal | Width | Height | PPI (4K) | Rec. Cinema Viewing Distance | PPD at Rec. Distance |
|---|---|---|---|---|---|
| 55" | 47.9" (121.7 cm) | 27.0" (68.6 cm) | ~80 PPI | 5.5–6.5 ft (66–78 in)[^34][^35] | ~90–110 PPD |
| 65" | 56.7" (144 cm) | 31.9" (81 cm) | ~68 PPI | 6.0–7.5 ft (72–90 in)[^32][^36] | ~82–102 PPD |
| 75" | 65.4" (166 cm) | 36.8" (93.5 cm) | ~59 PPI | 7.0–8.5 ft (84–102 in)[^32][^35] | ~84–100 PPD |
| 77" | 67.3" (170.9 cm) | 37.9" (96.3 cm) | ~58 PPI | 7.5–8.5 ft (90–102 in)[^32] | ~88–100 PPD |
| 85" | 74.1" (188.2 cm) | 41.7" (105.8 cm) | ~52 PPI | 8.0–10 ft (96–120 in)[^37][^35] | ~83–104 PPD |
| 98" | 85.4" (216.9 cm) | 48.0" (121.9 cm) | ~45 PPI | 9.5–11 ft (114–132 in)[^34][^35] | ~86–99 PPD |

**Note:** 4K TV at recommended distance consistently reaches or slightly exceeds 20/20 acuity (~60 PPD) and approaches average adult limits (~80 PPD). This is a notable finding for the UI — it means "pixels are visible" for users sitting farther than recommended but not at close-ideal distances.

**8K TVs:** 7680 × 4320 pixels. At typical viewing distances, the resolution benefit over 4K is marginal because the human visual system cannot resolve the additional detail. The Cambridge/Meta study found that for a 44-inch 4K/8K screen at ~2.5 m (typical living room), added resolution above 4K provides no perceptible benefit.[^30][^31]

***

## Part 6: HDR Format Support

A critical field for home displays — the HDR format on the display must match the HDR format on the content to achieve the intended grading. Mismatch (e.g., Dolby Vision content on an HDR10-only display) falls back to HDR10.[^38][^39]

| Format | Metadata Type | Content Mastering Peak | Support | Notes |
|---|---|---|---|---|
| **HDR10** | Static — one LUT for entire film | Up to 10,000 nits nominal; most masters 1,000–4,000 nits[^40][^41] | Universal — all HDR TVs[^38] | Baseline; royalty-free open standard |
| **HDR10+** | Dynamic — scene by scene | Same as HDR10 | Samsung TVs + Amazon Prime Video primarily[^42] | Royalty-free but limited adoption; Samsung alternative to Dolby Vision |
| **Dolby Vision** | Dynamic — frame by frame | Up to 10,000 nits metadata; most masters ~4,000 nits[^38] | LG, Sony, TCL, Apple devices; not Samsung[^38] | Best consumer HDR format; licensed from Dolby; available on Netflix, Disney+, Apple TV+ |
| **HLG** | Hybrid static/dynamic | 1,000–2,000 nits typical | Nearly universal[^43] | Broadcast/live TV HDR (BBC, sports); compatible with SDR displays |
| **Dolby Vision IQ** | Dynamic + ambient light adaptation | Same as DV | LG flagships + some Sony | DV + room light sensor integration |

**iPhone HDR note:** iPhone 15 Pro supports HDR10 and Dolby Vision. The 16 Pro also supports both. Samsung Galaxy S25 Ultra supports HDR10+ but **not** Dolby Vision.[^44][^45][^46][^26]

**Cinema to home mapping:** Dolby Cinema is graded and mastered for its dual-laser projection system. The Dolby Vision 4K Blu-ray or stream is a re-grade derived from that master, not a direct copy — optimized for consumer display capabilities. This distinction matters for the UI framing.

***

## Part 7: Viewing Environment — The Missing Variable

Brightness comparisons between cinema and home are meaningless without accounting for ambient light. A 22 fL IMAX screen in a pitch-dark room is subjectively brighter than a 300-nit TV in a sunlit living room.

Key reference points:
- **Cinema auditorium (dark):** ~1–5 lux ambient. Screen luminance dominates.[^47]
- **Dim living room (evening, lamps):** ~50–200 lux. OLED blacks still visible; SDR TV usable.
- **Normal living room (daylight, curtains):** ~200–500 lux. OLED blacks lift slightly; Mini-LED advantage grows.
- **Bright room / daylight no curtains:** ~1,000–10,000 lux. Only high-brightness Mini-LED (2,000+ nits) remains usable for SDR content.

**Perceived contrast** is the ratio of screen luminance to screen luminance + ambient light reflected off screen. An OLED with true black in a dark room wins every comparison. In a living room, a 2,000-nit Mini-LED with a 0.5% reflective screen can match or exceed OLED's perceived contrast.

**Schema field recommendation:** Add `viewing_environment` to home display records:
```json
{
  "viewing_environment": {
    "ambient_lux_estimate": 50,
    "environment_label": "dim_room",
    "screen_reflectance_pct": 4
  }
}
```
`environment_label` enum: `"dark_theater"`, `"dark_room"`, `"dim_room"`, `"bright_room"`, `"outdoor_shade"`. This becomes the most consequential variable in perceived-quality comparisons between cinema and home.

***

## Part 8: Schema Design — Presets and Manual Entry

### Recommended Presets for Home Displays

The schema should expose a `HomeDisplayPreset` array parallel to `FormatPreset`. Presets cover the format tier; `HomeDisplayRecord` overrides for a specific user's setup.

| Preset ID | Display Name | Panel Tech | Peak HDR (nits) | Full-Screen Brightness (nits) | Contrast | DCI-P3 | HDR Formats | Typical Viewing Distance |
|---|---|---|---|---|---|---|---|---|
| `oled_flagship_2025` | OLED Flagship (LG G5 / Samsung S95F tier) | WOLED / QD-OLED | 2,268[^2] | 331 | Infinite (per-pixel) | ~99% | DV / HDR10 / HLG | 1.5× screen height |
| `oled_midrange` | OLED Mid-Range (LG C4/C5 tier) | WOLED | 1,049[^1] | ~257 | Infinite (per-pixel) | ~98% | DV / HDR10 / HLG | 1.5× screen height |
| `oled_budget` | OLED Entry (Sony Bravia 8 / LG B-series tier) | WOLED | 815[^12] | ~224 | Infinite (per-pixel) | ~99% | DV / HDR10 / HLG | 1.5× screen height |
| `miniled_flagship` | Mini-LED Flagship (Samsung QN90D / Hisense U8 tier) | Mini-LED LCD | 2,024–3,296[^8] | 689–1,258[^7] | ~10,000–20,000:1 | ~100% | HDR10+ / HDR10 / HLG | 1.5× screen height |
| `qled_midrange` | QLED Mid-Range | QLED LCD | ~800–1,500 | ~300–500 | ~3,000–6,000:1 | ~90% | HDR10 / HLG | 1.5× screen height |
| `standard_lcd` | Standard LCD / LED | LCD | ~300–500 | ~150–300 | ~1,000–3,000:1 | ~72% sRGB | HDR10 (nominal) | 1.5× screen height |
| `iphone_pro` | iPhone Pro (15/16 series) | OLED | 2,000 outdoor / 1,600 HDR[^21][^20] | 1,000 (typical) | 2,000,000:1[^21] | Display P3 | DV / HDR10 | 12 in |
| `iphone_standard` | iPhone Standard (15/16) | OLED | 1,600 HDR / 2,000 outdoor[^23] | 1,000 | 2,000,000:1 | Display P3 | HDR10 | 12 in |
| `android_flagship` | Android Flagship (Galaxy S25 Ultra tier) | QD-OLED (AMOLED) | 2,600[^48] | ~1,400 adaptive | Infinite | ~90% DCI-P3[^22] | HDR10+ | 12 in |
| `projector_home_dark` | Home Projector (dark room) | DLP/LCD (projected) | ~200–500 nits on screen | ~100–200 nits | ~2,000–5,000:1 | ~72–90% | HDR10 | Screen-size dependent |

### Manual Entry: What Users Know vs. What They Don't

Most users know: TV brand, screen size in inches, maybe "OLED" or "QLED". Almost nobody knows: peak nits, sequential contrast ratio, DCI-P3 coverage percentage, or color volume.

**User-facing input fields (what to ask):**
1. Screen size (diagonal in inches) — everyone knows this
2. TV brand + model name/number (optional, enables preset lookup)
3. Panel type selection: `"I don't know"` / `"OLED"` / `"Mini-LED"` / `"QLED"` / `"Standard LED/LCD"` — simplified from the full taxonomy
4. Year purchased / year manufactured (optional — enables brightness-tier estimation)
5. Viewing distance (feet or meters) — critical for PPD; prompt with "How far is your couch from the TV?"
6. Room lighting condition: `"Dark room"` / `"Dim (some lamps)"` / `"Bright room with windows"` / `"Very bright/daytime"`

**Schema auto-fill logic:** If user provides brand + model, look up against a model database (separate from schema). If only panel type + year, map to nearest preset. If nothing, default to `oled_midrange` for "OLED" and `qled_midrange` for "QLED/unknown". This mirrors how the theater schema handles venue records with missing fields — fall through to preset defaults.

**Advanced manual override fields (for enthusiasts):**
- `peak_brightness_nits` — measured or published spec
- `contrast_ratio` — with note that OLED = "Infinite"
- `color_gamut_dci_p3_pct` — from manufacturer spec or calibration
- `hdr_formats_supported` — array of HDR format strings

## Part 9: Aspect Ratios for Home Displays

All TV presets are 16:9 (1.78:1) — this is near-universal for consumer TVs. Smartphones are ~19.5:9 (~2.17:1). Home projectors vary: 16:9 or native 2.35:1 anamorphic.

The masking math engine applies directly: playing a 2.39:1 scope film on a 16:9 TV produces letterbox bars (top and bottom). Playing a 1.43:1 IMAX film on a 16:9 TV crops to 1.78:1, losing approximately 19.7% of the IMAX vertical image. This is the same `ContentFormat × screen.aspect_ratio` matrix already defined in the cinema schema — no new math needed, just extend the existing engine to accept `HomeDisplayRecord` as a valid screen input.

***

## Summary: New Schema Fields Required

To support home display comparisons, the following additions are needed:

**New definition type: `panel_tech`** (string enum)
```
"woled", "qd_oled", "tandem_oled", "miniled_lcd", "qled_lcd", "standard_lcd", "projector_dlp", "projector_lcd", "led_direct_view"
```

**New definition type: `hdr_format_array`** (array of string enum)
```
"dolby_vision", "dolby_vision_iq", "hdr10", "hdr10_plus", "hlg", "none"
```

**New boolean flag: `is_per_pixel_oled`** (boolean) — disambiguates OLED ∞ contrast from numeric ratios

**New field on `projection` (and home display): `panel_tech`** — the panel technology type

**New top-level array: `home_display_presets`** — parallel to `presets`, uses same inheritance model

**New record type: `HomeDisplayRecord`** — parallel to `VenueRecord`, references a `home_display_preset_id`, adds:
- `screen_diagonal_in`: number
- `viewing_distance_ft`: number
- `viewing_environment`: `viewing_environment` object
- `user_label`: string (e.g., "My living room TV", "Bedroom phone")

---