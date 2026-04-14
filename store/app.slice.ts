import { create } from "zustand";

type AppState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  isWebrtcOpen: boolean; // Optional property for WebRTC state
  setWebrtcOpen: (isOpen: boolean) => void; // Optional method to
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
};

const useAppStore = create<AppState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => {
      return { isSidebarOpen: !state.isSidebarOpen };
    }),
  setSidebarOpen: (isOpen: boolean) => set(() => ({ isSidebarOpen: isOpen })),
  isWebrtcOpen: true,
  setWebrtcOpen: (isOpen: boolean) => set(() => ({ isWebrtcOpen: isOpen })),
  pageTitle: null,
  setPageTitle: (title: string | null) => set(() => ({ pageTitle: title })),
}));

export default useAppStore;
