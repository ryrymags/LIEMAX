import { useEffect, useMemo, useState } from 'react';
import { CONTENT_FORMATS } from './data';
import { load143190Venues } from './data/csvLoader';
import { getComparableItems, resolveItem, type ComparableItem } from './data/comparables';
import { computeHomeMetrics, computeVenueMetrics, type ComputedMetrics, type SeatPosition } from './lib/computeMetrics';
import { AspectRatioControl } from './components/AspectRatioControl';
import { ComparisonMetricsTable } from './components/ComparisonMetricsTable';
import { ComparisonSummary } from './components/ComparisonSummary';
import { CsvLoadStatusBar } from './components/CsvLoadStatusBar';
import { ItemSelector } from './components/ItemSelector';
import { ProjectionModePicker } from './components/ProjectionModePicker';
import { SeatPositionPicker } from './components/SeatPositionPicker';
import type { ContentFormat, ResolvedProjection } from './math';

type CsvLoadStatus = 'loading' | 'ready' | 'failed';
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
  const [seatsLinked, setSeatsLinked] = useState(true);
  const [sideASeatPosition, setSideASeatPosition] = useState<SeatPosition>('mid');
  const [sideBSeatPosition, setSideBSeatPosition] = useState<SeatPosition>('mid');
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
  const nativeArA = bestNativeAr(activeResolvedA);
  const nativeArB = bestNativeAr(activeResolvedB);
  const defaultArA = nativeArA.value;
  const defaultArB = nativeArB.value;

  useEffect(() => {
    if (sideAArMode === 'auto') setSideAAr(defaultArA);
  }, [defaultArA, sideAArMode]);

  useEffect(() => {
    if (sideBArMode === 'auto') setSideBAr(defaultArB);
  }, [defaultArB, sideBArMode]);

  const presentationArA = sideAAr ?? defaultArA;
  const presentationArB = sideBAr ?? defaultArB;
  const metricsA = activeResolvedA && presentationArA ? computeMetrics(activeResolvedA, contentFormatFromAr(presentationArA), sideASeatPosition) : null;
  const metricsB = activeResolvedB && presentationArB ? computeMetrics(activeResolvedB, contentFormatFromAr(presentationArB), sideBSeatPosition) : null;

  function handleLinkedSeatChange(value: SeatPosition) {
    setSideASeatPosition(value);
    setSideBSeatPosition(value);
  }

  function handleSeatLinkChange(linked: boolean) {
    setSeatsLinked(linked);
    if (linked) setSideBSeatPosition(sideASeatPosition);
  }

  return (
    <main className="app-shell">
      <Header />

      <section className="comparison-layout" aria-label="Screen comparison">
        <SidePanel
          label="A"
          item={itemA}
          items={comparableItems}
          metrics={metricsA}
          selectedId={sideAId}
          resolved={activeResolvedA}
          projectionOptions={projectionOptionsA}
          activeProjectionId={activeProjectionIdA}
          presentationAr={presentationArA}
          defaultAr={defaultArA}
          defaultArReason={nativeArA.reason}
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
          selectedId={sideBId}
          resolved={activeResolvedB}
          projectionOptions={projectionOptionsB}
          activeProjectionId={activeProjectionIdB}
          presentationAr={presentationArB}
          defaultAr={defaultArB}
          defaultArReason={nativeArB.reason}
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

      <section className="comparison-workbench" aria-label="Live comparison and metrics">
        <div className="comparison-toolbar">
          <div>
            <span className="summary-eyebrow">Comparison controls</span>
            <h2>Live comparison</h2>
          </div>
          <div className="seat-controls">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={!seatsLinked}
                onChange={(event) => handleSeatLinkChange(!event.target.checked)}
              />
              <span>Compare different seats</span>
            </label>
            {seatsLinked ? (
              <SeatPositionPicker value={sideASeatPosition} onChange={handleLinkedSeatChange} legend="Seat position" />
            ) : (
              <div className="split-seat-controls">
                <SeatPositionPicker value={sideASeatPosition} onChange={setSideASeatPosition} legend="Side A seat" />
                <SeatPositionPicker value={sideBSeatPosition} onChange={setSideBSeatPosition} legend="Side B seat" />
              </div>
            )}
          </div>
        </div>

        <ComparisonSummary
          leftLabel={itemA?.label ?? 'Side A'}
          rightLabel={itemB?.label ?? 'Side B'}
          leftMetrics={metricsA}
          rightMetrics={metricsB}
        />

        <ComparisonMetricsTable
          leftLabel={itemA?.label ?? 'Side A'}
          rightLabel={itemB?.label ?? 'Side B'}
          leftMetrics={metricsA}
          rightMetrics={metricsB}
          leftKind={resolvedA?.type ?? null}
          rightKind={resolvedB?.type ?? null}
          leftSeatPosition={sideASeatPosition}
          rightSeatPosition={sideBSeatPosition}
        />
      </section>

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
  selectedId: string | null;
  resolved: ReturnType<typeof resolveItem>;
  onSelect: (id: string) => void;
  projectionOptions: ProjectionOption[];
  activeProjectionId: string | null;
  presentationAr: number | null;
  defaultAr: number | null;
  defaultArReason: string | null;
  arMode: ArMode;
  onProjectionSelect: (id: string) => void;
  onAspectRatioChange: (value: number, mode: ArMode) => void;
}

