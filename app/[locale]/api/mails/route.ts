import { sendEmail } from "@/lib/mail";
import { SendEmailSchema } from "@/schemas";
import { getTranslations } from "next-intl/server";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization || authorization !== process.env.APP_API_KEY) {
      return NextResponse.json("Invalid App API key", { status: 401 });
    }
    const tSchema = await getTranslations("mails.schema");
    const data = (await req.json()) as Record<string, any>;
    const paramSchema = SendEmailSchema(tSchema);
    const validatedField = paramSchema.safeParse(data);
    if (!validatedField.success) {
      return NextResponse.json("Error parse", { status: 400 });
    }

    await sendEmail(validatedField.data);
    return NextResponse.json("Send email success");
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 500 });
  }
};
