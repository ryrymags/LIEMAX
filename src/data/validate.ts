/**
 * Project-specific schema/data validation.
 *
 * This intentionally stays dependency-free, but it now validates all authored
 * Step 3 JSON records instead of only the 143190 import fixtures.
 */

import * as fs from 'fs';
import * as path from 'path';
import schema from '../../schema/theater.schema.json';
import samples from './fixtures/imax_143190_samples.json';
import { map143190RowToVenue, type Imax143190ImportRow } from './imaxImport';
import { resolveVenue } from '../math/resolver';

type JsonObject = Record<string, any>;

let passed = 0;
let failed = 0;

const projectRoot = path.resolve(__dirname, '../..');

const enumValues = {
  capabilities: Object.keys(schema.definitions.capabilities.properties),
  contentFormat: Object.keys(schema.definitions.content_format.properties),
  deviceCategory: schema.definitions.device_category.enum,
  displayOptics: Object.keys(schema.definitions.display_optics.properties),
  distanceSource: schema.definitions.distance_source.enum,
  formatPreset: Object.keys(schema.definitions.format_preset.properties),
  hdrFormat: schema.definitions.hdr_type.enum,
  hdrFormatsSupported: schema.definitions.hdr_formats_supported.items.enum,
  homeDisplayPreset: Object.keys(schema.definitions.home_display_preset.properties),
  lightSource: schema.definitions.light_source.enum,
  metadata: Object.keys(schema.definitions.metadata.properties),
  panelTech: schema.definitions.panel_tech.enum,
  projection: Object.keys(schema.definitions.projection.properties),
  projectionAvailability: schema.definitions.projection_availability.enum,
  projectionMode: schema.definitions.projection_mode.enum,
  projectorType: schema.definitions.projector_type.enum,
  screen: Object.keys(schema.definitions.screen.properties),
  screenGeometry: schema.definitions.screen_geometry.enum,
  seating: Object.keys(schema.definitions.seating.properties),
  seatType: schema.definitions.seat_type.enum,
  sourceQuality: schema.definitions.source_quality.enum,
  venueRecord: Object.keys(schema.definitions.venue_record.properties),
};

function assert(label: string, condition: boolean): void {
  if (condition) {
    console.log(`  PASS ${label}`);
    passed++;
  } else {
    console.log(`  FAIL ${label}`);
    failed++;
  }
}

function assertEqual<T>(label: string, actual: T, expected: T): void {
  assert(`${label}: ${String(actual)} === ${String(expected)}`, actual === expected);
}

function assertNoIssues(label: string, issues: string[]): void {
  assert(label, issues.length === 0);
  for (const issue of issues) {
    console.log(`    - ${issue}`);
  }
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8')) as T;
}

function listJson(relativeDir: string): string[] {
  return fs.readdirSync(path.join(projectRoot, relativeDir))
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => path.join(relativeDir, file));
}

function fileBase(relativePath: string): string {
  return path.basename(relativePath, '.json');
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isIntegerOrNull(value: unknown): boolean {
  return value === null || (Number.isInteger(value) && Number.isFinite(value));
}

function isNumberOrNull(value: unknown): boolean {
  return value === null || isFiniteNumber(value);
}

function isStringOrNull(value: unknown): boolean {
  return value === null || typeof value === 'string';
}

function isBooleanOrNull(value: unknown): boolean {
  return value === null || typeof value === 'boolean';
}

function isStringArrayOrNull(value: unknown): boolean {
  return value === null || (Array.isArray(value) && value.every((item) => typeof item === 'string'));
}

function checkKnownKeys(label: string, obj: JsonObject, allowed: string[], issues: string[]): void {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) {
      issues.push(`${label}.${key} is not defined in schema`);
    }
  }
}

function checkRequired(label: string, obj: JsonObject, required: string[], issues: string[]): void {
  for (const key of required) {
    if (!(key in obj)) {
      issues.push(`${label}.${key} is required`);
    }
  }
}

function checkEnum(label: string, value: unknown, allowed: string[], issues: string[]): void {
  if (value != null && !allowed.includes(String(value))) {
    issues.push(`${label}=${String(value)} is not one of ${allowed.join(', ')}`);
  }
}

function checkNullableNumber(label: string, value: unknown, issues: string[]): void {
  if (!isNumberOrNull(value)) {
    issues.push(`${label} must be number or null`);
  }
}

