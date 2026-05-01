/* LIEMAX Comparison Workbench — V3 React app
   Loaded via Babel standalone; window.React and window.ReactDOM are CDN globals.
   All comparison rows mirror src/compare/types.ts shape:
     { id, label, aDisplay, bDisplay, winner, badgeLabel, note? }
     winner: 'a' | 'b' | 'tie' | 'unknown'
*/

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const D = window.LIEMAX_DATA;
const M = window.LIEMAX_MATH;
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

// ─── Stats computation ────────────────────────────────────────────────────────

function compatiblePresentationModes(venue, filmMode) {
  const modes = (venue.presentationModes || []).filter(m => m.enabled);
  const activeModes = filmMode && venue.isHybrid
    ? modes.filter(m => m.isFilmMode)
    : modes.filter(m => !m.isFilmMode);

  return activeModes.length ? activeModes : modes;
}

function defaultPresArFor(venue, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  const def = filmMode && venue.isHybrid ? 1.43 : venue.defaultPresentationAr;
  if (modes.length === 0) return def;
  const defaultMode = modes.find(m => Math.abs(m.ar - def) < 0.01);
  return (defaultMode || modes[0]).ar;
}

function resolvePresAr(venue, requestedPresAr, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  if (modes.length === 0) return requestedPresAr || defaultPresArFor(venue, filmMode);
  const requestedMode = modes.find(m => Math.abs(m.ar - requestedPresAr) < 0.01);
  return (requestedMode || modes.find(m => Math.abs(m.ar - defaultPresArFor(venue, filmMode)) < 0.01) || modes[0]).ar;
}

