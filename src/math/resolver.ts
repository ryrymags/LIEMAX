/**
 * LIEMAX Math Engine — Preset Resolver
 * 
 * Group 7: The merge logic that produces resolved records from
 * preset defaults + venue/record overrides.
 * 
 * The inheritance model (same for cinema and home):
 *   resolved_field = record_value ?? preset_default
 * 
 * CRITICAL: This merge is FIELD-LEVEL, not object-level.
 * If a venue overrides only screen.width_m, the other screen fields
 * (height_m, geometry, etc.) come from the preset. If we did
 * object-level replacement, overriding one field would null out siblings.
 * 
 * Example:
 *   preset.default_screen = { width_m: 22, height_m: 16, geometry: 'flat' }
 *   venue.screen = { width_m: 25 }   ← only width override
 *   resolved.screen = { width_m: 25, height_m: 16, geometry: 'flat' }
 *                      ↑ from venue    ↑ from preset  ↑ from preset
 */

import { metersToFeet } from './geometry';
import { deriveViewingDistances } from './seating';
import { flToNits } from './brightness';
import type {
  ResolvedVenue,
  ResolvedHomeDisplay,
  ResolvedScreen,
  ResolvedProjection,
  ResolvedSeating,
  ResolvedDisplayOptics,
  HybridProjection,
} from './types';

const DEFAULT_UNCLEAR_DIGITAL_MIN_AR = 1.90;

// ─── Generic Field-Level Merge ──────────────────────────────────────

/**
 * Merges two objects field-by-field. Values from `override` take
 * precedence over `base` when they are non-null and non-undefined.
 * 
 * This is NOT a deep merge — nested objects are replaced entirely
 * if present in the override. The caller should merge nested objects
 * separately (screen, projection, seating, etc.) before calling this.
 * 
 * Intentionally kept simple. This runs on a small, well-known
 * set of objects — no need for recursive deep merge complexity.
 */
function fieldMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as Array<keyof T>) {
    const val = override[key];
    if (val !== null && val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

// ─── Cinema Venue Resolver ──────────────────────────────────────────

/**
 * Resolves a cinema venue record against its format preset.
 * 
 * For each sub-object (screen, projection, seating, capabilities),
 * performs a field-level merge. Then fills derived fields:
 *   - width_ft / height_ft from width_m / height_m
 *   - aspect_ratio from dimensions
 *   - brightness_cdm2 from brightness_fl
 *   - viewing distances from screen width (if not measured)
 * 
 * @param preset - The format preset (e.g., "imax_gt_dual_laser")
 * @param venue - The venue record (e.g., "jordans_reading_imax")
 * @returns Fully resolved venue with all fields populated
 */
export function resolveVenue(
  preset: Record<string, any>,  // format_preset from schema
  venue: Record<string, any>    // venue_record from schema
): ResolvedVenue {
  // ── Merge each sub-object ──
  const screen = fieldMerge(
    preset.default_screen ?? {},
    venue.screen ?? {}
  );

  const projection = fieldMerge(
    preset.default_projection ?? {},
    venue.projection ?? {}
  );

  const seating = fieldMerge(
    preset.default_seating ?? {},
    venue.seating ?? {}
  );

  const capabilities = fieldMerge(
    preset.default_capabilities ?? {},
    venue.capabilities ?? {}
  );

  // ── Fill derived fields ──

  // Feet from meters. Always recompute from final merged dimensions so
  // derived preset values cannot survive a partial venue override.
  if (screen.width_m != null) {
    screen.width_ft = metersToFeet(screen.width_m);
  }
  if (screen.height_m != null) {
    screen.height_ft = metersToFeet(screen.height_m);
  }

  // Aspect ratio from dimensions
  if (screen.width_m != null && screen.height_m != null) {
    screen.aspect_ratio = screen.width_m / screen.height_m;
  }

  // Screen bottom height default
  if (screen.screen_bottom_height_ft == null) {
    screen.screen_bottom_height_ft = 5.0;
  }

  // Brightness cd/m² from fL
  if (projection.brightness_fl != null) {
    projection.brightness_cdm2 = flToNits(projection.brightness_fl);
  }

  // Viewing distances from screen width, preserving any measured fields.
  if (
    screen.width_ft != null &&
    (seating.viewing_distance_front_ft == null ||
      seating.viewing_distance_mid_ft == null ||
      seating.viewing_distance_back_ft == null)
  ) {
    const derived = deriveViewingDistances(screen.width_ft);
    seating.viewing_distance_front_ft = seating.viewing_distance_front_ft ?? derived.front_ft;
    seating.viewing_distance_mid_ft = seating.viewing_distance_mid_ft ?? derived.mid_ft;
    seating.viewing_distance_back_ft = seating.viewing_distance_back_ft ?? derived.back_ft;
    seating.viewing_distance_source = seating.viewing_distance_source ?? 'derived_from_screen_width';
  }

  // Default seat offset to center
  if (seating.seat_offset_from_center_ft == null) {
    seating.seat_offset_from_center_ft = 0;
  }

  const resolvedScreen = screen as ResolvedScreen;
  const resolvedProjection = finalizeProjection(
    projection,
    resolvedScreen,
    capabilities.min_content_ar_supported
  );
  const projections = resolveProjectionList(preset, venue, resolvedScreen, capabilities);
  const hybridProjection = buildHybridProjection(projections, resolvedProjection);
  const activeProjection = hybridProjection
    ? (hybridProjection[hybridProjection.active] ?? resolvedProjection)
    : resolvedProjection;

  return {
    id: venue.id,
    name: venue.name,
    screen: resolvedScreen,
    projection: activeProjection,
    ...(projections.length > 0 ? { projections } : {}),
    ...(hybridProjection ? { hybrid_projection: hybridProjection } : {}),
    seating: seating as ResolvedSeating,
    capabilities: {
      min_content_ar_supported: capabilities.min_content_ar_supported ?? resolvedProjection.min_content_ar_supported ?? DEFAULT_UNCLEAR_DIGITAL_MIN_AR,
      supports_1570_film: capabilities.supports_1570_film ?? false,
      supports_143_digital: capabilities.supports_143_digital ?? false,
    },
  };
}

function finalizeProjection(
  projection: Record<string, any>,
  screen: ResolvedScreen,
  fallbackMinContentAr?: number
): ResolvedProjection {
  const result = { ...projection };
  const minContentAr = result.min_content_ar_supported ?? fallbackMinContentAr ?? DEFAULT_UNCLEAR_DIGITAL_MIN_AR;

  result.min_content_ar_supported = minContentAr;
  result.effective_screen_width_ft = screen.width_ft;
  result.effective_screen_height_ft = Math.min(screen.height_ft, screen.width_ft / minContentAr);
  result.effective_screen_aspect_ratio = result.effective_screen_width_ft / result.effective_screen_height_ft;

  if (result.brightness_fl != null) {
    result.brightness_cdm2 = flToNits(result.brightness_fl);
  }

  return result as ResolvedProjection;
}

function resolveProjectionList(
  preset: Record<string, any>,
  venue: Record<string, any>,
  screen: ResolvedScreen,
  capabilities: Record<string, any>
): ResolvedProjection[] {
  const presetList = [
    ...(preset.default_projection ? [withProjectionKeyDefaults(preset.default_projection)] : []),
    ...(preset.default_projections ?? []),
  ];
  const venueList = venue.projections ?? venue.hybrid_projections ?? [];
  const byId = new Map<string, Record<string, any>>();

  for (const item of presetList) {
    const key = projectionKey(item);
    byId.set(key, item);
  }

  for (const item of venueList) {
    const key = projectionKey(item);
    const base = byId.get(key) ?? {};
    byId.set(key, fieldMerge(base, item));
  }

  return Array.from(byId.values()).map((item) =>
    finalizeProjection(item, screen, item.min_content_ar_supported ?? capabilities.min_content_ar_supported)
  );
}

function projectionKey(item: Record<string, any>): string {
  return item.id ?? item.mode ?? item.type;
}

function withProjectionKeyDefaults(item: Record<string, any>): Record<string, any> {
  if (item.id != null || item.mode != null) return item;
  if (item.resolution_horizontal_px != null) {
    return { ...item, id: 'digital', mode: 'digital' };
  }
  if (item.resolution_scan_equivalent_low != null || item.resolution_scan_equivalent_high != null) {
    return { ...item, id: 'film', mode: 'film' };
  }
  return item;
}

function buildHybridProjection(
  projections: ResolvedProjection[],
  fallbackProjection: ResolvedProjection
): HybridProjection | undefined {
  if (projections.length < 2) return undefined;

  const digital = projections.find((item) =>
    item.mode === 'digital' || item.resolution_horizontal_px != null
  );
  const film = projections.find((item) =>
    item.mode === 'film' || item.resolution_scan_equivalent_low != null || item.resolution_scan_equivalent_high != null
  );

  if (!digital || !film) return undefined;

  return {
    active: fallbackProjection.mode === 'film' ? 'film' : 'digital',
    digital,
    film,
  };
}

// ─── Home Display Resolver ──────────────────────────────────────────

/**
 * Resolves a home display record against its preset.
 * 
 * Same field-level merge pattern as cinema. Additionally derives:
 *   - Viewing distance from screen height (if not user-provided)
 *   - PPI from resolution and diagonal
 */
export function resolveHomeDisplay(
  preset: Record<string, any>,  // home_display_preset
  record: Record<string, any>   // home_display_record
): ResolvedHomeDisplay {
  const optics = fieldMerge(
    preset.default_display_optics ?? {},
    record.display_optics ?? {}
  );

  // Scalars: record overrides preset
  const screenDiagonalIn = record.screen_diagonal_in ?? preset.default_screen_diagonal_in;
  const aspectRatio = record.aspect_ratio ?? preset.default_aspect_ratio;
  const viewingDistanceFt = record.viewing_distance_ft ?? preset.default_viewing_distance_ft;
  const deviceCategory = preset.device_category;

  // Always recompute from the final merged resolution and diagonal so
  // preset PPI cannot survive a size override.
  if (optics.resolution_horizontal_px != null && optics.resolution_vertical_px != null && screenDiagonalIn != null) {
    const diagPx = Math.sqrt(
      optics.resolution_horizontal_px ** 2 + optics.resolution_vertical_px ** 2
    );
    optics.ppi = diagPx / screenDiagonalIn;
  }

  return {
    id: record.id,
    user_label: record.user_label,
    device_category: deviceCategory,
    screen_diagonal_in: screenDiagonalIn,
    aspect_ratio: aspectRatio,
    viewing_distance_ft: viewingDistanceFt,
    display_optics: optics as ResolvedDisplayOptics,
  };
}
