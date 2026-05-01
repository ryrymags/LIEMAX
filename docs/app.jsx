/* LIEMAX Comparison Workbench — V3 React app
   Loaded via Babel standalone; window.React and window.ReactDOM are CDN globals.
   All comparison rows mirror src/compare/types.ts shape:
     { id, label, aDisplay, bDisplay, winner, badgeLabel, note? }
     winner: 'a' | 'b' | 'tie' | 'unknown'
*/

const { useState, useEffect, useRef, useMemo } = React;
const D = window.LIEMAX_DATA;
const M = window.LIEMAX_MATH;
const STAGE = window.LIEMAX_STAGE;

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
// Returns stats for one side.
// filmMode: true = use venue.filmProjection instead of venue.projection.
//
// FOV clarification:
//   contentHFov/VFov = FOV of the visible content area (drives PPD + immersion rows)
//   projWindow   = the projected rectangle on the screen (width = screen.w, height = screen.w / presAr)
//   mask         = content masking within the projected window

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

  // PPD uses the visible content width — guard against null resH (15/70 film).
  let ppdVal = null;
  if (proj.resH != null) {
    ppdVal = M.ppd(proj.resH, contentHFov);
  }

  const fl = M.brightnessFL({ projection: proj });

  const physicalUtil = mask.areaUtilPct;

  return { dist, physicalFov, ppdVal, presAr, projWindow, mask, contentHFov, contentVFov, fl, physicalUtil, proj };
}

// ─── Comparison row builders (mirrors src/compare/types.ts) ──────────────────

