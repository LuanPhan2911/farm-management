import {
  CategoryType,
  FertilizerType,
  Frequency,
  Gender,
  JobExperience,
  JobWorkingState,
  Season,
  SoilType,
  StaffRole,
  UnitType,
  WeatherStatus,
} from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";

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
    description: z.optional(
      z.string().min(1, t("description.min")).max(100, t("description.max"))
    ),
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
        invalid_type_error: t("quantity.invalid_type"),
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
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    email: z
      .string()
      .min(1, t("email.min"))
      .email(t("email.isEmail"))
      .max(100, t("email.max")),
    password: z.string().min(8, t("password.min")).max(50, t("password.max")),

    role: z.nativeEnum(StaffRole, {
      message: t("role.native"),
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
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    slug: z.string().min(1, t("slug.min")).max(100, t("slug.max")),
    createdBy: z
      .string()
      .min(1, t("createdBy.min"))
      .max(100, t("createdBy.max")),
  });
};

const orgRoles = ["org:admin", "org:member"] as const;
export const OrganizationMemberSchema = (t: (arg: string) => string) => {
  return z.object({
    memberId: z.string().min(1, t("memberId.min")),
    role: z.enum(orgRoles, {
      message: "role.enum",
    }),
  });
};

export const FieldSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    location: z.string().min(1, t("location.min")).max(100, t("location.max")),
    orgId: z.string({
      required_error: t("orgId.required_error"),
    }),
    height: z.coerce
      .number({
        required_error: t("height.required_error"),
        invalid_type_error: t("height.invalid_type"),
      })
      .min(0, t("height.min")),
    width: z.coerce
      .number({
        required_error: t("width.required_error"),
        invalid_type_error: t("width.invalid_type"),
      })
      .min(0, t("width.min")),

    area: z.coerce
      .number({
        required_error: t("area.required_error"),
        invalid_type_error: t("area.invalid_type"),
      })
      .min(0, t("area.min")),
    unitId: z.string({
      required_error: t("unitId.required_error"),
    }),
    shape: z.optional(
      z.string().min(1, t("shape.min")).max(100, t("shape.max"))
    ),
  });
};
export const WeatherSchema = (t: (arg: string) => string) => {
  return z.object({
    temperature: z.object({
      unitId: z.string({
        required_error: t("temperature.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("temperature.value.required_error"),
          invalid_type_error: t("temperature.value.invalid_type"),
        })
        .min(-20, t("temperature.value.min"))
        .max(50, t("temperature.value.max")),
    }),
    humidity: z.object({
      unitId: z.string({
        required_error: t("humidity.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("humidity.value.required_error"),
          invalid_type_error: t("humidity.value.invalid_type"),
        })
        .int(t("humidity.value.int"))
        .min(0, t("humidity.value.min"))
        .max(100, t("humidity.value.max")),
    }),
    atmosphericPressure: z.object({
      unitId: z.string({
        required_error: t("atmosphericPressure.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("atmosphericPressure.value.required_error"),
          invalid_type_error: t("atmosphericPressure.value.invalid_type"),
        })
        .min(870, t("atmosphericPressure.value.min"))
        .max(1084, t("atmosphericPressure.value.max")),
    }),
    rainfall: z.object({
      unitId: z.string({
        required_error: t("rainfall.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("rainfall.value.required_error"),
          invalid_type_error: t("rainfall.value.invalid_type"),
        })
        .int(t("rainfall.value.int"))
        .min(0, t("rainfall.value.min"))
        .max(100, t("rainfall.value.max")),
    }),
    status: z.nativeEnum(WeatherStatus, {
      message: t("status.enum"),
    }),
    fieldId: z.string(),
  });
};
export const SoilSchema = (t: (arg: string) => string) => {
  return z.object({
    ph: z.coerce
      .number({
        required_error: t("ph.required_error"),
        invalid_type_error: t("ph.invalid_type"),
      })
      .min(0, t("ph.min"))
      .max(14, t("ph.max")),
    moisture: z.object({
      unitId: z.string({
        required_error: t("moisture.unitId.required_error"),
      }),
      value: z.coerce
        .number({
          required_error: t("moisture.value.required_error"),
          invalid_type_error: t("moisture.value.invalid_type"),
        })
        .int(t("moisture.value.int"))
        .min(0, t("moisture.value.min"))
        .max(60, t("moisture.value.max")),
    }),
    type: z.nativeEnum(SoilType, {
      message: t("type.enum"),
    }),
    nutrientNitrogen: z.coerce
      .number({
        required_error: t("nutrientNitrogen.required_error"),
        invalid_type_error: t("nutrientNitrogen.invalid_type"),
      })
      .min(0, t("nutrientNitrogen.min"))
      .max(10, t("nutrientNitrogen.max")),
    nutrientPhosphorus: z.coerce
      .number({
        required_error: t("nutrientPhosphorus.required_error"),
        invalid_type_error: t("nutrientPhosphorus.invalid_type"),
      })
      .min(0, t("nutrientPhosphorus.min"))
      .max(5, t("nutrientPhosphorus.max")),
    nutrientPotassium: z.coerce
      .number({
        required_error: t("nutrientPotassium.required_error"),
        invalid_type_error: t("nutrientPotassium.invalid_type"),
      })
      .min(0, t("nutrientPotassium.min"))
      .max(8, t("nutrientPotassium.max")),
    nutrientUnitId: z.string({
      required_error: t("nutrientUnitId.required_error"),
    }),
    fieldId: z.string(),
  });
};

export const PlantSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    imageUrl: z.optional(z.string().max(255, t("imageUrl.max"))),
    categoryId: z.string({ required_error: t("categoryId.required_error") }),
    growthDuration: z.coerce
      .number({
        required_error: t("growthDuration.required_error"),
        invalid_type_error: t("growthDuration.invalid_type"),
      })
      .int(t("growthDuration.int"))
      .min(7, t("growthDuration.min"))
      .max(365, t("growthDuration.max")),

    season: z.optional(
      z.nativeEnum(Season, {
        message: "season.enum",
      })
    ),
    fertilizerType: z.nativeEnum(FertilizerType, {
      message: t("fertilizerType.enum"),
    }),
    idealTemperature: z.optional(
      z.object({
        unitId: z.string({
          required_error: t("idealTemperature.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("idealTemperature.value.required_error"),
            invalid_type_error: t("idealTemperature.value.invalid_type"),
          })
          .min(-20, t("idealTemperature.value.min"))
          .max(50, t("idealTemperature.value.max")),
      })
    ),
    idealHumidity: z.optional(
      z.object({
        unitId: z.string({
          required_error: t("idealHumidity.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("idealHumidity.value.required_error"),
            invalid_type_error: t("idealHumidity.value.invalid_type"),
          })
          .int(t("idealHumidity.value.int"))
          .min(0, t("idealHumidity.value.min"))
          .max(100, t("idealHumidity.value.max")),
      })
    ),
    waterRequirement: z.optional(
      z.object({
        unitId: z.string({
          required_error: t("waterRequirement.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("waterRequirement.value.required_error"),
            invalid_type_error: t("waterRequirement.value.invalid_type"),
          })
          .min(0, t("waterRequirement.value.min"))
          .max(100, t("waterRequirement.value.max")),
      })
    ),
  });
};

export const FertilizerSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, "name.max"),
    type: z.nativeEnum(FertilizerType, {
      message: t("type.enum"),
    }),
    nutrientOfNPK: z
      .string()
      .min(1, t("nutrientOfNPK.min"))
      .max(100, t("nutrientOfNPK.max")),
    composition: z.optional(
      z.string().min(1, t("composition.min")).max(255, t("composition.max"))
    ),
    manufacturer: z.optional(
      z.string().min(1, t("manufacturer.min")).max(255, t("manufacturer.max"))
    ),
    applicationMethod: z.optional(
      z
        .string()
        .min(1, t("applicationMethod.min"))
        .max(100, t("applicationMethod.max"))
    ),
    frequencyOfUse: z.optional(
      z.nativeEnum(Frequency, {
        message: t("frequencyOfUse.enum"),
      })
    ),
    recommendedDosage: z.optional(
      z.object({
        unitId: z.string({
          required_error: t("recommendedDosage.unitId.required_error"),
        }),
        value: z.coerce
          .number({
            required_error: t("recommendedDosage.value.required_error"),
            invalid_type_error: t("recommendedDosage.value.invalid_type"),
          })
          .int(t("recommendedDosage.value.int"))
          .min(0, t("recommendedDosage.value.min"))
          .max(10000, t("recommendedDosage.value.max")),
      })
    ),
  });
};
