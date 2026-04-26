import { CONTENT_FORMATS } from '../data';

interface AspectRatioControlProps {
  value: number | null;
  defaultValue: number | null;
  mode: 'auto' | 'custom';
  onChange: (value: number, mode: 'auto' | 'custom') => void;
}

const EXTRA_RATIOS = [
  { id: 'ar_143', display_name: 'IMAX 1.43:1', aspect_ratio: 1.43 },
  { id: 'ar_190', display_name: 'IMAX Digital 1.90:1', aspect_ratio: 1.90 },
  { id: 'ar_185', display_name: 'Flat 1.85:1', aspect_ratio: 1.85 },
  { id: 'ar_178', display_name: '16:9 / 1.78:1', aspect_ratio: 1.78 },
  { id: 'ar_239', display_name: 'Scope 2.39:1', aspect_ratio: 2.39 },
];

export function AspectRatioControl({ value, defaultValue, mode, onChange }: AspectRatioControlProps) {
  const ratios = uniqueRatios([
    ...CONTENT_FORMATS,
    ...EXTRA_RATIOS,
    ...(defaultValue ? [{ id: 'best_native', display_name: `Best native ${formatAr(defaultValue)}`, aspect_ratio: defaultValue }] : []),
  ]);
  const selectedPreset = ratios.find((ratio) => value != null && Math.abs(ratio.aspect_ratio - value) < 0.01);
  const selectValue = mode === 'custom' && !selectedPreset ? 'custom' : selectedPreset?.id ?? '';

  return (
    <div className="aspect-control">
      <div className="aspect-control__header">
        <span>Presentation AR</span>
        {defaultValue ? <button type="button" onClick={() => onChange(defaultValue, 'auto')}>Use best native</button> : null}
      </div>
      <div className="aspect-control__fields">
        <select
          value={selectValue}
          onChange={(event) => {
            if (event.target.value === 'custom') return;
            const selected = ratios.find((ratio) => ratio.id === event.target.value);
            if (selected) onChange(selected.aspect_ratio, selected.id === 'best_native' ? 'auto' : 'custom');
          }}
          aria-label="Presentation aspect ratio preset"
        >
          <option value="" disabled>Select aspect ratio</option>
          {ratios.map((ratio) => (
            <option key={ratio.id} value={ratio.id}>
              {ratio.display_name}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
        <label>
          <span>Custom</span>
          <input
            type="number"
            min="1"
            max="3"
            step="0.01"
            value={value == null ? '' : Number(value.toFixed(2))}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next) && next > 0) onChange(next, 'custom');
            }}
            aria-label="Custom presentation aspect ratio"
          />
        </label>
      </div>
      {defaultValue ? (
        <p>
          {mode === 'auto' ? 'Using best native default' : 'Manual override'}: {formatAr(value ?? defaultValue)}
        </p>
      ) : null}
    </div>
  );
}

function uniqueRatios<T extends { id: string; display_name: string; aspect_ratio: number }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = item.aspect_ratio.toFixed(2);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.sort((a, b) => a.aspect_ratio - b.aspect_ratio);
}

function formatAr(value: number): string {
  return `${value.toFixed(2)}:1`;
}
