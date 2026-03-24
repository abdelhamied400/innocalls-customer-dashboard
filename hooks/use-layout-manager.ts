import { useMemo, useEffect, useState } from "react";
import useAppStore from "@/store/app.slice";
import { useSession } from "@/hooks/useSession";
import useAuth from "./useAuth";
import useAuthStore from "@/store/auth.slice";

export type LayoutVariant =
  | "both-open" // sidebar + webrtc open
  | "sidebar-only" // only sidebar open
  | "webrtc-only" // only webrtc open
  | "both-closed"; // both closed

export interface LayoutClasses {
  container: string;
  sidebar: string;
  navbar: string;
  mainContent: string;
  webrtc: string;
}

export const useLayoutManager = () => {
  // Get state directly from the store - no need to pass booleans!
  const { data: session } = useSession();
  const { data: auth } = useAuth();
  const { Organization } = useAuthStore();
  const { isSidebarOpen, isWebrtcOpen: storeWebrtcOpen } = useAppStore();
  const hasWebrtcAccess =
    (Organization?.hasTenant &&
      session?.userType === "user" &&
      auth?.user?.webrtcAccess) ||
    session?.userType === "agent";

  // If user doesn't have WebRTC access, force isWebrtcOpen to false
  const isWebrtcOpen = hasWebrtcAccess ? storeWebrtcOpen : false;
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Track screen size for responsive behavior
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 1024); // lg breakpoint
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const layoutVariant: LayoutVariant = useMemo<LayoutVariant>(() => {
    if (isSidebarOpen && isWebrtcOpen) return "both-open";
    if (isSidebarOpen && !isWebrtcOpen) return "sidebar-only";
    if (!isSidebarOpen && isWebrtcOpen) return "webrtc-only";
    return "both-closed";
  }, [isSidebarOpen, isWebrtcOpen]);

  const getLayoutClasses: LayoutClasses = useMemo(() => {
    const baseClasses = {
      container:
        "h-screen w-screen grid box-border transition-all duration-800 ease-in-out",
      sidebar: "row-span-3 overflow-y-auto border-e",
      navbar: "col-span-2 col-start-2 col-end-4",
      mainContent: "overflow-auto p-4",
      webrtc: "overflow-y-auto border-s",
    };

    // On mobile, sidebar is always hidden from grid layout (handled by sheet)
    if (isMobile) {
      return {
        ...baseClasses,
        container: `${baseClasses.container} grid-cols-[1fr_80px] grid-rows-[96px_1fr]`,
        sidebar: `${baseClasses.sidebar} hidden`, // Hidden on mobile
        navbar: "col-span-2",
      };
    }

    // Desktop layout - add grid-rows to base container
    const desktopContainer = `${baseClasses.container} grid-rows-[96px_1fr]`;

    switch (layoutVariant) {
      case "both-open":
        return {
          ...baseClasses,
          container: `${desktopContainer} grid-cols-[360px_1fr_280px]`,
        };
      case "sidebar-only":
        return {
          ...baseClasses,
          container: `${desktopContainer} grid-cols-[360px_1fr_80px]`,
        };
      case "webrtc-only":
        return {
          ...baseClasses,
          container: `${desktopContainer} grid-cols-[0px_1fr_280px]`,
        };
      case "both-closed":
      default:
        return {
          ...baseClasses,
          container: `${desktopContainer} grid-cols-[0px_1fr_80px]`,
        };
    }
  }, [layoutVariant, isMobile, isWebrtcOpen]);

  return {
    getLayoutClasses,
    layoutVariant,
    isSidebarOpen,
    isWebrtcOpen,
    isMobile,
    screenWidth,
    // Useful predicates
    isCompact: layoutVariant === "both-closed",
    hasExpandedSidebar: isSidebarOpen,
    hasExpandedWebrtc: isWebrtcOpen,
    shouldUseSidebarSheet: isMobile,
    shouldUseWebrtcSheet: isMobile,
    // Screen size helpers
    isSmall: screenWidth < 640, // sm breakpoint
    isMedium: screenWidth >= 640 && screenWidth < 768, // md breakpoint
    isLarge: screenWidth >= 768 && screenWidth < 1024, // lg breakpoint
    isExtraLarge: screenWidth >= 1024 && screenWidth < 1280, // xl breakpoint
    is2ExtraLarge: screenWidth >= 1280, // 2xl breakpoint
  };
};

export default useLayoutManager;
