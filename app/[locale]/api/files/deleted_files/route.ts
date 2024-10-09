import { deleteManyFileDeleted } from "@/services/files";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }
    const fileKeys = await deleteManyFileDeleted();
    return NextResponse.json(fileKeys);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
