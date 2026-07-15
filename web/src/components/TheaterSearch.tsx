// Theater search combobox. Full ARIA combobox pattern per COMPLIANCE.md:
// role="combobox", aria-expanded/aria-controls/aria-activedescendant on the
// input; role="listbox"/"option" with stable ids; Arrow/Enter/Escape/Tab
// keyboard handling; closed on initial load; focus management on select.
import { useId, useRef, useState } from 'react';
import { isArchivalSource, searchVenues, venueLocationLabel, type Venue } from '../lib/data';

interface TheaterSearchProps {
  onSelect: (venue: Venue) => void;
  /** Optional: notified on every keystroke, so a parent (e.g. Splash) can
   * render its own no-results state without duplicating combobox state. */
  onQueryChange?: (query: string) => void;
  label?: string;
}

export default function TheaterSearch({
  onSelect,
  onQueryChange,
  label = 'Search your theater or city…',
}: TheaterSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-option-${i}`;

  const results = query.trim() ? searchVenues(query) : [];
  const showListbox = open && results.length > 0;

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);
    setActiveIndex(-1);
    onQueryChange?.(value);
  }

  function commitSelection(venue: Venue) {
    onSelect(venue);
    setQuery('');
    onQueryChange?.('');
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showListbox) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          commitSelection(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  }

  return (
    <div className="search">
      <label className="search-label" htmlFor={baseId}>
        {label}
      </label>
      <input
        id={baseId}
        ref={inputRef}
        type="text"
        className="search-input"
        role="combobox"
        aria-expanded={showListbox}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          showListbox && activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        placeholder="Search your theater or city…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showListbox && (
        <ul id={listboxId} role="listbox" className="search-listbox" aria-label="Theater results">
          {results.map((venue, i) => (
            <li
              key={venue.id}
              id={optionId(i)}
              role="option"
              aria-selected={i === activeIndex}
              className="search-option"
              onMouseDown={(e) => {
                // onMouseDown (not click) so it fires before the input's blur.
                e.preventDefault();
                commitSelection(venue);
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="search-option-name">{venue.name}</span>
              <span className="search-option-meta">{venueLocationLabel(venue)}</span>
              {isArchivalSource(venue) && (
                <span className="search-option-source">2021 archival listing</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
