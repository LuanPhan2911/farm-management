import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  chunkArray,
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  PaginatedResponse,
  WeatherChart,
  WeatherStatusCount,
  WeatherTable,
} from "@/types";
import { WeatherStatus } from "@prisma/client";
import { UnitValue, upsertFloatUnit, upsertIntUnit } from "./units";

type WeatherParams = {
  fieldId: string;
  status: WeatherStatus;
  temperature?: Partial<UnitValue> | null;
  humidity?: Partial<UnitValue> | null;
  atmosphericPressure?: Partial<UnitValue> | null;
  rainfall?: Partial<UnitValue> | null;
  createdAt?: Date;
  note?: string | null;
};
export const createWeather = async (params: WeatherParams) => {
  return db.$transaction(async (ctx) => {
    const {
      atmosphericPressure: atmosphericPressureParam,
      humidity: humidityParam,
      temperature: temperatureParam,
      rainfall: rainfallParam,

      ...others
    } = params;
    //Create temperature
    const temperature = await upsertFloatUnit({
      ctx,
      data: temperatureParam,
    });
    // Create humidity
    const humidity = await upsertIntUnit({
      ctx,
      data: humidityParam,
    });
    //create atmosphericPressure
    const atmosphericPressure = await upsertFloatUnit({
      ctx,
      data: atmosphericPressureParam,
    });
    //create rainfall
    const rainfall = await upsertIntUnit({
      ctx,
      data: rainfallParam,
    });

    //create weather;

    const weather = await ctx.weather.create({
      data: {
        ...others,
        atmosphericPressureId: atmosphericPressure?.id,
        humidityId: humidity?.id,
        rainfallId: rainfall?.id,
        temperatureId: temperature?.id,
      },
    });
    return weather;
  });
};

export const createManyWeather = async (weatherDataArray: WeatherParams[]) => {
  return Promise.all(
    weatherDataArray.map(async (weatherData) => {
      const {
        atmosphericPressure: atmosphericPressureParam,
        humidity: humidityParam,
        temperature: temperatureParam,
        rainfall: rainfallParam,
        ...others
      } = weatherData;

      // Each weather record will be handled within a transaction

      try {
        // Each weather record will be handled within a transaction
        return db.$transaction(async (ctx) => {
          const temperature = await upsertFloatUnit({
            ctx,
            data: temperatureParam,
          });

          const humidity = await upsertIntUnit({
            ctx,
            data: humidityParam,
          });

          const atmosphericPressure = await upsertFloatUnit({
            ctx,
            data: atmosphericPressureParam,
          });

          const rainfall = await upsertIntUnit({
            ctx,
            data: rainfallParam,
          });

          const weather = await ctx.weather.create({
            data: {
              ...others,
              atmosphericPressureId: atmosphericPressure?.id,
              humidityId: humidity?.id,
              rainfallId: rainfall?.id,
              temperatureId: temperature?.id,
            },
          });

          return weather;
        });
      } catch (error) {
        console.error(`Error inserting weather data: ${error}`, weatherData);
        // Optionally handle the error, log it, or return null to continue
        return null; // Continue to the next record
      }
    })
  );
};
export const createManyWeatherInChunks = async (
  weatherDataArray: WeatherParams[],
  chunkSize = 10
) => {
  const chunks = chunkArray(weatherDataArray, chunkSize);

  for (const chunk of chunks) {
    await createManyWeather(chunk); // Use createManyWeather for each chunk
  }
};
type WeatherConfirm = {
  confirmed: boolean;
  confirmedAt: Date;
  confirmedById: string;
};
export const updateWeatherConfirmed = async (
  id: string,
  params: WeatherConfirm
) => {
  return await db.weather.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
};
export const updateWeatherPinned = async (id: string, pinned: boolean) => {
  return await db.weather.update({
    where: {
      id,
    },
    data: {
      pinned,
    },
  });
};
export const updateWeather = async (id: string, params: WeatherParams) => {
  return db.$transaction(async (ctx) => {
    //update weather;
    const {
      atmosphericPressure: atmosphericPressureParam,
      humidity: humidityParam,
      temperature: temperatureParam,
      rainfall: rainfallParam,
      ...others
    } = params;
    const weather = await ctx.weather.update({
      where: {
        id,
      },
      data: {
        ...others,
      },
    });
    const temperature = await upsertFloatUnit({
      ctx,
      data: temperatureParam,
      id: weather.temperatureId,
    });
    const atmosphericPressure = await upsertFloatUnit({
      ctx,
      data: atmosphericPressureParam,
      id: weather.atmosphericPressureId,
    });
    const humidity = await upsertIntUnit({
      ctx,
      data: humidityParam,
      id: weather.humidityId,
    });
    const rainfall = await upsertIntUnit({
      ctx,
      data: rainfallParam,
      id: weather.rainfallId,
    });

    return weather;
  });
};
export const updateManyWeatherConfirmed = async (params: WeatherConfirm) => {
  const weathers = await db.weather.updateMany({
    where: {
      confirmed: false,
    },
    data: {
      ...params,
    },
  });
  return weathers;
};

export const deleteWeather = async (id: string) => {
  const weather = await db.weather.delete({
    where: {
      id,
    },
  });
  return weather;
};
export const deleteManyWeatherUnConfirmed = async () => {
  const { count } = await db.weather.deleteMany({
    where: {
      confirmed: false,
    },
  });
  // TODO: after clear unit value no usage
  return count;
};

type WeatherQuery = {
  fieldId: string;
  page?: number;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
  begin?: Date;
  end?: Date;
};

export const getWeathersForChart = async ({
  fieldId,
  begin,
  end,
}: WeatherQuery): Promise<WeatherChart[]> => {
  try {
    if (!begin || !end) {
      return [];
    }
    return await db.weather.findMany({
      where: {
        fieldId,
        confirmed: true,
        createdAt: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
      },
      select: {
        id: true,
        confirmedAt: true,
        createdAt: true,
        status: true,
        temperature: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        humidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        atmosphericPressure: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },

        rainfall: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    return [];
  }
};
export const getWeatherById = async (id: string) => {
  try {
    return await db.weather.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
};
export const getWeathersOnField = async ({
  fieldId,
  page = 1,
  orderBy,
  filterString,
  filterNumber,
  begin,
  end,
}: WeatherQuery): Promise<PaginatedResponse<WeatherTable>> => {
  try {
    const [weathers, count] = await db.$transaction([
      db.weather.findMany({
        where: {
          fieldId,
          createdAt: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },

          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [
          {
            pinned: "desc",
          },
          {
            confirmed: "asc",
          },
          ...(orderBy ? getObjectSortOrder(orderBy) : []),
        ],
        include: {
          confirmedBy: true,
          atmosphericPressure: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },

          humidity: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
          rainfall: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
          temperature: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: LIMIT,
        skip: (page - 1) * LIMIT,
      }),
      db.weather.count({
        where: {
          fieldId,
          createdAt: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
    return {
      data: weathers,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getCountWeatherStatus = async ({
  fieldId,
}: WeatherQuery): Promise<WeatherStatusCount[]> => {
  try {
    const result = await db.weather.groupBy({
      by: "status",
      where: {
        fieldId,
      },
      _count: {
        _all: true,
      },
    });

    return result.map((item) => {
      return {
        status: item.status,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};

export const getWeathersForExport = async (fieldId: string) => {
  try {
    return await db.weather.findMany({
      where: {
        fieldId,
        confirmed: true,
      },
      include: {
        confirmedBy: true,
        atmosphericPressure: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },

        humidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        rainfall: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        temperature: {
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
    return [];
  }
};
