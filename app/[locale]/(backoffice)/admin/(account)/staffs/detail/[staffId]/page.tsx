import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { getStaffsSelect } from "@/services/staffs";
import { UserEditForm } from "../../../users/_components/user-edit-button";
import { UserInfo } from "../../../users/_components/user-info";
import { Separator } from "@/components/ui/separator";
import { StaffsTableAction } from "../../_components/staffs-table-action";

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
          <div className="flex justify-end">
            <StaffsTableAction data={structuredClone(staff)} />
          </div>
          <UserInfo data={structuredClone(staff)} />
          <Separator className="my-4" />
          <UserEditForm data={structuredClone(staff)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDetailPage;