function checkNullableInteger(label: string, value: unknown, issues: string[]): void {
  if (!isIntegerOrNull(value)) {
    issues.push(`${label} must be integer or null`);
  }
}

function closeEnough(actual: number, expected: number, tolerance = 0.02): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

function collectScreenIssues(screen: unknown, label: string, allowNull: boolean): string[] {
  const issues: string[] = [];
  if (screen === null && allowNull) return issues;
  if (!isObject(screen)) return [`${label} must be an object${allowNull ? ' or null' : ''}`];

  checkKnownKeys(label, screen, enumValues.screen, issues);
  checkEnum(`${label}.geometry`, screen.geometry, enumValues.screenGeometry, issues);

  for (const key of [
    'width_m',
    'height_m',
    'width_ft',
    'height_ft',
    'aspect_ratio',
    'curvature_radius_ft',
    'screen_bottom_height_ft',
    'dome_coverage_pct',
    'dome_fov_horizontal_deg',
    'dome_fov_vertical_deg',
    'dome_fov_above_horizon_deg',
    'dome_fov_below_horizon_deg',
  ]) {
    checkNullableNumber(`${label}.${key}`, screen[key], issues);
  }

  if (!isBooleanOrNull(screen.is_perforated)) {
    issues.push(`${label}.is_perforated must be boolean or null`);
  }

  if (isFiniteNumber(screen.width_m) && isFiniteNumber(screen.height_m)) {
    if (!isFiniteNumber(screen.aspect_ratio)) {
      issues.push(`${label}.aspect_ratio must be present when dimensions are present`);
    } else if (!closeEnough(screen.aspect_ratio, screen.width_m / screen.height_m)) {
      issues.push(`${label}.aspect_ratio does not match width_m / height_m`);
    }
  }

  if (screen.geometry === 'hemispherical') {
    if (screen.width_m != null && !isFiniteNumber(screen.width_m)) {
      issues.push(`${label}.width_m must be finite for dome geometry when present`);
    }
    if (screen.height_m != null && !isFiniteNumber(screen.height_m)) {
      issues.push(`${label}.height_m must be finite for dome geometry when present`);
    }
  }

  return issues;
}

function collectProjectionIssues(projection: unknown, label: string, allowNull: boolean): string[] {
  const issues: string[] = [];
  if (projection === null && allowNull) return issues;
  if (!isObject(projection)) return [`${label} must be an object${allowNull ? ' or null' : ''}`];

  checkKnownKeys(label, projection, enumValues.projection, issues);
  checkEnum(`${label}.mode`, projection.mode, enumValues.projectionMode, issues);
  checkEnum(`${label}.availability`, projection.availability, enumValues.projectionAvailability, issues);
  checkEnum(`${label}.type`, projection.type, enumValues.projectorType, issues);
  checkEnum(`${label}.light_source`, projection.light_source, enumValues.lightSource, issues);
  checkEnum(`${label}.hdr`, projection.hdr, enumValues.hdrFormat, issues);
  checkEnum(`${label}.brightness_source`, projection.brightness_source, enumValues.sourceQuality, issues);
  checkEnum(`${label}.contrast_source`, projection.contrast_source, enumValues.sourceQuality, issues);

  for (const key of [
    'resolution_horizontal_px',
    'resolution_vertical_px',
    'resolution_scan_equivalent_low',
    'resolution_scan_equivalent_high',
    'contrast_sequential',
    'contrast_dynamic',
  ]) {
    checkNullableInteger(`${label}.${key}`, projection[key], issues);
  }

  for (const key of ['brightness_fl', 'brightness_cdm2', 'min_content_ar_supported']) {
    checkNullableNumber(`${label}.${key}`, projection[key], issues);
  }

  for (const key of ['dual_projector', 'supports_3d']) {
    if (!isBooleanOrNull(projection[key])) {
      issues.push(`${label}.${key} must be boolean or null`);
    }
  }

  if (typeof projection.anamorphic_stretch !== 'boolean') {
    issues.push(`${label}.anamorphic_stretch must be boolean`);
  }

  return issues;
}

