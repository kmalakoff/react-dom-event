/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { useEvent, EventProvider } from 'react-dom-event';

describe('react-dom', function () {
  it('click default', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider>
            <button id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button id="outside" onClick={onClick} />
        </div>
      );
    }

    let clickValue;
    const onClick = (x) => (clickValue = x);
    let eventValue;
    const onEvent = (x) => (eventValue = x);
    const { container } = render(
      <Component onClick={onClick} onEvent={onEvent} />,
    );
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    fireEvent.click(container.querySelector('#inside'));
    assert.equal(clickValue.target, container.querySelector('#inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    fireEvent.click(container.querySelector('#outside'));
    assert.equal(clickValue.target, container.querySelector('#outside'));
    assert.ok(!!eventValue);
  });

  it('click explicit', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider events={['click']}>
            <button id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button id="outside" onClick={onClick} />
        </div>
      );
    }

    let clickValue;
    const onClick = (x) => (clickValue = x);
    let eventValue;
    const onEvent = (x) => (eventValue = x);
    const { container } = render(
      <Component onClick={onClick} onEvent={onEvent} />,
    );
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    fireEvent.click(container.querySelector('#inside'));
    assert.equal(clickValue.target, container.querySelector('#inside'));
    assert.ok(!!eventValue);
  });

  it('click missing provider', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <button id="inside" onClick={onClick} />
          <UseEventComponent onEvent={onEvent} />
          <button id="outside" onClick={onClick} />
        </div>
      );
    }

    try {
      const onClick = () => { /* emptty */ };
      const onEvent = () => { /* emptty */ };
      render(
        <Component onClick={onClick} onEvent={onEvent} />,
      );  
    } catch(err) {
      console.log(err)
      assert.ok(err.message.indexOf('subscribe not found on context') >=0);
    }
  });
});
