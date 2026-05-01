// LIEMAX v3 prototype data layer.
// Specs sourced from src/data/ JSON files (venues, presets, home_display_presets).
// Shape is a superset of the V2 mockup, adding presentation modes, hybrid toggle,
// contrast split (nativeContrast / hdrCategory), and film projection mode.
//
// ComparisonRow shape mirrors src/compare/types.ts:
//   { id, label, aDisplay, bDisplay, winner, badgeLabel, note? }
//   winner: 'a' | 'b' | 'tie' | 'unknown'

window.LIEMAX_DATA = (function () {

  // ─── Projection definitions ──────────────────────────────────────────────────

  const proj_cola_digital = {
    id: "digital",
    label: "IMAX CoLa Digital · 4K RGB laser",
    light: "RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 22.0, brightness_nits_full: null,
    nativeContrast: 10000,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.90,
  };

  const proj_1570_film = {
    id: "film_1570",
    label: "IMAX 15/70mm Film · Xenon",
    light: "Xenon (Film)",
    resH: null, resV: null,
    scanEquivLow: 8800, scanEquivHigh: 11700,
    scanEquivLabel: "~8.8K–11.7K scan-equiv.",
    brightness_fl: 22.0, brightness_nits_full: null,
    nativeContrast: 4500,
    isPerPixelEmissive: false,
    hdrCategory: "photochemical",
    hdrLabel: "Photochemical latitude",
    hdrDynamic: null,
    min_ar: 1.43,
  };

  const proj_gt_dual_laser = {
    id: "digital",
    label: "IMAX GT Dual Laser · 4K × 2",
    light: "Dual RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 22.0, brightness_nits_full: null,
    nativeContrast: 8000,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.43,
  };

  const proj_imax_dual_xenon = {
    id: "digital",
    label: "IMAX Dual Xenon Digital",
    light: "Dual Xenon",
    resH: 2048, resV: 1080,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 22.0, brightness_nits_full: null,
    nativeContrast: 2500,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.90,
  };

  const proj_imax_dome_laser = {
    id: "digital",
    label: "IMAX Dome Laser Digital",
    light: "RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 22.0, brightness_nits_full: null,
    nativeContrast: null,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.43,
  };

  const proj_imax_digital_generic = {
    id: "digital",
    label: "IMAX digital projection · details unknown",
    light: "Unknown",
    resH: null, resV: null,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: null, brightness_nits_full: null,
    nativeContrast: null,
    isPerPixelEmissive: false,
    hdrCategory: "unknown",
    hdrLabel: "Unknown",
    hdrDynamic: null,
    min_ar: 1.90,
  };

  const proj_dolby_dual_laser = {
    id: "digital",
    label: "Christie E3LH Dual 4K Laser",
    light: "Dual RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 31.0, brightness_nits_full: null,
    nativeContrast: 6250,
    isPerPixelEmissive: false,
    hdrCategory: "dolby_vision",
    hdrLabel: "Dolby Vision dynamic (1,000,000:1)",
    hdrDynamic: 1000000,
    min_ar: 1.85,
  };

  const proj_dolby_single_laser = {
    id: "digital",
    label: "Christie Eclipse Single 4K Laser",
    light: "RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 31.0, brightness_nits_full: null,
    nativeContrast: 6250,
    isPerPixelEmissive: false,
    hdrCategory: "dolby_vision",
    hdrLabel: "Dolby Vision dynamic (20,000,000:1)",
    hdrDynamic: 20000000,
    min_ar: 1.85,
  };

  const proj_cinemark_xd = {
    id: "digital",
    label: "Cinemark XD 4K Barco Laser",
    light: "RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 16.0, brightness_nits_full: null,
    nativeContrast: 2000,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.90,
  };

  const proj_standard_4k = {
    id: "digital",
    label: "4K Digital Cinema · RGB laser",
    light: "RGB Laser",
    resH: 4096, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: 14.0, brightness_nits_full: null,
    nativeContrast: 2000,
    isPerPixelEmissive: false,
    hdrCategory: "sdr",
    hdrLabel: "—",
    hdrDynamic: null,
    min_ar: 1.85,
  };

  const proj_oled_flagship = {
    id: "oled",
    label: "MLA WOLED · per-pixel emissive",
    light: "Per-pixel OLED",
    resH: 3840, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: null, brightness_nits_full: 331,   // full-field; math.js converts
    nativeContrast: null,          // OLED = ∞, handled in buildRows
    isPerPixelEmissive: true,
    hdrCategory: "dolby_vision",
    hdrLabel: "Dolby Vision / HDR10",
    hdrDynamic: null,              // per-pixel — not a dynamic system number
    min_ar: 0,
  };

  const proj_miniled = {
    id: "miniled",
    label: "Mini-LED LCD · zone dimming",
    light: "Mini-LED Backlight",
    resH: 3840, resV: 2160,
    scanEquivLow: null, scanEquivHigh: null, scanEquivLabel: null,
    brightness_fl: null, brightness_nits_full: 689,   // full-field
    nativeContrast: 10000,
    isPerPixelEmissive: false,
    hdrCategory: "hdr10plus",
    hdrLabel: "HDR10+",
    hdrDynamic: null,
    min_ar: 0,
  };

  // ─── 143190.xyz U.S. IMAX import snapshot ───────────────────────────────────

  const STATE_NAMES = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
    CA: "California", CO: "Colorado", CT: "Connecticut", DC: "District of Columbia",
    DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii",
    IA: "Iowa", ID: "Idaho", IL: "Illinois", IN: "Indiana",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", MA: "Massachusetts",
    MD: "Maryland", ME: "Maine", MI: "Michigan", MN: "Minnesota",
    MO: "Missouri", MS: "Mississippi", MT: "Montana", NC: "North Carolina",
    ND: "North Dakota", NE: "Nebraska", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NV: "Nevada", NY: "New York", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
    SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
    UT: "Utah", VA: "Virginia", VT: "Vermont", WA: "Washington",
    WI: "Wisconsin", WV: "West Virginia", WY: "Wyoming",
  };

  const FT_PER_M = 3.281;

  function parseAspectRatio(value) {
    if (value == null || value === "") return null;
    const text = String(value).trim();
    const ratio = text.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
    if (ratio) return Number(ratio[1]) / Number(ratio[2]);
    const number = Number(text.replace(/[^\d.]/g, ""));
    return Number.isFinite(number) ? number : null;
  }

  function fmtAr(ar) {
    return ar == null ? "Unknown" : ar.toFixed(2);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function hasFilm(label) {
    return typeof label === "string" && label.trim() && !/^no$|^none$|^n\/?a$/i.test(label.trim());
  }

  function isFilm143(label) {
    return hasFilm(label) && /dome|omni|15\s*\/?\s*70|1570|70\s*mm/i.test(label);
  }

  function projectorForLabel(label) {
    const raw = (label || "").trim();
    let base = proj_imax_digital_generic;
    let projectorType = "generic";
    let short = "unknown digital";

    if (/dome|omni/i.test(raw) && /laser/i.test(raw)) {
      base = proj_imax_dome_laser;
      projectorType = "dome_laser";
      short = "Dome Laser";
    } else if (/gt|dual\s*laser/i.test(raw)) {
      base = proj_gt_dual_laser;
      projectorType = "gt_dual_laser";
      short = "GT Laser";
    } else if (/cola|commercial\s*laser/i.test(raw)) {
      base = proj_cola_digital;
      projectorType = "cola";
      short = "CoLa digital";
    } else if (/xenon|digital/i.test(raw) && !/laser/i.test(raw)) {
      base = proj_imax_dual_xenon;
      projectorType = "dual_xenon";
      short = "Dual Xenon";
    }

    return {
      projection: { ...base, label: raw || base.label },
      projectorType,
      short,
    };
  }

  function is143Compatible(screenAr, screenLabel, projectorType, maxDigitalAr) {
    const approved = projectorType === "gt_dual_laser" || projectorType === "dome_laser";
    const compatibleGeometry = projectorType === "dome_laser" || /dome/i.test(screenLabel) || (screenAr != null && screenAr <= 1.45);
    const sourceAllows143 = maxDigitalAr != null && maxDigitalAr <= 1.43;
    return approved && compatibleGeometry && sourceAllows143;
  }

  function sourcesForProjection(projectorType) {
    if (projectorType === "generic") {
      return {
        brightness: { q: "unknown", note: "Projector label is not specific enough to inherit format brightness." },
        contrast: { q: "unknown", note: "Projector label is not specific enough to inherit format contrast." },
      };
    }
    return {
      brightness: { q: "preset_typical", note: "Format average inherited from the matching IMAX projection preset." },
      contrast: { q: "preset_typical", note: "Format average inherited from the matching IMAX projection preset." },
    };
  }

  function generatedPresentationModes(defaultAr, digital143, hasFilm143Mode) {
    const modes = [];
    if (digital143) {
      modes.push({ id: "digital_143", ar: 1.43, label: "1.43 · IMAX Laser", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" });
    }
    modes.push(
      { id: "digital_190", ar: 1.90, label: "1.90 · IMAX Digital", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
      { id: "digital_239", ar: 2.39, label: "2.39 · Scope", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
      { id: "digital_185", ar: 1.85, label: "1.85 · Flat", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" }
    );
    if (hasFilm143Mode) {
      modes.push({ id: "film_143", ar: 1.43, label: "1.43 · 15/70mm Film", enabled: true, isBookingDependent: true, isFilmMode: true, projection: "film" });
    }
    return modes;
  }

  const generatedVenueOverrides = {
    "MA|Reading|Sunbrella IMAX 3D Theater Reading": {
      blurb: "Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances use a venue-specific GT estimate because the sparse CSV does not include row depth.",
      seat: {
        front: 40,
        mid: 75,
        back: 84,
        source: "community_estimate",
      },
      sources: {
        seat: { q: "community_estimate", note: "Commercial GT estimate constrained by GSCA-style large-format geometry: back rows are roughly within one screen width; mid-row modeled at ~75 ft, not the generic 1.5× screen-width fallback." },
      },
    },
  };

  function applyGeneratedVenueOverride(venue, rowKey) {
    const override = generatedVenueOverrides[rowKey];
    if (!override) return venue;
    return {
      ...venue,
      ...override,
      sources: {
        ...venue.sources,
        ...(override.sources || {}),
      },
    };
  }

  function buildGeneratedImaxVenue(row) {
    const [state, city, name, screenArLabel, digitalLabel, maxDigitalArLabel, filmLabel, screenHeightM, screenWidthM, commercialFilms] = row;
    const screenAr = parseAspectRatio(screenArLabel);
    const maxDigitalAr = parseAspectRatio(maxDigitalArLabel);
    const { projection, projectorType, short } = projectorForLabel(digitalLabel);
    const digital143 = is143Compatible(screenAr, screenArLabel, projectorType, maxDigitalAr);
    const film143 = isFilm143(filmLabel);
    const defaultPresentationAr = digital143 ? 1.43 : 1.90;
    const w = screenWidthM * FT_PER_M;
    const h = screenHeightM * FT_PER_M;
    const stateName = STATE_NAMES[state] || state;
    const sourceProjection = sourcesForProjection(projectorType);
    const geometry = /dome/i.test(screenArLabel) ? "hemispherical" : (screenAr != null && screenAr <= 1.45) ? "slight_curve" : "flat";

    const rowKey = `${state}|${city}|${name}`;
    const venue = {
      id: `imax_us_${state.toLowerCase()}_${slugify(`${city}_${name}`)}`,
      kind: "cinema",
      name,
      city,
      state,
      stateName,
      sub: `${city} · ${fmtAr(screenAr)} · ${short}`,
      tag: /dome/i.test(screenArLabel) ? "IMAX Dome" : `IMAX ${fmtAr(screenAr)}`,
      blurb: `Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.`,
      screen: { w, h, ar: screenAr, geometry },
      seat: {
        front: w * 0.87,
        mid: w * 1.5,
        back: w * 2.25,
        source: "derived_from_screen_width",
      },
      defaultPresentationAr,
      isHybrid: film143,
      presentationModes: generatedPresentationModes(defaultPresentationAr, digital143, film143),
      projection,
      filmProjection: film143 ? { ...proj_1570_film, label: filmLabel } : null,
      commercialFilms: commercialFilms === "Yes",
      sources: {
        screen: { q: "r_imax_csv", note: `143190.xyz CSV (Apr 2026) — ${screenWidthM} × ${screenHeightM} m.` },
        brightness: sourceProjection.brightness,
        contrast: sourceProjection.contrast,
        seat: { q: "derived_from_screen_width", note: "Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers." },
      },
    };

    return applyGeneratedVenueOverride(venue, rowKey);
  }

  const imaxCsvRows = [
    ["AZ","Grand Canyon","Grand Canyon IMAX, Grand Canyon Visitor Center","1.43:1","IMAX GT Laser","1.43:1","No",18,23.8,"No"],
    ["AZ","Phoenix","AMC Deer Valley 30 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.7,15.6,"Yes"],
    ["AZ","Tempe","Harkins Arizona Mills 25 & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX GT3D 15/70 mm",18.3,24.4,"Yes"],
    ["CA","Aliso Viejo","Regal Edwards Aliso Viejo & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.4,16.5,"Yes"],
    ["CA","Alhambra","Regal Edwards Alhambra Renaissance & IMAX","1.90:1","IMAX Laser XT","1.90:1","No",10.1,15.4,"Yes"],
    ["CA","Arcadia","AMC Santa Anita 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.1,15.9,"Yes"],
    ["CA","Burbank","AMC Burbank 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.3,19.2,"Yes"],
    ["CA","City of Industry","AMC Puente 20 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.1,17.4,"Yes"],
    ["CA","Dublin","Regal Hacienda Crossings & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX GT3D 15/70 mm",17,23.28,"Yes"],
    ["CA","Emeryville","AMC Bay Street 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.8,15.1,"Yes"],
    ["CA","Glendale","AMC The Americana at Brand 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.4,15.7,"Yes"],
    ["CA","Hollywood","TCL Chinese Theatres IMAX","1.90:1","IMAX GT Laser","1.90:1","IMAX SR 15/70 mm, (2D Only)(Temporary)",14,28.7,"Yes"],
    ["CA","Irvine","Regal Edwards Irvine Spectrum & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX 15/70 mm",20.6,26.8,"Yes"],
    ["CA","Long Beach","Regal Edwards Long Beach & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.3,16.5,"Yes"],
    ["CA","Los Angeles","AMC Century City 15 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,16.8,"Yes"],
    ["CA","Los Angeles","AMC The Grove & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.6,16.9,"Yes"],
    ["CA","Los Angeles","IMAX, California Science Center","1.43:1","IMAX GT Laser","1.43:1","No",20.3,27.4,"No"],
    ["CA","Montclair","AMC DINE-IN Montclair 12 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.14,17.28,"Yes"],
    ["CA","National City","AMC Plaza Bonita 14 & IMAX","1.90:1","IMAX Laser XT","1.90:1","No",10,15.5,"Yes"],
    ["CA","Newark","AMC Newpark 12 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.2,18.5,"Yes"],
    ["CA","Ontario","Regal Edwards Ontario Palace & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX GT3D 15/70 mm",20.4,27.1,"Yes"],
    ["CA","Orange","AMC 30 at the Block & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.8,17.4,"Yes"],
    ["CA","Sacramento","Esquire IMAX Theatre","1.43:1","IMAX Digital","1.90:1","IMAX GT3D 15/70 mm",18,23.1,"Yes"],
    ["CA","San Diego","AMC Palm Promenade 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.9,17.7,"Yes"],
    ["CA","San Diego","Regal Edwards Mira Mesa & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.97,17.52,"Yes"],
    ["CA","San Francisco","AMC Metreon 16 & IMAX","1.43:1","IMAX GT Laser","1.43:1","IMAX GT3D 15/70 mm",23,29.8,"Yes"],
    ["CA","Santa Clara","AMC Mercado 20 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,17.4,"Yes"],
    ["CA","Santa Clarita","Regal Edwards Valencia & IMAX","1.90:1","IMAX CoLa","1.90:1","No",12.5,20.9,"Yes"],
    ["CA","South Gate","Regal Edwards South Gate & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.3,17.7,"Yes"],
    ["CA","Stockton","Regal Stockton City Centre & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.6,16.1,"Yes"],
    ["CA","Temecula","Regal Edwards Temecula & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.2,15.5,"Yes"],
    ["CA","Torrance","AMC Del Amo 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.8,15.9,"Yes"],
    ["CA","Tustin","AMC Tustin @ The District & IMAX","1.90:1","IMAX CoLa","1.90:1","No",6.92,14.23,"Yes"],
    ["CA","Universal City","Universal Cinema AMC at CityWalk Hollywood & IMAX","1.43:1","IMAX GT Laser","1.43:1","IMAX GT3D 15/70 mm",17.7,24.1,"Yes"],
    ["CO","Denver","AMC Orchard 12 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10,15.6,"Yes"],
    ["CO","Denver","AMC Westminster Promenade 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.6,15.9,"Yes"],
    ["CO","Highlands Ranch","AMC Highlands Ranch 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.6,17.5,"Yes"],
    ["CT","Milford","Cinemark Connecticut Post 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.1,18.2,"Yes"],
    ["DC","Washington","AMC Georgetown 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",7,13.7,"Yes"],
    ["DC","Washington","Lockheed Martin IMAX, National Air & Space Museum","1.43:1","IMAX GT Laser","1.43:1","No",14,23,"Yes"],
    ["FL","Altamonte Springs","AMC Altamonte Mall 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.7,15.8,"Yes"],
    ["FL","Aventura","AMC Aventura 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.3,16.9,"Yes"],
    ["FL","Delray Beach","EVO Entertainment Delray Beach + IMAX","1.90:1","IMAX CoLa","1.90:1","No",16.8,25.9,"Yes"],
    ["FL","Fort Lauderdale","Autonation IMAX, Museum of Discovery & Science","1.43:1","IMAX GT Laser","1.43:1","IMAX GT3D 15/70 mm",18.3,24.4,"Yes"],
    ["FL","Fort Myers","Regal Gulf Coast & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.7,16.3,"Yes"],
    ["FL","Miami","CMX Dolphin 19 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.2,16.2,"Yes"],
    ["FL","Miami","Regal Kendall Village & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,16.3,"Yes"],
    ["FL","Pembroke Pines","AMC Pembroke Lakes 9 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.3,18.4,"Yes"],
    ["FL","Tampa","AMC Veterans 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.8,16.6,"Yes"],
    ["GA","Alpharetta","AMC North Point Mall 12 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.1,16.3,"Yes"],
    ["GA","Atlanta","Regal Atlantic Station & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.7,17.2,"Yes"],
    ["GA","Buford","Regal Mall of Georgia & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX GT3D 15/70 mm",18.1,24.8,"Yes"],
    ["GA","Kennesaw","AMC Barrett Commons 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.4,16.5,"Yes"],
    ["GA","Morrow","AMC Southlake Pavilion 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.9,17.8,"Yes"],
    ["GA","Pooler","Royal Cinemas & IMAX","1.43:1","IMAX GT Laser","1.43:1","No",23.2,30.8,"Yes"],
    ["IA","Waukee","The Palms Theatre & IMAX","1.90:1","IMAX GT Laser","1.90:1","No",14.83,28.11,"Yes"],
    ["ID","Boise","Regal Edwards Boise & IMAX","1.90:1","IMAX Laser XT","1.90:1","No",8.83,17.37,"Yes"],
    ["IL","Chicago","AMC Roosevelt Collection 16 & IMAX","1.90:1","IMAX Laser XT","1.90:1","No",10.68,18.28,"Yes"],
    ["IL","Chicago","Regal City North & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9,15.5,"Yes"],
    ["IN","Indianapolis","IMAX, Indiana State Museum","1.43:1","IMAX Digital","1.90:1","IMAX GT3D 15/70 mm",19.2,25.6,"Yes"],
    ["MA","Boston","AMC Boston Common 19","2.40:1","IMAX CoLa","1.90:1","No",9,18.6,"Yes"],
    ["MA","Methuen","AMC Methuen 20 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.4,16.4,"Yes"],
    ["MA","Reading","Sunbrella IMAX 3D Theater Reading","1.43:1","IMAX GT Laser","1.43:1","No",20,25.7,"Yes"],
    ["MA","Somerville","AMC Assembly Row 12 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.4,16.8,"Yes"],
    ["MD","Columbia","AMC Columbia 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",7.3,15.9,"Yes"],
    ["MD","Frederick","Regal Westview & IMAX","1.90:1","IMAX CoLa","1.90:1","No",7.7,14.3,"Yes"],
    ["MD","Gaithersburg","AMC Rio Cinemas 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.2,13.7,"Yes"],
    ["MD","Nottingham","AMC White Marsh 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,16.2,"Yes"],
    ["MI","Grand Rapids","Celebration! Cinema Grand Rapids North & IMAX","1.43:1","IMAX Digital","1.90:1","IMAX SR 15/70 mm",16.1,21.3,"Yes"],
    ["MN","Roseville","AMC Rosedale 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.8,15.7,"Yes"],
    ["MO","Branson","Branson's IMAX - Entertainment Complex","1.43:1","IMAX GT Laser","1.43:1","No",19,25.6,"Yes"],
    ["MO","Kansas City","AMC Barry Woods 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.1,17.7,"Yes"],
    ["NC","Concord","AMC Concord Mills 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.2,14.7,"Yes"],
    ["NC","Durham","AMC Southpoint 17 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.5,19.1,"Yes"],
    ["NC","Fayetteville","AMC Fayetteville 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.9,20.1,"Yes"],
    ["NC","High Point","Regal Palladium & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.1,15.2,"Yes"],
    ["NJ","Cherry Hill","AMC Cherry Hill 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,16.5,"Yes"],
    ["NJ","Clifton","AMC Clifton Commons 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",7.3,13.7,"Yes"],
    ["NJ","New Brunswick","AMC New Brunswick 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.7,17.8,"Yes"],
    ["NJ","Paramus","AMC Garden State 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.4,19.4,"Yes"],
    ["NJ","Rockaway","AMC Rockaway 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.2,16.5,"Yes"],
    ["NV","Las Vegas","AMC Town Square 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.3,20.1,"Yes"],
    ["NV","North Las Vegas","Regal Aliante & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.1,15.5,"Yes"],
    ["NY","Albany","Regal Crossgates & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.2,15.5,"Yes"],
    ["NY","Deer Park","Regal Deer Park & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,15.2,"Yes"],
    ["NY","New Rochelle","Regal New Roc & IMAX","1.43:1","IMAX CoLa","1.90:1","No",18.1,24.8,"Yes"],
    ["NY","New York","AMC 34th Street 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.2,16.5,"Yes"],
    ["NY","New York","AMC Empire 25 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,17.7,"Yes"],
    ["NY","New York","AMC Kips Bay 15 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.4,18.3,"Yes"],
    ["NY","New York","AMC Lincoln Square 13 & IMAX","1.43:1","IMAX GT Laser","1.43:1","IMAX GT3D 15/70 mm",23.04,30.78,"Yes"],
    ["NY","Rochester","Cinemark Tinseltown Rochester and IMAX","1.90:1","IMAX CoLa","1.43:1","IMAX SR 15/70 mm",16.1,21.3,"Yes"],
    ["NY","Staten Island","AMC Staten Island 11 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.4,16.8,"Yes"],
    ["NY","Stony Brook","AMC Stony Brook 17 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,15.9,"Yes"],
    ["NY","Syracuse","Regal Destiny USA & IMAX","1.90:1","IMAX CoLa","1.90","No",11.6,21.3,"Yes"],
    ["OH","Columbus","Lennox Town Center & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.2,17.7,"Yes"],
    ["OK","Moore","Regal Warren Moore & IMAX","1.43:1","IMAX CoLa","1.90:1","No",18.3,24.4,"Yes"],
    ["PA","Bensalem","AMC Neshaminy 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.8,18.3,"Yes"],
    ["PA","King of Prussia","Regal UA King of Prussia & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX 15/70 mm",15.9,22.3,"Yes"],
    ["PA","Warrington","Regal Warrington Crossing & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.2,15.8,"Yes"],
    ["PA","West Homestead","AMC Waterfront 22 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,15.3,"Yes"],
    ["TN","Chattanooga","IMAX 3D, Tennessee Aquarium","1.43:1","IMAX GT Laser","1.43:1","No",21,26.6,"Yes"],
    ["TN","Franklin","AMC Thoroughbred 20 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.6,21.1,"Yes"],
    ["TN","Knoxville","Regal Pinnacle & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.2,18.6,"Yes"],
    ["TN","Nashville","Regal Opry Mills & IMAX","1.43:1","IMAX CoLa","1.90:1","IMAX GT3D 15/70 mm",20,27.4,"Yes"],
    ["TX","Austin","IMAX, The Bullock Texas State History Museum","1.43:1","IMAX GT Laser","1.43:1","No",19,25.1,"Yes"],
    ["TX","Austin","Regal Gateway & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9,15.2,"Yes"],
    ["TX","Dallas","AMC Northpark 15 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",11.1,20,"Yes"],
    ["TX","Dallas","Cinemark Dallas & IMAX","1.43:1","IMAX Digital","1.90:1","IMAX SR 15/70 mm",16.1,21.6,"Yes"],
    ["TX","Frisco","AMC Stonebriar 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.8,15.9,"Yes"],
    ["TX","Houston","AMC Willowbrook 24 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,17.1,"Yes"],
    ["TX","Houston","Regal Edwards Houston Marq*E & IMAX","1.43:1","IMAX CoLa","1.90:1","No",17.4,22.9,"Yes"],
    ["TX","San Antonio","AMC Rivercenter 11 & IMAX (Auditorium 11)","1.43:1","IMAX Digital","1.90:1","No",16.1,21.3,"Yes"],
    ["TX","Shenandoah","AMC Metropark 10 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10,16,"Yes"],
    ["VA","Alexandria","AMC Hoffman Center 22 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.5,15.5,"Yes"],
    ["VA","Ashburn","Regal Fox & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.5,16.8,"Yes"],
    ["VA","Chantilly","Airbus IMAX, Steven F. Udvar-Hazy Center","1.43:1","IMAX GT Laser","1.43:1","No",19,26.1,"Yes"],
    ["VA","McLean","AMC Tysons Corner 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",12.2,19.8,"Yes"],
    ["VA","Virginia Beach","AMC Lynnhaven 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9.1,15.8,"Yes"],
    ["VA","Woodbridge","AMC Potomac Mills 18 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",9,16,"Yes"],
    ["WA","Kent","AMC Kent Station 14 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",8.8,15.7,"Yes"],
    ["WA","Lynnwood","AMC Alderwood Mall 16 & IMAX","1.90:1","IMAX CoLa","1.90:1","No",10.7,19.2,"Yes"],
    ["WA","Seattle","Boeing IMAX, Pacific Science Center","1.43:1","IMAX GT Laser","1.43:1","No",18.1,24.4,"Yes"],
    ["WA","Tukwila","AMC Southcenter 16 & IMAX","1.90:1","IMAX Laser XT","1.90:1","No",8.7,15.8,"Yes"],
  ];

  const generatedImaxVenues = imaxCsvRows.map(buildGeneratedImaxVenue);

  // ─── Venues ──────────────────────────────────────────────────────────────────

  const venues = [

    // 1 ── Apple Cinemas Providence Place IMAX ────────────────────────────────
    {
      id: "apple_providence_imax",
      kind: "cinema",
      name: "Apple Cinemas Providence IMAX",
      city: "Providence",
      state: "RI",
      stateName: "Rhode Island",
      sub: "Providence, RI · 1.43 screen · CoLa digital",
      tag: "IMAX 1.43",
      blurb: "Physical 1.43:1 screen; daily projection is CoLa at 1.90 — loses ~25% of vertical frame on 1.43 content. 15/70 film installed for occasional booked engagements.",
      screen: { w: 81.04, h: 56.76, ar: 1.43, geometry: "slight_curve" },
      // Derived from screen width (no published row distances in 143190.xyz or venue data).
      // Front ≈ 0.5×w, mid ≈ 0.83×w, back ≈ 1.17×w
      seat: { front: 40, mid: 67, back: 95, source: "derived_from_screen_width" },
      defaultPresentationAr: 1.90,
      isHybrid: true,
      presentationModes: [
        { id: "digital_190", ar: 1.90, label: "1.90 · IMAX Digital", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope",        enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",         enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "film_143",    ar: 1.43, label: "1.43 · 15/70mm Film", enabled: true, isBookingDependent: true,  isFilmMode: true,  projection: "film" },
      ],
      projection: proj_cola_digital,
      filmProjection: proj_1570_film,
      sources: {
        screen:     { q: "r_imax_csv",         note: "143190.xyz CSV (Apr 2026) — 24.7 × 17.3 m." },
        brightness: { q: "trade_reporting",     note: "IMAX calibration target 22 fL; per-venue fL not published." },
        contrast:   { q: "trade_reporting",     note: "IMAX CTO Bonnick, CinemaCon 2018." },
        seat:       { q: "derived",             note: "Front/mid/back derived from screen width — no published row distances." },
      },
    },

    // 2 ── IMAX GT Dual Laser (typical) ───────────────────────────────────────
    {
      id: "imax_gt_typical",
      kind: "cinema",
      name: "IMAX GT Laser (typical)",
      city: "",
      state: "Format presets",
      stateName: "Format presets",
      isPreset: true,
      sub: "Format preset · true 1.43 · dual 4K pixel-offset",
      tag: "IMAX GT",
      blurb: "Dual-projector pixel-offset supersampling on a purpose-built 1.43:1 screen. ~42 commercial venues globally. The only IMAX format that shows 1.43 digitally without film.",
      screen: { w: 70, h: 49, ar: 1.43, geometry: "slight_curve" },
      seat: { front: 35, mid: 58, back: 82, source: "derived_from_screen_width" },
      defaultPresentationAr: 1.43,
      isHybrid: false,
      presentationModes: [
        { id: "digital_143", ar: 1.43, label: "1.43 · Full IMAX",    enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_190", ar: 1.90, label: "1.90 · IMAX Digital", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope",        enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",         enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
      ],
      projection: proj_gt_dual_laser,
      filmProjection: null,
      sources: {
        screen:     { q: "preset_typical",  note: "Representative GT auditorium — real venues vary by location." },
        brightness: { q: "trade_reporting", note: "IMAX target 22 fL." },
        contrast:   { q: "published_cto",   note: "~8,000:1 sequential; IMAX CTO statements and trade reporting." },
        seat:       { q: "derived",         note: "Derived from typical GT auditorium ratios." },
      },
    },

    // 3 ── Dolby Cinema (typical AMC) ─────────────────────────────────────────
    {
      id: "dolby_cinema_typical",
      kind: "cinema",
      name: "Dolby Cinema (typical AMC)",
      city: "",
      state: "Format presets",
      stateName: "Format presets",
      isPreset: true,
      sub: "2.39 · dual 4K laser · Dolby Vision",
      tag: "Dolby Cinema",
      blurb: "Dual 4K laser with Dolby Vision — the deepest sequential blacks of any commercial cinema format. ~295 locations. Narrower frame than IMAX; wins on contrast and HDR, not size.",
      screen: { w: 55, h: 23, ar: 2.39, geometry: "flat" },
      seat: { front: 28, mid: 46, back: 65, source: "derived_from_screen_width" },
      defaultPresentationAr: 2.39,
      isHybrid: false,
      presentationModes: [
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope",        enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",         enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "Dolby Cinema cannot show 1.43 — screen is 2.39:1 wide format", isBookingDependent: false, isFilmMode: false, projection: "digital" },
      ],
      projection: proj_dolby_dual_laser,
      filmProjection: null,
      sources: {
        screen:     { q: "trade_reporting",    note: "Typical Dolby Cinema auditorium (55 ft wide)." },
        brightness: { q: "community_estimate", note: "~31 fL from firsthand AMC Dolby Cinema reports, May 2025." },
        contrast:   { q: "trade_reporting",    note: "Sequential ~6,250:1; dynamic 1,000,000:1 Dolby Vision claim." },
        seat:       { q: "derived",            note: "Derived from typical auditorium ratios." },
      },
    },

    // 4 ── Dolby Cinema (Christie Eclipse, 2025+) ─────────────────────────────
    {
      id: "dolby_cinema_single_laser",
      kind: "cinema",
      name: "Dolby Cinema (Christie Eclipse, 2025+)",
      city: "",
      state: "Format presets",
      stateName: "Format presets",
      isPreset: true,
      sub: "2.39 · single 4K laser · Dolby Vision 20M:1 dynamic",
      tag: "Dolby Cinema",
      blurb: "New-build Dolby Cinema system rolling out from May 2025 onward. Uses Christie Eclipse single-laser projection with the same Dolby Vision workflow and a much higher dynamic-contrast ceiling.",
      screen: { w: 58, h: 24.3, ar: 2.39, geometry: "flat" },
      seat: { front: 29, mid: 49, back: 68, source: "derived_from_screen_width" },
      defaultPresentationAr: 2.39,
      isHybrid: false,
      presentationModes: [
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope",        enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",         enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "Dolby Cinema cannot show 1.43 — screen is a wide-format auditorium", isBookingDependent: false, isFilmMode: false, projection: "digital" },
      ],
      projection: proj_dolby_single_laser,
      filmProjection: null,
      sources: {
        screen:     { q: "trade_reporting",    note: "Christie Eclipse Dolby builds support screens up to ~58 ft wide." },
        brightness: { q: "community_estimate", note: "~31 fL from early 2025 reports and Dolby's >2× typical-cinema brightness claim." },
        contrast:   { q: "trade_reporting",    note: "Christie Eclipse lists up to 20,000,000:1 dynamic contrast; sequential kept comparable to Dolby Cinema baseline." },
        seat:       { q: "derived",            note: "Derived from typical Dolby auditorium ratios; venue rows will override when known." },
      },
    },

    // 5 ── Cinemark XD ────────────────────────────────────────────────────────
    {
      id: "cinemark_xd",
      kind: "cinema",
      name: "Cinemark XD",
      city: "",
      state: "Format presets",
      stateName: "Format presets",
      isPreset: true,
      sub: "1.90 · Barco 4K laser · Auro 11.1",
      tag: "Cinemark XD",
      blurb: "Cinemark's large-format auditorium: about 70 ft corner-to-corner on a 1.90:1 screen, Barco 4K projection, and Auro 11.1/AuroMax audio. Scope films letterbox; there is no expanded IMAX-format content.",
      screen: { w: 64.5, h: 34.0, ar: 1.90, geometry: "flat" },
      seat: { front: 33, mid: 54, back: 76, source: "derived_from_screen_width" },
      defaultPresentationAr: 1.90,
      isHybrid: false,
      presentationModes: [
        { id: "digital_190", ar: 1.90, label: "1.90 · XD / Flat", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope",     enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",      enabled: true, isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "Cinemark XD is not an IMAX 1.43-capable format", isBookingDependent: false, isFilmMode: false, projection: "digital" },
      ],
      projection: proj_cinemark_xd,
      filmProjection: null,
      sources: {
        screen:     { q: "derived",           note: "Face dimensions derived from Cinemark's ~70 ft corner-to-corner XD claim at 1.90:1." },
        brightness: { q: "community_estimate", note: "~16 fL derived from Barco SP4K-15C/20B specs and XD screen geometry." },
        contrast:   { q: "trade_reporting",   note: "2,000:1 floor; current Barco SP4K-15C laser installs can reach ~2,700:1." },
        seat:       { q: "derived",           note: "Derived from typical large multiplex auditorium ratios." },
      },
    },

    // 6 ── Standard Multiplex ─────────────────────────────────────────────────
    {
      id: "standard_multiplex",
      kind: "cinema",
      name: "Standard Multiplex",
      city: "",
      state: "Format presets",
      stateName: "Format presets",
      isPreset: true,
      sub: "Mainstream 4K digital auditorium",
      tag: "Standard",
      blurb: "The baseline — DCI 4K at 14 fL with 2,000:1 contrast. Everything premium is measured against this.",
      // Dimensions from standard_multiplex.json default_screen
      screen: { w: 45.0, h: 24.3, ar: 1.85, geometry: "flat" },
      seat: { front: 23, mid: 37, back: 53, source: "derived_from_screen_width" },
      defaultPresentationAr: 1.85,
      isHybrid: false,
      presentationModes: [
        { id: "digital_185", ar: 1.85, label: "1.85 · Flat",  enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "digital_239", ar: 2.39, label: "2.39 · Scope", enabled: true,  isBookingDependent: false, isFilmMode: false, projection: "digital" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "Standard multiplex has no IMAX-wide screen or projector", isBookingDependent: false, isFilmMode: false, projection: "digital" },
      ],
      projection: proj_standard_4k,
      filmProjection: null,
      sources: {
        screen:     { q: "preset_typical",    note: "Mid-size auditorium from standard_multiplex preset (45 × 24.3 ft)." },
        brightness: { q: "derived",           note: "DCI minimum 14 fL." },
        contrast:   { q: "published_official", note: "DCI Spec v1.0 minimum 2,000:1." },
        seat:       { q: "derived",           note: "Stadium seating mid-row derived." },
      },
    },

    ...generatedImaxVenues,

    // 7 ── OLED Flagship 65" ──────────────────────────────────────────────────
    {
      id: "oled_flagship_65",
      kind: "home",
      name: "OLED Flagship 65\"",
      sub: "LG G5 / Samsung S95F tier · living room",
      tag: "Home OLED",
      blurb: "Per-pixel infinite contrast, peak HDR far exceeds any cinema. But the screen is fundamentally tiny — total visible area is a fraction of even a multiplex.",
      // 65\" at 1.78:1: width = 56.67\" = 4.72 ft; height = 31.84\" = 2.65 ft
      screen: { w: 4.72, h: 2.65, ar: 1.78, geometry: "flat" },
      seat: { front: 4, mid: 6, back: 9, source: "typical_living_room" },
      defaultPresentationAr: 1.78,
      isHybrid: false,
      presentationModes: [
        { id: "native_178",  ar: 1.78, label: "1.78 · 16:9 native",         enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "scope_239",   ar: 2.39, label: "2.39 · Scope letterbox",      enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "flat_185",    ar: 1.85, label: "1.85 · Flat letterbox",       enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "16:9 TV panel cannot show 1.43 natively — content would be pillarboxed heavily", isBookingDependent: false, isFilmMode: false, projection: "display" },
      ],
      projection: proj_oled_flagship,
      filmProjection: null,
      sources: {
        screen:     { q: "manufacturer_spec",    note: "65\" WOLED — 56.7\" × 31.9\" active area." },
        brightness: { q: "rtings_measurement",   note: "RTINGS: ~331 nits full-field. Cinema comparison uses full-field." },
        contrast:   { q: "manufacturer_spec",    note: "Per-pixel OLED — true infinite contrast." },
        seat:       { q: "typical_living_room",  note: "6 ft typical viewing, THX recommended ~4 ft for 65\" 4K." },
      },
    },

    // 8 ── Mini-LED 75" ───────────────────────────────────────────────────────
    {
      id: "miniled_75",
      kind: "home",
      name: "Mini-LED 75\" QLED",
      sub: "Samsung QN90D tier · living room",
      tag: "Mini-LED",
      blurb: "Brighter than OLED on full-field — ~201 fL vs ~97 fL. Zone-based local dimming gives halos. No Dolby Vision (Samsung policy). HDR10/HDR10+ only.",
      // 75\" at 1.78:1: width = 65.38\" = 5.45 ft; height = 36.73\" = 3.06 ft
      screen: { w: 5.45, h: 3.06, ar: 1.78, geometry: "flat" },
      seat: { front: 5, mid: 7, back: 10, source: "typical_living_room" },
      defaultPresentationAr: 1.78,
      isHybrid: false,
      presentationModes: [
        { id: "native_178", ar: 1.78, label: "1.78 · 16:9 native",   enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "scope_239",  ar: 2.39, label: "2.39 · Scope letterbox", enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "flat_185",   ar: 1.85, label: "1.85 · Flat letterbox",  enabled: true, isBookingDependent: false, isFilmMode: false, projection: "display" },
        { id: "disabled_143", ar: 1.43, label: "1.43 · IMAX full frame", enabled: false, disabledReason: "16:9 TV panel cannot show 1.43 natively", isBookingDependent: false, isFilmMode: false, projection: "display" },
      ],
      projection: proj_miniled,
      filmProjection: null,
      sources: {
        screen:     { q: "manufacturer_spec",   note: "75\" Mini-LED — 65.4\" × 36.7\" active." },
        brightness: { q: "rtings_measurement",  note: "~689 nits full-field on QN90D-tier panel (RTINGS)." },
        contrast:   { q: "manufacturer_spec",   note: "Zone local dimming ~10,000:1. No Dolby Vision (Samsung policy)." },
        seat:       { q: "typical_living_room", note: "7 ft typical for 75\" 4K." },
      },
    },
  ];

  // ─── Content formats ─────────────────────────────────────────────────────────

  const contentFormats = [
    { id: "imax_143",  ar: 1.43, label: "1.43 · IMAX full frame", phrase: "tallest", note: "Oppenheimer / Interstellar IMAX sequences" },
    { id: "imax_190",  ar: 1.90, label: "1.90 · IMAX Digital",    phrase: "tall",    note: "Standard IMAX digital presentation" },
    { id: "pana_220",  ar: 2.20, label: "2.20 · 65mm Panavision",  phrase: "",        note: "Nolan dialogue scenes; No Time to Die" },
    { id: "scope_239", ar: 2.39, label: "2.39 · Scope",            phrase: "wide",    note: "Dune, Batman — most scope blockbusters" },
    { id: "tv_178",    ar: 1.78, label: "1.78 · 16:9",             phrase: "TV",      note: "TV / streaming native" },
    { id: "flat_185",  ar: 1.85, label: "1.85 · Flat",             phrase: "standard cinema", note: "Most dramas and comedies" },
  ];

  // ─── Quality meta ─────────────────────────────────────────────────────────────
  // Maps source quality enum → human label + tier (1=official, 2=reputable, 3=estimate)

  const qualityMeta = {
    published_official:  { label: "Official spec",       tier: 1 },
    published_cto:       { label: "Official spec",       tier: 1 },
    manufacturer_spec:   { label: "Official spec",       tier: 1 },
    rtings_measurement:  { label: "Measured (RTINGS)",   tier: 1 },
    r_imax_csv:          { label: "143190.xyz",          tier: 2 },
    trade_reporting:     { label: "Trade reporting",     tier: 2 },
    preset_typical:      { label: "Format avg.",         tier: 3 },
    community_estimate:  { label: "Community estimate",  tier: 3 },
    derived:             { label: "Derived estimate",    tier: 3 },
    derived_from_screen_width: { label: "Derived estimate", tier: 3 },
    typical_living_room: { label: "Derived estimate",    tier: 3 },
    unknown:             { label: "Unknown",             tier: 3 },
  };

  return { venues, contentFormats, qualityMeta };
})();