function computeStats(venue, seat, contentAr, requestedPresAr, filmMode) {
  const presAr = resolvePresAr(venue, requestedPresAr, filmMode);
  const proj = (filmMode && venue.filmProjection) ? venue.filmProjection : venue.projection;
  const dist = venue.seat[seat];

  const physicalFov = M.horizontalFovDeg(venue.screen.w, dist);

  const mask = M.visibleContentRect(venue.screen, contentAr, { ar: presAr, min_ar: presAr });
  const projWindow = mask.projectedWindow;
  const contentHFov = M.horizontalFovDeg(mask.effW, dist);
  const contentVFov = M.verticalFovDeg(mask.effH, dist);

  let ppdVal = null;
  if (proj.resH != null) {
    ppdVal = M.ppd(proj.resH, contentHFov);
  }

  const fl = M.brightnessFL({ projection: proj });
  const physicalUtil = mask.areaUtilPct;

  return { dist, physicalFov, ppdVal, presAr, projWindow, mask, contentHFov, contentVFov, fl, physicalUtil, proj };
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
  const projA = statsA.proj;
  const projB = statsB.proj;
  const rows = [];

  const aHFovDisp = fmtInt(statsA.contentHFov) + "°";
  const bHFovDisp = fmtInt(statsB.contentHFov) + "°";
  rows.push({ ...makeRow("visible_hfov", "Visible horizontal FOV", statsA.contentHFov, statsB.contentHFov, aHFovDisp, bHFovDisp, true),
    explain: "How wide the movie image feels from your seat." });

  const aVFovDisp = fmtInt(statsA.contentVFov) + "°";
  const bVFovDisp = fmtInt(statsB.contentVFov) + "°";
  rows.push({ ...makeRow("visible_vfov", "Visible vertical FOV", statsA.contentVFov, statsB.contentVFov, aVFovDisp, bVFovDisp, true),
    explain: "How tall the movie image feels — the key IMAX immersion factor." });

  let aPpdDisp, bPpdDisp, aPpdNum, bPpdNum;
  if (statsA.ppdVal == null) {
    aPpdDisp = projA.scanEquivLabel || "Unknown"; aPpdNum = null;
  } else {
    aPpdNum = statsA.ppdVal; aPpdDisp = fmtInt(statsA.ppdVal) + " ppd";
  }
  if (statsB.ppdVal == null) {
    bPpdDisp = projB.scanEquivLabel || "Unknown"; bPpdNum = null;
  } else {
    bPpdNum = statsB.ppdVal; bPpdDisp = fmtInt(statsB.ppdVal) + " ppd";
  }
  rows.push({ ...makeRow("ppd", "Pixels per degree", aPpdNum, bPpdNum, aPpdDisp, bPpdDisp, true),
    explain: "Perceived sharpness from this seat; higher usually looks crisper." });

  const aAreaNum = statsA.mask.effW * statsA.mask.effH;
  const bAreaNum = statsB.mask.effW * statsB.mask.effH;
  rows.push({ ...makeRow("area", "Visible content area", aAreaNum, bAreaNum, fmtInt(aAreaNum) + " sq ft", fmtInt(bAreaNum) + " sq ft", true),
    explain: "How large the actual movie image is, after masking or cropping." });

  rows.push({ ...makeRow("util", "Screen utilization", statsA.physicalUtil, statsB.physicalUtil, fmtInt(statsA.physicalUtil) + "%", fmtInt(statsB.physicalUtil) + "%", true),
    explain: "How much of the physical screen this movie format fills." });

  const aFlDisp = statsA.fl != null ? fmtNum(statsA.fl, 1) + " fL" : "Unknown";
  const bFlDisp = statsB.fl != null ? fmtNum(statsB.fl, 1) + " fL" : "Unknown";
  rows.push({ ...makeRow("brightness", "Brightness", statsA.fl, statsB.fl, aFlDisp, bFlDisp, true),
    explain: "How much light reaches the screen; higher helps HDR and punch." });

  const aContrNum = projA.isPerPixelEmissive ? Infinity : projA.nativeContrast;
  const bContrNum = projB.isPerPixelEmissive ? Infinity : projB.nativeContrast;
  const aContrDisp = projA.isPerPixelEmissive ? "∞" : (projA.nativeContrast ? projA.nativeContrast.toLocaleString() + ":1" : "Unknown");
  const bContrDisp = projB.isPerPixelEmissive ? "∞" : (projB.nativeContrast ? projB.nativeContrast.toLocaleString() + ":1" : "Unknown");
  rows.push({ ...makeRow("contrast", "Native contrast", aContrNum, bContrNum, aContrDisp, bContrDisp, true),
    explain: "Projector's sequential (on/off) contrast — measured before any dynamic HDR system." });

  const hdrRow = makeHdrRow("hdr", "HDR black level", projA.hdrCategory, projB.hdrCategory, projA.hdrLabel, projB.hdrLabel);
  rows.push({ ...hdrRow, explain: "Whether the system can dynamically deepen blacks for HDR content." });

  const aDepthDisp = projA.hdrLabel === "—" ? "SDR" : projA.hdrLabel;
  const bDepthDisp = projB.hdrLabel === "—" ? "SDR" : projB.hdrLabel;
  rows.push({ id: "depth", label: "Picture depth", aDisplay: aDepthDisp, bDisplay: bDepthDisp,
    winner: hdrRow.winner, badgeLabel: hdrRow.badgeLabel, note: hdrRow.note || null,
    explain: "Overall sense of contrast, HDR, and image dimensionality." });

  return rows;
}

// ─── Verdict builder ──────────────────────────────────────────────────────────

const VERDICT_LABEL = {
  visible_hfov: "horizontal immersion", visible_vfov: "vertical immersion",
  ppd: "sharpness", area: "visible image area",
  util: "screen utilization", brightness: "brightness",
  contrast: "native contrast", hdr: "HDR black level", depth: "picture depth",
};

