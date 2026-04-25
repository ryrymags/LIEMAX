/**
 * LIEMAX Math Engine — Brightness Normalization
 * 
 * Group 5: Converting between cinema (foot-lamberts) and home (nits)
 * brightness units, and providing fair cross-format comparisons.
 * 
 * Key insight from research: the FAIR cinema comparison for home displays
 * is full-screen sustained brightness, NOT peak HDR brightness. Cinema
 * content fills the entire screen; the peak HDR spec (measured at a 10%
 * window) is misleading because OLED panels thermally throttle when the
 * full panel is lit.
 * 
 * Example: LG G5 OLED specs at 2,268 nits peak HDR — but full-screen
 * sustained is only 331 nits (~97 fL). Still brighter than most cinemas
 * (IMAX = 22 fL, Dolby 2D = 31 fL), but not 65× brighter as the spec
 * sheet would suggest.
 */

import { FL_TO_NITS, NITS_TO_FL } from './constants';
import type { BrightnessComparison, ResolvedVenue, ResolvedHomeDisplay } from './types';

// ─── Unit Conversion ────────────────────────────────────────────────

/**
 * Convert foot-lamberts to nits (cd/m²).
 * 1 fL = 3.42625909 cd/m² (exact by definition).
 */
export function flToNits(fl: number): number {
  if (fl < 0) throw new Error(`fl must be non-negative, got ${fl}`);
  return fl * FL_TO_NITS;
}

/**
 * Convert nits (cd/m²) to foot-lamberts.
 */
export function nitsToFl(nits: number): number {
  if (nits < 0) throw new Error(`nits must be non-negative, got ${nits}`);
  return nits * NITS_TO_FL;
}

// ─── Cinema-vs-Home Brightness Comparison ───────────────────────────

/**
 * Compares brightness between a cinema venue and a home display.
 * 
 * Uses the home display's FULL-SCREEN sustained brightness (not peak HDR)
 * as the fair comparison value. Cinema screens are fully illuminated
 * during playback — comparing against the home's 10% HDR window peak
 * would be misleading.
 * 
 * The function normalizes both to a common unit (provides both fL and nits
 * for each) and computes the ratio.
 * 
 * @param cinemaFl - Cinema screen brightness in foot-lamberts
 * @param homeFullscreenNits - Home display full-screen sustained brightness in nits
 * @returns BrightnessComparison with both values in both units + ratio + caveat
 */
export function compareBrightness(
  cinemaFl: number,
  homeFullscreenNits: number
): BrightnessComparison {
  if (cinemaFl <= 0) throw new Error(`cinemaFl must be positive, got ${cinemaFl}`);
  if (homeFullscreenNits < 0) throw new Error(`homeFullscreenNits must be non-negative, got ${homeFullscreenNits}`);

  const cinemaNits = flToNits(cinemaFl);
  const homeFl = nitsToFl(homeFullscreenNits);
  const ratio = homeFl / cinemaFl;

  let caveat: string;
  if (ratio > 1) {
    caveat =
      `Home display is ${ratio.toFixed(1)}× brighter than cinema (using full-screen sustained brightness). ` +
      `However, cinema viewing is in a pitch-dark environment (~1-5 lux), ` +
      `so perceived contrast and dynamic range differ from home viewing in ambient light.`;
  } else if (ratio < 1) {
    caveat =
      `Cinema is ${(1 / ratio).toFixed(1)}× brighter than home display (full-screen sustained). ` +
      `Cinema's pitch-dark environment amplifies the perceptual difference.`;
  } else {
    caveat = 'Brightness is effectively equal (using full-screen sustained home brightness).';
  }

  return {
    cinema_fl: cinemaFl,
    cinema_nits: cinemaNits,
    home_nits: homeFullscreenNits,
    home_fl: homeFl,
    home_brightness_tier: 'fullscreen',
    ratio_home_to_cinema: ratio,
    caveat,
  };
}

/**
 * Convenience: compare a resolved venue against a resolved home display.
 * Extracts the relevant brightness fields from each record.
 */
export function compareBrightnessRecords(
  venue: ResolvedVenue,
  display: ResolvedHomeDisplay
): BrightnessComparison {
  return compareBrightness(
    venue.projection.brightness_fl,
    display.display_optics.brightness_fullscreen_nits
  );
}

// ─── Brightness Tier Context ────────────────────────────────────────

/**
 * Returns a human-readable brightness context string for a cinema venue.
 * Useful for tooltips and info panels.
 * 
 * @param brightnessFl - Brightness in foot-lamberts
 * @returns Contextual description
 */
export function brightnessCinemaContext(brightnessFl: number): string {
  if (brightnessFl >= 100) return `${brightnessFl} fL — LED cinema wall. Far exceeds DCI standard.`;
  if (brightnessFl >= 28) return `${brightnessFl} fL — premium brightness (Dolby Cinema tier). ${(brightnessFl / 14).toFixed(1)}× DCI standard.`;
  if (brightnessFl >= 20) return `${brightnessFl} fL — above DCI standard. Meets IMAX target.`;
  if (brightnessFl >= 12) return `${brightnessFl} fL — near DCI standard (14 fL target). Typical multiplex.`;
  return `${brightnessFl} fL — below DCI standard. May indicate aging lamp or calibration issues.`;
}
