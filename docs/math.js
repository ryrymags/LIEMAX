// Simplified math helpers for the LIEMAX comparison mockup.
// Modeled after src/math/ in the real project, but inline + pure JS.
// All distances in feet unless otherwise noted.

window.LIEMAX_MATH = (function () {
  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  // --- Field of View (horizontal) ---
  // Angle subtended by the screen from the seat. 2 * atan( (w/2) / dist )
  function horizontalFovDeg(screenWidthFt, distanceFt) {
    if (!isPositiveNumber(screenWidthFt) || !isPositiveNumber(distanceFt)) return null;
    return 2 * Math.atan((screenWidthFt / 2) / distanceFt) * DEG;
  }

  function verticalFovDeg(screenHeightFt, distanceFt) {
    if (!isPositiveNumber(screenHeightFt) || !isPositiveNumber(distanceFt)) return null;
    return 2 * Math.atan((screenHeightFt / 2) / distanceFt) * DEG;
  }

  // --- Pixels per degree ---
  // Resolution along width / horizontal FOV in degrees.
  function ppd(resolutionPx, fovDeg) {
    if (!isPositiveNumber(resolutionPx) || !isPositiveNumber(fovDeg)) return null;
    return resolutionPx / fovDeg;
  }

  // --- Masking ---
  // Returns { effW, effH, areaUtilPct, letterbox, pillarbox, cropped }
  // contentAR = content aspect ratio (w/h). screen has w, h, ar, projection.min_ar.
  function masking(screen, contentAR, projection) {
    if (!isPositiveNumber(screen?.w) || !isPositiveNumber(screen?.h) || !isPositiveNumber(contentAR)) {
      return { effW: null, effH: null, areaUtilPct: null, letterbox: false, pillarbox: false, cropped: false };
    }
    const screenAR = screen.ar;
    const minAR = projection.min_ar ?? 0;
    let effW, effH;
    let letterbox = false, pillarbox = false, cropped = false;

    // If projector can't go below content's AR (rare, e.g. CoLa min 1.90 vs content 1.43)
    // we crop to fit horizontally — content gets cut top/bottom.
    if (contentAR < minAR) {
      // Projector forces minAR — content vertically cropped to fit screen at min_ar
      cropped = true;
      effW = Math.min(screen.w, screen.h * minAR);
      effH = effW / minAR;
    } else if (contentAR >= screenAR) {
      // Content wider than screen → letterbox (limited by width)
      effW = screen.w;
      effH = screen.w / contentAR;
      if (effH < screen.h - 0.05) letterbox = true;
    } else {
      // Content narrower than screen → pillarbox (limited by height)
      effH = screen.h;
      effW = screen.h * contentAR;
      if (effW < screen.w - 0.05) pillarbox = true;
    }
    const physicalArea = screen.w * screen.h;
    const areaUtilPct = physicalArea > 0 ? (effW * effH) / physicalArea * 100 : null;
    return { effW, effH, areaUtilPct, letterbox, pillarbox, cropped };
  }

  function visibleContentRect(screen, contentAR, presentation) {
    const presAR = presentation.ar;
    if (!isPositiveNumber(screen?.w) || !isPositiveNumber(screen?.h) || !isPositiveNumber(presAR)) {
      return {
        effW: null,
        effH: null,
        areaUtilPct: null,
        letterbox: false,
        pillarbox: false,
        cropped: false,
        projectedWindow: { w: null, h: null, ar: presAR ?? null, geometry: screen?.geometry ?? null },
        physicalClipped: false,
      };
    }
    const projectedWindow = {
      w: screen.w,
      h: screen.w / presAR,
      ar: presAR,
      geometry: screen.geometry,
    };
    const projectedMask = masking(projectedWindow, contentAR, { min_ar: presentation.min_ar ?? presAR });
    const effW = Math.min(projectedMask.effW, screen.w);
    const effH = Math.min(projectedMask.effH, screen.h);
    const physicalArea = screen.w * screen.h;
    const areaUtilPct = Math.min(100, (effW * effH) / physicalArea * 100);

    return {
      ...projectedMask,
      effW,
      effH,
      areaUtilPct,
      projectedWindow,
      physicalClipped: effW < projectedMask.effW - 0.05 || effH < projectedMask.effH - 0.05,
    };
  }

  // --- Brightness comparison (returns fL for the 'fair' comparison) ---
  // Cinema is published in fL. Home displays we have nits → fL = nits / 3.426.
  function brightnessFL(venue) {
    if (venue.projection.brightness_fl != null) return venue.projection.brightness_fl;
    if (venue.projection.brightness_nits_full != null) return venue.projection.brightness_nits_full / 3.426;
    return null;
  }

  function isPositiveNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }

  // --- Pick "viewing distance" for the venue ---
  // For cinemas: mid by default. For home: mid (typical sofa).
  function distanceForSeat(venue, seat /* "front"|"mid"|"back" */) {
    return venue.seat[seat] ?? venue.seat.mid;
  }

  return {
    horizontalFovDeg, verticalFovDeg, ppd, masking, visibleContentRect, brightnessFL, distanceForSeat,
  };
})();
