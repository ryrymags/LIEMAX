/* Hero stage — screen scale visualization with human silhouette
   Two screens are drawn at correct *relative* scale; user is shown next to them.
   Content overlay is masked rectangle inside each screen showing what the
   selected content AR actually fills. */

const SVG_NS = "http://www.w3.org/2000/svg";

function stageColor(name, fallback) {
  if (!window.getComputedStyle || !document.documentElement) return fallback;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function isPositiveStageNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasRenderableStageScreen(screen) {
  if (!screen) return false;
  if (screen.geometry === "hemispherical") return isPositiveStageNumber(screen.w);
  return isPositiveStageNumber(screen.w) && isPositiveStageNumber(screen.h);
}

function renderStageUnavailable(svg, message) {
  svg.setAttribute("viewBox", "0 -80 160 80");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x", "80");
  text.setAttribute("y", "-40");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-family", "var(--font-mono)");
  text.setAttribute("font-size", "5");
  text.setAttribute("fill", "currentColor");
  text.setAttribute("opacity", "0.75");
  text.textContent = message;
  svg.appendChild(text);
}

window.LIEMAX_STAGE = function renderStage(svg, A, B, contentARA, contentARB) {
  const M = window.LIEMAX_MATH;
  // contentARB defaults to contentARA when not supplied (legacy single-AR call)
  if (contentARB == null) contentARB = contentARA;

  // Clear
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Layout: SVG viewBox in feet. Keep the scale human beside the first screen
  // at floor level so it never obscures either screen's masking rectangle.
  const PAD = 8; // ft
  const GAP = 14; // ft between screens
  const FLOOR_Y = 0; // baseline at floor
  const HUMAN_H = 5.75; // average adult height in ft
  const HUMAN_W = 1.6;
  const SIDE_A = stageColor("--side-a", "#17476b");
  const SIDE_B = stageColor("--side-b", "#7a3f5c");
  const INK = stageColor("--ink", "#1f1b16");

  if (!hasRenderableStageScreen(A?.screen) || !hasRenderableStageScreen(B?.screen)) {
    renderStageUnavailable(svg, "Screen dimensions unavailable");
    return { aArea: null, bArea: null, aMask: null, bMask: null };
  }

  const aMask = maskFor(A, contentARA);
  const bMask = maskFor(B, contentARB);

  // Both screens share floor. Bottom of screen lifted off floor a bit
  // (cinemas: ~5 ft sightline; home: 2 ft TV stand). Use 5 for cinema, 2 for home.
  const aLift = A.kind === "cinema" ? 5 : 2;
  const bLift = B.kind === "cinema" ? 5 : 2;

  const aH = A.screen.h;
  const aW = A.screen.w;
  const bH = B.screen.h;
  const bW = B.screen.w;

  const totalW = PAD + aW + GAP + bW + PAD;
  const totalH = Math.max(aLift + aH, bLift + bH, HUMAN_H) + 8; // headroom + bottom clearance for human label

  const vbW = totalW;
  const vbH = totalH;
  svg.setAttribute("viewBox", `0 ${-vbH} ${vbW} ${vbH}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMax meet");

  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n);
    return n;
  }

  // Floor line
  el("line", {
    x1: 0, y1: 0, x2: vbW, y2: 0,
    stroke: "currentColor", "stroke-width": 0.08, opacity: 0.5,
  });

  // Helper: draw screen + content
  function drawScreen(x0, side, screen, lift, mask, label, sideColor) {
    const w = screen.w;
    const h = screen.h;

    if (screen.geometry === "hemispherical") {
      const r = w / 2;
      const cx = x0 + r;
      const cy = -(lift + r);
      const coverage = screen.domeCoveragePct || 0.83;
      const fillR = r * Math.sqrt(coverage);

      el("circle", {
        cx, cy, r,
        fill: sideColor,
        "fill-opacity": 0.06,
        stroke: sideColor,
        "stroke-width": 0.22,
      });
      el("circle", {
        cx, cy, r: fillR,
        fill: sideColor,
        "fill-opacity": 0.58,
        stroke: "none",
      });
      el("path", {
        d: `M ${x0} ${cy} A ${r} ${r} 0 0 1 ${x0 + w} ${cy}`,
        fill: "none",
        stroke: INK,
        "stroke-width": 0.14,
        opacity: 0.55,
      });

      const dimText = `${w.toFixed(1)} ft dome diameter`;
      el("text", {
        x: cx, y: cy - r - 0.6,
        "text-anchor": "middle",
        "font-family": "var(--font-mono)",
        "font-size": Math.max(0.9, w * 0.035),
        fill: "currentColor",
        opacity: 0.7,
      }).textContent = dimText;

      el("text", {
        x: cx, y: cy + 0.4,
        "text-anchor": "middle",
        "font-family": "var(--font-mono)",
        "font-size": Math.max(1.1, w * 0.045),
        "font-weight": 700,
        "letter-spacing": "0.14em",
        fill: INK,
        opacity: 0.9,
      }).textContent = `${side} · DOME`;

      el("text", {
        x: cx, y: cy + r + 1.8,
        "text-anchor": "middle",
        "font-family": "var(--font-mono)",
        "font-size": Math.max(0.75, w * 0.026),
        fill: "currentColor",
        opacity: 0.65,
      }).textContent = "180° H × 125° V";
      return;
    }

    // Full physical screen: black base makes letterbox/pillarbox masking visible.
    el("rect", {
      x: x0, y: -(lift + h),
      width: w, height: h,
      fill: "#050505",
      "fill-opacity": 0.94,
      stroke: sideColor,
      "stroke-width": 0.18,
    });

    // Effective content area (centered within screen)
    const dx = (w - mask.effW) / 2;
    const dy = (h - mask.effH) / 2;
    el("rect", {
      x: x0 + dx, y: -(lift + h) + dy,
      width: mask.effW, height: mask.effH,
      fill: sideColor,
      "fill-opacity": 0.78,
      stroke: "none",
    });

    // Tiny screen dim labels (top center)
    const dimText = `${w.toFixed(1)} × ${h.toFixed(1)} ft`;
    el("text", {
      x: x0 + w/2, y: -(lift + h) - 0.6,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(0.9, w * 0.04),
      fill: "currentColor",
      opacity: 0.7,
    }).textContent = dimText;

    // Side label
    el("text", {
      x: x0 + w/2, y: -(lift + h)/2 + 0.4,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(1.2, w * 0.05),
      "font-weight": 700,
      "letter-spacing": "0.18em",
      fill: "#fff",
      opacity: 0.85,
    }).textContent = side;
  }

  // Draw screen A on left, B on right
  const aX = PAD;
  const bX = PAD + aW + GAP;

  // Side A
  drawScreen(aX, "A", A.screen, aLift, aMask, A.name, SIDE_A);
  // Side B
  drawScreen(bX, "B", B.screen, bLift, bMask, B.name, SIDE_B);

  // Human silhouette beside the left screen, at floor level.
  const humanX = Math.max(1, PAD - HUMAN_W - 2);
  drawHuman(humanX, HUMAN_H, HUMAN_W);

  function drawHuman(hx, hh, hw) {
    const headR = hw * 0.32;
    const headCY = -(hh - headR);
    const headCX = hx + hw/2;
    el("circle", {
      cx: headCX, cy: headCY, r: headR,
      fill: "var(--ink)", opacity: 0.85,
    });
    // Body — simple triangle/torso
    const bodyTop = headCY + headR * 0.9;
    const bodyBot = -0.05;
    el("path", {
      d: `M ${headCX - hw*0.42} ${bodyBot}
          L ${headCX - hw*0.18} ${bodyTop + hh*0.05}
          Q ${headCX} ${bodyTop} ${headCX + hw*0.18} ${bodyTop + hh*0.05}
          L ${headCX + hw*0.42} ${bodyBot} Z`,
      fill: "var(--ink)", opacity: 0.85,
    });
    // height label — placed to the right at mid-body height to avoid floor clipping
    el("text", {
      x: headCX + hw * 0.8,
      y: -(hh / 2),
      "text-anchor": "start",
      "font-family": "var(--font-mono)",
      "font-size": 0.95,
      fill: "currentColor", opacity: 0.6,
    }).textContent = "5 9″";
  }

  // Return ratio info for caption
  return {
    aArea: screenSurfaceArea(A.screen),
    bArea: screenSurfaceArea(B.screen),
    aMask, bMask,
  };

  function maskFor(venue, contentAR) {
    if (venue.screen.geometry === "hemispherical") {
      const coverage = venue.screen.domeCoveragePct || 0.83;
      return {
        effW: venue.screen.w,
        effH: venue.screen.h,
        areaUtilPct: coverage * 100,
        letterbox: false,
        pillarbox: false,
        cropped: false,
      };
    }
    return M.visibleContentRect(venue.screen, contentAR, {
      ar: venue.projection.min_ar,
      min_ar: venue.projection.min_ar,
    });
  }

  function screenSurfaceArea(screen) {
    if (screen.geometry === "hemispherical") {
      const r = screen.w / 2;
      return 2 * Math.PI * r * r * (screen.domeCoveragePct || 0.83);
    }
    return screen.w * screen.h;
  }
};

window.LIEMAX_STAGE_SINGLE = function renderSingleStage(svg, venue, contentAR) {
  const M = window.LIEMAX_MATH;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const PAD = 8;
  const FLOOR_Y = 0;
  const HUMAN_H = 5.75;
  const HUMAN_W = 1.6;
  const lift = venue.kind === "cinema" ? 5 : 2;
  const screen = venue.screen;
  const isDome = screen.geometry === "hemispherical";

  if (!hasRenderableStageScreen(screen)) {
    renderStageUnavailable(svg, "Screen dimensions unavailable");
    return;
  }

  const w = screen.w;
  const h = screen.h;
  const totalW = PAD + w + PAD + HUMAN_W + 5;
  const totalH = Math.max(lift + h, HUMAN_H) + 8;
  const SIDE_A = stageColor("--side-a", "#17476b");
  const INK = stageColor("--noir-ink", "#efe7d4");

  svg.setAttribute("viewBox", `0 ${-totalH} ${totalW} ${totalH}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMax meet");

  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n);
    return n;
  }

  el("line", {
    x1: 0, y1: FLOOR_Y, x2: totalW, y2: FLOOR_Y,
    stroke: "currentColor", "stroke-width": 0.08, opacity: 0.5,
  });

  const x0 = PAD;
  const color = SIDE_A;

  if (isDome) {
    const r = w / 2;
    const cx = x0 + r;
    const cy = -(lift + r);
    const coverage = screen.domeCoveragePct || 0.83;
    const fillR = r * Math.sqrt(coverage);
    el("circle", { cx, cy, r, fill: color, "fill-opacity": 0.06, stroke: color, "stroke-width": 0.22 });
    el("circle", { cx, cy, r: fillR, fill: color, "fill-opacity": 0.58, stroke: "none" });
    el("path", {
      d: `M ${x0} ${cy} A ${r} ${r} 0 0 1 ${x0 + w} ${cy}`,
      fill: "none", stroke: INK, "stroke-width": 0.14, opacity: 0.55,
    });
    el("text", {
      x: cx, y: cy - r - 0.6,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(0.9, w * 0.035),
      fill: "currentColor",
      opacity: 0.7,
    }).textContent = `${w.toFixed(1)} ft dome diameter`;
    el("text", {
      x: cx, y: cy + 0.4,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(1.1, w * 0.045),
      "font-weight": 700,
      "letter-spacing": "0.14em",
      fill: INK,
      opacity: 0.9,
    }).textContent = "DOME";
    el("text", {
      x: cx, y: cy + r + 1.8,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(0.75, w * 0.026),
      fill: "currentColor",
      opacity: 0.65,
    }).textContent = "180° H × 125° V";
  } else {
    const mask = M.visibleContentRect(screen, contentAR, {
      ar: venue.projection.min_ar,
      min_ar: venue.projection.min_ar,
    });
    el("rect", {
      x: x0, y: -(lift + h), width: w, height: h,
      fill: "#050505", "fill-opacity": 0.94,
      stroke: color, "stroke-width": 0.18,
    });
    el("rect", {
      x: x0 + (w - mask.effW) / 2,
      y: -(lift + h) + (h - mask.effH) / 2,
      width: mask.effW,
      height: mask.effH,
      fill: color,
      "fill-opacity": 0.78,
      stroke: "none",
    });
    el("text", {
      x: x0 + w / 2, y: -(lift + h) - 0.6,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": Math.max(0.9, w * 0.04),
      fill: "currentColor",
      opacity: 0.7,
    }).textContent = `${w.toFixed(1)} × ${h.toFixed(1)} ft`;
  }

  drawHuman(PAD + w + 5, HUMAN_H, HUMAN_W);

  function drawHuman(hx, hh, hw) {
    const headR = hw * 0.32;
    const headCY = -(hh - headR);
    const headCX = hx + hw / 2;
    el("circle", { cx: headCX, cy: headCY, r: headR, fill: INK, opacity: 0.85 });
    const bodyTop = headCY + headR * 0.9;
    const bodyBot = -0.05;
    el("path", {
      d: `M ${headCX - hw*0.42} ${bodyBot}
          L ${headCX - hw*0.18} ${bodyTop + hh*0.05}
          Q ${headCX} ${bodyTop} ${headCX + hw*0.18} ${bodyTop + hh*0.05}
          L ${headCX + hw*0.42} ${bodyBot} Z`,
      fill: INK, opacity: 0.85,
    });
    el("text", {
      x: headCX + hw * 0.8,
      y: -(hh / 2),
      "text-anchor": "start",
      "font-family": "var(--font-mono)",
      "font-size": 0.95,
      fill: "currentColor", opacity: 0.6,
    }).textContent = "5 9″";
  }
};
