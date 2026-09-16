const assert = require('assert');
const umd = require('react-dom-event/umd');
const reactDomEvent = umd.default || umd;
const { EventContext, useEvent, EventProvider } = reactDomEvent;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
