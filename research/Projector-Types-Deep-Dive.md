# Projector Types — Deep Dive Reference
**LIEMAX Website Research Project**
*Compiled May 2026 | Source: 143190 database, LFExaminer, internal research files*

---

## Overview

The LIEMAX website database tracks two projector categories per venue — **digital** and **film** — sourced from the 143190 dataset, with LFExaminer providing additional xenon classification. This document covers every projector type tag in use, its full technical profile, how it maps to the site's verdict tier logic, and known research gaps.

---

## Part 1: Digital Projector Types (143190)

### 1.1 CoLa (Commercial Laser)

**Verdict tier:** IMAX Lite
**Aspect ratio max:** 1.90:1

The CoLa is the most widely deployed IMAX digital projection system as of 2026. It is a **single-projector 4K laser** unit. The defining architectural feature is its **prism-less, free-space optical design** — three individually cooled DMDs are mounted on an Invar frame without the inter-channel prism block found in older systems. This design dramatically reduces stray light and inter-channel bleed, which is why the CoLa achieves a native sequential contrast of approximately **10,000:1**, actually outperforming the GT Dual Laser's ~8,000:1 despite being a single-projector system.

Per IMAX CTO Brian Bonnick (CinemaCon 2018, reported by Display Daily):
> "We have improved the contrast to over 10,000:1 sequential."

**Key specs:**
| Spec | Value | Source |
|---|---|---|
| Resolution | 4K | Official |
| Aspect ratio max | 1.90:1 | DLP chip native |
| Sequential contrast | ~10,000:1 | IMAX CTO Bonnick, CinemaCon 2018 |
| Brightness (2D) | 22 fL (75 cd/m²) | IMAX CTO Bonnick, Display Daily 2018 |
| Brightness (3D) | ~11 fL | Circular polarization, Display Daily |
| Light source | RGB laser | — |

**Consumer-facing limitations:** The 1.90:1 ceiling means any film with 1.43:1 IMAX sequences loses approximately 24% of the vertical frame compared to a GT Laser or 1570 presentation. CoLa screens in multiplexes typically run 40–70 ft wide versus 80–100 ft for GT venues.

**On the site:** CoLa is the defining hardware of the **IMAX Lite** tier. It is also the fallback projector at the one New England 1570-capable venue (Apple Cinemas Providence) for any digital-format IMAX showtime where a physical film print is not booked.

---

### 1.2 Digital (Legacy Dual Xenon)

**Verdict tier:** LIEMAX
**Aspect ratio max:** 1.90:1

The original MPX (multiplex) rollout hardware from 2008. Two 2K xenon projectors stacked for brightness, deployed into standard multiplex footprints to dramatically reduce installation cost vs. the original GT film rooms. This is the hardware that generated the LieMAX backlash and the core subject of this website.

The dual-projector design was originally conceived for 3D — a single projector halves effective brightness when alternating left/right eye frames. Stacking two projectors for 3D maintained acceptable brightness. For 2D showings, both projectors layer the same frame.

**Key specs:**
| Spec | Value | Source |
|---|---|---|
| Resolution | 2K (per projector) | Technical literature |
| Aspect ratio max | 1.90:1 | DLP chip native |
| Sequential contrast | ~2,500:1 (range 2,500–2,600:1) | IMAX CTO Bonnick, Display Daily 2015, 2018 |
| Brightness (spec, new lamp) | 22 fL | IMAX calibration target per Bonnick |
| Brightness (real-world, aged) | 12–14 fL | Community reports, trade press |
| Light source | Xenon arc lamp | — |

**Critical caveat — lamp aging:** Xenon lamps degrade over their operational life. Community reports confirm that older IMAX xenon installations frequently deliver only 12–12.5 fL because technicians drop the calibration target to whatever the aging lamp can sustain. This is the **primary real-world disadvantage** of this tier compared to laser.

**On the site:** This is the **LIEMAX** verdict tier. The aging lamp issue and 2K resolution cap are the two facts that make this hardware the lowest-value IMAX tier despite carrying the full IMAX ticket surcharge.

---

### 1.3 GT Laser

**Verdict tier:** True IMAX (unconditional)
**Aspect ratio max:** 1.43:1

