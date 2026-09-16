# react-dom-event

React context for subscribing to selected DOM user interaction events.

For a react-native version, check out [react-native-event](https://www.npmjs.com/package/react-native-event)

## Install

```sh
npm install react react-dom react-dom-event
```

## Use

```tsx
import { Fragment, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useEvent, EventProvider, type EventTypes } from "react-dom-event";

function UseEventComponent() {
  const handler = useCallback((event: EventTypes) => {
    /* do something with any event */
  }, []);

  useEvent(handler, [handler]);
  return <Fragment />;
}

const container = document.getElementById("app");
if (!container) throw new Error('Missing #app element');
const root = createRoot(container);
root.render(
  <Fragment>
    <EventProvider events={["click"] /* default */}>
      <UseEventComponent />
      <button type="button" id="demo-1" onClick={() => {}} />
    </EventProvider>
    <button type="button" id="demo-2" onClick={() => {}} />
  </Fragment>,
);

// any click will call the global event handler
document.getElementById("demo-1")?.click();
document.getElementById("demo-2")?.click();
```

Each provider listens on the document during capture, including clicks outside its React children. The `events` prop accepts a readonly list of DOM event names. Handlers receive an `Event`; narrow it with `instanceof KeyboardEvent` or another event class before using event-specific fields.

`useEvent` replaces its subscription when the handler or a supplied dependency changes, and removes it on unmount. Direct `EventContext.subscribe` calls return an idempotent cleanup function. Dispatch uses the subscriptions present at the start of the event, so additions take effect on the next event and removals finish the current event.

### Documentation

[API Docs](https://kmalakoff.github.io/react-dom-event/)
