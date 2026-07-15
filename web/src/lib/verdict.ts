// Verdict tier classification. Ported from docs/diagnosis.js `classify()`
// (the V1 prototype classifier) and extended with the OVERHAUL_BIBLE.md
// §4.2.1 / §6 sub-state and tagline logic for the V2 Layer 1 verdict card.
//
// See .ai/OVERHAUL_BIBLE.md §4.2.1 (badge table + True IMAX sub-states) and
// §6 (tier definitions) — this file is the single source of truth for tier
// assignment; do not duplicate the classification logic elsewhere.
import type { Venue } from './data';

export type VerdictTier = 'true_imax' | 'imax_lite' | 'liemax' | 'dome' | 'unknown';
export type TrueImaxSubState = 'gt_laser' | 'film_conditional' | 'both';

export interface Verdict {
  tier: VerdictTier;
  subState?: TrueImaxSubState;
  /** Text badge label — always paired with color, never color-alone (COMPLIANCE.md). */
  label: string;
  tagline: string;
}

function projectionText(venue: Venue): string {
  const projections = [venue.projection, venue.filmProjection].filter(Boolean) as NonNullable<
    Venue['projection']
  >[];
  return projections
    .map((p) => [p.label, p.display_name, p.light, p.type].filter(Boolean).join(' '))
    .join(' ');
}

function hasDomeShape(venue: Venue): boolean {
  return /dome|omni/i.test(venue.tag ?? '') || venue.screen.geometry === 'hemispherical';
}

function hasDomeCapableProjection(venue: Venue): boolean {
  const modeText = (venue.presentationModes ?? []).map((m) => m.label ?? '').join(' ');
  const text = `${projectionText(venue)} ${modeText}`;
  return /imax_dome_laser|imax_dome_film|laser\s*for\s*dome|dome\s*15\/?70|gt\s*dome|omni/i.test(
    text,
  );
}

function isTrueDome(venue: Venue): boolean {
  return hasDomeShape(venue) && hasDomeCapableProjection(venue);
}

function hasFilm(venue: Venue): boolean {
  return !!(venue.isHybrid && venue.filmProjection);
}

function projectionType(venue: Venue): string | null {
  return venue.projection ? venue.projection.type : null;
}

function isImaxLite(venue: Venue): boolean {
  return /^(imax_cola|imax_laser_xt|imax_gt_dual_laser)$/.test(projectionType(venue) ?? '');
}

function isLiemaxProjector(venue: Venue): boolean {
  return projectionType(venue) === 'imax_dual_xenon';
}

/** True when the venue shows a full-height 1.43 image at every digital (non-film) showtime. */
export function digital143(venue: Venue): boolean {
  const proj = venue.projection;
  if (!proj) return false;
  const isGT = proj.type === 'imax_gt_dual_laser';
  const arOk = venue.screen.ar != null && venue.screen.ar <= 1.45;
  const minArOk = proj.min_ar != null && proj.min_ar <= 1.43;
  return isGT && arOk && minArOk;
}

type Category =
  | 'true_143_film'
  | 'true_143_laser'
  | 'true_film_lie_dig'
  | 'true_dome'
  | 'imax_lite'
  | 'liemax'
  | 'unknown';

export function classify(venue: Venue | null | undefined): Category {
  if (!venue) return 'unknown';
  if (venue.kind === 'home') return 'unknown';
  if (isTrueDome(venue)) return 'true_dome';
  const d143 = digital143(venue);
  const film = hasFilm(venue);
  if (d143 && film) return 'true_143_film';
  if (d143) return 'true_143_laser';
  if (film && venue.screen.ar != null && venue.screen.ar <= 1.45) return 'true_film_lie_dig';
  if (venue.projection?.label && /unknown/i.test(venue.projection.label)) return 'unknown';
  if (isImaxLite(venue)) return 'imax_lite';
  if (isLiemaxProjector(venue)) return 'liemax';
  return 'unknown';
}

const TAGLINES: Record<VerdictTier, string> = {
  true_imax: 'This is the real thing.',
  imax_lite: 'Better than a regular theater, but not the full experience.',
  liemax: "You're paying IMAX prices for a glorified regular screen.",
  dome: 'A unique experience — not a standard IMAX room.',
  unknown: "We don't have enough data to give this theater a verdict yet.",
};

const LABELS: Record<VerdictTier, string> = {
  true_imax: 'TRUE IMAX',
  imax_lite: 'IMAX LITE',
  liemax: 'LIEMAX',
  dome: 'DOME',
  unknown: 'UNKNOWN',
};

function trueImaxTagline(subState: TrueImaxSubState): string {
  switch (subState) {
    case 'film_conditional':
      return (
        'This theater is True IMAX only for 15/70 film showings. Check the schedule for ' +
        '"70mm" or "IMAX 70mm" — a standard digital showing here uses a different, smaller-image projector.'
      );
    case 'both':
      return 'True IMAX — laser projection at every showtime, plus 15/70 film when booked.';
    case 'gt_laser':
    default:
      return TAGLINES.true_imax;
  }
}

export function verdictFor(venue: Venue | null | undefined): Verdict {
  const category = classify(venue);

  switch (category) {
    case 'true_143_film':
      return {
        tier: 'true_imax',
        subState: 'both',
        label: LABELS.true_imax,
        tagline: trueImaxTagline('both'),
      };
    case 'true_143_laser':
      return {
        tier: 'true_imax',
        subState: 'gt_laser',
        label: LABELS.true_imax,
        tagline: trueImaxTagline('gt_laser'),
      };
    case 'true_film_lie_dig':
      return {
        tier: 'true_imax',
        subState: 'film_conditional',
        label: LABELS.true_imax,
        tagline: trueImaxTagline('film_conditional'),
      };
    case 'true_dome':
      return {
        tier: 'dome',
        label: LABELS.dome,
        tagline: TAGLINES.dome,
      };
    case 'imax_lite':
      return {
        tier: 'imax_lite',
        label: LABELS.imax_lite,
        tagline: TAGLINES.imax_lite,
      };
    case 'liemax':
      return {
        tier: 'liemax',
        label: LABELS.liemax,
        tagline: TAGLINES.liemax,
      };
    default:
      return {
        tier: 'unknown',
        label: LABELS.unknown,
        tagline: TAGLINES.unknown,
      };
  }
}
