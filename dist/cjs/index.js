"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EventContext: function() {
        return EventContext;
    },
    EventProvider: function() {
        return EventProvider;
    },
    useEvent: function() {
        return useEvent;
    }
});
var _react = require("react");
var EventContext = (0, _react.createContext)(undefined);
function EventProvider(param) {
    var _param_events = param.events, events = _param_events === void 0 ? [
        "click"
    ] : _param_events, children = param.children;
    var state = (0, _react.useState)([]);
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
    (0, _react.useEffect)(function() {
        events.forEach(function(event) {
            return window.document.addEventListener(event, onEvent, true);
        });
        return function() {
            return events.forEach(function(event) {
                return window.document.removeEventListener(event, onEvent, true);
            });
        };
    });
    return (0, _react.createElement)(EventContext.Provider, {
        value: {
            subscribe: subscribe
        }
    }, children);
}
function useEvent(handler, dependencies) {
    var context = (0, _react.useContext)(EventContext);
    if (!context) {
        throw new Error("react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event");
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    (0, _react.useEffect)(function() {
        return context.subscribe(handler);
    }, [
        context.subscribe,
        handler
    ].concat(dependencies));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}