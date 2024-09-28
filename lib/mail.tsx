import { siteConfig } from "@/configs/siteConfig";
import { Applicant } from "@prisma/client";
import { render } from "@react-email/components";

import { JobApplyEmail } from "@/components/mail/job-apply-email";
import nodemailer from "nodemailer";
import { currentUser } from "@clerk/nextjs/server";
import { ApplicantCreateUserEmail } from "@/components/mail/applicant-create-user-email";
import { StaffCreateUserEmail } from "@/components/mail/staff-create-user-email";
import { EmailTemplate } from "@/components/mail/email-template";
import { getFullName } from "./utils";
import { EmailBody } from "@/types";

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
      <ApplicantCreateUserEmail
        jobTitle={applicant.job.name}
        email={email}
        password={password}
        receiveName={applicant.name}
        senderName={user?.fullName || "Quản lý nhân sự"}
      />
    ),
  });
};
export const sendStaffCreateUser = async (
  receiverEmail: string,
  {
    email,
    password,
    name,
  }: {
    name: string;
    email: string;
    password: string;
  }
) => {
  const user = await currentUser();
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [receiverEmail],
    subject: "Xin chúc mừng bạn đã trúng tuyển!",
    html: render(
      <StaffCreateUserEmail
        title="Email"
        email={email}
        password={password}
        receiveName={name}
        senderName={user?.fullName || "Quản lý nhân sự"}
      />
    ),
  });
};

export const sendEmail = async (emailBody: EmailBody) => {
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: emailBody.receivers,
    subject: emailBody.subject,
    html: render(<EmailTemplate {...emailBody} />),
  });
};
