import { getCountUnusedUnit } from "@/services/units";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getCountUnusedUnit();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
