(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactDomEvent = {}, global.React));
})(this, (function (exports, react) { 'use strict';

  var EventContext = react.createContext(undefined);
  function EventProvider(param) {
      var _param_events = param.events, events = _param_events === void 0 ? [
          "click"
      ] : _param_events, children = param.children;
      var state = react.useState([]);
      var handlers = state[0]; // reduce transpiled array helpers
      function onEvent(event) {
          handlers.forEach(function(handler) {
              return handler(event);
          });
      }
      function subscribe(handler) {
          handlers.push(handler);
          return function() {
              return handlers.splice(handlers.indexOf(handler), 1);
          };
      }
      react.useEffect(function() {
          events.forEach(function(event) {
              return window.document.addEventListener(event, onEvent, true);
          });
          return function() {
              return events.forEach(function(event) {
                  return window.document.removeEventListener(event, onEvent, true);
              });
          };
      });
      return react.createElement(EventContext.Provider, {
          value: {
              subscribe: subscribe
          }
      }, children);
  }
  function useEvent(handler, dependencies) {
      var context = react.useContext(EventContext);
      if (!context) {
          throw new Error("react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event");
      }
      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      react.useEffect(function() {
          return context.subscribe(handler);
      }, [
          context.subscribe,
          handler
      ].concat(dependencies));
  }

  exports.EventContext = EventContext;
  exports.EventProvider = EventProvider;
  exports.useEvent = useEvent;

}));
//# sourceMappingURL=react-dom-event.js.map
