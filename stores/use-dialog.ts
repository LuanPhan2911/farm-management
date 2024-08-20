import { User } from "@clerk/nextjs/server";
import { Category, Unit, Applicant } from "@prisma/client";
import { create } from "zustand";

export type DialogType =
  | "category.edit"
  | "unit.edit"
  | "applicant.setRole"
  | "user.setRole";

export interface DialogData {
  category?: Category;
  unit?: Unit;
  applicant?: Applicant;
  user?: User;
}
interface DialogStore {
  type: DialogType | null;
  isOpen: boolean;
  data: DialogData;
  onOpen: (type: DialogType, data?: DialogData) => void;
  onClose: () => void;
}

export const useDialog = create<DialogStore>((set) => {
  return {
    isOpen: false,
    type: null,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: {} }),
  };
});
