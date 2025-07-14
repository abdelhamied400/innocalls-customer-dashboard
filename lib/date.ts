import { differenceInDays, isAfter } from "date-fns";
import { useTranslations } from "next-intl";
import type { Duration } from "date-fns";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message?: string) => void,
  maxRange: number = 90,
  t?: ReturnType<typeof useTranslations>
): boolean => {
  if (!fromDate || !toDate) return true;

  if (isAfter(fromDate, toDate)) {
    onInvalid?.(
      t?.("form.validation.date.from.isBeforeTo") ||
        "From date cannot be after to date"
    );
    return false;
  }

  if (maxRange !== -1 && differenceInDays(toDate, fromDate) > maxRange) {
    onInvalid?.(
      t?.("form.validation.date.maxRangeExceeded", { maxRange }) ||
        `Maximum date range is ${maxRange} days`
    );
    return false;
  }

  return true;
};

// hh:mm:ss format
export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    Math.floor(hours).toString().padStart(2, "0"),
    Math.floor(minutes).toString().padStart(2, "0"),
    Math.floor(secs).toString().padStart(2, "0"),
  ].join(":");
};

// 2m 30s format
export const formatDurationShort = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60) % 60;
  const secs = Math.round(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(" ");
};
