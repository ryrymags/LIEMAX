# LIEMAX Website — Overhaul Bible
### Master Reference Document for Codex / Claude Code Implementation
*Compiled from research files and design discussions. This document governs all content, structure, logic, and copy decisions for the LIEMAX website overhaul. Every downstream deliverable — written content blocks, UI components, data logic — should be traceable back to a section of this document.*

---

## 1. What This Website Is and Who It's For

**The site's thesis in one sentence:** Most IMAX theaters in the United States are not the real thing, and most people paying IMAX prices have no idea.

**The site's job:** Take a total stranger from "I had no idea" to "I now know exactly what my local theater is, why it is that, what I'm missing, and what I should actually do about it" — in a single scroll, without requiring them to already know any industry vocabulary.

**The primary user:** Someone who just paid for an IMAX ticket and either noticed something felt off, or saw something online about "fake IMAX," and wants to understand what that means for their specific theater. They are not a home theater enthusiast, not a cinematography nerd, and not a film student. They are a normal moviegoer who is mildly annoyed and moderately curious.

**The secondary user:** A return visitor who already knows the basics and comes back specifically to use the comparison tool, look something up in the 101, or check specs on a theater before buying a ticket.

**The tertiary user:** A film nerd or cinema enthusiast who wants the full technical depth — the Deep Dive content, projection specs, business context, the dome geometry math, etc.

The site must serve all three without compromising the primary user's experience. The way to do this is progressive disclosure: the primary user never has to see content written for the tertiary user, but the tertiary user can always reach their content without being forced through the beginner layers.

---

## 2. The Governing Principle: Teach, Then Diagnose

The fundamental UX insight that drives the entire architecture is this: **a diagnosis without context is useless, but context without a personal stake is boring.**

The site solves this by giving the user their verdict first (in completely plain English, zero jargon), then teaching them what that verdict actually means, then re-surfacing the technical version of that same verdict once they have the vocabulary to read it.

The user's emotional hook is always "your theater specifically." The curriculum exists entirely in service of helping them understand that hook. Every section of IMAX 101 should feel like it is building toward a payoff — and that payoff is Layer 3, where the full technical diagnosis of their specific theater finally makes sense.

**The four-act structure applies to the entire page experience:**
1. **Teach** — IMAX 101 gives the user the vocabulary and framework
2. **Diagnose** — the verdict card tells them where their theater lands
3. **Prove** — the spec strips and comparison workbench show the numbers
4. **Explore** — the Deep Dive is there for users who want to go further

In the default scroll-flow, this order is slightly reshuffled for emotional reasons: the Instant Verdict (Diagnose) comes *before* the curriculum (Teach), because giving users their personal result first creates the motivation to read the curriculum. The technical re-diagnosis (Prove) comes after the curriculum, once the user can actually read it.

---

## 3. Site Architecture — Pages and Entry Points

The site has four distinct pages accessible at all times via a persistent navigation bar.

### 3.1 Navigation Bar

Persistent across all pages. Minimal — four items only:

`LIEMAX [logo]` · `Compare` · `IMAX 101` · `Deep Dive`

- **LIEMAX logo:** Returns to the splash/home page
- **Compare:** Goes directly to the standalone Comparison Tool page
- **IMAX 101:** Goes directly to the standalone IMAX 101 + Deep Dive page
- **Deep Dive:** Anchor-jumps within the IMAX 101 page, scrolling past the 101 to the Deep Dive sections

The nav bar does not compete with the splash. On the splash page it should be present but visually recessive — it becomes more prominent on the interior pages.

### 3.2 Home Page (The Guided Flow)

The default entry point. A single-page scroll experience that unfolds in sequence after a theater is selected. Full detail in Section 4.

### 3.3 Compare Page (Standalone)

A direct-access version of the comparison workbench with both slots empty. Full detail in Section 7.

### 3.4 IMAX 101 Page (Standalone)

A direct-access version of the full IMAX 101 curriculum, continuing into the Deep Dive. Includes a sticky sub-navigation and a theater search bar at the top. Full detail in Section 8.

---

## 4. Home Page — The Guided Flow

The home page is a single scroll that unfolds progressively after a theater is selected. It does not navigate to a new page. The splash stays anchored and content reveals below it.

The scroll order is:

```
[SPLASH]
  ↓ [user selects theater]
[LAYER 1 — INSTANT VERDICT]
  ↓ [user scrolls or clicks CTA]
[LAYER 2 — IMAX 101]
  ↓ [user scrolls or jumps]
[LAYER 3 — FULL TECHNICAL DIAGNOSIS]
  ↓ [user scrolls or follows Deep Dive CTA]
[LAYER 4 — DEEP DIVE entry point / link to standalone page]
```

### 4.1 The Splash

**One job:** make a stranger understand why they should care, then give them the one action that does something about it.

