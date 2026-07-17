# Footer Legal Copy

Paste-ready copy for the site footer. Two variants: the compact version for
the footer itself, and an optional "Full notices" expandable/collapsible
block for readers who want the complete picture. Word counts below are for
the compact version only.

## Compact footer copy (~95 words)

```
LIEMAX is an independent, non-commercial educational resource for comparing
cinema and home-screen projection formats.

Not affiliated with, endorsed by, or sponsored by IMAX Corporation, Dolby
Laboratories, Regal Cinemas (RPX), Cinemark (XD), CJ 4DPLEX (ScreenX), AMC
Entertainment, Universal Pictures, or Syncopy. Brand names are used only to
identify the formats and works discussed.

Splash frame from Oppenheimer (2023) © Universal Pictures / Syncopy, shown
at reduced resolution for format education and commentary (fair use).
Rights holder? Request removal →

IMAX venue data adapted from r-imax / 143190.xyz, licensed CC BY-SA 4.0.
```

Notes for implementation:

- "Request removal →" links to `https://github.com/ryrymags/LIEMAX/issues`.
- The data-attribution line reuses the wording basis already established in
  `THIRD_PARTY_NOTICES.md` ("r-imax / imaxguide (143190.xyz)" section,
  CC BY-SA 4.0); if space allows, the full attribution reads: "IMAX venue
  data adapted from the r-imax / imaxguide dataset (143190.xyz), licensed
  under CC BY-SA 4.0. This project's data is likewise CC BY-SA 4.0."
- Do not drop the ® / trademark implication by rewording brand names —
  first mention of each brand name in body copy elsewhere on the site should
  still track `THIRD_PARTY_NOTICES.md`; the footer itself doesn't need
  superscript ® marks (plain names read fine in a minimalist footer and are
  standard practice for nominative-use disclaimers).

## Full notices (optional collapsible block)

Use this as the expanded content behind a "Full notices" / "Legal" disclosure
toggle in the footer, for readers who click through instead of just reading
the compact copy above.

```
About LIEMAX
LIEMAX is an independent, non-commercial, ad-free educational resource that
helps people understand what cinema and home screens actually look like from
a given seat — screen size, aspect ratio, brightness, resolution, and seating
geometry, explained with real math.

Trademarks
IMAX is a trademark of IMAX Corporation. Dolby and Dolby Cinema are
trademarks of Dolby Laboratories. RPX is a trademark of Regal Cinemas. XD is
a trademark of Cinemark. ScreenX is a trademark of CJ 4DPLEX. AMC is a
trademark of AMC Entertainment. Universal Pictures and Syncopy are
trademarks of their respective owners. LIEMAX is not affiliated with,
endorsed by, or sponsored by any of these companies. Names are used solely
to identify and factually describe the formats, venues, and works discussed.

Splash imagery
The scroll intro on this site's home page shows a single still frame from
circulated IMAX 70mm camera-test footage for Oppenheimer (2023), copyright
presumptively Universal Pictures / Syncopy Inc. It's shown at reduced
resolution (well below the source scan) solely to illustrate IMAX's 1.43:1
projection aspect ratio as part of this site's format-comparison tool — a
transformative, non-commercial, educational use of a single frame from a
feature-length film, which we believe qualifies as fair use under 17 U.S.C.
§ 107. This still is not licensed for reuse and is not covered by this
project's own CC BY-SA 4.0 content license. If you're a rights holder and
want it removed, open an issue on GitHub and we'll honor the request
promptly: https://github.com/ryrymags/LIEMAX/issues

Data attribution
IMAX venue data is adapted from the r-imax / imaxguide dataset
(143190.xyz), licensed under Creative Commons Attribution-ShareAlike 4.0
International (CC BY-SA 4.0). In keeping with that license's ShareAlike
terms, this project's own data and content are likewise licensed under
CC BY-SA 4.0 — see LICENSE-CONTENT in the repository (which excludes the
splash imagery above). Supplemental U.S. archival theater data is drawn from
LFExaminer's public listings (2021 snapshot); Dolby Cinema counts are a
point-in-time snapshot of Dolby's public cinema-finder endpoint.

Source & contact
LIEMAX is open source: https://github.com/ryrymags/LIEMAX — use the Issues
tab there for corrections, takedown requests, or questions.
```
