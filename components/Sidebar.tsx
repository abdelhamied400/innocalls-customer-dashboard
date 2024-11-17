import { PropsWithChildren } from "react";

type SidebarProps = PropsWithChildren<object>;
const Sidebar = ({ children }: SidebarProps) => {
  return (
    <aside className="flex flex-col gap-2 bg-red-300">
      <p>Sidebar</p>
      {children}
    </aside>
  );
};

export default Sidebar;
