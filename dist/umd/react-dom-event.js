(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactDomEvent = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var EventContext = /*#__PURE__*/ React__default["default"].createContext(undefined);
  function EventProvider(param) {
      var _events = param.events, events = _events === void 0 ? [
          "click"
      ] : _events, children = param.children;
      var onEvent = function onEvent(event) {
          handlers.forEach(function(handler) {
              return handler(event);
          });
      };
      var subscribe = function subscribe(handler) {
          handlers.push(handler);
          return function() {
              return handlers.splice(handlers.indexOf(handler), 1);
          };
      };
      var state = React__default["default"].useState([]);
      var handlers = state[0]; // reduce transpiled array helpers 
      React__default["default"].useEffect(function() {
          events.forEach(function(event) {
              return window.document.addEventListener(event, onEvent, true);
          });
          return function() {
              return events.forEach(function(event) {
                  return window.document.removeEventListener(event, onEvent, true);
              });
          };
      });
      return /*#__PURE__*/ React__default["default"].createElement(EventContext.Provider, {
          value: {
              subscribe: subscribe
          }
      }, children);
  }
  function useEvent(handler, dependencies) {
      var subscribe = React__default["default"].useContext(EventContext).subscribe;
      React__default["default"].useEffect(function() {
          return subscribe(handler);
      }, [
          subscribe,
          handler
      ].concat(dependencies));
  }
  var index = {
      EventContext: EventContext,
      EventProvider: EventProvider,
      useEvent: useEvent
  };

  exports.EventContext = EventContext;
  exports.EventProvider = EventProvider;
  exports["default"] = index;
  exports.useEvent = useEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-dom-event.js.map
