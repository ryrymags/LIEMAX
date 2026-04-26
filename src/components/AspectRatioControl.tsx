import { useEffect, useMemo, useState } from 'react';
import { CONTENT_FORMATS } from '../data';

interface AspectRatioControlProps {
  value: number | null;
  defaultValue: number | null;
  defaultReason?: string | null;
  mode: 'auto' | 'custom';
  onChange: (value: number, mode: 'auto' | 'custom') => void;
}

interface AspectRatioOption {
  id: string;
  displayName: string;
  searchText: string;
  aspectRatio: number;
  isCustom?: boolean;
  isBestNative?: boolean;
}

const STORAGE_KEY = 'liemax_custom_aspect_ratios';
const EXTRA_RATIOS: AspectRatioOption[] = [
  { id: 'ar_143', displayName: 'IMAX 1.43:1', searchText: 'imax gt 143 1.43 full height', aspectRatio: 1.43 },
  { id: 'ar_190', displayName: 'IMAX Digital 1.90:1', searchText: 'imax digital 190 1.90 expanded', aspectRatio: 1.90 },
  { id: 'ar_185', displayName: 'Flat 1.85:1', searchText: 'flat 185 1.85 academy', aspectRatio: 1.85 },
  { id: 'ar_178', displayName: '16:9 / TV Native 1.78:1', searchText: '16:9 178 1.78 tv native home', aspectRatio: 1.78 },
  { id: 'ar_239', displayName: 'Scope 2.39:1', searchText: 'scope anamorphic 239 2.39 cinemascope', aspectRatio: 2.39 },
];

export function AspectRatioControl({ value, defaultValue, defaultReason, mode, onChange }: AspectRatioControlProps) {
  const [query, setQuery] = useState('');
  const [recentCustom, setRecentCustom] = useState<number[]>(() => loadCustomRatios());
  const options = useMemo(() => buildOptions(defaultValue, recentCustom), [defaultValue, recentCustom]);
  const selected = value == null ? null : findByValue(options, value);
  const filtered = filterOptions(options, query);

  useEffect(() => {
    setQuery('');
  }, [value, defaultValue, mode]);

  function choose(option: AspectRatioOption) {
    setQuery(option.displayName);
    onChange(option.aspectRatio, option.isBestNative ? 'auto' : 'custom');
  }

  function useBestNative() {
    if (!defaultValue) return;
    setQuery('');
    onChange(defaultValue, 'auto');
  }

  function commitTypedValue() {
    const numeric = parseAspectRatio(query);
    if (numeric == null) {
      const first = filtered[0];
      if (first) choose(first);
      return;
    }

    const known = findByValue(options, numeric);
    if (known && Math.abs(known.aspectRatio - numeric) < 0.01) {
      choose(known);
      return;
    }

    rememberCustomRatio(numeric, recentCustom, setRecentCustom);
    setQuery(formatAr(numeric));
    onChange(numeric, 'custom');
  }

  return (
    <div className="aspect-control">
      <div className="aspect-control__header">
        <span>Presentation AR</span>
        {defaultValue ? <button type="button" onClick={useBestNative}>Use best native</button> : null}
      </div>

      <div className="aspect-combobox">
        <label className="field-label">
          <span>Search presets or type a ratio</span>
          <input
            type="search"
            value={query}
            placeholder={selected?.displayName ?? (value == null ? 'Scope, IMAX, 16:9, 2.00...' : formatAr(value))}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => {
              if (query.trim()) commitTypedValue();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitTypedValue();
              }
            }}
            aria-label="Presentation aspect ratio"
          />
        </label>
        <div className="ar-options" role="listbox" aria-label="Presentation aspect ratio options">
          {filtered.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={selected?.id === option.id || (value != null && Math.abs(option.aspectRatio - value) < 0.01)}
              className={value != null && Math.abs(option.aspectRatio - value) < 0.01 ? 'is-selected' : ''}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              <span>{option.displayName}</span>
              <small>{option.isBestNative ? defaultReason : option.isCustom ? 'Recent custom ratio' : `${formatAr(option.aspectRatio)} presentation`}</small>
            </button>
          ))}
          {filtered.length === 0 ? (
            <div className="manual-placeholder">
              <strong>Type a number like 2.00</strong>
              <span>Press Enter to use it as a custom presentation ratio.</span>
            </div>
          ) : null}
        </div>
      </div>

      <p>
        {mode === 'auto'
          ? `Using best native default${defaultReason ? `. ${defaultReason}` : `: ${formatAr(value ?? defaultValue)}`}`
          : `Manual override: ${formatAr(value ?? defaultValue)}`}
      </p>
    </div>
  );
}

function buildOptions(defaultValue: number | null, recentCustom: number[]): AspectRatioOption[] {
  const contentOptions: AspectRatioOption[] = CONTENT_FORMATS.map((format) => ({
    id: format.id,
    displayName: format.display_name,
    searchText: `${format.display_name} ${format.id} ${format.aspect_ratio}`,
    aspectRatio: format.aspect_ratio,
  }));
  const customOptions = recentCustom.map((ratio) => ({
    id: `custom_${ratio.toFixed(2)}`,
    displayName: `Custom ${formatAr(ratio)}`,
    searchText: `custom ${ratio.toFixed(2)} ${formatAr(ratio)}`,
    aspectRatio: ratio,
    isCustom: true,
  }));
  const bestNative = defaultValue
    ? [{ id: 'best_native', displayName: `Best native ${formatAr(defaultValue)}`, searchText: `best native ${defaultValue.toFixed(2)}`, aspectRatio: defaultValue, isBestNative: true }]
    : [];

  return uniqueRatios([...bestNative, ...contentOptions, ...EXTRA_RATIOS, ...customOptions]);
}

function filterOptions(options: AspectRatioOption[], query: string): AspectRatioOption[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return options.slice(0, 10);
  return options.filter((option) => tokens.every((token) => option.searchText.toLowerCase().includes(token) || option.displayName.toLowerCase().includes(token))).slice(0, 10);
}

function findByValue(options: AspectRatioOption[], value: number): AspectRatioOption | null {
  return options.find((option) => Math.abs(option.aspectRatio - value) < 0.01) ?? null;
}

function parseAspectRatio(value: string): number | null {
  const trimmed = value.trim().toLowerCase().replace(':1', '').replace('x', '');
  if (!trimmed) return null;
  if (trimmed.includes('/')) {
    const [left, right] = trimmed.split('/').map(Number);
    return Number.isFinite(left) && Number.isFinite(right) && right > 0 ? clampRatio(left / right) : null;
  }
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? clampRatio(numeric) : null;
}

function clampRatio(value: number): number | null {
  if (value < 1 || value > 3) return null;
  return Number(value.toFixed(2));
}

function rememberCustomRatio(value: number, current: number[], setRecentCustom: (values: number[]) => void) {
  const next = [value, ...current.filter((ratio) => Math.abs(ratio - value) >= 0.01)].slice(0, 6);
  setRecentCustom(next);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Local storage may be unavailable in private contexts; the in-memory value still works.
  }
}

function loadCustomRatios(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === 'number' && value >= 1 && value <= 3).slice(0, 6)
      : [];
  } catch {
    return [];
  }
}

function uniqueRatios(items: AspectRatioOption[]): AspectRatioOption[] {
  const result: AspectRatioOption[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const key = item.isBestNative ? item.id : item.aspectRatio.toFixed(2);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function formatAr(value: number | null | undefined): string {
  return value == null ? '-' : `${value.toFixed(2)}:1`;
}
