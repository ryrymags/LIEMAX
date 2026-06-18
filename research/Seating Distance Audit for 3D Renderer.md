# Seating Distance Audit for 3D Renderer

## Overview

This June 2026 follow-up audit refines front, middle, back-row, and projector-distance modeling across GT, retrofit IMAX, Dolby Cinema, and standard multiplex rooms. It is an addendum to `Theater Geometry Reference for 3D Renderer.md`.

Use these values as profile-derived renderer/data fallbacks only. Venue-specific measurements and overrides still win.

## IMAX GT Reference

Reference room: about 70 ft wide x 52 ft tall.

| Seat | Distance | Eye Level | Rendering Note |
| --- | ---: | ---: | --- |
| Front | ~24 ft, 0.35W | ~33% up screen | Front row sits on an elevated deck above a pit. |
| Mid | ~46 ft, 0.65W | ~60% up screen | Practical sweet-spot fallback. |
| Back | ~63 ft, 0.90W | ~87% up screen | Last row remains inside one screen width. |
| Projector | ~63-70 ft, 0.95W | Around screen center height | Defer until the renderer draws booth/projector geometry. |

Confidence: high for 0.35W front, 0.90W back, and front-row eye height near one-third screen height; medium for derived vertical eye percentages beyond the front row.

## Retrofit IMAX / LIEMAX Reference

Reference room: about 47 ft wide x 25 ft tall.

| Seat | Distance | Eye Level | Rendering Note |
| --- | ---: | ---: | --- |
| Front | ~52 ft, 1.10W | Near screen bottom | Conventional no-pit room. |
| Mid | ~56 ft, 1.20W | ~25% up screen | Mild rake. |
| Back | ~66 ft, 1.40W | ~51% up screen | Booth roughly behind/above back row. |
| Projector | ~68 ft, 1.45W | Standard booth | Defer projector visualization. |

Confidence: high for the 1.10W-1.40W depth band based on LF Examiner measured retrofit examples.

## Dolby Cinema Reference

Reference room: about 57 ft wide x 30 ft tall.

| Seat | Distance | Eye Level | Rendering Note |
| --- | ---: | ---: | --- |
| Front | ~20 ft, 0.35W | Slightly below screen bottom | Extremely close horizontally; recliner posture partly compensates. |
| Mid | ~43 ft, 0.75W | ~19% up screen | Comfortable middle-row fallback. |
| Back | ~74 ft, 1.30W | ~44% up screen | Still no pit; wider row pitch from recliners. |
| Projector | ~80 ft, 1.40W | Standard booth | Defer projector visualization. |

Confidence: high for the roughly 20 ft front-row observation at AMC Orange 30; medium for mid/back extrapolation.

## Standard Multiplex Reference

Reference room: about 45 ft wide x 20 ft tall.

| Seat | Distance | Eye Level | Rendering Note |
| --- | ---: | ---: | --- |
| Front | ~68 ft, 1.50W | Near screen bottom | Comfortable but not immersive. |
| Mid | ~90 ft, 2.00W | ~26% up screen | Conventional auditorium midpoint. |
| Back | ~112 ft, 2.50W | ~50% up screen | Projector booth often behind/above this zone. |
| Projector | ~112 ft, 2.50W | Booth behind/above last row | Defer projector visualization. |

Confidence: high for standard front row around 1.5W from SMPTE/cinema design guidance; medium for mid/back profile ratios.

## Implementation Rules

- Generated GT profile rows use 0.35W / 0.65W / 0.90W.
- Generated retrofit IMAX rows use 1.10W / 1.20W / 1.40W.
- Generated Dolby rows use 0.35W / 0.75W / 1.30W and recliner row spacing.
- Generated standard multiplex rows use 1.50W / 2.00W / 2.50W.
- GT `front_row_floor_elevation_ft` is floor height, not eye height. For generated venue data, derive the floor from the front-row eye target of about 33% up screen height minus eye height.
- Hybrid flat 1.43 venues with a 15/70 path use physical auditorium geometry for seating/deck profile generation. A CoLa day-to-day digital projector changes the presentation ceiling and verdict, but it should not force retrofit seating distances when the room has a full-height 1.43 screen and 15/70 film path.
- Do not hard-code generated front/mid/back row distances in docs-generation code. Add real venue-specific seating only to canonical venue records with explicit provenance; otherwise use the profile ratios above.
- Projector distances are recorded here as research context, but not yet part of the public docs model.
