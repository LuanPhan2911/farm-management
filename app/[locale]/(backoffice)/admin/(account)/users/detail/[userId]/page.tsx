import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { UserBasicInfo } from "../../_components/user-basic-info";

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
      <div className="max-w-5xl">
        <UserBasicInfo data={structuredClone(user)} />
      </div>
    </div>
  );
};

export default UserDetailPage;
