import { useEffect, useMemo, useState } from 'react';
import { CONTENT_FORMATS } from './data';
import { load143190Venues } from './data/csvLoader';
import { getComparableItems, resolveItem, type ComparableItem } from './data/comparables';
import { computeHomeMetrics, computeVenueMetrics, type ComputedMetrics, type SeatPosition } from './lib/computeMetrics';
import { AspectRatioControl } from './components/AspectRatioControl';
import { ComparisonSummary } from './components/ComparisonSummary';
import { CsvLoadStatusBar } from './components/CsvLoadStatusBar';
import { ItemSelector } from './components/ItemSelector';
import { MetricsPanel } from './components/MetricsPanel';
import { ProjectionModePicker } from './components/ProjectionModePicker';
import { SeatPositionPicker } from './components/SeatPositionPicker';
import type { ContentFormat, ResolvedProjection, ResolvedVenue } from './math';

type CsvLoadStatus = 'loading' | 'ready' | 'failed';
type ResolvedKind = 'venue' | 'home' | null;
type ArMode = 'auto' | 'custom';

function App() {
  const [sideAId, setSideAId] = useState<string | null>(null);
  const [sideBId, setSideBId] = useState<string | null>(null);
  const [sideAProjectionId, setSideAProjectionId] = useState<string | null>(null);
  const [sideBProjectionId, setSideBProjectionId] = useState<string | null>(null);
  const [sideAAr, setSideAAr] = useState<number | null>(null);
  const [sideBAr, setSideBAr] = useState<number | null>(null);
  const [sideAArMode, setSideAArMode] = useState<ArMode>('auto');
  const [sideBArMode, setSideBArMode] = useState<ArMode>('auto');
  const [seatPosition, setSeatPosition] = useState<SeatPosition>('mid');
  const [csvVenues, setCsvVenues] = useState<Record<string, any>[]>([]);
  const [csvLoadStatus, setCsvLoadStatus] = useState<CsvLoadStatus>('loading');
  const [csvLoadSource, setCsvLoadSource] = useState<'cache' | 'network' | 'failed' | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    load143190Venues().then((result) => {
      if (cancelled) return;
      setCsvVenues(result.venues);
      setCsvLoadSource(result.source);
      setCsvError(result.error ?? null);
      setCsvLoadStatus(result.source === 'failed' ? 'failed' : 'ready');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const comparableItems = useMemo(() => getComparableItems(csvVenues), [csvVenues]);

  useEffect(() => {
    if (comparableItems.length === 0) return;

    setSideAId((current) => current ?? comparableItems.find((item) => item.id === 'venue:apple_providence_imax')?.id ?? comparableItems[0].id);
    setSideBId((current) => current ?? comparableItems.find((item) => item.id === 'home:oled_flagship')?.id ?? comparableItems[1]?.id ?? comparableItems[0].id);
  }, [comparableItems]);

  const itemA = comparableItems.find((item) => item.id === sideAId) ?? null;
  const itemB = comparableItems.find((item) => item.id === sideBId) ?? null;
  const resolvedA = itemA ? resolveItem(itemA) : null;
  const resolvedB = itemB ? resolveItem(itemB) : null;
  const projectionOptionsA = projectionOptions(resolvedA);
  const projectionOptionsB = projectionOptions(resolvedB);
  const activeProjectionIdA = activeProjectionId(projectionOptionsA, sideAProjectionId);
  const activeProjectionIdB = activeProjectionId(projectionOptionsB, sideBProjectionId);
  const activeResolvedA = withActiveProjection(resolvedA, activeProjectionIdA);
  const activeResolvedB = withActiveProjection(resolvedB, activeProjectionIdB);
  const defaultArA = bestNativeAr(activeResolvedA);
  const defaultArB = bestNativeAr(activeResolvedB);

  useEffect(() => {
    if (sideAArMode === 'auto') setSideAAr(defaultArA);
  }, [defaultArA, sideAArMode]);

  useEffect(() => {
    if (sideBArMode === 'auto') setSideBAr(defaultArB);
  }, [defaultArB, sideBArMode]);

  const presentationArA = sideAAr ?? defaultArA;
  const presentationArB = sideBAr ?? defaultArB;
  const metricsA = activeResolvedA && presentationArA ? computeMetrics(activeResolvedA, contentFormatFromAr(presentationArA), seatPosition) : null;
  const metricsB = activeResolvedB && presentationArB ? computeMetrics(activeResolvedB, contentFormatFromAr(presentationArB), seatPosition) : null;

  return (
    <main className="app-shell">
      <Header />
      <section className="comparison-controls comparison-controls--seat-only" aria-label="Comparison controls">
        <SeatPositionPicker value={seatPosition} onChange={setSeatPosition} />
      </section>

      <section className="comparison-layout" aria-label="Screen comparison">
        <SidePanel
          label="A"
          item={itemA}
          items={comparableItems}
          metrics={metricsA}
          resolvedKind={resolvedA?.type ?? null}
          selectedId={sideAId}
          seatPosition={seatPosition}
          projectionOptions={projectionOptionsA}
          activeProjectionId={activeProjectionIdA}
          presentationAr={presentationArA}
          defaultAr={defaultArA}
          arMode={sideAArMode}
          onSelect={(id) => {
            setSideAId(id);
            setSideAProjectionId(null);
            setSideAAr(null);
            setSideAArMode('auto');
          }}
          onProjectionSelect={(id) => {
            setSideAProjectionId(id);
            setSideAAr(null);
            setSideAArMode('auto');
          }}
          onAspectRatioChange={(value, mode) => {
            setSideAAr(value);
            setSideAArMode(mode);
          }}
        />
        <SidePanel
          label="B"
          item={itemB}
          items={comparableItems}
          metrics={metricsB}
          resolvedKind={resolvedB?.type ?? null}
          selectedId={sideBId}
          seatPosition={seatPosition}
          projectionOptions={projectionOptionsB}
          activeProjectionId={activeProjectionIdB}
          presentationAr={presentationArB}
          defaultAr={defaultArB}
          arMode={sideBArMode}
          onSelect={(id) => {
            setSideBId(id);
            setSideBProjectionId(null);
            setSideBAr(null);
            setSideBArMode('auto');
          }}
          onProjectionSelect={(id) => {
            setSideBProjectionId(id);
            setSideBAr(null);
            setSideBArMode('auto');
          }}
          onAspectRatioChange={(value, mode) => {
            setSideBAr(value);
            setSideBArMode(mode);
          }}
        />
      </section>

      <ComparisonSummary
        leftLabel={itemA?.label ?? 'Side A'}
        rightLabel={itemB?.label ?? 'Side B'}
        leftMetrics={metricsA}
        rightMetrics={metricsB}
      />

      <CsvLoadStatusBar
        status={csvLoadStatus}
        source={csvLoadSource}
        venueCount={csvVenues.length}
        error={csvError}
      />
    </main>
  );
}

function Header() {
  return (
    <header className="app-header">
      <h1>LIEMAX</h1>
      <p>Compare cinema formats, real IMAX venues, and home displays from a real seat.</p>
    </header>
  );
}

interface SidePanelProps {
  label: string;
  item: ComparableItem | null;
  items: ComparableItem[];
  metrics: ComputedMetrics | null;
  resolvedKind: ResolvedKind;
  selectedId: string | null;
  seatPosition: SeatPosition;
  onSelect: (id: string) => void;
  projectionOptions: ProjectionOption[];
  activeProjectionId: string | null;
  presentationAr: number | null;
  defaultAr: number | null;
  arMode: ArMode;
  onProjectionSelect: (id: string) => void;
  onAspectRatioChange: (value: number, mode: ArMode) => void;
}

function SidePanel({
  label,
  item,
  items,
  metrics,
  resolvedKind,
  selectedId,
  seatPosition,
  onSelect,
  projectionOptions,
  activeProjectionId,
  presentationAr,
  defaultAr,
  arMode,
  onProjectionSelect,
  onAspectRatioChange,
}: SidePanelProps) {
  return (
    <article className="side-panel">
      <div className="side-panel__header">
        <span className="side-panel__eyebrow">Side {label}</span>
        <h2>{item?.label ?? 'Select an item'}</h2>
        {item?.sublabel ? <p>{item.sublabel}</p> : null}
      </div>
      <ItemSelector
        id={`selector-${label}`}
        label={`Side ${label} item`}
        items={items}
        value={selectedId}
        onChange={onSelect}
      />
      <ProjectionModePicker
        options={projectionOptions}
        value={activeProjectionId}
        onChange={onProjectionSelect}
      />
      <AspectRatioControl
        value={presentationAr}
        defaultValue={defaultAr}
        mode={arMode}
        onChange={onAspectRatioChange}
      />
      <MetricsPanel
        metrics={metrics}
        kind={resolvedKind}
        seatPosition={seatPosition}
      />
    </article>
  );
}

function computeMetrics(
  resolved: NonNullable<ReturnType<typeof resolveItem>>,
  contentFormat: typeof CONTENT_FORMATS[number],
  seatPosition: SeatPosition
): ComputedMetrics {
  return resolved.type === 'venue'
    ? computeVenueMetrics(resolved.resolved, contentFormat, seatPosition)
    : computeHomeMetrics(resolved.resolved, contentFormat);
}

export interface ProjectionOption {
  id: string;
  label: string;
  sublabel?: string;
  projection: ResolvedProjection;
}

function projectionOptions(resolved: ReturnType<typeof resolveItem>): ProjectionOption[] {
  if (!resolved || resolved.type !== 'venue') return [];
  const candidates = [
    ...(resolved.resolved.projections ?? []),
    ...(resolved.resolved.hybrid_projection?.digital ? [resolved.resolved.hybrid_projection.digital] : []),
    ...(resolved.resolved.hybrid_projection?.film ? [resolved.resolved.hybrid_projection.film] : []),
    resolved.resolved.projection,
  ];
  const byId = new Map<string, ProjectionOption>();

  for (const projection of candidates) {
    const id = projectionId(projection);
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      label: projectionLabel(projection),
      sublabel: projectionSublabel(projection),
      projection,
    });
  }

  return Array.from(byId.values());
}

