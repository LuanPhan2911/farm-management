import { SoilSchema } from "@/schemas";
import { createManySoilInChunk, getSoilsForExport } from "@/services/soils";

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
    const tSchema = await getTranslations("soils.schema");
    const paramsSchema = SoilSchema(tSchema);

    const data = (await req.json()) as any[];
    const soils = data.map((item) => {
      const validatedField = paramsSchema.safeParse(item);

      if (validatedField.success) {
        return validatedField.data;
      } else {
        return undefined;
      }
    });

    const validatedSoils = soils.filter((item) => item !== undefined);
    if (!validatedSoils.length || validatedSoils.length !== soils.length) {
      return NextResponse.json("Something went wrong to create soils", {
        status: 401,
      });
    }
    createManySoilInChunk(validatedSoils);
    return NextResponse.json(validatedSoils);
  } catch (error) {
    console.log(error);

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
    const soils = await getSoilsForExport(params.fieldId);
    return NextResponse.json(soils);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
