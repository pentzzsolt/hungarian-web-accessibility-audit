/**
 * @typedef {{
 *   'Gazdálkodási forma főcsoportjának kódja': string,
 *   'Gazdálkodási forma főcsoportjának megnevezése': string,
 *   'Gazdálkodási forma csoportjának kódja': string,
 *   'Gazdálkodási forma csoportjának megnevezése': string,
 *   'Gazdálkodási forma kódja': string,
 *   'Gazdálkodási forma megnevezése': string,
 * }} Gfo
 */

import { resolve } from 'path';
import ExcelJS from 'exceljs';

const gfo_file_path = resolve('data/raw/gfo21_07_struktura.xlsx');
const gfo_workbook = new ExcelJS.Workbook();
await gfo_workbook.xlsx.readFile(gfo_file_path);
const sheet = gfo_workbook.worksheets[0];

/** @type {Record<string, Gfo>} */
const gfo_map = {};

let focsoportKod = '',
    focsoportNev = '',
    csoportKod = '',
    csoportNev = '';

sheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1 || rowNumber === 2) return;

  const kod = row.getCell(1).text.trim();
  const nev = row.getCell(2).text.trim();

  if (kod.length === 1) {
    focsoportKod = kod;
    focsoportNev = nev;
  } else if (kod.length === 2) {
    csoportKod = kod;
    csoportNev = nev;
  } else if (kod.length === 3) {
    gfo_map[kod] = {
      'Gazdálkodási forma főcsoportjának kódja': focsoportKod,
      'Gazdálkodási forma főcsoportjának megnevezése': focsoportNev,
      'Gazdálkodási forma csoportjának kódja': csoportKod,
      'Gazdálkodási forma csoportjának megnevezése': csoportNev,
      'Gazdálkodási forma kódja': kod,
      'Gazdálkodási forma megnevezése': nev
    }
  }
});

export { gfo_map };
