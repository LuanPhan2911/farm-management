import { create } from "zustand";
type AlertDialogData = {
  title: string;
  description: string;
  onConfirm: () => void;
  isPending: boolean;
};

interface AlertDialogStore {
  isOpen: boolean;
  onOpen: (data: AlertDialogData) => void;
  onClose: () => void;
  data: AlertDialogData | null;
}

export const useAlertDialog = create<AlertDialogStore>((set) => {
  return {
    isOpen: false,
    data: null,
    onOpen: (data) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: null }),
  };
});
