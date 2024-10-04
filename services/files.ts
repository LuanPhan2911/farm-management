import { db } from "@/lib/db";
import { PaginatedResponse } from "@/types";
import { File } from "@prisma/client";

type FIleParams = {
  name: string;
  type: string;
  key: string;
  url: string;
  ownerId: string;
  isPublic?: boolean;
  orgId?: string | null;
};

export const createFile = async (params: FIleParams) => {
  return await db.file.create({
    data: {
      ...params,
    },
  });
};
export const deleteFile = async (id: string) => {
  return await db.file.delete({ where: { id } });
};
type FileQuery = {
  limit?: number;
  page?: number;
};
export const getFiles = async ({
  page = 1,
  limit = 500,
}: FileQuery): Promise<PaginatedResponse<File>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.file.count(),
    ]);
    const totalPage = Math.ceil(count / limit);
    return {
      data: files,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};
