// Persistent nav bar. Bible §3.1: LIEMAX wordmark (returns home / resets
// selection) + Compare / IMAX 101 / Deep Dive anchor stubs. Milestone 1 ships
// these as in-page anchors; standalone Compare/101 pages land in a later
// milestone (see AGENTS.md Step 4 notes).
interface NavProps {
  onReset: () => void;
}

export default function Nav({ onReset }: NavProps) {
  return (
    <>
      {/* Skip-to-content link must be the first focusable element on the page. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <nav aria-label="Primary" className="site-nav">
          <button type="button" className="nav-wordmark" onClick={onReset}>
            LIEMAX
          </button>
          <ul className="nav-links">
            <li>
              <a href="#compare">Compare</a>
            </li>
            <li>
              <a href="#imax-101">IMAX 101</a>
            </li>
            <li>
              <a href="#deep-dive">Deep Dive</a>
            </li>
          </ul>
          <a className="nav-diagnosis" href="#diagnose-my-imax">
            Diagnose my IMAX
          </a>
        </nav>
      </header>
    </>
  );
}
