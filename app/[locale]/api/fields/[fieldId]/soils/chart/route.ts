import { parseToDate } from "@/lib/utils";
import { getSoilsForChart } from "@/services/soils";

import { NextRequest, NextResponse } from "next/server";

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
    const fieldId = params!.fieldId;
    const searchParams = req.nextUrl.searchParams;
    const begin = parseToDate(searchParams!.get("begin"));
    const end = parseToDate(searchParams!.get("end"));
    const soils = await getSoilsForChart({
      fieldId,
      begin,
      end,
    });

    return NextResponse.json(soils);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
