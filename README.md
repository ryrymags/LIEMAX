# LIEMAX

A web app for visualizing and comparing movie screens, with an emphasis 
on premium cinema formats (IMAX, Dolby Cinema, etc.) and their 
relationship to home displays.

**Core question the site answers:** *"What will this actually look 
like from my seat?"*

## Status

Pre-development. Schema and math engine complete; preset population next.

- ✅ **Step 1:** Research & Data Schema (`schema/theater.schema.json`)
- ✅ **Step 2:** Math Engine (`src/math/`, 96 tests passing)
- ⏳ **Step 3:** Presets — populating real data into format presets
- ⏳ **Step 4:** Website
- ⏳ **Step 5:** Community features
- ⏳ **Step 6:** 3D simulation

For full project history, decisions, and session-by-session notes, 
see [`LIEMAX_PROJECT_CONTEXT.md`](./LIEMAX_PROJECT_CONTEXT.md).

## Repo Structure

- `schema/` — JSON schema for theaters, home displays, content formats
- `src/math/` — pure-function math engine (PPD, FOV, masking, brightness)
- `research/` — research docs and findings backing the data model
- `LIEMAX_PROJECT_CONTEXT.md` — living project memory (decisions, sessions, status)

## Running the math engine validation

```bash
npm install
npm run validate
```

The validation script tests every math function against known values 
from the research docs. All 96 tests should pass.

## Tech stack

TypeScript for the math engine. Final web stack TBD — likely a static 
site on Netlify/Vercel.

## License

TBD, MIT as of now