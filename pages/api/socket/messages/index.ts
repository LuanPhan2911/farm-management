import { errorResponse, successResponse } from "@/lib/utils";
import { MessageSchema } from "@/schemas";
import { createFileFromUrl } from "@/services/files";
import { createMessage } from "@/services/messages";
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

    const isPublic = orgId === "all";

    let { content, fileIds, fileUrl, name, type } = validatedFields.data;
    if (fileUrl) {
      //check file exist
      const copiedFile = await createFileFromUrl({
        url: fileUrl,
        ownerId: staff.id,
        isPublic,
        name,
        type,
        orgId: isPublic ? undefined : (orgId as string),
      });

      if (copiedFile) {
        fileIds = [copiedFile.id];
      }
    }

    const message = await createMessage({
      content,
      fileIds,
      orgId: isPublic ? undefined : (orgId as string),
      staffId: staff.id,
    });

    const key = `chat:${orgId as string}:messages`;

    res?.socket?.server?.io?.emit(key, message);

    return res.status(200).json(successResponse("Message sent"));
  } catch (error) {
    return res.status(500).json(errorResponse("Internal error"));
  }
}
