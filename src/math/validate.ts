/**
 * LIEMAX Math Engine — Validation Script
 * 
 * Tests every function against known values from the project research docs.
 * Run with: npx ts-node src/math/validate.ts
 * 
 * Each test prints PASS/FAIL with expected vs actual values.
 * Tolerance is ±1% unless otherwise noted (some values in the research
 * are rounded estimates, so exact matches aren't always expected).
 */

import {
  // Geometry
  metersToFeet, diagonalToDimensions, screenAreaFlat, screenAreaDome,
  ppiFromResolution,
  // FOV
  horizontalFov, verticalFov, homeDisplayFov, computeCinemaFov, domeFov,
  // PPD
  computePpd, cinemaPpd, domePpd, homeDisplayPpd, offAxisPpd,
  // Masking
  computeMasking, extraAreaVsScope, contentCropLoss, areaComparisonPct,
  // Brightness
  flToNits, nitsToFl, compareBrightness, brightnessCinemaContext,
  // Seating
  deriveViewingDistances, homeDefaultViewingDistance,
  // Resolver
  resolveVenue, resolveHomeDisplay,
  // Constants
  IN_PER_FT,
  // Types
  type ResolvedVenue, type ResolvedHomeDisplay, type ResolvedScreen,
} from './index';

// ─── Test Harness ───────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(
  label: string,
  actual: number,
  expected: number,
  tolerancePct: number = 1.0
): void {
  const diff = Math.abs(actual - expected);
  const threshold = Math.abs(expected) * (tolerancePct / 100);
  const ok = diff <= Math.max(threshold, 0.01); // minimum absolute tolerance of 0.01

  if (ok) {
    console.log(`  ✓ ${label}: ${actual.toFixed(2)} (expected ~${expected})`);
    passed++;
  } else {
    console.log(`  ✗ ${label}: ${actual.toFixed(4)} (expected ~${expected}, diff ${diff.toFixed(4)}, tolerance ±${tolerancePct}%)`);
    failed++;
  }
}

// ═══════════════════════════════════════════════════════════════════
// GROUP 1: GEOMETRY & UNITS
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 1: Geometry & Units ═══');

// Meter-to-feet conversion
assert('1 meter = 3.28 ft', metersToFeet(1), 3.28084);
assert('Reading GT width: 30.84m → ft', metersToFeet(30.84), 101.2, 0.5);

// Diagonal to dimensions (65" 16:9 TV)
const tv65 = diagonalToDimensions(65, 16 / 9);
assert('65" TV width', tv65.width, 56.65, 1);
assert('65" TV height', tv65.height, 31.87, 1);

// Diagonal to dimensions (iPhone — 6.12" diagonal, ~2.17 AR)
const iphone = diagonalToDimensions(6.12, 2556 / 1179);
assert('iPhone 15 Pro width (landscape)', iphone.width, 5.56, 2);

// PPI calculation
assert('65" 4K PPI', ppiFromResolution(3840, 2160, 65), 68, 2);
assert('iPhone PPI', ppiFromResolution(2556, 1179, 6.12), 460, 2);

// Screen area (flat)
assert('Reading GT area (ft²)', screenAreaFlat(101.2, 70.8), 7165, 2);

// Screen area (dome) — 76ft dome, 83% coverage
assert('Dome area (76ft, 83%)', screenAreaDome(76, 83), 2 * Math.PI * (38 ** 2) * 0.83, 0.1);


// ═══════════════════════════════════════════════════════════════════
// GROUP 2: FIELD OF VIEW
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 2: Field of View ═══');

// Reading GT: 101.2 ft wide, mid-row at 84ft (1012"/1008" from research)
const gtMidDist = 84; // ~1008" / 12
assert('Reading GT horizontal FOV (mid-row)',
  horizontalFov(101.2, gtMidDist), 62.1, 3);

// Back row at 100ft
assert('Reading GT horizontal FOV (back row)',
  horizontalFov(101.2, 100), 53.7, 3);

