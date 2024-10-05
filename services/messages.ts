import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { MessageWithStaff, PaginatedWithCursorResponse } from "@/types";

type MessageParams = {
  staffId: string;
  orgId?: string | null;
  content: string;
  fileIds?: string[] | null;
  deleted?: boolean;
};

export const createMessage = async (params: MessageParams) => {
  const { fileIds, ...other } = params;
  return await db.message.create({
    data: {
      ...other,
      ...(!!fileIds &&
        fileIds?.length > 0 && {
          files: {
            connect: fileIds?.map((fileId) => ({ id: fileId })),
          },
        }),
    },
    include: {
      staff: true,
      files: true,
    },
  });
};
type UpdateMessageParams = {
  content: string;
};
export const updateMessage = async (
  id: string,
  params: UpdateMessageParams
) => {
  return await db.message.update({
    where: { id },
    data: { ...params },
    include: {
      staff: true,
      files: true,
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
      files: {
        deleteMany: {
          messageId: id,
        },
      },
    },
    include: {
      staff: true,
      files: true,
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
        files: true,
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
      files: true,
    },
  });
};
