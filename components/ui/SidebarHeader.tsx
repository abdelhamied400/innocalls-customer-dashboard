"use client";
import { SidebarClose } from "lucide-react";
import { Button } from "./button";
import useAppStore from "@/store/app.slice";

const SidebarHeader = () => {
  const { toggleSidebar } = useAppStore();
  return (
    <div className="sidebar-header sticky top-0 bg-background">
      <div className="flex justify-between items-center gap-8 px-4 border-b-2 h-24">
        <h1 className="">Innocalls</h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarClose />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
