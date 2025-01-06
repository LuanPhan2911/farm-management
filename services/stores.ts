import { db } from "@/lib/db";
import { cropSelect } from "./crops";
import { PaginatedResponse, Product, StoreWithCrop } from "@/types";
import { fieldLocation, fieldSelect } from "./fields";
import { plantSelect } from "./plants";
import { LIMIT } from "@/configs/paginationConfig";

type StoreParams = {
  cropId: string;
  imageUrl: string;
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  price: number;
  unitId: string;
  isPublic?: boolean;
  isFeature?: boolean;
};

export const upsertStore = async (params: StoreParams, id?: string) => {
  if (!id) {
    return await db.store.create({
      data: {
        ...params,
      },
    });
  }
  return await db.store.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
};

export const getStoreByCropId = async (
  cropId: string
): Promise<StoreWithCrop | null> => {
  try {
    return await db.store.findUnique({
      where: {
        cropId,
      },
      include: {
        crop: {
          select: {
            ...cropSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const getFeatureProduct = async (): Promise<StoreWithCrop[]> => {
  try {
    return await db.store.findMany({
      take: 5,
      where: {
        isFeature: true,
        isPublic: true,
      },
      include: {
        crop: {
          select: {
            ...cropSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    return await db.store.findUnique({
      where: {
        id,
        isPublic: true,
      },
      include: {
        crop: {
          select: {
            ...cropSelect,
            field: {
              select: {
                ...fieldLocation,
              },
            },
            plant: {
              select: {
                ...plantSelect,
              },
            },
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

type StoreQuery = {
  page?: number;
  query?: string;
};
export const getProducts = async ({
  page = 1,
  query,
}: StoreQuery): Promise<PaginatedResponse<StoreWithCrop>> => {
  try {
    const [data, count] = await db.$transaction([
      db.store.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          isPublic: true,
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          crop: {
            select: {
              ...cropSelect,
            },
          },
          unit: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.store.count({
        where: {
          isFeature: true,
          isPublic: true,
          name: {
            contains: query,
            mode: "insensitive",
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
