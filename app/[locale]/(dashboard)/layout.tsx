import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarHeader from "@/components/SidebarHeader";
import SidebarItem from "@/components/SidebarItem";
import { AxeIcon } from "lucide-react";
import { PropsWithChildren } from "react";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-background h-screen dashboard-layout layout">
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
            <SidebarItem
              icon={<AxeIcon />}
              title="Auto Dialer"
              href="/auto-dialer"
            />
          </div>
        </Sidebar>
        <div className="flex flex-col flex-1 main">
          <Navbar />
          <main className="flex-1 p-4 max-h-[calc(100%-96px)] overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
