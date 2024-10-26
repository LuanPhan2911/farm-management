import { siteConfig } from "@/configs/siteConfig";
import { ActionResponse } from "@/types";
import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { format, getHours, getMinutes } from "date-fns";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";
import * as cronParser from "cron-parser";

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
export function successResponse(
  message: string,
  data?: unknown
): ActionResponse {
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

export function getObjectSortOrder(input: string): Record<string, any>[] {
  const obj = safeParseJSON(input);
  if (!obj) {
    return [];
  }
  // Create a nested object from the keys
  let nestedObject: Record<string, any> = {};
  for (const [keyPath, value] of Object.entries(obj)) {
    // Split the keyPath by '.' to create nested keys
    const keys = keyPath.split(".");
    let currentLevel = nestedObject;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // If it's the last key, assign the sortOrder
        currentLevel[key] = value;
      } else {
        // Otherwise, create an empty object at this level if it doesn't exist
        currentLevel[key] = {};
        currentLevel = currentLevel[key];
      }
    });
  }
  const data: Record<string, any>[] = [];
  for (const key in nestedObject) {
    data.push({
      [key]: nestedObject[key],
    });
  }

  return data;
}
export function getObjectFilterString(
  filterString: string
): Record<string, any> {
  const obj = safeParseJSON(filterString);
  if (!obj) {
    return {};
  }
  // Create a nested object from the keys
  let nestedObject: Record<string, any> = {};
  for (const [keyPath, value] of Object.entries(obj)) {
    // Split the keyPath by '.' to create nested keys
    const keys = keyPath.split(".");
    let currentLevel = nestedObject;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // If it's the last key, assign the sortOrder
        currentLevel[key] = value;
      } else {
        // Otherwise, create an empty object at this level if it doesn't exist
        currentLevel[key] = {};
        currentLevel = currentLevel[key];
      }
    });
  }
  return nestedObject;
}
export const getObjectFilterNumber = (filterNumber: string) => {
  const obj = safeParseJSON(filterNumber);
  if (!obj) {
    return {};
  }
  // Create a nested object from the keys
  let nestedObject: Record<string, any> = {};
  for (const [keyPath, value] of Object.entries(obj)) {
    // Split the keyPath by '.' to create nested keys
    const keys = keyPath.split(".");
    let currentLevel = nestedObject;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // If it's the last key, assign the sortOrder
        currentLevel[key] = value;
      } else {
        // Otherwise, create an empty object at this level if it doesn't exist
        currentLevel[key] = {};
        currentLevel = currentLevel[key];
      }
    });
  }
  return nestedObject;
};
export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD") // Tách các dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Thay thế 'đ' thường bằng 'd'
    .replace(/Đ/g, "D"); // Thay thế 'Đ' hoa bằng 'D'
}

export function includeString(str1: string, str2: string): boolean {
  const normalizedStr1 = removeVietnameseTones(str1.toLowerCase());
  const normalizedStr2 = removeVietnameseTones(str2.toLowerCase());

  return normalizedStr1.includes(normalizedStr2);
}

export function parseToDate(
  input?: string | number | undefined | null
): Date | undefined {
  if (!input) {
    return undefined;
  }
  const date = new Date(input);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export function parseToNumber(
  input: string | undefined,
  defaultValue: number
): number {
  const parsedNumber = Number(input);

  // Check if the parsed result is a valid number, otherwise return the default value
  if (isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
}

export function isActive(pathname: string, currentPath: string) {
  return pathname.startsWith(currentPath);
}

export function convertNullToUndefined<T extends Record<string, any>>(
  obj: T
): {
  [K in keyof T]: Exclude<T[K], null> | undefined;
} {
  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    const typedKey = key as keyof T;
    if (result[typedKey] === null) {
      result[typedKey] = undefined as any; // Replace null with undefined
    }
  });

  return result as { [K in keyof T]: Exclude<T[K], null> | undefined };
}
/**
 * Splits an array into chunks of a given size
 * @param array - The array to chunk
 * @param chunkSize - The size of each chunk
 * @returns - A new array containing arrays of chunked elements
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) throw new Error("Chunk size must be greater than 0");

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

export function compareDate(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

export function concat(
  value1: string | number | undefined | null,
  value2: string | null | undefined | null,
  sep: string = " "
) {
  return `${value1 || ""}${sep}${value2 || ""}`;
}
export function parseUploadedJSONFile(file: File): Promise<{
  ok: boolean;
  message?: string;
  data?: object | any[];
}> {
  return new Promise((resolve, reject) => {
    // Check if the uploaded file is a JSON file

    if (!file.name.endsWith(".json")) {
      return resolve({
        ok: false,
        message: "Uploaded file is not a JSON file.",
      });
    }

    const reader = new FileReader();

    // Handle file read errors
    reader.onerror = () => {
      reject("Error reading the file.");
    };

    // Stream large files by reading in chunks
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileContent = event.target?.result;
      if (typeof fileContent !== "string") {
        return reject("File content is not readable as text.");
      }

      try {
        const parsedData = JSON.parse(fileContent);
        resolve({
          ok: true,
          data: parsedData,
        });
      } catch (err) {
        resolve({
          ok: false,
          message: "Error reading the file.",
        });
      }
    };

    // Read the file content as text
    reader.readAsText(file);
  });
}

export function getHourAndMinute(date: Date | undefined, defaultValue: string) {
  if (!date) {
    return defaultValue;
  }
  const hour = getHours(date);
  const minute = getMinutes(date);
  return `${hour}:${minute}`;
}

export function safeParseJSON<T extends unknown>(
  body: string | null | undefined
) {
  if (!body) {
    return undefined;
  }
  try {
    return JSON.parse(body) as T;
  } catch (error) {
    return undefined;
  }
}

export function generateCronExplanation(
  cronString: string | undefined | null
): string {
  try {
    // Attempt to parse the cron string
    if (!cronString) {
      throw Error("Empty cron");
    }
    const interval = cronParser.parseExpression(cronString);

    // Generate next run time for explanation
    const nextRun = interval.next().toDate();

    // Return a valid cron explanation with next run time
    return `${format(nextRun, "yyyy-MM-dd hh:mm aaa")}`;
  } catch (error) {
    // If the cron string is invalid, return an error message
    return "Invalid cron format";
  }
}
export function isImage(type: string): boolean {
  const imageMimeTypes = [
    "image",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/heif",
    "image/heic",
  ];

  return imageMimeTypes.includes(type);
}

export function dateToString(date: Date | undefined): string | undefined {
  return date ? `${format(date, "yyy-MM-dd")}` : undefined;
}
