import { getEquipmentDetailsSelectForActivity } from "@/services/equipment-details";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getEquipmentDetailsSelectForActivity();
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