**Required elements:**
- **Primary headline** (confrontational, display type): *"You're probably not getting real IMAX."*
- **Three-stat strip** (directly below headline, large data callout style): These come directly from the site's own engine output and must be kept in sync with the database:
  - `{{db.total_us_imax}} IMAX locations in the US`
  - `{{db.not_full_143_digital_count}} ({{db.not_full_143_digital_pct}}%) are not full-height 1.43 digital`
  - `Only {{db.gt_laser_count}} show the full image at every digital showtime`
  - `{{db.commercial_full_143_projection_capable_count}}` current r-imax U.S. venues both show movies and have a flat 1.43 screen plus at least one 1.43 projection path; `{{db.full_143_projection_capable_count}}` is the raw current r-imax capability count before excluding non-commercial rows.
  - *Note on the GT Laser count: this refers specifically to venues where the 1.43:1 presentation is unconditional — every digital showtime, every film. The `{{db.film_conditional_count}}` 15/70-capable venues are a separate category because their True IMAX status is conditional on a physical film print being booked for that specific showtime.*
- **One-line purpose statement:** *"Search your theater. Find out what you're actually paying for."*
- **Search bar:** The only interactive element. Centered, prominent, unmistakable. Placeholder: *"Search your theater or city…"*
- **Nothing else.** No navigation prominence, no explainer copy, no scroll hint.

**No IMAX found fallback:** If a user searches a city or zip code with no IMAX theaters, display: *"No IMAX theaters found near [location]. Want to explore the site anyway?"* with a button that randomly selects a theater from the database to demonstrate the experience. The random selection should be weighted: approximately 70% LIEMAX, 20% IMAX Lite (CoLa), 10% True IMAX. Below the random selection, a persistent note: *"This is a random example — search your own theater above."* This is preferable to a dead end or redirect, because it keeps the user inside the guided experience.

**Design direction:** Dark background (near-black with a warm tint, not cold blue-black). Large display serif or high-contrast sans-serif for the headline. The three stats rendered as large, slightly glowing data callouts — amber or gold accent. Feels like data-journalism (NYT Upshot, The Pudding, Bloomberg Graphics), not a SaaS product.

### 4.2 Layer 1 — The Instant Verdict

After theater selection, the page opens below the search bar. The search bar stays anchored at top. The user never navigates away.

**Cardinal rule for this layer: zero jargon.** Not "mostly jargon-free" — completely. No abbreviations, no aspect ratio numbers, no format names (CoLa, GT, XT, DMR), no technical specs. If any word requires explanation, it does not belong in this layer.

#### 4.2.1 The Verdict Badge

Color-coded, one of four states:

| Badge | Color | Label | One-Line Tagline |
|---|---|---|---|
| TRUE IMAX | 🟢 Green | TRUE IMAX | "This is the real thing." |
| IMAX LITE | 🟡 Yellow | IMAX LITE | "Better than a regular theater, but not the full experience." |
| LIEMAX | 🔴 Red | LIEMAX | "You're paying IMAX prices for a glorified regular screen." |
| DOME / SPECIAL | ⚪ White/Gray | DOME | "A unique experience — not a standard IMAX room." |

**Important sub-states within 🟢 TRUE IMAX:**

The database contains three meaningfully different True IMAX configurations. The verdict badge is 🟢 for all three, but the tagline and summary copy must reflect the correct sub-state:

- **GT Laser only (unconditional 1.43):** e.g., Jordan's Furniture Reading, MA. Every digital showtime shows the full image. 🟢 is unconditional.
- **15/70-capable only (conditional 1.43):** e.g., Apple Cinemas Providence, RI. The theater runs a CoLa projector for standard digital IMAX — which is 🟡 IMAX Lite. It only becomes 🟢 when a physical 70mm IMAX film print is booked for a specific showtime. **This requires a showtime-conditional verdict:** the badge should reflect the actual showtime being evaluated, or include a prominent caveat: *"This theater is True IMAX only for 15/70 film showings. Check the schedule for '70mm' or 'IMAX 70mm' — a standard digital showing here uses a different, smaller-image projector."*
- **GT Laser + 15/70 (unconditional + film ceiling):** e.g., AMC Lincoln Square, NYC. Always 🟢 digitally; additionally capable of 15/70 film at the highest possible quality ceiling. The tagline should note both: *"True IMAX — laser projection at every showtime, plus 15/70 film when booked."*

#### 4.2.2 The Plain-English Summary Paragraph

Generated from the math engine but expressed entirely in relatable units and everyday language. Every number is translated into a human-scale equivalent. No spec values surface here — those belong in Layer 3.

Translation rules:
- Screen width in feet → *"roughly the size of a [relatable comparison]"*
- Aspect ratio difference → *"about a quarter of the picture is cut off"* (never "24% vertical frame loss")
- Projector vintage → *"installed around [year]"*
- Brightness → handled in Layer 3 only
- Contrast → handled in Layer 3 only

The summary paragraph is specific to the theater searched. It references the theater by name. It tells a brief story about what the experience at that specific room actually is.

#### 4.2.3 The Human-vs-Screen Scale Diagram

A person silhouette next to two screen outlines — "Your screen" and "True IMAX" — drawn to relative scale. Simple SVG line art. The most effective visual on the page because it makes the size difference viscerally obvious without any text. For Dome theaters, this diagram is replaced or supplemented with a dome silhouette showing the 180° horizontal wrap.

#### 4.2.4 The "What You're Missing" Callout

