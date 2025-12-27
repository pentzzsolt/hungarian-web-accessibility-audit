/**
 * @typedef {Object.<string, string>} AnalyticalSampleRow
 * @property {string} Domain
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { mean, median, std } from 'mathjs'
import { linearRegression, normalizedLinearRegression } from './utils/linear_regression.mjs';

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv')
const analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8');

/** @type {AnalyticalSampleRow[]} */
const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

/** @type {Record<string, number[]>} */
const error_numbers_by_domain = {}

analytical_sample.forEach(item => {
  error_numbers_by_domain[item.Domain] = []
})

const summariesDir = resolve('results/summaries');
const summaryFiles = await readdir(summariesDir);

for (const file of summaryFiles) {
  const content = await readFile(join(summariesDir, file), 'utf8');
  const summary = JSON.parse(content);
  analytical_sample.forEach(item => {
    const domain_summary = summary.find(summary_entry => summary_entry.domain === item.Domain)
    error_numbers_by_domain[item.Domain].push(domain_summary.errors)
  })
}

const updated_analytical_sample = analytical_sample.map(item => {
  const domain = item.Domain,
        list = error_numbers_by_domain[domain],
        min = Math.min(...list),
        max = Math.max(...list),
        meanOfErrors = mean(list),
        stdOfErrors = std(...list);

  return { ...item, 
    'Lineáris trend meredeksége': linearRegression(list).slope,
    'Lineáris trend meredeksége (normalizált)': normalizedLinearRegression(list)?.slope,
    'Átlagos akadálymentességi hibaszám': meanOfErrors,
    'Akadálymentességi hibaszám mediánja': median(list),
    'Szórás': stdOfErrors,
    'Relatív szórás': meanOfErrors ? stdOfErrors / meanOfErrors : undefined,
    'Minimum érték': min,
    'Maximum érték': max,
    'Terjedelem': max - min,
  }
})

await writeFile(analytical_sample_file_path, stringify(updated_analytical_sample, {
  header: true
}), 'utf8');
