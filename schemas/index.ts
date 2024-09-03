import {
  Gender,
  JobExperience,
  JobWorkingState,
  StaffRole,
  UnitType,
  WeatherStatus,
} from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";

export const CategorySchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(100),
    description: z.string().min(1, t("description.min")),
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
      .min(1, {
        message: t("email.min"),
      })
      .email({
        message: t("email.isEmail"),
      })
      .max(100),
    firstName: z.string().min(1, {
      message: t("firstName.min"),
    }),
    lastName: z.string().min(1, {
      message: t("lastName.min"),
    }),

    phone: z
      .string()
      .min(1, {
        message: t("phone.min"),
      })
      .refine(validator.isMobilePhone, {
        message: "phone.isPhone",
      }),
    address: z
      .string()
      .min(1, {
        message: t("address.min"),
      })
      .max(100),
  });
};

export const OrganizationSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    slug: z.string().min(1, t("slug.min")).max(100, t("slug.max")),
    createdBy: z.string().min(1, t("createdBy.min")),
  });
};

const orgRoles = ["org:admin", "org:member"] as const;
export const OrganizationMemberSchema = (t: (arg: string) => string) => {
  return z.object({
    memberId: z.string().min(1, t("memberId.min")),
    role: z.enum(orgRoles),
  });
};

export const FieldSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z.string().min(1, t("name.min")).max(100, t("name.max")),
    location: z.string().min(1, t("location.min")).max(100, t("location.max")),
    orgId: z.string().min(1, t("orgId.min")),
    height: z.coerce
      .number({
        required_error: t("height.required_error"),
        invalid_type_error: t("height.invalid_type"),
      })
      .min(0, t("heightValue.min")),
    width: z.coerce
      .number({
        required_error: t("width.required_error"),
        invalid_type_error: t("width.invalid_type"),
      })
      .min(0, t("widthValue.min")),

    area: z.coerce
      .number({
        required_error: t("area.required_error"),
        invalid_type_error: t("area.invalid_type"),
      })
      .min(0, t("areaValue.min")),
    unitId: z.string().min(1, t("unitId.min")),
    shape: z.optional(
      z.string().min(1, t("shape.min")).max(100, t("shape.max"))
    ),
  });
};
export const WeatherSchema = (t: (arg: string) => string) => {
  return z.object({
    temperature: z.object({
      unitId: z.string().min(1, t("temperature.unitId.min")),
      value: z.coerce
        .number({
          required_error: t("temperature.value.required_error"),
          invalid_type_error: t("temperature.value.invalid_type"),
        })
        .min(-100, t("temperature.value.min"))
        .max(1000, t("temperature.value.max")),
    }),
    humidity: z.object({
      unitId: z.string().min(1, t("humidity.unitId.min")),
      value: z.coerce
        .number({
          required_error: t("humidity.value.required_error"),
          invalid_type_error: t("humidity.value.invalid_type"),
        })
        .min(0, t("humidity.value.min"))
        .max(100, t("humidity.value.max")),
    }),
    atmosphericPressure: z.object({
      unitId: z.string().min(1, t("atmosphericPressure.unitId.min")),
      value: z.coerce
        .number({
          required_error: t("atmosphericPressure.value.required_error"),
          invalid_type_error: t("atmosphericPressure.value.invalid_type"),
        })
        .min(870, t("atmosphericPressure.value.min"))
        .max(1084, t("atmosphericPressure.value.max")),
    }),
    rainfall: z.object({
      unitId: z.string().min(1, t("rainfall.unitId.min")),
      value: z.coerce
        .number({
          required_error: t("rainfall.value.required_error"),
          invalid_type_error: t("rainfall.value.invalid_type"),
        })
        .min(0, t("rainfall.value.min"))
        .max(3000, t("rainfall.value.max")),
    }),
    status: z.nativeEnum(WeatherStatus, {
      message: t("status.enum"),
    }),
    fieldId: z.string().min(1, t("fieldId.min")),
  });
};
