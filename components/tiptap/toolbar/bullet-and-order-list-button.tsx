import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/toggle-group-button";
import { Editor } from "@tiptap/react";
import { List, ListOrdered } from "lucide-react";

interface BulletAndOrderListButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const BulletAndOrderListButton = ({
  editor,
  disabled,
}: BulletAndOrderListButtonProps) => {
  const toggleButtons: ToggleButton[] = [
    {
      icon: List,
      label: "Bullet list",
      onToggle: () => {
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      icon: ListOrdered,
      label: "Order list",
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
