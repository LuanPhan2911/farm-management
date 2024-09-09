"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { WeatherSchema } from "@/schemas";
import { currentStaff } from "@/services/staffs";

import {
  confirmWeather,
  createWeather,
  deleteWeather,
  updateWeather,
} from "@/services/weathers";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof WeatherSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("weathers.schema");
  const tStatus = await getTranslations("weathers.status");
  const paramsSchema = WeatherSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const weather = await createWeather(validatedFields.data);

    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof WeatherSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("weathers.schema");
  const tStatus = await getTranslations("weathers.status");
  const paramsSchema = WeatherSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const weather = await updateWeather(id, validatedFields.data);

    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const editConfirmed = async (id: string) => {
  const tStatus = await getTranslations("weathers.status");
  const tSchema = await getTranslations("weathers.schema");

  try {
    const staff = await currentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const weather = await confirmWeather(id, {
      confirmed: true,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });
    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.editConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editConfirmed"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("weathers.status");
  try {
    const weather = await deleteWeather(id);
    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
