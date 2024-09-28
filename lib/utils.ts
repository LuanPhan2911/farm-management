import { siteConfig } from "@/configs/siteConfig";
import { ActionResponse } from "@/types";
import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { format, getHours, getMinutes } from "date-fns";
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

export function toggleSortOrder(input: string): string {
  // Split the input string by the underscore
  const parts = input.split("_");

  // If there are not exactly two parts, return the input as is
  if (parts.length !== 2) {
    return input;
  }

  const [keyPath, sortOrder] = parts;

  // Toggle the sort order between 'asc' and 'desc'
  const newSortOrder = sortOrder === "asc" ? "desc" : "asc";

  // Reconstruct the string with the new sort order
  return `${keyPath}_${newSortOrder}`;
}
export function getObjectSortOrder(input: string): Record<string, any> {
  // Split the input string by the underscore
  const parts = input.split("_");

  // If there are not exactly two parts, return an empty object
  if (parts.length !== 2) {
    return {};
  }

  const [keyPath, sortOrder] = parts;

  // Validate that the sortOrder is either 'asc' or 'desc'
  if (sortOrder !== "asc" && sortOrder !== "desc") {
    return {};
  }

  // Split the keyPath by '.' to create nested keys
  const keys = keyPath.split(".");

  // Create a nested object from the keys
  let nestedObject: Record<string, any> = {};
  let currentLevel = nestedObject;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      // If it's the last key, assign the sortOrder
      currentLevel[key] = sortOrder;
    } else {
      // Otherwise, create an empty object at this level if it doesn't exist
      currentLevel[key] = {};
      currentLevel = currentLevel[key];
    }
  });

  return nestedObject;
}
export function getPostfixSortOrder(
  input: string,
  defaultValue: "asc" | "desc" = "asc"
) {
  // Split the input by the underscore
  const parts = input.split("_");

  // If the format isn't correct, return an empty array
  if (parts.length !== 2) {
    return defaultValue;
  }
  return parts[1] === "asc" ? "asc" : "desc";
}

export function getObjectFilterString(input: string): Record<string, any> {
  // Split the input by the underscore
  const parts = input.split("_");

  // If the format isn't correct, return an empty object
  if (parts.length !== 2) {
    return {};
  }

  const [key, values] = parts;

  // Split the values part by commas and filter out empty strings
  const valueArray = values.split(",").filter((value) => value.trim() !== "");

  // If the value array is empty, return an empty object
  if (valueArray.length === 0) {
    return {};
  }

  // Construct the object in the desired format
  return {
    [key]: {
      in: valueArray,
    },
  };
}

export function getPostfixArrayFilterString(input: string): string[] {
  // Split the input by the underscore
  const parts = input.split("_");

  // If the format isn't correct, return an empty array
  if (parts.length !== 2) {
    return [];
  }

  const values = parts[1];

  // Split the values part by commas, filter out empty strings, and ensure uniqueness
  const valueArray = values
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "")
    .filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

  return valueArray;
}

export function getObjectFilterNumber(input: string): Record<string, any> {
  // Define the supported operators and their Prisma equivalents
  const operators: Record<string, string> = {
    "<=": "lte",
    ">=": "gte",
    "<": "lt",
    ">": "gt",
    "=": "equals",
  };

  // Split the input string by commas to get individual conditions
  const conditions = input.split(",");

  // Initialize an empty object to hold the final filter
  const filter: Record<string, any> = {};

  // Iterate over each condition
  for (const condition of conditions) {
    // Extract the key path and condition/value part by splitting at the last underscore
    const lastUnderscoreIndex = condition.lastIndexOf("_");
    if (lastUnderscoreIndex === -1) {
      continue; // Skip invalid format
    }

    const keyPath = condition.substring(0, lastUnderscoreIndex);
    const conditionValue = condition.substring(lastUnderscoreIndex + 1);

    // Find the operator in the conditionValue part
    const operator = Object.keys(operators).find((op) =>
      conditionValue.startsWith(op)
    );
    if (!operator) {
      continue; // Skip if no valid operator is found
    }

    // Extract the numerical value from the conditionValue part
    const value = parseFloat(conditionValue.substring(operator.length));
    if (isNaN(value)) {
      continue; // Skip if the value is not a valid number
    }

    // Split the key path into nested keys (e.g., 'humidity.value' => ['humidity', 'value'])
    const keys = keyPath.split(".");

    // Build the nested object structure
    let currentLevel = filter;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // If it's the last key, assign the Prisma condition
        currentLevel[key] = { [operators[operator]]: value };
      } else {
        // Otherwise, create an empty object at this level if it doesn't exist
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  }

  return filter;
}
export function getPostfixValueFilterNumber(
  input: string,
  key: string
): string | undefined {
  // Split the input string by commas to get individual key-value pairs
  const pairs = input.split(",");

  // Iterate over each key-value pair
  for (const pair of pairs) {
    // Split the pair by the underscore to separate the key and value
    const [pairKey, pairValue] = pair.split("_");

    // Check if the current key matches the input key
    if (pairKey === key) {
      return pairValue; // Return the corresponding value if a match is found
    }
  }

  // Return undefined if the key is not found
  return undefined;
}
export const getArrayFilterNumber = (input: string) => {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "")
    .filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness;
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

export function safeParseJSON(body: string | null) {
  if (!body) {
    return undefined;
  }
  try {
    return JSON.parse(body);
  } catch (error) {
    return undefined;
  }
}