// Vertical FOV (standard case: screen bottom at 5ft, eye at 3.75ft)
// Screen top = 5 + 70.8 = 75.8 ft. Eye at 3.75 ft (below screen bottom!).
// α_above = atan((75.8 - 3.75) / 84) = atan(72.05/84) ≈ 40.6°
// α_below = atan((3.75 - 5.0) / 84) = atan(-1.25/84) ≈ -0.85° (looking UP)
// Total ≈ 39.8° — the eye is BELOW the screen bottom at mid-row, so nearly
// the entire vertical FOV is above the horizon.
const vFov = verticalFov(70.8, 84, 5.0, 3.75);
assert('Reading GT vertical FOV total', vFov.total_deg, 39.8, 2);

// Home display FOV: 65" TV at 8ft
const tv65width_in = 56.65;
assert('65" TV FOV at 8ft',
  homeDisplayFov(tv65width_in, 96), 32.9, 3);


// ═══════════════════════════════════════════════════════════════════
// GROUP 3: PIXELS PER DEGREE
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 3: PPD ═══');

// ── Cinema PPD (from research table) ──

// Reading GT @ mid-row: 4096 px, 1012" wide, ~1008" distance → ~77 PPD
assert('Reading GT PPD (mid-row)',
  computePpd(4096, 1012, 1008), 77, 3);

// Reading GT @ back row: ~1200" distance → ~90 PPD
assert('Reading GT PPD (back row)',
  computePpd(4096, 1012, 1200), 90, 3);

// Standard 2K multiplex: 2048 px, 540" (45ft) wide, 720" (60ft) → ~50 PPD
assert('Standard 2K multiplex PPD',
  computePpd(2048, 540, 720), 50, 5);

// Standard 4K multiplex: 4096 px, 540" wide, 720" → ~100 PPD
assert('Standard 4K multiplex PPD',
  computePpd(4096, 540, 720), 100, 5);

// LIMAX CoLa: 4096 px, ~700" wide, 600" distance → ~65-71 PPD
assert('LIMAX CoLa PPD',
  computePpd(4096, 700, 600), 68, 8);

// 55" 4K TV at 8ft: 3840 px, 47.9" wide, 96" → ~137 PPD
assert('55" 4K TV PPD at 8ft',
  computePpd(3840, 47.9, 96), 137, 3);

// 77" 4K TV at 10ft: 3840 px, 67.1" wide, 120" → ~123 PPD
assert('77" 4K TV PPD at 10ft',
  computePpd(3840, 67.1, 120), 123, 3);

// iPhone 15 Pro @ 18": 1179 px (portrait), 2.82" wide → ~132 PPD
assert('iPhone PPD (portrait, 18")',
  computePpd(1179, 2.82, 18), 132, 3);

// ── Dome PPD ──

// 4K dome (180° FOV): 4096 / 180 ≈ 22.8 PPD
const domeResult = domePpd(4096, 180);
assert('4K Dome PPD (avg across 180°)', domeResult.ppd, 22.8, 1);

// Film dome (10,200 equiv, 180°): ~56.7 PPD
const domeFilmResult = domePpd(null, 180, 8800, 11700);
assert('Film Dome PPD (midpoint avg)', domeFilmResult.ppd, 56.9, 3);

// ── Off-axis PPD ──

// Center seat should equal normal PPD
const centerResult = offAxisPpd(4096, 1012, 1008, 0);
const normalPpd = computePpd(4096, 1012, 1008);
assert('Off-axis PPD at center = normal PPD', centerResult.ppd, normalPpd, 0.1);

// Off-axis should have HIGHER average PPD (counterintuitively!) because the
// total FOV shrinks when you're off-center. The same number of pixels fills
// fewer degrees → higher average PPD. The real off-axis degradation is
// non-uniform pixel distribution and keystoning, which the caveat explains.
const offResult = offAxisPpd(4096, 1012, 1008, 100); // 100-unit offset
assert('Off-axis avg PPD ≥ center PPD', offResult.ppd >= normalPpd ? 1 : 0, 1, 0);
assert('Off-axis has caveat', offResult.caveat ? 1 : 0, 1, 0);

