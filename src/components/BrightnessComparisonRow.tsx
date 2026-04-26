import { compareBrightness } from '../math';
import type { ComputedMetrics } from '../lib/computeMetrics';

interface BrightnessComparisonRowProps {
  leftLabel: string;
  rightLabel: string;
  leftMetrics: ComputedMetrics | null;
  rightMetrics: ComputedMetrics | null;
}

export function BrightnessComparisonRow({ leftLabel, rightLabel, leftMetrics, rightMetrics }: BrightnessComparisonRowProps) {
  const comparison = getComparison(leftLabel, rightLabel, leftMetrics, rightMetrics);
  if (!comparison) return null;

  return (
    <section className="brightness-comparison" aria-label="Brightness comparison">
      <strong>{comparison.summary}</strong>
      <span>{comparison.detail}</span>
    </section>
  );
}

function getComparison(
  leftLabel: string,
  rightLabel: string,
  leftMetrics: ComputedMetrics | null,
  rightMetrics: ComputedMetrics | null
): { summary: string; detail: string } | null {
  if (!leftMetrics || !rightMetrics) return null;

  if (leftMetrics.brightnessCinemaFl != null && rightMetrics.brightnessHomeFullscreenNits != null) {
    return formatComparison(leftLabel, rightLabel, leftMetrics.brightnessCinemaFl, rightMetrics.brightnessHomeFullscreenNits);
  }

  if (rightMetrics.brightnessCinemaFl != null && leftMetrics.brightnessHomeFullscreenNits != null) {
    return formatComparison(rightLabel, leftLabel, rightMetrics.brightnessCinemaFl, leftMetrics.brightnessHomeFullscreenNits);
  }

  return null;
}

function formatComparison(
  cinemaLabel: string,
  homeLabel: string,
  cinemaFl: number,
  homeFullscreenNits: number
): { summary: string; detail: string } | null {
  if (cinemaFl <= 0 || homeFullscreenNits <= 0) return null;
  const comparison = compareBrightness(cinemaFl, homeFullscreenNits);
  const ratio = comparison.ratio_home_to_cinema;
  const summary = ratio >= 1
    ? `${homeLabel} is ${ratio.toFixed(1)}x brighter at full-screen`
    : `${cinemaLabel} is ${(1 / ratio).toFixed(1)}x brighter than full-screen home`;

  return {
    summary,
    detail: `${cinemaLabel}: ${comparison.cinema_fl.toFixed(0)} fL (${comparison.cinema_nits.toFixed(0)} nits). ${homeLabel}: ${comparison.home_nits.toFixed(0)} nits fullscreen.`,
  };
}
