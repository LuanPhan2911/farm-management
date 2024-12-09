import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { PaginatedResponse, SaleTableWithCost } from "@/types";

type SaleParams = {
  saleDate: Date;

  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string;

  value: number;
  price: number;
  unitId: string;
  createdById: string;
  cropId: string;
};
export const createSale = async (params: SaleParams) => {
  const crop = await db.crop.findUnique({
    where: {
      id: params.cropId,
    },
  });
  if (!crop) {
    throw new Error("Crop not found");
  }
  if (crop.remainYield < params.value) {
    throw new Error("Crop remain yield is not enough");
  }

  return await db.$transaction([
    db.sale.create({
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
          decrement: params.value,
        },
      },
    }),
  ]);
};

export const deleteSale = async (id: string) => {
  const sale = await db.sale.findUnique({
    where: {
      id,
    },
  });
  if (!sale) {
    throw new Error("Sale not found");
  }

  return await db.$transaction([
    db.sale.delete({
      where: {
        id,
      },
    }),
    db.crop.update({
      where: {
        id: sale.cropId,
      },
      data: {
        remainYield: {
          increment: sale.value,
        },
      },
    }),
  ]);
};

type SaleQuery = {
  cropId: string;
  page?: number;
  begin?: Date;
  end?: Date;
  query?: string;
};
export const getSales = async ({
  cropId,
  begin,
  end,
  page = 1,
  query,
}: SaleQuery): Promise<PaginatedResponse<SaleTableWithCost>> => {
  try {
    const [data, count] = await db.$transaction([
      db.sale.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          cropId,
          saleDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          ...(query && {
            OR: [
              {
                customerName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                customerPhone: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }),
        },
        include: {
          createdBy: true,
          unit: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.sale.count({
        where: {
          cropId,
          saleDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          OR: [
            {
              customerName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              customerPhone: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
    const dataWithCost = data.map((item) => {
      return {
        ...item,
        actualCost: item.value * item.price,
      };
    });
    return {
      data: dataWithCost,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};
