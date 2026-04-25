/**
 * LIEMAX Math Engine — Pixels Per Degree (PPD)
 * 
 * Group 3: The metric that matters most for perceived sharpness.
 * 
 * PPD tells you how many pixels fill each degree of your visual field.
 * Higher PPD = sharper image. Below ~60 PPD (20/20 acuity), pixel
 * structure becomes visible. Above ~120 PPD, you've exceeded retinal limits.
 * 
 * The core insight this engine exposes: a 4K TV at 8 ft delivers ~137 PPD
 * (near-retinal), while a 4K IMAX GT at mid-row delivers ~77 PPD. Cinema
 * wins on SCALE and immersion, not per-pixel sharpness.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * ONE FORMULA FOR EVERYTHING (flat screens)
 * 
 * PPD = horizontal_pixels / horizontal_FOV_degrees
 * 
 * where FOV = 2 × arctan(screen_width / (2 × viewing_distance))  [radians]
 *           × (180 / π)  [→ degrees]
 * 
 * This works identically for cinema screens and home displays.
 * For home displays, derive screen_width from diagonal + aspect_ratio.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { RAD_TO_DEG, SUPERSAMPLING_FACTOR, IN_PER_FT } from './constants';
import { diagonalToDimensions } from './geometry';
import { horizontalFov } from './fov';
import type { PpdResult, ResolutionMode, ResolvedVenue, ResolvedHomeDisplay } from './types';

// ─── Core PPD Formula ───────────────────────────────────────────────

/**
 * The universal PPD formula for any flat/curved screen.
 * 
 *   PPD = horizontalPixels / FOV_degrees
 *   FOV = 2 × arctan(screenWidth / (2 × viewingDistance)) × 180/π
 * 
 * Units for screenWidth and viewingDistance must match (both feet, both
 * inches, both meters — doesn't matter as long as they're the same).
 * 
 * @param horizontalPixels - Number of horizontal pixels (or scan-equivalent for film)
 * @param screenWidth - Screen width in any unit
 * @param viewingDistance - Viewing distance in the SAME unit as screenWidth
 * @returns PPD value
 */
export function computePpd(
  horizontalPixels: number,
  screenWidth: number,
  viewingDistance: number
): number {
  if (horizontalPixels <= 0) throw new Error(`horizontalPixels must be positive, got ${horizontalPixels}`);
  if (screenWidth <= 0) throw new Error(`screenWidth must be positive, got ${screenWidth}`);
  if (viewingDistance <= 0) throw new Error(`viewingDistance must be positive, got ${viewingDistance}`);

  const fovDeg = horizontalFov(screenWidth, viewingDistance);
  return horizontalPixels / fovDeg;
}

// ─── Cinema PPD (with resolution mode support) ──────────────────────

/**
 * PPD for a cinema venue at a given viewing distance.
 * 
 * Supports multiple resolution modes to handle the contentious cases:
 * 
 * - 'native': Uses the projector's native pixel count (4096 for 4K, 2048 for 2K).
 *   This is the honest, defensible number for digital projection.
 * 
 * - 'scan_equivalent_low' / 'scan_equivalent_high': For 15/70 film, uses the
 *   scan-equivalent resolution range (~8,800–11,700 horizontal). Film has no
 *   pixels — this converts grain-limited optical resolution to a digital
 *   equivalent. The range reflects scanning methodology (8µm vs 6µm).
 *   ALWAYS displayed as a range with a caveat, never a single number.
 * 
 * - 'supersampled': For GT Dual Laser, applies the √2 × native factor (~5,792
 *   from 4096). This represents the theoretical sampling advantage of two
 *   projectors with half-pixel offset. ALWAYS labeled as illustrative —
 *   IMAX has never published this as an official spec.
 * 
 * @param venue - Resolved cinema venue
 * @param viewingDistanceFt - Distance to screen in feet
 * @param mode - Which resolution figure to use
 */
