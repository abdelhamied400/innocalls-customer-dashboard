"use client";
import { PropsWithChildren } from "react";
import Innortc from "./Innortc";
import useAuthStore from "@/store/auth.slice";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import useAppStore from "@/store/app.slice";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { Organization } = useAuthStore();
  const { isSidebarOpen } = useAppStore();

  return (
    <div className="dashboard-layout" key={Organization?.id}>
      <div
        className={cn(
          "h-screen w-screen grid grid-rows-[96px_1fr] gap-2 box-border transition-all duration-800 ease-in-out",
          isSidebarOpen
            ? "grid-cols-[320px_1fr_200px]"
            : "grid-cols-[0px_1fr_200px]"
        )}
      >
        {/* Sidebar */}
        <div className="row-span-3 overflow-y-auto rounded-lg px-2">
          <AppSidebar />
        </div>

        {/* Navbar */}
        <div className="col-span-2 col-start-2 col-end-4">
          <AppNavbar />
        </div>

        {/* Table content */}
        <div className="overflow-auto rounded-lg p-2">{children}</div>

        {/* Sidebar2 */}
        <div className="row-span-2 col-start-3 overflow-y-auto rounded-lg p-2">
          <p className="sticky top-0 p-2 mb-2">Sidebar2</p>
          <Innortc />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
