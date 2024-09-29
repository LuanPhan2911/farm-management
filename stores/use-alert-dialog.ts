import { create } from "zustand";
type AlertDialogData = {
  title: string;
  description: string;
  onConfirm: () => void;
};

interface AlertDialogStore {
  isOpen: boolean;
  onOpen: (data: AlertDialogData) => void;
  onClose: () => void;
  data: AlertDialogData | null;
  isPending: boolean; // Add isPending here;
  setPending: (pending: boolean) => void; // Setter for isPending
}

export const useAlertDialog = create<AlertDialogStore>((set) => {
  return {
    isOpen: false,
    isPending: false,
    data: null,
    onOpen: (data) => set({ isOpen: true, data, isPending: false }),
    onClose: () => set({ isOpen: false, data: null, isPending: false }),
    setPending: (pending) => set({ isPending: pending }),
  };
});
