"use client";
import React, { PropsWithChildren } from "react";
import Innortc from "./Innortc";
import useAuthStore from "@/store/auth.slice";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import ResponsiveWebrtc from "@/components/ResponsiveWebrtc";
import AppNavbar from "@/components/AppNavbar";
import { getCookie } from "cookies-next/client";
import { useSession } from "next-auth/react";
import { useLayoutManager } from "@/hooks/use-layout-manager";
import InnortcLayout from "@/components/Webrtc/InnortcLayout";
import DevLogger from "@/components/DevLogger";
import useAuth from "@/hooks/useAuth";

type DashboardLayoutProps = PropsWithChildren<{
  agent: React.ReactNode;
}>;
const DashboardLayout = ({ children, agent }: DashboardLayoutProps) => {
  const { data: session } = useSession();
  const { data: auth } = useAuth();
  const { Organization } = useAuthStore();

  // Use the layout manager hook for clean layout management
  const { getLayoutClasses, shouldUseSidebarSheet } = useLayoutManager();

  const hasWebrtcAccess =
    (Organization?.hasTenant &&
      session?.userType === "user" &&
      auth?.user?.webrtcAccess) ||
    session?.userType === "agent";

  // Get default organization ID from cookie
  const defaultOrganizationId = getCookie("OrganizationId") as
    | string
    | undefined;

  return (
    <div
      className="dashboard-layout"
      key={Organization?.id || defaultOrganizationId}
    >
      {/* Mobile sidebar trigger - rendered outside grid */}
      {shouldUseSidebarSheet && <ResponsiveSidebar />}

      <div className={getLayoutClasses.container}>
        {/* Desktop sidebar - hidden on mobile */}
        <div className={getLayoutClasses.sidebar}>
          {!shouldUseSidebarSheet && <ResponsiveSidebar />}
        </div>

        <div className={getLayoutClasses.navbar}>
          <AppNavbar />
        </div>

        <div className={getLayoutClasses.mainContent}>
          {session?.userType === "user" && children}
          {session?.userType === "agent" && agent}
        </div>

        {hasWebrtcAccess && (
          <div className={getLayoutClasses.webrtc}>
            <InnortcLayout>
              <ResponsiveWebrtc>
                <Innortc />
              </ResponsiveWebrtc>
            </InnortcLayout>
          </div>
        )}
      </div>

      <DevLogger />
    </div>
  );
};

export default DashboardLayout;
