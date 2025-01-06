"use server";

import { ActivityUpdateStatusCompletedError } from "@/errors";
import { errorResponse, successResponse } from "@/lib/utils";
import { ActivitySchema } from "@/schemas";
import {
  createActivity,
  deleteActivity,
  updateActivity,
  updateActivityStatusComplete,
} from "@/services/activities";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof ActivitySchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
  const paramsSchema = ActivitySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const activity = await createActivity(validatedFields.data);

    revalidatePath("/admin/activities");

    return successResponse(tStatus("success.create"), activity);
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof ActivitySchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
  const paramsSchema = ActivitySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const updatedActivity = await updateActivity(id, {
      ...validatedFields.data,
    });
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
  try {
    const deletedActivity = await deleteActivity(id);
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const completeActivity = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("activities.status");
  const tSchema = await getTranslations("activities.schema");
  try {
    await updateActivityStatusComplete(id, "COMPLETED");
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.complete"));
  } catch (error) {
    if (error instanceof ActivityUpdateStatusCompletedError) {
      return errorResponse(tSchema("errors.updateStatusCompleted"));
    }
    return errorResponse(tStatus("failure.complete"));
  }
};
