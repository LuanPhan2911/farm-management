import { Gender, JobExperience, JobWorkingState } from "@prisma/client";
import { addDays } from "date-fns";
import { z } from "zod";
import validator from "validator";
export const CategorySchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, {
      message: t("name.minlength"),
    }),
    description: z.string().min(1, {
      message: t("description.minlength"),
    }),
  });
export const UnitSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, {
      message: t("name.minlength"),
    }),
    description: z.string().min(1, {
      message: t("description.minlength"),
    }),
  });
export const JobSchema = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(1, {
      message: t("name.minlength"),
    }),
    description: z.string().min(1, {
      message: t("description.minlength"),
    }),
    requirement: z.string().min(1, {
      message: t("requirement.minlength"),
    }),
    rights: z.string().min(1, {
      message: t("rights.minlength"),
    }),
    workingTime: z.string().min(1, {
      message: t("workingTime.minlength"),
    }),
    wage: z.string().min(1, {
      message: t("wage.minlength"),
    }),
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
    name: z.string().min(1, {
      message: t("name.minlength"),
    }),
    email: z
      .string()
      .min(1, {
        message: t("email.minlength"),
      })
      .email({
        message: t("email.isEmail"),
      }),
    phone: z
      .string()
      .min(1, {
        message: t("phone.minlength"),
      })
      .refine(validator.isMobilePhone, {
        message: "phone.isPhone",
      }),
    address: z.string().min(1, {
      message: t("address.minlength"),
    }),
    note: z.string(),
  });
};
