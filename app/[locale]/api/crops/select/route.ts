import { getCropsSelect } from "@/services/crops";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const result = await getCropsSelect(orgId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
