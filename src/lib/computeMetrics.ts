import {
  cinemaPpd,
  computeCinemaFov,
  computeMasking,
  contentCropLoss,
  diagonalToDimensions,
  domeFov,
  domePpd,
  flToNits,
  homeDisplayFov,
  homeDisplayPpd,
  screenAreaDome,
  screenAreaFlat,
  type ContentFormat,
  type ResolutionMode,
  type ResolvedHomeDisplay,
  type ResolvedVenue,
} from '../math';

export type SeatPosition = 'front' | 'mid' | 'back';
export type MaskingMode = 'letterboxed' | 'pillarboxed' | 'cropped' | 'fit' | null;

export interface ComputedMetrics {
  screenWidthFt: number | null;
  screenHeightFt: number | null;
  screenAreaSqFt: number | null;
  screenDiagonalIn: number | null;
  viewingDistanceFt: number | null;
  isDome: boolean;
  contentAr: number | null;
  effectiveWidthFt: number | null;
  effectiveHeightFt: number | null;
  effectiveAreaSqFt: number | null;
  utilizationPct: number | null;
  maskingMode: MaskingMode;
  cropLossPct: number | null;
  fovHorizontalDeg: number | null;
  fovVerticalDeg: number | null;
  fovAboveHorizonDeg: number | null;
  fovBelowHorizonDeg: number | null;
  ppdValue: number | null;
  ppdLow: number | null;
  ppdHigh: number | null;
  ppdCaveat: string | null;
  brightnessCinemaFl: number | null;
  brightnessCinemaNits: number | null;
  brightnessHomeFullscreenNits: number | null;
  brightnessPeakHdrNits: number | null;
  brightnessSdrNits: number | null;
  contrastSequential: number | null;
  contrastIsInfinite: boolean;
  resolutionHorizontalPx: number | null;
  resolutionVerticalPx: number | null;
  resolutionLabel: string | null;
  warnings: string[];
}

export function computeVenueMetrics(
  venue: ResolvedVenue,
  contentFormat: ContentFormat,
  seatPosition: SeatPosition
): ComputedMetrics {
  const warnings: string[] = [];
  const screen = venue.screen;
  const projection = venue.projection;
  const isDome = screen.geometry === 'hemispherical';
  const screenWidthFt = positiveOrNull(screen.width_ft);
  const screenHeightFt = positiveOrNull(screen.height_ft);
  const viewingDistanceFt = seatingDistance(venue, seatPosition);
  const brightnessCinemaFl = positiveOrNull(projection.brightness_fl);
  const contrastSequential = positiveOrNull(projection.contrast_sequential);
  const isFilm = isFilmProjection(projection);

  let metrics: ComputedMetrics = {
    ...emptyMetrics(),
    screenWidthFt,
    screenHeightFt,
    screenAreaSqFt: computeScreenArea(screenWidthFt, screenHeightFt, isDome, screen.dome_coverage_pct),
    screenDiagonalIn: null,
    viewingDistanceFt,
    isDome,
    contentAr: finiteOrNull(contentFormat.aspect_ratio),
    brightnessCinemaFl,
    brightnessCinemaNits: brightnessCinemaFl == null ? null : flToNits(brightnessCinemaFl),
    contrastSequential,
    contrastIsInfinite: false,
    resolutionHorizontalPx: projection.resolution_horizontal_px ?? null,
    resolutionVerticalPx: projection.resolution_vertical_px ?? null,
    resolutionLabel: resolutionLabelForProjection(projection),
    warnings,
  };

  if (venue.capabilities.has_screenx) {
    warnings.push('Side panels active ~20-40% of runtime - main screen metrics shown.');
  }

  if (!screenWidthFt || !screenHeightFt) {
    warnings.push('Select a specific venue for distance-dependent metrics.');
    return metrics;
  }

  if (isDome) {
    metrics = applyDomeMetrics(metrics, venue);
  } else {
    metrics = applyCinemaFovAndPpd(metrics, venue, viewingDistanceFt, isFilm);
  }

  if (!isDome) {
    metrics = applyMasking(metrics, screenWidthFt, screenHeightFt, contentFormat.aspect_ratio, projection.min_content_ar_supported ?? venue.capabilities.min_content_ar_supported);
  }

  appendPpdWarning(metrics);
  return metrics;
}

