import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/configs/siteConfig";
import { format } from "date-fns";

interface ApplicantCreateUserEmailProps {
  senderName: string;
  receiveName: string;
  jobTitle: string;
  email: string;
  password: string;
  startToWorkDate: Date;
}

const baseUrl = process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}` : "";

export const StaffCreateFromApplicantEmail = ({
  jobTitle,
  receiveName,
  senderName,
  email,
  password,
  startToWorkDate,
}: ApplicantCreateUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans">
          <Container className="my-0 mx-auto">
            <Link
              href={baseUrl}
              className="text-2xl block text-center font-bold my-4 text-blue-600"
            >
              {siteConfig.name}
            </Link>
            <Text className="text-sm m-1">Kính gửi {receiveName},</Text>
            <Text className="text-sm m-1">
              Chúng tôi rất vui mừng thông báo rằng bạn đã được chọn cho vị trí{" "}
              <span className="font-semibold">{jobTitle}</span> tại{" "}
              {siteConfig.name}
            </Text>
            <Text className="text-sm my-0">
              Chúng tôi đánh giá cao kinh nghiệm và kỹ năng của bạn. Chúng tôi
              tin rằng bạn sẽ là một thành viên giá trị của đội ngũ chúng tôi.
            </Text>
            <Text className="text-sm my-0">
              Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp các thủ tục nhập việc.
            </Text>
            <Text className="text-sm my-0">
              Bạn có thể đăng nhập vào website của chúng tôi bằng địa chỉ email:
              <span className="font-semibold">{email}</span>. Mật khẩu đăng nhập
              là:
              <span className="font-semibold">{password}</span>
            </Text>
            <Text className="text-sm my-0">
              Sau khi đăng nhập thành công, vui lòng đổi mật khẩu để đảm bảo an
              toàn bảo mật.
            </Text>
            <Text className="text-sm m-1">
              Bạn sẽ bắt đầu làm việc vào ngày:
              <span className="font-semibold">
                {" "}
                {format(startToWorkDate, "dd/MM/yyyy")}
              </span>
            </Text>

            <Text className="text-sm m-1">
              Trân trọng,
              <br />
              {senderName}
              <br />
              HR of {siteConfig.name}
            </Text>
            <Hr />
            <Text className="text-xs text-muted-foreground">
              {siteConfig.address}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
