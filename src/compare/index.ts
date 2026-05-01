export type {
  ComparisonWinner,
  ComparisonRow,
  ComparisonLabels,
  MetricRowInput,
} from './types';

export {
  badgeForWinner,
  winnerFromDisplayedValues,
  makeMetricRow,
  formatWholeNumber,
  formatOneDecimal,
  formatRatio,
} from './verdict';

export {
  buildFovRow,
  buildPpdRow,
  buildVisibleAreaRow,
  buildScreenUtilizationRow,
  buildOneDecimalMetricRow,
} from './metrics';

export {
  isDolbyVisionProjection,
  usesDolbyVisionPresentation,
  buildBrightnessRow,
  buildNativeContrastRow,
  buildHdrBlackLevelRow,
  buildPictureDepthRow,
  buildProjectionComparisonRows,
} from './projection';
