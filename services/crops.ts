import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectFilterNumber, getObjectSortOrder } from "@/lib/utils";
import {
  CropMaterialUsage,
  CropSaleTable,
  CropSelectWithField,
  CropTable,
  CropWithCount,
  PaginatedResponse,
} from "@/types";
import { unitInclude } from "./units";
import { getCurrentStaff } from "./staffs";
import { isSuperAdmin } from "@/lib/permission";
import { fieldSelect, getFieldsByOrgId } from "./fields";
import { plantSelect } from "./plants";
import { Crop, CropStatus } from "@prisma/client";
import { CropEndDateInvalidError, CropUpdateStatusFinishError } from "@/errors";
import { isBefore } from "date-fns";
import _ from "lodash";

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
      latestCropFields: {
        connect: {
          id: params.fieldId,
        },
      },
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

export const updateCropStatusFinish = async (id: string) => {
  const crop = await db.crop.findUnique({
    where: {
      id,
      status: {
        not: "FINISH",
      },
      activities: {
        every: {
          status: "COMPLETED",
        },
      },
    },
    include: {
      sales: {
        select: {
          price: true,
          value: true,
        },
      },
    },
  });
  if (!crop) {
    throw new CropUpdateStatusFinishError();
  }
  if (crop.endDate === null && isBefore(new Date(), crop.startDate)) {
    throw new CropEndDateInvalidError();
  }
  const actualYield = _.sumBy(crop.sales, (item) => item.value);
  const totalRevenue = _.sumBy(crop.sales, (item) => item.price * item.value);
  return await db.crop.update({
    where: {
      id,
    },
    data: {
      status: "FINISH",
      endDate: crop.endDate ?? new Date(),
      actualYield,
      totalRevenue,
    },
  });
};

type CropLearnedLessons = {
  learnedLessons?: string | null;
};
export const updateCropLearnedLessons = async (
  id: string,
  params: CropLearnedLessons
) => {
  return await db.crop.update({
    where: {
      id,
    },
    data: {
      ...params,
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
  query?: string;
  page?: number;
  startDate?: Date;
  endDate?: Date;
  getAll?: boolean;
};
export const getCrops = async ({
  orgId,
  endDate,
  query,
  page = 1,
  plantId,
  startDate,
  fieldId,

  getAll = false,
}: CropQuery): Promise<PaginatedResponse<CropTable>> => {
  try {
    if (!getAll && !orgId) {
      throw new Error("No field id to get crops");
    }
    let fields;
    if (orgId) {
      fields = await getFieldsByOrgId(orgId);
    }

    let fieldIds: string[] = [];
    fieldIds = fields === undefined ? [] : fields.map((item) => item.id);

    const [crops, count] = await db.$transaction([
      db.crop.findMany({
        where: {
          ...(fieldId
            ? {
                fieldId,
              }
            : {
                fieldId: {
                  in: getAll && !orgId ? undefined : fieldIds,
                },
              }),
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

          ...(plantId && { plantId }),

          name: {
            contains: query,
            mode: "insensitive",
          },
        },

        take: LIMIT,
        skip: (page - 1) * LIMIT,
        orderBy: [{ startDate: "desc" }],
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
                  in: getAll && !orgId ? undefined : fieldIds,
                },
              }),
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

          ...(plantId && { plantId }),

          name: {
            contains: query,
            mode: "insensitive",
          },
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
  status: true,
};
type CropSelectQuery = {
  orgId?: string;
};
export const getCropsSelect = async ({
  orgId,
}: CropSelectQuery): Promise<CropSelectWithField[]> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    if (!orgId && !isSuperAdmin(currentStaff.role)) {
      throw new Error("No field id to get crops");
    }

    const fields = await db.field.findMany({
      where: {
        ...(!isSuperAdmin(currentStaff.role) && {
          orgId,
        }),
      },
      select: {
        id: true,
      },
    });

    return await db.crop.findMany({
      where: {
        status: {
          not: "FINISH",
        },
        fieldId: {
          in: fields?.map((item) => item.id),
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
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  } catch (error) {
    return [];
  }
};

export const cropMaterial = {
  id: true,
  name: true,
  imageUrl: true,
  type: true,
  typeId: true,
  unit: {
    select: {
      name: true,
    },
  },
};

type CropMaterialUsageQuery = {
  cropId: string;
  page?: number;
};
export const getCropMaterialUsage = async ({
  cropId,
  page = 1,
}: CropMaterialUsageQuery): Promise<PaginatedResponse<CropMaterialUsage>> => {
  try {
    const activities = await db.activity.findMany({
      where: {
        cropId,
        status: "COMPLETED",
      },
      select: {
        id: true,
      },
    });
    let [data, count] = await db.$transaction([
      db.materialUsage.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          activityId: {
            in: activities.map((item) => item.id),
          },
          material: {
            type: {
              in: ["FERTILIZER", "PESTICIDE"],
            },
          },
        },
        include: {
          material: {
            select: {
              ...cropMaterial,
            },
          },
          unit: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.materialUsage.count({
        where: {
          activityId: {
            in: activities.map((item) => item.id),
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

type CropSaleCostQuery = {
  begin?: Date;
  end?: Date;
  query?: string;
  orgId?: string | null;

  getAll?: boolean;
};
export const getCropSaleCosts = async ({
  begin,
  end,
  query,
  orgId,
  getAll = false,
}: CropSaleCostQuery): Promise<CropSaleTable[]> => {
  try {
    if (!begin || !end) {
      throw new Error("Missing begin and end date");
    }

    if (!getAll && !orgId) {
      throw new Error("No field id to get crops");
    }
    let fields;
    if (orgId) {
      fields = await getFieldsByOrgId(orgId);
    }

    let fieldIds: string[] = [];
    fieldIds = fields === undefined ? [] : fields.map((item) => item.id);

    const crops = await db.crop.findMany({
      where: {
        fieldId: {
          in: getAll && !orgId ? undefined : fieldIds,
        },
        status: "FINISH",
        startDate: {
          gte: begin,
        },
        endDate: {
          lte: end,
        },
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        unit: {
          select: {
            name: true,
          },
        },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    return crops;
  } catch (error) {
    return [];
  }
};
