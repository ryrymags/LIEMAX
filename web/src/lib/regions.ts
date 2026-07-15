// Static state -> region lookup and "nearest True IMAX" logic.
// See .ai/OVERHAUL_BIBLE.md §4.2.4 ("What You're Missing" callout) and §7.
// Deliberately no routing API / geolocation math — a static table only, per
// the Bible's explicit "do not use a routing API for exact drive distance"
// instruction and COMPLIANCE.md's no-silent-geolocation rule.
//
// M1 scope: one region per state. California and Texas stay single regions
// for now (the Bible's NorCal/SoCal, DFW/Houston sub-splits are a later
// milestone) — keep the table simple and correct rather than granular and
// guessed.
import { allVenues, type Venue } from './data';
import { verdictFor } from './verdict';

export const STATE_REGION: Record<string, string> = {
  // New England
  CT: 'New England',
  ME: 'New England',
  MA: 'New England',
  NH: 'New England',
  RI: 'New England',
  VT: 'New England',
  // Mid-Atlantic
  NY: 'Mid-Atlantic',
  NJ: 'Mid-Atlantic',
  PA: 'Mid-Atlantic',
  DE: 'Mid-Atlantic',
  MD: 'Mid-Atlantic',
  DC: 'Mid-Atlantic',
  // Southeast
  VA: 'Southeast',
  NC: 'Southeast',
  SC: 'Southeast',
  GA: 'Southeast',
  FL: 'Southeast',
  AL: 'Southeast',
  MS: 'Southeast',
  TN: 'Southeast',
  KY: 'Southeast',
  WV: 'Southeast',
  AR: 'Southeast',
  LA: 'Southeast',
  // Midwest
  OH: 'Midwest',
  MI: 'Midwest',
  IN: 'Midwest',
  IL: 'Midwest',
  WI: 'Midwest',
  MN: 'Midwest',
  IA: 'Midwest',
  MO: 'Midwest',
  ND: 'Midwest',
  SD: 'Midwest',
  NE: 'Midwest',
  KS: 'Midwest',
  // South Central
  OK: 'South Central',
  TX: 'South Central',
  // Mountain West
  MT: 'Mountain West',
  WY: 'Mountain West',
  CO: 'Mountain West',
  ID: 'Mountain West',
  UT: 'Mountain West',
  NV: 'Mountain West',
  AZ: 'Mountain West',
  NM: 'Mountain West',
  // Pacific
  CA: 'Pacific',
  OR: 'Pacific',
  WA: 'Pacific',
  AK: 'Pacific',
  HI: 'Pacific',
  // Territories
  PR: 'Territories',
};

export function regionForState(state: string | null | undefined): string | null {
  if (!state) return null;
  return STATE_REGION[state.toUpperCase()] ?? null;
}

const NATIONAL_FALLBACK_ID = 'imax_us_ny_new_york_amc_lincoln_square_13_and_imax';

export interface NearestTrueImaxResult {
  venue: Venue;
  isNationalFallback: boolean;
}

/**
 * Unconditional True IMAX venues only: gt_laser or both sub-states, i.e.
 * the ones that show the full image at every digital showtime (Bible
 * §4.2.4 — the callout should point at somewhere the user can reliably see
 * the real thing, not a film-conditional room).
 */
function unconditionalTrueImaxVenues(): Venue[] {
  return allVenues.filter((v) => {
    const verdict = verdictFor(v);
    return (
      verdict.tier === 'true_imax' &&
      (verdict.subState === 'gt_laser' || verdict.subState === 'both')
    );
  });
}

export function nearestTrueImax(state: string | null | undefined): NearestTrueImaxResult {
  const candidates = unconditionalTrueImaxVenues();
  const region = regionForState(state);

  if (region) {
    const inRegion = candidates.find((v) => regionForState(v.state) === region);
    if (inRegion) {
      return { venue: inRegion, isNationalFallback: false };
    }
  }

  const fallback =
    candidates.find((v) => v.id === NATIONAL_FALLBACK_ID) ??
    candidates[0] ??
    allVenues[0];

  return { venue: fallback, isNationalFallback: true };
}
