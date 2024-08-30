import { getFields } from "@/services/fields";
import { FieldsDataTable } from "./_components/fields-data-table";

const FieldPage = async () => {
  const fields = await getFields();
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FieldsDataTable data={fields} />
    </div>
  );
};

export default FieldPage;
