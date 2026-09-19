import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const tsds = createRequire(import.meta.url).resolve('ts-dev-stack/bin/cli.js');

export function runBrowserProfiles(profiles) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('Run the browser matrix through npm test.');
  for (const profile of profiles) {
    execFileSync(process.execPath, [npmCli, 'ci', '--prefix', `test/browser/${profile}`, '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit' });
    console.log(`Browser event suite: ${profile}`);
    execFileSync(process.execPath, [tsds, 'test:browser', '--config', `wtr.${profile}.config.mjs`], { stdio: 'inherit' });
  }
}
