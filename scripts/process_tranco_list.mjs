import fs from 'fs';

const input = fs.readFileSync('data/raw/tranco_9WN82.csv', 'utf8');

const hungarianWebsites = input.split(/\n/).map(row => row.trim()).filter(row => row.length).map(row => row.split(',')[1]).filter(domain => domain.endsWith('.hu')).slice(0, 1000);

const output = hungarianWebsites.join('\n');
fs.writeFileSync('data/processed/hungarian_websites.txt', output, 'utf8');
