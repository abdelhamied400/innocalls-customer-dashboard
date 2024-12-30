import { create } from "zustand";

type AppState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const useAppStore = create<AppState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;
