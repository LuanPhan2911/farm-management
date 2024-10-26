import { getFertilizersSelect } from "@/services/fertilizers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getFertilizersSelect();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