// ── Supersampled PPD ──

// GT Dual Laser √2 × 4096 ≈ 5792.6 → at mid-row: ~109 PPD
const supersampledPpd = computePpd(4096 * Math.SQRT2, 1012, 1008);
assert('GT supersampled PPD (mid-row)', supersampledPpd, 109, 3);


// ═══════════════════════════════════════════════════════════════════
// GROUP 4: MASKING & EFFECTIVE AREA
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 4: Masking & Effective Area ═══');

// ── Extra area vs scope (from research table) ──
assert('1.43:1 vs scope', extraAreaVsScope(1.43), 67.1, 1);
assert('1.90:1 vs scope', extraAreaVsScope(1.90), 25.8, 1);
assert('1.78:1 vs scope', extraAreaVsScope(1.78), 34.3, 1);
assert('1.85:1 vs scope', extraAreaVsScope(1.85), 29.2, 1);
assert('2.20:1 vs scope', extraAreaVsScope(2.20), 8.6, 1);
assert('2.39:1 vs scope (baseline)', extraAreaVsScope(2.39), 0, 0.5);

// ── Content crop loss ──
// 1.43:1 content on 1.90:1 CoLa → ~24.7% vertical loss
assert('1.43 on 1.90 crop loss', contentCropLoss(1.43, 1.90), 24.7, 2);

// 1.43:1 content on 1.78:1 TV → ~19.7% vertical loss
assert('1.43 on 1.78 crop loss (home release)', contentCropLoss(1.43, 1.78), 19.7, 2);

// 1.90 content on 1.90 screen → 0% loss
assert('1.90 on 1.90 = no loss', contentCropLoss(1.90, 1.90), 0, 0);

// ── Masking: 2.39 scope on 1.43 GT screen ──
// Screen: 101.2 ft wide, 70.8 ft tall (1.43:1)
// Content 2.39:1 → letterbox. Effective height = 101.2 / 2.39 = 42.3 ft
const scopeOnGt = computeMasking(101.2, 70.8, 2.39, 1.43);
assert('Scope on GT: effective height', scopeOnGt.effective_height_ft, 42.3, 1);
assert('Scope on GT: letterboxed', scopeOnGt.letterboxed ? 1 : 0, 1);
assert('Scope on GT: utilization', scopeOnGt.screen_utilization_pct, 59.8, 2);

// ── Masking: 1.43 content on 1.90 CoLa ──
// Screen: 61 ft wide, 32.1 ft tall (1.90:1). Content 1.43:1 is CROPPED.
const imaxOnCola = computeMasking(61, 32.1, 1.43, 1.90);
assert('IMAX on CoLa: cropped', imaxOnCola.cropped ? 1 : 0, 1);

// ── Masking: 1.78 content on 2.39 scope screen ──
// (hypothetical ultra-wide screen, 100 ft × 41.8 ft)
const tvOnScope = computeMasking(100, 41.8, 1.78, 1.78);
assert('16:9 on scope screen: pillarboxed', tvOnScope.pillarboxed ? 1 : 0, 1);


// ═══════════════════════════════════════════════════════════════════
// GROUP 5: BRIGHTNESS
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 5: Brightness ═══');

// fL ↔ nits conversion
assert('14 fL (DCI) → nits', flToNits(14), 47.97, 1);
assert('22 fL (IMAX) → nits', flToNits(22), 75.38, 1);
assert('31 fL (Dolby 2D) → nits', flToNits(31), 106.21, 1);
assert('331 nits (LG G5 fullscreen) → fL', nitsToFl(331), 96.6, 1);

// Sanity: Dolby Cinema at 106 nits is ~31 fL (should round-trip)
assert('fL round-trip', nitsToFl(flToNits(31)), 31, 0.01);


// ═══════════════════════════════════════════════════════════════════
// GROUP 6: SEATING DISTANCES
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 6: Seating Distances ═══');

