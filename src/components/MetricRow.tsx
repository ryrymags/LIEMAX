interface MetricRowProps {
  label: string;
  value: string;
  note?: string | null;
  tone?: 'default' | 'warning';
}

export function MetricRow({ label, value, note, tone = 'default' }: MetricRowProps) {
  return (
    <div className={`metric-row metric-row--${tone}`}>
      <dt>{label}</dt>
      <dd>
        <span className="metric-value">{value}</span>
        {note ? <span className="metric-note">{note}</span> : null}
      </dd>
    </div>
  );
}
