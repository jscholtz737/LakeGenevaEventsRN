//uses event-mappers and events-service to subscribe to events and return the events, loading state, and error state

import React from "react";
import { subscribeToEvents } from "../services/events-service";

export function useEvents() {
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
        setEvents([]);
        setIsLoading(false);
        setError(nextError);
      },
    });

    return unsubscribe;
  }, []);

  return { events, isLoading, error };
}
