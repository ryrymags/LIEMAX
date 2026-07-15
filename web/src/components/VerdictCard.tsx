// Layer 1 Instant Verdict card (Bible §4.2). Zero-jargon summary + badge +
// scale diagram + "what you're missing" callout + two-path CTA. This is the
// beginner-layer card only — the Layer 3 technical re-diagnosis is a later
// milestone (Build Sequence step 8 in the Bible).
import { isArchivalSource, venueLocationLabel, type Venue } from '../lib/data';
import { verdictFor } from '../lib/verdict';
import { beginnerVerdictFor, whatYoureMissingFor } from '../lib/copy';
import { nearestTrueImax } from '../lib/regions';
import ScaleDiagram from './ScaleDiagram';

interface VerdictCardProps {
  venue: Venue;
}

export default function VerdictCard({ venue }: VerdictCardProps) {
  const verdict = verdictFor(venue);
  const summary = beginnerVerdictFor(venue, verdict);
  const showMissing = verdict.tier === 'imax_lite' || verdict.tier === 'liemax';
  const missingBody = showMissing ? whatYoureMissingFor(venue, verdict) : null;
  const nearest = showMissing ? nearestTrueImax(venue.state) : null;
  const archival = isArchivalSource(venue);

  return (
    <section className="verdict-card" aria-labelledby="verdict-venue-name">
      <span className={`verdict-badge verdict-badge--${verdict.tier}`}>{verdict.label}</span>
      <h2 id="verdict-venue-name" className="verdict-venue-name">
        {venue.name}
        {venueLocationLabel(venue) ? ` — ${venueLocationLabel(venue)}` : ''}
      </h2>
      <p className="verdict-tagline">{verdict.tagline}</p>

      {archival && (
        <p className="verdict-archival-caveat">
          Based on a 2021 archival listing — this theater may have closed or upgraded.
        </p>
      )}

      <ScaleDiagram venue={venue} />

      <p className="verdict-summary">{summary}</p>

      {showMissing && missingBody && (
        <div className="verdict-missing">
          <h3>
            {nearest?.isNationalFallback
              ? 'The best IMAX in the US'
              : 'Nearest True IMAX in your region'}
          </h3>
          <p>{missingBody}</p>
          {nearest && (
            <p>
              <strong>{nearest.venue.name}</strong>
              {venueLocationLabel(nearest.venue) ? ` — ${venueLocationLabel(nearest.venue)}` : ''}
            </p>
          )}
        </div>
      )}

      <div className="verdict-cta">
        <a className="button-primary" href="#imax-101">
          Why does this happen? Read IMAX 101 ↓
        </a>
        <a className="button-secondary" href="#full-specs">
          Already know the basics? Jump to the full specs →
        </a>
      </div>
    </section>
  );
}