The GT (Grand Theater) Dual Laser system is the digital flagship for large-format 1.43:1 venues. It uses **dual proprietary 4K laser projectors**. In 2D mode, both projectors project the same image with a half-pixel offset, roughly doubling total sample count — the linear equivalent is approximately 5.8K-class sampling (2 × 4,096 ≈ 5,793). This is an **illustrative sampling estimate only, not an official IMAX spec label** — use carefully in any public-facing copy.

The dual-projector design also provides 2D brightness redundancy — with two laser engines at the same calibration target, effective brightness stays reliably at the 22 fL calibration target across the lamp lifetime, without the aging-decay problem of xenon.

**Key specs:**
| Spec | Value | Source |
|---|---|---|
| Resolution | 4K per projector | Official |
| Effective sampling | ~5.8K equivalent (illustrative) | Half-pixel offset geometry |
| Aspect ratio max | 1.43:1 | Purpose-built GT screen |
| Sequential contrast | ~8,000:1 | CTO statements, Display Daily |
| Brightness (2D) | ~22 fL (75 cd/m²) | Trade/AV reporting |
| Light source | RGB dual laser | — |
| Sound | 12.1-channel IMAX audio | Official |

**Why GT contrast is lower than CoLa:** The GT dual-laser uses the older Barco DP4K-60L platform, a prism-based architecture with a native contrast of ~2,800:1. The system-level 8,000:1 figure accounts for the dual-projector stacking advantage — but still trails the prism-less CoLa's 10,000:1 at the projector-engine level.

**On the site:** GT Laser is the **True IMAX (unconditional)** tier — the full 1.43:1 image is available at every digital showtime, for every film. Venues: Jordan's Furniture Reading (MA), AMC Lincoln Square (NYC), and ~42 commercial installations globally as of late 2025.

---

### 1.4 Dome with Laser

**Verdict tier:** DOME (special category — not evaluated on flat-screen ladder)
**Aspect ratio delivery:** 1.43:1 on hemispherical surface

The GT Laser system adapted for hemispherical dome theaters. A **single** high-output 4K projector is used — unlike the dual-projector flat GT configuration — because the dome's curved surface and fisheye optics change the optical geometry enough that dual stacking doesn't provide the same benefit as on a flat screen.

**The 1.90:1 → 1.43:1 anamorphic problem:** Standard DLP chips are manufactured at the 1.90:1 DCI ratio. Projecting a 1.43:1 image onto the dome requires a specialized anamorphic process: the 1.43:1 content is digitally squeezed into the 1.90:1 chip frame and then optically unsqueezed by a purpose-built anamorphic lens to fill the 1.43:1 height of the dome geometry.

**Non-linear pixel mapping:** To address the screen-door effect at extreme dome magnification, the system concentrates higher pixel density in the center of the dome where human vision is most acute, and stretches pixels at the periphery where motion detection (not detail) is the primary visual function.

**Key specs:**
| Spec | Value |
|---|---|
| Projector count | Single 4K laser |
| Aspect ratio on dome | 1.43:1 (anamorphic stretch from 1.90:1 chip) |
| Horizontal FOV | 180° |
| Vertical FOV | ~125° |
| Hemisphere coverage | 80–86% |

**Known venue:** Science Museum of Minnesota Omnitheater.

---

### 1.5 Laser XT

**Verdict tier:** IMAX Lite
**Aspect ratio max:** 1.90:1

A newer single-projector laser architecture, primarily deployed at newer US and Asian multiplex sites. **Research gap acknowledged:** The technical differentiation between Laser XT and CoLa is not definitively sourced in any primary manufacturer documentation reviewed to date. Current working assumption is that XT represents an updated CoLa generation — possibly with updated optics, a newer laser engine, or enhanced audio integration — rather than a fundamentally distinct projection platform.

**On the site:** Treated as functionally equivalent to CoLa in all spec fields (4K, 1.90:1, 10,000:1 contrast, 22 fL brightness) pending sourced differentiation. If/when IMAX publishes a comparative spec sheet, this entry should be updated.

**⚠️ Open gap: No sourced technical distinction between XT and CoLa currently exists in the research files. Priority resolution before launch.**

---

### 1.6 Laser for Dome

**Verdict tier:** DOME (special category)

This tag may refer to the **legacy 15,000W xenon dome projector** that preceded the digital laser dome upgrade, OR it may be used for the laser-upgraded dome system at some venues. Context from 143190 records should clarify which interpretation applies at each venue.

