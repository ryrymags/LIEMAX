import * as fs from 'fs';
import * as path from 'path';
import {
  diagonalToDimensions,
  feetToMeters,
  metersToFeet,
  resolveHomeDisplay,
  resolveVenue,
} from '../math';
import { map143190RowToVenue, type Imax143190ImportRow } from '../data/imaxImport';
import {
  docs143190RowMatchKey,
  docs143190RowToMatchRow,
  LFEXAMINER_CURRENT_SOURCE_ALIAS_KEYS,
  lfExaminerHas143190Conflict,
  lfExaminerMatchKey,
  mapLFExaminerRowToVenue,
  source143190MatchKey,
  type Source143190MatchRow,
  type LFExaminerImportRow,
} from '../data/lfexaminerImport';
import {
  DOLBY_CINEMA_ENDPOINT,
  mostRecentDolbyCinemaSnapshot,
  readDolbyCinemaSnapshots,
} from '../data/dolbyCinemaCount';
// workbenchRuntime's comparison-row logic gets ported into the V2 app in M3;
// its browser-source emission retired with the prototype.

type JsonObject = Record<string, any>;

const root = path.resolve(__dirname, '../..');
const checkOnly = process.argv.includes('--check');
const R_IMAX_LAST_VERIFIED = '2026-06-05';
const R_IMAX_SOURCE_URL = 'https://github.com/r-imax/imaxguide/blob/main/data/americas/unitedstates.csv';
const GENERATED_143190_ROW_SUPPRESSIONS = new Set([
  // Authored canonical record carries venue-specific Providence caveats; live r-imax uses the older venue name.
  'RI|Providence|Providence Place Cinemas 16 and IMAX',
]);

function readJson<T = any>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8')) as T;
}

function listJson(relativeDir: string): string[] {
  return fs.readdirSync(path.join(root, relativeDir))
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => path.join(relativeDir, file));
}

