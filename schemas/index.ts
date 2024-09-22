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
import { z } from "zod";
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

export const CategorySchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    slug: z.string().min(1, t("slug.min")).max(100, t("slug.max")),
    description: z.optional(z.string().max(255, t("description.max"))),
    type: z.optional(
      z.nativeEnum(CategoryType, {
        message: t("type.enum"),
      })
    ),
  });
export const UnitSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(50, t("name.max")),
    type: z.optional(z.nativeEnum(UnitType), {
      message: t("type.enum"),
    }),
    description: z.optional(z.string().max(100, t("description.max"))),
  });
export const JobSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    description: z
      .string()
      .min(1, t("description.min"))
      .max(5000, t("description.max")),
    requirement: z
      .string()
      .min(1, t("requirement.min"))
      .max(5000, t("requirement.max")),
    rights: z.string().min(1, t("rights.min")).max(5000, t("rights.max")),
    workingTime: z
      .string()
      .min(1, t("workingTime.min"))
      .max(100, t("workingTime.max")),
    wage: z.string().min(1, t("wage.min")).max(100, t("wage.max")),
    quantity: z.coerce
      .number({
        required_error: t("quantity.required_error"),
        invalid_type_error: t("quantity.invalid_type_error"),
      })
      .min(1, t("quantity.min"))
      .max(100, t("quantity.max"))
      .int(t("quantity.int")),
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
export const ApplicantSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    email: z
      .string()
      .min(1, t("email.min"))
      .max(100, t("email.max"))
      .email(t("email.isEmail")),

    phone: z
      .string()
      .min(1, t("phone.min"))
      .max(15, t("phone.max"))
      .refine(validator.isMobilePhone, "phone.isPhone"),
    address: z.string().min(1, t("address.min")).max(100, t("address.max")),
    note: z.optional(z.string().max(200, t("note.max"))),
  });
};

export const StaffSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({ required_error: t("name.required_error") })
      .min(1, t("name.min"))
      .max(100, t("name.max")),
    email: z
      .string({ required_error: t("email.required_error") })
      .min(1, t("email.min"))
      .email(t("email.isEmail"))
      .max(100, t("email.max")),
    password: z
      .string({ required_error: t("password.required_error") })
      .min(8, t("password.min"))
      .max(50, t("password.max")),

    role: z.nativeEnum(StaffRole, {
      message: t("role.enum"),
    }),
    receiverEmail: z.optional(z.string().max(200, t("receiverEmail.max"))),
  });
};

export const UserSchema = (t: (arg: string) => string) => {
  return z.object({
    email: z
      .string()
      .min(1, t("email.min"))
      .max(100, t("email.max"))
      .email(t("email.isEmail")),

    firstName: z
      .string()
      .min(1, t("firstName.min"))
      .max(100, t("firstName.max")),
    lastName: z.string().min(1, t("lastName.min")).max(100, t("lastName.max")),

    phone: z
      .string()
      .min(1, t("phone.min"))
      .max(15, t("phone.max"))
      .refine(validator.isMobilePhone, t("phone.isPhone")),
    address: z.string().min(1, t("address.min")).max(100, t("address.max")),
  });
};

export const OrganizationSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(3, t("name.min"))
      .max(100, t("name.max")),
    slug: z
      .string({
        required_error: t("slug.required_error"),
      })
      .min(3, t("slug.min"))
      .max(100, t("slug.max")),
    createdBy: z.string({
      required_error: t("createdBy.required_error"),
    }),
  });
};

const orgRoles = ["org:admin", "org:member"] as const;
export const OrganizationMemberSchema = (t: (arg: string) => string) => {
  return z.object({
    memberId: z.string({
      required_error: t("memberId.required_error"),
    }),
    role: z.enum(orgRoles, {
      message: t("role.enum"),
    }),
  });
};

