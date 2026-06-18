# LIEMAX Overhaul V2 Open Flags

## Deferred By Scope
- Deep Dive content is intentionally deferred. The nav may expose a safe placeholder or anchor, but full Deep Dive sections are not implemented in this pass.

## Data / Research Flags
- Dolby Cinema post-May-2025 single-laser foot-lambert specs remain medium-confidence until Dolby publishes official per-venue values.
- RPX is not uniformly laser; the workbench must not imply all RPX rooms use laser projection.
- Infinity Vision is excluded from ladder and workbench until Disney publishes a verifiable venue list.
- GT3D 15/70 technical specs and post-2020 operational status remain incomplete.
- IMAX SR should be excluded or flagged as institutional if encountered in standard verdict/workbench UI.
- Full 15/70-capable venue tagging beyond known examples needs continued audit for regional lookup confidence.

## UX / Logic Flags
- 15/70-capable venues require schedule-aware copy. Without showtime data, default digital verdict remains IMAX Lite where the digital projector is CoLa/XT.
- Region lookup uses static state/region mapping, not routing or exact drive distance.
- Dome comparisons require dome-specific language rather than flat-screen winner logic.

## Existing Worktree Flags
- `.claude/launch.json` contains pre-existing unrelated edits.
- `docs/stage.js` contains pre-existing visual edits. Preserve them unless the V2 implementation needs an additive adjustment.
