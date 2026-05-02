/* LIEMAX Comparison Workbench — V3 React app
   Loaded via Babel standalone; window.React and window.ReactDOM are CDN globals.
   All comparison rows mirror src/compare/types.ts shape:
     { id, label, aDisplay, bDisplay, winner, badgeLabel, note? }
     winner: 'a' | 'b' | 'tie' | 'unknown'
*/

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const D = window.LIEMAX_DATA;
const M = window.LIEMAX_MATH;
const W = window.LIEMAX_WORKBENCH;
const STAGE = window.LIEMAX_STAGE;
const DIAG = window.LIEMAX_DIAGNOSE;

// ─── Formatting helpers ────────────────────────────────────────────────────────

function fmtNum(n, digits) {
  if (n == null || !isFinite(n)) return "—";
  if (Math.abs(n) >= 10000) return Math.round(n).toLocaleString();
  return n.toFixed(digits ?? 1);
}
function fmtInt(n) {
  if (n == null || !isFinite(n)) return "—";
  return Math.round(n).toLocaleString();
}

const SOURCE_LINKS = [
  { label: "LF Examiner large formats", href: "https://lfexaminer.com/large-formats/" },
  { label: "LF Examiner projector key", href: "https://lfexaminer.com/converted-theaters/" },
  { label: "LF Examiner viewing angles", href: "https://lfexaminer.com/2009/05/what-is-immersive/" },
  { label: "IMAX Filmed in IMAX cameras", href: "https://imaxcorporation.gcs-web.com/news-releases/news-release-details/imax-launches-new-filmed-imax-program-worlds-leading-digital" },
  { label: "IMAX annual filing", href: "https://investors.imax.com/static-files/433f6acf-7f22-4fe3-a27c-78fd40000bc8" },
  { label: "IMAX F1 1.90 example", href: "https://investors.imax.com/news-releases/news-release-details/imax-races-28-million-opening-weekend-f1r-movie/" },
  { label: "Kodak Sinners formats", href: "https://www.kodak.com/en/motion/blog-post/sinners/" },
];

const FORMAT_EXAMPLES = [
  {
    label: "Shot with IMAX film cameras",
    kicker: "15/70 film camera",
    examples: "Oppenheimer, Sinners, Dunkirk, Interstellar",
    note: "This is the tall 1.43:1 IMAX film lineage. It only reaches full height in 15/70 film or GT/Dome laser venues that can actually show 1.43.",
  },
  {
    label: "Filmed for IMAX / certified digital",
    kicker: "often 1.90 digital",
    examples: "F1: The Movie, Dune / Dune: Part Two",
    note: "These use IMAX-certified digital workflows or IMAX-specific framing. Many fill 1.90 IMAX screens; only select titles/venues reach 1.43.",
  },
  {
    label: "Standard theatrical framing",
    kicker: "scope / flat",
    examples: "Dune scope scenes, The Batman, most 1.85 dramas",
    note: "Most non-IMAX releases are 2.39 scope or 1.85 flat. IMAX branding alone does not create extra image if the movie was mastered wide.",
  },
];

const EXPLAINER_CARDS = [
  {
    title: "The screen is only half the answer",
    body: "A tall 1.43 screen can still play normal digital IMAX at 1.90 if the installed projector or booked format cannot drive the full height. LIEMAX is the nickname for IMAX-branded rooms that cap the everyday digital image at 1.90.",
  },
  {
    title: "Projector tiers, plain English",
    body: "GT Dual Laser and 15/70 film are the flat-screen routes to full 1.43. CoLa, Laser XT, and Dual Xenon are multiplex digital systems that normally top out at 1.90. IMAX Dome Laser and IMAX Dome 15/70 are real IMAX too, but their geometry wraps around you instead of behaving like a rectangle.",
  },
  {
    title: "Why 1.43 matters",
    body: "A 1.43 IMAX frame is much taller than a 1.90 digital IMAX frame and radically taller than 2.39 scope. When 1.43 content is forced through 1.90, about 24.7% of the vertical frame is gone.",
  },
  {
    title: "FOV, PPD, and confidence",
    body: "FOV tells you how much of your vision the image fills. PPD estimates perceived sharpness from that seat. Confidence labels tell you whether a number is published, imported from 143190 / r-imax, inherited from a preset, derived, or community-estimated.",
  },
];

const CURATED_SUGGESTION_IDS = [
  "imax_us_ny_new_york_amc_lincoln_square_13_and_imax",
  "imax_us_ca_san_francisco_amc_metreon_16_and_imax",
  "imax_us_az_grand_canyon_grand_canyon_imax_grand_canyon_visitor_center",
  "imax_us_mi_detroit_chrysler_imax_dome_theatre_michigan_science_center",
  "imax_us_al_birmingham_imax_dome_mcwane_center",
  "apple_providence_imax",
  "imax_us_ma_reading_sunbrella_imax_3d_theater_reading",
  "imax_us_ca_hollywood_tcl_chinese_theatres_imax",
  "imax_us_az_tempe_harkins_arizona_mills_25_and_imax",
  "imax_us_ca_irvine_regal_edwards_irvine_spectrum_and_imax",
  "imax_us_dc_washington_lockheed_martin_imax_theater",
  "imax_us_tx_austin_bullock_texas_state_history_museum_imax",
];

