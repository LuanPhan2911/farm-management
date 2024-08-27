import { getStaffsForAddMemberOrganization } from "@/services/staffs";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const staffsForAddMember = await getStaffsForAddMemberOrganization();
    return NextResponse.json(staffsForAddMember);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
