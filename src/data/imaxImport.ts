/**
 * 143190.xyz / r-imax import helpers.
 *
 * The import source is intentionally sparse. It gives us venue location,
 * screen dimensions/AR, projector labels, max digital AR, film projector,
 * and commercial-film notes. Everything else should come from presets,
 * derived math, or explicit research enrichment.
 */

export interface Imax143190ImportRow {
  region?: string | null;
  country_area?: string | null;
  province_state?: string | null;
  city?: string | null;
  location_name: string;
  screen_aspect_ratio?: string | number | null;
  digital_projector?: string | null;
  max_digital_ar?: string | number | null;
  film_projector?: string | null;
  screen_height_m?: string | number | null;
  screen_width_m?: string | number | null;
  commercial_films?: string[] | string | null;
  raw?: Record<string, unknown> | null;
}

export interface ImportOptions {
  lastVerified: string;
  sourceUrl?: string | null;
}

type ProjectionMode = 'digital' | 'film' | 'other';

interface ProjectionRecord {
  id: string;
  display_name: string;
  mode: ProjectionMode;
  availability: 'primary' | 'available' | 'occasional' | 'historical' | 'unknown';
  type: string;
  light_source: string;
  dual_projector: boolean;
  resolution_horizontal_px: number | null;
  resolution_vertical_px: number | null;
  resolution_scan_equivalent_low: number | null;
  resolution_scan_equivalent_high: number | null;
  brightness_fl: number | null;
  contrast_sequential: number | null;
  contrast_dynamic: number | null;
  hdr: string;
  anamorphic_stretch: boolean;
  min_content_ar_supported: number;
}

export function map143190RowToVenue(row: Imax143190ImportRow, options: ImportOptions): Record<string, unknown> {
  const screenAspectRatio = parseAspectRatio(row.screen_aspect_ratio);
  const maxDigitalAr = parseAspectRatio(row.max_digital_ar);
  const rawScreenWidthM = parseNumber(row.screen_width_m);
  const rawScreenHeightM = parseNumber(row.screen_height_m);
  const domeScreen = isDomeLabel(row.screen_aspect_ratio) || isDomeLabel(row.digital_projector) || isDomeLabel(row.film_projector);
  const domeDiameterM = domeScreen
    ? (rawScreenWidthM && rawScreenWidthM > 0 ? rawScreenWidthM : rawScreenHeightM && rawScreenHeightM > 0 ? rawScreenHeightM : null)
    : null;
  const screenWidthM = domeDiameterM ?? rawScreenWidthM;
  const screenHeightM = domeDiameterM ?? rawScreenHeightM;
  const commercialFilms = normalizeCommercialFilms(row.commercial_films);
  const digitalProjection = buildDigitalProjection(row.digital_projector, maxDigitalAr);
  const filmProjection = buildFilmProjection(row.film_projector);
  const projections = [digitalProjection, filmProjection].filter(Boolean) as ProjectionRecord[];
  const primaryProjection = digitalProjection ?? filmProjection;
  const supports1570Film = filmProjection?.type === 'imax_1570_film' || filmProjection?.type === 'imax_dome_film';
  const minContentArSupported = Math.min(
    ...projections.map((projection) => projection.min_content_ar_supported),
    digitalProjection ? digitalProjection.min_content_ar_supported : 1.90
  );

  const screen: Record<string, unknown> = {};
  if (screenWidthM != null) screen.width_m = screenWidthM;
  if (screenHeightM != null) screen.height_m = screenHeightM;
  if (domeScreen) {
    screen.aspect_ratio = 1.0;
    screen.geometry = 'hemispherical';
    screen.is_perforated = true;
    screen.dome_coverage_pct = 83;
    screen.dome_fov_horizontal_deg = 180;
    screen.dome_fov_vertical_deg = 125;
    screen.dome_fov_above_horizon_deg = 105;
    screen.dome_fov_below_horizon_deg = 20;
  } else if (screenAspectRatio != null) {
    screen.aspect_ratio = screenAspectRatio;
  }

  return {
    id: slugify([row.city, row.location_name].filter(Boolean).join(' ')),
    preset_id: inferPresetId(digitalProjection, filmProjection),
    name: row.location_name,
    chain: null,
    brand_label: 'IMAX',
    city: row.city ?? '',
    state_province: row.province_state ?? null,
    country: row.country_area ?? '',
    screen,
    ...(primaryProjection ? { projection: primaryProjection } : {}),
    ...(projections.length > 0 ? { projections } : {}),
    capabilities: {
      min_content_ar_supported: Number.isFinite(minContentArSupported) ? minContentArSupported : 1.90,
      supports_1570_film: supports1570Film,
      supports_143_digital: digitalProjection?.min_content_ar_supported === 1.43,
    },
    history: [],
    metadata: {
      data_source: 'r_imax_csv',
      source_url: options.sourceUrl ?? 'https://143190.xyz/',
      last_verified: options.lastVerified,
      confidence: screenWidthM != null && screenHeightM != null ? 'medium' : 'low',
      notes: commercialFilms.length > 0 ? `Commercial films: ${commercialFilms.join(', ')}` : null,
    },
    source_143190: {
      region: row.region ?? null,
      country_area: row.country_area ?? null,
      province_state: row.province_state ?? null,
      city: row.city ?? null,
      location_name: row.location_name,
      screen_aspect_ratio: screenAspectRatio,
      digital_projector: row.digital_projector ?? null,
      max_digital_ar: maxDigitalAr,
      film_projector: row.film_projector ?? null,
      screen_height_m: screenHeightM,
      screen_width_m: screenWidthM,
      commercial_films: commercialFilms,
      raw: row.raw ?? null,
    },
  };
}

