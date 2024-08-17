import { ActionResponse } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function truncateString(str: string, num: number = 50) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
export const errorResponse = (message: string): ActionResponse => {
  return {
    message,
    ok: false,
  };
};
export const successResponse = (message: string): ActionResponse => {
  return {
    message,
    ok: true,
  };
};
