import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'

export async function getSample() {
  const sample_domains_file_path = resolve('data/processed/analytical_sample.csv'),
        sample_domains_file = await readFile(sample_domains_file_path, 'utf8'),
        sample_domains = parse(sample_domains_file, {
          columns: true
        });
  return sample_domains.map(domain => domain.Domain)
}

export async function getSampleP99(full = false) {
  const sample_domains_file_path = resolve('data/processed/analytical_sample_p99.csv'),
        sample_domains_file = await readFile(sample_domains_file_path, 'utf8'),
        sample_domains = parse(sample_domains_file, {
          columns: true
        });
  return sample_domains.map(domain => full ? domain : domain.Domain)
}
