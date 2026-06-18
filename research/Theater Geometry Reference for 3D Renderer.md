# Theater Geometry Reference for 3D IMAX Comparison Tool

## Overview

This document compiles sourced, cross-validated geometry specifications for IMAX GT, LIEMAX/retrofit, Dolby Cinema, and standard multiplex auditoriums — intended as a reference for building accurate 3D render environments in a theater comparison tool. Confidence levels are noted per claim based on number of corroborating sources, whether values were derived vs. directly cited, and the authoritativeness of the source.

**June 2026 seating-distance addendum:** Use `Seating Distance Audit for 3D Renderer.md` for the latest front/mid/back profile ratios. That audit supersedes the older Dolby and standard multiplex depth fallbacks in this document while preserving the same source-confidence posture.

***

## 1. IMAX GT (Grand Theater) — Screen Setup & the "Pit"

### Screen Dimensions

IMAX GT screens are 1.43:1 aspect ratio and are among the largest in commercial cinema. Actual sizes vary considerably by venue. From documented real-world measurements:

- **Typical GT range:** ~52–78 ft tall × ~72–98 ft wide (approx. 16–24 m × 22–30 m)[1][2][3]
- **Common mid-range GT (e.g., Toronto Scotiabank):** ~60 ft × 78 ft (18.3 m × 23.8 m)[4]
- **Very large GT (e.g., IMAX Sydney):** ~78 ft × 95 ft (23.8 m × 29.0 m)[5]
- **World-class outliers (IMAX Melbourne):** ~75 ft × 105 ft (23 m × 32 m)[6][5]

A "standard" IMAX screen is often listed at ~72 ft wide × 53 ft tall (22 m × 16 m), but this represents a smaller end of GT; larger venues substantially exceed this.[7][8]

> **Confidence: HIGH** — Multiple independent measurement databases and venue listings confirm these ranges. IMAX does not publish a universal "standard" size; each installation is purpose-built.

### The Screen Pit — Does the Screen Extend Below the First Row?

Yes — in true IMAX GT theaters, the screen typically extends *below the elevation of the first row of seats* into what is colloquially called the "screen pit." This is a defining characteristic of the format.

- The screen goes below the front row by "a number of meters" in most 1.43:1 venues[9]
- A user at one GT described: "the screen actually extends below the front row in a pit"[10]
- Another commenter notes: "1.43 doesn't reach the very bottom edge of the screen, as most theaters aren't precisely calibrated to that ratio. Typically, a screen measuring around 60×80 ft will translate to an aspect ratio of about 1.33, leaving a small section at the bottom...unused"[11]
- The entire seating deck is elevated above ground floor level — "the auditorium seats are lifted off the ground floor about **15–25 feet** depending on the venue". The front row is already elevated roughly one-third of the way up the screen's height[12][10][11]
- A patent for an alternative GT-style theater design (US Patent 5,469,669) explicitly describes a pit: *"all of the seating and the floor for the seating is located directly in the pit below ground level where the ground supports the floor and seating"*[13]
- An upgrade video shows equipment being "craned seven stories down into the bottom of the screen pit through an access door at ground level", confirming that the bottom of the screen is at or near true ground level, far below the seating deck[14]

**How this works structurally:**
The seating deck itself is built on an elevated platform (essentially a large raised floor), starting perhaps 15–25 ft above the building's ground floor. The screen wall extends from near true ground level upward. So the screen's bottom edge can sit several meters (roughly 10–20 ft) below the elevation of the first row of seats.

A railing is therefore typically visible at the bottom of the screen from the front rows — this is expected and normal.[15][16][9]

> **Confidence: HIGH** — Confirmed by multiple first-person accounts, a formal patent, and documented engineering/construction details. The specific depth of the pit below the first row (10–20 ft) is estimated from the 15–25 ft seating deck elevation range and known screen proportions; treat as a derived estimate, not a hard-cited figure.

***

## 2. IMAX GT Screen Curvature

IMAX screens are described as having a "slight compound curvature" — both horizontally and to a lesser degree vertically — but IMAX does not publish the exact radius or angle as an official public spec.