// winner: 'a' | 'b' | 'tie' | 'unknown'
// badgeLabel: 'A wins' | 'B wins' | 'Comparable' | 'Unknown'
function makeRow(id, label, aVal, bVal, aDisplay, bDisplay, higherWins) {
  // Equal display strings → tie, regardless of sub-rounding noise
  if (aDisplay === bDisplay && aVal != null && bVal != null) {
    return { id, label, aDisplay, bDisplay, winner: "tie", badgeLabel: "Comparable" };
  }
  if (aVal == null || bVal == null) {
    return { id, label, aDisplay, bDisplay, winner: "unknown", badgeLabel: "Unknown" };
  }
  // Handle Infinity (OLED native contrast)
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

// HDR rank for categorical winner logic
const HDR_RANK = { dolby_vision: 4, hdr10plus: 3, hdr10: 2, photochemical: 1, sdr: 0, unknown: -1 };

function makeHdrRow(id, label, catA, catB, labelA, labelB) {
  const rankA = HDR_RANK[catA] ?? -1;
  const rankB = HDR_RANK[catB] ?? -1;
  // Photochemical vs Dolby Vision: fundamentally different systems — mark tie
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
  const badgeLabel = winner === "a" ? "A wins" : "B wins";
  return { id, label, aDisplay: labelA, bDisplay: labelB, winner, badgeLabel };
}

function buildComparisonRows(sideA, sideB, statsA, statsB) {
  const projA = statsA.proj;
  const projB = statsB.proj;
  const rows = [];

  // 1. Visible horizontal FOV
  const aHFovDisp = fmtInt(statsA.contentHFov) + "°";
  const bHFovDisp = fmtInt(statsB.contentHFov) + "°";
  rows.push({ ...makeRow("visible_hfov", "Visible horizontal FOV", statsA.contentHFov, statsB.contentHFov, aHFovDisp, bHFovDisp, true),
    explain: "How wide the movie image feels from your seat." });

  // 2. Visible vertical FOV
  const aVFovDisp = fmtInt(statsA.contentVFov) + "°";
  const bVFovDisp = fmtInt(statsB.contentVFov) + "°";
  rows.push({ ...makeRow("visible_vfov", "Visible vertical FOV", statsA.contentVFov, statsB.contentVFov, aVFovDisp, bVFovDisp, true),
    explain: "How tall the movie image feels — the key IMAX immersion factor." });

  // 3. Pixels per degree
  let aPpdDisp, bPpdDisp, aPpdNum, bPpdNum;
  if (statsA.ppdVal == null) {
    aPpdDisp = projA.scanEquivLabel || "Unknown";
    aPpdNum = null;
  } else {
    aPpdNum = statsA.ppdVal;
    aPpdDisp = fmtInt(statsA.ppdVal) + " ppd";
  }
  if (statsB.ppdVal == null) {
    bPpdDisp = projB.scanEquivLabel || "Unknown";
    bPpdNum = null;
  } else {
    bPpdNum = statsB.ppdVal;
    bPpdDisp = fmtInt(statsB.ppdVal) + " ppd";
  }
  rows.push({ ...makeRow("ppd", "Pixels per degree", aPpdNum, bPpdNum, aPpdDisp, bPpdDisp, true),
    explain: "Perceived sharpness from this seat; higher usually looks crisper." });

  // 4. Visible content area
  const aAreaNum = statsA.mask.effW * statsA.mask.effH;
  const bAreaNum = statsB.mask.effW * statsB.mask.effH;
  const aAreaDisp = fmtInt(aAreaNum) + " sq ft";
  const bAreaDisp = fmtInt(bAreaNum) + " sq ft";
  rows.push({ ...makeRow("area", "Visible content area", aAreaNum, bAreaNum, aAreaDisp, bAreaDisp, true),
    explain: "How large the actual movie image is, after masking or cropping." });

  // 5. Physical screen utilization
  const aUtilDisp = fmtInt(statsA.physicalUtil) + "%";
  const bUtilDisp = fmtInt(statsB.physicalUtil) + "%";
  rows.push({ ...makeRow("util", "Screen utilization", statsA.physicalUtil, statsB.physicalUtil, aUtilDisp, bUtilDisp, true),
    explain: "How much of the physical screen this movie format fills." });

  // 6. Brightness
  const aFlDisp = statsA.fl != null ? fmtNum(statsA.fl, 1) + " fL" : "Unknown";
  const bFlDisp = statsB.fl != null ? fmtNum(statsB.fl, 1) + " fL" : "Unknown";
  rows.push({ ...makeRow("brightness", "Brightness", statsA.fl, statsB.fl, aFlDisp, bFlDisp, true),
    explain: "How much light reaches the screen; higher helps HDR and punch." });

  // 7. Native contrast (sequential on/off only)
  const aContrNum = projA.isPerPixelEmissive ? Infinity : projA.nativeContrast;
  const bContrNum = projB.isPerPixelEmissive ? Infinity : projB.nativeContrast;
  const aContrDisp = projA.isPerPixelEmissive ? "∞" : (projA.nativeContrast ? projA.nativeContrast.toLocaleString() + ":1" : "Unknown");
  const bContrDisp = projB.isPerPixelEmissive ? "∞" : (projB.nativeContrast ? projB.nativeContrast.toLocaleString() + ":1" : "Unknown");
  rows.push({ ...makeRow("contrast", "Native contrast", aContrNum, bContrNum, aContrDisp, bContrDisp, true),
    explain: "Projector's sequential (on/off) contrast — measured before any dynamic HDR system." });

  // 8. HDR black level (categorical)
  const hdrRow = makeHdrRow("hdr", "HDR black level", projA.hdrCategory, projB.hdrCategory, projA.hdrLabel, projB.hdrLabel);
  rows.push({ ...hdrRow, explain: "Whether the system can dynamically deepen blacks for HDR content." });

  // 9. Picture depth (summary row — same winner as HDR)
  const aDepthDisp = projA.hdrLabel === "—" ? "SDR" : projA.hdrLabel;
  const bDepthDisp = projB.hdrLabel === "—" ? "SDR" : projB.hdrLabel;
  rows.push({
    id: "depth",
    label: "Picture depth",
    aDisplay: aDepthDisp,
    bDisplay: bDepthDisp,
    winner: hdrRow.winner,
    badgeLabel: hdrRow.badgeLabel,
    note: hdrRow.note || null,
    explain: "Overall sense of contrast, HDR, and image dimensionality.",
  });

  return rows;
}

// ─── Verdict builder ──────────────────────────────────────────────────────────

// Short natural-language labels for verdict sentences
const VERDICT_LABEL = {
  visible_hfov: "horizontal immersion", visible_vfov: "vertical immersion",
  ppd: "sharpness", area: "visible image area",
  util: "screen utilization", brightness: "brightness",
  contrast: "native contrast", hdr: "HDR black level", depth: "picture depth",
};

function buildVerdict(sideA, sideB, rows, contentLabel) {
  const aWinsRows = rows.filter(r => r.winner === "a");
  const bWinsRows = rows.filter(r => r.winner === "b");
  const tieRows = rows.filter(r => r.winner === "tie");

  const aName = sideA.name;
  const bName = sideB.name;

  function rowLabel(r) { return VERDICT_LABEL[r.id] || r.label.toLowerCase(); }
  function joinLabels(labels) {
    if (labels.length <= 2) return labels.join(" and ");
    return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  }
  function topLabels(winRows) {
    const priority = ["area", "visible_vfov", "visible_hfov", "contrast", "brightness", "hdr", "ppd", "util", "depth"];
    return winRows
      .slice()
      .sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id))
      .slice(0, 3)
      .map(rowLabel);
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

  const tieNames = tieRows
    .filter(r => r.id !== "depth")
    .slice(0, 3)
    .map(rowLabel);
  if (tieNames.length === 1) {
    sentences.push({ side: null, text: `${tieNames[0].charAt(0).toUpperCase() + tieNames[0].slice(1)} is comparable from this seat.` });
  } else if (tieNames.length > 1) {
    const last = tieNames.pop();
    const comparable = `${tieNames.join(", ")} and ${last}`;
    sentences.push({ side: null, text: `${comparable.charAt(0).toUpperCase() + comparable.slice(1)} are comparable from this seat.` });
  }

  return {
    sentences,
    aWins: aWinsRows,
    bWins: bWinsRows,
    ties: tieRows,
    aName,
    bName,
  };
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
    <span
      className="conf-label"
      data-tier={meta.tier}
      data-text={`${meta.label} — ${src.note}`}
      aria-label={label}
      tabIndex={0}
    >
      {label}
    </span>
  );
}