// Reading GT: 101.2 ft wide
const gtDistances = deriveViewingDistances(101.2);
assert('GT front row (0.87×)', gtDistances.front_ft, 101.2 * 0.87, 0.1);
assert('GT mid row (1.5×)', gtDistances.mid_ft, 101.2 * 1.5, 0.1);
assert('GT back row (2.25×)', gtDistances.back_ft, 101.2 * 2.25, 0.1);

// Home: 65" TV viewing distance = 1.5 × screen height
const tvDist = homeDefaultViewingDistance(65, 16 / 9, 'tv');
const tvHeight = diagonalToDimensions(65, 16 / 9).height; // in inches
assert('65" TV default distance', tvDist, (tvHeight / 12) * 1.5, 1);

// Phone: always 1.0 ft
const phoneDist = homeDefaultViewingDistance(6.12, 2.17, 'phone');
assert('Phone default distance', phoneDist, 1.0, 0);


// ═══════════════════════════════════════════════════════════════════
// GROUP 7: RESOLVER
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 7: Resolver ═══');

// ── Cinema venue resolver ──
// Simulate a GT preset and a venue that overrides only screen width
const mockGtPreset = {
  id: 'imax_gt_dual_laser',
  display_name: 'IMAX GT Dual Laser',
  default_screen: {
    width_m: 25, height_m: 18, geometry: 'slight_cylindrical_curve',
    screen_bottom_height_ft: 5.0,
  },
  default_projection: {
    type: 'imax_gt_dual_laser', light_source: 'dual_rgb_laser',
    dual_projector: true, resolution_horizontal_px: 4096,
    resolution_vertical_px: 2160, resolution_scan_equivalent_low: null,
    resolution_scan_equivalent_high: null, brightness_fl: 22,
    contrast_sequential: 8000, contrast_dynamic: null,
    hdr: 'none', anamorphic_stretch: false,
  },
  default_seating: { rake_angle_deg: 10 },
  default_capabilities: { min_content_ar_supported: 1.43, supports_1570_film: false },
};

const mockVenue = {
  id: 'test_venue',
  preset_id: 'imax_gt_dual_laser',
  name: 'Test IMAX GT',
  city: 'Test City',
  country: 'US',
  screen: { width_m: 30.84 },  // only override width
  metadata: { last_verified: '2026-01-01' },
};

const resolved = resolveVenue(mockGtPreset, mockVenue);

// Check field-level merge: width from venue, height from preset
assert('Resolver: venue width override (m)', resolved.screen.width_m, 30.84, 0.1);
assert('Resolver: preset height fallthrough (m)', resolved.screen.height_m, 18, 0.1);

// Check derived fields
assert('Resolver: width_ft derived', resolved.screen.width_ft, metersToFeet(30.84), 0.1);
assert('Resolver: height_ft derived', resolved.screen.height_ft, metersToFeet(18), 0.1);
assert('Resolver: AR derived from dims', resolved.screen.aspect_ratio, 30.84 / 18, 0.1);
assert('Resolver: brightness_cdm2 derived', resolved.projection.brightness_cdm2, flToNits(22), 0.1);

// Check viewing distances derived from screen width
assert('Resolver: mid distance derived', resolved.seating.viewing_distance_mid_ft, metersToFeet(30.84) * 1.5, 0.1);
assert('Resolver: seat offset defaults to 0', resolved.seating.seat_offset_from_center_ft, 0, 0);
assert('Resolver: geometry from preset', resolved.screen.geometry === 'slight_cylindrical_curve' ? 1 : 0, 1, 0);
assert('Resolver: dual_projector from preset', resolved.projection.dual_projector ? 1 : 0, 1, 0);

// ── Venue with measured distances should NOT be overwritten ──
const venueWithMeasured = {
  id: 'measured_venue', preset_id: 'imax_gt_dual_laser',
  name: 'Measured Venue', city: 'Test', country: 'US',
  screen: { width_m: 25 },
  seating: {
    viewing_distance_front_ft: 40,
    viewing_distance_mid_ft: 70,
    viewing_distance_back_ft: 100,
    viewing_distance_source: 'measured',
  },
  metadata: {},
};
const resolvedMeasured = resolveVenue(mockGtPreset, venueWithMeasured);
assert('Resolver: measured mid NOT overwritten', resolvedMeasured.seating.viewing_distance_mid_ft, 70, 0);
assert('Resolver: measured front NOT overwritten', resolvedMeasured.seating.viewing_distance_front_ft, 40, 0);
assert('Resolver: measured source preserved', resolvedMeasured.seating.viewing_distance_source === 'measured' ? 1 : 0, 1, 0);

