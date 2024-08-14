import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/toggle-group-button";
import { Editor } from "@tiptap/react";
import { Bold, Highlighter, Italic, Underline } from "lucide-react";

interface MarkButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const MarkButton = ({ editor, disabled }: MarkButtonProps) => {
  const toggleButtons: ToggleButton[] = [
    {
      icon: Bold,
      label: "Bold",
      onToggle: () => {
        editor.chain().focus().toggleBold().run();
      },
    },
    {
      icon: Italic,
      label: "Italic",
      onToggle: () => {
        editor.chain().focus().toggleItalic().run();
      },
    },
    {
      icon: Underline,
      label: "Underline",
      onToggle: () => {
        editor.chain().focus().toggleUnderline().run();
      },
    },
    {
      icon: Highlighter,
      label: "Highlighter",
      onToggle: () => {
        editor.chain().focus().toggleHighlight().run();
      },
    },
  ];
  return (
    <ToggleGroupButton
      toggleButtons={toggleButtons}
      type="multiple"
      disabled={disabled}
    />
  );
};