function collectSoundIssues(sound: unknown, label: string, allowNull: boolean): string[] {
  const issues: string[] = [];
  if (sound === null && allowNull) return issues;
  if (!isObject(sound)) return [`${label} must be an object${allowNull ? ' or null' : ''}`];

  for (const key of ['system_name', 'channel_config']) {
    if (!isStringOrNull(sound[key])) issues.push(`${label}.${key} must be string or null`);
  }
  for (const key of ['is_object_based', 'dome_zenith_channel']) {
    if (!isBooleanOrNull(sound[key])) issues.push(`${label}.${key} must be boolean or null`);
  }
  checkNullableNumber(`${label}.max_output_watts_per_channel`, sound.max_output_watts_per_channel, issues);
  checkNullableInteger(`${label}.speaker_count`, sound.speaker_count, issues);
  return issues;
}

function collectSeatingIssues(seating: unknown, label: string, allowNull: boolean): string[] {
  const issues: string[] = [];
  if (seating === null && allowNull) return issues;
  if (!isObject(seating)) return [`${label} must be an object${allowNull ? ' or null' : ''}`];

  checkKnownKeys(label, seating, enumValues.seating, issues);
  checkEnum(`${label}.seat_type`, seating.seat_type, enumValues.seatType, issues);
  checkEnum(`${label}.viewing_distance_source`, seating.viewing_distance_source, enumValues.distanceSource, issues);
  checkNullableInteger(`${label}.capacity`, seating.capacity, issues);
  for (const key of [
    'rake_angle_deg',
    'viewing_distance_front_ft',
    'viewing_distance_mid_ft',
    'viewing_distance_back_ft',
    'seat_offset_from_center_ft',
  ]) {
    checkNullableNumber(`${label}.${key}`, seating[key], issues);
  }
  if (!isBooleanOrNull(seating.has_bass_transducers)) {
    issues.push(`${label}.has_bass_transducers must be boolean or null`);
  }
  return issues;
}

function collectCapabilitiesIssues(capabilities: unknown, label: string, allowNull: boolean): string[] {
  const issues: string[] = [];
  if (capabilities === null && allowNull) return issues;
  if (!isObject(capabilities)) return [`${label} must be an object${allowNull ? ' or null' : ''}`];

  checkKnownKeys(label, capabilities, enumValues.capabilities, issues);
  checkNullableNumber(`${label}.min_content_ar_supported`, capabilities.min_content_ar_supported, issues);
  for (const key of ['supports_1570_film', 'supports_143_digital', 'has_screenx', 'has_4dx', 'has_dbox', 'infinity_vision_certified']) {
    if (!isBooleanOrNull(capabilities[key])) {
      issues.push(`${label}.${key} must be boolean or null`);
    }
  }
  return issues;
}

function collectMetadataIssues(metadata: unknown, label: string): string[] {
  const issues: string[] = [];
  if (!isObject(metadata)) return [`${label} must be an object`];
  checkKnownKeys(label, metadata, enumValues.metadata, issues);
  checkRequired(label, metadata, schema.definitions.metadata.required, issues);
  for (const key of ['data_source', 'source_url', 'last_verified', 'created_at', 'updated_at', 'confidence', 'notes']) {
    if (!isStringOrNull(metadata[key])) issues.push(`${label}.${key} must be string or null`);
  }
  return issues;
}

function collectDisplayOpticsIssues(optics: unknown, label: string): string[] {
  const issues: string[] = [];
  if (!isObject(optics)) return [`${label} must be an object`];

  checkKnownKeys(label, optics, enumValues.displayOptics, issues);
  checkEnum(`${label}.panel_tech`, optics.panel_tech, enumValues.panelTech, issues);
  if (typeof optics.is_per_pixel_emissive !== 'boolean') {
    issues.push(`${label}.is_per_pixel_emissive must be boolean`);
  }
  checkNullableInteger(`${label}.resolution_horizontal_px`, optics.resolution_horizontal_px, issues);
  checkNullableInteger(`${label}.resolution_vertical_px`, optics.resolution_vertical_px, issues);
  for (const key of [
    'ppi',
    'brightness_peak_hdr_nits',
    'brightness_fullscreen_nits',
    'brightness_sdr_nits',
    'contrast_sequential',
    'color_gamut_dci_p3_pct',
  ]) {
    checkNullableNumber(`${label}.${key}`, optics[key], issues);
  }
  if (!isStringOrNull(optics.contrast_notes)) issues.push(`${label}.contrast_notes must be string or null`);
  if (!isStringOrNull(optics.color_gamut_label)) issues.push(`${label}.color_gamut_label must be string or null`);
  if (!Array.isArray(optics.hdr_formats)) {
    issues.push(`${label}.hdr_formats must be an array`);
  } else {
    for (const [index, format] of optics.hdr_formats.entries()) {
      checkEnum(`${label}.hdr_formats[${index}]`, format, enumValues.hdrFormatsSupported, issues);
    }
  }

  return issues;
}

