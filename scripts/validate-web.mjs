// Data-invariant checks for the generated V2 bundle. Ports the data-level
// half of the retired prototype validate-workbench suite; UI behavior is
// verified in-browser per milestone.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = JSON.parse(readFileSync(join(root, 'src/data/generated/docs_bundle.json'), 'utf8'));

let passed = 0;
let failed = 0;
function assert(label, cond) {
  if (cond) { passed += 1; console.log(`  PASS ${label}`); }
  else { failed += 1; console.log(`  FAIL ${label}`); }
}

const venues = bundle.venues.filter((v) => v.kind === 'cinema' && !v.isPreset);
const byName = (name) => venues.find((v) => v.name === name);
const db = bundle.db;

// Honest stat scoping (July 2026 audit)
assert('db.current_r_imax_count === 180', db.current_r_imax_count === 180);
assert('db.lfexaminer_supplemental_count === 220', db.lfexaminer_supplemental_count === 220);
assert('db.total_us_imax === current + archival', db.total_us_imax === db.current_r_imax_count + db.lfexaminer_supplemental_count);
assert('db.gt_laser_count === 14 (current-scoped)', db.gt_laser_count === 14);
assert('db.film_conditional_count === 16 (current-scoped)', db.film_conditional_count === 16);
assert('db.dome_count === 10 (current-scoped)', db.dome_count === 10);
assert('incl_archival variants >= scoped counts',
  db.film_conditional_incl_archival_count >= db.film_conditional_count &&
  db.dome_incl_archival_count >= db.dome_count);
assert('liemax current-source split exposed',
  typeof db.liemax_current_source_count === 'number' && typeof db.liemax_current_source_pct === 'number');
assert('dolby snapshot count present', typeof db.dolby_cinema_us_count === 'number' && db.dolby_cinema_us_count > 0);

// Renamed-venue duplicate suppression stays suppressed
const suppressed = [
  ['CA', 'Fresno', 'Edwards Fresno Stadium 22 & IMAX'],
  ['ID', 'Boise', 'Edwards Boise Stadium 22 & IMAX'],
  ['MO', 'Independence', 'AMC Independence Commons 20 & IMAX'],
  ['SC', 'Simpsonville', 'Regal Simpsonville Stadium 14 & IMAX'],
  ['NC', 'Fayetteville', 'AMC Fayetteville 14 & MAX'],
];
assert('suppressed LFExaminer duplicates stay absent',
  suppressed.every(([state, city, name]) =>
    !venues.some((v) => v.state === state && v.city === city && v.name === name)));

// Flagship venue invariants
const providenceRows = venues.filter((v) => v.city === 'Providence' && v.state === 'RI');
assert('exactly one Providence row (authored wins)', providenceRows.length === 1);
assert('Providence keeps 1.43 film path', Boolean(providenceRows[0]?.filmProjection));
const mugar = venues.find((v) => v.name?.includes('Mugar'));
assert('Mugar dome geometry', mugar?.screen?.geometry === 'hemispherical');
const bostonCommon = venues.filter((v) => v.name?.includes('Boston Common'));
assert('exactly one Boston Common row', bostonCommon.length === 1);

// Zero-dimension rows stay fail-closed
const desertRidge = venues.find((v) => v.name?.includes('Desert Ridge'));
assert('Desert Ridge unknown dimensions stay null', desertRidge != null && desertRidge.screen.w == null && desertRidge.screen.sizeTier == null);

// V2 build artifacts exist and are current
assert('web app entry exists', existsSync(join(root, 'web/src/main.tsx')));
assert('built docs/index.html exists', existsSync(join(root, 'docs/index.html')));
const builtIndex = existsSync(join(root, 'docs/index.html')) ? readFileSync(join(root, 'docs/index.html'), 'utf8') : '';
assert('built index has no CDN scripts', !/unpkg\.com|cdnjs\.cloudflare|googleapis/.test(builtIndex));
assert('built index mounts root div', builtIndex.includes('id="root"'));

console.log(`\n${failed > 0 ? 'FAILED' : 'OK'}: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
