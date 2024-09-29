import {
  CategoryType,
  EquipmentType,
  FertilizerType,
  Frequency,
  Gender,
  JobExperience,
  JobWorkingState,
  PesticideType,
  Season,
  SoilType,
  StaffRole,
  ToxicityLevel,
  UnitType,
  WeatherStatus,
} from "@prisma/client";
import { addDays } from "date-fns";
import { nullable, z } from "zod";
import validator from "validator";

// Custom Zod schema for date parsing
const dateSchema = z.preprocess(
  (value) => {
    // If the value is already a Date object, return it as is
    if (value instanceof Date) {
      return value;
    }

    // If it's a string, try to parse it into a Date object
    if (typeof value === "string") {
      const parsedDate = new Date(value);

      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // If parsing fails, return invalid value (Zod will throw error)
    return value;
  },
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  })
);
const stringSchema = (
  t: (arg: string, obj?: Record<string, any>) => string,
  field: string,
  options?: {
    required?: boolean;
    min?: number;
    max?: number;
  }
) => {
  const required = options?.required === false ? false : true;
  let defaultSchema = z.string({
    ...(required && {
      required_error: t(`${field}.required_error`),
    }),
  });
  if (options?.min !== undefined) {
    defaultSchema = defaultSchema.min(
      options.min,
      t(`${field}.min`, {
        min: options.min,
      })
    );
  }
  if (options?.max !== undefined) {
    defaultSchema = defaultSchema.max(
      options.max,
      t(`${field}.max`, {
        max: options.max,
      })
    );
  }
  return defaultSchema;
};
const numberSchema = (
  t: (arg: string, obj?: Record<string, any>) => string,
  field: string,
  options?: {
    min?: number;
    max?: number;
    int?: boolean;
    required?: boolean;
  }
) => {
  const required = options?.required === false ? false : true;
  let valueSchema = z.coerce.number({
    ...(required && { required_error: t(`${field}.required_error`) }),
    invalid_type_error: t(`${field}.invalid_type_error`),
  });

  if (options?.int !== undefined && options.int === true) {
    valueSchema = valueSchema.int(t(`${field}.int`));
  }

  if (options?.min !== undefined) {
    valueSchema = valueSchema.min(
      options.min,
      t(`${field}.min`, { min: options.min })
    );
  }

  // Conditionally apply the max constraint if options.max is provided
  if (options?.max !== undefined) {
    valueSchema = valueSchema.max(
      options.max,
      t(`${field}.max`, { max: options.max })
    );
  }
  return valueSchema;
};
const floatUnitSchema = (
  t: (arg: string, obj?: Record<string, any>) => string,
  field: string,
  options?: {
    min?: number;
    max?: number;
  }
) => {
  return z
    .object({
      unitId: z
        .string({
          required_error: t(`${field}.unitId.required_error`),
        })
        .nullish(),
      value: numberSchema(t, `${field}.value`, {
        max: options?.max,
        min: options?.min,
      }).nullish(),
    })
    .nullish();
};
const intUnitSchema = (
  t: (arg: string, obj?: Record<string, any>) => string,
  field: string,
  options?: {
    min?: number;
    max?: number;
  }
) => {
  return z
    .object({
      unitId: z
        .string({
          required_error: t(`${field}.unitId.required_error`),
        })
        .nullish(),
      value: numberSchema(t, `${field}.value`, {
        int: true,
        max: options?.max,
        min: options?.min,
      }).nullish(),
    })
    .nullish();
};

export const CategorySchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) =>
  z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
    }),
    slug: stringSchema(t, "slug", {
      min: 1,
      max: 100,
    }),
    type: z
      .nativeEnum(CategoryType, {
        message: t("type.enum"),
      })
      .nullish(),
    description: stringSchema(t, "description", {
      max: 255,
      required: false,
    }).nullish(),
  });
export const UnitSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) =>
  z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 50,
    }),
    type: z
      .nativeEnum(UnitType, {
        message: t("type.enum"),
      })
      .nullish(),
    description: stringSchema(t, "description", {
      max: 255,
      required: false,
    }).nullish(),
  });