function collectFormatPresetIssues(preset: JsonObject, relativePath: string): string[] {
  const issues: string[] = [];
  const label = relativePath;
  checkKnownKeys(label, preset, enumValues.formatPreset, issues);
  checkRequired(label, preset, schema.definitions.format_preset.required, issues);

  if (preset.id !== fileBase(relativePath)) {
    issues.push(`${label}.id must match filename`);
  }
  for (const key of ['id', 'display_name', 'tier']) {
    if (typeof preset[key] !== 'string') issues.push(`${label}.${key} must be string`);
  }
  if (!isStringOrNull(preset.brand)) issues.push(`${label}.brand must be string or null`);
  if (!isStringOrNull(preset.short_description)) issues.push(`${label}.short_description must be string or null`);
  checkEnum(`${label}.tier`, preset.tier, schema.definitions.format_preset.properties.tier.enum, issues);
  if (!isStringOrNull(preset.ticket_premium_usd)) issues.push(`${label}.ticket_premium_usd must be string or null`);
  if (!isStringArrayOrNull(preset.known_limitations)) issues.push(`${label}.known_limitations must be string[] or null`);

  issues.push(...collectScreenIssues(preset.default_screen, `${label}.default_screen`, false));
  issues.push(...collectProjectionIssues(preset.default_projection, `${label}.default_projection`, false));
  if (preset.default_projections !== null) {
    if (!Array.isArray(preset.default_projections)) {
      issues.push(`${label}.default_projections must be array or null`);
    } else {
      preset.default_projections.forEach((projection: unknown, index: number) => {
        issues.push(...collectProjectionIssues(projection, `${label}.default_projections[${index}]`, false));
      });
    }
  }
  issues.push(...collectSoundIssues(preset.default_sound, `${label}.default_sound`, false));
  issues.push(...collectSeatingIssues(preset.default_seating, `${label}.default_seating`, false));
  issues.push(...collectCapabilitiesIssues(preset.default_capabilities, `${label}.default_capabilities`, false));

  return issues;
}

function collectVenueIssues(venue: JsonObject, relativePath: string, presetIds: Set<string>): string[] {
  const issues: string[] = [];
  const label = relativePath;
  checkKnownKeys(label, venue, enumValues.venueRecord, issues);
  checkRequired(label, venue, schema.definitions.venue_record.required, issues);

  if (venue.id !== fileBase(relativePath)) {
    issues.push(`${label}.id must match filename`);
  }
  if (!presetIds.has(venue.preset_id)) {
    issues.push(`${label}.preset_id references missing preset '${venue.preset_id}'`);
  }
  for (const key of ['id', 'preset_id', 'name', 'city', 'country']) {
    if (typeof venue[key] !== 'string') issues.push(`${label}.${key} must be string`);
  }
  if (!isStringOrNull(venue.chain)) issues.push(`${label}.chain must be string or null`);
  if (!isStringOrNull(venue.brand_label)) issues.push(`${label}.brand_label must be string or null`);
  if (!isStringOrNull(venue.state_province)) issues.push(`${label}.state_province must be string or null`);

  issues.push(...collectScreenIssues(venue.screen, `${label}.screen`, true));
  issues.push(...collectProjectionIssues(venue.projection, `${label}.projection`, true));
  if (venue.projections !== null && venue.projections !== undefined) {
    if (!Array.isArray(venue.projections)) {
      issues.push(`${label}.projections must be array or null`);
    } else {
      venue.projections.forEach((projection: unknown, index: number) => {
        issues.push(...collectProjectionIssues(projection, `${label}.projections[${index}]`, false));
      });
    }
  }
  issues.push(...collectSoundIssues(venue.sound, `${label}.sound`, true));
  issues.push(...collectSeatingIssues(venue.seating, `${label}.seating`, true));
  issues.push(...collectCapabilitiesIssues(venue.capabilities, `${label}.capabilities`, true));
  issues.push(...collectMetadataIssues(venue.metadata, `${label}.metadata`));

  return issues;
}

