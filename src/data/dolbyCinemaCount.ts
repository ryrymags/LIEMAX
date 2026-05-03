import * as fs from 'fs';
import * as path from 'path';

export const DOLBY_CINEMA_ENDPOINT = 'https://cinemafinder.dolby.com/mapBoundedCinemas';
export const DOLBY_CINEMA_HOME = 'https://cinemafinder.dolby.com/';

// This request body and header shape comes from the 2026-05-03 HAR capture of
// Dolby's cinema finder app. The public HTML is only a JS shell; the actual
// theater list is returned by this undocumented JSON endpoint.
export const DOLBY_CINEMA_REQUEST_BODY = {
  bottomLeft: {
    latitude: -73.52839948765174,
    longitude: -137.46093750000003,
  },
  upperRight: {
    latitude: 73.52839948765174,
    longitude: 137.81250000000003,
  },
  excludedCinema: null,
};

export const DOLBY_CINEMA_REQUEST_HEADERS: Record<string, string> = {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'Content-Type': 'application/json',
  Origin: DOLBY_CINEMA_HOME.slice(0, -1),
  Referer: DOLBY_CINEMA_HOME,
  'X-Requested-With': 'XMLHttpRequest',
};

const CONTIGUOUS_US_BOUNDS = {
  minLatitude: 24.396308,
  maxLatitude: 49.384358,
  minLongitude: -124.848974,
  maxLongitude: -66.885444,
};

const defaultSnapshotsPath = path.resolve(
  __dirname,
  '../..',
  'src/data/fixtures/dolby_cinema_us_snapshots.json',
);

type JsonObject = Record<string, unknown>;

export type DolbyCinemaRaw = {
  id: number | string;
  exhibitor?: string;
  site?: string;
  latitude: number;
  longitude: number;
};

export type DolbyCinemaUsTheater = {
  id: string;
  exhibitor: string | null;
  site: string | null;
  latitude: number;
  normalizedLongitude: number;
};

export type DolbyCinemaUsSnapshot = {
  checkedAt: string;
  sourceEndpoint: string;
  count: number;
  cinemaIds: string[];
  theaters: DolbyCinemaUsTheater[];
};

export type DolbyCinemaDiff = {
  previousCount: number;
  newCount: number;
  addedIds: string[];
  removedIds: string[];
  addedTheaters: DolbyCinemaUsTheater[];
  removedTheaters: DolbyCinemaUsTheater[];
  changed: boolean;
};

export type DolbyCinemaComparison =
  | { status: 'no_previous'; current: DolbyCinemaUsSnapshot }
  | { status: 'unchanged'; previous: DolbyCinemaUsSnapshot; current: DolbyCinemaUsSnapshot; diff: DolbyCinemaDiff }
  | { status: 'changed'; previous: DolbyCinemaUsSnapshot; current: DolbyCinemaUsSnapshot; diff: DolbyCinemaDiff };

export type DolbyCinemaCheckResult =
  | {
      ok: true;
      saved: boolean;
      dryRun: boolean;
      snapshot: DolbyCinemaUsSnapshot;
      comparison: DolbyCinemaComparison;
    }
  | {
      ok: false;
      saved: false;
      dryRun: boolean;
      error: string;
    };

type Logger = Pick<typeof console, 'log' | 'error'>;
type FetchHeadersLike = {
  get(name: string): string | null;
  getSetCookie?(): string[];
};
type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  headers?: FetchHeadersLike;
  text(): Promise<string>;
}>;

