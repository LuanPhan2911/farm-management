import { getCategoriesByType } from "@/services/categories";
import { CategoryType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;
    const type = params!.get("type") as CategoryType;
    const data = await getCategoriesByType(type);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
