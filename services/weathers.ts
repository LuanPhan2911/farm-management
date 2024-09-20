import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  chunkArray,
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { PaginatedResponse, WeatherStatusCount, WeatherTable } from "@/types";
import { WeatherStatus } from "@prisma/client";
import {
  deleteManyFloatUnit,
  deleteManyIntUnit,
  UnitValue,
  upsertFloatUnit,
  upsertIntUnit,
} from "./units";

type WeatherParams = {
  fieldId: string;
  status: WeatherStatus;
  temperature?: Partial<UnitValue>;
  humidity?: Partial<UnitValue>;
  atmosphericPressure?: Partial<UnitValue>;
  rainfall?: Partial<UnitValue>;
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
export const confirmWeather = async (
  id: string,
  params: {
    confirmed: boolean;
    confirmedAt: Date;
    confirmedById: string;
  }
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
export const getWeatherById = async (id: string) => {
  try {
    return await db.weather.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
};

export const deleteWeather = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const weather = await ctx.weather.delete({
      where: {
        id,
        confirmed: false,
      },
    });
    const { atmosphericPressureId, temperatureId, humidityId, rainfallId } =
      weather;
    await deleteManyFloatUnit(ctx, [atmosphericPressureId, temperatureId]);
    await deleteManyIntUnit(ctx, [humidityId, rainfallId]);
    return weather;
  });
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
        orderBy: {
          ...(orderBy && getObjectSortOrder(orderBy)),
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

export const getWeatherUnitsForGenerateWeather = async () => {
  return await db.$transaction(async (ctx) => {
    const temperatureUnit = await ctx.unit.findFirst({
      where: {
        type: "TEMPERATURE",
      },
      select: {
        id: true,
      },
    });
    const humidityUnit = await ctx.unit.findFirst({
      where: {
        type: "PERCENT",
      },
      select: {
        id: true,
      },
    });
    const atmosphericPressureUnit = await ctx.unit.findFirst({
      where: {
        type: "ATMOSPHERICPRESSURE",
      },
      select: {
        id: true,
      },
    });
    const rainfallUnit = await ctx.unit.findFirst({
      where: {
        type: "RAINFALL",
      },
      select: {
        id: true,
      },
    });

    const weatherUnitIds = {
      temperatureUnitId: temperatureUnit?.id,
      humidityUnitId: humidityUnit?.id,
      atmosphericPressureUnitId: atmosphericPressureUnit?.id,
      rainfallUnitId: rainfallUnit?.id,
    };
    return weatherUnitIds;
  });
};