// ── Home display resolver ──
const mockHomePreset = {
  id: 'oled_flagship_2025',
  display_name: 'OLED Flagship',
  device_category: 'tv',
  tier: 'flagship',
  default_screen_diagonal_in: 65,
  default_aspect_ratio: 1.78,
  default_viewing_distance_ft: 5.5,
  default_display_optics: {
    panel_tech: 'woled', is_per_pixel_emissive: true,
    resolution_horizontal_px: 3840, resolution_vertical_px: 2160,
    brightness_peak_hdr_nits: 2268, brightness_fullscreen_nits: 331,
    brightness_sdr_nits: 296, contrast_sequential: null,
  },
};

const mockHomeRecord = {
  id: 'my_tv', preset_id: 'oled_flagship_2025', user_label: 'My Living Room TV',
  screen_diagonal_in: 77,  // override size
  viewing_distance_ft: 9.0, // override distance
};

const resolvedHome = resolveHomeDisplay(mockHomePreset, mockHomeRecord);
assert('Home resolver: diagonal override', resolvedHome.screen_diagonal_in, 77, 0);
assert('Home resolver: distance override', resolvedHome.viewing_distance_ft, 9.0, 0);
assert('Home resolver: AR from preset', resolvedHome.aspect_ratio, 1.78, 0);
assert('Home resolver: emissive from preset', resolvedHome.display_optics.is_per_pixel_emissive ? 1 : 0, 1, 0);

// PPI should be derived from overridden diagonal (77") not preset (65")
const expectedPpi = Math.sqrt(3840 ** 2 + 2160 ** 2) / 77;
assert('Home resolver: PPI derived from overridden diagonal', resolvedHome.display_optics.ppi, expectedPpi, 0.1);

// ── Home display with no overrides — everything from preset ──
const bareRecord = { id: 'bare', preset_id: 'oled_flagship_2025', user_label: 'Bare' };
const resolvedBare = resolveHomeDisplay(mockHomePreset, bareRecord);
assert('Home resolver: bare diagonal from preset', resolvedBare.screen_diagonal_in, 65, 0);
assert('Home resolver: bare distance from preset', resolvedBare.viewing_distance_ft, 5.5, 0);


// ═══════════════════════════════════════════════════════════════════
// GROUP 8: COMPOSITION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══ GROUP 8: Composition Functions ═══');

// ── cinemaPpd with resolved venue ──
const gtPpd = cinemaPpd(resolved, resolved.seating.viewing_distance_mid_ft, 'native');
const expectedGtPpd = computePpd(4096, resolved.screen.width_ft, resolved.seating.viewing_distance_mid_ft);
assert('cinemaPpd native matches computePpd', gtPpd.ppd, expectedGtPpd, 0.1);
assert('cinemaPpd native has no caveat', gtPpd.caveat === undefined ? 1 : 0, 1, 0);

// Supersampled mode on dual projector
const gtSuperPpd = cinemaPpd(resolved, resolved.seating.viewing_distance_mid_ft, 'supersampled');
assert('cinemaPpd supersampled > native', gtSuperPpd.ppd > gtPpd.ppd ? 1 : 0, 1, 0);
assert('cinemaPpd supersampled has caveat', gtSuperPpd.caveat !== undefined ? 1 : 0, 1, 0);
assert('cinemaPpd supersampled ratio ≈ √2', gtSuperPpd.ppd / gtPpd.ppd, Math.SQRT2, 0.1);

// Film mode should throw on digital projector
let filmThrew = false;
try { cinemaPpd(resolved, 100, 'scan_equivalent_low'); } catch { filmThrew = true; }
assert('cinemaPpd scan_equiv throws on digital', filmThrew ? 1 : 0, 1, 0);