function buildVerdict(sideA, sideB, rows, contentLabel) {
  const aWinsRows = rows.filter(r => r.winner === "a");
  const bWinsRows = rows.filter(r => r.winner === "b");
  const tieRows   = rows.filter(r => r.winner === "tie");

  function rowLabel(r) { return VERDICT_LABEL[r.id] || r.label.toLowerCase(); }
  function joinLabels(labels) {
    if (labels.length <= 2) return labels.join(" and ");
    return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  }
  function topLabels(winRows) {
    const priority = ["area", "visible_vfov", "visible_hfov", "contrast", "brightness", "hdr", "ppd", "util", "depth"];
    return winRows.slice().sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id)).slice(0, 3).map(rowLabel);
  }

  let sentences = [];
  if (aWinsRows.length > 0 && bWinsRows.length > 0) {
    sentences.push({ side: "a", text: `leads on ${joinLabels(topLabels(aWinsRows))}.` });
    sentences.push({ side: "b", text: `leads on ${joinLabels(topLabels(bWinsRows))}.` });
  } else if (aWinsRows.length === 0 && bWinsRows.length > 0) {
    const dominates = bWinsRows.length >= rows.length - 1;
    sentences.push({ side: "b", text: dominates ? "leads across nearly every measurable category." : `leads on ${joinLabels(topLabels(bWinsRows))}.` });
  } else if (bWinsRows.length === 0 && aWinsRows.length > 0) {
    const dominates = aWinsRows.length >= rows.length - 1;
    sentences.push({ side: "a", text: dominates ? "leads across nearly every measurable category." : `leads on ${joinLabels(topLabels(aWinsRows))}.` });
  } else {
    sentences.push({ side: null, text: "These two are closely matched." });
  }

  const tieNames = tieRows.filter(r => r.id !== "depth").slice(0, 3).map(rowLabel);
  if (tieNames.length === 1) {
    sentences.push({ side: null, text: `${tieNames[0].charAt(0).toUpperCase() + tieNames[0].slice(1)} is comparable from this seat.` });
  } else if (tieNames.length > 1) {
    const last = tieNames.pop();
    sentences.push({ side: null, text: `${tieNames.join(", ")} and ${last} are comparable from this seat.` });
  }

  return { sentences, aWins: aWinsRows, bWins: bWinsRows, ties: tieRows, aName: sideA.name, bName: sideB.name };
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
              IMAX theater listings come from 143190.xyz and do not include older Xenon-only IMAX venues yet. Those need a supplemental source.
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

  const aArea = venueA.screen.w * venueA.screen.h;
  const bArea = venueB.screen.w * venueB.screen.h;
  const biggerSide = aArea >= bArea ? "A" : "B";
  const ratio = (Math.max(aArea, bArea) / Math.min(aArea, bArea)).toFixed(2);
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
        Drawn to true relative scale. Solid fill = visible content area · Translucent outline = full physical screen · Figure = 5ʹ9ʺ.
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

// ─── Seat selector ────────────────────────────────────────────────────────────

function SeatSelector({ sideA, sideB, seat, onChange }) {
  const labels = { front: "Front", mid: "Mid", back: "Back" };
  return (
    <div className="seat-section">
      <div className="seat-row">
        <span className="format-row__label">SEAT</span>
        {["front", "mid", "back"].map(s => (
          <button key={s} className={`seat-btn ${seat === s ? "is-active" : ""}`}
            onClick={() => onChange(s)} type="button">{labels[s]}</button>
        ))}
      </div>
      <div className="seat-info">A: {fmtInt(sideA.seat[seat])} ft · B: {fmtInt(sideB.seat[seat])} ft · distances estimated</div>
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

          <h3>Pixels per degree (PPD)</h3>
          <p>PPD = resolution_horizontal / content_FOV_degrees</p>
          <p>Uses the visible content width (after masking), not the full screen or projected window.</p>
          <p>15/70 film reports scan-equivalent range (~8.8K–11.7K) rather than a fixed pixel count.</p>

          <h3>Viewing distances</h3>
          <p>Cinema seating uses tiered assumptions when published row data is unavailable. Dedicated GT rooms use venue-specific or constrained-depth estimates; CoLa, Dolby, XD, and standard multiplex rooms use auditorium-ratio estimates. Sparse 143190 rows provide screen and projector facts, not seating depth. Home displays use typical living-room distances for the screen size per THX-style recommendations.</p>

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
    true_dome:        { text: "DOME",             color: "var(--cat-dome)" },
    liemax:           { text: "LIEMAX",           color: "var(--cat-liemax)" },
    unknown:          { text: "UNKNOWN",          color: "var(--cat-unknown)" },
  };
  return map[cat];
}

