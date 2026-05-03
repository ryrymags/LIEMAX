import { spawnSync } from 'child_process';
import * as fs from 'fs';

export interface LFExaminerImportRow {
  row_number: number | null;
  country: string;
  city: string;
  state: string | null;
  organization: string;
  projector_family: string | null;
  projector_brand: string | null;
  format: string;
  dimensionality: string | null;
  screen_shape: 'F' | 'D' | string | null;
  seats: number | null;
  screen_size: string | null;
  screen_height_m: number | null;
  screen_width_m: number | null;
  screen_height_ft: number | null;
  screen_width_ft: number | null;
  opened: string | null;
  theater_type: string | null;
  raw: Record<string, unknown> | null;
}

export interface LFExaminerImportOptions {
  lastVerified: string;
  sourceUrl?: string | null;
}

export interface Source143190MatchRow {
  province_state?: string | null;
  city?: string | null;
  location_name: string;
}

type ProjectionMode = 'digital' | 'film';

interface ProjectionRecord {
  id: string;
  display_name: string;
  mode: ProjectionMode;
  availability: 'primary' | 'occasional';
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
  supports_3d: boolean | null;
  anamorphic_stretch: boolean;
  min_content_ar_supported: number;
}

const LFEXAMINER_SOURCE_URL = 'https://lfexaminer.com/theaters/';

export const LFEXAMINER_CURRENT_SOURCE_ALIAS_KEYS = new Set([
  // Authored current 143190 row is "Providence Place Cinemas & IMAX";
  // LFExaminer's archival row includes the auditorium count.
  'ri|providence|providence place 16 and',
]);

export function extractLFExaminerWebarchiveHtml(webarchivePath: string): string {
  if (!fs.existsSync(webarchivePath)) {
    throw new Error(`LFExaminer webarchive not found: ${webarchivePath}`);
  }

  const result = spawnSync('plutil', [
    '-extract',
    'WebMainResource.WebResourceData',
    'raw',
    '-o',
    '-',
    webarchivePath,
  ], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(`Unable to extract LFExaminer webarchive HTML: ${result.stderr || result.error?.message || 'unknown error'}`);
  }

  return Buffer.from(result.stdout.trim(), 'base64').toString('utf8');
}

export function parseLFExaminerRowsFromHtml(html: string): LFExaminerImportRow[] {
  const rowMatches = html.matchAll(/<tr\b[^>]*class="[^"]*\brow-\d+\b[^"]*"[^>]*>([\s\S]*?)<\/tr>/g);
  const rows: LFExaminerImportRow[] = [];

  for (const rowMatch of rowMatches) {
    const cells = Array.from(rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/g), (cell) => htmlToText(cell[1]));
    if (cells.length !== 14 || cells[1] === 'Country' || !cells[1]) continue;
    const screenSize = cells[11] || null;
    const parsedSize = parseScreenSize(screenSize);

    rows.push({
      row_number: parseInteger(cells[0]),
      country: cells[1],
      city: cells[2],
      state: cells[3] || null,
      organization: cells[4],
      projector_family: cells[5] || null,
      projector_brand: cells[6] || null,
      format: cells[7],
      dimensionality: cells[8] || null,
      screen_shape: cells[9] || null,
      seats: parseInteger(cells[10]),
      screen_size: screenSize,
      screen_height_m: parsedSize.heightM,
      screen_width_m: parsedSize.widthM,
      screen_height_ft: parsedSize.heightFt,
      screen_width_ft: parsedSize.widthFt,
      opened: cells[12] || null,
      theater_type: cells[13] || null,
      raw: {
        row_number: cells[0],
        Country: cells[1],
        City: cells[2],
        State: cells[3],
        Organization: cells[4],
        Proj: cells[5],
        Projector: cells[6],
        Fmt: cells[7],
        '2D/3D': cells[8],
        'Flat/Dome': cells[9],
        Seats: cells[10],
        'Screen Size': cells[11],
        Opened: cells[12],
        Type: cells[13],
      },
    });
  }

  return rows;
}

export function filterLFExaminerImaxDigitalRows(rows: LFExaminerImportRow[]): LFExaminerImportRow[] {
  return rows.filter((row) =>
    row.country === 'USA' &&
    isImaxLabeled(row) &&
    hasDigitalXenonFormat(row.format)
  );
}

export function lfExaminerMatchKey(row: Pick<LFExaminerImportRow, 'state' | 'city' | 'organization'>): string {
  return [row.state ?? '', row.city, row.organization].map(normalizeMatchPart).join('|');
}

export function source143190MatchKey(row: { province_state?: string | null; city?: string | null; location_name: string }): string {
  return [row.province_state ?? '', row.city ?? '', row.location_name].map(normalizeMatchPart).join('|');
}

export function docs143190RowMatchKey(row: any[]): string {
  return [row[0] ?? '', row[1] ?? '', row[2] ?? ''].map(normalizeMatchPart).join('|');
}

