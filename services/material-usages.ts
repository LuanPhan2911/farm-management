import { LIMIT } from "@/configs/paginationConfig";
import {
  ActivityExistError,
  ActivityUpdateUsageError,
  MaterialExistError,
  MaterialUpdateQuantityError,
  MaterialUsageExistError,
  MaterialUsageUpdateQuantityError,
} from "@/errors";
import { canUpdateActivityUsage } from "@/lib/permission";
import { db } from "@/lib/db";
import { getObjectSortOrder } from "@/lib/utils";
import { MaterialUsageTable, PaginatedResponse } from "@/types";
import { revalidatePath } from "next/cache";

type RevalidatePathParam = {
  materialId: string;
};
export const revalidatePathMaterialUsage = ({
  materialId,
}: RevalidatePathParam) => {
  revalidatePath(`/admin/materials/`);
  revalidatePath(`/admin/materials/detail/${materialId}`);
  revalidatePath(`/admin/materials/detail/${materialId}/usages`);
};
type MaterialUsageParam = {
  materialId: string;
  quantityUsed: number;
  activityId: string;
  unitId: string;
};

export const createMaterialUsage = async (params: MaterialUsageParam) => {
  const { materialId, quantityUsed, activityId } = params;
  const material = await db.material.findUnique({
    where: { id: materialId },
    select: {
      quantityInStock: true,
    },
  });
  if (!material) {
    throw new MaterialExistError();
  }
  if (material.quantityInStock < quantityUsed) {
    throw new MaterialUpdateQuantityError(material);
  }
  const activity = await db.activity.findUnique({
    where: { id: activityId },
    select: {
      status: true,
    },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityUsage(activity.status)) {
    throw new ActivityUpdateUsageError();
  }

  // If stock is sufficient, proceed with the transaction
  const [materialUsage, updatedMaterial] = await db.$transaction([
    db.materialUsage.create({
      data: {
        ...params,
      },
    }),
    db.material.update({
      where: { id: materialId },
      data: {
        quantityInStock: {
          decrement: quantityUsed,
        },
      },
    }),
  ]);

  return { materialUsage, updatedMaterial };
};
type MaterialUsageUpdateParams = {
  quantityUsed: number;
};
export const updateMaterialUsage = async (
  id: string,
  { quantityUsed: newQuantityUsed }: MaterialUsageUpdateParams
) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    select: {
      quantityUsed: true,
      material: {
        select: {
          quantityInStock: true,
        },
      },
      activity: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!materialUsage) {
    throw new MaterialUsageExistError();
  }

  if (!canUpdateActivityUsage(materialUsage.activity.status)) {
    throw new ActivityUpdateUsageError();
  }

  // Calculate the quantity difference
  const quantityDifference = newQuantityUsed - materialUsage.quantityUsed;
  if (
    quantityDifference > 0 &&
    materialUsage.material.quantityInStock < quantityDifference
  ) {
    throw new MaterialUsageUpdateQuantityError(materialUsage);
  }

  const [updatedUsage, updatedMaterial] = await db.$transaction([
    db.materialUsage.update({
      where: { id },
      data: { quantityUsed: newQuantityUsed },
    }),
    db.material.update({
      where: { id },
      data: {
        quantityInStock: {
          ...(quantityDifference > 0 && {
            decrement: quantityDifference,
          }),
          ...(quantityDifference < 0 && {
            increment: Math.abs(quantityDifference),
          }),
        },
      },
    }),
  ]);

  return { updatedUsage, updatedMaterial };
};
export const deleteMaterialUsage = async (id: string) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    select: {
      quantityUsed: true,
      activity: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!materialUsage) {
    throw new MaterialUsageExistError();
  }
  if (!canUpdateActivityUsage(materialUsage.activity.status)) {
    throw new ActivityUpdateUsageError();
  }
  // delete material usage

  // restock restock material
  const [deletedUsage, updatedMaterial] = await db.$transaction([
    db.materialUsage.delete({
      where: {
        id,
      },
    }),
    db.material.update({
      where: { id },
      data: {
        quantityInStock: {
          increment: materialUsage.quantityUsed, // Add more stock
        },
      },
    }),
  ]);
  return { deletedUsage, updatedMaterial };
};

type MaterialUsageQuery = {
  materialId: string;
  page?: number;
  query?: string;
  orderBy?: string;
};
export const getMaterialUsages = async ({
  page = 1,
  query,
  materialId,
  orderBy,
}: MaterialUsageQuery): Promise<PaginatedResponse<MaterialUsageTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.materialUsage.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          materialId,
          material: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },

        include: {
          material: true,
          unit: {
            select: {
              name: true,
            },
          },
          activity: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              createdBy: true,
              assignedTo: true,
              activityDate: true,
              note: true,
            },
          },
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.materialUsage.count({
        where: {
          materialId,
          material: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getMaterialUsageById = async (id: string) => {
  try {
    return await db.materialUsage.findUnique({
      where: { id },
      include: {
        material: true,
        unit: {
          select: {
            name: true,
          },
        },
        activity: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            createdBy: true,
            assignedTo: true,
            activityDate: true,
            note: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
