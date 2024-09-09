import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/buttons/toggle-group-button";
import { Editor } from "@tiptap/react";
import { List, ListOrdered } from "lucide-react";
import { useTranslations } from "next-intl";

interface BulletAndOrderListButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const BulletAndOrderListButton = ({
  editor,
  disabled,
}: BulletAndOrderListButtonProps) => {
  const tList = useTranslations("editor.list");
  const toggleButtons: ToggleButton[] = [
    {
      icon: List,
      label: tList("bullet"),
      onToggle: () => {
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      icon: ListOrdered,
      label: tList("order"),
      onToggle: () => {
        editor.chain().focus().toggleOrderedList().run();
      },
    },
  ];

  return (
    <ToggleGroupButton
      toggleButtons={toggleButtons}
      type="single"
      disabled={disabled}
    />
  );
};
