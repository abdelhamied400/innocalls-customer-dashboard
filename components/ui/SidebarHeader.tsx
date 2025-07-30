"use client";
import { SidebarClose } from "lucide-react";
import { Button } from "./button";
import useAppStore from "@/store/app.slice";
import Image from "next/image";

const SidebarHeader = () => {
  const { toggleSidebar } = useAppStore();
  return (
    <div className="sidebar-header sticky top-0 bg-background">
      <div className="flex justify-between items-center gap-8 px-4 border-b-2 h-24">
        <div className="flex items-center">
          <Image
            src="/assets/images/logo-hb.svg"
            alt="Innocalls"
            width={210}
            height={40}
            className="object-contain"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarClose />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