function activeProjectionId(options: ProjectionOption[], selectedId: string | null): string | null {
  if (options.length === 0) return null;
  return options.some((option) => option.id === selectedId) ? selectedId : options[0].id;
}

function withActiveProjection(
  resolved: ReturnType<typeof resolveItem>,
  selectedProjectionId: string | null
): ReturnType<typeof resolveItem> {
  if (!resolved || resolved.type !== 'venue' || !selectedProjectionId) return resolved;
  const selected = projectionOptions(resolved).find((option) => option.id === selectedProjectionId)?.projection;
  if (!selected) return resolved;

  const hybridProjection = resolved.resolved.hybrid_projection
    ? {
      ...resolved.resolved.hybrid_projection,
      active: selected.mode === 'film' ? 'film' as const : 'digital' as const,
    }
    : undefined;

  return {
    type: 'venue',
    resolved: {
      ...resolved.resolved,
      projection: selected,
      ...(hybridProjection ? { hybrid_projection: hybridProjection } : {}),
    },
  };
}

function bestNativeAr(resolved: ReturnType<typeof resolveItem>): number | null {
  if (!resolved) return null;
  if (resolved.type === 'home') return positiveOrNull(resolved.resolved.aspect_ratio);

  return (
    positiveOrNull(resolved.resolved.projection.min_content_ar_supported) ??
    positiveOrNull(resolved.resolved.screen.aspect_ratio) ??
    positiveOrNull(resolved.resolved.capabilities.min_content_ar_supported) ??
    null
  );
}

function contentFormatFromAr(aspectRatio: number): ContentFormat {
  const match = CONTENT_FORMATS.find((format) => Math.abs(format.aspect_ratio - aspectRatio) < 0.01);
  return match ?? {
    id: `custom_${aspectRatio}`,
    display_name: `${aspectRatio.toFixed(2)}:1`,
    aspect_ratio: aspectRatio,
  };
}

function projectionId(projection: ResolvedProjection): string {
  return projection.id ?? projection.mode ?? projection.type;
}

function projectionLabel(projection: ResolvedProjection): string {
  if (projection.mode === 'film') return 'Film';
  if (projection.mode === 'digital') return 'Digital';
  return projection.display_name ?? projection.type;
}

function projectionSublabel(projection: ResolvedProjection): string | undefined {
  const ar = positiveOrNull(projection.min_content_ar_supported);
  const arLabel = ar ? `${ar.toFixed(2)}:1` : null;
  const name = projection.display_name ?? projection.type;
  return [name, arLabel].filter(Boolean).join(' - ') || undefined;
}

function positiveOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}

export default App;
