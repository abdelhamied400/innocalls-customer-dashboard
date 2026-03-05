"use client";
import React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import useAppStore from "@/store/app.slice";
import useLayoutManager from "@/hooks/use-layout-manager";

interface ResponsiveWebrtcProps {
  children: React.ReactNode;
}

const ResponsiveWebrtc = ({ children }: ResponsiveWebrtcProps) => {
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();

  const { shouldUseWebrtcSheet } = useLayoutManager();

  if (!shouldUseWebrtcSheet) {
    return children;
  }

  return (
    <>
      {!isWebrtcOpen && children}
      <Sheet
        open={isWebrtcOpen}
        onOpenChange={(open) => {
          setWebrtcOpen(open);
        }}
      >
        <SheetContent side="right" className="p-0 w-[280px] overflow-y-auto">
          <SheetTitle hidden>WebRTC</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ResponsiveWebrtc;
