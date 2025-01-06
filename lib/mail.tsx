import { siteConfig } from "@/configs/siteConfig";
import { render } from "@react-email/components";

import { JobApplyEmail } from "@/components/mail/job-apply-email";
import nodemailer from "nodemailer";
import { StaffCreateFromApplicantEmail } from "@/components/mail/staff-create-from-applicant-email";
import { StaffCreateEmail } from "@/components/mail/staff-create-email";
import { EmailTemplate } from "@/components/mail/email-template";
import { EmailBody } from "@/types";
import { StaffSalaryEmail } from "@/components/mail/staff-salary-email";
import { ActivityAssignEmail } from "@/components/mail/activity-assign-email";

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
      <StaffCreateFromApplicantEmail
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
      <StaffCreateEmail
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

type SalaryMail = {
  email: string;
  salary: number;
  receiverName: string;
};
export const sendSalaryMail = async ({
  staff,
  begin,
  end,
  subject,
}: {
  staff: SalaryMail[];
  subject: string;
  begin: Date;
  end: Date;
}) => {
  await Promise.all(
    staff.map((item) => {
      return transporter.sendMail({
        from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
        to: item.email,
        subject,
        html: render(
          <StaffSalaryEmail
            begin={begin}
            end={end}
            receiveName={item.receiverName}
            salary={item.salary}
            senderName={"Quản lý nhân sự"}
          />
        ),
      });
    })
  );
};
type ActivityAssignEmail = {
  email: string;
  receiverName: string;
  activityName: string;
  activityDate: Date;
  activityDuration: number;
  fieldName: string;
  fieldLocation: string;
};
export const sendActivityAssignEmail = async ({
  staff,
  subject,
}: {
  staff: ActivityAssignEmail[];
  subject: string;
}) => {
  await Promise.all(
    staff.map((item) => {
      return transporter.sendMail({
        from: `${siteConfig.name} <${process.env.GOOGLE_APP_ACCOUNT}>`,
        to: item.email,
        subject,
        html: render(
          <ActivityAssignEmail
            receiveName={item.receiverName}
            activityDate={item.activityDate}
            activityDuration={item.activityDuration}
            activityName={item.activityName}
            senderName={"Thông báo hoạt động"}
            fieldLocation={item.fieldLocation}
            fieldName={item.fieldName}
          />
        ),
      });
    })
  );
};
