/**
 * @typedef {Object.<string, string>} AnalyticalSampleRow
 * @property {string} Domain
 */

/**
 * @typedef {Object.<string, string>} DataRow
 * @property {string} 'Adószám'
 * @property {string} 'Alapítás éve'
 * @property {string} 'Létszám'
 * @property {string} 'Nettó árbevétel'
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv'),
      analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8'),
      data_file_path = resolve('data/processed/tax_numbers.csv'),
      data_file = await readFile(data_file_path, 'utf8');

/** @type {AnalyticalSampleRow[]} */
const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

/** @type {DataRow[]} */
const data = parse(data_file, {
  columns: true
})

const updated_analytical_sample = analytical_sample.map(item => {
  const match = data.find(data_row => data_row['Adószám'] === item['Adószám']);

  if (!match) {
    console.log(item['Adószám']);
    return item;
  }

  const { 'Adószám': _, ...extra } = match;
  return {
    ...item,
    ...extra
  };
});

await writeFile(analytical_sample_file_path, stringify(updated_analytical_sample, {
  header: true
}), 'utf8');
