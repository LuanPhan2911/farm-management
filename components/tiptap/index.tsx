"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TypographyExtension from "@tiptap/extension-typography";
import UnderlineExtension from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import CharacterCount from "@tiptap/extension-character-count";
import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import EditorStyled from "./style";
import { Toolbar } from "./toolbar";
import { useEffect } from "react";
import {
  useEditorAttribute,
  useEditorAttributePersist,
} from "@/stores/use-editor-attribute";
import { TextStyleExtended } from "./extension/font-size";
import { Separator } from "../ui/separator";
interface TiptapProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
export const Tiptap = ({ value, onChange, disabled }: TiptapProps) => {
  const { activeFont, activeFontSize } = useEditorAttributePersist();
  const { subscript, superscript } = useEditorAttribute();
  const limit = 5000;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight,
      TypographyExtension,
      UnderlineExtension,
      Document,
      Paragraph,
      Text,
      Dropcursor,
      Code,
      CharacterCount.configure({
        limit,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      TextStyleExtended,
      FontFamily,
      Subscript,
      Superscript,
      BulletList,
      OrderedList,
      ListItem,
      // History,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.chain().setFontFamily(activeFont).run();
    editor.commands.setFontSize(activeFontSize.toString());
  }, [editor, activeFont, activeFontSize]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    if (subscript) {
      editor.chain().setSubscript().run();
      editor.chain().unsetSuperscript().run();
    } else {
      editor.chain().unsetSubscript().run();
    }
    if (superscript) {
      editor.chain().setSuperscript().run();
      editor.chain().unsetSubscript().run();
    } else {
      editor.chain().unsetSuperscript().run();
    }
  }, [editor, subscript, superscript]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorStyled className="rounded-md border border-input px-3 py-2 flex flex-col gap-y-2">
        <Toolbar editor={editor} disabled={disabled} />
        <Separator orientation="horizontal" className="h-[3px]" />
        {disabled ? (
          <TiptapContent content={value} />
        ) : (
          <EditorContent
            editor={editor}
            className="min-h-[100px] w-full h-fit"
            disabled={disabled}
            onClick={() => editor.chain().focus()}
          />
        )}
      </EditorStyled>
    </>
  );
};
interface TiptapContentProps {
  content: string;
}
export const TiptapContent = ({ content }: TiptapContentProps) => {
  return (
    <EditorStyled>
      <div
        className="min-h-[100px] w-full rounded-md border border-input px-3 py-2"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></div>
    </EditorStyled>
  );
};
