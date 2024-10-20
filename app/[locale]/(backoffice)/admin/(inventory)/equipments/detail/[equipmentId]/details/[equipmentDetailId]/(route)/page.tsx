import { redirect } from "@/navigation";

interface RedirectEquipmentDetailPageProps {
  params: {
    equipmentId: string;
  };
}
const RedirectEquipmentDetailPage = ({
  params,
}: RedirectEquipmentDetailPageProps) => {
  redirect(`/admin/equipments/detail/${params.equipmentId}/details`);
};

export default RedirectEquipmentDetailPage;
