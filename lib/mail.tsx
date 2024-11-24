import { siteConfig } from "@/configs/siteConfig";
import { Applicant } from "@prisma/client";
import { render } from "@react-email/components";

import { JobApplyEmail } from "@/components/mail/job-apply-email";
import nodemailer from "nodemailer";
import { ApplicantCreateUserEmail } from "@/components/mail/applicant-create-user-email";
import { StaffCreateUserEmail } from "@/components/mail/staff-create-user-email";
import { EmailTemplate } from "@/components/mail/email-template";
import { EmailBody } from "@/types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GOOGLE_APP_ACCOUNT,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

type ApplicantApply = {
  jobName: string;
  name: string;
};
export const sendApplicantApply = async (
  receiverEmail: string,
  { jobName, name }: ApplicantApply
) => {
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [receiverEmail],
    subject: "Thông báo nhận được đơn xin việc của bạn",
    html: render(
      <JobApplyEmail
        jobTitle={jobName}
        receiveName={name}
        senderName={"Quản lý nhân sự"}
      />
    ),
  });
};

type ApplicantCreateUser = {
  jobName: string;
  name: string;
  email: string;
  password: string;
  startToWorkDate: Date;
};
export const sendApplicantCreateUser = async (
  receiverEmail: string,
  { email, jobName, password, name, startToWorkDate }: ApplicantCreateUser
) => {
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [receiverEmail],
    subject: "Xin chúc mừng bạn đã trúng tuyển!",
    html: render(
      <ApplicantCreateUserEmail
        jobTitle={jobName}
        email={email}
        password={password}
        receiveName={name}
        startToWorkDate={startToWorkDate}
        senderName={"Quản lý nhân sự"}
      />
    ),
  });
};

type StaffCreateUserEmail = {
  name: string;
  email: string;
  password: string;
  startToWorkDate: Date;
};
export const sendStaffCreateUser = async (
  receiverEmail: string,
  { email, password, name, startToWorkDate }: StaffCreateUserEmail
) => {
  await transporter.sendMail({
    from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
    to: [receiverEmail],
    subject: "Xin chúc mừng bạn đã trúng tuyển!",
    html: render(
      <StaffCreateUserEmail
        receiveName={name}
        senderName={"Quản lý nhân sự"}
        email={email}
        password={password}
        startToWorkDate={startToWorkDate}
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
