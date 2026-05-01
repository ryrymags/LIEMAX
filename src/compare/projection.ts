import type { ResolvedProjection } from '../math/types';
import type { ComparisonLabels, ComparisonRow } from './types';
import { badgeForWinner, formatOneDecimal, formatRatio, makeMetricRow } from './verdict';

const DOLBY_VISION_FEATURE_NOTE =
  'Dolby Cinema is assumed to be a Dolby Vision feature presentation. Non-DV trailers or rare SDR bookings are edge cases outside the main comparison.';

export function isDolbyVisionProjection(projection: Pick<ResolvedProjection, 'hdr'>): boolean {
  return projection.hdr === 'dolby_vision';
}

export function usesDolbyVisionPresentation(
  aProjection: Pick<ResolvedProjection, 'hdr'>,
  bProjection: Pick<ResolvedProjection, 'hdr'>
): boolean {
  return isDolbyVisionProjection(aProjection) || isDolbyVisionProjection(bProjection);
}

export function buildBrightnessRow(
  aProjection: Pick<ResolvedProjection, 'brightness_fl' | 'hdr'>,
  bProjection: Pick<ResolvedProjection, 'brightness_fl' | 'hdr'>,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'brightness',
    label: 'Brightness',
    aValue: aProjection.brightness_fl,
    bValue: bProjection.brightness_fl,
    aDisplay: formatOneDecimal(aProjection.brightness_fl, 'fL'),
    bDisplay: formatOneDecimal(bProjection.brightness_fl, 'fL'),
    labels,
    note: usesDolbyVisionPresentation(aProjection, bProjection)
      ? 'Dolby Cinema brightness uses the Dolby Vision feature target.'
      : undefined,
  });
}

function isApproxSequentialContrast(projection: Pick<ResolvedProjection, 'hdr'>): boolean {
  return projection.hdr === 'dolby_vision';
}

export function buildNativeContrastRow(
  aProjection: Pick<ResolvedProjection, 'contrast_sequential' | 'hdr'>,
  bProjection: Pick<ResolvedProjection, 'contrast_sequential' | 'hdr'>,
  labels?: ComparisonLabels
): ComparisonRow {
  return makeMetricRow({
    id: 'native_contrast',
    label: 'Native contrast',
    aValue: aProjection.contrast_sequential,
    bValue: bProjection.contrast_sequential,
    aDisplay: formatRatio(aProjection.contrast_sequential, isApproxSequentialContrast(aProjection)),
    bDisplay: formatRatio(bProjection.contrast_sequential, isApproxSequentialContrast(bProjection)),
    labels,
    note: 'Sequential/on-off contrast only; Dolby Vision dynamic contrast is shown separately.',
  });
}

interface BlackLevelSystem {
  rank: number | null;
  display: string;
}

function describeBlackLevelSystem(
  projection: Pick<ResolvedProjection, 'hdr' | 'contrast_dynamic'>
): BlackLevelSystem {
  if (projection.hdr === 'dolby_vision') {
    return {
      rank: 3,
      display: projection.contrast_dynamic
        ? `Dolby Vision dynamic (${formatRatio(projection.contrast_dynamic)})`
        : 'Dolby Vision dynamic',
    };
  }

  if (projection.hdr === 'photochemical') {
    return { rank: 1, display: 'Photochemical latitude' };
  }

  if (projection.hdr === 'none') {
    return { rank: 0, display: 'SDR' };
  }

  return { rank: null, display: 'Unknown' };
}

export function buildHdrBlackLevelRow(
  aProjection: Pick<ResolvedProjection, 'hdr' | 'contrast_dynamic'>,
  bProjection: Pick<ResolvedProjection, 'hdr' | 'contrast_dynamic'>,
  labels: ComparisonLabels = {}
): ComparisonRow | null {
  const a = describeBlackLevelSystem(aProjection);
  const b = describeBlackLevelSystem(bProjection);

  if (a.rank === 0 && b.rank === 0) return null;

  let winner: ComparisonRow['winner'] = 'unknown';
  if (a.rank !== null && b.rank !== null) {
    if (a.rank === b.rank) winner = 'tie';
    else winner = a.rank > b.rank ? 'a' : 'b';
  }

  return {
    id: 'hdr_black_level',
    label: 'HDR black level',
    aDisplay: a.display,
    bDisplay: b.display,
    winner,
    badgeLabel: badgeForWinner(winner, labels),
    note: usesDolbyVisionPresentation(aProjection, bProjection)
      ? DOLBY_VISION_FEATURE_NOTE
      : 'Photochemical latitude is not digital HDR metadata.',
  };
}

export function buildPictureDepthRow(
  aProjection: Pick<ResolvedProjection, 'hdr' | 'contrast_dynamic' | 'contrast_sequential'>,
  bProjection: Pick<ResolvedProjection, 'hdr' | 'contrast_dynamic' | 'contrast_sequential'>,
  labels: ComparisonLabels = {}
): ComparisonRow | null {
  if (!usesDolbyVisionPresentation(aProjection, bProjection)) return null;

  const aDolbyVision = isDolbyVisionProjection(aProjection);
  const bDolbyVision = isDolbyVisionProjection(bProjection);
  const winner = aDolbyVision === bDolbyVision ? 'tie' : aDolbyVision ? 'a' : 'b';

  return {
    id: 'picture_depth',
    label: 'Picture depth',
    aDisplay: aDolbyVision ? 'Dolby Vision HDR depth' : 'Higher native contrast possible',
    bDisplay: bDolbyVision ? 'Dolby Vision HDR depth' : 'Higher native contrast possible',
    winner,
    badgeLabel: badgeForWinner(winner, labels),
    note: 'Overall picture depth favors Dolby Vision HDR when present; native sequential contrast remains a separate row.',
  };
}

export function buildProjectionComparisonRows(
  aProjection: ResolvedProjection,
  bProjection: ResolvedProjection,
  labels?: ComparisonLabels
): ComparisonRow[] {
  const rows = [
    buildBrightnessRow(aProjection, bProjection, labels),
    buildNativeContrastRow(aProjection, bProjection, labels),
  ];
  const hdrRow = buildHdrBlackLevelRow(aProjection, bProjection, labels);
  if (hdrRow) rows.push(hdrRow);
  const pictureDepthRow = buildPictureDepthRow(aProjection, bProjection, labels);
  if (pictureDepthRow) rows.push(pictureDepthRow);
  return rows;
}
