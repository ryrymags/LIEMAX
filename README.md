# LIEMAX

A web app for visualizing and comparing movie screens, with an emphasis 
on premium cinema formats (IMAX, Dolby Cinema, etc.) and their 
relationship to home displays.

**Core question the site answers:** *"What will this actually look 
like from my seat?"*

## Status

Pre-development. Schema, sparse 143190 import mapping, math engine, Step 3 preset data, and a Step 4 static comparison workbench prototype are in place; canonical data bundling for the frontend is next.

- ✅ **Step 1:** Research & Data Schema (`schema/theater.schema.json`, v1.3.1)
- ✅ **Step 2:** Math Engine (`src/math/`, 133 tests passing)
- ✅ **Step 2.5:** 143190.xyz sparse IMAX import foundation (`src/data/`)
- ✅ **Step 3:** Presets, venues, home display tiers, and content formats
- ⏳ **Step 4:** Data bundle and website foundation (`docs/` prototype exists)
- ⏳ **Step 5:** Community features
- ⏳ **Step 6:** 3D simulation

For current project context and agent instructions, see [`.ai/AGENTS.md`](./.ai/AGENTS.md).
Legacy project journals live in [`research/legacy_context/`](./research/legacy_context/).

## Repo Structure

- `schema/` — JSON schema for theaters, home displays, content formats
- `src/data/` — sparse 143190.xyz import mapping and schema/import fixtures
- `src/math/` — pure-function math engine (PPD, FOV, masking, brightness)
- `research/` — research docs and findings backing the data model
- `.ai/` — portable GSD-Lite project context for Codex and Claude Code
- `research/legacy_context/` — archived project-memory journals

## Current Data Coverage

Step 3 includes 12 cinema format presets (`cinemark_xd` and `imax_dome_laser` included), 8 home display tier presets, and 7 content formats. Venue coverage now includes Apple Providence plus U.S. IMAX Dome rows imported from the 143190.xyz / r-imax CSV. Mugar Omni is modeled as current post-2021 IMAX Dome laser with no active 15/70 claim; its 23.20 m / 76.1 ft dome diameter comes from the 143190.xyz CSV at medium confidence.

## Running the math engine validation

```bash
npm ci
npm run typecheck
npm run validate
npm run validate:schema
npm run validate:compare
npm run validate:docs
```

The validation script tests every math function against known values 
from the research docs. All 133 tests should pass. The schema/import
validation keeps sparse 143190.xyz rows and Step 3 preset JSON honest before data scales.

## Tech stack

TypeScript for the math engine. Final web stack TBD — likely a static 
site on Netlify/Vercel.

## License

MIT as of now. License choice is under review because the project may want to prevent commercial reuse; do not assume the final public license has been settled.
