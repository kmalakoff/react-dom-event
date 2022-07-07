import * as React from 'react';

export type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => void;
};

export const EventContext = React.createContext<EventContextType | undefined>(
  undefined,
);

export type EventProviderProps = {
  events?: string[];
  children?: React.ReactNode;
};
export function EventProvider({
  events = ['click'],
  children,
}: EventProviderProps) {
  const [handlers] = React.useState<HandlerType[]>([]);
  function onEvent(event: EventTypes) {
    handlers.forEach((subscriber) => subscriber(event));
  }
  function subscribe(handler: HandlerType) {
    handlers.push(handler);
    return () => handlers.splice(handlers.indexOf(handler), 1);
  }

  React.useEffect(() => {
    events.forEach((event) =>
      window.document.addEventListener(event, onEvent, true),
    );
    return () =>
      events.forEach((event) =>
        window.document.removeEventListener(event, onEvent, true),
      );
  });
  return (
    <EventContext.Provider value={{ subscribe }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent(handler, dependencies) {
  const { subscribe } = React.useContext(EventContext);
  React.useEffect(
    () => subscribe(handler),
    [subscribe, handler].concat(dependencies),
  );
}
