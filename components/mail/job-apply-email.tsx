import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/configs/siteConfig";

interface JobApplyEmailProps {
  senderName: string;
  receiveName: string;
  jobTitle: string;
}

const baseUrl = process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}` : "";

export const JobApplyEmail = ({
  jobTitle,
  receiveName,
  senderName,
}: JobApplyEmailProps) => {
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
            <Text className="text-md m-1">Kính gửi {receiveName},</Text>
            <Text className="text-md m-1">
              Chúng tôi xin xác nhận đã nhận được đơn xin việc của bạn cho vị
              trí <span className="font-semibold">{jobTitle}</span>. Cảm ơn bạn
              đã quan tâm đến công ty chúng tôi.
            </Text>
            <Text className="text-md m-1">
              Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ lại với bạn sớm nhất
              có thể.
            </Text>
            <Text className="text-md m-1">
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
