import { getCountSoilType } from "@/services/soils";

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
    const searchParams = req.nextUrl.searchParams;
    const filterString = searchParams.get("filterString") || "";
    const begin = searchParams.get("begin")
      ? new Date(searchParams.get("begin") as string)
      : undefined;
    const end = searchParams.get("end")
      ? new Date(searchParams.get("end") as string)
      : undefined;
    const fieldId = params.fieldId;
    const result = await getCountSoilType({
      fieldId,
      begin,
      end,
      filterString,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
