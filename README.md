## react-dom-event

React context for subscribing to all DOM user interaction events.

For a react-native version, check out [react-native-event](https://www.npmjs.com/package/react-native-event)

### Example 1

```tsx
import { Fragment, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useEvent, EventProvider } from "react-dom-event";

function UseEventComponent() {
  const handler = useCallback((event) => {
    /* do something with any event */
  });

  useEvent(handler, [handler]);
  return <Fragment />;
}

const container = document.getElementById("app");
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
document.getElementById("demo-1").click();
document.getElementById("demo-2").click();
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-dom-event/)
