import ExcelJS from 'exceljs';

export async function returnExcelColumn(file, options = { column: 'A', startRow: 1 }) {
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
