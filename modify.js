//modify for un46
const geojsonArea = require('@mapbox/geojson-area')

const preProcess = (f) => {
  f.tippecanoe = {
    layer: 'other',
    minzoom: 15,
    maxzoom: 15
  }
  // name
  if (
    f.properties.hasOwnProperty('en_name') ||
    f.properties.hasOwnProperty('int_name') ||
    f.properties.hasOwnProperty('name') ||
    f.properties.hasOwnProperty('ar_name')
  ) {
    let name = ''
    if (f.properties['en_name']) {
      name = f.properties['en_name']
    } else if (f.properties['int_name']) {
      name = f.properties['int_name']
    } else if (f.properties['name']) {
      name = f.properties['name']
    } else {
      name = f.properties['ar_name']
    }
    delete f.properties['en_name']
    delete f.properties['ar_name']
    delete f.properties['int_name']
    delete f.properties['name']
    f.properties.name = name
  }
  return f
}

const postProcess = (f) => {
  delete f.properties['_database']
  delete f.properties['_table']
  return f
}

const flap = (f, defaultZ) => {
  switch (f.geometry.type) {
    case 'MultiPolygon':
    case 'Polygon':
      let mz = Math.floor(
        19 - Math.log2(geojsonArea.geometry(f.geometry)) / 2
      )
      if (mz > 15) { mz = 15 }
      if (mz < 6) { mz = 6 }
      return mz
    default:
      return defaultZ ? defaultZ : 10
  }
}

