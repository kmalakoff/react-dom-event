# Compatibility tests

Use Node 26 for development tooling. Each browser profile is an import map in `wtr.config.mjs` that pins React and ReactDOM CDN URLs. WTR runs each profile in Chromium, Firefox and WebKit using the locked Playwright version. The minimum and current profiles vary React versions; each uses the same three browser engines.

| Command | Coverage |
| --- | --- |
| `npm test` | Isolated consumer types, minimum/current browser assertions, then Node helper/export checks |
| `npm run test:engines` | Already-built package smoke checks on exact Node 16.0.0; no DOM or renderer on old Node |
| `npm run test:browser:checkpoints` | Optional React/ReactDOM 17.0.2 and 18.3.1 checks for compatibility-sensitive changes or releases |

Routine browser endpoints pin React and ReactDOM together at 16.8.0 and 19.3.0. All profiles use the same behavioral assertions. React 16/17 use legacy mounting; React 18/19 use createRoot. React 16.8 loads from jspm because esm.sh does not expose its CommonJS named exports; the other profiles load from esm.sh. Change a version by editing its URLs.

The React 16.8 profile supports synchronous `act` callbacks only, and the current tests use synchronous callbacks. Async callbacks require a React version with async `act` support and are not covered by this matrix.

CI runs full package checks on Ubuntu and Windows, including both browser profiles. The macOS browser job builds the package and runs both profiles without repeating types, Node checks or the Node engine sweep. Browser tests use the public package export, which resolves to `dist/esm/index.js`; run `npm run build` before a standalone `npm run test:browser`. TSDS supplies and removes its temporary package self-link.

The Node 16 check loads the packed ESM, CommonJS and UMD entries. It does not certify SSR or component rendering in Node.
