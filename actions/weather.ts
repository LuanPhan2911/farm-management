"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { WeatherSchema } from "@/schemas";
import { getCurrentStaff } from "@/services/staffs";

import {
  updateWeatherConfirmed,
  createWeather,
  deleteManyWeatherUnConfirmed,
  deleteWeather,
  updateManyWeatherConfirmed,
  updateWeather,
  createManyWeatherInChunks,
  updateWeatherPinned,
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
export const editConfirmed = async (id: string, confirmed: boolean) => {
  const tStatus = await getTranslations("weathers.status");
  const tSchema = await getTranslations("weathers.schema");

  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const weather = await updateWeatherConfirmed(id, {
      confirmed,
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

export const createMany = async (fieldId: string, json: unknown) => {
  const tStatus = await getTranslations("weathers.status");
  const tSchema = await getTranslations("weathers.schema");

  try {
    const paramsSchema = WeatherSchema(tSchema);

    const data = json as any[];
    const weathers = data.map((item) => {
      const validatedField = paramsSchema.safeParse(item);

      if (validatedField.success) {
        return validatedField.data;
      } else {
        return undefined;
      }
    });

    const validatedWeathers = weathers.filter((item) => item !== undefined);
    if (
      !validatedWeathers.length ||
      validatedWeathers.length !== weathers.length
    ) {
      return errorResponse(tSchema("errors.parse"));
    }
    await createManyWeatherInChunks(validatedWeathers);
    revalidatePath(`/admin/fields/detail/${fieldId}/weathers`);
    return successResponse(tStatus("success.createMany"));
  } catch (error) {
    return errorResponse(tStatus("failure.createMany"));
  }
};

export const editManyConfirmed = async (fieldId: string) => {
  const tStatus = await getTranslations("weathers.status");
  const tSchema = await getTranslations("weathers.schema");

  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const weather = await updateManyWeatherConfirmed({
      confirmed: true,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });
    revalidatePath(`/admin/fields/detail/${fieldId}/weathers`);
    return successResponse(tStatus("success.editManyConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editManyConfirmed"));
  }
};

export const destroyManyUnConfirmed = async (fieldId: string) => {
  const tStatus = await getTranslations("weathers.status");
  try {
    await deleteManyWeatherUnConfirmed();
    revalidatePath(`/admin/fields/detail/${fieldId}/weathers`);
    return successResponse(tStatus("success.destroyManyConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroyManyConfirmed"));
  }
};

export const editPinned = async (id: string, pinned: boolean) => {
  const tStatus = await getTranslations("weathers.status");
  try {
    const weather = await updateWeatherPinned(id, pinned);
    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.editPinned"));
  } catch (error) {
    return errorResponse(tStatus("failure.editPinned"));
  }
};
