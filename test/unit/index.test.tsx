((typeof global === 'undefined' ? window : global) as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { Fragment, useContext, useEffect } from 'react';
import type { Root } from 'react-dom/client';
import * as ReactDOM from 'react-dom/client';

import { EventContext, EventProvider, type HandlerType, useEvent } from 'react-dom-event';

const suite = typeof document === 'undefined' ? describe.skip : describe;

suite('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    React.act(() => (root as Root).unmount());
    root = null;
    container?.remove();
    container = null;
  });

  function dispatch(type: 'click' | 'keydown' | 'touchstart', target: HTMLElement) {
    const view = document.defaultView;
    assert.ok(view);
    if (type === 'touchstart' && typeof view.TouchEvent !== 'function') return false;
    const event = type === 'click' ? new view.MouseEvent(type, { bubbles: true }) : type === 'keydown' ? new view.KeyboardEvent(type, { bubbles: true, key: 'Enter' }) : new view.TouchEvent(type, { bubbles: true });
    React.act(() => target.dispatchEvent(event));
    return true;
  }

  it('delivers configured mouse, keyboard, and touch events', () => {
    function UseEventComponent({ onEvent }: { onEvent: HandlerType }) {
      useEvent(onEvent, []);
      return <Fragment />;
    }

    const events: readonly string[] = ['click', 'keydown', 'touchstart'];
    const received: string[] = [];
    const childEvents: string[] = [];
    const onEvent: HandlerType = (event) => received.push(event.type);
    React.act(() =>
      (root as Root).render(
        <EventProvider events={events}>
          <UseEventComponent onEvent={onEvent} />
          <button
            type="button"
            id="target"
            onClick={(event) => {
              childEvents.push(event.type);
              event.stopPropagation();
            }}
            onKeyDown={(event) => {
              childEvents.push(event.type);
              event.stopPropagation();
            }}
            onTouchStart={(event) => {
              childEvents.push(event.type);
              event.stopPropagation();
            }}
          />
        </EventProvider>
      )
    );

    const target = container?.querySelector('#target') as HTMLButtonElement;
    dispatch('click', target);
    dispatch('keydown', target);
    const touchSupported = dispatch('touchstart', target);
    const expected = touchSupported ? ['click', 'keydown', 'touchstart'] : ['click', 'keydown'];
    assert.deepEqual(received, expected);
    assert.deepEqual(childEvents, expected);
  });

  it('updates handlers and event lists without losing subscriptions', () => {
    let events: readonly string[] = ['click'];
    const received: string[] = [];

    function Listener({ version }: { version: string }) {
      const onEvent: HandlerType = () => received.push(version);
      useEvent(onEvent, []);
      return null;
    }

    function Component({ version }: { version: string }) {
      return (
        <EventProvider events={events}>
          <Listener version={version} />
          <button type="button" id="target" />
        </EventProvider>
      );
    }

    React.act(() => (root as Root).render(<Component version="first" />));
    const target = () => container?.querySelector('#target') as HTMLButtonElement;
    dispatch('click', target());
    events = ['keydown'];
    React.act(() => (root as Root).render(<Component version="second" />));
    dispatch('click', target());
    dispatch('keydown', target());
    assert.deepEqual(received, ['first', 'second']);
  });

  it('keeps nested providers independent', () => {
    const received: string[] = [];
    function Listener({ name }: { name: string }) {
      useEvent(() => received.push(name), []);
      return null;
    }

    React.act(() =>
      (root as Root).render(
        <EventProvider>
          <Listener name="outer" />
          <EventProvider>
            <Listener name="inner" />
            <button type="button" />
          </EventProvider>
        </EventProvider>
      )
    );
    const target = container?.querySelector('button') as HTMLButtonElement;
    dispatch('click', target);
    assert.deepEqual(received.sort(), ['inner', 'outer']);
  });

  it('dispatches a snapshot and cleans up duplicate registrations independently', () => {
    const received: string[] = [];
    let cleanups: (() => void)[] = [];
    const first: HandlerType = () => {
      received.push('first');
      cleanups[0]?.();
    };
    const second: HandlerType = () => {
      received.push('second');
      cleanups[2]?.();
    };
    const duplicate: HandlerType = () => received.push('duplicate');

    function SubscriptionProbe() {
      const context = useContext(EventContext);
      useEffect(() => {
        if (!context) throw new Error('test provider missing');
        cleanups = [first, second, duplicate].map((handler) => context.subscribe(handler));
        return () => cleanups.forEach((cleanup) => cleanup());
      }, [context]);
      return null;
    }

    React.act(() =>
      (root as Root).render(
        <EventProvider>
          <SubscriptionProbe />
          <button type="button" />
        </EventProvider>
      )
    );
    const target = container?.querySelector('button') as HTMLButtonElement;
    dispatch('click', target);
    assert.deepEqual(received, ['first', 'second', 'duplicate']);
    received.length = 0;
    dispatch('click', target);
    assert.deepEqual(received, ['second']);

    const duplicateAgain: HandlerType = () => received.push('duplicate-again');
    let duplicateCleanups: (() => void)[] = [];
    function DuplicateProbe() {
      const context = useContext(EventContext);
      useEffect(() => {
        if (!context) throw new Error('test provider missing');
        duplicateCleanups = [duplicateAgain, () => received.push('marker'), duplicateAgain].map((handler) => context.subscribe(handler));
        return () => duplicateCleanups.forEach((cleanup) => cleanup());
      }, [context]);
      return null;
    }

    React.act(() =>
      (root as Root).render(
        <EventProvider>
          <DuplicateProbe />
          <button type="button" />
        </EventProvider>
      )
    );
    duplicateCleanups[2]?.();
    duplicateCleanups[2]?.();
    received.length = 0;
    dispatch('click', container?.querySelector('button') as HTMLButtonElement);
    assert.deepEqual(received, ['duplicate-again', 'marker']);
  });

  it('throws when useEvent has no provider', () => {
    function MissingProvider() {
      useEvent(() => undefined, []);
      return null;
    }

    assert.throws(() => React.act(() => (root as Root).render(<MissingProvider />)), /subscribe not found on context/);
  });

  it('defers subscriptions added during dispatch until the next event', () => {
    const received: string[] = [];
    function Probe() {
      const context = useContext(EventContext);
      useEffect(() => {
        assert.ok(context);
        let removeLate: (() => void) | undefined;
        const removeFirst = context.subscribe(() => {
          received.push('first');
          removeLate ??= context.subscribe(() => received.push('late'));
        });
        return () => {
          removeFirst();
          removeLate?.();
        };
      }, [context]);
      return null;
    }
    React.act(() =>
      (root as Root).render(
        <EventProvider>
          <Probe />
          <button type="button" />
        </EventProvider>
      )
    );
    const target = container?.querySelector('button') as HTMLButtonElement;
    dispatch('click', target);
    assert.deepEqual(received, ['first']);
    dispatch('click', target);
    assert.deepEqual(received, ['first', 'first', 'late']);
  });

  it('keeps provider context stable and removes unmounted listeners', () => {
    const contexts: unknown[] = [];
    const received: string[] = [];
    const handler = () => received.push('event');
    function Listener() {
      useEvent(handler, []);
      return null;
    }
    function Probe() {
      contexts.push(useContext(EventContext));
      return null;
    }
    function App({ mounted }: { mounted: boolean }) {
      return (
        <EventProvider>
          <Probe />
          {mounted && <Listener />}
          <button type="button" />
        </EventProvider>
      );
    }
    React.act(() => (root as Root).render(<App mounted />));
    dispatch('click', container?.querySelector('button') as HTMLButtonElement);
    React.act(() => (root as Root).render(<App mounted={false} />));
    dispatch('click', container?.querySelector('button') as HTMLButtonElement);
    assert.deepEqual(received, ['event']);
    assert.strictEqual(contexts[0], contexts[1]);
  });
});
