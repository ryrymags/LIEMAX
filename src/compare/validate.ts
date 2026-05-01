import type { ResolvedProjection } from '../math/types';
import {
  buildBrightnessRow,
  buildHdrBlackLevelRow,
  buildNativeContrastRow,
  buildPictureDepthRow,
  buildPpdRow,
  buildProjectionComparisonRows,
  buildVisibleAreaRow,
} from './index';

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

function projection(overrides: Partial<ResolvedProjection>): ResolvedProjection {
  return {
    id: 'digital',
    display_name: 'Digital',
    mode: 'digital',
    availability: 'primary',
    type: 'standard_4k_laser',
    light_source: 'rgb_laser',
    dual_projector: false,
    resolution_horizontal_px: 4096,
    resolution_vertical_px: 2160,
    resolution_scan_equivalent_low: null,
    resolution_scan_equivalent_high: null,
    brightness_fl: 14,
    brightness_cdm2: 47.97,
    contrast_sequential: 2000,
    contrast_dynamic: null,
    hdr: 'none',
    anamorphic_stretch: false,
    min_content_ar_supported: 1.90,
    ...overrides,
  };
}

const cola = projection({
  type: 'imax_cola',
  display_name: 'IMAX CoLa Digital',
  brightness_fl: 22,
  contrast_sequential: 10000,
});

const dolby = projection({
  type: 'dolby_cinema',
  display_name: 'Dolby Vision (Dual-Laser Christie E3LH)',
  light_source: 'dual_rgb_laser',
  dual_projector: true,
  brightness_fl: 31,
  contrast_sequential: 6250,
  contrast_dynamic: 1000000,
  hdr: 'dolby_vision',
});

const dolbySingleLaser = projection({
  type: 'dolby_cinema_single_laser',
  display_name: 'Dolby Vision (Single-Laser Christie, 2025+)',
  brightness_fl: 31,
  contrast_sequential: 6250,
  contrast_dynamic: 20000000,
  hdr: 'dolby_vision',
});

const film1570 = projection({
  type: 'imax_1570_film',
  display_name: 'IMAX 15/70 Film',
  mode: 'film',
  light_source: 'xenon_film',
  resolution_horizontal_px: null,
  resolution_vertical_px: null,
  resolution_scan_equivalent_low: 8800,
  resolution_scan_equivalent_high: 11700,
  brightness_fl: 22,
  contrast_sequential: 4500,
  hdr: 'photochemical',
  min_content_ar_supported: 1.43,
});

console.log('\nComparison view-model validation\n');

const tiedPpd = buildPpdRow(65.6, 66.4, { aName: 'A', bName: 'B' });
assertEqual('rounded PPD tie winner', tiedPpd.winner, 'tie');
assertEqual('rounded PPD tie badge', tiedPpd.badgeLabel, 'Comparable');
assertEqual('rounded PPD A display', tiedPpd.aDisplay, '66 ppd');
assertEqual('rounded PPD B display', tiedPpd.bDisplay, '66 ppd');

const ppdWinner = buildPpdRow(65.4, 66.6, { aName: 'A', bName: 'B' });
assertEqual('different displayed PPD picks winner', ppdWinner.winner, 'b');

const areaTie = buildVisibleAreaRow(2747.5, 2748.4);
assertEqual('rounded visible area tie', areaTie.winner, 'tie');

const brightness = buildBrightnessRow(cola, dolby, { aName: 'Apple', bName: 'Dolby' });
assertEqual('Dolby brightness uses HDR feature value', brightness.bDisplay, '31.0 fL');
assertEqual('Dolby brightness wins over CoLa', brightness.winner, 'b');
assert('Dolby brightness row includes feature target note', Boolean(brightness.note?.includes('Dolby Vision')));

const nativeContrast = buildNativeContrastRow(cola, dolby, { aName: 'Apple', bName: 'Dolby' });
assertEqual('CoLa wins native sequential contrast', nativeContrast.winner, 'a');
assertEqual('CoLa native contrast display', nativeContrast.aDisplay, '10,000:1');
assertEqual('Dolby sequential contrast is approximate', nativeContrast.bDisplay, '~6,250:1');

const hdrRow = buildHdrBlackLevelRow(cola, dolby, { aName: 'Apple', bName: 'Dolby' });
assert('Dolby vs non-Dolby returns HDR row', hdrRow !== null);
assertEqual('Dolby wins HDR black level', hdrRow?.winner, 'b');
assertEqual('Dolby dynamic contrast display', hdrRow?.bDisplay, 'Dolby Vision dynamic (1,000,000:1)');
assert('Dolby HDR row includes default assumption note', Boolean(hdrRow?.note?.includes('assumed')));

const singleLaserHdrRow = buildHdrBlackLevelRow(cola, dolbySingleLaser);
assertEqual('single-laser Dolby dynamic contrast display', singleLaserHdrRow?.bDisplay, 'Dolby Vision dynamic (20,000,000:1)');

const pictureDepth = buildPictureDepthRow(cola, dolby, { aName: 'Apple', bName: 'Dolby' });
assertEqual('Dolby wins overall HDR picture depth', pictureDepth?.winner, 'b');
assertEqual('Dolby picture depth display', pictureDepth?.bDisplay, 'Dolby Vision HDR depth');
assert('picture depth note keeps native contrast separate', Boolean(pictureDepth?.note?.includes('native sequential contrast')));

const noHdrRow = buildHdrBlackLevelRow(cola, projection({ type: 'standard_4k_laser' }));
assertEqual('non-Dolby vs non-Dolby omits HDR black level row', noHdrRow, null);
assertEqual('non-Dolby vs non-Dolby omits picture depth row', buildPictureDepthRow(cola, projection({ type: 'standard_4k_laser' })), null);

const filmRow = buildHdrBlackLevelRow(film1570, cola);
assertEqual('15/70 film renders as photochemical', filmRow?.aDisplay, 'Photochemical latitude');
assert('15/70 film label avoids digital HDR claim', !String(filmRow?.aDisplay).includes('HDR'));

const projectionRows = buildProjectionComparisonRows(cola, dolby);
assert('projection comparison includes HDR row when Dolby is present', projectionRows.some((row) => row.id === 'hdr_black_level'));
assert('projection comparison includes picture depth row when Dolby is present', projectionRows.some((row) => row.id === 'picture_depth'));

if (failed > 0) {
  console.log(`\n${failed} comparison validation checks failed (${passed} passed).`);
  process.exit(1);
}

console.log(`\nAll ${passed} comparison validation checks passed.`);