- One source describes IMAX screens as having a "slight compound curvature that extends beyond the field of the edge of peripheral vision"[17]
- Another source characterizes GT screens as having "horizontal curvature" and notes curvature is a defining element of their certified geometry[18]
- A general-use citation for 3D silver screens references "precise curvature (often **20–25°**)" as the horizontal subtended angle for IMAX-type screens[19]
- Forum discussions note each screen's curvature is customized to the auditorium: "each of them will have a different curvature in relation to the nature of the auditorium"[20]
- A Cinema City venue describes their GT screen as "flat but has a slight compound curvature" for a 1.43:1 flat screen (not every GT is curved)[17]
- The purpose of curvature is to reduce distortion for off-axis seats and maintain equidistance from projector lens to screen surface[20]

**Practical approximation for rendering:** A cylindrical or shallow compound-curved surface with a horizontal bow such that edges curve toward the audience by roughly 1–4 feet (0.3–1.2 m) on each side for a ~80 ft wide screen. This corresponds to a very long radius of curvature — likely in the range of 50–150 ft (15–45 m) of radius, though this is a derived estimate from visual evidence and general descriptions, not a confirmed IMAX spec.

> **Confidence: LOW–MEDIUM** — The existence of curvature is well-confirmed. The degree is described qualitatively as "slight" with one citation giving 20–25°. IMAX does not publish official radii. Treat specific numbers as rough approximations suitable for a visual render, not engineering specs.

***

## 3. Retrofitted Multiplex IMAX (LIEMAX / 1.90:1) — Screen Height and Position

### Screen Dimensions

LieMAX/retrofit IMAX screens use a 1.90:1 aspect ratio and are substantially smaller than GT screens:

- **Typical range:** ~20–36 ft tall × ~40–58 ft wide (6–11 m × 12–18 m)[21][22][3]
- Common real-world examples: ~30 ft tall × ~50 ft wide; one source cites retrofit MPX screens ranging 24×47 ft to 46×74 ft (7×14 m to 14×23 m)[23][21]
- A Regal example: 36 ft × 58 ft (11 m × 18 m) at Mira Mesa[24]

### Screen Bottom Height Above the Floor

Unlike GT theaters, retrofit IMAX screens are installed into existing multiplex auditoriums. The screen bottom is typically at or near the front of the auditorium floor level:

- The retrofit process usually involves removing the first 2–3 rows of seats, moving the screen forward by 20–25%, and extending the screen as low as possible — often closer to floor level than in a standard multiplex[25][21]
- SMPTE and standard multiplex guidelines recommend screen bottom at minimum **0.6–1.5 m (2–5 ft)** above floor level[26]
- Standard projection guidelines cite screen bottom at **40–48 inches (3.3–4 ft)** above floor for level-floor multi-row seating[27]
- In practice, a retrofit IMAX screen bottom is typically around **3–5 ft (0.9–1.5 m)** above the floor of the first row — a conventional position with no pit[21][27]

There is **no screen pit** in a typical retrofit theater. The screen sits in a conventional elevated wall position, though it may extend slightly lower than the previous screen due to the row removal.[25][21]

> **Confidence: HIGH** — The absence of a pit and the conventional screen position is confirmed by multiple sources explaining the retrofit process. Exact bottom height is derived from SMPTE/industry minimums (2–5 ft) applied to the retrofit context; individual theaters vary.

***

## 4. Dolby Cinema — Screen Height and Configuration

### Screen Dimensions

Dolby Cinema screens do not have a universal mandated size but must meet a minimum:

- **Minimum screen width:** ~14 m (46 ft), per Dolby's stated requirements[28]
- **Practical minimum:** ~35 ft (10.7 m) wide with a height greater than standard screens[29]
- **Typical Dolby Cinema screen:** approximately **50–60 ft wide × 25–35 ft tall**[30][31][32]
  - Pune Dolby Cinema (measured): 55 ft wide × 26.2 ft tall, 2.1:1 aspect ratio[30]
  - Paris Massy (measured): 17.4 m (~57 ft) wide[28]
- The aspect ratio is typically around **1.85:1 to 2.1:1** (wider than IMAX, shorter than GT)[31][33][30]

### Screen Position and Bottom Height

