import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectSortOrder } from "@/lib/utils";
import { FileSelect, FileWithOwner, PaginatedResponse } from "@/types";
import { File } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { getCurrentStaff } from "./staffs";
export const utapi = new UTApi();
type FileParams = {
  name: string;
  type: string;
  key: string;
  url: string;
  ownerId: string;
  isPublic?: boolean;
  orgId?: string | null;
};
export const revalidatePathFile = (file: File) => {
  revalidatePath("/admin/my-files");
  revalidatePath("/admin/public-files");
  revalidatePath("/admin/messages/files");
  if (file.orgId) {
    revalidatePath(`/admin/organizations/detail/${file.orgId}/files`);
  }
};
export const createFile = async (params: FileParams) => {
  return await db.file.create({
    data: {
      ...params,
    },
  });
};
type FileUrlParams = {
  name?: string | null;
  type?: string | null;
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
  const { ownerId, isPublic, orgId, name: initName, type: initType } = params;
  const { key, url, name: defaultName, type: defaultType } = uploadedFile.data;

  return await createFile({
    ownerId,
    isPublic,
    orgId,
    key,
    name: initName || defaultName,
    type: initType || defaultType,
    url,
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
export const deleteManyFileDeleted = async () => {
  const fileKeys = await db.file.findMany({
    where: {
      deleted: true,
    },
    select: {
      key: true,
    },
  });
  const deletedFiles = await utapi.deleteFiles(
    fileKeys.map((item) => item.key)
  );
  if (!deletedFiles.success) {
    throw new Error("Delete uploaded files error");
  }
  await db.file.deleteMany({
    where: {
      key: {
        in: fileKeys.map((item) => item.key),
      },
    },
  });
  return fileKeys.map((item) => item.key);
};
type FileQuery = {
  page?: number;
  orgId?: string;
  isPublic?: boolean;
  ownerId?: string;
  query?: string;
  orderBy?: string;
};
// all messages: files: public=true, messageId!=null
// org message: files: public=false, messageId!=null, orgId='id'
export const getMessageFiles = async ({
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
          messageId: {
            not: null,
          },
        },
        include: {
          owner: true,
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
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
          messageId: {
            not: null,
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

// public files contain public=true and not message file
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
          messageId: null,
          deleted: false,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
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
  page = 1,
  orderBy,
  query,
}: {
  page?: number;
  orderBy?: string;
  query?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ownerId: currentStaff.id,
          messageId: null,
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
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.file.count({
        where: {
          ownerId: currentStaff.id,
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
// deleted files contain deleted from my-files, message files from org or all
export const getFilesDeletedByOwnerId = async ({
  page = 1,
  orderBy,
  query,
}: {
  page?: number;
  orderBy?: string;
  query?: string;
}): Promise<PaginatedResponse<FileWithOwner>> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    const [files, count] = await db.$transaction([
      db.file.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ownerId: currentStaff.id,
          deleted: true,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          owner: true,
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.file.count({
        where: {
          ownerId: currentStaff.id,
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

export const getFilesByOwnerIdSelect = async ({
  ownerId,
}: {
  ownerId: string;
}): Promise<FileSelect[]> => {
  try {
    const files = db.file.findMany({
      take: 500,
      where: {
        ownerId,
        orgId: null,
        messageId: null,
        isPublic: false,
        deleted: false,
      },
      select: {
        name: true,
        url: true,
        type: true,
        isPublic: true,
        orgId: true,
        ownerId: true,
      },
    });
    return files;
  } catch (error) {
    return [];
  }
};

export const getFileByUrl = async (url: string) => {
  try {
    return await db.file.findUnique({
      where: { url },
    });
  } catch (error) {
    return null;
  }
};
