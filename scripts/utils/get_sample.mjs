import path from 'path';
import ExcelJS from 'exceljs';

async function returnExcelColumn(file, options = { column: 'A', startRow: 1 }) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const sheet = workbook.worksheets[0];
  const column = [];
  for (let i = options.startRow; i <= sheet.rowCount; i++) {
    const cell = sheet.getCell(`${options.column}${i}`).value;
    if (cell && typeof cell === 'string') {
      column.push(cell);
    }
  }
  return column;
}

export async function getSample() {
  const allDomains = await returnExcelColumn(path.resolve('data/processed/hungarian_websites.xlsx'), { column: 'A', startRow: 2 });
  const failedDomains = await returnExcelColumn(path.resolve('data/processed/failed_domains.xlsx'));
  const domains = allDomains.map((domain, index) => ({ domain, rank: index + 1 })).filter(domain => !failedDomains.includes(domain.domain));
  return domains;
}
