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

Trademarks: IMAX is a trademark of IMAX Corporation. Dolby and Dolby Cinema are
trademarks of Dolby Laboratories. RPX is a trademark of Regal Cinemas. Cinemark
and XD are trademarks of Cinemark. ScreenX is a trademark of CJ 4DPLEX. This
project is not affiliated with, endorsed by, or sponsored by any of these
companies. Trademarks are used solely to identify and factually describe the
formats and venues discussed.
