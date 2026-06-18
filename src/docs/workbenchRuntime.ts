import { nitsToFl, screenAreaDome, computeMasking, computePpd, domePpd, horizontalFov } from '../math';

export type DocsVenue = Record<string, any>;
export type DocsStats = Record<string, any>;

export function visibleContentRect(screen: Record<string, any>, contentAR: number, presentation: Record<string, any>) {
  const presAR = presentation.ar;
  if (!isPositiveNumber(screen?.w) || !isPositiveNumber(screen?.h) || !isPositiveNumber(presAR)) {
    return emptyMask(presAR, screen?.geometry);
  }
  const projectedWindow = {
    w: screen.w,
    h: screen.w / presAR,
    ar: presAR,
    geometry: screen.geometry,
  };
  const projectedMask = computeMasking(
    projectedWindow.w,
    projectedWindow.h,
    contentAR,
    presentation.min_ar ?? presAR
  );
  const effW = Math.min(projectedMask.effective_width_ft, screen.w);
  const effH = Math.min(projectedMask.effective_height_ft, screen.h);
  const physicalArea = screen.w * screen.h;
  const areaUtilPct = Math.min(100, (effW * effH) / physicalArea * 100);

  return {
    effW,
    effH,
    areaUtilPct,
    letterbox: projectedMask.letterboxed,
    pillarbox: projectedMask.pillarboxed,
    cropped: projectedMask.cropped,
    projectedWindow,
    physicalClipped:
      effW < projectedMask.effective_width_ft - 0.05 ||
      effH < projectedMask.effective_height_ft - 0.05,
  };
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function hasRenderableFlatGeometry(venue: DocsVenue, dist: unknown): boolean {
  return isPositiveNumber(venue?.screen?.w) &&
    isPositiveNumber(venue?.screen?.h) &&
    isPositiveNumber(dist);
}

function emptyMask(presAr: number | null | undefined, geometry: string | null | undefined) {
  return {
    effW: null,
    effH: null,
    areaUtilPct: null,
    letterbox: false,
    pillarbox: false,
    cropped: false,
    projectedWindow: {
      w: null,
      h: null,
      ar: presAr ?? null,
      geometry: geometry ?? null,
    },
    physicalClipped: false,
  };
}

export function brightnessFL(venue: Pick<DocsVenue, 'projection'>): number | null {
  if (venue.projection?.brightness_fl != null) return venue.projection.brightness_fl;
  if (venue.projection?.brightness_nits_full != null) return nitsToFl(venue.projection.brightness_nits_full);
  return null;
}

export function compatiblePresentationModes(venue: DocsVenue, filmMode: boolean) {
  const modes = (venue.presentationModes || []).filter((mode: Record<string, any>) => mode.enabled);
  const activeModes = filmMode && venue.isHybrid
    ? modes.filter((mode: Record<string, any>) => mode.isFilmMode)
    : modes.filter((mode: Record<string, any>) => !mode.isFilmMode);
  return activeModes.length ? activeModes : modes;
}

export function defaultPresArFor(venue: DocsVenue, filmMode: boolean): number {
  const modes = compatiblePresentationModes(venue, filmMode);
  const fallback = filmMode && venue.isHybrid ? 1.43 : venue.defaultPresentationAr;
  if (modes.length === 0) return fallback;
  return (modes.find((mode: Record<string, any>) => Math.abs(mode.ar - fallback) < 0.01) || modes[0]).ar;
}

export function resolvePresAr(venue: DocsVenue, requestedPresAr: number, filmMode: boolean): number {
  const modes = compatiblePresentationModes(venue, filmMode);
  if (modes.length === 0) return requestedPresAr || defaultPresArFor(venue, filmMode);
  const requestedMode = modes.find((mode: Record<string, any>) => Math.abs(mode.ar - requestedPresAr) < 0.01);
  return (
    requestedMode ||
    modes.find((mode: Record<string, any>) => Math.abs(mode.ar - defaultPresArFor(venue, filmMode)) < 0.01) ||
    modes[0]
  ).ar;
}

export function computeStats(
  venue: DocsVenue,
  seat: 'front' | 'mid' | 'back',
  contentAr: number,
  requestedPresAr: number,
  filmMode: boolean
) {
  const presAr = resolvePresAr(venue, requestedPresAr, filmMode);
  const proj = filmMode && venue.filmProjection ? venue.filmProjection : venue.projection;
  const dist = venue.seat[seat];
  const isDome = venue.screen.geometry === 'hemispherical';

  if (isDome) {
    const domeHFov = venue.screen.domeHFov || 180;
    const domeVFov = venue.screen.domeVFov || 125;
    const coverage = venue.screen.domeCoveragePct || 0.83;
    const domeArea = screenAreaDome(venue.screen.w, coverage * 100);
    const ppdVal = proj.resH != null
      ? domePpd(proj.resH, domeHFov).ppd
      : proj.scanEquivLow != null && proj.scanEquivHigh != null
        ? domePpd(null, domeHFov, proj.scanEquivLow, proj.scanEquivHigh).ppd
        : null;

    return {
      dist,
      physicalFov: domeHFov,
      ppdVal,
      presAr,
      projWindow: { w: venue.screen.w, h: venue.screen.h, ar: 1.43, geometry: 'hemispherical' },
      mask: {
        effW: Math.sqrt(domeArea),
        effH: Math.sqrt(domeArea),
        areaUtilPct: coverage * 100,
        letterbox: false,
        pillarbox: false,
        cropped: false,
      },
      contentHFov: domeHFov,
      contentVFov: domeVFov,
      fl: brightnessFL({ projection: proj }),
      physicalUtil: coverage * 100,
      visibleArea: domeArea,
      isDome: true,
      proj,
    };
  }

  if (!hasRenderableFlatGeometry(venue, dist)) {
    return {
      dist: isPositiveNumber(dist) ? dist : null,
      physicalFov: null,
      ppdVal: null,
      presAr,
      projWindow: { w: null, h: null, ar: presAr, geometry: venue.screen.geometry },
      mask: emptyMask(presAr, venue.screen.geometry),
      contentHFov: null,
      contentVFov: null,
      fl: brightnessFL({ projection: proj }),
      physicalUtil: null,
      visibleArea: null,
      isDome: false,
      invalidGeometry: true,
      proj,
    };
  }

  const physicalFov = horizontalFov(venue.screen.w, dist);
  const mask = visibleContentRect(venue.screen, contentAr, { ar: presAr, min_ar: presAr });
  if (!isPositiveNumber(mask.effW) || !isPositiveNumber(mask.effH)) {
    return {
      dist,
      physicalFov,
      ppdVal: null,
      presAr,
      projWindow: mask.projectedWindow,
      mask,
      contentHFov: null,
      contentVFov: null,
      fl: brightnessFL({ projection: proj }),
      physicalUtil: null,
      visibleArea: null,
      isDome: false,
      invalidGeometry: true,
      proj,
    };
  }
  const projWindow = mask.projectedWindow;
  const contentHFov = horizontalFov(mask.effW, dist);
  const contentVFov = horizontalFov(mask.effH, dist);
  const ppdVal = proj.resH != null ? computePpd(proj.resH, mask.effW, dist) : null;
  const fl = brightnessFL({ projection: proj });
  const physicalUtil = mask.areaUtilPct;

  return {
    dist,
    physicalFov,
    ppdVal,
    presAr,
    projWindow,
    mask,
    contentHFov,
    contentVFov,
    fl,
    physicalUtil,
    visibleArea: mask.effW * mask.effH,
    isDome: false,
    proj,
  };
}

function fmtInt(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return Math.round(n).toLocaleString();
}

function fmtNum(n: number | null | undefined, digits = 1): string {
  if (n == null || !Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return Math.round(n).toLocaleString();
  return n.toFixed(digits);
}

function makeRow(
  id: string,
  label: string,
  aVal: number | null | undefined,
  bVal: number | null | undefined,
  aDisplay: string,
  bDisplay: string,
  higherWins: boolean
) {
  if (aDisplay === bDisplay && aVal != null && bVal != null) {
    return { id, label, aDisplay, bDisplay, winner: 'tie', badgeLabel: 'Comparable' };
  }
  if (aVal == null || bVal == null) {
    return { id, label, aDisplay, bDisplay, winner: 'unknown', badgeLabel: 'Unknown' };
  }
  if (!Number.isFinite(aVal) && !Number.isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: 'tie', badgeLabel: 'Comparable' };
  }
  if (!Number.isFinite(aVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? 'a' : 'b', badgeLabel: higherWins ? 'A wins' : 'B wins' };
  }
  if (!Number.isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? 'b' : 'a', badgeLabel: higherWins ? 'B wins' : 'A wins' };
  }
  const wins = higherWins ? aVal > bVal : aVal < bVal;
  const winner = aVal === bVal ? 'tie' : wins ? 'a' : 'b';
  const badgeMap: Record<string, string> = { a: 'A wins', b: 'B wins', tie: 'Comparable', unknown: 'Unknown' };
  return { id, label, aDisplay, bDisplay, winner, badgeLabel: badgeMap[winner] };
}