export const ApplicantSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
    }),
    email: stringSchema(t, "email", {
      min: 1,
      max: 100,
    }).email(t("email.isEmail")),

    phone: stringSchema(t, "phone", {
      min: 1,
      max: 15,
    }).refine(validator.isMobilePhone, "phone.isPhone"),
    address: stringSchema(t, "address", {
      min: 1,
      max: 255,
    }),
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
  });
};
export const JobSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) =>
  z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
    }),
    description: stringSchema(t, "description", {
      min: 1,
      max: 5000,
    }),
    requirement: stringSchema(t, "requirement", {
      min: 1,
      max: 5000,
    }),
    rights: stringSchema(t, "rights", {
      min: 1,
      max: 5000,
    }),
    workingTime: stringSchema(t, "workingTime", {
      min: 1,
      max: 100,
    }),
    wage: stringSchema(t, "wage", {
      min: 1,
      max: 100,
    }),
    quantity: numberSchema(t, "quantity", {
      min: 1,
      max: 100,
      int: true,
    }),
    experience: z.nativeEnum(JobExperience, {
      message: t("experience.enum"),
    }),
    gender: z.nativeEnum(Gender, {
      message: t("gender.enum"),
    }),
    workingState: z.nativeEnum(JobWorkingState, {
      message: t("workingState.enum"),
    }),
    expiredAt: z.date().refine((expiredAt) => {
      return expiredAt >= addDays(new Date(), -1);
    }, t("expiredAt.min")),
  });
export const UserSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    email: stringSchema(t, "email", {
      min: 1,
      max: 100,
    }).email(t("email.isEmail")),

    firstName: stringSchema(t, "firstName", {
      min: 1,
      max: 100,
    }),
    lastName: stringSchema(t, "lastName", {
      min: 1,
      max: 100,
    }),

    phone: stringSchema(t, "phone", {
      min: 1,
      max: 15,
    }).refine(validator.isMobilePhone, t("phone.isPhone")),
    address: stringSchema(t, "address", {
      min: 1,
      max: 255,
    }),
  });
};

export const StaffSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
    }),
    email: stringSchema(t, "email", {
      min: 1,
      max: 100,
    }).email(t("email.isEmail")),
    password: stringSchema(t, "password", {
      min: 8,
      max: 100,
    }),

    role: z.nativeEnum(StaffRole, {
      message: t("role.enum"),
    }),
    receiverEmail: stringSchema(t, "receiverEmail", {
      max: 255,
      required: false,
    }).nullish(),
  });
};

export const OrganizationSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    slug: stringSchema(t, "slug", {
      min: 3,
      max: 100,
    }),
    createdBy: z.string({
      required_error: t("createdBy.required_error"),
    }),
  });
};

const orgRoles = ["org:admin", "org:member"] as const;
export const OrganizationMemberSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    memberId: z.string({
      required_error: t("memberId.required_error"),
    }),
    role: z.enum(orgRoles, {
      message: t("role.enum"),
    }),
  });
};

export const FieldSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 5,
      max: 100,
    }),
    location: stringSchema(t, "location", {
      min: 5,
      max: 100,
    }),
    orgId: z.string({
      required_error: t("orgId.required_error"),
    }),
    height: numberSchema(t, "height", {
      min: 0,
      max: 100_000,
    }),
    width: numberSchema(t, "width", {
      min: 0,
      max: 100_000,
    }),

    area: numberSchema(t, "area", {
      min: 0,
      max: 1_000_000,
    }),
    unitId: z.string().nullish(),
    shape: stringSchema(t, "shape", {
      max: 100,
      required: false,
    }).nullish(),
    soilType: z
      .nativeEnum(SoilType, {
        message: t("soilType.enum"),
      })
      .nullish(),
  });
};
export const WeatherSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    status: z.nativeEnum(WeatherStatus, {
      message: t("status.enum"),
    }),
    temperature: floatUnitSchema(t, "temperature", {
      min: -20,
      max: 50,
    }),
    humidity: intUnitSchema(t, "humidity", {
      min: 0,
      max: 100,
    }),
    atmosphericPressure: floatUnitSchema(t, "atmosphericPressure", {
      min: 870,
      max: 1804,
    }),
    rainfall: intUnitSchema(t, "rainfall", {
      min: 0,
      max: 100,
    }),
    fieldId: z.string(),
    note: stringSchema(t, "note", { max: 255, required: false }).nullish(),
    createdAt: z.optional(dateSchema),
  });
};
export const SoilSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    ph: numberSchema(t, "ph", {
      min: 0,
      max: 14,
    }).nullish(),
    moisture: intUnitSchema(t, "moisture", {
      min: 0,
      max: 60,
    }).nullish(),

    nutrientNitrogen: numberSchema(t, "nutrientNitrogen", {
      min: 0,
      max: 10,
    }).nullish(),
    nutrientPhosphorus: numberSchema(t, "nutrientPhosphorus", {
      min: 0,
      max: 5,
    }).nullish(),
    nutrientPotassium: numberSchema(t, "nutrientPotassium", {
      min: 0,
      max: 8,
    }).nullish(),
    nutrientUnitId: stringSchema(t, "nutrientUnitId").nullish(),
    fieldId: z.string(),
    note: stringSchema(t, "note", { max: 255, required: false }).nullish(),
    createdAt: z.optional(dateSchema),
  });
};

