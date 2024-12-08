import { PropsWithChildren } from "react";

type SidebarProps = PropsWithChildren<object>;
const Sidebar = ({ children }: SidebarProps) => {
  return <aside className="flex flex-col border-e-2">{children}</aside>;
};

export default Sidebar;