export const FieldSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({ required_error: t("name.required_error") })
      .min(5, t("name.min"))
      .max(100, t("name.max")),
    location: z
      .string({ required_error: t("location.required_error") })
      .min(5, t("location.min"))
      .max(100, t("location.max")),
    orgId: z.string({
      required_error: t("orgId.required_error"),
    }),
    height: z.coerce
      .number({
        required_error: t("height.required_error"),
        invalid_type_error: t("height.invalid_type_error"),
      })
      .min(0, t("height.min"))
      .max(100_000, t("height.max")),
    width: z.coerce
      .number({
        required_error: t("width.required_error"),
        invalid_type_error: t("width.invalid_type_error"),
      })
      .min(0, t("width.min"))
      .max(100_000, t("width.max")),

    area: z.coerce
      .number({
        required_error: t("area.required_error"),
        invalid_type_error: t("area.invalid_type_error"),
      })
      .min(0, t("area.min"))
      .max(1_000_000, t("width.max")),
    unitId: z.string({
      required_error: t("unitId.required_error"),
    }),
    shape: z.optional(z.string().max(100, t("shape.max"))),
    soilType: z.optional(
      z.nativeEnum(SoilType, {
        message: t("soilType.enum"),
      })
    ),
  });
};
export const WeatherSchema = (t: (arg: string) => string) => {
  return z.object({
    status: z.nativeEnum(WeatherStatus, {
      message: t("status.enum"),
    }),
    temperature: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("temperature.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("temperature.value.required_error"),
              invalid_type_error: t("temperature.value.invalid_type_error"),
            })
            .min(-20, t("temperature.value.min"))
            .max(50, t("temperature.value.max")),
        })
        .partial()
    ),
    humidity: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("humidity.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("humidity.value.required_error"),
              invalid_type_error: t("humidity.value.invalid_type_error"),
            })
            .int(t("humidity.value.int"))
            .min(0, t("humidity.value.min"))
            .max(100, t("humidity.value.max")),
        })
        .partial()
    ),
    atmosphericPressure: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("atmosphericPressure.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("atmosphericPressure.value.required_error"),
              invalid_type_error: t(
                "atmosphericPressure.value.invalid_type_error"
              ),
            })
            .min(870, t("atmosphericPressure.value.min"))
            .max(1084, t("atmosphericPressure.value.max")),
        })
        .partial()
    ),
    rainfall: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("rainfall.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("rainfall.value.required_error"),
              invalid_type_error: t("rainfall.value.invalid_type_error"),
            })
            .int(t("rainfall.value.int"))
            .min(0, t("rainfall.value.min"))
            .max(100, t("rainfall.value.max")),
        })
        .partial()
    ),
    fieldId: z.string(),
    createdAt: z.optional(dateSchema),
  });
};
export const SoilSchema = (t: (arg: string) => string) => {
  return z.object({
    ph: z.optional(
      z.coerce
        .number({
          required_error: t("ph.required_error"),
          invalid_type_error: t("ph.invalid_type_error"),
        })
        .min(0, t("ph.min"))
        .max(14, t("ph.max"))
    ),
    moisture: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("moisture.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("moisture.value.required_error"),
              invalid_type_error: t("moisture.value.invalid_type_error"),
            })
            .int(t("moisture.value.int"))
            .min(0, t("moisture.value.min"))
            .max(60, t("moisture.value.max")),
        })
        .partial()
    ),

    nutrientNitrogen: z.optional(
      z.coerce
        .number({
          required_error: t("nutrientNitrogen.required_error"),
          invalid_type_error: t("nutrientNitrogen.invalid_type_error"),
        })
        .min(0, t("nutrientNitrogen.min"))
        .max(10, t("nutrientNitrogen.max"))
    ),
    nutrientPhosphorus: z.optional(
      z.coerce
        .number({
          required_error: t("nutrientPhosphorus.required_error"),
          invalid_type_error: t("nutrientPhosphorus.invalid_type_error"),
        })
        .min(0, t("nutrientPhosphorus.min"))
        .max(5, t("nutrientPhosphorus.max"))
    ),
    nutrientPotassium: z.optional(
      z.coerce
        .number({
          required_error: t("nutrientPotassium.required_error"),
          invalid_type_error: t("nutrientPotassium.invalid_type_error"),
        })
        .min(0, t("nutrientPotassium.min"))
        .max(8, t("nutrientPotassium.max"))
    ),
    nutrientUnitId: z.optional(
      z.string({
        required_error: t("nutrientUnitId.required_error"),
      })
    ),
    fieldId: z.string(),
    createdAt: z.optional(dateSchema),
  });
};

