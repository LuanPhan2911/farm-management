import {
  Gender,
  JobExperience,
  JobWorkingState,
  StaffRole,
} from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";
import { OrgRole } from "@/types";
export const CategorySchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(100),
    description: z.string().min(1, t("description.min")),
  });
export const UnitSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, t("name.min")).max(50, t("name.max")),
    description: z
      .string()
      .min(1, t("description.min"))
      .max(100, t("description.max")),
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
    height: z.object({
      value: z.coerce
        .number({
          required_error: t("heightValue.required_error"),
          invalid_type_error: t("heightValue.invalid_type"),
        })
        .min(0, t("heightValue.min")),
      unitId: z.string().min(1, t("heightUnitId.min")),
    }),
    width: z.object({
      value: z.coerce
        .number({
          required_error: t("widthValue.required_error"),
          invalid_type_error: t("widthValue.invalid_type"),
        })
        .min(0, t("widthValue.min")),
      unitId: z.string().min(1, t("widthUnitId.min")),
    }),
    area: z.object({
      value: z.coerce
        .number({
          required_error: t("areaValue.required_error"),
          invalid_type_error: t("areaValue.invalid_type"),
        })
        .min(0, t("areaValue.min")),
      unitId: z.string().min(1, t("areaUnitId.min")),
    }),
    shape: z.string().nullable(),
  });
};
