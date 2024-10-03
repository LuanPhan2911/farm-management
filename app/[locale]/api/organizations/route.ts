import { parseToNumber } from "@/lib/utils";
import { getOrganizations } from "@/services/organizations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseToNumber(searchParams.get("page") || undefined, 1);
    const query = searchParams!.get("query") || undefined;

    if (!page) {
      return NextResponse.json({
        data: [],
        totalPage: 0,
      });
    }
    const data = await getOrganizations({
      currentPage: page,
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
