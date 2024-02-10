import {
  useState,
  useEffect,
  useContext,
  createContext,
  createElement,
} from "react";
export const EventContext = createContext(undefined);
export function EventProvider({ events = ["click"], children }) {
  const state = useState([]);
  const handlers = state[0]; // reduce transpiled array helpers
  function onEvent(event) {
    handlers.forEach((handler) => handler(event));
  }
  function subscribe(handler) {
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
  return createElement(
    EventContext.Provider,
    {
      value: {
        subscribe,
      },
    },
    children,
  );
}
export function useEvent(handler, dependencies) {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error(
      "react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event",
    );
  }
  useEffect(
    () => context.subscribe(handler),
    [context.subscribe, handler].concat(dependencies),
  );
}
