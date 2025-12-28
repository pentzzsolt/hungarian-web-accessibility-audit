import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'

export async function getFailedDomains() {
  const failed_domains_file_path = resolve('data/processed/failed_domains.csv'),
        failed_domains_file = await readFile(failed_domains_file_path, 'utf8'),
        failed_domains = parse(failed_domains_file, {
          columns: true
        });
  return failed_domains.map(domain => domain.Domain)
}
