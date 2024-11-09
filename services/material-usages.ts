import { LIMIT } from "@/configs/paginationConfig";
import {
  ActivityExistError,
  ActivityUpdateStatusError,
  MaterialExistError,
  MaterialUpdateQuantityError,
  MaterialUsageExistError,
  MaterialUsageUpdateQuantityError,
} from "@/errors";
import { canUpdateActivityStatus } from "@/lib/permission";
import { db } from "@/lib/db";
import { getObjectSortOrder } from "@/lib/utils";
import {
  MaterialUsageTable,
  MaterialUsageTableWithCost,
  MaterialUsageTableWithTotalCost,
  PaginatedResponse,
  PaginatedResponseWithTotalCost,
} from "@/types";
import { revalidatePath } from "next/cache";
import { activitySelect } from "./activities";

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
  unitId: string;
  activityId?: string | null;
  actualPrice?: number | null;
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
  if (activityId) {
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      select: {
        status: true,
      },
    });
    if (!activity) {
      throw new ActivityExistError();
    }
    if (!canUpdateActivityStatus(activity.status)) {
      throw new ActivityUpdateStatusError();
    }
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
  actualPrice?: number | null;
};
export const updateMaterialUsage = async (
  id: string,
  { quantityUsed: newQuantityUsed, actualPrice }: MaterialUsageUpdateParams
) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    select: {
      quantityUsed: true,
      materialId: true,
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

  if (materialUsage.activity) {
    if (!canUpdateActivityStatus(materialUsage.activity.status)) {
      throw new ActivityUpdateStatusError();
    }
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
      data: { quantityUsed: newQuantityUsed, actualPrice },
    }),
    db.material.update({
      where: { id: materialUsage.materialId },
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

export const assignMaterialUsage = async (
  id: string,
  {
    activityId,
  }: {
    activityId: string;
  }
) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id, activityId: null },
  });
  if (!materialUsage) {
    throw new MaterialUsageExistError();
  }
  const activity = await db.activity.findUnique({
    where: { id: activityId },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }
  const updateMaterialUsage = await db.materialUsage.update({
    where: {
      id,
    },
    data: {
      activityId,
    },
  });
  return updateMaterialUsage;
};
export const revokeMaterialUsage = async (
  id: string,
  {
    activityId,
  }: {
    activityId: string;
  }
) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id, activityId },
  });
  if (!materialUsage) {
    throw new MaterialUsageExistError();
  }
  const activity = await db.activity.findUnique({ where: { id: activityId } });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }

  const updateMaterialUsage = await db.materialUsage.update({
    where: {
      id,
    },
    data: {
      activityId: null,
    },
  });
  return updateMaterialUsage;
};
export const deleteMaterialUsage = async (id: string) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    select: {
      quantityUsed: true,
      materialId: true,
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
  if (materialUsage.activity?.status) {
    if (!canUpdateActivityStatus(materialUsage.activity.status)) {
      throw new ActivityUpdateStatusError();
    }
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
      where: { id: materialUsage.materialId },
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
  page?: number;
  materialId?: string;
  query?: string;
  orderBy?: string;
  activityId?: string;
};

export const materialSelect = {
  id: true,
  unitId: true,
  name: true,
  imageUrl: true,
  type: true,
  quantityInStock: true,
  basePrice: true,
  unit: {
    select: {
      name: true,
    },
  },
};
export const getMaterialUsages = async ({
  page = 1,
  query,
  materialId,
  orderBy,
  activityId,
}: MaterialUsageQuery): Promise<
  PaginatedResponseWithTotalCost<MaterialUsageTableWithCost>
> => {
  try {
    const [data, count] = await db.$transaction([
      db.materialUsage.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ...(materialId && {
            materialId,
          }),
          ...(activityId && {
            OR: [
              {
                activityId: null,
              },
              {
                activityId,
              },
            ],
          }),
          material: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },

        include: {
          material: {
            select: {
              ...materialSelect,
            },
          },
          unit: {
            select: {
              name: true,
            },
          },
          activity: {
            select: {
              ...activitySelect,
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

    let totalCost: number = 0;
    const dataWithCost = data.map((item) => {
      if (item.actualPrice != null && item.quantityUsed !== null) {
        totalCost += item.actualPrice * item.quantityUsed;
        return {
          ...item,
          actualCost: item.actualPrice * item.quantityUsed,
        };
      }

      return {
        ...item,
        actualCost: null,
      };
    });

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data: dataWithCost,
      totalPage,
      totalCost,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
      totalCost: 0,
    };
  }
};
type MaterialUsageByActivityQuery = {
  materialId?: string;
  query?: string;
  orderBy?: string;
  activityId?: string;
};
export const getMaterialUsagesByActivity = async ({
  query,
  materialId,
  orderBy,
  activityId,
}: MaterialUsageByActivityQuery): Promise<MaterialUsageTableWithTotalCost> => {
  try {
    const data = await db.materialUsage.findMany({
      where: {
        ...(materialId && {
          materialId,
        }),
        ...(activityId && {
          OR: [
            {
              activityId: null,
            },
            {
              activityId,
            },
          ],
        }),
        material: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },

      include: {
        material: {
          select: {
            ...materialSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
        activity: {
          select: {
            ...activitySelect,
          },
        },
      },
      orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
    });

    let totalCost: number = 0;
    const dataWithCost = data.map((item) => {
      if (
        item.actualPrice != null &&
        item.quantityUsed !== null &&
        item.activityId !== null
      ) {
        totalCost += item.actualPrice * item.quantityUsed;
        return {
          ...item,
          actualCost: item.actualPrice * item.quantityUsed,
        };
      }

      return {
        ...item,
        actualCost: null,
      };
    });

    return {
      data: dataWithCost,
      totalCost,
    };
  } catch (error) {
    return {
      data: [],
      totalCost: 0,
    };
  }
};

export const getMaterialUsageById = async (
  id: string
): Promise<MaterialUsageTable | null> => {
  try {
    return await db.materialUsage.findUnique({
      where: { id },
      include: {
        material: {
          select: {
            ...materialSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
        activity: {
          select: {
            ...activitySelect,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
