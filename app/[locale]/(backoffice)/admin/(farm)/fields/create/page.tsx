import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldCreateForm } from "../_components/field-create-button";

const FieldCreatePage = () => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Create field</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldCreatePage;