For LIEMAX and IMAX Lite verdicts only. A distinct callout box separate from the summary paragraph.

**Geolocation accepted:** Show the nearest True IMAX venue(s) from the database by state/region. Do not use a routing API for exact drive distance — use a static state-to-region lookup table. Label it as *"Nearest True IMAX in your region"* rather than claiming a specific mileage figure.

**Geolocation declined:** Default to AMC Lincoln Square, New York City, labeled explicitly as *"the best IMAX in the US"* — not "nearest." Honest framing about why it's the comparison point.

**Region logic:** State → region mapping. Handle large states (California, Texas) with sub-region splits (NorCal / SoCal, DFW / Houston / etc.). For example, New England is a single region (CT, ME, MA, NH, RI, VT) with Jordan's Reading as primary True IMAX and Providence as the 15/70-capable note.

#### 4.2.5 The Two-Path CTA

At the bottom of the verdict card:

- **Primary (visually prominent):** "Why does this happen? Read IMAX 101 ↓" — smooth scroll into Layer 2
- **Secondary (quiet text link):** "Already know the basics? Jump to the full specs →" — anchor jump that skips Layer 2 and lands at Layer 3

The secondary option is available but not encouraged. First-time visitors should feel like reading the 101 is the natural next step.

---

### 4.3 Layer 2 — IMAX 101

The curriculum. Linear scroll only — not tabs, not cards that can be opened in any order. The user builds knowledge in one direction. Each block must fully land before the next begins.

**Cardinal rule:** Never use a term before explaining it. Never explain a term before giving a reason to care about it.

The 101 has six blocks in this specific order. The order is non-negotiable — each block creates a dependency that the next block relies on.

---

#### Block 1 — The Origin Story (1971 → 2008 → Present)

**Job:** Establish the emotional and historical truth before any technology is introduced. The user needs to understand *why* the problem exists before learning what the problem is.

**Required narrative arc:**
1. What IMAX was when it was invented (1971): a specific, extreme film format built for museum-scale screens and science center documentaries
2. What changed in 2008: the Hollywood multiplex expansion deal, the brand dilution, the birth of LIEMAX
3. Where we are now: most IMAX theaters are the 2008-era smaller format; the original giant screens still exist but are rare

**Required emotional anchor:** *Oppenheimer* (2023) as the moment the general public first noticed the problem at scale. Shot almost entirely on IMAX 65mm film cameras, designed specifically for the original giant screen. Audiences at real IMAX theaters saw the picture grow dramatically during key scenes. Audiences at LIEMAX theaters got a different experience without knowing why. This is the hook that makes everything in the next five blocks feel urgent and personally relevant.

**Tooltip introductions in this block:** `LIEMAX`, `multiplex`

---

#### Block 2 — The Three Things That Actually Matter

**Job:** Introduce the three variables that determine whether an IMAX theater is "real" or not, in the correct order of consumer impact.

**The three variables, in this order:**

**Variable 1: Screen size**
How big the screen actually is, in feet. True IMAX screens are typically 80–100 feet wide and 60–70 feet tall. LIEMAX screens are typically 40–65 feet wide. Include the relatable human-scale comparison. Include the human-vs-screen SVG diagram if not already used in Layer 1 (or a version calibrated to general True IMAX dimensions rather than the specific theater).

**Variable 2: Image shape (aspect ratio)**
This is where the aspect ratio diagram goes. Show three frames at the same width: 1.43:1 (tall IMAX), 1.90:1 (LIEMAX digital), 2.39:1 (standard scope). The 1.43:1 is dramatically taller than the others.

Plain-English explanation of what this means in practice: some movies are made to use the full height of the tallest IMAX screen. When those movies play at a real IMAX, the black bars at top and bottom disappear and the picture grows taller by 40% or more. That expansion is the single most visible difference between a real IMAX and a LIEMAX.

Film example required here: the Trinity test sequence in *Oppenheimer* fills the entire seven-story screen at a True IMAX. At a LIEMAX, it stays in the shorter box.

**Variable 3: Projector generation**
Three generations, explained in plain English before any acronyms:
- Film — the original format (explained fully in Block 3)
- Modern laser — newer projectors from around 2014 onward; brighter and sharper than the old system
- Legacy lamp (2008 vintage) — the original LIEMAX hardware; older, dimmer as the lamp ages

**Tooltip introductions in this block:** `aspect ratio`, `1.43:1`, `1.90:1`, `projector generation`

---

#### Block 3 — The Original IMAX: 15/70 Film

**Job:** Establish 15/70 film as the benchmark everything else is measured against — and as a living, active format, not a historical footnote.

**This block must exist as its own dedicated module, not a bullet point.** 15/70 film is the answer to "what is IMAX supposed to be?" — which is the site's central question.