function shuffleSample(items, count) {
  const pool = items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function realCinemaVenues() {
  return D.venues.filter(v => v.kind === "cinema" && !v.isPreset);
}

function categoryCounts(venues) {
  const total = venues.length;
  const counts = {
    total,
    liemax: 0,
    true143: 0,
    film143: 0,
    dome: 0,
    hybrid: 0,
    unknown: 0,
  };
  venues.forEach(v => {
    const category = DIAG.classify(v);
    if (category === "liemax") counts.liemax += 1;
    if (category === "true_143_film" || category === "true_143_laser") counts.true143 += 1;
    if (category === "true_143_film" || category === "true_film_lie_dig") counts.film143 += 1;
    if (category === "true_dome") counts.dome += 1;
    if (category === "true_film_lie_dig") counts.hybrid += 1;
    if (category === "unknown") counts.unknown += 1;
  });
  return counts;
}

function pct(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function verticalFrameLoss(contentAr = 1.43, presentationAr = 1.90) {
  const retained = Math.min(1, contentAr / presentationAr);
  return { retainedPct: retained * 100, lostPct: (1 - retained) * 100 };
}

// ─── Stats computation ────────────────────────────────────────────────────────

function compatiblePresentationModes(venue, filmMode) {
  return W.compatiblePresentationModes(venue, filmMode);
}

function defaultPresArFor(venue, filmMode) {
  return W.defaultPresArFor(venue, filmMode);
}

function resolvePresAr(venue, requestedPresAr, filmMode) {
  return W.resolvePresAr(venue, requestedPresAr, filmMode);
}

function computeStats(venue, seat, contentAr, requestedPresAr, filmMode) {
  return W.computeStats(venue, seat, contentAr, requestedPresAr, filmMode);
}

// ─── Comparison row builders ──────────────────────────────────────────────────

function makeRow(id, label, aVal, bVal, aDisplay, bDisplay, higherWins) {
  if (aDisplay === bDisplay && aVal != null && bVal != null) {
    return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
  }
  if (aVal == null || bVal == null) {
    return { id, label, aDisplay, bDisplay, winner: "unknown", badgeLabel: "Unknown" };
  }
  if (!isFinite(aVal) && !isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
  }
  if (!isFinite(aVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? "a" : "b", badgeLabel: higherWins ? "A wins" : "B wins" };
  }
  if (!isFinite(bVal)) {
    return { id, label, aDisplay, bDisplay, winner: higherWins ? "b" : "a", badgeLabel: higherWins ? "B wins" : "A wins" };
  }
  const wins = higherWins ? aVal > bVal : aVal < bVal;
  const winner = aVal === bVal ? "tie" : (wins ? "a" : "b");
  const badgeMap = { a: "A wins", b: "B wins", tie: "Comparable", unknown: "Unknown" };
  return { id, label, aDisplay, bDisplay, winner, badgeLabel: badgeMap[winner] };
}

const HDR_RANK = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };

function makeHdrRow(id, label, catA, catB, labelA, labelB) {
  const rankA = HDR_RANK[catA] ?? -1;
  const rankB = HDR_RANK[catB] ?? -1;
  const isDiffSystems =
    (catA === "photochemical" && catB === "dolby_vision") ||
    (catA === "dolby_vision" && catB === "photochemical");
  if (isDiffSystems) {
    return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable", note: "Different systems — not directly comparable" };
  }
  if (rankA === rankB) {
    return { id, label, aDisplay: labelA, bDisplay: labelB, winner: "tie", badgeLabel: "Comparable" };
  }
  const winner = rankA > rankB ? "a" : "b";
  return { id, label, aDisplay: labelA, bDisplay: labelB, winner, badgeLabel: winner === "a" ? "A wins" : "B wins" };
}

function buildComparisonRows(sideA, sideB, statsA, statsB) {
  return W.buildComparisonRows(sideA, sideB, statsA, statsB);
}

// ─── Verdict builder ──────────────────────────────────────────────────────────

const VERDICT_LABEL = {
  visible_hfov: "horizontal immersion", visible_vfov: "vertical immersion",
  ppd: "sharpness", area: "visible image area",
  util: "screen utilization", brightness: "brightness",
  contrast: "native contrast", hdr: "HDR black level", depth: "picture depth",
};

function buildVerdict(sideA, sideB, rows, contentLabel) {
  return W.buildVerdict(sideA, sideB, rows, contentLabel);
}

// ─── ConfLabel ────────────────────────────────────────────────────────────────

function maskConfidenceLabel(src, mask) {
  const meta = D.qualityMeta[src.q] || { label: src.q, tier: 3 };
  if (src.q !== "preset_typical" || !mask) return meta.label;
  if (mask.letterbox) return "Est. (letterboxed)";
  if (mask.pillarbox) return "Est. (side-masked)";
  if (mask.cropped) return "Est. (cropped)";
  return meta.label;
}

function ConfLabel({ src, mask }) {
  if (!src) return null;
  const meta = D.qualityMeta[src.q] || { label: src.q, tier: 3 };
  const label = maskConfidenceLabel(src, mask);
  return (
    <span className="conf-label" data-tier={meta.tier}
      data-text={`${meta.label} — ${src.note}`} aria-label={label} tabIndex={0}>
      {label}
    </span>
  );
}

// ─── Picker ───────────────────────────────────────────────────────────────────

function Picker({ side, sideColor, venue, presAr, filmMode, presentationNote, onChangeVenue, onChangePresAr, onChangeFilmMode, excludeId }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const groups = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = v => {
      if (v.id === excludeId) return false;
      if (tokens.length === 0) return true;
      const fields = [v.name, v.city, v.state, v.stateName].filter(Boolean).map(s => String(s).toLowerCase());
      return tokens.every(token => fields.some(field => field.includes(token)));
    };
    const filtered = D.venues.filter(matches);
    const cinemas = filtered.filter(v => v.kind === "cinema");
    const home = filtered.filter(v => v.kind === "home");
    const byState = new Map();

    cinemas.forEach(v => {
      const key = v.isPreset ? "FORMAT PRESETS" : (v.stateName || v.state || "OTHER");
      if (!byState.has(key)) byState.set(key, []);
      byState.get(key).push(v);
    });

    const cinemaGroups = [...byState.entries()]
      .sort(([a], [b]) => {
        if (a === "FORMAT PRESETS") return -1;
        if (b === "FORMAT PRESETS") return 1;
        return a.localeCompare(b);
      })
      .map(([label, items]) => ({
        label, count: items.length,
        items: items.slice().sort((a, b) => (a.city || "").localeCompare(b.city || "") || a.name.localeCompare(b.name)),
      }));

    if (home.length > 0) {
      cinemaGroups.push({ label: "HOME DISPLAYS", count: null, items: home.slice().sort((a, b) => a.name.localeCompare(b.name)) });
    }

    return cinemaGroups;
  }, [query, excludeId]);

  function pickVenue(v) { onChangeVenue(v); setOpen(false); setQuery(""); }

  const proj = (filmMode && venue.filmProjection) ? venue.filmProjection : venue.projection;
  const screenSrc = venue.sources.screen;
  const meta = D.qualityMeta[screenSrc.q] || { label: screenSrc.q, tier: 3 };

  return (
    <div ref={ref} className="picker-v3">
      <button className="picker-v3__card" onClick={() => setOpen(o => !o)}
        aria-expanded={open} aria-haspopup="listbox" type="button">
        <div className="picker-v3__top">
          <span className="picker-v3__side" style={{ background: sideColor }}>SIDE {side}</span>
          <span className="picker-v3__hint">{open ? "CLOSE ▲" : "CHANGE ▼"}</span>
        </div>
        <div className="picker-v3__name">{venue.name}</div>
        <div className="picker-v3__sub">{venue.sub}</div>
        <div className="meta-chips" onClick={e => e.stopPropagation()}>
          <span className="meta-chip meta-chip--screen">Screen {venue.screen.ar.toFixed(2)}:1</span>
          <span className="meta-chip meta-chip--pres">Showing {presAr.toFixed(2)}:1</span>
          <span className="meta-chip meta-chip--proj">{proj.label}</span>
          <span className="meta-chip meta-chip--source" data-tier={meta.tier}>{meta.label}</span>
        </div>
        {presentationNote && <div className="presentation-note">{presentationNote}</div>}
      </button>

      {open && (
        <div className="picker-v3__dropdown" role="listbox">
          <div className="picker-v3__search-wrap">
            <input ref={searchRef} type="text" className="picker-v3__search"
              placeholder="Search theaters, formats, displays…"
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
              aria-label="Search" />
            <div className="picker-v3__source-note">
              IMAX theater listings come from 143190.xyz, including current U.S. dome rows. Older Xenon-only IMAX venues still need a supplemental source.
            </div>
          </div>
          {groups.length === 0 && <div className="picker-v3__empty">No results for "{query}"</div>}
          {groups.map(g => (
            <div key={g.label}>
              <div className="picker-v3__group-label">{g.label}{g.count != null ? ` (${g.count})` : ""}</div>
              {g.items.map(v => {
                const tag = quickCategoryTag(v);
                return (
                  <button key={v.id} className="picker-v3__item" role="option" onClick={() => pickVenue(v)}>
                    <div className="picker-v3__item-main">
                      <div className="picker-v3__item-name">{v.name}</div>
                      <div className="picker-v3__item-sub">{v.sub}</div>
                    </div>
                    {tag && <span className="picker-v3__item-tag" style={{ color: tag.color }}>{tag.text}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <HybridToggle venue={venue} filmMode={filmMode} onChangeFilmMode={onChangeFilmMode} />
      <ScreenArSelector venue={venue} presAr={presAr} filmMode={filmMode} onChangePresAr={onChangePresAr} />
    </div>
  );
}

// ─── Hybrid toggle ────────────────────────────────────────────────────────────

function HybridToggle({ venue, filmMode, onChangeFilmMode }) {
  if (!venue.isHybrid || !venue.filmProjection) return null;
  return (
    <div className="hybrid-section">
      <span className="hybrid-label">PROJECTION MODE</span>
      <div className="hybrid-toggle">
        <button className={`hybrid-btn ${!filmMode ? "is-active" : ""}`} onClick={() => onChangeFilmMode(false)} type="button">Digital</button>
        <button className={`hybrid-btn ${filmMode ? "is-active" : ""}`} onClick={() => onChangeFilmMode(true)} type="button">15/70 Film</button>
      </div>
      {filmMode && <span className="hybrid-booking-note">Film bookings only — check venue schedule</span>}
    </div>
  );
}

// ─── Format selector ──────────────────────────────────────────────────────────

function ScreenArSelector({ venue, presAr, filmMode, onChangePresAr }) {
  const modes = compatiblePresentationModes(venue, filmMode);
  return (
    <div className="screen-ar-section">
      <span className="screen-ar-label">FORMAT</span>
      <div className="screen-ar-row">
        {modes.map(m => {
          const isActive = Math.abs(m.ar - presAr) < 0.01;
          return (
            <button key={m.id} className={`screen-ar-btn ${isActive ? "is-active" : ""}`}
              onClick={() => onChangePresAr(m.ar)} type="button">
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stage ────────────────────────────────────────────────────────────────────

function Stage({ venueA, venueB, statsA, statsB, filmModeA, filmModeB }) {
  const svgRef = useRef(null);
  const contentArA = statsA.presAr;
  const contentArB = statsB.presAr;

  const stageA = useMemo(() => ({
    ...venueA,
    projection: { ...(filmModeA && venueA.filmProjection ? venueA.filmProjection : venueA.projection), min_ar: statsA.presAr },
  }), [venueA, filmModeA, statsA.presAr]);

  const stageB = useMemo(() => ({
    ...venueB,
    projection: { ...(filmModeB && venueB.filmProjection ? venueB.filmProjection : venueB.projection), min_ar: statsB.presAr },
  }), [venueB, filmModeB, statsB.presAr]);

  useEffect(() => {
    if (svgRef.current) STAGE(svgRef.current, stageA, stageB, contentArA, contentArB);
  }, [stageA, stageB, contentArA, contentArB]);

  function screenSurfaceArea(venue) {
    if (venue.screen.geometry === "hemispherical") {
      const r = venue.screen.w / 2;
      return 2 * Math.PI * r * r * (venue.screen.domeCoveragePct || 0.83);
    }
    return venue.screen.w * venue.screen.h;
  }

  const aArea = screenSurfaceArea(venueA);
  const bArea = screenSurfaceArea(venueB);
  const biggerSide = aArea >= bArea ? "A" : "B";
  const ratio = (Math.max(aArea, bArea) / Math.min(aArea, bArea)).toFixed(2);
  const hasDome = venueA.screen.geometry === "hemispherical" || venueB.screen.geometry === "hemispherical";
  const stageTitle = contentArA === contentArB
    ? `SCREEN SCALE · ${contentArA.toFixed(2)} CONTENT AR`
    : `SCREEN SCALE · A ${contentArA.toFixed(2)} / B ${contentArB.toFixed(2)}`;

  return (
    <section className="stage">
      <div className="stage__header">
        <span className="stage__title">{stageTitle}</span>
        <div className="stage__legend">
          <span className="stage__legend-item"><span className="stage__swatch" style={{ background: "var(--side-a)" }} />A · {venueA.tag}</span>
          <span className="stage__legend-item"><span className="stage__swatch" style={{ background: "var(--side-b)" }} />B · {venueB.tag}</span>
        </div>
      </div>
      <svg ref={svgRef} className="stage__svg" style={{ minHeight: 360 }} aria-label="Screen scale visualization" />
      <div className="stage__caption">
        Drawn to true relative scale. {hasDome ? "Dome shown as scaled circular cross-section with filled research-default coverage." : "Solid fill = visible content area · Translucent outline = full physical screen."} Figure = 5ʹ9ʺ.
        {" "}Side {biggerSide} screen surface is <strong>{ratio}×</strong> the other.
      </div>
    </section>
  );
}

// ─── Stat grid ────────────────────────────────────────────────────────────────

function winBadgeClass(winner) {
  if (winner === "tie") return "stats__win-badge stats__win-badge--tie";
  if (winner === "unknown") return "stats__win-badge stats__win-badge--unknown";
  return "stats__win-badge";
}

function CategoricalValue({ text, hdrCategory }) {
  const cls = hdrCategory === "dolby_vision" ? "hdr-val hdr-val--dv"
    : (hdrCategory === "hdr10" || hdrCategory === "hdr10plus") ? "hdr-val hdr-val--hdr"
    : hdrCategory === "photochemical" ? "hdr-val hdr-val--photo"
    : "hdr-val hdr-val--sdr";
  return <span className={cls}>{text}</span>;
}

function StatRow({ row, srcA, srcB, projA, projB, maskA, maskB }) {
  const isCategorical = row.id === "hdr" || row.id === "depth";
  const catA = projA ? projA.hdrCategory : null;
  const catB = projB ? projB.hdrCategory : null;
  return (
    <div className="stats__row">
      <div className="stats__cell stats__cell--a">
        {row.winner === "a" && <span className={winBadgeClass(row.winner)}>A WINS</span>}
        {isCategorical ? <CategoricalValue text={row.aDisplay} hdrCategory={catA} /> : <span className="stats__value">{row.aDisplay}</span>}
        {srcA && <ConfLabel src={srcA} mask={maskA} />}
      </div>
      <div className="stats__metric">
        {row.label}
        {row.winner === "tie" && <span className={winBadgeClass("tie")} style={{ display: "block", marginTop: 4 }}>COMPARABLE</span>}
        {row.winner === "unknown" && <span className={winBadgeClass("unknown")} style={{ display: "block", marginTop: 4 }}>UNKNOWN</span>}
        {row.explain && <span className="stats__explain">{row.explain}</span>}
        {row.note && <span className="stats__note">{row.note}</span>}
      </div>
      <div className="stats__cell stats__cell--b">
        {srcB && <ConfLabel src={srcB} mask={maskB} />}
        {isCategorical ? <CategoricalValue text={row.bDisplay} hdrCategory={catB} /> : <span className="stats__value">{row.bDisplay}</span>}
        {row.winner === "b" && <span className={winBadgeClass(row.winner)}>B WINS</span>}
      </div>
    </div>
  );
}

function StatGrid({ rows, sideA, sideB, statsA, statsB }) {
  const projA = statsA.proj;
  const projB = statsB.proj;

  function srcForRow(rowId, side) {
    const v = side === "a" ? sideA : sideB;
    const s = v.sources;
    const map = {
      visible_hfov: s.seat, visible_vfov: s.seat,
      ppd: s.screen, area: s.screen,
      util: s.screen, brightness: s.brightness,
      contrast: s.contrast, hdr: s.contrast, depth: s.contrast,
    };
    return map[rowId] || null;
  }

  return (
    <div className="stats">
      {rows.map(row => (
        <StatRow key={row.id} row={row}
          srcA={srcForRow(row.id, "a")} srcB={srcForRow(row.id, "b")}
          projA={projA} projB={projB} maskA={statsA.mask} maskB={statsB.mask} />
      ))}
    </div>
  );
}

// ─── Verdict ──────────────────────────────────────────────────────────────────

function Verdict({ verdict, contentLabel }) {
  function renderSentence(sentence, index) {
    const name = sentence.side === "a" ? verdict.aName : sentence.side === "b" ? verdict.bName : null;
    return (
      <React.Fragment key={`${sentence.side || "tie"}-${index}`}>
        {name ? <><strong>{name}</strong> {sentence.text}</> : sentence.text}
        {" "}
      </React.Fragment>
    );
  }
  return (
    <div className="verdict">
      <div className="verdict__eyebrow">VERDICT · {contentLabel.toUpperCase()} CONTENT</div>
      <p className="verdict__text">{verdict.sentences.map(renderSentence)}</p>
    </div>
  );
}

// ─── Education / stats panels ─────────────────────────────────────────────────

function AspectRatioMini({ compact = false }) {
  const loss = verticalFrameLoss();
  return (
    <div className={`ar-mini ${compact ? "ar-mini--compact" : ""}`}>
      <div className="ar-mini__frames" aria-label="Aspect ratio comparison">
        <div className="ar-frame ar-frame--143"><span>1.43</span></div>
        <div className="ar-frame ar-frame--190"><span>1.90</span></div>
        <div className="ar-frame ar-frame--239"><span>2.39</span></div>
      </div>
      <p>
        1.43 is the tall IMAX frame. Normal digital IMAX is often 1.90, and many movies are 2.39 scope.
        A 1.43 movie forced into 1.90 retains about <strong>{fmtNum(loss.retainedPct, 1)}%</strong> of its height and loses about <strong>{fmtNum(loss.lostPct, 1)}%</strong>.
      </p>
    </div>
  );
}

function EducationPrimer() {
  return (
    <section className="education" id="learn">
      <div className="education__head">
        <div>
          <div className="education__eyebrow">IMAX 101</div>
          <h3>What the diagnosis is really checking</h3>
        </div>
        <p>
          IMAX is a brand, a camera ecosystem, a projection standard, a sound package, and sometimes just a multiplex upgrade.
          This site separates those pieces so the ticket matches the experience.
        </p>
      </div>

      <AspectRatioMini />

      <div className="explain-grid">
        {EXPLAINER_CARDS.map(card => (
          <article className="explain-card" key={card.title}>
            <h4>{card.title}</h4>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="film-examples">
        <div className="film-examples__label">Movie examples, not a database</div>
        {FORMAT_EXAMPLES.map(group => (
          <div className="film-example" key={group.label}>
            <span className="film-example__kicker">{group.kicker}</span>
            <h4>{group.label}</h4>
            <div className="film-example__titles">{group.examples}</div>
            <p>{group.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DataStatsPanel({ selectedState, onSelectState, states }) {
  const allVenues = realCinemaVenues();
  const national = categoryCounts(allVenues);
  const scopedVenues = selectedState
    ? allVenues.filter(v => v.state === selectedState)
    : allVenues;
  const scoped = categoryCounts(scopedVenues);
  const label = selectedState
    ? (states.find(s => s.code === selectedState)?.name || selectedState)
    : "United States snapshot";
  const statItems = [
    { label: "IMAX rows", value: scoped.total, sub: selectedState ? "in selected state" : "U.S. film / laser / dome rows" },
    { label: "LIEMAX", value: `${scoped.liemax} (${pct(scoped.liemax, scoped.total)})`, sub: "digital cap is normally 1.90" },
    { label: "True flat 1.43", value: scoped.true143, sub: "GT Laser and/or 15/70 + GT" },
    { label: "15/70 capable", value: scoped.film143, sub: "booked film engagements only" },
    { label: "Dome", value: scoped.dome, sub: "fixed 180° × 125° coverage" },
  ];

  return (
    <section className="data-stats" aria-label="Dataset summary">
      <div className="data-stats__top">
        <div>
          <div className="data-stats__eyebrow">Dataset reality check</div>
          <h3>{label}</h3>
        </div>
        <label className="state-select">
          <span>State</span>
          <select value={selectedState} onChange={e => onSelectState(e.target.value)}>
            <option value="">National</option>
            {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
          </select>
        </label>
      </div>
      <div className="data-stats__grid">
        {statItems.map(item => (
          <div className="data-stat" key={item.label}>
            <span className="data-stat__value">{item.value}</span>
            <span className="data-stat__label">{item.label}</span>
            <span className="data-stat__sub">{item.sub}</span>
          </div>
        ))}
      </div>
      <p className="data-stats__note">
        Based on the current static docs bundle: {national.total} U.S. IMAX rows from 143190 / r-imax plus local prototype records.
        Older Xenon-only IMAX venues may be missing until a supplemental LF Examiner/community source is merged.
        State stats only appear after you choose a state; no IP geolocation is used.
      </p>
    </section>
  );
}

function SeatGeometryPanel({ venue }) {
  const isDome = venue.screen.geometry === "hemispherical";
  if (isDome) {
    return (
      <div className="seat-geometry seat-geometry--dome">
        <div className="seat-geometry__head">
          <span>Seat geometry</span>
          <strong>Fixed dome coverage</strong>
        </div>
        <p>
          Dome seating does not work like a flat rectangle at different row distances. LIEMAX uses the dome research defaults:
          <strong> {venue.screen.domeHFov || 180}° horizontal</strong> by <strong>{venue.screen.domeVFov || 125}° vertical</strong>,
          with radius-style distances only for non-FOV comparisons.
        </p>
      </div>
    );
  }

  const presAr = venue.defaultPresentationAr || venue.screen.ar || 1.90;
  const mask = M.visibleContentRect(venue.screen, presAr, { ar: presAr, min_ar: presAr });
  const rows = ["front", "mid", "back"].map(seat => {
    const dist = venue.seat[seat];
    return {
      seat,
      dist,
      multiple: dist / venue.screen.w,
      hfov: M.horizontalFovDeg(mask.effW, dist),
      vfov: M.verticalFovDeg(mask.effH, dist),
    };
  });

  return (
    <div className="seat-geometry">
      <div className="seat-geometry__head">
        <span>Seat geometry</span>
        <strong>Flat-screen estimates</strong>
      </div>
      <div className="seat-geometry__grid">
        {rows.map(row => (
          <div className="seat-geometry__row" key={row.seat}>
            <span>{row.seat}</span>
            <strong>{fmtInt(row.hfov)}° H / {fmtInt(row.vfov)}° V</strong>
            <small>{fmtInt(row.dist)} ft · {fmtNum(row.multiple, 2)}× screen width</small>
          </div>
        ))}
      </div>
      <p>
        These are source-aware estimates from the current venue bundle. Published row data is rare; 143190 / r-imax provides screen and projector facts, not seating depth.
      </p>
    </div>
  );
}

function SourceLinks() {
  return (
    <div className="source-links">
      <span>Sources used in this guide</span>
      {SOURCE_LINKS.map(link => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
      ))}
    </div>
  );
}

// ─── Seat selector ────────────────────────────────────────────────────────────

function SeatSelector({ sideA, sideB, seat, onChange }) {
  const labels = { front: "Front", mid: "Mid", back: "Back" };
  const hasDome = sideA.screen.geometry === "hemispherical" || sideB.screen.geometry === "hemispherical";
  function sideSummary(side, venue) {
    if (venue.screen.geometry === "hemispherical") return `${side}: fixed dome FOV`;
    const dist = venue.seat[seat];
    const presAr = venue.defaultPresentationAr || venue.screen.ar || 1.90;
    const mask = M.visibleContentRect(venue.screen, presAr, { ar: presAr, min_ar: presAr });
    const hfov = M.horizontalFovDeg(mask.effW, dist);
    const vfov = M.verticalFovDeg(mask.effH, dist);
    return `${side}: ${fmtInt(dist)} ft · ${fmtInt(hfov)}° H / ${fmtInt(vfov)}° V · ${fmtNum(dist / venue.screen.w, 2)}× width`;
  }
  return (
    <div className="seat-section">
      <div className="seat-row">
        <span className="format-row__label">SEAT</span>
        {["front", "mid", "back"].map(s => (
          <button key={s} className={`seat-btn ${seat === s ? "is-active" : ""}`}
            onClick={() => onChange(s)} type="button">{labels[s]}</button>
        ))}
      </div>
      <div className="seat-info">{sideSummary("A", sideA)} · {sideSummary("B", sideB)} · {hasDome ? "dome FOV stays fixed" : "distances estimated"}</div>
    </div>
  );
}

// ─── Details drawer ───────────────────────────────────────────────────────────

function DetailsDrawer({ open, onToggle }) {
  return (
    <>
      <button className="details-trigger" onClick={onToggle} aria-expanded={open} type="button">
        {open ? "▲ Hide formulas & assumptions" : "▼ Show formulas & assumptions"}
      </button>
      {open && (
        <div className="details-drawer" role="region" aria-label="Methodology and formulas">
          <h3>Visible FOV</h3>
          <p>FOV = 2 × arctan(visible_content_dimension / (2 × viewing_distance))</p>
          <p>Horizontal and vertical FOV use the visible movie image after masking or cropping.</p>
          <p>IMAX Dome is separate: dome FOV is modeled as fixed 180° horizontal × 125° vertical coverage from the dome research, not as distance to a flat rectangular screen.</p>

          <h3>Pixels per degree (PPD)</h3>
          <p>PPD = resolution_horizontal / content_FOV_degrees</p>
          <p>Uses the visible content width (after masking), not the full screen or projected window.</p>
          <p>15/70 film reports scan-equivalent range (~8.8K–11.7K) rather than a fixed pixel count.</p>

          <h3>Viewing distances</h3>
          <p>Cinema seating uses tiered assumptions when published row data is unavailable. Dedicated GT rooms use venue-specific or constrained-depth estimates; CoLa, Dolby, XD, and standard multiplex rooms use auditorium-ratio estimates. Sparse 143190 rows provide screen and projector facts, not seating depth. Home displays use typical living-room distances for the screen size per THX-style recommendations.</p>
          <p>Dome seat distances are radius-style placeholders for non-FOV comparisons. The meaningful dome metric is visual-field coverage and whether the content is dome-mastered.</p>

          <h3>Brightness comparison</h3>
          <p>Cinema: published or community-estimated fL calibration target. Home displays: <code>full-field_nits ÷ 3.426 = fL</code>. Peak HDR nits excluded — full-field is the fair cinema comparison.</p>

          <h3>Native contrast</h3>
          <p>Sequential (on/off) contrast only — not dynamic HDR. OLED displays show ∞ because each pixel emits independently. Dolby Cinema's 1,000,000:1 figure is the Dolby Vision dynamic black-level claim; sequential is ~6,250:1.</p>

          <h3>HDR and photochemical latitude</h3>
          <p>Dolby Vision vs photochemical film are fundamentally different systems. The HDR black level and picture depth rows show "Comparable" with a note rather than picking a winner.</p>

          <h3>Presentation AR vs content AR</h3>
          <p>Presentation AR = what each selected screen is configured to show. Content AR = what the movie was shot or mastered at. When content AR differs from the presentation window, the visible image is masked or cropped according to the selected mode.</p>
        </div>
      )}
    </>
  );
}

// ─── Presentation mismatch notes ─────────────────────────────────────────────

function fmtAr(ar) { return fmtNum(ar, 2); }

function presentationNoteFor(venue, stats, contentAr, filmMode) {
  const mask = stats.mask;
  const content = fmtAr(contentAr);
  const pres = fmtAr(stats.presAr);
  const is143 = Math.abs(contentAr - 1.43) < 0.01;

  if (venue.screen.geometry === "hemispherical") {
    return "Dome venue: FOV is fixed dome coverage, not flat-screen row geometry; standard movies may need dome-specific mastering.";
  }

  if (is143 && !filmMode && venue.id === "apple_providence_imax") {
    return `Shown in ${pres} digital window; full 1.43 height is cropped in digital mode.`;
  }
  if (is143 && venue.id === "dolby_cinema_typical") {
    return `Shown in ${pres} window; full 1.43 frame is not available in this format.`;
  }
  if (Math.abs(stats.presAr - contentAr) < 0.01 && !mask.cropped && !mask.pillarbox && !mask.letterbox) return null;
  if (mask.cropped) return `Shown in ${pres} window; full ${content} height is cropped in this mode.`;
  if (mask.pillarbox) return `Shown in ${pres} window; content fills center with side masking.`;
  if (mask.letterbox) return `Shown in ${pres} window; content fills width with top/bottom masking.`;
  return null;
}

// ─── Search ───────────────────────────────────────────────────────────────────

// Highlight matching tokens in a venue name.
function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return <>{text}</>;
  const lower = text.toLowerCase();
  const ranges = [];
  tokens.forEach(tok => {
    let idx = 0;
    while ((idx = lower.indexOf(tok, idx)) !== -1) {
      ranges.push([idx, idx + tok.length]);
      idx += tok.length;
    }
  });
  if (!ranges.length) return <>{text}</>;
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  ranges.forEach(r => {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push(r.slice());
  });
  const parts = [];
  let cursor = 0;
  merged.forEach(([s, e], i) => {
    if (s > cursor) parts.push(text.slice(cursor, s));
    parts.push(<mark key={i}>{text.slice(s, e)}</mark>);
    cursor = e;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function quickCategoryTag(venue) {
  if (!venue || venue.kind === "home") return null;
  const cat = DIAG.classify(venue);
  const map = {
    true_143_film:    { text: "TRUE 1.43 + FILM", color: "var(--cat-true143-film)" },
    true_143_laser:   { text: "TRUE 1.43",        color: "var(--cat-true143)" },
    true_film_lie_dig:{ text: "1.43 ON FILM",     color: "var(--cat-truefilm)" },
    true_dome:        { text: "DOME 1.43",        color: "var(--cat-dome)" },
    liemax:           { text: "LIEMAX",           color: "var(--cat-liemax)" },
    unknown:          { text: "UNKNOWN",          color: "var(--cat-unknown)" },
  };
  return map[cat];
}

// ─── Single screen scale figure ───────────────────────────────────────────────

function DiagnosisScaleFigure({ venue }) {
  const svgRef = useRef(null);
  const presAr = venue.defaultPresentationAr || venue.screen.ar || 1.90;

  useEffect(() => {
    if (!svgRef.current || !window.LIEMAX_STAGE_SINGLE) return;
    const projection = { ...(venue.projection || {}), min_ar: presAr };
    window.LIEMAX_STAGE_SINGLE(svgRef.current, { ...venue, projection }, presAr);
  }, [venue, presAr]);

  const isDome = venue.screen.geometry === "hemispherical";
  const wFt = venue.screen.w ? Math.round(venue.screen.w) : null;
  const hFt = venue.screen.h ? Math.round(venue.screen.h) : null;
  const caption = isDome
    ? `Dome drawn as a scaled circular cross-section from the reported ${wFt || "unknown"} ft diameter. Filled area represents the research default of about 83% hemispherical coverage.`
    : `Flat screen drawn to scale${wFt && hFt ? ` at roughly ${wFt} × ${hFt} ft` : ""}. Solid fill shows the default presentation window.`;

  return (
    <div className="diagnosis-stage">
      <div className="diagnosis-stage__head">
        <span>Screen scale</span>
        <span>{isDome ? "Dome geometry" : `${presAr.toFixed(2)}:1 default`}</span>
      </div>
      <svg ref={svgRef} className="diagnosis-stage__svg" aria-label="Selected theater screen scale visualization" />
      <div className="diagnosis-stage__caption">{caption} Figure = 5'9".</div>
    </div>
  );
}

function SearchBar({ value, onChange, onSelect, onClear, autoFocus, showCategoryTags = true }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [openOnFocusAfterInteraction, setOpenOnFocusAfterInteraction] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const groups = useMemo(() => {
    const tokens = value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const venues = D.venues.filter(v => {
      if (v.kind !== "cinema" || v.isPreset) return false;
      if (!tokens.length) return true;
      const fields = [v.name, v.city, v.state, v.stateName].filter(Boolean).map(s => String(s).toLowerCase());
      return tokens.every(tok => fields.some(f => f.includes(tok)));
    });
    if (!tokens.length) {
      const featuredIds = [
        "apple_providence_imax",
        "imax_us_ny_new_york_amc_lincoln_square_13_and_imax",
        "imax_us_ca_san_francisco_amc_metreon_16_and_imax",
        "imax_us_ma_reading_sunbrella_imax_3d_theater_reading",
        "imax_us_ma_boston_amc_boston_common_19",
      ];
      const featured = featuredIds.map(id => venues.find(v => v.id === id)).filter(Boolean);
      return featured.length
        ? [{ label: "Try one of these", items: featured }]
        : [{ label: "Theaters", items: venues.slice(0, 8) }];
    }
    const byState = new Map();
    venues.forEach(v => {
      const key = v.stateName || v.state || "Other";
      if (!byState.has(key)) byState.set(key, []);
      byState.get(key).push(v);
    });
    return [...byState.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, items]) => ({
        label,
        items: items.slice().sort((a, b) => (a.city || "").localeCompare(b.city || "") || a.name.localeCompare(b.name)).slice(0, 24),
      }));
  }, [value]);

  const flatList = useMemo(() => groups.flatMap(g => g.items), [groups]);
  useEffect(() => { setActive(0); }, [value]);

  function handleKey(e) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") { setOpen(true); e.preventDefault(); }
      return;
    }
    if (e.key === "ArrowDown") { setActive(a => Math.min(a + 1, flatList.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setActive(a => Math.max(a - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter") { if (flatList[active]) { onSelect(flatList[active]); setOpen(false); } e.preventDefault(); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div className="search" ref={ref}>
      <div className="search__field">
        <svg className="search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
        </svg>
        <input ref={inputRef} className="search__input" type="text" value={value}
          placeholder="Search your IMAX theater — e.g. Lincoln Square, Metreon, Grand Canyon"
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onPointerDown={() => setOpenOnFocusAfterInteraction(true)}
          onClick={() => { setOpenOnFocusAfterInteraction(true); setOpen(true); }}
          onFocus={() => { if (openOnFocusAfterInteraction || value) setOpen(true); }}
          onKeyDown={handleKey}
          aria-label="Search theaters" aria-autocomplete="list" aria-expanded={open} />
        {value
          ? <button className="search__clear" onClick={onClear} type="button">CLEAR</button>
          : <span className="search__hint">↵ TO DIAGNOSE</span>
        }
      </div>

      {open && (
        <div className="search__results" role="listbox">
          {groups.length === 0 || flatList.length === 0 ? (
            <div className="search__empty">
              No theaters match "{value}". The dataset covers U.S. IMAX film, laser, and dome rows from 143190.xyz so far — older Xenon-only venues may be missing.
            </div>
          ) : groups.map((g, gi) => (
            <div key={g.label}>
              <div className="search__group-label">
                <span>{g.label}</span>
                <span style={{ opacity: 0.6 }}>{g.items.length}</span>
              </div>
              {g.items.map((v, vi) => {
                const flatIdx = groups.slice(0, gi).reduce((sum, gr) => sum + gr.items.length, 0) + vi;
                const tag = showCategoryTags ? quickCategoryTag(v) : null;
                return (
                  <button key={v.id} type="button" role="option"
                    aria-selected={flatIdx === active}
                    className={`search__item ${flatIdx === active ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(flatIdx)}
                    onClick={() => { onSelect(v); setOpen(false); }}>
                    <div className="search__item-body">
                      <div className="search__item-name"><Highlight text={v.name} query={value} /></div>
                      <div className="search__item-sub">
                        {[v.city, v.stateName || v.state].filter(Boolean).join(", ") || v.sub}
                      </div>
                    </div>
                    {tag && <span className="search__item-tag" style={{ color: tag.color }}>{tag.text}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Diagnosis card ───────────────────────────────────────────────────────────

function DiagnosisCard({ venue, onCompareTrue, onCompareAnother, onClear }) {
  const result = useMemo(() => DIAG.diagnose(venue), [venue]);
  const proj = venue.projection;
  const wFt = venue.screen.w ? Math.round(venue.screen.w) : null;
  const hFt = venue.screen.h ? Math.round(venue.screen.h) : null;
  const isDome = venue.screen.geometry === "hemispherical";

  const midDist = venue.seat?.mid;
  const presAr = venue.defaultPresentationAr || venue.screen.ar || 1.90;
  const mask = M.visibleContentRect(venue.screen, presAr, { ar: presAr, min_ar: presAr });
  const vfov = isDome ? (venue.screen.domeVFov || 125) : (midDist ? M.verticalFovDeg(mask.effH, midDist) : null);

  const isTrue143 = result.category === "true_143_film" || result.category === "true_143_laser";
  const loss = verticalFrameLoss();
  const screenSource = venue.sources?.screen;
  const screenMeta = screenSource ? D.qualityMeta[screenSource.q] : null;
  const projectorCopy = isDome
    ? "Dome IMAX uses a hemispherical screen. The meaningful visual metric is fixed coverage, not a rectangular row-distance score."
    : proj?.min_ar && proj.min_ar <= 1.43
      ? "This digital projector/mode can drive the full 1.43 height when the movie is mastered and booked that way."
      : "This normal digital IMAX mode caps at 1.90, so a full-height 1.43 movie is cropped unless a separate 15/70 film booking is used.";

  return (
    <section className="diagnosis" style={{ "--accent": result.accent }} aria-live="polite">
      <header className="diagnosis__head">
        <div>
          <div className="diagnosis__theater-eyebrow">DIAGNOSIS</div>
          <h2 className="diagnosis__theater-name">{venue.name}</h2>
          <div className="diagnosis__theater-loc">
            {[venue.city, venue.stateName || venue.state].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div className="cat-badge">
          <span className="cat-badge__rank">{result.rank}</span>
          <span className="cat-badge__name">{result.badge}</span>
        </div>
      </header>

      <div className="diagnosis__verdict">
        <p className="diagnosis__verdict-line" dangerouslySetInnerHTML={{ __html: result.headline }} />
        <p className="diagnosis__verdict-body">{result.body}</p>
      </div>

      <div className="diagnosis__lesson">
        <div>
          <span className="diagnosis__lesson-k">Why this verdict?</span>
          <p>{projectorCopy}</p>
        </div>
        {!isDome && proj?.min_ar && proj.min_ar > 1.43 && (
          <div>
            <span className="diagnosis__lesson-k">1.43 on this digital mode</span>
            <p>About <strong>{fmtNum(loss.retainedPct, 1)}%</strong> of the height is retained; about <strong>{fmtNum(loss.lostPct, 1)}%</strong> of the vertical frame is lost.</p>
          </div>
        )}
        {screenSource && (
          <div>
            <span className="diagnosis__lesson-k">Source confidence</span>
            <p><strong>{screenMeta?.label || screenSource.q}</strong>: {screenSource.note}</p>
          </div>
        )}
      </div>

      <DiagnosisScaleFigure venue={venue} />

      <div className="diagnosis__specs">
        <div className="spec">
          <span className="spec__k">Screen</span>
          <span className="spec__v">{isDome ? "Dome" : (venue.screen.ar ? `${venue.screen.ar.toFixed(2)}:1` : "—")}</span>
          <span className="spec__sub">{isDome && wFt ? `${wFt} ft diameter` : (wFt && hFt ? `${wFt} × ${hFt} ft` : "Geometry unknown")}</span>
        </div>
        <div className="spec">
          <span className="spec__k">{isDome ? "Dome projection" : "Digital projector"}</span>
          <span className="spec__v spec__v--small">{proj?.light || "—"}</span>
          <span className="spec__sub">{isDome ? (venue.filmProjection ? "15/70 dome 1.43" : "laser dome 1.43") : `caps at ${proj?.min_ar ? `${proj.min_ar.toFixed(2)}:1` : "—"}`}</span>
        </div>
        <div className="spec">
          <span className="spec__k">15/70 film</span>
          <span className="spec__v spec__v--small" style={{ color: venue.filmProjection ? "var(--gold)" : "var(--noir-ink-3)" }}>
            {venue.filmProjection ? "Installed" : "No"}
          </span>
          <span className="spec__sub">{venue.filmProjection ? "Booked engagements" : "Digital only"}</span>
        </div>
        <div className="spec">
          <span className="spec__k">{isDome ? "Dome vert. FOV" : "Mid-seat vert. FOV"}</span>
          <span className="spec__v">{vfov ? `${Math.round(vfov)}°` : "—"}</span>
          <span className="spec__sub">{isDome ? `${venue.screen.domeHFov || 180}° horizontal` : (presAr ? `${presAr.toFixed(2)}:1 default` : "—")}</span>
        </div>
      </div>

      <SeatGeometryPanel venue={venue} />

      {result.modes.length > 0 && (
        <div className="diagnosis__modes">
          <div className="diagnosis__modes-label">What you'll see, by movie format</div>
          {result.modes.map((m, i) => (
            <div className="mode-row" key={i}>
              <span className="mode-row__ar">{m.ar}:1</span>
              <div>
                <span className="mode-row__name">{m.name}</span>
                <span className="mode-row__name-sub">{m.sub}</span>
              </div>
              <span className={`mode-row__verdict v-${m.verdict}`}>{m.verdictLabel}</span>
            </div>
          ))}
        </div>
      )}

      <div className="diagnosis__actions">
        {!isTrue143 && (
          <button className="action-btn action-btn--primary" onClick={onCompareTrue} type="button">
            Compare against True IMAX GT<span className="action-btn__arrow">→</span>
          </button>
        )}
        <button className="action-btn" onClick={onCompareAnother} type="button">
          Compare another theater<span className="action-btn__arrow">→</span>
        </button>
        <button className="action-btn action-btn--ghost" onClick={onClear} type="button">
          Diagnose a different theater
        </button>
      </div>
    </section>
  );
}

// ─── Diagnosis placeholder (categories legend) ────────────────────────────────

function DiagnosisPlaceholder() {
  const items = [
    { swatch: "var(--cat-true143-film)", name: "True IMAX 1.43 · GT Laser + 15/70 Film",
      desc: "The rarest of all. Both digital GT laser and 15/70 film, on a 1.43:1 screen." },
    { swatch: "var(--cat-true143)", name: "True IMAX 1.43 · GT Laser",
      desc: "Digital-only true IMAX. Anything mastered for 1.43 fills the screen." },
    { swatch: "var(--cat-dome)", name: "True IMAX Dome 1.43",
      desc: "Laser for Dome or GT Dome 15/70. Fixed 180° × 125° coverage, not flat-screen row math." },
    { swatch: "var(--cat-truefilm)", name: "True IMAX for 15/70 Film · LIEMAX digitally",
      desc: "Real on film bookings; daily digital is CoLa, capped at 1.90." },
    { swatch: "var(--cat-liemax)", name: "LIEMAX",
      desc: "Marketed IMAX, but digital projector caps at 1.90. The LIEMAX everyone complains about." },
    { swatch: "var(--cat-unknown)", name: "Unknown / incomplete",
      desc: "Specs are too sparse to classify confidently." },
  ];
  return (
    <section className="diagnosis diagnosis--empty" id="legend">
      <div className="placeholder">
        <div className="placeholder__legend-title">Six possible verdicts</div>
        <div className="legend">
          {items.map((it, i) => (
            <div className="legend__item" key={i}>
              <div className="legend__swatch" style={{ "--swatch": it.swatch }} />
              <div>
                <div className="legend__name">{it.name}</div>
                <div className="legend__desc">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function activeModeLabel(venue, presAr, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  const m = modes.find(mode => Math.abs(mode.ar - presAr) < 0.01);
  return m ? m.label : presAr.toFixed(2);
}

function App() {
  // Diagnosis state
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  // Workbench state (always initialised — hooks must be unconditional)
  const [sideA, setSideA] = useState(D.venues[0]);
  const [sideB, setSideB] = useState(D.venues[2]);
  const [presArA, setPresArA] = useState(defaultPresArFor(D.venues[0], false));
  const [presArB, setPresArB] = useState(defaultPresArFor(D.venues[2], false));
  const [filmModeA, setFilmModeA] = useState(false);
  const [filmModeB, setFilmModeB] = useState(false);
  const [seat, setSeat]           = useState("mid");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);
  const workbenchRef = useRef(null);

  const suggestions = useMemo(() => {
    const curated = CURATED_SUGGESTION_IDS
      .map(id => D.venues.find(v => v.id === id))
      .filter(Boolean);
    return shuffleSample(curated, 5);
  }, []);

  const stateOptions = useMemo(() => {
    const byCode = new Map();
    realCinemaVenues().forEach(v => {
      if (!v.state || v.state === "Format presets") return;
      byCode.set(v.state, v.stateName || v.state);
    });
    return [...byCode.entries()]
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([code, name]) => ({ code, name }));
  }, []);

  function handleChangeA(v) { setSideA(v); setFilmModeA(false); setPresArA(defaultPresArFor(v, false)); }
  function handleChangeB(v) { setSideB(v); setFilmModeB(false); setPresArB(defaultPresArFor(v, false)); }
  function handleFilmModeA(next) { setFilmModeA(next); setPresArA(defaultPresArFor(sideA, next)); }
  function handleFilmModeB(next) { setFilmModeB(next); setPresArB(defaultPresArFor(sideB, next)); }

  const statsA = useMemo(() => computeStats(sideA, seat, presArA, presArA, filmModeA), [sideA, seat, presArA, filmModeA]);
  const statsB = useMemo(() => computeStats(sideB, seat, presArB, presArB, filmModeB), [sideB, seat, presArB, filmModeB]);
  const rows   = useMemo(() => buildComparisonRows(sideA, sideB, statsA, statsB), [sideA, sideB, statsA, statsB]);

  const contentLabelA = activeModeLabel(sideA, presArA, filmModeA);
  const contentLabelB = activeModeLabel(sideB, presArB, filmModeB);
  const verdictContentLabel = contentLabelA === contentLabelB ? contentLabelA : `A: ${contentLabelA} / B: ${contentLabelB}`;
  const verdict = useMemo(() => buildVerdict(sideA, sideB, rows, verdictContentLabel), [sideA, sideB, rows, verdictContentLabel]);

  const noteA = presentationNoteFor(sideA, statsA, presArA, filmModeA);
  const noteB = presentationNoteFor(sideB, statsB, presArB, filmModeB);

  function handleSelect(venue) {
    setSelected(venue);
    setQuery(venue.name);
    requestAnimationFrame(() => {
      const el = document.getElementById("diagnosis-anchor");
      if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
    });
  }

  function handleClear() { setSelected(null); setQuery(""); setWorkbenchOpen(false); }

  function handleResetHome() {
    handleClear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openWorkbench() {
    setWorkbenchOpen(true);
    requestAnimationFrame(() => {
      if (workbenchRef.current) window.scrollTo({ top: workbenchRef.current.offsetTop - 20, behavior: "smooth" });
    });
  }

  function handleCompareTrue() {
    if (selected) handleChangeA(selected);
    const gt = D.venues.find(v => v.id === "imax_gt_typical");
    if (gt) handleChangeB(gt);
    openWorkbench();
  }

  function handleCompareAnother() {
    if (selected) handleChangeA(selected);
    openWorkbench();
  }

  return (
    <div className="shell">
      <header className="brand">
        <div className="brand__mark">
          <button className="brand__title" onClick={handleResetHome} type="button" aria-label="Start over">
            LIEMAX
          </button>
          <span className="brand__rule" />
          <span className="brand__strap">A diagnostic for your local IMAX</span>
        </div>
        <nav className="brand__nav">
          <a href="#learn">IMAX 101</a> · <a href="#stats">Stats</a> · <a href="#legend">Categories</a> · <a href="#methodology">Sources</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero__eyebrow">Step one · understand the ticket</div>
        <h2 className="hero__headline">
          IMAX can mean <em>very different rooms</em>.
        </h2>
        <p className="hero__sub">
          Your local IMAX might be a full-height 1.43 giant screen, a 1.90 multiplex laser room,
          a legacy Xenon setup, a rare 15/70 film house, or a dome. LIEMAX is the blunt nickname
          for an IMAX-branded theater that cannot show the full tall IMAX frame in normal digital shows.
          Search a theater and we translate the screen, projector, movie format, and seat math into plain English.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSelect={handleSelect}
          onClear={handleClear}
          autoFocus
          showCategoryTags={false}
        />

        <div className="suggest">
          <span className="suggest__label">Random starts:</span>
          {suggestions.map(v => (
            <button key={v.id} className="suggest__chip" onClick={() => handleSelect(v)} type="button">
              {v.name.replace(/^AMC |^Regal |^Cinemark /, "")}
            </button>
          ))}
        </div>
      </section>

      <div id="stats" />
      <DataStatsPanel
        selectedState={selectedState}
        onSelectState={setSelectedState}
        states={stateOptions}
      />

      <div id="diagnosis-anchor" />

      {selected ? (
        <DiagnosisCard
          venue={selected}
          onCompareTrue={handleCompareTrue}
          onCompareAnother={handleCompareAnother}
          onClear={handleClear}
        />
      ) : (
        <DiagnosisPlaceholder />
      )}

      <EducationPrimer />

      {selected && workbenchOpen && (
        <section className="workbench" id="workbench" ref={workbenchRef}>
          <header className="workbench__head">
            <h3 className="workbench__title">
              <span className="workbench__title-rule" />
              Side-by-side comparison
            </h3>
            <p className="workbench__sub">
              Compare {selected.name} against another theater, format preset, or your home display.
            </p>
          </header>

          <div className="pickers">
            <Picker side="A" sideColor="var(--side-a)" venue={sideA}
              presAr={statsA.presAr} filmMode={filmModeA} presentationNote={noteA}
              onChangeVenue={handleChangeA} onChangePresAr={setPresArA}
              onChangeFilmMode={handleFilmModeA} excludeId={sideB.id} />
            <span className="pickers__vs">VS</span>
            <Picker side="B" sideColor="var(--side-b)" venue={sideB}
              presAr={statsB.presAr} filmMode={filmModeB} presentationNote={noteB}
              onChangeVenue={handleChangeB} onChangePresAr={setPresArB}
              onChangeFilmMode={handleFilmModeB} excludeId={sideA.id} />
          </div>

          <Stage venueA={sideA} venueB={sideB} statsA={statsA} statsB={statsB}
            filmModeA={filmModeA} filmModeB={filmModeB} />
          <Verdict verdict={verdict} contentLabel={verdictContentLabel} />
          <StatGrid rows={rows} sideA={sideA} sideB={sideB} statsA={statsA} statsB={statsB} />
          <SeatSelector sideA={sideA} sideB={sideB} seat={seat} onChange={setSeat} />
          <DetailsDrawer open={detailsOpen} onToggle={() => setDetailsOpen(o => !o)} />
        </section>
      )}

      <section className="definitions" id="methodology">
        <div>
          <h4>True IMAX 1.43</h4>
          <p>A purpose-built screen at roughly <strong>1.43:1</strong> with a projector that can drive its full height — today, that means <strong>IMAX GT dual-laser</strong> or <strong>15/70mm film</strong>.</p>
        </div>
        <div>
          <h4>15/70 vs 70mm</h4>
          <p>Standard 70mm runs vertically at 5 perforations per frame and is usually around 2.20:1. IMAX 15/70 runs sideways at 15 perforations per frame, making a much larger 1.43:1 image.</p>
        </div>
        <div>
          <h4>CoLa, Laser XT, Xenon</h4>
          <p>These are normal multiplex IMAX digital systems. CoLa and Laser XT are 4K laser; Dual Xenon is older 2K digital. They are usually capped at <strong>1.90:1</strong>, not the full 1.43 frame.</p>
        </div>
        <div>
          <h4>LIEMAX</h4>
          <p>The IMAX-branded auditorium with a screen taller than the digital projector can fill. The everyday digital window is <strong>1.90:1</strong> (CoLa). 1.43 movies lose ~25% of vertical frame.</p>
        </div>
        <div>
          <h4>Hybrid (film yes, digital no)</h4>
          <p>A 1.43 screen and a working 15/70mm projector — so booked film engagements are real IMAX — but the daily digital is CoLa-class and crops 1.43.</p>
        </div>
        <div>
          <h4>IMAX Dome</h4>
          <p>A hemispherical screen with fixed visual-field coverage, typically about <strong>180° horizontal</strong> by <strong>125° vertical</strong>. It is real IMAX, but it is not a flat 1.43 rectangle; dome-mastered content matters.</p>
        </div>
        <div>
          <h4>Data sources</h4>
          <p>U.S. IMAX listings imported from <strong>143190 / r-imax</strong>, with dome behavior modeled from LIEMAX research and LF Examiner references. Older Xenon-only IMAX venues may be missing. Seat distances are derived from screen width unless venue rows are published.</p>
        </div>
        <div>
          <h4>Disclaimer</h4>
          <p>This project is not affiliated with IMAX Corporation.</p>
        </div>
        <SourceLinks />
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
