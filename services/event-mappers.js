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

export function mapEventDoc(doc) {
  const data = doc.data();
  const startDate = normalizeDate(data.startDate);
  const endDate = normalizeDate(data.endDate);

  return {
    id: doc.id,
    description: data.description ?? "",
    endDate,
    imageName: data.imageName ?? "",
    imageUri: resolveImageUri(data.imageName),
    latitude: typeof data.latitude === "number" ? data.latitude : null,
    link: data.link ?? "",
    location: data.location ?? "Location TBD",
    locationDetails: data.locationDetails ?? "",
    longitude: typeof data.longitude === "number" ? data.longitude : null,
    name: data.name ?? "Untitled Event",
    recurring: data.recurring ?? "",
    startDate,
    time: formatEventTime(data.time),
  };
}

export function expandDailyRecurringEvents(events) {
  return events.flatMap((event) => {
    if (
      !isDailyRecurring(event.recurring) ||
      !event.startDate ||
      !event.endDate
    ) {
      return [event];
    }

    const copies = [event];
    let dayOffset = 1;
    let nextDate = addDays(event.startDate, dayOffset);

    while (nextDate <= event.endDate) {
      copies.push({
        ...event,
        id: `${event.id}-${nextDate.toISOString().slice(0, 10)}`,
        startDate: nextDate,
      });

      dayOffset += 1;
      nextDate = addDays(event.startDate, dayOffset);
    }

    return copies;
  });
}
