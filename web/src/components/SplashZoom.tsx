// Scroll-driven "deep zoom" cinematic intro. Renders above <Splash/> inside
// <main>. Zooms out from film grain to the full 1.43:1 IMAX frame over an
// 8K-scanned DZI tile pyramid (OpenSeadragon), then reveals aspect-ratio
// comparison overlays (1.90 digital IMAX, 2.39 scope, 1.43 true IMAX) —
// the visual argument the rest of the site makes in numbers.
//
// Imagery (web/public/assets/splash/*) is gitignored — licensing not
// cleared for redistribution (see web/public/assets/splash/README.md). This
// component must degrade gracefully when it is absent: missing tiles fall
// back to a static thumbnail; a missing thumbnail falls back to a plain
// outlined placeholder. See the fallback branch below.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import contentFormatsData from '@data/content_formats/content_formats.json';

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

// Full DZI source dimensions (10803 x 7555, ~1.43:1).
const FULL_IMAGE_WIDTH = 10803;
const FULL_IMAGE_HEIGHT = 7555;

// Zoomed-in starting frame (progress 0): centered on the eye detail, tight
// enough that film grain is unmistakable. Height is derived at runtime from
// the viewer's own aspect ratio so there's no letterbox at the tightest
// zoom (see applyProgress).
const START_CENTER = { x: 5500, y: 2800 };
const START_WIDTH = 2600;

const OPEN_TIMEOUT_MS = 6000;
const PROGRESS_EPSILON = 0.0005;

// Overlay fade-in thresholds (progress) and span, per spec.
const OVERLAY_FADE_SPAN = 0.1;
const OVERLAY_190_START = 0.62;
const OVERLAY_239_START = 0.74;
const OVERLAY_143_START = 0.86;

const CAPTION_TIER_1_AT = 0.3;
const CAPTION_TIER_2_AT = 0.62;

const CAPTIONS = [
  'This is a single frame of 15/70 IMAX film.',
  "Scanned at 8K. You're looking at real film grain.",
  "Most ‘IMAX’ screens crop it. Here’s how much.",
] as const;

const STATIC_CAPTION =
  "A single frame of 15/70 IMAX film, scanned at 8K — and how much of it standard formats crop away.";

const ATTRIBUTION_TEXT =
  'Frame: Oppenheimer (2023) 70mm IMAX scan — shown for format comparison.';

// 1x2px AVIF probe image (generated with vips from this repo's own asset
// pipeline — `vips black probe.v 1 2 && vips copy probe.v probe.avif`).
// Decodes only in browsers with real AVIF support; fails silently
// (onerror) everywhere else, which is a safe failure mode — we just fall
// back to the WebP DZI.
const AVIF_PROBE_SRC =
  'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAARdtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgABAAAAAAE7AAEAAAAAAAAAGgACAAAAAAFVAAEAAAAAAAAAvgAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAABAAIAAEV4aWYAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgQAMAAAAABRpc3BlAAAAAAAAAAEAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAaaXJlZgAAAAAAAAAOY2RzYwACAAEAAQAAAOBtZGF0EgAKCBgAFggIaDQgMgwYAAooooQAALATS9gAAAAGRXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAAA4YwAA6AMAADhjAADoAwAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAEAAAADoAQAAQAAAAIAAAAAAAAA';

const AVIF_DZI_URL = '/assets/splash/liemax-frame-avif.dzi';
const WEBP_DZI_URL = '/assets/splash/liemax-frame-webp.dzi';
const THUMB_AVIF_URL = '/assets/splash/liemax-frame-thumb.avif';
const THUMB_JPG_URL = '/assets/splash/liemax-frame-thumb.jpg';
// 1600px-wide render for the static/reduced-motion mode — the 400px blur
// thumbnail is too soft to serve as a full-screen still.
const STATIC_AVIF_URL = '/assets/splash/liemax-frame-static.avif';
const STATIC_JPG_URL = '/assets/splash/liemax-frame-static.jpg';

// ---------------------------------------------------------------------
// Content format data (canonical source — @data alias, never hardcode
// aspect ratios except as a defensive fallback if a format id is missing).
// ---------------------------------------------------------------------

interface ContentFormat {
  id: string;
  aspect_ratio: number;
}

const contentFormats = contentFormatsData as ContentFormat[];