export function docs143190RowToMatchRow(row: any[]): Source143190MatchRow {
  return {
    province_state: row[0] ?? null,
    city: row[1] ?? null,
    location_name: String(row[2] ?? ''),
  };
}

export function lfExaminerHas143190Conflict(row: LFExaminerImportRow, sourceRows: Source143190MatchRow[]): boolean {
  return sourceRows.some((sourceRow) => rowsLikelyReferenceSameVenue(row, sourceRow));
}

export function mapLFExaminerRowToVenue(row: LFExaminerImportRow, options: LFExaminerImportOptions): Record<string, unknown> {
  const isDome = row.screen_shape === 'D';
  const screenHeightM = row.screen_height_m;
  const screenWidthM = row.screen_width_m;
  const screen: Record<string, unknown> = {};

  if (screenWidthM != null) screen.width_m = screenWidthM;
  if (screenHeightM != null) screen.height_m = screenHeightM;
  if (screenWidthM != null && screenHeightM != null) screen.aspect_ratio = screenWidthM / screenHeightM;
  screen.width_confidence = screenWidthM != null ? 'community_estimate' : null;
  screen.geometry = isDome ? 'hemispherical' : 'flat';
  screen.is_perforated = true;
  if (isDome) {
    screen.aspect_ratio = 1.0;
    screen.dome_coverage_pct = 83;
    screen.dome_fov_horizontal_deg = 180;
    screen.dome_fov_vertical_deg = 125;
    screen.dome_fov_above_horizon_deg = 105;
    screen.dome_fov_below_horizon_deg = 20;
  }

  const digitalProjection = buildDigitalProjection(row);
  const filmProjection = has1570FilmFormat(row.format) ? buildFilmProjection(row) : null;
  const projections = [digitalProjection, filmProjection].filter(Boolean) as ProjectionRecord[];
  const supports1570Film = Boolean(filmProjection);

  return {
    id: slugify([row.city, row.organization].filter(Boolean).join(' ')),
    preset_id: 'imax_dual_xenon',
    name: row.organization,
    chain: inferChain(row.organization),
    brand_label: 'IMAX',
    city: row.city,
    state_province: row.state,
    country: 'United States',
    screen,
    projection: digitalProjection,
    projections,
    seating: {
      capacity: row.seats,
      rake_angle_deg: isDome ? 30 : null,
      seat_type: 'standard',
      has_bass_transducers: false,
      viewing_distance_front_ft: null,
      viewing_distance_mid_ft: null,
      viewing_distance_back_ft: null,
      viewing_distance_source: 'derived_from_screen_width',
      seat_offset_from_center_ft: 0,
    },
    capabilities: {
      min_content_ar_supported: supports1570Film ? 1.43 : 1.90,
      supports_1570_film: supports1570Film,
      supports_143_digital: false,
      has_screenx: false,
      has_4dx: false,
      has_dbox: false,
      infinity_vision_certified: null,
    },
    history: [],
    metadata: {
      data_source: 'lfexaminer',
      source_url: options.sourceUrl ?? LFEXAMINER_SOURCE_URL,
      sources: null,
      field_sources: null,
      last_verified: options.lastVerified,
      created_at: null,
      updated_at: null,
      confidence: 'low',
      notes: 'Archival LFExaminer row last updated in 2021; venue may have closed or changed projection since then.',
    },
    source_lfexaminer: {
      ...row,
      raw: row.raw ?? null,
    },
  };
}

function buildDigitalProjection(row: LFExaminerImportRow): ProjectionRecord {
  return {
    id: 'digital',
    display_name: 'IMAX Digital Xenon',
    mode: 'digital',
    availability: 'primary',
    type: 'imax_dual_xenon',
    light_source: 'xenon',
    dual_projector: true,
    resolution_horizontal_px: 2048,
    resolution_vertical_px: 1080,
    resolution_scan_equivalent_low: null,
    resolution_scan_equivalent_high: null,
    brightness_fl: null,
    contrast_sequential: null,
    contrast_dynamic: null,
    hdr: 'none',
    supports_3d: row.dimensionality === '3D',
    anamorphic_stretch: false,
    min_content_ar_supported: 1.90,
  };
}

function buildFilmProjection(row: LFExaminerImportRow): ProjectionRecord {
  return {
    id: 'film_1570',
    display_name: 'IMAX 15/70 Film',
    mode: 'film',
    availability: 'occasional',
    type: 'imax_1570_film',
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
    supports_3d: row.dimensionality === '3D',
    anamorphic_stretch: false,
    min_content_ar_supported: 1.43,
  };
}

function hasDigitalXenonFormat(format: string): boolean {
  return /(^|\+)D($|\+)/.test(format);
}

function has1570FilmFormat(format: string): boolean {
  return /(^|\+)1570($|\+)/.test(format);
}

function isImaxLabeled(row: LFExaminerImportRow): boolean {
  return row.projector_family === 'IMAX' || /\bIMAX\b/i.test(row.organization);
}

