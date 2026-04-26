import type { ComputedMetrics, SeatPosition } from '../lib/computeMetrics';

type MetricsKind = 'venue' | 'home' | null;

interface ComparisonMetricsTableProps {
  leftLabel: string;
  rightLabel: string;
  leftMetrics: ComputedMetrics | null;
  rightMetrics: ComputedMetrics | null;
  leftKind: MetricsKind;
  rightKind: MetricsKind;
  leftSeatPosition: SeatPosition;
  rightSeatPosition: SeatPosition;
}

interface MetricCell {
  value: string;
  note?: string | null;
  tone?: 'default' | 'warning';
}

export function ComparisonMetricsTable({
  leftLabel,
  rightLabel,
  leftMetrics,
  rightMetrics,
  leftKind,
  rightKind,
  leftSeatPosition,
  rightSeatPosition,
}: ComparisonMetricsTableProps) {
  const rows = [
    metricRow('Screen size', screenSize(leftMetrics, leftKind), screenSize(rightMetrics, rightKind)),
    metricRow('Screen area', area(leftMetrics?.screenAreaSqFt ?? null), area(rightMetrics?.screenAreaSqFt ?? null)),
    metricRow('Presentation + masking', masking(leftMetrics), masking(rightMetrics)),
    metricRow('FOV horizontal', horizontalFov(leftMetrics, leftKind, leftSeatPosition), horizontalFov(rightMetrics, rightKind, rightSeatPosition)),
    metricRow('FOV vertical', verticalFov(leftMetrics), verticalFov(rightMetrics)),
    metricRow('PPD', ppd(leftMetrics), ppd(rightMetrics)),
    metricRow('Brightness', brightness(leftMetrics, leftKind), brightness(rightMetrics, rightKind)),
    metricRow('Contrast', contrast(leftMetrics), contrast(rightMetrics)),
    metricRow('Resolution', resolution(leftMetrics), resolution(rightMetrics)),
  ];

  return (
    <section className="comparison-table" aria-label="Aligned raw metrics">
      <div className="comparison-table__header" role="row">
        <span>Metric</span>
        <span>{shortLabel(leftLabel)}</span>
        <span>{shortLabel(rightLabel)}</span>
      </div>
      <div className="comparison-table__body">
        {rows.map((row) => (
          <div className="comparison-table__row" role="row" key={row.label}>
            <div className="comparison-table__metric">{row.label}</div>
            <MetricValue cell={row.left} />
            <MetricValue cell={row.right} />
          </div>
        ))}
      </div>
      <Warnings label={shortLabel(leftLabel)} metrics={leftMetrics} />
      <Warnings label={shortLabel(rightLabel)} metrics={rightMetrics} />
    </section>
  );
}

function MetricValue({ cell }: { cell: MetricCell }) {
  return (
    <div className={`comparison-table__value comparison-table__value--${cell.tone ?? 'default'}`}>
      <span>{cell.value}</span>
      {cell.note ? <small>{cell.note}</small> : null}
    </div>
  );
}

function Warnings({ label, metrics }: { label: string; metrics: ComputedMetrics | null }) {
  if (!metrics?.warnings.length) return null;
  return (
    <div className="comparison-table__warnings">
      <strong>{label}</strong>
      <ul>
        {metrics.warnings.map((warning) => <li key={warning}>{warning}</li>)}
      </ul>
    </div>
  );
}

function metricRow(label: string, left: MetricCell, right: MetricCell) {
  return { label, left, right };
}

function emptyCell(): MetricCell {
  return { value: '-' };
}

function screenSize(metrics: ComputedMetrics | null, kind: MetricsKind): MetricCell {
  if (!metrics) return emptyCell();
  if (metrics.screenWidthFt == null || metrics.screenHeightFt == null) return { value: '-', note: screenSizeNote(metrics) };
  const base = `${formatNumber(metrics.screenWidthFt, 1)} x ${formatNumber(metrics.screenHeightFt, 1)} ft`;
  const diagonal = kind === 'home' && metrics.screenDiagonalIn != null ? ` (${formatNumber(metrics.screenDiagonalIn, 1)}")` : '';
  return { value: `${base}${diagonal}`, note: screenSizeNote(metrics) };
}

function screenSizeNote(metrics: ComputedMetrics): string | null {
  return metrics.warnings.find((warning) => warning.startsWith('Side panels')) ?? null;
}

function area(value: number | null): MetricCell {
  return { value: value == null ? '-' : `${formatNumber(value, 0)} sq ft` };
}