The legacy xenon dome system is one of the most technically complex projectors in cinema history:

- **Light source:** 15,000W xenon short-arc lamp. So intense it would ignite the polyester film base if the film stopped moving for a fraction of a second.
- **Cooling:** Dedicated liquid-cooling chiller system circulating distilled water through the lamp housing. Mandatory, not optional.
- **Lamp variants:** Smaller dome installations may use 4.5kW–12kW lamps depending on dome diameter.
- **Optical offset:** The fisheye dome lens is centered 9.4mm (0.37 inches) **above** the horizontal center line of the film. This shifts the projected image downward on the dome surface, positioning the movie's horizon at 20–30° below dome center — within the audience's natural visual comfort zone.
- **Coverage:** 180° horizontal × 125° vertical (asymmetric: ~100–110° above horizon, ~20–22° below).

**Why the offset matters:** Without the 9.4mm shift, the image horizon would appear at the dome zenith — directly overhead. The offset is a deliberate solution to the theater's tilted architecture (most dome screens are tilted ~30° relative to the ground plane), placing the action in front of the audience rather than above them.

---

### 1.7 N/A and No (Digital)

These are **data state flags**, not projector hardware types:

- **N/A:** Projector type is unknown — insufficient data exists in the 143190 source to classify the venue's digital projection hardware. The site's comparison workbench should flag these venues with a confidence caveat.
- **No:** No digital projector present. The venue is either a film-only installation or not running any digital IMAX format.

---

## Part 2: LFExaminer — Xenon (Dual 2K)

LF Examiner's classification of **Xenon Dual 2K** maps directly to the **Legacy Digital IMAX Dual Xenon** type documented above (section 1.2). LF Examiner was the original systematic tracker of the LieMAX controversy following Aziz Ansari's May 2009 tweet. Their "Xenon Dual 2K" label is the historical root classification of what this website calls LIEMAX — two 2K xenon projectors in a multiplex room, branded as IMAX at the full surcharge.

The LFExaminer data point is most useful for **older venue records** where the 143190 digital type field may be unpopulated or ambiguous. If a venue has an LFExaminer Xenon Dual 2K entry, it should be mapped to the `Digital` type in 143190 and assigned the LIEMAX verdict tier.

---

## Part 3: Film Projector Types (143190)

### 3.1 IMAX 15/70 mm (Flat Screen)

**Verdict tier:** True IMAX (film-conditional — requires physical print booking)
**Aspect ratio:** 1.43:1

The original and ceiling format. 65mm negative runs **horizontally** with 15 perforations per frame — not the standard vertical 5-perf of regular 70mm film. This produces a frame approximately 70.41mm × 52.63mm: ten times the image area of standard 4-perf 35mm, and more than twice the area of standard 70mm (5-perf).

**Resolution reality check:** Film has no pixels. Scan-equivalent resolution depends on scanner micron spot size:
- 8-micron scan → ~8,800 × 6,600 px equivalent
- 7-micron scan → ~10,100 × 7,500 px equivalent
- 6-micron scan → ~11,700 × 8,800 px equivalent

**The defensible range is 8.8K–11.7K horizontal scan-equivalent. The "16K" and "18K" figures that circulate online are not supported by any authoritative source** — do not use them in public-facing copy or video graphics.

**Key specs:**
| Spec | Value |
|---|---|
| Frame dimensions | 70.41mm × 52.63mm |
| Image area | ~3,376 sq. mm (~10× standard 35mm) |
| Scan-equivalent resolution | 8.8K–11.7K horizontal (scanner-dependent) |
| Contrast (photochemical) | ~4,000:1 |
| Aspect ratio | 1.43:1 |
| Audio | 6-channel magnetic soundtrack |
| Film transport | Rolling Loop horizontal system |

**Mechanical transport — Rolling Loop:** A 37.5-inch rotor uses air pulses to create a wave in the film, carrying it horizontally past the aperture. Vacuum registration pins engage perforations to lock each frame into micro-accurate alignment. A vacuum system holds the frame flat against an optical field flattener glass — essential because at IMAX magnification, microscopic frame instability would appear as nauseating vibration on the screen.

