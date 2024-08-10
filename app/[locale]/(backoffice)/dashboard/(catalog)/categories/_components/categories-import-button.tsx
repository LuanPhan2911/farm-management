import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const CategoriesImportButton = () => {
  return (
    <Button>
      <Upload className="h-6 w-6 mr-2" />
      Import
    </Button>
  );
};
