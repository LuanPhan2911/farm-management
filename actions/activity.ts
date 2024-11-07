"use server";

import {
  ActivityCreatePermissionError,
  ActivityExistError,
  ActivityUpdatePermissionError,
  ActivityUpdateStatusError,
  StaffExistError,
  UnAuthorizedError,
} from "@/errors";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/utils";
import { ActivityAssignedSchema, ActivitySchema } from "@/schemas";
import {
  createActivity,
  deleteActivity,
  deleteActivityAssigned,
  updateActivity,
  updateActivityStatus,
  upsertActivityAssigned,
} from "@/services/activities";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { string, z } from "zod";

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
    const activity = await createActivity({
      ...validatedFields.data,
    });

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

export const completeActivity = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("activities.status");
  try {
    await updateActivityStatus(id, status);
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.complete"));
  } catch (error) {
    return errorResponse(tStatus("failure.complete"));
  }
};
export const cancelActivity = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("activities.status");
  try {
    await updateActivityStatus(id, status);
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.cancel"));
  } catch (error) {
    return errorResponse(tStatus("failure.cancel"));
  }
};

export const upsertAssigned = async (
  values: z.infer<ReturnType<typeof ActivityAssignedSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
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
    return successResponse(tStatus("success.upsertAssigned"));
  } catch (error) {
    return errorResponse(tStatus("failure.upsertAssigned"));
  }
};
export const deleteAssigned = async (
  activityId: string,
  staffId: string
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("activities.status");

  try {
    await deleteActivityAssigned({
      activityId,
      staffId,
    });
    revalidatePath(`/admin/activities/detail/${activityId}/staffs`);
    return successResponse(tStatus("success.deleteAssigned"));
  } catch (error) {
    return errorResponse(tStatus("failure.deleteAssigned"));
  }
};