function collectHomePresetIssues(preset: JsonObject, relativePath: string): string[] {
  const issues: string[] = [];
  const label = relativePath;
  checkKnownKeys(label, preset, enumValues.homeDisplayPreset, issues);
  checkRequired(label, preset, schema.definitions.home_display_preset.required, issues);

  if (preset.id !== fileBase(relativePath)) {
    issues.push(`${label}.id must match filename`);
  }
  for (const key of ['id', 'display_name', 'tier']) {
    if (typeof preset[key] !== 'string') issues.push(`${label}.${key} must be string`);
  }
  checkEnum(`${label}.device_category`, preset.device_category, enumValues.deviceCategory, issues);
  if (!isStringOrNull(preset.short_description)) issues.push(`${label}.short_description must be string or null`);
  checkNullableNumber(`${label}.default_screen_diagonal_in`, preset.default_screen_diagonal_in, issues);
  if (!isFiniteNumber(preset.default_aspect_ratio)) issues.push(`${label}.default_aspect_ratio must be number`);
  checkNullableNumber(`${label}.default_viewing_distance_ft`, preset.default_viewing_distance_ft, issues);
  if (!isStringArrayOrNull(preset.known_limitations)) issues.push(`${label}.known_limitations must be string[] or null`);
  issues.push(...collectDisplayOpticsIssues(preset.default_display_optics, `${label}.default_display_optics`));

  const optics = preset.default_display_optics;
  if (
    isObject(optics) &&
    isFiniteNumber(preset.default_screen_diagonal_in) &&
    isFiniteNumber(optics.resolution_horizontal_px) &&
    isFiniteNumber(optics.resolution_vertical_px) &&
    isFiniteNumber(optics.ppi)
  ) {
    const expectedPpi = Math.sqrt(optics.resolution_horizontal_px ** 2 + optics.resolution_vertical_px ** 2) / preset.default_screen_diagonal_in;
    if (!closeEnough(optics.ppi, expectedPpi, 2.5)) {
      issues.push(`${label}.default_display_optics.ppi does not match resolution and diagonal`);
    }
  }

  if (
    preset.device_category === 'tv' &&
    isFiniteNumber(preset.default_screen_diagonal_in) &&
    isFiniteNumber(preset.default_viewing_distance_ft)
  ) {
    const expectedDistance = (preset.default_screen_diagonal_in / Math.sqrt(preset.default_aspect_ratio ** 2 + 1) / 12) * 1.5;
    if (!closeEnough(preset.default_viewing_distance_ft, expectedDistance, 0.15)) {
      issues.push(`${label}.default_viewing_distance_ft does not match 1.5x screen-height default`);
    }
  }

  return issues;
}

function collectContentFormatIssues(format: JsonObject, label: string): string[] {
  const issues: string[] = [];
  checkKnownKeys(label, format, enumValues.contentFormat, issues);
  checkRequired(label, format, schema.definitions.content_format.required, issues);
  for (const key of ['id', 'display_name']) {
    if (typeof format[key] !== 'string') issues.push(`${label}.${key} must be string`);
  }
  if (!isFiniteNumber(format.aspect_ratio)) issues.push(`${label}.aspect_ratio must be number`);
  if (!isStringOrNull(format.description)) issues.push(`${label}.description must be string or null`);
  if (!isStringArrayOrNull(format.example_films)) issues.push(`${label}.example_films must be string[] or null`);
  checkNullableNumber(`${label}.extra_area_vs_scope_pct`, format.extra_area_vs_scope_pct, issues);
  if (!isStringOrNull(format.home_release_behavior)) issues.push(`${label}.home_release_behavior must be string or null`);

  if (isFiniteNumber(format.aspect_ratio) && isFiniteNumber(format.extra_area_vs_scope_pct)) {
    const expected = Math.round(((2.39 / format.aspect_ratio - 1) * 100) * 10) / 10;
    if (!closeEnough(format.extra_area_vs_scope_pct, expected, 0.05)) {
      issues.push(`${label}.extra_area_vs_scope_pct should be ${expected}`);
    }
  }

  return issues;
}

