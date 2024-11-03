import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UnitEditButton } from "./unit-edit-button";
import { MoreHorizontal } from "lucide-react";

import { UnitTable } from "@/types";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/unit";
interface UnitsTableActionProps {
  data: UnitTable;
}
export const UnitsTableAction = ({ data }: UnitsTableActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <UnitEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="units"
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
