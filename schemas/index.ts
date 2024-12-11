import {
  ActivityPriority,
  ActivityStatus,
  CategoryType,
  CropStatus,
  EquipmentStatus,
  EquipmentType,
  FertilizerType,
  Frequency,
  Gender,
  JobExperience,
  JobWorkingState,
  MaterialType,
  PesticideType,
  Season,
  SoilType,
  StaffRole,
  ToxicityLevel,
  UnitType,
  WeatherStatus,
} from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";
import { orgRoles } from "@/types";

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
      min: 5,
      max: 255,
    }),
    description: stringSchema(t, "description", {
      max: 5000,
    }),
    requirement: stringSchema(t, "requirement", {
      max: 5000,
    }),
    rights: stringSchema(t, "rights", {
      max: 5000,
    }),
    workingTime: stringSchema(t, "workingTime", {
      min: 5,
      max: 100,
    }),
    wage: stringSchema(t, "wage", {
      min: 5,
      max: 100,
    }),
    quantity: numberSchema(t, "quantity", {
      min: 1,
      max: 10,
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
      required: false,
    }).nullish(),
    lastName: stringSchema(t, "lastName", {
      min: 1,
      max: 100,
      required: false,
    }).nullish(),

    phone: stringSchema(t, "phone", {
      min: 1,
      max: 15,
      required: false,
    })
      .refine(validator.isMobilePhone, t("phone.isPhone"))
      .nullish(),
    address: stringSchema(t, "address", {
      min: 1,
      max: 255,
      required: false,
    }).nullish(),
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
    baseHourlyWage: numberSchema(t, "baseHourlyWage", {
      min: 0,
      max: 500_000,
      required: false,
    }).nullish(),
    phone: stringSchema(t, "phone", {
      min: 9,
      max: 15,
      required: false,
    })
      .refine(validator.isMobilePhone, t("phone.isPhone"))
      .nullish(),
    address: stringSchema(t, "address", {
      min: 1,
      max: 255,
      required: false,
    }).nullish(),

    startToWorkDate: z.date({
      invalid_type_error: t("startToWorkDate.invalid_type_error"),
      required_error: t("startToWorkDate.required_error"),
    }),

    receiverEmail: stringSchema(t, "receiverEmail", {
      max: 255,
      required: false,
    }).nullish(),
  });
};
export const StaffUpdateSchema = (
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
    role: z.nativeEnum(StaffRole, {
      message: t("role.enum"),
    }),
    baseHourlyWage: numberSchema(t, "baseHourlyWage", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
    phone: stringSchema(t, "phone", {
      min: 9,
      max: 15,
      required: false,
    })
      .refine(validator.isMobilePhone, t("phone.isPhone"))
      .nullish(),
    address: stringSchema(t, "address", {
      min: 1,
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
      min: 3,
      max: 100,
    }),
    orgId: stringSchema(t, "orgId", {
      required: false,
    }).nullish(),

    area: numberSchema(t, "area", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
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
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
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

export const PlantSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
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
      max: 100,
      required: false,
    }).nullish(),

    season: z
      .nativeEnum(Season, {
        message: "season.enum",
      })
      .nullish(),
    fertilizerType: z
      .nativeEnum(FertilizerType, {
        message: t("fertilizerType.enum"),
      })
      .nullish(),
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
export const PlantFertilizerSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    plantId: stringSchema(t, "plantId", { required: true }),
    fertilizerId: stringSchema(t, "fertilizerId", { required: true }),
    stage: stringSchema(t, "stage", {
      min: 1,
      max: 100,
    }),
    dosage: floatUnitSchema(t, "dosage", {
      min: 0,
      max: 100,
    }).nullish(),
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
  });
};
export const PlantPesticideSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    plantId: stringSchema(t, "plantId", { required: true }),
    pesticideId: stringSchema(t, "pesticideId", { required: true }),
    stage: stringSchema(t, "stage", {
      min: 1,
      max: 100,
    }),
    dosage: floatUnitSchema(t, "dosage", {
      min: 0,
      max: 100,
    }).nullish(),
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
  });
};

