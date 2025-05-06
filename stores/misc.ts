import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "loading-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

interface AuthState {
  step: number;

  setStep: (value: number | ((prev: number) => number)) => void;
}
const useAuthStep = create<AuthState>((set) => ({
  step: 0,

  setStep: (value) =>
    set((state) => ({
      step: typeof value === "function" ? value(state.step!) : value,
    })),
}));

export { useAuthStep, useLoadingStore };
