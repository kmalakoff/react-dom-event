import type { ReactNode } from 'react';
export type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;
export type HandlerType = (event: EventTypes) => void;
export type EventContextType = {
    subscribe: (handler: HandlerType) => void;
};
export declare const EventContext: import("react").Context<EventContextType>;
export type EventProviderProps = {
    events?: string[];
    children?: ReactNode;
};
export declare function EventProvider({ events, children, }: EventProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<EventContextType>>;
export declare function useEvent(handler: any, dependencies: any): void;
