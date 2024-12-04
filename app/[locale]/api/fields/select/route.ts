import { getFieldsSelect } from "@/services/fields";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");

    const isCreateCrop = searchParams.get("isCreateCrop") ? true : false;
    const data = await getFieldsSelect(orgId, isCreateCrop);
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