export const PlantSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(5, t("name.min"))
      .max(100, t("name.max")),
    imageUrl: z.optional(z.string().max(255, t("imageUrl.max"))),
    categoryId: z.string({ required_error: t("categoryId.required_error") }),
    growthDuration: z
      .string()
      .min(3, t("growthDuration.min"))
      .max(100, t("growthDuration.max")),

    season: z.optional(
      z.nativeEnum(Season, {
        message: "season.enum",
      })
    ),
    fertilizerType: z.nativeEnum(FertilizerType, {
      message: t("fertilizerType.enum"),
    }),
    idealTemperature: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("idealTemperature.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("idealTemperature.value.required_error"),
              invalid_type_error: t(
                "idealTemperature.value.invalid_type_error"
              ),
            })
            .min(-20, t("idealTemperature.value.min"))
            .max(50, t("idealTemperature.value.max")),
        })
        .partial()
    ),
    idealHumidity: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("idealHumidity.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("idealHumidity.value.required_error"),
              invalid_type_error: t("idealHumidity.value.invalid_type_error"),
            })
            .int(t("idealHumidity.value.int"))
            .min(0, t("idealHumidity.value.min"))
            .max(100, t("idealHumidity.value.max")),
        })
        .partial()
    ),
    waterRequirement: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("waterRequirement.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("waterRequirement.value.required_error"),
              invalid_type_error: t(
                "waterRequirement.value.invalid_type_error"
              ),
            })
            .min(0, t("waterRequirement.value.min"))
            .max(100, t("waterRequirement.value.max")),
        })
        .partial()
    ),
  });
};

