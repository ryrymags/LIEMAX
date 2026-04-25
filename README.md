# LIEMAX

A web app for visualizing and comparing movie screens, with an emphasis 
on premium cinema formats (IMAX, Dolby Cinema, etc.) and their 
relationship to home displays.

**Core question the site answers:** *"What will this actually look 
like from my seat?"*

## Status

Pre-development. Schema, sparse 143190 import mapping, and math engine complete; preset population next.

- ✅ **Step 1:** Research & Data Schema (`schema/theater.schema.json`, v1.2.0)
- ✅ **Step 2:** Math Engine (`src/math/`, 120 tests passing)
- ✅ **Step 2.5:** 143190.xyz sparse IMAX import foundation (`src/data/`)
- ⏳ **Step 3:** Presets — populating real data into format presets
- ⏳ **Step 4:** Website
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

## Running the math engine validation

```bash
npm ci
npm run typecheck
npm run validate
npm run validate:schema
```

The validation script tests every math function against known values 
from the research docs. All 120 tests should pass. The schema/import
validation keeps sparse 143190.xyz rows honest before preset data scales.

## Tech stack

TypeScript for the math engine. Final web stack TBD — likely a static 
site on Netlify/Vercel.

## License

TBD, MIT as of now
