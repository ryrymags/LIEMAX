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
const lfExaminerXenon = findVenueByName("Regal Tikahtnu Commons Stadium 16 & IMAX");
const lfExaminerHybrid = findVenueByName("Edwards Fresno Stadium 22 & IMAX");
const santaAnita143190 = findVenueByName("AMC Santa Anita 16 & IMAX");
const bostonCommonRows = D.venues.filter((venue) => venue.name.includes("Boston Common"));

assert("Cinemark XD is present in workbench data", Boolean(cinemarkXd));
assert("Dolby Cinema 2025 is present in workbench data", Boolean(dolbySingleLaser));
assert("Reading GT generated venue is present", Boolean(reading));
assert("Assembly Row CoLa venue is present", Boolean(assemblyRow));
assert("Boston Common CoLa venue is present", Boolean(bostonCommon));
assert("Boston Common does not keep stale LFExaminer duplicate", bostonCommonRows.length === 1 && bostonCommonRows[0].sources?.screen?.q === "r_imax_csv");
assert("LFExaminer supplemental Xenon venue is present", Boolean(lfExaminerXenon));
assert("LFExaminer supplemental hybrid Xenon/15-70 venue is present", Boolean(lfExaminerHybrid));
assert("LFExaminer supplemental venue is labeled Dual Xenon", lfExaminerXenon?.projection?.light === "Dual Xenon");
assert("LFExaminer supplemental venue exposes archival source", lfExaminerXenon?.sources?.screen?.q === "lfexaminer" && lfExaminerXenon.sources.screen.note.includes("2021-10-17"));
assert("LFExaminer 1570+D row keeps film mode", Boolean(lfExaminerHybrid?.filmProjection && lfExaminerHybrid.presentationModes.some((mode) => mode.isFilmMode)));
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
assert("Stats copy caveats LFExaminer 2021", appSource.includes("Xenon-only IMAX venues include archival LFExaminer 2021 rows and may be stale"));
assert("Details drawer describes tiered seating assumptions", appSource.includes("tiered assumptions"));
assert("Homepage search hides category tags for diagnosis reveal", appSource.includes("showCategoryTags={false}"));
assert("Homepage search does not auto-open on autofocus", appSource.includes("openOnFocusAfterInteraction"));
assert("Comparison picker keeps category tags", appSource.includes("picker-v3__item-tag"));
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
assert("Stats UI references Dolby Cinema U.S. count token", appSource.includes("D.db?.dolby_cinema_us_count") && appSource.includes("Dolby Cinema US"));
assert("Docs data includes LFExaminer 2021 quality label", D.qualityMeta.lfexaminer?.label === "LFExaminer 2021");
assert("Workbench runtime is exposed", Boolean(W && typeof W.computeStats === "function" && typeof W.buildComparisonRows === "function"));

const loss143On190 = verticalFrameLoss(1.43, 1.90);
assert("Homepage explains why the site exists", appSource.includes("IMAX can mean <em>very different rooms</em>") && (appSource.includes("screen, projector, movie format, and seat math") || appSource.includes("Not all IMAX theaters are the same size")));
assert("Homepage defines LIEMAX for novices", appSource.includes("LIEMAX is the blunt nickname") || appSource.includes("LIEMAX is the nickname"));
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
assert("Boston Common (CoLa, no film) diagnoses as liemax",        DIAG.classify(diagBostonCommon) === "liemax");
assert("Metreon (GT Laser + film) diagnoses as true_143_film",     DIAG.classify(diagMetreon)      === "true_143_film");
assert("Lincoln Square (GT Laser + film) diagnoses as true_143_film", DIAG.classify(diagLincoln)   === "true_143_film");
assert("Mugar dome laser diagnoses as true_dome",                  DIAG.classify(diagMugar)        === "true_dome");
assert("Chrysler 15/70 dome diagnoses as true_dome",               DIAG.classify(diagChrysler)     === "true_dome");
assert("Dome tier ranks above hybrid",                             DIAG.LABELS.true_dome.rank.startsWith("Tier A") && DIAG.LABELS.true_film_lie_dig.rank.startsWith("Tier B"));
assert("Mugar diagnosis names Laser for Dome",                     DIAG.diagnose(diagMugar).headline.includes("IMAX Laser for Dome"));
assert("Chrysler diagnosis names GT Dome 15/70",                   DIAG.diagnose(diagChrysler).headline.includes("IMAX GT Dome 15/70mm"));

const fakeDome = {
  ...diagBostonCommon,
  id: "fake_dome_geometry_only",
  tag: "IMAX Dome",
  screen: { ...diagBostonCommon.screen, geometry: "hemispherical" },
};
assert("dome geometry alone does not diagnose as true_dome", DIAG.classify(fakeDome) !== "true_dome");

if (failed > 0) {
  console.log(`\n${failed} docs workbench checks failed (${passed} passed).`);
  process.exit(1);
}

console.log(`\nAll ${passed} docs workbench checks passed.`);
