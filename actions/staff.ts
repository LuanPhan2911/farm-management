"use server";

import { sendStaffCreateUser } from "@/lib/mail";
import { errorResponse, successResponse } from "@/lib/utils";
import { StaffSchema, UserSchema } from "@/schemas";
import { createStaff, deleteStaff, updateStaff } from "@/services/staffs";
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
    const { email, name, role, receiverEmail, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse(tSchema("errors.exist"));
    }

    const user = await createUser({ ...validatedFields.data });
    if (!user) {
      return errorResponse(tStatus("failure.create"));
    }
    const staff = await createStaff(user.id, {
      email,
      name,
      role,
      imageUrl: user.imageUrl,
    });
    if (!staff) {
      return errorResponse(tStatus("failure.create"));
    }
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
  const tStatus = await getTranslations("users.status");
  try {
    const user = await updateUserMetadata(userId, {
      role,
    });
    if (!user) {
      return errorResponse(tStatus("failure.editRole"));
    }
    const staff = await updateStaff(user.id, role);
    if (!staff) {
      return errorResponse(tStatus("failure.editRole"));
    }
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

    if (!user) {
      return errorResponse(tStatus("failure.destroy"));
    }
    const staff = await deleteStaff(user.id);
    if (!staff) {
      return errorResponse(tStatus("failure.destroy"));
    }
    revalidatePath("/dashboard/staffs");
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