export const FertilizerSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(5, t("name.min"))
      .max(100, "name.max"),
    type: z.nativeEnum(FertilizerType, {
      message: t("type.enum"),
    }),
    nutrientOfNPK: z
      .string({
        required_error: t("nutrientOfNPK.required_error"),
      })
      .min(3, t("nutrientOfNPK.min"))
      .max(100, t("nutrientOfNPK.max")),
    composition: z.optional(z.string().max(255, t("composition.max"))),
    manufacturer: z.optional(z.string().max(255, t("manufacturer.max"))),
    applicationMethod: z.optional(
      z.string().max(100, t("applicationMethod.max"))
    ),
    frequencyOfUse: z.optional(
      z.nativeEnum(Frequency, {
        message: t("frequencyOfUse.enum"),
      })
    ),
    recommendedDosage: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("recommendedDosage.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("recommendedDosage.value.required_error"),
              invalid_type_error: t(
                "recommendedDosage.value.invalid_type_error"
              ),
            })

            .min(0, t("recommendedDosage.value.min"))
            .max(100, t("recommendedDosage.value.max")),
        })
        .partial()
    ),
  });
};
export const PesticideSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(3, t("name.min"))
      .max(100, "name.max"),
    type: z.nativeEnum(PesticideType, {
      message: t("type.enum"),
    }),
    ingredient: z.optional(z.string().max(255, t("ingredient.max"))),
    manufacturer: z.optional(z.string().max(255, t("manufacturer.max"))),
    withdrawalPeriod: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("withdrawalPeriod.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("withdrawalPeriod.value.required_error"),
              invalid_type_error: t(
                "withdrawalPeriod.value.invalid_type_error"
              ),
            })
            .int(t("withdrawalPeriod.value.int"))
            .min(0, t("withdrawalPeriod.value.min"))
            .max(100, t("withdrawalPeriod.value.max")),
        })
        .partial()
    ),
    toxicityLevel: z.optional(
      z.nativeEnum(ToxicityLevel, {
        message: t("toxicityLevel.enum"),
      })
    ),
    recommendedDosage: z.optional(
      z
        .object({
          unitId: z.string({
            required_error: t("recommendedDosage.unitId.required_error"),
          }),
          value: z.coerce
            .number({
              required_error: t("recommendedDosage.value.required_error"),
              invalid_type_error: t(
                "recommendedDosage.value.invalid_type_error"
              ),
            })

            .min(0, t("recommendedDosage.value.min"))
            .max(100, t("recommendedDosage.value.max")),
        })
        .partial()
    ),

    applicationMethod: z.optional(
      z.string().max(100, t("applicationMethod.max"))
    ),
  });
};
export const EquipmentSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(3, t("name.min"))
      .max(100, "name.max"),
    type: z.nativeEnum(EquipmentType, {
      message: t("type.enum"),
    }),
    brand: z
      .string({
        required_error: t("brand.required_error"),
      })
      .min(3, t("brand.min"))
      .max(100, "brand.max"),
    purchaseDate: z.date({
      required_error: t("purchaseDate.required_error"),
      invalid_type_error: t("purchaseDate.invalid_type_error"),
    }),
    purchasePrice: z.object({
      unitId: z.string({
        required_error: t("purchasePrice.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("purchasePrice.value.required_error"),
          invalid_type_error: t("purchasePrice.value.invalid_type_error"),
        })

        .min(0, t("purchasePrice.value.min"))
        .max(1_000_000_000, t("purchasePrice.value.max")),
    }),
    status: z.optional(z.string().max(100, "status.max")),
    maintenanceSchedule: z.optional(
      z
        .string()
        .min(1, t("maintenanceSchedule.min"))
        .max(100, "maintenanceSchedule.max")
    ),
    operatingHours: z.optional(
      z.coerce
        .number({
          required_error: t("operatingHours.value.required_error"),
          invalid_type_error: t("operatingHours.value.invalid_type_error"),
        })
        .int(t("operatingHours.value.int"))
        .min(0, t("operatingHours.value.min"))
        .max(10000, t("operatingHours.value.max"))
    ),
    location: z.optional(z.string().max(100, "location.max")),
    fuelConsumption: z.optional(
      z.coerce
        .number({
          required_error: t("fuelConsumption.value.required_error"),
          invalid_type_error: t("fuelConsumption.value.invalid_type_error"),
        })

        .min(0, t("fuelConsumption.value.min"))
        .max(10000, t("fuelConsumption.value.max"))
    ),
    energyType: z.optional(z.string().max(100, "energyType.max")),
    description: z.optional(z.string().max(255, "description.max")),
    imageUrl: z.optional(z.string()),
  });
};

export const CropSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string({
        required_error: t("name.required_error"),
      })
      .min(5, t("name.min"))
      .max(100, "name.max"),
    dateRange: z.object({
      startDate: z.date({
        invalid_type_error: t("dateRange.startDate.invalid_type_error"),
        required_error: t("dateRange.startDate.required_error"),
      }),
      endDate: z.optional(z.date()),
    }),
    fieldId: z.string(),
    plantId: z.string({
      required_error: t("plantId.required_error"),
    }),
    estimatedYield: z
      .object({
        unitId: z.string({
          required_error: t("estimatedYield.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("estimatedYield.value.required_error"),
            invalid_type_error: t("estimatedYield.value.invalid_type_error"),
          })

          .min(0, t("estimatedYield.value.min"))
          .max(1_000_000_000, t("estimatedYield.value.max")),
      })
      .partial(),
    actualYield: z
      .object({
        unitId: z.string({
          required_error: t("actualYield.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("actualYield.value.required_error"),
            invalid_type_error: t("actualYield.value.invalid_type_error"),
          })

          .min(0, t("actualYield.value.min"))
          .max(1_000_000_000, t("actualYield.value.max")),
      })
      .partial(),
    status: z.optional(z.string().max(100, t("status.max"))),
  });
};
