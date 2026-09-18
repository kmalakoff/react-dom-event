import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import { installPackedPackage } from '../lib/consumer-package.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this fixture through npm run test:types.');
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });

function run(args, cwd, capture = false) {
  const result = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', timeout: 120_000 });
  if (result.error) throw result.error;
  return result;
}

for (const profile of ['minimum', 'current']) {
  const fixtureRoot = mkdtempSync(path.join(repoRoot, `.tmp/type-${profile}-`));
  try {
    cpSync(path.join(fixtureSource, profile, 'package.json'), path.join(fixtureRoot, 'package.json'));
    cpSync(path.join(fixtureSource, profile, 'package-lock.json'), path.join(fixtureRoot, 'package-lock.json'));
    cpSync(path.join(fixtureSource, profile, 'tsconfig.json'), path.join(fixtureRoot, 'tsconfig.json'));
    cpSync(path.join(fixtureSource, 'src'), path.join(fixtureRoot, 'src'), { recursive: true });
    const installed = run([npmCli, 'ci', '--ignore-scripts', '--no-audit', '--no-fund'], fixtureRoot);
    if (installed.status !== 0) throw new Error(`${profile}: type fixture dependency installation failed.`);
    const consumerPackage = path.join(fixtureRoot, 'node_modules', packageName);
    installPackedPackage(repoRoot, consumerPackage, fixtureRoot);

    const tscEntry = path.join(fixtureRoot, 'node_modules/typescript/bin/tsc');
    if (!existsSync(tscEntry)) throw new Error(`Missing TypeScript entry: ${tscEntry}`);
    console.log(`Consumer types: ${profile}; skipLibCheck=false`);
    if (run([tscEntry, '--project', path.join(fixtureRoot, 'tsconfig.json')], fixtureRoot).status !== 0) throw new Error(`${profile}: consumer declarations failed.`);
    const source = readFileSync(path.join(fixtureRoot, 'src/index.ts'), 'utf8');
    const negative = source.replace('// @ts-expect-error: subscribe requires a DOM event handler\n', '');
    if (negative === source) throw new Error('Negative consumer assertion was not found.');
    writeFileSync(path.join(fixtureRoot, 'src/index.ts'), negative);
    const regression = run([tscEntry, '--project', path.join(fixtureRoot, 'tsconfig.json')], fixtureRoot, true);
    if (regression.status === 0) throw new Error(`${profile}: negative consumer assertion did not detect the changed contract.`);
  } finally {
    safeRmSync(fixtureRoot, { recursive: true, force: true });
  }
}