function writeOrCheck(relativePath: string, next: string): boolean {
  const fullPath = path.join(root, relativePath);
  const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : null;
  if (current === next) return false;
  if (checkOnly) {
    console.error(`${relativePath} is stale. Run npm run build:docs-data.`);
    return true;
  }
  fs.writeFileSync(fullPath, next);
  console.log(`Wrote ${relativePath}`);
  return true;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseAspectRatio(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const ratio = value.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  if (ratio) return Number(ratio[1]) / Number(ratio[2]);
  const number = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(number) ? number : null;
}

function source143190Key(value: JsonObject): string | null {
  const source = value.source_143190;
  if (!source) return null;
  return source143190MatchKey(source);
}

function source143190MatchRow(value: JsonObject): Source143190MatchRow | null {
  const source = value.source_143190;
  if (!source) return null;
  return {
    province_state: source.province_state ?? value.state_province ?? null,
    city: source.city ?? value.city ?? null,
    location_name: source.location_name ?? value.name,
    screen_height_m: source.screen_height_m ?? value.screen?.height_m ?? null,
    screen_width_m: source.screen_width_m ?? value.screen?.width_m ?? null,
  };
}

function sourceLFExaminerKey(value: JsonObject): string | null {
  const source = value.source_lfexaminer;
  if (!source) return null;
  return lfExaminerMatchKey(source as LFExaminerImportRow);
}

const IMAX_LITE_PROJECTOR_TYPES = new Set(['imax_cola', 'imax_laser_xt', 'imax_gt_dual_laser']);
const LIEMAX_PROJECTOR_TYPES = new Set(['imax_dual_xenon']);
const DOME_PROJECTOR_TYPES = new Set(['imax_dome_laser', 'imax_dome_film']);
const RETROFIT_IMAX_PROJECTOR_TYPES = new Set(['imax_cola', 'imax_laser_xt', 'imax_dual_xenon']);
const DOLBY_PROJECTOR_TYPES = new Set(['dolby_cinema', 'dolby_cinema_single_laser']);
const EYE_ABOVE_FLOOR_FT = 3.7;
const GT_FRONT_EYE_SCREEN_PCT = 0.33;
const GT_REFERENCE_FRONT_ROW_FLOOR_ELEVATION_FT = 13.5;

const GEOMETRY_PROFILE_DEFAULTS: Record<string, JsonObject> = {
  gt_pit: {
    rake_angle_deg: 25,
    row_spacing_ft: 3.2,
    front_row_floor_elevation_ft: GT_REFERENCE_FRONT_ROW_FLOOR_ELEVATION_FT,
    ratios: { front: 0.35, mid: 0.65, back: 0.9 },
    source: 'derived_from_screen_width',
  },
  retrofit_no_pit: {
    rake_angle_deg: 10,
    row_spacing_ft: 3.25,
    front_row_floor_elevation_ft: 0,
    ratios: { front: 1.1, mid: 1.2, back: 1.4 },
    source: 'derived_from_screen_width',
  },
  dolby_recliner: {
    rake_angle_deg: 10,
    row_spacing_ft: 5.2,
    front_row_floor_elevation_ft: 0,
    ratios: { front: 0.35, mid: 0.75, back: 1.3 },
    source: 'derived_from_screen_width',
  },
  standard_conventional: {
    rake_angle_deg: 7,
    row_spacing_ft: 3.5,
    front_row_floor_elevation_ft: 0,
    ratios: { front: 1.5, mid: 2.0, back: 2.5 },
    source: 'derived_from_screen_width',
  },
  dome: {
    rake_angle_deg: 30,
    row_spacing_ft: null,
    front_row_floor_elevation_ft: null,
    ratios: { front: 0.5, mid: 0.5, back: 0.5 },
    source: 'community_estimate',
  },
};

function isRealCinemaVenue(venue: JsonObject): boolean {
  return venue.kind === 'cinema' && !venue.isPreset;
}

function projectionTypeOf(record: JsonObject, resolved?: JsonObject): string | null {
  return resolved?.projection?.type ?? record.projection?.type ?? record.default_projection?.type ?? null;
}

function isGtPitProfile(record: JsonObject, resolved?: JsonObject): boolean {
  const screen = resolved?.screen ?? record.screen ?? {};
  const capabilities = resolved?.capabilities ?? record.capabilities ?? {};
  const projectionType = projectionTypeOf(record, resolved);
  const screenAr = screen.aspect_ratio ?? record.source_143190?.screen_aspect_ratio ?? screen.ar;
  if (screen.geometry === 'hemispherical') return false;
  if (screenAr == null || screenAr > 1.45) return false;
  return projectionType === 'imax_gt_dual_laser' ||
    projectionType === 'imax_1570_film' ||
    capabilities.supports_143_digital === true ||
    capabilities.supports_1570_film === true ||
    (resolved?.projections ?? record.projections ?? []).some((projection: JsonObject) =>
      projection.type === 'imax_gt_dual_laser' ||
      projection.type === 'imax_1570_film' ||
      projection.min_content_ar_supported <= 1.43
    );
}

function geometryProfileFor(record: JsonObject, resolved?: JsonObject): string {
  const screen = resolved?.screen ?? record.screen ?? {};
  const projectionType = projectionTypeOf(record, resolved);
  if (screen.geometry === 'hemispherical') return 'dome';
  if (isGtPitProfile(record, resolved)) return 'gt_pit';
  if (projectionType && DOLBY_PROJECTOR_TYPES.has(projectionType)) return 'dolby_recliner';
  if (projectionType && RETROFIT_IMAX_PROJECTOR_TYPES.has(projectionType)) return 'retrofit_no_pit';
  return 'standard_conventional';
}

function gtFrontRowFloorElevation(screenHeightFt: number | null | undefined): number {
  if (screenHeightFt == null || !Number.isFinite(screenHeightFt) || screenHeightFt <= 0) {
    return GT_REFERENCE_FRONT_ROW_FLOOR_ELEVATION_FT;
  }
  return Math.max(0, screenHeightFt * GT_FRONT_EYE_SCREEN_PCT - EYE_ABOVE_FLOOR_FT);
}

function profileSeating(screenWidthFt: number, profile: string, screenHeightFt?: number | null): JsonObject {
  const defaults = GEOMETRY_PROFILE_DEFAULTS[profile] ?? GEOMETRY_PROFILE_DEFAULTS.standard_conventional;
  const ratios = defaults.ratios;
  const frontRowFloorElevationFt = profile === 'gt_pit'
    ? gtFrontRowFloorElevation(screenHeightFt)
    : defaults.front_row_floor_elevation_ft;
  return {
    viewing_distance_front_ft: screenWidthFt * ratios.front,
    viewing_distance_mid_ft: screenWidthFt * ratios.mid,
    viewing_distance_back_ft: screenWidthFt * ratios.back,
    viewing_distance_source: defaults.source,
    rake_angle_deg: defaults.rake_angle_deg,
    row_spacing_ft: defaults.row_spacing_ft,
    front_row_floor_elevation_ft: frontRowFloorElevationFt,
  };
}

function profileSeatSourceNote(profile: string): string {
  if (profile === 'gt_pit') {
    return 'Profile-derived GT estimate: front/mid/back use 0.35×, 0.65×, and 0.90× screen width; pit/deck elevation targets front-row eyes about one-third up the screen, with row pitch/rake still renderer estimates rather than venue measurements.';
  }
  if (profile === 'retrofit_no_pit') {
    return 'Profile-derived retrofit IMAX estimate: no screen pit; front/mid/back use 1.10×, 1.20×, and 1.40× screen width from the seating-distance audit.';
  }
  if (profile === 'dolby_recliner') {
    return 'Profile-derived Dolby Cinema estimate: no screen pit; front/mid/back use 0.35×, 0.75×, and 1.30× screen width, with wider recliner row spacing and exact per-venue row depth still unpublished.';
  }
  if (profile === 'dome') {
    return 'Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics.';
  }
  return 'Profile-derived conventional auditorium estimate: front/mid/back use 1.50×, 2.00×, and 2.50× screen width; exact per-venue row depth is not published.';
}

function isFullFlat143Digital(venue: JsonObject): boolean {
  return venue.screen?.geometry !== 'hemispherical' &&
    venue.projection?.type === 'imax_gt_dual_laser' &&
    venue.projection?.min_ar != null &&
    venue.projection.min_ar <= 1.43 &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

function isFlat143Screen(venue: JsonObject): boolean {
  return venue.screen?.geometry !== 'hemispherical' &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

function hasFlat143ProjectionPath(venue: JsonObject): boolean {
  return isFlat143Screen(venue) &&
    (isFullFlat143Digital(venue) || venue.filmProjection?.min_ar <= 1.43);
}

function isFilmConditional143(venue: JsonObject): boolean {
  return Boolean(venue.filmProjection) &&
    isFlat143Screen(venue);
}

function isDomeVenue(venue: JsonObject): boolean {
  return venue.screen?.geometry === 'hemispherical' ||
    DOME_PROJECTOR_TYPES.has(venue.projection?.type);
}

function isImaxLiteVenue(venue: JsonObject): boolean {
  return !isDomeVenue(venue) &&
    !isFullFlat143Digital(venue) &&
    IMAX_LITE_PROJECTOR_TYPES.has(venue.projection?.type);
}

function screenSizeTier(screen: JsonObject | null | undefined): { tier: string; label: string } | null {
  if (!screen) return null;
  if (screen.geometry === 'hemispherical') return { tier: 'dome', label: 'Dome' };
  const widthFt = screen.width_ft ?? screen.w;
  if (widthFt == null || !Number.isFinite(widthFt) || widthFt <= 0) return null;
  if (widthFt < 55) return { tier: 'small', label: 'Small Screen' };
  if (widthFt < 70) return { tier: 'medium', label: 'Medium Screen' };
  if (widthFt < 85) return { tier: 'large', label: 'Large Screen' };
  return { tier: 'giant', label: 'Giant Screen' };
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function buildDb(venues: JsonObject[]): JsonObject {
  const latestDolbySnapshot = mostRecentDolbyCinemaSnapshot(readDolbyCinemaSnapshots());
  const cinemaVenues = venues.filter(isRealCinemaVenue);
  const currentRimaxVenues = cinemaVenues.filter((venue) => venue.dataSource === 'r_imax_csv');
  const lfExaminerVenues = cinemaVenues.filter((venue) => venue.dataSource === 'lfexaminer');
  const imaxLiteCount = cinemaVenues.filter(isImaxLiteVenue).length;
  const liemaxVenues = cinemaVenues.filter((venue) => LIEMAX_PROJECTOR_TYPES.has(venue.projection?.type));
  const liemaxCount = liemaxVenues.length;
  const liemaxLfExaminerCount = liemaxVenues.filter((venue) => venue.dataSource === 'lfexaminer').length;
  const liemaxCurrentSourceCount = liemaxCount - liemaxLfExaminerCount;
  const notFull143DigitalCount = imaxLiteCount + liemaxCount;
  const currentFull143ProjectionCapableCount = currentRimaxVenues.filter(hasFlat143ProjectionPath).length;

  return {
    total_us_imax: cinemaVenues.length,
    current_r_imax_count: currentRimaxVenues.length,
    lfexaminer_supplemental_count: lfExaminerVenues.length,
    full_143_projection_capable_count: currentFull143ProjectionCapableCount,
    commercial_full_143_projection_capable_count: currentRimaxVenues
      .filter((venue) => venue.commercialFilms)
      .filter(hasFlat143ProjectionPath).length,
    imax_lite_count: imaxLiteCount,
    liemax_count: liemaxCount,
    liemax_pct: pct(liemaxCount, cinemaVenues.length),
    liemax_lfexaminer_count: liemaxLfExaminerCount,
    liemax_lfexaminer_pct: pct(liemaxLfExaminerCount, cinemaVenues.length),
    liemax_current_source_count: liemaxCurrentSourceCount,
    liemax_current_source_pct: pct(liemaxCurrentSourceCount, currentRimaxVenues.length),
    not_full_143_digital_count: notFull143DigitalCount,
    not_full_143_digital_pct: pct(notFull143DigitalCount, cinemaVenues.length),
    // Capability counts are scoped to current r-imax rows only — archival
    // 2021 LFExaminer rows are stale and must not inflate headline stats
    // (July 2026 audit). *_incl_archival variants expose the mixed count.
    gt_laser_count: currentRimaxVenues.filter(isFullFlat143Digital).length,
    gt_laser_incl_archival_count: cinemaVenues.filter(isFullFlat143Digital).length,
    film_conditional_count: currentRimaxVenues.filter(isFilmConditional143).length,
    film_conditional_incl_archival_count: cinemaVenues.filter(isFilmConditional143).length,
    dome_count: currentRimaxVenues.filter(isDomeVenue).length,
    dome_incl_archival_count: cinemaVenues.filter(isDomeVenue).length,
    dolby_cinema_us_count: latestDolbySnapshot?.count ?? null,
    dolby_cinema_us_count_checked_at: latestDolbySnapshot?.checkedAt ?? null,
    dolby_cinema_us_count_endpoint: latestDolbySnapshot?.sourceEndpoint ?? DOLBY_CINEMA_ENDPOINT,
  };
}

function rowKey(row: any[]): string {
  return `${row[0]}|${row[1]}|${row[2]}`;
}

function hasComparableScreen(row: LFExaminerImportRow): boolean {
  return row.screen_width_m != null && row.screen_height_m != null;
}

function screenFromDocs(screen: JsonObject, profile = 'standard_conventional'): JsonObject {
  return {
    width_m: feetToMeters(screen.w),
    height_m: feetToMeters(screen.h),
    width_ft: screen.w,
    height_ft: screen.h,
    width_confidence: 'community_estimate',
    aspect_ratio: screen.ar,
    geometry: screen.geometry === 'slight_curve' ? 'slight_cylindrical_curve' : screen.geometry,
    curvature_radius_ft: null,
    screen_bottom_height_ft: screen.geometry === 'hemispherical' ? null : (profile === 'gt_pit' ? 0 : profile === 'dolby_recliner' || profile === 'retrofit_no_pit' ? 4 : 3.5),
    is_perforated: true,
    dome_coverage_pct: screen.domeCoveragePct == null ? null : screen.domeCoveragePct * 100,
    dome_fov_horizontal_deg: screen.domeHFov ?? null,
    dome_fov_vertical_deg: screen.domeVFov ?? null,
    dome_fov_above_horizon_deg: screen.domeHFov ? 105 : null,
    dome_fov_below_horizon_deg: screen.domeHFov ? 20 : null,
  };
}

function seatingFromDocs(seat: JsonObject, profile = 'standard_conventional', screenHeightFt?: number | null): JsonObject {
  const profileDefaults = GEOMETRY_PROFILE_DEFAULTS[profile] ?? GEOMETRY_PROFILE_DEFAULTS.standard_conventional;
  const defaultFrontRowFloorElevationFt = profile === 'gt_pit'
    ? gtFrontRowFloorElevation(screenHeightFt)
    : profileDefaults.front_row_floor_elevation_ft;
  return {
    capacity: null,
    rake_angle_deg: seat.rakeDeg ?? profileDefaults.rake_angle_deg,
    row_spacing_ft: seat.rowSpacingFt ?? profileDefaults.row_spacing_ft,
    front_row_floor_elevation_ft: seat.frontRowFloorElevationFt ?? defaultFrontRowFloorElevationFt,
    seat_type: profile === 'dolby_recliner' ? 'recliner' : 'standard',
    has_bass_transducers: profile === 'dolby_recliner',
    viewing_distance_front_ft: seat.front,
    viewing_distance_mid_ft: seat.mid,
    viewing_distance_back_ft: seat.back,
    viewing_distance_source: seat.source === 'preset_typical' ? 'derived_from_screen_width' : seat.source,
    seat_offset_from_center_ft: 0,
  };
}

function completeMetadata(dataSource: string, confidence: string, notes: string | null): JsonObject {
  return {
    data_source: dataSource,
    source_url: null,
    sources: null,
    field_sources: null,
    last_verified: '2026-05-02',
    created_at: '2026-05-02T00:00:00Z',
    updated_at: '2026-05-02T00:00:00Z',
    confidence,
    notes,
  };
}

function buildFrontendCinemaRecord(item: JsonObject): JsonObject {
  const profile = item.seat?.geometryProfile ?? geometryProfileFor({
    screen: {
      ...screenFromDocs(item.screen),
      aspect_ratio: item.screen?.ar,
      geometry: item.screen?.geometry === 'slight_curve' ? 'slight_cylindrical_curve' : item.screen?.geometry,
    },
    projection: { type: item.preset_id },
    capabilities: { supports_143_digital: item.preset_id === 'imax_gt_dual_laser', supports_1570_film: item.preset_id === 'imax_1570_film' },
  });
  return {
    id: item.id,
    preset_id: item.preset_id,
    name: item.name,
    chain: null,
    brand_label: item.tag,
    city: '',
    state_province: 'Format presets',
    country: 'Format presets',
    coordinates: null,
    screen: screenFromDocs(item.screen, profile),
    projection: null,
    projections: null,
    sound: null,
    seating: seatingFromDocs(item.seat, profile, item.screen?.h),
    capabilities: null,
    history: [],
    metadata: completeMetadata('frontend_comparison_record', 'medium', item.blurb),
    docs_frontend: { ...item, geometryProfile: profile },
  };
}

function buildHomeRecord(item: JsonObject): JsonObject {
  const diagonalIn = Math.sqrt((item.screen.w * 12) ** 2 + (item.screen.h * 12) ** 2);
  return {
    id: item.id,
    preset_id: item.preset_id,
    user_label: item.user_label,
    brand: null,
    model: null,
    screen_diagonal_in: diagonalIn,
    aspect_ratio: item.screen.ar,
    viewing_distance_ft: item.seat.mid,
    display_optics: null,
    year_purchased: null,
    metadata: completeMetadata('frontend_comparison_record', 'medium', item.blurb),
    docs_frontend: item,
  };
}

function rowToImportObject(row: any[]): Imax143190ImportRow {
  return {
    region: 'United States',
    country_area: 'United States',
    province_state: row[0],
    city: row[1],
    location_name: row[2],
    screen_aspect_ratio: row[3],
    digital_projector: row[4],
    max_digital_ar: row[5],
    film_projector: row[6],
    screen_height_m: row[7],
    screen_width_m: row[8],
    commercial_films: row[9],
    raw: {
      State: row[0],
      City: row[1],
      'Location Name': row[2],
      'Screen Aspect Ratio (AR)': row[3],
      'Digital Projector': row[4],
      'Maximum AR for digital projection': row[5],
      'Film Projector': row[6],
      Height: `${row[7]} m`,
      Width: `${row[8]} m`,
      'Commercial films shown?': row[9],
    },
  };
}

function buildGeneratedImaxVenue(row: any[], authoredByKey: Map<string, JsonObject>): JsonObject {
  const record = map143190RowToVenue(rowToImportObject(row), {
    lastVerified: R_IMAX_LAST_VERIFIED,
    sourceUrl: R_IMAX_SOURCE_URL,
  }) as JsonObject;
  const docsId = `imax_us_${String(row[0]).toLowerCase()}_${slugify(`${row[1]}_${row[2]}`)}`;
  const screenWidthM = record.screen?.width_m;
  const screenWidthFt = screenWidthM != null ? metersToFeet(screenWidthM) : null;
  const isDome = record.screen?.geometry === 'hemispherical';
  const key = rowKey(row);
  const authored = authoredByKey.get(key);
  const geometryProfile = geometryProfileFor(record);

  record.id = docsId;
  record.name = row[2];
  record.city = row[1];
  record.state_province = row[0];
  record.country = 'United States';
  record.metadata = completeMetadata(
    'r_imax_csv',
    record.metadata?.confidence ?? 'medium',
    record.metadata?.notes ?? null
  );
  record.metadata.sources = record.metadata.sources ?? null;
  record.docs_canonical_id = authored?.id ?? docsId;
  record.docs_frontend = {
    canonicalId: authored?.id ?? docsId,
    geometryProfile,
    blurb: isDome
      ? 'Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.'
      : 'Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.',
  };

  if (screenWidthFt != null) {
    const screenHeightFt = record.screen?.height_m != null ? metersToFeet(record.screen.height_m) : null;
    const seating = profileSeating(screenWidthFt, isDome ? 'dome' : geometryProfile, screenHeightFt);
    record.seating = {
      capacity: null,
      seat_type: 'standard',
      has_bass_transducers: false,
      ...seating,
      seat_offset_from_center_ft: 0,
    };
  }

  return record;
}

function buildGeneratedLFExaminerVenue(row: LFExaminerImportRow, authoredByKey: Map<string, JsonObject>): JsonObject {
  const record = mapLFExaminerRowToVenue(row, {
    lastVerified: '2021-10-17',
    sourceUrl: 'https://lfexaminer.com/theaters/',
  }) as JsonObject;
  const docsId = `imax_us_${String(row.state).toLowerCase()}_${slugify(`${row.city}_${row.organization}`)}`;
  const screenWidthM = record.screen?.width_m;
  const screenWidthFt = screenWidthM != null ? metersToFeet(screenWidthM) : null;
  const isDome = record.screen?.geometry === 'hemispherical';
  const authored = authoredByKey.get(lfExaminerMatchKey(row));
  const hasFilm = row.format.includes('1570');
  const isNatick = row.state === 'MA' &&
    row.city === 'Natick' &&
    row.organization === "Sunbrella IMAX 3D Theater, Jordan's Furniture Natick";

  record.id = docsId;
  record.name = row.organization;
  record.city = row.city;
  record.state_province = row.state;
  record.country = 'United States';
  record.docs_canonical_id = authored?.id ?? docsId;
  record.docs_frontend = {
    canonicalId: authored?.id ?? docsId,
    sub: `${row.city} · ${isDome ? 'Dome · ' : ''}LFExaminer 2021 · IMAX Digital Xenon${hasFilm ? ' + 15/70 Film' : ''}`,
    tag: hasFilm ? 'IMAX 15/70 + Xenon' : 'IMAX Xenon',
    blurb: hasFilm
      ? 'Supplemental LFExaminer archival row last updated in 2021. Listed as 15/70 film plus digital Xenon; current venue status and projection status may have changed.'
      : 'Supplemental LFExaminer archival row last updated in 2021. Listed as IMAX digital Xenon; current venue status and projection status may have changed.',
    sources: {
      screen: {
        q: 'lfexaminer',
        note: `LFExaminer theater table, last updated 2021-10-17 — ${row.screen_size ?? 'screen size not published'}.`,
      },
      seat: {
        q: 'derived_from_screen_width',
        note: isDome
          ? 'Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics.'
          : profileSeatSourceNote(geometryProfileFor(record)),
      },
    },
  };

  if (isNatick) {
    record.screen = {
      ...record.screen,
      width_m: feetToMeters(76),
      height_m: feetToMeters(55),
      width_ft: 76,
      height_ft: 55,
      width_confidence: 'confirmed',
      aspect_ratio: 76 / 55,
      geometry: 'flat',
    };
    record.seating = {
      ...record.seating,
      capacity: 279,
    };
    record.docs_frontend = {
      ...record.docs_frontend,
      sub: 'Natick · official Jordan’s specs · Dual Xenon',
      blurb: 'Official Jordan’s Furniture specs list a 76 × 55 ft screen and 279 seats. Projector classification is Dual Xenon from the LFExaminer IMAX Digital Xenon row; update if current GT Laser, CoLa/Laser XT, or 15/70 evidence is found.',
      sources: {
        ...record.docs_frontend.sources,
        screen: {
          q: 'published_official',
          note: 'Jordan’s Furniture IMAX page — Natick Sunbrella IMAX 3D Theater: 76 × 55 foot projector screen and 279 seats. Projector type remains from LFExaminer IMAX Digital Xenon. https://www.jordans.com/imax',
        },
        seat: {
          q: 'published_official',
          note: 'Jordan’s Furniture IMAX page lists comfortable seats for 279 guests at Natick. https://www.jordans.com/imax',
        },
      },
    };
  }

  if (screenWidthFt != null) {
    const resolvedScreenWidthFt = isNatick ? 76 : screenWidthFt;
    const geometryProfile = geometryProfileFor(record);
    const screenHeightFt = record.screen?.height_m != null ? metersToFeet(record.screen.height_m) : null;
    const seating = profileSeating(resolvedScreenWidthFt, isDome ? 'dome' : geometryProfile, screenHeightFt);
    record.seating = {
      ...record.seating,
      ...seating,
      capacity: isNatick ? 279 : row.seats,
      seat_offset_from_center_ft: 0,
    };
    record.docs_frontend.geometryProfile = geometryProfile;
  }

  return record;
}

function fmtAr(ar: number | null | undefined): string {
  return ar == null ? 'Unknown' : ar.toFixed(2);
}

function stateName(code: string | null | undefined): string {
  const names: Record<string, string> = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DC: 'District of Columbia', DE: 'Delaware',
    FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', IA: 'Iowa', ID: 'Idaho',
    IL: 'Illinois', IN: 'Indiana', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
    MA: 'Massachusetts', MD: 'Maryland', ME: 'Maine', MI: 'Michigan',
    MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi', MT: 'Montana',
    NC: 'North Carolina', ND: 'North Dakota', NE: 'Nebraska', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NV: 'Nevada', NY: 'New York',
    OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
    RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
    TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VA: 'Virginia',
    VT: 'Vermont', WA: 'Washington', WI: 'Wisconsin', WV: 'West Virginia',
    WY: 'Wyoming',
  };
  return (code && names[code]) || code || '';
}

function lightLabel(value: string | null | undefined): string {
  const labels: Record<string, string> = {
    rgb_laser: 'RGB Laser',
    dual_rgb_laser: 'Dual RGB Laser',
    xenon: 'Dual Xenon',
    xenon_film: 'Xenon (Film)',
    led: 'LED',
  };
  return (value && labels[value]) || value || 'Unknown';
}

function hdrCategory(value: string | null | undefined): string {
  return value === 'none' || value == null ? 'sdr' : value;
}

function hdrLabel(projection: JsonObject): string {
  if (projection.hdr === 'dolby_vision') {
    return projection.contrast_dynamic
      ? `Dolby Vision dynamic (${Number(projection.contrast_dynamic).toLocaleString()}:1)`
      : 'Dolby Vision dynamic';
  }
  if (projection.hdr === 'photochemical') return 'Photochemical latitude';
  if (projection.hdr === 'none') return '—';
  return projection.hdr || 'Unknown';
}

function docsProjection(projection: JsonObject | null | undefined, homeOptics?: JsonObject): JsonObject {
  if (homeOptics) {
    const hdrFormats = homeOptics.hdr_formats || [];
    const hasDolby = hdrFormats.includes('dolby_vision');
    const hasHdr10Plus = hdrFormats.includes('hdr10plus');
    return {
      id: homeOptics.panel_tech,
      label: homeOptics.panel_tech === 'woled' ? 'MLA WOLED · per-pixel emissive' : 'Mini-LED LCD · zone dimming',
      light: homeOptics.panel_tech === 'woled' ? 'Per-pixel OLED' : 'Mini-LED Backlight',
      resH: homeOptics.resolution_horizontal_px,
      resV: homeOptics.resolution_vertical_px,
      scanEquivLow: null,
      scanEquivHigh: null,
      scanEquivLabel: null,
      brightness_fl: null,
      brightness_nits_full: homeOptics.brightness_fullscreen_nits,
      nativeContrast: homeOptics.contrast_sequential,
      isPerPixelEmissive: Boolean(homeOptics.is_per_pixel_emissive),
      hdrCategory: hasDolby ? 'dolby_vision' : hasHdr10Plus ? 'hdr10plus' : hdrFormats.includes('hdr10') ? 'hdr10' : 'unknown',
      hdrLabel: hasDolby ? 'Dolby Vision / HDR10' : hasHdr10Plus ? 'HDR10+' : 'HDR10',
      hdrDynamic: null,
      min_ar: 0,
    };
  }

  const p = projection ?? {};
  return {
    id: p.id,
    label: p.display_name ?? 'Unknown projector',
    light: lightLabel(p.light_source),
    resH: p.resolution_horizontal_px ?? null,
    resV: p.resolution_vertical_px ?? null,
    scanEquivLow: p.resolution_scan_equivalent_low ?? null,
    scanEquivHigh: p.resolution_scan_equivalent_high ?? null,
    scanEquivLabel: p.effective_resolution_label ?? null,
    brightness_fl: p.brightness_fl ?? null,
    brightness_nits_full: null,
    nativeContrast: p.contrast_sequential ?? null,
    isPerPixelEmissive: false,
    hdrCategory: hdrCategory(p.hdr),
    hdrLabel: hdrLabel(p),
    hdrDynamic: p.contrast_dynamic ?? null,
    min_ar: p.min_content_ar_supported ?? p.effective_screen_aspect_ratio ?? 1.90,
    type: p.type,
    display_name: p.display_name,
  };
}

function projectorSummaryLabel(digitalProjection: JsonObject, filmProjection: JsonObject | null): string {
  if (filmProjection && filmProjection.label === digitalProjection.label) return digitalProjection.label;
  return filmProjection ? `${digitalProjection.label} + ${filmProjection.label}` : digitalProjection.label;
}

function docsSources(record: JsonObject, resolvedProjection: JsonObject, maskSources?: JsonObject, profileOverride?: string): JsonObject {
  const generic = resolvedProjection.type === 'other';
  const isDome = record.screen?.geometry === 'hemispherical';
  const isLFExaminer = record.metadata?.data_source === 'lfexaminer';
  const profile = profileOverride ?? record.docs_frontend?.geometryProfile ?? geometryProfileFor(record);
  const base = {
    screen: {
      q: record.metadata?.data_source === 'frontend_comparison_record'
        ? 'preset_typical'
        : isLFExaminer
          ? 'lfexaminer'
          : 'r_imax_csv',
      note: isLFExaminer
        ? `LFExaminer theater table, last updated 2021-10-17 — ${record.source_lfexaminer?.screen_size ?? 'screen size not published'}.`
        : isDome
        ? `143190.xyz CSV — dome diameter ${(record.screen?.width_m ?? 0).toFixed(2)} m; height normalized from CSV when needed.`
        : record.screen?.width_m != null && record.screen?.height_m != null
          ? `143190.xyz CSV — ${record.screen.width_m} × ${record.screen.height_m} m.`
          : 'Canonical frontend comparison record.',
    },
    brightness: generic
      ? { q: 'unknown', note: 'Projector label is not specific enough to inherit format brightness.' }
      : { q: resolvedProjection.brightness_source ?? 'preset_typical', note: 'Format average inherited from the matching canonical projection preset.' },
    contrast: generic
      ? { q: 'unknown', note: 'Projector label is not specific enough to inherit format contrast.' }
      : { q: resolvedProjection.contrast_source ?? 'preset_typical', note: 'Format average inherited from the matching canonical projection preset.' },
    seat: {
      q: record.seating?.viewing_distance_source ?? 'derived_from_screen_width',
      note: profileSeatSourceNote(profile),
    },
  };
  return {
    ...base,
    ...(record.docs_frontend?.sources ?? {}),
    ...(maskSources ?? {}),
  };
}

function generatedPresentationModes(resolved: JsonObject, filmProjection: JsonObject | null, fallbackAr?: number): JsonObject[] {
  const isDome = resolved.screen.geometry === 'hemispherical';
  const digital143 = Boolean(resolved.capabilities.supports_143_digital);
  const film143 = Boolean(filmProjection);
  const modes: JsonObject[] = [];

  if (isDome) {
    if (digital143) modes.push({ id: 'digital_dome_143', ar: 1.43, label: '1.43 · IMAX Dome Laser', enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' });
    if (film143) modes.push({ id: 'film_dome_143', ar: 1.43, label: '1.43 · IMAX Dome 15/70', enabled: true, isBookingDependent: true, isFilmMode: true, projection: 'film' });
    return modes;
  }

  if (digital143) modes.push({ id: 'digital_143', ar: 1.43, label: '1.43 · IMAX Laser', enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' });
  modes.push(
    { id: 'digital_190', ar: 1.90, label: '1.90 · IMAX Digital', enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' },
    { id: 'digital_239', ar: 2.39, label: '2.39 · Scope', enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' },
    { id: 'digital_185', ar: 1.85, label: '1.85 · Flat', enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' }
  );
  if (film143) modes.push({ id: 'film_143', ar: 1.43, label: '1.43 · 15/70mm Film', enabled: true, isBookingDependent: true, isFilmMode: true, projection: 'film' });
  if (fallbackAr != null && !modes.some((mode) => Math.abs(mode.ar - fallbackAr) < 0.01)) {
    modes.unshift({ id: `digital_${String(fallbackAr).replace('.', '')}`, ar: fallbackAr, label: `${fallbackAr.toFixed(2)} · Native`, enabled: true, isBookingDependent: false, isFilmMode: false, projection: 'digital' });
  }
  return modes;
}

function toDocsVenue(record: JsonObject, preset: JsonObject): JsonObject {
  const resolved = resolveVenue(preset, record) as JsonObject;
  const projections = resolved.projections ?? [resolved.projection];
  const digitalProjection = projections.find((item: JsonObject) => item.mode === 'digital' || item.resolution_horizontal_px != null);
  const filmProjection = projections.find((item: JsonObject) => item.mode === 'film' || item.resolution_scan_equivalent_low != null);
  const activeProjection = digitalProjection ?? filmProjection ?? resolved.projection;
  const isDome = resolved.screen.geometry === 'hemispherical';
  const screenAr = isDome
    ? resolved.screen.aspect_ratio
    : (record.source_143190?.screen_aspect_ratio ?? resolved.screen.aspect_ratio);
  const docsFrontend = record.docs_frontend ?? {};
  const presentationModes = docsFrontend.presentationModes ?? generatedPresentationModes(resolved, filmProjection ? docsProjection(filmProjection) : null, docsFrontend.defaultPresentationAr);
  const defaultPresentationAr = docsFrontend.defaultPresentationAr ?? (isDome ? 1.43 : resolved.capabilities.supports_143_digital ? 1.43 : 1.90);
  const docsProj = docsProjection(activeProjection);
  const docsFilm = filmProjection ? docsProjection(filmProjection) : null;
  const sizeTier = screenSizeTier(resolved.screen);
  const geometryProfile = docsFrontend.geometryProfile ?? geometryProfileFor(record, resolved);
  const geometryDefaults = GEOMETRY_PROFILE_DEFAULTS[geometryProfile] ?? GEOMETRY_PROFILE_DEFAULTS.standard_conventional;
  const screenBottomFt = record.screen?.screen_bottom_height_ft ?? (
    geometryProfile === 'gt_pit'
      ? 0
      : geometryProfile === 'retrofit_no_pit' || geometryProfile === 'dolby_recliner'
        ? 4
        : resolved.screen.screen_bottom_height_ft
  );

  return {
    id: record.id,
    canonicalId: record.docs_canonical_id ?? record.id,
    kind: 'cinema',
    name: record.name,
    city: record.city,
    state: record.state_province ?? '',
    stateName: record.state_province === 'Format presets' ? 'Format presets' : stateName(record.state_province),
    isPreset: Boolean(docsFrontend.isPreset),
    dataSource: record.metadata?.data_source ?? null,
    sub: docsFrontend.sub ?? (
      isDome
        ? `${record.city} · Dome · ${projectorSummaryLabel(docsProj, docsFilm)}`
        : `${record.city} · ${fmtAr(screenAr)} · ${projectorSummaryLabel(docsProj, docsFilm)}`
    ),
    tag: docsFrontend.tag ?? (isDome ? 'IMAX Dome' : `IMAX ${fmtAr(screenAr)}`),
    blurb: docsFrontend.blurb ?? record.metadata?.notes ?? '',
    screen: {
      w: resolved.screen.width_ft,
      h: resolved.screen.height_ft,
      ar: screenAr,
      sizeTier: sizeTier?.tier ?? null,
      sizeLabel: sizeTier?.label ?? null,
      widthConfidence: resolved.screen.width_confidence ?? null,
      geometry: resolved.screen.geometry === 'slight_cylindrical_curve' ? 'slight_curve' : resolved.screen.geometry,
      curvatureRadiusFt: resolved.screen.curvature_radius_ft ?? null,
      screenBottomFt: screenBottomFt ?? null,
      domeCoveragePct: resolved.screen.dome_coverage_pct == null ? null : resolved.screen.dome_coverage_pct / 100,
      domeHFov: resolved.screen.dome_fov_horizontal_deg ?? null,
      domeVFov: resolved.screen.dome_fov_vertical_deg ?? null,
    },
    seat: {
      capacity: resolved.seating.capacity ?? null,
      front: resolved.seating.viewing_distance_front_ft,
      mid: resolved.seating.viewing_distance_mid_ft,
      back: resolved.seating.viewing_distance_back_ft,
      source: resolved.seating.viewing_distance_source,
      rakeDeg: record.seating?.rake_angle_deg ?? geometryDefaults.rake_angle_deg ?? resolved.seating.rake_angle_deg ?? null,
      rowSpacingFt: record.seating?.row_spacing_ft ?? geometryDefaults.row_spacing_ft ?? resolved.seating.row_spacing_ft ?? null,
      frontRowFloorElevationFt: record.seating?.front_row_floor_elevation_ft ?? geometryDefaults.front_row_floor_elevation_ft ?? resolved.seating.front_row_floor_elevation_ft ?? null,
      geometryProfile,
    },
    defaultPresentationAr,
    isHybrid: Boolean(digitalProjection && filmProjection),
    presentationModes,
    projection: docsProj,
    filmProjection: docsFilm,
    commercialFilms: Array.isArray(record.source_143190?.commercial_films)
      ? record.source_143190.commercial_films.some((v: string) => typeof v === 'string' && !/^n\/?a$|^none$|^no$/i.test(v.trim()))
      : Boolean(record.source_143190?.commercial_films),
    sources: docsFrontend.sources ? docsSources(record, activeProjection, docsFrontend.sources, geometryProfile) : (docsFrontend.sourcesFull ?? docsSources(record, activeProjection, undefined, geometryProfile)),
  };
}

function toDocsHome(record: JsonObject, preset: JsonObject): JsonObject {
  const resolved = resolveHomeDisplay(preset, record) as JsonObject;
  const docsFrontend = record.docs_frontend ?? {};
  const dims = diagonalToDimensions(resolved.screen_diagonal_in, resolved.aspect_ratio);
  return {
    id: record.id,
    canonicalId: record.id,
    kind: 'home',
    name: record.user_label,
    sub: docsFrontend.sub,
    tag: docsFrontend.tag,
    blurb: docsFrontend.blurb,
    screen: {
      w: dims.width / 12,
      h: dims.height / 12,
      ar: resolved.aspect_ratio,
      sizeTier: null,
      sizeLabel: null,
      widthConfidence: null,
      geometry: 'flat',
      curvatureRadiusFt: null,
      screenBottomFt: null,
    },
    seat: docsFrontend.seat ?? {
      front: Math.max(1, resolved.viewing_distance_ft - 2),
      mid: resolved.viewing_distance_ft,
      back: resolved.viewing_distance_ft + 3,
      source: 'typical_living_room',
    },
    defaultPresentationAr: docsFrontend.defaultPresentationAr ?? resolved.aspect_ratio,
    isHybrid: false,
    presentationModes: docsFrontend.presentationModes,
    projection: docsProjection(null, resolved.display_optics),
    filmProjection: null,
    sources: docsFrontend.sources,
  };
}

function contentFormatVm(item: JsonObject): JsonObject {
  const phrase: Record<string, string> = {
    imax_143: 'tallest',
    imax_digital_190: 'tall',
    scope_239: 'wide',
    tv_178: 'TV',
    flat_185: 'standard cinema',
  };
  return {
    id: item.id === 'imax_digital_190' ? 'imax_190' : item.id === 'panavision_220' ? 'pana_220' : item.id,
    ar: item.aspect_ratio,
    label: item.display_name.replace('IMAX Digital 1.90:1', '1.90 · IMAX Digital'),
    phrase: phrase[item.id] ?? '',
    note: item.example_films?.join(' / ') ?? item.description ?? '',
  };
}

function buildData() {
  const presets = listJson('src/data/presets').map((file) => readJson<JsonObject>(file));
  const presetById = new Map(presets.map((preset) => [preset.id, preset]));
  const homePresets = listJson('src/data/home_display_presets').map((file) => readJson<JsonObject>(file));
  const homePresetById = new Map(homePresets.map((preset) => [preset.id, preset]));
  const authoredVenues = listJson('src/data/venues').map((file) => readJson<JsonObject>(file));
  const authoredByKey = new Map<string, JsonObject>();
  for (const venue of authoredVenues) {
    const key = source143190Key(venue);
    if (key) authoredByKey.set(key, venue);
    const lfKey = sourceLFExaminerKey(venue);
    if (lfKey) authoredByKey.set(lfKey, venue);
  }

  const comparison = readJson<JsonObject>('src/data/frontend/comparison_records.json');
  const imaxRows = readJson<any[][]>('src/data/fixtures/imax_143190_us_rows.json');
  const promotedImaxRows = imaxRows.filter((row) => !GENERATED_143190_ROW_SUPPRESSIONS.has(rowKey(row)));
  const lfExaminerRows = readJson<LFExaminerImportRow[]>('src/data/fixtures/lfexaminer_us_imax_rows.json');
  const imaxRowKeys = new Set(imaxRows.map(docs143190RowMatchKey));
  const authored143190MatchRows = authoredVenues
    .map(source143190MatchRow)
    .filter((row): row is Source143190MatchRow => Boolean(row));
  const imaxMatchRows = [
    ...imaxRows.map(docs143190RowToMatchRow),
    ...authored143190MatchRows,
  ];
  const supplementalLFExaminerRows = lfExaminerRows
    .filter((row) => !imaxRowKeys.has(lfExaminerMatchKey(row)))
    .filter((row) => !lfExaminerHas143190Conflict(row, imaxMatchRows))
    .filter((row) => !LFEXAMINER_CURRENT_SOURCE_ALIAS_KEYS.has(lfExaminerMatchKey(row)))
    .filter(hasComparableScreen);
  const apple = authoredVenues.find((venue) => venue.id === 'apple_providence_imax');
  if (!apple) throw new Error('Missing apple_providence_imax canonical venue');
  const appleGeometryProfile = geometryProfileFor(apple);
  const appleScreenWidthFt = apple.screen?.width_ft ?? (apple.screen?.width_m != null ? metersToFeet(apple.screen.width_m) : null);
  const appleScreenHeightFt = apple.screen?.height_ft ?? (apple.screen?.height_m != null ? metersToFeet(apple.screen.height_m) : null);
  const appleDocs = {
    ...apple,
    seating: {
      ...apple.seating,
      ...(appleScreenWidthFt != null
        ? profileSeating(appleScreenWidthFt, appleGeometryProfile, appleScreenHeightFt)
        : {}),
    },
    docs_frontend: {
      canonicalId: 'apple_providence_imax',
      geometryProfile: appleGeometryProfile,
      sub: 'Providence, RI · 1.43 screen · CoLa digital + 15/70 Film',
      tag: 'IMAX 1.43',
      blurb: 'Physical 1.43:1 screen; daily projection is CoLa at 1.90 — loses ~25% of vertical frame on 1.43 content. 15/70 film installed for occasional booked engagements.',
      defaultPresentationAr: 1.90,
      sources: {
        screen: { q: 'r_imax_csv', note: '143190.xyz CSV (Apr 2026) — 24.7 × 18.6 m.' },
        brightness: { q: 'trade_reporting', note: 'IMAX calibration target 22 fL; per-venue fL not published.' },
        contrast: { q: 'trade_reporting', note: 'IMAX CTO Bonnick, CinemaCon 2018.' },
      },
    },
  };

  const cinemaExamples = comparison.cinema_examples.map(buildFrontendCinemaRecord);
  const generatedImaxVenues = promotedImaxRows.map((row) => buildGeneratedImaxVenue(row, authoredByKey));
  const generatedLFExaminerVenues = supplementalLFExaminerRows.map((row) => buildGeneratedLFExaminerVenue(row, authoredByKey));
  const homeRecords = comparison.home_displays.map(buildHomeRecord);

  const venues = [
    toDocsVenue(appleDocs, presetById.get(apple.preset_id)!),
    ...cinemaExamples.map((record: JsonObject) => toDocsVenue(record, presetById.get(record.preset_id)!)),
    ...generatedImaxVenues.map((record) => toDocsVenue(record, presetById.get(record.preset_id)!)),
    ...generatedLFExaminerVenues.map((record) => toDocsVenue(record, presetById.get(record.preset_id)!)),
    ...homeRecords.map((record: JsonObject) => toDocsHome(record, homePresetById.get(record.preset_id)!)),
  ];

  const contentFormats = readJson<JsonObject[]>('src/data/content_formats/content_formats.json')
    .filter((item) => ['imax_143', 'imax_digital_190', 'panavision_220', 'scope_239', 'tv_178', 'flat_185'].includes(item.id))
    .map(contentFormatVm);

  const qualityMeta = {
    published_official: { label: 'Official spec', tier: 1 },
    published_cto: { label: 'Official spec', tier: 1 },
    manufacturer_spec: { label: 'Official spec', tier: 1 },
    rtings_measurement: { label: 'Measured (RTINGS)', tier: 1 },
    r_imax_csv: { label: '143190.xyz', tier: 2 },
    lfexaminer: { label: 'LFExaminer 2021', tier: 3 },
    trade_reporting: { label: 'Trade reporting', tier: 2 },
    preset_typical: { label: 'Format avg.', tier: 3 },
    community_estimate: { label: 'Community estimate', tier: 3 },
    derived: { label: 'Derived estimate', tier: 3 },
    derived_from_screen_width: { label: 'Derived estimate', tier: 3 },
    typical_living_room: { label: 'Derived estimate', tier: 3 },
    frontend_comparison_record: { label: 'Format avg.', tier: 3 },
    unknown: { label: 'Unknown', tier: 3 },
  };

  const db = buildDb(venues);

  return { venues, contentFormats, qualityMeta, db };
}

const data = buildData();
// V2 (Vite app in web/) imports this JSON bundle at build time. The old
// window.LIEMAX_DATA docs/data.js + docs/workbench.js emissions retired with
// the prototype (see git tag prototype-final).
const bundleJson = JSON.stringify(data, null, 2) + '\n';

let stale = false;
stale = writeOrCheck('src/data/generated/docs_bundle.json', bundleJson) || stale;

if (checkOnly && stale) process.exit(1);
if (checkOnly) console.log('docs generated data is current.');
