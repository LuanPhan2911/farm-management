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
import { Category } from "@prisma/client";
import { useTranslations } from "next-intl";
interface CategoriesTableActionProps {
  data: Category;
}
export const CategoriesTableAction = ({ data }: CategoriesTableActionProps) => {
  const t = useTranslations("categories.table.action");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CategoryEditButton data={data} label={t("edit")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CategoryDeleteButton data={data} label={t("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
