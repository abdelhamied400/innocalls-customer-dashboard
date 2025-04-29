"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarHeader from "@/components/SidebarHeader";
import SidebarItem from "@/components/SidebarItem";

import DashboardCustomize from "@mui/icons-material/DashboardCustomize";
import Phone from "@mui/icons-material/Phone";
import RingVolume from "@mui/icons-material/RingVolume";
import Settings from "@mui/icons-material/Settings";
import Users from "@mui/icons-material/SupervisedUserCircle";
import Timeline from "@mui/icons-material/Timeline";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import DataUsage from "@mui/icons-material/DataUsage";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Code from "@mui/icons-material/Code";

import { PropsWithChildren } from "react";
import Innortc from "./Innortc";

type DashboardLayoutProps = PropsWithChildren<object>;
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="bg-background h-screen dashboard-layout layout">
      <div className="flex h-full">
        <Sidebar>
          <SidebarHeader />
          <div className="flex flex-col gap-2 p-4 overflow-y-auto">
            <SidebarItem
              icon={<DashboardCustomize />}
              title="Dashboard"
              href="/"
            />
            <SidebarItem
              disabled
              icon={<Phone />}
              title="Numbers"
              href="/numbers"
            />
            <SidebarItem
              disabled
              icon={<Users />}
              title="Users"
              href="/users"
            />
            <SidebarItem
              disabled
              icon={<Timeline />}
              title="Call Reporting"
              href="/call-reporting"
            />
            <SidebarItem
              disabled
              icon={<MonetizationOn />}
              title="Billing"
              href="/billing"
            />
            <SidebarItem
              disabled
              icon={<DataUsage />}
              title="Usage"
              href="/usage"
            />
            <SidebarItem
              disabled
              icon={<ShoppingCart />}
              title="Order Confirmation"
              href="/order-confirmation"
            />
            <SidebarItem
              icon={<RingVolume />}
              title="Auto Dialer"
              href="/auto-dialer/active"
            />
            <SidebarItem
              disabled
              icon={<Code />}
              title="Developers Tab"
              href="/developers-tab"
            />
            <SidebarItem
              disabled
              icon={<Settings />}
              title="Settings"
              href="/settings"
            />
          </div>
        </Sidebar>
        <div className="flex flex-col flex-1 main">
          <Navbar />
          <main className="flex-1 max-h-[calc(100%-96px)] flex gap-2">
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
            <div className="w-[320px] border-s-2 px-4 py-2">
              <Innortc />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
