import { map143190RowToVenue, type Imax143190ImportRow } from './imaxImport';

const CACHE_KEY = 'liemax_143190_csv';
const CACHE_TIMESTAMP_KEY = 'liemax_143190_csv_ts';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CSV_URL = '/api/imax-csv';
const SOURCE_URL = 'https://143190.xyz/database.html';

interface CsvFileConfig {
  filename: string;
  region: string;
  country: string;
  adminDivisionColumn: string | null;
}

const CSV_FILES: CsvFileConfig[] = [
  { filename: 'americas/aruba.csv', region: 'Americas', country: 'Aruba', adminDivisionColumn: 'Region' },
  { filename: 'americas/bahamas.csv', region: 'Americas', country: 'Bahamas', adminDivisionColumn: 'Region' },
  { filename: 'americas/brazil.csv', region: 'Americas', country: 'Brazil', adminDivisionColumn: 'State' },
  { filename: 'americas/canada.csv', region: 'Americas', country: 'Canada', adminDivisionColumn: 'Province' },
  { filename: 'americas/colombia.csv', region: 'Americas', country: 'Colombia', adminDivisionColumn: 'Region' },
  { filename: 'americas/curacao.csv', region: 'Americas', country: 'Curacao', adminDivisionColumn: 'Region' },
  { filename: 'americas/ecuador.csv', region: 'Americas', country: 'Ecuador', adminDivisionColumn: 'Region' },
  { filename: 'americas/mexico.csv', region: 'Americas', country: 'Mexico', adminDivisionColumn: 'State' },
  { filename: 'americas/peru.csv', region: 'Americas', country: 'Peru', adminDivisionColumn: 'Region' },
  { filename: 'americas/unitedstates.csv', region: 'Americas', country: 'United States', adminDivisionColumn: 'State' },
  { filename: 'asia/bahrain.csv', region: 'Asia', country: 'Bahrain', adminDivisionColumn: 'Region' },
  { filename: 'asia/china.csv', region: 'Asia', country: 'China', adminDivisionColumn: 'Province' },
  { filename: 'asia/hongkong.csv', region: 'Asia', country: 'Hong Kong', adminDivisionColumn: 'Region' },
  { filename: 'asia/india.csv', region: 'Asia', country: 'India', adminDivisionColumn: 'State' },
  { filename: 'asia/indonesia.csv', region: 'Asia', country: 'Indonesia', adminDivisionColumn: 'Province' },
  { filename: 'asia/japan.csv', region: 'Asia', country: 'Japan', adminDivisionColumn: 'Province' },
  { filename: 'asia/kuwait.csv', region: 'Asia', country: 'Kuwait', adminDivisionColumn: 'Region' },
  { filename: 'asia/malaysia.csv', region: 'Asia', country: 'Malaysia', adminDivisionColumn: 'State' },
  { filename: 'asia/oman.csv', region: 'Asia', country: 'Oman', adminDivisionColumn: 'Region' },
  { filename: 'asia/philippines.csv', region: 'Asia', country: 'Philippines', adminDivisionColumn: 'Region' },
  { filename: 'asia/qatar.csv', region: 'Asia', country: 'Qatar', adminDivisionColumn: 'Region' },
  { filename: 'asia/saudiarabia.csv', region: 'Asia', country: 'Saudi Arabia', adminDivisionColumn: 'Region' },
  { filename: 'asia/singapore.csv', region: 'Asia', country: 'Singapore', adminDivisionColumn: 'Region' },
  { filename: 'asia/southkorea.csv', region: 'Asia', country: 'South Korea', adminDivisionColumn: 'Province' },
  { filename: 'asia/taiwan.csv', region: 'Asia', country: 'Taiwan', adminDivisionColumn: 'Province' },
  { filename: 'asia/thailand.csv', region: 'Asia', country: 'Thailand', adminDivisionColumn: 'Region' },
  { filename: 'asia/unitedarabemirates.csv', region: 'Asia', country: 'United Arab Emirates', adminDivisionColumn: 'Province' },
  { filename: 'asia/vietnam.csv', region: 'Asia', country: 'Vietnam', adminDivisionColumn: 'Region' },
  { filename: 'europe/austria.csv', region: 'Europe', country: 'Austria', adminDivisionColumn: 'State' },
  { filename: 'europe/belgium.csv', region: 'Europe', country: 'Belgium', adminDivisionColumn: 'Region' },
  { filename: 'europe/czechia.csv', region: 'Europe', country: 'Czechia', adminDivisionColumn: 'Region' },
  { filename: 'europe/finland.csv', region: 'Europe', country: 'Finland', adminDivisionColumn: 'Region' },
  { filename: 'europe/france.csv', region: 'Europe', country: 'France', adminDivisionColumn: 'Region' },
  { filename: 'europe/germany.csv', region: 'Europe', country: 'Germany', adminDivisionColumn: null },
  { filename: 'europe/italy.csv', region: 'Europe', country: 'Italy', adminDivisionColumn: 'Region' },
  { filename: 'europe/latvia.csv', region: 'Europe', country: 'Latvia', adminDivisionColumn: 'Region' },
  { filename: 'europe/luxembourg.csv', region: 'Europe', country: 'Luxembourg', adminDivisionColumn: 'Region' },
  { filename: 'europe/netherlands.csv', region: 'Europe', country: 'Netherlands', adminDivisionColumn: 'Province' },
  { filename: 'europe/norway.csv', region: 'Europe', country: 'Norway', adminDivisionColumn: 'Region' },
  { filename: 'europe/poland.csv', region: 'Europe', country: 'Poland', adminDivisionColumn: 'Region' },
  { filename: 'europe/portugal.csv', region: 'Europe', country: 'Portugal', adminDivisionColumn: 'Region' },
  { filename: 'europe/serbia.csv', region: 'Europe', country: 'Serbia', adminDivisionColumn: 'Region' },
  { filename: 'europe/spain.csv', region: 'Europe', country: 'Spain', adminDivisionColumn: 'Region' },
  { filename: 'europe/sweden.csv', region: 'Europe', country: 'Sweden', adminDivisionColumn: 'Region' },
  { filename: 'europe/switzerland.csv', region: 'Europe', country: 'Switzerland', adminDivisionColumn: null },
  { filename: 'europe/ukraine.csv', region: 'Europe', country: 'Ukraine', adminDivisionColumn: 'Region' },
  { filename: 'europe/unitedkingdom.csv', region: 'Europe', country: 'United Kingdom', adminDivisionColumn: 'Country' },
  { filename: 'africa/morocco.csv', region: 'Africa', country: 'Morocco', adminDivisionColumn: 'Region' },
  { filename: 'africa/southafrica.csv', region: 'Africa', country: 'South Africa', adminDivisionColumn: 'Province' },
  { filename: 'oceania/australia.csv', region: 'Oceania', country: 'Australia', adminDivisionColumn: 'State' },
  { filename: 'oceania/newzealand.csv', region: 'Oceania', country: 'New Zealand', adminDivisionColumn: 'Region' },
];

