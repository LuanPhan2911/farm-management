import {
  ToggleButton,
  ToggleGroupButton,
} from "@/components/toggle-group-button";
import { useEditorAttribute } from "@/stores/use-editor-attribute";
import { Subscript, Superscript } from "lucide-react";

interface SuperscriptAndSubscriptButtonProps {
  disabled?: boolean;
}
export const SuperscriptAndSubscriptButton = ({
  disabled,
}: SuperscriptAndSubscriptButtonProps) => {
  const { toggleSubscript, toggleSuperscript, subscript, superscript } =
    useEditorAttribute();
  const toggleButtons: ToggleButton[] = [
    {
      icon: Superscript,
      label: "Superscript",
      onToggle: () => {
        toggleSuperscript(superscript);
      },
    },
    {
      icon: Subscript,
      label: "Subscript",
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
