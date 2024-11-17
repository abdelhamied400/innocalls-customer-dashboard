import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import { PropsWithChildren } from "react";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout layout">
      <Navbar />

      <div className="flex">
        <Sidebar>
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
        </Sidebar>
        <div className="flex-1 p-2 main">
          <Breadcrumbs />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
