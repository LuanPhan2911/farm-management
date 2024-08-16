import { siteConfig } from "@/configs/siteConfig";
import { Applicant } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export const sendApplicantApply = async (applicant: Applicant) => {
  const tMail = await getTranslations("applicants.mail.apply");
  const { data, error } = await resend.emails.send({
    from: `${siteConfig.name} <onboarding@resend.dev>`,
    to: [applicant.email],
    subject: tMail("subject"),
    html: tMail("html", {
      name: applicant.name,
    }),
  });
  if (error) {
    return null;
  }
  return data;
};
