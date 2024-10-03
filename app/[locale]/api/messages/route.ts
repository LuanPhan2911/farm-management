import { getMessagesByOrg } from "@/services/messages";
import { currentStaff } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const staff = await currentStaff();
    if (!staff) {
      return NextResponse.json("Unauthorize", { status: 400 });
    }
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const cursor = searchParams.get("cursor");
    if (!orgId) {
      return NextResponse.json("OrgId missing", { status: 400 });
    }
    const result = await getMessagesByOrg({ orgId, cursor });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