const lut = {
 // Base
  custom_planet_land_a_l08: f => {
    f.tippecanoe = {
      layer: 'landmass',
      minzoom: 6,
      maxzoom: 7
    }
    delete f.properties['objectid']
    delete f.properties['fid_1']
    return f
  },
  custom_planet_land_a: f => {
    f.tippecanoe = {
      layer: 'landmass',
      minzoom: 8,
      maxzoom: 15
    } 
    delete f.properties['objectid']
    delete f.properties['fid_1']
    return f
  },
 // Admin
  unhq_bndl: f => {
    f.tippecanoe = {
      layer: 'bndl',
      maxzoom: 15
    }
    f.properties._source = 'hq'
    delete f.properties['objectid']
    delete f.properties['bdytyp_code']

  if (f.properties.bdytyp === 'Administrative boundary 2') {
    f.tippecanoe.minzoom = 7
  } else if (f.properties.bdytyp === 'Administrative boundary 3') {
    f.tippecanoe.minzoom = 9
  } else {
    f.tippecanoe.minzoom = 6
  }
  if (f.properties.iso3cd === 'COL' || f.properties.iso3cd === 'COL_ECU' || f.properties.iso3cd === 'COL_PER' || f.properties.iso3cd === 'COL_VEN' || f.properties.iso3cd === 'BRA_COL' || f.properties.iso3cd === 'COL_PAN') {
    delete f
  }
    return f
  },
  custom_unmap_0_bndl: f => {
    f.tippecanoe = {
      layer: 'bndl',
      maxzoom: 15
    }
    f.properties._source = 'c'
    delete f.properties['objectid']
    delete f.properties['name1']
    delete f.properties['cnty1']
    delete f.properties['name2']
    delete f.properties['cnty2']
    delete f.properties['adm1_name1']
    delete f.properties['adm1_name2']
    delete f.properties['adm2_name1']
    delete f.properties['adm2_name2']
  if (f.properties.type === 'Subnational 1') {
    f.tippecanoe.minzoom = 6
    f.properties.bdytyp = 'Administrative boundary 1'
  } else if (f.properties.type === 'Subnational 2') {
    f.tippecanoe.minzoom = 7
    f.properties.bdytyp = 'Administrative boundary 2'
  } else {
    f.tippecanoe.minzoom = 6
    f.properties.bdytyp = 'no_type'
  }
    delete f.properties['type_code']
    delete f.properties['type']
    return f
  },
  un_unmik_bndl: f => {
    f.tippecanoe = {
      layer: 'bndl',
       maxzoom: 15
    }
    f.properties._source = 'mik'
    delete f.properties['objectid']
  if (f.properties.boundary_type === 'Administrative boundary 2') {
    f.tippecanoe.minzoom = 7
    f.properties.bdytyp = 'Administrative boundary 2'
  } else if (f.properties.boundary_type === 'Administrative boundary 3') {
    f.tippecanoe.minzoom = 9
    f.properties.bdytyp = 'Administrative boundary 3'
  } else {
    f.tippecanoe.minzoom = 7
    f.properties.bdytyp = 'no_type'
  }
    delete f.properties['boundary_type']
    delete f.properties['boundary_type_code']
    return f
  },
  un_unvmc_igac_bndl: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd',
      maxzoom: 15
    }
    f.properties._source = 'vmc'
    delete f.properties['objectid']
  if (f.properties.level === 'Administrative boundary 2') {
    f.tippecanoe.minzoom = 7
    f.properties.bdytyp = 'Administrative boundary 2'
  } else if (f.properties.level === 'Administrative boundary 3') {
    f.tippecanoe.minzoom = 9
    f.properties.bdytyp = 'Administrative boundary 3'
  } else {
    f.tippecanoe.minzoom = 6
    f.properties.bdytyp = f.properties.level
  }
    delete f.properties['level']
    delete f.properties['level_code']
    return f
  },

 //Hydro
  custom_ne_rivers_lakecentrelines: f => {
    f.tippecanoe = {
      layer: 'un_water',
      minzoom: 6,
      maxzoom: 7
    }
    delete f.properties['objectid']
    delete f.properties['strokeweig']
    delete f.properties['featurecla']
    delete f.properties['dissolve']
    delete f.properties['note']
    return f
  },

 //Land Use
  un_mission_lc_ls: f => {
    f.tippecanoe = {
      layer: 'landcover',
      minzoom: 10,
      maxzoom: 15
    }
  if (f.properties.gridcode == 20 || f.properties.gridcode == 30 || f.properties.gridcode == 80) {
    delete f.properties['objectid']
    delete f.properties['landcover']
  } else {
    delete f  
  }
    return f
  },
  un_glc30_global_lc_ms: f => {
    f.tippecanoe = {
      layer: 'landcover',
      minzoom: 6,
      maxzoom: 9
    }
  if (f.properties.gridcode == 20 || f.properties.gridcode == 30 || f.properties.gridcode == 80) {
    delete f.properties['id']
    delete f.properties['objectid']
  } else {
    delete f  
  }
    return f
  },

 //Places
  un_global_places: f => {
    f.tippecanoe = {
      layer: 'un_place',
      minzoom: 6,
      maxzoom: 15
    }
  if (f.properties.type === 'Town' || f.properties.type === 'Village') {
    f.tippecanoe.minzoom = 7
  } else if (f.properties.type === 'Suburb' || f.properties.type === 'Other Populated Places') {
    f.tippecanoe.minzoom = 11
  } else {
    f.tippecanoe.minzoom = 6 
  }
    delete f.properties['objectid']
    return f
  },
  unhq_popp: f => {
    f.tippecanoe = {
      layer: 'un_popp',
      maxzoom: 15
    }

  if (f.properties.cartolb === 'Alofi' ||f.properties.cartolb === 'Avarua' ||f.properties.cartolb === 'Sri Jayewardenepura Kotte' ) {
    delete f
  } else if (f.properties.poptyp_code == 1 || f.properties.poptyp_code == 2) {
    f.tippecanoe.minzoom = 6 
  } else if (f.properties.poptyp_code == 3 && f.properties.scl_id_code == 10) {
    f.tippecanoe.minzoom = 6
  } else {
    delete f
  } 
   return f
  },



