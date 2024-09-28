import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/configs/siteConfig";
import { EmailBody } from "@/types";

interface EmailTemplateProps extends EmailBody {
  isPreview?: boolean;
}

const baseUrl = process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}` : "";

export const EmailTemplate = ({
  contents,
  sender,
  receivers,
  subject,
  isPreview = false,
}: EmailTemplateProps) => {
  if (isPreview) {
    return (
      <Container style={container}>
        <Text
          style={{
            ...paragraph,
            wordBreak: "break-word",
          }}
        >
          Receivers:
          {receivers.join("; ")}
        </Text>
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
        Subject:
        <Heading
          style={{
            ...h1,
            wordBreak: "break-word",
          }}
        >
          {subject}
        </Heading>
        Contents:
        {contents.map((content) => {
          return (
            <Text
              style={{
                ...paragraph,
                wordBreak: "break-word",
              }}
              key={content}
            >
              {content}
            </Text>
          );
        })}{" "}
        <Text style={{ ...paragraph, wordBreak: "break-word" }}>
          {" "}
          Sender:{sender}
        </Text>
        <Hr style={hr} />
        <Text style={footer}>{siteConfig.address}</Text>
      </Container>
    );
  }
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
          <Heading style={h1}>{subject}</Heading>
          {contents.map((content) => {
            return (
              <Text style={paragraph} key={content}>
                {content}
              </Text>
            );
          })}

          <Text style={paragraph}>{sender}</Text>
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
const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
