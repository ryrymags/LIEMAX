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

const D = context.window.LIEMAX_DATA;
const M = context.window.LIEMAX_MATH;
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

function findVenueById(id) {
  return D.venues.find((venue) => venue.id === id);
}

function findVenueByName(name) {
  return D.venues.find((venue) => venue.name === name);
}

function compatiblePresentationModes(venue, filmMode) {
  const modes = (venue.presentationModes || []).filter((mode) => mode.enabled);
  const activeModes = filmMode && venue.isHybrid
    ? modes.filter((mode) => mode.isFilmMode)
    : modes.filter((mode) => !mode.isFilmMode);
  return activeModes.length ? activeModes : modes;
}

function defaultPresArFor(venue, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  const fallback = filmMode && venue.isHybrid ? 1.43 : venue.defaultPresentationAr;
  if (modes.length === 0) return fallback;
  return (modes.find((mode) => Math.abs(mode.ar - fallback) < 0.01) || modes[0]).ar;
}

function resolvePresAr(venue, requestedPresAr, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  if (modes.length === 0) return requestedPresAr || defaultPresArFor(venue, filmMode);
  const requestedMode = modes.find((mode) => Math.abs(mode.ar - requestedPresAr) < 0.01);
  return (requestedMode || modes.find((mode) => Math.abs(mode.ar - defaultPresArFor(venue, filmMode)) < 0.01) || modes[0]).ar;
}

