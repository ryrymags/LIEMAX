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
// Original TIFF: 10803x7951. Clean frame: x=0, y=198,
// width=10803, height=7555. This is the nearest integer crop to 1.43:1;
// presentation geometry below uses the canonical data ratio.
const FULL_CENTER = { x: FULL_IMAGE_WIDTH / 2, y: FULL_IMAGE_HEIGHT / 2 };

// Zoomed-in starting frame (progress 0): a rect centered on the midpoint
// between both eyes in the eye-detail crop, filling the stage edge-to-edge —
// tight enough that film grain is unmistakable, wide enough that neither eye
// falls outside the visible slice. (The eye-detail crop's source rect is
// x=3300 y=1250 w=4400 h=3300 of the full frame; the subject's near eye sits
// around x=5840 and the far, shadowed eye around x=3760 within that crop —
// midpoint ~4800, eye line ~y=2700.)
const START_CENTER = { x: 4800, y: 2700 };
// Wide enough to hold both eyes while the narrow aperture crops vertically.
// Detail remains sourced from the dedicated 4400px TIFF derivative.
const START_WIDTH = 4600;

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
const EYE_AVIF_4400 = '/assets/splash/liemax-eye-4400.avif';
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

// Approved 900svh checkpoint timeline. Holds are deliberately longer than
// the smootherstep transitions; scroll remains entirely native.
const PHASE_OPENING_END = 0.12;
const PHASE_SCOPE_TRANSITION_END = 0.24;
const PHASE_SCOPE_HOLD_END = 0.38;
const PHASE_DIGITAL_TRANSITION_END = 0.5;
const PHASE_DIGITAL_HOLD_END = 0.64;
const PHASE_IMAX_TRANSITION_END = 0.76;
const PHASE_IMAX_HOLD_END = 0.9;
const PHASE_COMPARISON_END = 1;
const CHECKPOINT_ANCHORS = {
  opening: 0.04,
  scope: 0.27,
  digital: 0.53,
  imax: 0.79,
  comparison: 0.93,
} as const;
const PROGRESS_EPSILON = 0.0005;

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

function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t ** 3 * (t * (t * 6 - 15) + 10);
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
  if (progress < PHASE_SCOPE_TRANSITION_END) return null;
  if (progress < PHASE_DIGITAL_TRANSITION_END) return { text: ACTIVE_LABEL_TEXT.scope239, tone: 'scope239' };
  if (progress < PHASE_IMAX_TRANSITION_END) return { text: ACTIVE_LABEL_TEXT.digital190, tone: 'digital190' };
  if (progress < PHASE_IMAX_HOLD_END) return { text: ACTIVE_LABEL_TEXT.full143, tone: 'full143' };
  return null;
}

type Checkpoint = 'opening' | 'scope' | 'digital' | 'imax' | 'comparison';

function checkpointFor(progress: number): Checkpoint {
  if (progress < PHASE_SCOPE_TRANSITION_END) return 'opening';
  if (progress < PHASE_DIGITAL_TRANSITION_END) return 'scope';
  if (progress < PHASE_IMAX_TRANSITION_END) return 'digital';
  if (progress < PHASE_IMAX_HOLD_END) return 'imax';
  return 'comparison';
}

const CHECKPOINT_COPY: Record<
  Checkpoint,
  { eyebrow: string; title: string; body: string; next?: { label: string; anchor: number; announcement: string } }
