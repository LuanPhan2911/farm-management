import { getFieldById } from "@/services/fields";
import { notFound } from "next/navigation";
import { FieldInfo } from "../../../_components/field-info";

interface FieldDetailPageProps {
  params: {
    fieldId: string;
  };
}
const FieldDetailPage = async ({ params }: FieldDetailPageProps) => {
  const field = await getFieldById(params.fieldId);
  if (!field) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FieldInfo data={field} />
    </div>
  );
};

export default FieldDetailPage;
