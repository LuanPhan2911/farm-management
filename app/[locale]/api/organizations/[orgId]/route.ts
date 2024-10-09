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
      return NextResponse.json("Organization not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