const HDR_RANK: Record<string, number> = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };

function makeHdrRow(id: string, label: string, catA: string, catB: string, labelA: string, labelB: string) {
  const rankA = HDR_RANK[catA] ?? -1;
  const rankB = HDR_RANK[catB] ?? -1;
  const isDiffSystems =
    (catA === 'photochemical' && catB === 'dolby_vision') ||
    (catA === 'dolby_vision' && catB === 'photochemical');
  if (isDiffSystems) {
    return { id, label, aDisplay: labelA, bDisplay: labelB, winner: 'tie', badgeLabel: 'Comparable', note: 'Different systems — not directly comparable' };
  }
  if (rankA === rankB) return { id, label, aDisplay: labelA, bDisplay: labelB, winner: 'tie', badgeLabel: 'Comparable' };
  const winner = rankA > rankB ? 'a' : 'b';
  return { id, label, aDisplay: labelA, bDisplay: labelB, winner, badgeLabel: winner === 'a' ? 'A wins' : 'B wins' };
}

export function buildComparisonRows(sideA: DocsVenue, sideB: DocsVenue, statsA: DocsStats, statsB: DocsStats) {
  const projA = statsA.proj;
  const projB = statsB.proj;
  const rows: Record<string, any>[] = [];

  rows.push({ ...makeRow('visible_hfov', 'Visible horizontal FOV', statsA.contentHFov, statsB.contentHFov, `${fmtInt(statsA.contentHFov)}°`, `${fmtInt(statsB.contentHFov)}°`, true),
    explain: 'How wide the movie image feels from your seat.' });
  rows.push({ ...makeRow('visible_vfov', 'Visible vertical FOV', statsA.contentVFov, statsB.contentVFov, `${fmtInt(statsA.contentVFov)}°`, `${fmtInt(statsB.contentVFov)}°`, true),
    explain: 'How tall the movie image feels — the key IMAX immersion factor.' });
  rows.push({ ...makeRow('ppd', 'Pixels per degree', statsA.ppdVal, statsB.ppdVal, statsA.ppdVal == null ? projA.scanEquivLabel || 'Unknown' : `${fmtInt(statsA.ppdVal)} ppd`, statsB.ppdVal == null ? projB.scanEquivLabel || 'Unknown' : `${fmtInt(statsB.ppdVal)} ppd`, true),
    explain: 'Perceived sharpness from this seat; higher usually looks crisper.' });

  const aArea = isPositiveNumber(statsA.visibleArea)
    ? statsA.visibleArea
    : isPositiveNumber(statsA.mask.effW) && isPositiveNumber(statsA.mask.effH)
      ? statsA.mask.effW * statsA.mask.effH
      : null;
  const bArea = isPositiveNumber(statsB.visibleArea)
    ? statsB.visibleArea
    : isPositiveNumber(statsB.mask.effW) && isPositiveNumber(statsB.mask.effH)
      ? statsB.mask.effW * statsB.mask.effH
      : null;
  rows.push({ ...makeRow('area', 'Visible content area', aArea, bArea, aArea == null ? 'Unknown' : `${fmtInt(aArea)} sq ft`, bArea == null ? 'Unknown' : `${fmtInt(bArea)} sq ft`, true),
    explain: 'How large the actual movie image is, after masking or cropping.' });
  rows.push({ ...makeRow('util', 'Screen utilization', statsA.physicalUtil, statsB.physicalUtil, statsA.physicalUtil == null ? 'Unknown' : `${fmtInt(statsA.physicalUtil)}%`, statsB.physicalUtil == null ? 'Unknown' : `${fmtInt(statsB.physicalUtil)}%`, true),
    explain: 'How much of the physical screen this movie format fills.' });
  rows.push({ ...makeRow('brightness', 'Brightness', statsA.fl, statsB.fl, statsA.fl != null ? `${fmtNum(statsA.fl, 1)} fL` : 'Unknown', statsB.fl != null ? `${fmtNum(statsB.fl, 1)} fL` : 'Unknown', true),
    explain: 'How much light reaches the screen; higher helps HDR and punch.' });

  const aContrNum = projA.isPerPixelEmissive ? Infinity : projA.nativeContrast;
  const bContrNum = projB.isPerPixelEmissive ? Infinity : projB.nativeContrast;
  const aContrDisp = projA.isPerPixelEmissive ? '∞' : (projA.nativeContrast ? `${projA.nativeContrast.toLocaleString()}:1` : 'Unknown');
  const bContrDisp = projB.isPerPixelEmissive ? '∞' : (projB.nativeContrast ? `${projB.nativeContrast.toLocaleString()}:1` : 'Unknown');
  rows.push({ ...makeRow('contrast', 'Native contrast', aContrNum, bContrNum, aContrDisp, bContrDisp, true),
    explain: "Projector's sequential (on/off) contrast — measured before any dynamic HDR system." });

  const hdrRow = makeHdrRow('hdr', 'HDR black level', projA.hdrCategory, projB.hdrCategory, projA.hdrLabel, projB.hdrLabel);
  rows.push({ ...hdrRow, explain: 'Whether the system can dynamically deepen blacks for HDR content.' });

  const aDepthDisp = projA.hdrLabel === '—' ? 'SDR' : projA.hdrLabel;
  const bDepthDisp = projB.hdrLabel === '—' ? 'SDR' : projB.hdrLabel;
  rows.push({
    id: 'depth',
    label: 'Picture depth',
    aDisplay: aDepthDisp,
    bDisplay: bDepthDisp,
    winner: hdrRow.winner,
    badgeLabel: hdrRow.badgeLabel,
    note: hdrRow.note || null,
    explain: 'Overall sense of contrast, HDR, and image dimensionality.',
  });

  return rows;
}

