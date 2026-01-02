import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { quantileSeq } from 'mathjs';

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv'),
      output_file_path = resolve('data/processed/analytical_sample_p99.csv'),
      analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8'),
      analytical_sample = parse(analytical_sample_file, {
        columns: true
      });

const error_numbers = analytical_sample.map(item => item['Átlagos akadálymentességi hibaszám'])
const cutoff = quantileSeq(error_numbers, 0.99)

const filtered_sample = analytical_sample.filter(item => item['Átlagos akadálymentességi hibaszám'] < cutoff)

await writeFile(output_file_path, stringify(filtered_sample, {
  header: true
}), 'utf8');
