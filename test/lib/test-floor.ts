import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import { installPackedPackage } from './consumer-package.ts';

const repository: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this fixture through npm run test:engines.');
mkdirSync(path.join(repository, '.tmp'), { recursive: true });
const fixture: string = mkdtempSync(path.join(repository, '.tmp/node-floor-'));

try {
  cpSync(path.join(repository, 'test/engines/package.json'), path.join(fixture, 'package.json'));
  cpSync(path.join(repository, 'test/engines/package-lock.json'), path.join(fixture, 'package-lock.json'));
  const install = spawnSync(process.execPath, [npmCli, 'ci', '--prefix', fixture, '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit', timeout: 120_000 });
  if (install.error) throw install.error;
  if (install.status !== 0) throw new Error('Node consumer installation failed.');
  installPackedPackage(repository, path.join(fixture, 'node_modules/react-dom-event'), fixture);
  cpSync(path.join(repository, 'test/exports/floor.mjs'), path.join(fixture, 'floor.mjs'));
  const result = spawnSync(process.execPath, [require.resolve('node-version-use/bin/cli.js'), '16.0.0', 'node', path.join(fixture, 'floor.mjs')], { stdio: 'inherit', timeout: 120_000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Node floor check failed with status ${result.status}.`);
} finally {
  safeRmSync(fixture, { recursive: true, force: true });
}
