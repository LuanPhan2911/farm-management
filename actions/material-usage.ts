"use server";

import {
  ActivityExistError,
  ActivityUpdateStatusError,
  MaterialExistError,
  MaterialUpdateQuantityError,
  MaterialUsageExistError,
  MaterialUsageUpdateQuantityError,
} from "@/errors";
import { errorResponse, successResponse } from "@/lib/utils";
import { MaterialUsageSchema } from "@/schemas";
import {
  assignMaterialUsage,
  createMaterialUsage,
  deleteMaterialUsage,
  revalidatePathMaterialUsage,
  revokeMaterialUsage,
  updateMaterialUsage,
} from "@/services/material-usages";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof MaterialUsageSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("materialUsages.schema");
  const tStatus = await getTranslations("materialUsages.status");
  const paramsSchema = MaterialUsageSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { materialUsage } = await createMaterialUsage(validatedFields.data);
    revalidatePathMaterialUsage({
      materialId: materialUsage.materialId,
    });

    return successResponse(tStatus("success.create"));
  } catch (error: unknown) {
    if (error instanceof MaterialExistError) {
      return errorResponse(tSchema("errors.existMaterial"));
    }
    if (error instanceof MaterialUpdateQuantityError) {
      return errorResponse(
        tSchema("errors.noEnoughQuantity", {
          value: error.data?.quantityInStock,
        })
      );
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
  values: z.infer<ReturnType<typeof MaterialUsageSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("materialUsages.schema");
  const tStatus = await getTranslations("materialUsages.status");
  const paramsSchema = MaterialUsageSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { quantityUsed } = validatedFields.data;

    const { updatedUsage: materialUsage } = await updateMaterialUsage(id, {
      quantityUsed,
    });

    revalidatePathMaterialUsage({
      materialId: materialUsage.materialId,
    });

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    if (error instanceof MaterialUsageExistError) {
      return errorResponse(tSchema("errors.existMaterial"));
    }
    if (error instanceof MaterialUsageUpdateQuantityError) {
      const data = error.data as
        | {
            material: {
              quantityInStock: number;
            };
          }
        | undefined;
      return errorResponse(
        tSchema("errors.noEnoughQuantity", {
          value: data?.material.quantityInStock,
        })
      );
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
    }
    if (error instanceof ActivityUpdateStatusError) {
      return errorResponse(tSchema("errors.invalidActivityStatus"));
    }
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("materialUsages.status");
  const tSchema = await getTranslations("materialUsages.schema");
  try {
    const { deletedUsage: materialUsage } = await deleteMaterialUsage(id);

    revalidatePathMaterialUsage({
      materialId: materialUsage.materialId,
    });
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    if (error instanceof MaterialUsageExistError) {
      return errorResponse(tSchema("errors.existMaterial"));
    }
    if (error instanceof ActivityExistError) {
      return errorResponse(tSchema("errors.existActivity"));
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
  const tStatus = await getTranslations("materialUsages.status");
  const tSchema = await getTranslations("materialUsages.schema");
  try {
    const materialUsage = await assignMaterialUsage(id, {
      activityId,
    });

    revalidatePathMaterialUsage({
      materialId: materialUsage.materialId,
    });
    return successResponse(tStatus("success.assign"));
  } catch (error) {
    if (error instanceof MaterialUsageExistError) {
      return errorResponse(tSchema("errors.existMaterial"));
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
  const tStatus = await getTranslations("materialUsages.status");
  const tSchema = await getTranslations("materialUsages.schema");
  try {
    const materialUsage = await revokeMaterialUsage(id, {
      activityId,
    });

    revalidatePathMaterialUsage({
      materialId: materialUsage.materialId,
    });
    return successResponse(tStatus("success.revoke"));
  } catch (error) {
    if (error instanceof MaterialUsageExistError) {
      return errorResponse(tSchema("errors.existMaterial"));
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
