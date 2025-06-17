import { differenceInDays, isAfter } from "date-fns";
import { useTranslations } from "next-intl";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message: string) => void,
  maxRange: number = 90,
  t?: ReturnType<typeof useTranslations>
): boolean => {
  // check if fromDate is after toDate and max range is 90 days
  if (!fromDate) {
    onInvalid?.(t?.("form.validation.date.from.required") || "From date is required");
    return false;
  }
  if (!toDate) {
    onInvalid?.(t?.("form.validation.date.to.required") || "To date is required");
    return false;
  }
  if (isAfter(fromDate, toDate)) {
    onInvalid?.(t?.("form.validation.date.from.isBeforeTo") || "From date cannot be after to date");
    return false;
  }
  if (maxRange !== -1) {
    if (differenceInDays(toDate, fromDate) > maxRange) {
      onInvalid?.(
        t?.("form.validation.date.maxRangeExceeded", { maxRange }) ||
          `Maximum range is ${maxRange} days`
      );
      return false;
    }
  }
  return true;
};
