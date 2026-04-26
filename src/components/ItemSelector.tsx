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
  const [imax1570Only, setImax1570Only] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterOptions = useMemo(() => buildFilterOptions(items, category, region, country, province), [items, category, region, country, province]);
  const selectedItem = items.find((item) => item.id === value) ?? null;
  const filteredItems = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return items
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => region === 'all' || metaValue(item, 'region') === region)
      .filter((item) => country === 'all' || metaValue(item, 'country') === country)
      .filter((item) => province === 'all' || metaValue(item, 'province') === province)
      .filter((item) => city === 'all' || metaValue(item, 'city') === city)
      .filter((item) => projector === 'all' || projectorValues(item).includes(projector))
      .filter((item) => aspectRatio === 'all' || aspectRatioValues(item).includes(aspectRatio))
      .filter((item) => !imax1570Only || supportsImax1570(item))
      .filter((item) => tokens.every((token) => searchText(item).includes(token)));
  }, [items, category, region, country, province, city, projector, aspectRatio, imax1570Only, query]);
  const visibleItems = filteredItems.slice(0, 50);
  const activeFilterCount = [
    category !== 'all',
    region !== 'all',
    country !== 'all',
    province !== 'all',
    city !== 'all',
    projector !== 'all',
    aspectRatio !== 'all',
    imax1570Only,
  ].filter(Boolean).length;

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
      <div className="filter-bar">
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <span>{filteredItems.length} matches</span>
      </div>
      {filtersOpen ? (
        <div className="filter-grid" aria-label={`${label} filters`}>
          <label>
            <span>Type</span>
            <select value={category} onChange={(event) => {
              setCategory(event.target.value as ComparableCategory | 'all');
              setRegion('all');
              setCountry('all');
              setProvince('all');
              setCity('all');
              setProjector('all');
              setAspectRatio('all');
              setImax1570Only(false);
            }}>
              {GROUPS.map((group) => <option key={group.category} value={group.category}>{group.label}</option>)}
            </select>
          </label>
          <FilterSelect label="Region" value={region} values={filterOptions.regions} onChange={(next) => {
            setRegion(next);
            setCountry('all');
            setProvince('all');
            setCity('all');
            setProjector('all');
            setAspectRatio('all');
          }} />
          <FilterSelect label="Country" value={country} values={filterOptions.countries} onChange={(next) => {
            setCountry(next);
            setProvince('all');
            setCity('all');
            setProjector('all');
            setAspectRatio('all');
          }} />
          <FilterSelect label="State" value={province} values={filterOptions.provinces} onChange={(next) => {
            setProvince(next);
            setCity('all');
            setProjector('all');
            setAspectRatio('all');
          }} />
          <FilterSelect label="City" value={city} values={filterOptions.cities} onChange={(next) => {
            setCity(next);
            setProjector('all');
            setAspectRatio('all');
          }} />
          <FilterSelect label="Projector" value={projector} values={filterOptions.projectors} onChange={setProjector} />
          <FilterSelect label="AR" value={aspectRatio} values={filterOptions.aspectRatios} onChange={setAspectRatio} />
          <label className="checkbox-filter">
            <input type="checkbox" checked={imax1570Only} onChange={(event) => setImax1570Only(event.target.checked)} />
            <span>IMAX 15/70 capable</span>
          </label>
        </div>
      ) : null}
      <div className="search-results" role="listbox" aria-label={`${label} results`}>
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
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
      {filteredItems.length > visibleItems.length ? (
        <p className="results-note">Showing first {visibleItems.length} matches. Type more or add filters to narrow the list.</p>
      ) : null}
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
  const byGeo = byProvince;

  return {
    regions: unique(scoped.map((item) => metaValue(item, 'region'))),
    countries: unique(byRegion.map((item) => metaValue(item, 'country'))),
    provinces: unique(byCountry.map((item) => metaValue(item, 'province'))),
    cities: unique(byProvince.map((item) => metaValue(item, 'city'))),
    projectors: unique(byGeo.flatMap(projectorValues)),
    aspectRatios: unique(byGeo.flatMap(aspectRatioValues)),
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
    ...rawVenueProjections(venue).map((projection: Record<string, any>) => projection.display_name ?? projection.type),
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
    ...rawVenueProjections(item.rawVenue),
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
    ...rawVenueProjections(item.rawVenue).map((projection: Record<string, any>) => projection.min_content_ar_supported),
    item.rawHomePreset?.default_aspect_ratio,
  ];

  return unique(values
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0)
    .map((value) => `${value.toFixed(2)}:1`));
}

function supportsImax1570(item: ComparableItem): boolean {
  const projections = [
    item.rawPreset?.default_projection,
    item.rawVenue?.projection,
    ...rawVenueProjections(item.rawVenue),
  ].filter(Boolean);

  return Boolean(
    item.rawPreset?.id === 'imax_1570_film' ||
    item.rawPreset?.id === 'imax_dome_film' ||
    item.rawPreset?.default_capabilities?.supports_1570_film ||
    item.rawVenue?.capabilities?.supports_1570_film ||
    projections.some((projection: Record<string, any>) =>
      projection.type === 'imax_1570_film' ||
      projection.type === 'imax_dome_film' ||
      /15\/70|1570|70mm/i.test(`${projection.display_name ?? ''} ${projection.type ?? ''}`)
    )
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

function rawVenueProjections(venue: Record<string, any> | null | undefined): Record<string, any>[] {
  if (!venue) return [];
  const projections = venue.projections ?? venue.hybrid_projections;
  return Array.isArray(projections) ? projections : [];
}

function unique(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b));
}
