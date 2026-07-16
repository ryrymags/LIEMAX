// Top-level shell. Bible §4: Nav + Splash always present; selecting a
// theater reveals the Layer 1 verdict card in place below the anchored
// search (the search bar itself stays visible/usable throughout — Splash
// keeps rendering, VerdictCard just appears below it).
import { useState } from 'react';
import type { Venue } from '../lib/data';
import Nav from './Nav';
import Splash from './Splash';
import SplashZoom from './SplashZoom';
import VerdictCard from './VerdictCard';

export default function App() {
  const [selected, setSelected] = useState<Venue | null>(null);

  function handleReset() {
    setSelected(null);
  }

  return (
    <>
      <Nav onReset={handleReset} />
      <main id="main">
        <SplashZoom />
        <Splash onSelect={setSelected} />
        {selected && (
          <>
            <VerdictCard venue={selected} />
            <div className="diagnose-different">
              <button type="button" className="button-secondary" onClick={handleReset}>
                Diagnose a different theater
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
