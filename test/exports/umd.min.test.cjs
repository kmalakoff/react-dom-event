const assert = require('assert');
const { EventContext, useEvent, EventProvider } = require('react-dom-event/dist/umd/react-dom-event.min.cjs');

describe('exports react-dom-event/dist/umd/react-dom-event.min.cjs', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
