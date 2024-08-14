import { Editor } from "@tiptap/react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useEditorAttributePersist } from "@/stores/use-editor-attribute";
import { Hint } from "@/components/hint";
import { useTranslations } from "next-intl";

interface FontSizeButtonProps {
  disabled?: boolean;
}
export const FontSizeButton = ({ disabled }: FontSizeButtonProps) => {
  const tFontSize = useTranslations("editor.fontSize");
  const { activeFontSize, setFontSize, fontSizes } =
    useEditorAttributePersist();
  const handleChange = (value: string) => {
    setFontSize(Number(value));
  };
  return (
    <Select onValueChange={handleChange} disabled={disabled}>
      <Hint asChild label={tFontSize("title")}>
        <SelectTrigger className="w-[60px] bg-transparent">
          <SelectValue placeholder={activeFontSize} />
        </SelectTrigger>
      </Hint>
      <SelectContent>
        {fontSizes.map((fontSize) => {
          return (
            <SelectItem key={fontSize} value={fontSize.toString()}>
              {fontSize}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
