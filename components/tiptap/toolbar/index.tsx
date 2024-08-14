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
    <div className="flex gap-1 items-start h-fit py-3 rounded-md flex-col md:flex-row md:flex-wrap">
      <div className="flex gap-1">
        <RedoAndUndoButton editor={editor} disabled={disabled} />
        <FontFamilyButton disabled={disabled} />
        <FontSizeButton disabled={disabled} />
      </div>
      <Separator orientation="horizontal" className="md:hidden block" />
      <AlignButton editor={editor} disabled={disabled} />
      <Separator orientation="horizontal" className="md:hidden block" />
      <MarkButton editor={editor} disabled={disabled} />
      <Separator orientation="horizontal" className="md:hidden block" />
      <div className="flex gap-1">
        <BulletAndOrderListButton editor={editor} disabled={disabled} />
        <SuperscriptAndSubscriptButton disabled={disabled} />
      </div>
    </div>
  );
};