// ─── Picker (combobox with search + grouped sections) ────────────────────────

function Picker({ side, sideColor, venue, presAr, filmMode, presentationNote, onChangeVenue, onChangePresAr, onChangeFilmMode, excludeId }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when dropdown opens
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
        label,
        count: items.length,
        items: items.slice().sort((a, b) => (a.city || "").localeCompare(b.city || "") || a.name.localeCompare(b.name)),
      }));

    if (home.length > 0) {
      cinemaGroups.push({
        label: "HOME DISPLAYS",
        count: null,
        items: home.slice().sort((a, b) => a.name.localeCompare(b.name)),
      });
    }

    return cinemaGroups;
  }, [query, excludeId]);

  function pickVenue(v) {
    onChangeVenue(v);
    setOpen(false);
    setQuery("");
  }

  const proj = (filmMode && venue.filmProjection) ? venue.filmProjection : venue.projection;
  const screenSrc = venue.sources.screen;
  const meta = D.qualityMeta[screenSrc.q] || { label: screenSrc.q, tier: 3 };

  return (
    <div ref={ref} className="picker-v3">
      {/* Trigger card */}
      <button
        className="picker-v3__card"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        type="button"
      >
        <div className="picker-v3__top">
          <span className="picker-v3__side" style={{ background: sideColor }}>SIDE {side}</span>
          <span className="picker-v3__hint">{open ? "CLOSE ▲" : "CHANGE ▼"}</span>
        </div>
        <div className="picker-v3__name">{venue.name}</div>
        <div className="picker-v3__sub">{venue.sub}</div>
        {/* Metadata chips */}
        <div className="meta-chips" onClick={e => e.stopPropagation()}>
          <span className="meta-chip meta-chip--screen">Screen {venue.screen.ar.toFixed(2)}:1</span>
          <span className="meta-chip meta-chip--pres">Showing {presAr.toFixed(2)}:1</span>
          <span className="meta-chip meta-chip--proj">{proj.label}</span>
          <span className="meta-chip meta-chip--source" data-tier={meta.tier}>{meta.label}</span>
        </div>
        {presentationNote && <div className="presentation-note">{presentationNote}</div>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="picker-v3__dropdown" role="listbox">
          <div className="picker-v3__search-wrap">
            <input
              ref={searchRef}
              type="text"
              className="picker-v3__search"
              placeholder="Search theaters, formats, displays…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
              aria-label="Search"
            />
            <div className="picker-v3__source-note">
              IMAX theater listings come from 143190.xyz and do not include older Xenon-only IMAX venues yet. Those need a supplemental source.
            </div>
          </div>
          {groups.length === 0 && (
            <div className="picker-v3__empty">No results for "{query}"</div>
          )}
          {groups.map(g => (
            <div key={g.label}>
              <div className="picker-v3__group-label">
                {g.label}{g.count != null ? ` (${g.count})` : ""}
              </div>
              {g.items.map(v => (
                <button
                  key={v.id}
                  className="picker-v3__item"
                  role="option"
                  onClick={() => pickVenue(v)}
                >
                  <div className="picker-v3__item-name">{v.name}</div>
                  <div className="picker-v3__item-sub">{v.sub}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <HybridToggle venue={venue} filmMode={filmMode} onChangeFilmMode={onChangeFilmMode} />
      <ScreenArSelector
        venue={venue}
        presAr={presAr}
        filmMode={filmMode}
        onChangePresAr={onChangePresAr}
      />
    </div>
  );
}

// ─── Hybrid projection toggle ─────────────────────────────────────────────────

function HybridToggle({ venue, filmMode, onChangeFilmMode }) {
  const hasFilmMode = venue.isHybrid && venue.filmProjection;
  if (!hasFilmMode) return null;

  return (
    <div className="hybrid-section">
      <span className="hybrid-label">PROJECTION MODE</span>
      <div className="hybrid-toggle">
        <button
          className={`hybrid-btn ${!filmMode ? "is-active" : ""}`}
          onClick={() => onChangeFilmMode(false)}
          type="button"
        >
          Digital
        </button>
        <button
          className={`hybrid-btn ${filmMode ? "is-active" : ""}`}
          onClick={() => onChangeFilmMode(true)}
          type="button"
        >
          15/70 Film
        </button>
      </div>
      {filmMode && <span className="hybrid-booking-note">Film bookings only — check venue schedule</span>}
    </div>
  );
}

// ─── Per-side format selector (presentation AR = content AR) ─────────────────

function ScreenArSelector({ venue, presAr, filmMode, onChangePresAr }) {
  const modes = compatiblePresentationModes(venue, filmMode);

  return (
    <div className="screen-ar-section">
      <span className="screen-ar-label">FORMAT</span>
      <div className="screen-ar-row">
        {modes.map(m => {
          const isActive = Math.abs(m.ar - presAr) < 0.01;
          return (
            <button
              key={m.id}
              className={`screen-ar-btn ${isActive ? "is-active" : ""}`}
              onClick={() => onChangePresAr(m.ar)}
              type="button"
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stage (screen scale visualization) ──────────────────────────────────────

function Stage({ venueA, venueB, statsA, statsB, filmModeA, filmModeB }) {
  const svgRef = useRef(null);

  // Each side uses its own content AR (= presAr — format was selected per-side)
  const contentArA = statsA.presAr;
  const contentArB = statsB.presAr;

  // Build display-ready venue objects for the stage renderer
  // Stage uses screen.w/h and projection.min_ar — adapt for presentation AR
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
          <span className="stage__legend-item">
            <span className="stage__swatch" style={{ background: "var(--side-a)" }} />
            A · {venueA.tag}
          </span>
          <span className="stage__legend-item">
            <span className="stage__swatch" style={{ background: "var(--side-b)" }} />
            B · {venueB.tag}
          </span>
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
      {/* Side A */}
      <div className="stats__cell stats__cell--a">
        {row.winner === "a" && <span className={winBadgeClass(row.winner)}>A WINS</span>}
        {isCategorical
          ? <CategoricalValue text={row.aDisplay} hdrCategory={catA} />
          : <><span className="stats__value">{row.aDisplay}</span></>
        }
        {srcA && <ConfLabel src={srcA} mask={maskA} />}
      </div>

      {/* Center label */}
      <div className="stats__metric">
        {row.label}
        {row.winner === "tie" && <span className={winBadgeClass("tie")} style={{ display: "block", marginTop: 4 }}>COMPARABLE</span>}
        {row.winner === "unknown" && <span className={winBadgeClass("unknown")} style={{ display: "block", marginTop: 4 }}>UNKNOWN</span>}
        {row.explain && <span className="stats__explain">{row.explain}</span>}
        {row.note && <span className="stats__note">{row.note}</span>}
      </div>

      {/* Side B */}
      <div className="stats__cell stats__cell--b">
        {srcB && <ConfLabel src={srcB} mask={maskB} />}
        {isCategorical
          ? <CategoricalValue text={row.bDisplay} hdrCategory={catB} />
          : <><span className="stats__value">{row.bDisplay}</span></>
        }
        {row.winner === "b" && <span className={winBadgeClass(row.winner)}>B WINS</span>}
      </div>
    </div>
  );
}

function StatGrid({ rows, sideA, sideB, statsA, statsB }) {
  const projA = statsA.proj;
  const projB = statsB.proj;

  // Map row IDs to which sources to show
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
        <StatRow
          key={row.id}
          row={row}
          srcA={srcForRow(row.id, "a")}
          srcB={srcForRow(row.id, "b")}
          projA={projA}
          projB={projB}
          maskA={statsA.mask}
          maskB={statsB.mask}
        />
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
  const ftA = fmtInt(sideA.seat[seat]);
  const ftB = fmtInt(sideB.seat[seat]);
  return (
    <div className="seat-section">
      <div className="seat-row">
        <span className="format-row__label">SEAT</span>
        {["front", "mid", "back"].map(s => {
          return (
            <button
              key={s}
              className={`seat-btn ${seat === s ? "is-active" : ""}`}
              onClick={() => onChange(s)}
              type="button"
            >
              {labels[s]}
            </button>
          );
        })}
      </div>
      <div className="seat-info">A: {ftA} ft · B: {ftB} ft · distances estimated</div>
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
          <p>Horizontal and vertical FOV use the visible movie image after masking or cropping. The stage diagram still shows the physical screen scale.</p>

          <h3>Pixels per degree (PPD)</h3>
          <p>PPD = resolution_horizontal / content_FOV_degrees</p>
          <p>Uses the visible content width (after masking), not the full screen or projected window.</p>
          <p>15/70 film reports scan-equivalent range (~8.8K–11.7K) rather than a fixed pixel count — grain limits perceived detail before scan resolution does.</p>

          <h3>Viewing distances</h3>
          <p>Cinema seating uses tiered assumptions when published row data is unavailable. Dedicated GT rooms use venue-specific or constrained-depth estimates; CoLa, Dolby, XD, and standard multiplex rooms use auditorium-ratio estimates. Sparse 143190 rows provide screen and projector facts, not seating depth. Home displays use typical living-room distances for the screen size per THX-style recommendations.</p>

          <h3>Brightness comparison</h3>
          <p>Cinema: published or community-estimated fL calibration target. Home displays: <code>full-field_nits ÷ 3.426 = fL</code>. Peak HDR nits excluded — full-field is the fair cinema comparison.</p>

          <h3>Native contrast</h3>
          <p>Sequential (on/off) contrast only — not dynamic HDR. OLED displays show ∞ because each pixel emits independently. Dolby Cinema's 1,000,000:1 figure is the Dolby Vision dynamic black-level claim; sequential is ~6,250:1.</p>

          <h3>HDR and photochemical latitude</h3>
          <p>Dolby Vision vs photochemical film are fundamentally different systems. The HDR black level and picture depth rows show "Comparable" with a note rather than picking a winner.</p>

          <h3>Presentation AR vs content AR</h3>
          <p>Presentation AR = what each selected screen is configured to show. Each side defaults to that venue's usual presentation window, then only exposes compatible enabled modes for that screen. Content AR = what the movie was shot or mastered at. When content AR differs from the presentation window, the visible image is masked or cropped according to the selected mode.</p>
        </div>
      )}
    </>
  );
}

// ─── Presentation mismatch notes ─────────────────────────────────────────────

function fmtAr(ar) {
  return fmtNum(ar, 2);
}

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
  if (Math.abs(stats.presAr - contentAr) < 0.01 && !mask.cropped && !mask.pillarbox && !mask.letterbox) {
    return null;
  }
  if (mask.cropped) {
    return `Shown in ${pres} window; full ${content} height is cropped in this mode.`;
  }
  if (mask.pillarbox) {
    return `Shown in ${pres} window; content fills center with side masking.`;
  }
  if (mask.letterbox) {
    return `Shown in ${pres} window; content fills width with top/bottom masking.`;
  }
  return null;
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Helper: get the label for the currently active presentation mode
function activeModeLabel(venue, presAr, filmMode) {
  const modes = compatiblePresentationModes(venue, filmMode);
  const m = modes.find(mode => Math.abs(mode.ar - presAr) < 0.01);
  return m ? m.label : presAr.toFixed(2);
}

function App() {
  // Default: Apple Providence (A) vs Dolby Cinema (B)
  const [sideA, setSideA] = useState(D.venues[0]);
  const [sideB, setSideB] = useState(D.venues[2]);

  // presAr IS the content AR — selecting a format mode sets both simultaneously
  const [presArA, setPresArA] = useState(defaultPresArFor(D.venues[0], false));
  const [presArB, setPresArB] = useState(defaultPresArFor(D.venues[2], false));
  const [filmModeA, setFilmModeA] = useState(false);
  const [filmModeB, setFilmModeB] = useState(false);
  const [seat, setSeat] = useState("mid");
  const [detailsOpen, setDetailsOpen] = useState(false);

  function handleChangeA(v) {
    setSideA(v);
    setFilmModeA(false);
    setPresArA(defaultPresArFor(v, false));
  }
  function handleChangeB(v) {
    setSideB(v);
    setFilmModeB(false);
    setPresArB(defaultPresArFor(v, false));
  }
  function handleFilmModeA(nextFilmMode) {
    setFilmModeA(nextFilmMode);
    setPresArA(defaultPresArFor(sideA, nextFilmMode));
  }
  function handleFilmModeB(nextFilmMode) {
    setFilmModeB(nextFilmMode);
    setPresArB(defaultPresArFor(sideB, nextFilmMode));
  }

  // presAr is passed as contentAr — the selected format IS the content
  const statsA = useMemo(() =>
    computeStats(sideA, seat, presArA, presArA, filmModeA),
    [sideA, seat, presArA, filmModeA]
  );
  const statsB = useMemo(() =>
    computeStats(sideB, seat, presArB, presArB, filmModeB),
    [sideB, seat, presArB, filmModeB]
  );

  const rows = useMemo(() =>
    buildComparisonRows(sideA, sideB, statsA, statsB),
    [sideA, sideB, statsA, statsB]
  );

  const contentLabelA = activeModeLabel(sideA, presArA, filmModeA);
  const contentLabelB = activeModeLabel(sideB, presArB, filmModeB);
  const verdictContentLabel = contentLabelA === contentLabelB
    ? contentLabelA
    : `A: ${contentLabelA} / B: ${contentLabelB}`;

  const verdict = useMemo(() =>
    buildVerdict(sideA, sideB, rows, verdictContentLabel),
    [sideA, sideB, rows, verdictContentLabel]
  );

  const noteA = presentationNoteFor(sideA, statsA, presArA, filmModeA);
  const noteB = presentationNoteFor(sideB, statsB, presArB, filmModeB);

  return (
    <div className="app">
      {/* Masthead */}
      <header className="masthead">
        <h1 className="masthead__title">LIEMAX</h1>
      </header>

      {/* Side pickers */}
      <div className="pickers">
        <Picker
          side="A"
          sideColor="var(--side-a)"
          venue={sideA}
          presAr={statsA.presAr}
          filmMode={filmModeA}
          presentationNote={noteA}
          onChangeVenue={handleChangeA}
          onChangePresAr={setPresArA}
          onChangeFilmMode={handleFilmModeA}
        />
        <span className="pickers__vs">VS</span>
        <Picker
          side="B"
          sideColor="var(--side-b)"
          venue={sideB}
          presAr={statsB.presAr}
          filmMode={filmModeB}
          presentationNote={noteB}
          onChangeVenue={handleChangeB}
          onChangePresAr={setPresArB}
          onChangeFilmMode={handleFilmModeB}
        />
      </div>

      {/* Screen scale visualization */}
      <Stage
        venueA={sideA}
        venueB={sideB}
        statsA={statsA}
        statsB={statsB}
        filmModeA={filmModeA}
        filmModeB={filmModeB}
      />

      {/* Verdict */}
      <Verdict verdict={verdict} contentLabel={verdictContentLabel} />

      {/* Stats table */}
      <StatGrid rows={rows} sideA={sideA} sideB={sideB} statsA={statsA} statsB={statsB} />

      {/* Seat selector */}
      <SeatSelector sideA={sideA} sideB={sideB} seat={seat} onChange={setSeat} />

      {/* Details drawer */}
      <DetailsDrawer open={detailsOpen} onToggle={() => setDetailsOpen(o => !o)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
