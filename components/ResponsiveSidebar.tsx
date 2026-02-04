"use client";
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import AppSidebar from "@/components/AppSidebar";
import useAppStore from "@/store/app.slice";
import { useLayoutManager } from "@/hooks/use-layout-manager";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import MenuIcon from "@mui/icons-material/Menu";

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
        {/* Mobile menu button */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="fixed top-28 -start-4 z-50 shadow-md translate-x-0 transition-transform duration-200 hover:translate-x-2 rtl:hover:-translate-x-2"
          >
            <MenuIcon />
          </Button>
        )}
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
