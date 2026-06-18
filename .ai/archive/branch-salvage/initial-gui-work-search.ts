export type AppVenueView = Record<string, any>;
export type AppDataFilters = {
  screenSize?: string;
  projector?: string;
  capability?: string;
  state?: string;
};

export const APP_DATA_FILTERS = {
  screenSize: {
    label: 'Screen size',
    options: [
      ['small', 'Small'],
      ['medium', 'Medium'],
      ['large', 'Large'],
      ['giant', 'Giant'],
      ['dome', 'Dome'],
    ],
  },
  projector: {
    label: 'Projector',
    options: [
      ['gt_dual_laser', 'GT Dual Laser'],
      ['cola', 'CoLa'],
      ['laser_xt', 'Laser XT'],
      ['dual_xenon', 'Dual Xenon'],
      ['1570_film', 'IMAX 15/70 Film'],
      ['dome_laser', 'Dome Laser'],
      ['dome_film', 'IMAX Dome 15/70 Film'],
      ['other_unknown', 'Other/Unknown Digital'],
    ],
  },
  capability: {
    label: 'Projection capability',
    options: [
      ['digital_143', 'Digital 1.43'],
      ['film_1570', '15/70 film'],
      ['any_143', 'Any 1.43-capable'],
      ['digital_190_only', '1.90-only digital'],
      ['dome_presentation', 'Dome presentation'],
    ],
  },
} as const;

const PROJECTOR_TYPE_MAP: Record<string, string> = {
  imax_gt_dual_laser: 'gt_dual_laser',
  imax_cola: 'cola',
  imax_laser_xt: 'laser_xt',
  imax_dual_xenon: 'dual_xenon',
  imax_dome_laser: 'dome_laser',
  imax_dome_film: 'dome_film',
  imax_1570_film: '1570_film',
};

export function screenSizeLabel(venue: AppVenueView): string | null {
  if (!venue?.screen) return null;
  if (venue.screen.sizeLabel) return venue.screen.sizeLabel;
  if (venue.screen.geometry === 'hemispherical') return 'Dome';
  if (venue.screen.w == null) return null;
  if (venue.screen.w < 55) return 'Small Screen';
  if (venue.screen.w < 70) return 'Medium Screen';
  if (venue.screen.w < 85) return 'Large Screen';
  return 'Giant Screen';
}

export function screenSizeKey(venue: AppVenueView): string {
  if (!venue?.screen) return 'unknown';
  if (venue.screen.sizeTier) return venue.screen.sizeTier;
  const label = screenSizeLabel(venue);
  return label ? label.toLowerCase().replace(/\s+screen$/, '').replace(/\s+/g, '_') : 'unknown';
}

export function hasDigital143(venue: AppVenueView): boolean {
  return venue?.kind === 'cinema' &&
    venue.screen?.geometry !== 'hemispherical' &&
    venue.projection?.min_ar != null &&
    venue.projection.min_ar <= 1.43 &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

export function hasFilm1570(venue: AppVenueView): boolean {
  return Boolean(venue?.filmProjection || (venue?.presentationModes || []).some((mode: Record<string, any>) => mode.isFilmMode));
}

export function hasFilm1570Capability(venue: AppVenueView): boolean {
  return hasFilm1570(venue) &&
    venue?.screen?.geometry !== 'hemispherical' &&
    venue.screen?.ar != null &&
    venue.screen.ar <= 1.45;
}

export function hasDomePresentation(venue: AppVenueView): boolean {
  return venue?.kind === 'cinema' &&
    (venue.screen?.geometry === 'hemispherical' ||
      venue.projection?.type === 'imax_dome_laser' ||
      venue.projection?.type === 'imax_dome_film' ||
      venue.filmProjection?.type === 'imax_dome_film');
}

export function has190OnlyDigital(venue: AppVenueView): boolean {
  return venue?.kind === 'cinema' &&
    !hasDomePresentation(venue) &&
    !hasDigital143(venue) &&
    venue.projection?.min_ar != null &&
    venue.projection.min_ar >= 1.89;
}

export function projectorKeys(venue: AppVenueView): string[] {
  if (!venue || venue.kind !== 'cinema') return ['other_unknown'];
  const keys = new Set<string>();
  const addProjection = (projection: Record<string, any> | null | undefined) => {
    if (!projection) return;
    if (projection.type && PROJECTOR_TYPE_MAP[projection.type]) {
      keys.add(PROJECTOR_TYPE_MAP[projection.type]);
      return;
    }
    const text = [projection.label, projection.display_name, projection.light].filter(Boolean).join(' ').toLowerCase();
    if (/gt.*dual|dual.*gt|dual 4k/.test(text)) keys.add('gt_dual_laser');
    else if (/\bcola\b/.test(text)) keys.add('cola');
    else if (/laser xt/.test(text)) keys.add('laser_xt');
    else if (/xenon/.test(text)) keys.add('dual_xenon');
    else if (/laser.*dome|dome.*laser/.test(text)) keys.add('dome_laser');
    else if (/dome.*15\/?70|gt dome/.test(text)) keys.add('dome_film');
    else if (/15\/?70|film/.test(text)) keys.add('1570_film');
  };
  addProjection(venue.projection);
  addProjection(venue.filmProjection);
  if (keys.size === 0) keys.add('other_unknown');
  return [...keys];
}

export function capabilityKeys(venue: AppVenueView): string[] {
  if (!venue || venue.kind !== 'cinema') return [];
  const keys = new Set<string>();
  if (hasDigital143(venue)) keys.add('digital_143');
  if (hasFilm1570Capability(venue)) keys.add('film_1570');
  if (hasDigital143(venue) || hasFilm1570Capability(venue)) keys.add('any_143');
  if (has190OnlyDigital(venue)) keys.add('digital_190_only');
  if (hasDomePresentation(venue)) {
    keys.add('dome_presentation');
    keys.add('any_143');
  }
  return [...keys];
}

export function filterOptionLabel(group: keyof typeof APP_DATA_FILTERS, value: string): string {
  const options = APP_DATA_FILTERS[group]?.options ?? [];
  return options.find(([key]) => key === value)?.[1] || value;
}

export function venueSearchText(venue: AppVenueView): string {
  const parts = [
    venue.name,
    venue.city,
    venue.state,
    venue.stateName,
    venue.sub,
    venue.projection?.label,
    venue.projection?.light,
    venue.projection?.type,
    venue.filmProjection?.label,
    venue.filmProjection?.type,
    screenSizeLabel(venue),
    screenSizeKey(venue),
    ...projectorKeys(venue).map((key) => filterOptionLabel('projector', key)),
    ...capabilityKeys(venue).map((key) => filterOptionLabel('capability', key)),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase().replace(/-/g, ' ');
}

export function matchesVenueFilters(venue: AppVenueView, filters: AppDataFilters = {}): boolean {
  if (filters.screenSize && screenSizeKey(venue) !== filters.screenSize) return false;
  if (filters.projector && !projectorKeys(venue).includes(filters.projector)) return false;
  if (filters.capability && !capabilityKeys(venue).includes(filters.capability)) return false;
  if (filters.state && venue.state !== filters.state) return false;
  return true;
}

export function searchVenues(venues: AppVenueView[], query = '', filters: AppDataFilters = {}): AppVenueView[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return venues.filter((venue) => {
    if (!matchesVenueFilters(venue, filters)) return false;
    if (tokens.length === 0) return true;
    const searchText = venueSearchText(venue);
    return tokens.every((token) => searchText.includes(token));
  });
}
