import { Subject } from "https://esm.sh/rxjs@7.8.1";

// Define an event type structure
interface Event {
  type: string;
  payload?: any;
}

// Create an event bus using RxJS Subject
const eventBus = new Subject<Event>();

// Function to emit (publish) events
export const emitEvent = (type: string, payload?: any) => {
  eventBus.next({ type, payload });
};

// Function to listen (subscribe) to events
export const onEvent = (type: string, callback: (payload: any) => void) => {
  eventBus.subscribe(({ type: eventType, payload }) => {
    if (eventType === type) callback(payload);
  });
};
