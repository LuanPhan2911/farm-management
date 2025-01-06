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

interface StaffSalaryEmailProps {
  senderName: string;
  receiveName: string;
  begin: Date;
  end: Date;
  salary: number;
}

const baseUrl = process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}` : "";

export const StaffSalaryEmail = ({
  receiveName,
  senderName,
  begin,
  end,
  salary,
}: StaffSalaryEmailProps) => {
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
              Chúng tôi xin thông báo lương tháng{" "}
              {format(new Date(), "MM/yyyy")} của bạn đã được tính toán như sau:
            </Text>

            <Text className="text-sm m-1">
              <span className="font-semibold">Thời gian làm việc: </span>
              Từ ngày {format(begin, "dd/MM/yyyy")} đến ngày{" "}
              {format(end, "dd/MM/yyyy")}
            </Text>
            <Text className="text-sm m-1">
              <span className="font-semibold">Số tiền lương sẽ nhận: </span>
              {salary} VND
            </Text>
            <Text className="text-sm m-1">
              Nếu bạn cần kiểm tra thêm chi tiết về các khoản lương và ngày làm
              việc, vui lòng truy cập vào trang web quản lý nhân sự tại:{" "}
              <Link href={baseUrl}>Website</Link>.
            </Text>
            <Text className="text-sm  m-1">
              Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận nhân sự qua
              email hoặc số điện thoại để được hỗ trợ.
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
