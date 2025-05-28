const fs = require('fs');
const input = fs.readFileSync('data/raw/tranco_3Q7KL.csv', 'utf8');

const hungarianWebsites = input.split(/\n/).map(row => row.trim()).filter(row => row.length).map(row => row.split(',')[1]).filter(domain => domain.endsWith('.hu'));

const output = hungarianWebsites.join('\n');
fs.writeFileSync('data/processed/hungarian_websites.txt', output, 'utf8');
