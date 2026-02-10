"use client";
import useAppStore from "@/store/app.slice";
import { PropsWithChildren } from "react";
import { Button } from "./button";
import MenuIcon from "@mui/icons-material/Menu";

type SidebarProps = PropsWithChildren<object>;
const Sidebar = ({ children }: SidebarProps) => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  if (!isSidebarOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-28 -start-4 z-50 shadow-md translate-x-0 transition-transform duration-200 hover:translate-x-2 rtl:hover:-translate-x-2"
      >
        <MenuIcon />
      </Button>
    );
  }

  return <aside className="flex flex-col sidebar">{children}</aside>;
};

export default Sidebar;
