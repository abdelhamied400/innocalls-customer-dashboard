"use client";
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import AppSidebar from "@/components/AppSidebar";
import useAppStore from "@/store/app.slice";
import { useLayoutManager } from "@/hooks/use-layout-manager";
import { usePathname } from "next/navigation";

const ResponsiveSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { shouldUseSidebarSheet } = useLayoutManager();
  const pathname = usePathname();

  // Close sidebar sheet when navigating on mobile
  useEffect(() => {
    if (shouldUseSidebarSheet && isSidebarOpen) {
      toggleSidebar();
    }
  }, [pathname, shouldUseSidebarSheet]); // Don't include toggleSidebar in deps to avoid loop

  // On mobile, render as sheet
  if (shouldUseSidebarSheet) {
    return (
      <>
        <Sheet
          open={isSidebarOpen}
          onOpenChange={(e) => {
            toggleSidebar();
          }}
        >
          <SheetContent side="left" className="p-0 w-[360px] overflow-y-auto">
            <SheetTitle hidden>test</SheetTitle>
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // On desktop, render normally
  return <AppSidebar />;
};

export default ResponsiveSidebar;
