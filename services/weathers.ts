import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { PaginatedResponse, WeatherStatusCount, WeatherTable } from "@/types";
import { UnitType, WeatherStatus } from "@prisma/client";
import { getUnitsSelect } from "./units";

type WeatherParams = {
  temperature: {
    value: number;
    unitId: string;
  };
  humidity: {
    value: number;
    unitId: string;
  };
  atmosphericPressure: {
    value: number;
    unitId: string;
  };
  rainfall: {
    value: number;
    unitId: string;
  };
  fieldId: string;
  status: WeatherStatus;
};
export const createWeather = async (params: WeatherParams) => {
  return db.$transaction(async (ctx) => {
    //Create temperature
    const temperature = await ctx.floatUnit.create({
      data: {
        ...params.temperature,
      },
    });
    // Create humidity
    const humidity = await ctx.intUnit.create({
      data: {
        ...params.humidity,
      },
    });
    //create atmosphericPressure
    const atmosphericPressure = await ctx.floatUnit.create({
      data: {
        ...params.atmosphericPressure,
      },
    });
    //create rainfall
    const rainfall = await ctx.intUnit.create({
      data: {
        ...params.rainfall,
      },
    });

    //create weather;
    const { status, fieldId } = params;
    const weather = await ctx.weather.create({
      data: {
        status,
        fieldId,
        atmosphericPressureId: atmosphericPressure.id,
        humidityId: humidity.id,
        rainfallId: rainfall.id,
        temperatureId: temperature.id,
      },
    });
    return weather;
  });
};
export const createManyWeather = async (params: WeatherParams[]) => {
  const weathers = params.map((param) => createWeather(param));
  return await Promise.all(weathers);
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
    await ctx.floatUnit.deleteMany({
      where: {
        id: {
          in: [weather.temperatureId, weather.atmosphericPressureId],
        },
      },
    });
    await ctx.intUnit.deleteMany({
      where: {
        id: {
          in: [weather.humidityId, weather.rainfallId],
        },
      },
    });
    return weather;
  });
};
export const updateWeather = async (id: string, params: WeatherParams) => {
  return db.$transaction(async (ctx) => {
    //update weather;
    const { status, fieldId } = params;
    const weather = await ctx.weather.update({
      where: {
        id,
      },
      data: {
        status,
        fieldId,
      },
    });
    //Create temperature
    const temperature = await ctx.floatUnit.update({
      where: {
        id: weather.temperatureId,
      },
      data: {
        ...params.temperature,
      },
    });
    // Create humidity
    const humidity = await ctx.intUnit.update({
      where: {
        id: weather.humidityId,
      },
      data: {
        ...params.humidity,
      },
    });
    //create atmosphericPressure
    const atmosphericPressure = await ctx.floatUnit.update({
      where: {
        id: weather.atmosphericPressureId,
      },
      data: {
        ...params.atmosphericPressure,
      },
    });
    //create rainfall
    const rainfall = await ctx.intUnit.update({
      where: {
        id: weather.rainfallId,
      },
      data: {
        ...params.rainfall,
      },
    });

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
    const weathers = await db.weather.findMany({
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
    });
    const totalPage = Math.ceil(weathers.length / LIMIT);
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
  begin,
  end,
  filterString,
}: WeatherQuery): Promise<WeatherStatusCount[]> => {
  try {
    const result = await db.weather.groupBy({
      by: "status",
      where: {
        fieldId,
        createdAt: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
        ...(filterString && getObjectFilterString(filterString)),
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
