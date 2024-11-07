import { parseToDate } from "@/lib/utils";
import { getCountActivityPriority } from "@/services/activities";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const begin = parseToDate(searchParams!.get("begin"));
    const end = parseToDate(searchParams!.get("end"));

    const result = await getCountActivityPriority({
      begin,
      end,
    });
    return NextResponse.json(result);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
