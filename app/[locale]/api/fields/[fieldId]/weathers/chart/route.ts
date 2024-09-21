import { parseToDate } from "@/lib/utils";
import { getWeathersForChart } from "@/services/weathers";
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
    const fieldId = params.fieldId;
    const searchParams = req.nextUrl.searchParams;
    const begin = parseToDate(searchParams.get("begin"));
    const end = parseToDate(searchParams.get("end"));
    const result = await getWeathersForChart({
      fieldId,
      begin,
      end,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
