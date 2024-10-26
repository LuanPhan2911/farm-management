import { getMaterialsSelect } from "@/services/materials";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await getMaterialsSelect();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
