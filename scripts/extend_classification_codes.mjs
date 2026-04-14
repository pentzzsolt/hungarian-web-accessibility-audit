/**
 * @typedef {Object.<string, string>} AnalyticalSampleRow
 * @property {string} Domain
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { arbevetel_map, ev_map, letszam_map } from './consts/index.mjs'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv');
const analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8');

/** @type {AnalyticalSampleRow[]} */
const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const updated_analytical_sample = analytical_sample.map(item => {
  const letszam = parseInt(item['Létszám']);
  const letszam_data = letszam_map.find(item => letszam >= item.lower_bound && letszam <= item.upper_bound)
  
  const arbevetel = parseInt(item['Nettó árbevétel']);
  let arbevetel_data
  if (!isNaN(arbevetel)) {
    arbevetel_data = arbevetel_map.find(item => arbevetel >= item.lower_bound && arbevetel <= item.upper_bound)
  } else {
    arbevetel_data = undefined
  }

  const alapitas = parseInt(item['Alapítás éve'])
  const alapitas_data = ev_map.find(item => alapitas >= item.lower_bound && alapitas <= item.upper_bound)

  const euro = 397.91
  let category = ''
  if (!isNaN(letszam) && !isNaN(arbevetel)) {
    if (letszam < 10 && arbevetel <= 2000000 * euro) category = 'mikrovállalkozás'
    else if (letszam < 50 && arbevetel <= 10000000 * euro) category = 'kisvállalkozás'
    else if (letszam < 250 && arbevetel <= 50000000 * euro) category = 'középvállalkozás'
    else category = 'nagyvállalat'
  }

  return {
    ...item,
    'Létszám kód': letszam_data ? letszam_data['Kód'] : '00',
    'Létszám intervallum': letszam_data ? letszam_data['Létszám (fő)'] : 'ismeretlen',
    'Árbevétel-kategória (kód)': arbevetel_data ? arbevetel_data['Kód'] : 0,
    'Árbevétel-kategória (millió Ft)': arbevetel_data ? arbevetel_data['Millió Ft'] : 'ismeretlen',
    'Alapítás éve (intervallum)': alapitas_data ? alapitas_data['Alapítás éve (intervallum)'] : '',
    'KKV': category
  }
})

await writeFile(analytical_sample_file_path, stringify(updated_analytical_sample, {
  header: true
}), 'utf8');
