/**
 * LIEMAX Math Engine — Type Definitions
 * 
 * These types represent RESOLVED records — after the preset merger has run.
 * All nullable fields from the JSON schema are either filled from the preset
 * or explicitly provided. The math functions never deal with null-resolution;
 * that's the resolver's job.
 * 
 * Where a field can genuinely be absent even after resolution (e.g., dome
 * fields on a flat screen), it stays optional (field?: type).
 */

// ─── Screen Geometry ────────────────────────────────────────────────

export type ScreenGeometry = 'flat' | 'slight_cylindrical_curve' | 'hemispherical';

export interface ResolvedScreen {
  width_m: number;
  height_m: number;
  width_ft: number;
  height_ft: number;
  aspect_ratio: number;
  geometry: ScreenGeometry;
  curvature_radius_ft?: number;
  screen_bottom_height_ft: number; // default 5.0

  // Dome-only fields — present only when geometry === 'hemispherical'
  dome_coverage_pct?: number;        // 80-86 typical
  dome_fov_horizontal_deg?: number;  // 180 typical
  dome_fov_vertical_deg?: number;    // 125 typical
  dome_fov_above_horizon_deg?: number;
  dome_fov_below_horizon_deg?: number;
}

// ─── Projection (Cinema) ───────────────────────────────────────────

export interface ResolvedProjection {
  type: string;
  light_source: string;
  dual_projector: boolean;

  // Digital resolution — null for film
  resolution_horizontal_px: number | null;
  resolution_vertical_px: number | null;

  // Film scan-equivalent — null for digital
  resolution_scan_equivalent_low: number | null;
  resolution_scan_equivalent_high: number | null;

  effective_resolution_label?: string;
  brightness_fl: number;
  brightness_cdm2: number;
  contrast_sequential: number | null;
  contrast_dynamic: number | null;
  hdr: string;
  anamorphic_stretch: boolean;
}

// ─── Seating ────────────────────────────────────────────────────────

export interface ResolvedSeating {
  viewing_distance_front_ft: number;
  viewing_distance_mid_ft: number;
  viewing_distance_back_ft: number;
  viewing_distance_source: string;
  seat_offset_from_center_ft: number; // 0 = center seat
  rake_angle_deg?: number;
}

// ─── Content Format ─────────────────────────────────────────────────

export interface ContentFormat {
  id: string;
  display_name: string;
  aspect_ratio: number; // width / height, e.g., 2.39, 1.43, 1.78
}

// ─── Resolved Cinema Venue ─────────────────────────────────────────

export interface ResolvedVenue {
  id: string;
  name: string;
  screen: ResolvedScreen;
  projection: ResolvedProjection;
  seating: ResolvedSeating;
  capabilities: {
    min_content_ar_supported: number;
    supports_1570_film: boolean;
  };
}

// ─── Home Display Optics ────────────────────────────────────────────

export interface ResolvedDisplayOptics {
  panel_tech: string;
  is_per_pixel_emissive: boolean;
  resolution_horizontal_px: number;
  resolution_vertical_px: number;
  ppi: number;
  brightness_peak_hdr_nits: number;
  brightness_fullscreen_nits: number;
  brightness_sdr_nits: number;
  contrast_sequential: number | null; // null for OLED (infinite)
  color_gamut_dci_p3_pct?: number;
}

// ─── Resolved Home Display ─────────────────────────────────────────

export interface ResolvedHomeDisplay {
  id: string;
  user_label: string;
  device_category: string;
  screen_diagonal_in: number;
  aspect_ratio: number; // 1.78 for TV, ~2.17 for phone
  viewing_distance_ft: number;
  display_optics: ResolvedDisplayOptics;
}

// ─── Math Engine Output Types ───────────────────────────────────────

export interface FovResult {
  horizontal_deg: number;
  vertical_total_deg: number;
  vertical_above_horizon_deg: number;
  vertical_below_horizon_deg: number;
}

export interface PpdResult {
  ppd: number;
  resolution_mode: ResolutionMode;
  caveat?: string; // e.g., "grain-limited in practice" for film
}

export type ResolutionMode =
  | 'native'            // digital projector or home display
  | 'scan_equivalent_low'   // 15/70 film conservative
  | 'scan_equivalent_high'  // 15/70 film optimistic
  | 'supersampled'          // GT dual laser √2 × native
  | 'home_display';         // PPI-based home display

export interface MaskingResult {
  effective_width_ft: number;
  effective_height_ft: number;
  effective_area_sqft: number;
  screen_utilization_pct: number;
  letterboxed: boolean;   // horizontal bars (content wider than screen)
  pillarboxed: boolean;   // vertical bars (content taller than screen)
  cropped: boolean;       // content AR < screen's min_content_ar
  bars_height_ft: number; // height of each letterbox bar (0 if none)
  bars_width_ft: number;  // width of each pillarbox bar (0 if none)
}

export interface BrightnessComparison {
  cinema_fl: number;
  cinema_nits: number;
  home_nits: number;       // uses fullscreen_nits for fair comparison
  home_fl: number;
  home_brightness_tier: 'peak_hdr' | 'fullscreen' | 'sdr';
  ratio_home_to_cinema: number; // >1 means home is brighter
  caveat: string;
}

export interface SeatingDistances {
  front_ft: number;
  mid_ft: number;
  back_ft: number;
  source: string;
}
