import { differenceInCalendarDays, format, parseISO } from "date-fns";

import type { HelpRequest } from "@/types";

export function neededByLabel(request: HelpRequest, now = new Date()): string {
  if (request.status === "fulfilled") return "Fulfilled";
  const date = parseISO(request.neededBy);
  const days = differenceInCalendarDays(date, now);
  if (days < 0) return "Past due";
  if (days === 0) return "Needed today";
  if (days === 1) return "Needed tomorrow";
  if (days <= 6) return `Needed by ${format(date, "EEEE")}`;
  return `Needed by ${format(date, "d MMM")}`;
}

export function isUrgent(request: HelpRequest, now = new Date()): boolean {
  return request.status === "open" && differenceInCalendarDays(parseISO(request.neededBy), now) <= 3;
}
