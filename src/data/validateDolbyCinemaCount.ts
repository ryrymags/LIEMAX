import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  buildDolbyCinemaUsSnapshot,
  compareDolbyCinemaSnapshots,
  diffDolbyCinemaSnapshots,
  isInContiguousUnitedStates,
  normalizeLongitude,
  readDolbyCinemaSnapshots,
  runDolbyCinemaCountCheck,
  type DolbyCinemaRaw,
  type DolbyCinemaUsSnapshot,
} from './dolbyCinemaCount';

let passed = 0;
let failed = 0;

function assert(label: string, condition: boolean): void {
  if (condition) {
    console.log(`  PASS ${label}`);
    passed++;
  } else {
    console.log(`  FAIL ${label}`);
    failed++;
  }
}

function assertEqual<T>(label: string, actual: T, expected: T): void {
  assert(`${label}: ${String(actual)} === ${String(expected)}`, actual === expected);
}

function rounded(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function cinema(id: string, latitude: number, longitude: number, site = `Theater ${id}`): DolbyCinemaRaw {
  return {
    id,
    exhibitor: 'AMC',
    site,
    latitude,
    longitude,
  };
}

function snapshot(ids: string[], checkedAt = '2026-05-03T00:00:00.000Z'): DolbyCinemaUsSnapshot {
  return buildDolbyCinemaUsSnapshot(
    ids.map((id, index) => cinema(id, 40 + index * 0.01, -75 - index * 0.01)),
    checkedAt,
  );
}

function tempSnapshotPath(): string {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'liemax-dolby-')), 'snapshots.json');
}

function headers(setCookie: string): any {
  return {
    get: (name: string) => name.toLowerCase() === 'set-cookie' ? setCookie : null,
    getSetCookie: () => [setCookie],
  };
}

function fetchJson(value: unknown): any {
  return async (url: string) => {
    if (url.endsWith('/')) {
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: headers('XSRF-TOKEN=test-xsrf; Path=/; Secure; SameSite=strict'),
        text: async () => '<html></html>',
      };
    }
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: headers('AWSALB=test; Path=/'),
      text: async () => JSON.stringify(value),
    };
  };
}

function failingFetch(): any {
  return async (url: string) => {
    if (url.endsWith('/')) {
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: headers('XSRF-TOKEN=test-xsrf; Path=/; Secure; SameSite=strict'),
        text: async () => '<html></html>',
      };
    }
    return {
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      headers: headers('AWSALB=test; Path=/'),
      text: async () => 'upstream unavailable',
    };
  };
}

async function run(): Promise<void> {
  console.log('\nDolby Cinema count validation\n');

  assertEqual('longitude 0 normalizes unchanged', normalizeLongitude(0), 0);
  assertEqual('longitude 181 wraps to -179', normalizeLongitude(181), -179);
  assertEqual('longitude -241.39984130859378 wraps to 118.6', Math.round(normalizeLongitude(-241.39984130859378) * 1000) / 1000, 118.6);
  assertEqual('longitude 540 wraps to -180', normalizeLongitude(540), -180);

  assert('New York coordinate is contiguous U.S.', isInContiguousUnitedStates(40.752415, -73.994449));
  assert('California wrapped coordinate is contiguous U.S.', isInContiguousUnitedStates(35.280482, -480.662373));
  assert('Hawaii coordinate is outside contiguous U.S.', !isInContiguousUnitedStates(21.3099, -157.8581));
  assert('London coordinate is outside contiguous U.S.', !isInContiguousUnitedStates(51.5072, -0.1276));

  const filtered = buildDolbyCinemaUsSnapshot([
    cinema('inside', 40.75, -73.99),
    cinema('outside_lat', 51.5, -73.99),
    cinema('outside_lng', 40.75, -10),
  ], '2026-05-03T01:00:00.000Z');
  assertEqual('snapshot counts only contiguous U.S. cinemas', filtered.count, 1);
  assertEqual('snapshot stores normalized longitude', rounded(filtered.theaters[0].normalizedLongitude), -73.99);

  const previous = snapshot(['1', '2']);
  const currentAdded = snapshot(['1', '2', '3'], '2026-05-04T00:00:00.000Z');
  const currentRemoved = snapshot(['1'], '2026-05-04T00:00:00.000Z');
  const unchanged = snapshot(['1', '2'], '2026-05-04T00:00:00.000Z');

  const addedDiff = diffDolbyCinemaSnapshots(previous, currentAdded);
  assertEqual('diff reports added ID count', addedDiff.addedIds.length, 1);
  assertEqual('diff reports added ID', addedDiff.addedIds[0], '3');
  assertEqual('diff reports no removed IDs for addition', addedDiff.removedIds.length, 0);
  assert('diff marks added theater as changed', addedDiff.changed);

  const removedDiff = diffDolbyCinemaSnapshots(previous, currentRemoved);
  assertEqual('diff reports removed ID count', removedDiff.removedIds.length, 1);
  assertEqual('diff reports removed ID', removedDiff.removedIds[0], '2');
  assertEqual('diff reports no added IDs for removal', removedDiff.addedIds.length, 0);
  assert('diff marks removed theater as changed', removedDiff.changed);

  const unchangedComparison = compareDolbyCinemaSnapshots(previous, unchanged);
  assertEqual('comparison with unchanged ID set is unchanged', unchangedComparison.status, 'unchanged');
  assertEqual('comparison with no previous snapshot is baseline', compareDolbyCinemaSnapshots(null, previous).status, 'no_previous');
  assertEqual('comparison with one added theater is changed', compareDolbyCinemaSnapshots(previous, currentAdded).status, 'changed');
  assertEqual('comparison with one removed theater is changed', compareDolbyCinemaSnapshots(previous, currentRemoved).status, 'changed');

  const failurePath = tempSnapshotPath();
  fs.writeFileSync(failurePath, `${JSON.stringify([previous], null, 2)}\n`);
  const failure = await runDolbyCinemaCountCheck({
    snapshotsPath: failurePath,
    fetchImpl: failingFetch(),
    now: new Date('2026-05-05T00:00:00.000Z'),
    logger: { log: () => undefined, error: () => undefined },
  });
  const afterFailure = readDolbyCinemaSnapshots(failurePath);
  assert('endpoint failure returns non-ok result', !failure.ok);
  assertEqual('endpoint failure leaves snapshot count intact', afterFailure.length, 1);
  assertEqual('endpoint failure does not save count zero', afterFailure[0].count, 2);

  const successPath = tempSnapshotPath();
  fs.writeFileSync(successPath, `${JSON.stringify([previous], null, 2)}\n`);
  const success = await runDolbyCinemaCountCheck({
    snapshotsPath: successPath,
    fetchImpl: fetchJson([
      cinema('1', 40.75, -73.99),
      cinema('2', 41.75, -74.99),
      cinema('3', 42.75, -75.99),
      cinema('non_us', 51.5, -0.12),
    ]),
    now: new Date('2026-05-05T00:00:00.000Z'),
    logger: { log: () => undefined, error: () => undefined },
  });
  const afterSuccess = readDolbyCinemaSnapshots(successPath);
  assert('successful endpoint run returns ok result', success.ok);
  assertEqual('successful endpoint run appends one snapshot', afterSuccess.length, 2);
  assertEqual('successful endpoint run saves contiguous U.S. count only', afterSuccess[1].count, 3);

  if (failed > 0) {
    console.log(`\n${failed} Dolby Cinema count checks failed (${passed} passed).`);
    process.exit(1);
  }

  console.log(`\nAll ${passed} Dolby Cinema count checks passed.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
