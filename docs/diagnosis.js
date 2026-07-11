/* LIEMAX v3 — Diagnosis logic.
   Classifies a venue into one of six categories and produces copy.
   Exposes: window.LIEMAX_DIAGNOSE = { diagnose, classify, LABELS }
*/
window.LIEMAX_DIAGNOSE = (function () {

  const LABELS = {
    true_143_film:    { rank: "Tier S · The rarest configuration",
                        badge: "True IMAX 1.43 · GT Laser + 15/70 Film",
                        accent: "var(--cat-true143-film)" },
    true_143_laser:   { rank: "Tier S · Real-deal IMAX",
                        badge: "True IMAX 1.43 · GT Laser",
                        accent: "var(--cat-true143)" },
    true_film_lie_dig:{ rank: "Tier B · Hybrid — film yes, digital no",
                        badge: "True IMAX for 15/70 Film · IMAX Lite digitally",
                        accent: "var(--cat-truefilm)" },
    true_dome:        { rank: "Tier A · 1.43 dome immersion",
                        badge: "True IMAX Dome 1.43",
                        accent: "var(--cat-dome)" },
    imax_lite:        { rank: "Tier C · Modern multiplex IMAX",
                        badge: "IMAX Lite",
                        accent: "var(--cat-imaxlite, var(--cat-liemax))" },
    liemax:           { rank: "Tier D · Legacy multiplex IMAX",
                        badge: "LIEMAX",
                        accent: "var(--cat-liemax)" },
    unknown:          { rank: "Insufficient data",
                        badge: "Unknown · incomplete",
                        accent: "var(--cat-unknown)" },
  };

  function hasDomeShape(venue) {
    return /dome|omni/i.test(venue.tag || "") || venue.screen.geometry === "hemispherical";
  }

  function hasDomeCapableProjection(venue) {
    const projections = [venue.projection, venue.filmProjection].filter(Boolean);
    const projectionText = projections
      .map(p => [p.label, p.display_name, p.light, p.type].filter(Boolean).join(" "))
      .join(" ");
    const modeText = (venue.presentationModes || []).map(m => m.label || "").join(" ");
    return /imax_dome_laser|imax_dome_film|laser\s*for\s*dome|dome\s*15\/?70|gt\s*dome|omni/i.test(`${projectionText} ${modeText}`);
  }

  function isTrueDome(venue) {
    return hasDomeShape(venue) && hasDomeCapableProjection(venue);
  }

  function hasFilm(venue) {
    return !!(venue.isHybrid && venue.filmProjection);
  }

  function projectionType(venue) {
    return venue && venue.projection ? venue.projection.type : null;
  }

  function isImaxLite(venue) {
    return /^(imax_cola|imax_laser_xt|imax_gt_dual_laser)$/.test(projectionType(venue) || "");
  }

  function isLiemax(venue) {
    return projectionType(venue) === "imax_dual_xenon";
  }

  function digital143(venue) {
    const proj = venue.projection;
    if (!proj) return false;
    const isGT = proj.type === "imax_gt_dual_laser";
    const arOk = venue.screen.ar != null && venue.screen.ar <= 1.45;
    const minArOk = proj.min_ar != null && proj.min_ar <= 1.43;
    return isGT && arOk && minArOk;
  }

  function classify(venue) {
    if (!venue) return "unknown";
    if (venue.kind === "home") return "unknown";
    if (isTrueDome(venue)) return "true_dome";
    const d143 = digital143(venue);
    const film = hasFilm(venue);
    if (d143 && film) return "true_143_film";
    if (d143) return "true_143_laser";
    if (film && venue.screen.ar != null && venue.screen.ar <= 1.45) return "true_film_lie_dig";
    if (venue.projection && venue.projection.label && /unknown/i.test(venue.projection.label)) return "unknown";
    if (isImaxLite(venue)) return "imax_lite";
    if (isLiemax(venue)) return "liemax";
    return "unknown";
  }

  function buildVerdict(venue, category) {
    const name = venue.name;
    const projLabel = venue.projection ? venue.projection.label : "Unknown projector";
    const projectionText = [venue.projection, venue.filmProjection]
      .filter(Boolean)
      .map(p => [p.label, p.display_name, p.light, p.type].filter(Boolean).join(" "))
      .join(" ");
    const isDomeFilm = /15\s*\/?\s*70|film|imax_dome_film|gt\s*dome/i.test(projectionText);
    const domeSystem = isDomeFilm ? "IMAX GT Dome 15/70mm film" : "IMAX Laser for Dome";
    const arDisplay = venue.screen.ar != null ? venue.screen.ar.toFixed(2) : "?";
    const wFt = venue.screen.w ? Math.round(venue.screen.w) : null;
    const hFt = venue.screen.h ? Math.round(venue.screen.h) : null;
    const sizeStr = wFt && hFt ? `${wFt} × ${hFt} ft` : null;

    switch (category) {
      case "true_143_film":
        return {
          line: `This is the real thing — ${arDisplay}:1 GT Laser screen with working 15/70 film.`,
          body: `When ${name} books a 1.43 movie, you see the full IMAX frame. Both digital GT laser and 15/70mm film projection are installed and operating. This is among the rarest configurations in the world — the closest a commercial cinema gets to "True IMAX, all of the time."`,
        };
      case "true_143_laser":
        return {
          line: `True IMAX 1.43 — but digital only.`,
          body: `${name} runs IMAX GT dual-laser projection on a ${arDisplay}:1 screen${sizeStr ? ` measuring roughly ${sizeStr}` : ""}. Anything mastered for 1.43 fills the entire screen. There is no 15/70 film projector here, so reissues struck only on film won't play — but every 1.43 digital release is the real deal.`,
        };
      case "true_film_lie_dig":
        return {
          line: `True IMAX <em>only when they run film</em>.`,
          body: `${name} has a ${arDisplay}:1 screen and a working 15/70mm film projector — so the rare booked film engagement is the real thing, top to bottom. Regular digital showings are IMAX Lite: usually CoLa-class laser capped at 1.90:1, cropping about a quarter of the height off any 1.43 movie. Check the venue schedule before you commit.`,
        };
      case "true_dome":
        return {
          line: `True IMAX Dome 1.43 — ${domeSystem}.`,
          body: `${name} projects onto a hemispherical screen, not a flat rectangle. It is genuine IMAX, but the comparison metric is fixed dome coverage — about 180° horizontal by 125° vertical — rather than flat-screen row distance. Standard cinema scoring doesn't apply cleanly, and dome-mastered content matters.`,
        };
      case "imax_lite":
        return {
          line: `Modern multiplex IMAX — but not full-height 1.43.`,
          body: `${name} runs ${projLabel}${sizeStr ? ` on a ${arDisplay}:1 screen (${sizeStr})` : ""}. This is IMAX Lite: a modern laser IMAX room capped at 1.90:1. It can still be a giant, premium auditorium${/gt/i.test(projLabel) ? " with GT Laser hardware" : ""}, but 1.43-mastered films like Oppenheimer or Sinners lose roughly a quarter of the vertical frame${venue.filmProjection && venue.screen.ar > 1.45 ? ", even though a 15/70 film projector is listed" : ""}.`,
        };
      case "liemax":
        return {
          line: `Branded "IMAX," but it's legacy <em>LIEMAX</em>.`,
          body: `${name} runs ${projLabel}${sizeStr ? ` on a ${arDisplay}:1 screen (${sizeStr})` : ""}. This is the older Dual Xenon multiplex format: 2K lamp projection capped at 1.90:1. It is the original LIEMAX setup people complain about — useful to know, especially because many Xenon rows come from archival LFExaminer data and may need current verification.`,
        };
      default:
        return {
          line: "Not enough data to classify this venue.",
          body: `We have partial specs for ${name}, but the projector or screen detail isn't enough to confidently say what you'd actually see. If you have firsthand info, please contribute corrections to the underlying dataset.`,
        };
    }
  }

  function isHighEnd(venue) {
    return /gt/i.test((venue.projection && venue.projection.label) || "") || digital143(venue) || isTrueDome(venue);
  }

  function modeBreakdown(venue) {
    if (!venue || !venue.presentationModes) return [];
    const out = [];
    venue.presentationModes.forEach(m => {
      let verdict = "true";
      let verdictLabel = "TRUE IMAX";
      let sub = "";
      const ar = m.ar;

      if (!m.enabled) {
        verdict = "na"; verdictLabel = "NOT POSSIBLE";
        sub = m.disabledReason || "Not supported on this screen";
      } else if (isTrueDome(venue)) {
        verdict = "true"; verdictLabel = "DOME IMAX";
        sub = m.isFilmMode ? "15/70 dome film — fixed 180° × 125° coverage" : "Dome laser — fixed 180° × 125° coverage";
      } else if (m.isFilmMode) {
        if (venue.screen.ar != null && venue.screen.ar <= 1.45) {
          verdict = "truefilm"; verdictLabel = "TRUE — ON FILM";
          sub = "Booked engagements only — 15/70mm photochemical";
        } else {
          verdict = "lite"; verdictLabel = "IMAX LITE";
          sub = "15/70 film hardware is listed, but the 1.90 screen cannot show full-height 1.43";
        }
      } else if (Math.abs(ar - 1.43) < 0.01) {
        if (digital143(venue)) {
          verdict = "true"; verdictLabel = "TRUE 1.43";
          sub = "Full IMAX height, GT laser pixel-offset";
        } else if (isImaxLite(venue)) {
          verdict = "lite"; verdictLabel = "IMAX LITE";
          sub = "Modern laser caps at 1.90 — ~25% of frame is cropped";
        } else {
          verdict = "lie"; verdictLabel = "LIEMAX";
          sub = "Legacy Dual Xenon caps at 1.90 — ~25% of frame is cropped";
        }
      } else if (Math.abs(ar - 1.90) < 0.01) {
        verdict = digital143(venue) ? "true" : isImaxLite(venue) ? "lite" : "lie";
        verdictLabel = digital143(venue) ? "TRUE 1.90" : isImaxLite(venue) ? "IMAX LITE 1.90" : "LIEMAX 1.90";
        sub = digital143(venue) ? "Full 1.90 frame on full-height GT laser" : isImaxLite(venue) ? "Full 1.90 frame, modern laser" : "Full 1.90 frame, legacy Dual Xenon";
      } else {
        verdict = "lie"; verdictLabel = "LETTERBOXED";
        sub = "Scope/flat content windowed inside the IMAX screen";
      }

      out.push({
        ar: ar.toFixed(2),
        name: m.label.replace(/^[\d.]+\s*·\s*/, ""),
        sub,
        verdict,
        verdictLabel,
      });
    });
    return out;
  }

  function diagnose(venue) {
    const category = classify(venue);
    const labels = LABELS[category];
    const verdict = buildVerdict(venue, category);
    const modes = modeBreakdown(venue);
    return {
      category,
      rank: labels.rank,
      badge: labels.badge,
      accent: labels.accent,
      headline: verdict.line,
      body: verdict.body,
      modes,
    };
  }

  return { diagnose, classify, LABELS };
})();
