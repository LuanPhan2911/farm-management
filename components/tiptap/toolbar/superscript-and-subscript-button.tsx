import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/buttons/toggle-group-button";
import { useEditorAttribute } from "@/stores/use-editor-attribute";
import { Subscript, Superscript } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuperscriptAndSubscriptButtonProps {
  disabled?: boolean;
}
export const SuperscriptAndSubscriptButton = ({
  disabled,
}: SuperscriptAndSubscriptButtonProps) => {
  const { toggleSubscript, toggleSuperscript, subscript, superscript } =
    useEditorAttribute();
  const tScript = useTranslations("editor.script");
  const toggleButtons: ToggleButton[] = [
    {
      icon: Superscript,
      label: tScript("super"),
      onToggle: () => {
        toggleSuperscript(superscript);
      },
    },
    {
      icon: Subscript,
      label: tScript("sub"),
      onToggle: () => {
        toggleSubscript(subscript);
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