console.log('\n=== Schema Contract ===');
assertEqual('schema const version', schema.properties.schema_version.const, '1.3.0');
assert('schema has 143190 import definition', Boolean(schema.definitions.imax_143190_import));
assert('schema projection supports mode', Boolean(schema.definitions.projection.properties.mode));
assert('schema projection supports per-mode min AR', Boolean(schema.definitions.projection.properties.min_content_ar_supported));
assert('format presets support projection arrays', Boolean(schema.definitions.format_preset.properties.default_projections));
assert('venues support projection arrays', Boolean(schema.definitions.venue_record.properties.projections));
assert('venues support raw 143190 source rows', Boolean(schema.definitions.venue_record.properties.source_143190));

console.log('\n=== Step 3 JSON Records ===');
const presetFiles = listJson('src/data/presets');
const homePresetFiles = listJson('src/data/home_display_presets');
const venueFiles = listJson('src/data/venues');
const contentFormats = readJson<JsonObject[]>('src/data/content_formats/content_formats.json');
const presets = presetFiles.map((relativePath) => readJson<JsonObject>(relativePath));
const presetIds = new Set(presets.map((preset) => preset.id));
const presetById = new Map(presets.map((preset) => [preset.id, preset]));

for (const relativePath of presetFiles) {
  assertNoIssues(`${relativePath} validates as format_preset`, collectFormatPresetIssues(readJson(relativePath), relativePath));
}
for (const relativePath of homePresetFiles) {
  assertNoIssues(`${relativePath} validates as home_display_preset`, collectHomePresetIssues(readJson(relativePath), relativePath));
}
for (const relativePath of venueFiles) {
  assertNoIssues(`${relativePath} validates as venue_record`, collectVenueIssues(readJson(relativePath), relativePath, presetIds));
}
for (const [index, format] of contentFormats.entries()) {
  assertNoIssues(`content format ${format.id ?? index} validates`, collectContentFormatIssues(format, `content_formats[${index}]`));
}
assertEqual('all content format ids are unique', new Set(contentFormats.map((format) => format.id)).size, contentFormats.length);
assert('schema supports IMAX Dome laser projector type', enumValues.projectorType.includes('imax_dome_laser'));
assert('schema projection supports anamorphic stretch', enumValues.projection.includes('anamorphic_stretch'));
assert('IMAX Dome laser preset exists', presetIds.has('imax_dome_laser'));

const imaxDomeLaser = presetById.get('imax_dome_laser')!;
assertEqual('IMAX Dome laser preset projection type', imaxDomeLaser.default_projection.type, 'imax_dome_laser');
assertEqual('IMAX Dome laser preset projection mode', imaxDomeLaser.default_projection.mode, 'digital');
assertEqual('IMAX Dome laser preset uses anamorphic stretch', imaxDomeLaser.default_projection.anamorphic_stretch, true);
assertEqual('IMAX Dome laser preset supports 1.43 content', imaxDomeLaser.default_projection.min_content_ar_supported, 1.43);
assertEqual('IMAX Dome laser preset claims digital 1.43', imaxDomeLaser.default_capabilities.supports_143_digital, true);
assertEqual('IMAX Dome laser preset does not claim 15/70 film', imaxDomeLaser.default_capabilities.supports_1570_film, false);

const invalidProjectionIssues = collectProjectionIssues(
  { ...presets.find((preset) => preset.id === 'standard_multiplex')!.default_projection, light_source: 'laser' },
  'invalid_projection_fixture',
  false
);
assert('validator rejects invalid projection light_source enum', invalidProjectionIssues.length > 0);

for (const relativePath of venueFiles) {
  const venue = readJson<JsonObject>(relativePath);
  const preset = presetById.get(venue.preset_id);
  if (!preset) continue;
  const resolved = resolveVenue(preset, venue);
  assert(`${venue.id} resolves finite effective screen aspect ratio`,
    isFiniteNumber(resolved.projection.effective_screen_aspect_ratio));
  assert(`${venue.id} resolves positive effective screen height`,
    isFiniteNumber(resolved.projection.effective_screen_height_ft) && resolved.projection.effective_screen_height_ft > 0);
}