const COMBINED_HEADER = [
  'Region',
  'Country/Area',
  'Province/State',
  'City',
  'Location Name',
  'Screen Aspect Ratio (AR)',
  'Digital Projector',
  'Maximum AR for digital projection',
  'Film Projector',
  'Height',
  'Width',
  'Commercial films shown?',
];

export interface CsvLoadResult {
  venues: Record<string, any>[];
  source: 'cache' | 'network' | 'failed';
  fetchedAt: number | null;
  error?: string;
}

type ColumnMap = Map<string, number>;
type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export async function load143190Venues(): Promise<CsvLoadResult> {
  const now = Date.now();
  const cachedCsv = readCache(CACHE_KEY);
  const cachedAt = readTimestamp();

  if (cachedCsv && cachedAt != null && now - cachedAt < CACHE_TTL_MS) {
    return {
      venues: parse143190Csv(cachedCsv),
      source: 'cache',
      fetchedAt: cachedAt,
    };
  }

  try {
    const csvText = await fetch143190CsvBundle();
    writeCache(csvText, now);

    return {
      venues: parse143190Csv(csvText),
      source: 'network',
      fetchedAt: now,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'CSV fetch failed';
    if (cachedCsv) {
      return {
        venues: parse143190Csv(cachedCsv),
        source: 'cache',
        fetchedAt: cachedAt,
        error: message,
      };
    }

    return {
      venues: [],
      source: 'failed',
      fetchedAt: null,
      error: message,
    };
  }
}

async function fetch143190CsvBundle(): Promise<string> {
  const rows: string[][] = [];
  const failed: string[] = [];

  for (const config of CSV_FILES) {
    try {
      const response = await fetch(`${CSV_URL}/${config.filename}`);
      if (!response.ok) {
        failed.push(`${config.filename} (${response.status})`);
        continue;
      }

      rows.push(...normalizeCsvRows(await response.text(), config));
    } catch {
      failed.push(config.filename);
    }
  }

  if (rows.length === 0) {
    throw new Error(`CSV fetch failed for all ${CSV_FILES.length} regional files`);
  }

  if (failed.length > 0) {
    console.warn(`LIEMAX skipped ${failed.length} 143190 CSV files`, failed);
  }

  return serializeDelimitedRows([COMBINED_HEADER, ...rows], '\t');
}

function normalizeCsvRows(csvText: string, config: CsvFileConfig): string[][] {
  const rows = parseDelimitedRows(csvText);
  const [header, ...body] = rows.filter((row) => row.some((cell) => cell.trim().length > 0));
  if (!header) return [];

  const columnMap = buildColumnMap(header);
  const normalized: string[][] = [];

  for (const cells of body) {
    const row = mapCellsToImportRow(cells, columnMap, config);
    if (!row) continue;
    normalized.push(importRowToCells(row));
  }

  return normalized;
}

function parse143190Csv(csvText: string): Record<string, any>[] {
  const rows = parseDelimitedRows(csvText);
  const [header, ...body] = rows.filter((row) => row.some((cell) => cell.trim().length > 0));
  if (!header) return [];

  const columnMap = buildColumnMap(header);
  const imported: Record<string, any>[] = [];
  const lastVerified = new Date().toISOString().slice(0, 10);

  for (const cells of body) {
    const row = mapCellsToImportRow(cells, columnMap);
    if (!row) continue;

    try {
      imported.push(map143190RowToVenue(row, { lastVerified, sourceUrl: SOURCE_URL }));
    } catch {
      // Sparse community rows should never break the whole app load.
    }
  }

  return imported;
}

function parseDelimitedRows(input: string): string[][] {
  const delimiter = detectDelimiter(input);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function detectDelimiter(input: string): ',' | '\t' {
  const firstLine = input.split(/\r|\n/, 1)[0] ?? '';
  const tabCount = (firstLine.match(/\t/g) ?? []).length;
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  return tabCount > commaCount ? '\t' : ',';
}

function buildColumnMap(header: string[]): ColumnMap {
  return new Map(header.map((name, index) => [normalizeColumn(name), index]));
}

function mapCellsToImportRow(
  cells: string[],
  columnMap: ColumnMap,
  config?: CsvFileConfig
): Imax143190ImportRow | null {
  const locationName = pickCell(cells, columnMap, ['Location Name', 'Theatre', 'Theater', 'Name']);
  if (!locationName) return null;

  const countryArea = pickCell(cells, columnMap, ['Country/Area', 'Country Area', 'Country']) ?? config?.country ?? null;
  const region = config?.region ?? pickCell(cells, columnMap, ['Region']);
  const configuredAdminDivision =
    config?.adminDivisionColumn === null
      ? null
      : config?.adminDivisionColumn
        ? pickCell(cells, columnMap, [config.adminDivisionColumn])
        : undefined;
  const provinceState =
    configuredAdminDivision ??
    pickCell(cells, columnMap, [
      'Administrative Division',
      'Province/State',
      'Province',
      'State',
      'District',
      'Prefecture',
      'Canton',
      'Emirate',
    ]) ?? (countryArea ? null : region);

  return {
    region,
    country_area: countryArea,
    province_state: provinceState,
    city: pickCell(cells, columnMap, ['City']),
    location_name: locationName,
    screen_aspect_ratio: pickCell(cells, columnMap, ['Screen Aspect Ratio (AR)', 'Screen Aspect Ratio', 'Aspect Ratio']),
    digital_projector: pickCell(cells, columnMap, ['Digital Projector']),
    max_digital_ar: pickCell(cells, columnMap, ['Maximum AR for digital projection', 'Max Digital AR']),
    film_projector: pickCell(cells, columnMap, ['Film Projector']),
    screen_height_m: pickCell(cells, columnMap, ['Height', 'Screen Height', 'screen_height_m']),
    screen_width_m: pickCell(cells, columnMap, ['Width', 'Screen Width', 'screen_width_m']),
    commercial_films: pickCell(cells, columnMap, ['Commercial films shown?', 'Commercial Films']),
    raw: Object.fromEntries(Array.from(columnMap.entries()).map(([key, index]) => [key, cells[index] ?? ''])),
  };
}

function importRowToCells(row: Imax143190ImportRow): string[] {
  return [
    row.region ?? '',
    row.country_area ?? '',
    row.province_state ?? '',
    row.city ?? '',
    row.location_name,
    stringifyCell(row.screen_aspect_ratio),
    row.digital_projector ?? '',
    stringifyCell(row.max_digital_ar),
    row.film_projector ?? '',
    stringifyCell(row.screen_height_m),
    stringifyCell(row.screen_width_m),
    Array.isArray(row.commercial_films) ? row.commercial_films.join('; ') : row.commercial_films ?? '',
  ];
}

function serializeDelimitedRows(rows: string[][], delimiter: '\t' | ','): string {
  return rows.map((row) => row.map((cell) => escapeDelimitedCell(cell, delimiter)).join(delimiter)).join('\n');
}

function escapeDelimitedCell(value: string, delimiter: '\t' | ','): string {
  if (!value.includes(delimiter) && !/["\r\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function stringifyCell(value: string | number | string[] | null | undefined): string {
  if (value == null) return '';
  if (Array.isArray(value)) return value.join('; ');
  return String(value);
}

function pickCell(cells: string[], columnMap: ColumnMap, names: string[]): string | null {
  for (const name of names) {
    const index = columnMap.get(normalizeColumn(name));
    if (index == null) continue;

    const value = cells[index]?.trim();
    if (value) return value;
  }

  return null;
}

function normalizeColumn(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function readCache(key: string): string | null {
  return getLocalStorage()?.getItem(key) ?? null;
}

function readTimestamp(): number | null {
  const raw = getLocalStorage()?.getItem(CACHE_TIMESTAMP_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function writeCache(csvText: string, fetchedAt: number): void {
  const storage = getLocalStorage();
  if (!storage) return;
  storage.setItem(CACHE_KEY, csvText);
  storage.setItem(CACHE_TIMESTAMP_KEY, String(fetchedAt));
}

function getLocalStorage(): StorageLike | null {
  try {
    const maybeGlobal = globalThis as typeof globalThis & { localStorage?: StorageLike };
    return maybeGlobal.localStorage ?? null;
  } catch {
    return null;
  }
}
