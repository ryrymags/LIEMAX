# Branch Salvage Archive

Created 2026-06-18 before pruning stale local experiment branches/worktrees while
treating `gui-wip` as the primary working branch.

## Most Actionable

- `regions.js`: static state/region to nearest True IMAX lookup from the
  `claude/beautiful-shaw-448666` worktree. This directly supports the Overhaul
  Bible requirement for a "nearest True IMAX in your region" callout without a
  routing API.
- `initial-gui-work-search.ts`: modular venue search/filter helper extracted
  from the stale `initial-gui-work` branch. Useful later if picker/search logic
  is moved out of `docs/app.jsx`.

## Planning References

- `overhaul-v2-architecture.md`, `overhaul-v2-open-flags.md`,
  `overhaul-v2-todo.md`: committed planning notes from the `overhaul-v2`
  branch.
- `beautiful-architecture.md`, `beautiful-open-flags.md`,
  `beautiful-todo.md`: uncommitted planning notes from the
  `claude/beautiful-shaw-448666` worktree. These are broader and more
  implementation-oriented than the committed `overhaul-v2` notes.

## Raw Recovery Snapshots

- `beautiful-worktree-uncommitted.patch.gz`: compressed binary-safe diff of the modified files
  inside `.claude/worktrees/beautiful-shaw-448666`.
- `mystifying-worktree-uncommitted.patch.gz`: compressed binary-safe diff of the modified
  files inside `.claude/worktrees/mystifying-black-cf1cf3`.
- `mystifying-home.js`, `mystifying-workbench.html`: untracked alternate static
  split-page files from the `mystifying` worktree.

## Guidance

Do not merge these branches wholesale. The current production/prototype path is
`gui-wip`. Treat this archive as idea salvage for the coming Overhaul V2 pass:
region lookup, no-results fallback, first-use tooltips, primary vs. advanced
comparison rows, and standalone Compare / IMAX 101 page structure.