function computeStats(venue, seat, contentAr, requestedPresAr, filmMode) {
  const presAr = resolvePresAr(venue, requestedPresAr, filmMode);
  const proj = filmMode && venue.filmProjection ? venue.filmProjection : venue.projection;
  const dist = venue.seat[seat];
  const mask = M.visibleContentRect(venue.screen, contentAr, { ar: presAr, min_ar: presAr });
  const contentHFov = M.horizontalFovDeg(mask.effW, dist);
  const contentVFov = M.verticalFovDeg(mask.effH, dist);
  const ppdVal = proj.resH == null ? null : M.ppd(proj.resH, contentHFov);
  const fl = M.brightnessFL({ projection: proj });
  const physicalUtil = mask.areaUtilPct;
  return { dist, ppdVal, presAr, mask, contentHFov, contentVFov, fl, physicalUtil, proj };
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
  const projA = statsA.proj;
  const projB = statsB.proj;
  const rows = [];

  rows.push(makeRow("visible_hfov", "Visible horizontal FOV", statsA.contentHFov, statsB.contentHFov, `${fmtInt(statsA.contentHFov)}°`, `${fmtInt(statsB.contentHFov)}°`, true));
  rows.push(makeRow("visible_vfov", "Visible vertical FOV", statsA.contentVFov, statsB.contentVFov, `${fmtInt(statsA.contentVFov)}°`, `${fmtInt(statsB.contentVFov)}°`, true));
  rows.push(makeRow("ppd", "Pixels per degree", statsA.ppdVal, statsB.ppdVal, statsA.ppdVal == null ? projA.scanEquivLabel || "Unknown" : `${fmtInt(statsA.ppdVal)} ppd`, statsB.ppdVal == null ? projB.scanEquivLabel || "Unknown" : `${fmtInt(statsB.ppdVal)} ppd`, true));

  const aArea = statsA.mask.effW * statsA.mask.effH;
  const bArea = statsB.mask.effW * statsB.mask.effH;
  rows.push(makeRow("area", "Visible content area", aArea, bArea, `${fmtInt(aArea)} sq ft`, `${fmtInt(bArea)} sq ft`, true));
  rows.push(makeRow("util", "Screen utilization", statsA.physicalUtil, statsB.physicalUtil, `${fmtInt(statsA.physicalUtil)}%`, `${fmtInt(statsB.physicalUtil)}%`, true));
  rows.push(makeRow("brightness", "Brightness", statsA.fl, statsB.fl, statsA.fl != null ? `${fmtNum(statsA.fl, 1)} fL` : "Unknown", statsB.fl != null ? `${fmtNum(statsB.fl, 1)} fL` : "Unknown", true));

  const aContrast = projA.isPerPixelEmissive ? Infinity : projA.nativeContrast;
  const bContrast = projB.isPerPixelEmissive ? Infinity : projB.nativeContrast;
  rows.push(makeRow("contrast", "Native contrast", aContrast, bContrast, projA.nativeContrast ? `${projA.nativeContrast.toLocaleString()}:1` : "Unknown", projB.nativeContrast ? `${projB.nativeContrast.toLocaleString()}:1` : "Unknown", true));

  const hdrRow = makeHdrRow("hdr", "HDR black level", projA.hdrCategory, projB.hdrCategory, projA.hdrLabel, projB.hdrLabel);
  rows.push(hdrRow);
  rows.push({
    id: "depth",
    label: "Picture depth",
    aDisplay: projA.hdrLabel === "—" ? "SDR" : projA.hdrLabel,
    bDisplay: projB.hdrLabel === "—" ? "SDR" : projB.hdrLabel,
    winner: hdrRow.winner,
    badgeLabel: hdrRow.badgeLabel,
    note: hdrRow.note || null,
  });

  return rows;
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
  const aWinsRows = rows.filter((row) => row.winner === "a");
  const bWinsRows = rows.filter((row) => row.winner === "b");
  const priority = ["area", "visible_vfov", "visible_hfov", "contrast", "brightness", "hdr", "ppd", "util", "depth"];
  const rowLabel = (row) => VERDICT_LABEL[row.id] || row.label.toLowerCase();
  const joinLabels = (labels) => labels.length <= 2 ? labels.join(" and ") : `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  const topLabels = (winRows) => winRows.slice().sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id)).slice(0, 3).map(rowLabel);
  const sentences = [];
  if (aWinsRows.length > 0 && bWinsRows.length > 0) {
    sentences.push({ side: "a", text: `leads on ${joinLabels(topLabels(aWinsRows))}.` });
    sentences.push({ side: "b", text: `leads on ${joinLabels(topLabels(bWinsRows))}.` });
  }
  return { sentences, aName: sideA.name, bName: sideB.name };
}

console.log("\nDocs workbench regression validation\n");

const providence = findVenueById("apple_providence_imax");
const reading = findVenueByName("Sunbrella IMAX 3D Theater Reading");
const cinemarkXd = findVenueById("cinemark_xd");
const dolbySingleLaser = findVenueById("dolby_cinema_single_laser");
const assemblyRow = findVenueByName("AMC Assembly Row 12 & IMAX");
const bostonCommon = findVenueByName("AMC Boston Common 19");

assert("Cinemark XD is present in workbench data", Boolean(cinemarkXd));
assert("Dolby Cinema 2025 is present in workbench data", Boolean(dolbySingleLaser));
assert("Reading GT generated venue is present", Boolean(reading));
assert("Assembly Row CoLa venue is present", Boolean(assemblyRow));
assert("Boston Common CoLa venue is present", Boolean(bostonCommon));
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
          const physicalArea = venue.screen.w * venue.screen.h;
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
assert("Picker includes Xenon-only database disclaimer", appSource.includes("Xenon-only IMAX venues"));
assert("Details drawer describes tiered seating assumptions", appSource.includes("tiered assumptions"));

// ─── Diagnosis module tests ───────────────────────────────────────────────────

loadScript("docs/diagnosis.js");
const DIAG = context.window.LIEMAX_DIAGNOSE;

assert("diagnosis module loaded with classify and LABELS", Boolean(DIAG && typeof DIAG.classify === "function" && DIAG.LABELS));

const diagProvidence   = findVenueById("apple_providence_imax");
const diagReading      = findVenueByName("Sunbrella IMAX 3D Theater Reading");
const diagBostonCommon = findVenueByName("AMC Boston Common 19");
const diagMetreon      = findVenueByName("AMC Metreon 16 & IMAX");
const diagLincoln      = findVenueByName("AMC Lincoln Square 13 & IMAX");

assert("Providence (CoLa + film) diagnoses as true_film_lie_dig",  DIAG.classify(diagProvidence)   === "true_film_lie_dig");
assert("Reading (GT Laser, no film) diagnoses as true_143_laser",  DIAG.classify(diagReading)      === "true_143_laser");
assert("Boston Common (CoLa, no film) diagnoses as liemax",        DIAG.classify(diagBostonCommon) === "liemax");
assert("Metreon (GT Laser + film) diagnoses as true_143_film",     DIAG.classify(diagMetreon)      === "true_143_film");
assert("Lincoln Square (GT Laser + film) diagnoses as true_143_film", DIAG.classify(diagLincoln)   === "true_143_film");

if (failed > 0) {
  console.log(`\n${failed} docs workbench checks failed (${passed} passed).`);
  process.exit(1);
}

console.log(`\nAll ${passed} docs workbench checks passed.`);
