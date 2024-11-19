import { create } from "zustand";
type DialogConfirmCodeData = {
  title: string;
  description: string;
  confirmCode: string;
  onConfirm: () => Promise<void>;
};

interface DialogConfirmCodeStore {
  isOpen: boolean;
  onOpen: (data: DialogConfirmCodeData) => void;
  onClose: () => void;
  data: DialogConfirmCodeData | null;
  isPending: boolean; // Add isPending here;
  setPending: (pending: boolean) => void; // Setter for isPending
}

export const useDialogConfirmCode = create<DialogConfirmCodeStore>((set) => {
  return {
    isOpen: false,
    isPending: false,
    data: null,
    onOpen: (data) => set({ isOpen: true, data, isPending: false }),
    onClose: () => set({ isOpen: false, data: null, isPending: false }),
    setPending: (pending) => set({ isPending: pending }),
  };
});
