import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { StaffBasicInfo } from "../../_components/staff-basic-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { getStaffsSelect } from "@/services/staffs";

interface StaffDetailPageProps {
  params: {
    staffId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("staffs.page.detail");
  return {
    title: t("title"),
  };
}
export async function generateStaticParams() {
  const staffs = await getStaffsSelect();
  return staffs.map((item) => {
    return {
      staffId: item.externalId,
    };
  });
}
const StaffDetailPage = async ({ params }: StaffDetailPageProps) => {
  const staff = await getUserById(params!.staffId);
  const t = await getTranslations("staffs.page.detail");
  if (!staff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-6xl">
            <StaffBasicInfo data={structuredClone(staff)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDetailPage;
