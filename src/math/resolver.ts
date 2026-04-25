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
} from './types';

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
 *   - aspect_ratio from dimensions (if not explicitly set)
 *   - brightness_cdm2 from brightness_fl (if not explicitly set)
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

  // Feet from meters
  if (screen.width_m != null && screen.width_ft == null) {
    screen.width_ft = metersToFeet(screen.width_m);
  }
  if (screen.height_m != null && screen.height_ft == null) {
    screen.height_ft = metersToFeet(screen.height_m);
  }

  // Aspect ratio from dimensions
  if (screen.aspect_ratio == null && screen.width_m != null && screen.height_m != null) {
    screen.aspect_ratio = screen.width_m / screen.height_m;
  }

  // Screen bottom height default
  if (screen.screen_bottom_height_ft == null) {
    screen.screen_bottom_height_ft = 5.0;
  }

  // Brightness cd/m² from fL
  if (projection.brightness_fl != null && projection.brightness_cdm2 == null) {
    projection.brightness_cdm2 = flToNits(projection.brightness_fl);
  }

  // Viewing distances from screen width (if not measured)
  if (seating.viewing_distance_mid_ft == null && screen.width_ft != null) {
    const derived = deriveViewingDistances(screen.width_ft);
    seating.viewing_distance_front_ft = seating.viewing_distance_front_ft ?? derived.front_ft;
    seating.viewing_distance_mid_ft = derived.mid_ft;
    seating.viewing_distance_back_ft = seating.viewing_distance_back_ft ?? derived.back_ft;
    seating.viewing_distance_source = seating.viewing_distance_source ?? 'derived_from_screen_width';
  }

  // Default seat offset to center
  if (seating.seat_offset_from_center_ft == null) {
    seating.seat_offset_from_center_ft = 0;
  }

  return {
    id: venue.id,
    name: venue.name,
    screen: screen as ResolvedScreen,
    projection: projection as ResolvedProjection,
    seating: seating as ResolvedSeating,
    capabilities: {
      min_content_ar_supported: capabilities.min_content_ar_supported,
      supports_1570_film: capabilities.supports_1570_film ?? false,
    },
  };
}

// ─── Home Display Resolver ──────────────────────────────────────────

/**
 * Resolves a home display record against its preset.
 * 
 * Same field-level merge pattern as cinema. Additionally derives:
 *   - Viewing distance from screen height (if not user-provided)
 *   - PPI from resolution and diagonal (if not explicitly set)
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

  // Derive PPI if not set
  if (optics.ppi == null && optics.resolution_horizontal_px != null && optics.resolution_vertical_px != null && screenDiagonalIn != null) {
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
