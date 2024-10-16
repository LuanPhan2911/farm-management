import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { MaterialUsageTable, PaginatedResponse } from "@/types";

type MaterialUsageParam = {
  materialId: string;
  quantityUsed: number;
  activityId: string;
  unitId: string;
};
export const createMaterialUsage = async (params: MaterialUsageParam) => {
  const { materialId, quantityUsed } = params;

  // Begin a transaction
  const [materialUsage, updatedMaterial] = await db.$transaction([
    // Step 1: Create the MaterialUsage record
    db.materialUsage.create({
      data: {
        ...params,
      },
    }),

    // Step 2: Update the quantityInStock in Material
    db.material.update({
      where: { id: materialId },
      data: {
        quantityInStock: {
          decrement: quantityUsed, // Decrement stock by quantity used
        },
      },
    }),
  ]);

  return { materialUsage, updatedMaterial };
};
export const createMaterialUsageWithValidation = async (
  params: MaterialUsageParam
) => {
  const { materialId, quantityUsed } = params;
  const material = await db.material.findUnique({
    where: { id: materialId },
    select: { quantityInStock: true },
  });

  if (!material) {
    throw new Error("Material not found");
  }

  // Validate if there's enough stock
  if (material.quantityInStock < quantityUsed) {
    throw new Error("Not enough stock available");
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
export const updateMaterialUsage = async (
  id: string,
  newQuantityUsed: number
) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    include: { material: true },
  });

  if (!materialUsage) {
    throw new Error("Material usage record not found");
  }

  // Calculate the quantity difference
  const quantityDifference = newQuantityUsed - materialUsage.quantityUsed;

  const [updatedUsage, updatedMaterial] = await db.$transaction([
    db.materialUsage.update({
      where: { id },
      data: { quantityUsed: newQuantityUsed },
    }),
    db.material.update({
      where: { id: materialUsage.materialId },
      data: {
        quantityInStock: {
          decrement: quantityDifference > 0 ? quantityDifference : 0,
          increment: quantityDifference < 0 ? Math.abs(quantityDifference) : 0,
        },
      },
    }),
  ]);

  return { updatedUsage, updatedMaterial };
};
export const deleteMaterialUsage = async (id: string) => {
  const materialUsage = await db.materialUsage.findUnique({
    where: { id },
    include: { material: true },
  });

  if (!materialUsage) {
    throw new Error("Material usage record not found");
  }
  // delete material usage

  // restock restock material
  const [deletedMaterial, updatedMaterial] = await db.$transaction([
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
  return { deletedMaterial, updatedMaterial };
};

type MaterialUsageQuery = {
  page?: number;
  query?: string;
  materialId: string;
};
export const getMaterialUsages = async ({
  page = 1,
  query,
  materialId,
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
        },
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
