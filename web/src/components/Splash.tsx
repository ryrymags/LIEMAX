// Splash / home page (Bible §4.1). One job: make a stranger care, then give
// them the one action that does something about it. Stat strip is wired
// live to db (Build Sequence step 15 pulled forward — the numbers already
// come from the generated bundle, not hardcoded copy).
import { useState } from 'react';
import { allVenues, db, searchVenues, type Venue } from '../lib/data';
import { verdictFor, type VerdictTier } from '../lib/verdict';
import TheaterSearch from './TheaterSearch';

interface SplashProps {
  onSelect: (venue: Venue) => void;
}

const RANDOM_WEIGHTS: Array<{ tier: VerdictTier; weight: number }> = [
  { tier: 'liemax', weight: 0.7 },
  { tier: 'imax_lite', weight: 0.2 },
  { tier: 'true_imax', weight: 0.1 },
];

function pickWeightedRandomVenue(): Venue | null {
  const byTier = new Map<VerdictTier, Venue[]>();
  for (const v of allVenues) {
    const tier = verdictFor(v).tier;
    const list = byTier.get(tier) ?? [];
    list.push(v);
    byTier.set(tier, list);
  }

  const available = RANDOM_WEIGHTS.filter((w) => (byTier.get(w.tier)?.length ?? 0) > 0);
  if (available.length === 0) return allVenues[0] ?? null;

  const totalWeight = available.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosenTier: VerdictTier = available[0].tier;
  for (const w of available) {
    if (roll < w.weight) {
      chosenTier = w.tier;
      break;
    }
    roll -= w.weight;
  }

  const candidates = byTier.get(chosenTier) ?? [];
  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}

export default function Splash({ onSelect }: SplashProps) {
  const [query, setQuery] = useState('');
  const [randomPicked, setRandomPicked] = useState(false);

  const trimmed = query.trim();
  const noResults = trimmed.length > 1 && searchVenues(trimmed).length === 0;

  function handleRandomExample() {
    const venue = pickWeightedRandomVenue();
    if (venue) {
      setRandomPicked(true);
      onSelect(venue);
    }
  }

  return (
    <section id="diagnose-my-imax" className="splash" aria-label="Theater diagnosis search" tabIndex={-1}>
      <h2 className="splash-headline">You're probably not getting real IMAX.</h2>

      <ul className="stat-strip">
        <li className="stat">
          <span className="stat-value">{db.total_us_imax}</span>
          <span className="stat-label">IMAX locations in the US</span>
        </li>
        <li className="stat">
          <span className="stat-value">
            {db.not_full_143_digital_count} ({db.not_full_143_digital_pct}%)
          </span>
          <span className="stat-label">are not full-height 1.43 digital</span>
        </li>
        <li className="stat">
          <span className="stat-value">Only {db.gt_laser_count}</span>
          <span className="stat-label">show the full image at every digital showtime</span>
        </li>
      </ul>

      <p className="splash-footnote">
        {db.lfexaminer_supplemental_count} of {db.total_us_imax} listings come from a 2021
        archival source.
      </p>

      <p className="splash-purpose">Search your theater. Find out what you're actually paying for.</p>

      <TheaterSearch onSelect={onSelect} onQueryChange={setQuery} />

      {noResults && (
        <div className="no-results" role="status">
          <p>No IMAX theaters found for "{trimmed}". Want to explore the site anyway?</p>
          <button type="button" className="no-results-button" onClick={handleRandomExample}>
            Show me a random example
          </button>
        </div>
      )}

      {randomPicked && (
        <p className="random-example-note">
          This is a random example — search your own theater above.
        </p>
      )}
    </section>
  );
}
