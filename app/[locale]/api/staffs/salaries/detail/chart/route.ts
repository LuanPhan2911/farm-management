import { getStaffSalaryChartByStaffId } from "@/services/activity-assigned";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const staffId = searchParams.get("staffId");
    if (!staffId) {
      return new NextResponse("Staff id not found", { status: 400 });
    }
    const result = await getStaffSalaryChartByStaffId(staffId);
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
