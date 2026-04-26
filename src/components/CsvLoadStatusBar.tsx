interface CsvLoadStatusBarProps {
  status: 'loading' | 'ready' | 'failed';
  source: 'cache' | 'network' | 'failed' | null;
  venueCount: number;
  error: string | null;
}

export function CsvLoadStatusBar({ status, source, venueCount, error }: CsvLoadStatusBarProps) {
  if (status === 'loading') {
    return <footer className="csv-status">Loading venues...</footer>;
  }

  if (status === 'failed') {
    return <footer className="csv-status csv-status--failed">Venue CSV failed to load. Static examples are still available.</footer>;
  }

  const sourceText = source === 'cache' ? 'from cache' : 'from network';
  return (
    <footer className="csv-status">
      {venueCount.toLocaleString('en-US')} venues loaded from 143190.xyz / r-imax ({sourceText})
      {error ? `; using cached copy after fetch error: ${error}` : ''}
    </footer>
  );
}