function aspectRatioFor(id: string, fallback: number): number {
  const match = contentFormats.find((format) => format.id === id);
  return typeof match?.aspect_ratio === 'number' ? match.aspect_ratio : fallback;
}

const AR_190 = aspectRatioFor('imax_digital_190', 1.9);
const AR_239 = aspectRatioFor('scope_239', 2.39);

interface BandRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function centeredBand(ar: number): BandRect {
  const h = FULL_IMAGE_WIDTH / ar;
  return { x: 0, y: (FULL_IMAGE_HEIGHT - h) / 2, w: FULL_IMAGE_WIDTH, h };
}

// The 1.43 box IS the full frame (not derived from an AR lookup — the spec
// is explicit that this box is the frame itself, and deriving it from
// content_formats' imax_143 aspect ratio would introduce rounding drift
// against the DZI's actual pixel dimensions).
const BAND_143: BandRect = { x: 0, y: 0, w: FULL_IMAGE_WIDTH, h: FULL_IMAGE_HEIGHT };
const BAND_190: BandRect = centeredBand(AR_190);
const BAND_239: BandRect = centeredBand(AR_239);

const LABEL_FONT_SIZE = 210;
const LABEL_PADDING = 70;

// Labels live in image-pixel space and shrink with the frame; on small
// viewports (mobile) the natural size lands around 7px. Enforce a
// screen-space floor by scaling the font up whenever the current
// image→screen scale would drop below these minimums.
const MIN_LABEL_SCREEN_PX = 13;
const MIN_LABEL_PAD_SCREEN_PX = 10;

/** Re-derive label font size/position for the current image→screen scale. */
function applyLabelSizing(root: Element | null, scale: number): void {
  if (!root || !(scale > 0)) return;
  const font = Math.max(LABEL_FONT_SIZE, MIN_LABEL_SCREEN_PX / scale);
  const pad = Math.max(LABEL_PADDING, MIN_LABEL_PAD_SCREEN_PX / scale);
  root.querySelectorAll('text.ratio-box-label').forEach((t) => {
    const bandX = Number(t.getAttribute('data-band-x') ?? '0');
    const bandY = Number(t.getAttribute('data-band-y') ?? '0');
    t.setAttribute('font-size', String(font));
    t.setAttribute('x', String(bandX + pad));
    t.setAttribute('y', String(bandY + pad + font));
  });
}

// ---------------------------------------------------------------------
// Small math helpers
// ---------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function captionTierFor(progress: number): 0 | 1 | 2 {
  if (progress < CAPTION_TIER_1_AT) return 0;
  if (progress < CAPTION_TIER_2_AT) return 1;
  return 2;
}

function computeProgress(trackEl: HTMLElement | null): number {
  if (!trackEl) return 0;
  const rect = trackEl.getBoundingClientRect();
  const scrollableHeight = rect.height - window.innerHeight;
  if (scrollableHeight <= 0) return 1;
  return clamp(-rect.top / scrollableHeight, 0, 1);
}

function detectAvifSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(probe.height === 2);
    probe.onerror = () => resolve(false);
    probe.src = AVIF_PROBE_SRC;
  });
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------
// Ratio box (shared markup between scroll mode and static/fallback mode).
// Opacity is controlled two different ways depending on mode: in scroll
// mode, CSS defaults it to 0 and applyProgress mutates the DOM node's
// style.opacity directly via `groupRef` every frame (never through a JSX
// style prop, so React's reconciler never fights the imperative write); in
// static/fallback mode, CSS defaults it to 1 and no JS ever touches it.
// ---------------------------------------------------------------------

interface RatioBoxProps {
  band: BandRect;
  tone: 'digital190' | 'scope239' | 'full143';
  label: string;
  groupRef?: React.RefObject<SVGGElement | null>;
}

function RatioBox({ band, tone, label, groupRef }: RatioBoxProps) {
  return (
    <g ref={groupRef} className={`ratio-box ratio-box--${tone}`}>
      <rect className="ratio-box-halo" x={band.x} y={band.y} width={band.w} height={band.h} />
      <rect className="ratio-box-line" x={band.x} y={band.y} width={band.w} height={band.h} />
      <text
        className="ratio-box-label"
        data-band-x={band.x}
        data-band-y={band.y}
        x={band.x + LABEL_PADDING}
        y={band.y + LABEL_PADDING + LABEL_FONT_SIZE}
        fontSize={LABEL_FONT_SIZE}
      >
        {label}
      </text>
    </g>
  );
}

