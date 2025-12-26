import path from 'path';
import { getExcludedDomains } from './get_excluded_domains.mjs';
import { getFailedDomains } from './get_failed_domains.mjs';
import { returnExcelColumn } from './return_excel_column.mjs';

export async function getSample() {
  const allDomains = await returnExcelColumn(path.resolve('data/processed/hungarian_websites.xlsx'), { column: 'A', startRow: 2 });
  const failedDomains = await getFailedDomains();
  const excludedDomains = await getExcludedDomains();
  const domains = allDomains.map((domain, index) => ({ domain, rank: index + 1 })).filter(domain => !failedDomains.includes(domain.domain) && !excludedDomains.includes(domain.domain));
  return domains;
}