**Required content:**
- What the physical film format actually is: 70mm film running horizontally, 15 perforations per frame, each frame physically about the size of a playing card
- What this produces in terms of image quality: the equivalent of roughly 9,000–12,000 pixels of detail per frame (framed as "far beyond any digital projector currently available" — not as a competing spec sheet)
- Why it looks different from digital: grain texture, color depth, and physical scale combine to produce something immediately apparent on a giant screen
- The rarity: only a handful of theaters in the US can play 15/70 film, usually only when a physical print is booked for a specific title
- The films that use it: *The Dark Knight* (~28 min), *Interstellar* (~90 min), *Dunkirk* (near-entire runtime), *Oppenheimer* (near-entire runtime), *Sinners* (2025, confirmed), *The Odyssey* (2026, confirmed)
- The honest caveat: the best digital GT Laser system cannot match the grain and color depth of 15/70 film projection — but it is more consistent, brighter, and available for every showtime without requiring a physical print. Both are genuine True IMAX; film is the ceiling.

**Regional callout (for New England users, but informative for everyone):** Providence is the only 15/70-capable venue in all of New England. A standard digital IMAX showing at Providence is a CoLa presentation (IMAX Lite), not film. Only showings specifically listed as "70mm" or "IMAX 70mm" use the film projector.

**Tooltip introductions in this block:** `15/70`, `IMAX 65mm cameras`, `film print`

---

#### Block 4 — Does the Movie Even Matter?

**Job:** Establish that the theater and the movie are two separate variables, and both matter. Introduce the movie-type taxonomy that determines whether any of the format differences are actually visible to the audience.

**This block must come before Block 5 (PLF ecosystem)** because Block 5's key recommendation ("Dolby often beats LIEMAX for most movies") depends on the user understanding which movies fall into the "most movies" category.

**The movie-type taxonomy — four tiers:**

1. **"Experience it in IMAX" / "IMAX" tag only:** The film was not shot with IMAX cameras. It went through IMAX's DMR (Digital Media Remastering) process — a regrade and audio remix that produces a cleaner, clearer image on the big screen. No expanded aspect ratio. Audio is 6-channel, not 12-channel. The IMAX room is still better than a standard room, but the difference between a real IMAX and a LIEMAX is minimal for this type of film.

2. **"Filmed for IMAX":** Shot with an IMAX-certified digital camera (e.g., Arri Alexa 65). Will have expanded aspect ratio for key sequences, and 12-channel audio. The difference between a real IMAX and a LIEMAX is significant for this type.

3. **"Shot with IMAX Film Cameras":** Shot on physical IMAX 65mm film cameras. The highest resolution possible. Expanded aspect ratio, 12-channel audio, and the grain/texture/color depth that only photochemical film produces. The difference between a real IMAX and a LIEMAX is maximum for this type — and only Apple Cinemas Providence (when a film print is booked) can show these at their true ceiling.

4. **Laser vs. Lamp projector (independent of movie type):** The projector generation affects brightness and sharpness regardless of how the movie was made. Laser is noticeably brighter, color is more vivid. This is an independent variable from the movie-type taxonomy above.

**The consumer decision matrix this produces (expressed in plain English, not as a table):**
- DMR film at a LIEMAX: basically fine — you're not missing meaningful content
- IMAX-shot film at a LIEMAX: you're missing 24% of the vertical image and the director made choices assuming you'd see the full frame
- IMAX-shot film at a True IMAX: what the film was made to be seen as

**Tooltip introductions in this block:** `DMR`, `Filmed for IMAX`, `IMAX-certified digital`, `12-channel audio`

---

#### Block 5 — The PLF Ecosystem: What Else Is Out There?

**Job:** Answer the implicit question — if my IMAX is a LIEMAX, what should I do instead?

**The key message this block must land:** For most movies that weren't filmed specifically for IMAX, Dolby Cinema is often the better choice over a LIEMAX. State this directly and plainly. This is the most practically useful piece of information on the entire site.

**Formats to cover, in this order:**

1. **Dolby Cinema** — Focus on picture quality: deepest blacks, most vivid colors, Dolby Atmos object-based surround. No giant-screen effect, but the best picture quality in a cinema setting for most movies. Best for darker, contrast-heavy films where deep blacks matter. *The practical payoff line: if your local IMAX is a LIEMAX and there's a Dolby Cinema nearby, Dolby is usually the better call — unless the movie specifically uses IMAX's taller frame.*

2. **Cinemark XD** — Large screen, 4K laser, 11.1-channel surround. A solid step up from a standard room but not IMAX-level scale. Best for blockbusters at Cinemark locations when no IMAX or Dolby Cinema is nearby.

3. **Regal RPX** — Bigger screen, improved sound. Modest visual upgrade. The weakest of the major branded PLF tiers. Best for comfortable viewing when no better option is available.

4. **ScreenX** — 270-degree three-wall projection for select scenes. A novelty format, not a picture-quality upgrade. Best for curiosity and spectacle.

5. **4DX** — Motion seats, environmental effects. An amusement park ride attached to a movie. Not a picture-quality format at all.

**Dolby Cinema 2025 note (important for accuracy):** Dolby Cinema locations opened from May 2025 onward use a new single-projector Christie Eclipse-based system with significantly different specs than the older dual-laser system. Both are called "Dolby Cinema." The site does not need to explain this distinction in the 101 — it surfaces in the comparison workbench spec strips for users who look up specific venues.

