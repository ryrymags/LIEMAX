// Typed-lite accessors over the generated docs bundle. The bundle is the
// single source of truth for venue/format data (built by
// src/docs/buildDocsData.ts) — this module never re-derives math, it only
// shapes/filters what's already there for the React UI.
import bundle from '@data/generated/docs_bundle.json';

export interface ScreenInfo {
  w: number | null;
  h: number | null;
  ar: number | null;
  sizeTier: string | null;
  sizeLabel: string | null;
  widthConfidence: string | null;
  geometry: string | null;
  curvatureRadiusFt: number | null;
  screenBottomFt: number | null;
  domeCoveragePct: number | null;
  domeHFov: number | null;
  domeVFov: number | null;
}

export interface SeatInfo {
  capacity: number | null;
  front: number | null;
  mid: number | null;
  back: number | null;
  source: string | null;
  rakeDeg: number | null;
  rowSpacingFt: number | null;
  frontRowFloorElevationFt: number | null;
  geometryProfile: string | null;
}

export interface ProjectionInfo {
  id: string;
  label: string;
  light: string | null;
  resH: number | null;
  resV: number | null;
  scanEquivLow: number | null;
  scanEquivHigh: number | null;
  scanEquivLabel: string | null;
  brightness_fl: number | null;
  brightness_nits_full: number | null;
  nativeContrast: number | null;
  isPerPixelEmissive: boolean | null;
  hdrCategory: string | null;
  hdrLabel: string | null;
  hdrDynamic: string | null;
  min_ar: number | null;
  type: string;
  display_name: string | null;
}

export interface PresentationMode {
  id: string;
  ar: number;
  label: string;
  enabled: boolean;
  isBookingDependent: boolean;
  isFilmMode: boolean;
  projection: string;
  disabledReason?: string;
}

export interface Venue {
  id: string;
  canonicalId?: string;
  kind: string;
  name: string;
  city?: string | null;
  state?: string | null;
  stateName?: string | null;
  isPreset: boolean;
  dataSource: string;
  sub?: string;
  tag?: string;
  blurb?: string;
  screen: ScreenInfo;
  seat?: SeatInfo;
  defaultPresentationAr?: number;
  isHybrid?: boolean;
  presentationModes?: PresentationMode[];
  projection: ProjectionInfo | null;
  filmProjection: ProjectionInfo | null;
  sources?: Record<string, { q: string; note?: string }>;
}

export interface DbStats {
  total_us_imax: number;
  current_r_imax_count: number;
  lfexaminer_supplemental_count: number;
  full_143_projection_capable_count: number;
  commercial_full_143_projection_capable_count: number;
  imax_lite_count: number;
  liemax_count: number;
  liemax_pct: number;
  liemax_lfexaminer_count: number;
  liemax_lfexaminer_pct: number;
  liemax_current_source_count: number;
  liemax_current_source_pct: number;
  not_full_143_digital_count: number;
  not_full_143_digital_pct: number;
  gt_laser_count: number;
  gt_laser_incl_archival_count: number;
  film_conditional_count: number;
  film_conditional_incl_archival_count: number;
  dome_count: number;
  dome_incl_archival_count: number;
  dolby_cinema_us_count: number | null;
  dolby_cinema_us_count_checked_at?: string | null;
  dolby_cinema_us_count_endpoint?: string | null;
}

interface DocsBundle {
  venues: Venue[];
  contentFormats: unknown[];
  qualityMeta: Record<string, { label: string; tier: number }>;
  db: DbStats;
}

const typedBundle = bundle as DocsBundle;

/** All non-preset cinema venues (excludes home-display presets and format presets). */
export const allVenues: Venue[] = typedBundle.venues.filter(
  (v) => v.kind === 'cinema' && !v.isPreset,
);

export const db: DbStats = typedBundle.db;

export const qualityMeta = typedBundle.qualityMeta;

export const contentFormats = typedBundle.contentFormats;

/**
 * Case-insensitive substring search over name/city/state.
 * Excludes preset rows; caps results to keep the combobox listbox short.
 */
export function searchVenues(query: string, max = 12): Venue[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: Venue[] = [];
  for (const v of allVenues) {
    const haystack = `${v.name} ${v.city ?? ''} ${v.state ?? ''} ${v.stateName ?? ''}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push(v);
      if (results.length >= max) break;
    }
  }
  return results;
}

export function venueLocationLabel(v: Venue): string {
  if (v.city && v.state) return `${v.city}, ${v.state}`;
  if (v.state) return v.state;
  return '';
}

export function isArchivalSource(v: Venue): boolean {
  return v.dataSource === 'lfexaminer';
}