export function cinemaPpd(
  venue: ResolvedVenue,
  viewingDistanceFt: number,
  mode: ResolutionMode = 'native'
): PpdResult {
  const { screen } = venue;
  const projection = selectProjectionForMode(venue, mode);
  let pixels: number;
  let caveat: string | undefined;

  switch (mode) {
    case 'native':
      if (projection.resolution_horizontal_px === null) {
        throw new Error(
          `No native digital resolution for ${venue.name} (film projector?). ` +
          `Use 'scan_equivalent_low' or 'scan_equivalent_high' instead.`
        );
      }
      pixels = projection.resolution_horizontal_px;
      break;

    case 'scan_equivalent_low':
      if (projection.resolution_scan_equivalent_low === null) {
        throw new Error(`No scan-equivalent resolution for ${venue.name} (digital projector?). Use 'native' instead.`);
      }
      pixels = projection.resolution_scan_equivalent_low;
      caveat = 'Film scan-equivalent (conservative, 8µm scan). Grain limits perceived detail before resolution does.';
      break;

    case 'scan_equivalent_high':
      if (projection.resolution_scan_equivalent_high === null) {
        throw new Error(`No scan-equivalent resolution for ${venue.name} (digital projector?). Use 'native' instead.`);
      }
      pixels = projection.resolution_scan_equivalent_high;
      caveat = 'Film scan-equivalent (optimistic, 6µm scan). Grain limits perceived detail before resolution does.';
      break;

    case 'supersampled':
      if (!projection.dual_projector) {
        throw new Error(`Supersampled mode requires a dual-projector system. ${venue.name} is single-projector.`);
      }
      if (projection.resolution_horizontal_px === null) {
        throw new Error(`No native digital resolution for supersampling calculation.`);
      }
      pixels = projection.resolution_horizontal_px * SUPERSAMPLING_FACTOR;
      caveat = `~${Math.round(pixels)} illustrative sampling equivalent (√2 × ${projection.resolution_horizontal_px}, half-pixel offset). Not an official IMAX specification.`;
      break;

    default:
      throw new Error(`Unknown resolution mode: ${mode}`);
  }

  const screenWidthFt = projection.effective_screen_width_ft ?? screen.width_ft;
  const ppd = computePpd(pixels, screenWidthFt, viewingDistanceFt);

  return { ppd, resolution_mode: mode, caveat };
}

function selectProjectionForMode(venue: ResolvedVenue, mode: ResolutionMode) {
  if (!venue.hybrid_projection) return venue.projection;

  if (mode === 'scan_equivalent_low' || mode === 'scan_equivalent_high') {
    return venue.hybrid_projection.film ?? venue.projection;
  }

  return venue.hybrid_projection.digital ?? venue.projection;
}

// ─── Dome PPD ───────────────────────────────────────────────────────

/**
 * PPD for an IMAX Dome screen.
 * 
 * This is the straightforward quantification of why dome image quality
 * is lower than flat-screen formats like GT Laser or Dolby Cinema,
 * despite the dome's massive surface area and immersive coverage.
 * 
 * The math is simple: the same 4,096 horizontal pixels are spread
 * across 180° of FOV on a dome vs. ~55–80° on a flat screen.
 * 
 *   Dome PPD (4K digital, 180°): 4096 / 180 ≈ 22.8 PPD
 *   GT Laser PPD (4K, mid-row):  4096 / ~53° ≈ 77 PPD
 * 
 * That's the whole story: 22.8 vs 77. Dome trades sharpness for immersion.
 * 
 * Note: IMAX's dome laser uses non-linear pixel mapping (concentrating
 * more pixels in the center where the eye focuses, stretching them at
 * the periphery where acuity drops). The center-dome PPD is somewhat
 * higher than this average, but the average is the honest number for
 * the full viewing experience.
 * 
 * @param horizontalPixels - Projector's horizontal pixel count (4096 for 4K)
 * @param horizontalFovDeg - Dome's horizontal FOV in degrees (180 typical)
 * @param scanEquivLow - Optional: film scan-equivalent low bound
 * @param scanEquivHigh - Optional: film scan-equivalent high bound
 */
export function domePpd(
  horizontalPixels: number | null,
  horizontalFovDeg: number,
  scanEquivLow?: number | null,
  scanEquivHigh?: number | null
): PpdResult {
  if (horizontalFovDeg <= 0 || horizontalFovDeg > 180) {
    throw new Error(`horizontalFovDeg must be >0 and <=180, got ${horizontalFovDeg}`);
  }

  // Prefer digital resolution; fall back to scan-equivalent for film domes
  if (horizontalPixels !== null && horizontalPixels > 0) {
    const ppd = horizontalPixels / horizontalFovDeg;
    return {
      ppd,
      resolution_mode: 'native',
      caveat: `Average across ${horizontalFovDeg}° dome. Center PPD is higher due to non-linear pixel mapping; periphery is lower. The human eye is less sensitive to detail in peripheral vision, partially compensating.`,
    };
  }

  if (scanEquivLow && scanEquivHigh) {
    const ppdLow = scanEquivLow / horizontalFovDeg;
    const ppdHigh = scanEquivHigh / horizontalFovDeg;
    return {
      ppd: (ppdLow + ppdHigh) / 2, // midpoint for single-number comparisons
      resolution_mode: 'scan_equivalent_low',
      caveat: `Film dome: ${ppdLow.toFixed(1)}–${ppdHigh.toFixed(1)} PPD range (scan-equivalent). Grain-limited in practice. Average across ${horizontalFovDeg}° dome.`,
    };
  }

  throw new Error('domePpd() requires either digital resolution or film scan-equivalent values.');
}

