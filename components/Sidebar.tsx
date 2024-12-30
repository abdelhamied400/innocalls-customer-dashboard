"use client";
import useAppStore from "@/store/app.slice";
import { PropsWithChildren } from "react";

type SidebarProps = PropsWithChildren<object>;
const Sidebar = ({ children }: SidebarProps) => {
  const { isSidebarOpen } = useAppStore();

  if (!isSidebarOpen) return null;
  return <aside className="flex flex-col border-e-2">{children}</aside>;
};

export default Sidebar;
