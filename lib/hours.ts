import { business } from "@/lib/content";

function minutes(value: string): number {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

export function isOpenAt(date: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: business.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const now = hour * 60 + minute;
  return business.hours.some(
    (slot) => slot.days.includes(day) && now >= minutes(slot.opens) && now < minutes(slot.closes),
  );
}
