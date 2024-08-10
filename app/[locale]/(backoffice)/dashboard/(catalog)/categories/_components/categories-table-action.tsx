import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditCategoryButton } from "./edit-category-button";
import { DeleteCategoryButton } from "./detele-category-button";
import { MoreHorizontal } from "lucide-react";
import { Category } from "@prisma/client";
import { useTranslations } from "next-intl";
interface CategoriesTableActionProps {
  data: Category;
}
export const CategoriesTableAction = ({ data }: CategoriesTableActionProps) => {
  const tAction = useTranslations("categories.table.action");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>{tAction("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EditCategoryButton data={data} label={tAction("edit")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DeleteCategoryButton data={data} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
