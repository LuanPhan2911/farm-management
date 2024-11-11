import { getCountPesticideType } from "@/services/pesticides";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getCountPesticideType({});
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
