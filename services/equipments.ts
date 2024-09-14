import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { PaginatedResponse, EquipmentTable, EquipmentTypeCount } from "@/types";
import { EquipmentType } from "@prisma/client";

type EquipmentParams = {
  name: string;
  type: EquipmentType;
  brand: string;
  purchaseDate: Date;
  purchasePrice: {
    unitId: string;
    value: number;
  };
  status: string;
  maintenanceSchedule?: string;
  operatingHours?: number;
  location?: string;
  fuelConsumption?: number;
  energyType?: string;
  description?: string;
  imageUrl?: string;
};
export const createEquipment = async (params: EquipmentParams) => {
  const { purchasePrice: purchasePriceParam, ...otherParams } = params;
  return await db.$transaction(async (ctx) => {
    const purchasePrice = await ctx.floatUnit.create({
      data: {
        ...purchasePriceParam,
      },
    });

    const equipment = await ctx.equipment.create({
      data: {
        ...otherParams,
        purchasePriceId: purchasePrice.id,
      },
    });
    return equipment;
  });
};
export const updateEquipment = async (id: string, params: EquipmentParams) => {
  const { purchasePrice: purchasePriceParam, ...otherParams } = params;
  return await db.$transaction(async (ctx) => {
    const equipment = await ctx.equipment.update({
      where: { id },
      data: {
        ...otherParams,
      },
    });

    await ctx.floatUnit.update({
      data: {
        ...purchasePriceParam,
      },
      where: {
        id: equipment.purchasePriceId,
      },
    });

    return equipment;
  });
};
export const deleteEquipment = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const equipment = await ctx.equipment.delete({
      where: { id },
    });

    await ctx.floatUnit.delete({
      where: { id: equipment.purchasePriceId },
    });
  });
};
type EquipmentQuery = {
  page?: number;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
};
export const getEquipments = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
}: EquipmentQuery): Promise<PaginatedResponse<EquipmentTable>> => {
  try {
    const equipments = await db.equipment.findMany({
      where: {
        ...(filterString && getObjectFilterString(filterString)),
        ...(filterNumber && getObjectFilterNumber(filterNumber)),
      },
      orderBy: {
        ...(orderBy && getObjectSortOrder(orderBy)),
      },
      take: LIMIT,
      skip: (page - 1) * LIMIT,
      include: {
        purchasePrice: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const totalPage = Math.ceil(equipments.length / LIMIT);
    return {
      data: equipments,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getEquipmentById = async (id: string) => {
  try {
    return await db.equipment.findUnique({
      where: {
        id,
      },
      include: {
        purchasePrice: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
export const getCountEquipmentType = async ({
  filterString,
}: EquipmentQuery): Promise<EquipmentTypeCount[]> => {
  try {
    const result = await db.equipment.groupBy({
      by: "type",
      where: {
        ...(filterString && getObjectFilterString(filterString)),
      },
      _count: {
        _all: true,
      },
    });
    return result.map((item) => {
      return {
        type: item.type,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};
