/**
 * @typedef {{
 *   'Nemzetgazdasági ág kódja': string,
 *   'Nemzetgazdasági ág megnevezése': string,
 *   'Ágazat kódja': string,
 *   'Ágazat megnevezése': string,
 *   'Alágazat kódja': string,
 *   'Alágazat megnevezése': string,
 *   'Szakágazat kódja': string,
 *   'Szakágazat megnevezése': string
 * }} Teaor
 */

import { resolve } from 'path';
import ExcelJS from 'exceljs';

const teaor_file_path = resolve('data/raw/teaor25_struktura.xlsx');
const teaor_workbook = new ExcelJS.Workbook();
await teaor_workbook.xlsx.readFile(teaor_file_path);
const sheet = teaor_workbook.worksheets[0];

/** @type {Record<string, Teaor>} */
const teaor_map = {};

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
    teaor_map[code.replace('.', '')] = {
      'Nemzetgazdasági ág kódja': nemzetgazdasagiAgCode,
      'Nemzetgazdasági ág megnevezése': nemzetgazdasagiAgName,
      'Ágazat kódja': agazatCode,
      'Ágazat megnevezése': agazatName,
      'Alágazat kódja': alagazatCode,
      'Alágazat megnevezése': alagazatName,
      'Szakágazat kódja': code,
      'Szakágazat megnevezése': name
    }
  }
});

export { teaor_map };
