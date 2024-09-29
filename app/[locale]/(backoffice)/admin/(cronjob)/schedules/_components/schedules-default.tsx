"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ScheduleSendMailButton } from "./schedule-send-mail-button";

export const SchedulesDefault = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[250px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-md font-bold">Default schedules</h4>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <ScheduleSendMailButton />
      </CollapsibleContent>
    </Collapsible>
  );
};
