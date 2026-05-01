// Simplified math helpers for the LIEMAX comparison mockup.
// Modeled after src/math/ in the real project, but inline + pure JS.
// All distances in feet unless otherwise noted.

window.LIEMAX_MATH = (function () {
  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  // --- Field of View (horizontal) ---
  // Angle subtended by the screen from the seat. 2 * atan( (w/2) / dist )
  function horizontalFovDeg(screenWidthFt, distanceFt) {
    if (distanceFt <= 0) return 180;
    return 2 * Math.atan((screenWidthFt / 2) / distanceFt) * DEG;
  }

  function verticalFovDeg(screenHeightFt, distanceFt) {
    if (distanceFt <= 0) return 180;
    return 2 * Math.atan((screenHeightFt / 2) / distanceFt) * DEG;
  }

  // --- Pixels per degree ---
  // Resolution along width / horizontal FOV in degrees.
  function ppd(resolutionPx, fovDeg) {
    if (fovDeg <= 0) return 0;
    return resolutionPx / fovDeg;
  }

  // --- Masking ---
  // Returns { effW, effH, areaUtilPct, letterbox, pillarbox, cropped }
  // contentAR = content aspect ratio (w/h). screen has w, h, ar, projection.min_ar.
  function masking(screen, contentAR, projection) {
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
    const areaUtilPct = (effW * effH) / (screen.w * screen.h) * 100;
    return { effW, effH, areaUtilPct, letterbox, pillarbox, cropped };
  }

  // --- Brightness comparison (returns fL for the 'fair' comparison) ---
  // Cinema is published in fL. Home displays we have nits → fL = nits / 3.426.
  function brightnessFL(venue) {
    if (venue.projection.brightness_fl != null) return venue.projection.brightness_fl;
    if (venue.projection.brightness_nits_full != null) return venue.projection.brightness_nits_full / 3.426;
    return null;
  }

  // --- Pick "viewing distance" for the venue ---
  // For cinemas: mid by default. For home: mid (typical sofa).
  function distanceForSeat(venue, seat /* "front"|"mid"|"back" */) {
    return venue.seat[seat] ?? venue.seat.mid;
  }

  return {
    horizontalFovDeg, verticalFovDeg, ppd, masking, brightnessFL, distanceForSeat,
  };
})();
