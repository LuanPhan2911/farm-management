import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const CategoriesExportButton = () => {
  return (
    <Button>
      <Download className="h-6 w-6 mr-2" />
      Export
    </Button>
  );
};
