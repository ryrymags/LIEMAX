# Step 3 Audit Execution Plan

Status: executed 2026-04-26.

## Combined Priority Order

1. Fix the confirmed Mugar dome geometry inconsistency by storing the physical dome aspect ratio as `1.0` when both width and height represent the 76 ft dome diameter.
2. Correct the larger capability-modeling issue by representing current Mugar Omni as post-2021 digital IMAX Dome laser, not inherited 15/70 film.
3. Preserve the already-applied Step 3 audit remediations: schema-valid standard/ScreenX light sources, RPX 1.85 geometry, resolver capability preservation, and full Step 3 JSON validation.
4. Add validation coverage so Mugar cannot regress into false 15/70 scan-equivalent capability.
5. Update agent context and public docs so Step 4 starts from one coherent Step 3 inventory.

## Execution Notes

- `schema/theater.schema.json` already supports `projector_type: "imax_dome_laser"` in v1.3.0, so no schema version bump is required for this audit pass.
- `imax_dome_film` remains as a historical/current film-dome preset for venues that actually use 15/70 dome projection.
- `imax_dome_laser` is the current digital dome default for Mugar-style IMAX Dome laser venues: 4K digital, no film scan-equivalent fields, `supports_1570_film: false`, `supports_143_digital: true`, and `anamorphic_stretch: true`.
- Mugar dome dimensions remain low-confidence estimates until an official Museum of Science spec source is found.

## Verification

- Run `npm run ci`.
- Confirm `mugar_omni_boston` resolves from `preset_id: "imax_dome_laser"`.
- Confirm Mugar has no film scan-equivalent projection fields and no longer claims `supports_1570_film`.
