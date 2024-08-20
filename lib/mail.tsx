import { siteConfig } from "@/configs/siteConfig";
import { Applicant } from "@prisma/client";
import { render } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { JobApplyEmail } from "@/components/mail/job-apply-email";
import nodemailer from "nodemailer";
import { currentUser } from "@clerk/nextjs/server";
import { JobApplySuccessEmail } from "@/components/mail/job-apply-success-email";
import { CreateUserEmail } from "@/components/mail/create-user-email";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GOOGLE_APP_ACCOUNT,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendApplicantApply = async (
  applicant: Applicant & {
    job: {
      name: string;
    };
  }
) => {
  const user = await currentUser();
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [applicant.email],
    subject: "Thông báo nhận được đơn xin việc của bạn",
    html: render(
      <JobApplyEmail
        jobTitle={applicant.job.name}
        receiveName={applicant.name}
        senderName={user?.fullName || "Quản lý nhân sự"}
      />
    ),
  });
};

export const sendApplicantCreateUser = async (
  applicant: Applicant & {
    job: {
      name: string;
    };
  },
  email: string,
  password: string
) => {
  const user = await currentUser();
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [applicant.email],
    subject: "Xin chúc mừng bạn đã trúng tuyển!",
    html: render(
      <CreateUserEmail
        jobTitle={applicant.job.name}
        email={email}
        password={password}
        receiveName={applicant.name}
        senderName={user?.fullName || "Quản lý nhân sự"}
      />
    ),
  });
};
