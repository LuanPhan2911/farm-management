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
          size={"sm"}
          variant={"outline"}
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
          disabled={disabled}
          className="bg-transparent"
        >
          <Undo className="h-4 w-4" />
        </Button>
      </Hint>
      <Hint asChild label={tHistory("redo")}>
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
          disabled={disabled}
          className="bg-transparent"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </Hint>
    </div>
  );
};
