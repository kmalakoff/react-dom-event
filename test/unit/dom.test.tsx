// @ts-ignore
(typeof global === 'undefined' ? window : global).IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs';

import assert from 'assert';
import React from 'react';
import { Fragment } from 'react';
import * as ReactDOM from 'react-dom/client';
import type { Root } from 'react-dom/client';

// @ts-ignore
import { EventProvider, useEvent } from 'react-dom-event';

type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;

describe('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    React.act(() => root.unmount());
    root = null;
    container?.remove();
    container = null;
  });

  it('click default', () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider>
            <button type="button" id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button type="button" id="outside" onClick={onClick} />
        </div>
      );
    }

    let clickValue: React.MouseEvent<HTMLButtonElement> | undefined;
    let eventValue: EventTypes | undefined;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onClick = (x) => (clickValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onEvent = (x) => (eventValue = x);
    React.act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    React.act(() => (container?.querySelector('#inside') as HTMLElement).click());
    assert.equal(clickValue?.target, container?.querySelector('#inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    React.act(() => (container?.querySelector('#outside') as HTMLElement).click());
    assert.equal(clickValue?.target, container?.querySelector('#outside'));
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

    let clickValue: React.MouseEvent<HTMLButtonElement> | undefined;
    let eventValue: EventTypes | undefined;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onClick = (x) => (clickValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onEvent = (x) => (eventValue = x);
    React.act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    React.act(() => (container?.querySelector('#inside') as HTMLElement).click());
    assert.equal(clickValue?.target, container?.querySelector('#inside'));
    assert.ok(!!eventValue);
  });

  it('click missing provider', () => {
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
        /* empty */
      };
      const onEvent = () => {
        /* empty */
      };
      React.act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    } catch (err) {
      assert.ok(err.message.indexOf('subscribe not found on context') >= 0);
    }
  });
});
