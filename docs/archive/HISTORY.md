# LIEMAX History

## Completed Steps

### Step 1: Research & Data Schema

- Completed research/data-schema foundation.
- Source of truth: `schema/theater.schema.json`.
- Schema version at archive time: `1.1.1`.
- Defines theater presets, venue records, home display presets/records, content formats, projection/screen/sound/seating/capability/metadata fields, source-quality enums, and inheritance behavior.

### Step 2: Math Engine

- Completed pure TypeScript engine in `src/math/`.
- Validation suite: `src/math/validate.ts`.
- Coverage at archive time: 96 assertions across geometry, FOV, PPD, masking, brightness, seating, resolver, and composition functions.
- Project memory: math methodology is locked unless Ryan explicitly requests changes; run `npm run validate` after any math edit.