function SidePanel({
  label,
  item,
  items,
  metrics,
  selectedId,
  resolved,
  onSelect,
  projectionOptions,
  activeProjectionId,
  presentationAr,
  defaultAr,
  defaultArReason,
  arMode,
  onProjectionSelect,
  onAspectRatioChange,
}: SidePanelProps) {
  const profile = buildScreenProfile(item, resolved, metrics, projectionOptions, activeProjectionId, defaultAr);

  return (
    <article className="side-panel">
      <div className="selected-screen-summary">
        <span className="side-panel__eyebrow">Side {label}</span>
        <h2>{profile.title}</h2>
        {profile.sublabel ? <p>{profile.sublabel}</p> : null}
        {profile.tags.length > 0 ? (
          <div className="tag-list" aria-label={`Side ${label} tags`}>
            {profile.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        ) : null}
        {profile.facts.length > 0 ? (
          <dl className="screen-facts">
            {profile.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
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
        defaultReason={defaultArReason}
        mode={arMode}
        onChange={onAspectRatioChange}
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

function bestNativeAr(resolved: ReturnType<typeof resolveItem>): { value: number | null; reason: string | null } {
  if (!resolved) return { value: null, reason: null };
  if (resolved.type === 'home') {
    const value = positiveOrNull(resolved.resolved.aspect_ratio);
    return {
      value,
      reason: value ? `${value.toFixed(2)}:1 because this display uses that native panel aspect ratio.` : null,
    };
  }

  const projectionAr = positiveOrNull(resolved.resolved.projection.min_content_ar_supported);
  if (projectionAr) {
    return {
      value: projectionAr,
      reason: nativeReasonForProjection(resolved.resolved.projection, projectionAr),
    };
  }

  const screenAr = positiveOrNull(resolved.resolved.screen.aspect_ratio);
  if (screenAr) {
    return {
      value: screenAr,
      reason: `${screenAr.toFixed(2)}:1 because projection support is unclear, so the physical screen shape is used.`,
    };
  }

  const capabilityAr = positiveOrNull(resolved.resolved.capabilities.min_content_ar_supported);
  return {
    value: capabilityAr,
    reason: capabilityAr ? `${capabilityAr.toFixed(2)}:1 from the venue capability record.` : null,
  };
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

interface ScreenProfile {
  title: string;
  sublabel?: string;
  tags: string[];
  facts: Array<{ label: string; value: string }>;
}

function buildScreenProfile(
  item: ComparableItem | null,
  resolved: ReturnType<typeof resolveItem>,
  metrics: ComputedMetrics | null,
  projectionOptionsList: ProjectionOption[],
  activeProjection: string | null,
  defaultAr: number | null
): ScreenProfile {
  if (!item || !resolved) {
    return { title: 'Select an item', tags: [], facts: [] };
  }

  const activeOption = projectionOptionsList.find((option) => option.id === activeProjection);
  const tags = uniqueStrings([
    categoryTag(item),
    brandTag(item),
    projectionTag(activeOption?.projection),
    supports1570(item) ? '15/70 capable' : null,
    resolved.type === 'venue' && resolved.resolved.screen.geometry === 'hemispherical' ? 'Dome' : null,
    item.rawVenue?.source_143190 ? '143190.xyz' : null,
  ]);

  const facts = [
    { label: 'Screen', value: screenFact(metrics) },
    { label: 'Native AR', value: defaultAr ? `${defaultAr.toFixed(2)}:1` : 'Unknown' },
    { label: 'Projection', value: activeOption?.sublabel ?? activeOption?.label ?? projectionCountLabel(projectionOptionsList) },
    { label: 'Source', value: item.rawVenue?.source_143190 ? '143190.xyz / r-imax' : item.category === 'venue' ? 'Authored venue' : item.category === 'home_display' ? 'Preset' : 'Format preset' },
  ].filter((fact) => fact.value && fact.value !== 'Unknown');

  return {
    title: item.label,
    sublabel: item.sublabel,
    tags,
    facts,
  };
}

function categoryTag(item: ComparableItem): string {
  if (item.category === 'home_display') return 'Home';
  if (item.category === 'cinema_preset') return 'Format preset';
  return 'Venue';
}

function brandTag(item: ComparableItem): string | null {
  const text = `${item.label} ${item.rawPreset?.brand ?? ''} ${item.rawPreset?.id ?? ''} ${item.rawVenue?.preset_id ?? ''}`.toLowerCase();
  if (text.includes('dolby')) return 'Dolby';
  if (text.includes('imax')) {
    if (text.includes('gt')) return 'IMAX GT';
    return 'IMAX';
  }
  if (text.includes('oled')) return 'OLED';
  if (text.includes('cinemark')) return 'Cinemark XD';
  if (text.includes('screenx')) return 'ScreenX';
  return null;
}

function projectionTag(projection: ResolvedProjection | undefined): string | null {
  if (!projection) return null;
  if (projection.mode === 'film') return 'Film';
  if (projection.mode === 'digital') return 'Digital';
  return projection.mode ?? null;
}

function projectionCountLabel(options: ProjectionOption[]): string {
  if (options.length > 1) return `${options.length} projection modes`;
  return options[0]?.label ?? 'Unknown';
}

function screenFact(metrics: ComputedMetrics | null): string {
  if (!metrics?.screenWidthFt || !metrics.screenHeightFt) return 'Dimensions unavailable';
  return `${metrics.screenWidthFt.toFixed(metrics.screenWidthFt >= 10 ? 0 : 1)} x ${metrics.screenHeightFt.toFixed(metrics.screenHeightFt >= 10 ? 0 : 1)} ft`;
}

function supports1570(item: ComparableItem): boolean {
  const projections = [
    item.rawPreset?.default_projection,
    item.rawVenue?.projection,
    ...(item.rawVenue?.projections ?? []),
  ].filter(Boolean);
  return Boolean(
    item.rawPreset?.id === 'imax_1570_film' ||
    item.rawVenue?.capabilities?.supports_1570_film ||
    projections.some((projection: Record<string, any>) =>
      projection.type === 'imax_1570_film' ||
      /15\/70|1570|70mm/i.test(`${projection.display_name ?? ''} ${projection.type ?? ''}`)
    )
  );
}

function nativeReasonForProjection(projection: ResolvedProjection, ar: number): string {
  const text = `${projection.type ?? ''} ${projection.display_name ?? ''}`.toLowerCase();
  if (projection.mode === 'film' || text.includes('1570') || text.includes('15/70')) {
    return `${ar.toFixed(2)}:1 because this projection supports full-height GT/15/70 IMAX.`;
  }
  if (text.includes('gt') || text.includes('dome')) {
    return `${ar.toFixed(2)}:1 because this projection can use full-height IMAX framing.`;
  }
  if (text.includes('cola') || text.includes('xenon') || text.includes('imax')) {
    return `${ar.toFixed(2)}:1 because commercial IMAX digital presentations are typically framed for 1.90.`;
  }
  if (text.includes('dolby')) {
    return `${ar.toFixed(2)}:1 because this Dolby preset uses the best supported presentation shape.`;
  }
  return `${ar.toFixed(2)}:1 because it is the best supported presentation aspect ratio for this selection.`;
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export default App;
