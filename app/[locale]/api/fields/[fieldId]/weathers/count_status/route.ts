import { getCountWeatherStatus } from "@/services/weathers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
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
    const fieldId = params!.fieldId;
    const result = await getCountWeatherStatus({
      fieldId,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
