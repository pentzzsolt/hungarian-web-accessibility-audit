import fs from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import pa11y from 'pa11y';

async function readDomains() {
  const file = path.resolve('data/processed/hungarian_websites.txt');
  const content = await fs.readFile(file, 'utf8');
  return content.split('\n').map((domain, index) => ({ domain, rank: index + 1 }));
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

await fs.mkdir(auditOutputDir);

async function auditDomain(domain, auditOutputFile) {
  const result = await pa11yWithTimeout(domain, {
    includeNotices: true,
    includeWarnings: true
  });
  await fs.writeFile(auditOutputFile, JSON.stringify(result), 'utf8');

  const { issues, pageUrl } = result;
  const errors = issues.filter(issue => issue.type === 'error').length;
  const warnings = issues.filter(issue => issue.type === 'warning').length;
  const notices = issues.filter(issue => issue.type === 'notice').length;

  return {
    pageUrl,
    issues: issues.length,
    errors,
    warnings,
    notices
  }
}

for (const data of domains) {
  const { domain } = data;
  const timestamp = new Date().toISOString();

  try {
    console.log(`Auditing ${domain}…`);
    const result = await auditDomain(domain, path.resolve(auditOutputDir, domain + '.json'));
    summary.push({
      timestamp,
      ...data,
      ...result
    });
    console.log(`Audit complete for ${domain}.`);
  } catch (error) {
    console.error(`Failed to audit ${domain}:`, error.message);
    runData.failedAudits.push({ ...data, error: { message: error.message }, timestamp });
  }
}

if (runData.failedAudits.length > 0) {
  const successfulAudits = []

  for (const data of runData.failedAudits) {
    const { domain, rank } = data;
    const timestamp = new Date().toISOString();
    
    try {
      console.log(`Auditing ${domain} for second time…`);
      const result = await auditDomain(domain, path.resolve(auditOutputDir, domain + '.json'));
      summary.push({
        timestamp,
        domain,
        rank,
        ...result
      });
      console.log(`Audit complete for ${domain} on second run.`);
      successfulAudits.push(data);
    } catch (error) {
      console.error(`Retry failed for ${data.domain}:`, error.message);
    }
  }
  runData.failedAudits = runData.failedAudits.filter(failed => !successfulAudits.some(success => success.domain === failed.domain));
}

runData.endedAt = new Date().toISOString();
await fs.writeFile(runOutputFile, JSON.stringify(runData), 'utf8');
await fs.writeFile(summaryOutputFile, JSON.stringify(summary), 'utf8');
