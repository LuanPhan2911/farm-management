import { getMessagesByOrg } from "@/services/messages";
import { getCurrentStaff } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return NextResponse.json("Unauthorized", { status: 400 });
    }
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const cursor = searchParams.get("cursor");
    const result = await getMessagesByOrg({ orgId, cursor });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
