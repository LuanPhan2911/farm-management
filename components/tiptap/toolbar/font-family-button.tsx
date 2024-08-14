import { Hint } from "@/components/hint";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useEditorAttributePersist } from "@/stores/use-editor-attribute";
import { useTranslations } from "next-intl";

interface FontFamilyButtonProps {
  disabled?: boolean;
}
export const FontFamilyButton = ({ disabled }: FontFamilyButtonProps) => {
  const { fonts, activeFont, setFont } = useEditorAttributePersist();
  const tFontFamily = useTranslations("editor.fontFamily");
  const handleChange = (value: string) => {
    setFont(value);
  };
  return (
    <Select
      defaultValue={activeFont}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <Hint asChild label={tFontFamily("title")}>
        <SelectTrigger className="w-[100px] bg-transparent">
          <SelectValue placeholder={tFontFamily("description")} />
        </SelectTrigger>
      </Hint>
      <SelectContent>
        {fonts.map((font) => {
          return (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
