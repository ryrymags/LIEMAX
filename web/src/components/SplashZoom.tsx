// Scroll-driven cinematic intro. Renders above <Splash/> inside <main>.
// A single high-res still (plus a higher-detail "eye" crop stacked on top of
// it) is zoomed via a CSS transform on one element — no tile pyramid, no
// image-loading viewer library. Zooms out from film grain to the full
// 1.43:1 IMAX frame, then reveals animated black letterboxing that closes
// down from 2.39:1 scope -> 1.90:1 digital IMAX -> the full 1.43:1 frame —
// the visual argument the rest of the site makes in numbers.
//
// Imagery (web/public/assets/splash/*) is committed under the fair-use
// posture documented in THIRD_PARTY_NOTICES.md and the folder README. The
// component must still degrade gracefully if it is absent: a failed
// full-frame image load falls back to a static still; a failed static still
// falls back to a plain outlined placeholder. See the fallback branch below.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import contentFormatsData from '@data/content_formats/content_formats.json';

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

// Full source frame dimensions (10803 x 7555, ~1.43:1).
const FULL_IMAGE_WIDTH = 10803;
const FULL_IMAGE_HEIGHT = 7555;
const FULL_CENTER = { x: FULL_IMAGE_WIDTH / 2, y: FULL_IMAGE_HEIGHT / 2 };

// Zoomed-in starting frame (progress 0): a 2600-image-px-wide rect centered
// on the eye detail, filling the stage edge-to-edge — tight enough that
// film grain is unmistakable.
const START_CENTER = { x: 5500, y: 2800 };
const START_WIDTH = 2600;

const PROGRESS_EPSILON = 0.0005;

// Phase boundaries (progress 0..1) driving the whole animation. See
// applyProgress for what happens in each span.
const PHASE_ZOOM_END = 0.4; // zoom-out (eye grain -> full frame) completes
const PHASE_SCOPE_END = 0.52; // bars fade in + hold at the 2.39:1 crop
const PHASE_DIGITAL_END = 0.68; // bars ease to the 1.90:1 crop
const PHASE_IMAX_END = 0.86; // bars ease to 0 -> full 1.43:1 frame revealed
const PHASE_END_OVERLAY_SPAN = 0.1; // 0.86 -> 0.96: reference lines fade in

const CAPTION_TIER_1_AT = 0.3;
const CAPTION_TIER_2_AT = 0.55;

const CAPTIONS = [
  'This is a single frame of 15/70 IMAX film.',
  "Scanned at 8K. You're looking at real film grain.",
  "Most 'IMAX' screens crop it. Here's how much.",
] as const;

const STATIC_CAPTION =
  "A single frame of 15/70 IMAX film, scanned at 8K — and how much of it standard formats crop away.";

const ATTRIBUTION_TEXT =
  'Frame: Oppenheimer (2023) 70mm IMAX scan — shown for format comparison.';

// Full-frame still, stacked under the eye-detail crop inside the zoomer.
const FULL_AVIF_1600 = '/assets/splash/liemax-frame-full-1600.avif';
const FULL_AVIF_2400 = '/assets/splash/liemax-frame-full-2400.avif';
const FULL_AVIF_3600 = '/assets/splash/liemax-frame-full-3600.avif';
const FULL_JPG_2400 = '/assets/splash/liemax-frame-full-2400.jpg';

// Higher-resolution crop of just the eye region (source rect x=3300 y=1250
// w=4400 h=3300 of the full frame) — overlays its region of the full frame
// with sharper pixels so the zoomed-in start is crisp. Both images move
// under the SAME transform (see .splash-zoom-zoomer), so there is never a
// visible handoff between them.
const EYE_AVIF_1600 = '/assets/splash/liemax-eye-1600.avif';
const EYE_AVIF_2400 = '/assets/splash/liemax-eye-2400.avif';
const EYE_AVIF_3400 = '/assets/splash/liemax-eye-3400.avif';
const EYE_JPG_2400 = '/assets/splash/liemax-eye-2400.jpg';

// 1600px-wide render for the static/reduced-motion mode — the 400px blur
// thumbnail (used only as a CSS background, see components.css) is too
// soft to serve as a full-screen still.
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
// against the source still's actual pixel dimensions).
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

function barHeightFor(ar: number, boxWidth: number, boxHeight: number): number {
  return Math.max(0, (boxHeight - boxWidth / ar) / 2);
}

