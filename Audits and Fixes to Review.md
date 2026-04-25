[GEMINI'S AUDIT]

The codebase is remarkably rigorous. Structuring the logic as pure, unit-tested TypeScript functions before touching a UI framework is exactly the right approach for a domain where the audience will scrutinize every pixel-per-degree claim. The asymmetric vertical FOV math and the off-axis PPD explanations are particularly sharp. 

Here is a technical audit of the current state of the repository.

### 1. Critical Finding: The Resolver Derived-Field Desync Bug
There is a subtle but dangerous logic flaw in `src/math/resolver.ts` regarding how derived fields (like `width_ft`, `aspect_ratio`, and `ppi`) are inherited during the field-level merge.

Currently, the resolver only calculates derived fields if they are `null` after the merge. For example:
```typescript
if (screen.aspect_ratio == null && screen.width_m != null && screen.height_m != null) {
  screen.aspect_ratio = screen.width_m / screen.height_m;
}
```
**The Bug:** Because `fieldMerge` inherits everything from the preset, `screen.aspect_ratio` will almost never be `null`—it will inherit the *preset's* aspect ratio. 
If a venue record overrides `width_m` but leaves `height_m` null, the venue inherits the preset's `height_m` and the preset's `aspect_ratio`. The resolver sees `screen.aspect_ratio` is already populated (with the preset's value) and skips the recalculation. The resulting venue will have a new width, the old height, and an aspect ratio that is mathematically false. 

This same bug applies to:
* `width_ft` and `height_ft` in `resolveVenue`
* `projection.brightness_cdm2` in `resolveVenue`
* `display_optics.ppi` in `resolveHomeDisplay`

*Why it passed the tests:* In `validate.ts`, the `mockGtPreset` and `mockHomePreset` omitted the derived fields (like `ppi` and `width_ft`). Because they were missing from the mock presets, the resolver successfully calculated them. 

**The Fix:** Unconditionally recalculate derived fields from the final merged primary fields, overwriting whatever was inherited from the preset.
```typescript
// Instead of checking if null, always enforce mathematical consistency:
if (screen.width_m != null) screen.width_ft = metersToFeet(screen.width_m);
if (screen.height_m != null) screen.height_ft = metersToFeet(screen.height_m);
if (screen.width_m != null && screen.height_m != null) {
  screen.aspect_ratio = screen.width_m / screen.height_m;
}
```

### 2. Minor Schema & Terminology Discrepancies
* **Emissive vs. OLED:** The schema correctly uses `"is_per_pixel_emissive"` to handle OLED infinite contrast, which is nicely future-proofed for microLED. However, the `Home Theater Research.md` documentation advises using `"is_per_pixel_oled": true`. Updating the research notes to match the implemented schema will prevent confusion during Step 3.
* **Version Drift:** `package.json` is set to `"version": "0.0.1"`, while the JSON Schema dictates `"version": "1.1.1"`. Aligning these will make version control cleaner once data starts flowing.
* **Off-Axis PPD Constraint:** In `src/math/ppd.ts`, the `offAxisPpd` function throws an error if the viewer is beyond the screen edge (`Math.abs(lateralOffset) >= screenWidth / 2`). While mathematically sound, extreme off-axis seating (e.g., standard multiplexes where the far aisles extend past the screen edge) is physically possible. You may want to allow the calculation to proceed with a severe "extreme keystone" warning rather than throwing a hard error.

### 3. Testing & Tooling Setup
The custom `validate.ts` script is an excellent lightweight harness, but it will become cumbersome as the venue list grows. 
Transitioning the 96 assertions into a standard testing framework (like Vitest or Jest) before moving to Step 4 will provide better diffs when a calculation inevitably breaks during the introduction of new venue data. Vitest is highly recommended here, as it executes TypeScript natively without requiring `ts-node` overhead.

### Overall Assessment
The math engine is remarkably solid. The handling of the 9.4mm dome offset, the distinction between peak HDR and full-screen sustained nits for home displays, and the decision to represent 15/70 film resolution as a scan-equivalent range rather than a single fabricated integer all demonstrate an exceptionally high level of technical rigor. 

There are a few highly specific edge cases and architectural details worth looking at, especially when it comes to translating this math engine into UI components for the comprehensive website or generating visual graphics for the educational series. 

Here is what stands out upon a closer look:

### 1. The "LIMAX on a GT Screen" Masking Bug
In `src/math/masking.ts`, there is a logic gap regarding how black bars are calculated for cropped content. 

Take the real-world example of the Providence Place IMAX: it has a physical 1.43:1 screen, but typically runs a 1.90:1 CoLa digital projector. If they show a 1.43:1 film digitally, `minContentArSupported` is 1.90 and `contentAr` is 1.43. 
The code correctly catches this in the `if (cropped)` block:
```typescript
if (cropped) {
  effectiveWidth = screenWidthFt;
  effectiveHeight = screenWidthFt / minContentArSupported;
  effectiveHeight = Math.min(effectiveHeight, screenHeightFt);
}
```
However, the code never sets `letterboxed = true` inside this block. Because `letterboxed` remains false, the subsequent calculation for `bars_height_ft` evaluates to `0`:
```typescript
const barsHeightFt = letterboxed ? (screenHeightFt - effectiveHeight) / 2 : 0;
```
The math calculates the effective visible area correctly, but the UI wouldn't know to draw the physical black bars at the top and bottom of the 1.43:1 screen. 

**The Fix:** Add `if (effectiveHeight < screenHeightFt) letterboxed = true;` inside the `if (cropped)` block to ensure the UI renders the letterboxing.

### 2. Off-Axis Geometry Assumption
In `src/math/ppd.ts`, the `offAxisPpd` math handles the angular span beautifully:
```typescript
const angleLeft = Math.atan((halfWidth + offset) / viewingDistance);
const angleRight = Math.atan((halfWidth - offset) / viewingDistance);
```
This geometry relies on a specific assumption: `viewingDistance` must be the *perpendicular depth* to the screen plane, not the direct hypotenuse distance from the viewer's eyeball to the center of the screen. While this is standard in theater design, general audiences trying to measure their home theater setup might pull a tape measure straight from their couch to the center of the TV. Adding a small docstring note clarifying that distance must be measured perpendicular to the screen will ensure the calculator stays accurate when users submit their own data. 

### 3. Schema Analytics Bottleneck
In `schema/theater.schema.json`, `ticket_premium_usd` is defined as a string (e.g., `"$5–8"`) specifically to accommodate ranges. 
While a string is easy to render, it will create a bottleneck when building site features that allow users to sort, filter, or rank theaters by "Best Value" or "Highest Surcharge." Splitting this into two numeric fields—`ticket_premium_usd_min` and `ticket_premium_usd_max`—will keep the data mathematically pliable for the frontend, while the UI can simply stitch them together with a dash for display. 

### 4. Zero-Defaulting `seat_offset_from_center_ft`
In the schema, `seating.seat_offset_from_center_ft` defaults to `null`, but the description explicitly notes "Null = center seat". For the math engine to run cleanly without throwing unexpected type errors in Step 4, it might be safer to default this explicitly to `0` in the JSON schema or handle it with a strict fallback in `resolver.ts`.


