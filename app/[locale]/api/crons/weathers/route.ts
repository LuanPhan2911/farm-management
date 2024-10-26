import { generateWeather } from "@/lib/faker";
import { WeatherSchema } from "@/schemas";
import { getFieldsSelect } from "@/services/fields";
import {
  createManyWeather,
  getWeatherUnitsForGenerateWeather,
} from "@/services/weathers";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }
    const tSchema = await getTranslations("weathers.schema");
    const paramsSchema = WeatherSchema(tSchema);

    const {
      atmosphericPressureUnitId,
      humidityUnitId,
      rainfallUnitId,
      temperatureUnitId,
    } = await getWeatherUnitsForGenerateWeather();

    if (
      !atmosphericPressureUnitId ||
      !humidityUnitId ||
      !rainfallUnitId ||
      !temperatureUnitId
    ) {
      return NextResponse.json("Missing weather unit", { status: 401 });
    }

    const fieldIds = await getFieldsSelect();
    const weathers = fieldIds.map(({ id }) => {
      const weather = generateWeather({
        fieldId: id,
        atmosphericPressureUnitId,
        humidityUnitId,
        rainfallUnitId,
        temperatureUnitId,
      });
      const validatedFields = paramsSchema.safeParse(weather);
      if (validatedFields.success) {
        return weather;
      }
      return undefined;
    });
    const validatedWeathers = weathers.filter((item) => item !== undefined);
    if (validatedWeathers.length !== weathers.length) {
      return NextResponse.json("Something went wrong to create weathers", {
        status: 401,
      });
    }
    await createManyWeather(validatedWeathers);

    return NextResponse.json(validatedWeathers);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
