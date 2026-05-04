const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
context.window.window = context.window;

function loadScript(relativePath) {
  const fullPath = path.join(root, relativePath);
  const source = fs.readFileSync(fullPath, "utf8");
  vm.runInNewContext(source, context, { filename: relativePath });
}

loadScript("docs/math.js");
loadScript("docs/data.js");
loadScript("docs/workbench.js");

const D = context.window.LIEMAX_DATA;
const M = context.window.LIEMAX_MATH;
const W = context.window.LIEMAX_WORKBENCH;
let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  PASS ${label}`);
    passed++;
  } else {
    console.log(`  FAIL ${label}`);
    failed++;
  }
}

function closeEnough(actual, expected, tolerance = 0.5) {
  return Math.abs(actual - expected) <= tolerance;
}

function verticalFrameLoss(contentAr = 1.43, presentationAr = 1.90) {
  const retained = Math.min(1, contentAr / presentationAr);
  return { retainedPct: retained * 100, lostPct: (1 - retained) * 100 };
}

function findVenueById(id) {
  return D.venues.find((venue) => venue.id === id);
}

function findVenueByName(name) {
  return D.venues.find((venue) => venue.name === name);
}

function compatiblePresentationModes(venue, filmMode) {
  return W.compatiblePresentationModes(venue, filmMode);
}

function defaultPresArFor(venue, filmMode) {
  return W.defaultPresArFor(venue, filmMode);
}

function resolvePresAr(venue, requestedPresAr, filmMode) {
  return W.resolvePresAr(venue, requestedPresAr, filmMode);
}

function computeStats(venue, seat, contentAr, requestedPresAr, filmMode) {
  return W.computeStats(venue, seat, contentAr, requestedPresAr, filmMode);
}

function fmtInt(n) {
  if (n == null || !Number.isFinite(n)) return "—";
  return Math.round(n).toLocaleString();
}

function fmtNum(n, digits) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 10000) return Math.round(n).toLocaleString();
  return n.toFixed(digits ?? 1);
}

function makeRow(id, label, aVal, bVal, aDisplay, bDisplay, higherWins) {
  if (aDisplay === bDisplay && aVal != null && bVal != null) {
    return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
  }
  if (aVal == null || bVal == null) {
    return { id, label, aDisplay, bDisplay, winner: "unknown", badgeLabel: "Unknown" };
  }
  if (!Number.isFinite(aVal) && !Number.isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
  }
  if (!Number.isFinite(aVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? "a" : "b", badgeLabel: higherWins ? "A wins" : "B wins" };
  }
  if (!Number.isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? "b" : "a", badgeLabel: higherWins ? "B wins" : "A wins" };
  }
  const wins = higherWins ? aVal > bVal : aVal < bVal;
  const winner = aVal === bVal ? "tie" : (wins ? "a" : "b");
  const badgeMap = { a: "A wins", b: "B wins", tie: "Comparable", unknown: "Unknown" };
  return { id, label, aDisplay, bDisplay, winner, badgeLabel: badgeMap[winner] };
}

const HDR_RANK = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };

function makeHdrRow(id, label, catA, catB, labelA, labelB) {
  const rankA = HDR_RANK[catA] ?? -1;
  const rankB = HDR_RANK[catB] ?? -1;
  if (
    (catA === "photochemical" && catB === "dolby_vision") ||
    (catA === "dolby_vision" && catB === "photochemical")
  ) {
    return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable", note: "Different systems — not directly comparable" };
  }
  if (rankA === rankB) return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable" };
  const winner = rankA > rankB ? "a" : "b";
  return { id, label, aDisplay: labelA, bDisplay: labelB, winner, badgeLabel: winner === "a" ? "A wins" : "B wins" };
}

function buildComparisonRows(statsA, statsB) {
  return W.buildComparisonRows({}, {}, statsA, statsB);
}

const VERDICT_LABEL = {
  visible_hfov: "horizontal immersion",
  visible_vfov: "vertical immersion",
  ppd: "sharpness",
  area: "visible image area",
  util: "screen utilization",
  brightness: "brightness",
  contrast: "native contrast",
  hdr: "HDR black level",
  depth: "picture depth",
};

function buildVerdict(sideA, sideB, rows) {
  return W.buildVerdict(sideA, sideB, rows);
}

console.log("\nDocs workbench regression validation\n");

const providence = findVenueById("apple_providence_imax");
const reading = findVenueByName("Sunbrella IMAX 3D Theater Reading");
const cinemarkXd = findVenueById("cinemark_xd");
const dolbySingleLaser = findVenueById("dolby_cinema_single_laser");
const assemblyRow = findVenueByName("AMC Assembly Row 12 & IMAX");
const bostonCommon = findVenueByName("AMC Boston Common 19");
const natick = findVenueByName("Sunbrella IMAX 3D Theater, Jordan's Furniture Natick");
const esquire = findVenueByName("Esquire IMAX Theatre");
const pointeOrlando = findVenueByName("Regal Pointe Orlando Stadium 20 & IMAX");
const lfExaminerXenon = findVenueByName("Regal Tikahtnu Commons Stadium 16 & IMAX");
const lfExaminerHybrid = findVenueByName("Edwards Fresno Stadium 22 & IMAX");
const santaAnita143190 = findVenueByName("AMC Santa Anita 16 & IMAX");
const bostonCommonRows = D.venues.filter((venue) => venue.name.includes("Boston Common"));
const providenceRows = D.venues.filter((venue) => venue.city === "Providence" && venue.state === "RI");
const suppressedLFExaminerDuplicates = [
  ["NC", "Fayetteville", "AMC Fayetteville 14 & MAX"],
  ["CA", "Alhambra", "Edwards Renaissance Stadium 14 & IMAX"],
  ["CA", "Ontario", "Edwards Ontario Palace Stadium 22 & IMAX"],
  ["CA", "Santa Clarita", "Edwards Valencia Stadium 12 & IMAX"],
  ["CA", "Stockton", "Regal Stockton City Center Stadium 16 & IMAX"],
];

assert("Cinemark XD is present in workbench data", Boolean(cinemarkXd));
assert("Dolby Cinema 2025 is present in workbench data", Boolean(dolbySingleLaser));
assert("Reading GT generated venue is present", Boolean(reading));
assert("Assembly Row CoLa venue is present", Boolean(assemblyRow));
assert("Boston Common CoLa venue is present", Boolean(bostonCommon));
assert("Natick generated venue is present", Boolean(natick));
assert("Boston Common does not keep stale LFExaminer duplicate", bostonCommonRows.length === 1 && bostonCommonRows[0].sources?.screen?.q === "r_imax_csv");
assert("Providence authored current row does not keep stale LFExaminer duplicate", providenceRows.length === 1 && providenceRows[0].sources?.screen?.q === "r_imax_csv");
assert("Renamed LFExaminer current-source duplicates are suppressed",
  suppressedLFExaminerDuplicates.every(([state, city, name]) =>
    !D.venues.some((venue) => venue.state === state && venue.city === city && venue.name === name)
  ));
assert("LFExaminer supplemental Xenon venue is present", Boolean(lfExaminerXenon));
assert("LFExaminer supplemental hybrid Xenon/15-70 venue is present", Boolean(lfExaminerHybrid));
assert("LFExaminer supplemental venue is labeled Dual Xenon", lfExaminerXenon?.projection?.light === "Dual Xenon");
assert("LFExaminer supplemental venue exposes archival source", lfExaminerXenon?.sources?.screen?.q === "lfexaminer" && lfExaminerXenon.sources.screen.note.includes("2021-10-17"));
assert("143190 venues expose confirmed screen width confidence", bostonCommon?.screen?.widthConfidence === "confirmed");
assert("LFExaminer venues expose community-estimate screen width confidence", lfExaminerXenon?.screen?.widthConfidence === "community_estimate");
assert("Every non-preset cinema venue exposes a screen-size tier and label",
  D.venues
    .filter((venue) => venue.kind === "cinema" && !venue.isPreset)
    .every((venue) => typeof venue.screen?.sizeTier === "string" && typeof venue.screen?.sizeLabel === "string"));
assert("Natick uses official 76 x 55 ft screen, 279 seats, and Large Screen tier",
  closeEnough(natick?.screen?.w, 76, 0.01) &&
  closeEnough(natick?.screen?.h, 55, 0.01) &&
  natick?.seat?.capacity === 279 &&
  natick?.screen?.sizeLabel === "Large Screen" &&
  natick?.sources?.screen?.q === "published_official" &&
  natick?.sources?.screen?.note.includes("Jordan") &&
  natick?.projection?.type === "imax_dual_xenon");
assert("LFExaminer 1570+D row keeps film mode", Boolean(lfExaminerHybrid?.filmProjection && lfExaminerHybrid.presentationModes.some((mode) => mode.isFilmMode)));
assert("143190 hybrid picker subtitles show both projectors",
  Boolean(esquire?.filmProjection && esquire.sub.includes("IMAX Digital") && esquire.sub.includes("15/70")));
assert("LFExaminer hybrid picker subtitles show both projectors",
  Boolean(pointeOrlando?.filmProjection && pointeOrlando.sub.includes("IMAX Digital Xenon") && pointeOrlando.sub.includes("15/70")));
assert("143190 overlap keeps fresher non-Xenon projection", santaAnita143190?.projection?.type !== "imax_dual_xenon" && santaAnita143190?.sources?.screen?.q === "r_imax_csv");
assert("Reading mid distance is corrected to ~75 ft", closeEnough(reading.seat.mid, 75));
assert("Reading mid distance is not old 1.5x fallback", reading.seat.mid < 90);
assert("Reading seating source is caveated", reading.sources.seat.q === "community_estimate");

const statsAssemblyRowCola = computeStats(assemblyRow, "front", 1.90, 1.90, false);
const statsBostonCommonCola = computeStats(bostonCommon, "front", 1.90, 1.90, false);
const assemblyArea = statsAssemblyRowCola.mask.effW * statsAssemblyRowCola.mask.effH;
const bostonArea = statsBostonCommonCola.mask.effW * statsBostonCommonCola.mask.effH;
const bostonPhysicalArea = bostonCommon.screen.w * bostonCommon.screen.h;

assert("Assembly Row 1.90 visible area remains about 1,599 sq ft", closeEnough(assemblyArea, 1599, 1));
assert("Assembly Row 1.90 utilization remains about 94%", closeEnough(statsAssemblyRowCola.physicalUtil, 94, 0.5));
assert("Boston Common 1.90 visible area clamps to physical area", closeEnough(bostonArea, bostonPhysicalArea, 0.1));
assert("Boston Common 1.90 utilization clamps to 100%", closeEnough(statsBostonCommonCola.physicalUtil, 100, 0.01));

function visibleBoundsViolations() {
  const offenders = [];
  let checked = 0;
  for (const venue of D.venues) {
    const filmModes = venue.isHybrid && venue.filmProjection ? [false, true] : [false];
    for (const filmMode of filmModes) {
      for (const mode of compatiblePresentationModes(venue, filmMode)) {
        for (const content of D.contentFormats) {
          const stats = computeStats(venue, "mid", content.ar, mode.ar, filmMode);
          const visibleArea = stats.mask.effW * stats.mask.effH;
          const physicalArea = venue.screen.geometry === "hemispherical"
            ? 2 * Math.PI * (venue.screen.w / 2) ** 2 * (venue.screen.domeCoveragePct || 0.83)
            : venue.screen.w * venue.screen.h;
          checked++;
          if (visibleArea > physicalArea + 0.01 || stats.physicalUtil > 100.01) {
            offenders.push(`${venue.name} ${mode.id} ${content.id}`);
          }
        }
      }
    }
  }
  return { checked, offenders };
}

const boundsCheck = visibleBoundsViolations();
assert("Workbench visible bounds guard checked generated combinations", boundsCheck.checked > 0);
assert("Workbench visible area and utilization never exceed physical screen", boundsCheck.offenders.length === 0);

const statsProvidenceFilm = computeStats(providence, "mid", 1.43, 1.43, true);
const statsReadingGt = computeStats(reading, "mid", 1.43, 1.43, false);
const rows = buildComparisonRows(statsProvidenceFilm, statsReadingGt);
const areaRow = rows.find((row) => row.id === "area");
const contrastRow = rows.find((row) => row.id === "contrast");
const verdict = buildVerdict(providence, reading, rows);
const readingSentence = verdict.sentences.find((sentence) => sentence.side === "b");

assert("Providence film vs Reading GT visible area is a B win", areaRow?.winner === "b");
assert("Providence film vs Reading GT native contrast is a B win", contrastRow?.winner === "b");
assert("Verdict names Reading for B-side wins", Boolean(readingSentence && verdict.bName.includes("Reading")));
assert("Verdict mentions Reading visible area and contrast wins", Boolean(readingSentence && readingSentence.text.includes("visible image area") && readingSentence.text.includes("native contrast")));

const appSource = fs.readFileSync(path.join(root, "docs/app.jsx"), "utf8");
const stageSource = fs.readFileSync(path.join(root, "docs/stage.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "docs/index.html"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "docs/styles.css"), "utf8");
assert("Picker includes LFExaminer Xenon database disclaimer", appSource.includes("supplemental Xenon-only rows from LFExaminer"));
assert("Stats copy caveats LFExaminer 2021", appSource.includes("most LIEMAX rows come from LFExaminer 2021 and may be stale"));
assert("Details drawer describes tiered seating assumptions", appSource.includes("tiered assumptions"));
assert("Homepage search hides category tags for diagnosis reveal", appSource.includes("showCategoryTags={false}"));
assert("Homepage search does not auto-open on autofocus", appSource.includes("openOnFocusAfterInteraction"));
assert("Comparison picker keeps category tags", appSource.includes("picker-v3__item-tag"));
assert("Comparison picker exposes selected filter groups", appSource.includes("PICKER_FILTERS") && appSource.includes("selectedPickerFilterGroups") && appSource.includes("picker-filter-chip"));
assert("Comparison picker exposes requested filter labels",
  ["IMAX verdict", "Screen size", "Projector", "Projection capability", "State", "GT Dual Laser", "CoLa", "Laser XT", "Dual Xenon", "IMAX 15/70 Film", "Dome Laser", "IMAX Dome 15/70 Film", "Other/Unknown Digital"].every((label) => appSource.includes(label)));
assert("Comparison picker exposes removable chips and clear action", appSource.includes("Clear filters") && appSource.includes("removeFilter"));
assert("LIEMAX wordmark resets the page", appSource.includes("aria-label=\"Start over\""));
assert("Docs assets are cache-busted together", indexSource.includes("styles.css?v=phase4a-canonical-1") && indexSource.includes("workbench.js?v=phase4a-canonical-1") && indexSource.includes("stage.js?v=phase4a-canonical-1") && indexSource.includes("app.jsx?v=phase4a-canonical-1"));
assert("Methodology explains fixed dome FOV", appSource.includes("dome FOV is modeled as fixed 180"));
assert("Site includes IMAX non-affiliation disclaimer", appSource.includes("not affiliated with IMAX Corporation"));
assert("Diagnosis screen includes immediate scale figure", appSource.includes("DiagnosisScaleFigure"));
assert("Single-stage renderer is available for diagnosis scale", stageSource.includes("LIEMAX_STAGE_SINGLE"));
assert("Stage renderer draws dome diameter instead of rectangle only", stageSource.includes("ft dome diameter"));
assert("Stage renderer uses resolved colors for SVG visibility", stageSource.includes("stageColor(\"--side-a\""));
assert("Diagnosis scale SVG has fixed height", stylesSource.includes(".diagnosis-stage__svg") && stylesSource.includes("height: clamp(240px"));
const dataSource = fs.readFileSync(path.join(root, "docs/data.js"), "utf8");
assert("Docs data bundle is generated from canonical source", dataSource.includes("canonical src/data JSON resolved through src/math/resolver"));
assert("Docs data bundle no longer contains prototype projection constants", !dataSource.includes("const proj_"));
assert("Docs data bundle no longer embeds imaxCsvRows", !dataSource.includes("imaxCsvRows"));
assert("Every docs venue exposes canonicalId", D.venues.every((venue) => typeof venue.canonicalId === "string" && venue.canonicalId.length > 0));
assert("Docs data exposes Dolby Cinema U.S. count token", Object.prototype.hasOwnProperty.call(D.db || {}, "dolby_cinema_us_count"));
assert("Docs data exposes Dolby Cinema snapshot metadata", Boolean(D.db?.dolby_cinema_us_count_endpoint?.includes("mapBoundedCinemas")));
assert("Docs data exposes not-full-143 digital percent token", typeof D.db?.not_full_143_digital_pct === "number");
assert("Docs data exposes LFExaminer LIEMAX count token", typeof D.db?.liemax_lfexaminer_count === "number" && D.db.liemax_lfexaminer_count > 0);
assert("Dolby Cinema U.S. count token is preserved in docs data", typeof D.db?.dolby_cinema_us_count === "number");
assert("Stats UI does not render a Dolby Cinema count card", !appSource.includes("Dolby Cinema US") && !appSource.includes("D.db?.dolby_cinema_us_count"));
assert("Stats UI caveats LFExaminer LIEMAX count", appSource.includes("archival LFExaminer rows") && appSource.includes("LIEMAX now means legacy Dual Xenon"));
assert("Docs data includes LFExaminer 2021 quality label", D.qualityMeta.lfexaminer?.label === "LFExaminer 2021");
assert("Workbench runtime is exposed", Boolean(W && typeof W.computeStats === "function" && typeof W.buildComparisonRows === "function"));

const loss143On190 = verticalFrameLoss(1.43, 1.90);
assert("Homepage explains why the site exists", appSource.includes("IMAX can mean <em>very different rooms</em>") && (appSource.includes("screen, projector, movie format, and seat math") || appSource.includes("Not all IMAX theaters are the same size")));
assert("Homepage defines LIEMAX for novices", appSource.includes("LIEMAX means the") && appSource.includes("IMAX Lite means"));
assert("Integrated IMAX 101 guide is present", appSource.includes("IMAX 101") && appSource.includes("What the diagnosis is really checking"));
assert("Required projector terms are explained", ["GT Dual Laser", "CoLa", "Laser XT", "Dual Xenon", "IMAX Dome Laser", "Dome 15/70"].every(term => appSource.includes(term)));
assert("15/70 vs standard 70mm explanation is present", appSource.includes("Standard 70mm runs vertically") && appSource.includes("IMAX 15/70 runs sideways"));
assert("Curated film examples are present", ["Oppenheimer", "Dunkirk", "Interstellar", "Dune"].every(title => appSource.includes(title)));
assert("1.43 on 1.90 vertical frame loss remains about 24.7%", closeEnough(loss143On190.lostPct, 24.7, 0.2));
assert("Aspect ratio penalty copy is user-facing", appSource.includes("A 1.43 movie forced into 1.90 retains about"));
assert("Recommendation chips are randomized curated examples", appSource.includes("CURATED_SUGGESTION_IDS") && appSource.includes("shuffleSample(curated, 5)") && !appSource.includes("imax_us_ma_boston_amc_boston_common_19\",\n      \"imax_us_ny_new_york_amc_lincoln_square_13_and_imax\""));
assert("National stats exclude presets and home displays", appSource.includes("kind === \"cinema\" && !v.isPreset"));
assert("State stats require explicit state selection", appSource.includes("State stats only appear after you choose a state; no IP geolocation is used") && appSource.includes("selectedState"));
assert("Seat geometry panel exposes front/mid/back FOV", appSource.includes("SeatGeometryPanel") && appSource.includes("front\", \"mid\", \"back\"") && appSource.includes("screen width"));
assert("Dome education keeps fixed FOV", appSource.includes("Fixed dome coverage") && appSource.includes("Dome seating does not work like a flat rectangle"));
assert("External source links are included", ["LF Examiner large formats", "IMAX annual filing", "Kodak Sinners formats"].every(label => appSource.includes(label)));
assert("Launch-facing app copy does not hardcode old 89% stat", !appSource.includes("89%"));
assert("Picker result tags use simple screen-size and category labels", appSource.includes("quickResultTags") && appSource.includes("Small Screen") && appSource.includes("Medium Screen") && appSource.includes("Large Screen") && appSource.includes("Giant Screen"));
assert("Picker result tags do not include hidden 1.43 capability labels", !appSource.includes("TRUE 1.43") && !appSource.includes("1.43 Screen") && !appSource.includes("1.43 Compatible"));
assert("Visible theater tags expose brief hover/focus explanations", appSource.includes("VisibleTag") && appSource.includes("data-tooltip") && appSource.includes("70-84.9 ft wide.") && appSource.includes("Modern laser IMAX, usually capped at 1.90."));
assert("Unknown visible tag briefly explains verdict uncertainty", appSource.includes("text: \"Unknown\"") && appSource.includes("Not enough projector or screen data to classify."));
assert("Visible tag tooltip CSS is present", stylesSource.includes(".tag-with-help::after") && stylesSource.includes("content: attr(data-tooltip)") && stylesSource.includes(".tag-with-help:focus::after"));
assert("Picker/search result tag tooltips open inward to avoid clipping", stylesSource.includes(".picker-v3__item-tags .tag-with-help::after") && stylesSource.includes(".search__item-tag.tag-with-help::after") && stylesSource.includes("right: 0"));
assert("Diagnosis tag tooltips open downward to avoid card-edge clipping", stylesSource.includes(".diagnosis__tags .tag-with-help::after") && stylesSource.includes("top: calc(100% + 8px)") && !/\.diagnosis\s*\{[^}]*overflow:\s*hidden/.test(stylesSource));
assert("Selected comparison cards carry screen-size and category tags", appSource.includes("picker-v3__selected-tags") && appSource.includes("selectedTags.map"));
assert("Selected comparison cards show both projectors for hybrid venues", appSource.includes("venue.filmProjection && <span className=\"meta-chip meta-chip--proj\">"));
assert("Screen-scale legend carries simple screen-size and category tags", appSource.includes("comparisonLegendLabel") && !appSource.includes("A · {venueA.tag}") && !appSource.includes("B · {venueB.tag}"));
assert("Diagnosis breakdown exposes screen-size and category tags", appSource.includes("diagnosis__tags") && appSource.includes("sizeLabel") && appSource.includes("tierLabel"));
assert("Diagnosis specs show actual database projector labels", appSource.includes("projectorDisplayName") && appSource.includes("Film projector") && !appSource.includes("{venue.filmProjection ? \"Installed\" : \"No\"}"));
assert("Projector filter keeps flat 15/70 separate from dome 15/70", appSource.includes("[\"1570_film\", \"IMAX 15/70 Film\"]") && appSource.includes("[\"dome_film\", \"IMAX Dome 15/70 Film\"]") && !appSource.includes("if (hasFilm1570(venue)) keys.add(\"1570_film\")"));

// ─── Diagnosis module tests ───────────────────────────────────────────────────

loadScript("docs/diagnosis.js");
const DIAG = context.window.LIEMAX_DIAGNOSE;

assert("diagnosis module loaded with classify and LABELS", Boolean(DIAG && typeof DIAG.classify === "function" && DIAG.LABELS));

const diagProvidence   = findVenueById("apple_providence_imax");
const diagReading      = findVenueByName("Sunbrella IMAX 3D Theater Reading");
const diagBostonCommon = findVenueByName("AMC Boston Common 19");
const diagMetreon      = findVenueByName("AMC Metreon 16 & IMAX");
const diagLincoln      = findVenueByName("AMC Lincoln Square 13 & IMAX");
const diagMugar        = findVenueByName("Mugar Omni, Museum of Science");
const diagChrysler     = findVenueByName("Chrysler IMAX Dome Theatre, Michigan Science Center");

assert("Providence (CoLa + film) diagnoses as true_film_lie_dig",  DIAG.classify(diagProvidence)   === "true_film_lie_dig");
assert("Reading (GT Laser, no film) diagnoses as true_143_laser",  DIAG.classify(diagReading)      === "true_143_laser");
assert("Boston Common (CoLa, no film) diagnoses as imax_lite",     DIAG.classify(diagBostonCommon) === "imax_lite");
assert("LFExaminer Dual Xenon diagnoses as liemax",                DIAG.classify(lfExaminerXenon)  === "liemax");
assert("Metreon (GT Laser + film) diagnoses as true_143_film",     DIAG.classify(diagMetreon)      === "true_143_film");
assert("Lincoln Square (GT Laser + film) diagnoses as true_143_film", DIAG.classify(diagLincoln)   === "true_143_film");
assert("Mugar dome laser diagnoses as true_dome",                  DIAG.classify(diagMugar)        === "true_dome");
assert("Chrysler 15/70 dome diagnoses as true_dome",               DIAG.classify(diagChrysler)     === "true_dome");
assert("Dome tier ranks above hybrid",                             DIAG.LABELS.true_dome.rank.startsWith("Tier A") && DIAG.LABELS.true_film_lie_dig.rank.startsWith("Tier B"));
assert("Providence copy says regular digital showings are IMAX Lite", DIAG.diagnose(diagProvidence).body.includes("Regular digital showings are IMAX Lite"));
assert("Mugar diagnosis names Laser for Dome",                     DIAG.diagnose(diagMugar).headline.includes("IMAX Laser for Dome"));
assert("Chrysler diagnosis names GT Dome 15/70",                   DIAG.diagnose(diagChrysler).headline.includes("IMAX GT Dome 15/70mm"));

const fakeDome = {
  ...diagBostonCommon,
  id: "fake_dome_geometry_only",
  tag: "IMAX Dome",
  screen: { ...diagBostonCommon.screen, geometry: "hemispherical" },
};
assert("dome geometry alone does not diagnose as true_dome", DIAG.classify(fakeDome) !== "true_dome");

function hasDigital143(venue) {
  return venue?.kind === "cinema" &&
    venue.screen?.geometry !== "hemispherical" &&
    venue.projection?.min_ar != null &&
    venue.projection.min_ar <= 1.43 &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

function hasFilm1570(venue) {
  return Boolean(venue?.filmProjection || (venue?.presentationModes || []).some((mode) => mode.isFilmMode));
}

function hasDomePresentation(venue) {
  return venue?.screen?.geometry === "hemispherical" || DIAG.classify(venue) === "true_dome";
}

assert("Capability filters can find Digital 1.43 rows", D.venues.some(hasDigital143));
assert("Capability filters can find 15/70 rows", D.venues.some(hasFilm1570));
assert("Capability filters can find Dome rows", D.venues.some(hasDomePresentation));
assert("Capability/category filters can find LIEMAX rows", D.venues.some((venue) => DIAG.classify(venue) === "liemax"));
assert("Capability/category filters can find IMAX Lite rows", D.venues.some((venue) => DIAG.classify(venue) === "imax_lite"));

if (failed > 0) {
  console.log(`\n${failed} docs workbench checks failed (${passed} passed).`);
  process.exit(1);
}

console.log(`\nAll ${passed} docs workbench checks passed.`);
