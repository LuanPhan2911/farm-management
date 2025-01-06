"use server";
import { errorResponse, successResponse } from "@/lib/utils";
import { SaleSchema } from "@/schemas";
import { createSale, deleteSale } from "@/services/sales";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof SaleSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("sales.schema");
  const tStatus = await getTranslations("sales.status");
  const paramsSchema = SaleSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const [sale] = await createSale(validatedFields.data);

    revalidatePath(`/admin/crops/detail/${sale.cropId}/sales`);

    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("sales.status");
  try {
    const [sale] = await deleteSale(id);
    revalidatePath(`/admin/crops/detail/${sale.cropId}/sales`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
