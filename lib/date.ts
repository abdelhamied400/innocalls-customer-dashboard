import { differenceInDays, isAfter } from "date-fns";
import { useTranslations } from "next-intl";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message?: string) => void,
  maxRange: number = 90,
  t?: ReturnType<typeof useTranslations>
): boolean => {
  if (!fromDate || !toDate) return true;

  // Compare only the date part (ignore time)
  const from = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  const to = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate()
  );

  if (isAfter(from, to)) {
    onInvalid?.(
      t?.("form.validation.date.from.isBeforeTo") ||
        "From date cannot be after to date"
    );
    return false;
  }

  if (maxRange !== -1 && differenceInDays(to, from) > maxRange) {
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

export const durationToSeconds = (duration: string) => {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else {
    return Number(parts[0]);
  }
};

// 2m 30s format
export const formatDurationShort = (
  seconds: number,
  { t = (key: string) => key }
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60) % 60;
  const secs = Math.round(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}${t("date.h")}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${t("date.m")}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}${t("date.s")}`);
  }

  return parts.join(" ");
};
