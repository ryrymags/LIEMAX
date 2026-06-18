# LIEMAX Overhaul — Open Flags

Flags requiring human input or deferral. No implementation judgment calls have been made to resolve these.

---

## FLAG 1 — Dolby Cinema 2025 Single-Laser fL Spec
**Status:** Deferred
**Section affected:** Layer 3 spec strips; Compare workbench
**Issue:** No official per-venue foot-lambert figure published by Dolby for Christie Eclipse (post-May 2025) venues.
**Resolution plan:** Branch Layer 3 spec strips by venue open date. Pre-May 2025: dual-laser system, 31 fL. Post-May 2025: flag with caveat "Specs for this Dolby Cinema location pending official disclosure — early reports indicate ~25,000–30,000 lumens (Christie Eclipse)." Do not publish an fL figure until Dolby confirms.

## FLAG 2 — RPX Laser vs Xenon Per-Venue Split
**Status:** Open — needs data audit
**Section affected:** Compare workbench; Block 5 copy
**Issue:** Current data.js may not tag RPX venues as laser vs xenon individually. Many RPX rooms remain on xenon.
**Resolution plan:** Block 5 copy uses non-specific "varies by location" language (already in draft). Workbench should not assume laser RPX unless venue record confirms it. Needs data audit to confirm per-venue tagging in data.js.

## FLAG 3 — GT3D 15/70 Venue Handling
**Status:** Open
**Section affected:** Workbench; verdict classification
**Issue:** No confirmed venue list, no brightness penalty data, no post-2020 activity confirmation for GT3D.
**Resolution plan:** Flag GT3D-tagged venues with `isInstitutional: true` so workbench excludes or renders appropriate empty-field treatment. Do not display verdict tier.

## FLAG 4 — Block 6 Format Ladder Chevron Anchors
**Status:** Deferred
**Section affected:** Block 6 format ladder diagram (Row 1–4 chevrons)
**Issue:** Chevrons need Layer 3 section element IDs, which are not confirmed until Layer 3 is built.
**Resolution plan:** Render chevrons as non-linked visual elements for MVP. Wire to Layer 3 IDs once confirmed. Per Block 6 dev notes: do not route to standalone Deep Dive page as interim.

## FLAG 5 — Infinity Vision
**Status:** Closed — excluded
**Resolution:** No verifiable venue list as of April 2026. Excluded from all copy, format ladder, and workbench. No action required unless a verified list is published.
