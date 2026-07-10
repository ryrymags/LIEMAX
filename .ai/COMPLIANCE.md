# Compliance Reference (Accessibility + Security)

Standing rule (see AGENTS.md): all frontend and infrastructure work from 2026-07-10
onward must be built ADA/WCAG 2.1 AA accessible and security-hardened from the start,
not retrofitted. This file holds the concrete checklists from the July 2026 audit.

## Accessibility requirements (apply to Overhaul V2 and all future UI)

- Visible focus indicators on every interactive element — never `outline: none`
  without a replacement `:focus-visible` style.
- Theater search / pickers: full ARIA combobox pattern (`role="combobox"`,
  `aria-expanded`, `aria-owns`, `role="listbox"`/`option`, arrow/Enter/Escape
  keyboard nav, focus management on open/close).
- Tooltips (WCAG 1.4.13): dismissable via Escape, hoverable (`pointer-events: auto`
  on the tooltip), and keyboard-reachable.
- Dialogs/overlays (e.g. fullscreen split view): focus trap, Escape closes,
  focus returns to the opening control on close.
- Canvas/SVG visualizations must carry a data-bearing text alternative
  (e.g. "Screen A is 2.3× larger than Screen B"), not just a generic label.
- Verdict tiers (green/yellow/red/white) must never convey meaning by color
  alone — always pair with a text label; contrast >= 4.5:1 on both themes.
- Video: check `prefers-reduced-motion` before autoplay; provide manual play.
- Semantic landmarks (`main`, `header`, `nav`, `section`) and unbroken heading
  hierarchy; skip-to-content link; labels on all form controls; 44x44px minimum
  touch targets.

## Security/deployment requirements (Netlify static hosting)

- `netlify.toml` with `publish = "docs"` (or V2 build output) and headers:
  Content-Security-Policy (self + allow-listed CDNs only; drop `'unsafe-inline'`
  once JSX is precompiled), `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: geolocation=(), camera=(), microphone=()`,
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
- Every CDN `<script>` pinned with an SRI `integrity` hash (Three.js currently
  lacks one) — or self-host vendored copies.
- No secrets/tokens/PII in repo, fixtures, or workflows (verified clean 2026-07).
  Scrapers (e.g. Dolby count checker) keep sessions in-memory only.
- Any user input reaching the DOM goes through React escaping or explicit
  `escapeHtml`; no new `dangerouslySetInnerHTML` with interpolated data.
- No third-party trackers or silent geolocation (existing project privacy rule).

## Legal hygiene

- Only commit media with provenance/licensing documented alongside the file.
- Non-affiliation disclaimer must cover ALL referenced brands (IMAX, Dolby,
  Regal/RPX, Cinemark, ScreenX), not just IMAX.
- Data sources (143190.xyz/r-imax is CC BY-SA 4.0 — its ShareAlike terms are
  satisfied by our CC BY-SA 4.0 data licensing; LFExaminer archival; Dolby
  endpoint snapshot) keep documented redistribution posture per
  `THIRD_PARTY_NOTICES.md`; retain r-imax attribution.
- Headline statistics must disclose current-vs-archival data mix (see audit
  Phase 2) — accuracy of published claims is the site's main legal exposure.
