# Splash Deep-Zoom Assets

This folder holds the Deep Zoom Image (DZI) tile pyramid and placeholder
thumbnails powering the scroll-driven zoom intro (`SplashZoom.tsx`) at the
top of the home page.

## What's here (gitignored — not committed)

- `liemax-frame-avif.dzi` + `liemax-frame-avif_files/{level}/{x}_{y}.avif` —
  standard DZI pyramid, tile size 512px, overlap 1, tiles encoded AVIF Q=62
  effort=4.
- `liemax-frame-webp.dzi` + `liemax-frame-webp_files/{level}/{x}_{y}.webp` —
  same pyramid, WebP Q=80 fallback for browsers without AVIF decode support.
- `liemax-frame-thumb.avif` / `liemax-frame-thumb.jpg` — ~400px-wide
  full-frame placeholder used for first paint (blurred background).
- `liemax-frame-static.avif` / `liemax-frame-static.jpg` — 1600px-wide
  full-frame still used by the static mode (`prefers-reduced-motion`, or
  OpenSeadragon failure) where the 400px thumb would be too soft.

Source crop: 10803 x 7555 px (~1.43:1), taken from an 8K 70mm scan.

## Regenerating

Master source (not in this repo):
`/Users/rymag/Documents/Codex/2026-05-08/liemax-homepage/asset-pipeline/output/clean/full/oppenheimer-imax-143-full.avif`

With `vips` (libvips) installed:

```sh
# Normalize color space first.
vips colourspace oppenheimer-imax-143-full.avif /tmp/liemax-frame-srgb.v srgb

# AVIF tile pyramid.
vips dzsave /tmp/liemax-frame-srgb.v liemax-frame-avif \
  --layout dz --suffix '.avif[Q=62,effort=4]' --tile-size 512 --overlap 1

# WebP tile pyramid (fallback for browsers without AVIF decode).
vips dzsave /tmp/liemax-frame-srgb.v liemax-frame-webp \
  --layout dz --suffix '.webp[Q=80]' --tile-size 512 --overlap 1

# Thumbnails (first paint) + static-mode still (reduced motion / OSD failure).
vips thumbnail /tmp/liemax-frame-srgb.v liemax-frame-thumb.avif 400
vips thumbnail /tmp/liemax-frame-srgb.v liemax-frame-thumb.jpg 400
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-static.avif[Q=60,effort=4]' 1600
vips thumbnail /tmp/liemax-frame-srgb.v 'liemax-frame-static.jpg[Q=72,strip]' 1600
```

Output goes directly into this directory (`web/public/assets/splash/`) so
Vite serves it at `/assets/splash/...` in dev and copies it into `docs/` on
build.

## Licensing — why this is gitignored

The source frame is a scan of copyrighted film content (Oppenheimer, 2023,
70mm IMAX release) used here for format-comparison illustration only.
Redistribution rights are **not cleared**, so none of the generated tiles or
thumbnails are committed to the repo — only this README and the
`SplashZoom.tsx` code that consumes them. `docs/assets/splash/` (the Netlify
build output) is gitignored for the same reason.

The site must degrade gracefully without this folder populated:
`SplashZoom.tsx` falls back to a static outlined 1.43:1 placeholder box with
caption text and aspect-ratio overlays when the thumbnail/tiles are absent
(see the component's failure-mode handling). CI and fresh clones will not
have this imagery and that is expected — do not treat missing files here as
a build error.
