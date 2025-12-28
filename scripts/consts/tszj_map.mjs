/**
 * @typedef {{
 *   'Székhely szerinti vármegye kódja': string,
 *   'Székhely szerinti vármegye megnevezése': string,
 *   'Statisztikai régió kódja': string,
 *   'Statisztikai régió neve': string,
 *   'Statisztikai nagyrégió kódja': string,
 *   'Statisztikai nagyrégió neve': string,
 * }} Tszj
 */

import { resolve } from 'path';
import ExcelJS from 'exceljs';

const tszj_file_path = resolve('data/raw/teruleti_szamjelrendszer_struktura_elemei_2025_megnevezesekkel.xlsx');
const tszj_workbook = new ExcelJS.Workbook();
await tszj_workbook.xlsx.readFile(tszj_file_path);
const sheet = tszj_workbook.worksheets[0];

/** @type {Record<string, Tszj>} */
const tszj_map = {};

const rows = sheet.getRows(2, 22);
rows?.forEach(row => {
  const kod = row.getCell(4).text.trim();

  tszj_map[kod] = {
    'Székhely szerinti vármegye kódja': kod,
    'Székhely szerinti vármegye megnevezése': row.getCell(5).text.trim(),
    'Statisztikai régió kódja': row.getCell(10).text.trim(),
    'Statisztikai régió neve': row.getCell(11).text.trim(),
    'Statisztikai nagyrégió kódja': row.getCell(8).text.trim(),
    'Statisztikai nagyrégió neve': row.getCell(9).text.trim()
  }
});

export { tszj_map };