export const FertilizerSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 2,
      max: 100,
    }),
    type: z
      .nativeEnum(FertilizerType, {
        message: t("type.enum"),
      })
      .nullish(),
    nutrientOfNPK: stringSchema(t, "nutrientOfNPK", {
      max: 100,
      required: false,
    }).nullish(),
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

export const PesticideSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    type: z
      .nativeEnum(PesticideType, {
        message: t("type.enum"),
      })
      .nullish(),
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

export const EquipmentSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 50,
    }),
    type: z.nativeEnum(EquipmentType, {
      message: t("type.enum"),
    }),
    brand: stringSchema(t, "brand", {
      max: 100,
      required: false,
    }).nullish(),
    purchaseDate: z
      .date({
        required_error: t("purchaseDate.required_error"),
        invalid_type_error: t("purchaseDate.invalid_type_error"),
      })
      .nullish(),
    purchasePrice: floatUnitSchema(t, "purchasePrice", {
      min: 0,
      max: 1_000_000_000,
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

export const EquipmentDetailSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    equipmentId: stringSchema(t, "equipmentId", {
      required: true,
    }),
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
      required: false,
    }).nullish(),
    status: z.nativeEnum(EquipmentStatus, {
      message: t("status.enum"),
    }),
    maxOperatingHours: numberSchema(t, "maxOperatingHours", {
      min: 0,
      max: 10_000,
      int: true,
    }),
    location: stringSchema(t, "location", {
      max: 100,
      required: false,
    }).nullish(),
    maxFuelConsumption: numberSchema(t, "maxFuelConsumption", {
      min: 0,
      max: 10_000,
      required: false,
    }).nullish(),
    unitId: stringSchema(t, "unitId", { required: false }).nullish(),
    baseFuelPrice: numberSchema(t, "baseFuelPrice", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
    energyType: stringSchema(t, "energyType", {
      max: 100,
      required: false,
    }).nullish(),
  });
};
export const EquipmentUsageSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    equipmentDetailId: stringSchema(t, "equipmentDetailId", { required: true }),
    activityId: stringSchema(t, "activityId"),
    usageStartTime: z.date({
      invalid_type_error: t("usageStartTime.invalid_type_error"),
      required_error: t("usageStartTime.required_error"),
    }),
    duration: numberSchema(t, "duration", {
      min: 0,
      max: 100,
    }),
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
    operatorId: stringSchema(t, "operatorId", {
      required: false,
    }).nullish(),
    fuelConsumption: numberSchema(t, "fuelConsumption", {
      min: 0,
      max: 10_000,
      required: false,
    }).nullish(),
    unitId: stringSchema(t, "unitId", { required: false }).nullish(),
    fuelPrice: numberSchema(t, "fuelPrice", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
    rentalPrice: numberSchema(t, "rentalPrice", {
      min: 0,
      max: 10_000_000,
      required: false,
    }).nullish(),
  });
};
export const EquipmentUsageUpdateSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    activityId: stringSchema(t, "activityId", { required: false }).nullish(),
    usageStartTime: z.date({
      invalid_type_error: t("usageStartTime.invalid_type_error"),
      required_error: t("usageStartTime.required_error"),
    }),
    duration: numberSchema(t, "duration", {
      min: 0,
      max: 100,
    }),
    note: stringSchema(t, "note", {
      max: 255,
      required: false,
    }).nullish(),
    operatorId: stringSchema(t, "operatorId", {
      required: false,
    }).nullish(),
    fuelConsumption: numberSchema(t, "fuelConsumption", {
      min: 0,
      max: 10_000,
      required: false,
    }).nullish(),
    unitId: stringSchema(t, "unitId", { required: false }).nullish(),
    fuelPrice: numberSchema(t, "fuelPrice", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
    rentalPrice: numberSchema(t, "rentalPrice", {
      min: 0,
      max: 10_000_000,
      required: false,
    }).nullish(),
  });
};

