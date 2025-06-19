import { differenceInDays, isAfter } from "date-fns";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message: string) => void,
  maxRange: number = 90
): boolean => {
  if (!fromDate || !toDate) return true;

  if (isAfter(fromDate, toDate)) {
    onInvalid?.("From date cannot be after to date.");
    return false;
  }

  if (maxRange !== -1 && differenceInDays(toDate, fromDate) > maxRange) {
    onInvalid?.(`Maximum date range is ${maxRange} days`);
    return false;
  }

  return true;
};
