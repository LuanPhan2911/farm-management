import { WeatherSchema } from "@/schemas";

import {
  createManyWeatherInChunks,
  getWeathersForExport,
} from "@/services/weathers";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      fieldId: string;
    };
  }
) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }
    const tSchema = await getTranslations("weathers.schema");
    const paramsSchema = WeatherSchema(tSchema);

    const data = (await req.json()) as any[];
    const weathers = data.map((item) => {
      const validatedField = paramsSchema.safeParse(item);

      if (validatedField.success) {
        return validatedField.data;
      } else {
        return undefined;
      }
    });

    const validatedWeathers = weathers.filter((item) => item !== undefined);
    if (
      !validatedWeathers.length ||
      validatedWeathers.length !== weathers.length
    ) {
      return NextResponse.json("Something went wrong to create weathers", {
        status: 401,
      });
    }
    createManyWeatherInChunks(validatedWeathers);
    return NextResponse.json(validatedWeathers);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      fieldId: string;
    };
  }
) => {
  try {
    const weathers = await getWeathersForExport(params.fieldId);
    return NextResponse.json(weathers);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
