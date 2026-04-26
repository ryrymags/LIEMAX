# LIEMAX

A web app for visualizing and comparing movie screens, with an emphasis 
on premium cinema formats (IMAX, Dolby Cinema, etc.) and their 
relationship to home displays.

**Core question the site answers:** *"What will this actually look 
like from my seat?"*

## Status

Pre-development. Schema, sparse 143190 import mapping, math engine, and Step 3 preset data are complete; data bundling for the frontend is next.

- ✅ **Step 1:** Research & Data Schema (`schema/theater.schema.json`, v1.3.0)
- ✅ **Step 2:** Math Engine (`src/math/`, 133 tests passing)
- ✅ **Step 2.5:** 143190.xyz sparse IMAX import foundation (`src/data/`)
- ✅ **Step 3:** Presets, venues, home display tiers, and content formats
- ⏳ **Step 4:** Data bundle and website foundation
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

Step 3 includes 11 cinema format presets (`imax_dome_laser` included), 8 home display tier presets, 7 content formats, and 2 venue records. Mugar Omni is modeled as current post-2021 IMAX Dome laser with no active 15/70 claim; its 76 ft dome diameter is a low-confidence estimate.

## Running the math engine validation

```bash
npm ci
npm run typecheck
npm run validate
npm run validate:schema
```

The validation script tests every math function against known values 
from the research docs. All 133 tests should pass. The schema/import
validation keeps sparse 143190.xyz rows and Step 3 preset JSON honest before data scales.

## Tech stack

TypeScript for the math engine. Final web stack TBD — likely a static 
site on Netlify/Vercel.

## License

TBD, MIT as of now
