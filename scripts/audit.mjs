import fs from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import pa11y from 'pa11y';

async function readDomains() {
  const file = path.resolve('data/processed/hungarian_websites.txt');
  const content = await fs.readFile(file, 'utf8');
  return content.split('\n');
}

function pa11yWithTimeout(domain, options = {}, ms = 60000) {
  return Promise.race([
    pa11y(domain, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms / 1000} seconds`)), ms))
  ]);
}

function getRunData() {
  const startedAt = new Date().toISOString();
  const pa11yVersion = spawnSync('pa11y', ['--version'], { encoding: 'utf8' }).stdout.trim();
  const id = startedAt.slice(0, 10);
  
  return {
    id,
    failedAudits: [],
    pa11yVersion,
    process: {
      arch: process.arch,
      platform: process.platform,
      version: process.version,
    },
    startedAt,
  };
}

const summary = [];
const runData = getRunData();
const { id } = runData;
const auditOutputDir = path.resolve('results/audits', id);
const runOutputFile = path.resolve('results/runs', id + '.json');
const summaryOutputFile = path.resolve('results/summaries', id + '.json');
const domains = await readDomains();

let rank = 0;

await fs.mkdir(auditOutputDir);

for (const domain of domains) {
  console.log(`Auditing ${domain}…`);
  const timestamp = new Date().toISOString();
  let result;
  rank++;

  try {
    result = await pa11yWithTimeout(domain, {
      includeNotices: true,
      includeWarnings: true
    });
    await fs.writeFile(path.resolve(auditOutputDir, domain + '.json'), JSON.stringify(result), 'utf8');
  } catch (error) {
    console.error(`Failed to audit ${domain}:`, error.message);
    runData.failedAudits.push({ domain, error: { message: error.message } });
    continue;
  }
  
  const { issues, pageUrl } = result;
  const errors = issues.filter(issue => issue.type === 'error').length;
  const warnings = issues.filter(issue => issue.type === 'warning').length;
  const notices = issues.filter(issue => issue.type === 'notice').length;

  summary.push({
    timestamp,
    rank,
    domain,
    pageUrl,
    issues: issues.length,
    errors,
    warnings,
    notices
  });
  console.log('Audit complete.', { domain, errors, warnings, notices });
}

runData.endedAt = new Date().toISOString();
await fs.writeFile(runOutputFile, JSON.stringify(runData), 'utf8');
await fs.writeFile(summaryOutputFile, JSON.stringify(summary), 'utf8');