- Dolby Cinema screens are described as **wall-to-wall but NOT floor-to-ceiling** — unlike true IMAX GT which is intended to be floor-to-ceiling[30]
- The screen is mounted in a conventional elevated position; users report that on the floor level, the screen is "higher than comfortable" and on the balcony level, the wall can partially block the screen bottom[34]
- No pit. The screen bottom is likely in the standard multiplex range of **3–5 ft (0.9–1.5 m)** above the floor[35][27]
- Dolby Cinema screens have a slight curve[28]

> **Confidence: MEDIUM** — Screen dimensions are confirmed from multiple measured examples. The lack of a pit is confirmed. Exact screen bottom height is extrapolated from standard cinema guidelines and qualitative user reports; not directly cited from Dolby specifications.

***

## 5. Seating Configuration by Theater Type

### 5A. IMAX GT — Seating Geometry

IMAX GT theaters are defined by their unusually compact and steep seating geometry relative to screen size. The patented IMAX theater design specifies aggressive viewing angles that conventional theaters do not achieve.[36][37]

**Key IMAX GT seating design principles (from IMAX co-founders Shaw & Douglas, 1983 SMPTE Journal):**[23]
- Minimum eye-to-screen distance: **0.35× screen width** (the front row is ~35% of screen width away)
- Maximum distance (last row): **≤ 1.0× screen width** (ideally 0.9× screen width)
- This ensures horizontal viewing angles of **53°–110°** across all seats[38][23]

**Row Count and Total Auditorium Depth:**
- Classic GT auditoriums are essentially *square* in plan — the depth approximately equals the screen width[23]
- For an 80 ft wide screen: front row ~28 ft from screen, last row ~72–80 ft from screen
- Typical seat counts: ~300–450 seats for GT auditoriums[39][40]

**Stadium Rake / Incline Angle:**
- GT seating is steep — sources describe approximately **23–30°** incline for steep IMAX seating[41][42][43][17]
  - The Cinema City source specifically states: "the 23-degree pitch angle of the seating area"[17]
  - Multiple sources say "up to 30° in some domed theatres"[42][43]
  - A user describes a specific GT as "a steep angle of approximately 25–30 degrees"[41]
- This is dramatically steeper than conventional cinema (see below)
- The GSCA Giant Screen spec recommends "stadium-style seating and mid-height rows that align to approximately one-third of screen height"[38]

**Why so steep?** The steep rake is necessary so that all rows face the screen nearly perpendicularly, compensating for the very tall screen height. Without it, rear rows would be looking nearly horizontally at the top of the screen.[36]

**Row Spacing:**
- Typical IMAX seat-to-seat row spacing: **36–40 inches** (standard stadium), or roughly **1.0–1.2 m**[44][45]
- The IMAX seating arrangement is "steeply tiered" with each row elevated significantly above the one in front[45]

> **Confidence: HIGH for the 0.35W / 1.0W seating depth ratio** (primary IMAX source). **HIGH for the existence of steep rake**. **MEDIUM for the specific 23° angle** — mentioned by one primary source (Cinema City) and corroborated directionally by others citing "up to 30°." 

***

### 5B. Retrofit LIEMAX / 1.90:1 Multiplex IMAX — Seating Geometry

Retrofit IMAX theaters are installed into existing multiplex auditoriums with **minimal changes to the seating**:[21][23]

- The existing seating deck, risers, and rake are largely **unchanged** after conversion[23]
- First 2–3 rows are removed to bring the screen closer[25][21]
- Auditorium depth is typically **1.2–1.5× screen width**, substantially deeper than the ideal GT ratio of 0.9× screen width[23]
  - LF Examiner's 2008 measurements of 7 early LIEMAX conversions found depths of **1.24–1.48× screen width**[23]
- The last row is far from the screen by GT standards; minimum horizontal viewing angles drop to only **37°–45°**, vs. 53°+ for GT[23]

**Seating angle/rake:**
- Conventional multiplex rake: typically **8–15°** incline[46][47][48]
  - Standard general guidelines: **8–12% slope (≈5°–7°)**[48]
  - QSC Certified Theatre Program specs: "optimal riser slopes are generally between **15 and 20 degrees maximum**"[47]
  - General cinema industry standard for modern stadium multiplexes: more commonly **8–15°** effective incline for the raked section[49][50]
