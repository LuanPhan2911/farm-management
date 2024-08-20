import { create } from "zustand";

type VerificationData = {
  isVerified: boolean;
  setVerified: () => void;
};

export const useVerification = create<VerificationData>()((set) => {
  return {
    isVerified: false,
    setVerified: () => {
      set({ isVerified: true });

      setTimeout(() => {
        set({
          isVerified: false,
        });
      }, 1000 * 60 * 15);
    },
  };
});
