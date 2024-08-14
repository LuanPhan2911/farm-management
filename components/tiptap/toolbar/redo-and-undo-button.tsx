import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { Redo, Undo } from "lucide-react";
import { useTranslations } from "next-intl";

interface RedoAndUndoButtonProps {
  editor: Editor;
  disabled?: boolean;
}
export const RedoAndUndoButton = ({
  editor,
  disabled,
}: RedoAndUndoButtonProps) => {
  const tHistory = useTranslations("editor.history");
  return (
    <div className="flex gap-x-1">
      <Hint asChild label={tHistory("undo")}>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
          disabled={disabled}
          className="bg-transparent"
        >
          <Undo className="h-6 w-6" />
        </Button>
      </Hint>
      <Hint asChild label={tHistory("redo")}>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
          disabled={disabled}
          className="bg-transparent"
        >
          <Redo className="w-6 h-6" />
        </Button>
      </Hint>
    </div>
  );
};