// ---------------------------------------------------------------------
// Active label (HTML, not SVG) shown just below the top bar's inner edge —
// swaps text/color per crop phase. Tone names match the ratio-box tones
// below so the two systems (animated bars vs. end-state reference lines)
// read as the same color language.
// ---------------------------------------------------------------------

type LabelTone = 'scope239' | 'digital190' | 'full143';

interface ActiveLabelState {
  text: string;
  tone: LabelTone;
}

const ACTIVE_LABEL_TEXT: Record<LabelTone, string> = {
  scope239: 'Standard Scope — 2.39:1',
  digital190: 'IMAX Digital — 1.90:1',
  full143: 'True IMAX — 1.43:1',
};

function activeLabelFor(progress: number): ActiveLabelState | null {
  if (progress < PHASE_ZOOM_END) return null;
  if (progress < PHASE_SCOPE_END) return { text: ACTIVE_LABEL_TEXT.scope239, tone: 'scope239' };
  if (progress < PHASE_DIGITAL_END) return { text: ACTIVE_LABEL_TEXT.digital190, tone: 'digital190' };
  if (progress < PHASE_IMAX_END) return { text: ACTIVE_LABEL_TEXT.full143, tone: 'full143' };
  return null;
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

interface Layout {
  stageW: number;
  stageH: number;
  bw: number;
  bh: number;
}

export default function SplashZoom() {
  const reducedMotion = usePrefersReducedMotion();
  const [frameFailed, setFrameFailed] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [visualReady, setVisualReady] = useState(false);
  const [captionTier, setCaptionTier] = useState<0 | 1 | 2>(0);
  const [activeLabel, setActiveLabel] = useState<ActiveLabelState | null>(null);

  const outerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);
  const zoomerRef = useRef<HTMLDivElement | null>(null);
  const barTopRef = useRef<HTMLDivElement | null>(null);
  const barBottomRef = useRef<HTMLDivElement | null>(null);
  const activeLabelRef = useRef<HTMLDivElement | null>(null);
  const overlaySvgRef = useRef<SVGSVGElement | null>(null);
  const box190Ref = useRef<SVGGElement | null>(null);
  const box239Ref = useRef<SVGGElement | null>(null);
  const box143Ref = useRef<SVGGElement | null>(null);
  const attributionRef = useRef<HTMLParagraphElement | null>(null);
  const staticSvgRef = useRef<SVGSVGElement | null>(null);

  const progressRef = useRef(0);
  const layoutRef = useRef<Layout>({ stageW: 0, stageH: 0, bw: 0, bh: 0 });
  const scaleRef = useRef(1);
  const barPxRef = useRef(0);
  const activeLabelTextRef = useRef<string | null>(null);

  const staticMode = reducedMotion || frameFailed;

  // Push the current scroll progress into the zoomer transform, the
  // letterbox bars, and the end-state overlay. Pure imperative DOM writes
  // via refs — never via JSX style props — so this can run every
  // scroll-driven animation frame without fighting React's reconciler on
  // the next unrelated re-render (e.g. captionTier changing). Layout
  // metrics (stage/frame-box size) are read from layoutRef, refreshed only
  // on resize — never re-measured here — to keep this cheap during active
  // scrolling.
  const applyProgress = useCallback((progress: number) => {
    const { stageW, stageH, bw, bh } = layoutRef.current;
    if (bw <= 0 || bh <= 0 || stageW <= 0 || stageH <= 0) return;

    // --- Zoom-out transform (0 -> PHASE_ZOOM_END): eye grain filling the
    // stage -> full frame filling the frame box. Log-space on scale,
    // linear on the image-space center point; the transform keeps that
    // center point pinned at the frame box's (== stage's, since the frame
    // box is centered in the stage) center for every t. ---
    const t = clamp(progress / PHASE_ZOOM_END, 0, 1);
    const s0 = stageW / (START_WIDTH * (bw / FULL_IMAGE_WIDTH));
    const scale = Math.exp(lerp(Math.log(s0), Math.log(1), t));
    const cx = lerp(START_CENTER.x, FULL_CENTER.x, t);
    const cy = lerp(START_CENTER.y, FULL_CENTER.y, t);
    const localX = cx * (bw / FULL_IMAGE_WIDTH);
    const localY = cy * (bh / FULL_IMAGE_HEIGHT);
    const tx = bw / 2 - scale * localX;
    const ty = bh / 2 - scale * localY;
    scaleRef.current = scale;
    if (zoomerRef.current) {
      zoomerRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    // --- Letterbox bars (PHASE_ZOOM_END -> PHASE_IMAX_END): fade in
    // shaped for the 2.39:1 scope crop, ease to the 1.90:1 digital IMAX
    // crop, then ease to 0 (the full 1.43:1 frame). ---
    const h239 = barHeightFor(AR_239, bw, bh);
    const h190 = barHeightFor(AR_190, bw, bh);
    let barHeightPx: number;
    if (progress < PHASE_SCOPE_END) {
      barHeightPx = h239;
    } else if (progress < PHASE_DIGITAL_END) {
      barHeightPx = lerp(h239, h190, smoothstep(PHASE_SCOPE_END, PHASE_DIGITAL_END, progress));
    } else if (progress < PHASE_IMAX_END) {
      barHeightPx = lerp(h190, 0, smoothstep(PHASE_DIGITAL_END, PHASE_IMAX_END, progress));
    } else {
      barHeightPx = 0;
    }
    // Bars must be SOLID black well before the scope hold ends — fading
    // across the whole hold would mean the "scope moment" never actually
    // shows black letterboxing. Complete the fade in the first ~third.
    const barOpacity = smoothstep(PHASE_ZOOM_END, PHASE_ZOOM_END + 0.04, progress);
    barPxRef.current = barHeightPx;
    if (barTopRef.current) {
      barTopRef.current.style.height = `${barHeightPx}px`;
      barTopRef.current.style.opacity = String(barOpacity);
    }
    if (barBottomRef.current) {
      barBottomRef.current.style.height = `${barHeightPx}px`;
      barBottomRef.current.style.opacity = String(barOpacity);
    }

    // The blurred-thumb backdrop exists for first paint and the zoom-out;
    // once the frame settles, dissolve it so the pillarboxing around the
    // frame box is true black (artificial pillarboxing, not blur).
    if (bgRef.current) {
      bgRef.current.style.opacity = String(1 - smoothstep(PHASE_ZOOM_END - 0.05, PHASE_ZOOM_END, progress));
    }

    // Active label tracks the top bar's inner edge.
    if (activeLabelRef.current) {
      activeLabelRef.current.style.top = `${barHeightPx + 8}px`;
    }

    // --- End-state reference overlay (thin outline + the three labeled
    // reference lines) + attribution: fade in together over the final
    // stretch once the bars have fully opened. ---
    const endOverlayOpacity = smoothstep(
      PHASE_IMAX_END,
      PHASE_IMAX_END + PHASE_END_OVERLAY_SPAN,
      progress,
    );
    if (box190Ref.current) box190Ref.current.style.opacity = String(endOverlayOpacity);
    if (box239Ref.current) box239Ref.current.style.opacity = String(endOverlayOpacity);
    if (box143Ref.current) box143Ref.current.style.opacity = String(endOverlayOpacity);
    if (attributionRef.current) attributionRef.current.style.opacity = String(endOverlayOpacity);
  }, []);

  // Layout metrics: measured on mount + whenever the stage resizes. The
  // frame box's contain-fit size is COMPUTED here and written as explicit
  // pixels. CSS alone (width:100% + aspect-ratio + max-height:100%) cannot
  // express contain-fit: when the max-height clamp engages (landscape
  // viewports), aspect-ratio silently loses and the box stops being 1.43:1
  // — which vertically crops the very frame the intro exists to reveal.
  useEffect(() => {
    if (staticMode) return undefined;
    const stage = stageRef.current;
    const frameBox = frameBoxRef.current;
    if (!stage || !frameBox) return undefined;
    const ar = FULL_IMAGE_WIDTH / FULL_IMAGE_HEIGHT;

    function measure() {
      if (!stage || !frameBox) return;
      const stageRect = stage.getBoundingClientRect();
      const bw = Math.min(stageRect.width, stageRect.height * ar);
      const bh = bw / ar;
      frameBox.style.width = `${bw}px`;
      frameBox.style.height = `${bh}px`;
      layoutRef.current = {
        stageW: stageRect.width,
        stageH: stageRect.height,
        bw,
        bh,
      };
      applyProgress(progressRef.current);
      if (overlaySvgRef.current && bw > 0) {
        applyLabelSizing(overlaySvgRef.current, bw / FULL_IMAGE_WIDTH);
      }
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [staticMode, applyProgress]);

  // Scroll → progress. Single rAF-throttled passive listener; only touches
  // the DOM when progress actually moved (PROGRESS_EPSILON gate). Caption
  // tier and active-label tone are plain React state, but only re-render
  // when the bucket actually changes (not every scroll pixel) — the
  // continuous per-frame values (transform, bar height/opacity, label
  // position) are written imperatively via applyProgress above.
  useEffect(() => {
    if (staticMode) return undefined;
    let ticking = false;

    function update() {
      ticking = false;
      const progress = computeProgress(trackRef.current);
      if (Math.abs(progress - progressRef.current) < PROGRESS_EPSILON) return;
      progressRef.current = progress;
      setCaptionTier(captionTierFor(progress));
      const label = activeLabelFor(progress);
      activeLabelTextRef.current = label?.text ?? null;
      setActiveLabel((prev) => (prev?.tone === label?.tone ? prev : label));
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

  // DEV-only test hook so a Playwright script can assert the animation
  // state without reaching into React internals.
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    (window as unknown as Record<string, unknown>).__liemaxSplash = {
      getState: () => ({
        progress: progressRef.current,
        scale: scaleRef.current,
        barPx: barPxRef.current,
        activeLabel: activeLabelTextRef.current,
      }),
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__liemaxSplash;
    };
  }, []);

  const handleSkip = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.bottom;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const handleFullFrameLoad = useCallback(() => setVisualReady(true), []);
  const handleFullFrameError = useCallback(() => setFrameFailed(true), []);

  const visualAriaLabel = useMemo(
    () =>
      'A single frame of 70mm IMAX film, shown zoomed in to its film grain, zooming out to ' +
      'reveal the full square-ish 1.43:1 frame, with animated black bars demonstrating how ' +
      'much of the image standard 2.39:1 scope and 1.90:1 digital IMAX screens crop away.',
    [],
  );

  // -----------------------------------------------------------------
  // Static / fallback render (prefers-reduced-motion OR the full-frame
  // image failed to load). Single 100vh stage, no scroll track, all
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
        <div ref={stageRef} className="splash-zoom-stage">
          <button type="button" className="splash-zoom-skip" onClick={handleSkip}>
            Skip intro
          </button>

          <div ref={bgRef} className="splash-zoom-bg" aria-hidden="true" />

          <div
            className={`splash-zoom-visual${visualReady ? ' splash-zoom-visual--ready' : ''}`}
            role="img"
            aria-label={visualAriaLabel}
          >
            <div ref={frameBoxRef} className="splash-zoom-frame-box">
              <div ref={zoomerRef} className="splash-zoom-zoomer">
                <picture className="splash-zoom-full">
                  <source
                    type="image/avif"
                    srcSet={`${FULL_AVIF_1600} 1600w, ${FULL_AVIF_2400} 2400w, ${FULL_AVIF_3600} 3600w`}
                    sizes="100vw"
                  />
                  <img
                    src={FULL_JPG_2400}
                    alt=""
                    aria-hidden="true"
                    className="splash-zoom-full-img"
                    loading="eager"
                    decoding="async"
                    onLoad={handleFullFrameLoad}
                    onError={handleFullFrameError}
                  />
                </picture>
                <picture className="splash-zoom-eye">
                  <source
                    type="image/avif"
                    srcSet={`${EYE_AVIF_1600} 1600w, ${EYE_AVIF_2400} 2400w, ${EYE_AVIF_3400} 3400w`}
                    sizes="41vw"
                  />
                  <img
                    src={EYE_JPG_2400}
                    alt=""
                    aria-hidden="true"
                    className="splash-zoom-eye-img"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>

              <div ref={barTopRef} className="splash-zoom-bar splash-zoom-bar--top" aria-hidden="true" />
              <div
                ref={barBottomRef}
                className="splash-zoom-bar splash-zoom-bar--bottom"
                aria-hidden="true"
              />

              <svg
                ref={overlaySvgRef}
                className="splash-zoom-overlay splash-zoom-overlay--scroll"
                viewBox={`0 0 ${FULL_IMAGE_WIDTH} ${FULL_IMAGE_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <RatioBoxes box190Ref={box190Ref} box239Ref={box239Ref} box143Ref={box143Ref} />
              </svg>

              <div
                ref={activeLabelRef}
                className={
                  'splash-zoom-active-label' +
                  (activeLabel ? ` splash-zoom-active-label--visible splash-zoom-active-label--${activeLabel.tone}` : '')
                }
                aria-hidden="true"
              >
                {activeLabel?.text}
              </div>
            </div>
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
