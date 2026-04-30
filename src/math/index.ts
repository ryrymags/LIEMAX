/**
 * LIEMAX Math Engine
 * 
 * Pure, testable functions for cinema and home display comparison.
 * No UI, no side effects — just inputs in, numbers out.
 * 
 * Usage:
 *   import { computePpd, compareBrightness, computeMasking } from './math';
 * 
 * Architecture:
 *   types.ts     — TypeScript interfaces matching the JSON schema
 *   constants.ts — Sourced constants (conversion factors, thresholds, standards)
 *   geometry.ts  — Unit conversions, screen dimensions, area calculations
 *   fov.ts       — Field of view (horizontal, vertical asymmetric, dome)
 *   ppd.ts       — Pixels per degree (cinema, home, film, dome, off-axis)
 *   masking.ts   — Aspect ratio masking, effective area, content crop loss
 *   brightness.ts — fL/nits conversion, cinema-vs-home brightness comparison
 *   seating.ts   — SMPTE/THX distance derivation, home viewing defaults
 *   resolver.ts  — Preset + venue/record field-level merge
 */

// Types
export type {
  ScreenGeometry,
  ResolvedScreen,
  ResolvedProjection,
  HybridProjection,
  ResolvedSeating,
  ContentFormat,
  ResolvedVenue,
  ResolvedDisplayOptics,
  ResolvedHomeDisplay,
  FovResult,
  PpdResult,
  ResolutionMode,
  MaskingResult,
  BrightnessComparison,
  SeatingDistances,
} from './types';

// Constants
export {
  M_TO_FT, FT_TO_M, DEG_TO_RAD, RAD_TO_DEG,
  FL_TO_NITS, NITS_TO_FL, IN_PER_FT,
  PPD_ACUITY_20_20, PPD_AVERAGE_ADULT, PPD_RETINAL_MAX,
  SMPTE_FRONT_MULTIPLIER, SMPTE_MID_MULTIPLIER, SMPTE_BACK_MULTIPLIER,
  DCI_BRIGHTNESS_FL, IMAX_BRIGHTNESS_FL,
  SUPERSAMPLING_FACTOR,
  HOME_TV_DISTANCE_MULTIPLIER, HOME_PHONE_DISTANCE_FT, HOME_TABLET_DISTANCE_FT,
  DEFAULT_EYE_HEIGHT_FT,
} from './constants';

// Geometry
export {
  metersToFeet, feetToMeters, inchesToFeet, feetToInches,
  diagonalToDimensions, screenAreaFlat, screenAreaDome,
  aspectRatioFromDimensions, ppiFromResolution, pixelWidthInches,
} from './geometry';

// FOV
export {
  horizontalFov, verticalFov, computeCinemaFov,
  domeFov, homeDisplayFov,
} from './fov';

// PPD
export {
  computePpd, cinemaPpd, domePpd,
  homeDisplayPpd, offAxisPpd,
} from './ppd';

// Masking
export {
  computeMasking, extraAreaVsScope,
  contentCropLoss, areaComparisonPct,
} from './masking';

// Brightness
export {
  flToNits, nitsToFl,
  compareBrightness, compareBrightnessRecords,
  brightnessCinemaContext,
} from './brightness';

// Seating
export {
  deriveViewingDistances, homeDefaultViewingDistance,
  getSmpteMultipliers,
} from './seating';

// Resolver
export {
  resolveVenue, resolveHomeDisplay,
} from './resolver';
