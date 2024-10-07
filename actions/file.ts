"use server";
import { errorResponse, successResponse } from "@/lib/utils";
import { FileCopySchema, FileNameSchema } from "@/schemas";
import {
  createFileFromUrl,
  deleteFile,
  updateFileDeleted,
  updateFileName,
} from "@/services/files";
import { ActionResponse } from "@/types";
import { File } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = (file: File) => {
  revalidatePath("/admin/my-files");
  revalidatePath("/admin/public-files");
  revalidatePath("/admin/messages/files");
  if (file.orgId) {
    revalidatePath(`/admin/organizations/detail/${file.orgId}/files`);
  }
};
export const copy = async (
  values: z.infer<ReturnType<typeof FileCopySchema>>
) => {
  const tSchema = await getTranslations("files.schema");
  const tStatus = await getTranslations("files.status");
  try {
    const paramsSchema = FileCopySchema(tSchema);
    const validatedFields = paramsSchema.safeParse(values);

    if (!validatedFields.success) {
      return errorResponse(tSchema("errors.parse"));
    }
    const file = await createFileFromUrl(validatedFields.data);
    revalidatePath("/admin/my-files");
    revalidatePath("/admin/public-files");
    revalidatePath("/admin/messages/files");

    if (file.orgId) {
      revalidatePath(`/admin/organizations/detail/${file.orgId}/files`);
    }
    return successResponse(tStatus("success.copy"), file);
  } catch (error) {
    return errorResponse(tStatus("failure.copy"));
  }
};

export const editName = async (
  values: z.infer<ReturnType<typeof FileNameSchema>>,
  id: string
) => {
  const tSchema = await getTranslations("files.schema");
  const tStatus = await getTranslations("files.status");
  const paramsSchema = FileNameSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const file = await updateFileName(id, validatedFields.data);
    revalidatePath("/admin/my-files");
    revalidatePath("/admin/public-files");

    return successResponse(tStatus("success.editName"));
  } catch (error) {
    return errorResponse(tStatus("failure.editName"));
  }
};

export const editDeleted = async (
  id: string,
  {
    deleted,
  }: {
    deleted: boolean;
  }
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("files.status");
  try {
    const file = await updateFileDeleted(id, {
      deleted,
    });
    revalidatePath("/admin/my-files");
    revalidatePath("/admin/public-files");
    revalidatePath("/admin/messages/files");
    revalidatePath("/admin/my-trash");
    if (file.orgId) {
      revalidatePath(`/admin/organizations/detail/${file.orgId}/files`);
    }
    return successResponse(tStatus("success.editDeleted"));
  } catch (error) {
    return errorResponse(tStatus("failure.editDeleted"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("files.status");
  try {
    const file = await deleteFile(id);

    revalidatePath("/admin/my-trash");

    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
