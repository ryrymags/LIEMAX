import { useMemo, useState } from 'react';
import type { ComparableCategory, ComparableItem } from '../data/comparables';

interface ItemSelectorProps {
  id: string;
  label: string;
  items: ComparableItem[];
  value: string | null;
  onChange: (id: string) => void;
}

const GROUPS: Array<{ category: ComparableCategory | 'all'; label: string }> = [
  { category: 'all', label: 'All' },
  { category: 'cinema_preset', label: 'Cinema Formats' },
  { category: 'venue', label: 'Specific Venues' },
  { category: 'home_display', label: 'Home Displays' },
];

export function ItemSelector({ id, label, items, value, onChange }: ItemSelectorProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ComparableCategory | 'all'>('all');
  const [region, setRegion] = useState('all');
  const [country, setCountry] = useState('all');
  const [province, setProvince] = useState('all');
  const [city, setCity] = useState('all');
  const [projector, setProjector] = useState('all');
  const [aspectRatio, setAspectRatio] = useState('all');
  const [filmOnly, setFilmOnly] = useState(false);
  const filterOptions = useMemo(() => buildFilterOptions(items, category, region, country, province), [items, category, region, country, province]);
  const selectedItem = items.find((item) => item.id === value) ?? null;
  const filteredItems = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = items
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => region === 'all' || metaValue(item, 'region') === region)
      .filter((item) => country === 'all' || metaValue(item, 'country') === country)
      .filter((item) => province === 'all' || metaValue(item, 'province') === province)
      .filter((item) => city === 'all' || metaValue(item, 'city') === city)
      .filter((item) => projector === 'all' || projectorValues(item).includes(projector))
      .filter((item) => aspectRatio === 'all' || aspectRatioValues(item).includes(aspectRatio))
      .filter((item) => !filmOnly || supportsFilm(item))
      .filter((item) => tokens.every((token) => searchText(item).includes(token)));
    const visible = matches.slice(0, 36);
    return selectedItem && !visible.some((item) => item.id === selectedItem.id)
      ? [selectedItem, ...visible.slice(0, 35)]
      : visible;
  }, [items, category, region, country, province, city, projector, aspectRatio, filmOnly, query, selectedItem]);

  return (
    <section className="item-search" aria-label={label}>
      <label className="field-label" htmlFor={id}>
        <span>{label}</span>
        <input
          id={id}
          type="search"
          value={query}
          placeholder={selectedItem ? selectedItem.label : 'Search theater, city, format, projector...'}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="filter-grid" aria-label={`${label} filters`}>
        <label>
          <span>Type</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as ComparableCategory | 'all')}>
            {GROUPS.map((group) => <option key={group.category} value={group.category}>{group.label}</option>)}
          </select>
        </label>
        <FilterSelect label="Region" value={region} values={filterOptions.regions} onChange={(next) => {
          setRegion(next);
          setCountry('all');
          setProvince('all');
          setCity('all');
        }} />
        <FilterSelect label="Country" value={country} values={filterOptions.countries} onChange={(next) => {
          setCountry(next);
          setProvince('all');
          setCity('all');
        }} />
        <FilterSelect label="State" value={province} values={filterOptions.provinces} onChange={(next) => {
          setProvince(next);
          setCity('all');
        }} />
        <FilterSelect label="City" value={city} values={filterOptions.cities} onChange={setCity} />
        <FilterSelect label="Projector" value={projector} values={filterOptions.projectors} onChange={setProjector} />
        <FilterSelect label="AR" value={aspectRatio} values={filterOptions.aspectRatios} onChange={setAspectRatio} />
        <label className="checkbox-filter">
          <input type="checkbox" checked={filmOnly} onChange={(event) => setFilmOnly(event.target.checked)} />
          <span>Film capable</span>
        </label>
      </div>
      <div className="search-results" role="listbox" aria-label={`${label} results`}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === value}
              className={item.id === value ? 'is-selected' : ''}
              onClick={() => {
                onChange(item.id);
                setQuery('');
              }}
            >
              <span>{item.label}</span>
              <small>{itemSummary(item)}</small>
            </button>
          ))
        ) : (
          <div className="manual-placeholder">
            <strong>Don't see what you're looking for?</strong>
            <span>Manual Entry coming soon.</span>
          </div>
        )}
      </div>
    </section>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, values, onChange }: FilterSelectProps) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All</option>
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

