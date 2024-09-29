import {
  deleteUnusedFloatUnits,
  deleteUnusedIntegerUnits,
} from "@/services/units";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      fieldId: string;
    };
  }
) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }
    await deleteUnusedFloatUnits();
    await deleteUnusedIntegerUnits();
    return NextResponse.json("Unused unit deleted");
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
