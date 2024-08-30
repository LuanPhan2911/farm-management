import { getStaffsForCreatedByOrganization } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const staffsForCreatedByOrg = await getStaffsForCreatedByOrganization();
    return NextResponse.json(staffsForCreatedByOrg);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
