import { getCropsSelect } from "@/services/crops";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getCropsSelect();
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
