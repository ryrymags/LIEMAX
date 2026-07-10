# POV Reference Assets

This folder holds local reference imagery for the Three.js POV prototype.

- 2026-07-10: all previously referenced demo media (`spiderverse-143-reference.webp`,
  `video/imax-demo-*.mp4`, `video/imax-demo-poster.jpg`) was removed because
  licensing was not cleared for public redistribution. The POV renderer falls
  back to its generated neutral reference-frame canvas when media is absent.
- Planned replacement: a custom, original 1.43:1 placeholder image (and later
  video) produced for this project, used by both the 2D stage and 3D POV
  renders. Only commit media whose provenance/licensing is documented here.
- Keep reference media as standalone files, not base64 strings embedded in code.
- Expected future paths (consumed by `docs/pov.js`):
  - `video/imax-demo-poster.jpg` — 1.43 poster/fallback frame
  - `video/imax-demo-1.43-1024x716.mp4` — mobile video texture
  - `video/imax-demo-1.43-1546x1080.mp4` — desktop video texture
