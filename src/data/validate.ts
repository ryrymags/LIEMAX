/**
 * Lightweight schema/import validation for foundational data contracts.
 *
 * This is not a full JSON Schema validator. It catches the project-specific
 * invariants that matter before Step 3 data scales, without adding a network
 * dependency just to validate a handful of import fixtures.
 */

import schema from '../../schema/theater.schema.json';
import samples from './fixtures/imax_143190_samples.json';
import { map143190RowToVenue, type Imax143190ImportRow } from './imaxImport';

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

console.log('\n=== Schema Contract ===');
assertEqual('schema const version', schema.properties.schema_version.const, '1.3.0');
assert('schema has 143190 import definition', Boolean(schema.definitions.imax_143190_import));
assert('schema projection supports mode', Boolean(schema.definitions.projection.properties.mode));
assert('schema projection supports per-mode min AR', Boolean(schema.definitions.projection.properties.min_content_ar_supported));
assert('format presets support projection arrays', Boolean(schema.definitions.format_preset.properties.default_projections));
assert('venues support projection arrays', Boolean(schema.definitions.venue_record.properties.projections));
assert('venues support raw 143190 source rows', Boolean(schema.definitions.venue_record.properties.source_143190));

console.log('\n=== 143190 Import Fixtures ===');
const venues = samples.map((sample) => ({
  caseName: sample.case,
  venue: map143190RowToVenue(sample.row as Imax143190ImportRow, {
    lastVerified: '2026-04-25',
    sourceUrl: 'https://143190.xyz/',
  }),
}));

for (const { caseName, venue } of venues) {
  assert(`${caseName} maps to venue id`, typeof venue.id === 'string' && venue.id.length > 0);
  assertEqual(`${caseName} keeps source`, (venue.metadata as any).data_source, 'r_imax_csv');
  assert(`${caseName} keeps raw source row`, Boolean(venue.source_143190));
}

const digitalOnly = venues.find((item) => item.caseName === 'digital_only_cola')!.venue as any;
assertEqual('digital-only has one projection mode', digitalOnly.projections.length, 1);
assertEqual('digital-only mode is digital', digitalOnly.projections[0].mode, 'digital');
assertEqual('digital-only max digital AR preserved', digitalOnly.projections[0].min_content_ar_supported, 1.90);
assertEqual('digital-only does not claim 15/70', digitalOnly.capabilities.supports_1570_film, false);

const hybrid = venues.find((item) => item.caseName === 'hybrid_cola_1570')!.venue as any;
assertEqual('hybrid has two projection modes', hybrid.projections.length, 2);
assertEqual('hybrid default projection remains digital', hybrid.projection.mode, 'digital');
assertEqual('hybrid digital max AR from 143190', hybrid.projections[0].min_content_ar_supported, 1.90);
assertEqual('hybrid film mode supports 1.43', hybrid.projections[1].min_content_ar_supported, 1.43);
assertEqual('hybrid claims 15/70 film capability', hybrid.capabilities.supports_1570_film, true);

const physical143 = venues.find((item) => item.caseName === 'physical_143_unknown_digital_ar')!.venue as any;
assertEqual('1.43 physical screen does not infer 1.43 digital', physical143.projections[0].min_content_ar_supported, 1.90);
assertEqual('1.43 physical screen does not claim digital 1.43', physical143.capabilities.supports_143_digital, false);

const sparse = venues.find((item) => item.caseName === 'missing_screen_dimensions')!.venue as any;
assertEqual('sparse import is allowed with low confidence', sparse.metadata.confidence, 'low');
assert('sparse import leaves screen dimensions absent', sparse.screen.width_m === undefined && sparse.screen.height_m === undefined);

console.log('\n==============================');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} checks`);
console.log('==============================\n');

process.exit(failed > 0 ? 1 : 0);
