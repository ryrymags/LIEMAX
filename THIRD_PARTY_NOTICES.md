# Third-Party Notices

This project incorporates data derived from the following third-party sources.

## r-imax / imaxguide (143190.xyz)

- Source: https://github.com/r-imax/imaxguide (published at https://143190.xyz)
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- Use in this project: U.S. IMAX venue rows in `src/data/fixtures/imax_143190_us_rows.json`
  and derived venue records/statistics are adapted from the imaxguide CSV dataset.
  Fields sourced from it carry the `r_imax_csv` source-quality tag.
- Modifications: rows are filtered to the U.S., reshaped to this project's schema,
  normalized (units, unknown-dimension handling), and merged with other sources.
- Per CC BY-SA 4.0, this project's data and content are likewise licensed under
  CC BY-SA 4.0 (see `LICENSE-CONTENT`).

## LFExaminer theater listing (archival)

- Source: LFExaminer's public large-format theater table, as archived 2021-10-17.
- Use in this project: U.S. IMAX-labeled rows preserved in
  `src/data/fixtures/lfexaminer_us_imax_rows.json` as low-confidence archival
  supplement data (`lfexaminer` source-quality tag). Facts (venue names,
  locations, screen dimensions) are not subject to copyright; no article text
  or creative content is reproduced.

## Dolby Cinema theater count snapshot

- Source: point-in-time snapshot of Dolby's public cinema-finder endpoint
  (`src/data/fixtures/dolby_cinema_us_snapshots.json`).
- Use in this project: an aggregate U.S. theater count and venue id/coordinate
  list. Treated as a point-in-time scrape, not a Dolby-published total.

## CDN-delivered libraries (website prototype)

- React / ReactDOM (MIT), Babel Standalone (MIT), Three.js (MIT) — loaded from
  public CDNs by `docs/index.html`; each retains its own license.

## Film frame imagery

**What is used.** The splash intro (`SplashZoom.tsx`) displays a single still
frame captured from circulated IMAX 70mm camera-test footage for *Oppenheimer*
(2023). The frame is presented at reduced resolution (derivatives up to
3600px wide, generated from an 8K scan) as `web/public/assets/splash/
liemax-frame-*.{avif,jpg}` and `liemax-eye-*.{avif,jpg}`, and their build-output
copies under `docs/assets/splash/`.

**Identification of the work.** *Oppenheimer* (2023). Copyright presumptively
held by Universal Pictures and Syncopy Inc. No claim of ownership is made over
this material.

**Purpose and fair-use posture.** The frame illustrates cinema projection
aspect ratios (specifically IMAX's 1.43:1 format) as part of this project's
educational comparison tool. Under the four-factor test of 17 U.S.C. § 107,
this use is intended to weigh toward fair use:

1. *Purpose and character* — transformative, non-commercial, educational use
   (commentary on and illustration of a projection format), not a use of the
   film as entertainment.
2. *Nature of the work* — a single frame excerpted from a published
   feature-length motion picture.
3. *Amount used* — one still frame (a fraction of a second) from a
   ~180-minute film, at reduced resolution well below the source scan.
4. *Market effect* — no substitution for the film; a single reduced-resolution
   still cannot serve as a replacement for viewing, purchasing, or streaming
   *Oppenheimer*.

**Non-affiliation.** This project, its author, and its use of this frame are
not affiliated with, endorsed by, or sponsored by Universal Pictures,
Syncopy Inc., Christopher Nolan, or any of the film's cast, crew, or
distributors.

**No reuse from this repo.** This still frame (and the `liemax-eye-*` crop
derived from it) is **not** covered by this project's own content license
(`LICENSE-CONTENT`, CC BY-SA 4.0). Re-users of this repository's data and code
may not extract, redistribute, or otherwise reuse the frame imagery under that
license. See `LICENSE-CONTENT` for the explicit carve-out.

**Takedown requests.** If you are a rights holder and want this imagery
removed, please open an issue at
https://github.com/ryrymags/LIEMAX/issues describing the request. Removal
requests will be honored promptly.

Trademarks: IMAX is a trademark of IMAX Corporation. Dolby and Dolby Cinema are
trademarks of Dolby Laboratories. RPX is a trademark of Regal Cinemas, a
subsidiary of Cineworld Group. XD is a trademark of Cinemark. ScreenX is a
trademark of CJ 4DPLEX. AMC is a trademark of AMC Entertainment. Universal
Pictures and Syncopy are trademarks of Universal City Studios LLC and Syncopy
Inc., respectively. This project is not affiliated with, endorsed by, or
sponsored by IMAX Corporation, Dolby Laboratories, Regal Cinemas, Cinemark,
CJ 4DPLEX, AMC Entertainment, Universal Pictures, or Syncopy. Trademarks are
used solely in a nominative, factual sense to identify and describe the
formats, venues, and works discussed.
