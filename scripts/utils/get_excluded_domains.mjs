import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync'

export async function getExcludedDomains() {
  const file = path.resolve('data/processed/excluded_domains.csv')
  const input = await fs.readFile(file, 'utf8');
  const excludedDomains = parse(input, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
  return excludedDomains.map(domain => domain.Domain);
}