export const MaterialSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    quantityInStock: numberSchema(t, "quantityInStock", {
      min: 1,
      max: 1_000,
      required: true,
      int: true,
    }),
    basePrice: numberSchema(t, "basePrice", {
      min: 0,
      max: 10_000_000,
      required: false,
    }).nullish(),

    unitId: stringSchema(t, "unitId", { required: true }),
    type: z.nativeEnum(MaterialType, {
      message: t("type.enum"),
    }),
    typeId: z.string().nullish(),
    description: stringSchema(t, "description", {
      max: 100,
      required: false,
    }).nullish(),
    imageUrl: stringSchema(t, "imageUrl", {
      max: 255,
      required: false,
    }).nullish(),
  });
};
export const MaterialUsageSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    unitId: stringSchema(t, "unitId", { required: true }),
    materialId: stringSchema(t, "materialId", { required: true }),
    activityId: stringSchema(t, "activityId"),
    quantityUsed: numberSchema(t, "quantityUsed", {
      min: 1,
      max: 1_000,
      required: true,
      int: true,
    }),
    actualPrice: numberSchema(t, "actualPrice", {
      min: 0,
      max: 10_000_000,
      required: false,
    }).nullish(),
  });
};
export const MaterialUsageUpdateSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    activityId: stringSchema(t, "activityId", { required: false }).nullish(),
    quantityUsed: numberSchema(t, "quantityUsed", {
      min: 1,
      max: 1_000,
      required: true,
      int: true,
    }),
    actualPrice: numberSchema(t, "actualPrice", {
      min: 0,
      max: 10_000_000,
      required: false,
    }).nullish(),
    unitId: stringSchema(t, "unitId", { required: true }),
  });
};

export const ActivitySchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 1,
      max: 100,
      required: true,
    }),
    description: stringSchema(t, "description", {
      max: 255,
      required: false,
    }).nullish(),
    cropId: stringSchema(t, "cropId", {
      required: true,
    }),
    activityDate: z.date({
      invalid_type_error: t("activityDate.invalid_type_error"),
      required_error: t("activityDate.required_error"),
    }),
    status: z.nativeEnum(ActivityStatus, {
      message: t("status.enum"),
    }),
    priority: z.nativeEnum(ActivityPriority, {
      message: t("priority.enum"),
    }),
    estimatedDuration: numberSchema(t, "estimatedDuration", {
      min: 1,
      max: 100,
    }),
    actualDuration: numberSchema(t, "actualDuration", {
      min: 1,
      max: 100,
      required: false,
    }).nullish(),

    assignedTo: z.array(z.string(), {
      required_error: t("assignedTo.required_error"),
    }),
  });
};

export const ActivityAssignedSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    activityId: z.string(),
    assignedTo: z.array(z.string(), {
      required_error: t("assignedTo.required_error"),
    }),
  });
};
export const ActivityAssignedUpdateSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    actualWork: numberSchema(t, "actualWork", {
      min: 1,
      max: 10_000,
      required: false,
    }).nullish(),
    hourlyWage: numberSchema(t, "hourlyWage", {
      min: 0,
      max: 1_000_000,
      required: false,
    }).nullish(),
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

export const MessageSchema = () => {
  return z.object({
    content: z
      .string({ required_error: "Content is required" })
      .max(5000, "Max content length is 5000 characters"),
    fileIds: z.array(z.string()).nullish(),
    fileUrl: z.string().nullish(),
    name: z.string().nullish(),
    type: z.string().nullish(),
  });
};
export const FileNameSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", { min: 1, max: 255 }),
  });
};
export const FileCopySchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: z.string(),
    url: z.string().url(t("url.invalid")),
    ownerId: z.string(),
    isPublic: z.boolean().optional(),
    orgId: z.string().nullish(),
    type: z.string(),
  });
};
export const CropSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    name: stringSchema(t, "name", {
      min: 2,
      max: 100,
    }),
    startDate: z.date({
      invalid_type_error: t("startDate.invalid_type_error"),
      required_error: t("startDate.required_error"),
    }),
    endDate: z.date().nullish(),
    fieldId: z.string({
      required_error: t("fieldId.required_error"),
    }),
    plantId: z.string({
      required_error: t("plantId.required_error"),
    }),
    unitId: stringSchema(t, "unitId"),
    estimatedYield: numberSchema(t, "estimatedYield", {
      min: 0,
      max: 1_000_000_000,
    }),
    actualYield: numberSchema(t, "actualYield", {
      min: 0,
      max: 1_000_000_000,
      required: false,
    }).nullish(),

    status: z.nativeEnum(CropStatus, {
      message: t("status.enum"),
    }),
  });
};

