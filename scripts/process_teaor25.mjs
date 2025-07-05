import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../data/raw/teaor25_struktura.xlsx');
const outputPath = path.join(__dirname, '../data/processed/teaor25_tree.xlsx');

const workbook = new ExcelJS.Workbook();
const outputWorkbook = new ExcelJS.Workbook();
const outputSheet = outputWorkbook.addWorksheet("TEÁOR'25 struktúra");

outputSheet.addRow([
  'Nemzetgazdasági ág kód', 'Nemzetgazdasági ág név',
  'Ágazat kód', 'Ágazat név',
  'Alágazat kód', 'Alágazat név',
  'Szakágazat kód', 'Szakágazat név'
]);

async function main() {
  await workbook.xlsx.readFile(inputPath);
  const sheet = workbook.worksheets[0];

  let nemzetgazdasagiAgCode = '',
      nemzetgazdasagiAgName = '',
      agazatCode = '',
      agazatName = '',
      alagazatCode = '',
      alagazatName = '';

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const code = row.getCell(1).text.trim();
    const name = row.getCell(2).text.trim();

    if (code.length === 1) {
      nemzetgazdasagiAgCode = code;
      nemzetgazdasagiAgName = name;
    } else if (code.length === 2) {
      agazatCode = code;
      agazatName = name;
      alagazatCode = alagazatName = '';
    } else if (code.length === 4) {
      alagazatCode = code;
      alagazatName = name;
    } else if (code.length === 5) {
      outputSheet.addRow([
        nemzetgazdasagiAgCode, nemzetgazdasagiAgName,
        agazatCode, agazatName,
        alagazatCode, alagazatName,
        code, name
      ]);
    }
  });

  await outputWorkbook.xlsx.writeFile(outputPath);
}

main().catch(console.error);
