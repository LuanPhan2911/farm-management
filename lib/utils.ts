import { siteConfig } from "@/configs/siteConfig";
import { getUserByEmail } from "@/services/users";
import { ActionResponse } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { getFormatter, getNow } from "next-intl/server";
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
export function successResponse(message: string): ActionResponse {
  return {
    message,
    ok: true,
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
export async function generateEmail(name: string) {
  const now = await getNow({ locale: "vi" });
  const { dateTime } = await getFormatter({ locale: "vi" });
  const prefix = slugify(name, {
    lower: true,
    replacement: "",
    trim: true,
  });
  const time = slugify(
    dateTime(now, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
    { lower: true, replacement: "" }
  );
  const postfix = slugify(`@${siteConfig.name}.com`, {
    lower: true,
  });
  const email = `${prefix}${time}${postfix}`;

  return email;
}
