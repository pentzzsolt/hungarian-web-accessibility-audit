import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { getExcludedDomains } from './utils/get_excluded_domains.mjs';
import { getFailedDomains } from './utils/get_failed_domains.mjs';

const auditsDirectory = path.resolve('results/audits');
const auditDirectoryEntries = await fs.readdir(auditsDirectory, { withFileTypes: true });

const excludedDomains = await getExcludedDomains();
const failedDomains = await getFailedDomains();

let deletedCount = 0;
for (const directory of auditDirectoryEntries) {
  if (!directory.isDirectory()) continue;
  const fullPath = path.join(auditsDirectory, directory.name);
  const files = await fs.readdir(fullPath);

  for (const file of files) {
    const domain = path.basename(file, '.json');
    if (excludedDomains.includes(domain) || failedDomains.includes(domain)) {
      const filePath = path.join(fullPath, file);
      await fs.unlink(filePath);
      deletedCount++;
      console.log(`Deleted: ${filePath}`);
    }
  }
}

console.log(`Deleted ${deletedCount} audit files.`);

const analytical_sample_file_path = path.resolve('data/processed/analytical_sample.csv')
const analytical_sample_file = await fs.readFile(analytical_sample_file_path, 'utf8');

const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const updated_sample = analytical_sample.filter(item => !excludedDomains.includes(item.Domain) && !failedDomains.includes(item.Domain))

await fs.writeFile(analytical_sample_file_path, stringify(updated_sample, {
  header: true
}), 'utf8');

console.log(`Removed failed audits from sample.`);