function masking(metrics: ComputedMetrics | null): MetricCell {
  if (!metrics) return emptyCell();
  if (metrics.isDome) return { value: 'N/A' };
  if (metrics.contentAr == null || metrics.maskingMode == null) return emptyCell();
  const utilization = metrics.utilizationPct == null ? '' : ` (${formatPct(metrics.utilizationPct)} used)`;
  const cropNote = metrics.cropLossPct && metrics.cropLossPct > 0 ? `${formatPct(metrics.cropLossPct)} vertical frame lost` : null;
  return {
    value: `${formatNumber(metrics.contentAr, 2)}:1 -> ${metrics.maskingMode}${utilization}`,
    note: cropNote,
    tone: cropNote ? 'warning' : 'default',
  };
}

function horizontalFov(metrics: ComputedMetrics | null, kind: MetricsKind, seatPosition: SeatPosition): MetricCell {
  if (!metrics?.fovHorizontalDeg) return emptyCell();
  if (metrics.isDome) return { value: `${formatNumber(metrics.fovHorizontalDeg, 0)} deg`, note: 'dome; fixed, seat-independent' };
  if (kind === 'home') {
    return {
      value: `${formatNumber(metrics.fovHorizontalDeg, 0)} deg`,
      note: metrics.viewingDistanceFt == null ? null : `at ${formatNumber(metrics.viewingDistanceFt, 1)} ft`,
    };
  }
  return { value: `${formatNumber(metrics.fovHorizontalDeg, 0)} deg`, note: `at ${seatPosition}-row` };
}

function verticalFov(metrics: ComputedMetrics | null): MetricCell {
  if (!metrics?.fovVerticalDeg) return emptyCell();
  if (metrics.fovAboveHorizonDeg == null || metrics.fovBelowHorizonDeg == null) {
    return { value: `${formatNumber(metrics.fovVerticalDeg, 0)} deg` };
  }
  return {
    value: `${formatNumber(metrics.fovVerticalDeg, 0)} deg`,
    note: `${formatNumber(metrics.fovAboveHorizonDeg, 0)} deg above / ${formatNumber(metrics.fovBelowHorizonDeg, 0)} deg below`,
  };
}

function ppd(metrics: ComputedMetrics | null): MetricCell {
  if (!metrics) return emptyCell();
  if (metrics.ppdLow != null && metrics.ppdHigh != null) {
    return { value: `${formatNumber(metrics.ppdLow, 0)}-${formatNumber(metrics.ppdHigh, 0)} PPD`, note: metrics.ppdCaveat };
  }
  return { value: metrics.ppdValue == null ? '-' : `${formatNumber(metrics.ppdValue, 0)} PPD`, note: metrics.ppdCaveat };
}

function brightness(metrics: ComputedMetrics | null, kind: MetricsKind): MetricCell {
  if (!metrics) return emptyCell();
  if (kind === 'venue') {
    if (metrics.brightnessCinemaFl == null) return emptyCell();
    const nits = metrics.brightnessCinemaNits == null ? '' : ` (${formatNumber(metrics.brightnessCinemaNits, 0)} nits)`;
    return { value: `${formatNumber(metrics.brightnessCinemaFl, 0)} fL${nits}` };
  }

  const parts = [];
  if (metrics.brightnessHomeFullscreenNits != null) parts.push(`${formatNumber(metrics.brightnessHomeFullscreenNits, 0)} nits fullscreen`);
  if (metrics.brightnessPeakHdrNits != null) parts.push(`${formatNumber(metrics.brightnessPeakHdrNits, 0)} nits peak HDR`);
  if (metrics.brightnessSdrNits != null) parts.push(`${formatNumber(metrics.brightnessSdrNits, 0)} nits SDR`);
  return { value: parts.length === 0 ? '-' : parts.join(' / ') };
}

function contrast(metrics: ComputedMetrics | null): MetricCell {
  if (!metrics) return emptyCell();
  if (metrics.contrastIsInfinite) return { value: 'Infinite', note: 'per-pixel OLED' };
  if (metrics.contrastDynamic != null) {
    const sequential = metrics.contrastSequential == null
      ? null
      : `${formatNumber(metrics.contrastSequential, 0)}:1 sequential`;
    return {
      value: `${formatNumber(metrics.contrastDynamic, 0)}:1`,
      note: ['dynamic', sequential].filter(Boolean).join('; '),
    };
  }
  if (metrics.contrastSequential == null) return emptyCell();
  return { value: `${formatNumber(metrics.contrastSequential, 0)}:1`, note: 'sequential' };
}

function resolution(metrics: ComputedMetrics | null): MetricCell {
  if (!metrics) return emptyCell();
  if (metrics.resolutionHorizontalPx == null || metrics.resolutionVerticalPx == null) {
    return { value: metrics.resolutionLabel ?? '-' };
  }

  return {
    value: `${formatNumber(metrics.resolutionHorizontalPx, 0)} x ${formatNumber(metrics.resolutionVerticalPx, 0)}`,
    note: metrics.resolutionLabel,
  };
}

function shortLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}

function formatNumber(value: number, digits: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPct(value: number): string {
  return `${formatNumber(value, value >= 10 ? 0 : 1)}%`;
}
