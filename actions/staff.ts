"use server";

import { sendStaffCreateUser } from "@/lib/mail";
import { errorResponse, successResponse } from "@/lib/utils";
import { StaffSchema, StaffUpdateSchema } from "@/schemas";
import { createStaff, deleteStaff, updateStaff } from "@/services/staffs";
import {
  createUser,
  getUserByEmail,
  updateUserMetadata,
} from "@/services/users";
import { ActionResponse } from "@/types";
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
    const {
      email,
      name,
      receiverEmail,
      password,
      role,
      address,
      baseHourlyWage,
      phone,
      startToWorkDate,
    } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse(tSchema("errors.exist"));
    }

    const user = await createUser({
      email,
      name,
      password,
      role,
      address,
      phone,
    });
    const staff = await createStaff(user.id, {
      email,
      name,
      role,
      address,
      baseHourlyWage,
      phone,
      startToWorkDate,
    });

    //TODO: webhook for create staff
    if (!!receiverEmail) {
      sendStaffCreateUser(receiverEmail, {
        email,
        password,
        name,
        startToWorkDate,
      });
    }
    revalidatePath("/admin/staffs");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};

export const edit = async (
  values: z.infer<ReturnType<typeof StaffUpdateSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("staffs.schema");
  const tStatus = await getTranslations("staffs.status");
  const paramsSchema = StaffUpdateSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return errorResponse(tSchema("errors.parse"));
    }

    const staff = await updateStaff(id, {
      ...validatedFields.data,
    });
    revalidatePath("/admin/staffs");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};

export const destroy = async (externalId: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("staffs.status");

  try {
    const user = await updateUserMetadata(externalId, {
      role: undefined,
    });
    const staff = await deleteStaff(externalId);

    //TODO: webhook for delete staff
    revalidatePath(`/admin/users`);
    revalidatePath("/admin/staffs");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
