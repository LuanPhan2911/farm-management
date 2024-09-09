import { generateSoil } from "@/lib/faker";
import { SoilSchema } from "@/schemas";
import { getFieldIds } from "@/services/fields";
import { createManySoil, getSoilUnitForGenerateSoil } from "@/services/soils";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }

    const tSchema = await getTranslations("soils.schema");
    const paramsSchema = SoilSchema(tSchema);

    const { moistureUnitId, nutrientUnitId } =
      await getSoilUnitForGenerateSoil();
    if (!moistureUnitId || !nutrientUnitId) {
      return NextResponse.json("Missing soil unit", { status: 401 });
    }

    const fieldIds = await getFieldIds();
    const soils = fieldIds.map((fieldId) => {
      const soil = generateSoil({
        fieldId,
        moistureUnitId,
        nutrientUnitId,
      });
      const validatedFields = paramsSchema.safeParse(soil);
      if (validatedFields.success) {
        return soil;
      }
      return undefined;
    });

    const validatedSoils = soils.filter((item) => item != undefined);
    if (soils.length !== validatedSoils.length) {
      return NextResponse.json("Something went wrong to create soils");
    }
    await createManySoil(validatedSoils);
    return NextResponse.json(validatedSoils);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
