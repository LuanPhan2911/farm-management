import { UserAvatar } from "@/components/user-avatar";
import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { UserInfo } from "./_components/user-info";
import { UserBasicInfo } from "./_components/user-basic-info";

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}
const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const user = await getUserById(params.userId);
  if (!user) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="col-span-1">
          <UserInfo data={structuredClone(user)} />
        </div>
        <div className="lg:col-span-2">
          <UserBasicInfo data={structuredClone(user)} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
