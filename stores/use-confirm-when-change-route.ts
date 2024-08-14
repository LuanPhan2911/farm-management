import { create } from "zustand";

interface ConfirmWhenChangeRoute {
  shouldConfirmLeave: boolean;
  setShouldConfirmLeave: (value: boolean) => void;

  isOpen: boolean;
  setOpen: (value: boolean) => void;
}
export const useConfirmWhenChangeRoute = create<ConfirmWhenChangeRoute>()(
  (set) => {
    return {
      shouldConfirmLeave: false,
      setShouldConfirmLeave: (value) => set({ shouldConfirmLeave: value }),

      isOpen: false,
      setOpen: (value) => set({ isOpen: value }),
    };
  }
);
