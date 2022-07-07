## react-dom-event

React context for subscribing to all DOM user interaction events.

### Example 1

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEvent, EventProvider } from 'react-dom-event';

function UseEventComponent() {
  const handler = React.useCallback((event) => {
    /* do something with any event */
  });

  useEvent(handler, [handler]);
  return <React.Fragment />;
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.Fragment>
    <EventProvider events={['click'] /* default */}>
      <UseEventComponent />
    </EventProvider>
  </React.Fragment>,
);

// any click will call the handler
document.dispatchEvent(new MouseEvent('click'));
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-dom-event/)
