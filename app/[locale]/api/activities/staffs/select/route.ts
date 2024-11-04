import { getActivityAssignedStaffs } from "@/services/activities";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const activityId = searchParams.get("activityId");
    if (!activityId) {
      return new NextResponse("No activity id", { status: 400 });
    }
    const result = await getActivityAssignedStaffs(activityId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
