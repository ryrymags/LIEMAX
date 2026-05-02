// GENERATED FILE. Run npm run build:docs-data.
window.LIEMAX_WORKBENCH = (function () {
  const M = window.LIEMAX_MATH;
  const HDR_RANK = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };
  const VERDICT_LABEL = { visible_hfov: "horizontal immersion", visible_vfov: "vertical immersion", ppd: "sharpness", area: "visible image area", util: "screen utilization", brightness: "brightness", contrast: "native contrast", hdr: "HDR black level", depth: "picture depth" };
  function visibleContentRect(screen, contentAR, presentation) {
    return M.visibleContentRect(screen, contentAR, presentation);
  }
  function brightnessFL(venue) { return M.brightnessFL(venue); }
  function compatiblePresentationModes(venue, filmMode) {
    const modes = (venue.presentationModes || []).filter(mode => mode.enabled);
    const activeModes = filmMode && venue.isHybrid ? modes.filter(mode => mode.isFilmMode) : modes.filter(mode => !mode.isFilmMode);
    return activeModes.length ? activeModes : modes;
  }
  function defaultPresArFor(venue, filmMode) {
    const modes = compatiblePresentationModes(venue, filmMode);
    const fallback = filmMode && venue.isHybrid ? 1.43 : venue.defaultPresentationAr;
    if (modes.length === 0) return fallback;
    return (modes.find(mode => Math.abs(mode.ar - fallback) < 0.01) || modes[0]).ar;
  }
  function resolvePresAr(venue, requestedPresAr, filmMode) {
    const modes = compatiblePresentationModes(venue, filmMode);
    if (modes.length === 0) return requestedPresAr || defaultPresArFor(venue, filmMode);
    const requestedMode = modes.find(mode => Math.abs(mode.ar - requestedPresAr) < 0.01);
    return (requestedMode || modes.find(mode => Math.abs(mode.ar - defaultPresArFor(venue, filmMode)) < 0.01) || modes[0]).ar;
  }
  function computeStats(venue, seat, contentAr, requestedPresAr, filmMode) {
    const presAr = resolvePresAr(venue, requestedPresAr, filmMode);
    const proj = filmMode && venue.filmProjection ? venue.filmProjection : venue.projection;
    const dist = venue.seat[seat];
    const isDome = venue.screen.geometry === "hemispherical";
    if (isDome) {
      const domeHFov = venue.screen.domeHFov || 180;
      const domeVFov = venue.screen.domeVFov || 125;
      const coverage = venue.screen.domeCoveragePct || 0.83;
      const radius = venue.screen.w / 2;
      const domeArea = 2 * Math.PI * radius * radius * coverage;
      const ppdVal = proj.resH != null ? proj.resH / domeHFov : (proj.scanEquivLow != null && proj.scanEquivHigh != null ? ((proj.scanEquivLow + proj.scanEquivHigh) / 2) / domeHFov : null);
      return { dist, physicalFov: domeHFov, ppdVal, presAr, projWindow: { w: venue.screen.w, h: venue.screen.h, ar: 1.43, geometry: "hemispherical" }, mask: { effW: Math.sqrt(domeArea), effH: Math.sqrt(domeArea), areaUtilPct: coverage * 100, letterbox: false, pillarbox: false, cropped: false }, contentHFov: domeHFov, contentVFov: domeVFov, fl: brightnessFL({ projection: proj }), physicalUtil: coverage * 100, visibleArea: domeArea, isDome: true, proj };
    }
    const physicalFov = M.horizontalFovDeg(venue.screen.w, dist);
    const mask = visibleContentRect(venue.screen, contentAr, { ar: presAr, min_ar: presAr });
    const projWindow = mask.projectedWindow;
    const contentHFov = M.horizontalFovDeg(mask.effW, dist);
    const contentVFov = M.horizontalFovDeg(mask.effH, dist);
    const ppdVal = proj.resH != null ? M.ppd(proj.resH, contentHFov) : null;
    const fl = brightnessFL({ projection: proj });
    const physicalUtil = mask.areaUtilPct;
    return { dist, physicalFov, ppdVal, presAr, projWindow, mask, contentHFov, contentVFov, fl, physicalUtil, visibleArea: mask.effW * mask.effH, isDome: false, proj };
  }
  function fmtInt(n) { if (n == null || !Number.isFinite(n)) return "—"; return Math.round(n).toLocaleString(); }
  function fmtNum(n, digits) { if (n == null || !Number.isFinite(n)) return "—"; if (Math.abs(n) >= 10000) return Math.round(n).toLocaleString(); return n.toFixed(digits ?? 1); }
  function makeRow(id, label, aVal, bVal, aDisplay, bDisplay, higherWins) {
    if (aDisplay === bDisplay && aVal != null && bVal != null) return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
    if (aVal == null || bVal == null) return { id, label, aDisplay, bDisplay, winner: "unknown", badgeLabel: "Unknown" };
    if (!Number.isFinite(aVal) && !Number.isFinite(bVal)) return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
    if (!Number.isFinite(aVal)) return { id, label, aDisplay, bDisplay, winner: higherWins ? "a" : "b", badgeLabel: higherWins ? "A wins" : "B wins" };
    if (!Number.isFinite(bVal)) return { id, label, aDisplay, bDisplay, winner: higherWins ? "b" : "a", badgeLabel: higherWins ? "B wins" : "A wins" };
    const wins = higherWins ? aVal > bVal : aVal < bVal;
    const winner = aVal === bVal ? "tie" : (wins ? "a" : "b");
    const badgeMap = { a: "A wins", b: "B wins", tie: "Comparable", unknown: "Unknown" };
    return { id, label, aDisplay, bDisplay, winner, badgeLabel: badgeMap[winner] };
  }
  function makeHdrRow(id, label, catA, catB, labelA, labelB) {
    const rankA = HDR_RANK[catA] ?? -1;
    const rankB = HDR_RANK[catB] ?? -1;
    const isDiffSystems = (catA === "photochemical" && catB === "dolby_vision") || (catA === "dolby_vision" && catB === "photochemical");
    if (isDiffSystems) return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable", note: "Different systems — not directly comparable" };
    if (rankA === rankB) return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable" };
    const winner = rankA > rankB ? "a" : "b";
    return { id, label, aDisplay: labelA, bDisplay: labelB, winner, badgeLabel: winner === "a" ? "A wins" : "B wins" };
  }
  function buildComparisonRows(sideA, sideB, statsA, statsB) {
    const projA = statsA.proj;
    const projB = statsB.proj;
    const rows = [];
    rows.push({ ...makeRow("visible_hfov", "Visible horizontal FOV", statsA.contentHFov, statsB.contentHFov, fmtInt(statsA.contentHFov) + "°", fmtInt(statsB.contentHFov) + "°", true), explain: "How wide the movie image feels from your seat." });
    rows.push({ ...makeRow("visible_vfov", "Visible vertical FOV", statsA.contentVFov, statsB.contentVFov, fmtInt(statsA.contentVFov) + "°", fmtInt(statsB.contentVFov) + "°", true), explain: "How tall the movie image feels — the key IMAX immersion factor." });
    rows.push({ ...makeRow("ppd", "Pixels per degree", statsA.ppdVal, statsB.ppdVal, statsA.ppdVal == null ? projA.scanEquivLabel || "Unknown" : fmtInt(statsA.ppdVal) + " ppd", statsB.ppdVal == null ? projB.scanEquivLabel || "Unknown" : fmtInt(statsB.ppdVal) + " ppd", true), explain: "Perceived sharpness from this seat; higher usually looks crisper." });
    const aArea = statsA.visibleArea ?? statsA.mask.effW * statsA.mask.effH;
    const bArea = statsB.visibleArea ?? statsB.mask.effW * statsB.mask.effH;
    rows.push({ ...makeRow("area", "Visible content area", aArea, bArea, fmtInt(aArea) + " sq ft", fmtInt(bArea) + " sq ft", true), explain: "How large the actual movie image is, after masking or cropping." });
    rows.push({ ...makeRow("util", "Screen utilization", statsA.physicalUtil, statsB.physicalUtil, fmtInt(statsA.physicalUtil) + "%", fmtInt(statsB.physicalUtil) + "%", true), explain: "How much of the physical screen this movie format fills." });
    rows.push({ ...makeRow("brightness", "Brightness", statsA.fl, statsB.fl, statsA.fl != null ? fmtNum(statsA.fl, 1) + " fL" : "Unknown", statsB.fl != null ? fmtNum(statsB.fl, 1) + " fL" : "Unknown", true), explain: "How much light reaches the screen; higher helps HDR and punch." });
    const aContrNum = projA.isPerPixelEmissive ? Infinity : projA.nativeContrast;
    const bContrNum = projB.isPerPixelEmissive ? Infinity : projB.nativeContrast;
    const aContrDisp = projA.isPerPixelEmissive ? "∞" : (projA.nativeContrast ? projA.nativeContrast.toLocaleString() + ":1" : "Unknown");
    const bContrDisp = projB.isPerPixelEmissive ? "∞" : (projB.nativeContrast ? projB.nativeContrast.toLocaleString() + ":1" : "Unknown");
    rows.push({ ...makeRow("contrast", "Native contrast", aContrNum, bContrNum, aContrDisp, bContrDisp, true), explain: "Projector's sequential (on/off) contrast — measured before any dynamic HDR system." });
    const hdrRow = makeHdrRow("hdr", "HDR black level", projA.hdrCategory, projB.hdrCategory, projA.hdrLabel, projB.hdrLabel);
    rows.push({ ...hdrRow, explain: "Whether the system can dynamically deepen blacks for HDR content." });
    const aDepthDisp = projA.hdrLabel === "—" ? "SDR" : projA.hdrLabel;
    const bDepthDisp = projB.hdrLabel === "—" ? "SDR" : projB.hdrLabel;
    rows.push({ id: "depth", label: "Picture depth", aDisplay: aDepthDisp, bDisplay: bDepthDisp, winner: hdrRow.winner, badgeLabel: hdrRow.badgeLabel, note: hdrRow.note || null, explain: "Overall sense of contrast, HDR, and image dimensionality." });
    return rows;
  }
  function buildVerdict(sideA, sideB, rows) {
    const aWinsRows = rows.filter(r => r.winner === "a");
    const bWinsRows = rows.filter(r => r.winner === "b");
    const tieRows = rows.filter(r => r.winner === "tie");
    const priority = ["area", "visible_vfov", "visible_hfov", "contrast", "brightness", "hdr", "ppd", "util", "depth"];
    function rowLabel(r) { return VERDICT_LABEL[r.id] || r.label.toLowerCase(); }
    function joinLabels(labels) { return labels.length <= 2 ? labels.join(" and ") : labels.slice(0, -1).join(", ") + ", and " + labels[labels.length - 1]; }
    function topLabels(winRows) { return winRows.slice().sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id)).slice(0, 3).map(rowLabel); }
    const sentences = [];
    if (aWinsRows.length > 0 && bWinsRows.length > 0) { sentences.push({ side: "a", text: "leads on " + joinLabels(topLabels(aWinsRows)) + "." }); sentences.push({ side: "b", text: "leads on " + joinLabels(topLabels(bWinsRows)) + "." }); }
    else if (aWinsRows.length === 0 && bWinsRows.length > 0) { const dominates = bWinsRows.length >= rows.length - 1; sentences.push({ side: "b", text: dominates ? "leads across nearly every measurable category." : "leads on " + joinLabels(topLabels(bWinsRows)) + "." }); }
    else if (bWinsRows.length === 0 && aWinsRows.length > 0) { const dominates = aWinsRows.length >= rows.length - 1; sentences.push({ side: "a", text: dominates ? "leads across nearly every measurable category." : "leads on " + joinLabels(topLabels(aWinsRows)) + "." }); }
    else { sentences.push({ side: null, text: "These two are closely matched." }); }
    const tieNames = tieRows.filter(r => r.id !== "depth").slice(0, 3).map(rowLabel);
    if (tieNames.length === 1) sentences.push({ side: null, text: tieNames[0].charAt(0).toUpperCase() + tieNames[0].slice(1) + " is comparable from this seat." });
    else if (tieNames.length > 1) { const last = tieNames.pop(); sentences.push({ side: null, text: tieNames.join(", ") + " and " + last + " are comparable from this seat." }); }
    return { sentences, aWins: aWinsRows, bWins: bWinsRows, ties: tieRows, aName: sideA.name, bName: sideB.name };
  }
  return { visibleContentRect, brightnessFL, compatiblePresentationModes, defaultPresArFor, resolvePresAr, computeStats, buildComparisonRows, buildVerdict };
})();
