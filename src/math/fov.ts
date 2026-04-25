/**
 * LIEMAX Math Engine — Field of View (FOV)
 * 
 * Group 2: How much of the viewer's visual field the screen fills.
 * 
 * Key insight: vertical FOV is NOT symmetric. The screen bottom sits
 * above the floor (typically 5 ft), and the viewer's eyes are at a
 * different height depending on row position and rake angle. This means
 * the angle above the viewer's horizon is different from the angle below.
 * 
 * For flat/curved screens, FOV is calculated from geometry.
 * For domes, FOV is a fixed spec (180° × 125°) — not distance-dependent.
 */

import { RAD_TO_DEG, DEFAULT_EYE_HEIGHT_FT } from './constants';
import type { FovResult, ResolvedScreen } from './types';

// ─── Horizontal FOV ─────────────────────────────────────────────────

/**
 * Horizontal field of view for a flat or cylindrically curved screen.
 * 
 * Formula: FOV_h = 2 × arctan(W / (2 × D))
 * 
 * Units for screenWidth and viewingDistance must match (both feet, both
 * inches, both meters — doesn't matter as long as they're the same).
 * 
 * For cylindrically curved screens (IMAX GT), this formula slightly
 * UNDERESTIMATES FOV because the curve wraps toward the viewer at the
 * edges. The error is small (<2° for typical GT curvatures) and we
 * accept it for v1. A curved-screen correction would need the curvature
 * radius, which is unpublished for most venues.
 * 
 * @param screenWidth - Screen width in any unit
 * @param viewingDistance - Distance from viewer to screen center, same unit as screenWidth
 * @returns Horizontal FOV in degrees
 */
export function horizontalFov(screenWidth: number, viewingDistance: number): number {
  if (screenWidth <= 0) throw new Error(`screenWidth must be positive, got ${screenWidth}`);
  if (viewingDistance <= 0) throw new Error(`viewingDistance must be positive, got ${viewingDistance}`);

  return 2 * Math.atan(screenWidth / (2 * viewingDistance)) * RAD_TO_DEG;
}

// ─── Vertical FOV (Asymmetric) ──────────────────────────────────────

/**
 * Vertical FOV, split into above-horizon and below-horizon components.
 * 
 * This is more complex than horizontal because the screen isn't centered
 * on the viewer's eye level. The geometry:
 * 
 *   Screen bottom edge: screenBottomHeightFt above floor
 *   Screen top edge: screenBottomHeightFt + screenHeightFt above floor
 *   Viewer's eye: eyeHeightFt above floor (at their row)
 * 
 * The angle ABOVE the viewer's horizon to the screen top:
 *   α_above = arctan((screenTop - eyeHeight) / distance)   [if top > eye]
 * 
 * The angle BELOW the viewer's horizon to the screen bottom:
 *   α_below = arctan((eyeHeight - screenBottom) / distance) [if bottom < eye]
 * 
 * Total vertical FOV = α_above + α_below
 * 
 * If the viewer's eye is BELOW the screen bottom (e.g., very front row),
 * both angles are above the horizon and α_below becomes negative (looking up).
 * 
 * @param screenHeightFt - Screen height in feet
 * @param viewingDistanceFt - Horizontal distance to screen, in feet
 * @param screenBottomHeightFt - Screen bottom edge height above floor (default 5 ft)
 * @param eyeHeightFt - Viewer's eye height above floor (default ~3.75 ft for seated adult)
 */
export function verticalFov(
  screenHeightFt: number,
  viewingDistanceFt: number,
  screenBottomHeightFt: number = 5.0,
  eyeHeightFt: number = DEFAULT_EYE_HEIGHT_FT
): { total_deg: number; above_horizon_deg: number; below_horizon_deg: number } {
  if (screenHeightFt <= 0) throw new Error(`screenHeightFt must be positive`);
  if (viewingDistanceFt <= 0) throw new Error(`viewingDistanceFt must be positive`);

  const screenTopFt = screenBottomHeightFt + screenHeightFt;

  // Angle from eye level to screen top (positive = above horizon)
  const aboveHorizon = Math.atan((screenTopFt - eyeHeightFt) / viewingDistanceFt) * RAD_TO_DEG;

  // Angle from eye level to screen bottom (positive = below horizon)
  const belowHorizon = Math.atan((eyeHeightFt - screenBottomHeightFt) / viewingDistanceFt) * RAD_TO_DEG;

  // Total vertical FOV is the algebraic sum of both angles.
  // When eye is below screen bottom, belowHorizon goes negative (viewer
  // is looking UP at the bottom edge), which correctly reduces the total.
  const total = aboveHorizon + belowHorizon;

  return {
    total_deg: total,
    above_horizon_deg: aboveHorizon,
    below_horizon_deg: belowHorizon,
  };
}

