import { type EventContextType, EventProvider, type EventProviderProps, type HandlerType, useEvent } from 'react-dom-event';

const dependencies: readonly unknown[] = ['mode'];
const handler: HandlerType = (event) => {
  const eventType: string = event.type;
  void eventType;
};
const context = undefined as unknown as EventContextType;
const cleanup: () => void = context.subscribe(handler);
cleanup();
cleanup();
const props: EventProviderProps = { events: ['click', 'keydown', 'touchstart'], children: null };
const provider = EventProvider(props);
useEvent(handler, dependencies);
// @ts-expect-error: subscribe requires a DOM event handler
context.subscribe('invalid handler');
void provider;
