/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { useEvent, EventProvider } from 'react-dom-event';

describe('react-dom', function () {
  it('click', function () {
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
});
