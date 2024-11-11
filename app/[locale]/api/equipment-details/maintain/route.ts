import { maintainEquipmentDetail } from "@/services/equipment-details";
import { getSoilsForExport } from "@/services/soils";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return new NextResponse("Invalid App API key", { status: 401 });
    }
    const equipmentDetail = await maintainEquipmentDetail();
    return NextResponse.json(
      `${equipmentDetail.length} equipment details updated to MAINTENANCE status.`
    );
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};

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
    const soils = await getSoilsForExport(params!.fieldId);
    return NextResponse.json(soils);
  } catch (error) {
    return NextResponse.json("Internal error", { status: 500 });
  }
};
