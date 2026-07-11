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

  // Vertical FOV is asymmetric: the screen (or visible content) bottom sits
  // above the floor and the seated eye is at a different height, so the angle
  // splits unevenly above/below the eye line. Mirrors src/math/fov.ts
  // verticalFov() — kept in parity by src/docs/validateMathParity.ts.
  const DEFAULT_SCREEN_BOTTOM_FT = 5.0;
  const DEFAULT_EYE_HEIGHT_FT = 3.75;

  function verticalFovDeg(screenHeightFt, distanceFt, bottomHeightFt, eyeHeightFt) {
    if (!isPositiveNumber(screenHeightFt) || !isPositiveNumber(distanceFt)) return null;
    const bottom = isFiniteNumber(bottomHeightFt) ? bottomHeightFt : DEFAULT_SCREEN_BOTTOM_FT;
    const eye = isFiniteNumber(eyeHeightFt) ? eyeHeightFt : DEFAULT_EYE_HEIGHT_FT;
    const top = bottom + screenHeightFt;
    const aboveHorizon = Math.atan((top - eye) / distanceFt) * DEG;
    const belowHorizon = Math.atan((eye - bottom) / distanceFt) * DEG;
    return aboveHorizon + belowHorizon;
  }

  // Bottom height (ft above floor) of a content rect vertically centered on
  // the physical screen — letterbox bars split evenly top/bottom.
  function contentBottomFt(screenHeightFt, contentHeightFt, screenBottomFt) {
    const base = isFiniteNumber(screenBottomFt) ? screenBottomFt : DEFAULT_SCREEN_BOTTOM_FT;
    if (!isPositiveNumber(screenHeightFt) || !isPositiveNumber(contentHeightFt)) return base;
    return base + Math.max(0, (screenHeightFt - contentHeightFt) / 2);
  }

  // Seated eye height on a linearly raked floor. Mirrors src/math/seating.ts
  // eyeHeightAtDistance() — kept in parity by src/docs/validateMathParity.ts.
  function eyeHeightAtDistance(distanceFt, frontRowDistanceFt, rakeAngleDeg, frontRowFloorElevationFt, maxFloorHeightFt, eyeAboveFloorFt) {
    if (!isPositiveNumber(distanceFt)) return DEFAULT_EYE_HEIGHT_FT;
    const front = isFiniteNumber(frontRowDistanceFt) && frontRowDistanceFt >= 0 ? frontRowDistanceFt : 0;
    const rake = Math.tan(((isFiniteNumber(rakeAngleDeg) ? rakeAngleDeg : 0) * Math.PI) / 180);
    let floor = Math.max(0, isFiniteNumber(frontRowFloorElevationFt) ? frontRowFloorElevationFt : 0) +
      Math.max(0, distanceFt - front) * rake;
    if (isFiniteNumber(maxFloorHeightFt)) floor = Math.min(floor, maxFloorHeightFt);
    return Math.max(0, floor) + (isFiniteNumber(eyeAboveFloorFt) ? eyeAboveFloorFt : DEFAULT_EYE_HEIGHT_FT);
  }

  // Venue-aware seat eye height from generated seat geometry (rake, front
  // row, elevation, profile floor cap); flat default when rake is unknown.
  function eyeHeightForVenueSeat(venue, distanceFt) {
    const seat = venue && venue.seat ? venue.seat : {};
    if (!isPositiveNumber(distanceFt) || !isFiniteNumber(seat.rakeDeg)) return DEFAULT_EYE_HEIGHT_FT;
    const screenH = venue.screen && isPositiveNumber(venue.screen.h) ? venue.screen.h : null;
    const cap = screenH != null ? screenH * (seat.geometryProfile === "gt_pit" ? 0.75 : 0.45) : null;
    return eyeHeightAtDistance(
      distanceFt,
      isPositiveNumber(seat.front) ? seat.front : 0,
      seat.rakeDeg,
      seat.frontRowFloorElevationFt,
      cap
    );
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
    const screenAR = screen.w / screen.h;
    const fillsWidth = screenAR <= presAR;
    const projectedWindow = {
      w: fillsWidth ? screen.w : screen.h * presAR,
      h: fillsWidth ? screen.w / presAR : screen.h,
      ar: presAR,
      geometry: screen.geometry,
    };
    const projectedMask = masking(projectedWindow, contentAR, { min_ar: presentation.min_ar ?? presAR });
    const effW = Math.min(projectedMask.effW, screen.w);
    const effH = Math.min(projectedMask.effH, screen.h);
    const physicalArea = screen.w * screen.h;
    const areaUtilPct = Math.min(100, (effW * effH) / physicalArea * 100);
    const physicalLetterbox = projectedWindow.h < screen.h - 0.05;
    const physicalPillarbox = projectedWindow.w < screen.w - 0.05;

    return {
      ...projectedMask,
      effW,
      effH,
      areaUtilPct,
      letterbox: projectedMask.letterbox || physicalLetterbox,
      pillarbox: projectedMask.pillarbox || physicalPillarbox,
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

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  // --- Pick "viewing distance" for the venue ---
  // For cinemas: mid by default. For home: mid (typical sofa).
  function distanceForSeat(venue, seat /* "front"|"mid"|"back" */) {
    return venue.seat[seat] ?? venue.seat.mid;
  }

  return {
    horizontalFovDeg, verticalFovDeg, contentBottomFt, eyeHeightAtDistance, eyeHeightForVenueSeat, ppd, masking, visibleContentRect, brightnessFL, distanceForSeat,
  };
})();
