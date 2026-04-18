import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { stringify } from 'csv-stringify/sync'
import { getSampleP99 } from './utils/get_sample.mjs';

const output_file_path = resolve('results/error_type_summary.csv'),
      audits_path = resolve('results/audits'),
      dateDirs = await readdir(audits_path, { withFileTypes: true }),
      output = [],
      domains = await getSampleP99();

for (const dirent of dateDirs) {
  if (!dirent.isDirectory()) continue;
  const date = dirent.name;
  const datePath = join(audits_path, date);
  const files = (await readdir(datePath)).filter(file => domains.includes(file.replace(/\.json$/, '')));
  const errors = [];

  for (const file of files) {
    const filePath = join(datePath, file);
    const content = JSON.parse(await readFile(filePath, 'utf8'));

    const issues = Array.isArray(content.issues) ? content.issues : [];
    errors.push(...issues)
  }

  const errorCounts = { date }

  errors.forEach(item => {
    const code = item.code;
    errorCounts[code] = (errorCounts[code] || 0) + 1;
  });

  output.push(errorCounts)
}

await writeFile(output_file_path, stringify(output, {
  header: true
}), 'utf8');
