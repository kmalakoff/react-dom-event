import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { EventProvider, useEvent } from 'react-dom-event';

assert.equal(process.versions.node, '16.0.0');
assert.equal(typeof EventProvider, 'function');
assert.equal(typeof useEvent, 'function');
const require = createRequire(import.meta.url);
for (const name of ['react-dom-event', 'react-dom-event/umd']) {
  const loaded = require(name);
  const exports = loaded.default || loaded;
  assert.equal(typeof exports.EventProvider, 'function');
  assert.equal(typeof exports.useEvent, 'function');
}
console.log('Node 16.0.0: ESM, CommonJS and UMD package loading passed.');
