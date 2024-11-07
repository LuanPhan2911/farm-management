import { getActivitiesSelect } from "@/services/activities";
import { getCurrentStaff } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const result = await getActivitiesSelect({
      staffId: staff.id,
    });
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
