import { differenceInDays, isAfter } from "date-fns";

export const isValidDateRange = (
  fromDate?: Date,
  toDate?: Date,
  onInvalid?: (message: string) => void,
  maxRange: number = 90
): boolean => {
  // check if fromDate is after toDate and max range is 90 days
  if (!fromDate) {
    onInvalid?.("From date is required.");
    return false;
  }
  if (!toDate) {
    onInvalid?.("To date is required.");
    return false;
  }
  if (isAfter(fromDate, toDate)) {
    onInvalid?.("From date cannot be after to date.");
    return false;
  }
  if (maxRange !== -1) {
    if (differenceInDays(toDate, fromDate) > maxRange) {
      onInvalid?.(`Maximum date range is ${maxRange} days`);
      return false;
    }
  }
  return true;
};
