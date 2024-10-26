"use server";

import {
  ActivityCreatePermissionError,
  ActivityExistError,
  ActivityUpdatePermissionError,
  ActivityUpdateStatusError,
  StaffExistError,
  UnAuthorizedError,
} from "@/errors";
import { errorResponse, successResponse } from "@/lib/utils";
import { ActivitySchema } from "@/schemas";
import {
  createActivity,
  deleteActivity,
  updateActivity,
  updateActivityStatus,
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
    const activity = await createActivity({
      ...validatedFields.data,
    });

    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.create"), activity);
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      return errorResponse(tSchema("errors.unauthorized"));
    }
    if (error instanceof ActivityCreatePermissionError) {
      return errorResponse(tSchema("errors.createPermission"));
    }
    if (error instanceof StaffExistError) {
      return errorResponse(tSchema("errors.existStaff"));
    }
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
    const { name, priority, note, description, actualDuration, status } =
      validatedFields.data;
    const updatedActivity = await updateActivity(id, {
      name,
      priority,
      status,
      actualDuration,
      description,
      note,
    });
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      return errorResponse(tSchema("errors.unauthorized"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    if (error instanceof ActivityUpdatePermissionError) {
      return errorResponse(tSchema("errors.updatePermission"));
    }
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
    if (error instanceof UnAuthorizedError) {
      return errorResponse(tSchema("errors.unauthorized"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    if (error instanceof ActivityUpdatePermissionError) {
      return errorResponse(tSchema("errors.updatePermission"));
    }
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const completeActivity = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
  try {
    const { updatedActivity } = await updateActivityStatus(id, status);
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.complete"));
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      return errorResponse(tSchema("errors.unauthorized"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    if (error instanceof ActivityUpdatePermissionError) {
      return errorResponse(tSchema("errors.updatePermission"));
    }
    return errorResponse(tStatus("failure.complete"));
  }
};
export const cancelActivity = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("activities.schema");
  const tStatus = await getTranslations("activities.status");
  try {
    const { updatedActivity } = await updateActivityStatus(id, status);
    revalidatePath("/admin/activities");
    return successResponse(tStatus("success.cancel"));
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      return errorResponse(tSchema("errors.unauthorized"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    if (error instanceof ActivityUpdatePermissionError) {
      return errorResponse(tSchema("errors.updatePermission"));
    }
    return errorResponse(tStatus("failure.cancel"));
  }
};
