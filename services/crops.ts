import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectFilterNumber, getObjectSortOrder } from "@/lib/utils";
import {
  CropSelectWithField,
  CropTable,
  CropWithCount,
  PaginatedResponse,
} from "@/types";
import { unitInclude } from "./units";
import { getCurrentStaff } from "./staffs";
import { isFarmer, isOnlyAdmin, isSuperAdmin } from "@/lib/permission";
import { fieldSelect } from "./fields";
import { plantSelect } from "./plants";
import { CropStatus } from "@prisma/client";

type CropParams = {
  name: string;
  startDate: Date;
  endDate?: Date | null;
  fieldId: string;
  plantId: string;
  estimatedYield: number;
  actualYield?: number | null;
  unitId: string;
  status: CropStatus;
};

export const createCrop = async (params: CropParams) => {
  return await db.crop.create({
    data: {
      ...params,
    },
  });
};
export const updateCrop = async (id: string, params: CropParams) => {
  return await db.crop.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
};

export const updateCropStatus = async (id: string, status: CropStatus) => {
  return await db.crop.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};
export const deleteCrop = async (id: string) => {
  const crop = await db.crop.delete({ where: { id } });
  return crop;
};
type CropQuery = {
  orgId?: string | null;
  plantId?: string;
  fieldId?: string;
  name?: string;
  page?: number;
  orderBy?: string;
  startDate?: Date;
  endDate?: Date;
  filterNumber?: string;
};
export const getCrops = async ({
  orgId,
  endDate,
  filterNumber,
  name,
  orderBy,
  page = 1,
  plantId,
  startDate,
  fieldId,
}: CropQuery): Promise<PaginatedResponse<CropTable>> => {
  try {
    let fields;
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    if (!orgId && !isSuperAdmin(currentStaff.role)) {
      throw new Error("No field id to get crops");
    }
    if (!orgId) {
      fields = await db.field.findMany({
        select: {
          id: true,
        },
      });
    }

    if (orgId) {
      fields = await db.field.findMany({
        where: {
          orgId,
        },
        select: {
          id: true,
        },
      });
    }

    const [crops, count] = await db.$transaction([
      db.crop.findMany({
        where: {
          ...(fieldId
            ? {
                fieldId,
              }
            : {
                fieldId: {
                  in: fields?.map((item) => item.id),
                },
              }),
          AND: [
            {
              startDate: {
                ...(startDate && {
                  gte: startDate,
                }),
              },
              endDate: {
                ...(endDate && {
                  lte: endDate,
                }),
              },
            },
          ],
          ...(plantId && { plantId }),
          ...(name && {
            name: {
              contains: name,
              mode: "insensitive",
            },

            ...(filterNumber && getObjectFilterNumber(filterNumber)),
          }),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        include: {
          ...unitInclude,
          plant: {
            select: {
              ...plantSelect,
            },
          },
          field: {
            select: {
              ...fieldSelect,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
        },
      }),
      db.crop.count({
        where: {
          ...(fieldId
            ? {
                fieldId,
              }
            : {
                fieldId: {
                  in: fields?.map((item) => item.id),
                },
              }),
          AND: [
            {
              startDate: {
                ...(startDate && {
                  gte: startDate,
                }),
              },
              endDate: {
                ...(endDate && {
                  lte: endDate,
                }),
              },
            },
          ],
          ...(plantId && { plantId }),
          ...(name && {
            name: {
              contains: name,
              mode: "insensitive",
            },

            ...(filterNumber && getObjectFilterNumber(filterNumber)),
          }),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
    return {
      data: crops,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getCropById = async (id: string): Promise<CropTable | null> => {
  try {
    return await db.crop.findUnique({
      where: { id },
      include: {
        ...unitInclude,
        plant: {
          select: {
            ...plantSelect,
          },
        },
        field: {
          select: {
            ...fieldSelect,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const getOnlyCropById = async (id: string) => {
  try {
    return await db.crop.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
};
export const getCropByIdWithCount = async (
  id: string
): Promise<CropWithCount | null> => {
  try {
    return await db.crop.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const cropSelect = {
  id: true,
  name: true,
  startDate: true,
  endDate: true,
};
export const getCropsSelect = async (): Promise<CropSelectWithField[]> => {
  try {
    return await db.crop.findMany({
      where: {
        status: {
          not: "FINISH",
        },
      },
      select: {
        ...cropSelect,
        field: {
          select: {
            ...fieldSelect,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    return [];
  }
};
