import type { ComparisonLabels, ComparisonRow } from './types';
import { formatOneDecimal, formatWholeNumber, makeMetricRow } from './verdict';

export function buildFovRow(
  aHorizontalDeg: number | null | undefined,
  bHorizontalDeg: number | null | undefined,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'horizontal_fov',
    label: 'Horizontal FOV',
    aValue: aHorizontalDeg,
    bValue: bHorizontalDeg,
    aDisplay: formatWholeNumber(aHorizontalDeg, 'deg'),
    bDisplay: formatWholeNumber(bHorizontalDeg, 'deg'),
    labels,
  });
}

export function buildPpdRow(
  aPpd: number | null | undefined,
  bPpd: number | null | undefined,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'pixels_per_degree',
    label: 'Pixels per degree',
    aValue: aPpd,
    bValue: bPpd,
    aDisplay: formatWholeNumber(aPpd, 'ppd'),
    bDisplay: formatWholeNumber(bPpd, 'ppd'),
    labels,
  });
}

export function buildVisibleAreaRow(
  aAreaSqft: number | null | undefined,
  bAreaSqft: number | null | undefined,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'visible_area',
    label: 'Visible content',
    aValue: aAreaSqft,
    bValue: bAreaSqft,
    aDisplay: formatWholeNumber(aAreaSqft, 'sq ft'),
    bDisplay: formatWholeNumber(bAreaSqft, 'sq ft'),
    labels,
  });
}

export function buildScreenUtilizationRow(
  aUtilizationPct: number | null | undefined,
  bUtilizationPct: number | null | undefined,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'screen_utilization',
    label: 'Screen utilization',
    aValue: aUtilizationPct,
    bValue: bUtilizationPct,
    aDisplay: formatWholeNumber(aUtilizationPct, '%'),
    bDisplay: formatWholeNumber(bUtilizationPct, '%'),
    labels,
  });
}

export function buildOneDecimalMetricRow(
  id: string,
  label: string,
  aValue: number | null | undefined,
  bValue: number | null | undefined,
  unit = '',
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id,
    label,
    aValue,
    bValue,
    aDisplay: formatOneDecimal(aValue, unit),
    bDisplay: formatOneDecimal(bValue, unit),
    labels,
  });
}
