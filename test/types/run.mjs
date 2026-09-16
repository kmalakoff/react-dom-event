import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-fixture-'));
const nodeModules = path.join(fixtureRoot, 'node_modules');

try {
  cpSync(path.join(fixtureSource, 'package.json'), path.join(fixtureRoot, 'package.json'));
  cpSync(path.join(fixtureSource, 'tsconfig.json'), path.join(fixtureRoot, 'tsconfig.json'));
  cpSync(path.join(fixtureSource, 'src'), path.join(fixtureRoot, 'src'), { recursive: true });
  mkdirSync(nodeModules);
  symlinkSync(repoRoot, path.join(nodeModules, packageName), process.platform === 'win32' ? 'junction' : 'dir');
  symlinkSync(path.join(repoRoot, 'node_modules', 'react'), path.join(nodeModules, 'react'), process.platform === 'win32' ? 'junction' : 'dir');

  const tsdsEntry = path.join(repoRoot, 'node_modules', 'ts-dev-stack', 'bin', 'cli.js');
  if (!existsSync(tsdsEntry)) throw new Error(`Missing repository tsds entry: ${tsdsEntry}`);
  execFileSync(process.execPath, [tsdsEntry, 'build'], { cwd: fixtureRoot, stdio: 'inherit' });
  if (!existsSync(path.join(fixtureRoot, 'dist', 'cjs', 'index.js'))) throw new Error('Type fixture did not build its public-name import');
} finally {
  safeRmSync(fixtureRoot, { recursive: true, force: true });
}