const digital143ProjectorTypes = new Set(['imax_gt_dual_laser', 'imax_dome_laser']);
for (const preset of presets) {
  const projections = [
    preset.default_projection,
    ...(Array.isArray(preset.default_projections) ? preset.default_projections : []),
  ];
  for (const projection of projections) {
    if (
      projection.mode === 'digital' &&
      projection.min_content_ar_supported != null &&
      projection.min_content_ar_supported <= 1.43
    ) {
      assert(`${preset.id} digital 1.43 support uses approved projector type`,
        digital143ProjectorTypes.has(projection.type));
    }
  }
  if (preset.default_capabilities.supports_143_digital === true) {
    assert(`${preset.id} digital 1.43 capability uses approved projector type`,
      digital143ProjectorTypes.has(preset.default_projection.type));
  }
}

const mugarOmni = readJson<JsonObject>('src/data/venues/mugar_omni_boston.json');
const mugarPreset = presetById.get(mugarOmni.preset_id)!;
const resolvedMugar = resolveVenue(mugarPreset, mugarOmni);
assertEqual('Mugar uses IMAX Dome laser preset', mugarOmni.preset_id, 'imax_dome_laser');
assertEqual('Mugar physical dome aspect ratio is diameter/diameter', mugarOmni.screen.aspect_ratio, 1.0);
assertEqual('Mugar current projection type is dome laser', resolvedMugar.projection.type, 'imax_dome_laser');
assertEqual('Mugar does not claim 15/70 film capability', resolvedMugar.capabilities.supports_1570_film, false);
assertEqual('Mugar claims digital 1.43 dome capability', resolvedMugar.capabilities.supports_143_digital, true);
assertEqual('Mugar has no low scan-equivalent film field', resolvedMugar.projection.resolution_scan_equivalent_low, null);
assertEqual('Mugar has no high scan-equivalent film field', resolvedMugar.projection.resolution_scan_equivalent_high, null);
assertEqual('Mugar dome laser uses anamorphic stretch', resolvedMugar.projection.anamorphic_stretch, true);

console.log('\n=== 143190 Import Fixtures ===');
const venues = samples.map((sample) => ({
  caseName: sample.case,
  venue: map143190RowToVenue(sample.row as Imax143190ImportRow, {
    lastVerified: '2026-04-25',
    sourceUrl: 'https://143190.xyz/',
  }),
}));

for (const { caseName, venue } of venues) {
  assert(`${caseName} maps to venue id`, typeof venue.id === 'string' && venue.id.length > 0);
  assertEqual(`${caseName} keeps source`, (venue.metadata as any).data_source, 'r_imax_csv');
  assert(`${caseName} keeps raw source row`, Boolean(venue.source_143190));
}

const digitalOnly = venues.find((item) => item.caseName === 'digital_only_cola')!.venue as any;
assertEqual('digital-only has one projection mode', digitalOnly.projections.length, 1);
assertEqual('digital-only mode is digital', digitalOnly.projections[0].mode, 'digital');
assertEqual('digital-only max digital AR preserved', digitalOnly.projections[0].min_content_ar_supported, 1.90);
assertEqual('digital-only does not claim 15/70', digitalOnly.capabilities.supports_1570_film, false);

const hybrid = venues.find((item) => item.caseName === 'hybrid_cola_1570')!.venue as any;
assertEqual('hybrid has two projection modes', hybrid.projections.length, 2);
assertEqual('hybrid default projection remains digital', hybrid.projection.mode, 'digital');
assertEqual('hybrid digital max AR from 143190', hybrid.projections[0].min_content_ar_supported, 1.90);
assertEqual('hybrid film mode supports 1.43', hybrid.projections[1].min_content_ar_supported, 1.43);
assertEqual('hybrid claims 15/70 film capability', hybrid.capabilities.supports_1570_film, true);

const physical143 = venues.find((item) => item.caseName === 'physical_143_unknown_digital_ar')!.venue as any;
assertEqual('1.43 physical screen does not infer 1.43 digital', physical143.projections[0].min_content_ar_supported, 1.90);
assertEqual('1.43 physical screen does not claim digital 1.43', physical143.capabilities.supports_143_digital, false);

const sparse = venues.find((item) => item.caseName === 'missing_screen_dimensions')!.venue as any;
assertEqual('sparse import is allowed with low confidence', sparse.metadata.confidence, 'low');
assert('sparse import leaves screen dimensions absent', sparse.screen.width_m === undefined && sparse.screen.height_m === undefined);

console.log('\n==============================');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} checks`);
console.log('==============================\n');

process.exit(failed > 0 ? 1 : 0);
