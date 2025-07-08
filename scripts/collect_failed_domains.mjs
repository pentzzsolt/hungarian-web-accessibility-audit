import fs from 'fs/promises';
import path from 'path';
import ExcelJS from 'exceljs';

const resultsDir = path.resolve('results/runs');
const outputPath = path.resolve('data/processed/failed_domains.xlsx');

async function collectFailedDomains() {
  const failedDomains = new Set();

  const files = await fs.readdir(resultsDir);
  for (const file of files) {
    const content = await fs.readFile(path.join(resultsDir, file), 'utf8');
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

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('failed_domains');

  Array.from(failedDomains).forEach((domain, index) => {
    sheet.getCell(`A${index + 1}`).value = domain;
  });

  await workbook.xlsx.writeFile(outputPath);
}

collectFailedDomains();
