import { TaskResponse } from "@/types";
import { create } from "zustand";

export type SheetType = "task.edit";

export interface SheetData {
  task?: TaskResponse;
}

interface SheetStore {
  type: SheetType | null;
  isOpen: boolean;
  data: SheetData;
  onOpen: (type: SheetType, data?: SheetData) => void;
  onClose: () => void;
}
export const useSheet = create<SheetStore>((set) => {
  return {
    isOpen: false,
    type: null,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: {} }),
  };
});
