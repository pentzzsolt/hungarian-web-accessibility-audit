/**
 * @typedef {Object.<string, string>} AnalyticalSampleRow
 * @property {string} Domain
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv');
const analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8');

/** @type {AnalyticalSampleRow[]} */
const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const updated_analytical_sample = analytical_sample.map(item => {
  const copy = { ...item }
  delete copy['Üzemeltető']
  return copy
})

await writeFile(analytical_sample_file_path, stringify(updated_analytical_sample, {
  header: true
}), 'utf8');