**Tooltip introductions in this block:** `PLF`, `Dolby Atmos`, `HDR`, `foot-lamberts`

---

#### Block 6 — The Format Ladder (Now Earned)

**Job:** Now that the user has the full framework — the history, the three variables, the film format, the movie taxonomy, and the competitive landscape — present the format ladder as a ranking system they can now read.

By this point in the 101, the ladder is not a taxonomy. It is a summary of everything the user has just learned, organized into a clear hierarchy.

**The four tiers:**

| Tier | Label | What It Means |
|---|---|---|
| 🟢 Top | True Giant-Screen IMAX | 15/70 film OR GT Dual Laser. Full 1.43:1 screen. Only ~14 venues show this at every digital showtime; additional 15/70-capable venues require a specific film print. This is what IMAX was invented to be. |
| 🟡 High | Large Digital IMAX (IMAX Lite) | Modern single-laser (CoLa / XT). A real step up from 2008. Bigger screen than a normal room. Still limited to the 1.90:1 shorter image shape. |
| 🔴 Common | Legacy Multiplex IMAX (LIEMAX) | The 2008-era dual-xenon digital system. The original brand-dilution hardware. Aging projectors and the screen that built the LIEMAX reputation. |
| ⚪ Special | IMAX Dome (Omnimax) | A completely different category. Hemispherical screen, designed for total peripheral immersion. Great for documentaries and purpose-built dome content. Not better or worse than flat-screen IMAX — a different format with a different purpose. |

**The Dome must be described as categorically distinct, not as a degraded IMAX.** A user who visits the Mugar Omni at the Boston Museum of Science is not seeing a worse version of the thing; they're seeing a unique experience. The framing must reflect this clearly.

**Tooltip introductions in this block:** `GT Laser`, `CoLa`, `XT`, `dual xenon`, `dome`

---

### 4.4 Layer 3 — Full Technical Diagnosis

The user has been taught. Now the full technical breakdown of their specific theater is legible.

**Re-entry context header:** A brief two-line acknowledgment: *"You've just read through everything you need to understand the numbers below. Here's your full diagnosis for [Theater Name]."* This makes the transition feel earned.

#### 4.4.1 The Full Verdict Card (Technical Version)

Same four-tier badge — but now the tagline includes technical language, because the user can read it:

*Example for CoLa venue:* "IMAX Lite — Single-Laser (CoLa), 1.90:1 maximum, ~55 ft wide screen."

The badge sub-state logic from Layer 1 applies here too — GT Laser only vs. 15/70-conditional vs. GT+15/70 all produce distinct tagline variants.

#### 4.4.2 The Spec Strips

Each spec has a primary value (the number) and a plain-English translation beneath it:

- **Screen dimensions** — in feet, with human-scale comparison retained
- **Maximum image shape** — 1.43:1 or 1.90:1, with the aspect ratio diagram from Block 2 as a visual reminder
- **Projector type** — technical name (CoLa, GT Laser, Dual Xenon, 15/70) with the plain-English generation label below it
- **Brightness** — in foot-lamberts with translation (*"X% brighter than a standard theater"*)
- **Contrast** — sequential ratio with translation (*"how 'black' the blacks actually look"*)
- **Sound** — channel count and system name

**Brightness reference values for translation math:**
- Standard multiplex baseline: 14 fL
- IMAX calibration target (all laser formats): 22 fL
- Dolby Cinema HDR mode: 31 fL
- IMAX xenon spec (new lamp): 22 fL; real-world aged lamp: 12–14 fL

**Contrast reference values:**
- Standard xenon DCI: 2,000–2,600:1
- IMAX dual xenon: 2,500:1
- IMAX CoLa (single laser): 10,000:1
- IMAX GT Dual Laser: 8,000:1+
- Dolby Cinema sequential: 5,000–7,500:1 (the "1,000,000:1" figure is a dynamic black-level claim, not a sequential measurement — do not use it without this caveat)

#### 4.4.3 The "What This Means" Paragraph (Technical Version)

Same interpretive prose as Layer 1, but now technically enriched. Can reference specific specs, format names, and numbers without explanation because the user has the vocabulary.

#### 4.4.4 Progressive Disclosure Accordion

Collapsed by default. Contains:
- Field of view values
- Pixels per degree (PPD) and perceived sharpness context
- Confidence level and source attribution for each spec
- DMR processing notes for the specific film (if a film is being evaluated, not just a venue)
- Known limitations (lamp aging notes for xenon venues; film print availability for 15/70 venues)

#### 4.4.5 The Comparison Workbench

Pre-loaded with the nearest True IMAX (from geolocation region logic) or AMC Lincoln Square (national fallback) as the right-hand comparison column. The user's searched theater is the left column.

**Winner sentence logic:**
- For flat-screen IMAX comparisons where Right > Left on all major dimensions: *"[Right venue] wins on every dimension that matters for IMAX-shot content."*
- For Dome comparisons: winner sentence is replaced entirely with *"This is a dome theater — direct comparison on flat-screen IMAX dimensions isn't meaningful. See the Deep Dive for dome-specific coverage metrics."*
- For cases where Left is already True IMAX: winner sentence reflects that — *"You're already at the top tier — here's how it compares to another True IMAX."*

