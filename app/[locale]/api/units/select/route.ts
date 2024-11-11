import { getUnitsByType } from "@/services/units";
import { UnitType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;
    const type = params!.get("type") as UnitType;
    const data = await getUnitsByType(type);
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
