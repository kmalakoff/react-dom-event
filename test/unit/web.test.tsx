global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { Fragment } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// @ts-ignore
import { EventProvider, useEvent } from 'react-dom-event';
import { View } from 'react-native-web';
import getByTestId from '../lib/getByTestId';

type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;

describe('react-native-web', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    root = null;
    container?.remove();
    container = null;
  });

  it('click', () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
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

    let clickValue: React.MouseEvent<HTMLButtonElement> | undefined;
    let eventValue: EventTypes | undefined;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onClick = (x) => (clickValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onEvent = (x) => (eventValue = x);
    act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    act(() => (getByTestId(container as Element, 'inside') as HTMLElement).click());
    assert.equal(clickValue?.target, getByTestId(container as Element, 'inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    act(() => (getByTestId(container as Element, 'outside') as HTMLElement).click());
    assert.equal(clickValue?.target, getByTestId(container as Element, 'outside'));
    assert.ok(!!eventValue);
  });
});
