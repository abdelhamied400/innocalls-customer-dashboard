import { differenceInDays, format, FormatOptions, isAfter } from "date-fns";
import { useTranslations } from "@/providers/TranslationProvider";
import { arEG, enUS } from "date-fns/locale";
import { LocaleSlug } from "@/i18n/config";

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
export const formatDuration = (seconds: number, config: {
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
} = {}): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  
  if (config.showHours !== false) {
    parts.push(Math.floor(hours).toString().padStart(2, "0"));
  }
  if (config.showMinutes !== false) {
    parts.push(Math.floor(minutes).toString().padStart(2, "0"));
  }
  if (config.showSeconds !== false) {
    parts.push(Math.floor(secs).toString().padStart(2, "0"));
  }
  
  return parts.join(":");
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

// Jul 11, 2025
export const formatDate = (
  date: Date,
  options?: Omit<FormatOptions, "locale"> & { locale: LocaleSlug }
) => {
  const formatString =
    options?.locale === "ar" ? "MMMM d, yyyy" : "MMM d, yyyy";

  return format(date, formatString, {
    ...options,
    locale: options?.locale === "ar" ? arEG : enUS,
  });
};
