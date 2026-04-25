/**
 * LIEMAX Math Engine — Seating Distance Derivation
 * 
 * Group 6: When a venue doesn't have measured viewing distances, derive
 * them from screen width using SMPTE/THX industry multipliers.
 * 
 * The multiplier approach:
 *   Front row: 0.87× screen width (THX minimum recommended)
 *   Mid row:   1.5× screen width  (THX "sweet spot" center)
 *   Back row:  2.25× screen width (midpoint of 2.0–2.5× range)
 * 
 * For home displays, the default viewing distance is:
 *   TVs:    1.5× screen height (THX recommendation for 4K content)
 *   Phones: 1.0 ft (typical handheld distance)
 * 
 * All derived distances are tagged with their source so the UI can
 * display appropriate confidence caveats.
 */

import {
  SMPTE_FRONT_MULTIPLIER,
  SMPTE_MID_MULTIPLIER,
  SMPTE_BACK_MULTIPLIER,
  HOME_TV_DISTANCE_MULTIPLIER,
  HOME_PHONE_DISTANCE_FT,
  IN_PER_FT,
} from './constants';
import { diagonalToDimensions } from './geometry';
import type { SeatingDistances } from './types';

// ─── Cinema Viewing Distances ───────────────────────────────────────

/**
 * Derive front/mid/back viewing distances from screen width.
 * 
 * Uses SMPTE EG 18-1994 and THX certification guidelines.
 * These are reasonable estimates when measured distances aren't available —
 * the actual front row might be slightly closer or farther depending on
 * the specific auditorium geometry, rake angle, and screen curvature.
 * 
 * @param screenWidthFt - Screen width in feet
 * @returns Derived distances with 'derived_from_screen_width' source tag
 */
export function deriveViewingDistances(screenWidthFt: number): SeatingDistances {
  if (screenWidthFt <= 0) throw new Error(`screenWidthFt must be positive, got ${screenWidthFt}`);

  return {
    front_ft: screenWidthFt * SMPTE_FRONT_MULTIPLIER,
    mid_ft: screenWidthFt * SMPTE_MID_MULTIPLIER,
    back_ft: screenWidthFt * SMPTE_BACK_MULTIPLIER,
    source: 'derived_from_screen_width',
  };
}

// ─── Home Display Default Viewing Distance ──────────────────────────

/**
 * Compute the default viewing distance for a home display.
 * 
 * TVs: 1.5× screen height. This delivers ~40° horizontal FOV for a
 * 16:9 screen — wide enough for cinematic immersion, far enough that
 * 4K exceeds the retinal acuity threshold.
 * 
 * Phones: 1.0 ft (12 inches). Typical handheld viewing distance per
 * ergonomic studies. At this distance with ~460 PPI, phones exceed
 * retinal acuity by a wide margin.
 * 
 * @param screenDiagonalIn - Screen diagonal in inches
 * @param aspectRatio - Screen aspect ratio (e.g., 1.78 for 16:9)
 * @param deviceCategory - 'tv', 'phone', 'tablet', 'monitor', 'home_projector'
 * @returns Default viewing distance in feet
 */
export function homeDefaultViewingDistance(
  screenDiagonalIn: number,
  aspectRatio: number,
  deviceCategory: string
): number {
  if (deviceCategory === 'phone' || deviceCategory === 'tablet') {
    // Phones and tablets: fixed distance regardless of screen size
    return HOME_PHONE_DISTANCE_FT;
  }

  // TVs, monitors, home projectors: 1.5× screen height
  const { height } = diagonalToDimensions(screenDiagonalIn, aspectRatio);
  const heightFt = height / IN_PER_FT; // diagonal was in inches, so height is in inches
  return heightFt * HOME_TV_DISTANCE_MULTIPLIER;
}

/**
 * Returns all three SMPTE multiplier values for reference.
 * Useful for the UI to show "how distances are calculated" tooltips.
 */
export function getSmpteMultipliers(): { front: number; mid: number; back: number } {
  return {
    front: SMPTE_FRONT_MULTIPLIER,
    mid: SMPTE_MID_MULTIPLIER,
    back: SMPTE_BACK_MULTIPLIER,
  };
}
