// stores/useManageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ManagementState {
  managementData: any;
  loading: boolean;
  error: Error | null;
  setManagementData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useManageStore = create<ManagementState>()(
  persist(
    (set) => ({
      managementData: null,
      loading: false,
      error: null,
      setManagementData: (data) => set({ managementData: data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "management-storage", // name for the persisted data
    }
  )
);
