import { errorResponse, successResponse } from "@/lib/utils";
import { MessageSchema } from "@/schemas";
import { createMessage } from "@/services/messages";
import { getOrganizationById } from "@/services/organizations";
import { getCurrentStaffPages } from "@/services/staffs";
import { ActionResponse, NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo<ActionResponse>
) {
  if (req.method !== "POST") {
    return res.status(400).json(errorResponse("Method not allow"));
  }
  try {
    const paramsSchema = MessageSchema();
    const { orgId } = req.query;
    const validatedFields = paramsSchema.safeParse(JSON.parse(req.body));
    if (!validatedFields.success || !orgId) {
      return res.status(400).json(errorResponse("Invalid field"));
    }
    const staff = await getCurrentStaffPages(req);
    if (!staff) {
      return res.status(400).json(errorResponse("Staff is not exist"));
    }
    // check all chat message orgIg= all
    let message;
    if (orgId != "all") {
      const org = await getOrganizationById(orgId as string);
      if (!org) {
        return res.status(400).json(errorResponse("Org is not exist"));
      }
      message = await createMessage({
        ...validatedFields.data,
        orgId: org.id,
        staffId: staff.id,
      });
    } else {
      message = await createMessage({
        ...validatedFields.data,
        orgId: "all",
        staffId: staff.id,
      });
    }

    const key = `chat:${message.orgId}:messages`;

    res?.socket?.server?.io?.emit(key, message);

    return res.status(200).json(successResponse("Message sent"));
  } catch (error) {
    return res.status(500).json(errorResponse("Internal error"));
  }
}
