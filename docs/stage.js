/* Hero stage — screen scale visualization with human silhouette
   Two screens are drawn at correct *relative* scale; user is shown next to them.
   Content overlay is masked rectangle inside each screen showing what the
   selected content AR actually fills. */

const SVG_NS = "http://www.w3.org/2000/svg";

window.LIEMAX_STAGE = function renderStage(svg, A, B, contentARA, contentARB) {
  const M = window.LIEMAX_MATH;
  // contentARB defaults to contentARA when not supplied (legacy single-AR call)
  if (contentARB == null) contentARB = contentARA;

  // Clear
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Layout: SVG viewBox in feet. We need to fit A.screen, B.screen, and a 6 ft human.
  // Place: [HumanA] [ScreenA] [GAP] [ScreenB] [HumanB]? — actually one human is enough,
  // place between the two screens at the floor for scale.
  const PAD = 8; // ft
  const GAP = 14; // ft between screens
  const FLOOR_Y = 0; // baseline at floor
  const HUMAN_H = 5.75; // average adult height in ft
  const HUMAN_W = 1.6;

  const aMask = M.masking(A.screen, contentARA, A.projection);
  const bMask = M.masking(B.screen, contentARB, B.projection);

  // Both screens share floor. Bottom of screen lifted off floor a bit
  // (cinemas: ~5 ft sightline; home: 2 ft TV stand). Use 5 for cinema, 2 for home.
  const aLift = A.kind === "cinema" ? 5 : 2;
  const bLift = B.kind === "cinema" ? 5 : 2;

  const aH = A.screen.h;
  const aW = A.screen.w;
  const bH = B.screen.h;
  const bW = B.screen.w;

  const totalW = PAD + aW + GAP + bW + PAD;
  const totalH = Math.max(aLift + aH, bLift + bH, HUMAN_H) + 6; // headroom

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
    // Outline (full screen, semi-transparent)
    el("rect", {
      x: x0, y: -(lift + h),
      width: w, height: h,
      fill: side === "A" ? sideColor : sideColor,
      "fill-opacity": 0.08,
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
  drawScreen(aX, "A", A.screen, aLift, aMask, A.name, "var(--side-a)");
  // Side B
  drawScreen(bX, "B", B.screen, bLift, bMask, B.name, "var(--side-b)");

  // Human silhouette between the screens, at floor level
  const humanX = PAD + aW + GAP/2 - HUMAN_W/2;
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
    // 6 ft tag
    el("text", {
      x: headCX, y: bodyBot - 0.4,
      "text-anchor": "middle",
      "font-family": "var(--font-mono)",
      "font-size": 0.95,
      fill: "currentColor", opacity: 0.6,
    }).textContent = "5'9\"";
  }

  // Return ratio info for caption
  return {
    aArea: A.screen.w * A.screen.h,
    bArea: B.screen.w * B.screen.h,
    aMask, bMask,
  };
};
