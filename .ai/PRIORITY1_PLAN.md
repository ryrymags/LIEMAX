# Priority 1 Plan — Core Step 4 Product Work

Status: pending user approval before implementation.

## Fresh-Chat Context

Read order for a new Codex chat:
1. `.ai/STATE.md`
2. `.ai/AGENTS.md`
3. `.ai/REQUIREMENTS.md`
4. `.ai/ROADMAP.md`
5. This file

Current repo state after Priority 0:
- Step 4 diagnosis-first homepage exists in `docs/`.
- Priority 0 imported U.S. IMAX Dome rows from `r-imax/imaxguide` into canonical `src/data/venues/` and mirrored them into `docs/data.js`.
- `docs/diagnosis.js` now requires explicit dome-capable projection/mode evidence before `true_dome`.
- Homepage search no longer opens its dropdown on initial autofocus.
- Visible site copy includes “This project is not affiliated with IMAX Corporation.”
- README says MIT is current but license choice is under review.
- Full CI passed after Priority 0.

Hard constraints:
- Do not refactor `src/math/` unless explicitly asked. The math engine is audited and validated.
- 143190 / r-imax CSV rows are sparse. Do not invent seating, brightness, contrast, sound, or exact projector specs from missing fields.
- Never infer 1.43 capability from screen shape alone. Require a 1.43 screen/dome plus a 1.43-capable projector/mode.
- Keep the site static/free-hosting friendly. No backend for Priority 1.
- Functional/data correctness comes before design polish.

## Goal

Make the current Step 4 website explain results better and reduce prototype drift, while stopping short of a full frontend rebuild. The user should be able to search a venue, understand the diagnosis, understand the jargon, and trust that caveats/provenance are visible.

## Implementation Chunks

1. **Plain-Language Diagnosis Upgrade**
   - Add short in-context explanations for GT Dual Laser, CoLa, Xenon, 15/70, 1.43, 1.90, PPD, FOV, dome, and source confidence.
   - Prefer compact tooltips/expandable details around existing diagnosis/spec rows instead of a large explainer page.
   - Make dome copy clear: dome is real IMAX, but it is not a flat 1.43 rectangle; dome-mastered content matters.

2. **Recommendation UX**
   - Replace New England-heavy “Try:” chips with a privacy-friendly set.
   - Default behavior: curated randomized examples from multiple regions/categories on each page load.
   - Do not use silent IP geolocation.
   - Optional user-controlled path: add a simple state selector/search prompt only if it stays lightweight.

3. **State/National Summary Stats**
   - Add launch-safe aggregate stats using the current `docs/data.js` bundle:
     number of U.S. IMAX rows represented, number/percent LIEMAX, true 1.43 digital, 15/70-capable, and dome.
   - If adding state stats, base them on explicit user-selected state/search result context rather than IP.
   - Clearly caveat that older Xenon-only IMAX venues remain missing.

4. **Seat Geometry Stats**
   - For flat venues, surface front/mid/back horizontal and vertical FOV plus seating-depth multiple where data supports it.
   - Keep assumptions visible: derived distances vs venue-specific/community estimates.
   - For domes, show fixed dome FOV and avoid pretending front/mid/back flat-screen distance drives immersion.

5. **Aspect-Ratio Penalty Metrics**
   - Add a user-facing “vertical frame lost” / “visible image retained” metric for 1.43 content on 1.90 systems.
   - Reuse existing masking/utilization math in `docs/math.js`; do not change `src/math/`.
   - Explain CoLa vs GT in plain language: 1.90 digital caps crop roughly a quarter of a 1.43 frame.

6. **Prototype Drift Guardrails**
   - Add `docs/validate-workbench.js` checks for the new explanatory strings/stats and key regression cases.
   - Do not attempt the full Priority 1 data unification yet unless the user explicitly expands scope; that is a larger implementation phase.

## Files Likely Touched

- `docs/app.jsx`: diagnosis UI, recommendation chips, stats blocks, FOV/AR explanatory copy.
- `docs/data.js`: only if lightweight aggregate helpers or recommendation metadata are easiest there.
- `docs/validate-workbench.js`: regression coverage for new behavior.
- `.ai/STATE.md`: mark Priority 1 progress and caveats.
- `.ai/ROADMAP.md`: update Priority 1 status after completion.

Avoid touching:
- `src/math/` unless explicitly approved.
- The actual `LICENSE` file until a final replacement license is chosen.
- Design-system-level CSS polish beyond what the new UI affordances require.

## Test Plan

- `npm run validate:docs`
- `npm run ci`
- `git diff --check`
- Manual browser check at `http://127.0.0.1:5173/`:
  - search dropdown remains closed on load;
  - randomized/curated recommendations are not region-biased;
  - diagnosis explanations are readable and not overwhelming;
  - dome venue diagnosis still reads as a special geometry case;
  - LIEMAX/CoLa 1.43 crop explanation is obvious.

## Acceptance Criteria

- A non-technical user can understand why a venue was called true IMAX, LIEMAX, hybrid, dome, or unknown without leaving the page.
- The homepage examples no longer feel like New England defaults.
- No silent location/IP-based personalization is introduced.
- New stats and FOV/AR explanations are caveated and source-aware.
- CI remains green.
