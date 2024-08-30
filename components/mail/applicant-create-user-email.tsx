import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/configs/siteConfig";

interface ApplicantCreateUserEmailProps {
  senderName: string;
  receiveName: string;
  jobTitle: string;
  email: string;
  password: string;
}

const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";

export const ApplicantCreateUserEmail = ({
  jobTitle,
  receiveName,
  senderName,
  email,
  password,
}: ApplicantCreateUserEmailProps) => {
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
            Chúng tôi rất vui mừng thông báo rằng bạn đã được chọn cho vị trí{" "}
            <span style={{ fontWeight: 700 }}>{jobTitle}</span> tại{" "}
            {siteConfig.name}
          </Text>
          <Text style={paragraph}>
            Chúng tôi đánh giá cao kinh nghiệm và kỹ năng của bạn. Chúng tôi tin
            rằng bạn sẽ là một thành viên giá trị của đội ngũ chúng tôi.
          </Text>
          <Text style={paragraph}>
            Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp các thủ tục nhập việc.
          </Text>
          <Text style={paragraph}>
            Bạn có thể đăng nhập vào website của chúng tôi bằng địa chỉ email:
            <span style={{ fontWeight: 700 }}>{email}</span>. Mật khẩu đăng nhập
            là:
            <span style={{ fontWeight: 700 }}>{password}</span>
          </Text>
          <Text style={paragraph}>
            Sau khi đăng nhập thành công, vui lòng đổi mật khẩu để đảm bảo an
            toàn bảo mật.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={baseUrl}>
              Get started
            </Button>
          </Section>
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
