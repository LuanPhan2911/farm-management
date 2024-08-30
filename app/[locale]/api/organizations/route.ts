import { getOrganizations } from "@/services/organizations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : null;
    const query = searchParams.get("query") || "";

    if (!page) {
      return NextResponse.json({
        data: [],
        totalPage: 0,
      });
    }
    const data = await getOrganizations(query, page);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
