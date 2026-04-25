# Research Folder Guide

These files are working research, not runtime data. Use them to understand LIEMAX's product logic, choose presets, and explain methodology, then convert only selected facts into schema-shaped records with provenance.

## Live Research Files

- `Master Research.md`: broad premium-cinema reference covering IMAX tiers, Dolby Cinema, PLFs, business context, New England venue notes, misconceptions, and open questions.
- `IMAX Dome Research.md`: dome-specific geometry, optical offset, rolling-loop transport, hemisphere coverage, digital dome caveats, and presentation constraints.
- `Home Theater Research.md`: home display presets, brightness/contrast/color/HDR baselines, viewing-distance assumptions, and schema guidance for home comparisons.

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