function parseScreenSize(value: string | null): {
  heightM: number | null;
  widthM: number | null;
  heightFt: number | null;
  widthFt: number | null;
} {
  if (!value) return { heightM: null, widthM: null, heightFt: null, widthFt: null };

  const metricPart = value.match(/\/\s*([^/]+?)\s*m\.?/i)?.[1] ?? null;
  const imperialPart = value.match(/^([^/]+?)\s*ft\.?/i)?.[1] ?? null;
  const metricNumbers = metricPart ? extractNumbers(metricPart) : [];
  const imperialNumbers = imperialPart ? extractNumbers(imperialPart) : [];

  const metric = dimensionsFromNumbers(metricNumbers);
  const imperial = dimensionsFromNumbers(imperialNumbers);

  return {
    heightM: metric.height ?? (imperial.height != null ? feetToMeters(imperial.height) : null),
    widthM: metric.width ?? (imperial.width != null ? feetToMeters(imperial.width) : null),
    heightFt: imperial.height ?? (metric.height != null ? metersToFeet(metric.height) : null),
    widthFt: imperial.width ?? (metric.width != null ? metersToFeet(metric.width) : null),
  };
}

function dimensionsFromNumbers(numbers: number[]): { height: number | null; width: number | null } {
  if (numbers.length === 1) return { height: numbers[0], width: numbers[0] };
  if (numbers.length >= 2) return { height: numbers[0], width: numbers[1] };
  return { height: null, width: null };
}

function extractNumbers(value: string): number[] {
  return Array.from(value.matchAll(/\d+(?:\.\d+)?/g), (match) => Number(match[0]))
    .filter((number) => Number.isFinite(number));
}

function parseInteger(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d-]/g, ''));
  return Number.isInteger(parsed) ? parsed : null;
}

function htmlToText(value: string): string {
  return value
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferChain(organization: string): string | null {
  const knownChains = ['AMC', 'Regal', 'Cinemark', 'CMX', 'Marcus', 'Malco', 'Harkins', 'Galaxy', 'B&B'];
  return knownChains.find((chain) => organization.toLowerCase().startsWith(chain.toLowerCase())) ?? null;
}

function normalizeMatchPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(and|theatre|theater|cinema|cinemas|stadium|imax|3d|digital)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function rowsLikelyReferenceSameVenue(lfRow: LFExaminerImportRow, sourceRow: Source143190MatchRow): boolean {
  if (normalizeMatchPart(lfRow.state ?? '') !== normalizeMatchPart(sourceRow.province_state ?? '')) return false;
  if (normalizeMatchPart(lfRow.city) !== normalizeMatchPart(sourceRow.city ?? '')) return false;
  if (lfExaminerMatchKey(lfRow) === source143190MatchKey(sourceRow)) return true;

  const lfTokens = organizationTokens(lfRow.organization, lfRow.city);
  const sourceTokens = organizationTokens(sourceRow.location_name, sourceRow.city ?? '');
  if (lfTokens.size === 0 || sourceTokens.size === 0) return false;

  const sharedTokens = [...lfTokens].filter((token) => sourceTokens.has(token));
  if (!sharedTokens.some((token) => isDistinctiveVenueToken(token))) return false;

  const shorterSize = Math.min(lfTokens.size, sourceTokens.size);
  const sharedRatio = sharedTokens.length / shorterSize;
  if (sharedTokens.length >= Math.min(3, shorterSize) && sharedRatio >= 0.75) return true;

  const sharedNumbers = sharedTokens.filter((token) => /^\d+$/.test(token));
  return sharedNumbers.length > 0 && sharedTokens.filter(isDistinctiveVenueToken).length >= 1 && sharedTokens.length >= 2;
}

function organizationTokens(organization: string, city: string): Set<string> {
  const cityTokens = new Set(normalizeMatchPart(city).split(' ').filter(Boolean).map(normalizeVenueToken));
  return new Set(
    normalizeMatchPart(organization)
      .split(' ')
      .filter(Boolean)
      .map(normalizeVenueToken)
      .filter((token) => !cityTokens.has(token))
  );
}

function normalizeVenueToken(token: string): string {
  if (/^\d+$/.test(token)) return token;
  return token.length > 4 && token.endsWith('s') ? token.slice(0, -1) : token;
}

function isDistinctiveVenueToken(token: string): boolean {
  return !/^\d+$/.test(token) && !GENERIC_ORGANIZATION_TOKENS.has(token);
}

const GENERIC_ORGANIZATION_TOKENS = new Set([
  'amc',
  'b',
  'cinemark',
  'carmike',
  'cmx',
  'cobb',
  'edward',
  'galaxy',
  'harkin',
  'loew',
  'malco',
  'marcu',
  'megaplex',
  'regal',
  'ua',
  'united',
  'artist',
  'movie',
  'multiplex',
  'place',
]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function feetToMeters(value: number): number {
  return Math.round(value * 0.3048 * 10) / 10;
}

function metersToFeet(value: number): number {
  return Math.round(value * 3.28084 * 10) / 10;
}
