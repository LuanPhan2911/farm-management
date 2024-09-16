import { getCountFertilizerFrequencyOfUse } from "@/services/fertilizers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filterString = searchParams.get("filterString") || "";

    const result = await getCountFertilizerFrequencyOfUse({
      filterString,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
