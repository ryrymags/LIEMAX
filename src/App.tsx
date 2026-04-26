import { useEffect, useMemo, useState } from 'react';
import { CONTENT_FORMATS } from './data';
import { load143190Venues } from './data/csvLoader';
import { getComparableItems, resolveItem, type ComparableItem } from './data/comparables';
import { computeHomeMetrics, computeVenueMetrics, type ComputedMetrics, type SeatPosition } from './lib/computeMetrics';
import { BrightnessComparisonRow } from './components/BrightnessComparisonRow';
import { ContentFormatPicker } from './components/ContentFormatPicker';
import { CsvLoadStatusBar } from './components/CsvLoadStatusBar';
import { ItemSelector } from './components/ItemSelector';
import { MetricsPanel } from './components/MetricsPanel';
import { SeatPositionPicker } from './components/SeatPositionPicker';

type CsvLoadStatus = 'loading' | 'ready' | 'failed';
type ResolvedKind = 'venue' | 'home' | null;

function App() {
  const [sideAId, setSideAId] = useState<string | null>(null);
  const [sideBId, setSideBId] = useState<string | null>(null);
  const [contentFormatId, setContentFormatId] = useState('scope_239');
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

  const selectedContentFormat = useMemo(
    () => CONTENT_FORMATS.find((format) => format.id === contentFormatId) ?? CONTENT_FORMATS[0],
    [contentFormatId]
  );

  const itemA = comparableItems.find((item) => item.id === sideAId) ?? null;
  const itemB = comparableItems.find((item) => item.id === sideBId) ?? null;
  const resolvedA = itemA ? resolveItem(itemA) : null;
  const resolvedB = itemB ? resolveItem(itemB) : null;
  const metricsA = resolvedA ? computeMetrics(resolvedA, selectedContentFormat, seatPosition) : null;
  const metricsB = resolvedB ? computeMetrics(resolvedB, selectedContentFormat, seatPosition) : null;

  return (
    <main className="app-shell">
      <Header />
      <section className="comparison-controls" aria-label="Comparison controls">
        <ContentFormatPicker
          contentFormats={CONTENT_FORMATS}
          selectedId={contentFormatId}
          onChange={setContentFormatId}
        />
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
          onSelect={setSideAId}
        />
        <SidePanel
          label="B"
          item={itemB}
          items={comparableItems}
          metrics={metricsB}
          resolvedKind={resolvedB?.type ?? null}
          selectedId={sideBId}
          seatPosition={seatPosition}
          onSelect={setSideBId}
        />
      </section>

      <BrightnessComparisonRow
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
}

function SidePanel({ label, item, items, metrics, resolvedKind, selectedId, seatPosition, onSelect }: SidePanelProps) {
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

export default App;
