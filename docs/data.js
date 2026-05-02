// GENERATED FILE. Run npm run build:docs-data.
// Source: canonical src/data JSON resolved through src/math/resolver.
window.LIEMAX_DATA = {
  "venues": [
    {
      "id": "apple_providence_imax",
      "canonicalId": "apple_providence_imax",
      "kind": "cinema",
      "name": "Apple Cinemas Providence Place IMAX",
      "city": "Providence",
      "state": "RI",
      "stateName": "Rhode Island",
      "isPreset": false,
      "sub": "Providence, RI · 1.43 screen · CoLa digital",
      "tag": "IMAX 1.43",
      "blurb": "Physical 1.43:1 screen; daily projection is CoLa at 1.90 — loses ~25% of vertical frame on 1.43 content. 15/70 film installed for occasional booked engagements.",
      "screen": {
        "w": 81.036748,
        "h": 56.758532,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 40,
        "mid": 67,
        "back": 95,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa Digital",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa Digital"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX 15/70 Film",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": "~8.8K–11.7K scan-equivalent; grain limits perceived detail before resolution does",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 4500,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX 15/70 Film"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV (Apr 2026) — 24.7 × 17.3 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "IMAX calibration target 22 fL; per-venue fL not published."
        },
        "contrast": {
          "q": "trade_reporting",
          "note": "IMAX CTO Bonnick, CinemaCon 2018."
        },
        "seat": {
          "q": "derived",
          "note": "Front/mid/back derived from screen width — no published row distances."
        }
      }
    },
    {
      "id": "imax_gt_typical",
      "canonicalId": "imax_gt_typical",
      "kind": "cinema",
      "name": "IMAX GT Laser (typical)",
      "city": "",
      "state": "Format presets",
      "stateName": "Format presets",
      "isPreset": true,
      "sub": "Format preset · true 1.43 · dual 4K pixel-offset",
      "tag": "IMAX GT",
      "blurb": "Dual-projector pixel-offset supersampling on a purpose-built 1.43:1 screen. ~42 commercial venues globally. The only IMAX format that shows 1.43 digitally without film.",
      "screen": {
        "w": 70,
        "h": 49,
        "ar": 1.4285714285714286,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 35,
        "mid": 58,
        "back": 82,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · Full IMAX",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Dual Laser Digital",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Dual Laser Digital"
      },
      "filmProjection": null,
      "commercialFilms": false,
      "sources": {
        "screen": {
          "q": "preset_typical",
          "note": "Representative GT auditorium — real venues vary by location."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "IMAX target 22 fL."
        },
        "contrast": {
          "q": "published_cto",
          "note": "~8,000:1 sequential; IMAX CTO statements and trade reporting."
        },
        "seat": {
          "q": "derived",
          "note": "Derived from typical GT auditorium ratios."
        }
      }
    },
    {
      "id": "dolby_cinema_typical",
      "canonicalId": "dolby_cinema_typical",
      "kind": "cinema",
      "name": "Dolby Cinema (typical AMC)",
      "city": "",
      "state": "Format presets",
      "stateName": "Format presets",
      "isPreset": true,
      "sub": "2.39 · dual 4K laser · Dolby Vision",
      "tag": "Dolby Cinema",
      "blurb": "Dual 4K laser with Dolby Vision — the deepest sequential blacks of any commercial cinema format. ~295 locations. Narrower frame than IMAX; wins on contrast and HDR, not size.",
      "screen": {
        "w": 55,
        "h": 23,
        "ar": 2.391304347826087,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 28,
        "mid": 46,
        "back": 65,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 2.39,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "Dolby Cinema cannot show 1.43 — screen is 2.39:1 wide format",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "Dolby Vision (Dual-Laser Christie E3LH)",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 31,
        "brightness_nits_full": null,
        "nativeContrast": 6250,
        "isPerPixelEmissive": false,
        "hdrCategory": "dolby_vision",
        "hdrLabel": "Dolby Vision dynamic (1,000,000:1)",
        "hdrDynamic": 1000000,
        "min_ar": 1.85,
        "type": "dolby_cinema",
        "display_name": "Dolby Vision (Dual-Laser Christie E3LH)"
      },
      "filmProjection": null,
      "commercialFilms": false,
      "sources": {
        "screen": {
          "q": "trade_reporting",
          "note": "Typical Dolby Cinema auditorium (55 ft wide)."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "~31 fL from firsthand AMC Dolby Cinema reports, May 2025."
        },
        "contrast": {
          "q": "trade_reporting",
          "note": "Sequential ~6,250:1; dynamic 1,000,000:1 Dolby Vision claim."
        },
        "seat": {
          "q": "derived",
          "note": "Derived from typical auditorium ratios."
        }
      }
    },
    {
      "id": "dolby_cinema_single_laser",
      "canonicalId": "dolby_cinema_single_laser",
      "kind": "cinema",
      "name": "Dolby Cinema (Christie Eclipse, 2025+)",
      "city": "",
      "state": "Format presets",
      "stateName": "Format presets",
      "isPreset": true,
      "sub": "2.39 · single 4K laser · Dolby Vision 20M:1 dynamic",
      "tag": "Dolby Cinema",
      "blurb": "New-build Dolby Cinema system rolling out from May 2025 onward. Uses Christie Eclipse single-laser projection with the same Dolby Vision workflow and a much higher dynamic-contrast ceiling.",
      "screen": {
        "w": 58,
        "h": 24.3,
        "ar": 2.386831275720165,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 29,
        "mid": 49,
        "back": 68,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 2.39,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "Dolby Cinema cannot show 1.43 — screen is a wide-format auditorium",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "Dolby Vision (Single-Laser Christie, 2025+)",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "Christie Eclipse-based 4K RGB pure laser; ~25,000–30,000 lumens; rolling out from May 2025",
        "brightness_fl": 31,
        "brightness_nits_full": null,
        "nativeContrast": 6250,
        "isPerPixelEmissive": false,
        "hdrCategory": "dolby_vision",
        "hdrLabel": "Dolby Vision dynamic (20,000,000:1)",
        "hdrDynamic": 20000000,
        "min_ar": 1.85,
        "type": "dolby_cinema_single_laser",
        "display_name": "Dolby Vision (Single-Laser Christie, 2025+)"
      },
      "filmProjection": null,
      "commercialFilms": false,
      "sources": {
        "screen": {
          "q": "trade_reporting",
          "note": "Christie Eclipse Dolby builds support screens up to ~58 ft wide."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "~31 fL from early 2025 reports and Dolby's >2× typical-cinema brightness claim."
        },
        "contrast": {
          "q": "trade_reporting",
          "note": "Christie Eclipse lists up to 20,000,000:1 dynamic contrast; sequential kept comparable to Dolby Cinema baseline."
        },
        "seat": {
          "q": "derived",
          "note": "Derived from typical Dolby auditorium ratios; venue rows will override when known."
        }
      }
    },
    {
      "id": "cinemark_xd",
      "canonicalId": "cinemark_xd",
      "kind": "cinema",
      "name": "Cinemark XD",
      "city": "",
      "state": "Format presets",
      "stateName": "Format presets",
      "isPreset": true,
      "sub": "1.90 · Barco 4K laser · Auro 11.1",
      "tag": "Cinemark XD",
      "blurb": "Cinemark's large-format auditorium: about 70 ft corner-to-corner on a 1.90:1 screen, Barco 4K projection, and Auro 11.1/AuroMax audio. Scope films letterbox; there is no expanded IMAX-format content.",
      "screen": {
        "w": 64.5,
        "h": 34,
        "ar": 1.8970588235294117,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 33,
        "mid": 54,
        "back": 76,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · XD / Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "Cinemark XD is not an IMAX 1.43-capable format",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "Cinemark XD 4K",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI. Post-2022 installs: Barco SP4K-15C (17,000 lm) or SP4K-20B (21,000 lm) RGB laser. Pre-2022: Barco DP2K/DP4K xenon.",
        "brightness_fl": 16,
        "brightness_nits_full": null,
        "nativeContrast": 2000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "barco_4k_laser",
        "display_name": "Cinemark XD 4K"
      },
      "filmProjection": null,
      "commercialFilms": false,
      "sources": {
        "screen": {
          "q": "derived",
          "note": "Face dimensions derived from Cinemark's ~70 ft corner-to-corner XD claim at 1.90:1."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "~16 fL derived from Barco SP4K-15C/20B specs and XD screen geometry."
        },
        "contrast": {
          "q": "trade_reporting",
          "note": "2,000:1 floor; current Barco SP4K-15C laser installs can reach ~2,700:1."
        },
        "seat": {
          "q": "derived",
          "note": "Derived from typical large multiplex auditorium ratios."
        }
      }
    },
    {
      "id": "standard_multiplex",
      "canonicalId": "standard_multiplex",
      "kind": "cinema",
      "name": "Standard Multiplex",
      "city": "",
      "state": "Format presets",
      "stateName": "Format presets",
      "isPreset": true,
      "sub": "Mainstream 4K digital auditorium",
      "tag": "Standard",
      "blurb": "The baseline — DCI 4K at 14 fL with 2,000:1 contrast. Everything premium is measured against this.",
      "screen": {
        "w": 45,
        "h": 24.3,
        "ar": 1.8518518518518519,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 23,
        "mid": 37,
        "back": 53,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.85,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "Standard multiplex has no IMAX-wide screen or projector",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "Standard 4K Digital",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI (4096×2160). Modern multiplexes use laser; older venues still use xenon — override projector type where confirmed.",
        "brightness_fl": 14,
        "brightness_nits_full": null,
        "nativeContrast": 2000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.85,
        "type": "standard_4k_laser",
        "display_name": "Standard 4K Digital"
      },
      "filmProjection": null,
      "commercialFilms": false,
      "sources": {
        "screen": {
          "q": "preset_typical",
          "note": "Mid-size auditorium from standard_multiplex preset (45 × 24.3 ft)."
        },
        "brightness": {
          "q": "derived",
          "note": "DCI minimum 14 fL."
        },
        "contrast": {
          "q": "published_official",
          "note": "DCI Spec v1.0 minimum 2,000:1."
        },
        "seat": {
          "q": "derived",
          "note": "Stadium seating mid-row derived."
        }
      }
    },
    {
      "id": "imax_us_al_birmingham_imax_dome_mcwane_center",
      "canonicalId": "mcwane_center_imax_dome",
      "kind": "cinema",
      "name": "IMAX Dome, McWane Center",
      "city": "Birmingham",
      "state": "AL",
      "stateName": "Alabama",
      "isPreset": false,
      "sub": "Birmingham · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 78.74016,
        "h": 78.74016,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 39.37008,
        "mid": 39.37008,
        "back": 39.37008,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 24.00 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_az_grand_canyon_grand_canyon_imax_grand_canyon_visitor_center",
      "canonicalId": "imax_us_az_grand_canyon_grand_canyon_imax_grand_canyon_visitor_center",
      "kind": "cinema",
      "name": "Grand Canyon IMAX, Grand Canyon Visitor Center",
      "city": "Grand Canyon",
      "state": "AZ",
      "stateName": "Arizona",
      "isPreset": false,
      "sub": "Grand Canyon · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 78.083992,
        "h": 59.05512,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 67.93307304,
        "mid": 117.12598799999999,
        "back": 175.68898199999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 23.8 × 18 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_az_phoenix_amc_deer_valley_30_and_imax",
      "canonicalId": "imax_us_az_phoenix_amc_deer_valley_30_and_imax",
      "kind": "cinema",
      "name": "AMC Deer Valley 30 & IMAX",
      "city": "Phoenix",
      "state": "AZ",
      "stateName": "Arizona",
      "isPreset": false,
      "sub": "Phoenix · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.181104,
        "h": 28.543307999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.52756048,
        "mid": 76.771656,
        "back": 115.157484,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.6 × 8.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_az_tempe_harkins_arizona_mills_25_and_imax",
      "canonicalId": "imax_us_az_tempe_harkins_arizona_mills_25_and_imax",
      "kind": "cinema",
      "name": "Harkins Arizona Mills 25 & IMAX",
      "city": "Tempe",
      "state": "AZ",
      "stateName": "Arizona",
      "isPreset": false,
      "sub": "Tempe · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 80.05249599999999,
        "h": 60.039372,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 69.64567152,
        "mid": 120.07874399999999,
        "back": 180.118116,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.4 × 18.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_aliso_viejo_regal_edwards_aliso_viejo_and_imax",
      "canonicalId": "imax_us_ca_aliso_viejo_regal_edwards_aliso_viejo_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Aliso Viejo & IMAX",
      "city": "Aliso Viejo",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Aliso Viejo · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 34.120736,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 10.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_alhambra_regal_edwards_alhambra_renaissance_and_imax",
      "canonicalId": "imax_us_ca_alhambra_regal_edwards_alhambra_renaissance_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Alhambra Renaissance & IMAX",
      "city": "Alhambra",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Alhambra · 1.90 · IMAX Laser XT",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.524936000000004,
        "h": 33.136483999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.956694320000004,
        "mid": 75.78740400000001,
        "back": 113.68110600000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser XT",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_laser_xt",
        "display_name": "IMAX Laser XT"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.4 × 10.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_arcadia_amc_santa_anita_16_and_imax",
      "canonicalId": "imax_us_ca_arcadia_amc_santa_anita_16_and_imax",
      "kind": "cinema",
      "name": "AMC Santa Anita 16 & IMAX",
      "city": "Arcadia",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Arcadia · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 33.136483999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 10.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_balboa_park_fleet_science_center",
      "canonicalId": "fleet_science_center_imax_dome",
      "kind": "cinema",
      "name": "Fleet Science Center",
      "city": "Balboa Park",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Balboa Park · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 76.115488,
        "h": 76.115488,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 38.057744,
        "mid": 38.057744,
        "back": 38.057744,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 23.20 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_ca_burbank_amc_burbank_16_and_imax",
      "canonicalId": "imax_us_ca_burbank_amc_burbank_16_and_imax",
      "kind": "cinema",
      "name": "AMC Burbank 16 & IMAX",
      "city": "Burbank",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Burbank · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 62.992127999999994,
        "h": 37.073492,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 54.803151359999994,
        "mid": 94.488192,
        "back": 141.73228799999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 19.2 × 11.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_city_of_industry_amc_puente_20_and_imax",
      "canonicalId": "imax_us_ca_city_of_industry_amc_puente_20_and_imax",
      "kind": "cinema",
      "name": "AMC Puente 20 & IMAX",
      "city": "City of Industry",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "City of Industry · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 57.08661599999999,
        "h": 29.855643999999998,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.665355919999996,
        "mid": 85.62992399999999,
        "back": 128.444886,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.4 × 9.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_dublin_regal_hacienda_crossings_and_imax",
      "canonicalId": "imax_us_ca_dublin_regal_hacienda_crossings_and_imax",
      "kind": "cinema",
      "name": "Regal Hacienda Crossings & IMAX",
      "city": "Dublin",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Dublin · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 76.3779552,
        "h": 55.77428,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 66.448821024,
        "mid": 114.5669328,
        "back": 171.8503992,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 23.28 × 17 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_emeryville_amc_bay_street_16_and_imax",
      "canonicalId": "imax_us_ca_emeryville_amc_bay_street_16_and_imax",
      "kind": "cinema",
      "name": "AMC Bay Street 16 & IMAX",
      "city": "Emeryville",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Emeryville · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 49.540684,
        "h": 28.871392000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.10039508,
        "mid": 74.311026,
        "back": 111.466539,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.1 × 8.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_glendale_amc_the_americana_at_brand_18_and_imax",
      "canonicalId": "imax_us_ca_glendale_amc_the_americana_at_brand_18_and_imax",
      "kind": "cinema",
      "name": "AMC The Americana at Brand 18 & IMAX",
      "city": "Glendale",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Glendale · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.509187999999995,
        "h": 27.559056,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.812993559999995,
        "mid": 77.26378199999999,
        "back": 115.89567299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.7 × 8.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_hollywood_tcl_chinese_theatres_imax",
      "canonicalId": "imax_us_ca_hollywood_tcl_chinese_theatres_imax",
      "kind": "cinema",
      "name": "TCL Chinese Theatres IMAX",
      "city": "Hollywood",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Hollywood · 1.90 · IMAX GT Laser",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 94.160108,
        "h": 45.93176,
        "ar": 1.9,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 81.91929395999999,
        "mid": 141.240162,
        "back": 211.860243,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX SR 15/70 mm, (2D Only)(Temporary)",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX SR 15/70 mm, (2D Only)(Temporary)"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 28.7 × 14 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_irvine_regal_edwards_irvine_spectrum_and_imax",
      "canonicalId": "imax_us_ca_irvine_regal_edwards_irvine_spectrum_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Irvine Spectrum & IMAX",
      "city": "Irvine",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Irvine · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 87.926512,
        "h": 67.58530400000001,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 76.49606544,
        "mid": 131.889768,
        "back": 197.834652,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 26.8 × 20.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_long_beach_regal_edwards_long_beach_and_imax",
      "canonicalId": "imax_us_ca_long_beach_regal_edwards_long_beach_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Long Beach & IMAX",
      "city": "Long Beach",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Long Beach · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 33.792652000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 10.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_los_angeles_amc_century_city_15_and_imax",
      "canonicalId": "imax_us_ca_los_angeles_amc_century_city_15_and_imax",
      "kind": "cinema",
      "name": "AMC Century City 15 & IMAX",
      "city": "Los Angeles",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Los Angeles · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.118112,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.952757440000006,
        "mid": 82.67716800000001,
        "back": 124.015752,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.8 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_los_angeles_amc_the_grove_and_imax",
      "canonicalId": "imax_us_ca_los_angeles_amc_the_grove_and_imax",
      "kind": "cinema",
      "name": "AMC The Grove & IMAX",
      "city": "Los Angeles",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Los Angeles · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.44619599999999,
        "h": 31.496063999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 48.238190519999996,
        "mid": 83.169294,
        "back": 124.75394099999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.9 × 9.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_los_angeles_imax_california_science_center",
      "canonicalId": "imax_us_ca_los_angeles_imax_california_science_center",
      "kind": "cinema",
      "name": "IMAX, California Science Center",
      "city": "Los Angeles",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Los Angeles · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 89.895016,
        "h": 66.601052,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 78.20866391999999,
        "mid": 134.842524,
        "back": 202.26378599999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 27.4 × 20.3 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_montclair_amc_dine_in_montclair_12_and_imax",
      "canonicalId": "imax_us_ca_montclair_amc_dine_in_montclair_12_and_imax",
      "kind": "cinema",
      "name": "AMC DINE-IN Montclair 12 & IMAX",
      "city": "Montclair",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Montclair · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 56.6929152,
        "h": 29.986877600000003,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.322836224,
        "mid": 85.0393728,
        "back": 127.55905920000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.28 × 9.14 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_national_city_amc_plaza_bonita_14_and_imax",
      "canonicalId": "imax_us_ca_national_city_amc_plaza_bonita_14_and_imax",
      "kind": "cinema",
      "name": "AMC Plaza Bonita 14 & IMAX",
      "city": "National City",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "National City · 1.90 · IMAX Laser XT",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 32.8084,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser XT",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_laser_xt",
        "display_name": "IMAX Laser XT"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 10 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_newark_amc_newpark_12_and_imax",
      "canonicalId": "imax_us_ca_newark_amc_newpark_12_and_imax",
      "kind": "cinema",
      "name": "AMC Newpark 12 & IMAX",
      "city": "Newark",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Newark · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 60.69554,
        "h": 33.464568,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 52.8051198,
        "mid": 91.04331,
        "back": 136.564965,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.5 × 10.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_ontario_regal_edwards_ontario_palace_and_imax",
      "canonicalId": "imax_us_ca_ontario_regal_edwards_ontario_palace_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Ontario Palace & IMAX",
      "city": "Ontario",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Ontario · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 88.910764,
        "h": 66.929136,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 77.35236468,
        "mid": 133.36614600000001,
        "back": 200.049219,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 27.1 × 20.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_orange_amc_30_at_the_block_and_imax",
      "canonicalId": "imax_us_ca_orange_amc_30_at_the_block_and_imax",
      "kind": "cinema",
      "name": "AMC 30 at the Block & IMAX",
      "city": "Orange",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Orange · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 57.08661599999999,
        "h": 28.871392000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.665355919999996,
        "mid": 85.62992399999999,
        "back": 128.444886,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.4 × 8.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_sacramento_esquire_imax_theatre",
      "canonicalId": "imax_us_ca_sacramento_esquire_imax_theatre",
      "kind": "cinema",
      "name": "Esquire IMAX Theatre",
      "city": "Sacramento",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Sacramento · 1.43 · IMAX Digital",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 75.78740400000001,
        "h": 59.05512,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 65.93504148000001,
        "mid": 113.68110600000001,
        "back": 170.52165900000003,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Digital",
        "light": "Dual Xenon",
        "resH": 2048,
        "resV": 1080,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "2K per projector (2048 × 1080); dual-stacked for brightness, not resolution",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 2500,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_dual_xenon",
        "display_name": "IMAX Digital"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 23.1 × 18 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_san_diego_amc_palm_promenade_24_and_imax",
      "canonicalId": "imax_us_ca_san_diego_amc_palm_promenade_24_and_imax",
      "kind": "cinema",
      "name": "AMC Palm Promenade 24 & IMAX",
      "city": "San Diego",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "San Diego · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.070868,
        "h": 32.480316,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.521655159999995,
        "mid": 87.106302,
        "back": 130.65945299999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.7 × 9.9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_san_diego_regal_edwards_mira_mesa_and_imax",
      "canonicalId": "imax_us_ca_san_diego_regal_edwards_mira_mesa_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Mira Mesa & IMAX",
      "city": "San Diego",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "San Diego · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 57.4803168,
        "h": 35.9908148,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.007875616,
        "mid": 86.2204752,
        "back": 129.3307128,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.52 × 10.97 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_san_francisco_amc_metreon_16_and_imax",
      "canonicalId": "imax_us_ca_san_francisco_amc_metreon_16_and_imax",
      "kind": "cinema",
      "name": "AMC Metreon 16 & IMAX",
      "city": "San Francisco",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "San Francisco · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 97.769032,
        "h": 75.45932,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 85.05905784,
        "mid": 146.653548,
        "back": 219.980322,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 29.8 × 23 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_san_jose_imax_dome_theater_the_tech_interactive",
      "canonicalId": "tech_interactive_imax_dome",
      "kind": "cinema",
      "name": "IMAX Dome Theater, The Tech Interactive",
      "city": "San Jose",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "San Jose · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 82.021,
        "h": 82.021,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 41.0105,
        "mid": 41.0105,
        "back": 41.0105,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 25.00 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_ca_santa_clara_amc_mercado_20_and_imax",
      "canonicalId": "imax_us_ca_santa_clara_amc_mercado_20_and_imax",
      "kind": "cinema",
      "name": "AMC Mercado 20 & IMAX",
      "city": "Santa Clara",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Santa Clara · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 57.08661599999999,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.665355919999996,
        "mid": 85.62992399999999,
        "back": 128.444886,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.4 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_santa_clarita_regal_edwards_valencia_and_imax",
      "canonicalId": "imax_us_ca_santa_clarita_regal_edwards_valencia_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Valencia & IMAX",
      "city": "Santa Clarita",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Santa Clarita · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 68.56955599999999,
        "h": 41.0105,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 59.655513719999995,
        "mid": 102.854334,
        "back": 154.281501,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 20.9 × 12.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_south_gate_regal_edwards_south_gate_and_imax",
      "canonicalId": "imax_us_ca_south_gate_regal_edwards_south_gate_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards South Gate & IMAX",
      "city": "South Gate",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "South Gate · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.070868,
        "h": 37.073492,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.521655159999995,
        "mid": 87.106302,
        "back": 130.65945299999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.7 × 11.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_stockton_regal_stockton_city_centre_and_imax",
      "canonicalId": "imax_us_ca_stockton_regal_stockton_city_centre_and_imax",
      "kind": "cinema",
      "name": "Regal Stockton City Centre & IMAX",
      "city": "Stockton",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Stockton · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.821524000000004,
        "h": 31.496063999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.954725880000005,
        "mid": 79.232286,
        "back": 118.84842900000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.1 × 9.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_temecula_regal_edwards_temecula_and_imax",
      "canonicalId": "imax_us_ca_temecula_regal_edwards_temecula_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Temecula & IMAX",
      "city": "Temecula",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Temecula · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 33.464568,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 10.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_torrance_amc_del_amo_18_and_imax",
      "canonicalId": "imax_us_ca_torrance_amc_del_amo_18_and_imax",
      "kind": "cinema",
      "name": "AMC Del Amo 18 & IMAX",
      "city": "Torrance",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Torrance · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 32.152232000000005,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 9.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_tustin_amc_tustin_the_district_and_imax",
      "canonicalId": "imax_us_ca_tustin_amc_tustin_the_district_and_imax",
      "kind": "cinema",
      "name": "AMC Tustin @ The District & IMAX",
      "city": "Tustin",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Tustin · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 46.6863532,
        "h": 22.7034128,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 40.617127284,
        "mid": 70.0295298,
        "back": 105.0442947,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 14.23 × 6.92 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ca_universal_city_universal_cinema_amc_at_citywalk_hollywood_and_imax",
      "canonicalId": "imax_us_ca_universal_city_universal_cinema_amc_at_citywalk_hollywood_and_imax",
      "kind": "cinema",
      "name": "Universal Cinema AMC at CityWalk Hollywood & IMAX",
      "city": "Universal City",
      "state": "CA",
      "stateName": "California",
      "isPreset": false,
      "sub": "Universal City · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 79.068244,
        "h": 58.070868,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 68.78937228000001,
        "mid": 118.60236600000002,
        "back": 177.90354900000003,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.1 × 17.7 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_co_denver_amc_orchard_12_and_imax",
      "canonicalId": "imax_us_co_denver_amc_orchard_12_and_imax",
      "kind": "cinema",
      "name": "AMC Orchard 12 & IMAX",
      "city": "Denver",
      "state": "CO",
      "stateName": "Colorado",
      "isPreset": false,
      "sub": "Denver · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.181104,
        "h": 32.8084,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.52756048,
        "mid": 76.771656,
        "back": 115.157484,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.6 × 10 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_co_denver_amc_westminster_promenade_24_and_imax",
      "canonicalId": "imax_us_co_denver_amc_westminster_promenade_24_and_imax",
      "kind": "cinema",
      "name": "AMC Westminster Promenade 24 & IMAX",
      "city": "Denver",
      "state": "CO",
      "stateName": "Colorado",
      "isPreset": false,
      "sub": "Denver · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 34.776904,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 10.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_co_highlands_ranch_amc_highlands_ranch_24_and_imax",
      "canonicalId": "imax_us_co_highlands_ranch_amc_highlands_ranch_24_and_imax",
      "kind": "cinema",
      "name": "AMC Highlands Ranch 24 & IMAX",
      "city": "Highlands Ranch",
      "state": "CO",
      "stateName": "Colorado",
      "isPreset": false,
      "sub": "Highlands Ranch · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 57.414699999999996,
        "h": 34.776904,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.95078899999999,
        "mid": 86.12205,
        "back": 129.183075,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.5 × 10.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ct_milford_cinemark_connecticut_post_14_and_imax",
      "canonicalId": "imax_us_ct_milford_cinemark_connecticut_post_14_and_imax",
      "kind": "cinema",
      "name": "Cinemark Connecticut Post 14 & IMAX",
      "city": "Milford",
      "state": "CT",
      "stateName": "Connecticut",
      "isPreset": false,
      "sub": "Milford · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 59.711287999999996,
        "h": 33.136483999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 51.948820559999994,
        "mid": 89.566932,
        "back": 134.35039799999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.2 × 10.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_dc_washington_amc_georgetown_14_and_imax",
      "canonicalId": "imax_us_dc_washington_amc_georgetown_14_and_imax",
      "kind": "cinema",
      "name": "AMC Georgetown 14 & IMAX",
      "city": "Washington",
      "state": "DC",
      "stateName": "District of Columbia",
      "isPreset": false,
      "sub": "Washington · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 44.947508,
        "h": 22.96588,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 39.104331959999996,
        "mid": 67.421262,
        "back": 101.13189299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 13.7 × 7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_dc_washington_lockheed_martin_imax_national_air_and_space_museum",
      "canonicalId": "imax_us_dc_washington_lockheed_martin_imax_national_air_and_space_museum",
      "kind": "cinema",
      "name": "Lockheed Martin IMAX, National Air & Space Museum",
      "city": "Washington",
      "state": "DC",
      "stateName": "District of Columbia",
      "isPreset": false,
      "sub": "Washington · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 75.45932,
        "h": 45.93176,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 65.6496084,
        "mid": 113.18898000000002,
        "back": 169.78347000000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 23 × 14 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_altamonte_springs_amc_altamonte_mall_18_and_imax",
      "canonicalId": "imax_us_fl_altamonte_springs_amc_altamonte_mall_18_and_imax",
      "kind": "cinema",
      "name": "AMC Altamonte Mall 18 & IMAX",
      "city": "Altamonte Springs",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Altamonte Springs · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.837272,
        "h": 28.543307999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.09842664,
        "mid": 77.755908,
        "back": 116.633862,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.8 × 8.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_aventura_amc_aventura_24_and_imax",
      "canonicalId": "imax_us_fl_aventura_amc_aventura_24_and_imax",
      "kind": "cinema",
      "name": "AMC Aventura 24 & IMAX",
      "city": "Aventura",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Aventura · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.44619599999999,
        "h": 30.511812000000003,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 48.238190519999996,
        "mid": 83.169294,
        "back": 124.75394099999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.9 × 9.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_delray_beach_evo_entertainment_delray_beach_imax",
      "canonicalId": "imax_us_fl_delray_beach_evo_entertainment_delray_beach_imax",
      "kind": "cinema",
      "name": "EVO Entertainment Delray Beach + IMAX",
      "city": "Delray Beach",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Delray Beach · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 84.973756,
        "h": 55.118112,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 73.92716772,
        "mid": 127.460634,
        "back": 191.19095099999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 25.9 × 16.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_fort_lauderdale_autonation_imax_museum_of_discovery_and_science",
      "canonicalId": "imax_us_fl_fort_lauderdale_autonation_imax_museum_of_discovery_and_science",
      "kind": "cinema",
      "name": "Autonation IMAX, Museum of Discovery & Science",
      "city": "Fort Lauderdale",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Fort Lauderdale · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 80.05249599999999,
        "h": 60.039372,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 69.64567152,
        "mid": 120.07874399999999,
        "back": 180.118116,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.4 × 18.3 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_fort_myers_regal_gulf_coast_and_imax",
      "canonicalId": "imax_us_fl_fort_myers_regal_gulf_coast_and_imax",
      "kind": "cinema",
      "name": "Regal Gulf Coast & IMAX",
      "city": "Fort Myers",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Fort Myers · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.477692000000005,
        "h": 31.824147999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.52559204000001,
        "mid": 80.21653800000001,
        "back": 120.324807,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.3 × 9.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_miami_cmx_dolphin_19_and_imax",
      "canonicalId": "imax_us_fl_miami_cmx_dolphin_19_and_imax",
      "kind": "cinema",
      "name": "CMX Dolphin 19 & IMAX",
      "city": "Miami",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Miami · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.149608,
        "h": 26.902887999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.24015896,
        "mid": 79.724412,
        "back": 119.586618,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.2 × 8.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_miami_regal_kendall_village_and_imax",
      "canonicalId": "imax_us_fl_miami_regal_kendall_village_and_imax",
      "kind": "cinema",
      "name": "Regal Kendall Village & IMAX",
      "city": "Miami",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Miami · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.477692000000005,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.52559204000001,
        "mid": 80.21653800000001,
        "back": 120.324807,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.3 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_pembroke_pines_amc_pembroke_lakes_9_and_imax",
      "canonicalId": "imax_us_fl_pembroke_pines_amc_pembroke_lakes_9_and_imax",
      "kind": "cinema",
      "name": "AMC Pembroke Lakes 9 & IMAX",
      "city": "Pembroke Pines",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Pembroke Pines · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 60.367456,
        "h": 33.792652000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 52.519686719999996,
        "mid": 90.55118399999999,
        "back": 135.826776,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.4 × 10.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_fl_tampa_amc_veterans_24_and_imax",
      "canonicalId": "imax_us_fl_tampa_amc_veterans_24_and_imax",
      "kind": "cinema",
      "name": "AMC Veterans 24 & IMAX",
      "city": "Tampa",
      "state": "FL",
      "stateName": "Florida",
      "isPreset": false,
      "sub": "Tampa · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.461944,
        "h": 32.152232000000005,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.381891280000005,
        "mid": 81.692916,
        "back": 122.53937400000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.6 × 9.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_alpharetta_amc_north_point_mall_12_and_imax",
      "canonicalId": "imax_us_ga_alpharetta_amc_north_point_mall_12_and_imax",
      "kind": "cinema",
      "name": "AMC North Point Mall 12 & IMAX",
      "city": "Alpharetta",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Alpharetta · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.477692000000005,
        "h": 29.855643999999998,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.52559204000001,
        "mid": 80.21653800000001,
        "back": 120.324807,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.3 × 9.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_atlanta_regal_atlantic_station_and_imax",
      "canonicalId": "imax_us_ga_atlanta_regal_atlantic_station_and_imax",
      "kind": "cinema",
      "name": "Regal Atlantic Station & IMAX",
      "city": "Atlanta",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Atlanta · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 56.430448,
        "h": 31.824147999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.09448976,
        "mid": 84.64567199999999,
        "back": 126.968508,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.2 × 9.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_buford_regal_mall_of_georgia_and_imax",
      "canonicalId": "imax_us_ga_buford_regal_mall_of_georgia_and_imax",
      "kind": "cinema",
      "name": "Regal Mall of Georgia & IMAX",
      "city": "Buford",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Buford · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 81.364832,
        "h": 59.383204000000006,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 70.78740384000001,
        "mid": 122.04724800000001,
        "back": 183.070872,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.8 × 18.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_kennesaw_amc_barrett_commons_24_and_imax",
      "canonicalId": "imax_us_ga_kennesaw_amc_barrett_commons_24_and_imax",
      "kind": "cinema",
      "name": "AMC Barrett Commons 24 & IMAX",
      "city": "Kennesaw",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Kennesaw · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 30.839896,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 9.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_morrow_amc_southlake_pavilion_24_and_imax",
      "canonicalId": "imax_us_ga_morrow_amc_southlake_pavilion_24_and_imax",
      "kind": "cinema",
      "name": "AMC Southlake Pavilion 24 & IMAX",
      "city": "Morrow",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Morrow · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.398952,
        "h": 32.480316,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.80708824,
        "mid": 87.598428,
        "back": 131.397642,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.8 × 9.9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ga_pooler_royal_cinemas_and_imax",
      "canonicalId": "imax_us_ga_pooler_royal_cinemas_and_imax",
      "kind": "cinema",
      "name": "Royal Cinemas & IMAX",
      "city": "Pooler",
      "state": "GA",
      "stateName": "Georgia",
      "isPreset": false,
      "sub": "Pooler · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 101.04987200000001,
        "h": 76.115488,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 87.91338864000001,
        "mid": 151.57480800000002,
        "back": 227.36221200000003,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 30.8 × 23.2 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ia_waukee_the_palms_theatre_and_imax",
      "canonicalId": "imax_us_ia_waukee_the_palms_theatre_and_imax",
      "kind": "cinema",
      "name": "The Palms Theatre & IMAX",
      "city": "Waukee",
      "state": "IA",
      "stateName": "Iowa",
      "isPreset": false,
      "sub": "Waukee · 1.90 · IMAX GT Laser",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 92.22441239999999,
        "h": 48.6548572,
        "ar": 1.9,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 80.23523878799999,
        "mid": 138.33661859999998,
        "back": 207.50492789999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 28.11 × 14.83 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_id_boise_regal_edwards_boise_and_imax",
      "canonicalId": "imax_us_id_boise_regal_edwards_boise_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Boise & IMAX",
      "city": "Boise",
      "state": "ID",
      "stateName": "Idaho",
      "isPreset": false,
      "sub": "Boise · 1.90 · IMAX Laser XT",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 56.988190800000005,
        "h": 28.9698172,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 49.57972599600001,
        "mid": 85.4822862,
        "back": 128.22342930000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser XT",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_laser_xt",
        "display_name": "IMAX Laser XT"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.37 × 8.83 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_il_chicago_amc_roosevelt_collection_16_and_imax",
      "canonicalId": "imax_us_il_chicago_amc_roosevelt_collection_16_and_imax",
      "kind": "cinema",
      "name": "AMC Roosevelt Collection 16 & IMAX",
      "city": "Chicago",
      "state": "IL",
      "stateName": "Illinois",
      "isPreset": false,
      "sub": "Chicago · 1.90 · IMAX Laser XT",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 59.97375520000001,
        "h": 35.0393712,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 52.177167024000006,
        "mid": 89.96063280000001,
        "back": 134.9409492,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser XT",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_laser_xt",
        "display_name": "IMAX Laser XT"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.28 × 10.68 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_il_chicago_regal_city_north_and_imax",
      "canonicalId": "imax_us_il_chicago_regal_city_north_and_imax",
      "kind": "cinema",
      "name": "Regal City North & IMAX",
      "city": "Chicago",
      "state": "IL",
      "stateName": "Illinois",
      "isPreset": false,
      "sub": "Chicago · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 29.52756,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_in_indianapolis_imax_indiana_state_museum",
      "canonicalId": "imax_us_in_indianapolis_imax_indiana_state_museum",
      "kind": "cinema",
      "name": "IMAX, Indiana State Museum",
      "city": "Indianapolis",
      "state": "IN",
      "stateName": "Indiana",
      "isPreset": false,
      "sub": "Indianapolis · 1.43 · IMAX Digital",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 83.98950400000001,
        "h": 62.992127999999994,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 73.07086848000002,
        "mid": 125.98425600000002,
        "back": 188.97638400000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Digital",
        "light": "Dual Xenon",
        "resH": 2048,
        "resV": 1080,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "2K per projector (2048 × 1080); dual-stacked for brightness, not resolution",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 2500,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_dual_xenon",
        "display_name": "IMAX Digital"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 25.6 × 19.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_la_shreveport_the_goodman_imax_dome",
      "canonicalId": "goodman_imax_dome",
      "kind": "cinema",
      "name": "The Goodman IMAX Dome",
      "city": "Shreveport",
      "state": "LA",
      "stateName": "Louisiana",
      "isPreset": false,
      "sub": "Shreveport · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 60.039372,
        "h": 60.039372,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 30.019686,
        "mid": 30.019686,
        "back": 30.019686,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 18.30 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_ma_boston_amc_boston_common_19",
      "canonicalId": "imax_us_ma_boston_amc_boston_common_19",
      "kind": "cinema",
      "name": "AMC Boston Common 19",
      "city": "Boston",
      "state": "MA",
      "stateName": "Massachusetts",
      "isPreset": false,
      "sub": "Boston · 2.40 · IMAX CoLa",
      "tag": "IMAX 2.40",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 61.023624000000005,
        "h": 29.52756,
        "ar": 2.4,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 53.090552880000004,
        "mid": 91.535436,
        "back": 137.303154,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.6 × 9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ma_boston_mugar_omni_museum_of_science",
      "canonicalId": "mugar_omni_boston",
      "kind": "cinema",
      "name": "Mugar Omni, Museum of Science",
      "city": "Boston",
      "state": "MA",
      "stateName": "Massachusetts",
      "isPreset": false,
      "sub": "Boston · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 76.115488,
        "h": 76.115488,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 38.057744,
        "mid": 38.057744,
        "back": 38.057744,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 23.20 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_ma_methuen_amc_methuen_20_and_imax",
      "canonicalId": "imax_us_ma_methuen_amc_methuen_20_and_imax",
      "kind": "cinema",
      "name": "AMC Methuen 20 & IMAX",
      "city": "Methuen",
      "state": "MA",
      "stateName": "Massachusetts",
      "isPreset": false,
      "sub": "Methuen · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.805775999999994,
        "h": 30.839896,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.81102512,
        "mid": 80.708664,
        "back": 121.06299599999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.4 × 9.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ma_reading_sunbrella_imax_3d_theater_reading",
      "canonicalId": "imax_us_ma_reading_sunbrella_imax_3d_theater_reading",
      "kind": "cinema",
      "name": "Sunbrella IMAX 3D Theater Reading",
      "city": "Reading",
      "state": "MA",
      "stateName": "Massachusetts",
      "isPreset": false,
      "sub": "Reading · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances use a venue-specific GT estimate because the sparse CSV does not include row depth.",
      "screen": {
        "w": 84.317588,
        "h": 65.6168,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 40,
        "mid": 75,
        "back": 84,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 25.7 × 20 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Commercial GT estimate constrained by GSCA-style large-format geometry: back rows are roughly within one screen width; mid-row modeled at ~75 ft, not the generic 1.5× screen-width fallback."
        }
      }
    },
    {
      "id": "imax_us_ma_somerville_amc_assembly_row_12_and_imax",
      "canonicalId": "imax_us_ma_somerville_amc_assembly_row_12_and_imax",
      "kind": "cinema",
      "name": "AMC Assembly Row 12 & IMAX",
      "city": "Somerville",
      "state": "MA",
      "stateName": "Massachusetts",
      "isPreset": false,
      "sub": "Somerville · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.118112,
        "h": 30.839896,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.952757440000006,
        "mid": 82.67716800000001,
        "back": 124.015752,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.8 × 9.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_md_columbia_amc_columbia_14_and_imax",
      "canonicalId": "imax_us_md_columbia_amc_columbia_14_and_imax",
      "kind": "cinema",
      "name": "AMC Columbia 14 & IMAX",
      "city": "Columbia",
      "state": "MD",
      "stateName": "Maryland",
      "isPreset": false,
      "sub": "Columbia · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 23.950132,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 7.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_md_frederick_regal_westview_and_imax",
      "canonicalId": "imax_us_md_frederick_regal_westview_and_imax",
      "kind": "cinema",
      "name": "Regal Westview & IMAX",
      "city": "Frederick",
      "state": "MD",
      "stateName": "Maryland",
      "isPreset": false,
      "sub": "Frederick · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 46.916012,
        "h": 25.262468000000002,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 40.81693044,
        "mid": 70.374018,
        "back": 105.56102700000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 14.3 × 7.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_md_gaithersburg_amc_rio_cinemas_18_and_imax",
      "canonicalId": "imax_us_md_gaithersburg_amc_rio_cinemas_18_and_imax",
      "kind": "cinema",
      "name": "AMC Rio Cinemas 18 & IMAX",
      "city": "Gaithersburg",
      "state": "MD",
      "stateName": "Maryland",
      "isPreset": false,
      "sub": "Gaithersburg · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 44.947508,
        "h": 26.902887999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 39.104331959999996,
        "mid": 67.421262,
        "back": 101.13189299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 13.7 × 8.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_md_nottingham_amc_white_marsh_16_and_imax",
      "canonicalId": "imax_us_md_nottingham_amc_white_marsh_16_and_imax",
      "kind": "cinema",
      "name": "AMC White Marsh 16 & IMAX",
      "city": "Nottingham",
      "state": "MD",
      "stateName": "Maryland",
      "isPreset": false,
      "sub": "Nottingham · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 53.149608,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 46.24015896,
        "mid": 79.724412,
        "back": 119.586618,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.2 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_mi_detroit_chrysler_imax_dome_theatre_michigan_science_center",
      "canonicalId": "chrysler_imax_dome_theatre",
      "kind": "cinema",
      "name": "Chrysler IMAX Dome Theatre, Michigan Science Center",
      "city": "Detroit",
      "state": "MI",
      "stateName": "Michigan",
      "isPreset": false,
      "sub": "Detroit · Dome · IMAX 15/70 Film (Dome)",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 67.58530400000001,
        "h": 67.58530400000001,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 33.792652000000004,
        "mid": 33.792652000000004,
        "back": 33.792652000000004,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "film_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome 15/70",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "film_1570",
        "label": "IMAX 15/70 Film (Dome)",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": "~8.8K–11.7K scan-equivalent projected onto 80–86% hemisphere; center pixel density higher than periphery due to fisheye lens mapping",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 4500,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_film",
        "display_name": "IMAX 15/70 Film (Dome)"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX 15/70 Film (Dome)",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": "~8.8K–11.7K scan-equivalent projected onto 80–86% hemisphere; center pixel density higher than periphery due to fisheye lens mapping",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 4500,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_film",
        "display_name": "IMAX 15/70 Film (Dome)"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 20.60 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_mi_grand_rapids_celebration_cinema_grand_rapids_north_and_imax",
      "canonicalId": "imax_us_mi_grand_rapids_celebration_cinema_grand_rapids_north_and_imax",
      "kind": "cinema",
      "name": "Celebration! Cinema Grand Rapids North & IMAX",
      "city": "Grand Rapids",
      "state": "MI",
      "stateName": "Michigan",
      "isPreset": false,
      "sub": "Grand Rapids · 1.43 · IMAX Digital",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 69.88189200000001,
        "h": 52.821524000000004,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 60.797246040000005,
        "mid": 104.82283800000002,
        "back": 157.234257,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Digital",
        "light": "Dual Xenon",
        "resH": 2048,
        "resV": 1080,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "2K per projector (2048 × 1080); dual-stacked for brightness, not resolution",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 2500,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_dual_xenon",
        "display_name": "IMAX Digital"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX SR 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX SR 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.3 × 16.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_mn_roseville_amc_rosedale_14_and_imax",
      "canonicalId": "imax_us_mn_roseville_amc_rosedale_14_and_imax",
      "kind": "cinema",
      "name": "AMC Rosedale 14 & IMAX",
      "city": "Roseville",
      "state": "MN",
      "stateName": "Minnesota",
      "isPreset": false,
      "sub": "Roseville · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.509187999999995,
        "h": 28.871392000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.812993559999995,
        "mid": 77.26378199999999,
        "back": 115.89567299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.7 × 8.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_mn_st_paul_omnitheater_science_museum_of_minnesota",
      "canonicalId": "science_museum_minnesota_omnitheater",
      "kind": "cinema",
      "name": "Omnitheater Science Museum of Minnesota",
      "city": "St. Paul",
      "state": "MN",
      "stateName": "Minnesota",
      "isPreset": false,
      "sub": "St. Paul · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 89.895016,
        "h": 89.895016,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 44.947508,
        "mid": 44.947508,
        "back": 44.947508,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 27.40 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_mo_branson_branson_s_imax_entertainment_complex",
      "canonicalId": "imax_us_mo_branson_branson_s_imax_entertainment_complex",
      "kind": "cinema",
      "name": "Branson's IMAX - Entertainment Complex",
      "city": "Branson",
      "state": "MO",
      "stateName": "Missouri",
      "isPreset": false,
      "sub": "Branson · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 83.98950400000001,
        "h": 62.33596,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 73.07086848000002,
        "mid": 125.98425600000002,
        "back": 188.97638400000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 25.6 × 19 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_mo_kansas_city_amc_barry_woods_24_and_imax",
      "canonicalId": "imax_us_mo_kansas_city_amc_barry_woods_24_and_imax",
      "kind": "cinema",
      "name": "AMC Barry Woods 24 & IMAX",
      "city": "Kansas City",
      "state": "MO",
      "stateName": "Missouri",
      "isPreset": false,
      "sub": "Kansas City · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.070868,
        "h": 33.136483999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.521655159999995,
        "mid": 87.106302,
        "back": 130.65945299999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.7 × 10.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_mo_st_louis_omnimax_st_louis_science_center",
      "canonicalId": "saint_louis_science_center_omnimax",
      "kind": "cinema",
      "name": "OMNIMAX, St. Louis Science Center",
      "city": "St. Louis",
      "state": "MO",
      "stateName": "Missouri",
      "isPreset": false,
      "sub": "St. Louis · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 79.068244,
        "h": 79.068244,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 39.534122,
        "mid": 39.534122,
        "back": 39.534122,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 24.10 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_nc_charlotte_charlotte_imax_dome_theatre_at_discovery_place",
      "canonicalId": "charlotte_imax_dome_theatre",
      "kind": "cinema",
      "name": "Charlotte IMAX Dome Theatre at Discovery Place",
      "city": "Charlotte",
      "state": "NC",
      "stateName": "North Carolina",
      "isPreset": false,
      "sub": "Charlotte · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 79.068244,
        "h": 79.068244,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 39.534122,
        "mid": 39.534122,
        "back": 39.534122,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 24.10 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_nc_concord_amc_concord_mills_24_and_imax",
      "canonicalId": "imax_us_nc_concord_amc_concord_mills_24_and_imax",
      "kind": "cinema",
      "name": "AMC Concord Mills 24 & IMAX",
      "city": "Concord",
      "state": "NC",
      "stateName": "North Carolina",
      "isPreset": false,
      "sub": "Concord · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 48.228348,
        "h": 26.902887999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 41.958662759999996,
        "mid": 72.342522,
        "back": 108.51378299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 14.7 × 8.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nc_durham_amc_southpoint_17_and_imax",
      "canonicalId": "imax_us_nc_durham_amc_southpoint_17_and_imax",
      "kind": "cinema",
      "name": "AMC Southpoint 17 & IMAX",
      "city": "Durham",
      "state": "NC",
      "stateName": "North Carolina",
      "isPreset": false,
      "sub": "Durham · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 62.664044000000004,
        "h": 34.44882,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 54.517718280000004,
        "mid": 93.99606600000001,
        "back": 140.994099,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 19.1 × 10.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nc_fayetteville_amc_fayetteville_14_and_imax",
      "canonicalId": "imax_us_nc_fayetteville_amc_fayetteville_14_and_imax",
      "kind": "cinema",
      "name": "AMC Fayetteville 14 & IMAX",
      "city": "Fayetteville",
      "state": "NC",
      "stateName": "North Carolina",
      "isPreset": false,
      "sub": "Fayetteville · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 65.944884,
        "h": 35.761156,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 57.372049080000004,
        "mid": 98.917326,
        "back": 148.375989,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 20.1 × 10.9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nc_high_point_regal_palladium_and_imax",
      "canonicalId": "imax_us_nc_high_point_regal_palladium_and_imax",
      "kind": "cinema",
      "name": "Regal Palladium & IMAX",
      "city": "High Point",
      "state": "NC",
      "stateName": "North Carolina",
      "isPreset": false,
      "sub": "High Point · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 49.868767999999996,
        "h": 29.855643999999998,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.385828159999996,
        "mid": 74.803152,
        "back": 112.20472799999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.2 × 9.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nj_cherry_hill_amc_cherry_hill_24_and_imax",
      "canonicalId": "imax_us_nj_cherry_hill_amc_cherry_hill_24_and_imax",
      "kind": "cinema",
      "name": "AMC Cherry Hill 24 & IMAX",
      "city": "Cherry Hill",
      "state": "NJ",
      "stateName": "New Jersey",
      "isPreset": false,
      "sub": "Cherry Hill · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nj_clifton_amc_clifton_commons_16_and_imax",
      "canonicalId": "imax_us_nj_clifton_amc_clifton_commons_16_and_imax",
      "kind": "cinema",
      "name": "AMC Clifton Commons 16 & IMAX",
      "city": "Clifton",
      "state": "NJ",
      "stateName": "New Jersey",
      "isPreset": false,
      "sub": "Clifton · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 44.947508,
        "h": 23.950132,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 39.104331959999996,
        "mid": 67.421262,
        "back": 101.13189299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 13.7 × 7.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nj_new_brunswick_amc_new_brunswick_18_and_imax",
      "canonicalId": "imax_us_nj_new_brunswick_amc_new_brunswick_18_and_imax",
      "kind": "cinema",
      "name": "AMC New Brunswick 18 & IMAX",
      "city": "New Brunswick",
      "state": "NJ",
      "stateName": "New Jersey",
      "isPreset": false,
      "sub": "New Brunswick · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.398952,
        "h": 31.824147999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.80708824,
        "mid": 87.598428,
        "back": 131.397642,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.8 × 9.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nj_paramus_amc_garden_state_16_and_imax",
      "canonicalId": "imax_us_nj_paramus_amc_garden_state_16_and_imax",
      "kind": "cinema",
      "name": "AMC Garden State 16 & IMAX",
      "city": "Paramus",
      "state": "NJ",
      "stateName": "New Jersey",
      "isPreset": false,
      "sub": "Paramus · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 63.648295999999995,
        "h": 37.401576,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 55.374017519999995,
        "mid": 95.472444,
        "back": 143.208666,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 19.4 × 11.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nj_rockaway_amc_rockaway_16_and_imax",
      "canonicalId": "imax_us_nj_rockaway_amc_rockaway_16_and_imax",
      "kind": "cinema",
      "name": "AMC Rockaway 16 & IMAX",
      "city": "Rockaway",
      "state": "NJ",
      "stateName": "New Jersey",
      "isPreset": false,
      "sub": "Rockaway · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 30.183728,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 9.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nv_las_vegas_amc_town_square_18_and_imax",
      "canonicalId": "imax_us_nv_las_vegas_amc_town_square_18_and_imax",
      "kind": "cinema",
      "name": "AMC Town Square 18 & IMAX",
      "city": "Las Vegas",
      "state": "NV",
      "stateName": "Nevada",
      "isPreset": false,
      "sub": "Las Vegas · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 65.944884,
        "h": 37.073492,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 57.372049080000004,
        "mid": 98.917326,
        "back": 148.375989,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 20.1 × 11.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_nv_north_las_vegas_regal_aliante_and_imax",
      "canonicalId": "imax_us_nv_north_las_vegas_regal_aliante_and_imax",
      "kind": "cinema",
      "name": "Regal Aliante & IMAX",
      "city": "North Las Vegas",
      "state": "NV",
      "stateName": "Nevada",
      "isPreset": false,
      "sub": "North Las Vegas · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 33.136483999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 10.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_albany_regal_crossgates_and_imax",
      "canonicalId": "imax_us_ny_albany_regal_crossgates_and_imax",
      "kind": "cinema",
      "name": "Regal Crossgates & IMAX",
      "city": "Albany",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Albany · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 26.902887999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 8.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_deer_park_regal_deer_park_and_imax",
      "canonicalId": "imax_us_ny_deer_park_regal_deer_park_and_imax",
      "kind": "cinema",
      "name": "Regal Deer Park & IMAX",
      "city": "Deer Park",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Deer Park · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 49.868767999999996,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.385828159999996,
        "mid": 74.803152,
        "back": 112.20472799999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.2 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_new_rochelle_regal_new_roc_and_imax",
      "canonicalId": "imax_us_ny_new_rochelle_regal_new_roc_and_imax",
      "kind": "cinema",
      "name": "Regal New Roc & IMAX",
      "city": "New Rochelle",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "New Rochelle · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 81.364832,
        "h": 59.383204000000006,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 70.78740384000001,
        "mid": 122.04724800000001,
        "back": 183.070872,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.8 × 18.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_new_york_amc_34th_street_14_and_imax",
      "canonicalId": "imax_us_ny_new_york_amc_34th_street_14_and_imax",
      "kind": "cinema",
      "name": "AMC 34th Street 14 & IMAX",
      "city": "New York",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "New York · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 54.13386,
        "h": 30.183728,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.0964582,
        "mid": 81.20079,
        "back": 121.801185,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.5 × 9.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_new_york_amc_empire_25_and_imax",
      "canonicalId": "imax_us_ny_new_york_amc_empire_25_and_imax",
      "kind": "cinema",
      "name": "AMC Empire 25 & IMAX",
      "city": "New York",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "New York · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.070868,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.521655159999995,
        "mid": 87.106302,
        "back": 130.65945299999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.7 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_new_york_amc_kips_bay_15_and_imax",
      "canonicalId": "imax_us_ny_new_york_amc_kips_bay_15_and_imax",
      "kind": "cinema",
      "name": "AMC Kips Bay 15 & IMAX",
      "city": "New York",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "New York · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 60.039372,
        "h": 27.559056,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 52.23425364,
        "mid": 90.059058,
        "back": 135.088587,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.3 × 8.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_new_york_amc_lincoln_square_13_and_imax",
      "canonicalId": "imax_us_ny_new_york_amc_lincoln_square_13_and_imax",
      "kind": "cinema",
      "name": "AMC Lincoln Square 13 & IMAX",
      "city": "New York",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "New York · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 100.9842552,
        "h": 75.59055359999999,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 87.856302024,
        "mid": 151.4763828,
        "back": 227.21457420000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 30.78 × 23.04 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_rochester_cinemark_tinseltown_rochester_and_imax",
      "canonicalId": "imax_us_ny_rochester_cinemark_tinseltown_rochester_and_imax",
      "kind": "cinema",
      "name": "Cinemark Tinseltown Rochester and IMAX",
      "city": "Rochester",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Rochester · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 69.88189200000001,
        "h": 52.821524000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 60.797246040000005,
        "mid": 104.82283800000002,
        "back": 157.234257,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX SR 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX SR 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.3 × 16.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_staten_island_amc_staten_island_11_and_imax",
      "canonicalId": "imax_us_ny_staten_island_amc_staten_island_11_and_imax",
      "kind": "cinema",
      "name": "AMC Staten Island 11 & IMAX",
      "city": "Staten Island",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Staten Island · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.118112,
        "h": 30.839896,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.952757440000006,
        "mid": 82.67716800000001,
        "back": 124.015752,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.8 × 9.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_stony_brook_amc_stony_brook_17_and_imax",
      "canonicalId": "imax_us_ny_stony_brook_amc_stony_brook_17_and_imax",
      "kind": "cinema",
      "name": "AMC Stony Brook 17 & IMAX",
      "city": "Stony Brook",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Stony Brook · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ny_syracuse_regal_destiny_usa_and_imax",
      "canonicalId": "imax_us_ny_syracuse_regal_destiny_usa_and_imax",
      "kind": "cinema",
      "name": "Regal Destiny USA & IMAX",
      "city": "Syracuse",
      "state": "NY",
      "stateName": "New York",
      "isPreset": false,
      "sub": "Syracuse · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 69.88189200000001,
        "h": 38.057744,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 60.797246040000005,
        "mid": 104.82283800000002,
        "back": 157.234257,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.3 × 11.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_oh_cincinnati_robert_d_lindner_family_omnimax_theater",
      "canonicalId": "lindner_family_omnimax",
      "kind": "cinema",
      "name": "Robert D. Lindner Family OMNIMAX Theater",
      "city": "Cincinnati",
      "state": "OH",
      "stateName": "Ohio",
      "isPreset": false,
      "sub": "Cincinnati · Dome · IMAX Laser for Dome",
      "tag": "IMAX Dome",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.",
      "screen": {
        "w": 72.17848,
        "h": 72.17848,
        "ar": 1,
        "geometry": "hemispherical",
        "domeCoveragePct": 0.83,
        "domeHFov": 180,
        "domeVFov": 125
      },
      "seat": {
        "front": 36.08924,
        "mid": 36.08924,
        "back": 36.08924,
        "source": "community_estimate"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_dome_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Dome Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser for Dome",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "4K DCI digital projection with dome anamorphic/fisheye optics; no 15/70 scan-equivalent film resolution claim.",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_dome_laser",
        "display_name": "IMAX Laser for Dome"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — dome diameter 22.00 m; height normalized from CSV when needed."
        },
        "brightness": {
          "q": "community_estimate",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "unknown",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "community_estimate",
          "note": "Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics."
        }
      }
    },
    {
      "id": "imax_us_oh_columbus_lennox_town_center_and_imax",
      "canonicalId": "imax_us_oh_columbus_lennox_town_center_and_imax",
      "kind": "cinema",
      "name": "Lennox Town Center & IMAX",
      "city": "Columbus",
      "state": "OH",
      "stateName": "Ohio",
      "isPreset": false,
      "sub": "Columbus · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 58.070868,
        "h": 30.183728,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 50.521655159999995,
        "mid": 87.106302,
        "back": 130.65945299999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.7 × 9.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_ok_moore_regal_warren_moore_and_imax",
      "canonicalId": "imax_us_ok_moore_regal_warren_moore_and_imax",
      "kind": "cinema",
      "name": "Regal Warren Moore & IMAX",
      "city": "Moore",
      "state": "OK",
      "stateName": "Oklahoma",
      "isPreset": false,
      "sub": "Moore · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 80.05249599999999,
        "h": 60.039372,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 69.64567152,
        "mid": 120.07874399999999,
        "back": 180.118116,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.4 × 18.3 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_pa_bensalem_amc_neshaminy_24_and_imax",
      "canonicalId": "imax_us_pa_bensalem_amc_neshaminy_24_and_imax",
      "kind": "cinema",
      "name": "AMC Neshaminy 24 & IMAX",
      "city": "Bensalem",
      "state": "PA",
      "stateName": "Pennsylvania",
      "isPreset": false,
      "sub": "Bensalem · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 60.039372,
        "h": 32.152232000000005,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 52.23425364,
        "mid": 90.059058,
        "back": 135.088587,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.3 × 9.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_pa_king_of_prussia_regal_ua_king_of_prussia_and_imax",
      "canonicalId": "imax_us_pa_king_of_prussia_regal_ua_king_of_prussia_and_imax",
      "kind": "cinema",
      "name": "Regal UA King of Prussia & IMAX",
      "city": "King of Prussia",
      "state": "PA",
      "stateName": "Pennsylvania",
      "isPreset": false,
      "sub": "King of Prussia · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 73.162732,
        "h": 52.165356,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 63.651576840000004,
        "mid": 109.74409800000001,
        "back": 164.616147,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 22.3 × 15.9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_pa_warrington_regal_warrington_crossing_and_imax",
      "canonicalId": "imax_us_pa_warrington_regal_warrington_crossing_and_imax",
      "kind": "cinema",
      "name": "Regal Warrington Crossing & IMAX",
      "city": "Warrington",
      "state": "PA",
      "stateName": "Pennsylvania",
      "isPreset": false,
      "sub": "Warrington · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.837272,
        "h": 26.902887999999997,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.09842664,
        "mid": 77.755908,
        "back": 116.633862,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.8 × 8.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_pa_west_homestead_amc_waterfront_22_and_imax",
      "canonicalId": "imax_us_pa_west_homestead_amc_waterfront_22_and_imax",
      "kind": "cinema",
      "name": "AMC Waterfront 22 & IMAX",
      "city": "West Homestead",
      "state": "PA",
      "stateName": "Pennsylvania",
      "isPreset": false,
      "sub": "West Homestead · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.196852,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.67126124,
        "mid": 75.295278,
        "back": 112.942917,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.3 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tn_chattanooga_imax_3d_tennessee_aquarium",
      "canonicalId": "imax_us_tn_chattanooga_imax_3d_tennessee_aquarium",
      "kind": "cinema",
      "name": "IMAX 3D, Tennessee Aquarium",
      "city": "Chattanooga",
      "state": "TN",
      "stateName": "Tennessee",
      "isPreset": false,
      "sub": "Chattanooga · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 87.27034400000001,
        "h": 68.89764,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 75.92519928,
        "mid": 130.905516,
        "back": 196.35827400000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 26.6 × 21 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tn_franklin_amc_thoroughbred_20_and_imax",
      "canonicalId": "imax_us_tn_franklin_amc_thoroughbred_20_and_imax",
      "kind": "cinema",
      "name": "AMC Thoroughbred 20 & IMAX",
      "city": "Franklin",
      "state": "TN",
      "stateName": "Tennessee",
      "isPreset": false,
      "sub": "Franklin · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 69.225724,
        "h": 38.057744,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 60.226379879999996,
        "mid": 103.83858599999999,
        "back": 155.757879,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.1 × 11.6 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tn_knoxville_regal_pinnacle_and_imax",
      "canonicalId": "imax_us_tn_knoxville_regal_pinnacle_and_imax",
      "kind": "cinema",
      "name": "Regal Pinnacle & IMAX",
      "city": "Knoxville",
      "state": "TN",
      "stateName": "Tennessee",
      "isPreset": false,
      "sub": "Knoxville · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 61.023624000000005,
        "h": 36.745408,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 53.090552880000004,
        "mid": 91.535436,
        "back": 137.303154,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 18.6 × 11.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tn_nashville_regal_opry_mills_and_imax",
      "canonicalId": "imax_us_tn_nashville_regal_opry_mills_and_imax",
      "kind": "cinema",
      "name": "Regal Opry Mills & IMAX",
      "city": "Nashville",
      "state": "TN",
      "stateName": "Tennessee",
      "isPreset": false,
      "sub": "Nashville · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 89.895016,
        "h": 65.6168,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 78.20866391999999,
        "mid": 134.842524,
        "back": 202.26378599999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX GT3D 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX GT3D 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 27.4 × 20 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_austin_imax_the_bullock_texas_state_history_museum",
      "canonicalId": "imax_us_tx_austin_imax_the_bullock_texas_state_history_museum",
      "kind": "cinema",
      "name": "IMAX, The Bullock Texas State History Museum",
      "city": "Austin",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Austin · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 82.349084,
        "h": 62.33596,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 71.64370308000001,
        "mid": 123.52362600000001,
        "back": 185.285439,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 25.1 × 19 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_austin_regal_gateway_and_imax",
      "canonicalId": "imax_us_tx_austin_regal_gateway_and_imax",
      "kind": "cinema",
      "name": "Regal Gateway & IMAX",
      "city": "Austin",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Austin · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 49.868767999999996,
        "h": 29.52756,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 43.385828159999996,
        "mid": 74.803152,
        "back": 112.20472799999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.2 × 9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_dallas_amc_northpark_15_and_imax",
      "canonicalId": "imax_us_tx_dallas_amc_northpark_15_and_imax",
      "kind": "cinema",
      "name": "AMC Northpark 15 & IMAX",
      "city": "Dallas",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Dallas · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 65.6168,
        "h": 36.417324,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 57.086616,
        "mid": 98.42519999999999,
        "back": 147.6378,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 20 × 11.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_dallas_cinemark_dallas_and_imax",
      "canonicalId": "imax_us_tx_dallas_cinemark_dallas_and_imax",
      "kind": "cinema",
      "name": "Cinemark Dallas & IMAX",
      "city": "Dallas",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Dallas · 1.43 · IMAX Digital",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 70.866144,
        "h": 52.821524000000004,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 61.65354528,
        "mid": 106.299216,
        "back": 159.448824,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": true,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "film_143",
          "ar": 1.43,
          "label": "1.43 · 15/70mm Film",
          "enabled": true,
          "isBookingDependent": true,
          "isFilmMode": true,
          "projection": "film"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Digital",
        "light": "Dual Xenon",
        "resH": 2048,
        "resV": 1080,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "2K per projector (2048 × 1080); dual-stacked for brightness, not resolution",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 2500,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_dual_xenon",
        "display_name": "IMAX Digital"
      },
      "filmProjection": {
        "id": "film_1570",
        "label": "IMAX SR 15/70 mm",
        "light": "Xenon (Film)",
        "resH": null,
        "resV": null,
        "scanEquivLow": 8800,
        "scanEquivHigh": 11700,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": null,
        "nativeContrast": null,
        "isPerPixelEmissive": false,
        "hdrCategory": "photochemical",
        "hdrLabel": "Photochemical latitude",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_1570_film",
        "display_name": "IMAX SR 15/70 mm"
      },
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.6 × 16.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_frisco_amc_stonebriar_24_and_imax",
      "canonicalId": "imax_us_tx_frisco_amc_stonebriar_24_and_imax",
      "kind": "cinema",
      "name": "AMC Stonebriar 24 & IMAX",
      "city": "Frisco",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Frisco · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.165356,
        "h": 28.871392000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.383859720000004,
        "mid": 78.248034,
        "back": 117.372051,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.9 × 8.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_houston_amc_willowbrook_24_and_imax",
      "canonicalId": "imax_us_tx_houston_amc_willowbrook_24_and_imax",
      "kind": "cinema",
      "name": "AMC Willowbrook 24 & IMAX",
      "city": "Houston",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Houston · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 56.102364,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 48.80905668,
        "mid": 84.153546,
        "back": 126.23031900000001,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 17.1 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_houston_regal_edwards_houston_marq_e_and_imax",
      "canonicalId": "imax_us_tx_houston_regal_edwards_houston_marq_e_and_imax",
      "kind": "cinema",
      "name": "Regal Edwards Houston Marq*E & IMAX",
      "city": "Houston",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Houston · 1.43 · IMAX CoLa",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 75.131236,
        "h": 57.08661599999999,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 65.36417532,
        "mid": 112.696854,
        "back": 169.045281,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 22.9 × 17.4 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_san_antonio_amc_rivercenter_11_and_imax_auditorium_11",
      "canonicalId": "imax_us_tx_san_antonio_amc_rivercenter_11_and_imax_auditorium_11",
      "kind": "cinema",
      "name": "AMC Rivercenter 11 & IMAX (Auditorium 11)",
      "city": "San Antonio",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "San Antonio · 1.43 · IMAX Digital",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 69.88189200000001,
        "h": 52.821524000000004,
        "ar": 1.43,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 60.797246040000005,
        "mid": 104.82283800000002,
        "back": 157.234257,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Digital",
        "light": "Dual Xenon",
        "resH": 2048,
        "resV": 1080,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "2K per projector (2048 × 1080); dual-stacked for brightness, not resolution",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 2500,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_dual_xenon",
        "display_name": "IMAX Digital"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 21.3 × 16.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_tx_shenandoah_amc_metropark_10_and_imax",
      "canonicalId": "imax_us_tx_shenandoah_amc_metropark_10_and_imax",
      "kind": "cinema",
      "name": "AMC Metropark 10 & IMAX",
      "city": "Shenandoah",
      "state": "TX",
      "stateName": "Texas",
      "isPreset": false,
      "sub": "Shenandoah · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.49344,
        "h": 32.8084,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.6692928,
        "mid": 78.74016,
        "back": 118.11024,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16 × 10 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_alexandria_amc_hoffman_center_22_and_imax",
      "canonicalId": "imax_us_va_alexandria_amc_hoffman_center_22_and_imax",
      "kind": "cinema",
      "name": "AMC Hoffman Center 22 & IMAX",
      "city": "Alexandria",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "Alexandria · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 50.85302,
        "h": 27.88714,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.2421274,
        "mid": 76.27953,
        "back": 114.419295,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.5 × 8.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_ashburn_regal_fox_and_imax",
      "canonicalId": "imax_us_va_ashburn_regal_fox_and_imax",
      "kind": "cinema",
      "name": "Regal Fox & IMAX",
      "city": "Ashburn",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "Ashburn · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 55.118112,
        "h": 31.16798,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 47.952757440000006,
        "mid": 82.67716800000001,
        "back": 124.015752,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16.8 × 9.5 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_chantilly_airbus_imax_steven_f_udvar_hazy_center",
      "canonicalId": "imax_us_va_chantilly_airbus_imax_steven_f_udvar_hazy_center",
      "kind": "cinema",
      "name": "Airbus IMAX, Steven F. Udvar-Hazy Center",
      "city": "Chantilly",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "Chantilly · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 85.629924,
        "h": 62.33596,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 74.49803388000001,
        "mid": 128.444886,
        "back": 192.667329,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 26.1 × 19 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_mclean_amc_tysons_corner_16_and_imax",
      "canonicalId": "imax_us_va_mclean_amc_tysons_corner_16_and_imax",
      "kind": "cinema",
      "name": "AMC Tysons Corner 16 & IMAX",
      "city": "McLean",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "McLean · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 64.960632,
        "h": 40.026247999999995,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 56.515749840000005,
        "mid": 97.440948,
        "back": 146.16142200000002,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 19.8 × 12.2 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_virginia_beach_amc_lynnhaven_18_and_imax",
      "canonicalId": "imax_us_va_virginia_beach_amc_lynnhaven_18_and_imax",
      "kind": "cinema",
      "name": "AMC Lynnhaven 18 & IMAX",
      "city": "Virginia Beach",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "Virginia Beach · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.837272,
        "h": 29.855643999999998,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.09842664,
        "mid": 77.755908,
        "back": 116.633862,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.8 × 9.1 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_va_woodbridge_amc_potomac_mills_18_and_imax",
      "canonicalId": "imax_us_va_woodbridge_amc_potomac_mills_18_and_imax",
      "kind": "cinema",
      "name": "AMC Potomac Mills 18 & IMAX",
      "city": "Woodbridge",
      "state": "VA",
      "stateName": "Virginia",
      "isPreset": false,
      "sub": "Woodbridge · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 52.49344,
        "h": 29.52756,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.6692928,
        "mid": 78.74016,
        "back": 118.11024,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 16 × 9 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_wa_kent_amc_kent_station_14_and_imax",
      "canonicalId": "imax_us_wa_kent_amc_kent_station_14_and_imax",
      "kind": "cinema",
      "name": "AMC Kent Station 14 & IMAX",
      "city": "Kent",
      "state": "WA",
      "stateName": "Washington",
      "isPreset": false,
      "sub": "Kent · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.509187999999995,
        "h": 28.871392000000004,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 44.812993559999995,
        "mid": 77.26378199999999,
        "back": 115.89567299999999,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.7 × 8.8 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_wa_lynnwood_amc_alderwood_mall_16_and_imax",
      "canonicalId": "imax_us_wa_lynnwood_amc_alderwood_mall_16_and_imax",
      "kind": "cinema",
      "name": "AMC Alderwood Mall 16 & IMAX",
      "city": "Lynnwood",
      "state": "WA",
      "stateName": "Washington",
      "isPreset": false,
      "sub": "Lynnwood · 1.90 · IMAX CoLa",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 62.992127999999994,
        "h": 35.104988,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 54.803151359999994,
        "mid": 94.488192,
        "back": 141.73228799999998,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX CoLa",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_cola",
        "display_name": "IMAX CoLa"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 19.2 × 10.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_wa_seattle_boeing_imax_pacific_science_center",
      "canonicalId": "imax_us_wa_seattle_boeing_imax_pacific_science_center",
      "kind": "cinema",
      "name": "Boeing IMAX, Pacific Science Center",
      "city": "Seattle",
      "state": "WA",
      "stateName": "Washington",
      "isPreset": false,
      "sub": "Seattle · 1.43 · IMAX GT Laser",
      "tag": "IMAX 1.43",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 80.05249599999999,
        "h": 59.383204000000006,
        "ar": 1.43,
        "geometry": "slight_curve",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 69.64567152,
        "mid": 120.07874399999999,
        "back": 180.118116,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.43,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_143",
          "ar": 1.43,
          "label": "1.43 · IMAX Laser",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX GT Laser",
        "light": "Dual RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": "~5.8K sampling equivalent (√2 × 4096, half-pixel offset — illustrative, not official IMAX spec)",
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 8000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.43,
        "type": "imax_gt_dual_laser",
        "display_name": "IMAX GT Laser"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 24.4 × 18.1 m."
        },
        "brightness": {
          "q": "trade_reporting",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "imax_us_wa_tukwila_amc_southcenter_16_and_imax",
      "canonicalId": "imax_us_wa_tukwila_amc_southcenter_16_and_imax",
      "kind": "cinema",
      "name": "AMC Southcenter 16 & IMAX",
      "city": "Tukwila",
      "state": "WA",
      "stateName": "Washington",
      "isPreset": false,
      "sub": "Tukwila · 1.90 · IMAX Laser XT",
      "tag": "IMAX 1.90",
      "blurb": "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.",
      "screen": {
        "w": 51.837272,
        "h": 28.543307999999996,
        "ar": 1.9,
        "geometry": "flat",
        "domeCoveragePct": null,
        "domeHFov": null,
        "domeVFov": null
      },
      "seat": {
        "front": 45.09842664,
        "mid": 77.755908,
        "back": 116.633862,
        "source": "derived_from_screen_width"
      },
      "defaultPresentationAr": 1.9,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "digital_190",
          "ar": 1.9,
          "label": "1.90 · IMAX Digital",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_239",
          "ar": 2.39,
          "label": "2.39 · Scope",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        },
        {
          "id": "digital_185",
          "ar": 1.85,
          "label": "1.85 · Flat",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "digital"
        }
      ],
      "projection": {
        "id": "digital",
        "label": "IMAX Laser XT",
        "light": "RGB Laser",
        "resH": 4096,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": 22,
        "brightness_nits_full": null,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "sdr",
        "hdrLabel": "—",
        "hdrDynamic": null,
        "min_ar": 1.9,
        "type": "imax_laser_xt",
        "display_name": "IMAX Laser XT"
      },
      "filmProjection": null,
      "commercialFilms": true,
      "sources": {
        "screen": {
          "q": "r_imax_csv",
          "note": "143190.xyz CSV — 15.8 × 8.7 m."
        },
        "brightness": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "contrast": {
          "q": "published_cto",
          "note": "Format average inherited from the matching canonical projection preset."
        },
        "seat": {
          "q": "derived_from_screen_width",
          "note": "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers."
        }
      }
    },
    {
      "id": "oled_flagship_65",
      "canonicalId": "oled_flagship_65",
      "kind": "home",
      "name": "OLED Flagship 65\"",
      "sub": "LG G5 / Samsung S95F tier · living room",
      "tag": "Home OLED",
      "blurb": "Per-pixel infinite contrast, peak HDR far exceeds any cinema. But the screen is fundamentally tiny — total visible area is a fraction of even a multiplex.",
      "screen": {
        "w": 4.71928047327078,
        "h": 2.651281164758865,
        "ar": 1.78,
        "geometry": "flat"
      },
      "seat": {
        "front": 4,
        "mid": 6,
        "back": 9,
        "source": "typical_living_room"
      },
      "defaultPresentationAr": 1.78,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "native_178",
          "ar": 1.78,
          "label": "1.78 · 16:9 native",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "scope_239",
          "ar": 2.39,
          "label": "2.39 · Scope letterbox",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "flat_185",
          "ar": 1.85,
          "label": "1.85 · Flat letterbox",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "16:9 TV panel cannot show 1.43 natively — content would be pillarboxed heavily",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        }
      ],
      "projection": {
        "id": "woled",
        "label": "MLA WOLED · per-pixel emissive",
        "light": "Per-pixel OLED",
        "resH": 3840,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": 331,
        "nativeContrast": null,
        "isPerPixelEmissive": true,
        "hdrCategory": "dolby_vision",
        "hdrLabel": "Dolby Vision / HDR10",
        "hdrDynamic": null,
        "min_ar": 0
      },
      "filmProjection": null,
      "sources": {
        "screen": {
          "q": "manufacturer_spec",
          "note": "65\" WOLED — 56.7\" × 31.9\" active area."
        },
        "brightness": {
          "q": "rtings_measurement",
          "note": "RTINGS: ~331 nits full-field. Cinema comparison uses full-field."
        },
        "contrast": {
          "q": "manufacturer_spec",
          "note": "Per-pixel OLED — true infinite contrast."
        },
        "seat": {
          "q": "typical_living_room",
          "note": "6 ft typical viewing, THX recommended ~4 ft for 65\" 4K."
        }
      }
    },
    {
      "id": "miniled_75",
      "canonicalId": "miniled_75",
      "kind": "home",
      "name": "Mini-LED 75\" QLED",
      "sub": "Samsung QN90D tier · living room",
      "tag": "Mini-LED",
      "blurb": "Brighter than OLED on full-field — ~201 fL vs ~97 fL. Zone-based local dimming gives halos. No Dolby Vision (Samsung policy). HDR10/HDR10+ only.",
      "screen": {
        "w": 5.449232490686114,
        "h": 3.0613665678011874,
        "ar": 1.78,
        "geometry": "flat"
      },
      "seat": {
        "front": 5,
        "mid": 7,
        "back": 10,
        "source": "typical_living_room"
      },
      "defaultPresentationAr": 1.78,
      "isHybrid": false,
      "presentationModes": [
        {
          "id": "native_178",
          "ar": 1.78,
          "label": "1.78 · 16:9 native",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "scope_239",
          "ar": 2.39,
          "label": "2.39 · Scope letterbox",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "flat_185",
          "ar": 1.85,
          "label": "1.85 · Flat letterbox",
          "enabled": true,
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        },
        {
          "id": "disabled_143",
          "ar": 1.43,
          "label": "1.43 · IMAX full frame",
          "enabled": false,
          "disabledReason": "16:9 TV panel cannot show 1.43 natively",
          "isBookingDependent": false,
          "isFilmMode": false,
          "projection": "display"
        }
      ],
      "projection": {
        "id": "miniled_lcd",
        "label": "Mini-LED LCD · zone dimming",
        "light": "Mini-LED Backlight",
        "resH": 3840,
        "resV": 2160,
        "scanEquivLow": null,
        "scanEquivHigh": null,
        "scanEquivLabel": null,
        "brightness_fl": null,
        "brightness_nits_full": 689,
        "nativeContrast": 10000,
        "isPerPixelEmissive": false,
        "hdrCategory": "hdr10",
        "hdrLabel": "HDR10",
        "hdrDynamic": null,
        "min_ar": 0
      },
      "filmProjection": null,
      "sources": {
        "screen": {
          "q": "manufacturer_spec",
          "note": "75\" Mini-LED — 65.4\" × 36.7\" active."
        },
        "brightness": {
          "q": "rtings_measurement",
          "note": "~689 nits full-field on QN90D-tier panel (RTINGS)."
        },
        "contrast": {
          "q": "manufacturer_spec",
          "note": "Zone local dimming ~10,000:1. No Dolby Vision (Samsung policy)."
        },
        "seat": {
          "q": "typical_living_room",
          "note": "7 ft typical for 75\" 4K."
        }
      }
    }
  ],
  "contentFormats": [
    {
      "id": "imax_143",
      "ar": 1.43,
      "label": "IMAX 1.43:1",
      "phrase": "tallest",
      "note": "Oppenheimer (2023) / Dunkirk (2017) / Interstellar (2014) / The Dark Knight (2008)"
    },
    {
      "id": "imax_190",
      "ar": 1.9,
      "label": "1.90 · IMAX Digital",
      "phrase": "tall",
      "note": "The standard IMAX digital frame for CoLa and dual-xenon IMAX venues. Taller than 16:9 but narrower than 1.43:1. Also used for IMAX Enhanced home releases."
    },
    {
      "id": "scope_239",
      "ar": 2.39,
      "label": "Anamorphic Scope 2.39:1",
      "phrase": "wide",
      "note": "Dune: Part Two (2024) / The Batman (2022) / Avatar: Fire and Ash (2025)"
    },
    {
      "id": "flat_185",
      "ar": 1.85,
      "label": "Standard Flat 1.85:1",
      "phrase": "standard cinema",
      "note": "The standard flat widescreen format. Near-full use of screen width on standard screens. Used for many dramas and comedies that don't shoot anamorphic."
    },
    {
      "id": "tv_178",
      "ar": 1.78,
      "label": "16:9 / TV Native",
      "phrase": "TV",
      "note": "The native aspect ratio of all 16:9 televisions and most streaming content. Fills the TV screen entirely. Wider than IMAX Digital (1.90:1) on a TV, but has far less total area than any cinema screen."
    },
    {
      "id": "pana_220",
      "ar": 2.2,
      "label": "65mm / Panavision 2.20:1",
      "phrase": "",
      "note": "Oppenheimer dialogue sequences (2023) / No Time to Die (2021)"
    }
  ],
  "qualityMeta": {
    "published_official": {
      "label": "Official spec",
      "tier": 1
    },
    "published_cto": {
      "label": "Official spec",
      "tier": 1
    },
    "manufacturer_spec": {
      "label": "Official spec",
      "tier": 1
    },
    "rtings_measurement": {
      "label": "Measured (RTINGS)",
      "tier": 1
    },
    "r_imax_csv": {
      "label": "143190.xyz",
      "tier": 2
    },
    "trade_reporting": {
      "label": "Trade reporting",
      "tier": 2
    },
    "preset_typical": {
      "label": "Format avg.",
      "tier": 3
    },
    "community_estimate": {
      "label": "Community estimate",
      "tier": 3
    },
    "derived": {
      "label": "Derived estimate",
      "tier": 3
    },
    "derived_from_screen_width": {
      "label": "Derived estimate",
      "tier": 3
    },
    "typical_living_room": {
      "label": "Derived estimate",
      "tier": 3
    },
    "frontend_comparison_record": {
      "label": "Format avg.",
      "tier": 3
    },
    "unknown": {
      "label": "Unknown",
      "tier": 3
    }
  }
};