export function computeHomeMetrics(
  display: ResolvedHomeDisplay,
  contentFormat: ContentFormat
): ComputedMetrics {
  const warnings: string[] = [];
  const diagonalIn = positiveOrNull(display.screen_diagonal_in);

  if (!diagonalIn) {
    return {
      ...emptyMetrics(),
      screenDiagonalIn: null,
      viewingDistanceFt: positiveOrNull(display.viewing_distance_ft),
      isDome: false,
      contentAr: finiteOrNull(contentFormat.aspect_ratio),
      warnings: ['Enter screen size to see computed metrics - no sensible projector default exists.'],
    };
  }

  const aspectRatio = positiveOrNull(display.aspect_ratio);
  const viewingDistanceFt = positiveOrNull(display.viewing_distance_ft);
  if (!aspectRatio || !viewingDistanceFt) {
    return {
      ...emptyMetrics(),
      screenDiagonalIn: diagonalIn,
      viewingDistanceFt,
      isDome: false,
      contentAr: finiteOrNull(contentFormat.aspect_ratio),
      warnings: ['Enter viewing distance to see computed home display metrics.'],
    };
  }

  const dimensionsIn = diagonalToDimensions(diagonalIn, aspectRatio);
  const screenWidthFt = dimensionsIn.width / 12;
  const screenHeightFt = dimensionsIn.height / 12;
  const fullscreenNits = positiveOrNull(display.display_optics.brightness_fullscreen_nits);
  const peakNits = positiveOrNull(display.display_optics.brightness_peak_hdr_nits);
  const sdrNits = positiveOrNull(display.display_optics.brightness_sdr_nits);

  if (display.display_optics.brightness_fullscreen_nits == null) {
    warnings.push('Fullscreen brightness unavailable for this device; brightness comparison skipped.');
  }

  const metrics: ComputedMetrics = {
    ...emptyMetrics(),
    screenWidthFt,
    screenHeightFt,
    screenAreaSqFt: screenAreaFlat(screenWidthFt, screenHeightFt),
    screenDiagonalIn: diagonalIn,
    viewingDistanceFt,
    isDome: false,
    contentAr: finiteOrNull(contentFormat.aspect_ratio),
    fovHorizontalDeg: safeNumber(() => homeDisplayFov(dimensionsIn.width, viewingDistanceFt * 12)),
    ppdValue: safeNumber(() => homeDisplayPpd(display).ppd),
    brightnessHomeFullscreenNits: fullscreenNits,
    brightnessPeakHdrNits: peakNits,
    brightnessSdrNits: sdrNits,
    contrastSequential: positiveOrNull(display.display_optics.contrast_sequential),
    contrastIsInfinite: display.display_optics.contrast_sequential == null && display.display_optics.is_per_pixel_emissive,
    resolutionHorizontalPx: display.display_optics.resolution_horizontal_px ?? null,
    resolutionVerticalPx: display.display_optics.resolution_vertical_px ?? null,
    resolutionLabel: resolutionLabelForPixels(
      display.display_optics.resolution_horizontal_px,
      display.display_optics.resolution_vertical_px,
      false
    ),
    warnings,
  };

  applyMasking(metrics, screenWidthFt, screenHeightFt, contentFormat.aspect_ratio, 0.01);
  appendPpdWarning(metrics);
  return metrics;
}

function applyDomeMetrics(metrics: ComputedMetrics, venue: ResolvedVenue): ComputedMetrics {
  const fov = safeResult(() => domeFov(venue.screen));
  if (!fov) return metrics;

  metrics.fovHorizontalDeg = fov.horizontal_deg;
  metrics.fovVerticalDeg = fov.vertical_total_deg;
  metrics.fovAboveHorizonDeg = fov.vertical_above_horizon_deg;
  metrics.fovBelowHorizonDeg = fov.vertical_below_horizon_deg;

  const ppd = safeResult(() =>
    domePpd(
      venue.projection.resolution_horizontal_px,
      fov.horizontal_deg,
      venue.projection.resolution_scan_equivalent_low,
      venue.projection.resolution_scan_equivalent_high
    )
  );

  if (ppd) {
    metrics.ppdValue = ppd.ppd;
    metrics.ppdCaveat = ppd.caveat ?? null;
  }

  return metrics;
}

function applyCinemaFovAndPpd(
  metrics: ComputedMetrics,
  venue: ResolvedVenue,
  viewingDistanceFt: number | null,
  isFilm: boolean
): ComputedMetrics {
  if (!metrics.screenWidthFt || !metrics.screenHeightFt || !viewingDistanceFt) return metrics;

  const fov = safeResult(() =>
    computeCinemaFov(
      metrics.screenWidthFt!,
      metrics.screenHeightFt!,
      viewingDistanceFt,
      venue.screen.screen_bottom_height_ft ?? 5
    )
  );

  if (fov) {
    metrics.fovHorizontalDeg = fov.horizontal_deg;
    metrics.fovVerticalDeg = fov.vertical_total_deg;
    metrics.fovAboveHorizonDeg = fov.vertical_above_horizon_deg;
    metrics.fovBelowHorizonDeg = fov.vertical_below_horizon_deg;
  }

  if (isFilm) {
    const low = safeResult(() => cinemaPpd(venue, viewingDistanceFt, 'scan_equivalent_low'));
    const high = safeResult(() => cinemaPpd(venue, viewingDistanceFt, 'scan_equivalent_high'));
    metrics.ppdLow = low?.ppd ?? null;
    metrics.ppdHigh = high?.ppd ?? null;
    metrics.ppdValue = metrics.ppdLow != null && metrics.ppdHigh != null ? (metrics.ppdLow + metrics.ppdHigh) / 2 : null;
    metrics.ppdCaveat = low?.caveat ?? high?.caveat ?? 'Film scan-equivalent; grain-limited in practice.';
    return metrics;
  }

  const ppd = safeResult(() => cinemaPpd(venue, viewingDistanceFt, 'native' as ResolutionMode));
  metrics.ppdValue = ppd?.ppd ?? null;
  metrics.ppdCaveat = ppd?.caveat ?? null;
  return metrics;
}

