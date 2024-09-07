import { Editor } from "@tiptap/react";
import { FontFamilyButton } from "./font-family-button";
import { FontSizeButton } from "./font-size-button";

import { SuperscriptAndSubscriptButton } from "./superscript-and-subscript-button";
import { AlignButton } from "./align-button";
import { MarkButton } from "./mark-button";
import { BulletAndOrderListButton } from "./bullet-and-order-list-button";
import { RedoAndUndoButton } from "./redo-and-undo-button";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
  editor: Editor;
  disabled?: boolean;
}
export const Toolbar = ({ editor, disabled }: ToolbarProps) => {
  return (
    <div className="flex gap-1 items-start h-fit py-3 rounded-md flex-row flex-wrap">
      <RedoAndUndoButton editor={editor} disabled={disabled} />
      <FontFamilyButton disabled={disabled} />
      <FontSizeButton disabled={disabled} />
      <AlignButton editor={editor} disabled={disabled} />
      <SuperscriptAndSubscriptButton disabled={disabled} />
      <MarkButton editor={editor} disabled={disabled} />
      <BulletAndOrderListButton editor={editor} disabled={disabled} />
    </div>
  );
};
