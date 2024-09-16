import { getCountPesticideType } from "@/services/pesticides";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filterString = searchParams.get("filterString") || "";

    const result = await getCountPesticideType({
      filterString,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