export function parseAspectRatio(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const trimmed = value.trim();
  const ratioMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  if (ratioMatch) {
    return Number(ratioMatch[1]) / Number(ratioMatch[2]);
  }

  return parseNumber(trimmed);
}

function buildDigitalProjection(label: string | null | undefined, maxDigitalAr: number | null): ProjectionRecord | null {
  if (!hasValue(label)) return null;
  const type = inferDigitalProjectorType(label);
  const minContentAr = maxDigitalAr ?? 1.90;

  return {
    id: 'digital',
    display_name: label!.trim(),
    mode: 'digital',
    availability: 'primary',
    type,
    light_source: type === 'imax_dual_xenon' ? 'xenon' : type === 'imax_gt_dual_laser' ? 'dual_rgb_laser' : 'rgb_laser',
    dual_projector: type === 'imax_gt_dual_laser' || type === 'imax_dual_xenon',
    resolution_horizontal_px: type === 'imax_dual_xenon' ? 2048 : 4096,
    resolution_vertical_px: type === 'imax_dual_xenon' ? 1080 : 2160,
    resolution_scan_equivalent_low: null,
    resolution_scan_equivalent_high: null,
    brightness_fl: null,
    contrast_sequential: null,
    contrast_dynamic: null,
    hdr: 'none',
    anamorphic_stretch: type === 'imax_dome_laser',
    min_content_ar_supported: minContentAr,
  };
}

function buildFilmProjection(label: string | null | undefined): ProjectionRecord | null {
  if (!hasValue(label)) return null;
  const type = inferFilmProjectorType(label);

  return {
    id: type === 'imax_dome_film' ? 'film_dome' : 'film_1570',
    display_name: label!.trim(),
    mode: 'film',
    availability: 'occasional',
    type,
    light_source: 'xenon_film',
    dual_projector: false,
    resolution_horizontal_px: null,
    resolution_vertical_px: null,
    resolution_scan_equivalent_low: 8800,
    resolution_scan_equivalent_high: 11700,
    brightness_fl: null,
    contrast_sequential: null,
    contrast_dynamic: null,
    hdr: 'photochemical',
    anamorphic_stretch: false,
    min_content_ar_supported: 1.43,
  };
}

function inferDigitalProjectorType(label: string): string {
  if (/dome|omni/i.test(label) && /laser/i.test(label)) return 'imax_dome_laser';
  if (/gt|dual\s*laser/i.test(label)) return 'imax_gt_dual_laser';
  if (/xenon|digital/i.test(label) && !/laser/i.test(label)) return 'imax_dual_xenon';
  if (/xt/i.test(label)) return 'imax_laser_xt';
  if (/cola|commercial\s*laser|laser/i.test(label)) return 'imax_cola';
  return 'other';
}

function inferFilmProjectorType(label: string): string {
  if (/dome|omni/i.test(label)) return 'imax_dome_film';
  if (/15\s*\/?\s*70|1570|70mm/i.test(label)) return 'imax_1570_film';
  return 'other';
}

function inferPresetId(digitalProjection: ProjectionRecord | null, filmProjection: ProjectionRecord | null): string {
  if (digitalProjection?.type === 'imax_dome_laser') return 'imax_dome_laser';
  if (filmProjection?.type === 'imax_dome_film') return 'imax_dome_film';
  if (digitalProjection?.type === 'imax_gt_dual_laser') return 'imax_gt_dual_laser';
  if (digitalProjection?.type === 'imax_cola') return 'imax_cola';
  if (digitalProjection?.type === 'imax_dual_xenon') return 'imax_dual_xenon';
  if (filmProjection?.type === 'imax_1570_film') return 'imax_1570_film';
  return 'imax_cola';
}

function normalizeCommercialFilms(value: string[] | string | null | undefined): string[] {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return value.filter(hasValue).map((item) => item.trim());
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

function parseNumber(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(value.replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function hasValue(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !/^n\/?a$|^none$|^no$/i.test(value.trim());
}

function isDomeLabel(value: string | number | null | undefined): boolean {
  return typeof value === 'string' && /dome|omni/i.test(value);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