export function normalizeLongitude(longitude: number): number {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

export function isInContiguousUnitedStates(latitude: number, longitude: number): boolean {
  const normalizedLongitude = normalizeLongitude(longitude);
  // Initial Dolby count deliberately uses a coordinate-only contiguous-U.S.
  // bounding box. It excludes Alaska, Hawaii, Puerto Rico, and territories.
  return (
    latitude >= CONTIGUOUS_US_BOUNDS.minLatitude &&
    latitude <= CONTIGUOUS_US_BOUNDS.maxLatitude &&
    normalizedLongitude >= CONTIGUOUS_US_BOUNDS.minLongitude &&
    normalizedLongitude <= CONTIGUOUS_US_BOUNDS.maxLongitude
  );
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredNumber(item: JsonObject, key: string, index: number): number {
  const value = item[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Dolby cinema response item ${index} has invalid ${key}`);
  }
  return value;
}

function requiredId(item: JsonObject, index: number): string {
  const value = item.id;
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') {
    throw new Error(`Dolby cinema response item ${index} has invalid id`);
  }
  return String(value);
}

function optionalString(item: JsonObject, key: string): string | null {
  const value = item[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

export function parseDolbyCinemaResponse(value: unknown): DolbyCinemaRaw[] {
  if (!Array.isArray(value)) {
    throw new Error('Dolby cinema response was not a JSON array');
  }

  return value.map((item, index) => {
    if (!isObject(item)) {
      throw new Error(`Dolby cinema response item ${index} was not an object`);
    }
    return {
      id: requiredId(item, index),
      exhibitor: optionalString(item, 'exhibitor') ?? undefined,
      site: optionalString(item, 'site') ?? undefined,
      latitude: requiredNumber(item, 'latitude', index),
      longitude: requiredNumber(item, 'longitude', index),
    };
  });
}

export function buildDolbyCinemaUsSnapshot(rawCinemas: DolbyCinemaRaw[], checkedAt: string): DolbyCinemaUsSnapshot {
  const theatersById = new Map<string, DolbyCinemaUsTheater>();

  for (const cinema of rawCinemas) {
    if (!isInContiguousUnitedStates(cinema.latitude, cinema.longitude)) continue;
    const id = String(cinema.id);
    theatersById.set(id, {
      id,
      exhibitor: cinema.exhibitor ?? null,
      site: cinema.site ?? null,
      latitude: cinema.latitude,
      normalizedLongitude: normalizeLongitude(cinema.longitude),
    });
  }

  const theaters = Array.from(theatersById.values()).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return {
    checkedAt,
    sourceEndpoint: DOLBY_CINEMA_ENDPOINT,
    count: theaters.length,
    cinemaIds: theaters.map((theater) => theater.id),
    theaters,
  };
}

export function diffDolbyCinemaSnapshots(
  previous: DolbyCinemaUsSnapshot,
  current: DolbyCinemaUsSnapshot,
): DolbyCinemaDiff {
  const previousIds = new Set(previous.cinemaIds);
  const currentIds = new Set(current.cinemaIds);
  const previousById = new Map(previous.theaters.map((theater) => [theater.id, theater]));
  const currentById = new Map(current.theaters.map((theater) => [theater.id, theater]));
  const addedIds = current.cinemaIds.filter((id) => !previousIds.has(id));
  const removedIds = previous.cinemaIds.filter((id) => !currentIds.has(id));

  return {
    previousCount: previous.count,
    newCount: current.count,
    addedIds,
    removedIds,
    addedTheaters: addedIds.map((id) => currentById.get(id)).filter((item): item is DolbyCinemaUsTheater => Boolean(item)),
    removedTheaters: removedIds.map((id) => previousById.get(id)).filter((item): item is DolbyCinemaUsTheater => Boolean(item)),
    changed: previous.count !== current.count || addedIds.length > 0 || removedIds.length > 0,
  };
}

export function compareDolbyCinemaSnapshots(
  previous: DolbyCinemaUsSnapshot | null,
  current: DolbyCinemaUsSnapshot,
): DolbyCinemaComparison {
  if (!previous) return { status: 'no_previous', current };
  const diff = diffDolbyCinemaSnapshots(previous, current);
  return {
    status: diff.changed ? 'changed' : 'unchanged',
    previous,
    current,
    diff,
  };
}

export function readDolbyCinemaSnapshots(snapshotsPath = defaultSnapshotsPath): DolbyCinemaUsSnapshot[] {
  if (!fs.existsSync(snapshotsPath)) return [];
  const parsed = JSON.parse(fs.readFileSync(snapshotsPath, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error(`${snapshotsPath} must contain a JSON array`);
  }
  return parsed as DolbyCinemaUsSnapshot[];
}

export function mostRecentDolbyCinemaSnapshot(snapshots: DolbyCinemaUsSnapshot[]): DolbyCinemaUsSnapshot | null {
  const sorted = snapshots.slice().sort((a, b) => a.checkedAt.localeCompare(b.checkedAt));
  return sorted.length > 0 ? sorted[sorted.length - 1] : null;
}

export function writeDolbyCinemaSnapshots(
  snapshots: DolbyCinemaUsSnapshot[],
  snapshotsPath = defaultSnapshotsPath,
): void {
  fs.mkdirSync(path.dirname(snapshotsPath), { recursive: true });
  fs.writeFileSync(snapshotsPath, `${JSON.stringify(snapshots, null, 2)}\n`);
}

export function formatTheaterList(theaters: DolbyCinemaUsTheater[]): string {
  if (theaters.length === 0) return 'none';
  return theaters
    .map((theater) => `${theater.id}${theater.site ? ` (${theater.exhibitor ? `${theater.exhibitor} ` : ''}${theater.site})` : ''}`)
    .join(', ');
}

export function logDolbyCinemaComparison(comparison: DolbyCinemaComparison, logger: Logger = console): void {
  if (comparison.status === 'no_previous') {
    logger.log(`[dolby-cinema] Baseline saved: ${comparison.current.count} contiguous U.S. Dolby Cinema theaters.`);
    return;
  }

  if (comparison.status === 'unchanged') {
    logger.log(`[dolby-cinema] No count or ID changes: ${comparison.current.count} contiguous U.S. Dolby Cinema theaters.`);
    return;
  }

  logger.log('[dolby-cinema] Dolby Cinema U.S. theater set changed.');
  logger.log(`[dolby-cinema] Previous count: ${comparison.diff.previousCount}`);
  logger.log(`[dolby-cinema] New count: ${comparison.diff.newCount}`);
  logger.log(`[dolby-cinema] Added IDs: ${comparison.diff.addedIds.length ? comparison.diff.addedIds.join(', ') : 'none'}`);
  logger.log(`[dolby-cinema] Removed IDs: ${comparison.diff.removedIds.length ? comparison.diff.removedIds.join(', ') : 'none'}`);
  logger.log(`[dolby-cinema] Added theaters: ${formatTheaterList(comparison.diff.addedTheaters)}`);
  logger.log(`[dolby-cinema] Removed theaters: ${formatTheaterList(comparison.diff.removedTheaters)}`);
}

function splitSetCookieHeader(value: string | null): string[] {
  if (!value) return [];
  return value.split(/,\s*(?=[^=;, ]+=)/).map((item) => item.trim()).filter(Boolean);
}

function setCookieHeaders(headers: FetchHeadersLike | undefined): string[] {
  if (!headers) return [];
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  return splitSetCookieHeader(headers.get('set-cookie'));
}

function cookiePair(setCookie: string): string {
  return setCookie.split(';')[0].trim();
}

function xsrfTokenFromCookies(cookiePairs: string[]): string | null {
  const pair = cookiePairs.find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  return pair ? pair.slice('XSRF-TOKEN='.length) : null;
}

async function fetchDolbySession(fetchImpl: FetchLike): Promise<{ cookie: string; xsrfToken: string }> {
  // The endpoint rejects direct POSTs without a fresh XSRF cookie. This GET is
  // only a session bootstrap; theater data still comes exclusively from JSON.
  const response = await fetchImpl(DOLBY_CINEMA_HOME, {
    method: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      Referer: DOLBY_CINEMA_HOME,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Dolby finder session bootstrap returned HTTP ${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
  }

  const cookiePairs = setCookieHeaders(response.headers).map(cookiePair).filter(Boolean);
  const xsrfToken = xsrfTokenFromCookies(cookiePairs);
  if (!xsrfToken) {
    throw new Error('Dolby finder session bootstrap did not return an XSRF-TOKEN cookie');
  }

  return {
    cookie: cookiePairs.join('; '),
    xsrfToken,
  };
}

export async function fetchDolbyCinemaData(fetchImpl: FetchLike = fetch): Promise<DolbyCinemaRaw[]> {
  const session = await fetchDolbySession(fetchImpl);
  const response = await fetchImpl(DOLBY_CINEMA_ENDPOINT, {
    method: 'POST',
    headers: {
      ...DOLBY_CINEMA_REQUEST_HEADERS,
      Cookie: session.cookie,
      'X-XSRF-TOKEN': session.xsrfToken,
    },
    body: JSON.stringify(DOLBY_CINEMA_REQUEST_BODY),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Dolby endpoint returned HTTP ${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`Dolby endpoint returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  return parseDolbyCinemaResponse(parsed);
}

export async function runDolbyCinemaCountCheck(options: {
  dryRun?: boolean;
  snapshotsPath?: string;
  now?: Date;
  fetchImpl?: FetchLike;
  logger?: Logger;
} = {}): Promise<DolbyCinemaCheckResult> {
  const dryRun = options.dryRun ?? false;
  const snapshotsPath = options.snapshotsPath ?? defaultSnapshotsPath;
  const logger = options.logger ?? console;

  let existingSnapshots: DolbyCinemaUsSnapshot[];
  try {
    existingSnapshots = readDolbyCinemaSnapshots(snapshotsPath);
  } catch (error) {
    return {
      ok: false,
      saved: false,
      dryRun,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  try {
    const rawCinemas = await fetchDolbyCinemaData(options.fetchImpl);
    const snapshot = buildDolbyCinemaUsSnapshot(rawCinemas, (options.now ?? new Date()).toISOString());
    const comparison = compareDolbyCinemaSnapshots(mostRecentDolbyCinemaSnapshot(existingSnapshots), snapshot);
    logDolbyCinemaComparison(comparison, logger);

    if (dryRun) {
      logger.log('[dolby-cinema] Dry run: snapshot not written.');
    } else {
      writeDolbyCinemaSnapshots([...existingSnapshots, snapshot], snapshotsPath);
      logger.log(`[dolby-cinema] Snapshot written to ${path.relative(process.cwd(), snapshotsPath)}.`);
    }

    return {
      ok: true,
      saved: !dryRun,
      dryRun,
      snapshot,
      comparison,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[dolby-cinema] Check failed; no successful snapshot was written. ${message}`);
    return {
      ok: false,
      saved: false,
      dryRun,
      error: message,
    };
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const result = await runDolbyCinemaCountCheck({ dryRun });
  if (!result.ok) process.exit(1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
