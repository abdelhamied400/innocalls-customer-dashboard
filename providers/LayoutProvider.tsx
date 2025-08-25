"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useLayoutManager } from "@/hooks/use-layout-manager";
import { layoutPredicates } from "@/lib/layout-config";
import useAppStore from "@/store/app.slice";

interface LayoutContextValue extends ReturnType<typeof useLayoutManager> {
  // Additional layout utilities
  predicates: typeof layoutPredicates;
  toggleSidebar: () => void;
  toggleWebrtc: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setWebrtcOpen: (isOpen: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const { isWebrtcOpen, toggleSidebar, setWebrtcOpen } = useAppStore();

  const layoutManager = useLayoutManager();

  const contextValue = useMemo(
    () => ({
      ...layoutManager,
      predicates: layoutPredicates,
      toggleSidebar,
      toggleWebrtc: () => setWebrtcOpen(!isWebrtcOpen),
      setSidebarOpen: toggleSidebar, // You might want to add setSidebarOpen to useAppStore
      setWebrtcOpen,
    }),
    [layoutManager, toggleSidebar, setWebrtcOpen, isWebrtcOpen]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export default LayoutProvider;