**Comparison rows — two tiers:**
- **Primary rows (always visible):** Screen impact, Full IMAX image available, Picture quality, Best use case, Verdict
- **Advanced rows (expandable):** Screen dimensions, FOV, PPD, brightness, contrast, audio channels, projector type, source confidence

---

### 4.5 Layer 4 — Deep Dive Entry Point

At the bottom of the guided flow, a section header and brief description of the Deep Dive, with a CTA to either continue scrolling (if the Deep Dive is appended below) or go to the standalone IMAX 101 page anchored to the Deep Dive sections.

---

## 5. The Tooltip System

Sitewide. Every jargon term, on **first use only** across the entire page, gets a tooltip trigger.

**Visual treatment:** Subtle dotted underline — not a garish highlight or bold text. On hover (desktop) or tap (mobile), a small card appears.

**Tooltip card format:**
- **Term** in bold
- One plain-English sentence — no more
- Optional: *"↓ explained in IMAX 101"* anchor link if the term has a full block below

**First-use-only rule:** A given term only gets the tooltip trigger on its first appearance on the page. Subsequent uses are plain text. This prevents the tooltip from becoming a visual tic.

**Priority tooltip terms by layer of first appearance:**

- *Splash/Layer 1:* `LIEMAX`, `IMAX`, `True IMAX`, `IMAX Lite`
- *Block 1:* `LIMAX controversy`, `multiplex`
- *Block 2:* `aspect ratio`, `1.43:1`, `1.90:1`, `2.39:1`, `projector generation`
- *Block 3:* `15/70`, `IMAX 65mm cameras`, `film print`, `Filmed for IMAX`
- *Block 4:* `DMR`, `IMAX-certified digital`, `12-channel audio`, `6-channel magnetic`
- *Block 5:* `PLF`, `Dolby Atmos`, `HDR`, `foot-lamberts`, `Dolby Vision`
- *Block 6:* `GT Laser`, `CoLa`, `XT`, `dual xenon`, `dome`
- *Layer 3:* `sequential contrast`, `FOV`, `PPD`, `fps`, `screen gain`

---

## 6. The Verdict Tier Logic

### 6.1 Tier Definitions

**TRUE IMAX (🟢):** The venue can present the full 1.43:1 IMAX image without cropping or pillarboxing. Requires GT Dual Laser OR a functioning 15/70 projector with a film print booked. Sub-states:
- `true_imax_gt_laser` — always 1.43:1 at every digital showtime
- `true_imax_film_conditional` — 1.43:1 only when a 70mm IMAX film print is booked; defaults to CoLa (IMAX Lite) for standard digital showings
- `true_imax_both` — GT Laser at every digital showtime AND 15/70 film capability when prints are booked (e.g., Lincoln Square)

**IMAX LITE (🟡):** Modern single-laser projection (CoLa or XT), limited to 1.90:1 maximum. A real improvement over legacy xenon but not the full IMAX image.

**LIEMAX (🔴):** Dual-xenon digital projection. The original 2008 MPX hardware. 1.90:1 maximum, older and dimmer as lamps age. The national LIEMAX count is generated as `{{db.liemax_count}}`, with archival LFExaminer-sourced rows separately exposed as `{{db.liemax_lfexaminer_count}}` because that database is stale and low-confidence.

**DOME (⚪):** Hemispherical screen. Not evaluated on the flat-screen ladder. 180° horizontal × 125° vertical coverage. The correct comparison metric is hemisphere coverage, not screen width or aspect ratio.

### 6.2 Stat Strip Source

All stats on the splash derive from the site's own database engine:
- `{{db.total_us_imax}}` total US IMAX rows
- `{{db.current_r_imax_count}}` current 143190 / r-imax U.S. rows
- `{{db.lfexaminer_supplemental_count}}` archival LFExaminer Xenon supplement rows
- `{{db.not_full_143_digital_count}}` (`{{db.not_full_143_digital_pct}}%`) not full-height 1.43 digital
- `{{db.commercial_full_143_projection_capable_count}}` current r-imax U.S. movie-showing venues with a flat 1.43 screen and at least one 1.43 projection path
- `{{db.full_143_projection_capable_count}}` raw current r-imax U.S. venues with a flat 1.43 screen and at least one 1.43 projection path, before excluding non-commercial rows
- `{{db.imax_lite_count}}` IMAX Lite rows (CoLa / Laser XT)
- `{{db.liemax_count}}` LIEMAX rows (Dual Xenon), including `{{db.liemax_lfexaminer_count}}` archival LFExaminer rows
- `{{db.gt_laser_count}}` True IMAX unconditional (GT Laser, every showtime)
- `{{db.film_conditional_count}}` 15/70-capable (film conditional)
- `{{db.dome_count}}` Dome

These numbers must stay in sync with the database. The splash stat strip should pull from the same source as the engine, not from hardcoded copy.

---

## 7. Compare Page (Standalone)

**Purpose:** Direct access to the comparison workbench for users who know what they want to compare.

**Default state:** Both slots empty. Search field in each column. No pre-loaded venues.