**Why directors still choose it despite the penalties:**
- Camera weight, noise, and cost (~5× per foot vs. 35mm)
- Sync-sound dialogue recording is impractical (camera noise)
- ~4.3 frames per foot of film consumed
- Despite all this: physical scale and grain texture become part of the film's visual language

**Films shot on IMAX 1570 cameras (selected):**
| Film | Director | Year | IMAX Footage |
|---|---|---|---|
| The Dark Knight | Christopher Nolan | 2008 | ~28 min |
| Interstellar | Christopher Nolan | 2014 | ~90 min |
| Dunkirk | Christopher Nolan | 2017 | Near-entire runtime |
| Tenet | Christopher Nolan | 2020 | Near-entire runtime |
| Oppenheimer | Christopher Nolan | 2023 | Near-entire runtime |
| Sinners | Ryan Coogler | 2025 | Confirmed |
| The Odyssey | Christopher Nolan | 2026 | Confirmed full IMAX |

**Regional note (New England):** Apple Cinemas Providence, RI is the only 1570-capable venue in all of New England. A standard digital IMAX showing at Providence is a CoLa presentation (IMAX Lite). Only showings specifically listed as "70mm" or "IMAX 70mm" use the film projector.

---

### 3.2 IMAX GT Dome 15/70 mm

**Verdict tier:** DOME (special category — film variant)
**Aspect ratio delivery:** 1.43:1 on hemispherical dome

The 1570 film format projected in an IMAX Dome (Omnimax) theater. Same Rolling Loop mechanical transport as flat 1570, but the optical path passes through a **30mm fisheye lens** with the **9.4mm upward optical offset** (see section 1.6 for offset rationale).

**The Dome Master requirement:** Content cannot simply be shot rectilinearly and projected through a fisheye lens. The dome's curvature would distort straight horizons into bowed curves. Instead, post-production must create a **Dome Master** — a pre-distorted circular image that appears geometrically incorrect on a flat monitor but resolves to straight, proportional geometry when projected onto the hemispherical surface via the fisheye lens.

**Omnimax image area on film:** The fisheye remapping produces a slightly elliptical image on the actual film strip — **50.8mm × 71.25mm** — marginally different from the flat 1570 frame dimensions.

**Hemisphere coverage math (verified):**
A full hemisphere = 2π steradians. The 1.43:1 format, mapped spherically with the dome's 100–110° zenith reach and 20–22° nadir reach, accounts for approximately **80–86% of the total hemispherical surface**. The slight elliptical projection (not rectangular) fills dome corners that a simple rectangular mapping would leave dark — this is what pushes coverage to 80%+ rather than a lower purely geometric estimate.

---

### 3.3 IMAX GT3D 15/70 mm

**Verdict tier:** True IMAX (film-conditional, 3D variant)

1570 film in a GT flat-screen venue with 3D capability. IMAX 3D on film uses a polarization system to present separate left/right eye frames from the 15-perf negative.

**⚠️ RESEARCH GAP — HIGH PRIORITY**

The existing research files contain **no dedicated spec data** on the 3D film projection mechanism for this format:
- Polarization method (circular vs. linear vs. Infitec spectral for film 3D) — **not documented**
- Brightness penalty for 3D (expected ~50% reduction from 2D, but specific film-3D figure unconfirmed) — **not documented**
- Which venues in the 143190 database currently carry GT3D film capability — **not audited**
- Whether any GT3D film showings have occurred post-2020 — **not documented**

**This gap will cause empty or incorrect spec fields in the comparison workbench for any venue tagged GT3D 15/70mm.** Priority research task before launch.

---

### 3.4 IMAX SR 15/70 mm

**Verdict tier:** Institutional (not a standard consumer venue — likely excluded from site verdict ladder)

The IMAX SR (Short Run) format is a smaller, lower-cost variant of the 1570 system designed for science centers and institutional venues running shorter documentary programs (typically 20–40 minutes). It uses the same 15/70mm film stock but in a more compact projector chassis optimized for smaller dome diameters.

**⚠️ RESEARCH GAP — LOWER PRIORITY**

The existing research files contain **no SR-specific technical specs**:
- Projector chassis differences vs. full 1570 — **not documented**
- Typical dome diameters for SR installations — **not documented**
- Maximum film capacity / program length — **not documented**
- SR venue count vs. full GT institutional venues — **not audited**

