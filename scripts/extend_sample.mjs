/**
 * @typedef {Object.<string, string>} AnalyticalSampleRow
 * @property {string} Domain
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv'),
      analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8'),
      summariesDir = resolve('results/summaries'),
      summaryFiles = await readdir(summariesDir);

/** @type {AnalyticalSampleRow[]} */
const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const results = {}
for (const file of summaryFiles) {
  const date = file.replace('.json', ''),
        content = await readFile(join(summariesDir, file), 'utf8');

  JSON.parse(content).forEach(measurement => {
    if (results[measurement.domain] === undefined) results[measurement.domain] = {}
    results[measurement.domain][date] = measurement.errors
  });
}

const updated_analytical_sample = analytical_sample.map(item => {
  return {
    ...item,
    ...results[item.Domain]
  }
})

await writeFile(analytical_sample_file_path, stringify(updated_analytical_sample, {
  header: true
}), 'utf8');
