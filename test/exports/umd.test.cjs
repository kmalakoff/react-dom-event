const assert = require('assert');

let umd = null;
try {
  umd = require('react-dom-event/umd');
} catch (_) {
  umd = require('react-dom-event/dist/umd/react-dom-event.cjs');
}
const reactDomEvent = typeof window !== 'undefined' ? window.reactDomEvent : umd.default || umd;
const { EventContext, useEvent, EventProvider } = reactDomEvent;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
