// LIEMAX — Static state → region → nearest True IMAX lookup
// True IMAX = IMAX GT Laser (1.43:1 screen, genuine dual-4K GT projector)
// All 16 GT Laser venue IDs verified against docs/data.js (2026-05-03).
//
// Design note: This is a state-level mapping, not drive-distance routing.
// For large states (CA, TX, NY, WA) the default maps to the most populous
// sub-region. The norcal region is defined in REGION_VENUES for callers
// that resolve a city/zip to a sub-region independently.

window.LIEMAX_REGIONS = (function () {

  // ---------------------------------------------------------------------------
  // National fallback — best single IMAX screen in the US
  // ---------------------------------------------------------------------------
  const NATIONAL_FALLBACK_ID = 'imax_us_ny_new_york_amc_lincoln_square_13_and_imax';

  // ---------------------------------------------------------------------------
  // State code (2-letter, uppercase) → region key
  //
  // CA  → socal  (default; NorCal callers should resolve to 'norcal' by city)
  // NY  → nyc    (default; upstate NY callers receive the national fallback if
  //                they are too far from Lincoln Square — acceptable at state level)
  // TX  → texas_austin  (single GT Laser in the state; all sub-regions point here)
  // WA  → pacific_nw   (Seattle venue covers the whole state)
  // ---------------------------------------------------------------------------
  const STATE_TO_REGION = {
    // New England
    'CT': 'new_england',
    'ME': 'new_england',
    'MA': 'new_england',
    'NH': 'new_england',
    'RI': 'new_england',
    'VT': 'new_england',

    // NYC metro (NJ is geographically part of the NYC metro)
    'NY': 'nyc',
    'NJ': 'nyc',

    // Mid-Atlantic / DC metro
    'DC': 'dc_metro',
    'VA': 'dc_metro',
    'MD': 'dc_metro',
    'DE': 'dc_metro',
    'PA': 'dc_metro',
    'WV': 'dc_metro',   // WV is closer to Chantilly VA than to any other GT Laser

    // Southeast
    'GA': 'southeast_ga',
    'SC': 'southeast_ga',
    'NC': 'southeast_ga',
    'AL': 'southeast_ga',
    'MS': 'southeast_ga',
    'LA': 'southeast_ga',  // Pooler GA is closer than Fort Lauderdale for most of LA

    // South Florida
    'FL': 'southeast_fl',

    // Mid-South / Appalachia
    'TN': 'mid_south_tn',
    'KY': 'mid_south_tn',

    // Midwest — Iowa / Upper Midwest / Great Lakes
    'IA': 'midwest_ia',
    'MN': 'midwest_ia',
    'WI': 'midwest_ia',
    'ND': 'midwest_ia',
    'SD': 'midwest_ia',
    'NE': 'midwest_ia',
    'IL': 'midwest_ia',
    'IN': 'midwest_ia',
    'MI': 'midwest_ia',
    'OH': 'dc_metro',       // Eastern OH residents are closer to Chantilly than Waukee

    // Missouri / Ozarks / Plains
    'MO': 'ozarks_mo',
    'KS': 'ozarks_mo',
    'OK': 'ozarks_mo',
    'AR': 'ozarks_mo',

    // Texas (one GT Laser in the whole state — Austin Bullock Museum)
    'TX': 'texas_austin',

    // Southwest / Mountain
    'AZ': 'southwest_az',
    'NM': 'southwest_az',
    'CO': 'southwest_az',   // No GT Laser in CO; Grand Canyon is nearest
    'UT': 'southwest_az',
    'WY': 'southwest_az',

    // Nevada: Las Vegas is significantly closer to SoCal GT Lasers
    'NV': 'socal',

    // California: state-level default is SoCal (most populous end of the state).
    // Callers that know a city is in the Bay Area / Sacramento / NorCal should
    // pass 'norcal' directly to REGION_VENUES.
    'CA': 'socal',

    // Pacific Northwest
    'WA': 'pacific_nw',
    'OR': 'pacific_nw',
    'ID': 'pacific_nw',
    'MT': 'pacific_nw',     // Closest GT Laser to MT is Seattle

    // Alaska & Hawaii — no nearby GT Laser; national fallback
    'AK': 'national',
    'HI': 'national',
  };

  // ---------------------------------------------------------------------------
  // Region definitions
  // venueIds: primary venue first, additional venues in priority order
  // ---------------------------------------------------------------------------
  const REGION_VENUES = {

    new_england: {
      label: 'New England',
      venueIds: [
        'imax_us_ma_reading_sunbrella_imax_3d_theater_reading', // Jordan's Furniture Reading MA — GT Laser
      ],
      note: "Jordan's Furniture Reading (MA) is New England's only IMAX GT Laser. " +
            'Apple Cinemas Providence RI has 15/70 film capability but runs CoLa Digital day-to-day.',
    },

    nyc: {
      label: 'New York City / NYC Metro',
      venueIds: [
        'imax_us_ny_new_york_amc_lincoln_square_13_and_imax', // AMC Lincoln Square — GT Laser + 15/70
      ],
      note: 'AMC Lincoln Square is the largest GT Laser screen on the East Coast and retains 15/70 film capability.',
    },

    dc_metro: {
      label: 'Washington DC / Mid-Atlantic',
      venueIds: [
        'imax_us_va_chantilly_airbus_imax_steven_f_udvar_hazy_center',           // Udvar-Hazy, Chantilly VA — GT Laser (larger)
        'imax_us_dc_washington_lockheed_martin_imax_national_air_and_space_museum', // NASM DC — GT Laser
      ],
      note: 'Steven F. Udvar-Hazy Center (Chantilly VA) and the National Air & Space Museum (DC) are both GT Laser. ' +
            'Udvar-Hazy has the larger screen.',
    },

    southeast_ga: {
      label: 'Southeast (GA / SC / NC / AL / MS / LA)',
      venueIds: [
        'imax_us_ga_pooler_royal_cinemas_and_imax', // Royal Cinemas & IMAX, Pooler GA — GT Laser
      ],
      note: 'Royal Cinemas & IMAX in Pooler (Savannah metro, GA) is the only GT Laser in the Deep South.',
    },

    southeast_fl: {
      label: 'South Florida',
      venueIds: [
        'imax_us_fl_fort_lauderdale_autonation_imax_museum_of_discovery_and_science', // Fort Lauderdale — GT Laser
      ],
      note: "AutoNation IMAX at Fort Lauderdale's Museum of Discovery & Science is Florida's only GT Laser.",
    },

    mid_south_tn: {
      label: 'Tennessee / Kentucky / Mid-South',
      venueIds: [
        'imax_us_tn_chattanooga_imax_3d_tennessee_aquarium', // Tennessee Aquarium, Chattanooga — GT Laser
      ],
      note: 'IMAX 3D at the Tennessee Aquarium in Chattanooga is the only GT Laser in TN/KY.',
    },

    midwest_ia: {
      label: 'Midwest (Iowa / Upper Midwest / Great Lakes)',
      venueIds: [
        'imax_us_ia_waukee_the_palms_theatre_and_imax', // The Palms Theatre & IMAX, Waukee IA — GT Laser
      ],
      note: 'The Palms Theatre & IMAX in Waukee (Des Moines suburb, Iowa) is the only GT Laser in the upper Midwest. ' +
            'There is no GT Laser in Illinois, Indiana, Michigan, Wisconsin, or Minnesota.',
    },

    ozarks_mo: {
      label: 'Missouri / Ozarks / Kansas / Oklahoma / Arkansas',
      venueIds: [
        "imax_us_mo_branson_branson_s_imax_entertainment_complex", // Branson MO — GT Laser
      ],
      note: "Branson's IMAX Entertainment Complex in Branson, MO is the GT Laser for the Ozarks region.",
    },

    texas_austin: {
      label: 'Texas',
      venueIds: [
        'imax_us_tx_austin_imax_the_bullock_texas_state_history_museum', // Bullock Museum, Austin TX — GT Laser
      ],
      note: "The Bullock Texas State History Museum IMAX in Austin is Texas's only GT Laser. " +
            'DFW, Houston, and San Antonio have IMAX CoLa/Xenon multiplexes but no GT Laser.',
    },

    southwest_az: {
      label: 'Southwest (AZ / NM / CO / UT / WY)',
      venueIds: [
        'imax_us_az_grand_canyon_grand_canyon_imax_grand_canyon_visitor_center', // Grand Canyon Visitor Center — GT Laser
      ],
      note: 'Grand Canyon IMAX at the Grand Canyon Visitor Center is the only GT Laser in the Southwest. ' +
            'This is a destination venue; CO/UT residents may find the Waukee IA or San Francisco venues more accessible.',
    },

    socal: {
      label: 'Southern California / Nevada',
      venueIds: [
        'imax_us_ca_hollywood_tcl_chinese_theatres_imax',                               // TCL Chinese Theatres, Hollywood — GT Laser (flagship)
        'imax_us_ca_universal_city_universal_cinema_amc_at_citywalk_hollywood_and_imax', // Universal CityWalk AMC — GT Laser
        'imax_us_ca_los_angeles_imax_california_science_center',                        // California Science Center, LA — GT Laser
      ],
      note: 'Southern California has three GT Laser venues in the Hollywood/LA corridor. ' +
            'TCL Chinese Theatres is the flagship commercial venue; California Science Center is a museum theater.',
    },

    norcal: {
      label: 'Northern California',
      venueIds: [
        'imax_us_ca_san_francisco_amc_metreon_16_and_imax', // AMC Metreon 16, San Francisco — GT Laser
      ],
      note: 'AMC Metreon 16 in San Francisco is the only GT Laser in Northern California. ' +
            "State-level CA lookups default to SoCal; pass 'norcal' directly for Bay Area / Sacramento queries.",
    },

    pacific_nw: {
      label: 'Pacific Northwest (WA / OR / ID / MT)',
      venueIds: [
        'imax_us_wa_seattle_boeing_imax_pacific_science_center', // Boeing IMAX, Pacific Science Center, Seattle — GT Laser
      ],
      note: 'Boeing IMAX at the Pacific Science Center in Seattle is the only GT Laser in the Pacific Northwest.',
    },

    national: {
      label: 'best IMAX in the US',
      venueIds: [
        NATIONAL_FALLBACK_ID,
      ],
      note: 'No GT Laser venue is nearby. AMC Lincoln Square in NYC is widely considered the best IMAX theater in the United States.',
    },

  };

  // ---------------------------------------------------------------------------
  // getNearestTrueImax(stateCode)
  //
  // stateCode — 2-letter US state/territory code (case-insensitive)
  //
  // Returns:
  //   { venueIds: string[], label: string, note?: string, isFallback: boolean }
  //
  // isFallback=true means no regional GT Laser was found; venueIds contains
  // the national fallback (Lincoln Square) and label is 'best IMAX in the US'.
  // ---------------------------------------------------------------------------
  function getNearestTrueImax(stateCode) {
    if (!stateCode) {
      return _fallback();
    }

    const key = String(stateCode).toUpperCase().trim();
    const regionKey = STATE_TO_REGION[key];

    if (!regionKey || regionKey === 'national' || !REGION_VENUES[regionKey]) {
      return _fallback();
    }

    const r = REGION_VENUES[regionKey];
    return {
      venueIds: r.venueIds,
      label: r.label,
      note: r.note,
      isFallback: false,
    };
  }

  function _fallback() {
    return {
      venueIds: [NATIONAL_FALLBACK_ID],
      label: REGION_VENUES.national.label,
      note: REGION_VENUES.national.note,
      isFallback: true,
    };
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  return {
    getNearestTrueImax,
    STATE_TO_REGION,
    REGION_VENUES,
    NATIONAL_FALLBACK_ID,
  };

})();
