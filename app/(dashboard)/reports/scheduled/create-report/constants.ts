import { WeekDay } from "./types";

export const WEEK_DAYS: WeekDay[] = [
  "sat",
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
];

export const DAY_MAP: Record<WeekDay, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

// Generate time options for every hour (12:00 AM to 11:00 PM)
export const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour24 = i;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const period = hour24 < 12 ? "AM" : "PM";
  const label = `${hour12}:00 ${period}`;
  const value = `${hour24.toString().padStart(2, "0")}:00`;
  return { label, value };
});

export const MONTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));
