// Layer 1 zero-jargon copy generation. See .ai/OVERHAUL_BIBLE.md §4.2.2
// (translation rules) and §4.2.4 ("What You're Missing" callout).
//
// CARDINAL RULE (Bible §4.2, non-negotiable): no format names, no ratios, no
// spec numbers anywhere in this file's output. No "1.43", "CoLa", "GT",
// "xenon", "1.90", etc. Only relatable, human-scale language. The tier NAMES
// ("LIEMAX" / "IMAX LITE" / "TRUE IMAX" / "DOME") are the sole exception —
// they're proper nouns the badge already displays.
import type { Venue } from './data';
import { venueLocationLabel } from './data';
import type { Verdict } from './verdict';

function hasKnownScreen(venue: Venue): boolean {
  const { w, h } = venue.screen;
  return typeof w === 'number' && w > 0 && typeof h === 'number' && h > 0;
}

/** Relatable comparison for a screen width in feet. Ladder, not a single fixed phrase. */
function relatableWidth(wFt: number): string {
  if (wFt >= 85) return 'about as wide as a basketball court is long';
  if (wFt >= 65) return 'roughly two school buses parked end to end';
  if (wFt >= 45) return 'about the width of a tennis court';
  return 'roughly the width of a two-car garage, stretched out';
}

/** Relatable comparison for screen height in feet, framed as building stories. */
function relatableHeight(hFt: number): string {
  const stories = Math.round(hFt / 10);
  if (stories >= 6) return `about as tall as a ${stories}-story building`;
  if (stories >= 3) return `about as tall as a ${stories}-story house`;
  return 'a bit taller than a two-story house';
}

function domeSummary(venue: Venue, name: string): string {
  const { w } = venue.screen;
  const sizeLine =
    typeof w === 'number' && w > 0
      ? ` The screen wraps most of the way around you — roughly ${Math.round(w)} feet across at its widest — `
      : ' The screen wraps most of the way around you ';
  return (
    `${name} isn't a flat screen at all — it's a dome that curls up and over your field of ` +
    `view.${sizeLine}so the image surrounds you instead of sitting in front of you. It's built for ` +
    `documentaries and space footage that are meant to feel like you're inside them, not for a typical movie ` +
    `showing.`
  );
}

/**
 * Zero-jargon Layer 1 summary paragraph for a venue + its verdict.
 * Fails closed (no fake numbers) when screen dimensions are unknown.
 */
export function beginnerVerdictFor(venue: Venue, verdict: Verdict): string {
  const name = venue.name;
  const location = venueLocationLabel(venue);
  const locationClause = location ? ` in ${location}` : '';

  if (verdict.tier === 'dome') {
    return domeSummary(venue, name);
  }

  if (!hasKnownScreen(venue)) {
    return (
      `We don't have verified screen measurements for ${name}${locationClause} yet, so we can't ` +
      `show you the full picture here. Based on what we do know, here's the general read: ${verdict.tagline}`
    );
  }

  const wFt = Math.round(venue.screen.w as number);
  const hFt = Math.round(venue.screen.h as number);
  const widthPhrase = relatableWidth(wFt);
  const heightPhrase = relatableHeight(hFt);

  const arLossClause =
    'About a quarter of the picture is cut off on the tallest movies — the kind made to fill the ' +
    'entire screen top to bottom. Here, the top and bottom get trimmed off so it fits a shorter frame.';

  switch (verdict.tier) {
    case 'true_imax': {
      if (verdict.subState === 'film_conditional') {
        return (
          `${name}${locationClause} has a screen that's ${widthPhrase} — ${heightPhrase}. On the rare ` +
          `showtimes when this theater runs a physical film print, you get the full, uncropped picture the ` +
          `way it was meant to be seen. But most showtimes here don't use that film print — they use a ` +
          `different projector on the same big screen, and on those, ${arLossClause.toLowerCase()}`
        );
      }
      const filmNote =
        verdict.subState === 'both'
          ? ' It also keeps a physical film projector on hand for special showings, on top of that.'
          : '';
      return (
        `${name}${locationClause} has a screen that's ${widthPhrase} — ${heightPhrase}. This is the real, ` +
        `full-size experience: every digital showing here uses the entire screen, with nothing trimmed off ` +
        `the top or bottom.${filmNote}`
      );
    }
    case 'imax_lite':
      return (
        `${name}${locationClause} has a screen that's ${widthPhrase} — ${heightPhrase}, and the projector ` +
        `is a real step up from an ordinary theater. But it's not the full picture: ${arLossClause}`
      );
    case 'liemax':
      return (
        `${name}${locationClause} has a screen that's ${widthPhrase} — ${heightPhrase}. It's a bigger, ` +
        `louder room than a standard auditorium, but the projector is older technology and it doesn't show ` +
        `the full picture: ${arLossClause}`
      );
    default:
      return (
        `We don't have enough information about ${name}${locationClause} to give you a confident verdict ` +
        `yet.`
      );
  }
}

/**
 * "What You're Missing" callout body (Bible §4.2.4). LIEMAX/IMAX Lite only —
 * callers should gate on verdict.tier before rendering this.
 */
export function whatYoureMissingFor(venue: Venue, verdict: Verdict): string {
  if (verdict.tier === 'imax_lite') {
    return (
      "You're seeing a real premium screen, but the tallest, most immersive version of the picture — the " +
      'kind some movies are specifically made for — isn\'t available at this theater. A True IMAX room ' +
      'shows more of the image, top to bottom, on a noticeably bigger screen.'
    );
  }
  if (verdict.tier === 'liemax') {
    return (
      "You're paying a premium for a screen that doesn't show the full picture and runs on older projection " +
      'technology. A True IMAX room nearby shows more of the image, on a bigger screen, with a sharper, ' +
      'brighter picture.'
    );
  }
  return `Here's the venue this theater is being measured against: ${venue.name}.`;
}