SR venues are institutional (not standard consumer-facing theaters users would typically search), so the consumer UX impact is lower. However, if SR-tagged venues exist in the 143190 database, their records will lack corresponding preset data and could cause schema errors. **Resolution: either source SR specs, or explicitly exclude SR venues from the comparison workbench with a UI flag.**

---

### 3.5 N/A and No (Film)

Same logic as digital:

- **N/A:** Film projector type unknown — insufficient 143190 data.
- **No:** No film projector present. This applies to the vast majority of commercial multiplexes, which are digital-only. A venue with `No` on the film side and `CoLa` on the digital side is a standard IMAX Lite / LIEMAX venue. A venue with `No` on both sides should be flagged as a data anomaly.

---

## Part 4: Gap Analysis Summary

| Projector Type | Research Coverage | Status |
|---|---|---|
| CoLa | Deep — contrast, brightness, architecture, prism-less design, comparison vs. GT | ✅ Complete |
| Digital (Dual Xenon) | Deep — contrast range, lamp aging, brightness decay, LIEMAX history | ✅ Complete |
| GT Laser | Deep — dual projector, half-pixel offset, 5.8K sampling, 1.43:1 capability | ✅ Complete |
| Dome with Laser | Good — anamorphic stretch, pixel mapping, single projector, hemisphere math | ✅ Adequate |
| **Laser XT** | Partial — flagged as possibly updated CoLa; no sourced spec differentiation | ⚠️ Gap: XT vs. CoLa distinction unresolved |
| Laser for Dome (xenon) | Deep — Rolling Loop, 9.4mm offset, 15kW lamp, cooling, hemisphere geometry | ✅ Complete |
| LFExaminer Xenon Dual 2K | Covered — maps to Digital (Dual Xenon); historical LieMAX context present | ✅ Complete |
| IMAX 15/70 mm (flat) | Deep — frame dimensions, scan-equivalent resolution, film list, Providence callout | ✅ Complete |
| IMAX GT Dome 15/70 mm | Good — fisheye optics, Dome Master requirement, hemisphere coverage | ✅ Adequate |
| **IMAX GT3D 15/70 mm** | Not covered — 3D film mechanism, brightness penalty, venue list absent | ❌ High-priority gap |
| **IMAX SR 15/70 mm** | Barely mentioned — no SR-specific specs | ⚠️ Lower-priority gap |

### Priority Actions

1. **GT3D 15/70mm** — Research the 3D film projection mechanism (polarization method, brightness penalty), identify which 143190 venues carry this tag, and determine if any GT3D film showings are still operationally active. This is the highest-priority gap because it directly affects workbench output for affected venues.

2. **Laser XT vs. CoLa** — Attempt to source a manufacturer spec sheet or IMAX press release that differentiates XT from CoLa technically. If no distinction is confirmed, merge both into a single `imaxxlaser` preset with an internal note.

3. **IMAX SR** — Either source SR specs from IMAX institutional documentation, or add an explicit `isInstitutional: true` flag to SR-tagged venues so the comparison workbench excludes them from the standard verdict ladder rather than rendering empty spec fields.

---

## Part 5: Verdict Tier Mapping Reference

| 143190 Digital Type | 143190 Film Type | Verdict Tier |
|---|---|---|
| CoLa | No | IMAX Lite |
| Laser XT | No | IMAX Lite |
| Digital (Dual Xenon) | No | LIEMAX |
| GT Laser | No | True IMAX (unconditional) |
| GT Laser | IMAX 15/70 mm | True IMAX (GT + film ceiling) |
| N/A or No | IMAX 15/70 mm | True IMAX (film-conditional) |
| CoLa | IMAX 15/70 mm | Conditional — True IMAX for 70mm showtimes only; IMAX Lite for digital showtimes |
| Dome with Laser | GT Dome 15/70 mm | DOME (special — not on flat-screen ladder) |
| Laser for Dome | GT Dome 15/70 mm | DOME (special — legacy xenon variant) |
| Any | GT3D 15/70 mm | True IMAX film-conditional (3D) — ⚠️ specs TBD |
| Any | IMAX SR 15/70 mm | Institutional — exclude from standard ladder |
| N/A | N/A | Unclassified — data caveat required |
| No | No | Not a valid IMAX venue — flag as anomaly |

---

*Last updated: May 2026 | Part of the LIEMAX Website Overhaul Research Project*
