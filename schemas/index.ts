import { Gender, JobExperience, JobWorkingState } from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";
export const CategorySchema = (t: (arg: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: t("name.minlength"),
      })
      .max(100),
    description: z.string().min(1, {
      message: t("description.minlength"),
    }),
  });
export const UnitSchema = (t: (arg: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: t("name.minlength"),
      })
      .max(100),
    description: z.string().min(1, {
      message: t("description.minlength"),
    }),
  });
export const JobSchema = (t: (arg: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: t("name.minlength"),
      })
      .max(100),
    description: z
      .string()
      .min(1, {
        message: t("description.minlength"),
      })
      .max(5000),
    requirement: z
      .string()
      .min(1, {
        message: t("requirement.minlength"),
      })
      .max(5000),
    rights: z
      .string()
      .min(1, {
        message: t("rights.minlength"),
      })
      .max(5000),
    workingTime: z
      .string()
      .min(1, {
        message: t("workingTime.minlength"),
      })
      .max(100),
    wage: z
      .string()
      .min(1, {
        message: t("wage.minlength"),
      })
      .max(100),
    quantity: z.coerce
      .number({
        required_error: t("quantity.required_error"),
        invalid_type_error: t("quantity.invalid_type"),
      })
      .int()
      .min(1, {
        message: t("quantity.min"),
      })
      .max(100, {
        message: t("quantity.max"),
      })
      .int({
        message: t("quantity.int"),
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
    expiredAt: z.date().refine(
      (expiredAt) => {
        return expiredAt >= addDays(new Date(), -1);
      },
      {
        message: t("expiredAt.min"),
      }
    ),
  });
export const ApplicantSchema = (t: (arg: string) => string) => {
  return z.object({
    name: z
      .string()
      .min(1, {
        message: t("name.minlength"),
      })
      .max(100),
    email: z
      .string()
      .min(1, {
        message: t("email.minlength"),
      })
      .email({
        message: t("email.isEmail"),
      })
      .max(100),
    phone: z
      .string()
      .min(1, {
        message: t("phone.minlength"),
      })
      .refine(validator.isMobilePhone, {
        message: "phone.isPhone",
      }),
    address: z
      .string()
      .min(1, {
        message: t("address.minlength"),
      })
      .max(100),
    note: z.string().max(200),
  });
};
