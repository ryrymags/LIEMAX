/**
 * LIEMAX Math Engine — Constants
 * 
 * Conversion factors, human vision thresholds, and industry standards.
 * Every constant is sourced and annotated — this audience will check.
 */

// ─── Unit Conversion ────────────────────────────────────────────────

/** Meters → feet. Exact by NIST definition. */
export const M_TO_FT = 3.28084;

/** Feet → meters. */
export const FT_TO_M = 1 / M_TO_FT;

/** Degrees → radians. */
export const DEG_TO_RAD = Math.PI / 180;

/** Radians → degrees. */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Foot-lamberts → candelas per square meter (nits).
 * 1 fL = 1/π cd/ft² = 3.42625909... cd/m²
 * Source: SMPTE ST 196:2003, CIE photometric definitions.
 */
export const FL_TO_NITS = 3.42625909;

/** Nits → foot-lamberts. */
export const NITS_TO_FL = 1 / FL_TO_NITS;

/** Inches per foot. */
export const IN_PER_FT = 12;

// ─── Human Vision Thresholds ────────────────────────────────────────

/**
 * PPD at which 20/20 vision can just resolve individual pixels.
 * Below this, pixel structure becomes noticeable.
 * Source: standard Snellen acuity — 1 arcminute resolution = 60 PPD.
 */
export const PPD_ACUITY_20_20 = 60;

/**
 * Average adult foveal acuity limit (~80 PPD).
 * Most people can't resolve detail finer than this.
 * Source: Campbell & Robson (1968), contrast sensitivity studies.
 */
export const PPD_AVERAGE_ADULT = 80;

/**
 * Maximum measured human foveal resolution (~94–120 PPD).
 * Only achievable in laboratory conditions with perfect optics.
 * Source: various — range reflects different studies.
 */
export const PPD_RETINAL_MAX = 120;

// ─── SMPTE / THX Seating Standards ──────────────────────────────────

/**
 * Viewing distance multipliers relative to screen width.
 * Source: SMPTE EG 18-1994 (recommended viewing), THX certification guidelines.
 * Front row = 0.87× screen width (minimum recommended by THX).
 * Mid row = 1.5× screen width (THX "sweet spot" center).
 * Back row = 2.0–2.5× screen width (we use 2.25× as midpoint).
 */
export const SMPTE_FRONT_MULTIPLIER = 0.87;
export const SMPTE_MID_MULTIPLIER = 1.5;
export const SMPTE_BACK_MULTIPLIER = 2.25; // midpoint of 2.0–2.5 range

// ─── DCI Standards ──────────────────────────────────────────────────

/** DCI target screen brightness in foot-lamberts. Source: SMPTE ST 431-1. */
export const DCI_BRIGHTNESS_FL = 14;

/** IMAX target screen brightness in foot-lamberts. Source: IMAX spec sheets. */
export const IMAX_BRIGHTNESS_FL = 22;

// ─── GT Laser Supersampling ─────────────────────────────────────────

/**
 * Pixel-offset supersampling factor for dual-projector half-pixel shift.
 * Two 4K projectors offset by half a pixel pitch ≈ √2 × native resolution.
 * This is an ILLUSTRATIVE figure — NOT an official IMAX specification.
 * Source: optical engineering principle; IMAX has never published this claim.
 */
export const SUPERSAMPLING_FACTOR = Math.SQRT2;

// ─── Home Display Defaults ──────────────────────────────────────────

/**
 * Default TV viewing distance = 1.5× screen height (in matching units).
 * Source: THX recommended viewing distance for 4K content.
 * Delivers ~40° horizontal FOV — wide enough for cinematic immersion,
 * far enough that 4K exceeds acuity threshold.
 */
export const HOME_TV_DISTANCE_MULTIPLIER = 1.5;

/** Default phone viewing distance in feet. Source: ergonomic studies (~12 in). */
export const HOME_PHONE_DISTANCE_FT = 1.0;

/** Default eye height above auditorium floor for a seated viewer, in feet. */
export const DEFAULT_EYE_HEIGHT_FT = 3.75; // ~45 inches, seated adult average
