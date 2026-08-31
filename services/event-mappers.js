const FALLBACK_IMAGE_URI =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80";

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function addDays(date, count) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + count);
  return nextDate;
}

function isDailyRecurring(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "daily";
}

function isWeeklyRecurring(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "weekly";
}

export function formatEventTime(value) {
  if (!value) {
    return "TBD";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return "TBD";
}

function resolveImageUri(imageName) {
  if (typeof imageName === "string" && imageName.startsWith("http")) {
    return imageName;
  }

  return FALLBACK_IMAGE_URI;
}

function field(row, camelCaseName, snakeCaseName) {
  return row[snakeCaseName] ?? row[camelCaseName];
}

export function mapEventRow(row) {
  const startDate = normalizeDate(field(row, "startDate", "start_date"));
  const endDate = normalizeDate(field(row, "endDate", "end_date"));
  const imageName = field(row, "imageName", "image_name") ?? "";

  return {
    id: String(row.id),
    description: row.description ?? "",
    endDate,
    imageName,
    imageUri: resolveImageUri(imageName),
    latitude: typeof row.latitude === "number" ? row.latitude : null,
    link: row.link ?? "",
    location: row.location ?? "Location TBD",
    locationDetails: field(row, "locationDetails", "location_details") ?? "",
    longitude: typeof row.longitude === "number" ? row.longitude : null,
    name: row.name ?? "Untitled Event",
    recurring: row.recurring ?? "",
    startDate,
    time: formatEventTime(row.time),
  };
}

export function expandDailyRecurringEvents(events) {
  return events.flatMap((event) => {
    const shouldExpandDaily = isDailyRecurring(event.recurring);
    const shouldExpandWeekly = isWeeklyRecurring(event.recurring);

    if (
      (!shouldExpandDaily && !shouldExpandWeekly) ||
      !event.startDate ||
      !event.endDate
    ) {
      return [event];
    }

    const copies = [event];
    const incrementDays = shouldExpandWeekly ? 7 : 1;
    let dayOffset = incrementDays;
    let nextDate = addDays(event.startDate, dayOffset);
    const expansionCutoff = addDays(new Date(), 45);

    while (nextDate <= event.endDate && nextDate <= expansionCutoff) {
      copies.push({
        ...event,
        id: `${event.id}-${nextDate.toISOString().slice(0, 10)}`,
        startDate: nextDate,
      });

      dayOffset += incrementDays;
      nextDate = addDays(event.startDate, dayOffset);
    }

    return copies;
  });
}
