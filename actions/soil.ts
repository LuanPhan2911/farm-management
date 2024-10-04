"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { SoilSchema } from "@/schemas";
import { getCurrentStaff } from "@/services/staffs";

import {
  updateSoilConfirmed,
  createSoil,
  deleteSoil,
  updateSoil,
  createManySoilInChunk,
  updateManySoilConfirmed,
  deleteManySoilUnconfirmed,
  updateSoilPinned,
} from "@/services/soils";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof SoilSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("soils.schema");
  const tStatus = await getTranslations("soils.status");
  const paramsSchema = SoilSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const soil = await createSoil(validatedFields.data);

    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof SoilSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("soils.schema");
  const tStatus = await getTranslations("soils.status");
  const paramsSchema = SoilSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const soil = await updateSoil(id, validatedFields.data);

    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const editConfirmed = async (id: string, confirmed: boolean) => {
  const tStatus = await getTranslations("soils.status");
  const tSchema = await getTranslations("soils.schema");

  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const soil = await updateSoilConfirmed(id, {
      confirmed,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });
    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.editConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editConfirmed"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("soils.status");
  try {
    const soil = await deleteSoil(id);
    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const createMany = async (fieldId: string, json: unknown) => {
  const tStatus = await getTranslations("soils.status");
  const tSchema = await getTranslations("soils.schema");

  try {
    const paramsSchema = SoilSchema(tSchema);

    const data = json as any[];
    const soils = data.map((item) => {
      const validatedField = paramsSchema.safeParse(item);

      if (validatedField.success) {
        return validatedField.data;
      } else {
        return undefined;
      }
    });

    const validatedSoils = soils.filter((item) => item !== undefined);
    if (!validatedSoils.length || validatedSoils.length !== soils.length) {
      return errorResponse(tSchema("errors.parse"));
    }
    await createManySoilInChunk(validatedSoils);
    revalidatePath(`/admin/fields/detail/${fieldId}/soils`);
    return successResponse(tStatus("success.createMany"));
  } catch (error) {
    return errorResponse(tStatus("failure.createMany"));
  }
};

export const editManyConfirmed = async (fieldId: string) => {
  const tStatus = await getTranslations("soils.status");
  const tSchema = await getTranslations("soils.schema");

  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const soil = await updateManySoilConfirmed({
      confirmed: true,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });
    revalidatePath(`/admin/fields/detail/${fieldId}/soils`);
    return successResponse(tStatus("success.editManyConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editManyConfirmed"));
  }
};

export const destroyManyUnConfirmed = async (fieldId: string) => {
  const tStatus = await getTranslations("soils.status");
  try {
    await deleteManySoilUnconfirmed();
    revalidatePath(`/admin/fields/detail/${fieldId}/soils`);
    return successResponse(tStatus("success.destroyManyConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroyManyConfirmed"));
  }
};

export const editPinned = async (id: string, pinned: boolean) => {
  const tStatus = await getTranslations("soils.status");
  try {
    const soil = await updateSoilPinned(id, pinned);
    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.editPinned"));
  } catch (error) {
    return errorResponse(tStatus("failure.editPinned"));
  }
};
