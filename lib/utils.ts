import { siteConfig } from "@/configs/siteConfig";
import { getUserByEmail } from "@/services/users";
import { ActionResponse } from "@/types";
import { User } from "@clerk/nextjs/server";
import { Unit } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { getFormatter, getNow } from "next-intl/server";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";
import { any } from "zod";

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
