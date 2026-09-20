import assert from 'assert';
import React from 'react';

const suite = typeof document === 'undefined' ? describe.skip : describe;

suite('exports umd browser global', () => {
  it('loads the UMD entry as a browser global', async () => {
    const browser = window as Window & { React?: typeof React; reactDomEvent?: Record<string, unknown> };
    const previousReact = browser.React;
    const previousGlobal = browser.reactDomEvent;
    const readGlobal = () => browser.reactDomEvent;
    const script = document.createElement('script');
    browser.React = React;
    delete browser.reactDomEvent;

    script.src = '/dist/umd/react-dom-event.cjs';
    try {
      const response = await fetch(script.src);
      assert.equal(response.ok, true);
      await new Promise<void>((resolve, reject) => {
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(new Error(`Failed to load ${script.src}`)), { once: true });
        document.head.appendChild(script);
      });

      const exported = readGlobal();
      assert.equal(typeof exported?.EventContext, 'object');
      assert.equal(typeof exported?.EventProvider, 'function');
      assert.equal(typeof exported?.useEvent, 'function');
    } finally {
      script.remove();
      if (previousReact) browser.React = previousReact;
      else delete browser.React;
      if (previousGlobal) browser.reactDomEvent = previousGlobal;
      else delete browser.reactDomEvent;
    }
  });
});
