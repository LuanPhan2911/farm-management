import { z } from "zod";

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
