import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectSortOrder } from "@/lib/utils";
import { FileWithOwner, PaginatedResponse } from "@/types";

type FileParams = {
  name: string;
  type: string;
  key: string;
  url: string;
  ownerId: string;
  isPublic?: boolean;
  orgId?: string | null;
};

export const createFile = async (params: FileParams) => {
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
  page?: number;
  orgId?: string;
  isPublic?: boolean;
  ownerId?: string;
  query?: string;
  orderBy?: string;
};
export const getFiles = async ({
  isPublic,
  orgId,
  ownerId,
  page = 1,
  query,
  orderBy,
}: FileQuery): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          orgId,
          isPublic,
          ownerId,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: {
          ...(orderBy && getObjectSortOrder(orderBy)),
        },
      }),
      db.file.count(),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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
export const getFilesByOrgId = async ({
  page = 1,
  orgId,
}: {
  page?: number;
  orgId: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          orgId,
        },
        include: {
          owner: true,
        },
      }),
      db.file.count(),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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

export const getPublicFiles = async ({
  page = 1,
}: {
  page?: number;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          isPublic: true,
        },
        include: {
          owner: true,
        },
      }),
      db.file.count(),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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
export const getFilesByOwnerId = async ({
  ownerId,
  page = 1,
}: {
  page?: number;
  ownerId: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ownerId,
        },
        include: {
          owner: true,
        },
      }),
      db.file.count(),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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
