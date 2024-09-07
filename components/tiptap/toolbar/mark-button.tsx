import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/buttons/toggle-group-button";
import { Editor } from "@tiptap/react";
import { Bold, Highlighter, Italic, Underline } from "lucide-react";
import { useTranslations } from "next-intl";

interface MarkButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const MarkButton = ({ editor, disabled }: MarkButtonProps) => {
  const tMark = useTranslations("editor.mark");
  const toggleButtons: ToggleButton[] = [
    {
      icon: Bold,
      label: tMark("bold"),
      onToggle: () => {
        editor.chain().focus().toggleBold().run();
      },
    },
    {
      icon: Italic,
      label: tMark("italic"),
      onToggle: () => {
        editor.chain().focus().toggleItalic().run();
      },
    },
    {
      icon: Underline,
      label: tMark("underline"),
      onToggle: () => {
        editor.chain().focus().toggleUnderline().run();
      },
    },
    {
      icon: Highlighter,
      label: tMark("highlight"),
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
