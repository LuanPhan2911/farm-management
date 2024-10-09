import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { UserBasicInfo } from "../../_components/user-basic-info";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <div className="max-w-5xl">
            <UserBasicInfo data={structuredClone(user)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailPage;
