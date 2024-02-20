// global.IS_REACT_ACT_ENVIRONMENT = true;
// import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { Fragment } from 'react';
import { createRoot } from 'react-dom';
// import { act } from 'react-dom/test-utils';

// @ts-ignore
import { EventProvider, useEvent } from '../..';

// type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;

describe('react-dom', () => {
  let container; // : HTMLDivElement | null = null;
  let root; // : Root | null = null;
  beforeEach(() => {
    const container = document.createElement('div');
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    root = null;
    container.remove();
    container = null;
  });

  it('click default', () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onClick, onEvent }) {
      debugger;
      return (
        <div>
          {/* <EventProvider>
            <button type="button" id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider> */}
          <button type="button" id="outside" onClick={onClick} />
        </div>
      );
    }

    let clickValue; // : React.MouseEvent<HTMLButtonElement>;
    let eventValue; //: EventTypes;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onClick = (x) => (clickValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onEvent = (x) => (eventValue = x);
    root.render(<Component onClick={onClick} onEvent={onEvent} />);
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    let el = document.getElementById('#inside')
    container.getElementById('inside').click();
    assert.equal(clickValue.target, container.getElementById('inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    container.getElementById('outside').click();
    assert.equal(clickValue.target, container.getElementById('outside'));
    assert.ok(!!eventValue);
  });

  it('click explicit', () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider events={['click']}>
            <button type="button" id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button type="button" id="outside" onClick={onClick} />
        </div>
      );
    }

    let clickValue; // : React.MouseEvent<HTMLButtonElement>;
    let eventValue; // : EventTypes;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const _onClick = (x) => (clickValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const _onEvent = (x) => (eventValue = x);
    // act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    // act(() => (container.querySelector('#inside') as HTMLElement).click());
    assert.equal(clickValue.target, container.querySelector('#inside'));
    assert.ok(!!eventValue);
  });

  // TODO: test on the browser
  it.skip('click missing provider', () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <button type="button" id="inside" onClick={onClick} />
          <UseEventComponent onEvent={onEvent} />
          <button type="button" id="outside" onClick={onClick} />
        </div>
      );
    }

    try {
      const onClick = () => {
        /* emptty */
      };
      const onEvent = () => {
        /* emptty */
      };
      act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    } catch (err) {
      assert.ok(err.message.indexOf('subscribe not found on context') >= 0);
    }
  });
});
