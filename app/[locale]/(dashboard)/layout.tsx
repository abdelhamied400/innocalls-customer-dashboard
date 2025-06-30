"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import Innortc from "./Innortc";
import useAuthStore from "@/store/auth.slice";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import useAppStore from "@/store/app.slice";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next/client";
import { WebrtcProvider } from "@/providers/webrtc/WebrtcProvider";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { Organization } = useAuthStore();
  const { isSidebarOpen } = useAppStore();
  const [defaultOrganizationId, setDefaultOrganizationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const orgId = getCookie("OrganizationId");
    if (orgId) {
      setDefaultOrganizationId(orgId as string);
    } else {
      setDefaultOrganizationId(null);
    }
  }, []);

  return (
    <div
      className="dashboard-layout"
      key={Organization?.id || defaultOrganizationId}
    >
      <div
        className={cn(
          "h-screen w-screen grid grid-rows-[96px_1fr] box-border transition-all duration-800 ease-in-out",
          isSidebarOpen
            ? "grid-cols-[360px_1fr_280px]"
            : "grid-cols-[0px_1fr_280px]"
        )}
      >
        <div className="row-span-3 overflow-y-auto border-e">
          <AppSidebar />
        </div>

        <div className="col-span-2 col-start-2 col-end-4">
          <AppNavbar />
        </div>

        <div className="overflow-auto p-4">{children}</div>

        <div className="row-span-2 col-start-3 overflow-y-auto border-s">
          <WebrtcProvider>
            <Innortc />
          </WebrtcProvider>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
