import { getStaffsSelect } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const adminOnly = searchParams.get("adminOnly") === JSON.stringify(true);
    const farmerOnly = searchParams.get("farmerOnly") === JSON.stringify(true);
    const orgId = searchParams.get("orgId");
    const staffs = await getStaffsSelect({
      adminOnly,
      farmerOnly,
      orgId,
    });
    return NextResponse.json(staffs);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
