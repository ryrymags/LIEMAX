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
  const insights: Insight[] = [];
  addRatioInsight(insights, 'visible image area', leftLabel, rightLabel, left.effectiveAreaSqFt ?? left.screenAreaSqFt, right.effectiveAreaSqFt ?? right.screenAreaSqFt, 'larger');
  addRatioInsight(insights, 'horizontal FOV', leftLabel, rightLabel, left.fovHorizontalDeg, right.fovHorizontalDeg, 'wider');
  addRatioInsight(insights, 'PPD', leftLabel, rightLabel, left.ppdValue, right.ppdValue, 'sharper per degree');
  addBrightnessInsight(insights, leftLabel, rightLabel, left, right);
  addContrastInsight(insights, leftLabel, rightLabel, left, right);
  addMaskingInsight(insights, leftLabel, rightLabel, left, right);
  addResolutionInsight(insights, leftLabel, rightLabel, left, right);
  return insights
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((insight) => insight.text);
}

interface Insight {
  text: string;
  score: number;
}

function addRatioInsight(
  insights: Insight[],
  metric: string,
  leftLabel: string,
  rightLabel: string,
  leftValue: number | null,
  rightValue: number | null,
  adjective: string
): void {
  if (!leftValue || !rightValue) return;
  const ratio = leftValue / rightValue;
  const magnitude = ratio >= 1 ? ratio : 1 / ratio;
  if (magnitude < 1.08) return;
  const winner = ratio >= 1 ? shortLabel(leftLabel) : shortLabel(rightLabel);
  const score = scoreFor(metric, magnitude);
  insights.push({ text: `${winner} has ${magnitude.toFixed(1)}x ${adjective} ${metric}.`, score });
}

function addBrightnessInsight(insights: Insight[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  const leftNits = left.brightnessCinemaNits ?? left.brightnessHomeFullscreenNits;
  const rightNits = right.brightnessCinemaNits ?? right.brightnessHomeFullscreenNits;
  if (!leftNits || !rightNits) return;
  const ratio = leftNits / rightNits;
  const magnitude = ratio >= 1 ? ratio : 1 / ratio;
  if (magnitude < 1.15) return;
  const winner = ratio >= 1 ? shortLabel(leftLabel) : shortLabel(rightLabel);
  insights.push({ text: `${winner} is ${magnitude.toFixed(1)}x brighter by full-screen brightness.`, score: scoreFor('brightness', magnitude) });
}

function addContrastInsight(insights: Insight[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.contrastIsInfinite && !right.contrastIsInfinite) {
    insights.push({ text: `${shortLabel(leftLabel)} wins contrast with per-pixel black levels.`, score: 14 });
    return;
  }
  if (right.contrastIsInfinite && !left.contrastIsInfinite) {
    insights.push({ text: `${shortLabel(rightLabel)} wins contrast with per-pixel black levels.`, score: 14 });
    return;
  }
  addRatioInsight(insights, 'sequential contrast', leftLabel, rightLabel, left.contrastSequential, right.contrastSequential, 'higher');
}

function addMaskingInsight(insights: Insight[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.cropLossPct && left.cropLossPct > 0) {
    insights.push({ text: `${shortLabel(leftLabel)} crops ${left.cropLossPct.toFixed(1)}% of the selected frame.`, score: 18 + left.cropLossPct / 5 });
  }
  if (right.cropLossPct && right.cropLossPct > 0) {
    insights.push({ text: `${shortLabel(rightLabel)} crops ${right.cropLossPct.toFixed(1)}% of the selected frame.`, score: 18 + right.cropLossPct / 5 });
  }

  if (left.utilizationPct != null && right.utilizationPct != null) {
    const delta = Math.abs(left.utilizationPct - right.utilizationPct);
    if (delta >= 10) {
      const winner = left.utilizationPct > right.utilizationPct ? shortLabel(leftLabel) : shortLabel(rightLabel);
      insights.push({ text: `${winner} uses ${delta.toFixed(0)} percentage points more of its screen for this presentation AR.`, score: 16 + delta / 3 });
    }
  }
}

function addResolutionInsight(insights: Insight[], leftLabel: string, rightLabel: string, left: ComputedMetrics, right: ComputedMetrics): void {
  if (left.ppdLow != null && left.ppdHigh != null) {
    insights.push({ text: `${shortLabel(leftLabel)} uses film scan-equivalent detail: ${left.ppdLow.toFixed(0)}-${left.ppdHigh.toFixed(0)} PPD at this seat.`, score: 12 });
  }
  if (right.ppdLow != null && right.ppdHigh != null) {
    insights.push({ text: `${shortLabel(rightLabel)} uses film scan-equivalent detail: ${right.ppdLow.toFixed(0)}-${right.ppdHigh.toFixed(0)} PPD at this seat.`, score: 12 });
  }
}

function scoreFor(metric: string, magnitude: number): number {
  const base =
    metric === 'visible image area' ? 20 :
    metric === 'horizontal FOV' ? 24 :
    metric === 'PPD' ? 17 :
    metric === 'brightness' ? 15 :
    metric === 'sequential contrast' ? 13 :
    10;
  return base + Math.log2(magnitude) * 4;
}

function shortLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}
