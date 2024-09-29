"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { ScheduleSchema } from "@/schemas";
import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/services/schedules";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof ScheduleSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("schedules.schema");
  const tStatus = await getTranslations("schedules.status");
  const paramsSchema = ScheduleSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const schedule = await createSchedule(JSON.stringify(validatedFields.data));
    revalidateTag("schedules");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof ScheduleSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("schedules.schema");
  const tStatus = await getTranslations("schedules.status");
  const paramsSchema = ScheduleSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    await updateSchedule(id, JSON.stringify(validatedFields.data));
    revalidateTag("schedules");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};

export const editPaused = async (
  values: z.infer<ReturnType<typeof ScheduleSchema>>,
  id: string
) => {
  const tSchema = await getTranslations("schedules.schema");
  const tStatus = await getTranslations("schedules.status");
  const paramsSchema = ScheduleSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    await updateSchedule(id, JSON.stringify(validatedFields.data));
    revalidateTag("schedules");
    return successResponse(tStatus("success.editPaused"));
  } catch (error) {
    return errorResponse(tStatus("failure.editPaused"));
  }
};

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("schedules.status");
  try {
    await deleteSchedule(id);
    revalidateTag("schedules");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const refresh = async () => {
  const tStatus = await getTranslations("schedules.status");
  try {
    revalidateTag("schedules");
    return successResponse(tStatus("success.refresh"));
  } catch (error) {
    return errorResponse(tStatus("failure.refresh"));
  }
};
