# Splash Checkpoint Redesign Plan

Status: implementation target approved by owner message dated 2026-07-17.
Scope: splash/first-screen only; preserve the existing diagnosis engine and all later milestones.

## Outcome

Turn the splash into a cinematic, scroll-guided proof of IMAX frame height:

1. Open on a high-fidelity slice of the eyes, constrained by solid black bars.
2. Hold the opening long enough to read the premise and offer two paths:
   experience the frame or jump directly to theater diagnosis.
3. Smoothly zoom out and move the bars through Scope 2.39:1, digital IMAX
   1.90:1, and full-height IMAX 1.43:1.
4. Give every ratio a stable checkpoint with concise explanation, exact
   same-width image-area comparisons, and an explicit next-checkpoint button.
5. End on the full 1.43 frame and a final labeled border comparison before the
   existing theater search.

## Source and Aspect Geometry

- Regenerate the eye derivative directly from the original TIFF:
  `/Users/rymag/Downloads/IMAX FILM SCANS/Oppenheimer - 8K 70mm Stills/OPPENHEIMER_v02.tif`.
- Source is 10803×7951. The established clean frame is a centered crop at
  `x=0, y=198, width=10803, height=7555`.
- `10803 / 7555 = 1.429913964…`, the closest integer-pixel crop to canonical
  1.43 (`10803 / 1.43 = 7554.545…`). Do not shave a row merely to claim an
  exact decimal; render the presentation box at canonical 1.43 and allow the
  sub-pixel object-fit difference.
- Compute all bars from canonical data values: 2.39, 1.90, 1.43.
- Same-width image-area gains shown in copy:
  - 1.90 versus 2.39: `2.39 / 1.90 - 1 = 25.8%` more image area.
  - 1.43 versus 1.90: `1.90 / 1.43 - 1 = 32.9%` more image area.
  - 1.43 versus 2.39: `2.39 / 1.43 - 1 = 67.1%` more image area.

## Scroll Timeline

Use a 900svh track. Progress remains normalized 0–1. Stable plateaus are
deliberately longer than transitions; this slows the story without wheel
capture, scroll locking, or inaccessible forced delays.

| Phase | Range | Jump anchor | Visual state |
|---|---:|---:|---|
| Opening eye hold | 0.00–0.12 | 0.04 | tight eye crop; narrow black aperture; intro copy |
| Eye → Scope | 0.12–0.24 | — | zoom and bars interpolate with smootherstep |
| Scope hold | 0.24–0.38 | 0.27 | exact 2.39 aperture; Scope copy + next button |
| Scope → 1.90 | 0.38–0.50 | — | zoom settles; bars open with smootherstep |
| 1.90 hold | 0.50–0.64 | 0.53 | exact 1.90 aperture; +25.8% copy + next button |
| 1.90 → 1.43 | 0.64–0.76 | — | bars fully open with smootherstep |
| 1.43 hold | 0.76–0.90 | 0.79 | full canonical 1.43; +32.9%/+67.1% copy |
| Comparison hold | 0.90–1.00 | 0.93 | all three labeled reference borders; diagnosis CTA |

`smootherstep(t) = t³(t(6t−15)+10)` provides zero first and second derivatives
at both ends (the requested bell-curve-feeling transition without a dependency).

## Interaction

- Opening controls: “Show me the full frame” jumps to Scope; “Diagnose my
  IMAX” jumps past the intro to the existing search.
- Each checkpoint has a 44px-minimum button to the next checkpoint.
- Persistent header gains a “Diagnose my IMAX” link to the search anchor.
- Programmatic jumps use smooth behavior unless reduced motion is requested.
- Manual scrolling is always available. No wheel interception or timed lock.
- `prefers-reduced-motion` renders the full 1.43 comparison statically with a
  direct diagnosis CTA and all information available as text.

## Accessibility and Responsive Rules

- Copy is real HTML, not baked into canvas/SVG; checkpoint changes announce
  through a polite status region only when initiated by a button, avoiding
  noisy announcements during manual scrolling.
- Buttons remain keyboard reachable with visible focus and 44×44px targets.
- The stage uses the exact same contain-fit calculation on desktop and mobile.
- Opening aperture is clamped to remain dramatic but readable on short/mobile
  viewports; Scope/1.90 bars use exact math.
- Text panels avoid covering the eyes and move to a bottom sheet treatment on
  narrow screens.

## Verification and Checkpoints

1. Asset checkpoint: inspect dimensions/size and compare the new eye crop at
   1:1 against the existing Q62 derivative.
2. State-machine checkpoint: unit-test timeline mapping, exact bar heights,
   anchors, and area-gain constants.
3. UI checkpoint: desktop and 375px mobile screenshots at every hold.
4. Interaction checkpoint: header CTA, opening CTA, every next button, skip,
   keyboard focus, reduced motion, and direct search anchoring.
5. Final checkpoint: zero console/network errors, `npm run ci`, diff review,
   update `.ai/STATE.md`, commit, and push `dev`.
