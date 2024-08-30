import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OrgActiveTab {
  active: string;
  setActive: (value: string) => void;
}

export const useOrgActiveTab = create<OrgActiveTab>()(
  persist(
    (set) => {
      return {
        active: "profile",
        setActive: (value) => set({ active: value }),
      };
    },
    {
      name: "org-tabs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
interface FieldActiveTab {
  active: string;
  setActive: (value: string) => void;
}

export const useFieldActiveTab = create<FieldActiveTab>()(
  persist(
    (set) => {
      return {
        active: "info",
        setActive: (value) => set({ active: value }),
      };
    },
    {
      name: "field-tabs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
