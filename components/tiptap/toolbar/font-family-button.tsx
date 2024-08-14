import { Hint } from "@/components/hint";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useEditorAttributePersist } from "@/stores/use-editor-attribute";

interface FontFamilyButtonProps {
  disabled?: boolean;
}
export const FontFamilyButton = ({ disabled }: FontFamilyButtonProps) => {
  const { fonts, activeFont, setFont } = useEditorAttributePersist();
  const handleChange = (value: string) => {
    setFont(value);
  };
  return (
    <Select
      defaultValue={activeFont}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <Hint asChild label="Font family">
        <SelectTrigger className="w-[100px] bg-transparent">
          <SelectValue placeholder="Font family" />
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
