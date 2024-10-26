import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CategoryEditButton } from "./category-edit-button";
import { CategoryDeleteButton } from "./category-delete-button";
import { MoreHorizontal } from "lucide-react";

import { useTranslations } from "next-intl";
import { CategoryTable } from "@/types";
interface CategoriesTableActionProps {
  data: CategoryTable;
}
export const CategoriesTableAction = ({ data }: CategoriesTableActionProps) => {
  const t = useTranslations("categories.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <CategoryEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CategoryDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