**"Load example comparison" link:** Pre-fills a representative LIEMAX vs. True IMAX pair to demonstrate the tool for users who want to see it in action first. The example pair should be a nationally recognizable LIEMAX (e.g., a common AMC multiplex IMAX) vs. AMC Lincoln Square.

**Theater search bar at top of page:** With a framing line: *"Comparing two specific theaters? Search both above. Or search one theater to see your full diagnosis on the home page."*

**Workbench behavior:** Identical to the workbench in Layer 3 of the guided flow — same row structure, same primary/advanced tier, same winner sentence logic. The difference is that no comparison is pre-loaded and there is no curriculum above it.

**Dome handling:** If either slot is a Dome theater, the winner sentence is replaced with the dome-specific message and a link to the Dome in Depth section of the Deep Dive.

---

## 8. IMAX 101 + Deep Dive Page (Standalone)

**Purpose:** Direct access to all educational content, for users who want to learn without going through the theater-selection flow.

**At the top of this page:** A theater search bar with framing: *"Reading about a specific theater? Search it here to see your full diagnosis alongside the 101."* This ensures educational content and the personalized verdict are never fully siloed — a user who came in through the 101 can still get their theater diagnosed without returning to the splash.

**Sticky sub-navigation (within this page):**
`Overview · 15/70 Film · Format Ladder · The Competition · Deep Dive`

**Content:** The six IMAX 101 blocks in full (identical content to the guided flow, but without the theater-specific Layer 1 framing), followed by the Deep Dive sections below.

### 8.1 Deep Dive Sections

These are reference material, not a linear scroll. Tabs or cards are appropriate here.

1. **Full IMAX History** — The long arc: Expo '67 → Cinesphere 1971 → museum era → 2008 MPX rollout → 2014 GT Laser → 2023 *Oppenheimer* → 2025–2026 film slate
2. **The Director–Format Relationship** — Nolan, Villeneuve, Coogler, Peele. Why directors still choose the expensive, loud, heavy film cameras. What "Filmed for IMAX" actually means at the production level.
3. **The Full PLF Comparison** — Complete technical spec table for all major PLFs, now readable because the user has the vocabulary. Includes the Dolby Cinema pre/post-2025 distinction.
4. **The IMAX Business Story** — The licensing model, why LIEMAX happened, economics of brand dilution, FY2025 financial performance, Dolby Cinema expansion trajectory.
5. **Dome IMAX in Depth** — The full technical story: 15/70 Rolling Loop transport, the 9.4mm optical offset and why it exists, hemisphere coverage math (80–86%), 15kW xenon lamp and liquid cooling, perforated aluminum screen, digital laser dome transition and the screen-door effect challenge, the Mugar Omni field notes.
6. **Home Theater vs. Cinema** — The honest comparison: where home wins (per-pixel HDR, pixels per degree at typical viewing distance, convenience), where theater wins (physical scale, true 1.43:1 frames unavailable on any home format, calibrated SPL, communal experience). IMAX Enhanced explained accurately (1.90:1 LIMAX-standard content, not 15/70 film).
7. **Data Sources and Methodology** — Confidence levels, primary sources vs. community estimates, last-verified dates, how the math engine works, what each spec means and how it was sourced.

---

## 9. Data Accuracy Commitments

The following specs are confirmed at HIGH confidence from primary sources and should be treated as authoritative in all copy and UI:

| Spec | Value | Source |
|---|---|---|
| IMAX brightness target (all laser) | 22 fL (75 cd/m²) | IMAX CTO Bonnick, Display Daily 2018 |
| IMAX CoLa sequential contrast | 10,000:1 | IMAX CTO Bonnick, CinemaCon 2018 |
| IMAX GT Dual Laser contrast | 8,000:1+ | CTO statements, Display Daily |
| IMAX dual xenon contrast | 2,500:1 | CTO Bonnick, Display Daily 2015/2018 |
| DCI multiplex brightness minimum | 14 fL (48 cd/m²) | DCI Spec v1.0 |
| DCI sequential contrast minimum | 2,000:1 | DCI Spec v1.0 |
| Dolby Cinema dual-laser brightness | 31 fL (~106 cd/m²) | Dolby spec / trade reporting |
| Dolby Cinema sequential contrast | 5,000–7,500:1 | Christie E3LH; midpoint 6,250:1 |
| Dolby Cinema "1,000,000:1" | Dynamic black-level claim only | Dolby/Christie — NOT sequential |
| New Dolby (Christie Eclipse, 2025+) | ~25,000–30,000 lumens; 20,000,000:1 | Christie spec; community reports |
| Cinemark XD aspect ratio | 1.90:1 | Native DLP chip ratio |
| Cinemark XD screen diagonal | "Over 70 ft corner-to-corner" | Cinemark press materials |
| IMAX Dome horizontal FOV | 180° | IMAX specifications |
| IMAX Dome vertical FOV | 125° average | IMAX specifications |
| IMAX Dome hemisphere coverage | 80–86% | IMAX/planetarium operator specs |
| IMAX Dome optical offset | 9.4mm upward | IMAX Format and Specifications Guide |
| 15/70 frame dimensions | 70.41mm × 52.63mm | Technical literature |
| 15/70 scan-equivalent resolution | ~8.8K–11.7K horizontal | Cinematography Mailing List; range depends on scanner micron |

