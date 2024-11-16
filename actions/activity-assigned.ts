"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import {
  ActivityAssignedSchema,
  ActivityAssignedUpdateSchema,
} from "@/schemas";
import {
  deleteActivityAssigned,
  updateActivityAssigned,
  upsertActivityAssigned,
} from "@/services/activity-assigned";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const upsertAssigned = async (
  values: z.infer<ReturnType<typeof ActivityAssignedSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activityAssigned.schema");
  const tStatus = await getTranslations("activityAssigned.status");
  const paramsSchema = ActivityAssignedSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    await upsertActivityAssigned({
      ...validatedFields.data,
    });
    revalidatePath(
      `/admin/activities/detail/${validatedFields.data.activityId}/staffs`
    );
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const deleteAssigned = async (
  activityId: string,
  staffId: string
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("activityAssigned.status");

  try {
    await deleteActivityAssigned({
      activityId,
      staffId,
    });
    revalidatePath(`/admin/activities/detail/${activityId}/staffs`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const editAssigned = async (
  values: z.infer<ReturnType<typeof ActivityAssignedUpdateSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activityAssigned.schema");
  const tStatus = await getTranslations("activityAssigned.status");
  const paramsSchema = ActivityAssignedUpdateSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const activityAssigned = await updateActivityAssigned(id, {
      ...validatedFields.data,
    });
    revalidatePath(
      `/admin/activities/detail/${activityAssigned.activityId}/staffs`
    );
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
