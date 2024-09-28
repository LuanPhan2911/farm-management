import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  PaginatedResponse,
  EquipmentTable,
  EquipmentTypeCount,
  EquipmentSelect,
} from "@/types";
import { EquipmentType } from "@prisma/client";
import { deleteFloatUnit, upsertFloatUnit } from "./units";

type EquipmentParams = {
  name: string;
  type: EquipmentType;
  brand: string;
  purchaseDate: Date;
  purchasePrice: {
    unitId: string;
    value: number;
  };
  status?: string | null;
  maintenanceSchedule?: string | null;
  operatingHours?: number | null;
  location?: string | null;
  fuelConsumption?: number | null;
  energyType?: string | null;
  description?: string | null;
  imageUrl?: string | null;
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

    await upsertFloatUnit({
      ctx,
      data: purchasePriceParam,
      id: equipment.purchasePriceId,
    });

    return equipment;
  });
};
export const deleteEquipment = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const equipment = await ctx.equipment.delete({
      where: { id },
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
    const [equipments, count] = await db.$transaction([
      db.equipment.findMany({
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
      }),
      db.equipment.count({
        where: {
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
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
export const getEquipmentsSelect = async (): Promise<EquipmentSelect[]> => {
  try {
    return await db.equipment.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    return [];
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
export const getCountEquipmentType = async ({}: EquipmentQuery): Promise<
  EquipmentTypeCount[]
> => {
  try {
    const result = await db.equipment.groupBy({
      by: "type",

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
