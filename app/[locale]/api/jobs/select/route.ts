import { getJobsSelection } from "@/services/jobs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const data = await getJobsSelection();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
