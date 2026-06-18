/* LIEMAX homepage search — vanilla JS, no framework.
   Depends on window.LIEMAX_DATA (data.js) and window.LIEMAX_DIAGNOSE (diagnosis.js).
   Loaded after both.
*/

(function () {
  "use strict";

  // ─── Classification helpers ──────────────────────────────────────────────

  function getCategory(venue) {
    if (!window.LIEMAX_DIAGNOSE) return "unknown";
    try { return LIEMAX_DIAGNOSE.classify(venue); } catch (_) { return "unknown"; }
  }

  function categoryLabel(cat) {
    if (cat === "true_143_laser" || cat === "true_143_film") return { text: "True IMAX", cls: "true" };
    if (cat === "true_film_lie_dig") return { text: "Hybrid", cls: "lite" };
    if (cat === "true_dome") return { text: "Dome", cls: "dome" };
    if (cat === "liemax") return { text: "LIEMAX", cls: "liemax" };
    return { text: "IMAX", cls: "" };
  }

  // ─── Fuzzy venue filtering ───────────────────────────────────────────────

  function normalize(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function filterVenues(query, venues, max) {
    max = max || 8;
    const tokens = normalize(query).split(" ").filter(Boolean);
    if (!tokens.length) return [];

    return venues
      .filter(v => v.kind === "cinema" && !v.isPreset)
      .map(v => {
        const haystack = normalize([v.name, v.city, v.stateName, v.state].join(" "));
        const score = tokens.reduce((s, t) => {
          if (haystack.startsWith(t)) return s + 3;
          if (haystack.includes(" " + t)) return s + 2;
          if (haystack.includes(t)) return s + 1;
          return s - 10;
        }, 0);
        return { venue: v, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(x => x.venue);
  }

  // ─── Navigate to workbench with venue pre-selected ───────────────────────

  function navigateToVenue(venueId) {
    window.location.href = "workbench.html?venue=" + encodeURIComponent(venueId);
  }

  // ─── Render dropdown items ────────────────────────────────────────────────

  function buildItem(venue, isDark) {
    const cat = getCategory(venue);
    const lbl = categoryLabel(cat);
    const item = document.createElement("div");
    item.className = isDark ? "h-search-item" : "h-find-item";
    item.dataset.venueId = venue.id;
    item.setAttribute("role", "option");
    item.innerHTML =
      '<div>' +
        '<div class="' + (isDark ? "h-search-item__name" : "h-find-item__name") + '">' + escHtml(venue.name) + '</div>' +
        '<div class="' + (isDark ? "h-search-item__meta" : "h-find-item__meta") + '">' + escHtml([venue.city, venue.stateName || venue.state].filter(Boolean).join(", ")) + '</div>' +
      '</div>' +
      (lbl.text ? '<span class="' + (isDark ? "h-search-item__cat" : "h-find-item__cat") + ' ' + (isDark ? "h-search-item__cat--" : "h-find-item__cat--") + lbl.cls + '">' + lbl.text + '</span>' : "");
    return item;
  }

  function escHtml(s) {
    return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  // ─── Wire up a search instance ────────────────────────────────────────────

  function initSearch(inputEl, btnEl, dropdownEl, isDark) {
    if (!inputEl || !dropdownEl) return;

    let activeIdx = -1;
    let lastResults = [];

    function openDropdown(results) {
      lastResults = results;
      activeIdx = -1;
      dropdownEl.innerHTML = "";
      results.forEach((v, i) => {
        const item = buildItem(v, isDark);
        item.addEventListener("mousedown", e => {
          e.preventDefault();
          navigateToVenue(v.id);
        });
        item.addEventListener("mouseover", () => {
          setActive(i);
        });
        dropdownEl.appendChild(item);
      });
      dropdownEl.classList.toggle("open", results.length > 0);
    }

    function closeDropdown() {
      dropdownEl.classList.remove("open");
      lastResults = [];
      activeIdx = -1;
    }

    function setActive(idx) {
      const items = dropdownEl.querySelectorAll("[role=option]");
      items.forEach((el, i) => el.classList.toggle("active", i === idx));
      activeIdx = idx;
    }

    function doSearch() {
      const q = inputEl.value.trim();
      if (!q || !window.LIEMAX_DATA) { closeDropdown(); return; }
      const results = filterVenues(q, LIEMAX_DATA.venues, 8);
      openDropdown(results);
    }

    inputEl.addEventListener("input", doSearch);
    inputEl.addEventListener("focus", doSearch);
    inputEl.addEventListener("blur", () => setTimeout(closeDropdown, 150));

    inputEl.addEventListener("keydown", e => {
      const count = lastResults.length;
      if (!count) {
        if (e.key === "Enter") {
          const q = inputEl.value.trim();
          if (q) doSearch();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((activeIdx + 1) % count);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((activeIdx - 1 + count) % count);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIdx >= 0 && lastResults[activeIdx]) {
          navigateToVenue(lastResults[activeIdx].id);
        } else if (lastResults[0]) {
          navigateToVenue(lastResults[0].id);
        }
      } else if (e.key === "Escape") {
        closeDropdown();
      }
    });

    if (btnEl) {
      btnEl.addEventListener("click", () => {
        if (activeIdx >= 0 && lastResults[activeIdx]) {
          navigateToVenue(lastResults[activeIdx].id);
        } else if (lastResults[0]) {
          navigateToVenue(lastResults[0].id);
        } else {
          doSearch();
        }
      });
    }
  }

  // ─── Example chips ────────────────────────────────────────────────────────

  function initChips(containerEl) {
    if (!containerEl) return;
    containerEl.querySelectorAll("[data-venue-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        navigateToVenue(btn.dataset.venueId);
      });
    });
  }

  // ─── Boot after DOM + data are ready ─────────────────────────────────────

  function boot() {
    if (!window.LIEMAX_DATA) {
      // data.js not yet loaded — retry
      setTimeout(boot, 50);
      return;
    }

    // Hero search (dark)
    initSearch(
      document.getElementById("hero-search-input"),
      document.getElementById("hero-search-btn"),
      document.getElementById("hero-search-dropdown"),
      true
    );

    // Find section search (light)
    initSearch(
      document.getElementById("find-search-input"),
      document.getElementById("find-search-btn"),
      document.getElementById("find-search-dropdown"),
      false
    );

    // Example chips in the find section
    initChips(document.getElementById("find-examples"));

    // Compare-preset buttons (navigate to workbench without a venue)
    document.querySelectorAll(".compare-preset[data-href]").forEach(btn => {
      btn.addEventListener("click", () => {
        window.location.href = btn.dataset.href;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
