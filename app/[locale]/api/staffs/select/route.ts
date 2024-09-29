import { getStaffsSelect } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const staffsForAddMember = await getStaffsSelect();
    return NextResponse.json(staffsForAddMember);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
