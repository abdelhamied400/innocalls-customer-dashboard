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
    if (obj[key] !== undefined && obj[key] !== null) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
};
