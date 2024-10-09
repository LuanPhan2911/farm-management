import { parseToDate } from "@/lib/utils";
import { getAnalyzeWeathers, getWeathersForChart } from "@/services/weathers";
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
    const weathers = await getWeathersForChart({
      fieldId,
      begin,
      end,
    });
    const result = await getAnalyzeWeathers([]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
