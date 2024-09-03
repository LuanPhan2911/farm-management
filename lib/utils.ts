import { siteConfig } from "@/configs/siteConfig";
import { ActionResponse } from "@/types";
import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import slugify from "slugify";
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
export function errorResponse(message: string): ActionResponse {
  return {
    message,
    ok: false,
  };
}
export function successResponse(message: string, data?: any): ActionResponse {
  return {
    message,
    ok: true,
    data,
  };
}
export function generatePassword(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
}
export function generateEmail(name: string) {
  const now = new Date();
  const prefix = slugify(name, {
    lower: true,
    replacement: "",
    trim: true,
  });
  const time = slugify(format(now, "ddMMyyyy"), {
    lower: true,
    replacement: "",
  });
  const postfix = slugify(`@${siteConfig.name}.com`, {
    lower: true,
  });
  const email = `${prefix}${time}${postfix}`;

  return email;
}
export function getFullName(user: User) {
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}
export function getEmailAddress(user: User) {
  const email = user.emailAddresses;
  return email[0].emailAddress;
}
export function removeLanguagePrefix(url: string) {
  return url.replace(/^\/(en|vi)/, "");
}
export function splitUnitValue(unit: string) {
  // Regular expression to match the unit and optional exponent
  const regex = /^([a-zA-Z]+)(\d*)$/;
  const match = unit.match(regex);

  if (match) {
    const baseUnit = match[1]; // The unit (e.g., km, m, kg)
    const exponent = match[2]; // The exponent (e.g., 2, 3) or empty string if no exponent
    return exponent ? [baseUnit, exponent] : [baseUnit];
  }

  return [unit]; // Fallback for cases that don't match the expected format
}

export function orderBySplit(input: string | null | undefined) {
  if (!input) {
    return {};
  }
  const parts = input.split("_");

  if (parts.length !== 2) {
    return {};
  }

  const [key, value] = parts;
  return { [key]: value };
}
