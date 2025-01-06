import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { HarvestTable, PaginatedResponse } from "@/types";
import { Harvest } from "@prisma/client";
import { unitInclude } from "./units";

type HarvestParams = {
  harvestDate: Date;
  value: number;
  unitId: string;
  cropId: string;
  createdById: string;
};
export const createHarvest = async (params: HarvestParams) => {
  return await db.$transaction([
    db.harvest.create({
      data: {
        ...params,
      },
    }),
    db.crop.update({
      where: {
        id: params.cropId,
      },
      data: {
        remainYield: {
          increment: params.value,
        },
      },
    }),
  ]);
};

export const deleteHarvest = async (id: string) => {
  // check remain in crop;

  const harvest = await db.harvest.findUnique({
    where: {
      id,
    },
    include: {
      crop: {
        select: {
          remainYield: true,
          id: true,
        },
      },
    },
  });
  if (!harvest) {
    throw new Error("Harvest not found");
  }
  if (harvest.value > harvest.crop.remainYield) {
    throw new Error("Crop remain not enough");
  }

  return await db.$transaction([
    db.harvest.delete({
      where: {
        id,
      },
    }),
    db.crop.update({
      where: {
        id: harvest.crop.id,
      },
      data: {
        remainYield: {
          decrement: harvest.value,
        },
      },
    }),
  ]);
};

type HarvestQuery = {
  cropId: string;
  page?: number;
  begin?: Date;
  end?: Date;
};
export const getHarvests = async ({
  cropId,
  page = 1,
  begin,
  end,
}: HarvestQuery): Promise<PaginatedResponse<HarvestTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.harvest.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          cropId,
          harvestDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
        },
        include: {
          unit: {
            select: {
              name: true,
            },
          },
          createdBy: true,
        },
      }),
      db.harvest.count({
        where: {
          cropId,
          harvestDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
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
