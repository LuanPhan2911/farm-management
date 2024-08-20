"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { UserSchema } from "@/schemas";
import { deleteUser, updateUser, updateUserMetadata } from "@/services/users";
import { ActionResponse, Roles } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("users.status");

  try {
    const user = await deleteUser(id);
    if (!user) {
      return errorResponse(tStatus("failure.destroy"));
    }
    revalidatePath("/dashboard/users");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const updateRole = async (
  userId: string,
  role: Roles
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("users.status");
  try {
    const user = await updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/detail/${userId}`);
    return successResponse(tStatus("success.updateRole"));
  } catch (error) {
    return errorResponse(tStatus("failure.updateRole"));
  }
};

export const update = async (
  values: z.infer<ReturnType<typeof UserSchema>>,
  userId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("users.schema");
  const tStatus = await getTranslations("users.status");
  const paramsSchema = UserSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  const { firstName, lastName, address, phone } = validatedFields.data;
  try {
    const user = await updateUser(userId, firstName, lastName, address, phone);
    if (!user) {
      return errorResponse(tStatus("failure.edit"));
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/detail/${user.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