const VERDICT_LABEL: Record<string, string> = {
  visible_hfov: 'horizontal immersion',
  visible_vfov: 'vertical immersion',
  ppd: 'sharpness',
  area: 'visible image area',
  util: 'screen utilization',
  brightness: 'brightness',
  contrast: 'native contrast',
  hdr: 'HDR black level',
  depth: 'picture depth',
};

export function buildVerdict(sideA: DocsVenue, sideB: DocsVenue, rows: Record<string, any>[]) {
  const aWinsRows = rows.filter((row) => row.winner === 'a');
  const bWinsRows = rows.filter((row) => row.winner === 'b');
  const tieRows = rows.filter((row) => row.winner === 'tie');
  const priority = ['area', 'visible_vfov', 'visible_hfov', 'contrast', 'brightness', 'hdr', 'ppd', 'util', 'depth'];
  const rowLabel = (row: Record<string, any>) => VERDICT_LABEL[row.id] || row.label.toLowerCase();
  const joinLabels = (labels: string[]) => labels.length <= 2 ? labels.join(' and ') : `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
  const topLabels = (winRows: Record<string, any>[]) => winRows.slice().sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id)).slice(0, 3).map(rowLabel);
  const sentences: Record<string, any>[] = [];

  if (aWinsRows.length > 0 && bWinsRows.length > 0) {
    sentences.push({ side: 'a', text: `leads on ${joinLabels(topLabels(aWinsRows))}.` });
    sentences.push({ side: 'b', text: `leads on ${joinLabels(topLabels(bWinsRows))}.` });
  } else if (aWinsRows.length === 0 && bWinsRows.length > 0) {
    const dominates = bWinsRows.length >= rows.length - 1;
    sentences.push({ side: 'b', text: dominates ? 'leads across nearly every measurable category.' : `leads on ${joinLabels(topLabels(bWinsRows))}.` });
  } else if (bWinsRows.length === 0 && aWinsRows.length > 0) {
    const dominates = aWinsRows.length >= rows.length - 1;
    sentences.push({ side: 'a', text: dominates ? 'leads across nearly every measurable category.' : `leads on ${joinLabels(topLabels(aWinsRows))}.` });
  } else {
    sentences.push({ side: null, text: 'These two are closely matched.' });
  }

  const tieNames = tieRows.filter((row) => row.id !== 'depth').slice(0, 3).map(rowLabel);
  if (tieNames.length === 1) {
    sentences.push({ side: null, text: `${tieNames[0].charAt(0).toUpperCase() + tieNames[0].slice(1)} is comparable from this seat.` });
  } else if (tieNames.length > 1) {
    const last = tieNames.pop();
    sentences.push({ side: null, text: `${tieNames.join(', ')} and ${last} are comparable from this seat.` });
  }

  return { sentences, aWins: aWinsRows, bWins: bWinsRows, ties: tieRows, aName: sideA.name, bName: sideB.name };
}

export const browserWorkbenchSource = `// GENERATED FILE. Run npm run build:docs-data.
window.LIEMAX_WORKBENCH = (function () {
  const M = window.LIEMAX_MATH;
  const HDR_RANK = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };
  const VERDICT_LABEL = { visible_hfov: "horizontal immersion", visible_vfov: "vertical immersion", ppd: "sharpness", area: "visible image area", util: "screen utilization", brightness: "brightness", contrast: "native contrast", hdr: "HDR black level", depth: "picture depth" };
  function isPositiveNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }
  function emptyMask(presAr, geometry) {
    return { effW: null, effH: null, areaUtilPct: null, letterbox: false, pillarbox: false, cropped: false, projectedWindow: { w: null, h: null, ar: presAr ?? null, geometry: geometry ?? null }, physicalClipped: false };
  }
  function hasRenderableFlatGeometry(venue, dist) {
    return isPositiveNumber(venue?.screen?.w) && isPositiveNumber(venue?.screen?.h) && isPositiveNumber(dist);
  }
  function visibleContentRect(screen, contentAR, presentation) {
    if (!isPositiveNumber(screen?.w) || !isPositiveNumber(screen?.h) || !isPositiveNumber(presentation.ar)) return emptyMask(presentation.ar, screen?.geometry);
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
    if (!hasRenderableFlatGeometry(venue, dist)) {
      return { dist: isPositiveNumber(dist) ? dist : null, physicalFov: null, ppdVal: null, presAr, projWindow: { w: null, h: null, ar: presAr, geometry: venue.screen.geometry }, mask: emptyMask(presAr, venue.screen.geometry), contentHFov: null, contentVFov: null, fl: brightnessFL({ projection: proj }), physicalUtil: null, visibleArea: null, isDome: false, invalidGeometry: true, proj };
    }
    const physicalFov = M.horizontalFovDeg(venue.screen.w, dist);
    const mask = visibleContentRect(venue.screen, contentAr, { ar: presAr, min_ar: presAr });
    if (!isPositiveNumber(mask.effW) || !isPositiveNumber(mask.effH)) {
      return { dist, physicalFov, ppdVal: null, presAr, projWindow: mask.projectedWindow, mask, contentHFov: null, contentVFov: null, fl: brightnessFL({ projection: proj }), physicalUtil: null, visibleArea: null, isDome: false, invalidGeometry: true, proj };
    }
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
    const aArea = isPositiveNumber(statsA.visibleArea) ? statsA.visibleArea : (isPositiveNumber(statsA.mask.effW) && isPositiveNumber(statsA.mask.effH) ? statsA.mask.effW * statsA.mask.effH : null);
    const bArea = isPositiveNumber(statsB.visibleArea) ? statsB.visibleArea : (isPositiveNumber(statsB.mask.effW) && isPositiveNumber(statsB.mask.effH) ? statsB.mask.effW * statsB.mask.effH : null);
    rows.push({ ...makeRow("area", "Visible content area", aArea, bArea, aArea == null ? "Unknown" : fmtInt(aArea) + " sq ft", bArea == null ? "Unknown" : fmtInt(bArea) + " sq ft", true), explain: "How large the actual movie image is, after masking or cropping." });
    rows.push({ ...makeRow("util", "Screen utilization", statsA.physicalUtil, statsB.physicalUtil, statsA.physicalUtil == null ? "Unknown" : fmtInt(statsA.physicalUtil) + "%", statsB.physicalUtil == null ? "Unknown" : fmtInt(statsB.physicalUtil) + "%", true), explain: "How much of the physical screen this movie format fills." });
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
`;
