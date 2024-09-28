import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
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
      <Body style={main}>
        <Container style={container}>
          <Link
            href={baseUrl}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            <span>{siteConfig.name}</span>
          </Link>
          <Text style={paragraph}>Kính gửi {receiveName},</Text>
          <Text style={paragraph}>
            Chúng tôi xin xác nhận đã nhận được đơn xin việc của bạn cho vị trí{" "}
            <span style={{ fontWeight: 700 }}>{jobTitle}</span>. Cảm ơn bạn đã
            quan tâm đến công ty chúng tôi.
          </Text>
          <Text style={paragraph}>
            Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ lại với bạn sớm nhất
            có thể.
          </Text>
          <Text style={paragraph}>
            Trân trọng,
            <br />
            {senderName}
            <br />
            HR of {siteConfig.name}
          </Text>
          <Hr style={hr} />
          <Text style={footer}>{siteConfig.address}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  display: "block",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
