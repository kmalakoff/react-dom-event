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
var _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var EventContext = /*#__PURE__*/ _react.default.createContext(undefined);
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
    var state = _react.default.useState([]);
    var handlers = state[0]; // reduce transpiled array helpers
    _react.default.useEffect(function() {
        events.forEach(function(event) {
            return window.document.addEventListener(event, onEvent, true);
        });
        return function() {
            return events.forEach(function(event) {
                return window.document.removeEventListener(event, onEvent, true);
            });
        };
    });
    return /*#__PURE__*/ _react.default.createElement(EventContext.Provider, {
        value: {
            subscribe: subscribe
        }
    }, children);
}
function useEvent(handler, dependencies) {
    var context = _react.default.useContext(EventContext);
    if (!context) {
        throw new Error("react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event");
    }
    _react.default.useEffect(function() {
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