// ─── Home Display PPD ───────────────────────────────────────────────

/**
 * PPD for a home display.
 * 
 * Uses the same core formula as cinema — the only difference is input path.
 * Home displays provide diagonal + AR (from which we derive width) and
 * viewing distance, vs. cinema which provides width directly.
 * 
 * @param display - Resolved home display record
 * @returns PpdResult with the PPD value and 'home_display' mode
 */
export function homeDisplayPpd(display: ResolvedHomeDisplay): PpdResult {
  const { width } = diagonalToDimensions(display.screen_diagonal_in, display.aspect_ratio);
  const viewingDistanceIn = display.viewing_distance_ft * IN_PER_FT;

  const ppd = computePpd(
    display.display_optics.resolution_horizontal_px,
    width,      // in inches
    viewingDistanceIn  // in inches (same unit)
  );

  return { ppd, resolution_mode: 'home_display' };
}

// ─── Off-Axis PPD ───────────────────────────────────────────────────

/**
 * PPD calculation for off-center seating on a flat screen.
 * 
 * COUNTERINTUITIVE RESULT: Average PPD actually INCREASES when you sit
 * off-center, because the screen subtends a narrower total FOV, so the
 * same number of pixels pack into fewer degrees. However, this does NOT
 * mean a better image — the real degradation is:
 *   - Keystoning (trapezoidal distortion)
 *   - Non-uniform pixel distribution (near edge is soft, far edge compressed)
 *   - Reduced perceived immersion (screen no longer fills symmetric FOV)
 * 
 * Average PPD is a misleading metric for off-axis seats. This function
 * computes it for completeness but the caveat string explains the nuance.
 * 
 * Geometry:
 *   For a viewer at lateral offset X from center, at distance D from screen:
 *   - The screen spans from (screenWidth/2 + X) to the left
 *     and (screenWidth/2 - X) to the right
 *   - The angular span is:
 *     FOV_off = arctan((W/2 + X) / D) + arctan((W/2 - X) / D)
 *   - PPD_off = horizontalPixels / FOV_off_degrees
 * 
 * FOV_off ≤ FOV_center (by concavity of arctan), so PPD_off ≥ PPD_center.
 * 
 * For curved screens (IMAX GT), the curvature partially compensates
 * for off-axis viewing by wrapping the edges toward the viewer. Without
 * a known curvature radius, we can't model this precisely.
 * 
 * @param horizontalPixels - Pixel count
 * @param screenWidth - Screen width (any unit — must match viewingDistance and lateralOffset)
 * @param viewingDistance - Distance to screen (same unit as screenWidth)
 * @param lateralOffset - Distance from center seat (same unit; positive = right)
 * @returns PpdResult with adjusted PPD (≥ center-seat PPD) and explanatory caveat
 */
export function offAxisPpd(
  horizontalPixels: number,
  screenWidth: number,
  viewingDistance: number,
  lateralOffset: number
): PpdResult {
  if (Math.abs(lateralOffset) >= screenWidth / 2) {
    throw new Error(
      `Lateral offset (${lateralOffset}) exceeds half the screen width (${screenWidth / 2}). ` +
      `The viewer would be beyond the screen edge.`
    );
  }

  const halfWidth = screenWidth / 2;
  const offset = Math.abs(lateralOffset); // symmetric — left and right are equivalent

  // Angular span from off-center position
  // Left edge angle + right edge angle (both measured from the viewer's forward direction)
  const angleLeft = Math.atan((halfWidth + offset) / viewingDistance);
  const angleRight = Math.atan((halfWidth - offset) / viewingDistance);
  const fovRad = angleLeft + angleRight;
  const fovDeg = fovRad * RAD_TO_DEG;

  const ppd = horizontalPixels / fovDeg;
  const centerPpd = horizontalPixels / (2 * Math.atan(halfWidth / viewingDistance) * RAD_TO_DEG);

  return {
    ppd,
    resolution_mode: 'native',
    caveat: offset > 0
      ? `Off-axis seat (${lateralOffset.toFixed(0)} from center). ` +
        `Average PPD is ${((ppd / centerPpd - 1) * 100).toFixed(1)}% higher than center because ` +
        `the screen subtends a narrower FOV — but this does NOT mean a better image. ` +
        `Off-axis viewing introduces keystoning, non-uniform pixel stretching ` +
        `(near edge is soft, far edge is compressed), and reduced perceived immersion. ` +
        `Flat-screen model — curved screens (IMAX GT) partially compensate.`
      : undefined,
  };
}
