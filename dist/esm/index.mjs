import React from 'react';
export const EventContext = /*#__PURE__*/ React.createContext(undefined);
export function EventProvider({ events =[
    'click'
] , children  }) {
    const state = React.useState([]);
    const handlers = state[0]; // reduce transpiled array helpers
    function onEvent(event) {
        handlers.forEach((handler)=>handler(event));
    }
    function subscribe(handler) {
        handlers.push(handler);
        return ()=>handlers.splice(handlers.indexOf(handler), 1);
    }
    React.useEffect(()=>{
        events.forEach((event)=>window.document.addEventListener(event, onEvent, true));
        return ()=>events.forEach((event)=>window.document.removeEventListener(event, onEvent, true));
    });
    return /*#__PURE__*/ React.createElement(EventContext.Provider, {
        value: {
            subscribe
        }
    }, children);
}
export function useEvent(handler, dependencies) {
    const context = React.useContext(EventContext);
    if (!context) {
        throw new Error('react-dom-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-dom-event');
    }
    React.useEffect(()=>context.subscribe(handler), [
        context.subscribe,
        handler
    ].concat(dependencies));
}
