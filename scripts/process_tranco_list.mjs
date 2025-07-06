import fs from 'fs';
import ExcelJS from 'exceljs';

const input = fs.readFileSync('data/raw/tranco_9WN82.csv', 'utf8');

const hungarianWebsites = input.split(/\n/).map(row => row.trim()).filter(row => row.length).map(row => row.split(',')[1]).filter(domain => domain.endsWith('.hu')).slice(0, 1000);

const outputPath = 'data/processed/hungarian_websites.xlsx';

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('hungarian_websites');

hungarianWebsites.forEach((domain, index) => {
  sheet.getCell(`A${index + 2}`).value = domain;
});

await workbook.xlsx.writeFile(outputPath);
