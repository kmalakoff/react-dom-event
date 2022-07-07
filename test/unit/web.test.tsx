/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { View } from 'react-native-web';
import { useEvent, EventProvider } from 'react-dom-event';

describe('react-native-web', function () {
  it('click', async function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <View>
          <EventProvider>
            <View testID="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <View testID="outside" onClick={onClick} />
        </View>
      );
    }

    let clickValue;
    const onClick = (x) => (clickValue = x);
    let eventValue;
    const onEvent = (x) => (eventValue = x);
    const { findByTestId } = render(
      <Component onClick={onClick} onEvent={onEvent} />,
    );
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    fireEvent.click(await findByTestId('inside'));
    assert.equal(clickValue.target, await findByTestId('inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    fireEvent.click(await findByTestId('outside'));
    assert.equal(clickValue.target, await findByTestId('outside'));
    assert.ok(!!eventValue);
  });
});
