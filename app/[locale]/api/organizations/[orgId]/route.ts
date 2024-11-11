import { getOrganizationById } from "@/services/organizations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  params: {
    orgId: string;
  }
) => {
  try {
    const orgId = params!.orgId;

    const data = await getOrganizationById(orgId);
    if (!data) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
