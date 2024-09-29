"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { TaskSchema } from "@/schemas";
import {
  createTask,
  deleteManyTask,
  deleteTask,
  runTask,
  updateTask,
} from "@/services/tasks";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof TaskSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("tasks.schema");
  const tStatus = await getTranslations("tasks.status");
  const paramsSchema = TaskSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const task = await createTask(JSON.stringify(validatedFields.data));
    revalidateTag("tasks");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof TaskSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("tasks.schema");
  const tStatus = await getTranslations("tasks.status");
  const paramsSchema = TaskSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    console.log(JSON.stringify(validatedFields.data));

    await updateTask(id, JSON.stringify(validatedFields.data));
    revalidateTag("tasks");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};

export const run = async (id: string) => {
  const tStatus = await getTranslations("tasks.status");
  try {
    const task = await runTask(id);
    revalidateTag("tasks");
    return successResponse(tStatus("success.run"));
  } catch (error) {
    return errorResponse(tStatus("failure.run"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("tasks.status");
  try {
    await deleteTask(id);
    revalidateTag("tasks");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("tasks.status");
  try {
    await deleteManyTask(JSON.stringify(ids));
    revalidateTag("tasks");

    return successResponse(tStatus("success.destroyMany"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroyMany"));
  }
};

export const refresh = async () => {
  const tStatus = await getTranslations("tasks.status");
  try {
    revalidateTag("tasks");
    return successResponse(tStatus("success.refresh"));
  } catch (error) {
    return errorResponse(tStatus("failure.refresh"));
  }
};