// ─── Combined FOV Result ────────────────────────────────────────────

/**
 * Full FOV computation for a flat/curved cinema screen at a given seat.
 * 
 * Returns horizontal FOV, vertical FOV with above/below breakdown,
 * matching the FovResult type used by the comparison engine.
 */
export function computeCinemaFov(
  screenWidthFt: number,
  screenHeightFt: number,
  viewingDistanceFt: number,
  screenBottomHeightFt: number = 5.0,
  eyeHeightFt: number = DEFAULT_EYE_HEIGHT_FT
): FovResult {
  const hFov = horizontalFov(screenWidthFt, viewingDistanceFt);
  const vFov = verticalFov(screenHeightFt, viewingDistanceFt, screenBottomHeightFt, eyeHeightFt);

  return {
    horizontal_deg: hFov,
    vertical_total_deg: vFov.total_deg,
    vertical_above_horizon_deg: vFov.above_horizon_deg,
    vertical_below_horizon_deg: vFov.below_horizon_deg,
  };
}

// ─── Dome FOV ───────────────────────────────────────────────────────

/**
 * FOV for an IMAX Dome / OMNIMAX screen.
 * 
 * Unlike flat screens, dome FOV is NOT a function of viewing distance —
 * it's a fixed property of the dome + projection system. The dome
 * wraps around and above the audience, providing the same angular
 * coverage regardless of seat position (within the designed seating bowl).
 * 
 * Standard IMAX Dome specs (from the research):
 *   Horizontal: 180° (ear to ear)
 *   Vertical total: 125°
 *   Above horizon: 100–110° (due to 9.4mm lens offset)
 *   Below horizon: 20–22°
 * 
 * This function reads from the schema's dome FOV fields rather than
 * hardcoding values, so it handles any dome configuration.
 * 
 * @param screen - Resolved screen object with dome FOV fields
 * @returns FovResult with dome angles, or throws if not a dome screen
 */
export function domeFov(screen: ResolvedScreen): FovResult {
  if (screen.geometry !== 'hemispherical') {
    throw new Error(`domeFov() called on non-dome screen (geometry: ${screen.geometry})`);
  }

  const hFov = screen.dome_fov_horizontal_deg ?? 180;
  const aboveHorizon = screen.dome_fov_above_horizon_deg ?? 105; // midpoint of 100–110
  const belowHorizon = screen.dome_fov_below_horizon_deg ?? 21;  // midpoint of 20–22
  const vTotal = screen.dome_fov_vertical_deg ?? (aboveHorizon + belowHorizon);

  if (hFov <= 0 || hFov > 180) throw new Error(`dome horizontal FOV must be >0 and <=180, got ${hFov}`);
  if (aboveHorizon < 0 || belowHorizon < 0) {
    throw new Error(`dome above/below horizon FOV must be non-negative`);
  }
  if (vTotal <= 0 || vTotal > 180) throw new Error(`dome vertical FOV must be >0 and <=180, got ${vTotal}`);
  if (Math.abs(vTotal - (aboveHorizon + belowHorizon)) > 1) {
    throw new Error(`dome vertical FOV must match above + below horizon values`);
  }

  return {
    horizontal_deg: hFov,
    vertical_total_deg: vTotal,
    vertical_above_horizon_deg: aboveHorizon,
    vertical_below_horizon_deg: belowHorizon,
  };
}

// ─── Home Display FOV ───────────────────────────────────────────────

/**
 * FOV for a home display. Same math as cinema flat screen —
 * just pass width and distance in inches.
 * 
 * @param screenWidthIn - Screen width in inches
 * @param viewingDistanceIn - Viewing distance in inches
 * @returns Horizontal FOV in degrees
 */
export function homeDisplayFov(screenWidthIn: number, viewingDistanceIn: number): number {
  return horizontalFov(screenWidthIn, viewingDistanceIn);
}
