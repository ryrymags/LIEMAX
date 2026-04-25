# Roadmap

## Current Summary Pane

- GREEN `.ai/`: Context compressed; truth discipline now forbids inferred 1.43:1 capability and documents 143190 as the primary venue baseline.
- GREEN `src/math/`: Resolver supports schema-backed hybrid projection modes, source-aware 1.43 defaults, audit regression hardening, and 129 passing validation tests.
- GREEN `schema/`: v1.2.0 source of truth supports sparse 143190 imports, projection-mode arrays, lightweight provenance, presets, venues, home displays, Atmos, and simple ScreenX flags. Multi-wall ScreenX geometry and structured renovation status remain additive future work.
- GREEN `src/data/`: 143190 import mapper and fixtures preserve sparse imported facts while letting presets/research enrich missing values.
- GREEN `research/`: Rich source material with useful caveats for 15/70, GT laser supersampling, Dome, Providence, ScreenX, and Atmos. Keep it as evidence, not agent startup context.
- YELLOW `research/legacy_context/`: Correctly archived, but Providence/Mugar facts should be promoted into schema-shaped records during Step 3 so agents do not mine old journals repeatedly.
- GREEN repo root/docs: README and `CLAUDE.md` are good entry points. Completed Step 1/2 details archived in `docs/archive/HISTORY.md`.

Top headache risks:

1. Import drift: 143190 rows are sparse; do not invent seating, brightness, contrast, sound, or exact projector specs from missing fields.
2. Aspect-ratio drift: agents must require both 1.43 screen and a 1.43-capable projector/mode, else default digital capability to 1.90.
3. Future PLF modeling: ScreenX, ACX renovation status, and per-field provenance can be represented loosely today, but richer UI will want additive schema fields before data scales.

## Step 3: Presets

Define default specs for common theater and display types:

- Standard IMAX Digital
- IMAX single laser / CoLa
- IMAX GT Dual Laser
- IMAX 15/70 film
- IMAX Dome / OMNIMAX
- Dolby Cinema
- Generic RPX
- Standard multiplex
- ScreenX
- Home display tiers as supported by the schema

This step is where research becomes product data. 143190 rows should remain sparse baseline facts; presets should be schema-shaped, source-aware, and designed to fill gaps in imported venue records.

First 3 atomic tasks for regional preset/data work:

1. Create shared IMAX presets needed by imported rows: CoLa, dual xenon/digital, GT dual laser, 15/70 film, and dome.
2. Create a Providence Place IMAX venue draft as a sparse 143190 import plus explicit digital/film projection modes and local status notes.
3. Create a Mugar Omni Theater / IMAX Dome venue draft with dome geometry/FOV fields and source-quality notes, keeping unsupported details in metadata.

## Step 4: Website

Build the static client app after presets exist. The website should:

- compare theaters, formats, and home displays
- visualize aspect-ratio masking and crop/letterbox/pillarbox outcomes
- show PPD, FOV, brightness, screen area, contrast, and resolution in user-facing language
- support custom user-entered specs
- remain deployable on free static hosting such as Netlify or Vercel

Tech stack remains TBD.

## Step 6: 3D Simulation

Use Three.js for the advanced simulation phase:

- start with one generic IMAX layout
- support front, middle, back, and optimal seats
- render flat screens, dome screens, and future premium formats separately
- show aspect-ratio changes on the virtual screen
- include human-scale reference near the screen base

Do not begin this phase before presets and the website foundation are in place.