export const PlantSchema = (t: (arg: string) => string) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    imageUrl: stringSchema(t, "imageUrl", {
      max: 255,
      required: false,
    }).nullish(),
    categoryId: z.string({ required_error: t("categoryId.required_error") }),
    growthDuration: stringSchema(t, "growthDuration", {
      min: 3,
      max: 100,
    }),

    season: z
      .nativeEnum(Season, {
        message: "season.enum",
      })
      .nullish(),
    fertilizerType: z.nativeEnum(FertilizerType, {
      message: t("fertilizerType.enum"),
    }),
    idealTemperature: floatUnitSchema(t, "idealTemperature", {
      min: -20,
      max: 50,
    }),
    idealHumidity: intUnitSchema(t, "idealHumidity", {
      min: 0,
      max: 100,
    }),
    waterRequirement: floatUnitSchema(t, "waterRequirement", {
      min: 0,
      max: 100,
    }),
  });
};

export const FertilizerSchema = (t: (arg: string) => string) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 5,
      max: 100,
    }),
    type: z.nativeEnum(FertilizerType, {
      message: t("type.enum"),
    }),
    nutrientOfNPK: stringSchema(t, "nutrientOfNPK", {
      min: 3,
      max: 100,
    }),
    composition: stringSchema(t, "composition", {
      max: 255,
      required: false,
    }).nullish(),
    manufacturer: stringSchema(t, "manufacturer", {
      max: 255,
      required: false,
    }).nullish(),
    applicationMethod: stringSchema(t, "applicationMethod", {
      max: 100,
      required: false,
    }).nullish(),
    frequencyOfUse: z
      .nativeEnum(Frequency, {
        message: t("frequencyOfUse.enum"),
      })
      .nullish(),
    recommendedDosage: floatUnitSchema(t, "recommendedDosage", {
      min: 0,
      max: 100,
    }),
  });
};
export const PesticideSchema = (t: (arg: string) => string) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    type: z.nativeEnum(PesticideType, {
      message: t("type.enum"),
    }),
    ingredient: stringSchema(t, "ingredient", {
      max: 255,
      required: false,
    }).nullish(),
    manufacturer: stringSchema(t, "manufacturer", {
      max: 255,
      required: false,
    }).nullish(),
    withdrawalPeriod: intUnitSchema(t, "withdrawalPeriod", {
      min: 0,
      max: 100,
    }),
    toxicityLevel: z
      .nativeEnum(ToxicityLevel, {
        message: t("toxicityLevel.enum"),
      })
      .nullish(),
    recommendedDosage: floatUnitSchema(t, "recommendedDosage", {
      min: 0,
      max: 100,
    }),

    applicationMethod: stringSchema(t, "applicationMethod", {
      max: 100,
      required: false,
    }).nullish(),
  });
};
export const EquipmentSchema = (t: (arg: string) => string) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 50,
    }),
    type: z.nativeEnum(EquipmentType, {
      message: t("type.enum"),
    }),
    brand: stringSchema(t, "brand", {
      min: 3,
      max: 100,
    }),
    purchaseDate: z.date({
      required_error: t("purchaseDate.required_error"),
      invalid_type_error: t("purchaseDate.invalid_type_error"),
    }),
    purchasePrice: floatUnitSchema(t, "purchasePrice", {
      min: 0,
      max: 1_000_000_000,
    }),
    status: stringSchema(t, "status", {
      max: 255,
      required: false,
    }).nullish(),
    maintenanceSchedule: stringSchema(t, "maintenanceSchedule", {
      max: 255,
      required: false,
    }).nullish(),
    operatingHours: numberSchema(t, "operatingHours", {
      min: 0,
      max: 1_000_000,
      int: true,
      required: false,
    }).nullish(),
    location: stringSchema(t, "location", {
      max: 255,
      required: false,
    }).nullish(),
    fuelConsumption: numberSchema(t, "fuelConsumption", {
      min: 0,
      max: 100_000,
      int: true,
      required: false,
    }).nullish(),
    energyType: stringSchema(t, "energyType", {
      max: 255,
      required: false,
    }).nullish(),
    description: stringSchema(t, "description", {
      max: 255,
      required: false,
    }).nullish(),
    imageUrl: stringSchema(t, "imageUrl", {
      max: 255,
      required: false,
    }).nullish(),
  });
};

export const CropSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 5,
      max: 100,
    }),
    dateRange: z.object({
      startDate: z.date({
        invalid_type_error: t("dateRange.startDate.invalid_type_error"),
        required_error: t("dateRange.startDate.required_error"),
      }),
      endDate: z.date().nullable(),
    }),
    fieldId: z.string(),
    plantId: z.string({
      required_error: t("plantId.required_error"),
    }),
    estimatedYield: floatUnitSchema(t, "estimatedYield", {
      min: 0,
      max: 1_000_000_000,
    }),
    actualYield: floatUnitSchema(t, "actualYield", {
      min: 0,
      max: 1_000_000_000,
    }),
    status: stringSchema(t, "status", { max: 255, required: false }).nullish(),
  });
};