function buildFilterOptions(
  items: ComparableItem[],
  category: ComparableCategory | 'all',
  region: string,
  country: string,
  province: string
) {
  const scoped = items.filter((item) => category === 'all' || item.category === category);
  const byRegion = scoped.filter((item) => region === 'all' || metaValue(item, 'region') === region);
  const byCountry = byRegion.filter((item) => country === 'all' || metaValue(item, 'country') === country);
  const byProvince = byCountry.filter((item) => province === 'all' || metaValue(item, 'province') === province);

  return {
    regions: unique(scoped.map((item) => metaValue(item, 'region'))),
    countries: unique(byRegion.map((item) => metaValue(item, 'country'))),
    provinces: unique(byCountry.map((item) => metaValue(item, 'province'))),
    cities: unique(byProvince.map((item) => metaValue(item, 'city'))),
    projectors: unique(scoped.flatMap(projectorValues)),
    aspectRatios: unique(scoped.flatMap(aspectRatioValues)),
  };
}

function searchText(item: ComparableItem): string {
  const venue = item.rawVenue;
  const preset = item.rawPreset;
  const home = item.rawHomePreset;
  const fields = [
    item.label,
    item.sublabel,
    item.category,
    venue?.brand_label,
    venue?.chain,
    venue?.city,
    venue?.state_province,
    venue?.country,
    venue?.source_143190?.region,
    venue?.source_143190?.digital_projector,
    venue?.source_143190?.film_projector,
    ...(venue?.projections ?? []).map((projection: Record<string, any>) => projection.display_name ?? projection.type),
    venue?.projection?.display_name,
    venue?.projection?.type,
    preset?.brand,
    preset?.tier,
    preset?.default_projection?.display_name,
    preset?.default_projection?.type,
    home?.device_category,
    home?.tier,
  ];
  return fields.flat().filter(Boolean).join(' ').toLowerCase();
}

function metaValue(item: ComparableItem, key: 'region' | 'country' | 'province' | 'city'): string | null {
  const venue = item.rawVenue;
  if (!venue) return null;
  if (key === 'region') return venue.source_143190?.region ?? null;
  if (key === 'country') return venue.country ?? venue.source_143190?.country_area ?? null;
  if (key === 'province') return venue.state_province ?? venue.source_143190?.province_state ?? null;
  return venue.city ?? venue.source_143190?.city ?? null;
}

function projectorValues(item: ComparableItem): string[] {
  const projections = [
    item.rawPreset?.default_projection,
    item.rawVenue?.projection,
    ...(item.rawVenue?.projections ?? []),
  ].filter(Boolean);

  return unique(projections.map((projection: Record<string, any>) =>
    projection.mode === 'film' ? 'Film' : projection.type ?? projection.display_name ?? projection.mode
  ));
}

function aspectRatioValues(item: ComparableItem): string[] {
  const values = [
    item.rawPreset?.default_projection?.min_content_ar_supported,
    item.rawPreset?.default_screen?.aspect_ratio,
    item.rawVenue?.projection?.min_content_ar_supported,
    item.rawVenue?.screen?.aspect_ratio,
    ...(item.rawVenue?.projections ?? []).map((projection: Record<string, any>) => projection.min_content_ar_supported),
    item.rawHomePreset?.default_aspect_ratio,
  ];

  return unique(values
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0)
    .map((value) => `${value.toFixed(2)}:1`));
}

function supportsFilm(item: ComparableItem): boolean {
  return Boolean(
    item.rawPreset?.default_projection?.mode === 'film' ||
    item.rawVenue?.projection?.mode === 'film' ||
    item.rawVenue?.capabilities?.supports_1570_film ||
    (item.rawVenue?.projections ?? []).some((projection: Record<string, any>) => projection.mode === 'film')
  );
}

function itemSummary(item: ComparableItem): string {
  const bits = [
    categoryLabel(item.category),
    item.sublabel,
    projectorValues(item).slice(0, 2).join(', '),
    aspectRatioValues(item).slice(0, 2).join(', '),
  ].filter(Boolean);
  return bits.join(' - ');
}

function categoryLabel(category: ComparableCategory): string {
  if (category === 'cinema_preset') return 'Cinema format';
  if (category === 'home_display') return 'Home display';
  return 'Venue';
}

function unique(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b));
}
