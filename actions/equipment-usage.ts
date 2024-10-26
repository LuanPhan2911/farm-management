"use server";

import {
  ActivityExistError,
  ActivityUpdateStatusError,
  EquipmentDetailExistError,
  EquipmentUsageExistError,
  StaffExistError,
} from "@/errors";
import { errorResponse, successResponse } from "@/lib/utils";
import { EquipmentUsageSchema } from "@/schemas";
import {
  assignEquipmentUsage,
  createEquipmentUsage,
  deleteEquipmentUsage,
  revalidatePathEquipmentUsage,
  revokeEquipmentUsage,
  updateEquipmentUsage,
} from "@/services/equipment-usages";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof EquipmentUsageSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipmentUsages.schema");
  const tStatus = await getTranslations("equipmentUsages.status");
  const paramsSchema = EquipmentUsageSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { equipmentUsage } = await createEquipmentUsage(validatedFields.data);

    revalidatePathEquipmentUsage({
      equipmentDetailId: equipmentUsage.equipmentDetailId,
      activityId: equipmentUsage.activityId,
      equipmentId: equipmentUsage.equipmentDetail.equipmentId,
    });
    return successResponse(tStatus("success.create"));
  } catch (error) {
    if (error instanceof EquipmentDetailExistError) {
      return errorResponse(tSchema("errors.existEquipmentDetail"));
    }
    if (error instanceof StaffExistError) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof EquipmentUsageSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipmentUsages.schema");
  const tStatus = await getTranslations("equipmentUsages.status");
  const paramsSchema = EquipmentUsageSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { duration, note, usageStartTime } = validatedFields.data;
    const equipmentUsage = await updateEquipmentUsage(id, {
      duration,
      note,
      usageStartTime,
    });

    revalidatePathEquipmentUsage({
      equipmentDetailId: equipmentUsage.equipmentDetailId,
      activityId: equipmentUsage.activityId,
      equipmentId: equipmentUsage.equipmentDetail.equipmentId,
    });

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    if (error instanceof EquipmentUsageExistError) {
      return errorResponse(tSchema("errors.existEquipmentUsage"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipmentUsages.schema");
  const tStatus = await getTranslations("equipmentUsages.status");
  try {
    const { deletedEquipmentUsage: equipmentUsage } =
      await deleteEquipmentUsage(id);

    revalidatePathEquipmentUsage({
      equipmentDetailId: equipmentUsage.equipmentDetailId,
      activityId: equipmentUsage.activityId,
      equipmentId: equipmentUsage.equipmentDetail.equipmentId,
    });
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    if (error instanceof EquipmentUsageExistError) {
      return errorResponse(tSchema("errors.existEquipmentUsage"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const assign = async (
  id: string,
  activityId: string
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("equipmentUsages.status");
  const tSchema = await getTranslations("equipmentUsages.schema");
  try {
    const equipmentUsage = await assignEquipmentUsage(id, {
      activityId,
    });

    revalidatePathEquipmentUsage({
      equipmentDetailId: equipmentUsage.equipmentDetailId,
      activityId: equipmentUsage.activityId,
      equipmentId: equipmentUsage.equipmentDetail.equipmentId,
    });
    return successResponse(tStatus("success.assign"));
  } catch (error) {
    if (error instanceof EquipmentUsageExistError) {
      return errorResponse(tSchema("errors.existEquipment"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.assign"));
  }
};
export const revoke = async (
  id: string,
  activityId: string
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("equipmentUsages.status");
  const tSchema = await getTranslations("equipmentUsages.schema");
  try {
    const equipmentUsage = await revokeEquipmentUsage(id, {
      activityId,
    });

    revalidatePathEquipmentUsage({
      equipmentDetailId: equipmentUsage.equipmentDetailId,
      activityId: equipmentUsage.activityId,
      equipmentId: equipmentUsage.equipmentDetail.equipmentId,
    });
    return successResponse(tStatus("success.revoke"));
  } catch (error) {
    if (error instanceof EquipmentUsageExistError) {
      return errorResponse(tSchema("errors.existEquipment"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.revoke"));
  }
};
