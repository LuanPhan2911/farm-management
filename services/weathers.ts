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
import {
  deleteManyFloatUnit,
  deleteManyIntUnit,
  UnitValue,
  upsertFloatUnit,
  upsertIntUnit,
} from "./units";
import { openai } from "@/lib/openai";

type WeatherParams = {
  fieldId: string;
  status: WeatherStatus;
  temperature?: Partial<UnitValue>;
  humidity?: Partial<UnitValue>;
  atmosphericPressure?: Partial<UnitValue>;
  rainfall?: Partial<UnitValue>;
  createdAt?: Date;
  note?: string;
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
          {
            ...(orderBy && getObjectSortOrder(orderBy)),
          },
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

export const getAnalyzeWeathers = async (weatherData: WeatherChart[]) => {
  // Check if input data length is less than or equal to 5
  if (weatherData.length <= 5) {
    return "No enough data to analysis";
  }

  // Generate a weather summary for OpenAI prompt
  const weatherSummary = weatherData
    .map((data) => {
      // const date = data.confirmedAt
      //   ? data.confirmedAt.toLocaleDateString()
      //   : data.createdAt.toLocaleDateString();
      const date = data.createdAt.toLocaleDateString();
      const temp = data.temperature
        ? `${data.temperature.value}°${data.temperature.unit.name}`
        : "unknown temperature";
      const humidity = data.humidity
        ? `${data.humidity.value}${data.humidity.unit.name}`
        : "unknown humidity";
      const pressure = data.atmosphericPressure
        ? `${data.atmosphericPressure.value}${data.atmosphericPressure.unit.name}`
        : "unknown pressure";
      const rainfall = data.rainfall
        ? `${data.rainfall.value}${data.rainfall.unit.name}`
        : "no rainfall";

      return `On ${date}, the weather status was "${data.status}", with ${temp}, ${humidity}, ${pressure}, and ${rainfall}.`;
    })
    .join(" ");

  // Build prompt for OpenAI
  const prompt = `
    Based on the following weather data: ${weatherSummary},
    provide a detailed analysis of weather trends and predictions.
  `;

  try {
    // OpenAI API call (v4.63.0 syntax)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a model of your choice
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      max_tokens: 200, // Adjust as needed
    });

    // Extract the AI's response
    const message = response.choices?.[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("No response from OpenAI");
    }

    return message;
  } catch (error) {
    console.error("Error generating weather analysis:", error);
    throw error;
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
