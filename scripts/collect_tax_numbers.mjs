import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv'),
      output_file_path = resolve('data/processed/tax_numbers.csv'),
      analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8'),
      analytical_sample = parse(analytical_sample_file, {
        columns: true
      });

const adoszam = /^\d{8}-\d{1}-\d{2}$/

const tax_numbers = analytical_sample.map(item => item['Adószám'])
const unique_tax_numbers = new Set(tax_numbers)

const output = Array.from(unique_tax_numbers, tax_number => [tax_number, undefined, undefined, undefined, undefined])

await writeFile(output_file_path, stringify(output, {
  columns: ['Adószám', 'Alapítás éve', 'Létszám', 'Nettó árbevétel', 'Üzemi eredmény'],
  header: true
}), 'utf8');