export const CropLearnedLessonsSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    learnedLessons: stringSchema(t, "learnedLessons", {
      max: 5000,
      required: false,
    }).nullish(),
  });
};

export const FieldLocationSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    latitude: numberSchema(t, "latitude", {
      min: -90,
      max: 90,
      required: false,
    }).nullish(),
    longitude: numberSchema(t, "longitude", {
      min: -180,
      max: 180,
      required: false,
    }).nullish(),
    location: stringSchema(t, "location", {
      required: false,
    }).nullish(),
  });
};

export const LocationSelectSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    city: stringSchema(t, "city", { required: false }).nullish(),
    district: stringSchema(t, "district", { required: false }).nullish(),
    town: stringSchema(t, "town", { required: false }).nullish(),
  });
};

export const OTPCodeSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z
    .object({
      code: stringSchema(t, "code", {
        min: 1,
      }),
      confirmCode: z.string({ required_error: "Required confirm code" }),
    })
    .refine(
      ({ code, confirmCode }) => {
        return code === confirmCode;
      },
      {
        message: t("code.confirm"),
        path: ["code"],
      }
    );
};

export const StoreSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    cropId: z.string(),
    imageUrl: stringSchema(t, "imageUrl"),
    name: stringSchema(t, "name", {
      min: 3,
      max: 100,
    }),
    description: stringSchema(t, "description", {
      min: 1,
      max: 1000,
    }),
    address: stringSchema(t, "address", {
      min: 3,
      max: 255,
    }),
    phoneNumber: stringSchema(t, "phoneNumber", {
      min: 1,
      max: 15,
    }).refine(validator.isMobilePhone, "phoneNumber.isPhone"),
    price: numberSchema(t, "price", {
      min: 500,
      max: 10_000_000,
    }),
    unitId: stringSchema(t, "unitId"),
    isFeature: z.boolean().default(false),
    isPublic: z.boolean().default(false),
  });
};

export const HarvestSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    harvestDate: z.date({
      invalid_type_error: t("harvestDate.invalid_type_error"),
      required_error: t("harvestDate.required_error"),
    }),
    value: numberSchema(t, "value", {
      min: 0,
      max: 1_000_000_000,
    }),
    cropId: z.string(),
    createdById: z.string(),
    unitId: stringSchema(t, "unitId"),
  });
};
export const SaleSchema = (
  t: (arg: string, obj?: Record<string, any>) => string
) => {
  return z.object({
    saleDate: z.date({
      invalid_type_error: t("saleDate.invalid_type_error"),
      required_error: t("saleDate.required_error"),
    }),
    customerName: stringSchema(t, "customerName", {
      min: 3,
      max: 100,
    }),
    customerEmail: stringSchema(t, "customerEmail", {
      min: 3,
      max: 100,
    }),

    customerAddress: stringSchema(t, "customerAddress", {
      min: 3,
      max: 255,
    }),
    customerPhone: stringSchema(t, "customerPhone", {
      min: 8,
      max: 15,
    }).refine(validator.isMobilePhone, "customerPhone.isPhone"),

    value: numberSchema(t, "value", {
      min: 0,
      max: 1_000_000_000,
    }),
    price: numberSchema(t, "price", {
      min: 0,
      max: 1_000_000_000,
    }),
    cropId: z.string(),
    createdById: z.string(),
    unitId: stringSchema(t, "unitId"),
  });
};
