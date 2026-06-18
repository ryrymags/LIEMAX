# LIEMAX Overhaul — TODO

## Legend
- [x] Complete
- [~] In progress
- [ ] Pending
- [!] Blocked / flagged

---

## CHUNK 1 — Read and Map
- [x] Read LIEMAX-Overhaul-Bible.md
- [x] Read Blocks 1-3 (V2).md
- [x] Read Blocks 4-6 (V2).md
- [x] Read Layer Transitions.md
- [x] Read existing docs/ codebase (data.js, diagnosis.js, app.jsx, stage.js)
- [x] Read Projector-Types-Deep-Dive.md (in research/)
- [x] Read Master Research.md (in research/)
- [x] Read IMAX Dome Research.md (in research/)
- [x] Read Home Theater Research.md (in research/)
- [x] Read Fixing Research Gaps part 2.md (in research/)
- [x] Write ARCHITECTURE.md
- [x] Write TODO.md

## CHUNK 2 — Project Scaffold
- [ ] Rebuild docs/index.html (load order, CDN deps, new script tags)
- [ ] Stub app.jsx with 4 views (home, compare, imax101, deepdive) and NavBar
- [ ] NavBar: 4 items, persistent, LIEMAX logo + Compare + IMAX 101 + Deep Dive

## CHUNK 3 — Data Layer
- [ ] Write docs/db-stats.js (compute all {{db.*}} tokens from data.js)
- [ ] Write docs/regions.js (state → region → nearest True IMAX lookup table)
- [ ] Write docs/tooltips.js (TOOLTIP_DEFS + TooltipManager + <Tooltip> component)
- [ ] Validate db stats match known figures (manually check against data.js)

## CHUNK 4 — Splash + Layer 1
- [ ] Splash: headline "You're probably not getting real IMAX."
- [ ] Splash: 3-stat strip wired to db-stats.js
- [ ] Splash: search bar (autocomplete from data.js venues)
- [ ] Splash: "no IMAX found" fallback with weighted random selection (70/20/10)
- [ ] Layer 1: verdict badge (4 states + 3 sub-states)
- [ ] Layer 1: plain-English summary paragraph (theater-specific, zero jargon)
- [ ] Layer 1: human-vs-screen scale diagram (SVG, dome variant)
- [ ] Layer 1: "What You're Missing" callout (nearest True IMAX by region)
- [ ] Layer 1: two-path CTA (primary scroll to 101, secondary jump to Layer 3)
- [ ] Transition A: exact copy, centered subdued typography

## CHUNK 5 — IMAX 101 Blocks 1–6
- [ ] Block 1: exact copy, multiplex tooltip
- [ ] Block 2: exact copy, 5 tooltips, scale comparison SVG, aspect ratio SVG (human required)
- [ ] Block 3: exact copy, 3 tooltips, {{db.film_conditional_count}} token
- [ ] Block 4: exact copy, 4 tooltips, movie-type gap divergence SVG
- [ ] Block 5: exact copy, 4 tooltips
- [ ] Block 6: exact copy, 5 tooltips, format ladder SVG, stat callout strip (all db tokens)
- [ ] Transition B: exact copy, {{theater.name}} token, amber accent

## CHUNK 6 — Layer 3: Full Technical Diagnosis
- [ ] Re-entry context header
- [ ] Full verdict card (technical tagline variants per sub-state)
- [ ] Spec strip: screen dimensions (ft + human-scale)
- [ ] Spec strip: max image shape (1.43 or 1.90 with mini AR diagram)
- [ ] Spec strip: projector type (technical name + plain-English)
- [ ] Spec strip: brightness (fL + "X% brighter than standard theater")
- [ ] Spec strip: contrast (sequential ratio + plain-English)
- [ ] Spec strip: sound (channel count + system)
- [ ] Dolby Cinema 2025 post-May flag caveat
- [ ] Progressive disclosure accordion (FOV, PPD, confidence, known limitations)

## CHUNK 7 — Comparison Workbench
- [ ] Layer 3 embedded workbench (left = searched venue, right = nearest True IMAX)
- [ ] Standalone Compare page (both slots empty, "load example" link)
- [ ] Primary comparison rows (always visible)
- [ ] Advanced rows (expandable)
- [ ] Winner sentence logic (all variants incl. Dome special case)
- [ ] Dome comparison message + Deep Dive link

## CHUNK 8 — Deep Dive
- [ ] Deep Dive entry point at bottom of home guided flow
- [ ] Standalone IMAX 101 page with sticky sub-navigation
- [ ] Theater search bar at top of standalone IMAX 101 page
- [ ] Deep Dive sections (tabs/cards): Full IMAX History, Director-Format, PLF Comparison, Business Story, Dome in Depth, Home Theater vs Cinema, Data Sources
- [ ] Dome in Depth: frame dome as categorically distinct, not degraded

## CHUNK 9 — Design System (runs in parallel with above)
- [ ] Dark background: #111009 (warm near-black)
- [ ] Amber/gold accent: #c9a040
- [ ] Typography: Source Serif 4 (display), IBM Plex Mono (data), system sans (body)
- [ ] Verdict badge colors: green / amber-yellow / red / neutral-gray
- [ ] Tooltip component styles (dotted underline, hover card)
- [ ] Spec strip styles
- [ ] Format ladder diagram styles
- [ ] Stat callout strip styles
- [ ] Responsive (mobile-first)

## CHUNK 10 — QA
- [ ] 10 test venues covering all 4 tiers
- [ ] Tooltip first-appearance trigger (verify no double-fires)
- [ ] 15/70-conditional verdict caveat (test Apple Cinemas Providence, RI)
- [ ] "No IMAX found" fallback weighted selection
- [ ] Transition A/B copy exact match against source
- [ ] All 6 block prose exact match against source
- [ ] All db tokens live-resolving (no hardcoded percentages)
- [ ] Accessibility: keyboard nav, ARIA labels
- [ ] Mobile responsiveness

---

## OPEN FLAGS

1. **Dolby Cinema 2025 single-laser fL spec** — No official per-venue figure published. Flag post-May 2025 Dolby Cinema venues in Layer 3 spec strips with confidence caveat. Resolution: use "~25,000–30,000 lumens" from Christie spec per Bible §9; do not publish fL until Dolby confirms. Status: **deferred to Layer 3 branch logic**.

2. **RPX laser vs xenon split** — Many RPX rooms on xenon. Current data.js may not distinguish per-venue. Resolution: do not present RPX as uniformly laser; add "varies by location" note in Block 5 and workbench. Status: **open — needs data audit**.

3. **GT3D 15/70 venues** — No 3D film mechanism data, no brightness penalty, no confirmed venue list. Resolution: flag GT3D-tagged venues as `isInstitutional: true` and exclude from standard workbench. Status: **open**.

4. **Block 6 format ladder chevron anchors** — Row chevrons need Layer 3 element IDs. Resolution: leave unlinked for MVP; wire once Layer 3 IDs confirmed. Status: **deferred**.

5. **Infinity Vision** — No verifiable venue list as of April 2026. Resolution: excluded entirely. Status: **closed — excluded by rule**.