export const TaskSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
      required: false,
    })
      .regex(/^[a-zA-Z0-9_.-]+$/, t("name.regex"))
      .nullable(), // Allow name to be null
    request: z.object({
      url: z
        .string()
        .url(t("request.url.invalid"))
        .refine((url) => {
          try {
            const parsedUrl = new URL(url);
            // Ensure the URL is absolute and not localhost
            return (
              parsedUrl.hostname !== "localhost" &&
              parsedUrl.hostname !== "127.0.0.1"
            );
          } catch (e) {
            return false;
          }
        }, t("request.url.noneLocalHost")),
      headers: z.union([
        z.object({}).passthrough(),
        z.string().transform((val) => {
          // Remove all newline characters and extra spaces
          if (!val) {
            return null;
          }
          const sanitizedBody = val.replace(/\n/g, "").trim();
          // Try parsing it as JSON, return the original string if it fails
          try {
            return JSON.parse(sanitizedBody);
          } catch (error) {
            return null;
          }
        }),
        z.null(),
      ]),
      body: z.union([
        z.string().transform((val) => {
          // Remove all newline characters and extra spaces
          if (!val) {
            return null;
          }
          const sanitizedBody = val.replace(/\n/g, "").trim();

          return sanitizedBody;
        }),
        z.null(),
      ]),
    }),
    scheduled_for: z.string().nullable(),
    delay: z.string().default("5s"),
  });
};
export const ScheduleSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
      required: false,
    })
      .regex(/^[a-zA-Z0-9_.-]+$/, t("name.regex"))
      .nullable(), // Allow name to be null
    description: stringSchema(t, "description", {
      max: 255,
      required: false,
    }).nullable(),
    request: z.object({
      url: z
        .string()
        .url(t("request.url.invalid"))
        .refine((url) => {
          try {
            const parsedUrl = new URL(url);
            // Ensure the URL is absolute and not localhost
            return (
              parsedUrl.hostname !== "localhost" &&
              parsedUrl.hostname !== "127.0.0.1"
            );
          } catch (e) {
            return false;
          }
        }, t("request.url.noneLocalHost")),
      headers: z.union([
        z.object({}).passthrough(),
        z.string().transform((val) => {
          // Remove all newline characters and extra spaces
          if (!val) {
            return null;
          }
          const sanitizedBody = val.replace(/\n/g, "").trim();
          // Try parsing it as JSON, return the original string if it fails
          try {
            return JSON.parse(sanitizedBody);
          } catch (error) {
            return null;
          }
        }),
        z.null(),
      ]),
      body: z.union([
        z.string().transform((val) => {
          // Remove all newline characters and extra spaces
          if (!val) {
            return null;
          }
          const sanitizedBody = val.replace(/\n/g, "").trim();

          return sanitizedBody;
        }),
        z.null(),
      ]),
    }),
    cron: stringSchema(t, "cron", {
      required: false,
    })
      .regex(
        /^(\*|([0-5]?\d|\*\/[0-5]?\d|[0-5]?\d(?:-[0-5]?\d)?(?:,[0-5]?\d(?:-[0-5]?\d)?)*)?) (\*|([01]?\d|2[0-3]|\*\/[01]?\d|[01]?\d(?:-[01]?\d)?(?:,[01]?\d(?:-[01]?\d)?)*)?) (\*|([1-9]|[12]\d|3[01]|\*\/[1-9]|[1-9](?:-[12]?\d|3[01])?(?:,[1-9]|[12]?\d|3[01](?:-[12]?\d|3[01])?)*)?) (\*|([1-9]|1[0-2]|\*\/[1-9]|[1-9](?:-[1-9]|1[0-2])?(?:,[1-9]|1[0-2](?:-[1-9]|1[0-2])?)*)?) (\*|([0-6]|\*\/[0-6]|[0-6](?:-[0-6])?(?:,[0-6](?:-[0-6])?)*)?)$/,
        { message: t("cron.regex") }
      )
      .nullable(),
    paused: z.boolean().default(false),
  });
};
export const SendEmailSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    receivers: z
      .array(z.string().email(t("receivers.email.valid")), {
        required_error: t("receivers.required_error"),
      })
      .min(1, t("receivers.atLeast")),
    subject: stringSchema(t, "subject", {
      min: 1,
      max: 255,
    }),
    sender: stringSchema(t, "sender", {
      min: 1,
      max: 255,
    }),
    contents: z
      .array(z.string().min(1, t("contents.item.min")), {
        required_error: t("contents.required_error"),
      })
      .min(1, t("contents.atLeast")),
  });
};
