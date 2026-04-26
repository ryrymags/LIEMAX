# Requirements

## Hard Constraints

- Do not refactor or rewrite the math engine unless Ryan explicitly asks for it.
- The math engine in `src/math/` is complete, audited, and validated with 129 passing tests.
- `npm run validate` is the validation command for the math engine.
- Keep math functions pure and testable. No UI behavior belongs in `src/math/`.
- Be transparent about contentious methodology, especially 15/70 film scan equivalence and GT laser pixel-offset supersampling.
- The Agent must never infer 1.43:1 capability unless the theater schema explicitly confirms a 1.43:1 screen AND a 1.43:1-capable projector (GT Laser or 15/70mm). If unclear, default to 1.90:1.
- Schema changes must respect `schema/theater.schema.json`, currently version `1.3.0`. Additive changes (new enum values, new nullable fields) bump minor version; breaking changes bump major. Update `src/data/validate.ts` version check whenever the schema const changes.
- Treat `schema/theater.schema.json` as the source of truth for data shape, inheritance behavior, and naming.
- Resolver behavior must be field-level merge, not object-level merge. Venue fields override preset defaults only when non-null.
- Theater data should preserve source, timestamp, and confidence/provenance where the schema supports it.
- 143190.xyz / r-imax CSV rows are the primary venue baseline. Imported rows only provide region, country/area, province/state, city, location name, screen aspect ratio, digital projector, max digital AR, film projector, screen height, screen width, and commercial films.
- Never treat missing imported fields as known facts. Use presets, derived math, or explicit research enrichment for seating, brightness, contrast, sound, exact projector specs, and experiential metrics.
- Free hosting constraint remains in force: no paid domains, ads, or personal server resources.

## Immutable Area

`src/math/` is locked for this phase:

- `constants.ts`
- `geometry.ts`
- `fov.ts`
- `ppd.ts`
- `masking.ts`
- `brightness.ts`
- `seating.ts`
- `resolver.ts`
- `types.ts`
- `index.ts`
- `validate.ts`

Project Memory Milestone:

> Math Engine Validated - No refactors permitted without explicit instruction.

## Data Model Reference

Use `schema/theater.schema.json` for:

- `FormatPreset`
- `VenueRecord`
- `HomeDisplayPreset`
- `HomeDisplayRecord`
- `ContentFormat`
- projection, screen, sound, seating, capabilities, and metadata fields
- source-quality enums and projector-type enums
