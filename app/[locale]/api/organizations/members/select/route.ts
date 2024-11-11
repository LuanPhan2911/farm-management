import { getOrganizationMemberSelect } from "@/services/organizations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    if (!orgId) {
      return new NextResponse("OrgId not found", { status: 400 });
    }
    const data = await getOrganizationMemberSelect(orgId);

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
