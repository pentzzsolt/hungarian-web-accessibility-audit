import fs from 'fs/promises';
import path from 'path';
import { getFailedDomains } from './utils/get_failed_domains.mjs';

const auditsDirectory = path.resolve('results/audits');
const auditDirectoryEntries = await fs.readdir(auditsDirectory, { withFileTypes: true });

const failedDomains = await getFailedDomains();

let deletedCount = 0;
for (const directory of auditDirectoryEntries) {
  if (!directory.isDirectory()) continue;
  const fullPath = path.join(auditsDirectory, directory.name);
  const files = await fs.readdir(fullPath);

  for (const file of files) {
    const domain = path.basename(file, '.json');
    if (failedDomains.includes(domain)) {
      const filePath = path.join(fullPath, file);
      await fs.unlink(filePath);
      deletedCount++;
      console.log(`Deleted: ${filePath}`);
    }
  }
}

console.log(`Deleted ${deletedCount} audit files.`);
