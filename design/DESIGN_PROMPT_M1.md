# Paste-ready prompt for the Claude Design chat (Milestone 1)

Copy everything below the line into a fresh Claude Design session, attaching:
`DESIGN_BRIEF_M1.md`, `OVERHAUL_BIBLE.md`, `COMPLIANCE.md`, and 2–3 screenshots
of the current unstyled app (splash + a verdict card or two).

---

You are the art director for **LIEMAX**, a data-journalism website that tells
moviegoers whether their local "IMAX" is the real giant-screen thing or a
rebranded ordinary theater. The site is already fully built and working — real
data, real interactions — but deliberately unstyled (see screenshots). Your
job is to design its complete visual language. You are NOT rebuilding the app:
a separate engineering session will implement your design exactly as specified,
so precision in your output format matters more than working code.

**Read the attached files in this order:**
1. `DESIGN_BRIEF_M1.md` — your contract: the exact component inventory, real
   content strings, deliverable format, and hard constraints. Treat it as
   authoritative.
2. `OVERHAUL_BIBLE.md` §4.1–4.2, §6, §10 — the product's design direction,
   verdict-tier system, and editorial voice.
3. `COMPLIANCE.md` — accessibility rules. These are non-negotiable acceptance
   criteria, not suggestions.
4. The screenshots — the real page structure you're skinning.

**The feeling to hit:** investigative data-journalism with a warm, cinematic
darkness. Reference points: NYT Upshot, The Pudding, Bloomberg Graphics — but
set inside a dark theater just before the movie starts. Near-black with a warm
tint (never cold blue-black), one confident amber/gold accent for data, a
display face with genuine editorial character for the headline. The site has a
point of view — "you're being ripped off and I'll show you the receipts" — and
the design should feel like evidence, not marketing.

**Anti-goals — reject any draft that has these:** generic SaaS landing-page
look; purple-to-blue gradients; glassmorphism; rounded-everything friendliness;
sci-fi/HUD styling; neon glows; cinema kitsch (film reels, clapperboards,
popcorn, ticket stubs); more than one accent color family; centered-hero-with-
three-feature-cards genericism. If it could be a crypto dashboard or an AI
startup, start over.

**Design these seven things** (full details + real content in the brief):
1. Nav bar (recessive on the splash)
2. Splash: headline, three-stat callout strip, archival-data footnote, purpose
   line, search field
3. Search combobox: idle / focused / open-with-results / keyboard-highlighted /
   no-results states
4. The four verdict badges (TRUE IMAX / IMAX LITE / LIEMAX / DOME) — the
   emotional core of the site; text + color lockups, never color alone
5. Layer 1 verdict card: badge, tagline, summary paragraph, scale diagram,
   "what you're missing" callout, two-path CTA
6. The human-vs-screen scale diagram — the single most persuasive visual on
   the page; give it disproportionate care
7. The archival-data caveat treatment (small, trust-building, not alarming)

**Work in this sequence — do not skip ahead:**
- STEP 1: Produce ONE full splash-page mockup (desktop) as a single HTML/CSS
  artifact so the overall direction can be judged at once. Stop and wait for
  my reaction. Expect taste notes like "warmer," "more newspaper," "less glow"
  — iterate on this single mockup until I approve it.
- STEP 2: Only after I approve the direction, extend it to the verdict card +
  search states + badges in a second mockup. Wait for approval again.
- STEP 3: Only after both approvals, produce the final deliverable package:
  (a) the design-token sheet using EXACTLY these CSS custom-property names
  with your chosen values —
  `--color-bg, --color-surface, --color-text, --color-muted, --color-accent,
  --tier-true, --tier-lite, --tier-liemax, --tier-dome, --font-display,
  --font-body, --font-mono, --text-xs, --text-sm, --text-base, --text-lg,
  --text-xl, --text-2xl, --text-3xl, --space-1, --space-2, --space-3,
  --space-4, --space-5, --space-6, --radius`
  (b) per-component written specs: layout, spacing (in your token units),
  type treatment, color usage, border/shadow treatment, hover state,
  :focus-visible state, and 375px mobile behavior for every component
  (c) a short "spirit of the design" paragraph so the implementer can make
  consistent judgment calls on anything unspecified.

**Hard acceptance criteria (check your own work against these before showing
me anything):** every text/background pair ≥ 4.5:1 contrast including amber
stats on dark and all four badge lockups; every interactive element has a
designed, clearly visible :focus-visible state; verdict tiers readable with
color removed entirely; touch targets ≥ 44×44px at mobile; all fonts free and
self-hostable (Google Fonts fine); any glow or motion has a calm
reduced-motion equivalent; no external CDN assets.

Use the real content from the brief in every mockup — real stats (400 / 376 /
94% / Only 14), real theater names, real verdict copy — never lorem ipsum.
Begin with STEP 1 now: before drawing anything, state in two sentences the
visual concept you're committing to, then produce the splash mockup.
