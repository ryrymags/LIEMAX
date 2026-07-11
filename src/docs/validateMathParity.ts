// Cross-implementation parity guard: docs/math.js (hand-maintained browser
// math) must agree with the canonical src/math engine. This is the drift
// check the July 2026 audit found missing — the shipped UI previously used a
// symmetric vertical-FOV formula that diverged ~15% from the tested engine.
//
// Run: npm run validate:math-parity

import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import { horizontalFov, verticalFov, computeMasking, computePpd, eyeHeightAtDistance } from '../math';

let passed = 0;
let failed = 0;

function check(name: string, actual: number | null, expected: number | null, tolerance = 0.01): void {
  const ok =
    actual === null && expected === null
      ? true
      : actual !== null && expected !== null && Math.abs(actual - expected) <= tolerance;
  if (ok) {
    passed += 1;
    console.log(`  PASS ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${name}: docs/math.js=${actual} src/math=${expected}`);
  }
}

// Load docs/math.js into a sandboxed window.
const mathSource = fs.readFileSync(path.join(__dirname, '../../docs/math.js'), 'utf8');
const sandbox: Record<string, any> = { window: {}, Math, Number };
vm.createContext(sandbox);
vm.runInContext(mathSource, sandbox);
const M = sandbox.window.LIEMAX_MATH;

if (!M) {
  console.error('docs/math.js did not attach window.LIEMAX_MATH');
  process.exit(1);
}

console.log('Horizontal FOV parity:');
const HFOV_CASES: Array<[number, number]> = [
  [101.2, 84], [101.2, 100], [70, 40], [45, 120], [24.7 * 3.28084, 60],
];
for (const [w, d] of HFOV_CASES) {
  check(`horizontalFov(${w.toFixed(1)}, ${d})`, M.horizontalFovDeg(w, d), horizontalFov(w, d));
}

console.log('Vertical FOV parity (asymmetric, all eye regimes):');
// [heightFt, distFt, bottomFt, eyeFt] — eye below bottom, between, above top.
const VFOV_CASES: Array<[number, number, number, number]> = [
  [70.8, 84, 5.0, 3.75],   // GT mid-row; canonical expected ≈ 39.8°
  [70.8, 40, 5.0, 3.75],   // GT front-row
  [32.4, 60, 5.0, 3.75],   // RPX-scale room
  [20, 30, 5.0, 15.0],     // eye between screen bottom and top (elevated seat)
  [10, 50, 2.0, 20.0],     // eye above screen top
];
for (const [h, d, b, e] of VFOV_CASES) {
  check(
    `verticalFov(h=${h}, d=${d}, bottom=${b}, eye=${e})`,
    M.verticalFovDeg(h, d, b, e),
    verticalFov(h, d, b, e).total_deg
  );
}
// Defaults must match the canonical defaults (bottom 5.0, eye 3.75).
check('verticalFov default bottom/eye', M.verticalFovDeg(70.8, 84), verticalFov(70.8, 84).total_deg);

console.log('PPD parity (ppd of horizontal FOV vs computePpd):');
const PPD_CASES: Array<[number, number, number]> = [
  [4096, 101.2, 84], [4096, 101.2, 120], [2048, 45, 60],
];
for (const [px, w, d] of PPD_CASES) {
  check(`ppd(${px}px, w=${w}, d=${d})`, M.ppd(px, M.horizontalFovDeg(w, d)), computePpd(px, w, d), 0.05);
}

console.log('Masking parity (min_ar === presentation ar — the domain both implementations share):');
// [screenW, screenH, contentAr] with minAr = screen ar, mirroring every
// current call site (visibleContentRect passes min_ar === ar).
const MASK_CASES: Array<[number, number, number]> = [
  [101.2, 70.8, 2.39],  // scope on 1.43 screen → letterbox
  [101.2, 70.8, 1.43],  // perfect fit
  [60, 32.4, 1.43],     // tall content on 1.85 screen → pillarbox
  [62, 32.6, 1.90],     // 1.90 on 1.90 screen
];
for (const [w, h, ar] of MASK_CASES) {
  const screenAr = w / h;
  const docsMask = M.masking({ w, h, ar: screenAr }, ar, { min_ar: screenAr });
  const tsMask = computeMasking(w, h, ar, screenAr);
  check(`masking effW (${w}x${h}, content ${ar})`, docsMask.effW, tsMask.effective_width_ft);
  check(`masking effH (${w}x${h}, content ${ar})`, docsMask.effH, tsMask.effective_height_ft);
  check(`masking util% (${w}x${h}, content ${ar})`, docsMask.areaUtilPct, tsMask.screen_utilization_pct, 0.05);
}

console.log('Seat eye-height parity (raked floor model):');
// [distFt, frontFt, rakeDeg, frontElevFt, capFt|null]
const EYE_CASES: Array<[number, number, number, number, number | null]> = [
  [65.6, 35.3, 25, 21.24, 56.69],  // Lincoln Square GT mid (cap = 0.75 * 75.59)
  [90.9, 35.3, 25, 21.24, 56.69],  // GT back row, hits the cap
  [120, 60, 7, 0, 14.67],          // standard conventional
  [40, 40, 10, 0, null],           // seat at front row, no cap
];
for (const [d, front, rake, elev, cap] of EYE_CASES) {
  check(
    `eyeHeight(d=${d}, front=${front}, rake=${rake}, elev=${elev}, cap=${cap})`,
    M.eyeHeightAtDistance(d, front, rake, elev, cap),
    eyeHeightAtDistance(d, front, rake, elev, cap)
  );
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} parity checks`);
process.exit(failed > 0 ? 1 : 0);
