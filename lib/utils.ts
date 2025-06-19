import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateUUID = () =>
  Math.random().toString(36).substring(2, 15) +
  "-" +
  new Date().getTime().toString();

export const objToQueryString = (obj: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v !== undefined && v !== null) {
          params.append(`${key}[${i}]`, v);
        }
      });
    } else {
      params.append(key, value);
    }
  }
  return params.toString();
};
