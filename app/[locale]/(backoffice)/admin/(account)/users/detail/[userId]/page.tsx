import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserEditForm } from "../../_components/user-edit-button";
import { UserInfo } from "../../_components/user-info";
import { Separator } from "@/components/ui/separator";

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("users.page.detail");
  return {
    title: t("title"),
  };
}

const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const user = await getUserById(params!.userId);
  const t = await getTranslations("users.page.detail");
  if (!user) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserInfo data={structuredClone(user)} />
          <Separator className="my-4" />
          <UserEditForm data={structuredClone(user)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailPage;
