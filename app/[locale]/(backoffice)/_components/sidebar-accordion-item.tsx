import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface SidebarAccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
}
export const SidebarAccordionItem = ({
  title,
  children,
  icon: Icon,
}: SidebarAccordionItemProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-2 font-semibold text-md">
          <div className="flex gap-x-2">
            <Icon className="h-6 w-6" />
            <span>{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-5 flex flex-col gap-y-1">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
