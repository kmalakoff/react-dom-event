import { useState, useEffect, useContext, createContext, createElement } from 'react';
import type { ReactNode } from 'react';

export type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => void;
};

export const EventContext = createContext<EventContextType | undefined>(
  undefined,
);

export type EventProviderProps = {
  events?: string[];
  children?: ReactNode;
};
export function EventProvider({
  events = ['click'],
  children,
}: EventProviderProps) {
  const state = useState<HandlerType[]>([]);
  const handlers = state[0]; // reduce transpiled array helpers

  function onEvent(event: EventTypes) {
    handlers.forEach((handler: HandlerType) => handler(event));
  }
  function subscribe(handler: HandlerType) {
    handlers.push(handler);
    return () => handlers.splice(handlers.indexOf(handler), 1);
  }

  useEffect(() => {
    events.forEach((event) =>
      window.document.addEventListener(event, onEvent, true),
    );
    return () =>
      events.forEach((event) =>
        window.document.removeEventListener(event, onEvent, true),
      );
  });

      return createElement(EventContext.Provider, {
        value: {
            subscribe
        }
    }, children);
}

export function useEvent(handler, dependencies) {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error(
      'react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event',
    );
  }

  useEffect(
    () => context.subscribe(handler),
    [context.subscribe, handler].concat(dependencies),
  );
}
