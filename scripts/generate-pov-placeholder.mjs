// Generates the original LIEMAX 1.43:1 test-pattern placeholder shown on the
// virtual screens in the 3D POV module (ports in M4). 100% original,
// programmatically generated — no licensing concerns (see adjacent README).
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'web/public/assets/pov');
mkdirSync(outDir, { recursive: true });

const W = 1430;
const H = 1000; // 1.43:1

const gridLines = [];
for (let x = 0; x <= W; x += 71.5) {
  gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#2e2a24" stroke-width="1"/>`);
}
for (let y = 0; y <= H; y += 71.5) {
  gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#2e2a24" stroke-width="1"/>`);
}

// Aspect-ratio frame markers: 1.90 and 2.39 windows centered inside 1.43 frame
const arFrames = [
  { ar: 1.9, color: '#8a6d2f', label: '1.90:1' },
  { ar: 2.39, color: '#7a3b2e', label: '2.39:1' },
].map(({ ar, color, label }) => {
  const h = W / ar;
  const y = (H - h) / 2;
  return `<rect x="0" y="${y}" width="${W}" height="${h}" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="18 10"/>
  <text x="${W - 24}" y="${y + 42}" text-anchor="end" font-family="monospace" font-size="34" fill="${color}">${label}</text>`;
}).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#17140f"/>
  ${gridLines.join('\n  ')}
  <rect x="3" y="3" width="${W - 6}" height="${H - 6}" fill="none" stroke="#c9a24b" stroke-width="6"/>
  <text x="24" y="52" font-family="monospace" font-size="34" fill="#c9a24b">1.43:1 FULL FRAME</text>
  ${arFrames}
  <circle cx="${W / 2}" cy="${H / 2}" r="220" fill="none" stroke="#5a5348" stroke-width="3"/>
  <line x1="${W / 2 - 260}" y1="${H / 2}" x2="${W / 2 + 260}" y2="${H / 2}" stroke="#5a5348" stroke-width="3"/>
  <line x1="${W / 2}" y1="${H / 2 - 260}" x2="${W / 2}" y2="${H / 2 + 260}" stroke="#5a5348" stroke-width="3"/>
  <text x="${W / 2}" y="${H / 2 - 40}" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="bold" fill="#e8e0d0">LIEMAX</text>
  <text x="${W / 2}" y="${H / 2 + 56}" text-anchor="middle" font-family="monospace" font-size="36" fill="#9a9184">reference test pattern · original artwork</text>
</svg>
`;

writeFileSync(join(outDir, 'liemax-143-test-pattern.svg'), svg);
console.log('Wrote web/public/assets/pov/liemax-143-test-pattern.svg');
