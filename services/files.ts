import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectSortOrder } from "@/lib/utils";
import { FileWithOwner, PaginatedResponse } from "@/types";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi({
  defaultKeyType: "fileKey",
  apiKey: process.env.UPLOADTHING_SECRET,
});
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
type FileUrlParams = {
  name: string;
  url: string;
  ownerId: string;
  isPublic?: boolean;
  orgId?: string | null;
};
export const createFileFromUrl = async (params: FileUrlParams) => {
  const uploadedFile = await utapi.uploadFilesFromUrl(params.url);
  if (uploadedFile.error) {
    throw new Error("Fail create file uploadthing");
  }
  const { ownerId, isPublic, orgId, name } = params;
  const { key, type, url } = uploadedFile.data;
  return await createFile({
    ownerId,
    isPublic,
    orgId,
    key,
    type,
    url,
    name,
  });
};
export const updateFileDeleted = async (
  id: string,
  params: { deleted: boolean }
) => {
  return db.file.update({
    where: { id },
    data: {
      ...params,
      deletedAt: params.deleted ? new Date() : null,
    },
  });
};

type UpdateFileParams = {
  name: string;
};
export const updateFileName = async (id: string, params: UpdateFileParams) => {
  return await db.file.update({
    where: { id },
    data: {
      ...params,
    },
  });
};

export const deleteFile = async (id: string) => {
  const file = await db.file.delete({ where: { id } });
  await utapi.deleteFiles(file.key);
  return file;
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
          deleted: false,
        },
        include: {
          owner: true,
        },
        orderBy: [
          {
            ...(orderBy && getObjectSortOrder(orderBy)),
          },
        ],
      }),
      db.file.count({
        where: {
          orgId,
          isPublic,
          ownerId,
          name: {
            contains: query,
            mode: "insensitive",
          },
          deleted: false,
        },
      }),
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
  query,
  orderBy,
}: {
  page?: number;
  orgId: string;
  query?: string;
  orderBy?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          orgId,
          isPublic: false,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [{ ...(orderBy && getObjectSortOrder(orderBy)) }],
      }),
      db.file.count({
        where: {
          orgId,
          isPublic: false,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      }),
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
  orderBy,
  query,
}: {
  page?: number;
  query?: string;
  orderBy?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          isPublic: true,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [{ ...(orderBy && getObjectSortOrder(orderBy)) }],
      }),
      db.file.count({
        where: {
          isPublic: true,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      }),
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
  orderBy,
  query,
}: {
  page?: number;
  ownerId: string;
  orderBy?: string;
  query?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ownerId,
          orgId: null,
          message: null,
          isPublic: false,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [{ ...(orderBy && getObjectSortOrder(orderBy)) }],
      }),
      db.file.count({
        where: {
          ownerId,
          orgId: null,
          message: null,
          isPublic: false,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      }),
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

export const getFilesDeletedByOwnerId = async ({
  ownerId,
  page = 1,
  orderBy,
  query,
}: {
  page?: number;
  ownerId: string;
  orderBy?: string;
  query?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ownerId,
          orgId: null,
          deleted: true,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [{ ...(orderBy && getObjectSortOrder(orderBy)) }],
      }),
      db.file.count({
        where: {
          ownerId,
          orgId: null,
          isPublic: false,
          deleted: true,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      }),
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
