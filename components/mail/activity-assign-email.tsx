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
import { format } from "date-fns";

interface ActivityAssignEmailProps {
  senderName: string;
  receiveName: string;

  activityName: string;
  activityDate: Date;
  activityDuration: number;
  fieldName: string;
  fieldLocation: string;
}

const baseUrl = process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}` : "";

export const ActivityAssignEmail = ({
  receiveName,
  senderName,
  activityDate,
  activityDuration,
  activityName,
  fieldName,
  fieldLocation,
}: ActivityAssignEmailProps) => {
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
              <span>{siteConfig.name}</span>
            </Link>
            <Text className="text-sm m-1">Kính gửi {receiveName},</Text>
            <Text className="text-sm m-1">
              Thông báo phân công công việc vào ngày{" "}
              {format(activityDate, "dd/MM/yyyy")}
            </Text>

            <Text className="text-sm m-1">
              <span className="font-semibold">Tên hoạt động: </span>
              {activityName}
            </Text>

            <Text className="text-sm m-1">
              <span className="font-semibold">Thời gian làm việc: </span>
              {activityDuration} giờ.
            </Text>
            <Text className="text-sm m-1">
              <span className="font-semibold">Làm việc ở đất canh tác: </span>
              {fieldName}
            </Text>
            <Text className="text-sm m-1">
              <span className="font-semibold">Vị trí đất canh tác: </span>
              {fieldLocation}
            </Text>

            <Text className="text-sm m-1">
              Vui lòng đăng nhập vào website để kiểm tra thông tin chi tiết tại{" "}
              <Link href={baseUrl}>Website</Link>.
            </Text>
            <Text className="text-sm m-1">
              Trân trọng,
              <br />
              {senderName}
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
