import { format } from "date-fns";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
export const objectToQueryString = (obj: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in obj) {
    const value = obj[key];
    if (!value) continue;

    if (Array.isArray(value)) {
      // If the value is an array, append each value with the same key
      value.forEach((v) => params.append(key, v));
    } else if (value instanceof Date) {
      // If the value is a Date object, format it and append
      params.append(key, formatDate(value));
    } else if (typeof value === "object") {
      // If the value is an object, append each sub-key with the same key
      for (const subKey in value) {
        params.append(`${key}[${subKey}]`, value[subKey]);
      }
    } else {
      params.append(key, value);
    }
  }

  return params.toString();
};
