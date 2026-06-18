# LIEMAX Overhaul V2 TODO

## Current Chunk
- [x] Create `codex/overhaul-v2` branch.
- [x] Record pre-existing dirty worktree state.
- [x] Create planning artifacts.
- [x] Add generated database tokens for V2.
- [x] Rebuild `docs/` frontend around V2 guided flow.
- [ ] Polish and validate.
- [ ] Human visual review after widening the desktop/landscape layout.

## Chunk 1 — Read + Map
- [x] Read `.ai/STATE.md`, `.ai/AGENTS.md`, `.ai/REQUIREMENTS.md`.
- [x] Read the Overhaul Bible and Layer Transitions.
- [x] Read Blocks 1-3 and Blocks 4-6 V2 source copy.
- [x] Read research references for projector, dome, Dolby, RPX, and Infinity caveats.
- [x] Create `ARCHITECTURE.md`.
- [x] Create `OPEN FLAGS.md`.

## Chunk 2 — Scaffold + Navigation
- [x] Rebuild `docs/app.jsx` around Home, Compare, IMAX 101, and deferred Deep Dive nav.
- [x] Replace prototype shell with V2 layout foundations.
- [x] Keep static CDN React/Babel loading model.

## Chunk 3 — Data / Logic Adapter
- [x] Preserve `src/math/`, `docs/workbench.js`, generated `window.LIEMAX_DATA`.
- [x] Add `db.not_true_imax_count`.
- [x] Add `db.not_true_imax_pct`.
- [x] Add four-tier verdict adapter with TRUE IMAX sub-states.
- [x] Add static nearest True IMAX region lookup.

## Chunk 4 — Splash + Layer 1
- [x] Build Splash with live stat strip, purpose line, and search.
- [x] Build zero-jargon Instant Verdict.
- [x] Add human-vs-screen and dome scale diagrams.
- [x] Add "What You're Missing" callout.
- [x] Add weighted no-results fallback.
- [x] Widen desktop/landscape layout after visual review found the first pass too compressed.

## Chunk 5 — IMAX 101
- [x] Implement Blocks 1-6 exact copy.
- [x] Add first-use-only tooltip system.
- [x] Build Block 2 scale diagram.
- [x] Build Block 2 aspect-ratio diagram with required human figure.
- [x] Build Block 4 movie-gap diagram.
- [x] Build Block 6 format ladder and stat strip.
- [x] Place Transition A and Transition B exactly.

## Chunk 6 — Layer 3 + Compare
- [x] Build technical diagnosis card.
- [x] Build spec strips.
- [x] Build confidence/caveat accordion.
- [x] Build embedded workbench.
- [x] Build standalone Compare page with empty slots and example loader.
- [x] Add dome-specific comparison behavior.
- [x] Add Dolby 2025 and RPX caveats.

## Chunk 7 — Polish + Validation
- [x] Update project context files.
- [ ] Verify responsive layout and accessibility.
- [x] Verify dynamic tokens.
- [x] Verify tooltip first-use schedule.
- [x] Verify no-results fallback weights.
- [x] Verify Providence 15/70 conditional copy.
- [x] Run `npm run validate:schema`.
- [x] Run `npm run validate:docs`.
- [x] Run `npm run ci`.
- [x] Run `git diff --check`.

## OPEN FLAGS
- See `OPEN FLAGS.md`.

## Pre-existing Dirty Worktree Notes
- `.ai/AGENTS.md`, `.ai/STATE.md`, `research/README.md`, and `.ai/OVERHAUL_BIBLE.md` already contained Overhaul V2 context updates before this pass.
- `.claude/launch.json` was already modified and is unrelated to the V2 implementation.
- `docs/stage.js` already contained visual/label tweaks before this pass; work with it rather than reverting it.
