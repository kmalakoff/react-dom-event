import * as React from 'react';
export declare type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;
export declare type HandlerType = (event: EventTypes) => void;
export declare type EventContextType = {
    subscribe: (handler: HandlerType) => void;
};
export declare const EventContext: React.Context<EventContextType>;
export declare type EventProviderProps = {
    events?: string[];
    children?: React.ReactNode;
};
export declare function EventProvider({ events, children, }: EventProviderProps): JSX.Element;
export declare function useEvent(handler: any, dependencies: any): void;
