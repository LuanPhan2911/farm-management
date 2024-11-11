import { isFarmer } from "@/lib/permission";
import { redirect } from "@/navigation";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";

interface RedirectEquipmentDetailPageProps {
  params: {
    equipmentId: string;
  };
}
const RedirectEquipmentDetailPage = async ({
  params,
}: RedirectEquipmentDetailPageProps) => {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const prefix = isFarmer(currentStaff.role) ? "/farmer" : "/admin";
  redirect(`${prefix}/equipments/detail/${params.equipmentId}/details`);
};

export default RedirectEquipmentDetailPage;
