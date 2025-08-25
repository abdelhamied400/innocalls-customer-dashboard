"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import Innortc from "./Innortc";
import useAuthStore from "@/store/auth.slice";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import AppNavbar from "@/components/AppNavbar";
import useAppStore from "@/store/app.slice";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next/client";
import { useSession } from "next-auth/react";
import { useLayoutManager } from "@/hooks/use-layout-manager";

type DashboardLayoutProps = PropsWithChildren<{
  agent?: React.ReactNode;
}>;
const DashboardLayout = ({ children, agent }: DashboardLayoutProps) => {
  const { data: session } = useSession();
  const { Organization } = useAuthStore();
  const [defaultOrganizationId, setDefaultOrganizationId] = useState<
    string | null
  >(null);

  // Use the layout manager hook for clean layout management
  const { getLayoutClasses, isMobile } = useLayoutManager();

  const hasWebrtcAccess =
    (Organization?.hasTenant &&
      session?.user?.userType === "user" &&
      session?.user.webrtcAccess) ||
    session?.user?.userType === "agent";

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
      {/* Mobile sidebar trigger - rendered outside grid */}
      {isMobile && <ResponsiveSidebar />}

      <div className={getLayoutClasses.container}>
        {/* Desktop sidebar - hidden on mobile */}
        <div className={getLayoutClasses.sidebar}>
          {!isMobile && <ResponsiveSidebar />}
        </div>

        <div className={getLayoutClasses.navbar}>
          <AppNavbar />
        </div>

        <div className={getLayoutClasses.mainContent}>
          {session?.user?.userType === "user" && children}
          {session?.user?.userType === "agent" && agent}
        </div>

        {hasWebrtcAccess && (
          <div className={getLayoutClasses.webrtc}>
            <Innortc />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