// ── homeDisplayPpd ──
const homePpd = homeDisplayPpd(resolvedHome);
const homeWidth = diagonalToDimensions(77, 1.78).width;
const expectedHomePpd = computePpd(3840, homeWidth, 9.0 * 12);
assert('homeDisplayPpd matches manual calc', homePpd.ppd, expectedHomePpd, 0.1);

// ── computeCinemaFov ──
const cinemaFovResult = computeCinemaFov(
  resolved.screen.width_ft, resolved.screen.height_ft,
  resolved.seating.viewing_distance_mid_ft, 5.0, 3.75
);
assert('computeCinemaFov hFov matches horizontalFov',
  cinemaFovResult.horizontal_deg,
  horizontalFov(resolved.screen.width_ft, resolved.seating.viewing_distance_mid_ft), 0.01);
assert('computeCinemaFov vFov > 0', cinemaFovResult.vertical_total_deg > 0 ? 1 : 0, 1, 0);

// ── domeFov ──
const mockDomeScreen: ResolvedScreen = {
  width_m: 23, height_m: 23, width_ft: 75.5, height_ft: 75.5,
  aspect_ratio: 1.0, geometry: 'hemispherical',
  screen_bottom_height_ft: 0,
  dome_coverage_pct: 83,
  dome_fov_horizontal_deg: 180, dome_fov_vertical_deg: 125,
  dome_fov_above_horizon_deg: 104, dome_fov_below_horizon_deg: 21,
};
const domeFovResult = domeFov(mockDomeScreen);
assert('domeFov horizontal', domeFovResult.horizontal_deg, 180, 0);
assert('domeFov vertical', domeFovResult.vertical_total_deg, 125, 0);
assert('domeFov above', domeFovResult.vertical_above_horizon_deg, 104, 0);
assert('domeFov below', domeFovResult.vertical_below_horizon_deg, 21, 0);

// domeFov should throw on flat screen
let domeFovThrew = false;
try {
  domeFov({ ...mockDomeScreen, geometry: 'flat' });
} catch { domeFovThrew = true; }
assert('domeFov throws on flat screen', domeFovThrew ? 1 : 0, 1, 0);

// ── compareBrightness ──
const brightComp = compareBrightness(22, 331);
assert('Brightness comparison: cinema fL', brightComp.cinema_fl, 22, 0);
assert('Brightness comparison: home nits', brightComp.home_nits, 331, 0);
assert('Brightness comparison: ratio', brightComp.ratio_home_to_cinema, nitsToFl(331) / 22, 0.1);
assert('Brightness comparison: home brighter', brightComp.ratio_home_to_cinema > 1 ? 1 : 0, 1, 0);

// Cinema brighter than dim home display
const dimComp = compareBrightness(22, 50);
assert('Brightness comparison: cinema brighter', dimComp.ratio_home_to_cinema < 1 ? 1 : 0, 1, 0);

// ── brightnessCinemaContext ──
const dciCtx = brightnessCinemaContext(14);
assert('Brightness context: DCI is "near DCI"', dciCtx.includes('DCI') ? 1 : 0, 1, 0);
const imaxCtx = brightnessCinemaContext(22);
assert('Brightness context: IMAX is "above DCI"', imaxCtx.includes('above DCI') ? 1 : 0, 1, 0);
const dolbyCtx = brightnessCinemaContext(31);
assert('Brightness context: Dolby is "premium"', dolbyCtx.includes('premium') ? 1 : 0, 1, 0);

// ── areaComparisonPct ──
assert('Area comparison: 2× area = +100%', areaComparisonPct(200, 100), 100, 0);
assert('Area comparison: equal = 0%', areaComparisonPct(100, 100), 0, 0);
assert('Area comparison: half = -50%', areaComparisonPct(50, 100), -50, 0);


// ═══════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failed === 0) {
  console.log('🎯 All tests pass! Math engine is verified against research data.');
} else {
  console.log('⚠️  Some tests failed — review the mismatches above.');
}
console.log('═══════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
