"use server";
import { errorResponse, successResponse } from "@/lib/utils";
import { deleteFile } from "@/services/files";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("files.status");
  try {
    await deleteFile(id);
    revalidatePath("/admin/messages/files");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
