# Agent Briefing

Cold-start order: read `.ai/STATE.md`, then this file, then `.ai/REQUIREMENTS.md`.

## Mission

LIEMAX = static web app for explaining what cinema/home screens look like from a real seat. IMAX emphasis, format-agnostic math. Core variables: screen size/AR, content AR, brightness, resolution, PPD, FOV, seating geometry, contrast, masking.

## State

- Branch: `codex/overhaul`.
- Done: Step 1 schema/research; Step 2 math engine with audit regression hardening; sparse 143190 import foundation.
- Active: Step 3 presets/data, starting shared IMAX presets, Providence Place IMAX, Mugar Omni.

## Rules

- `src/math/` methodology is scrutinized; refactor/change only when explicitly requested.
- Run `npm run validate` after math changes.
- `schema/theater.schema.json` is data-shape source of truth.
- Inheritance is field-level: record non-null overrides preset; null falls through.
- 143190.xyz / r-imax CSV rows are the primary venue baseline and are sparse by design.
- Data must be schema-shaped, source-aware, small, atomic, provenance-clear.
- No backend unless scoped; preserve free static hosting.
- Frontend first screen = usable comparison experience, not marketing.
- Future 3D = Three.js; verify render.

## Naming

- Schema/data: `snake_case`.
- TS functions/locals: `camelCase`.
- Format IDs: `imax_cola`, `imax_gt_dual_laser`, `imax_1570_film`, `imax_dome_film`, `dolby_cinema`.
- Source quality enum: `published_official`, `published_cto`, `trade_reporting`, `community_estimate`, `derived`, `user_submitted`, `unknown`.

## Map

- `.ai/PROJECT.md`: vision/stack/data strategy.
- `.ai/REQUIREMENTS.md`: hard constraints.
- `.ai/ROADMAP.md`: active Summary Pane + next tasks.
- `.ai/STATE.md`: branch/status snapshot.
- `CLAUDE.md`: Claude pointer.
- `README.md`: public overview.
- `schema/theater.schema.json`: canonical model.
- `src/math/`: pure math engine; `validate.ts` = validation suite.
- `src/data/`: 143190 import mapper and schema/import validation fixtures.
- `research/`: evidence; `research/legacy_context/`: archived journals.
