import React, { type ReactNode } from 'react';

const { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef } = React;

export type EventTypes = Event;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => () => void;
};

export const EventContext = createContext<EventContextType | undefined>(undefined);

const DEFAULT_EVENTS = ['click'];

export type EventProviderProps = {
  events?: readonly string[];
  children?: ReactNode;
};
export function EventProvider({ events = DEFAULT_EVENTS, children }: EventProviderProps) {
  const subscriptions = useRef<{ handler: HandlerType }[]>([]).current;

  const onEvent = useCallback(
    (event: EventTypes) => {
      // The dispatch snapshot fixes listener order for this event.
      // New subscriptions wait for the next event; removed subscriptions finish this event.
      subscriptions.slice().forEach(({ handler }) => {
        handler(event);
      });
    },
    [subscriptions]
  );

  const subscribe = useCallback(
    (handler: HandlerType) => {
      const subscription = { handler };
      subscriptions.push(subscription);
      let subscribed = true;
      return () => {
        if (!subscribed) return;
        subscribed = false;
        const index = subscriptions.indexOf(subscription);
        if (index >= 0) subscriptions.splice(index, 1);
      };
    },
    [subscriptions]
  );

  useEffect(() => {
    events.forEach((event) => {
      window.document.addEventListener(event, onEvent, true);
    });

    return () =>
      events.forEach((event) => {
        window.document.removeEventListener(event, onEvent, true);
      });
  }, [events, onEvent]);

  const context = useMemo(() => ({ subscribe }), [subscribe]);

  return createElement(EventContext.Provider, { value: context }, children);
}

export function useEvent(handler: HandlerType, dependencies: readonly unknown[]) {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event');
  }

  useEffect(() => context.subscribe(handler), [context, handler, ...dependencies]);
}
