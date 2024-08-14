import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/toggle-group-button";
import { Editor } from "@tiptap/react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface AlignButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const AlignButton = ({ editor, disabled }: AlignButtonProps) => {
  const tAlignment = useTranslations("editor.alignment");
  const toggleButtons: ToggleButton[] = [
    {
      icon: AlignLeft,
      label: tAlignment("left"),
      onToggle: () => {
        editor.chain().focus().setTextAlign("left").run();
      },
    },
    {
      icon: AlignCenter,
      label: tAlignment("center"),
      onToggle: () => {
        editor.chain().focus().setTextAlign("center").run();
      },
    },
    {
      icon: AlignRight,
      label: tAlignment("right"),
      onToggle: () => {
        editor.chain().focus().setTextAlign("right").run();
      },
    },
    {
      icon: AlignJustify,
      label: tAlignment("justify"),
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
