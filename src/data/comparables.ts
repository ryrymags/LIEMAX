import { resolveHomeDisplay, resolveVenue, type ResolvedHomeDisplay, type ResolvedVenue } from '../math';
import { FORMAT_PRESET_MAP, FORMAT_PRESETS, HOME_DISPLAY_PRESETS, STATIC_VENUE_RECORDS } from './index';

export type ComparableCategory = 'cinema_preset' | 'venue' | 'home_display';

export interface ComparableItem {
  id: string;
  label: string;
  sublabel?: string;
  category: ComparableCategory;
  rawPreset: Record<string, any> | null;
  rawVenue: Record<string, any> | null;
  rawHomePreset: Record<string, any> | null;
}

export function getComparableItems(csvVenues: Record<string, any>[]): ComparableItem[] {
  const items: ComparableItem[] = [];
  const venueIds = new Set<string>();

  for (const preset of FORMAT_PRESETS) {
    items.push({
      id: `preset:${preset.id}`,
      label: preset.display_name,
      sublabel: preset.short_description,
      category: 'cinema_preset',
      rawPreset: preset,
      rawVenue: null,
      rawHomePreset: null,
    });
  }

  for (const venue of STATIC_VENUE_RECORDS) {
    venueIds.add(venue.id);
    items.push(toVenueItem(venue));
  }

  for (const venue of csvVenues) {
    if (!venue.id || venueIds.has(venue.id)) continue;
    venueIds.add(venue.id);
    items.push(toVenueItem(venue));
  }

  for (const preset of HOME_DISPLAY_PRESETS) {
    items.push({
      id: `home:${preset.id}`,
      label: preset.display_name,
      sublabel: preset.short_description,
      category: 'home_display',
      rawPreset: null,
      rawVenue: null,
      rawHomePreset: preset,
    });
  }

  return items;
}

export function resolveItem(item: ComparableItem):
  | { type: 'venue'; resolved: ResolvedVenue }
  | { type: 'home'; resolved: ResolvedHomeDisplay }
  | null {
  if (item.category === 'home_display' && item.rawHomePreset) {
    return {
      type: 'home',
      resolved: resolveHomeDisplay(item.rawHomePreset, {
        id: item.rawHomePreset.id,
        user_label: item.rawHomePreset.display_name,
      }),
    };
  }

  const preset = item.rawPreset ?? presetForVenue(item.rawVenue);
  if (!preset) return null;

  const venueRecord = item.rawVenue ?? {
    id: item.rawPreset?.id,
    name: item.rawPreset?.display_name,
    ...averagePresetVenueDefaults(item.rawPreset?.id),
  };

  return {
    type: 'venue',
    resolved: resolveVenue(preset, venueRecord),
  };
}

function averagePresetVenueDefaults(presetId: string | undefined): Record<string, any> {
  if (!presetId) return {};

  const screen = AVERAGE_PRESET_SCREENS[presetId];
  if (!screen) return {};

  return {
    screen,
    metadata: {
      uses_average_format_screen: true,
    },
  };
}

const AVERAGE_PRESET_SCREENS: Record<string, Record<string, any>> = {
  imax_gt_dual_laser: averageScreen(84, 1.43, 'slight_cylindrical_curve'),
  imax_1570_film: averageScreen(84, 1.43, 'slight_cylindrical_curve'),
  imax_cola: averageScreen(60, 1.90),
  imax_dual_xenon: averageScreen(60, 1.90),
  imax_dome_laser: {
    width_ft: 76,
    height_ft: 76,
    aspect_ratio: 1,
    geometry: 'hemispherical',
    screen_bottom_height_ft: 0,
    dome_coverage_pct: 83,
  },
  imax_dome_film: {
    width_ft: 76,
    height_ft: 76,
    aspect_ratio: 1,
    geometry: 'hemispherical',
    screen_bottom_height_ft: 0,
    dome_coverage_pct: 83,
  },
  dolby_cinema: averageScreen(55, 1.85),
  dolby_cinema_single_laser: averageScreen(55, 1.85),
  cinemark_xd: averageScreen(62, 1.90),
};

function averageScreen(widthFt: number, aspectRatio: number, geometry = 'flat'): Record<string, any> {
  return {
    width_ft: widthFt,
    height_ft: Number((widthFt / aspectRatio).toFixed(1)),
    aspect_ratio: aspectRatio,
    geometry,
    screen_bottom_height_ft: 5,
  };
}

function toVenueItem(venue: Record<string, any>): ComparableItem {
  return {
    id: `venue:${venue.id}`,
    label: venue.name ?? venue.source_143190?.location_name ?? venue.id,
    sublabel: venueSublabel(venue),
    category: 'venue',
    rawPreset: null,
    rawVenue: venue,
    rawHomePreset: null,
  };
}

function presetForVenue(venue: Record<string, any> | null): Record<string, any> | null {
  if (!venue) return null;
  return FORMAT_PRESET_MAP.get(venue.preset_id) ?? FORMAT_PRESET_MAP.get('imax_cola') ?? null;
}

function venueSublabel(venue: Record<string, any>): string | undefined {
  const location = [venue.city, venue.state_province, venue.country].filter(Boolean).join(', ');
  return location || venue.brand_label || undefined;
}