function applyMasking(
  metrics: ComputedMetrics,
  screenWidthFt: number,
  screenHeightFt: number,
  contentAr: number,
  minContentArSupported: number
): ComputedMetrics {
  const masking = safeResult(() =>
    computeMasking(screenWidthFt, screenHeightFt, contentAr, minContentArSupported)
  );
  if (!masking) return metrics;

  metrics.effectiveWidthFt = masking.effective_width_ft;
  metrics.effectiveHeightFt = masking.effective_height_ft;
  metrics.effectiveAreaSqFt = masking.effective_area_sqft;
  metrics.utilizationPct = masking.screen_utilization_pct;
  metrics.maskingMode = masking.cropped
    ? 'cropped'
    : masking.letterboxed
      ? 'letterboxed'
      : masking.pillarboxed
        ? 'pillarboxed'
        : 'fit';
  metrics.cropLossPct = masking.cropped ? contentCropLoss(contentAr, minContentArSupported) : 0;

  return metrics;
}

function computeScreenArea(
  widthFt: number | null,
  heightFt: number | null,
  isDome: boolean,
  coveragePct?: number
): number | null {
  if (!widthFt || !heightFt) return null;
  return safeNumber(() => isDome ? screenAreaDome(widthFt, coveragePct ?? 83) : screenAreaFlat(widthFt, heightFt));
}

function seatingDistance(venue: ResolvedVenue, seatPosition: SeatPosition): number | null {
  const key = `viewing_distance_${seatPosition}_ft` as const;
  return positiveOrNull(venue.seating[key]);
}

function isFilmProjection(projection: ResolvedVenue['projection']): boolean {
  return projection.mode === 'film' || (projection.resolution_horizontal_px === null && projection.resolution_scan_equivalent_low !== null);
}

function resolutionLabelForProjection(projection: ResolvedVenue['projection']): string | null {
  if (projection.resolution_scan_equivalent_low != null && projection.resolution_scan_equivalent_high != null) {
    return '~8.8K-11.7K scan-equivalent (grain-limited in practice)';
  }

  return projection.effective_resolution_label ?? resolutionLabelForPixels(
    projection.resolution_horizontal_px,
    projection.resolution_vertical_px,
    true
  );
}

function resolutionLabelForPixels(horizontalPx: number | null, verticalPx: number | null, isCinema: boolean): string | null {
  if (!horizontalPx || !verticalPx) return null;
  if (horizontalPx === 4096 && verticalPx === 2160) return isCinema ? '4K DCI' : '4K';
  if (horizontalPx === 3840 && verticalPx === 2160) return '4K';
  if (horizontalPx === 2048 && verticalPx === 1080) return isCinema ? '2K DCI' : '2K';
  return null;
}

function appendPpdWarning(metrics: ComputedMetrics): void {
  const lowValue = metrics.ppdLow ?? metrics.ppdValue;
  if (lowValue != null && lowValue < 60) {
    metrics.warnings.push('Pixel structure may be visible at this seat.');
  }
}

function emptyMetrics(): ComputedMetrics {
  return {
    screenWidthFt: null,
    screenHeightFt: null,
    screenAreaSqFt: null,
    screenDiagonalIn: null,
    viewingDistanceFt: null,
    isDome: false,
    contentAr: null,
    effectiveWidthFt: null,
    effectiveHeightFt: null,
    effectiveAreaSqFt: null,
    utilizationPct: null,
    maskingMode: null,
    cropLossPct: null,
    fovHorizontalDeg: null,
    fovVerticalDeg: null,
    fovAboveHorizonDeg: null,
    fovBelowHorizonDeg: null,
    ppdValue: null,
    ppdLow: null,
    ppdHigh: null,
    ppdCaveat: null,
    brightnessCinemaFl: null,
    brightnessCinemaNits: null,
    brightnessHomeFullscreenNits: null,
    brightnessPeakHdrNits: null,
    brightnessSdrNits: null,
    contrastSequential: null,
    contrastIsInfinite: false,
    resolutionHorizontalPx: null,
    resolutionVerticalPx: null,
    resolutionLabel: null,
    warnings: [],
  };
}

function positiveOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}

function finiteOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function safeNumber(fn: () => number): number | null {
  return safeResult(fn);
}

function safeResult<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}
