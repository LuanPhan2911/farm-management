import { getEquipmentDetailsSelect } from "@/services/equipment-details";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || undefined;
    const result = await getEquipmentDetailsSelect(id);
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
