import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarHeader from "@/components/SidebarHeader";
import SidebarItem from "@/components/SidebarItem";
import { AxeIcon } from "lucide-react";
import { PropsWithChildren } from "react";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-gray-50 h-screen dashboard-layout layout">
      <div className="flex h-full">
        <Sidebar>
          <SidebarHeader />
          <div className="flex flex-col gap-2 p-4">
            <SidebarItem icon={<AxeIcon />} title="Dashboard" href="/" />
            <SidebarItem
              icon={<AxeIcon />}
              title="Extensions"
              href="/extensions"
            />
          </div>
        </Sidebar>
        <div className="flex-1 main">
          <Navbar />

          <main className="p-4">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
