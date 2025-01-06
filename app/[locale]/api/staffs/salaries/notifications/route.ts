import { sendNotificationSalaryForStaff } from "@/services/activity-assigned";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return new NextResponse("Invalid App API key", { status: 401 });
    }
    await sendNotificationSalaryForStaff();
    return NextResponse.json("Success");
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
