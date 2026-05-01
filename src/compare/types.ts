/**
 * UI-facing comparison result types.
 *
 * This layer intentionally lives outside src/math: the math engine produces
 * values, while compare turns those values into display-safe verdict rows.
 */

export type ComparisonWinner = 'a' | 'b' | 'tie' | 'unknown';

export interface ComparisonRow {
  id: string;
  label: string;
  aDisplay: string;
  bDisplay: string;
  winner: ComparisonWinner;
  badgeLabel: string;
  note?: string;
}

export interface ComparisonLabels {
  aName?: string;
  bName?: string;
}

export interface MetricRowInput {
  id: string;
  label: string;
  aValue: number | null | undefined;
  bValue: number | null | undefined;
  aDisplay: string;
  bDisplay: string;
  higherIsBetter?: boolean;
  labels?: ComparisonLabels;
  note?: string;
}
