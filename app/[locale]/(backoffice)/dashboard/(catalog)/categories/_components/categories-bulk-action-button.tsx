import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";

export const CategoriesBulkActionButton = () => {
  return (
    <Button>
      <Workflow className="h-6 w-6 mr-2" />
      Bulk Action
    </Button>
  );
};
