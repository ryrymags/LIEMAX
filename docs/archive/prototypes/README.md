# Prototype Archive

This folder preserves rough GUI/renderer experiments that informed the production
site but are not themselves production code. This is a rough prototype archive-only
area.

## `imax-3d-pov-simulator.prototype.html`

Original root file: `imax-3Dpov-simulator.html`, added 2026-06-18.

Purpose:
- Proved a Three.js first-person IMAX auditorium view could communicate real
  screen scale, row distance, screen curvature, and aspect-ratio crop.
- Demonstrated one- and two-theater POV panels, drag-to-look, fullscreen, HUD
  metrics, row-depth simplification, and a human-height reference at the screen.

Sanitization:
- The original embedded movie-frame JPEG/base64 texture was replaced with a
  generated neutral 1.43 reference-frame SVG data URI.
- The file remains intentionally self-contained for future comparison, but the
  production integration lives in `docs/pov.js` and binds to generated venue
  records instead of manual sliders.

Status:
- Archive only. Do not wire this file directly into the site.
- Dome POV is intentionally deferred; dome projection needs fisheye/hemisphere
  mapping rather than the flat/curved-screen model used here.
