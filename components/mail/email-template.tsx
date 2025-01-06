import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Tailwind,
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
      <Tailwind>
        <Container className="my-0 mx-auto">
          <Text className="text-muted-foreground text-sm m-1">Receivers:</Text>
          <Text className="line-clamp-2 m-0">{receivers.join("; ")}</Text>
          <Link
            href={baseUrl}
            className="text-2xl block text-center font-bold my-4 text-blue-600"
          >
            {siteConfig.name}
          </Link>
          <Heading className="flex items-center gap-x-2">
            <Text className="text-sm m-1 text-muted-foreground"> Subject:</Text>
            <Text className="text-lg font-semibold line-clamp-1 m-0">
              {subject}
            </Text>
          </Heading>

          <Text className="text-muted-foreground text-sm m-1">Contents:</Text>
          {contents.map((content) => {
            return (
              <Text className="text-sm m-1" key={content}>
                {content}
              </Text>
            );
          })}
          <Heading className="flex items-center gap-x-2">
            <Text className="text-sm m-1 text-muted-foreground"> Sender:</Text>
            <Text className="text-sm m-1 font-semibold line-clamp-1">
              {sender}
            </Text>
          </Heading>
          <Hr className="my-3" />
          <Text className="text-muted-foreground text-xs">
            {siteConfig.address}
          </Text>
        </Container>
      </Tailwind>
    );
  }
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
            <Heading className="flex items-center gap-x-2">
              <Text className="text-lg font-semibold line-clamp-1 m-0">
                {subject}
              </Text>
            </Heading>
            {contents.map((content) => {
              return (
                <Text className="text-sm m-1" key={content}>
                  {content}
                </Text>
              );
            })}
            <Heading className="flex items-center gap-x-2">
              <Text className="text-sm font-semibold line-clamp-1 m-0">
                {sender}
              </Text>
            </Heading>
            <Hr className="my-3" />
            <Text className="text-muted-foreground text-xs">
              {siteConfig.address}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
