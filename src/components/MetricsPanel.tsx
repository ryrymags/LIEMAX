import type { ComputedMetrics, SeatPosition } from '../lib/computeMetrics';
import { MetricRow } from './MetricRow';

interface MetricsPanelProps {
  metrics: ComputedMetrics | null;
  kind: 'venue' | 'home' | null;
  seatPosition: SeatPosition;
}

export function MetricsPanel({ metrics, kind, seatPosition }: MetricsPanelProps) {
  if (!metrics) {
    return <p className="empty-panel">Select an item to see metrics.</p>;
  }

  return (
    <section className="metrics-panel" aria-label="Computed metrics">
      <dl>
        <MetricRow label="Screen size" value={screenSize(metrics, kind)} note={screenSizeNote(metrics)} />
        <MetricRow label="Screen area" value={area(metrics.screenAreaSqFt)} />
        <MetricRow
          label="Content + masking"
          value={masking(metrics)}
          note={metrics.cropLossPct && metrics.cropLossPct > 0 ? `${formatPct(metrics.cropLossPct)} vertical frame lost` : null}
          tone={metrics.cropLossPct && metrics.cropLossPct > 0 ? 'warning' : 'default'}
        />
        <MetricRow label="FOV horizontal" value={horizontalFov(metrics, kind, seatPosition)} />
        <MetricRow label="FOV vertical" value={verticalFov(metrics)} />
        <MetricRow label="PPD" value={ppd(metrics)} note={metrics.ppdCaveat} />
        <MetricRow label="Brightness" value={brightness(metrics, kind)} />
        <MetricRow label="Contrast" value={contrast(metrics)} />
        <MetricRow label="Resolution" value={resolution(metrics)} />
      </dl>

      {metrics.warnings.length > 0 ? (
        <ul className="metric-warnings">
          {metrics.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function screenSize(metrics: ComputedMetrics, kind: MetricsPanelProps['kind']): string {
  if (metrics.screenWidthFt == null || metrics.screenHeightFt == null) return '—';
  const base = `${formatNumber(metrics.screenWidthFt, 1)} x ${formatNumber(metrics.screenHeightFt, 1)} ft`;
  return kind === 'home' && metrics.screenDiagonalIn != null
    ? `${base} (${formatNumber(metrics.screenDiagonalIn, 1)}")`
    : base;
}

function screenSizeNote(metrics: ComputedMetrics): string | null {
  return metrics.warnings.find((warning) => warning.startsWith('Side panels')) ?? null;
}

function area(value: number | null): string {
  return value == null ? '—' : `${formatNumber(value, 0)} sq ft`;
}

function masking(metrics: ComputedMetrics): string {
  if (metrics.isDome) return 'N/A';
  if (metrics.contentAr == null || metrics.maskingMode == null) return '—';
  const utilization = metrics.utilizationPct == null ? '' : ` (${formatPct(metrics.utilizationPct)} used)`;
  return `${formatNumber(metrics.contentAr, 2)}:1 -> ${metrics.maskingMode}${utilization}`;
}

function horizontalFov(metrics: ComputedMetrics, kind: MetricsPanelProps['kind'], seatPosition: SeatPosition): string {
  if (metrics.fovHorizontalDeg == null) return '—';
  if (metrics.isDome) return `${formatNumber(metrics.fovHorizontalDeg, 0)} deg (dome - fixed, seat-independent)`;
  if (kind === 'home') {
    return metrics.viewingDistanceFt == null
      ? `${formatNumber(metrics.fovHorizontalDeg, 0)} deg`
      : `${formatNumber(metrics.fovHorizontalDeg, 0)} deg at ${formatNumber(metrics.viewingDistanceFt, 1)} ft`;
  }
  return `${formatNumber(metrics.fovHorizontalDeg, 0)} deg at ${seatPosition}-row`;
}

function verticalFov(metrics: ComputedMetrics): string {
  if (metrics.fovVerticalDeg == null) return '—';
  if (metrics.fovAboveHorizonDeg == null || metrics.fovBelowHorizonDeg == null) {
    return `${formatNumber(metrics.fovVerticalDeg, 0)} deg`;
  }
  return `${formatNumber(metrics.fovVerticalDeg, 0)} deg (${formatNumber(metrics.fovAboveHorizonDeg, 0)} deg above / ${formatNumber(metrics.fovBelowHorizonDeg, 0)} deg below)`;
}

function ppd(metrics: ComputedMetrics): string {
  if (metrics.ppdLow != null && metrics.ppdHigh != null) {
    return `${formatNumber(metrics.ppdLow, 0)}-${formatNumber(metrics.ppdHigh, 0)} PPD (film range)`;
  }
  return metrics.ppdValue == null ? '—' : `${formatNumber(metrics.ppdValue, 0)} PPD`;
}

function brightness(metrics: ComputedMetrics, kind: MetricsPanelProps['kind']): string {
  if (kind === 'venue') {
    if (metrics.brightnessCinemaFl == null) return '—';
    const nits = metrics.brightnessCinemaNits == null ? null : ` (${formatNumber(metrics.brightnessCinemaNits, 0)} nits)`;
    return `${formatNumber(metrics.brightnessCinemaFl, 0)} fL${nits ?? ''}`;
  }

  const parts = [];
  if (metrics.brightnessHomeFullscreenNits != null) {
    parts.push(`${formatNumber(metrics.brightnessHomeFullscreenNits, 0)} nits fullscreen`);
  }
  if (metrics.brightnessPeakHdrNits != null) {
    parts.push(`${formatNumber(metrics.brightnessPeakHdrNits, 0)} nits peak HDR`);
  }
  if (metrics.brightnessSdrNits != null) {
    parts.push(`${formatNumber(metrics.brightnessSdrNits, 0)} nits SDR`);
  }
  return parts.length === 0 ? '—' : parts.join(' / ');
}

function contrast(metrics: ComputedMetrics): string {
  if (metrics.contrastIsInfinite) return 'Infinite (per-pixel OLED)';
  if (metrics.contrastSequential == null) return '—';
  return `${formatNumber(metrics.contrastSequential, 0)}:1 sequential`;
}

function resolution(metrics: ComputedMetrics): string {
  if (metrics.resolutionHorizontalPx == null || metrics.resolutionVerticalPx == null) {
    return metrics.resolutionLabel ?? '—';
  }

  const label = metrics.resolutionLabel ? ` (${metrics.resolutionLabel})` : '';
  return `${formatNumber(metrics.resolutionHorizontalPx, 0)} x ${formatNumber(metrics.resolutionVerticalPx, 0)}${label}`;
}

function formatNumber(value: number, digits: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : 0,
  }).format(value);
}

function formatPct(value: number): string {
  return `${formatNumber(value, value >= 10 ? 0 : 1)}%`;
}
