"use server";
import { errorResponse, successResponse } from "@/lib/utils";
import { HarvestSchema } from "@/schemas";
import { createHarvest, deleteHarvest } from "@/services/harvests";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof HarvestSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("harvests.schema");
  const tStatus = await getTranslations("harvests.status");
  const paramsSchema = HarvestSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const [harvest] = await createHarvest(validatedFields.data);

    revalidatePath(`/admin/crops/detail/${harvest.cropId}/harvests`);

    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("harvests.status");
  try {
    const [harvest] = await deleteHarvest(id);
    revalidatePath(`/admin/crops/detail/${harvest.cropId}/harvests`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
