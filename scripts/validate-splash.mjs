// Static regression checks for the SplashZoom checkpoint contract.
// This intentionally does not import the React component or start a browser:
// source-level failures should be visible in CI before UI/runtime checks run.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const splashPath = join(root, 'web/src/components/SplashZoom.tsx');
const navPath = join(root, 'web/src/components/Nav.tsx');
const cssPath = join(root, 'web/src/styles/components.css');
const formatsPath = join(root, 'src/data/content_formats/content_formats.json');
const assetReadmePath = join(root, 'web/public/assets/splash/README.md');

const requiredInputs = [splashPath, navPath, cssPath, formatsPath, assetReadmePath];
const missingInputs = requiredInputs.filter((path) => !existsSync(path));
if (missingInputs.length) {
  console.error('FAILED: missing validator input(s):');
  for (const path of missingInputs) console.error(`  - ${path}`);
  process.exit(1);
}

const source = readFileSync(splashPath, 'utf8');
const nav = readFileSync(navPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const formats = JSON.parse(readFileSync(formatsPath, 'utf8'));
const assetReadme = readFileSync(assetReadmePath, 'utf8');

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS ${label}`);
  } else {
    failed += 1;
    console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function has(text) {
  return source.includes(text);
}

function numberConstant(name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*([0-9.]+)`));
  return match ? Number(match[1]) : undefined;
}

function formatRatio(id) {
  return formats.find((format) => format.id === id)?.aspect_ratio;
}

function closeEnough(actual, expected, epsilon = 1e-9) {
  return typeof actual === 'number' && Math.abs(actual - expected) <= epsilon;
}

console.log('Splash checkpoint validation');

// Canonical data and geometry.
assert('canonical content-format data exists', Array.isArray(formats));
assert('content_formats has imax_143 = 1.43', closeEnough(formatRatio('imax_143'), 1.43));
assert('content_formats has imax_digital_190 = 1.90', closeEnough(formatRatio('imax_digital_190'), 1.9));
assert('content_formats has scope_239 = 2.39', closeEnough(formatRatio('scope_239'), 2.39));
assert('SplashZoom imports content_formats data', /contentFormatsData\s+from\s+['"]@data\/content_formats\/content_formats\.json['"]/.test(source));
assert('digital ratio is looked up by canonical id', /aspectRatioFor\(['"]imax_digital_190['"]/.test(source));
assert('scope ratio is looked up by canonical id', /aspectRatioFor\(['"]scope_239['"]/.test(source));
assert('full-frame width constant is 10803', numberConstant('FULL_IMAGE_WIDTH') === 10803);
assert('full-frame height constant is 7555', numberConstant('FULL_IMAGE_HEIGHT') === 7555);
assert(
  'source TIFF crop is documented',
  /10803\s*[×x]\s*7951/i.test(assetReadme) &&
    /10803\s*[×x]\s*7555/i.test(assetReadme) &&
    /x=0,?\s*y=198/i.test(assetReadme),
);
assert('1.43 band is the complete source frame', /BAND_143[^{=]*=\s*\{\s*x:\s*0,\s*y:\s*0,\s*w:\s*FULL_IMAGE_WIDTH,\s*h:\s*FULL_IMAGE_HEIGHT/.test(source));
assert('1.90 and 2.39 bands use centered canonical ratios', /BAND_190[\s\S]*centeredBand\(AR_190\)[\s\S]*BAND_239[\s\S]*centeredBand\(AR_239\)/.test(source));

// Timeline contract from .ai/SPLASH_CHECKPOINT_PLAN.md.
const timeline = [
  ['opening end', 'PHASE_OPENING_END', 0.12],
  ['zoom/scope transition end', 'PHASE_SCOPE_TRANSITION_END', 0.24],
  ['scope hold end', 'PHASE_SCOPE_HOLD_END', 0.38],
  ['scope/1.90 transition end', 'PHASE_DIGITAL_TRANSITION_END', 0.5],
  ['1.90 hold end', 'PHASE_DIGITAL_HOLD_END', 0.64],
  ['1.90/1.43 transition end', 'PHASE_IMAX_TRANSITION_END', 0.76],
  ['1.43 hold end', 'PHASE_IMAX_HOLD_END', 0.9],
  ['comparison end', 'PHASE_COMPARISON_END', 1],
];
for (const [label, name, expected] of timeline) {
  assert(`${label} is ${expected}`, closeEnough(numberConstant(name), expected), `expected ${name} = ${expected}`);
}
assert('timeline constants are ordered', timeline.every(([, name], i) => i === 0 || numberConstant(name) >= numberConstant(timeline[i - 1][1])));
assert('track uses the planned 900svh height', /height\s*:\s*900svh\s*;/.test(css));
for (const [label, key, anchor] of [
  ['opening', 'opening', 0.04],
  ['scope', 'scope', 0.27],
  ['1.90', 'digital', 0.53],
  ['1.43', 'imax', 0.79],
  ['comparison', 'comparison', 0.93],
]) {
  const value = anchor.toString().replace('.', '\\.');
  assert(
    `${label} checkpoint anchor ${anchor} is represented`,
    new RegExp(`${key}:\\s*${value}`).test(source),
  );
}

// Transition and checkpoint semantics.
assert(
  'smootherstep helper is implemented',
  /function\s+smootherstep\s*\([^)]*\)[\s\S]*t\s*\*\*\s*3[\s\S]*t\s*\*\s*6\s*-\s*15/.test(source),
);
assert('smootherstep drives ratio transitions', /smootherstep\s*\(/.test(source));
assert('scope checkpoint is labeled 2.39:1', has('Standard Scope — 2.39:1') || has('Scope 2.39:1'));
assert('digital checkpoint is labeled 1.90:1', has('IMAX Digital — 1.90:1') || has('1.90:1'));
assert('full checkpoint is labeled 1.43:1', has('True IMAX — 1.43:1') || has('1.43:1'));
assert('comparison checkpoint contains all three ratio labels', ['2.39:1', '1.90:1', '1.43:1'].every((ratio) => has(ratio)));
assert('opening has a full-frame CTA', has('Show me the full frame'));
assert('opening has a diagnosis CTA', has('Diagnose my IMAX'));
assert(
  'checkpoint CTAs advance to explicit targets',
  /CHECKPOINT_ANCHORS\.(?:scope|digital|imax|comparison)/.test(source) &&
    /jumpToProgress/.test(source) &&
    /window\.scrollTo/.test(source),
);
assert('header exposes diagnosis CTA', /Diagnose my IMAX/i.test(nav) && /href\s*=|onClick\s*=/.test(nav));

// Accessibility branches that are reasonably inspectable without a browser.
assert('reduced-motion preference is read', /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/.test(source));
assert('reduced motion renders a static comparison branch', /staticMode\s*=\s*reducedMotion\s*\|\|[\s\S]*splash-zoom--static/.test(source));
assert('static comparison retains all ratio labels', ['2.39:1', '1.90:1', '1.43:1'].every((ratio) => source.includes(ratio)));
assert('splash interactive target has a 44px minimum', /\.splash-zoom-[^\{]+\{[\s\S]*?min-(?:width|height):\s*44px/.test(css) || /\.splash-zoom-skip[\s\S]*?min-(?:width|height):\s*44px/.test(css));

console.log(`\n${failed ? 'FAILED' : 'OK'}: ${passed} passed, ${failed} failed`);
if (failed) {
  console.error('Splash checkpoint regressions require review; this validator is intentionally fail-closed.');
}
process.exit(failed ? 1 : 0);
