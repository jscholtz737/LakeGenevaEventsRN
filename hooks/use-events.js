//uses event-mappers and events-service to subscribe to events and return the events, loading state, and error state

import React from "react";
import { subscribeToEvents } from "../services/events-service";

const EventsContext = React.createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToEvents({
      onData: (nextEvents) => {
        setEvents(nextEvents);
        setIsLoading(false);
        setError(null);
      },
      onError: (nextError) => {
        setIsLoading(false);
        setError(nextError);
      },
    });

    return unsubscribe;
  }, []);

  const value = React.useMemo(
    () => ({ events, isLoading, error }),
    [events, isLoading, error],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents() {
  const context = React.useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }

  return context;
}