- Some newer multiplex IMAX conversions have steeper seating than typical, but most do not match GT geometry[51]

**Front row distance:**
- With 2–3 rows removed, front row is typically **1.0–1.5× screen width** distance away from screen in LieMAX, compared to 0.35× in GT[23]

> **Confidence: HIGH** for the LF Examiner-measured depth ratios (primary measured data). **MEDIUM** for rake angle — the 8–15° range is the industry standard for multiplex stadiums, but specific LieMAX conversions vary widely.

***

### 5C. Dolby Cinema — Seating Geometry

Dolby Cinema has specific design requirements but more flexibility than IMAX in execution:

- All seats are **luxury recliners** — this is a mandatory Dolby requirement[29][28]
- Recliners require significantly wider row spacing: **1.4–1.8 m** (55–70 in) vs. 1.0–1.2 m for standard stadium[52][44]
- The increased seat size **dramatically reduces seat count** — e.g., 290 vs. the prior 876 seats at AMC Lincoln Square[40]
- Seating is in **curved rows** that follow the screen arc[28]
- Dolby Cinema rooms are designed to be painted **entirely matte black** for contrast reasons[28]

**Rake angle:**
- One Dolby Cinema (Massy, Paris) includes a **balcony** section — some venues have a true two-level design with the lower section at floor level and upper section in a traditional balcony[34][40][28]
- For single-level Dolby Cinemas: standard multiplex rake of approximately **8–15°** applies, similar to LIEMAX — the seating isn't purpose-built for the screen the way GT is
- The recliner seats themselves recline to approximately **40°** — feet come up at about a 40° angle[53]

**Screen distance:**
- Dolby Cinema auditoriums are deeper relative to screen width than GT; they're conventional theater-depth rooms
- SMPTE recommend front row ≥ 0.87× screen width; last row ≤ 6× screen height[44]
- A typical Dolby Cinema with a ~57 ft wide screen would have front row ~50 ft away and last row ~150+ ft away

> **Confidence: MEDIUM** — Dolby's own published specs are not publicly detailed. Seat geometry and recliner data is confirmed from multiple sources. Rake angle is inferred from the fact that most Dolby conversions use existing auditoriums with standard multiplex geometry.

***

### 5D. Standard Multiplex / LPF — Seating Geometry

For comparison, standard and large-premium-format (LPF) theaters:

- **Screen size:** 30–50 ft wide × ~20 ft tall (flat 2.39:1 scope or 1.85:1 flat)[3][7]
- **Screen bottom height above floor:** Standard guidelines specify **40–48 inches (3.3–4 ft)** for multi-row level floors; minimum 2 ft recommended[54][27]
- **Front row distance:** Generally 1.5–2× screen width from screen; traditional spec is first row ≥ screen height distance[55][54]
- **Last row distance:** Up to 6–8× screen height[56][54]
- **Auditorium depth:** Conventional modern multiplex: 1.5–2.5× screen width[23]
- **Rake angle:** **5°–15°** — general industry standard is 8–12% slope (≈5°–7°) for basic raked auditoriums; QSC recommends up to 20° maximum for premium stadium seating; modern PLF/premium cinemas aim for **15–20°**[49][47][48]
- **Row spacing:** Standard 36–42 inches (0.9–1.1 m); luxury recliner rows 60–72 inches (1.5–1.8 m)[55][44]

***

## 6. Projector Location

### IMAX GT
- The IMAX GT projector (15/70 film or dual-laser) is an enormous machine housed in a **dedicated booth at the rear of the auditorium**
- The projection throw distance is approximately **0.9–1.0× screen width** from screen (consistent with the auditorium being ~square)[38][23]
- The projector is at an elevated position, roughly at the **center-height of the screen or slightly above**, projecting slightly downward
- In the construction/upgrade video, equipment was "craned down into the bottom of the screen pit," implying the booth is at the high rear of the auditorium[14]
- The projection window in the booth faces the screen from the rear wall[13]