**Terms that require caveats whenever used:**
- "1,000,000:1" contrast (Dolby Cinema): always qualify as dynamic black-level claim, not sequential
- "16K" or "18K" for 15/70 film: no authoritative single figure; use the 8.8K–11.7K range
- GT Dual Laser "5.8K equivalent": illustrative sampling estimate only, not an official IMAX spec
- Dolby Cinema single-laser brightness: venue-specific until Dolby publishes official fL specs; pre/post May 2025 distinction applies

---

## 10. Content Tone and Voice

**Voice:** Confident, specific, slightly wry. The site has a point of view — it thinks most people are getting ripped off and it wants to help. But it is not angry or performatively outraged. It is the friend who works in the industry and just explains things clearly.

**Never:** condescending, technical-jargon-flexing, hedging to the point of uselessness, or alarmist.

**Always:** specific over vague, relatable units over abstract specs, honest about what is confirmed vs. estimated.

**On numbers:** If a number is a community estimate or derived figure, say so. If it's a direct manufacturer spec or CTO statement, the number stands on its own. The site's credibility comes from being honest about confidence levels, not from projecting false certainty.

**On LIEMAX:** The site uses the term as a descriptor, not as an insult. The word is accurate — it describes a real phenomenon — but the tone around it is informative, not contemptuous. The theaters didn't do anything wrong; IMAX Corporation made a business decision and most audiences didn't know about it. The site's job is to fill that information gap, not to shame anyone.

**On the Dome:** Never describe it as a worse IMAX. Never describe it as a better IMAX. It is a different IMAX, built for a different purpose, with a different set of tradeoffs. Users who visited the Mugar Omni should feel like they saw something genuinely special — because they did.

---

## 11. Build Sequence (for Codex / Claude Code)

The implementation order below reflects both logical dependencies and the order in which written content blocks will be delivered. Do not build a UI component that depends on content that hasn't been written yet.

1. **Navigation bar** — static, four items, persistent across all pages
2. **Splash screen** — static layout, no logic; stat strip hardcoded initially, to be wired to engine later
3. **Search → verdict transformation** — the interaction where the splash opens into Layer 1; requires `beginnerVerdictFor()` and `whatThisMeansFor()` helpers; requires verdict tier logic from Section 6
4. **Venue sub-state logic** — GT-only vs. film-conditional vs. GT+film variants for the 🟢 verdict; requires the showtime-conditional copy variants
5. **Tooltip component** — build `<Tooltip term="...">` before any IMAX 101 blocks; first-use-only tracking; all tooltip copy delivered as a content block
6. **Layer 1 full verdict card** — badge, summary paragraph, scale diagram, "what you're missing" callout, two-path CTA; requires geolocation → region lookup table
7. **IMAX 101 — Block 1** through **Block 6** — in sequence; each block wires in tooltips as they are introduced
8. **Layer 3 re-entry header + full verdict card** — technical version; spec strips with translation math
9. **Progressive disclosure accordion** — collapsed by default; FOV, PPD, confidence levels, known limitations
10. **Comparison workbench** — Layer 3 version; pre-loaded geolocation/fallback logic; winner sentence variants including Dome special case
11. **Layer 4 entry point** — CTA to Deep Dive standalone page
12. **Compare page (standalone)** — blank workbench; "load example" link; search bars
13. **IMAX 101 page (standalone)** — sticky sub-nav; theater search bar at top; same Block 1–6 content as guided flow
14. **Deep Dive sections** — tabs/cards; one section at a time in order listed in Section 8.1
15. **Stat strip engine sync** — wire the splash stats to the live database rather than hardcoded copy

---

## 12. Open Questions / Known Gaps

These are items that require resolution before the relevant sections can be finalized:

- **Dolby Cinema 2025 single-laser fL spec:** No official per-venue foot-lambert figure published by Dolby as of the research date. The comparison workbench should flag new Dolby Cinema builds (post May 2025) with a confidence caveat.
- The database should tag all 15/70-capable venues and the regional lookup table should surface the correct one per user location.
- **Infinity Vision certification list:** As of April 2026, no official Disney venue list has been published. The 75+ domestic / 300+ international figures come from secondary reporting. Do not include Infinity Vision in the format ladder or comparison workbench until a verifiable list exists.
- **RPX laser vs. xenon split:** Many RPX rooms remain on xenon; laser only at recently renovated locations. The comparison workbench should not present RPX as uniformly laser.
- **Dolby Cinema U.S. count:** Use `{{db.dolby_cinema_us_count}}` / `window.LIEMAX_DATA.db.dolby_cinema_us_count`, generated from the saved Dolby Cinema finder endpoint snapshot. Treat it as a point-in-time scrape, not a published corporate total.
- **Seating depth estimates for non-GT venues:** CoLa, Dolby Cinema, Cinemark XD, and standard multiplex presets may use auditorium-ratio estimates for FOV calculations; GT rooms should use venue-specific estimates where available from the database.
