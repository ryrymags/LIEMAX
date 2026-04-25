/**
 * LIEMAX Math Engine — Geometry & Unit Conversions
 * 
 * Group 1: The foundation layer. Every other module calls these.
 * 
 * All functions are pure — no side effects, no schema lookups.
 * Input validation throws descriptive errors rather than returning NaN.
 */

import { M_TO_FT, FT_TO_M, IN_PER_FT } from './constants';

// ─── Unit Conversions ───────────────────────────────────────────────

export function metersToFeet(m: number): number {
  return m * M_TO_FT;
}

export function feetToMeters(ft: number): number {
  return ft * FT_TO_M;
}

export function inchesToFeet(inches: number): number {
  return inches / IN_PER_FT;
}

export function feetToInches(ft: number): number {
  return ft * IN_PER_FT;
}

// ─── Screen Dimensions from Diagonal ────────────────────────────────

/**
 * Derives screen width and height from diagonal size and aspect ratio.
 * 
 * This is the primary path for home displays, where users input a
 * diagonal measurement (e.g., "65-inch TV") and the preset provides
 * the aspect ratio (1.78 for 16:9, ~2.17 for phones).
 * 
 * Math derivation:
 *   AR = W / H  →  W = AR × H
 *   diagonal² = W² + H² = (AR × H)² + H² = H² × (AR² + 1)
 *   H = diagonal / √(AR² + 1)
 *   W = AR × H
 * 
 * @param diagonal - Screen diagonal in any consistent unit (inches, meters, etc.)
 * @param aspectRatio - Width / height as decimal (e.g., 1.78 for 16:9)
 * @returns { width, height } in the same unit as the input diagonal
 */
export function diagonalToDimensions(
  diagonal: number,
  aspectRatio: number
): { width: number; height: number } {
  if (diagonal <= 0) throw new Error(`diagonal must be positive, got ${diagonal}`);
  if (aspectRatio <= 0) throw new Error(`aspectRatio must be positive, got ${aspectRatio}`);

  const height = diagonal / Math.sqrt(aspectRatio * aspectRatio + 1);
  const width = aspectRatio * height;
  return { width, height };
}

// ─── Screen Area ────────────────────────────────────────────────────

/**
 * Computes the physical screen area for flat or cylindrically curved screens.
 * 
 * For flat screens, this is simply W × H.
 * For slight cylindrical curves (like IMAX GT), the projected area on the
 * curved surface is negligibly larger than the flat projection — the
 * difference is <1% for typical curvature radii. We use W × H for both,
 * which is consistent with how the industry reports screen area.
 * 
 * @returns Area in square units matching the input (sq meters, sq feet, etc.)
 */
export function screenAreaFlat(width: number, height: number): number {
  if (width <= 0 || height <= 0) {
    throw new Error(`dimensions must be positive, got ${width} × ${height}`);
  }
  return width * height;
}

/**
 * Computes the projected surface area of a dome screen.
 * 
 * A full hemisphere has area = 2πr². IMAX Dome screens typically
 * cover 80–86% of the hemisphere, so:
 *   dome_area = 2πr² × (coverage_pct / 100)
 * 
 * The dome radius is half the dome diameter (stored as height_m in the
 * schema, since for domes, "height" = dome diameter).
 * 
 * @param domeDiameter - Dome diameter (= schema's screen.height_m for domes)
 * @param coveragePct - Percentage of hemisphere covered (80–86 typical)
 * @returns Area in square units matching the input
 */
export function screenAreaDome(
  domeDiameter: number,
  coveragePct: number
): number {
  if (domeDiameter <= 0) throw new Error(`domeDiameter must be positive, got ${domeDiameter}`);
  if (coveragePct <= 0 || coveragePct > 100) {
    throw new Error(`coveragePct must be 0–100, got ${coveragePct}`);
  }
  const radius = domeDiameter / 2;
  return 2 * Math.PI * radius * radius * (coveragePct / 100);
}

// ─── Aspect Ratio ───────────────────────────────────────────────────

/**
 * Computes aspect ratio from width and height.
 * Returns width / height as a decimal (e.g., 1.43, 1.90, 2.39).
 */
export function aspectRatioFromDimensions(width: number, height: number): number {
  if (height <= 0) throw new Error(`height must be positive, got ${height}`);
  return width / height;
}

// ─── PPI (Pixels Per Inch) ──────────────────────────────────────────

/**
 * Computes PPI from resolution and screen diagonal.
 * 
 * PPI = √(H_px² + V_px²) / diagonal_inches
 * 
 * This is the standard formula used by every display review site.
 * For a 65" 4K (3840×2160): √(3840² + 2160²) / 65 = 4415.9 / 65 ≈ 67.9 PPI
 * 
 * @param horizontalPx - Horizontal pixel count (e.g., 3840)
 * @param verticalPx - Vertical pixel count (e.g., 2160)
 * @param diagonalInches - Screen diagonal in inches
 */
export function ppiFromResolution(
  horizontalPx: number,
  verticalPx: number,
  diagonalInches: number
): number {
  if (diagonalInches <= 0) throw new Error(`diagonalInches must be positive, got ${diagonalInches}`);
  const diagonalPx = Math.sqrt(horizontalPx * horizontalPx + verticalPx * verticalPx);
  return diagonalPx / diagonalInches;
}

/**
 * Convenience: compute the width in inches of a single pixel given PPI.
 * pixelWidth = 1 / PPI (in inches)
 */
export function pixelWidthInches(ppi: number): number {
  if (ppi <= 0) throw new Error(`ppi must be positive, got ${ppi}`);
  return 1 / ppi;
}
