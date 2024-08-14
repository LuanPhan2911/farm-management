import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/toggle-group-button";
import { Editor } from "@tiptap/react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

interface AlignButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const AlignButton = ({ editor, disabled }: AlignButtonProps) => {
  const toggleButtons: ToggleButton[] = [
    {
      icon: AlignLeft,
      label: "Align left",
      onToggle: () => {
        editor.chain().focus().setTextAlign("left").run();
      },
    },
    {
      icon: AlignCenter,
      label: "Align center",
      onToggle: () => {
        editor.chain().focus().setTextAlign("center").run();
      },
    },
    {
      icon: AlignRight,
      label: "Align right",
      onToggle: () => {
        editor.chain().focus().setTextAlign("right").run();
      },
    },
    {
      icon: AlignJustify,
      label: "Align justify",
      onToggle: () => {
        editor.chain().focus().setTextAlign("justify").run();
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
