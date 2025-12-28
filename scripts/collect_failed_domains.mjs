import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const resultsDir = resolve('results/runs');
const outputPath = resolve('data/processed/failed_domains.csv');

const failedDomains = new Set();

const files = await readdir(resultsDir);
for (const file of files) {
  const content = await readFile(join(resultsDir, file), 'utf8');
  try {
    const data = JSON.parse(content);
    data.failedAudits.forEach(item => {
      if (item.domain) failedDomains.add(item.domain);
    });
  } catch (error) {
    console.error(`Error parsing JSON from file ${file}:`, error);
    continue;
  }
}

const initial_sample_file_path = resolve('data/processed/initial_sample.csv'),
      initial_sample_file = await readFile(initial_sample_file_path, 'utf8'),
      initial_sample = parse(initial_sample_file, {
        columns: true
      });

const failed_domain_list = initial_sample.filter(item => failedDomains.has(item.Domain))

await writeFile(outputPath, stringify(failed_domain_list, {
  header: true
}), 'utf8');
