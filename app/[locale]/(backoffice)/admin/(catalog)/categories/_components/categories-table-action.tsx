import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CategoryEditButton } from "./category-edit-button";
import { MoreHorizontal } from "lucide-react";

import { CategoryTable } from "@/types";
import { destroy } from "@/actions/category";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface CategoriesTableActionProps {
  data: CategoryTable;
}
export const CategoriesTableAction = ({ data }: CategoriesTableActionProps) => {
  const { isSuperAdmin } = useCurrentStaffRole();

  const canDelete = isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <CategoryEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="categories"
            className="w-full"
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
