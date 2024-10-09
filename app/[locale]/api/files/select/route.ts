import { parseToNumber } from "@/lib/utils";
import { getFilesByOwnerIdSelect } from "@/services/files";
import { getCurrentStaff } from "@/services/staffs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return NextResponse.json("Unauthenticated", { status: 400 });
    }
    const data = await getFilesByOwnerIdSelect({
      ownerId: currentStaff.id,
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
