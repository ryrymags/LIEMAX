# LIEMAX — Design Brief, Milestone 1 (Splash + Layer 1 Verdict)

**Who this is for:** a Claude Design session. You are designing the visual
language for an already-functional website. You will NOT write application
code — deliver design tokens + per-component visual specs (and mockups where
helpful). A separate engineering session implements your output.

**Give this chat these files** (copy contents in, or attach):
1. This brief.
2. `.ai/OVERHAUL_BIBLE.md` — sections 4.1, 4.2, 6, 10 (design direction, verdict tiers, voice).
3. `.ai/COMPLIANCE.md` — hard accessibility constraints.
4. Screenshots of the current unstyled-but-working app (user: take these from the browser preview — splash, and one verdict card per tier if possible).

## What the site is

LIEMAX tells moviegoers whether their local "IMAX" is the real giant-screen
thing or a rebranded ordinary theater. Thesis: *most IMAX theaters in the US
are not the real thing, and most people have no idea.* Voice: confident,
specific, slightly wry — the friend who works in the industry; never angry,
never condescending, honest about data confidence (Bible §10).

**Target feel (Bible §4.1):** data-journalism, not SaaS. Think NYT Upshot /
The Pudding / Bloomberg Graphics. Dark background — near-black with a WARM
tint (not cold blue-black). Large display serif or high-contrast sans for the
headline. Stats as large, slightly glowing data callouts — amber/gold accent.

## Components to design (all functionally built, real content shown)

1. **Nav bar** — `LIEMAX [wordmark] · Compare · IMAX 101 · Deep Dive`.
   Visually recessive on the splash; more present on interior pages.
2. **Splash** — headline `You're probably not getting real IMAX.` +
   three-stat strip (real values: `400 IMAX locations in the US`,
   `376 (94%) are not full-height 1.43 digital`, `Only 14 show the full
   image at every digital showtime`) + small archival-data disclosure
   footnote + purpose line `Search your theater. Find out what you're
   actually paying for.` + the search field (placeholder: `Search your
   theater or city…`). Nothing else on the splash.
3. **Theater search combobox** — input + dropdown of results (name,
   city/state, small "2021 archival listing" note on some rows). Design
   states: idle, focused, open-with-results, no-results (message + "Show me
   a random example" button), keyboard-highlighted option.
4. **Verdict badge** — four tiers, each needs a color + text treatment
   (COLOR IS NEVER THE ONLY SIGNAL — text label always visible):
   - 🟢 `TRUE IMAX` — "This is the real thing."
   - 🟡 `IMAX LITE` — "Better than a regular theater, but not the full experience."
   - 🔴 `LIEMAX` — "You're paying IMAX prices for a glorified regular screen."
   - ⚪ `DOME` — "A unique experience — not a standard IMAX room."
   TRUE IMAX has three sub-state taglines (unconditional / film-showtimes-only
   / both) — same badge, different supporting line.
5. **Layer 1 verdict card** — badge + tagline, a zero-jargon summary
   paragraph (2–4 sentences, real example: *"The screen at Sunbrella IMAX 3D
   Theater Reading is about as wide as a basketball court and seven stories
   tall — every showing here uses the full picture."*), the scale diagram,
   an optional "What you're missing" callout box (LIEMAX/Lite only — names
   the nearest real IMAX), and a two-path CTA: primary button `Why does this
   happen? Read IMAX 101 ↓` + quiet text link `Already know the basics?
   Jump to the full specs →`.
6. **Human-vs-screen scale diagram** — SVG line art: person silhouette next
   to two screen outlines to relative scale ("Your screen" vs "True IMAX").
   Dome variant: circular cross-section. This is the most persuasive visual
   on the page — design it to carry that weight.
7. **Archival caveat line** — small trust-preserving note on stale-data
   venues: "Based on a 2021 archival listing — this theater may have closed
   or upgraded."

## Deliverable format (what engineering needs back)

1. **Design tokens** as a CSS custom-property list (this exact shape —
   values are yours to choose):
   `--color-bg, --color-surface, --color-text, --color-muted,
   --color-accent, --tier-true, --tier-lite, --tier-liemax, --tier-dome,
   --font-display, --font-body, --font-mono, --text-xs…--text-3xl,
   --space-1…--space-6, --radius`
   Fonts must be self-hostable (Google Fonts OK — we bundle them; no
   paid/proprietary faces).
2. **Per-component specs**: for each component above — layout, spacing,
   type treatment, color usage, border/shadow/glow treatment, hover +
   focus-visible states, and mobile behavior (375 px). HTML/CSS mockups
   welcome; they'll be translated, not pasted.
3. **One overall mood/hero mockup** of the splash so the whole direction is
   judged at once.

## Hard constraints (from .ai/COMPLIANCE.md — not negotiable)

- WCAG 2.1 AA: all text ≥ 4.5:1 contrast against its background, including
  the amber-on-dark stats and every tier badge.
- Verdict tiers never conveyed by color alone (design the text lockup).
- Every interactive element needs a designed `:focus-visible` state — no
  invisible focus.
- Touch targets ≥ 44×44 px on mobile.
- Any glow/animation must have a reduced-motion-safe equivalent.
- No external CDN assets; everything self-hosted.
