import type { ContentFormat } from '../math';

import imaxGtDualLaser from './presets/imax_gt_dual_laser.json';
import imaxCola from './presets/imax_cola.json';
import imaxDualXenon from './presets/imax_dual_xenon.json';
import imax1570Film from './presets/imax_1570_film.json';
import imaxDomeFilm from './presets/imax_dome_film.json';
import imaxDomeLaser from './presets/imax_dome_laser.json';
import dolbyCinema from './presets/dolby_cinema.json';
import dolbyCinemaSingleLaser from './presets/dolby_cinema_single_laser.json';
import rpx from './presets/rpx.json';
import standardMultiplex from './presets/standard_multiplex.json';
import screenx from './presets/screenx.json';
import cinemarkXd from './presets/cinemark_xd.json';

import appleProvidenceImax from './venues/apple_providence_imax.json';
import mugarOmniBoston from './venues/mugar_omni_boston.json';

import oledFlagship from './home_display_presets/oled_flagship.json';
import oledMidrange from './home_display_presets/oled_midrange.json';
import miniledQled from './home_display_presets/miniled_qled.json';
import standardQled from './home_display_presets/standard_qled.json';
import standardLcd from './home_display_presets/standard_lcd.json';
import iphonePro from './home_display_presets/iphone_pro.json';
import androidFlagship from './home_display_presets/android_flagship.json';
import homeProjector from './home_display_presets/home_projector.json';

import contentFormats from './content_formats/content_formats.json';

export const FORMAT_PRESETS: Record<string, any>[] = [
  imaxGtDualLaser,
  imaxCola,
  imaxDualXenon,
  imax1570Film,
  imaxDomeFilm,
  imaxDomeLaser,
  dolbyCinema,
  dolbyCinemaSingleLaser,
  rpx,
  standardMultiplex,
  screenx,
  cinemarkXd,
];

export const FORMAT_PRESET_MAP = new Map<string, Record<string, any>>(
  FORMAT_PRESETS.map((preset) => [preset.id, preset])
);

export const STATIC_VENUE_RECORDS: Record<string, any>[] = [
  appleProvidenceImax,
  mugarOmniBoston,
];

export const HOME_DISPLAY_PRESETS: Record<string, any>[] = [
  oledFlagship,
  oledMidrange,
  miniledQled,
  standardQled,
  standardLcd,
  iphonePro,
  androidFlagship,
  homeProjector,
];

export const CONTENT_FORMATS = contentFormats as ContentFormat[];
