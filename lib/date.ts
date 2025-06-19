import { differenceInDays, isAfter } from "date-fns";
import { useTranslations } from "next-intl";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message: string) => void,
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
        `Maximum range is ${maxRange} days`
    );
    return false;
  }

  return true;
};
