import type { ComparisonLabels, ComparisonRow, ComparisonWinner, MetricRowInput } from './types';

function isFiniteMetric(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function badgeForWinner(winner: ComparisonWinner, labels: ComparisonLabels = {}): string {
  if (winner === 'a') return `${labels.aName ?? 'A'} wins`;
  if (winner === 'b') return `${labels.bName ?? 'B'} wins`;
  if (winner === 'tie') return 'Comparable';
  return 'Unknown';
}

/**
 * Display-aware verdicts: if the rendered values match, the row is comparable
 * even when hidden decimals differ. This prevents "66 vs 66, B wins" UI bugs.
 */
export function winnerFromDisplayedValues(
  aValue: number | null | undefined,
  bValue: number | null | undefined,
  aDisplay: string,
  bDisplay: string,
  higherIsBetter = true
): ComparisonWinner {
  if (!isFiniteMetric(aValue) || !isFiniteMetric(bValue)) return 'unknown';
  if (aDisplay === bDisplay) return 'tie';
  if (aValue === bValue) return 'tie';

  const aWins = higherIsBetter ? aValue > bValue : aValue < bValue;
  return aWins ? 'a' : 'b';
}

export function makeMetricRow(input: MetricRowInput): ComparisonRow {
  const winner = winnerFromDisplayedValues(
    input.aValue,
    input.bValue,
    input.aDisplay,
    input.bDisplay,
    input.higherIsBetter ?? true
  );

  return {
    id: input.id,
    label: input.label,
    aDisplay: input.aDisplay,
    bDisplay: input.bDisplay,
    winner,
    badgeLabel: badgeForWinner(winner, input.labels),
    note: input.note,
  };
}

export function formatWholeNumber(value: number | null | undefined, unit = ''): string {
  if (!isFiniteMetric(value)) return 'Unknown';
  return `${Math.round(value).toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`;
}

export function formatOneDecimal(value: number | null | undefined, unit = ''): string {
  if (!isFiniteMetric(value)) return 'Unknown';
  return `${value.toFixed(1)}${unit ? ` ${unit}` : ''}`;
}

export function formatRatio(value: number | null | undefined, approximate = false): string {
  if (!isFiniteMetric(value)) return 'Unknown';
  return `${approximate ? '~' : ''}${Math.round(value).toLocaleString('en-US')}:1`;
}
