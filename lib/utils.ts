import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateUUID = () =>
  Math.random().toString(36).substring(2, 15) +
  "-" +
  new Date().getTime().toString();
