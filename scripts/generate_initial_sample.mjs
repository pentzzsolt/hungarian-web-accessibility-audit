import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

const input = await fs.readFile('data/raw/tranco_9WN82.csv', 'utf8');

const domains = parse(input, {
  skip_empty_lines: true,
  trim: true
})

/**
 * Note: filtering to domains that end with ".hu" is a pragmatic decision made
 * by the author for this research. This is not intended to represent the
 * entirety of the "Hungarian internet". It's simply an easy, reproducible
 * filter for constructing the sample, and it's considered to be good enough.
 */
const hungarian_domains = domains.filter(record => {
  const [_, domain] = record;
  return domain.endsWith('.hu')
});

/**
 * Limited to the top 1000 for two reasons:
 * 
 * 1. For the purposes of this research, a sample of 1000 domains is sufficient.
 * 2. Empirically the list beyond ~1000 contains large alphabetically-ordered
 *    blocks, which suggests the original ranking is no longer reliable (many
 *    entries likely share the same rank and an alphabetical secondary sort was
 *    applied). Keeping those would add noise, so we stop at 1000.
 */
const top_1000_hungarian_domains = hungarian_domains.slice(0, 1000);

/**
 * Adding relative rank.
 */
const top_1000_hungarian_domains_with_relative_rank = top_1000_hungarian_domains.map((record, index) => [index + 1, ...record])

const outputPath = path.resolve('data/processed/initial_sample.csv');

await fs.writeFile(outputPath, stringify(top_1000_hungarian_domains_with_relative_rank, {
  columns: ['Relatív rang', 'Eredeti rang', 'Domain'],
  header: true
}), 'utf8');
