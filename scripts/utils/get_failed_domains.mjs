import path from 'path';
import { returnExcelColumn } from './return_excel_column.mjs';

export async function getFailedDomains() {
  return await returnExcelColumn(path.resolve('data/processed/failed_domains.xlsx'));
}
