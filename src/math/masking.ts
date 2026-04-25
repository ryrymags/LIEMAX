/**
 * LIEMAX Math Engine — Masking & Effective Area
 * 
 * Group 4: What actually fills the screen when content AR ≠ screen AR.
 * 
 * This is the math behind "what do I lose when I watch a 2.39:1 scope
 * film on a 1.43:1 IMAX screen?" and vice versa.
 * 
 * Three cases:
 *   1. Content AR = Screen AR → perfect fit, 100% utilization
 *   2. Content AR > Screen AR → letterboxing (horizontal black bars top/bottom)
 *      Content is too wide (relatively) for the screen's height.
 *      Content fills screen width; height = width / content_AR.
 *   3. Content AR < Screen AR → pillarboxing (vertical black bars left/right)
 *      Content is too tall (relatively) for the screen's width.
 *      Content fills screen height; width = height × content_AR.
 * 
 * Special case: if content_AR < screen's min_content_ar_supported,
 * the content is CROPPED (not pillarboxed) — the screen can't display
 * that AR at all. E.g., 1.43:1 content on a CoLa (1.90:1) screen.
 */

import type { MaskingResult } from './types';

// ─── Effective Display Dimensions ───────────────────────────────────

/**
 * Computes the effective (used) area when displaying content of one AR
 * on a screen of a different AR.
 * 
 * @param screenWidthFt - Physical screen width in feet
 * @param screenHeightFt - Physical screen height in feet
 * @param contentAr - Content aspect ratio (width / height)
 * @param minContentArSupported - The tallest AR the screen can display at full width
 *                                 (1.43 for GT, 1.90 for CoLa, etc.)
 * @returns MaskingResult with effective dimensions, utilization, and bar sizes
 */
export function computeMasking(
  screenWidthFt: number,
  screenHeightFt: number,
  contentAr: number,
  minContentArSupported: number
): MaskingResult {
  if (screenWidthFt <= 0 || screenHeightFt <= 0) {
    throw new Error(`Screen dimensions must be positive: ${screenWidthFt} × ${screenHeightFt}`);
  }
  if (contentAr <= 0) throw new Error(`Content AR must be positive, got ${contentAr}`);

  const screenAr = screenWidthFt / screenHeightFt;
  const screenArea = screenWidthFt * screenHeightFt;

  // Case: Content is too tall for the screen to display at all
  // e.g., 1.43:1 content on a CoLa (1.90:1 min) screen
  const cropped = contentAr < minContentArSupported;

  let effectiveWidth: number;
  let effectiveHeight: number;
  let letterboxed = false;
  let pillarboxed = false;

  if (cropped) {
    // Screen crops the content to its minimum supported AR.
    // Content fills the screen width, but the top/bottom of the content
    // are cut off because the screen isn't tall enough.
    // The visible content has AR = minContentArSupported.
    effectiveWidth = screenWidthFt;
    effectiveHeight = screenWidthFt / minContentArSupported;
    // Clamp to screen height (shouldn't exceed, but safety check)
    effectiveHeight = Math.min(effectiveHeight, screenHeightFt);
    letterboxed = effectiveHeight < screenHeightFt;
  } else if (contentAr > screenAr) {
    // Letterboxing: content is wider (proportionally) than screen
    // Content fills the full screen width; height is less than screen height
    effectiveWidth = screenWidthFt;
    effectiveHeight = screenWidthFt / contentAr;
    letterboxed = true;
  } else if (contentAr < screenAr) {
    // Pillarboxing: content is taller (proportionally) than screen
    // Content fills the full screen height; width is less than screen width
    effectiveHeight = screenHeightFt;
    effectiveWidth = screenHeightFt * contentAr;
    pillarboxed = true;
  } else {
    // Perfect fit
    effectiveWidth = screenWidthFt;
    effectiveHeight = screenHeightFt;
  }

  const effectiveArea = effectiveWidth * effectiveHeight;
  const utilizationPct = (effectiveArea / screenArea) * 100;

  // Bar dimensions (each bar, not total)
  const barsHeightFt = letterboxed ? (screenHeightFt - effectiveHeight) / 2 : 0;
  const barsWidthFt = pillarboxed ? (screenWidthFt - effectiveWidth) / 2 : 0;

  return {
    effective_width_ft: effectiveWidth,
    effective_height_ft: effectiveHeight,
    effective_area_sqft: effectiveArea,
    screen_utilization_pct: utilizationPct,
    letterboxed,
    pillarboxed,
    cropped,
    bars_height_ft: barsHeightFt,
    bars_width_ft: barsWidthFt,
  };
}

// ─── Extra Area vs. Scope ───────────────────────────────────────────

/**
 * Percent additional image area compared to 2.39:1 scope, at equal width.
 * 
 * At equal screen width, the only variable is height (= width / AR).
 * A taller image (lower AR) has more area.
 * 
 * Formula: extraArea% = (2.39 / targetAr - 1) × 100
 * 
 * Examples:
 *   1.43:1 → +67.1%  (true IMAX vs scope)
 *   1.78:1 → +34.3%  (16:9 TV vs scope)
 *   1.90:1 → +25.8%  (LIMAX vs scope)
 *   2.39:1 →   0.0%  (scope is the baseline)
 * 
 * The "16:9 surprise": a TV at 1.78:1 shows MORE image area than LIMAX
 * at 1.90:1 when normalized to equal width.
 * 
 * @param targetAr - Aspect ratio to compare against scope (e.g., 1.43, 1.78, 1.90)
 * @returns Percentage extra area vs 2.39:1. Positive = more area. Negative = less.
 */
export function extraAreaVsScope(targetAr: number): number {
  if (targetAr <= 0) throw new Error(`Aspect ratio must be positive, got ${targetAr}`);
  return (2.39 / targetAr - 1) * 100;
}

// ─── Content Loss When Cropping ─────────────────────────────────────

/**
 * How much of the original content is lost when a screen can't display
 * the full content AR.
 * 
 * The classic example: 1.43:1 content on a 1.90:1 CoLa screen loses
 * ~24.7% of the vertical frame. The content is cropped to 1.90:1,
 * cutting equal amounts from top and bottom.
 * 
 * Formula: contentLoss% = (1 - contentAr / screenMinAr) × 100
 * 
 * Only meaningful when contentAr < minContentArSupported.
 * 
 * @param contentAr - The content's native aspect ratio (e.g., 1.43)
 * @param screenMinAr - The screen's minimum displayable AR (e.g., 1.90)
 * @returns Percentage of vertical content lost. 0 if no cropping needed.
 */
export function contentCropLoss(contentAr: number, screenMinAr: number): number {
  if (contentAr >= screenMinAr) return 0; // No cropping needed
  return (1 - contentAr / screenMinAr) * 100;
}

// ─── Area Comparison Between Two Displays ───────────────────────────

/**
 * Compares the effective visible image area between two displays
 * showing the same content format.
 * 
 * Returns how much larger display A's image is compared to display B,
 * as a percentage. Positive = A is larger.
 * 
 * This is an absolute area comparison, NOT normalized by width.
 * Use extraAreaVsScope() for width-normalized comparisons.
 */
export function areaComparisonPct(areaA_sqft: number, areaB_sqft: number): number {
  if (areaB_sqft <= 0) throw new Error('Reference area must be positive');
  return ((areaA_sqft - areaB_sqft) / areaB_sqft) * 100;
}
