# LIEMAX Overhaul — Architecture Map
*Generated from reference documents. Implementation reference, not a spec.*

## What Is Being Built

A static web app (no build step, GitHub Pages compatible) that explains what cinema screens look like from a real seat. The overhaul replaces the existing comparison-workbench UI with a full guided experience: Splash → Verdict → IMAX 101 → Full Diagnosis → Deep Dive.

## Tech Stack

- **HTML/CSS/JS** — served from `docs/`, deployed via GitHub Pages
- **React 18 via CDN** + **Babel standalone** — same pattern as existing site; no Node build required
- **No backend** — all data baked into `data.js`; stats computed client-side on load

## File Map

```
docs/
  index.html          ← Rebuilt: SPA shell, loads all scripts, 4-view routing
  styles.css          ← Rebuilt: full design system (dark bg, amber, typography)
  data.js             ← UNCHANGED: 40k-line theater database
  math.js             ← UNCHANGED: FOV / PPD / brightness math engine
  workbench.js        ← UNCHANGED: comparison row logic
  stage.js            ← UNCHANGED: human-vs-screen SVG scale renderer
  diagnosis.js        ← UNCHANGED: venue classification (classify, diagnose)
  db-stats.js         ← NEW: compute aggregate DB stats from data.js at startup
  regions.js          ← NEW: state → region → nearest True IMAX lookup table
  tooltips.js         ← NEW: tooltip definitions + first-use-only manager
  app.jsx             ← Rebuilt: full overhaul UI (all 4 pages / layers)
```

## Page / View Structure

The app manages 4 views via client-side state (no URL routing needed for MVP):

1. **Home** (`view = 'home'`) — The guided flow:
   - Splash (headline, 3-stat strip, search bar)
   - → Layer 1: Instant Verdict (badge, summary, scale diagram, What You're Missing, CTA)
   - → Transition A
   - → Layer 2: IMAX 101 (Blocks 1–6, tooltips, diagrams)
   - → Transition B
   - → Layer 3: Full Technical Diagnosis (spec strips, workbench)
   - → Layer 4: Deep Dive entry

2. **Compare** (`view = 'compare'`) — Standalone workbench, both slots empty

3. **IMAX 101** (`view = 'imax101'`) — Standalone 101 page + Deep Dive, sticky sub-nav

4. **Deep Dive** (`view = 'deepdive'`) — Anchored entry into the IMAX 101 page Deep Dive sections

## Verdict Tier Logic

Mapped from `diagnosis.js` classify() to overhaul tier labels:

| classify() output      | Overhaul badge    | Color  |
|------------------------|-------------------|--------|
| `true_143_laser`       | TRUE IMAX         | 🟢 Green |
| `true_143_film`        | TRUE IMAX         | 🟢 Green |
| `true_film_lie_dig`    | TRUE IMAX*        | 🟢 Green (caveat) |
| `true_dome`            | DOME              | ⚪ Gray |
| `imax_lite`            | IMAX LITE         | 🟡 Yellow |
| `liemax`               | LIEMAX            | 🔴 Red |
| `unknown`              | Unknown           | Gray |

Sub-states for 🟢:
- `true_143_laser` — "This is the real thing." (unconditional)
- `true_143_film` — "True IMAX — laser at every showtime, plus 15/70 film when booked."
- `true_film_lie_dig` — "True IMAX only for 15/70 film showings. Standard digital is IMAX Lite."

## DB Stats Tokens

All `{{db.*}}` tokens computed by `db-stats.js` at startup from `window.LIEMAX_DATA.venues`:

```js
window.LIEMAX_DB_STATS = {
  total_us_imax,           // all US venue rows
  gt_laser_count,          // classify() === true_143_laser || true_143_film
  film_conditional_count,  // classify() === true_film_lie_dig || true_143_film
  imax_lite_count,         // classify() === imax_lite
  liemax_count,            // classify() === liemax
  dome_count,              // classify() === true_dome
  not_full_143_digital_count, // total minus gt_laser_count minus dome_count
  not_full_143_digital_pct,   // derived %
  not_true_imax_count,     // imax_lite + liemax
  not_true_imax_pct,       // derived %
}
```

## Region Lookup

`regions.js` provides a static `STATE_TO_REGION` map and a `nearestTrueImax(stateCode)` function returning the nearest True IMAX venue ID(s) for that region. Fallback: AMC Lincoln Square, NYC. Does not use geolocation APIs — user state inferred from venue selection (theater's state field).

## Tooltip System

`tooltips.js` provides:
- `TOOLTIP_DEFS` — object keyed by term slug with `{ term, copy, learnMoreBlock? }`
- `TooltipManager` — first-use-only tracker; call `manager.seen(slug)` returns true on first call only
- `<Tooltip>` React component — dotted underline, hover/tap card

## Key Component Tree (app.jsx)

```
<App>
  <NavBar />
  {view === 'home' && <HomePage selectedVenue={...} />}
  {view === 'compare' && <ComparePage />}
  {view === 'imax101' && <Imax101Page />}
</HomePage>

<HomePage>
  <Splash onSearch={...} dbStats={...} />
  {selectedVenue && <>
    <Layer1Verdict venue={...} diagnosis={...} />
    <TransitionA />
    <Imax101Curriculum tooltipManager={...} dbStats={...} />
    <TransitionB theaterName={...} />
    <Layer3Diagnosis venue={...} diagnosis={...} />
    <DeepDiveEntry />
  </>}
</HomePage>
```

## SVG Diagrams

All built inline in JSX (no external assets):

1. `ScaleComparisonDiagram` — human + LIEMAX screen + True IMAX screen, drawn to scale
2. `AspectRatioDiagram` — three frames (1.43, 1.90, 2.39) at equal width with human figure inside each
3. `MovieTypeGapDiagram` — two diverging lines (LIEMAX vs True IMAX) on DMR→FilmedForIMAX→ShotOnFilm axis
4. `FormatLadderDiagram` — 4-row vertical stack with tier badge, label, hardware callout, descriptor, count

## Accuracy Commitments

Per Bible §9:
- IMAX brightness target: 22 fL
- CoLa sequential contrast: 10,000:1
- GT Dual Laser contrast: 8,000:1+
- Dual xenon contrast: 2,500:1
- DCI baseline: 14 fL / 2,000–2,600:1
- Dolby Cinema: 31 fL / 5,000–7,500:1 sequential ("1,000,000:1" = dynamic only, always caveated)
- 15/70 resolution: 8.8K–11.7K horizontal (never "16K" or "18K")
- Dolby Cinema post-May 2025: Christie Eclipse single-projector — flag in Layer 3 spec strips

## Infinity Vision

Excluded from format ladder, workbench, and all copy. Per Bible §12: no verifiable venue list as of April 2026.

## Open Flags (see OPEN_FLAGS.md)

- Dolby Cinema 2025 single-laser fL spec unconfirmed
- RPX laser vs xenon per-venue split not in current data.js
- GT3D 15/70 venue list unknown — flag any GT3D venues as institututional
- Chevron anchors for format ladder rows (Block 6) TBD until Layer 3 IDs confirmed
