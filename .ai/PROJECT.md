# LIEMAX Project

## Product

Question: "What will this actually look like from my seat?"

LIEMAX translates theater/display specs into experiential comparisons. It is an interpretation/visualization layer, not a replacement database.

The site exists to reduce "LieMAX" confusion and help moviegoers understand the real capabilities of local theaters. A user should be able to compare an IMAX venue, Dolby Cinema, RPX, standard multiplex, ScreenX, dome theater, or home display and understand the tradeoffs in perceived scale, sharpness, brightness, aspect-ratio handling, and immersion.

The product should stay useful even when perfect data is unavailable. Users can start from known theaters imported from 143190.xyz, choose researched presets when they only know a format label, or enter custom screen/projector/seating details for any theater or home setup.

## Positioning

- Experience-first; specs serve perception.
- Format-agnostic: IMAX, Dolby Cinema, RPX, ScreenX, multiplex, home.
- Formats are attribute bundles. Compare screen size/AR, content AR, brightness, resolution, seating, FOV, PPD, contrast, masking.
- Dome/OMNIMAX = separate geometry: immersion over pixel density.
- Future simulation: virtual seat, human scale, live AR/format changes.
- Community-aware: show provenance, timestamps, confidence, and local status notes so corrections can be suggested without silently turning uncertain claims into facts.

## User Outcomes

- Pick a known theater and see what a movie will feel like from front/middle/back/optimal seats.
- Compare two venues or displays and see where each wins: size, FOV, PPD, brightness, contrast, masking, and aspect-ratio fit.
- Switch between content aspect ratios such as 1.43, 1.90, and 2.39 and see the visible image area and stats update.
- Enter custom specs for non-IMAX or missing venues without needing to become a database maintainer.
- Understand contentious methodology through transparent assumptions and source notes, especially for 15/70 film, GT laser pixel-offset supersampling, and dome scan-equivalent claims.
- Eventually inspect simplified first-person 3D theater views with correct scale, seating position, and screen geometry.

## Stack

- Math: TypeScript pure functions in `src/math/`.
- Data: JSON Schema draft-07; canonical file `schema/theater.schema.json`.
- Web: TBD static client, free hosting target (Netlify/Vercel).
- 3D: Three.js in Step 6.

## Data Strategy

- Primary source: Anthony Lavado `143190.xyz` / `r-imax/imaxguide` CSV.
- LFExaminer: manual/reference only.
- Presets hold research defaults missing from CSV-like records.
- Venue/home records override presets field-by-field when non-null.
- Community updates should begin as suggested edits with source notes, timestamps, and review/verification status. Avoid an open wiki model until moderation and trust signals exist.
