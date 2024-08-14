import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const fonts = [
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Inter",
];
const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 72,
];

interface EditorAttributePersist {
  fonts: string[];
  activeFont: string;
  setFont: (font: string) => void;

  fontSizes: number[];
  activeFontSize: number;
  setFontSize: (fontSize: number) => void;
}
interface EditorAttribute {
  superscript: boolean;
  toggleSuperscript: (state: boolean) => void;

  subscript: boolean;
  toggleSubscript: (state: boolean) => void;
}

export const useEditorAttributePersist = create<EditorAttributePersist>()(
  persist(
    (set) => {
      return {
        activeFont: "Arial",
        fonts: fonts,
        setFont: (font) => set({ activeFont: font }),

        fontSizes,
        activeFontSize: 16,
        setFontSize: (fontSize) => set({ activeFontSize: fontSize }),
      };
    },
    {
      name: "editor",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export const useEditorAttribute = create<EditorAttribute>()((set) => {
  return {
    superscript: false,
    toggleSuperscript: (state) =>
      set({ superscript: !state, subscript: false }),

    subscript: false,
    toggleSubscript: (state) => set({ subscript: !state, superscript: false }),
  };
});
