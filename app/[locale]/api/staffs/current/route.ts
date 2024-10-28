import { getCurrentStaff } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    return NextResponse.json(currentStaff);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
