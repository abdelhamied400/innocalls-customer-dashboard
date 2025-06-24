export type IntervalValue = number | false; // false indicates "never"
export type RefetchInterval = {
  label: string;
  value: IntervalValue;
};
export const refetchIntervals: RefetchInterval[] = [
  {
    label: "30 seconds",
    value: 30 * 1000, // 30 seconds in milliseconds
  },
  {
    label: "1 minute",
    value: 60 * 1000, // 1 minute in milliseconds
  },
  {
    label: "5 minutes",
    value: 5 * 60 * 1000, // 5 minutes in milliseconds
  },
  {
    label: "No Refresh",
    value: false, // never refetch
  },
];
