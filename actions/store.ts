"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { StoreSchema } from "@/schemas";
import { upsertStore } from "@/services/stores";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const upsert = async (
  values: z.infer<ReturnType<typeof StoreSchema>>,
  id?: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("stores.schema");
  const tStatus = await getTranslations("stores.status");
  const paramsSchema = StoreSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const store = await upsertStore(validatedFields.data, id);

    revalidatePath(`/admin/crops/detail/${store.cropId}/store`);
    return successResponse(tStatus("success.upsert"));
  } catch (error) {
    console.log(error);

    return errorResponse(tStatus("failure.upsert"));
  }
};
