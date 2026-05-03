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
  type LFExaminerImportRow,
} from '../data/lfexaminerImport';
import {
  DOLBY_CINEMA_ENDPOINT,
  mostRecentDolbyCinemaSnapshot,
  readDolbyCinemaSnapshots,
} from '../data/dolbyCinemaCount';
import { browserWorkbenchSource } from './workbenchRuntime';

type JsonObject = Record<string, any>;

const root = path.resolve(__dirname, '../..');
const checkOnly = process.argv.includes('--check');

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

function sourceLFExaminerKey(value: JsonObject): string | null {
  const source = value.source_lfexaminer;
  if (!source) return null;
  return lfExaminerMatchKey(source as LFExaminerImportRow);
}

const IMAX_LITE_PROJECTOR_TYPES = new Set(['imax_cola', 'imax_laser_xt']);
const LIEMAX_PROJECTOR_TYPES = new Set(['imax_dual_xenon']);
const DOME_PROJECTOR_TYPES = new Set(['imax_dome_laser', 'imax_dome_film']);

function isRealCinemaVenue(venue: JsonObject): boolean {
  return venue.kind === 'cinema' && !venue.isPreset;
}

function isFullFlat143Digital(venue: JsonObject): boolean {
  return venue.screen?.geometry !== 'hemispherical' &&
    venue.projection?.type === 'imax_gt_dual_laser' &&
    venue.projection?.min_ar != null &&
    venue.projection.min_ar <= 1.43 &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

function isFilmConditional143(venue: JsonObject): boolean {
  return Boolean(venue.filmProjection) &&
    venue.screen?.geometry !== 'hemispherical' &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

function isDomeVenue(venue: JsonObject): boolean {
  return venue.screen?.geometry === 'hemispherical' ||
    DOME_PROJECTOR_TYPES.has(venue.projection?.type);
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function buildDb(venues: JsonObject[]): JsonObject {
  const latestDolbySnapshot = mostRecentDolbyCinemaSnapshot(readDolbyCinemaSnapshots());
  const cinemaVenues = venues.filter(isRealCinemaVenue);
  const imaxLiteCount = cinemaVenues.filter((venue) => IMAX_LITE_PROJECTOR_TYPES.has(venue.projection?.type)).length;
  const liemaxVenues = cinemaVenues.filter((venue) => LIEMAX_PROJECTOR_TYPES.has(venue.projection?.type));
  const liemaxCount = liemaxVenues.length;
  const liemaxLfExaminerCount = liemaxVenues.filter((venue) => venue.sources?.screen?.q === 'lfexaminer').length;
  const liemaxCurrentSourceCount = liemaxCount - liemaxLfExaminerCount;
  const notFull143DigitalCount = imaxLiteCount + liemaxCount;

  return {
    total_us_imax: cinemaVenues.length,
    imax_lite_count: imaxLiteCount,
    liemax_count: liemaxCount,
    liemax_pct: pct(liemaxCount, cinemaVenues.length),
    liemax_lfexaminer_count: liemaxLfExaminerCount,
    liemax_lfexaminer_pct: pct(liemaxLfExaminerCount, cinemaVenues.length),
    liemax_current_source_count: liemaxCurrentSourceCount,
    not_full_143_digital_count: notFull143DigitalCount,
    not_full_143_digital_pct: pct(notFull143DigitalCount, cinemaVenues.length),
    gt_laser_count: cinemaVenues.filter(isFullFlat143Digital).length,
    film_conditional_count: cinemaVenues.filter(isFilmConditional143).length,
    dome_count: cinemaVenues.filter(isDomeVenue).length,
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

function screenFromDocs(screen: JsonObject): JsonObject {
  return {
    width_m: feetToMeters(screen.w),
    height_m: feetToMeters(screen.h),
    width_ft: screen.w,
    height_ft: screen.h,
    width_confidence: 'community_estimate',
    aspect_ratio: screen.ar,
    geometry: screen.geometry === 'slight_curve' ? 'slight_cylindrical_curve' : screen.geometry,
    curvature_radius_ft: null,
    screen_bottom_height_ft: screen.geometry === 'hemispherical' ? null : 5.0,
    is_perforated: true,
    dome_coverage_pct: screen.domeCoveragePct == null ? null : screen.domeCoveragePct * 100,
    dome_fov_horizontal_deg: screen.domeHFov ?? null,
    dome_fov_vertical_deg: screen.domeVFov ?? null,
    dome_fov_above_horizon_deg: screen.domeHFov ? 105 : null,
    dome_fov_below_horizon_deg: screen.domeHFov ? 20 : null,
  };
}

function seatingFromDocs(seat: JsonObject): JsonObject {
  return {
    capacity: null,
    rake_angle_deg: null,
    seat_type: 'standard',
    has_bass_transducers: false,
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
    screen: screenFromDocs(item.screen),
    projection: null,
    projections: null,
    sound: null,
    seating: seatingFromDocs(item.seat),
    capabilities: null,
    history: [],
    metadata: completeMetadata('frontend_comparison_record', 'medium', item.blurb),
    docs_frontend: item,
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

const generatedVenueOverrides: Record<string, JsonObject> = {
  'MA|Reading|Sunbrella IMAX 3D Theater Reading': {
    blurb: 'Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances use a venue-specific GT estimate because the sparse CSV does not include row depth.',
    seating: {
      viewing_distance_front_ft: 40,
      viewing_distance_mid_ft: 75,
      viewing_distance_back_ft: 84,
      viewing_distance_source: 'community_estimate',
    },
    sources: {
      seat: {
        q: 'community_estimate',
        note: 'Commercial GT estimate constrained by GSCA-style large-format geometry: back rows are roughly within one screen width; mid-row modeled at ~75 ft, not the generic 1.5× screen-width fallback.',
      },
    },
  },
};

function buildGeneratedImaxVenue(row: any[], authoredByKey: Map<string, JsonObject>): JsonObject {
  const record = map143190RowToVenue(rowToImportObject(row), {
    lastVerified: '2026-05-02',
    sourceUrl: 'https://143190.xyz/',
  }) as JsonObject;
  const docsId = `imax_us_${String(row[0]).toLowerCase()}_${slugify(`${row[1]}_${row[2]}`)}`;
  const screenWidthM = record.screen?.width_m;
  const screenWidthFt = screenWidthM != null ? metersToFeet(screenWidthM) : null;
  const isDome = record.screen?.geometry === 'hemispherical';
  const key = rowKey(row);
  const authored = authoredByKey.get(key);
  const override = generatedVenueOverrides[key];

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
    blurb: override?.blurb ?? (
      isDome
        ? 'Imported from 143190.xyz U.S. IMAX data. Dome diameter is sourced from the CSV; dome FOV uses LIEMAX research defaults.'
        : 'Imported from 143190.xyz U.S. IMAX data. Screen dimensions are published; seat distances are derived from screen width.'
    ),
  };

  if (screenWidthFt != null) {
    const seating = isDome
      ? {
          viewing_distance_front_ft: screenWidthFt / 2,
          viewing_distance_mid_ft: screenWidthFt / 2,
          viewing_distance_back_ft: screenWidthFt / 2,
          viewing_distance_source: 'community_estimate',
        }
      : {
          viewing_distance_front_ft: screenWidthFt * 0.87,
          viewing_distance_mid_ft: screenWidthFt * 1.5,
          viewing_distance_back_ft: screenWidthFt * 2.25,
          viewing_distance_source: 'derived_from_screen_width',
        };
    record.seating = {
      capacity: null,
      rake_angle_deg: isDome ? 30 : null,
      seat_type: 'standard',
      has_bass_transducers: false,
      ...seating,
      ...(override?.seating ?? {}),
      seat_offset_from_center_ft: 0,
    };
  }

  if (override?.sources) {
    record.docs_frontend.sources = override.sources;
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

  record.id = docsId;
  record.name = row.organization;
  record.city = row.city;
  record.state_province = row.state;
  record.country = 'United States';
  record.docs_canonical_id = authored?.id ?? docsId;
  record.docs_frontend = {
    canonicalId: authored?.id ?? docsId,
    sub: `${row.city} · ${isDome ? 'Dome · ' : ''}LFExaminer 2021 · IMAX Digital Xenon`,
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
          : 'Front/mid/back derived from LFExaminer screen width using 0.87×, 1.5×, and 2.25× multipliers.',
      },
    },
  };

  if (screenWidthFt != null) {
    const seating = isDome
      ? {
          viewing_distance_front_ft: screenWidthFt / 2,
          viewing_distance_mid_ft: screenWidthFt / 2,
          viewing_distance_back_ft: screenWidthFt / 2,
          viewing_distance_source: 'community_estimate',
        }
      : {
          viewing_distance_front_ft: screenWidthFt * 0.87,
          viewing_distance_mid_ft: screenWidthFt * 1.5,
          viewing_distance_back_ft: screenWidthFt * 2.25,
          viewing_distance_source: 'derived_from_screen_width',
        };
    record.seating = {
      ...record.seating,
      ...seating,
      capacity: row.seats,
      seat_offset_from_center_ft: 0,
    };
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

function docsSources(record: JsonObject, resolvedProjection: JsonObject, maskSources?: JsonObject): JsonObject {
  const generic = resolvedProjection.type === 'other';
  const isDome = record.screen?.geometry === 'hemispherical';
  const isLFExaminer = record.metadata?.data_source === 'lfexaminer';
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
      note: isDome
        ? 'Dome comparisons use fixed 180° × 125° FOV; radius-style seat distances are placeholders for non-FOV metrics.'
        : 'Front/mid/back derived from screen width using 0.87×, 1.5×, and 2.25× multipliers.',
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

  return {
    id: record.id,
    canonicalId: record.docs_canonical_id ?? record.id,
    kind: 'cinema',
    name: record.name,
    city: record.city,
    state: record.state_province ?? '',
    stateName: record.state_province === 'Format presets' ? 'Format presets' : stateName(record.state_province),
    isPreset: Boolean(docsFrontend.isPreset),
    sub: docsFrontend.sub ?? (isDome ? `${record.city} · Dome · ${docsProj.label}` : `${record.city} · ${fmtAr(screenAr)} · ${docsProj.label}`),
    tag: docsFrontend.tag ?? (isDome ? 'IMAX Dome' : `IMAX ${fmtAr(screenAr)}`),
    blurb: docsFrontend.blurb ?? record.metadata?.notes ?? '',
    screen: {
      w: resolved.screen.width_ft,
      h: resolved.screen.height_ft,
      ar: screenAr,
      widthConfidence: resolved.screen.width_confidence ?? null,
      geometry: resolved.screen.geometry === 'slight_cylindrical_curve' ? 'slight_curve' : resolved.screen.geometry,
      domeCoveragePct: resolved.screen.dome_coverage_pct == null ? null : resolved.screen.dome_coverage_pct / 100,
      domeHFov: resolved.screen.dome_fov_horizontal_deg ?? null,
      domeVFov: resolved.screen.dome_fov_vertical_deg ?? null,
    },
    seat: {
      front: resolved.seating.viewing_distance_front_ft,
      mid: resolved.seating.viewing_distance_mid_ft,
      back: resolved.seating.viewing_distance_back_ft,
      source: resolved.seating.viewing_distance_source,
    },
    defaultPresentationAr,
    isHybrid: Boolean(digitalProjection && filmProjection),
    presentationModes,
    projection: docsProj,
    filmProjection: docsFilm,
    commercialFilms: Array.isArray(record.source_143190?.commercial_films)
      ? record.source_143190.commercial_films.length > 0
      : Boolean(record.source_143190?.commercial_films),
    sources: docsFrontend.sources ? docsSources(record, activeProjection, docsFrontend.sources) : (docsFrontend.sourcesFull ?? docsSources(record, activeProjection)),
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
      widthConfidence: null,
      geometry: 'flat',
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
  const lfExaminerRows = readJson<LFExaminerImportRow[]>('src/data/fixtures/lfexaminer_us_imax_rows.json');
  const imaxRowKeys = new Set(imaxRows.map(docs143190RowMatchKey));
  const imaxMatchRows = imaxRows.map(docs143190RowToMatchRow);
  const supplementalLFExaminerRows = lfExaminerRows
    .filter((row) => !imaxRowKeys.has(lfExaminerMatchKey(row)))
    .filter((row) => !lfExaminerHas143190Conflict(row, imaxMatchRows))
    .filter((row) => !LFEXAMINER_CURRENT_SOURCE_ALIAS_KEYS.has(lfExaminerMatchKey(row)))
    .filter(hasComparableScreen);
  const apple = authoredVenues.find((venue) => venue.id === 'apple_providence_imax');
  if (!apple) throw new Error('Missing apple_providence_imax canonical venue');
  const appleDocs = {
    ...apple,
    seating: {
      ...apple.seating,
      viewing_distance_front_ft: 40,
      viewing_distance_mid_ft: 67,
      viewing_distance_back_ft: 95,
      viewing_distance_source: 'derived_from_screen_width',
    },
    docs_frontend: {
      canonicalId: 'apple_providence_imax',
      sub: 'Providence, RI · 1.43 screen · CoLa digital',
      tag: 'IMAX 1.43',
      blurb: 'Physical 1.43:1 screen; daily projection is CoLa at 1.90 — loses ~25% of vertical frame on 1.43 content. 15/70 film installed for occasional booked engagements.',
      defaultPresentationAr: 1.90,
      sources: {
        screen: { q: 'r_imax_csv', note: '143190.xyz CSV (Apr 2026) — 24.7 × 17.3 m.' },
        brightness: { q: 'trade_reporting', note: 'IMAX calibration target 22 fL; per-venue fL not published.' },
        contrast: { q: 'trade_reporting', note: 'IMAX CTO Bonnick, CinemaCon 2018.' },
        seat: { q: 'derived', note: 'Front/mid/back derived from screen width — no published row distances.' },
      },
    },
  };

  const cinemaExamples = comparison.cinema_examples.map(buildFrontendCinemaRecord);
  const generatedImaxVenues = imaxRows.map((row) => buildGeneratedImaxVenue(row, authoredByKey));
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
const dataSource = `// GENERATED FILE. Run npm run build:docs-data.\n// Source: canonical src/data JSON resolved through src/math/resolver.\nwindow.LIEMAX_DATA = ${JSON.stringify(data, null, 2)};\n`;

let stale = false;
stale = writeOrCheck('docs/data.js', dataSource) || stale;
stale = writeOrCheck('docs/workbench.js', browserWorkbenchSource) || stale;

if (checkOnly && stale) process.exit(1);
if (checkOnly) console.log('docs generated data is current.');
