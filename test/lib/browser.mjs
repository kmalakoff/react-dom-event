import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const tsds = createRequire(import.meta.url).resolve('ts-dev-stack/bin/cli.js');
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run the browser matrix through npm test.');
for (const profile of ['minimum', 'current']) {
  execFileSync(process.execPath, [npmCli, 'ci', '--prefix', `test/browser/${profile}`, '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  console.log(`Browser event suite: ${profile}`);
  execFileSync(process.execPath, [tsds, 'test:browser', '--config', `wtr.${profile}.config.mjs`], {
    env: { ...process.env, REACT_TEST_PROFILE: profile },
    stdio: 'inherit',
  });
}
