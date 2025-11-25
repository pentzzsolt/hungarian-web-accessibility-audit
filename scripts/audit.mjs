import fs from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import pa11y from 'pa11y';
import ExcelJS from 'exceljs';

async function returnExcelColumn(file, options = { column: 'A', startRow: 1 }) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const sheet = workbook.worksheets[0];
  const column = [];
  for (let i = options.startRow; i <= sheet.rowCount; i++) {
    const cell = sheet.getCell(`${options.column}${i}`).value;
    if (cell && typeof cell === 'string') {
      column.push(cell);
    }
  }
  return column;
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

const allDomains = await returnExcelColumn(path.resolve('data/processed/hungarian_websites.xlsx'), { column: 'A', startRow: 2 });
const failedDomains = await returnExcelColumn(path.resolve('data/processed/failed_domains.xlsx'));
const domains = allDomains.map((domain, index) => ({ domain, rank: index + 1 })).filter(domain => !failedDomains.includes(domain.domain));

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

for (let attempt = 1; attempt <= 10 && runData.failedAudits.length > 0; attempt++) {
  console.log(`Waiting 5 minutes before retry attempt #${attempt}…`);
  await sleep(1000 * 60 * 5);

  console.log(`Retry attempt #${attempt}…`);
  const successfulAudits = [];

  for (const data of runData.failedAudits) {
    const { domain, rank } = data;
    const timestamp = new Date().toISOString();

    try {
      console.log(`Auditing ${domain}…`);
      const result = await auditDomain(domain, path.resolve(auditOutputDir, domain + '.json'));
      summary.push({
        timestamp,
        domain,
        rank,
        ...result
      });
      console.log(`Audit complete for ${domain}.`);
      successfulAudits.push(data);
    } catch (error) {
      console.error(`Failed to audit ${domain}:`, error.message);
    }
  }
  runData.failedAudits = runData.failedAudits.filter(failed => !successfulAudits.some(success => success.domain === failed.domain));
}

runData.endedAt = new Date().toISOString();
await fs.writeFile(runOutputFile, JSON.stringify(runData), 'utf8');
await fs.writeFile(summaryOutputFile, JSON.stringify(summary), 'utf8');