### Retrofit LIEMAX / Dolby Cinema
- The projector is located in a conventional **projection booth above and behind the last row of seats**[57]
- Modern multiplex projection room floors "are located at a much higher level... almost above the centerline of the picture," meaning the projector angle of incidence to the screen can be as steep as **9°** (vs. ~5° in older designs)[57]
- For a 50 ft wide LIEMAX screen, the throw distance might be 60–75 ft (1.2–1.5× screen width) given the deeper auditoriums

> **Confidence: MEDIUM** — GT booth location is well-established. Exact throw distance and height are derived from the depth ratios cited. Multiplex booth position is confirmed from an industry design document.

***

## 7. Summary Comparison Table

| Parameter | IMAX GT | Retrofit LIEMAX (1.90:1) | Dolby Cinema | Standard Multiplex |
|-----------|---------|--------------------------|--------------|-------------------|
| Screen aspect ratio | 1.43:1 | 1.90:1 | ~1.85:1–2.1:1 | 2.39:1 or 1.85:1 |
| Typical screen width | 72–98 ft (22–30 m) | 40–58 ft (12–18 m) | 46–60 ft (14–18 m) | 30–50 ft (9–15 m) |
| Typical screen height | 52–78 ft (16–24 m) | 20–36 ft (6–11 m) | 25–35 ft (7.6–11 m) | ~20 ft (6 m) |
| Screen bottom vs. floor | **Below** first row by ~10–20 ft (screen pit) | ~3–5 ft above floor (conventional) | ~3–5 ft above floor | 3–5 ft above floor |
| Screen fill type | Floor-to-ceiling, wall-to-wall | Wall-to-wall, no ceiling contact | Wall-to-wall, no floor contact | Framed, does not touch walls |
| Screen curvature | Slight compound curve (horiz. ~20–25°) | Flat or very slight | Slight horizontal curve | Flat |
| Seating rake angle | **23–30°** (very steep) | 8–15° (standard multiplex) | 8–15° (+ recliner recline ~40°) | 5–15° |
| Front row distance | ~0.35× screen width | ~1.0–1.5× screen width | ~0.8–1.2× screen width | ~1.5–2× screen width |
| Last row distance | ~0.9–1.0× screen width | ~1.2–1.5× screen width | ~1.5–2× screen width | ~2–3× screen width |
| Auditorium depth shape | Nearly **square** | Conventional deep rectangle | Conventional deep rectangle | Conventional |
| Seating type | Fixed stadium seats | Existing multiplex seats | Luxury recliners | Fixed or recliners |
| Row spacing | 36–40 in (0.9–1.0 m) | 36–42 in (0.9–1.1 m) | 55–70 in (1.4–1.8 m) | 36–48 in (0.9–1.2 m) |
| Typical seat count | 300–450 | 200–400+ | 100–300 | 150–600 |
| Projector location | Rear booth, ~1.0× screen width throw | Rear booth, ~1.2–1.5× throw | Rear booth, ~1.2–1.5× throw | Rear booth, 1.5–2× throw |

***

## 8. Confidence Summary and Known Gaps

**High confidence (multiple corroborating sources, primary documentation, or direct measurement):**
- GT screen extends below first row into a pit ✓
- GT seating deck elevated 15–25 ft above ground floor ✓
- GT front row at ~0.35W, last row at ~0.9–1.0W ✓ (from IMAX co-founders' 1983 SMPTE paper, via LF Examiner)
- GT seating is steep (broadly 23–30°) ✓
- Retrofit LIEMAX uses existing seating geometry, no pit ✓
- Dolby Cinema requires recliners, curved rows ✓

**Medium confidence (single good source, or extrapolated from adjacent data):**
- GT curvature "20–25°" horizontal angle — one citation only[19]
- GT screen pit depth below first row (~10–20 ft) — derived from seating elevation (15–25 ft) minus typical screen dimensions; not directly measured
- Dolby Cinema screen bottom height — extrapolated from industry guidelines[27]
- Rake angle for retrofit/Dolby (8–15°) — from general cinema design specs, not IMAX/Dolby-specific

**Low confidence / gaps:**
- IMAX does not publicly publish the exact radius of curvature for GT screens
- Pit depth varies significantly by venue — there is no standard IMAX spec for this
- Dolby Cinema does not publish auditorium geometry specs publicly
- The exact rake angle for GT varies per venue (23° is Cinema City's; other GTs may differ)