> = {
  opening: {
    eyebrow: 'One IMAX film frame',
    title: 'The picture is taller than the screen you probably saw it on.',
    body: 'This close, you can see the grain. Scroll to experience the full IMAX frame, or go straight to your theater.',
  },
  scope: {
    eyebrow: 'Standard Scope · 2.39:1',
    title: 'The widest common movie shape is also the shortest.',
    body: 'At the same width, Scope shows the least of this frame.',
    next: { label: 'Open to digital IMAX', anchor: CHECKPOINT_ANCHORS.digital, announcement: 'Moving to the digital IMAX checkpoint.' },
  },
  digital: {
    eyebrow: 'Digital IMAX · 1.90:1',
    title: 'That is 25.8% more image area than Scope.',
    body: 'It is a real step up — but the frame is still capped before its full height.',
    next: { label: 'Show the full IMAX frame', anchor: CHECKPOINT_ANCHORS.imax, announcement: 'Moving to the full-height IMAX checkpoint.' },
  },
  imax: {
    eyebrow: 'True IMAX · 1.43:1',
    title: 'Another 32.9% opens up from digital IMAX.',
    body: 'That makes 67.1% more same-width image area than Scope: the frame the film was made to fill.',
    next: { label: 'Compare every frame', anchor: CHECKPOINT_ANCHORS.comparison, announcement: 'Moving to the full frame comparison.' },
  },
  comparison: {
    eyebrow: 'Same width. Different picture.',
    title: 'The border lines make the missing height impossible to miss.',
    body: 'Now find out which frame your local IMAX can actually show.',
  },
};

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
  const [imageFailed, setImageFailed] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [eyeLoaded, setEyeLoaded] = useState(false);
  const [checkpoint, setCheckpoint] = useState<Checkpoint>('opening');
  const [announcement, setAnnouncement] = useState('');
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

  const staticMode = reducedMotion || imageFailed;
  const visualReady = frameLoaded && eyeLoaded;

  // Push the current scroll progress into the zoomer transform, the
  // letterbox bars, and the end-state overlay. Pure imperative DOM writes
  // via refs — never via JSX style props — so this can run every
  // scroll-driven animation frame without fighting React's reconciler on
  // the next unrelated re-render (e.g. checkpoint copy changing). Layout
  // metrics (stage/frame-box size) are read from layoutRef, refreshed only
  // on resize — never re-measured here — to keep this cheap during active
  // scrolling.
  const applyProgress = useCallback((progress: number) => {
    const { stageW, stageH, bw, bh } = layoutRef.current;
    if (bw <= 0 || bh <= 0 || stageW <= 0 || stageH <= 0) return;

    // --- Zoom-out transform (opening -> Scope): eye grain filling the
    // stage -> full frame filling the frame box. Log-space on scale,
    // linear on the image-space center point; the transform keeps that
    // center point pinned at the frame box's (== stage's, since the frame
    // box is centered in the stage) center for every t. ---
    const t = smootherstep(PHASE_OPENING_END, PHASE_SCOPE_TRANSITION_END, progress);
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

    // --- Letterbox bars: solid from the first painted opening eye slice,
    // then interpolate through the approved Scope → 1.90 → 1.43 sequence.
    // The opening aperture is intentionally narrower than Scope, but clamped
    // to retain readable vertical space on short screens. ---
    const h239 = barHeightFor(AR_239, bw, bh);
    const h190 = barHeightFor(AR_190, bw, bh);
    // The opening is intentionally a slice, not another conventional ratio.
    // Clamp the aperture itself so desktop stays dramatic while a short/mobile
    // viewport still shows both eyes and leaves room for the HTML copy.
    const openingAperture = clamp(bh * 0.24, 96, 180);
    const openingBarHeight = Math.max(0, (bh - openingAperture) / 2);
    let barHeightPx: number;
    if (progress < PHASE_OPENING_END) {
      barHeightPx = openingBarHeight;
    } else if (progress < PHASE_SCOPE_TRANSITION_END) {
      barHeightPx = lerp(
        openingBarHeight,
        h239,
        smootherstep(PHASE_OPENING_END, PHASE_SCOPE_TRANSITION_END, progress),
      );
    } else if (progress < PHASE_SCOPE_HOLD_END) {
      barHeightPx = h239;
    } else if (progress < PHASE_DIGITAL_TRANSITION_END) {
      barHeightPx = lerp(
        h239,
        h190,
        smootherstep(PHASE_SCOPE_HOLD_END, PHASE_DIGITAL_TRANSITION_END, progress),
      );
    } else if (progress < PHASE_DIGITAL_HOLD_END) {
      barHeightPx = h190;
    } else if (progress < PHASE_IMAX_TRANSITION_END) {
      barHeightPx = lerp(
        h190,
        0,
        smootherstep(PHASE_DIGITAL_HOLD_END, PHASE_IMAX_TRANSITION_END, progress),
      );
    } else {
      barHeightPx = 0;
    }
    barPxRef.current = barHeightPx;
    if (barTopRef.current) {
      barTopRef.current.style.height = `${barHeightPx}px`;
      barTopRef.current.style.opacity = '1';
    }
    if (barBottomRef.current) {
      barBottomRef.current.style.height = `${barHeightPx}px`;
      barBottomRef.current.style.opacity = '1';
    }

    // The stage itself is true black. The placeholder remains hidden so
    // pillarboxing never reads as a blurred extension of the frame.
    if (bgRef.current) bgRef.current.style.opacity = '0';

    // Active label tracks the top bar's inner edge.
    if (activeLabelRef.current) {
      activeLabelRef.current.style.top = `${barHeightPx + 8}px`;
    }

    // --- End-state reference overlay (thin outline + the three labeled
    // reference lines) + attribution: fade in together over the final
    // stretch once the bars have fully opened. ---
    const endOverlayOpacity = smootherstep(
      PHASE_IMAX_HOLD_END,
      PHASE_COMPARISON_END,
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
      const nextCheckpoint = checkpointFor(progress);
      setCheckpoint((previous) => (previous === nextCheckpoint ? previous : nextCheckpoint));
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

  const scrollBehavior = useCallback(
    () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'),
    [],
  );

  const jumpToProgress = useCallback((anchor: number, message: string) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const target = window.scrollY + rect.top + anchor * (rect.height - window.innerHeight);
    setAnnouncement(message);
    window.scrollTo({ top: target, behavior: scrollBehavior() });
  }, [scrollBehavior]);

  const jumpToDiagnosis = useCallback(() => {
    const target = document.getElementById('diagnose-my-imax');
    if (!target) return;
    setAnnouncement('Moving to theater diagnosis.');
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }, [scrollBehavior]);

  const handleSkip = useCallback(() => {
    const target = document.getElementById('diagnose-my-imax');
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, []);

  const handleFullFrameLoad = useCallback(() => setFrameLoaded(true), []);
  const handleFullFrameError = useCallback(() => setImageFailed(true), []);
  const handleEyeLoad = useCallback(() => setEyeLoaded(true), []);
  const handleEyeError = useCallback(() => setImageFailed(true), []);

  const visualAriaLabel = useMemo(
    () =>
      'A single frame of 70mm IMAX film, shown zoomed in to its film grain, zooming out to ' +
      'reveal the full square-ish 1.43:1 frame, with animated black bars demonstrating how ' +
      'much of the image standard 2.39:1 scope and 1.90:1 digital IMAX screens crop away.',
    [],
  );
  const checkpointCopy = CHECKPOINT_COPY[checkpoint];

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
            Diagnose my IMAX
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
            {/* Reduced-motion/fallback branch has no scroll-driven checkpoint
                h1 (see the h1 below in the scroll-driven render) — this is
                the page's only top-level heading in that case, so it must
                be an h1 to keep the heading hierarchy unbroken (h1 -> h2 on
                <Splash/>'s headline). See .ai/COMPLIANCE.md. */}
            <h1 className="splash-zoom-caption-line">{STATIC_CAPTION}</h1>
            <p className="splash-zoom-static-copy">
              At the same width, 1.90:1 reveals 25.8% more image area than 2.39:1 Scope. Full-height
              1.43:1 reveals another 32.9% — 67.1% more than Scope.
            </p>
            <p ref={attributionRef} className="splash-zoom-attribution">
              {ATTRIBUTION_TEXT}
            </p>
            <button type="button" className="splash-zoom-cta" onClick={jumpToDiagnosis}>
              Diagnose my IMAX
            </button>
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
                    srcSet={`${EYE_AVIF_1600} 1600w, ${EYE_AVIF_2400} 2400w, ${EYE_AVIF_3400} 3400w, ${EYE_AVIF_4400} 4400w`}
                    sizes="175vw"
                  />
                  <img
                    src={EYE_JPG_2400}
                    alt=""
                    aria-hidden="true"
                    className="splash-zoom-eye-img"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    onLoad={handleEyeLoad}
                    onError={handleEyeError}
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

          <section className={`splash-zoom-checkpoint splash-zoom-checkpoint--${checkpoint}`} aria-labelledby="splash-zoom-title">
            <p className="splash-zoom-eyebrow">{checkpointCopy.eyebrow}</p>
            <h1 id="splash-zoom-title" className="splash-zoom-title">
              {checkpointCopy.title}
            </h1>
            <p className="splash-zoom-copy">{checkpointCopy.body}</p>
            <div className="splash-zoom-actions">
              {checkpoint === 'opening' ? (
                <>
                  <button
                    type="button"
                    className="splash-zoom-cta"
                    onClick={() => jumpToProgress(CHECKPOINT_ANCHORS.scope, 'Moving to the Scope checkpoint.')}
                  >
                    Show me the full frame
                  </button>
                  <button type="button" className="splash-zoom-text-cta" onClick={jumpToDiagnosis}>
                    Diagnose my IMAX
                  </button>
                </>
              ) : checkpointCopy.next ? (
                <button
                  type="button"
                  className="splash-zoom-cta"
                  onClick={() => jumpToProgress(checkpointCopy.next!.anchor, checkpointCopy.next!.announcement)}
                >
                  {checkpointCopy.next.label}
                </button>
              ) : (
                <button type="button" className="splash-zoom-cta" onClick={jumpToDiagnosis}>
                  Diagnose my IMAX
                </button>
              )}
            </div>
            <p className="splash-zoom-attribution">{ATTRIBUTION_TEXT}</p>
          </section>
          <p className="splash-zoom-status" role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
          </div>
        </div>
    </section>
  );
}
