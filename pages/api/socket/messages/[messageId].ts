import { isAdmin } from "@/lib/role";
import { errorResponse, successResponse } from "@/lib/utils";
import { MessageSchema } from "@/schemas";
import {
  getMessageById,
  updateMessage,
  updateMessageDeleted,
} from "@/services/messages";
import { getOrganizationById } from "@/services/organizations";
import { currentStaffPages } from "@/services/staffs";
import { ActionResponse, NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo<ActionResponse>
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json(errorResponse("Method not allow"));
  }

  try {
    const { messageId, orgId } = req.query;
    let validatedFields;
    if (req.method === "PATCH") {
      const paramsSchema = MessageSchema();
      validatedFields = paramsSchema.safeParse(JSON.parse(req.body));
      if (!validatedFields.success) {
        return res.status(400).json(errorResponse("Invalid field"));
      }
    }
    if (!orgId || !messageId) {
      return res.status(400).json(errorResponse("Invalid field"));
    }

    const staff = await currentStaffPages(req);

    if (!staff) {
      return res.status(400).json(errorResponse("Staff is not exist"));
    }
    const org = await getOrganizationById(orgId as string);
    if (!org) {
      return res.status(400).json(errorResponse("Org is not exist"));
    }
    let message = await getMessageById(messageId as string);
    if (!message) {
      return res.status(400).json(errorResponse("Message is not exist"));
    }
    const isMessageOwner = message.staff.id === staff.id;
    const isAdminRole = isAdmin(staff.role);

    const canModify = isMessageOwner || isAdminRole;
    if (!canModify) {
      return res.status(400).json(errorResponse("Message cannot be modified"));
    }
    let successMessage;
    if (req.method === "DELETE") {
      message = await updateMessageDeleted(message.id);
      successMessage = "Message deleted!";
    }
    if (req.method === "PATCH") {
      message = await updateMessage(message.id, {
        ...validatedFields!.data,
        orgId: org.id,
        staffId: staff.id,
      });
      successMessage = "Message edited";
    }

    const key = `chat:${message.orgId}:messages:update`;

    res?.socket?.server?.io?.emit(key, message);
    return res.status(200).json(successResponse(successMessage!));
  } catch (error) {
    return res.status(500).json(errorResponse("Internal error"));
  }
}
