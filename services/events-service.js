import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { expandDailyRecurringEvents, mapEventDoc } from "./event-mappers";

export function subscribeToEvents({
  onData,
  onError,
  orderField = "time",
  direction = "asc",
}) {
  const eventsQuery = query(
    collection(firestore, "events"),
    orderBy(orderField, direction),
  );

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events = expandDailyRecurringEvents(snapshot.docs.map(mapEventDoc));
      onData(events);
    },
    (error) => {
      if (typeof onError === "function") {
        onError(error);
      }
    },
  );
}
