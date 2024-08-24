import { getUserById } from "@/services/users";
import { notFound } from "next/navigation";
import { StaffBasicInfo } from "../../_components/staff-basic-info";

interface StaffDetailPageProps {
  params: {
    staffId: string;
  };
}

const StaffDetailPage = async ({ params }: StaffDetailPageProps) => {
  const staff = await getUserById(params.staffId);
  if (!staff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <div className="max-w-6xl">
        <StaffBasicInfo data={structuredClone(staff)} />
      </div>
    </div>
  );
};

export default StaffDetailPage;
