import type { ComputedMetrics } from '../lib/computeMetrics';

interface ComparisonSummaryProps {
  leftLabel: string;
  rightLabel: string;
  leftMetrics: ComputedMetrics | null;
  rightMetrics: ComputedMetrics | null;
}

export function ComparisonSummary({ leftLabel, rightLabel, leftMetrics, rightMetrics }: ComparisonSummaryProps) {
  if (!leftMetrics || !rightMetrics) return null;
  const insights = buildInsights(leftLabel, rightLabel, leftMetrics, rightMetrics);
  if (insights.length === 0) return null;

  return (
    <section className="comparison-summary" aria-label="Comparison summary">
      <div>
        <span className="summary-eyebrow">Live comparison</span>
        <h2>{insights[0]}</h2>
      </div>
      <ul>
        {insights.slice(1).map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </section>
  );
}

function buildInsights(leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): string[] {
  const insights: string[] = [];
  addRatioInsight(insights, 'visible image area', leftLabel, rightLabel, left.effectiveAreaSqFt ?? left.screenAreaSqFt, right.effectiveAreaSqFt ?? right.screenAreaSqFt, 'larger');
  addRatioInsight(insights, 'horizontal FOV', leftLabel, rightLabel, left.fovHorizontalDeg, right.fovHorizontalDeg, 'wider');
  addRatioInsight(insights, 'PPD', leftLabel, rightLabel, left.ppdValue, right.ppdValue, 'sharper per degree');
  addBrightnessInsight(insights, leftLabel, rightLabel, left, right);
  addContrastInsight(insights, leftLabel, rightLabel, left, right);
  addMaskingInsight(insights, leftLabel, rightLabel, left, right);
  addResolutionInsight(insights, leftLabel, rightLabel, left, right);
  return insights;
}

function addRatioInsight(
  insights: string[],
  metric: string,
  leftLabel: string,
  rightLabel: string,
  leftValue: number | null,
  rightValue: number | null,
  adjective: string
): void {
  if (!leftValue || !rightValue) return;
  const ratio = leftValue / rightValue;
  if (ratio >= 1.05) {
    insights.push(`${shortLabel(leftLabel)} has ${ratio.toFixed(1)}x ${adjective} ${metric}.`);
  } else if (ratio <= 0.95) {
    insights.push(`${shortLabel(rightLabel)} has ${(1 / ratio).toFixed(1)}x ${adjective} ${metric}.`);
  } else {
    insights.push(`${shortLabel(leftLabel)} and ${shortLabel(rightLabel)} are nearly tied on ${metric}.`);
  }
}

function addBrightnessInsight(insights: string[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  const leftNits = left.brightnessCinemaNits ?? left.brightnessHomeFullscreenNits;
  const rightNits = right.brightnessCinemaNits ?? right.brightnessHomeFullscreenNits;
  if (!leftNits || !rightNits) return;
  const ratio = leftNits / rightNits;
  if (ratio >= 1.05) {
    insights.push(`${shortLabel(leftLabel)} is ${ratio.toFixed(1)}x brighter by full-screen brightness.`);
  } else if (ratio <= 0.95) {
    insights.push(`${shortLabel(rightLabel)} is ${(1 / ratio).toFixed(1)}x brighter by full-screen brightness.`);
  }
}

function addContrastInsight(insights: string[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.contrastIsInfinite && !right.contrastIsInfinite) {
    insights.push(`${shortLabel(leftLabel)} wins contrast with per-pixel black levels.`);
    return;
  }
  if (right.contrastIsInfinite && !left.contrastIsInfinite) {
    insights.push(`${shortLabel(rightLabel)} wins contrast with per-pixel black levels.`);
    return;
  }
  addRatioInsight(insights, 'sequential contrast', leftLabel, rightLabel, left.contrastSequential, right.contrastSequential, 'higher');
}

function addMaskingInsight(insights: string[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.cropLossPct && left.cropLossPct > 0) {
    insights.push(`${shortLabel(leftLabel)} crops ${left.cropLossPct.toFixed(1)}% of the selected frame.`);
  }
  if (right.cropLossPct && right.cropLossPct > 0) {
    insights.push(`${shortLabel(rightLabel)} crops ${right.cropLossPct.toFixed(1)}% of the selected frame.`);
  }
}

function addResolutionInsight(insights: string[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.ppdLow != null && left.ppdHigh != null) {
    insights.push(`${shortLabel(leftLabel)} uses film scan-equivalent detail: ${left.ppdLow.toFixed(0)}-${left.ppdHigh.toFixed(0)} PPD at this seat.`);
  }
  if (right.ppdLow != null && right.ppdHigh != null) {
    insights.push(`${shortLabel(rightLabel)} uses film scan-equivalent detail: ${right.ppdLow.toFixed(0)}-${right.ppdHigh.toFixed(0)} PPD at this seat.`);
  }
}

function shortLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}
