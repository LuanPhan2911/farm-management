import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { MessageWithStaff, PaginatedWithCursorResponse } from "@/types";

type MessageParams = {
  staffId: string;
  orgId: string;
  content: string;
  fileId?: string | null;
  deleted?: boolean;
};

export const createMessage = async (params: MessageParams) => {
  return await db.message.create({
    data: {
      ...params,
    },
    include: {
      staff: true,
      file: true,
    },
  });
};
export const updateMessage = async (id: string, params: MessageParams) => {
  return await db.message.update({
    where: { id },
    data: { ...params },
    include: {
      staff: true,
      file: true,
    },
  });
};
export const updateMessageDeleted = async (id: string) => {
  return await db.message.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
    include: {
      staff: true,
      file: true,
    },
  });
};
export const deleteMessage = async (id: string) => {
  return await db.message.delete({ where: { id } });
};
type MessageQuery = {
  cursor?: string | null;
  orgId: string;
};
export const getMessagesByOrg = async ({
  orgId,
  cursor,
}: MessageQuery): Promise<PaginatedWithCursorResponse<MessageWithStaff>> => {
  try {
    const messages = await db.message.findMany({
      take: LIMIT,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      where: {
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        staff: true,
        file: true,
      },
    });
    let nextCursor = null;
    if (messages.length === LIMIT) {
      nextCursor = messages[LIMIT - 1].id;
    }
    return {
      items: messages,
      nextCursor: nextCursor,
    };
  } catch (error) {
    return {
      items: [],
      nextCursor: null,
    };
  }
};

export const getMessageById = async (id: string) => {
  return await db.message.findUnique({
    where: { id, deleted: false },
    include: {
      staff: true,
      file: true,
    },
  });
};