function RatioBoxes({
  box190Ref,
  box239Ref,
  box143Ref,
}: {
  box190Ref?: React.RefObject<SVGGElement | null>;
  box239Ref?: React.RefObject<SVGGElement | null>;
  box143Ref?: React.RefObject<SVGGElement | null>;
}) {
  return (
    <>
      <RatioBox band={BAND_190} tone="digital190" label="IMAX Digital — 1.90:1" groupRef={box190Ref} />
      <RatioBox band={BAND_239} tone="scope239" label="Standard Scope — 2.39:1" groupRef={box239Ref} />
      <RatioBox band={BAND_143} tone="full143" label="True IMAX — 1.43:1" groupRef={box143Ref} />
    </>
  );
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------

export default function SplashZoom() {
  const reducedMotion = usePrefersReducedMotion();
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  const [osdFailed, setOsdFailed] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [captionTier, setCaptionTier] = useState<0 | 1 | 2>(0);

  const outerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const osdContainerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const overlayGroupRef = useRef<SVGGElement | null>(null);
  const box190Ref = useRef<SVGGElement | null>(null);
  const box239Ref = useRef<SVGGElement | null>(null);
  const box143Ref = useRef<SVGGElement | null>(null);
  const attributionRef = useRef<HTMLParagraphElement | null>(null);
  const staticSvgRef = useRef<SVGSVGElement | null>(null);

  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const openedRef = useRef(false);
  const progressRef = useRef(0);

  const staticMode = reducedMotion || osdFailed;

  // Detect AVIF decode support once (needed to pick the .dzi URL — the
  // static <picture> fallback below negotiates format natively via
  // <source type>, no JS needed there).
  useEffect(() => {
    let cancelled = false;
    detectAvifSupport().then((supported) => {
      if (!cancelled) setAvifSupported(supported);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Push the current scroll progress into OpenSeadragon + the overlay SVG.
  // Pure imperative DOM writes via refs — never via JSX style props — so
  // this can run every scroll-driven animation frame without fighting
  // React's reconciler on the next unrelated re-render (e.g. captionTier
  // changing).
  const applyProgress = useCallback((progress: number) => {
    const viewer = viewerRef.current;
    if (!viewer || !openedRef.current) return;
    const vp = viewer.viewport;

    const containerSize = vp.getContainerSize();
    const containerAspect = containerSize.x / containerSize.y || FULL_IMAGE_WIDTH / FULL_IMAGE_HEIGHT;
    const startHeight = START_WIDTH / containerAspect;
    const startImageRect = new OpenSeadragon.Rect(
      START_CENTER.x - START_WIDTH / 2,
      START_CENTER.y - startHeight / 2,
      START_WIDTH,
      startHeight,
    );
    const endImageRect = new OpenSeadragon.Rect(0, 0, FULL_IMAGE_WIDTH, FULL_IMAGE_HEIGHT);

    const startVP = vp.imageToViewportRectangle(startImageRect);
    const endVP = vp.imageToViewportRectangle(endImageRect);

    const width = Math.exp(lerp(Math.log(startVP.width), Math.log(endVP.width), progress));
    const height = Math.exp(lerp(Math.log(startVP.height), Math.log(endVP.height), progress));
    const startCenter = startVP.getCenter();
    const endCenter = endVP.getCenter();
    const cx = lerp(startCenter.x, endCenter.x, progress);
    const cy = lerp(startCenter.y, endCenter.y, progress);
    vp.fitBounds(new OpenSeadragon.Rect(cx - width / 2, cy - height / 2, width, height), true);

    // Map the overlay's image-pixel-space contents onto wherever the full
    // frame currently sits on screen. The transform goes on an inner <g>
    // of a viewport-sized SVG — NOT on a full-image-sized SVG element —
    // because a 10803px-wide element (especially with will-change) forces
    // the compositor to rasterize a multi-hundred-MB layer, which blacks
    // out and hangs the renderer.
    const fullImageVP = vp.imageToViewportRectangle(endImageRect);
    const elementRect = vp.viewportToViewerElementRectangle(fullImageVP);
    if (overlayGroupRef.current) {
      const scale = elementRect.width / FULL_IMAGE_WIDTH;
      overlayGroupRef.current.setAttribute(
        'transform',
        `translate(${elementRect.x} ${elementRect.y}) ` +
          `scale(${scale} ${elementRect.height / FULL_IMAGE_HEIGHT})`,
      );
      applyLabelSizing(overlayGroupRef.current, scale);
    }

    const op190 = smoothstep(OVERLAY_190_START, OVERLAY_190_START + OVERLAY_FADE_SPAN, progress);
    const op239 = smoothstep(OVERLAY_239_START, OVERLAY_239_START + OVERLAY_FADE_SPAN, progress);
    const op143 = smoothstep(OVERLAY_143_START, OVERLAY_143_START + OVERLAY_FADE_SPAN, progress);
    if (box190Ref.current) box190Ref.current.style.opacity = String(op190);
    if (box239Ref.current) box239Ref.current.style.opacity = String(op239);
    if (box143Ref.current) box143Ref.current.style.opacity = String(op143);
    if (attributionRef.current) attributionRef.current.style.opacity = String(op143);
  }, []);

  // Initialize OpenSeadragon (scroll mode only — static/fallback modes
  // never touch it).
  useEffect(() => {
    if (staticMode) return undefined;
    if (avifSupported === null) return undefined; // wait for feature detection
    const container = osdContainerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    const dziUrl = avifSupported ? AVIF_DZI_URL : WEBP_DZI_URL;

    const viewer = OpenSeadragon({
      element: container,
      tileSources: dziUrl,
      showNavigationControl: false,
      mouseNavEnabled: false,
      keyboardNavEnabled: false,
      gestureSettingsMouse: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: false,
        dragToPan: false,
        pinchToZoom: false,
        flickEnabled: false,
      },
      gestureSettingsTouch: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: false,
        dragToPan: false,
        pinchToZoom: false,
        flickEnabled: false,
      },
      gestureSettingsPen: {
        scrollToZoom: false,
        clickToZoom: false,
        dblClickToZoom: false,
        dragToPan: false,
        pinchToZoom: false,
        flickEnabled: false,
      },
      // visibilityRatio must be 0: the end framing letterboxes the full
      // 1.43:1 frame inside the (wider) viewport, and any nonzero ratio
      // constrains that letterboxing away — vertically cropping the frame
      // the whole intro exists to reveal.
      visibilityRatio: 0,
      constrainDuringPan: false,
      // NOTE: never set animationTime to 0 — OpenSeadragon's spring easing
      // divides elapsed time by it, and 0 yields NaN viewport math that
      // paints the canvas black and busy-loops the render loop (hard page
      // hang). We drive every viewport change with immediately=true instead,
      // so the spring animation path is unused anyway.
      animationTime: 0.1,
      immediateRender: true,
      crossOriginPolicy: false,
    });
    viewerRef.current = viewer;
    if (import.meta.env.DEV) {
      // E2E/debug hook only — never present in production builds.
      (window as unknown as Record<string, unknown>).__liemaxViewer = viewer;
    }

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setOsdFailed(true);
    }, OPEN_TIMEOUT_MS);

    function handleOpen() {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      openedRef.current = true;
      applyProgress(progressRef.current);
      visualRef.current?.classList.add('splash-zoom-visual--ready');
    }

    function handleOpenFailed() {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      setOsdFailed(true);
    }

    viewer.addHandler('open', handleOpen);
    viewer.addHandler('open-failed', handleOpenFailed);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      viewer.removeHandler('open', handleOpen);
      viewer.removeHandler('open-failed', handleOpenFailed);
      openedRef.current = false;
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [staticMode, avifSupported, applyProgress]);

  // Scroll → progress. Single rAF-throttled passive listener; only touches
  // the DOM/OSD when progress actually moved (PROGRESS_EPSILON gate).
  useEffect(() => {
    if (staticMode) return undefined;
    let ticking = false;

    function update() {
      ticking = false;
      const progress = computeProgress(trackRef.current);
      if (Math.abs(progress - progressRef.current) < PROGRESS_EPSILON) return;
      progressRef.current = progress;
      setCaptionTier(captionTierFor(progress));
      applyProgress(progress);
    }

    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [staticMode, applyProgress]);

  // Static/fallback mode sizes labels once per layout change (no scroll
  // loop to do it per frame). The SVG scales with the frame box, so the
  // image→screen scale is just displayed width / image width.
  useEffect(() => {
    if (!staticMode) return undefined;
    const svg = staticSvgRef.current;
    if (!svg) return undefined;
    const resize = () =>
      applyLabelSizing(svg, svg.getBoundingClientRect().width / FULL_IMAGE_WIDTH);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [staticMode, thumbFailed]);

  const handleSkip = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.bottom;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const visualAriaLabel = useMemo(
    () =>
      'A single frame of 70mm IMAX film, shown zoomed in to its film grain, zooming out to ' +
      'reveal the full square-ish 1.43:1 frame with overlays comparing how much of the image ' +
      'standard 2.39:1 scope and 1.90:1 digital IMAX screens crop away.',
    [],
  );

  // -----------------------------------------------------------------
  // Static / fallback render (prefers-reduced-motion OR OpenSeadragon
  // failed to open/timed out). Single 100vh stage, no scroll track, all
  // overlays visible immediately, one static caption line.
  // -----------------------------------------------------------------
  if (staticMode) {
    return (
      <section
        ref={outerRef as React.RefObject<HTMLElement>}
        className="splash-zoom splash-zoom--static"
        aria-label="IMAX frame comparison"
      >
        <div className="splash-zoom-stage splash-zoom-stage--static">
          <button type="button" className="splash-zoom-skip" onClick={handleSkip}>
            Skip intro
          </button>

          <div
            className="splash-zoom-visual splash-zoom-visual--ready"
            role="img"
            aria-label={visualAriaLabel}
          >
            {!thumbFailed ? (
              <picture className="splash-zoom-frame">
                <source srcSet={STATIC_AVIF_URL} type="image/avif" />
                <img
                  src={STATIC_JPG_URL}
                  alt=""
                  aria-hidden="true"
                  className="splash-zoom-thumb-img"
                  onError={() => setThumbFailed(true)}
                />
                <svg
                  ref={staticSvgRef}
                  className="splash-zoom-overlay splash-zoom-overlay--static"
                  viewBox={`0 0 ${FULL_IMAGE_WIDTH} ${FULL_IMAGE_HEIGHT}`}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <RatioBoxes />
                </svg>
              </picture>
            ) : (
              <div className="splash-zoom-frame splash-zoom-frame--placeholder">
                <svg
                  ref={staticSvgRef}
                  className="splash-zoom-overlay splash-zoom-overlay--static"
                  viewBox={`0 0 ${FULL_IMAGE_WIDTH} ${FULL_IMAGE_HEIGHT}`}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <rect
                    className="splash-zoom-placeholder-outline"
                    x={LABEL_PADDING}
                    y={LABEL_PADDING}
                    width={FULL_IMAGE_WIDTH - LABEL_PADDING * 2}
                    height={FULL_IMAGE_HEIGHT - LABEL_PADDING * 2}
                  />
                  <RatioBoxes />
                </svg>
              </div>
            )}
          </div>

          <div className="splash-zoom-corner">
            <p className="splash-zoom-caption-line">{STATIC_CAPTION}</p>
            <p ref={attributionRef} className="splash-zoom-attribution">
              {ATTRIBUTION_TEXT}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // -----------------------------------------------------------------
  // Scroll-driven render.
  // -----------------------------------------------------------------
  return (
    <section
      ref={outerRef as React.RefObject<HTMLElement>}
      className="splash-zoom"
      aria-label="IMAX frame comparison"
    >
      <div ref={trackRef} className="splash-zoom-track">
        <div className="splash-zoom-stage">
          <button type="button" className="splash-zoom-skip" onClick={handleSkip}>
            Skip intro
          </button>

          <div className="splash-zoom-bg" aria-hidden="true" />

          <div ref={visualRef} className="splash-zoom-visual" role="img" aria-label={visualAriaLabel}>
            <div ref={osdContainerRef} className="splash-zoom-osd" aria-hidden="true" />
            <svg className="splash-zoom-overlay splash-zoom-overlay--scroll" aria-hidden="true">
              <g ref={overlayGroupRef}>
                <RatioBoxes box190Ref={box190Ref} box239Ref={box239Ref} box143Ref={box143Ref} />
              </g>
            </svg>
          </div>

          <div className="splash-zoom-corner">
            <p key={captionTier} className="splash-zoom-caption-line">
              {CAPTIONS[captionTier]}
            </p>
            <p ref={attributionRef} className="splash-zoom-attribution">
              {ATTRIBUTION_TEXT}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
