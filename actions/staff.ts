"use server";

import { sendStaffCreateUser } from "@/lib/mail";
import { errorResponse, successResponse } from "@/lib/utils";
import { StaffSchema, UserSchema } from "@/schemas";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  updateUserMetadata,
} from "@/services/users";
import { ActionResponse } from "@/types";
import { StaffRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof StaffSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("staffs.schema");
  const tStatus = await getTranslations("staffs.status");
  const paramsSchema = StaffSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return errorResponse(tSchema("errors.parse"));
    }
    const { email, name, receiverEmail, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse(tSchema("errors.exist"));
    }

    const user = await createUser({ ...validatedFields.data });

    //TODO: webhook for create staff
    if (!!receiverEmail) {
      sendStaffCreateUser(receiverEmail, {
        email,
        password,
        name,
      });
    }
    revalidatePath("/admin/staffs");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};

export const editRole = async (
  userId: string,
  role: StaffRole
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("staffs.status");
  try {
    const user = await updateUserMetadata(userId, {
      role,
    });

    //TODO webhook for update staff role
    revalidatePath("/admin/staffs");
    revalidatePath(`/admin/staffs/detail/${userId}`);
    return successResponse(tStatus("success.editRole"));
  } catch (error) {
    return errorResponse(tStatus("failure.editRole"));
  }
};

export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("staffs.status");

  try {
    const user = await deleteUser(id);

    //TODO: webhook for delete staff
    revalidatePath("/admin/staffs");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
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

  try {
    const user = await updateUser(userId, validatedFields.data);

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/detail/${user.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