//labels
  unhq_cm02_phyp_anno_l06: f => {
    f.tippecanoe = {
      layer: 'lab_water_m',
      minzoom: 6,
      maxzoom: 10
    }
    return f
  },
  unhq_phyp: f => {
    f.tippecanoe = {
      layer: 'label',
      minzoom: 5,
      maxzoom: 15
    }
//edit 2021-01-27 starts
f.properties.display = 0
if (f.properties.type_code == 4 && !/Sea|Ocean|Gulf/.test(f.properties.name) ){
f.properties.display = 1
}
//edit 2021-01-27 ends

    return f
  },

 unhq_bnda_a1: f => {
    f.tippecanoe = {
      layer: 'hq_bnd',
      minzoom: 6,
      maxzoom: 8
    }
    return f
  },
  unhq_bnda_a2: f => {
    f.tippecanoe = {
      layer: 'hq_bnd',
      minzoom: 9,
      maxzoom: 15
    }
    return f
  },
 unhq_bnda_a1_p: f => {
    f.tippecanoe = {
      layer: 'hq_bnd_lab1',
      minzoom: 6,
      maxzoom: 8
    }
    return f
  },
  unhq_bnda_a2_p: f => {
    f.tippecanoe = {
      layer: 'hq_bnd_lab2',
      minzoom: 9,
      maxzoom: 15
    }
    return f
  },
  custom_unmap_0_bnda_a1: f => {
    f.tippecanoe = {
      layer: 'c_bnd',
      minzoom: 6,
      maxzoom: 8
    }
    return f
  },
  custom_unmap_0_bnda_a2: f => {
    f.tippecanoe = {
      layer: 'c_bnd',
      minzoom: 9,
      maxzoom: 15
    }
    return f
  },
  custom_unmap_0_bnda_a1_p: f => {
    f.tippecanoe = {
      layer: 'c_bnd_lab1',
      minzoom: 6,
      maxzoom: 8
    }
    return f
  },
  custom_unmap_0_bnda_a2_p: f => {
    f.tippecanoe = {
      layer: 'c_bnd_lab2',
      minzoom: 9,
      maxzoom: 15
    }
    return f
  },
  un_unmik_bnda_a2: f => {
    f.tippecanoe = {
      layer: 'mik_bnd',
      minzoom: 7,
      maxzoom: 8
    }
    return f
  },
  un_unmik_bnda_a_p: f => {
    f.tippecanoe = {
      layer: 'mik_bnd_lab2',
      minzoom: 7,
      maxzoom: 8
    }
    return f
  },
  un_unmik_bnda_a3: f => {
    f.tippecanoe = {
      layer: 'mik_bnd',
      minzoom: 9,
      maxzoom: 15
    }
    return f
  },
  un_unmik_bnda_a3_p: f => {
    f.tippecanoe = {
      layer: 'mik_bnd_lab3',
      minzoom: 8,
      maxzoom: 15
    }
    return f
  },
  un_unmik_bndl: f => {
    f.tippecanoe = {
      layer: 'mik_bnd',
      minzoom: 7,
      maxzoom: 15
    }
    return f
  },
  un_unvmc_igac_bnda_a1_departments: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd',
      minzoom: 7,
      maxzoom: 8
    }
    return f
  },
  un_unvmc_igac_bnda_a1_departments_p: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd_lab1',
      minzoom: 7,
      maxzoom: 8
    }
    return f
  },
  un_unvmc_igac_bnda_a2_municipalities: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd',
      minzoom: 9,
      maxzoom: 10
    }
    return f
  },
  un_unvmc_igac_bnda_a2_municipalities_p: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd_lab2',
      minzoom: 9,
      maxzoom: 10
    }
    return f
  },
  un_unvmc_igac_bnda_a3_rural_units: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd',
      minzoom: 11,
      maxzoom: 15
    }
    return f
  },
  un_unvmc_igac_bnda_a3_rural_units_p: f => {
    f.tippecanoe = {
      layer: 'vmc_bnd_lab3',
      minzoom: 11,
      maxzoom: 15
    }
    return f
  },
  unhq_bnda05_cty: f => {
    f.tippecanoe = {
      layer: 'bnd_cty',
      minzoom: 5,
      maxzoom: 11
    }
    return f
  },
  unhq_bnda_cty_anno_l06: f => {
    f.tippecanoe = {
      layer: 'lab_cty',
      minzoom: 5,
      maxzoom: 11
    }
    return f
  },



  // 2. water
  custom_planet_ocean_l08: f => {
    f.tippecanoe = {
      layer: 'ocean',
      minzoom: 5,
      maxzoom: 7
    }
    return f
  },
  custom_planet_ocean: f => {
    f.tippecanoe = {
      layer: 'ocean',
      minzoom: 8,
      maxzoom: 15
    } 
    return f
  },


  // 9. POIs
  un_minusca_pois: f => {
    f.tippecanoe = {
      layer: 'poi_minusca',
      maxzoom: 15
    }
    switch (f.properties.feat_class) {
      //Large airport
      case 'Airport':
         f.tippecanoe.minzoom = 7
        break
      //public
      case 'NGO':
      case 'Police':
      case 'Embassy':
      case 'Consulate':
      case 'Local Authority':
      case 'International Organisation':
      case 'Public Place':
      case 'National Institution':
      case 'Regional Organisation':
      case 'Library':
      case 'Youth Centre':
      case 'Social Centre':
      case 'Military Camp':
         f.tippecanoe.minzoom = 11
        break
      //transport1
      case 'Boat Ramp':
         f.tippecanoe.minzoom = 12
        break
      //service1
      case 'Hospital':
      case 'Health Centre':
      case 'University & College':
      case 'Kindergarten':
      case 'Primary School':
      case 'Secondary School':
      case 'Hotel':
         f.tippecanoe.minzoom = 13
        break
      //worship
      case 'Church':
      case 'Mosque':
         f.tippecanoe.minzoom = 13
        break
      //traffic
      case 'Fuel Station':
         f.tippecanoe.minzoom = 14
        break
/*
      //service2
      case 'Club':
      case 'Restaurant':
         f.tippecanoe.minzoom = 15
        break
      //heritage
      case 'Cemetery':
      case 'Landmark':
         f.tippecanoe.minzoom = 15
        break
      //other
      case 'Market':
      case 'Super Market':	
      case 'Bank':
      case 'RadioTower':
      case 'Telecommunication':
      case 'Stadium':
      case 'Zoo':
         f.tippecanoe.minzoom = 15
        break
*/
     default:
        f.tippecanoe.minzoom = 15
    }
    return f
  },
  un_global_pois: f => {
    f.tippecanoe = {
      layer: 'un_poi',
      maxzoom: 15
    }
    switch (f.properties.type) {
      //Large airport
      case 'Airport':
         f.tippecanoe.minzoom = 7
        break
      //transport1(big)
      case 'Airfield':
      case 'Helipad':
         f.tippecanoe.minzoom = 10
        break
      //public
      case 'NGO':
      case 'UN':
      case 'Post Office':
      case 'Fire Station':
      case 'Prison':
      case 'Police Station':
      case 'Courthouse':
      case 'Embassy':
      case 'Town Hall':
      case 'Other Public Building':
      case 'Military':
         f.tippecanoe.minzoom = 11
        break
      //transport1(small)
      case 'Taxi Station':
      case 'Ferry Terminal':
      case 'Port':
      case 'Bus Station':
      case 'Railway Station':
         f.tippecanoe.minzoom = 12
        break
      //service1
      case 'Hospital':
      case 'University':
      case 'College':
      case 'School':
      case 'Hotel':
         f.tippecanoe.minzoom = 13
        break
      //worship
      case 'Christian':
      case 'Muslim':
         f.tippecanoe.minzoom = 13
        break
      //traffic
      case 'Fuel':
         f.tippecanoe.minzoom = 14
        break
     default:
        f.tippecanoe.minzoom = 15
    }
    return f
  }
}
module.exports = (f) => {
  return postProcess(lut[f.properties._table](preProcess(f)))
}

