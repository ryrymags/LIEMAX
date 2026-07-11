# Research Folder Guide

These files are working research, not runtime data. Use them to understand LIEMAX's product logic, choose presets, and explain methodology, then convert only selected facts into schema-shaped records with provenance.

## Live Research Files

- `Master Research.md`: broad premium-cinema reference covering IMAX tiers, Dolby Cinema, PLFs, business context, some initial New England venue notes from when this project was earlier on, misconceptions, and open questions.
- `IMAX Dome Research.md`: dome-specific geometry, optical offset, rolling-loop transport, hemisphere coverage, digital dome caveats, and presentation constraints.
- `Home Theater Research.md`: home display presets, brightness/contrast/color/HDR baselines, viewing-distance assumptions, and schema guidance for home comparisons.
- `Projector-Types-Deep-Dive.md`: per-projector-type technical profiles (CoLa, GT Dual Laser, Xenon, 15/70, Dome Film/Laser, Laser XT, Legacy Dome) sourced from 143190 and LFExaminer; maps each type to verdict tier, aspect-ratio ceiling, and known research gaps. Compiled May 2026.
- `Fixing Research Gaps part 2.md`: confidence-rated resolution of projection spec gaps for `imax_cola`, `imax_dual_xenon`, `imax_gt_dual_laser`, `dolby_cinema`, and `cinemark_xd` presets. Covers contrast, brightness, resolution, and 3D figures. Each finding is rated HIGH / MEDIUM / LOW with primary-source citations. v2 corrects CoLa screen threshold wording, Cinemark XD aspect ratio (1.90:1), and Dolby 2025 single-laser brightness estimate.
- `IMAX Dome  Projector Differences & Aspect Ratio Capabilities.md`: dome-specific comparison of GT/SR film dome projectors vs. single-4K dome laser, covering the 1.43:1-always aspect ratio, resolution/pixel-density tradeoffs, and content-availability caveats.
- `Theater Geometry Reference for 3D Renderer.md`: sourced auditorium geometry (screen size/position, pit depth, curvature, seating rake, row spacing, projector throw) for GT, retrofit IMAX, Dolby Cinema, and standard multiplex, for use by the 3D renderer.
- `Seating Distance Audit for 3D Renderer.md`: follow-up audit refining front/mid/back seating-distance ratios (as a fraction of screen width) per venue profile; supersedes the older Dolby/standard-multiplex depth fallbacks in the geometry reference.

## How Agents Should Use This Research

- Treat these docs as evidence and context, not as canonical app data.
- Prefer `schema/theater.schema.json` for data shape and `.ai/REQUIREMENTS.md` for current implementation constraints.
- Promote useful facts into presets or venue records only when they are small, source-aware, and compatible with the schema.
- Preserve uncertainty: use source quality, timestamps, confidence, notes, and metadata instead of silently upgrading estimates into facts.
- Re-check fast-aging facts before publishing user-facing copy, especially counts, venue status, showtime-specific 15/70 availability, and newly announced formats.

## Known Caveats

- Some citations are source labels or footnote markers from the research process, not complete bibliography entries.
- Some figures are estimates, community reports, trade reporting, or illustrative methodology rather than official specs.
- Local venue notes are especially time-sensitive and should be refreshed before becoming public product data.
