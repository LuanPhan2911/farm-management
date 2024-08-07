import { create } from "zustand";
interface DashboardSidebar {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: (state: boolean) => void;
}
export const useDashboardSidebar = create<DashboardSidebar>((set) => {
  return {
    isOpen: true,
    onToggle: (state: boolean) => set({ isOpen: !state }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  };
});
