# LIEMAX Project

## Product

Question: "What will this actually look like from my seat?"

LIEMAX translates theater/display specs into experiential comparisons. It is an interpretation/visualization layer, not a replacement database.

## Positioning

- Experience-first; specs serve perception.
- Format-agnostic: IMAX, Dolby Cinema, RPX, ScreenX, multiplex, home.
- Formats are attribute bundles. Compare screen size/AR, content AR, brightness, resolution, seating, FOV, PPD, contrast, masking.
- Dome/OMNIMAX = separate geometry: immersion over pixel density.
- Future simulation: virtual seat, human scale, live AR/format changes.

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
