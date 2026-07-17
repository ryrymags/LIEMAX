# Splash Zoom Assets

This folder holds the still-image derivatives (full frame + a higher-detail
eye-region crop) and placeholder thumbnails powering the CSS-transform-driven
zoom intro (`SplashZoom.tsx`) at the top of the home page. There is no tile
pyramid or deep-zoom viewer involved — the whole effect is a single
`transform: translate() scale()` on one element, driven by scroll position.

## What's here (committed)

- `liemax-frame-full-{1600,2400,3600}.avif` + `liemax-frame-full-2400.jpg` —
  the full 1.43:1 frame at increasing widths, the base layer of the zoomer.
- `liemax-eye-{1600,2400,3400}.avif` + `liemax-eye-2400.jpg` — a
  higher-resolution crop of just the eye region (source rect x=3300 y=1250
  w=4400 h=3300 of the full frame), stacked on top of the full-frame image
  inside the zoomer so the zoomed-in start (scroll progress 0) stays sharp
  without needing a tile pyramid.
- `liemax-frame-thumb.avif` / `liemax-frame-thumb.jpg` — ~400px-wide
  full-frame placeholder used as the stage's blurred CSS background.
- `liemax-frame-static.avif` / `liemax-frame-static.jpg` — 1600px-wide
  full-frame still used by the static mode (`prefers-reduced-motion`, or a
  full-frame image load failure) where the 400px thumb would be too soft.

Source crop: 10803 x 7555 px (~1.43:1), taken from an 8K 70mm scan.

## Regenerating

Master source (not in this repo):
`/Users/rymag/Documents/Codex/2026-05-08/liemax-homepage/asset-pipeline/output/clean/full/oppenheimer-imax-143-full.avif`

With `vips` (libvips) installed:

```sh
# Normalize color space first.
vips colourspace oppenheimer-imax-143-full.avif /tmp/liemax-frame-srgb.v srgb

# Full-frame still at three widths + a jpg fallback.
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-full-1600.avif[Q=62,effort=4]' 1600
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-full-2400.avif[Q=62,effort=4]' 2400
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-full-3600.avif[Q=60,effort=4]' 3600
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-full-2400.jpg[Q=78,strip]' 2400

# Eye-detail crop (x=3300 y=1250 w=4400 h=3300) at three widths + a jpg
# fallback.
vips crop /tmp/liemax-frame-srgb.v /tmp/liemax-eye-srgb.v 3300 1250 4400 3300
vips thumbnail /tmp/liemax-eye-srgb.v 'liemax-eye-1600.avif[Q=62,effort=4]' 1600
vips thumbnail /tmp/liemax-eye-srgb.v 'liemax-eye-2400.avif[Q=62,effort=4]' 2400
vips thumbnail /tmp/liemax-eye-srgb.v 'liemax-eye-3400.avif[Q=60,effort=4]' 3400
vips thumbnail /tmp/liemax-eye-srgb.v 'liemax-eye-2400.jpg[Q=78,strip]' 2400

# Blurred first-paint thumb + static-mode still (reduced motion / a
# full-frame load failure).
vips thumbnail /tmp/liemax-frame-srgb.v liemax-frame-thumb.avif 400
vips thumbnail /tmp/liemax-frame-srgb.v liemax-frame-thumb.jpg 400
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-static.avif[Q=60,effort=4]' 1600
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-static.jpg[Q=72,strip]' 1600
```

Output goes directly into this directory (`web/public/assets/splash/`) so
Vite serves it at `/assets/splash/...` in dev and copies it into `docs/` on
build.

## Licensing

The source frame is a scan of copyrighted film content — circulated IMAX
70mm camera-test footage for *Oppenheimer* (2023), copyright presumptively
Universal Pictures / Syncopy Inc. As of 2026-07-16 the project owner has
decided to commit and deploy this imagery (reduced-resolution derivatives,
up to 3600px wide, generated from an 8K scan) under a documented fair-use
posture: a single still frame, used solely for non-commercial educational
illustration of projection-format aspect ratios (specifically IMAX 1.43:1),
with no market substitution for the film. `docs/assets/splash/` (the Netlify
build output) carries the same committed copies for the same reason.

Full rationale, identification of the work, the four-factor fair-use
analysis, and the non-affiliation statement live in `THIRD_PARTY_NOTICES.md`
under "Film frame imagery" — read that before reusing or modifying this
imagery. This frame is **not** covered by this project's own content license
(`LICENSE-CONTENT`); see that file's exclusion clause.

**Takedown requests.** If you are a rights holder and want this imagery
removed, open an issue at https://github.com/ryrymags/LIEMAX/issues. Requests
will be honored promptly.

The component must still degrade gracefully if these assets are ever missing
(e.g. a stripped checkout, a future removal in response to a takedown
request): `SplashZoom.tsx` falls back to a static outlined 1.43:1 placeholder
box with caption text and aspect-ratio overlays when the images are absent
(see the component's failure-mode handling). Do not treat that fallback path
as dead code — it is the documented degrade behavior, not a leftover from
the prior gitignored state.
