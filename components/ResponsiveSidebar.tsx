"use client";
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
        <p>{JSON.stringify(isSidebarOpen)}</p>
        {/* Mobile menu trigger button */}
        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-4 left-4 z-50 bg-background border shadow-sm"
              onClick={() => toggleSidebar()}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[360px] overflow-y-auto">
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
