import { getSupabase } from "../lib/supabase";
import { expandDailyRecurringEvents, mapEventRow } from "./event-mappers";

const EVENTS_TABLE = "events";

export function subscribeToEvents({
  onData,
  onError,
  orderField = "time",
  direction = "asc",
}) {
  let supabase;
  let channel;
  let isActive = true;
  let requestId = 0;

  const reportError = (error) => {
    if (isActive && typeof onError === "function") onError(error);
  };

  const loadEvents = async () => {
    const currentRequestId = ++requestId;
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select("*")
      .order(orderField, { ascending: direction !== "desc" });

    if (!isActive || currentRequestId !== requestId) return;
    if (error) {
      reportError(error);
      return;
    }

    onData(expandDailyRecurringEvents((data ?? []).map(mapEventRow)));
  };

  try {
    supabase = getSupabase();
    void loadEvents();
    channel = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: EVENTS_TABLE },
        () => void loadEvents(),
      )
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          reportError(error ?? new Error(`Supabase Realtime: ${status}`));
        }
      });
  } catch (error) {
    reportError(error);
  }

  return () => {
    isActive = false;
    requestId += 1;
    if (channel && supabase) void supabase.removeChannel(channel);
  };
}
