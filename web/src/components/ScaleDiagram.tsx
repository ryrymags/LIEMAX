// Human-vs-screen scale SVG (Bible §4.2.3 / Block 2). Fails closed: renders
// the "no measurements" note instead of a diagram when dimensions are
// unknown or zero — never fabricate a scale (COMPLIANCE.md: SVGs need a
// data-bearing text alternative, not a generic label).
import type { Venue } from '../lib/data';

const PERSON_HEIGHT_FT = 5.7;

// Typical GT-class True IMAX reference screen, per .ai/OVERHAUL_BIBLE.md
// §4.2.3 / Block 2 ("True IMAX screens are typically 80-100 ft wide and
// 60-70 ft tall"); used as the fixed comparison screen in this diagram.
const TRUE_IMAX_REFERENCE_WIDTH_FT = 101;
const TRUE_IMAX_REFERENCE_HEIGHT_FT = 76;

function isDome(venue: Venue): boolean {
  return venue.screen.geometry === 'hemispherical';
}

function hasKnownScreen(venue: Venue): boolean {
  const { w, h } = venue.screen;
  return typeof w === 'number' && w > 0 && typeof h === 'number' && h > 0;
}

interface ScaleDiagramProps {
  venue: Venue;
}

function PersonSilhouette({
  x,
  pxPerFt,
  baselineY,
}: {
  x: number;
  pxPerFt: number;
  baselineY: number;
}) {
  // Anchored so the feet stand on baselineY (the same ground line the
  // screens sit on).
  const heightPx = PERSON_HEIGHT_FT * pxPerFt;
  const topY = baselineY - heightPx;
  const headR = heightPx * 0.09;
  const bodyW = heightPx * 0.22;
  const bodyTop = headR * 2;
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={topY + headR} r={headR} fill="currentColor" opacity={0.6} />
      <rect
        x={x - bodyW / 2}
        y={topY + bodyTop}
        width={bodyW}
        height={heightPx - bodyTop}
        rx={bodyW * 0.3}
        fill="currentColor"
        opacity={0.6}
      />
    </g>
  );
}

function DomeDiagram({ venue }: { venue: Venue }) {
  const diameterFt = venue.screen.w as number;
  const size = 320;
  const r = size / 2 - 20;
  const cx = size / 2;
  // Baseline must sit inside the viewBox (height = size / 1.6 = 200).
  const cy = size / 1.6 - 30;
  const label = `${Math.round(diameterFt)} ft dome`;
  const ariaLabel = `${venue.name} projects onto a dome about ${Math.round(
    diameterFt,
  )} feet across, wrapping roughly 180 degrees around the audience.`;

  return (
    <figure className="scale-diagram-wrap">
      <svg viewBox={`0 0 ${size} ${size / 1.6}`} role="img" aria-label={ariaLabel}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth={2} />
        <PersonSilhouette x={cx} pxPerFt={r / (diameterFt / 2)} baselineY={cy} />
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize={12} fill="currentColor">
          {label}
        </text>
      </svg>
      <p className="scale-diagram-caption">
        The screen curls up and over you — about 180° of your horizontal field of view — instead
        of sitting flat in front of you.
      </p>
    </figure>
  );
}

export default function ScaleDiagram({ venue }: ScaleDiagramProps) {
  if (isDome(venue) && typeof venue.screen.w === 'number' && venue.screen.w > 0) {
    return <DomeDiagram venue={venue} />;
  }

  if (!hasKnownScreen(venue)) {
    return (
      <p className="no-measurements-note">
        We don't have verified screen measurements for this location yet, so we can't draw an
        accurate size comparison.
      </p>
    );
  }

  const wFt = venue.screen.w as number;
  const hFt = venue.screen.h as number;
  const refW = TRUE_IMAX_REFERENCE_WIDTH_FT;
  const refH = TRUE_IMAX_REFERENCE_HEIGHT_FT;

  const maxHeightFt = Math.max(hFt, refH, PERSON_HEIGHT_FT);
  const svgHeight = 260;
  const pxPerFt = svgHeight / (maxHeightFt * 1.15);

  const groupGap = 40;
  const personX = 30;
  const yourScreenX = personX + 70;
  const yourScreenW = wFt * pxPerFt;
  const yourScreenH = hFt * pxPerFt;
  const trueScreenX = yourScreenX + yourScreenW + groupGap;
  const trueScreenW = refW * pxPerFt;
  const trueScreenH = refH * pxPerFt;
  const svgWidth = trueScreenX + trueScreenW + 30;

  const heightRatio = refH / hFt;
  const heightComparison =
    heightRatio >= 1.8
      ? 'nearly twice as tall'
      : heightRatio >= 1.3
        ? 'noticeably taller'
        : heightRatio >= 1.05
          ? 'a bit taller'
          : 'about the same height';

  const ariaLabel = `Your screen is ${Math.round(wFt)} by ${Math.round(
    hFt,
  )} feet — a True IMAX screen is ${heightComparison}.`;

  return (
    <figure className="scale-diagram-wrap">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-label={ariaLabel}
        style={{ color: 'var(--color-text)' }}
      >
        <line
          x1={0}
          y1={svgHeight}
          x2={svgWidth}
          y2={svgHeight}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.3}
        />
        <PersonSilhouette x={personX} pxPerFt={pxPerFt} baselineY={svgHeight} />
        <g>
          <rect
            x={yourScreenX}
            y={svgHeight - yourScreenH}
            width={yourScreenW}
            height={yourScreenH}
            fill="none"
            stroke="var(--tier-lite)"
            strokeWidth={2}
          />
          <text
            x={yourScreenX + yourScreenW / 2}
            y={svgHeight - yourScreenH - 8}
            textAnchor="middle"
            fontSize={12}
            fill="currentColor"
          >
            Your screen
          </text>
        </g>
        <g>
          <rect
            x={trueScreenX}
            y={svgHeight - trueScreenH}
            width={trueScreenW}
            height={trueScreenH}
            fill="none"
            stroke="var(--tier-true)"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <text
            x={trueScreenX + trueScreenW / 2}
            y={svgHeight - trueScreenH - 8}
            textAnchor="middle"
            fontSize={12}
            fill="currentColor"
          >
            True IMAX
          </text>
        </g>
      </svg>
      <p className="scale-diagram-caption">{ariaLabel}</p>
    </figure>
  );
}
