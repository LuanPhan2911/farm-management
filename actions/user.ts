"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { UserSchema } from "@/schemas";
import { createOrUpdateStaff } from "@/services/staffs";
import {
  deleteUser,
  getUserById,
  updateUser,
  updateUserMetadata,
} from "@/services/users";
import { ActionResponse } from "@/types";
import { StaffRole } from "@prisma/client";
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

export const editRole = async (
  userId: string,
  role: StaffRole
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("users.status");
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return errorResponse("No exist user");
    }
    const email = existingUser.emailAddresses[0].emailAddress;

    const staff = await createOrUpdateStaff(email, role);
    if (!staff) {
      return errorResponse("Upsert staff failure");
    }
    const user = await updateUser(
      userId,
      {
        externalId: staff.id,
      },
      {
        role,
      }
    );
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/detail/${userId}`);
    return successResponse(tStatus("success.editRole"));
  } catch (error) {
    return errorResponse(tStatus("failure.editRole"));
  }
};

export const edit = async (
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
    const user = await updateUser(
      userId,
      {
        firstName,
        lastName,
      },
      {
        phone,
        address,
      }
    );
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