function SearchBar({ value, onChange, onSelect, onClear, autoFocus, showCategoryTags = true }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
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
          placeholder="Search your IMAX theater — e.g. Boston Common, Lincoln Square, Providence"
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
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
              No theaters match "{value}". The dataset only covers U.S. IMAX venues from 143190.xyz so far — older Xenon-only venues may be missing.
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

  const midDist = venue.seat?.mid;
  const presAr = venue.defaultPresentationAr || venue.screen.ar || 1.90;
  const mask = M.visibleContentRect(venue.screen, presAr, { ar: presAr, min_ar: presAr });
  const vfov = midDist ? M.verticalFovDeg(mask.effH, midDist) : null;

  const isTrue143 = result.category === "true_143_film" || result.category === "true_143_laser";

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

      <div className="diagnosis__specs">
        <div className="spec">
          <span className="spec__k">Screen</span>
          <span className="spec__v">{venue.screen.ar ? `${venue.screen.ar.toFixed(2)}:1` : "—"}</span>
          <span className="spec__sub">{wFt && hFt ? `${wFt} × ${hFt} ft` : "Geometry unknown"}</span>
        </div>
        <div className="spec">
          <span className="spec__k">Digital projector</span>
          <span className="spec__v spec__v--small">{proj?.light || "—"}</span>
          <span className="spec__sub">caps at {proj?.min_ar ? `${proj.min_ar.toFixed(2)}:1` : "—"}</span>
        </div>
        <div className="spec">
          <span className="spec__k">15/70 film</span>
          <span className="spec__v spec__v--small" style={{ color: venue.filmProjection ? "var(--gold)" : "var(--noir-ink-3)" }}>
            {venue.filmProjection ? "Installed" : "No"}
          </span>
          <span className="spec__sub">{venue.filmProjection ? "Booked engagements" : "Digital only"}</span>
        </div>
        <div className="spec">
          <span className="spec__k">Mid-seat vert. FOV</span>
          <span className="spec__v">{vfov ? `${Math.round(vfov)}°` : "—"}</span>
          <span className="spec__sub">{presAr ? `${presAr.toFixed(2)}:1 default` : "—"}</span>
        </div>
      </div>

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
    { swatch: "var(--cat-truefilm)", name: "True IMAX for 15/70 Film · LIEMAX digitally",
      desc: "Real on film bookings; daily digital is CoLa, capped at 1.90." },
    { swatch: "var(--cat-dome)", name: "True IMAX Dome",
      desc: "Hemispherical screen. Different geometry, different metrics." },
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
    const ids = [
      "apple_providence_imax",
      "imax_us_ma_reading_sunbrella_imax_3d_theater_reading",
      "imax_us_ma_boston_amc_boston_common_19",
      "imax_us_ny_new_york_amc_lincoln_square_13_and_imax",
    ];
    return ids.map(id => D.venues.find(v => v.id === id)).filter(Boolean);
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
          <a href="#legend">Categories</a> · <a href="#workbench">Workbench</a> · <a href="#methodology">Methodology</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero__eyebrow">Step one · diagnose your theater</div>
        <h2 className="hero__headline">
          Is your IMAX <em>real IMAX</em>, or is it LIEMAX?
        </h2>
        <p className="hero__sub">
          Search a U.S. IMAX theater. Get an honest, technical-but-readable verdict
          on what you'll actually see from your seat — by the digital projector,
          by the screen geometry, and by film capability where it exists.
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
          <span className="suggest__label">Try:</span>
          {suggestions.map(v => (
            <button key={v.id} className="suggest__chip" onClick={() => handleSelect(v)} type="button">
              {v.name.replace(/^AMC |^Regal |^Cinemark /, "")}
            </button>
          ))}
        </div>
      </section>

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
          <h4>LIEMAX</h4>
          <p>The IMAX-branded auditorium with a screen taller than the digital projector can fill. The everyday digital window is <strong>1.90:1</strong> (CoLa). 1.43 movies lose ~25% of vertical frame.</p>
        </div>
        <div>
          <h4>Hybrid (film yes, digital no)</h4>
          <p>A 1.43 screen and a working 15/70mm projector — so booked film engagements are real IMAX — but the daily digital is CoLa-class and crops 1.43.</p>
        </div>
        <div>
          <h4>Data sources</h4>
          <p>U.S. IMAX listings imported from <strong>143190.xyz</strong>. Older Xenon-only IMAX venues may be missing. Seat distances are derived from screen width unless venue rows are published.</p>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
